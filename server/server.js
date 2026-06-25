import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/analyze", async (req, res) => {
  try {
    const { title, description, location } = req.body;

    const prompt = `
You are an AI assistant for a civic issue reporting app.

Analyze this issue:

Title: ${title}
Description: ${description}
Location: ${location}

Return ONLY valid JSON:

{
  "category": "",
  "severity": "",
  "department": "",
  "summary": "",
  "suggestedAction": ""
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({
      success: true,
      result: chatCompletion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});