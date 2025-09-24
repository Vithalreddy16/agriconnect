const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  quantity: Number,
  price: Number
});

module.exports = mongoose.model("Crop", cropSchema);