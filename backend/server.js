require('dotenv').config();

// Debug: Check if API key is loaded
console.log("=== Environment Check ===");
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY first 10 chars:", process.env.GEMINI_API_KEY?.substring(0, 10));
console.log("========================");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const quizRoutes = require("./routes/quizRoutes");
// server.js - At the VERY TOP (before any other imports)


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/quiz", quizRoutes);

app.get("/", (req, res) => {
  res.send("LectureLoop API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
