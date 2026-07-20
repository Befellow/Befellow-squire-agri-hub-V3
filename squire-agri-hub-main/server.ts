import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/gemini", async (req, res) => {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY environment variable not set. Please configure it in AI Studio settings.",
    });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided in request body." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Call the Antigravity Agent via Interactions API
    const interaction = await ai.interactions.create({
      agent: "antigravity-preview-05-2026",
      input: prompt,
      environment: "remote",
    }, { timeout: 300000 });

    // Extract all output text parts from the model_output steps (agent may respond in multiple steps)
    let text = "";
    if (interaction.steps) {
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          const textContent: any = step.content?.find((c: any) => c.type === "text");
          if (textContent && textContent.text) {
            text += textContent.text;
          }
        }
      }
    }

    // Fallback if no steps had text
    if (!text) {
      text = interaction.output_text || "";
    }

    // Strip markdown code fences if model added them
    text = text.trim();
    if (text.startsWith("```json")) text = text.slice(7);
    else if (text.startsWith("```")) text = text.slice(3);
    if (text.endsWith("```")) text = text.slice(0, -3);
    text = text.trim();

    if (!text) {
      return res.status(500).json({
        error: "Empty response from Antigravity Agent",
        diagnostic: JSON.stringify(interaction).slice(0, 500),
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
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
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
