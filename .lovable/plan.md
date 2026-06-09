## Scope
Four related improvements across the portfolio. I'll do them in one pass so the refactor and the perf/CLS work touch each file only once.

### 1. CLS fixes (Lighthouse)
- Audit every `<img>` and avatar (hero illustration, About photo, project thumbnails, testimonial avatars, OG previews) and add explicit `width`/`height` attributes plus Tailwind `aspect-*` classes so the browser reserves space pre-load.
- Wrap any icon-only buttons that currently have implicit sizing in fixed `h-/w-` utilities (already mostly true; will sweep).
- Fonts: move the Google Fonts `<link>` to use `display=swap` (already set) and add a `size-adjust` fallback stack in `@theme` so Inter/Space Grotesk fallback metrics match — eliminates the swap-time text shift.
- Entrance animations: audit `useReveal` and `PageTransition` to ensure only `opacity` + `transform` are animated (no `height`/`margin`). Replace anything that animates flow-affecting props.
- Client-state sections (filtered projects grid, contact form submit state, theme toggle) get fixed-size skeleton placeholders so first paint matches loaded state.

### 2. Component refactor
- Extract inline blocks into focused sub-components:
  - `components/projects/ProjectCard.tsx`, `ProjectFilters.tsx`
  - `components/skills/SkillBadge.tsx`, `SkillGroup.tsx`
  - `components/contact/ContactField.tsx`, `ContactTextarea.tsx`, `ContactInfoCard.tsx`
  - `components/testimonials/TestimonialCard.tsx`
- Move `Navbar`, `Footer`, `AnimatedBackground`, `PageTransition` from `components/site/` into `components/layout/` (keep re-export shims for one cycle so imports don't break mid-refactor, then update call sites).
- Strict TS: introduce shared `types/` (e.g. `Project`, `Skill`, `Testimonial`, `SocialLink` already exists) and replace any loose prop typing with explicit interfaces. No `any`.
- Note: I will NOT move `src/routes/*` into a `pages/` directory — TanStack Start requires file-based routes under `src/routes/`. Moving them breaks routing. I'll keep route files thin (just `createFileRoute` + `head()` + a page component imported from `components/pages/`), which gives the same separation the prompt is asking for.

### 3. Perf polish
- Skeletons (Tailwind `animate-pulse`) sized to match real content for: Projects grid, Testimonials grid, Hero illustration (above-the-fold placeholder while the image decodes).
- Image audit:
  - Hero illustration → `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, explicit dimensions, plus a `<link rel="preload" as="image">` in the index route's `head().links`.
  - Every other `<img>` and `SmartImage` → `loading="lazy"`, `decoding="async"`, explicit width/height.

### 4. 404 + Error Boundary
- Replace the plain `NotFoundComponent` in `__root.tsx` with a themed `routes/__notfound` style page matching the soft anime/tech aesthetic (gradient text, animated background, "Go Back Home" + "Contact" CTAs).
- `src/router.tsx` already wires `defaultErrorComponent` — upgrade `DefaultErrorComponent` to a themed fallback with Retry (calls `router.invalidate()` + `reset()`) and Go Home actions.
- Add a top-level React `<ErrorBoundary>` inside `RootComponent` (using a lightweight in-house boundary, no new dep) so render-time errors outside the router also get the themed fallback.

### Technical notes
- Tailwind v4: any new tokens (font fallback metrics, skeleton shimmer) go in `src/styles.css` under `@theme` / `@utility`, never a JS config.
- No route file moves; route files stay in `src/routes/` (TanStack constraint).
- No dependency additions expected.
- Cleanup: delete the stale `src/routes/contact.tsx.bak`.

### Out of scope
- No changes to backend, Supabase schema, or the contact server function.
- No visual redesign — only structural/perf/a11y polish + themed 404.