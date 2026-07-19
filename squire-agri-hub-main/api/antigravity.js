// Antigravity Agent API (Vercel Serverless Function)
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  // Handle CORS preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY environment variable not set. Please add it in Vercel Dashboard → Settings → Environment Variables.",
    });
  }

  const { prompt, history } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided in request body." });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`;

    const contents = [];
    
    // Support history if passed for a multi-turn chat
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }
    
    // Add current prompt
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    const body = {
      contents,
      systemInstruction: {
        parts: [{ text: "You are Antigravity, a powerful agentic AI coding assistant designed by the Google Deepmind team working on Advanced Agentic Coding. You specialize in software engineering, debugging, architecture, and developer workflows. Answer questions concisely and professionally." }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      }
    };

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({
        error: data.error?.message || JSON.stringify(data),
      });
    }

    // Extract text from response
    let text = "";
    const parts = data?.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.text) text += part.text;
    }

    // Fallback extraction
    if (!text && data?.candidates?.[0]?.content?.text) {
      text = data.candidates[0].content.text;
    }

    if (!text) {
      return res.status(500).json({
        error: "Empty response from Gemini",
        diagnostic: JSON.stringify(data).slice(0, 500),
      });
    }

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
