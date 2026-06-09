// Zero-dependency dev server for the pastel cylinder bookshelf.
// Serves the repo root on http://localhost:3000 and adds two small endpoints
// used only during LOCAL authoring:
//   GET  /api/books  -> returns data/books.json
//   POST /api/save   -> overwrites data/books.json with the posted JSON
// When deployed to static hosting these endpoints are simply absent and the
// app falls back to fetching /data/books.json read-only.

import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)));
const PORT = process.env.PORT || 3000;
const DATA_FILE = join(ROOT, "data", "books.json");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Cache-Control": "no-store", ...headers });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks).toString("utf8");
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = decodeURIComponent(url.pathname);

    // --- API: read books ---
    if (pathname === "/api/books" && req.method === "GET") {
      const data = await readFile(DATA_FILE, "utf8").catch(() => '{"books":[]}');
      return send(res, 200, data, { "Content-Type": MIME[".json"] });
    }

    // --- API: save books (local authoring only) ---
    if (pathname === "/api/save" && req.method === "POST") {
      const raw = await readBody(req);
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return send(res, 400, JSON.stringify({ error: "invalid JSON" }), {
          "Content-Type": MIME[".json"],
        });
      }
      await writeFile(DATA_FILE, JSON.stringify(parsed, null, 2) + "\n", "utf8");
      return send(res, 200, JSON.stringify({ ok: true }), {
        "Content-Type": MIME[".json"],
      });
    }

    // --- Static files ---
    let rel = pathname === "/" ? "/index.html" : pathname;
    const filePath = normalize(join(ROOT, rel));
    if (!filePath.startsWith(ROOT)) return send(res, 403, "Forbidden"); // path guard

    const file = await readFile(filePath).catch(() => null);
    if (file === null) return send(res, 404, "Not found");

    const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
    return send(res, 200, file, { "Content-Type": type });
  } catch (err) {
    send(res, 500, "Server error: " + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`Bookshelf dev server running at http://localhost:${PORT}`);
});
