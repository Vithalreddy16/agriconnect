const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req,res)=>{
  const { lat, lon } = req.query;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
  try {
    const { data } = await axios.get(url);
    res.json(data);
  } catch(err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

module.exports = router;