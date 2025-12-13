const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// This function is now on the server
async function rewriteIdentityIfNeeded(originalResponse) {
  const prompt = `
  You are a post-processor for AI responses. If the following text is look like first person narrative, mention of being created, trained, developed, or built by Google (or any company), , built by Google, improved by Google's teams as first person replace the relevant part with:
  "I am Elisiya AI, trained by Sarthak.Feel free to ask anything else." or add like made, built, developed by sarthak and the full message look like this is ceated or build or trained by sarthak and make this info very short and small and if other message then
  return the text unchanged.
  1. FORMATTING: Use Markdown.
  2. MATH: ALWAYS use LaTeX for math equations.
   - Block math: $$ ... $$
   - Inline math: $ ... $
   - Example: $$ \int_{0}^{\infty} x^2 dx $$
   - NEVER use Unicode math or HTML tags like <sup> for equations if possible.
  3. CODE: Use code blocks with language tags.
  Text to check:
  "${originalResponse}"
  `;

  const apiKey = process.env.GEMINI_API_KEY;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
	  // 🟢 MOST FREE REQUESTS (BEST FOR FREE TIER)
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-001:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey},
	  // 🟢 HIGH FREE REQUESTS (BEST BALANCE)
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey},
	  // 🟡 MEDIUM FREE REQUESTS (LIMITED)
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-09-2025:generateContent?key=${apiKey},
	  // 🟠 LOW FREE REQUESTS (SPECIALIZED)
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey},
	  // 🔴 VERY LOW / ALMOST UNUSABLE ON FREE
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-tts:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/deep-research-pro-preview-12-2025:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-robotics-er-1.5-preview:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-computer-use-preview-10-2025:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key=${apiKey},
      payload,
      { headers: { "Content-Type": "application/json" } },
    );
    return (
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      originalResponse
    );
  } catch (error) {
    console.error(
      "Post-processing API error:",
      error.response?.data || error.message,
    );
    return originalResponse;
  }
}

app.post("/gemini", async (req, res) => {
  try {
    const payload = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
	  // 🟢 MOST FREE REQUESTS (BEST FOR FREE TIER)
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-001:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey},
	  // 🟢 HIGH FREE REQUESTS (BEST BALANCE)
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey},
	  // 🟡 MEDIUM FREE REQUESTS (LIMITED)
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-09-2025:generateContent?key=${apiKey},
	  // 🟠 LOW FREE REQUESTS (SPECIALIZED)
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey},
	  // 🔴 VERY LOW / ALMOST UNUSABLE ON FREE
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-tts:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/deep-research-pro-preview-12-2025:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-robotics-er-1.5-preview:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-computer-use-preview-10-2025:generateContent?key=${apiKey},
	  // https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key=${apiKey},
      payload,
      { headers: { "Content-Type": "application/json" } },
    );

    let aiResponse = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Check if post-processing is needed and run the function
    const lowerResp = aiResponse.toLowerCase();
    if (
      lowerResp.includes("google") ||
      lowerResp.includes("built by google") ||
      lowerResp.includes("by the dedicated teams at Google")
    ) {
      aiResponse = await rewriteIdentityIfNeeded(aiResponse);
    }

    // Create a new response object with the final text
    const finalResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: aiResponse }],
          },
        },
      ],
    };

    res.json(finalResponse);
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
