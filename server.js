const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");  // ✅ Latest SDK import
const path = require("path");
require("dotenv").config(); // ✅ Load environment variables from .env

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // ✅ Frontend serve

// ✅ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure .env file has this
});

// ✅ Test route
app.get("/test-api", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
    });

    res.json({
      success: true,
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Test API Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Main chat route
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log("Received:", message);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices[0].message.content;
    console.log("Reply:", reply);

    res.json({ reply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ reply: "Something went wrong." });
  }
});

// ✅ Serve index.html as root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
