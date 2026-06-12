# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

This is a zero-build static site. No install step, no bundler.

```bash
npm run dev    # Serve locally at http://localhost:3000 (python3 http.server)
```

Or open `index.html` with any static file server. There is no build, lint, or test command.

## Project Structure

- **index.html** — The entire site: a single-page personal/freelance site for Omar Wali
- **styles.css** — All styling (custom CSS, no frameworks; 8px spacing grid; CSS custom properties in `:root`)
- **main.js** — Page behavior: fixed-nav scroll state, mobile hamburger menu, IntersectionObserver scroll reveals
- **background.js** — WebGL background: instanced drifting planes built on OGL (ES module imported from the jsdelivr CDN — `ogl@1.0.5/+esm`; the package ships no UMD build)
- **Omar_Wali_Resume.pdf** — Linked from the Contact section
- **vercel.json** — Static deployment config (clean URLs, security headers)

## Architecture

Plain HTML/CSS/JS — deliberately no framework, no build step, no npm dependencies.

- **Design tokens** live as CSS custom properties at the top of `styles.css`: background `#0D0D0F`, ink `#F0EEE9`, accent `#4A9EFF`. Spacing follows an 8px base grid.
- **Fonts**: Inter (body/UI) and Playfair Display (display headings) via Google Fonts `<link>`.
- **WebGL background** (`background.js`): OGL 1.0.5 from jsdelivr CDN renders instanced low-poly planes to a fixed `#gl` canvas behind content. Scroll eases the camera forward (parallax). The loop pauses when the tab is hidden (Page Visibility API); instance count halves on mobile. If WebGL or the CDN fails, the static gradient on `body::before` is the fallback — the page must never depend on the canvas.
- **Motion rules**: all scroll reveals use IntersectionObserver + the `[data-reveal]` / `.is-visible` CSS pattern; hero uses pure-CSS staggered word reveal. `prefers-reduced-motion: reduce` disables every animation (CSS media query + checks in both JS files). Preserve this when adding any animation.
- **Sections**: hero, about, projects, services, contact — anchored by id, linked from the fixed nav. `scroll-margin-top` compensates for the fixed header.

## Conventions

- Keep everything on the 8px spacing grid (`padding: 16px 32px`, not `15px 30px`).
- No jQuery, Bootstrap, UI libraries, or CSS frameworks. No Three.js — OGL only for WebGL.
- Semantic HTML5 (`nav`, `main`, `section`, `footer`); maintain aria attributes on interactive elements (hamburger `aria-expanded`, etc.).
- Vanilla JS in IIFEs with `"use strict"`. `main.js` is a classic script; `background.js` is a module only because OGL is ESM-only — keep new code dependency-free.

## Deployment

- **Platform**: Vercel — pushes to GitHub auto-deploy
- The Vercel project's Root Directory must be the repo root (it previously pointed at the deleted `my-vue-app/`)
- No build command; Vercel serves the static files directly
