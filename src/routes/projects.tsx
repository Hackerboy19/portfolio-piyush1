import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Github } from "lucide-react";
import { useMemo, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { siteConfig } from "@/config/site";
import { SmartImage, EMPTY_BLUR } from "@/components/site/SmartImage";

export const Route = createFileRoute("/projects")({
  head: () => {
    const title = `Projects — ${siteConfig.name} | Web, SaaS & Design Work`;
    const description =
      "Explore selected projects by Piyush Mishra: e-commerce platforms, AI SaaS products, agency websites, and modern UI/UX concepts built with React and TypeScript.";
    const url = `${siteConfig.url}/projects`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content:
            "Piyush Mishra projects, React portfolio, web developer projects, SaaS, e-commerce, UI UX, frontend developer India",
        },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: siteConfig.ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: siteConfig.ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url,
            author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
            hasPart: PROJECTS.map((p) => ({
              "@type": "CreativeWork",
              name: p.title,
              about: p.category,
              description: p.desc,
              url: p.live,
            })),
          }),
        },
      ],
    };
  },
  component: ProjectsPage,
});

type Category =
  | "E-Commerce"
  | "AI & SaaS"
  | "Agency"
  | "Spiritual"
  | "Concepts";

type Project = {
  title: string;
  desc: string;
  tags: string[];
  category: Category;
  gradient: string;
  emoji: string;
  image?: string;
  live?: string;
  code?: string;
};

const PROJECTS: Project[] = [
  {
    title: "Coitonic",
    desc: "A cutting-edge e-commerce platform tailored for gym enthusiasts, offering high-performance activewear with a seamless UX, secure payments, and a sleek product showcase.",
    tags: ["E-Commerce", "Payments", "UX"],
    category: "E-Commerce",
    gradient: "from-rose-200 via-orange-200 to-amber-200",
    emoji: "🏋️",
    live: "https://coitonic.com/",
  },
  {
    title: "Consumable AI",
    desc: "A robust AI platform that automates SEO/AEO growth, performs target-audience content research, and fixes technical site issues to drive organic marketing success.",
    tags: ["AI", "SaaS", "SEO"],
    category: "AI & SaaS",
    gradient: "from-violet-300 via-fuchsia-200 to-pink-200",
    emoji: "🤖",
    live: "https://www.consumableai.com/",
  },
  {
    title: "Fortexatech",
    desc: "A premium digital agency website showcasing high-impact digital experiences across web development, mobile app engineering, and SEO services.",
    tags: ["Agency", "Web", "Mobile"],
    category: "Agency",
    gradient: "from-sky-200 via-cyan-200 to-emerald-200",
    emoji: "🏢",
    live: "https://fortexatech.com/",
  },
  {
    title: "Mahayagya",
    desc: "A comprehensive digital platform for sacred Vedic events — live streaming of past events, digital donation portals, and a detailed community directory.",
    tags: ["Streaming", "Donations", "Community"],
    category: "Spiritual",
    gradient: "from-amber-200 via-rose-200 to-pink-200",
    emoji: "🕉️",
    live: "http://mahayagya.com/",
  },
  {
    title: "Shri Jeen Mata Mandir Trust",
    desc: "Official portal for the revered Jeen Mata temple in Rajasthan. Integrates room booking, online prasad delivery, live darshan, and aarti participation.",
    tags: ["Booking", "Live", "Temple"],
    category: "Spiritual",
    gradient: "from-pink-200 via-rose-200 to-purple-200",
    emoji: "🛕",
    live: "https://shrijeenmata.org/",
  },
  {
    title: "UI/UX Concept Alpha",
    desc: "A staging environment project demonstrating versatile frontend development skills, responsive design principles, and modern web architecture.",
    tags: ["Frontend", "Responsive", "Concept"],
    category: "Concepts",
    gradient: "from-emerald-200 via-teal-200 to-sky-200",
    emoji: "🎨",
    live: "https://lightslategray-llama-254032.hostingersite.com/",
  },
  {
    title: "UI/UX Concept Beta",
    desc: "A conceptual web application showcasing dynamic layouts, interactive UI components, and seamless staging deployment.",
    tags: ["UI", "Interactive", "Staging"],
    category: "Concepts",
    gradient: "from-indigo-200 via-sky-200 to-cyan-200",
    emoji: "✨",
    live: "https://lightslategray-nightingale-732988.hostingersite.com/",
  },
];

const FILTERS = ["All", "E-Commerce", "AI & SaaS", "Agency", "Spiritual", "Concepts"] as const;

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
            className="reveal group overflow-hidden rounded-2xl glass shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow [content-visibility:auto] [contain-intrinsic-size:420px]"
          >
            <div
              className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${p.gradient}`}
            >
              {p.image ? (
                <SmartImage
                  src={p.image}
                  alt={`${p.title} preview`}
                  blurDataURL={EMPTY_BLUR}
                  aspectRatio="4 / 3"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-7xl transition-transform duration-500 group-hover:scale-110">
                  <span aria-hidden="true">{p.emoji}</span>
                </div>
              )}
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
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${p.title} website`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Visit Website
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