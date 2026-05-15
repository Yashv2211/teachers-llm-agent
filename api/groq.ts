import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  try {
    const { messages, model, max_tokens, temperature } = req.body as {
      messages: { role: "user" | "assistant" | "system"; content: string }[];
      model: string;
      max_tokens: number;
      temperature: number;
    };

    const completion = await groq.chat.completions.create({
      model,
      messages,
      max_tokens,
      temperature,
    });

    res.json(completion);
  } catch (err: any) {
    console.error("[Nuru/groq] error:", err?.message);
    res.status(err?.status ?? 500).json({ error: err?.message ?? "Groq error" });
  }
}
