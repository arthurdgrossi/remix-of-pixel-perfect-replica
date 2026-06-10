---
name: run-helpia-base
description: Build, run, and screenshot the HelpIA "base" landing page (TanStack Start SSR app). Use when asked to run, start, launch, serve, smoke-test, or screenshot the base app / landing page, or to confirm a UI change renders in the real app.
---

# Run HelpIA `base` (TanStack Start landing page)

`base/` is a **TanStack Start SSR** app (React 19, Tailwind v4), a single-page
Portuguese marketing landing page ("IA Operacional"). One route: `/`. It is
served in dev by Vite on **port 8080** and driven headlessly with the system
Chrome via the committed driver.

**Paths below are relative to `base/`** (the app root). The driver lives at
`.claude/skills/run-helpia-base/smoke.mjs`.

This is a **Windows + bun** project (`bun.lock`, `bunfig.toml`). Commands shown
in PowerShell.

## Prerequisites

- **Node** (verified v22.15.0) and **bun** (verified 1.3.14). If `bun` is not on
  PATH, install it once via npm and add npm's global bin to PATH:
  ```powershell
  npm install -g bun
  $env:Path = "$env:APPDATA\npm;$env:Path"   # bun.exe lands here; not on PATH in a fresh shell
  bun --version
  ```
- **Google Chrome** (or Edge) for screenshots — the driver auto-detects
  `C:\Program Files\Google\Chrome\Application\chrome.exe` (and Edge as fallback).

## Setup (install dependencies)

```powershell
$env:Path = "$env:APPDATA\npm;$env:Path"
bun install
```

> Needs network. `bun install` pulls from the npm registry. If it fails with
> `error: ConnectionRefused downloading tarball ...`, the shell is
> network-sandboxed — re-run it in an unsandboxed shell. A partial/aborted
> install leaves a half-populated `node_modules` (e.g. `vite`, `react-dom`,
> `lucide-react`, `date-fns` missing); just re-run `bun install`, it is
> idempotent and completes the rest.

## Run (agent path) — the driver

1. Start the dev server (background) and confirm the port:
   ```powershell
   $env:Path = "$env:APPDATA\npm;$env:Path"
   bun dev          # prints: ➜ Local: http://localhost:8080/
   ```
2. In another shell, run the smoke driver. It asserts HTTP 200 + that the SSR
   HTML contains known landing-page copy, then writes a full-page screenshot
   next to the driver:
   ```powershell
   node .claude/skills/run-helpia-base/smoke.mjs
   ```
   Expected output:
   ```
   → GET http://localhost:8080/
   ✓ 200 OK, SSR rendered (found all 3 markers)
   → Screenshot via C:\Program Files\Google\Chrome\Application\chrome.exe
   ✓ Wrote ...\run-helpia-base\screenshot-landing.png
   ```
3. **Open `.claude/skills/run-helpia-base/screenshot-landing.png` and look at
   it.** It should show the dark navy landing page (Hero "IA que vira resultado
   …", Problem, Levels, Offers, Differentials, Governance, CTA, Footer). Blank
   or an error page = the render failed; check the dev-server log.

Pass a different URL if the port differs: `node .claude/skills/run-helpia-base/smoke.mjs http://localhost:3000`.

### Driving interactively (clicks / DOM / console)

The smoke driver only checks SSR + screenshots. For interaction (hover states,
scroll-reveal animations, console errors, clicking the anchor nav) use the
**chrome-devtools MCP** against the same running server — verified this session:
`new_page http://localhost:8080/` → `take_screenshot` → `list_console_messages`
(landing page produced **zero** console messages). The `playwright` MCP works
too.

## Run (human path)

`bun dev`, then open `http://localhost:8080/` in a browser. Ctrl-C to stop.
Identical output to the agent path, just no automated assertions.

## Build (not verified this session)

`bun build` produces a Cloudflare Workers bundle via Nitro (`vite build`). It
was **not** run while authoring this skill — only the dev server + driver were
verified. Treat the build path as unconfirmed until you run it.

## Gotchas

- **`bun` is not on PATH in a fresh shell** after `npm install -g bun` — it
  installs to `%APPDATA%\npm\bun.exe`. Prepend that dir (see Prerequisites) or
  every `bun ...` command will error `bun: command not found`.
- **`bun lint` reports thousands of `Delete ␍` (prettier/prettier) errors.**
  This is a CRLF line-ending artifact of a Windows checkout (the repo is not a
  git repo here, so no `.gitattributes`/autocrlf normalization), **not** real
  code problems. `bun format` (prettier --write) would rewrite every file's line
  endings — don't run it just to silence lint unless you intend that churn.
- **Port is hardcoded-ish to 8080** by `@lovable.dev/vite-tanstack-config`
  (it sets port/host/strictPort). With `strictPort`, if 8080 is taken the dev
  server fails instead of hopping ports — free 8080 or read the actual port
  from the `bun dev` banner and pass it to the driver.
- **Single route only.** Nav links (`#problema`, `#solucao`, …) are in-page
  anchors, not routes — don't expect `/problema` to resolve.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `bun: command not found` | `$env:Path = "$env:APPDATA\npm;$env:Path"` (or reinstall: `npm install -g bun`). |
| `bun install` → `ConnectionRefused downloading tarball` | Network-sandboxed shell. Re-run in an unsandboxed shell; install is resumable/idempotent. |
| Driver: `Expected HTTP 200, got ...` / `ECONNREFUSED` | Dev server isn't up yet, or it's on another port. Start `bun dev`, wait for the `Local:` line, pass that URL to the driver. |
| Driver: `No Chrome/Edge found` | Install Chrome, or edit the `candidates` list in `smoke.mjs`. |
| Screenshot is blank/half | Increase `--window-size` height in `smoke.mjs`, or the page errored — check `bun dev` output and the chrome-devtools MCP `list_console_messages`. |
