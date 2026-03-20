# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`jolo-oat` is a fork of `@knadh/oat` — an ultra-lightweight (~8KB combined), zero-dependency UI component library using semantic HTML, plain CSS, and native Web APIs (WebComponents, Popover API). No framework, no build-time abstractions.

## Commands

Requires **esbuild** installed globally.

```bash
make dist      # Full build: CSS + JS + size report
make css       # Build CSS only (concat → minify → gzip)
make js        # Build JS only (esbuild IIFE → minify → gzip)
make clean     # Remove dist/
make size      # Show bundle sizes
make publish   # Build + auto-version from git tags + npm publish
```

Output goes to `dist/`: `oat.min.css`, `oat.min.js`, `oat.css`, `oat.js`.

## Architecture

### CSS

- Single concatenated stylesheet built from `src/css/` files in Makefile order
- Layer order: `@layer theme, base, components, animations, utilities`
- All design tokens live in `src/css/01-theme.css` as CSS custom properties (colors, spacing `--space-1..18`, type scale `--text-1..8`, radii, shadows, z-index, transitions)
- Light/dark mode via CSS `light-dark()` function — no JS theming
- Component state managed via data attributes (`[data-variant]`, `[data-sidebar-open]`) and ARIA attributes, never via JS class manipulation
- Most components style semantic HTML tags directly (no class required on `<button>`, `<dialog>`, `<table>`)

### JavaScript

- All JS components extend `OtBase` (`src/js/base.js`) — a `HTMLElement` base class providing:
  - `init()` / `cleanup()` lifecycle hooks (called once after DOM ready / on disconnect)
  - `handleEvent(event)` dispatcher → routes to `on{EventType}()` methods
  - `keyNav()` for roving keyboard navigation
  - `emit(name, detail)` for custom events (bubbling, composed, cancelable)
  - `$()` / `$$()` scoped query helpers
  - `uid()` for generating IDs
- WebComponents register themselves via `customElements.define()` as side effects
- `src/js/index.js` is the entry point — imports all modules and attaches `window.ot.toast` API
- Sidebar is a plain document-level click handler (not a WebComponent)

### WebComponents

| Tag | File | Notes |
|-----|------|-------|
| `ot-tabs` | tabs.js | Manages ARIA (aria-selected, aria-controls, aria-labelledby), keyboard nav, emits `ot-tab-change` |
| `ot-dropdown` | dropdown.js | Uses Popover API, dynamic viewport-aware positioning, keyboard nav |
| `ot-tooltip` | tooltip.js | — |

Toast is a global imperative API: `ot.toast(message, title, opts)` where `opts` includes `variant`, `placement`, `duration`.

### Adding a New Component

1. **CSS**: Add `src/css/<component>.css`, insert into the Makefile `CSS_FILES` list in the correct position (after dependencies)
2. **JS** (if interactive): Create `src/js/<component>.js` extending `OtBase`, call `customElements.define('ot-<name>', ClassName)` at the bottom, import in `src/js/index.js`
3. Follow existing patterns: state via data/ARIA attributes, events via `this.emit()`, keyboard nav via `this.keyNav()`
