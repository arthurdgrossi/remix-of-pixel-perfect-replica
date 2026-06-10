# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # start dev server
bun build        # production build (Cloudflare Workers via Nitro)
bun lint         # ESLint
bun format       # Prettier (write)
```

No test suite is configured yet.

## Architecture

This is a **TanStack Start** SSR app (React 19) bundled by Vite via `@lovable.dev/vite-tanstack-config` and deployed to **Cloudflare Workers** through Nitro.

### Routing

File-based routing lives in `src/routes/`. The conventions are documented in `src/routes/README.md`. Key points:
- `src/routes/__root.tsx` — app shell; wraps every page. Provides `QueryClientProvider`.
- `src/routeTree.gen.ts` — **auto-generated**, never edit manually.
- Dynamic params use bare `$` (e.g. `users/$id.tsx`), not curly braces.

### Server functions

Use `createServerFn` from `@tanstack/react-start` for server-side logic — not Edge Functions. Handler bodies are tree-shaken from the client bundle; module-level code in a `*.functions.ts` file still ships to the client. Put server-only helpers in files ending with `.server.ts`. See `src/lib/api/example.functions.ts` and `src/lib/config.server.ts` for the pattern.

### Environment variables

- `VITE_FOO` — public, readable on client and server via `import.meta.env.VITE_FOO`. Never put secrets here.
- `process.env.FOO` inside a `.server.ts` function or `createServerFn` handler — server-only. On Cloudflare Workers env binds at request time, so always read `process.env` inside a function, never at module scope.

### Vite config

`vite.config.ts` uses `@lovable.dev/vite-tanstack-config` which already includes: TanStack Start, React, Tailwind CSS v4, TypeScript paths, Nitro (Cloudflare target), and several dev plugins. Do **not** add these manually — duplicates break the build.

### Styling

Tailwind CSS v4 with a custom OKLCH-based dark theme (the `<html>` tag is hardcoded `className="dark"`). Fonts: **Sora** (`font-display`, headings) and **Manrope** (`font-sans`, body). Design tokens (`--background`, `--accent`, `--surface`, etc.) are defined in `src/styles.css`. Use `--shadow-card` and `--shadow-elegant` for consistent shadow levels.

### Animation utilities

`src/components/reveal.tsx` exports three Motion-based primitives used throughout the landing page:
- `<Reveal>` — single element, fades in on scroll.
- `<Stagger>` + `<Item>` — parent/child pair for staggered entrance animations.

All three skip initial animation during SSR (guarded by `useMounted`).

### UI components

`src/components/ui/` contains shadcn/ui components. Add new ones with the shadcn CLI rather than writing from scratch.

### SSR error handling

`src/server.ts` wraps TanStack Start's server entry to catch catastrophic SSR failures that h3 would otherwise swallow as opaque 500 JSON responses, and replaces them with a rendered HTML error page.

---

# UI / Design Review Notes

> Working notes from a full read of the UI code (`src/routes/index.tsx`, `src/styles.css`,
> `src/components/reveal.tsx`, `src/routes/__root.tsx`). The product is a **single-page
> Portuguese (pt-BR) marketing landing page** for an applied-AI corporate-training service,
> branded "IA Operacional". One route (`/`), all content inline in `index.tsx`.

## What the UI is today

- **One page, seven sections**: `Nav → Hero → Problem → Levels → Offers → Differentials → Governance → CTA → Footer`, all defined as local components in `src/routes/index.tsx`.
- **Design language**: dark, navy-based, "trust/corporate" feel. Sora (display/headings) + Manrope (body). Heavy use of Motion scroll-reveal (`<Reveal>`/`<Stagger>`/`<Item>`), spring hovers, blur-in entrances, an animated gradient in Governance.
- **Token system** is solid: OKLCH palette ("Navy Trust"), `--gradient-accent`, `--gradient-hero`, `--shadow-card`, `--shadow-elegant`, radius scale. This is the strongest part of the design foundation.

## High-impact opportunities (ranked)

1. **A complete light theme exists but is unreachable.** `:root` in `styles.css` defines a full light palette, but `__root.tsx` hardcodes `<html className="dark">` and `.dark` overrides everything. There is **no theme toggle**. The infrastructure for light/dark is ~90% done — wiring a toggle (and not forcing `dark`) is low-effort, high-payoff.
2. **Brand/metadata is still Lovable boilerplate.** `__root.tsx` head defaults: title "Lovable App", description "Lovable Generated Project", author "Lovable", `twitter:site @Lovable`. Only the `/` route overrides title+description (good Portuguese SEO copy there), but the OG/twitter/author defaults leak. No favicon, no real OG image. Also note brand naming drift: repo/product is "HelpIA", site brand is "IA Operacional".
3. **`<html lang="en">` but all content is Portuguese.** Accessibility + SEO bug. Should be `lang="pt-BR"`.
4. **No mobile navigation.** `<Nav>` links are `hidden md:flex` — below `md`, users get the logo + one CTA button and **no section links**. Needs a hamburger/sheet menu (the shadcn `sheet`/`drawer` components are already installed).
5. **No `prefers-reduced-motion` handling.** Every section animates (blur+translate reveals, infinite pulsing dot in Hero, 22s looping gradient in Governance, spring hovers). None respect reduced-motion. Accessibility concern and easy win — gate the `reveal.tsx` variants and the looping animations on the media query.

## Consistency / polish issues

- **Magic colors bypass the token system.** Several spots hardcode OKLCH literals in JSX instead of using tokens — e.g. `text-[oklch(0.78_0.13_240)]` (Hero "resultado" highlight, Governance checkmarks), inline `linear-gradient(...)` in the Hero overlay and Governance background. This light-blue highlight (`oklch(0.78 0.13 240)`) is effectively an undeclared brand color; it should become a token (e.g. `--accent-bright` / `--highlight`) for reuse and theming.
- **Hero stat grid is `grid-cols-3` at all breakpoints** — three columns stay cramped on small phones. Consider `grid-cols-1 sm:grid-cols-3` or similar.
- **Contact is a bare `mailto:` only.** `react-hook-form` + `zod` + `@hookform/resolvers` + the shadcn `form`/`input`/`textarea` are all installed but unused. A real lead-capture form (the CTA's actual goal) is the obvious missing conversion surface.
- **47 shadcn/ui components are installed but none are used** on the landing page (everything is hand-rolled Tailwind). Not wrong, but worth knowing: reach for `src/components/ui/*` before writing new primitives, to keep a11y/focus states consistent.
- **Fonts load a single hardcoded `woff2` each from `fonts.gstatic.com`** with no `preconnect`/`preload`. Adds a render-dependency on Google's CDN and risks FOUT/CLS. Consider self-hosting in `ASSETS/` or at least `<link rel="preconnect">`.

## Accessibility checklist for future work

- Set `lang="pt-BR"`, add `prefers-reduced-motion`, add a mobile nav, and verify focus-visible states on the hand-rolled `<a>` "buttons" (they have hover styles but no explicit focus ring — the `--ring` token exists, use it).
- Verify contrast of `text-muted-foreground` and `text-accent` on the dark surfaces (accent text on dark cards is the most at-risk).
- Hero background image uses `alt=""` (correct — decorative). Keep that pattern for decorative imagery.

## If asked to "improve the design"

Cheapest wins, in order: (1) fix `lang` + metadata/branding, (2) add reduced-motion guards, (3) add the mobile menu, (4) promote the recurring light-blue literal to a token, (5) wire the light theme + a toggle, (6) build the real contact form. Larger play: the palette/animation foundation is strong enough to push the visual design further (more distinctive type scale, section rhythm, a real OG/social image) rather than rebuild it.

---

# Session Work Log — 2026-06-09 (run-skill-generator + bun install)

### What was inspected
- Project state on resume: `node_modules` existed but was **partial** (200 entries; `vite`, `react-dom`, `lucide-react`, `date-fns` missing) from an earlier aborted install. No `.claude/skills/`, no `.claude/run.md`, no build output.
- Read the full UI: `src/routes/index.tsx`, `src/styles.css`, `src/components/reveal.tsx`, `src/routes/__root.tsx`, `components.json`, `package.json`, `vite.config.ts`, `bunfig.toml`.
- Toolchain: Node v22.15.0 present; `bun` **not** installed/on PATH initially; Chrome + Edge present; no `chromium-cli`; not a git repo.

### What was changed / created
- Installed **bun** globally (`npm install -g bun` → v1.3.14).
- Completed **`bun install`** — all deps now present (verified `vite`, `react`, `react-dom`, `lucide-react`, `date-fns`, `@tanstack/react-start`, `node_modules/.bin/vite`).
- Created the **run skill** at `.claude/skills/run-helpia-base/`:
  - `SKILL.md` — agent-facing run/build/screenshot guide (every command in it was executed this session).
  - `smoke.mjs` — committed driver: asserts dev server HTTP 200 + SSR copy markers, then captures a full-page screenshot via system Chrome (runs under `node` or `bun`, no npm deps).
  - `screenshot-landing.png` — proof render of the running app.
- Appended this log + the **UI / Design Review Notes** section above to `CLAUDE.md`.

### Commands run (all succeeded unless noted)
```
npm install -g bun                       # bun 1.3.14
$env:Path = "$env:APPDATA\npm;$env:Path" # bun.exe not on PATH otherwise
bun install                              # 183 packages installed (completed the partial install)
bun lint                                 # FAILS: 5567 prettier "Delete ␍" errors (CRLF — see below)
bun dev                                  # Vite ready on http://localhost:8080/
node .claude/skills/run-helpia-base/smoke.mjs   # ✓ 200 OK, SSR rendered, screenshot written
```
Also drove the running app with the **chrome-devtools MCP** (`new_page` → `take_screenshot` → `list_console_messages`): full landing page rendered, **zero console messages**.

### Validated inside this environment
- `bun install` completes; dev server boots; route `/` renders all sections server-side; headless-Chrome screenshot + content assertions pass; no runtime console errors.

### Blockers / required manual steps
- **Network sandbox**: the first `bun install` failed with `error: ConnectionRefused downloading tarball ...` under the sandboxed shell (and the unsandboxed retry was declined). The later run succeeded with network available. If it fails again, run `bun install` in an **unsandboxed shell with network access** — it is idempotent and resumes a partial install.
- **`bun lint` is red** purely from **CRLF** line endings (`Delete ␍`), an artifact of a Windows checkout with no git/`.gitattributes` normalization — not code defects. Running `bun format` (prettier --write) would fix lint but rewrite every file's line endings (large churn); only do so deliberately.
- **`bun` PATH**: after `npm install -g bun`, `bun.exe` lives in `%APPDATA%\npm` and is **not** on PATH in fresh shells; prepend it (as above) or `bun` commands error `command not found`.

### Not done / unverified
- **`bun build`** (Cloudflare Workers/Nitro bundle) was **not** run — only the dev path is verified.
- No automated test suite exists in the repo (nothing to run).

### Recommended next steps
- Add `.gitattributes` with `* text=auto eol=lf` (and re-normalize) to kill the CRLF lint noise permanently.
- Verify `bun build` once, then add the confirmed build/preview commands to `run-helpia-base/SKILL.md`.
- Consider initializing git here (the parent `HelpIA_MVP` may already be the repo root) so lint/format and skill discovery behave consistently.
