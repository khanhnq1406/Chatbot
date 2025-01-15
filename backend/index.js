require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const csvParser = require("csv-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const result = await model.generateContent(message);
    const geminiOutput = result.response.text();

    res.json({ response: geminiOutput });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ response: "Something went wrong. Please try again later." });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
