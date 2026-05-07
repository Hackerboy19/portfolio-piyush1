import { useEffect, useRef } from "react";

/**
 * Adds `is-visible` class to children with `.reveal` once they enter the viewport.
 * Lightweight scroll reveal using IntersectionObserver — no library required.
 *
 * - Respects `prefers-reduced-motion`: instantly marks all items visible
 *   (no transition delays, no observer) so users get content without motion.
 * - On coarse-pointer (mobile) devices, transition delays are shortened and
 *   capped to reduce paint work during scroll.
 * - Disconnects the observer once every item has been revealed.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (items.length === 0) return;

    const mm = typeof window !== "undefined" ? window.matchMedia : undefined;
    const reduced = mm?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const coarse = mm?.("(pointer: coarse)").matches ?? false;

    // Reduced motion: skip animation, skip observer entirely.
    if (reduced) {
      items.forEach((el) => {
        el.style.transitionDelay = "0ms";
        el.classList.add("is-visible");
      });
      return;
    }

    // Profiled on mobile: layout/style recalc is cheap, but long stagger
    // chains delay LCP-adjacent content. Keep mobile stagger tight so cards
    // resolve quickly without compositor jank.
    // Desktop Lighthouse re-tune: trim stagger so above-the-fold content
    // settles faster (LCP-adjacent), while keeping a perceptible cascade.
    const step = coarse ? 28 : 50;
    const cap = coarse ? 160 : 320;
    items.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * step, cap)}ms`;
    });

    let revealed = 0;
    const total = items.length;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
          revealed += 1;
        }
        if (revealed >= total) io.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
}