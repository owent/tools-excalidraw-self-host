# Agent Instructions

## Project State

- This repository maintains a self-hosted Excalidraw static site for GitHub Pages.
- The repository does not vendor Excalidraw source or font files. Build automation clones `https://github.com/excalidraw/excalidraw` at build time, patches the app with local-only custom font menu entries, builds the static client, and publishes the output.
- Primary branch: `main`.
- Published snapshot branch: `gh-pages`.
- Public site domain: `excalidraw.x-ha.com`.
- Do not infer behavior from the repository name. Verify the live repository files and current upstream documentation before changing build, deploy, font, or AI-agent configuration.

## Startup Workflow

1. Read the user request and inspect the current repository state before proposing or editing.
2. At startup, read only high-signal entry points that exist: `AGENTS.md`, `CLAUDE.md`, `.agents/skills/README.md`, `README.md`, `docs/README.md`, `docs/ai/source-index.md`, deployment docs, and roadmap indexes.
3. Use `rg` or `rg --files` for discovery. Do not bulk-load every doc, skill, or tool directory before the task points to it.
4. If a decision depends on external facts such as Excalidraw internals, GitHub Pages, GitHub Actions, Agent Skills, font packaging, security rules, or deployment APIs, verify current official documentation first. Record durable sources in `docs/ai/source-index.md`.
5. Separate verified facts from assumptions. If a source cannot be checked, mark the claim as unverified and choose the conservative option.

## Commands

- Validate repository configuration: `node scripts/validate-config.mjs`

- Patch a cloned Excalidraw checkout: `node scripts/patch-excalidraw-fonts.mjs --upstream build/excalidraw --manifest config/custom-fonts.json`
- CI deploy workflow: `.github/workflows/deploy-gh-pages.yml`

Run local task scratch, cloned upstream source, and build output under `build/<task-name>/`. Do not put generated Excalidraw checkouts or font binaries in the repo root.

## Deployment Contract

- The weekly workflow pulls the latest upstream Excalidraw `master`, builds a static site, publishes the same output through GitHub Pages, and force-updates `gh-pages` as the canonical snapshot branch.
- Build tooling should follow the latest compatible upstream defaults. Do not hardcode Node, Yarn, npm, pnpm, or GitHub Action release version numbers in the workflow. If GitHub Actions requires an `@ref`, use the official action's default branch ref and document the stability tradeoff.
- The workflow keeps the branch named `gh-pages` because that is the requested GitHub Pages publish branch name. It also uses GitHub's official Pages artifact deployment path so builds are reliable even though GitHub currently documents that `GITHUB_TOKEN` commits do not trigger branch-based Pages builds.
- The site writes `CNAME` with `excalidraw.x-ha.com` into the published static output. The repository Pages settings and DNS still need to be configured for that domain.
- Keep Excalidraw self-hosting limitations documented. Current upstream docs state that self-hosting the client does not support sharing or collaboration features.

## Fonts

- The source of truth for added font menu entries is `config/custom-fonts.json`.
- Custom fonts must be local-only aliases. Do not download, vendor, copy, or publish font binaries in CI or repository files.
- Do not add unnamed "popular artistic fonts" by guessing. Add only named local font-family aliases requested by the user.
- If local font names change, update `config/custom-fonts.json`, `docs/fonts/custom-fonts.md`, and `docs/ai/source-index.md` in the same change.

## AI Configuration

- `AGENTS.md` is the shared project rule file for tools that support the convention. Keep it concise and remove stale or duplicate rules before adding new ones.
- `CLAUDE.md` is a Claude Code compatibility layer. It should import `@AGENTS.md` and contain only Claude-specific additions.
- `.agents/skills/` is the shared Agent Skills directory. Keep the top-level `README.md` as the index. Add a skill only for a reusable, multi-step workflow that is too detailed for this file.
- Tool-specific directories such as `.claude/`, `.roo/`, `.windsurf/`, `.opencode/`, `.kilo/`, or local OpenClaw/Hermes config are not default outputs. Create them only after verifying current official docs and only when a thin compatibility layer is necessary.
- Use nested `AGENTS.md` files for directory-specific rules. Do not repeat parent rules in child files.

## Implementation And Validation

- Before changing the build process, inspect the current upstream Excalidraw files in the cloned checkout and update patch scripts to match verified source structure.
- New features need focused tests or validation scripts. Defect fixes need regression checks that fail without the fix.
- Run the smallest meaningful validation first, then broader checks when shared behavior, deploy workflow, or user-facing site output changed.
- Do not skip failing tests. If a check cannot run, record the command, failure reason, risk, and the remaining verification gap.
- Long-running commands need explicit timeouts. If a command times out, inspect captured output and change the next attempt instead of blindly rerunning it.

## Docs, Sources, And Roadmap

- Update docs in the same change when behavior, commands, deployment, AI configuration, or operational expectations change.
- Keep `docs/ai/source-index.md` current for Excalidraw, GitHub Pages, GitHub Actions, Agent Skills, font sources, deployment APIs, and other volatile external facts. Include `last_checked`, `next_review`, and `update_trigger`.
- Create roadmap or playbook files only when there is a real project plan or repeatable workflow to preserve. Do not create placeholder roadmaps that guess product scope.
- Prefer concise indexes over duplicated long-form instructions. Put details where they are loaded only when needed.

## Local Files And Secrets

- Put task scratch, logs, local downloads, and one-off generated output under `build/<task-name>/`.
- Put local development resources under `development/`. Put secrets only under `development/secret/` or ignored local env files.
- Never commit, print, log, or send secrets, tokens, cookies, or private keys to external services or models.
- GitHub Actions must use least privilege permissions. Any PAT fallback for branch-triggered Pages builds must be documented as optional and stored only as a GitHub Actions secret.

## Completion Checklist

- Confirm the work matches the latest user request and the current repository state.
- Confirm source-backed claims were checked and indexed when needed.
- Confirm tests or equivalent validation were run, or document why they could not run.
- Confirm AI rules, skills, docs, deploy files, roadmap, and source index were updated only where the change required it.
- Confirm temporary files were cleaned and no secrets were exposed.
