import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// The model powering the CAAWIYE_ENGINE, routed through OpenRouter.
// OpenRouter gives access to many providers (OpenAI, Anthropic, Meta, etc.)
// behind one API, so swapping models later is just changing this one string.
// Must be a vision-capable model since we're analyzing screenshots.
const ENGINE_MODEL = process.env.ENGINE_MODEL_OVERRIDE || "openai/gpt-4o-mini";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Body parser with 30MB limit for high-resolution chat screenshots
app.use(express.json({ limit: "30mb" }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "caawiye" });
});

const SYSTEM_PROMPT = `You are caawiye, an elite minimalist AI dating assistant. Your sole job is to analyze screenshots of a girlfriend's or date's text conversation, accurately extract what she said last, decode her underlying tone and subtext, and generate charismatic, genuine, and high-IQ replies to send back. Keep the replies natural, conversational, and tailored to modern messaging etiquette (avoid robotic or cringe pickup lines).

You must respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) matching exactly this shape:
{
  "lastMessage": string,       // the exact last text message she sent
  "sender": string,            // her name/label, e.g. "Her" or contact name
  "detectedTone": string,      // short phrase describing her tone
  "moodCategory": string,      // one of: flirty | testing | casual | curious | upset | sweet | neutral
  "subtext": string,           // 1-2 sentences on what she really means
  "suggestedReplies": [        // exactly 4 items
    {
      "tone": string,          // e.g. "Playful & Witty"
      "badge": string,         // short badge, e.g. "Witty", "Smooth", "Sweet", "Chill"
      "text": string,          // the exact reply text, ready to send
      "strategy": string       // one concise sentence on why it works
    }
  ],
  "keyAdvice": string          // one practical, immediate piece of advice
}

The 4 suggestedReplies must cover these distinct styles in order:
1. Playful & Witty (charming tease, humorous, flirty banter)
2. Smooth & Confident (direct, charismatic, proactive)
3. Sweet & Thoughtful (caring, emotionally reassuring, supportive)
4. Casual & Chill (relaxed, low-pressure, effortless)`;

// Primary AI Chat Screenshot Analysis Endpoint
app.post("/api/analyze-chat", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png", additionalContext = "" } = req.body;

    if (!imageBase64 && !additionalContext) {
      return res.status(400).json({
        error: "Please provide a screenshot or text of the conversation.",
      });
    }

    const apiKey = process.env.CAAWIYE_ENGINE_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Server is not configured with an AI engine key yet.",
      });
    }

    const promptText = `Analyze this conversation screenshot between a guy and his girlfriend/date.
${additionalContext ? `Additional background context: ${additionalContext}\n` : ""}
Follow your system instructions exactly and return only the JSON object described.`;

    // Build the user message content: text + image (if provided)
    const userContent: Array<Record<string, unknown>> = [{ type: "text", text: promptText }];

    if (imageBase64) {
      // Strip data URI prefix if present (e.g. data:image/png;base64,)
      const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "");
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${mimeType};base64,${cleanBase64}` },
      });
    }

    const openRouterResponse = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        // Optional but recommended by OpenRouter for attribution/rankings.
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "caawiye",
      },
      body: JSON.stringify({
        model: ENGINE_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      }),
    });

    if (!openRouterResponse.ok) {
      const errText = await openRouterResponse.text();
      console.error("OpenRouter error:", openRouterResponse.status, errText);
      return res.status(502).json({
        error: "The AI engine failed to respond. Please try again.",
      });
    }

    const completion = await openRouterResponse.json();
    const rawContent: string | undefined = completion?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("No response content received from AI engine.");
    }

    // Some models occasionally wrap JSON in code fences despite instructions; strip if present.
    const cleanedContent = rawContent.trim().replace(/^```json\s*|```$/g, "");
    const parsedData = JSON.parse(cleanedContent);

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      error: error.message || "Failed to analyze chat screenshot. Please try again.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`caawiye server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();