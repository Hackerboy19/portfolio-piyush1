#!/usr/bin/env node
// Persist Lighthouse run summaries into .lhci-history/ and (optionally) refresh
// .lhci-baseline/baseline.json. Inputs come from .lighthouseci/manifest.json
// produced by `lhci collect`. Always exits 0.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const LHCI_DIR = ".lighthouseci";
const HISTORY_DIR = ".lhci-history";
const BASELINE_DIR = ".lhci-baseline";
const BASELINE_FILE = join(BASELINE_DIR, "baseline.json");
const MAX_HISTORY = 50;

const TRACKED_AUDITS = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
];
const TRACKED_CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

function readJson(path, fallback = null) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
}

function summarizeRun() {
  const manifest = readJson(join(LHCI_DIR, "manifest.json"), []);
  if (!Array.isArray(manifest) || manifest.length === 0) return null;

  const byUrl = {};
  for (const entry of manifest) {
    if (!entry?.isRepresentativeRun || !entry.jsonPath) continue;
    const lhr = readJson(entry.jsonPath);
    if (!lhr) continue;
    const audits = {};
    for (const id of TRACKED_AUDITS) {
      const a = lhr.audits?.[id];
      if (a && typeof a.numericValue === "number") audits[id] = a.numericValue;
    }
    const categories = {};
    for (const id of TRACKED_CATEGORIES) {
      const c = lhr.categories?.[id];
      if (c && typeof c.score === "number") categories[id] = c.score;
    }
    byUrl[entry.url] = { audits, categories };
  }

  return {
    sha: process.env.GIT_SHA || null,
    ref: process.env.GIT_REF || null,
    timestamp: new Date().toISOString(),
    urls: byUrl,
  };
}

const summary = summarizeRun();
if (!summary) {
  console.log("lhci-history: no manifest, skipping");
  process.exit(0);
}

mkdirSync(HISTORY_DIR, { recursive: true });
const filename = `${summary.timestamp.replace(/[:.]/g, "-")}.json`;
writeFileSync(join(HISTORY_DIR, filename), JSON.stringify(summary, null, 2));

// Trim history to most recent MAX_HISTORY entries.
const files = readdirSync(HISTORY_DIR).filter((f) => f.endsWith(".json")).sort();
if (files.length > MAX_HISTORY) {
  const { unlinkSync } = await import("node:fs");
  for (const f of files.slice(0, files.length - MAX_HISTORY)) {
    try { unlinkSync(join(HISTORY_DIR, f)); } catch {}
  }
}

if (process.env.IS_BASELINE_RUN === "true") {
  mkdirSync(BASELINE_DIR, { recursive: true });
  writeFileSync(BASELINE_FILE, JSON.stringify(summary, null, 2));
  console.log(`lhci-history: refreshed baseline at ${BASELINE_FILE}`);
}

// Surface the previous run path for the comment script.
const prior = files.filter((f) => f !== filename).pop();
if (prior) writeFileSync(join(HISTORY_DIR, "_previous.txt"), prior);

console.log(`lhci-history: wrote ${filename}`);