#!/usr/bin/env node
// Parse .lighthouseci/assertion-results.json and emit a Markdown summary
// for PR sticky comments + GitHub step summary. Always exits 0; the
// workflow re-asserts pass/fail using the lhci step exit code.

import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const LHCI_DIR = ".lighthouseci";
const OUT_FILE = "lhci-comment.md";

const HIGHLIGHT = new Set([
  "categories:performance",
  "largest-contentful-paint",
  "cumulative-layout-shift",
  "total-blocking-time",
  "first-contentful-paint",
  "speed-index",
]);

const PRETTY = {
  "categories:performance": "Performance score",
  "categories:accessibility": "Accessibility score",
  "categories:best-practices": "Best Practices score",
  "categories:seo": "SEO score",
  "first-contentful-paint": "FCP",
  "largest-contentful-paint": "LCP",
  "total-blocking-time": "TBT",
  "cumulative-layout-shift": "CLS",
  "speed-index": "Speed Index",
};

function fmt(audit, value) {
  if (value == null || Number.isNaN(value)) return "—";
  if (audit.startsWith("categories:")) return value.toFixed(2);
  if (audit === "cumulative-layout-shift") return value.toFixed(3);
  if (typeof value === "number" && value >= 100) return `${Math.round(value)} ms`;
  return String(value);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function loadReportLinks() {
  const manifest = readJson(join(LHCI_DIR, "manifest.json"));
  if (!Array.isArray(manifest)) return {};
  const links = {};
  for (const entry of manifest) {
    if (!entry?.url) continue;
    if (entry.isRepresentativeRun && entry.htmlPath) {
      links[entry.url] = entry.htmlPath;
    }
  }
  // Also try links.json (uploaded HTML report URLs)
  const uploaded = readJson(join(LHCI_DIR, "links.json"));
  if (uploaded && typeof uploaded === "object") {
    for (const [url, hosted] of Object.entries(uploaded)) {
      links[url] = hosted;
    }
  }
  return links;
}

function renderTable(rows) {
  const head = "| Metric | Level | Expected | Actual | Δ |\n|---|---|---|---|---|";
  const body = rows
    .map((r) => {
      const name = PRETTY[r.auditId] || r.auditId;
      const star = HIGHLIGHT.has(r.auditId) ? "**" : "";
      const expected = `${r.operator || ""} ${fmt(r.auditId, r.expected)}`.trim();
      const actual = fmt(r.auditId, r.actual);
      const delta =
        typeof r.actual === "number" && typeof r.expected === "number"
          ? fmt(r.auditId, r.actual - r.expected)
          : "—";
      const level = r.level === "error" ? "🔴 error" : "🟡 warn";
      return `| ${star}${name}${star} | ${level} | ${expected} | ${actual} | ${delta} |`;
    })
    .join("\n");
  return `${head}\n${body}`;
}

function build() {
  const assertionsPath = join(LHCI_DIR, "assertion-results.json");
  if (!existsSync(assertionsPath)) {
    return `## Lighthouse CI\n\n✅ No budget assertions failed (or no report was produced).\n`;
  }
  const results = readJson(assertionsPath) || [];
  if (results.length === 0) {
    return `## Lighthouse CI\n\n✅ All mobile budgets passed.\n`;
  }

  const links = loadReportLinks();
  const byUrl = new Map();
  for (const r of results) {
    const arr = byUrl.get(r.url) || [];
    arr.push(r);
    byUrl.set(r.url, arr);
  }

  const errorCount = results.filter((r) => r.level === "error").length;
  const warnCount = results.filter((r) => r.level === "warn").length;

  const header =
    `## Lighthouse CI — mobile budget report\n\n` +
    `**${errorCount}** error · **${warnCount}** warning\n`;

  const sections = [];
  for (const [url, rows] of byUrl) {
    rows.sort((a, b) => {
      const ah = HIGHLIGHT.has(a.auditId) ? 0 : 1;
      const bh = HIGHLIGHT.has(b.auditId) ? 0 : 1;
      if (ah !== bh) return ah - bh;
      return a.auditId.localeCompare(b.auditId);
    });
    const link = links[url] ? ` — [report](${links[url]})` : "";
    sections.push(`### \`${url}\`${link}\n\n${renderTable(rows)}`);
  }

  return `${header}\n${sections.join("\n\n")}\n`;
}

const md = build();
writeFileSync(OUT_FILE, md);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");
}
console.log(md);