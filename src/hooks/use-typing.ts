import { useEffect, useState } from "react";

/**
 * Typing animation hook — cycles through `phrases`, typing then deleting each.
 * Pure JS, no library dependencies.
 */
export function useTyping(
  phrases: string[],
  opts: { typeMs?: number; deleteMs?: number; pauseMs?: number } = {},
) {
  const { typeMs = 80, deleteMs = 40, pauseMs = 1400 } = opts;
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx % phrases.length];
    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pauseMs);
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
      deleting ? deleteMs : typeMs,
    );
    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx, phrases, typeMs, deleteMs, pauseMs]);

  return text;
}