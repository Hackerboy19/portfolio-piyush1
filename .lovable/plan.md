# Premium Animated Portfolio — Plan

A modern, production-ready personal portfolio with a soft pastel light theme, glassmorphism, smooth animations, and dark/light toggle. Built on TanStack Start with separate SEO-friendly routes.

## Design system

- **Theme**: Light default with soft pastel gradient (lavender → peach → mint), full dark mode toggle (persisted to localStorage, respects system preference)
- **Typography**: Modern pairing — `Sora` (headings, geometric) + `Inter` (body)
- **Effects**: Gradient text on key headings, glassmorphism cards (backdrop-blur + soft shadows), subtle animated background blur shapes (floating gradient orbs)
- **Motion**: Tailwind utilities + CSS keyframes, scroll-triggered reveals via IntersectionObserver (no heavy libraries), `prefers-reduced-motion` respected

## Routes (each with unique SEO meta)

1. **`/` — Home**
   - Split hero: left = greeting + typing animation ("Hello, I am [rotating roles]") with blinking cursor, gradient name, two animated CTAs (View Work / Contact Me), social icons
   - Right = anime-style placeholder character in a soft glass frame with floating gradient orbs behind
   - Highlights strip below the fold
2. **`/about`** — Bio, photo, fun facts, downloadable resume CTA
3. **`/skills`** — Animated skill bars + tech stack icon grid (reveal on scroll)
4. **`/services`** — 3–6 service cards with hover lift and gradient border
5. **`/projects`** — Filterable project grid (glass cards, hover zoom, tags, live/code links). Seeded with 6 sample projects
6. **`/testimonials`** — Grid/carousel of client quotes with avatars
7. **`/contact`** — Contact form (name/email/message) with validation + animated submit; socials + email + location

## Shared layout

- **Sticky glass navbar**: Logo, links, theme toggle, mobile hamburger with slide-in drawer
- **Footer**: Mini nav, socials, copyright
- **Animated background**: Fixed layer with 2–3 blurred gradient blobs slowly drifting (GPU-friendly CSS)

## Features checklist

- ✅ Typing animation with blinking cursor (custom hook, no library)
- ✅ Fully responsive (mobile / tablet / desktop)
- ✅ Smooth scroll + scroll-reveal animations
- ✅ Animated gradient buttons (hover lift + shift)
- ✅ Section fade/slide transitions
- ✅ Optimized images (`loading="lazy"`, `decoding="async"`, proper sizing)
- ✅ Dark/Light toggle (system preference + localStorage, no FOUC)
- ✅ SEO: per-route `<title>`, description, og:title, og:description
- ✅ Fast: no heavy animation libraries

## Anime placeholder character

A free open-source anime-style illustration as a swappable hero image — one-line replace when you want your own.

## After build — quick tips

- **Free deployment**: Click **Publish** in Lovable for an instant `*.lovable.app` URL.
- **Clothing brand variant**: Swap copy (Home → "New Drop"), rename Projects → "Lookbook", Services → "Collections", Testimonials → "Reviews", and update the pastel palette via design tokens in `src/styles.css` — structure stays identical.

Ready to build when you approve.