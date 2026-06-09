import { ExternalLink, Github } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SmartImage, EMPTY_BLUR } from "@/components/site/SmartImage";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project: p }: ProjectCardProps) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
      animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl glass shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow"
    >
      <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${p.gradient}`}>
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
        {p.live && (
          <a
            href={p.live}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${p.title}`}
            className="absolute inset-0 grid place-items-center bg-foreground/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-foreground shadow-glow">
              <ExternalLink className="h-3.5 w-3.5" /> View Project
            </span>
          </a>
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
            <span
              key={t}
              className="rounded-full bg-secondary/70 px-2.5 py-0.5 text-xs text-secondary-foreground"
            >
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
            <a
              href={p.code}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" /> Code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}