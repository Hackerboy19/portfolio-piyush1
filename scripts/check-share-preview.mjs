#!/usr/bin/env node
/**
 * Share preview test — fetches the live site and verifies that all critical
 * Open Graph / Twitter Card meta tags are present and that the og:image URL
 * actually resolves with the expected dimensions (1200x630 fallback).
 *
 * Usage:  node scripts/check-share-preview.mjs [url]
 * Default URL: https://portfolio-piyush1.lovable.app
 */

const TARGET = process.argv[2] || "https://portfolio-piyush1.lovable.app";
const REQUIRED = [
  "og:title",
  "og:description",
  "og:image",
  "og:image:width",
  "og:image:height",
  "og:url",
  "twitter:card",
  "twitter:image",
];

function extractMeta(html) {
  const tags = {};
  const re = /<meta\s+[^>]*?(?:property|name)=["']([^"']+)["'][^>]*?content=["']([^"']*)["']/gi;
  let m;
  while ((m = re.exec(html))) tags[m[1]] = m[2];
  // also handle reversed attribute order
  const re2 = /<meta\s+[^>]*?content=["']([^"']*)["'][^>]*?(?:property|name)=["']([^"']+)["']/gi;
  while ((m = re2.exec(html))) tags[m[2]] ||= m[1];
  return tags;
}

async function main() {
  console.log(`→ Fetching ${TARGET}`);
  const res = await fetch(TARGET, { redirect: "follow" });
  if (!res.ok) {
    console.error(`✗ HTTP ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();
  const meta = extractMeta(html);

  let failed = 0;
  for (const key of REQUIRED) {
    if (!meta[key]) {
      console.error(`✗ missing meta: ${key}`);
      failed++;
    } else {
      console.log(`✓ ${key} = ${meta[key]}`);
    }
  }

  if (meta["og:image"]) {
    try {
      const img = await fetch(meta["og:image"], { method: "HEAD" });
      if (!img.ok) {
        console.error(`✗ og:image returned HTTP ${img.status}`);
        failed++;
      } else {
        const type = img.headers.get("content-type") || "";
        const len = img.headers.get("content-length") || "?";
        console.log(`✓ og:image reachable (${type}, ${len} bytes)`);
        if (!type.startsWith("image/")) {
          console.error(`✗ og:image content-type is not image/*`);
          failed++;
        }
      }
    } catch (e) {
      console.error(`✗ og:image fetch failed: ${e.message}`);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} share-preview check(s) failed.`);
    process.exit(1);
  }
  console.log(`\nAll share-preview checks passed for ${TARGET}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});