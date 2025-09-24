const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const cropRoutes = require("./routes/crops");
const serviceRoutes = require("./routes/services");
const transactionRoutes = require("./routes/transactions");
const weatherRoutes = require("./routes/weather");
const chatRoutes = require("./routes/chat");  // NEW

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/crops", cropRoutes);
app.use("/services", serviceRoutes);
app.use("/transactions", transactionRoutes);
app.use("/weather", weatherRoutes);
app.use("/chat", chatRoutes);   // NEW

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
  })
  .catch(err => console.error("MongoDB error:", err));