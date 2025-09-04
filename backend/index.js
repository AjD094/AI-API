import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running.");
});

// Main API route
app.post("/api/query", async (req, res) => {
  const { model, prompt } = req.body;

  if (!model || !prompt) {
    return res.status(400).json({ error: "Model and prompt are required" });
  }

  try {
    let output = "";

    // Handle OpenAI GPT-5 models
    if (model.startsWith("gpt-5")) {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model, // "gpt-5-pro" or "gpt-5-thinking"
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await r.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      output = data.choices?.[0]?.message?.content ?? "(no response)";
    }

    // Handle Gemini models
    else if (model.startsWith("gemini")) {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await r.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      output =
        data.candidates?.[0]?.content?.parts?.[0]?.text ?? "(no response)";
    }

    // Invalid model
    else {
      return res.status(400).json({ error: "Unknown model selected" });
    }

    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
