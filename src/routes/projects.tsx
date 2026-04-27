import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Github } from "lucide-react";
import { useMemo, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Piyush" },
      { name: "description", content: "Selected work by Piyush: web apps, design systems, and creative experiments." },
      { property: "og:title", content: "Projects — Piyush" },
      { property: "og:description", content: "Selected work by Piyush: web apps, design systems, and creative experiments." },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  title: string;
  desc: string;
  tags: string[];
  category: "Web App" | "Design" | "Open Source";
  gradient: string;
  emoji: string;
  live?: string;
  code?: string;
};

const PROJECTS: Project[] = [
  { title: "Lumen Notes", desc: "Calm, offline-first writing app with markdown and themes.", tags: ["React", "PWA", "IndexedDB"], category: "Web App", gradient: "from-violet-300 via-fuchsia-200 to-pink-200", emoji: "📝", live: "#", code: "#" },
  { title: "Pastel UI Kit", desc: "Open-source design system with 80+ accessible components.", tags: ["Design System", "Tailwind", "TS"], category: "Open Source", gradient: "from-rose-200 via-orange-200 to-amber-200", emoji: "🎨", code: "#" },
  { title: "Sora Dashboard", desc: "Animated analytics dashboard with smooth chart transitions.", tags: ["React", "Charts", "Motion"], category: "Web App", gradient: "from-sky-200 via-cyan-200 to-emerald-200", emoji: "📊", live: "#" },
  { title: "Cozy Cafe", desc: "E-commerce site for an indie cafe brand. Pastel aesthetic.", tags: ["Next.js", "Stripe", "CMS"], category: "Design", gradient: "from-amber-200 via-rose-200 to-pink-200", emoji: "☕", live: "#" },
  { title: "Sakura Player", desc: "Minimal music player with bloom-style audio visuals.", tags: ["WebAudio", "Canvas", "TS"], category: "Web App", gradient: "from-pink-200 via-rose-200 to-purple-200", emoji: "🌸", live: "#", code: "#" },
  { title: "Mochi Icons", desc: "Soft, rounded icon set — 200+ icons, MIT licensed.", tags: ["SVG", "Open Source"], category: "Open Source", gradient: "from-emerald-200 via-teal-200 to-sky-200", emoji: "🍡", code: "#" },
];

const FILTERS = ["All", "Web App", "Design", "Open Source"] as const;

function ProjectsPage() {
  const ref = useReveal<HTMLDivElement>();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const visible = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeader
        eyebrow="Projects"
        title={<>Selected <span className="gradient-text">work</span></>}
        description="A small slice of recent things I've designed, built, or shipped."
      />

      {/* Filters */}
      <div className="reveal mb-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground shadow-glow"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <article
            key={p.title}
            className="reveal group overflow-hidden rounded-2xl glass shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow"
          >
            <div
              className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${p.gradient}`}
            >
              <div className="absolute inset-0 grid place-items-center text-7xl transition-transform duration-500 group-hover:scale-110">
                <span aria-hidden="true">{p.emoji}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold">{p.title}</h3>
                <span className="text-xs text-muted-foreground">{p.category}</span>
              </div>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-secondary/70 px-2.5 py-0.5 text-xs text-secondary-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" /> Live
                  </a>
                )}
                {p.code && (
                  <a href={p.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                    <Github className="h-3.5 w-3.5" /> Code
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}