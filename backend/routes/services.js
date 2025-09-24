const express = require("express");
const Service = require("../models/Service");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const router = express.Router();

// Provider CRUD
router.post("/", auth, role(["service_provider"]), async (req,res)=>{
  const service = await Service.create({ providerId: req.user.id, ...req.body });
  res.json(service);
});

// Get all services (farmers will see them too!)
router.get("/", auth, async (req,res)=>{
  const services = await Service.find()
    .populate("providerId","name")
    .populate("bookings","name email");   // FIX: show farmer names
  res.json(services);
});

router.put("/:id", auth, role(["service_provider"]), async (req,res)=>{
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(service);
});

router.delete("/:id", auth, role(["service_provider"]), async (req,res)=>{
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message:"Deleted" });
});

// Farmer books service
router.post("/:id/book", auth, role(["farmer"]), async (req,res)=>{
  const service = await Service.findById(req.params.id);
  if(!service) return res.status(404).json({ error:"Not found" });
  if(service.bookings.includes(req.user.id)) {
    return res.status(400).json({ error:"Already booked!" });
  }
  service.bookings.push(req.user.id);
  await service.save();
  res.json(service);
});

module.exports = router;