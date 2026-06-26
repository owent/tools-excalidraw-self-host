# GitHub Pages Deployment

## Current Contract

- Default branch: `main`
- Published snapshot branch: `gh-pages`
- Domain: `excalidraw.x-ha.com`
- Workflow: `.github/workflows/deploy-gh-pages.yml`
- Build input: latest upstream `excalidraw/excalidraw` at workflow runtime
- Static output: upstream `excalidraw-app/build`

## Why The Workflow Uses Pages Artifacts

The requested snapshot branch is `gh-pages`, so the workflow force-pushes the built static output to that branch.

GitHub's current Pages docs also state that commits pushed by a workflow using `GITHUB_TOKEN` do not trigger branch-based Pages builds. To keep deployment reliable without requiring a personal access token, the workflow deploys the same static output with GitHub's official Pages artifact actions.

If you later require branch-source Pages deployment only, use a tightly scoped PAT stored as a GitHub Actions secret and update this document, the workflow, and `docs/ai/source-index.md` after verifying current GitHub docs.

## GitHub Repository Settings

Configure these once in the GitHub UI:

1. Set `main` as the default branch.
2. In Pages settings, choose GitHub Actions as the source.
3. Add the custom domain `excalidraw.x-ha.com`.
4. Enable HTTPS after GitHub provisions the certificate.

For DNS, create a `CNAME` record for `excalidraw.x-ha.com` pointing to the repository owner's GitHub Pages default domain, excluding this repository name.

## CI Flow

1. Check out this automation repo.
2. Clone upstream Excalidraw into `build/excalidraw`.
3. Set up Node from the upstream Excalidraw `package.json` compatibility range.
4. Patch the cloned Excalidraw checkout with local-only font menu entries from `config/custom-fonts.json`.
5. Enable Corepack and install upstream dependencies with the package manager declared by upstream Excalidraw.
6. Build the self-host static client using the upstream Docker-oriented app build script.
7. Write `CNAME`, `.nojekyll`, and build metadata into the static output.
8. Force-push the static output to `gh-pages`.
9. Upload and deploy the static output through GitHub Pages artifact deployment.

## Toolchain Version Policy

The workflow should prefer latest compatible tooling and avoid hardcoded version numbers:

- Official GitHub actions use their default branch refs because GitHub requires an `@ref` in `uses:` syntax.
- Node is selected from the upstream Excalidraw `package.json` compatibility range.
- The package manager is selected through Corepack from upstream Excalidraw metadata.
- Custom fonts are registered as local system font-family aliases only; CI does not download or publish font files.

This intentionally favors freshness over maximum reproducibility. GitHub warns that default-branch action refs can break when an action owner publishes a breaking change, so investigate upstream action changes first if the workflow suddenly fails.

## Verification

- Repository configuration: `node scripts/validate-config.mjs`
- Workflow result: the Actions run should finish with a Pages deployment URL.
- Published branch: `gh-pages` should contain only the built static site snapshot.
- Domain: `Resolve-DnsName excalidraw.x-ha.com` should show the expected GitHub Pages target after DNS propagation.

## Known Boundary

Upstream Excalidraw currently documents that self-hosting the client does not support sharing or collaboration features. Keep that limitation visible unless upstream releases a verified self-host collaboration path.
