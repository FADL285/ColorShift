# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ColorShift is a client-side color conversion web app for designers and developers. It converts colors between CSS formats (HEX, RGB, HSL, OKLCH, LAB, LCH, HWB, named colors) and batch-processes CSS/SASS/PostCSS files. All processing happens in the browser—no backend.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run generate   # Static site generation (for deployment)
npm run preview    # Preview production build locally
npm run lint       # Run ESLint (via @nuxt/eslint)
npm run lint:fix   # Run ESLint with auto-fix
npm run format     # Check Prettier formatting
npm run format:fix # Auto-fix Prettier formatting
npm run test       # Run Vitest (via @nuxt/test-utils)
```

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3 Composition API)
- **UI**: Nuxt UI v4 (`@nuxt/ui`)
- **Color Library**: culori (for all color parsing and conversion)
- **Testing**: Vitest + `@nuxt/test-utils`
- **Linting**: ESLint 9 + Prettier (via `eslint-plugin-prettier`)
- **Git Hooks**: Husky + lint-staged
- **Deployment**: Static hosting (Vercel/Netlify/Cloudflare Pages)

## Git Hooks

- **pre-commit**: Runs lint-staged (ESLint + Prettier on staged files only)
- **pre-push**: Runs full lint and test suite

## Architecture (To Be Built)

The app requires three pages:

- `/` — Single color converter with live preview and copy-to-clipboard
- `/file-converter` — File upload with batch conversion and side-by-side diff preview
- `/about` — How it works, supported formats, privacy statement

### Planned Composables

- `useColorConverter` — Single color conversion using culori's `parse()` and `converter()`
- `useFileProcessor` — Regex-based CSS color detection and batch replacement

### Key Implementation Patterns

- Use culori for all color operations: `parse()` detects input format, `converter(targetFormat)` transforms
- File processing uses regex to find colors while preserving file structure/formatting
- Debounce live conversion (300ms) for performance
- Support files up to 5MB client-side

## Color Formats Supported

HEX (`#fff`, `#ffffff`, `#ffffff80`), RGB/RGBA, HSL/HSLA, HWB, LAB, LCH, OKLAB, OKLCH, named colors

## Reference Documentation

- Nuxt: https://nuxt.com/llms-full.txt
- Nuxt UI: https://ui.nuxt.com/llms-full.txt
- culori: https://culorijs.org/

## SEO Requirements

- App name: "ColorShift" in all metadata
- Title format: "ColorShift - [Page Description]"
- Use `useSeoMeta()` for per-page metadata
- Derive site URL from environment, not hardcoded
