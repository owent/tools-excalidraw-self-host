# GitHub Pages Deployment

## Current Contract

- Default branch: `main`
- Published snapshot branch: `gh-pages`
- Domain: `excalidraw.x-ha.com`
- Workflow: `.github/workflows/deploy-gh-pages.yml`
- Build input: latest upstream `excalidraw/excalidraw` at workflow runtime
- Static output: upstream `excalidraw-app/build`

## Why The Workflow Uses an SSH Deploy Key for the gh-pages Branch

The requested snapshot branch is `gh-pages`, and the live site is published from that branch.

GitHub's current Pages docs state that commits pushed by a workflow using `GITHUB_TOKEN` do not trigger branch-based Pages builds. To make the `gh-pages` push actually start a Pages build, the workflow uses an SSH deploy key stored as the `DEPLOY_PAGE_KEY` secret.

If you later want to switch back to artifact-based Pages deployment, remove the SSH push, re-add `actions/upload-pages-artifact` and `actions/deploy-pages`, and update this document, the workflow, and `docs/ai/source-index.md` after verifying current GitHub docs.

## GitHub Repository Settings

Configure these once in the GitHub UI:

1. Set `main` as the default branch.
2. In Pages settings, choose **Deploy from a branch**, select **`gh-pages`** and **`/(root)`**. This branch is force-pushed by the workflow and must trigger a Pages build.
3. Add the custom domain `excalidraw.x-ha.com`.
4. Enable HTTPS after GitHub provisions the certificate.

For DNS, create a `CNAME` record for `excalidraw.x-ha.com` pointing to the repository owner's GitHub Pages default domain, excluding this repository name.

## SSH Deploy Key

1. Generate an SSH key pair locally (do not add a passphrase, or use `ssh-keygen -P ""`):
   ```bash
   ssh-keygen -t ed25519 -C "tools-excalidraw-self-host-deploy" -f deploy_key
   ```
2. In the repository settings, go to **Settings → Deploy keys → Add deploy key**.
   - Paste the contents of `deploy_key.pub`.
   - Check **Allow write access**.
   - Save.
3. Add the contents of the private key file `deploy_key` as a GitHub Actions secret named `DEPLOY_PAGE_KEY`.

The workflow uses this deploy key instead of `GITHUB_TOKEN` for the `gh-pages` push so that GitHub Pages actually starts a build.

## CI Flow

1. Check out this automation repo.
2. Clone upstream Excalidraw into `build/excalidraw`.
3. Set up Node from the upstream Excalidraw `package.json` compatibility range.
4. Patch the cloned Excalidraw checkout with local-only font menu entries from `config/custom-fonts.json`.
5. Enable Corepack and install upstream dependencies with the package manager declared by upstream Excalidraw.
6. Build the self-host static client using the upstream Docker-oriented app build script.
7. Write `CNAME`, `.nojekyll`, and build metadata into the static output.
8. Force-push the static output to `gh-pages` over SSH using the `DEPLOY_PAGE_KEY` deploy key, which triggers a branch-based Pages build.

The build job intentionally does not target the `github-pages` environment, because branch-based Pages builds are triggered by the PAT push rather than by an environment-gated deployment job.

## Toolchain Version Policy

The workflow should prefer latest compatible tooling and avoid hardcoded version numbers:

- Official GitHub actions use their default branch refs because GitHub requires an `@ref` in `uses:` syntax.
- Node is selected from the upstream Excalidraw `package.json` compatibility range.
- The package manager is selected through Corepack from upstream Excalidraw metadata.
- Custom fonts are registered as local system font-family aliases only; CI does not download or publish font files.

This intentionally favors freshness over maximum reproducibility. GitHub warns that default-branch action refs can break when an action owner publishes a breaking change, so investigate upstream action changes first if the workflow suddenly fails.

## Verification

- Repository configuration: `node scripts/validate-config.mjs`
- Workflow result: the Actions run should finish with the `Publish gh-pages branch` step green.
- Published branch: `gh-pages` should contain only the built static site snapshot.
- Pages build: after the PAT push, GitHub should start a `pages-build-deployment` workflow run and the Pages build should succeed.
- Domain: `Resolve-DnsName excalidraw.x-ha.com` should show the expected GitHub Pages target after DNS propagation.

## Troubleshooting

### Pages build is not triggered after a green workflow run

If the workflow pushes `gh-pages` successfully but GitHub Pages does not build:

1. Confirm `DEPLOY_PAGE_KEY` is the **private** half of an SSH deploy key and that the **public** half is added in **Settings → Deploy keys** with **Allow write access** enabled.
2. Confirm Pages settings are set to **Deploy from a branch** → **`gh-pages`** → **`/(root)`**.
3. Check the workflow log for SSH errors (host key, permission denied, etc.). The remote URL should be `git@github.com:owent/tools-excalidraw-self-host.git`.
4. Check **Settings → Environments** for a stale `github-pages` environment left over from artifact-based deployments; removing it can help if it conflicts with branch-based builds.
5. Force-push a fresh commit to `gh-pages` (re-run the workflow) after confirming the settings above.

### Site files missing or 404 after a successful Pages build

Make sure `.nojekyll` is present in the deployed output. The workflow writes it into `gh-pages` so GitHub Pages does not run Jekyll and drop files it considers special.

## Known Boundary

Upstream Excalidraw currently documents that self-hosting the client does not support sharing or collaboration features. Keep that limitation visible unless upstream releases a verified self-host collaboration path.
