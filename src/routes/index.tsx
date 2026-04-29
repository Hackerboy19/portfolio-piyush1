import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import heroCharacter from "@/assets/hero-character.png";
import { useTyping } from "@/hooks/use-typing";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { siteConfig, socialLinksFor } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${siteConfig.name} — ${siteConfig.role}` },
      { name: "description", content: siteConfig.description },
      { property: "og:title", content: `${siteConfig.name} — ${siteConfig.role}` },
      { property: "og:description", content: siteConfig.description },
      { property: "og:url", content: siteConfig.url },
      { name: "twitter:title", content: `${siteConfig.name} — ${siteConfig.role}` },
      { name: "twitter:description", content: siteConfig.description },
    ],
  }),
  component: Index,
});

const ROLES = ["a Frontend Developer.", "a UI/UX Designer.", "a Creative Coder.", "an Anime Lover."];

function Index() {
  const typed = useTyping(ROLES);
  const ref = useReveal<HTMLDivElement>();
  const heroLinks = socialLinksFor("hero");

  return (
    <div ref={ref}>
      {/* HERO */}
      <section className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:gap-6 md:pt-20">
        <div className="flex flex-col justify-center">
          <span className="reveal inline-flex w-fit items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Available for new projects
          </span>
          <h1 className="reveal mt-5 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Hello, I am{" "}
            <span className="gradient-text">{siteConfig.shortName}</span>
            <br />
            <span className="text-2xl text-muted-foreground sm:text-3xl md:text-4xl">
              I&rsquo;m{" "}
              <span className="text-foreground">{typed}</span>
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[2px] bg-primary animate-blink"
              />
            </span>
          </h1>
          <p className="reveal mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
            I design and build calm, fast, beautifully animated interfaces — blending modern web
            tech with a soft anime aesthetic.
          </p>

          <div className="reveal mt-7 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              View Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={siteConfig.resumeUrl}
              download
              className="group inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold shadow-soft transition-all hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              Download Resume
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold shadow-soft transition-all hover:-translate-y-0.5"
            >
              Contact Me
            </Link>
          </div>

          <div className="reveal mt-7 flex items-center gap-3">
            {heroLinks.map(({ id, href, icon: Icon, label }) => (
              <a
                key={id}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft transition-transform hover:-translate-y-0.5 hover:scale-110"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Right: Anime character in glass frame */}
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
          <div className="absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-[var(--lavender)] via-[var(--peach)] to-[var(--mint)] opacity-70 blur-2xl" />
          <div className="relative animate-float overflow-hidden rounded-[2.5rem] glass p-2 shadow-glow">
            <img
              src={heroCharacter}
              alt={`Anime-style illustration of ${siteConfig.shortName} holding a laptop`}
              width={1024}
              height={1024}
              decoding="async"
              fetchPriority="high"
              loading="eager"
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 40vw, 480px"
              className="h-auto w-full max-w-sm rounded-[2rem]"
            />
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeader
          eyebrow="What I do"
          title={<>Crafted with <span className="gradient-text">care</span></>}
          description="A focused toolkit for building delightful product experiences end-to-end."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Design Systems", desc: "Reusable, accessible component libraries that scale." },
            { title: "Web Apps", desc: "Snappy, modern React + TypeScript applications." },
            { title: "Motion & Polish", desc: "Subtle animation that brings interfaces to life." },
          ].map((c) => (
            <article
              key={c.title}
              className="reveal group glass rounded-2xl p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
