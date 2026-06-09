import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  error?: Error;
  onRetry?: () => void;
}

/**
 * Themed fallback used by the router's defaultErrorComponent AND the
 * top-level React ErrorBoundary. Keeps the soft anime/tech aesthetic
 * (gradient text, glass panel) even when something crashes.
 */
export function ErrorPage({ error, onRetry }: ErrorPageProps) {
  const handleHome = () => {
    if (typeof window !== "undefined") window.location.assign("/");
  };
  const handleReload = () => {
    if (onRetry) {
      onRetry();
      return;
    }
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <section className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive shadow-soft">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
        Something <span className="gradient-text">broke</span>
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        An unexpected error stopped this page from rendering. You can retry,
        or head back home and try again from there.
      </p>

      {import.meta.env.DEV && error?.message && (
        <pre className="mt-5 max-h-40 w-full max-w-xl overflow-auto rounded-xl bg-muted/60 p-3 text-left font-mono text-xs text-destructive">
          {error.message}
        </pre>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleReload}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5"
        >
          <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" aria-hidden="true" />
          Try again
        </button>
        <button
          type="button"
          onClick={handleHome}
          className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold shadow-soft transition-all hover:-translate-y-0.5"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Go home
        </button>
      </div>
    </section>
  );
}