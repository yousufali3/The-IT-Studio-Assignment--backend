const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dataRoutes = require("./routes/data");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yousufali06296:vaNABZnG6UCESex6@cluster0.ndijsdg.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB database connected");
  } catch (err) {
    console.error("MongoDB database connection failed", err);
  }
};

connectDB();

app.use("/api/data", dataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
