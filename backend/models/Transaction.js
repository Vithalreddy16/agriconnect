const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop" },
  quantity: Number,
  amount: Number,
  status: { type: String, default: "success" }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);