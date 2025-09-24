const express = require("express");
const Crop = require("../models/Crop");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

// Farmer CRUD
router.post("/", auth, role(["farmer"]), async (req,res)=>{
  const crop = await Crop.create({ farmerId: req.user.id, ...req.body });
  res.json(crop);
});

router.get("/", auth, async (req,res)=>{
  const crops = await Crop.find().populate("farmerId","name");
  res.json(crops);
});

router.put("/:id", auth, role(["farmer"]), async (req,res)=>{
  const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(crop);
});

router.delete("/:id", auth, role(["farmer"]), async (req,res)=>{
  await Crop.findByIdAndDelete(req.params.id);
  res.json({ message:"Deleted" });
});

// Buy crop (Retailer)
router.post("/:id/buy", auth, role(["retailer"]), async (req,res)=>{
  const { quantity } = req.body;
  const crop = await Crop.findById(req.params.id);
  if(!crop || crop.quantity < quantity) return res.status(400).json({ error:"Not enough stock" });
  
  const amount = crop.price * quantity;
  crop.quantity -= quantity;
  await crop.save();

  await User.findByIdAndUpdate(crop.farmerId, { $inc: { moneyEarned: amount } });

  const tx = await Transaction.create({
    retailerId: req.user.id,
    farmerId: crop.farmerId,
    cropId: crop._id,
    quantity,
    amount,
    status:"success"
  });

  res.json({ message:"Payment successful", transaction: tx });
});

module.exports = router;