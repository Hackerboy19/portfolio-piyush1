#!/usr/bin/env node
// Emit GitHub workflow annotations (::error / ::warning) for each failing
// Lighthouse assertion. These show inline on the PR "Files changed" /
// "Checks" tab so reviewers see the exact failing audit + budget.

import { readFileSync, existsSync } from "node:fs";

const path = ".lighthouseci/assertion-results.json";
if (!existsSync(path)) process.exit(0);

let results;
try { results = JSON.parse(readFileSync(path, "utf8")); }
catch { process.exit(0); }
if (!Array.isArray(results) || results.length === 0) process.exit(0);

// GitHub annotations require a path that exists in the repo. lighthouserc.json
// is where budgets live, so annotations link reviewers straight to the budget
// definition. Fall back to README.md if the config moves or is renamed.
const FILE = existsSync("lighthouserc.json")
  ? "lighthouserc.json"
  : existsSync("README.md")
    ? "README.md"
    : ".github/workflows/lighthouse.yml";

function fmt(audit, value) {
  if (typeof value !== "number") return String(value ?? "—");
  if (audit.startsWith("categories:")) return value.toFixed(2);
  if (audit === "cumulative-layout-shift") return value.toFixed(3);
  if (value >= 100) return `${Math.round(value)}ms`;
  return String(value);
}

for (const r of results) {
  const level = r.level === "error" ? "error" : "warning";
  const op = r.operator || "";
  const expected = fmt(r.auditId, r.expected);
  const actual = fmt(r.auditId, r.actual);
  // Escape per GitHub workflow command spec: %25, %0A, %0D, and ',' in props.
  const esc = (s) => String(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  const escProp = (s) => esc(s).replace(/,/g, "%2C").replace(/:/g, "%3A");
  const title = `Lighthouse budget: ${r.auditId}`;
  const msg = `${r.url} — expected ${op} ${expected}, got ${actual}`;
  console.log(`::${level} file=${FILE},title=${escProp(title)}::${esc(msg)}`);
}