const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const https = require("https");

const config = getDefaultConfig(__dirname);

// Groq returns 403 on all CORS preflights — direct browser-to-Groq is impossible.
// This middleware proxies /api/groq and /api/groq-audio through the Metro dev server
// so expo start works locally. In production, Vercel serverless functions (api/)
// handle the same routes server-side.
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      const apiKey =
        process.env.GROQ_API_KEY || process.env.EXPO_PUBLIC_GROQ_API_KEY || "";

      if (req.url === "/api/groq" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
          const postData = body;
          const proxyReq = https.request(
            {
              hostname: "api.groq.com",
              path: "/openai/v1/chat/completions",
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData),
              },
            },
            (proxyRes) => {
              res.writeHead(proxyRes.statusCode, { "Content-Type": "application/json" });
              proxyRes.pipe(res);
            }
          );
          proxyReq.on("error", () => {
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Proxy error" }));
          });
          proxyReq.write(postData);
          proxyReq.end();
        });
        return;
      }

      if (req.url === "/api/groq-audio" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
          const { audio, language } = JSON.parse(body);
          const boundary = "NuruBoundary" + Date.now();
          const crlf = "\r\n";
          const audioBuffer = Buffer.from(audio, "base64");

          const parts = [
            `--${boundary}${crlf}Content-Disposition: form-data; name="file"; filename="audio.webm"${crlf}Content-Type: audio/webm${crlf}${crlf}`,
            audioBuffer,
            `${crlf}--${boundary}${crlf}Content-Disposition: form-data; name="model"${crlf}${crlf}whisper-large-v3-turbo`,
            `${crlf}--${boundary}${crlf}Content-Disposition: form-data; name="response_format"${crlf}${crlf}text`,
          ];
          if (language && language !== "en") {
            parts.push(`${crlf}--${boundary}${crlf}Content-Disposition: form-data; name="language"${crlf}${crlf}${language}`);
          }
          parts.push(`${crlf}--${boundary}--`);

          const formData = Buffer.concat(
            parts.map((p) => (Buffer.isBuffer(p) ? p : Buffer.from(p)))
          );

          const proxyReq = https.request(
            {
              hostname: "api.groq.com",
              path: "/openai/v1/audio/transcriptions",
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": `multipart/form-data; boundary=${boundary}`,
                "Content-Length": formData.length,
              },
            },
            (proxyRes) => {
              let result = "";
              proxyRes.on("data", (c) => { result += c; });
              proxyRes.on("end", () => {
                res.writeHead(proxyRes.statusCode, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ text: result.trim() }));
              });
            }
          );
          proxyReq.on("error", () => {
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Proxy error" }));
          });
          proxyReq.write(formData);
          proxyReq.end();
        });
        return;
      }

      return middleware(req, res, next);
    };
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
