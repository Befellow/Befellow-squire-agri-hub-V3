import express from "express";
import path from "path";



const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/gemini", async (req, res) => {
  console.log("[API] Received request to /api/gemini");
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    console.error("[API] GEMINI_API_KEY environment variable not set!");
    return res.status(500).json({
      error: "GEMINI_API_KEY environment variable not set. Please configure it in AI Studio settings.",
    });
  }

  const { prompt } = req.body;
  if (!prompt) {
    console.error("[API] No prompt provided in request body.");
    return res.status(400).json({ error: "No prompt provided in request body." });
  }

  try {
    console.log("[API] Sending fetch request to Gemini API...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`;

    const optimizedPrompt =
      prompt +
      "\n\nIMPORTANT: Return ONLY a valid, clean raw JSON object string. Do not wrap it in markdown code blocks like ```json ... ```. Start directly with { and end with }.";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("[API] Gemini API request timed out (15s), aborting...");
      controller.abort();
    }, 15000);

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: optimizedPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    console.log("[API] Gemini API response status:", geminiRes.status);
    const data = await geminiRes.json() as any;
    console.log("[API] Parsed Gemini response JSON");

    if (!geminiRes.ok) {
      console.error("[API] Gemini API returned error:", data.error || data);
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

    // Strip markdown code fences if model added them
    text = text.trim();
    if (text.startsWith("```json")) text = text.slice(7);
    else if (text.startsWith("```")) text = text.slice(3);
    if (text.endsWith("```")) text = text.slice(0, -3);
    text = text.trim();

    if (!text) {
      return res.status(500).json({
        error: "Empty response from Gemini",
        diagnostic: JSON.stringify(data).slice(0, 500),
      });
    }

    return res.status(200).json({ text });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Export app instance for Vercel Serverless compatibility
export default app;

async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();
