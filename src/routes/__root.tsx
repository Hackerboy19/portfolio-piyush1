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
      { title: "Piyush — Creative Developer & Designer" },
      {
        name: "description",
        content:
          "Modern animated portfolio of Piyush — a creative developer building calm, fast, beautiful interfaces.",
      },
      { name: "author", content: "Piyush" },
      { property: "og:title", content: "Piyush — Creative Developer & Designer" },
      {
        property: "og:description",
        content:
          "Modern animated portfolio of Piyush — a creative developer building calm, fast, beautiful interfaces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@aira_dev" },
      { name: "twitter:title", content: "Piyush — Creative Developer & Designer" },
      { name: "description", content: "I design and build calm, fast, beautifully animated interfaces — blending modern web tech with a soft anime aesthetic." },
      { property: "og:description", content: "I design and build calm, fast, beautifully animated interfaces — blending modern web tech with a soft anime aesthetic." },
      { name: "twitter:description", content: "I design and build calm, fast, beautifully animated interfaces — blending modern web tech with a soft anime aesthetic." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/fd138bfb-a393-4af3-bdd4-1ee6108caa20" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/fd138bfb-a393-4af3-bdd4-1ee6108caa20" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
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
    </ThemeProvider>
  );
}
