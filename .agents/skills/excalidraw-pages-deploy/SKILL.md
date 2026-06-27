---
name: excalidraw-pages-deploy
description: "Use when: maintaining this repo's self-hosted Excalidraw GitHub Pages deployment, weekly upstream build workflow, gh-pages snapshot branch, excalidraw.x-ha.com domain docs, or custom font patching. Do not use when: the task is a generic code edit unrelated to Excalidraw, Pages, deployment, or fonts."
license: Proprietary
compatibility: "Requires a modern Node.js runtime, git, GitHub Actions, network access for upstream Excalidraw, and current GitHub Pages permissions."
metadata:
  owner: project-ai-maintainers
  last-reviewed: "2026-06-27"
---

# Excalidraw Pages Deploy

## Outcome

Maintain a reproducible static Excalidraw build that publishes to GitHub Pages for `excalidraw.x-ha.com` and preserves `gh-pages` as the static snapshot branch.

## Workflow

1. Read `AGENTS.md`, `README.md`, `docs/deployment/github-pages.md`, `docs/fonts/custom-fonts.md`, and `docs/ai/source-index.md`.
2. Verify current upstream docs before changing Excalidraw build commands, GitHub Pages behavior, GitHub Actions versions, or local font-name assumptions.
3. Keep generated work under `build/<task-name>/`.
4. Update `config/custom-fonts.json` before editing font patch scripts.
5. When troubleshooting missing custom fonts, inspect the current upstream font picker and registry files before editing: `packages/excalidraw/components/FontPicker/FontPickerList.tsx` and `packages/excalidraw/fonts/Fonts.ts`.
6. Run `node scripts/validate-config.mjs` after changing workflow, docs, scripts, or font config.
7. If CI behavior changes, update `.github/workflows/deploy-gh-pages.yml`, deployment docs, and source index in the same change.

## Gotchas

- GitHub currently documents that `GITHUB_TOKEN` commits do not trigger branch-based Pages builds. Keep artifact deployment unless a verified alternative is added.
- If a Pages job fails before any step runs with `Branch "main" is not allowed to deploy to github-pages due to environment protection rules.`, troubleshoot the repository `github-pages` environment branch rules before changing Excalidraw build or font patching code.
- The workflow intentionally avoids hardcoded toolchain and action release version numbers. Use upstream Excalidraw compatibility metadata, Corepack, and official action default branch refs.
- Upstream Excalidraw source layout may change. Inspect the cloned files before changing regex patching logic.
- Current upstream font menu entries are rendered from `Fonts.registered`; adding constants and metadata alone does not make a font selectable.
- Do not download or redistribute font files. All custom fonts are local-only `local(...)` aliases.
- Do not invent unnamed artistic fonts. Require exact local font-family names.

## Resources

- Read [references/trigger-eval.md](references/trigger-eval.md) when editing this skill's trigger description.
