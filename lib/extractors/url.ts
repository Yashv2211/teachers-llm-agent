// Web URL text extraction (browser only)
export async function extractTextFromURL(url: string): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("URL extraction is only supported in the browser.");
  }

  // Validate URL format before fetching
  try { new URL(url); } catch {
    throw new Error("That doesn't look like a valid URL. Check the address and try again.");
  }

  // Use a CORS proxy for cross-origin requests
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  let response: Response;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    response = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeout);
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Couldn't access that URL — request timed out. Try pasting the text content directly.");
    }
    throw new Error("Couldn't access that URL. Check your connection or try pasting the text content directly.");
  }

  if (!response.ok) {
    throw new Error(`Couldn't access that URL (${response.status}). Try pasting the text content directly.`);
  }

  const data = await response.json();
  const html = data.contents as string;

  // Parse and extract readable text
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Remove script and style elements
  doc.querySelectorAll("script, style, nav, footer, header, aside").forEach((el) => el.remove());

  // Get main content areas first, fallback to body
  const mainEl =
    doc.querySelector("main") ||
    doc.querySelector("article") ||
    doc.querySelector(".content") ||
    doc.body;

  const text = mainEl?.innerText ?? mainEl?.textContent ?? "";

  // Clean up excessive whitespace
  return text.replace(/\s{3,}/g, "\n\n").trim();
}
