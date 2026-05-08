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

const FILE = "lighthouserc.json";

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
  const title = `Lighthouse budget: ${r.auditId}`;
  const msg = `${r.url} — expected ${op} ${expected}, got ${actual}`;
  // GitHub workflow command — file points reviewers at the budget config.
  console.log(`::${level} file=${FILE},title=${title}::${msg}`);
}