import { Link } from "@tanstack/react-router";
import { ArrowLeft, Home, MessageCircle, Sparkles } from "lucide-react";

/**
 * Themed 404 — matches the soft anime/tech aesthetic with the same
 * gradient text, glass panels, and CTA pattern used across the site.
 */
export function NotFoundPage() {
  return (
    <section className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="inline-flex w-fit items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        Lost in the stack
      </span>

      <h1 className="mt-6 text-7xl font-bold leading-none sm:text-8xl">
        <span className="gradient-text">404</span>
      </h1>
      <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
        This page wandered off
      </h2>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        The link you followed is broken, or the page has moved somewhere quieter.
        Let&rsquo;s get you back to something useful.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Go Back Home
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold shadow-soft transition-all hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          See Projects
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold shadow-soft transition-all hover:-translate-y-0.5"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Contact Me
        </Link>
      </div>
    </section>
  );
}