# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A personal knowledge base / digital garden built on [Quartz v4](https://quartz.jzhao.xyz/) — a static site generator that converts Obsidian-flavored Markdown into a website. Deployed to GitHub Pages at `syshin0116.github.io`.

## Common Commands

```bash
# Local development (build + serve with hot reload)
npx quartz build --serve

# Build only (outputs to ./public)
npx quartz build

# Type check + format check
npm run check

# Auto-format
npm run format

# Run tests (path utilities + dependency graph)
npm test

# Serve docs
npm run docs
```

## Deployment

Pushes to `main` auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`). The workflow runs `npx quartz build` and uploads `./public` to GitHub Pages. Docker is also available: `docker build` → `CMD ["npx", "quartz", "build", "--serve"]`.

## Architecture

### Key Config Files
- **`quartz.config.ts`** — Plugin pipeline (transformers → filters → emitters), site metadata, theme colors, analytics (Google Tag `G-XZB0EYZF1G`)
- **`quartz.layout.ts`** — Page layouts: `sharedPageComponents`, `defaultContentPageLayout`, `defaultListPageLayout`, `homePageLayout` (home page uses paginated `RecentNotes`)

### Plugin Pipeline (`quartz/plugins/`)
Three-stage processing:
1. **Transformers** (`transformers/`) — Convert/enrich Markdown (frontmatter, syntax highlighting, Obsidian links, GFM, LaTeX via KaTeX, ToC, link crawling)
2. **Filters** (`filters/`) — Remove draft posts (`RemoveDrafts`)
3. **Emitters** (`emitters/`) — Generate output files (content pages, folder/tag pages, sitemap, RSS, assets)

### Components (`quartz/components/`)
Preact TSX components. Custom modifications exist in:
- `RecentNotes.tsx` — Extended with `showPagination` and `itemsPerPage` options for paginated recent posts on home page
- Styles in `quartz/styles/custom.scss` — shadcn/ui-style CSS variables (OKLCH colors) layered on top of Quartz base; Tailwind CSS is integrated

### Content (`content/`)
Markdown notes organized into top-level folders: `AI/`, `Dev/`, `Study/`, `Projects/`, `Tools/`, `Events/`, `Others/`. Written in Obsidian-flavored Markdown with YAML frontmatter. Files with `draft: true` in frontmatter are excluded from builds.

### Utility Scripts
- `scripts/convert-shadcn-to-quartz.ts` — Converts shadcn/ui React components to Quartz Preact components
- `check_frontmatter.py`, `convert_frontmatter.py` — Python utilities for frontmatter validation/migration
- `inject_llm_summaries.py`, `inject_summaries.py` — Inject AI-generated summaries into note frontmatter

## Content Frontmatter

Notes use YAML frontmatter. Key fields:
```yaml
---
title: Note Title
draft: false      # set to true to exclude from build
tags: [tag1, tag2]
date: YYYY-MM-DD
summary: "..."    # used for SEO and RecentNotes previews
---
```

## Customization Notes

- Social image generation (`generateSocialImages`) is disabled due to Korean font issues; uses a static `quartz/static/og-image.png` instead
- Giscus comments config lives in `quartz/static/giscus/`
- `ignorePatterns` excludes `private/`, `templates/`, `.obsidian/` from builds
- Link resolution uses `shortest` path strategy (Obsidian default)
