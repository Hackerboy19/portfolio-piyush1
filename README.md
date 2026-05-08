# Portfolio

[![Lighthouse CI](https://github.com/OWNER/REPO/actions/workflows/lighthouse.yml/badge.svg?branch=main)](https://github.com/OWNER/REPO/actions/workflows/lighthouse.yml)

> Replace `OWNER/REPO` above with your GitHub `<owner>/<repo>` slug to activate the live Lighthouse CI status badge.

## CI

- **Lighthouse CI** runs on every PR, every push to `main`, nightly at 03:17 UTC, and on the 1st of each month (baseline refresh). Mobile-only budgets — desktop drift does not fail the build. PRs only fail when mobile **LCP**, **CLS**, or **performance score** breach budget.
- **Artifacts**: each run uploads `lighthouse-reports-<run-id>` containing `.lighthouseci/` (HTML reports + `assertion-results.json`), `.lhci-history/` (rolling 50 runs), and the rendered `lhci-comment.md`.
- **PR comments**: a single sticky comment shows failing budgets, deltas vs the previous run, and deltas vs the monthly baseline.
- **Annotations**: failing audits appear as inline GitHub check annotations pointing at `lighthouserc.json`.
- **Manual baseline refresh**: run the workflow via *Actions → Lighthouse CI → Run workflow* with `refresh_baseline = true`.