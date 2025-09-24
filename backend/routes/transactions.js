const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", auth, async (req,res)=>{
  let query = {};
  if(req.user.role === "farmer") query.farmerId = req.user.id;
  if(req.user.role === "retailer") query.retailerId = req.user.id;
  const txs = await Transaction.find(query).populate("cropId","name");
  res.json(txs);
});

module.exports = router;