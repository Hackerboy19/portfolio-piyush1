import { useEffect, useRef } from "react";

/**
 * Adds `is-visible` class to children with `.reveal` once they enter the viewport.
 * Lightweight scroll reveal using IntersectionObserver — no library required.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (items.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    items.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 60, 400)}ms`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return ref;
}