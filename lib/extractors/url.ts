// Web URL text extraction (browser only)
export async function extractTextFromURL(url: string): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("URL extraction is only supported in the browser.");
  }

  // Use a CORS proxy for cross-origin requests
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
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
