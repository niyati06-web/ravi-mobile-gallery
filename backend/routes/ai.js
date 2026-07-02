const express = require("express");
const router  = express.Router();
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── POST /api/ai/price — AI price suggestion ──────────────────────────────
router.post("/price", async (req, res) => {
  const { name, condition } = req.body;
  if (!name) return res.status(400).json({ message: "Phone name required." });

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are a phone resale price expert in India.
Give a fair resale price range for: "${name}" in "${condition || "Good"}" condition.
Respond ONLY in this exact JSON format, no extra text:
{"min": 5000, "max": 8000, "price": 7000, "note": "short reason in one line"}`,
        },
      ],
    });

    const text = msg.content[0].text.trim();
    const json = JSON.parse(text);
    res.json(json);
  } catch (err) {
    res.status(500).json({ message: "AI price fetch failed.", error: err.message });
  }
});

// ─── POST /api/ai/suggest — AI phone suggester by requirement ──────────────
router.post("/suggest", async (req, res) => {
  const { requirement, phones } = req.body;
  if (!requirement) return res.status(400).json({ suggestions: [] });

  try {
    const phoneList = (phones || [])
      .map((p) => `- ${p.name} | ₹${p.price} | ${p.condition} | ${p.stars}★ | ${p.ram} RAM | ${p.storage}`)
      .join("\n");

    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a phone recommendation assistant for a 2nd hand mobile shop in India.

Customer requirement: "${requirement}"

Available phones:
${phoneList}

Pick the top 3 best matching phones from the list above.
Respond ONLY in this exact JSON format, no extra text:
{"suggestions": [{"name": "Samsung A32", "price": 7500, "reason": "Best camera in budget"}, ...]}`,
        },
      ],
    });

    const text = msg.content[0].text.trim();
    const json = JSON.parse(text);
    res.json(json);
  } catch (err) {
    res.status(500).json({ suggestions: [] });
  }
});

module.exports = router;