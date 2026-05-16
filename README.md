# Portfolio

[![Lighthouse CI](https://github.com/OWNER/REPO/actions/workflows/lighthouse.yml/badge.svg?branch=main)](https://github.com/OWNER/REPO/actions/workflows/lighthouse.yml)

> Replace `OWNER/REPO` above with your GitHub `<owner>/<repo>` slug to activate the live Lighthouse CI status badge.

## CI

- **Lighthouse CI** runs on every PR, every push to `main`, nightly at 03:17 UTC, and on the 1st of each month (baseline refresh). Mobile-only budgets — desktop drift does not fail the build. PRs only fail when mobile **LCP**, **CLS**, or **performance score** breach budget.
- **Artifacts**: each run uploads `lighthouse-reports-<run-id>` containing `.lighthouseci/` (HTML reports + `assertion-results.json`), `.lhci-history/` (rolling 50 runs), and the rendered `lhci-comment.md`.
- **PR comments**: a single sticky comment shows failing budgets, deltas vs the previous run, and deltas vs the monthly baseline.
- **Annotations**: failing audits appear as inline GitHub check annotations pointing at `lighthouserc.json`.
- **Manual baseline refresh**: run the workflow via *Actions → Lighthouse CI → Run workflow* with `refresh_baseline = true`.
- **Trend chart**: each run renders `.lhci-history/trend.svg` (included in the workflow artifact) plotting the metrics in `lhci-tracking.json` across the most recent runs.
- **Tracked metrics**: edit `lhci-tracking.json` to choose which audits/categories appear in the previous-run and baseline delta tables, and to tune per-metric regression thresholds.
- **PR comment links**: the sticky comment's "Vs previous run" and "Vs monthly baseline" sections link straight to the GitHub Actions run that produced the reference data.

### Activating the badge

The badge above uses `OWNER/REPO` as a placeholder. After connecting this project to GitHub, replace both occurrences with your actual `<owner>/<repo>` slug (e.g. `acme/portfolio`). The badge resolves via `https://github.com/<owner>/<repo>/actions/workflows/lighthouse.yml/badge.svg?branch=main` and shows the latest run status on `main`.