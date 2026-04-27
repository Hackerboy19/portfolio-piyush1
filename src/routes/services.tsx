import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Code2,
  Layers,
  Palette,
  Rocket,
  Search,
  Smartphone,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Piyush Portfolio" },
      {
        name: "description",
        content:
          "Services by Piyush: web design, frontend engineering, Android & iOS app development, SEO, and digital marketing.",
      },
      { property: "og:title", content: "Services — Piyush Portfolio" },
      {
        property: "og:description",
        content:
          "Services by Piyush: web design, frontend engineering, Android & iOS app development, SEO, and digital marketing.",
      },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  { icon: Palette, title: "UI / UX Design", desc: "From wireframes to polished, accessible interfaces — designed in Figma, ready to ship." },
  { icon: Code2, title: "Frontend Engineering", desc: "Modern React + TypeScript apps that are fast, typed, and a joy to maintain." },
  { icon: Smartphone, title: "Android & iOS App Development", desc: "Cross-platform mobile apps with native feel — built with React Native and Flutter." },
  { icon: Search, title: "SEO Optimization", desc: "Technical SEO, on-page tuning, and Core Web Vitals work to help you rank and convert." },
  { icon: BarChart3, title: "Digital Marketing", desc: "Performance campaigns, analytics, and content strategy that turn traffic into customers." },
  { icon: Layers, title: "Design Systems", desc: "Reusable component libraries with tokens, theming, and rock-solid accessibility." },
  { icon: Wand2, title: "Motion & Micro-interactions", desc: "Subtle, performant animation that brings personality to every interaction." },
  { icon: Rocket, title: "Performance Audits", desc: "Identify bottlenecks and ship Lighthouse-friendly experiences across devices." },
  { icon: Sparkles, title: "Creative Coding", desc: "Hero animations, generative art, and one-of-a-kind landing experiences." },
];

function ServicesPage() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeader
        eyebrow="Services"
        title={<>What I can <span className="gradient-text">build for you</span></>}
        description="Pick what you need — or let's talk and shape something together."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ icon: Icon, title, desc }) => (
          <article
            key={title}
            className="reveal group relative overflow-hidden rounded-2xl glass p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow"
          >
            {/* Gradient ring on hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--lavender)] via-[var(--peach)] to-[var(--mint)] opacity-0 transition-opacity duration-500 group-hover:opacity-20"
            />
            <div className="relative">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}