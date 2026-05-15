import {
  Outlet,
  Link,
  ScriptOnce,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { ThemeProvider, themeBootScript } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: siteConfig.name },
      { name: "description", content: siteConfig.description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteConfig.brand },
      { property: "og:url", content: siteConfig.url },
      { property: "og:image", content: siteConfig.ogImage },
      { property: "og:image:alt", content: `${siteConfig.name} — ${siteConfig.role}` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: siteConfig.twitterHandle },
      { name: "twitter:image", content: siteConfig.ogImage },
      { name: "twitter:image:alt", content: `${siteConfig.name} — ${siteConfig.role}` },
      { name: "theme-color", content: "#7c5cff" },
      // Resume — SEO + social discoverability for the downloadable PDF
      { name: "resume:title", content: `${siteConfig.name} — Resume (PDF)` },
      {
        name: "resume:description",
        content: `Download the latest resume of ${siteConfig.name}, ${siteConfig.role}. One-page PDF.`,
      },
      { name: "resume:url", content: `${siteConfig.url}${siteConfig.resume.url}` },
      // Open Graph + Twitter card for the resume PDF — ensures proper preview
      // when the resume URL itself, or a page linking to it, is shared.
      {
        property: "og:title",
        content: `${siteConfig.name} — Resume (PDF)`,
      },
      {
        property: "og:description",
        content: `Download the latest resume of ${siteConfig.name}, ${siteConfig.role}. One-page PDF.`,
      },
      {
        property: "og:see_also",
        content: `${siteConfig.url}${siteConfig.resume.url}`,
      },
      {
        name: "twitter:title",
        content: `${siteConfig.name} — Resume (PDF)`,
      },
      {
        name: "twitter:description",
        content: `Download the resume of ${siteConfig.name}, ${siteConfig.role}.`,
      },
      {
        name: "twitter:label1",
        content: "Document",
      },
      {
        name: "twitter:data1",
        content: `${siteConfig.url}${siteConfig.resume.url}`,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Preload the key font files for faster first paint
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
      // Alternate machine-readable link to the resume PDF for crawlers
      {
        rel: "alternate",
        type: "application/pdf",
        href: `${siteConfig.url}${siteConfig.resume.url}`,
        title: `${siteConfig.name} — Resume (PDF)`,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: siteConfig.name,
          jobTitle: siteConfig.role,
          email: siteConfig.email,
          telephone: siteConfig.phone,
          url: siteConfig.url,
          address: { "@type": "PostalAddress", addressLocality: siteConfig.location },
          subjectOf: {
            "@type": "DigitalDocument",
            name: `${siteConfig.name} — Resume`,
            encodingFormat: "application/pdf",
            url: `${siteConfig.url}${siteConfig.resume.url}`,
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ScriptOnce>{themeBootScript}</ScriptOnce>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <AnimatedBackground />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
