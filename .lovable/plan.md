## Goal

Polish the `CyberDownloadButton` so it's accessible, reusable, and driven entirely by `src/config/site.ts` — no component edits needed when the resume URL or label changes. Reuse it on the Contact page, and wire in the real resume PDF.

## Changes

### 1. `src/config/site.ts` — single source of truth
Add a `resume` block (replacing the loose `resumeUrl`) so URL + button label live together, plus an optional Fortexa link if you want it surfaced as a social/work link.

```ts
resume: {
  url: "/piyush-mishra-resume.pdf",   // file already in /public
  label: "./download_resume.sh",      // terminal-style label
  filename: "piyush-mishra-resume.pdf",
},
```

Also add a new social entry for **Fortexa Tech** (https://fortexatech.com/) using a `Briefcase` or `Globe` lucide icon, scoped to `show: ["contact", "footer"]` so it doesn't clutter the hero. (Confirm during build if you'd rather skip this.)

Keep `resumeUrl` as a deprecated alias pointing to `resume.url` so the existing Contact page "Download Resume" link doesn't break mid-edit.

### 2. `src/components/site/CyberDownloadButton.tsx` — accessibility + props

- Accept optional `href`, `label`, `filename`, `className` props. Defaults pull from `siteConfig.resume`, so `<CyberDownloadButton />` Just Works.
- Detect `prefers-reduced-motion` via a small `useReducedMotion` hook (or framer-motion's built-in `useReducedMotion()`):
  - Disable the infinite scanline sweep, the magenta/cyan glitch layers, and the blinking cursor animation (cursor stays visible but static).
  - Replace the "scrambling" downloading state with a plain `[ Downloading... ]` swap — no motion, no pulsing icon (use static `Download` icon).
  - Keep the hover glow as a single non-animated box-shadow (or remove transition entirely).
  - Keep `whileHover`/`whileTap` micro-movements off when reduced motion is set.
- Add `aria-label={`Download resume (${filename})`}` and `type="button"`-equivalent semantics on the anchor.
- Keep `download` attribute and `target="_blank"` only when href is external; for same-origin `/piyush-mishra-resume.pdf` drop `target="_blank"` so the browser triggers the download instead of opening a new tab.

### 3. `src/routes/contact.tsx` — reuse the button
Replace the existing plain "Download Resume" anchor in the form's footer with `<CyberDownloadButton />`. Same component, same defaults — visual consistency with the hero.

### 4. `src/routes/index.tsx`
No structural change — the hero already uses `<CyberDownloadButton />`. After the config change it will automatically point to `/piyush-mishra-resume.pdf` instead of the LinkedIn URL.

## Technical notes

- `framer-motion` exports `useReducedMotion()` — already installed, no new deps.
- The PDF (`public/piyush-mishra-resume.pdf`) was generated in an earlier turn, so the `download` attribute will produce a real file download.
- No backend / migration changes.

## Files touched

- edit `src/config/site.ts`
- edit `src/components/site/CyberDownloadButton.tsx`
- edit `src/routes/contact.tsx`

## Open question

Want the **Fortexa Tech** link added as a social entry (icon in Contact + Footer), or keep it out of the social list and instead mention it as a "Currently building at Fortexa Tech" badge somewhere on the About / Hero? I'll default to adding it as a social link unless you say otherwise.
