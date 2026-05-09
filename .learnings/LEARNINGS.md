# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice

---

## [LRN-20260509-001] best_practice

**Logged**: 2026-05-09T00:00:00Z
**Priority**: critical
**Status**: pending
**Area**: frontend

### Summary
JavaScript module-level DOM refs (`const x = document.getElementById(...)`) run BEFORE the functions that USE them are defined, causing silent failures when elements are missing from static HTML.

### Details
In `/workspace/index.html`, `const termBody = document.getElementById('termBody')` and `const termInput = document.getElementById('termInput')` are module-level. When the script executes, these are evaluated immediately — if the elements don't exist in the static HTML yet (e.g. `<section id="terminal">` is below `<script>`), they silently become `null`. Later, `termInput.focus()` in `initAll()` does nothing (no-op on null). This pattern is dangerous because it fails silently without any error thrown.

**Root cause of Featured Projects empty bug**: When `fetchGitHubData()` had an unhandled rejection path that wasn't caught by `.catch()`, the entire `.then()` chain was skipped. Adding `.catch()` with the same render calls fixed it — but the debugging was extremely time-consuming because JS errors in GitHub Pages served via GitHub's CDN can be harder to trace.

**Key insight**: Module-level DOM refs evaluated before element existence is checked. Pattern: always verify elements exist before use.

### Suggested Action
1. Move all `document.getElementById` calls inside the functions that need them, OR
2. Use `document.addEventListener('DOMContentLoaded', ...)` wrapper for all module-level refs
3. Always add `console.log` / `console.error` at entry points of async chains
4. For GitHub Pages debugging: check browser console (F12) since network/CDN errors don't show in terminal

### Metadata
- Source: conversation
- Related Files: /workspace/index.html
- Tags: javascript, dom, async, github-pages
- Pattern-Key: frontend.dom_safety
- Recurrence-Count: 4

---
