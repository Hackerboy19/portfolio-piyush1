## Goal

Make Lighthouse CI failures actionable on PRs by uploading the reports as artifacts and posting a sticky comment that lists each budget breach (mobile LCP, CLS, performance score, etc.) with the actual vs. allowed values.

## Changes

### 1. `.github/workflows/lighthouse.yml`

- Add `permissions: { contents: read, pull-requests: write }` so the job can comment on PRs.
- Always run LHCI through `lhci autorun` but pass `|| true` so a budget failure doesn't short-circuit the workflow before reports upload — final pass/fail is re-asserted at the end.
- Upload the entire `.lighthouseci/` directory as a workflow artifact (`actions/upload-artifact@v4`) so reviewers can download the full HTML report.
- Add a "Parse LHCI assertions" step that runs `scripts/lhci-comment.mjs` to read `.lighthouseci/assertion-results.json` and emit a Markdown summary to `$GITHUB_STEP_SUMMARY` and `lhci-comment.md`.
- Add a "Comment on PR" step using `marocchino/sticky-pull-request-comment@v2` (header: `lighthouse-ci`) that posts/updates a single sticky comment on PRs only, body sourced from `lhci-comment.md`.
- Final step re-exits non-zero if any `error`-level assertion failed, so required-check status still reflects budgets.

### 2. `scripts/lhci-comment.mjs` (new)

Node script that:

- Reads `.lighthouseci/assertion-results.json` (produced by `lhci assert`).
- Reads `.lighthouseci/manifest.json` to grab links to the uploaded HTML reports / `temporary-public-storage` URLs.
- Groups assertions by URL, separates `error` vs `warning`, and renders a Markdown table per URL with columns: Metric, Level, Expected, Actual, Δ.
- Highlights the mobile-critical metrics (`largest-contentful-paint`, `cumulative-layout-shift`, `total-blocking-time`, `categories:performance`) at the top.
- Writes the Markdown to both `lhci-comment.md` and `$GITHUB_STEP_SUMMARY`.
- Exits 0 always (the workflow re-asserts pass/fail separately).

### 3. `lighthouserc.json`

- Keep current mobile preset and budgets.
- Confirm `upload.target` stays `temporary-public-storage` so the comment can link to a hosted HTML report for each run.

## Technical notes

- `marocchino/sticky-pull-request-comment` only runs on `pull_request` events; pushes to `main` still get the artifact + step summary but no comment (PR API isn't available there).
- `assertion-results.json` is the canonical LHCI output for budget breaches and contains `auditId`, `actual`, `expected`, `operator`, `level`, `url` — everything needed for the table.
- No app code changes; this is CI-only.

## Out of scope

- Switching off `temporary-public-storage` to a self-hosted LHCI server.
- Adding new budgets or changing existing thresholds.
