## Goal

Expand WhatsApp presence across the site using the existing `siteConfig.whatsapp` settings — make it tweakable from one place, and surface it on more pages.

## Changes

### 1. `src/config/site.ts`
- Update `whatsapp.defaultMessage` to a fresh, more generic prompt the user can edit (e.g. `"Hi Piyush! I'd love to connect about a project."`). Keep `number: "918696698841"` as-is.
- Add a new entry to `socialLinks` so WhatsApp shows alongside GitHub / LinkedIn / Email / Fortexa:
  - `id: "whatsapp"`, `label: "WhatsApp"`, `icon: MessageCircle` (imported from `lucide-react`)
  - `href` built from `siteConfig.whatsapp.number` + encoded `defaultMessage` → `https://wa.me/918696698841?text=...`
  - `show: ["hero", "contact", "footer"]` so it appears everywhere social icons render.
- Import `MessageCircle` from `lucide-react`.

### 2. `src/routes/index.tsx` (Home hero)
- Add a dedicated WhatsApp quick-contact button next to `View Work` / `CyberDownloadButton` / `Contact Me`, styled with the brand WhatsApp green (`#25D366`) and the `MessageCircle` icon — same look as the existing one on the Contact page for consistency.
- Link uses `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(siteConfig.whatsapp.defaultMessage)}`, `target="_blank"`, `rel="noreferrer"`, with an accessible `aria-label`.

### 3. No changes needed in
- `src/components/site/Footer.tsx` — already renders `socialLinksFor("footer")`, so WhatsApp will appear automatically once added to `socialLinks`.
- `src/routes/contact.tsx` — already has the WhatsApp button + "WhatsApp chat" link in the aside, and its social grid uses `socialLinksFor("contact")` so the new icon will show up there too.

## Result

- One config file (`site.ts`) controls the WhatsApp number, default message, and where the icon appears.
- WhatsApp appears as: a hero CTA button on the homepage, a green button + chat link on the Contact page (existing), and a social icon in the hero socials row, the Contact "Find me online" card, and the Footer (all via `socialLinks`).
