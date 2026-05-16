#!/usr/bin/env node
// Parse .lighthouseci/assertion-results.json and emit a Markdown summary
// for PR sticky comments + GitHub step summary. Always exits 0; the
// workflow re-asserts pass/fail using the lhci step exit code.

import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { readdirSync } from "node:fs";

const LHCI_DIR = ".lighthouseci";
const HISTORY_DIR = ".lhci-history";
const BASELINE_FILE = ".lhci-baseline/baseline.json";
const OUT_FILE = "lhci-comment.md";

function readJsonSafe(path, fallback) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
}
const TRACKING = readJsonSafe("lhci-tracking.json", {
  audits: [
    "largest-contentful-paint",
    "cumulative-layout-shift",
    "total-blocking-time",
    "first-contentful-paint",
    "speed-index",
  ],
  categories: ["performance"],
  highlight: [
    "categories:performance",
    "largest-contentful-paint",
    "cumulative-layout-shift",
    "total-blocking-time",
  ],
  regressionThresholds: { "cumulative-layout-shift": 0.005, _defaultMs: 25, _defaultScore: 0.01 },
});
const HIGHLIGHT = new Set(TRACKING.highlight || []);
const TRACKED = TRACKING.audits || [];
const TRACKED_CATEGORIES = TRACKING.categories || [];
const THRESH = TRACKING.regressionThresholds || {};

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

function delta(audit, current, ref) {
  if (typeof current !== "number" || typeof ref !== "number") return "—";
  const d = current - ref;
  const sign = d > 0 ? "+" : "";
  const higherIsBetter = audit.startsWith("categories:");
  const scoreThresh = typeof THRESH._defaultScore === "number" ? THRESH._defaultScore : 0.01;
  const msThresh = typeof THRESH._defaultMs === "number" ? THRESH._defaultMs : 25;
  const specific = typeof THRESH[audit] === "number" ? THRESH[audit] : null;
  const regressed = higherIsBetter
    ? d < -(specific ?? scoreThresh)
    : d > (specific ?? msThresh);
  const arrow = Math.abs(d) < 1e-6 ? "▪" : regressed ? "🔺" : "🟢";
  return `${arrow} ${sign}${fmt(audit, d)}`;
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function loadCurrentRunByUrl() {
  const manifest = readJson(join(LHCI_DIR, "manifest.json"));
  if (!Array.isArray(manifest)) return {};
  const out = {};
  for (const e of manifest) {
    if (!e?.isRepresentativeRun || !e.jsonPath) continue;
    const lhr = readJson(e.jsonPath);
    if (!lhr) continue;
    out[e.url] = {
      audits: Object.fromEntries(
        Object.entries(lhr.audits || {}).map(([k, v]) => [k, v.numericValue]),
      ),
      categories: Object.fromEntries(
        Object.entries(lhr.categories || {}).map(([k, v]) => [k, v.score]),
      ),
    };
  }
  return out;
}

function loadPreviousRun() {
  if (!existsSync(HISTORY_DIR)) return null;
  let pointer;
  try { pointer = readFileSync(join(HISTORY_DIR, "_previous.txt"), "utf8").trim(); } catch {}
  let file = pointer;
  if (!file) {
    const all = readdirSync(HISTORY_DIR).filter((f) => f.endsWith(".json")).sort();
    file = all[all.length - 2]; // skip the just-written one
  }
  if (!file) return null;
  return readJson(join(HISTORY_DIR, file));
}

function loadBaseline() {
  if (!existsSync(BASELINE_FILE)) return null;
  return readJson(BASELINE_FILE);
}

function refLink(ref) {
  if (!ref) return "";
  if (ref.runUrl) {
    const sha = ref.sha ? ` \`${ref.sha.slice(0, 7)}\`` : "";
    return ` — [run #${ref.runId}](${ref.runUrl})${sha}`;
  }
  if (ref.sha) return ` — \`${ref.sha.slice(0, 7)}\``;
  if (ref.timestamp) return ` — ${ref.timestamp.slice(0, 10)}`;
  return "";
}

function renderComparison(title, current, ref) {
  if (!ref?.urls) return "";
  const lines = [];
  for (const [url, cur] of Object.entries(current)) {
    const refUrl = ref.urls[url];
    if (!refUrl) continue;
    const rows = [];
    for (const id of TRACKED) {
      const c = cur.audits?.[id];
      const r = refUrl.audits?.[id];
      if (typeof c !== "number" || typeof r !== "number") continue;
      rows.push(`| ${PRETTY[id] || id} | ${fmt(id, r)} | ${fmt(id, c)} | ${delta(id, c, r)} |`);
    }
    for (const cat of TRACKED_CATEGORIES) {
      const c = cur.categories?.[cat];
      const r = refUrl.categories?.[cat];
      if (typeof c !== "number" || typeof r !== "number") continue;
      const key = `categories:${cat}`;
      rows.unshift(`| ${PRETTY[key] || `${cat} score`} | ${fmt(key, r)} | ${fmt(key, c)} | ${delta(key, c, r)} |`);
    }
    if (rows.length === 0) continue;
    lines.push(
      `**\`${url}\`**\n\n| Metric | Reference | Current | Δ |\n|---|---|---|---|\n${rows.join("\n")}`,
    );
  }
  if (lines.length === 0) return "";
  return `\n### ${title}${refLink(ref)}\n\n${lines.join("\n\n")}\n`;
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
  const results = existsSync(assertionsPath) ? readJson(assertionsPath) || [] : [];
  const current = loadCurrentRunByUrl();
  const previous = loadPreviousRun();
  const baseline = loadBaseline();

  const links = loadReportLinks();
  const errorCount = results.filter((r) => r.level === "error").length;
  const warnCount = results.filter((r) => r.level === "warn").length;

  const status = errorCount === 0 ? "✅ Passing" : "❌ Failing";
  let md = `## Lighthouse CI — mobile budget report\n\n${status} — **${errorCount}** error · **${warnCount}** warning\n`;

  if (results.length > 0) {
    const byUrl = new Map();
    for (const r of results) {
      const arr = byUrl.get(r.url) || [];
      arr.push(r);
      byUrl.set(r.url, arr);
    }
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
    md += `\n${sections.join("\n\n")}\n`;
  } else {
    md += `\n✅ All mobile budgets passed.\n`;
  }

  md += renderComparison("Vs previous run", current, previous);
  md += renderComparison("Vs monthly baseline", current, baseline);

  md += `\n<sub>Reports archived as workflow artifact \`lighthouse-reports-*\`. Baseline refreshes monthly or via workflow_dispatch.</sub>\n`;
  return md;
}

const md = build();
writeFileSync(OUT_FILE, md);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");
}
console.log(md);