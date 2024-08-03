const express = require("express");
const router = express.Router();
const Data = require("../models/data");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");

const validateData = [
  check("name").notEmpty().withMessage("Name is required"),
  check("phoneNumber").isMobilePhone().withMessage("Invalid phone number"),
  check("email").isEmail().withMessage("Invalid email"),
  check("hobbies").notEmpty().withMessage("Hobbies are required"),
];

// Create
router.post("/add", async (req, res) => {
  const { name, phoneNumber, email, hobbies } = req.body;

  try {
    if (!name || !phoneNumber || !email || !hobbies) {
      return res.status(404).json({ message: "All Fields are required" });
    }
    const newData = new Data({ name, phoneNumber, email, hobbies });

    await newData.save();

    res.status(201).json(newData);
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Read
router.get("/all", async (req, res) => {
  try {
    const data = await Data.find();

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update
const validateUpdateData = [
  check("name").optional().notEmpty().withMessage("Name cannot be empty"),
  check("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  check("email").optional().isEmail().withMessage("Invalid email"),
  check("hobbies").optional().notEmpty().withMessage("Hobbies cannot be empty"),
];

router.put("/update/:id", validateUpdateData, async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedData = await Data.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json(updatedData);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedData = await Data.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST route for adding multiple data entries
router.post("/add-multiple", async (req, res) => {
  const dataArray = req.body;

  try {
    if (!Array.isArray(dataArray)) {
      return res
        .status(400)
        .json({ message: "Invalid input, expected an array of data" });
    }

    const insertedData = await Data.insertMany(dataArray);

    res.status(201).json(insertedData);
  } catch (error) {
    console.error("Error adding multiple data entries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Send email
router.post("/send", async (req, res) => {
  const { ids } = req.body;
  const dataToSend = await Data.find({ _id: { $in: ids } });
  console.log(dataToSend);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "y78123685@gmail.com",
      pass: "rebw ksoc vigz mbnt",
    },
  });

  const formatData = (data) => {
    return data
      .map((item, index) => {
        return `Record ${index + 1}:\nName: ${item.name}\nPhone Number: ${
          item.phoneNumber
        }\nEmail: ${item.email}\nHobbies: ${item.hobbies}\n`;
      })
      .join("\n");
  };

  const formattedData = formatData(dataToSend);

  let mailOptions = {
    from: "y78123685@gmail.com",
    to: "yousufali839203@gmail.com",
    subject: "Selected Data ",
    text: formattedData,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Email sent", info });
  });
});

module.exports = router;
