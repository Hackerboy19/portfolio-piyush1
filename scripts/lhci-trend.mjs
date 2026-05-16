#!/usr/bin/env node
// Render a simple SVG trend chart from .lhci-history/*.json. Tracks the
// metrics listed in lhci-tracking.json for the first URL in the history.
// Output: .lhci-history/trend.svg (uploaded as part of the workflow artifact).

import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const HISTORY_DIR = ".lhci-history";
if (!existsSync(HISTORY_DIR)) process.exit(0);

function readJson(p, f = null) { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return f; } }

const TRACKING = readJson("lhci-tracking.json", {
  audits: ["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time"],
  categories: ["performance"],
});

const files = readdirSync(HISTORY_DIR).filter((f) => f.endsWith(".json")).sort();
const runs = files.map((f) => readJson(join(HISTORY_DIR, f))).filter(Boolean);
if (runs.length < 2) { console.log("lhci-trend: not enough history"); process.exit(0); }

// Use the first URL that appears across all runs as the chart subject.
const firstUrl = Object.keys(runs[runs.length - 1].urls || {})[0];
if (!firstUrl) process.exit(0);

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c", "#0891b2"];
const series = [];
for (const cat of TRACKING.categories || []) {
  series.push({ key: `cat:${cat}`, label: `${cat} score`, pick: (r) => r.urls?.[firstUrl]?.categories?.[cat], scale: 100 });
}
for (const a of TRACKING.audits || []) {
  series.push({ key: `audit:${a}`, label: a, pick: (r) => r.urls?.[firstUrl]?.audits?.[a], scale: 1 });
}

const W = 900, H = 360, PAD = 50;
const innerW = W - PAD * 2, innerH = H - PAD * 2;
const n = runs.length;

function normSeries(s) {
  const values = runs.map((r) => {
    const v = s.pick(r);
    return typeof v === "number" ? v * (s.scale || 1) : null;
  });
  const present = values.filter((v) => v != null);
  if (present.length < 2) return null;
  const min = Math.min(...present), max = Math.max(...present);
  const range = max - min || 1;
  return { ...s, values, min, max, range };
}

const norm = series.map(normSeries).filter(Boolean);
if (norm.length === 0) process.exit(0);

const xAt = (i) => PAD + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
const yAt = (v, s) => PAD + innerH - ((v - s.min) / s.range) * innerH;

const lines = norm.map((s, idx) => {
  const color = COLORS[idx % COLORS.length];
  const path = s.values
    .map((v, i) => (v == null ? null : `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(v, s).toFixed(1)}`))
    .filter(Boolean).join(" ");
  return `<path d="${path}" fill="none" stroke="${color}" stroke-width="2"/>`;
}).join("");

const legend = norm.map((s, idx) => {
  const color = COLORS[idx % COLORS.length];
  const y = 20 + idx * 16;
  const last = [...s.values].reverse().find((v) => v != null);
  const lastStr = last != null ? ` (latest ${last.toFixed(s.scale === 100 ? 0 : 2)})` : "";
  return `<g><rect x="${W - 260}" y="${y - 10}" width="12" height="12" fill="${color}"/><text x="${W - 244}" y="${y}" font-size="11" font-family="ui-sans-serif,system-ui" fill="#111">${s.label}${lastStr}</text></g>`;
}).join("");

const xLabels = runs.map((r, i) => {
  if (n > 12 && i % Math.ceil(n / 8) !== 0 && i !== n - 1) return "";
  const label = (r.sha || "").slice(0, 7) || r.timestamp?.slice(5, 10) || String(i);
  return `<text x="${xAt(i)}" y="${H - 18}" font-size="10" font-family="ui-sans-serif,system-ui" fill="#555" text-anchor="middle">${label}</text>`;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="#fff"/>
  <text x="${PAD}" y="24" font-size="14" font-family="ui-sans-serif,system-ui" fill="#111" font-weight="600">Lighthouse history — ${firstUrl}</text>
  <rect x="${PAD}" y="${PAD}" width="${innerW}" height="${innerH}" fill="none" stroke="#e5e7eb"/>
  ${lines}
  ${xLabels}
  ${legend}
  <text x="${PAD}" y="${H - 4}" font-size="10" font-family="ui-sans-serif,system-ui" fill="#888">Each series normalized to its own min/max across ${n} runs.</text>
</svg>`;

writeFileSync(join(HISTORY_DIR, "trend.svg"), svg);
console.log(`lhci-trend: wrote ${HISTORY_DIR}/trend.svg (${n} runs, ${norm.length} series)`);