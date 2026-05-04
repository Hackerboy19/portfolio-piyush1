import { useEffect, useMemo, useState } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isCoarsePointer() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Typing animation hook — cycles through `phrases`, typing then deleting each.
 * Pure JS, no library dependencies.
 *
 * Respects `prefers-reduced-motion`: when set, the final phrase is shown
 * immediately with no typing/deleting cycle.
 * On coarse-pointer (mobile) devices, intervals are slowed down to reduce
 * timer-driven re-renders and battery usage.
 */
export function useTyping(
  phrases: string[],
  opts: { typeMs?: number; deleteMs?: number; pauseMs?: number } = {},
) {
  const reduced = useMemo(prefersReducedMotion, []);
  const coarse = useMemo(isCoarsePointer, []);
  // Slower cadence on touch devices = fewer state updates per second.
  const scale = coarse ? 1.6 : 1;
  const { typeMs = 80, deleteMs = 40, pauseMs = 1400 } = opts;
  const [text, setText] = useState(reduced ? phrases[0] ?? "" : "");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return; // Static text, no timers.
    const current = phrases[phraseIdx % phrases.length];
    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pauseMs * scale);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
      return;
    }
    const t = setTimeout(
      () => {
        setText((prev) =>
          deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
        );
      },
      (deleting ? deleteMs : typeMs) * scale,
    );
    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx, phrases, typeMs, deleteMs, pauseMs, reduced, scale]);

  return text;
}