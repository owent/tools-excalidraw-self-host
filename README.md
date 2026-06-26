# tools-excalidraw-self-host

Self-hosted Excalidraw static site automation for GitHub Pages.

This repo is an automation wrapper. It clones upstream Excalidraw during CI, patches local-only custom font menu entries into the app, builds the static client, publishes the Pages artifact, and force-updates `gh-pages` as the published snapshot branch.

## Contract

- Source branch: `main`
- Published snapshot branch: `gh-pages`
- Custom domain: `excalidraw.x-ha.com`
- Schedule: weekly build from latest upstream Excalidraw
- Validation: `node scripts/validate-config.mjs`

## Files

- `.github/workflows/deploy-gh-pages.yml` builds and publishes the site.
- `config/custom-fonts.json` is the source of truth for local-only font menu entries.
- `scripts/patch-excalidraw-fonts.mjs` patches a cloned Excalidraw checkout.
- `docs/deployment/github-pages.md` documents Pages setup and deployment boundaries.
- `docs/fonts/custom-fonts.md` documents the local-only font policy.
- `.agents/skills/excalidraw-pages-deploy/SKILL.md` preserves the reusable AI workflow.

## First Setup

1. Push this repository to GitHub with `main` as the default branch.
2. In repository settings, enable GitHub Pages with GitHub Actions as the source.
3. Add the custom domain `excalidraw.x-ha.com` in Pages settings.
4. Configure DNS so `excalidraw.x-ha.com` is a `CNAME` to the repository owner's GitHub Pages default domain.
5. Run the `Build and publish Excalidraw Pages` workflow manually once.

The workflow writes `CNAME` into the built output and updates `gh-pages`, but GitHub Pages custom domain ownership and DNS are external settings that must be configured outside the repository.
