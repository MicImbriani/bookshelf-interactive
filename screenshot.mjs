// Screenshot helper, per CLAUDE.md workflow:
//   node screenshot.mjs http://localhost:3000 [label]
// Saves to ./temporary_screenshots/screenshot-N[-label].png (auto-incremented).
//
// Note: CLAUDE.md references a Windows puppeteer install path. This script just
// requires `puppeteer` to be resolvable (npm i puppeteer). On headless Linux it
// uses the bundled Chromium; if puppeteer isn't installed it exits with a hint.

import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] ? `-${process.argv[3]}` : "";
const OUT_DIR = "temporary_screenshots";

let puppeteer;
try {
  puppeteer = (await import("puppeteer")).default;
} catch {
  console.error(
    "puppeteer is not installed. Run `npm i -D puppeteer` first.\n" +
      "(On this remote Linux container screenshots may be unavailable; " +
      "run the visual comparison locally.)"
  );
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

// Find the next free index so we never overwrite.
const existing = await readdir(OUT_DIR).catch(() => []);
let max = 0;
for (const f of existing) {
  const m = f.match(/^screenshot-(\d+)/);
  if (m) max = Math.max(max, Number(m[1]));
}
const n = max + 1;
const outPath = join(OUT_DIR, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1200)); // let fonts/covers settle
await page.screenshot({ path: outPath });
await browser.close();

console.log(`Saved ${outPath}`);
