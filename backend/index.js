require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const session = require("express-session");
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default;

const app = express();
const redisClient = new Redis("redis://host.docker.internal:6379");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    },
  })
);
function getContext(req) {
  return req.session.context || [];
}

function saveContext(req, context) {
  req.session.context = context;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const safe = {
  HARM_CATEGORY_HARASSMENT: "BLOCK_NONE",
  HARM_CATEGORY_HATE_SPEECH: "BLOCK_NONE",
  HARM_CATEGORY_SEXUALLY_EXPLICIT: "BLOCK_NONE",
  HARM_CATEGORY_DANGEROUS_CONTENT: "BLOCK_NONE",
  HARM_CATEGORY_CIVIC_INTEGRITY: "BLOCK_NONE",
  HARM_CATEGORY_UNSPECIFIED: "BLOCK_NONE",
};
const model = genAI.getGenerativeModel({
  model: "tunedModels/dataset-vvqz5lfatlbc",
  safe,
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  try {
    let context = getContext(req);
    context.push({ sender: "user", text: message });

    const result = await model.generateContent(message);
    const geminiOutput = result.response.text();

    context.push({ sender: "bot", text: geminiOutput });
    saveContext(req, context);

    res.json({ response: geminiOutput });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ response: "Something went wrong. Please try again later." });
  }
});

app.get("/api/history", (req, res) => {
  const context = getContext(req);
  res.send(context);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
