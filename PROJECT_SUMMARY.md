# Project Memory

## Objective
- Complete all 13 tabs from dbtraders.com. Currently: Trade Academy tab (30-chapter Introduction to Deriv course, readable A4-style layout) and Copy Trader tab (id-11) replicated from pasted dbtraders.com HTML are DONE.

## Important Details
- Workspace: `C:\Users\user\OneDrive\Documents\Default Project\strategypro`; build via `cmd /c npm run build` (PowerShell blocks npm.ps1); dev server at `http://localhost:5173/`.
- Trade Academy data lives in `TradeAcademyData.js` (`CHAPTERS` array of 30 chapters, each with `id`, `category`, `title`, `sections[]`; `CHAPTER_CATEGORY_MAP` maps 10 categories to chapter ids).
- Content block types rendered: `text`, `callout` (info/warning/tip/success), `bulletList`, `table`, `comparison`, `definition`, `keyTakeaway`.
- Chapter expansion uses `expandedChapters` array state + `toggleChapter`, `expandAll`, `collapseAll`; toolbar buttons disable when all/none expanded.
- A4 reading layout: `.tac__a4-wrap` max-width `840px`, centered; fonts enlarged (body 1.6rem, section headings 1.8rem, bullets 1.55rem, tables/callouts/definitions 1.45–1.5rem, line-height 1.6–1.7).
- Reading environment: `.ta__sub-content` background `#f5f2eb` (warm cream) behind white content cards.
- Whole `.trade-academy` scrolls with page (`overflow-y: auto`); hero is NOT sticky — scrolls away. `.ta__sub-content` is `flex: 1 0 auto; padding: 0.5rem 0.5rem 0 0;`.
- Hero matches live HTML: `.ta__hero-content` → `.ta__hero-badge` ("📘 Complete Free Course"), `h1.ta__hero-title`, `h2.ta__hero-sub2` ("A Comprehensive Guide from Beginner to Advanced Trading"), `p.ta__hero-description`, `.ta__hero-cta-wrap` → "📖 Start Learning Now".
- Hero is dark cool navy: `linear-gradient(135deg, #1a2332 0%, #0f1a26 100%)`, border `#2a3440`, title `#f0f4f8`, subtitle `#94a3b8`, description `#a0aec0`; CTA hover adds `translateY(-1px)`.
- **Copy Trader tab (DONE, fully interactive)**: `src/pages/tabs/CopyTrader.jsx` exports default `CopyTrader`, re-exported as `CopyTraderTab` in `stubs.jsx`, wired in `AppPage.jsx` TABS (id `copy-trader`, order 10). Structure matches dbtraders.com id-11: `.ct-page` (dir="ltr", 560px max, centered) → `.ct-panel--demo` (`.ct-account-card`: WalletCards, id `ROT91857080`, balance `0.37 USD`; Tutorial [Video] button + "▶ Start Demo to Real Copytrading" toggle) → `.ct-messages` (auto-dismiss toasts: success/error/info) → `.ct-divider` "Client Copy Trading" → `.ct-controls` ("▶ Start Copy Trading" full-width red toggle, hint Users "N clients active") → `.ct-input-bar` (editable token input placeholder "Enter client API token...", Add [Plus, green] adds client with validation, Sync [RefreshCw] spins 1.2s then confirms, Guide [Video]) → `.ct-list-header` (Copy icon, live "Clients N") → `.ct-list` renders client rows (avatar, shortened token, Synced status dot, remove X) or `.ct-empty` (👥 "No clients added yet...").
- Interactive state: `token`, `clients[]`, `messages[]`, `syncing`, `trading`, `demoActive`; `pushMessage` auto-dismisses after 4s. Add requires ≥8 chars, no duplicates; Enter submits. Buttons toggle labels (Stop/Start) and post status to `.ct-messages`.
- CSS: `.ct-*` in `deriv.css` after `:has(.trade-academy)` rule; additions `.ct-message--success/error/info`, `ct-slide-in`/`ct-rotate` keyframes, `.ct-client` rows, `.ct-list` is now a flex column with `padding: 0.8rem`, `.ct-empty` has `flex: 1`. Uses `--du-*` vars for light/dark.
- lucide-react version has NO `Youtube` icon (use `Video`). Verified via node script.
- `.ct-*` styles in `deriv.css` after the `:has(.trade-academy)` rule; use `--du-*` vars for light/dark support.

## Work State
### Completed
- Created `src/pages/tabs/TradeAcademyData.js` — full 30-chapter course content with sections, tables, callouts, comparisons, definitions, key takeaways.
- `TradeAcademy.jsx` renders expandable chapter cards ("All Chapters" sub-tab) via `expandedChapters` array; Expand All / Collapse All toolbar with ChevronDown/ChevronRight.
- `.tac__*` CSS block types + toolbar + A4 wrap (840px centered), enlarged fonts, cream `#f5f2eb` sub-content.
- Hero updated to live structure + dark navy-slate restyle; non-sticky (whole `.trade-academy` scrolls).
- `CopyTrader.jsx` + `.ct-*` CSS + wiring in stubs/AppPage.
- Copy Trader made fully interactive (add/remove clients, sync, start/stop copy trading + demo toggles, toast messages, live client count).
- Build passes: 1835 modules transformed, 0 errors (only chunk-size warning ~1,202 kB).

### Active
- (none)

### Blocked
- (none)

## Next Move
- Confirm Copy Trader tab renders correctly at `http://localhost:5173/` (dbtraders.com's Copy Trader UI: card panel, divider, controls, input bar, empty clients list).
- Next tabs if continuing replication: Dashboard, Bot Builder, Free Bots, Speedbot, AI Software, Auto Trader, Analysis Tool, Manual Trader, Bulk Trader, Charts, Risk Calculator (Risk Calculator currently an iframe to `https://risk.binarytool.site/`).

## Relevant Files
- `C:\Users\user\OneDrive\Documents\Default Project\strategypro\src\pages\tabs\CopyTrader.jsx`: Copy Trader tab component (new).
- `C:\Users\user\OneDrive\Documents\Default Project\strategypro\src\pages\tabs\TradeAcademy.jsx`: Trade Academy component (hero, stats, sub-tabs, chapters with Expand All/Collapse All, resources).
- `C:\Users\user\OneDrive\Documents\Default Project\strategypro\src\pages\tabs\TradeAcademyData.js`: 30-chapter course data + `CHAPTER_CATEGORY_MAP`.
- `C:\Users\user\OneDrive\Documents\Default Project\strategypro\src\styles\deriv.css`: `.trade-academy`, `.ta__*`, `.tac__*`, `.ct-*`, `:has(.trade-academy)` rules; full-window tabs via `.dc-tab-content:has(...) { padding: 0 }`.
- `C:\Users\user\OneDrive\Documents\Default Project\strategypro\src\pages\tabs\stubs.jsx`: Re-exports tab components (`CopyTraderTab`, `TradeAcademyTab`); other tabs are stubs.
- `C:\Users\user\OneDrive\Documents\Default Project\strategypro\src\pages\AppPage.jsx`: 13-tab app; imports tabs from stubs.
- `C:\Users\user\OneDrive\Documents\Default Project\strategypro\src\pages\CopyTrading.jsx`: SEPARATE routed page at `/copy-trading` (leaderboard UI) — unrelated to the Copy Trader tab; keep as-is unless asked.
- `C:\Users\user\OneDrive\Documents\Default Project\strategypro\src\components\BotControlBar.jsx`: Run/Stop bar; `src\components\RiskDisclaimerModal.jsx`, `src\components\AppFooter.jsx`: global UI.
- Pasted dbtraders.com HTML (user message): authoritative reference for Copy Trader tab structure (`.ct-page`, `.ct-panel--demo`, `.ct-input-bar`, `.ct-list`, etc.).
