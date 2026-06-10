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

---

# Session Work Log — 2026-06-09 (GitHub sync)

Synced `base/` with `https://github.com/arthurdgrossi/remix-of-pixel-perfect-replica.git`.

### Git status before syncing
- **Not a git repository** — no `.git` here or in the parent `HelpIA_MVP/`. So there was no branch, no remote, and *all* local files were effectively "uncommitted" (untracked). `gh` CLI not installed; used plain git over HTTPS. Git identity already set (Arthur Grossi / arthurgrossi1990@gmail.com).

### Remote configured
- `origin` → `https://github.com/arthurdgrossi/remix-of-pixel-perfect-replica.git` (same Lovable project; remote top-level tree matched local source exactly, minus the local-only `CLAUDE.md` + `.claude/`).

### Branch
- `main` (created locally with `git init -b main`; remote had a single branch `main`).

### Commands executed
```
git init -b main
git remote add origin https://github.com/arthurdgrossi/remix-of-pixel-perfect-replica.git
git ls-remote --heads origin            # connectivity OK: main @ b8a0152
git fetch origin                        # [new branch] main
git reset --mixed origin/main           # adopt history WITHOUT touching working tree
git diff --ignore-all-space src/routeTree.gen.ts   # inspected the one tracked diff
git add CLAUDE.md .claude src/routeTree.gen.ts
git restore --staged .claude/settings.json .claude/settings.local.json  # keep local-only
git commit -m "Add CLAUDE.md notes + run-helpia-base skill; regen routeTree SSR types"
git push -u origin main                 # b8a0152..6fe7713
git fetch origin && git rev-parse main origin/main   # aligned, 0/0
```
Used a **mixed reset** (not checkout/clone) specifically so no local file was overwritten while adopting the fetched history.

### Files changed / pushed (commit `6fe7713`, 5 files, +359)
- `CLAUDE.md` *(new on remote)* — review notes + work logs.
- `.claude/skills/run-helpia-base/{SKILL.md, smoke.mjs, screenshot-landing.png}` *(new)* — the run skill.
- `src/routeTree.gen.ts` *(modified)* — see conflict note below.
- **Intentionally NOT pushed:** `.claude/settings.json` and `.claude/settings.local.json` (Claude Code harness config / local permission grants — kept local, unstaged).

### Conflicts found and how resolved
- **No merge conflicts.** The only divergence in a tracked file was `src/routeTree.gen.ts`: the local copy had an extra auto-generated `declare module '@tanstack/react-start' { interface Register … }` SSR block, appended by the TanStack Router plugin when `bun dev` ran. This is generated output, not a manual edit, and is a strictly newer/more-complete generation — so it was kept and committed rather than reverted. `bun.lock` was unchanged (no dependency drift).

### Validation run
- `bun install` → **in sync, no changes** (602 packages).
- `bun run build` → **success**: client + SSR built into `dist/` (`✓ built in ~7s`). ⚠️ The build logged *"No Lovable context detected — skipping nitro deploy plugin"*, so this is a plain Vite client+SSR build, **not** the full Cloudflare Workers bundle. For that, run in Lovable context or pass `nitro: true`.
- `bun lint` → **fails**, but only the CRLF `Delete ␍` errors (line-ending artifact, see below) — no real code defects.
- Tests → none configured.

### Final state
- `main` = `origin/main` = `6fe7713` — **0 ahead / 0 behind, aligned.** Working tree clean except the two intentionally-local `.claude/settings*.json`.

### Blockers / manual steps still required
- **CRLF line endings**: repo blobs are LF; Windows checkout uses CRLF, so git warns "LF will be replaced by CRLF" and `bun lint` is fully red. Add a `.gitattributes` (`* text=auto eol=lf`) and re-normalize to fix lint permanently — *not done here to avoid a whole-tree churn commit; recommended next.*
- **Ignore local Claude config**: add `.claude/settings.local.json` (and optionally `.claude/settings.json`) to `.gitignore` so local harness config isn't accidentally committed later.
- **`bun` PATH**: still requires `$env:Path = "$env:APPDATA\npm;$env:Path"` in fresh shells.
- **Cloudflare build** path remains unverified (only the non-Nitro build was validated).

---

# Session Work Log — 2026-06-09 (UI/Design improvements)

Implemented priorities 1–7 from the UI/Design Review Notes above; #8 (contact form) intentionally deferred with a documented plan. Visual identity preserved (dark/navy, Sora+Manrope, section structure, token system) — polished, not rebuilt.

### Files inspected
`src/routes/index.tsx`, `src/routes/__root.tsx`, `src/styles.css`, `src/components/reveal.tsx`, `src/components/ui/sheet.tsx`, `src/components/ui/button.tsx`, `components.json`, `src/assets/` (confirmed no `public/` dir existed).

### Files changed / created
- **`src/routes/__root.tsx`** — `lang="en"`→`pt-BR`; removed all Lovable boilerplate meta; real "IA Operacional" title/description/author/OG/Twitter (`summary_large_image`) + `og:image`/`theme-color`; favicon + apple-touch-icon links; Google Fonts `preconnect` + stylesheet (replaces dead `@font-face`); `<html suppressHydrationWarning>` + inline no-flash theme script.
- **`src/styles.css`** — added `--highlight` token (light + dark) and `--color-highlight` theme mapping; removed the two rotted hardcoded `@font-face` blocks; added a `prefers-reduced-motion` CSS safety net (neutralizes CSS/tw-animate/Radix animations).
- **`src/components/reveal.tsx`** — `Reveal`/`Stagger` now use Motion's `useReducedMotion`; render final visible state (no entrance) when reduced.
- **`src/routes/index.tsx`** — wrapped page in `<MotionConfig reducedMotion="user">`; gated the Hero pulsing dot and Governance gradient loop on `useReducedMotion`; replaced magic `oklch(0.78 0.13 240)` usages with `text-highlight`/`bg-highlight` and a `color-mix(var(--highlight))` gradient stop; Hero stats grid `grid-cols-3`→`grid-cols-1 sm:grid-cols-3`; added a shared `focusRing` constant + `NAV_LINKS`; added accessible **mobile nav** (shadcn `Sheet`, all links + CTA, closes on link click, focus-trapped/restored); added focus-visible rings to all hand-rolled `<a>` buttons; added `ThemeToggle` to the nav.
- **`src/components/theme-toggle.tsx`** *(new)* — sun/moon toggle; flips `dark` class + persists to localStorage; SSR-safe icon.
- **`public/favicon.svg`** *(new)* — brand sparkle on navy gradient. **`public/og-image.jpg`** *(new)* — copied from `src/assets/hero.jpg` (1920×1080).
- Route metadata in `index.tsx` title aligned to the "IA Operacional —" brand.

### Improvements implemented (by priority)
1. ✅ Language/SEO/branding — pt-BR, Lovable boilerplate gone, real brand metadata, favicon + OG image. Naming drift resolved toward the user-facing **"IA Operacional"** (HelpIA kept only as repo/codename).
2. ✅ Reduced motion — `MotionConfig reducedMotion="user"` (disables transform/hover/entrance motion) + manual gates on the two infinite loops + CSS net. **Verified active** in the headless test (Motion logged the reduced-motion notice).
3. ✅ Mobile nav — accessible `Sheet` menu; verified open, all links, close-on-click with focus returned to trigger.
4. ✅ Tokens — `--highlight` promoted; `text-[oklch(...)]` magic values replaced. (Two unique decorative background gradients left as-is by design.)
5. ✅ Responsive polish — hero stats stack on phones; mobile CTA moves into the menu (`sm:` inline otherwise).
6. ✅ Focus-visible — shared `focusRing` (uses `--ring`) on nav, hero, offers, CTA anchors + toggle + menu trigger; verified ring on the sheet Close button.
7. ✅ Light theme + toggle — stopped forcing dark; no-flash script + `suppressHydrationWarning`; defaults dark, persists choice. **Light mode verified to render coherently** (full-page screenshot).
8. ⏸ Deferred — see below.

### Commands executed
```
cp src/assets/hero.jpg public/og-image.jpg
bunx tsc --noEmit          # EXIT 0 — no type errors
bun run build              # EXIT 0 — client + SSR built (bundle grew ~67KB from Radix Sheet)
bun dev                    # served http://localhost:8080
bun lint                   # CRLF-only errors + 7 pre-existing react-refresh warnings (no new genuine issues)
```
Drove the running app with the chrome-devtools MCP: dark render, mobile resize (375px) + open/close menu, light-theme toggle. Screenshots saved in `.claude/skills/run-helpia-base/` (`after-dark.png`, `after-mobile-menu.png`, `after-light.png`).

### Validation results
- **TypeScript**: clean (`tsc --noEmit` exit 0).
- **Build**: success (exit 0).
- **Runtime console**: no errors. Found and **fixed** a pre-existing **404** — the hardcoded Sora `gstatic` woff2 URL was dead (headings were silently falling back to system-ui); now both fonts load 200 via the Google Fonts API. Remaining console output is benign (Vite debug, React DevTools info, and the reduced-motion notice that only appears because the test device requests reduced motion).
- **Accessibility**: mobile menu keyboard/focus-trap works, closes on selection, focus restored to trigger; visible focus rings confirmed.
- **Lint**: unchanged failure mode (CRLF line endings) — not introduced here; see blockers.

### Errors / blockers
- **`bun lint` red** = CRLF artifact only (no `.gitattributes`); my edits added more CRLF lines but zero new real lint problems. Fix = add `.gitattributes` (`* text=auto eol=lf`) + renormalize.
- **Light theme is now reachable but only spot-verified** at desktop width on the landing route — worth a designer pass across breakpoints before promoting it heavily.

### Intentionally deferred
- **#8 Contact/lead form.** Kept the working `mailto:` CTA. A real form needs a delivery path that isn't configured (no email/backend). Clean implementation: a `createServerFn` POST handler + an email provider (Resend/SES) **or** a no-backend bridge that builds a prefilled `mailto:` from validated fields. Libraries are already installed (`react-hook-form`, `zod`, `@hookform/resolvers`, shadcn `form`/`input`/`textarea` + `sonner` for toasts). Deserves its own focused pass with success/error states.

### Recommended next steps
1. Add `.gitattributes` (`* text=auto eol=lf`) and renormalize to clear the CRLF lint wall.
2. Designer QA of light theme across all breakpoints; consider persisting theme via cookie (so SSR can render the right theme and drop `suppressHydrationWarning`).
3. Build the lead-capture form (#8) with a server function.
4. Optionally self-host Sora/Manrope in `public/` to drop the runtime Google Fonts dependency entirely.
