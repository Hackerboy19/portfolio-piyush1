/**
 * Fixed-position decorative blurred gradient blobs that drift in the
 * background. Pure CSS animation — GPU friendly. Hidden from screen readers.
 */
export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full opacity-50 blur-3xl animate-blob"
        style={{ backgroundColor: "var(--lavender)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full opacity-40 blur-3xl animate-blob-slow"
        style={{ backgroundColor: "var(--peach)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full opacity-40 blur-3xl animate-blob"
        style={{ backgroundColor: "var(--mint)", animationDelay: "-8s" }}
      />
    </div>
  );
}