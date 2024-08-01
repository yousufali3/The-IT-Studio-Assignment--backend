const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  hobbies: String,
});

module.exports = mongoose.model("Data", dataSchema);
