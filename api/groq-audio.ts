import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";
import fs from "fs";
import os from "os";
import path from "path";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") { res.status(405).end(); return; }
  const { audio, language } = req.body as { audio: string; language?: string };
  if (!audio) { res.status(400).json({ error: "Missing audio" }); return; }

  const tmpPath = path.join(os.tmpdir(), `nuru-audio-${Date.now()}.webm`);
  try {
    fs.writeFileSync(tmpPath, Buffer.from(audio, "base64"));
    const transcript = (await groq.audio.transcriptions.create({
      file: fs.createReadStream(tmpPath) as unknown as File,
      model: "whisper-large-v3-turbo",
      response_format: "text",
      ...(language && language !== "en" ? { language } : {}),
    })) as unknown as string;
    res.json({ text: transcript.trim() });
  } catch (err: any) {
    res.status(err?.status ?? 500).json({ error: err?.message ?? "Whisper error" });
  } finally {
    try { fs.unlinkSync(tmpPath); } catch { /* gone */ }
  }
}
