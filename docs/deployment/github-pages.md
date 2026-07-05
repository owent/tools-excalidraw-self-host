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

The artifact upload step sets `include-hidden-files: true` so that `.nojekyll` is included; without it, GitHub Pages runs Jekyll over the static output and may drop files it treats as special.

If you later require branch-source Pages deployment only, use a tightly scoped PAT stored as a GitHub Actions secret and update this document, the workflow, and `docs/ai/source-index.md` after verifying current GitHub docs.

## GitHub Repository Settings

Configure these once in the GitHub UI:

1. Set `main` as the default branch.
2. In Pages settings, choose **GitHub Actions** as the source. This is required for `actions/deploy-pages` to work; if the source is left on `gh-pages` (or any branch), the deploy job creates a Pages deployment but no runner picks it up, and the status check eventually times out.
3. In Environments, open `github-pages` and make sure deployment branches and tags allow `main`, or allow protected branches with `main` protected. If this rule excludes `main`, GitHub rejects the Pages deployment before any workflow step runs with `Branch "main" is not allowed to deploy to github-pages due to environment protection rules.`
4. Add the custom domain `excalidraw.x-ha.com`.
5. Enable HTTPS after GitHub provisions the certificate.

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
9. Upload the static output as a Pages artifact, including hidden files so `.nojekyll` is preserved.
10. In a separate environment-gated job, verify that Pages is configured for GitHub Actions, then deploy the artifact through GitHub Pages.

The build and `gh-pages` snapshot job intentionally does not target the `github-pages` environment. GitHub evaluates environment protection rules before running job steps, so keeping the environment on the final deploy job makes branch-rule failures clear without hiding build, patch, or snapshot problems.

## Toolchain Version Policy

The workflow should prefer latest compatible tooling and avoid hardcoded version numbers:

- Official GitHub actions use their default branch refs because GitHub requires an `@ref` in `uses:` syntax.
- Node is selected from the upstream Excalidraw `package.json` compatibility range.
- The package manager is selected through Corepack from upstream Excalidraw metadata.
- Custom fonts are registered as local system font-family aliases only; CI does not download or publish font files.

This intentionally favors freshness over maximum reproducibility. GitHub warns that default-branch action refs can break when an action owner publishes a breaking change, so investigate upstream action changes first if the workflow suddenly fails.

## Verification

- Repository configuration: `node scripts/validate-config.mjs`
- Pages source: the deploy job should fail fast with `GitHub Pages source is not set to "GitHub Actions".` if the repository Pages source is not `workflow`. You can also query it with `gh api repos/<owner>/<repo>/pages --jq '.build_type'` or `curl -H "Accept: application/vnd.github+json" https://api.github.com/repos/<owner>/<repo>/pages`.
- Workflow result: the Actions run should finish with a Pages deployment URL.
- Environment protection: the deploy job should not show `Branch "main" is not allowed to deploy to github-pages due to environment protection rules.`
- Published branch: `gh-pages` should contain only the built static site snapshot.
- Domain: `Resolve-DnsName excalidraw.x-ha.com` should show the expected GitHub Pages target after DNS propagation.

## Troubleshooting

### `Error: Deployment failed, try again later.`

If `actions/deploy-pages` creates the deployment but immediately reports this error, the workflow and artifact are usually correct and the failure is in GitHub's Pages publish backend. This has been observed during GitHub Pages incidents (for example, discussions around 2026-07-03 to 2026-07-05).

Workarounds that have recovered deployments for other users:

1. Reset the Pages source state in the repository settings:
   - Settings → Pages → Source: temporarily switch to **Deploy from a branch** (`gh-pages` / root) and save.
   - Switch the source back to **GitHub Actions** and save.
   - Re-run the workflow.
2. Check Settings → Environments → `github-pages` for stuck or failed deployments. If the environment is cluttered with failed deployments, toggling the Pages source usually clears them.
3. If the problem persists across multiple retries, open a GitHub Support ticket with the workflow run URL and deployment ID.

### Site files missing or 404 after a successful deploy

Make sure `.nojekyll` is present in the deployed output. The workflow sets `include-hidden-files: true` on `actions/upload-pages-artifact` specifically so `.nojekyll` is not stripped. Without it, GitHub Pages runs Jekyll and may ignore files it considers special.

## Known Boundary

Upstream Excalidraw currently documents that self-hosting the client does not support sharing or collaboration features. Keep that limitation visible unless upstream releases a verified self-host collaboration path.
