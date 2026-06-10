// Smoke driver for the HelpIA "base" landing page (TanStack Start SSR).
// Assumes the dev server is already running (default http://localhost:8080).
//
//   node .claude/skills/run-helpia-base/smoke.mjs
//   node .claude/skills/run-helpia-base/smoke.mjs http://localhost:3000
//
// What it does:
//   1. Fetches the URL and asserts HTTP 200 + that the SSR HTML contains
//      known landing-page copy (proves the route actually rendered, not a
//      blank shell or an error page).
//   2. Drives headless Chrome to capture a full-height screenshot next to
//      this script (screenshot-landing.png). Open it to eyeball the render.
//
// Runnable with `node` or `bun`. No npm deps — uses built-in fetch +
// child_process and the system Chrome.

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const URL = process.argv[2] ?? "http://localhost:8080/";
const here = dirname(fileURLToPath(import.meta.url));
const shot = join(here, "screenshot-landing.png");

// Strings that must appear in the server-rendered HTML.
const MUST_CONTAIN = [
  "IA Operacional",            // brand (Nav + Footer)
  "dentro da sua empresa.",    // hero headline tail
  "Três níveis de capacitação", // Levels section heading
];

function findChrome() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ];
  return candidates.find((p) => existsSync(p));
}

async function main() {
  // 1. Content check
  process.stdout.write(`→ GET ${URL}\n`);
  const res = await fetch(URL);
  if (res.status !== 200) {
    throw new Error(`Expected HTTP 200, got ${res.status}`);
  }
  const html = await res.text();
  const missing = MUST_CONTAIN.filter((s) => !html.includes(s));
  if (missing.length) {
    throw new Error(`SSR HTML missing expected copy: ${JSON.stringify(missing)}`);
  }
  process.stdout.write(`✓ 200 OK, SSR rendered (found all ${MUST_CONTAIN.length} markers)\n`);

  // 2. Screenshot
  const chrome = findChrome();
  if (!chrome) {
    process.stdout.write("! No Chrome/Edge found — skipping screenshot\n");
    return;
  }
  process.stdout.write(`→ Screenshot via ${chrome}\n`);
  const r = spawnSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      `--screenshot=${shot}`,
      "--window-size=1280,3200",
      URL,
    ],
    { stdio: "ignore" },
  );
  if (r.status !== 0 || !existsSync(shot)) {
    throw new Error(`Screenshot failed (chrome exit ${r.status})`);
  }
  process.stdout.write(`✓ Wrote ${shot}\n`);
}

main().catch((e) => {
  process.stderr.write(`✗ ${e.message}\n`);
  process.exit(1);
});
