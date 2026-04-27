import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Aira" },
      { name: "description", content: "Aira's tech stack and core skills: React, TypeScript, design systems, motion, and more." },
      { property: "og:title", content: "Skills — Aira" },
      { property: "og:description", content: "Aira's tech stack and core skills: React, TypeScript, design systems, motion, and more." },
    ],
  }),
  component: SkillsPage,
});

const SKILLS = [
  { name: "React & TypeScript", level: 95 },
  { name: "UI / UX Design", level: 88 },
  { name: "Tailwind CSS", level: 92 },
  { name: "Motion & Animation", level: 85 },
  { name: "Node.js & APIs", level: 78 },
  { name: "Accessibility", level: 82 },
];

const STACK = ["React", "TypeScript", "Next.js", "TanStack", "Tailwind", "Figma", "Node.js", "Vite", "Zod", "PostgreSQL", "Supabase", "Vercel"];

function SkillBar({ name, level }: { name: string; level: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setWidth(level);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [level]);

  return (
    <div ref={barRef} className="reveal">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--lavender)] via-[var(--peach)] to-[var(--mint)] transition-[width] duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function SkillsPage() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeader
        eyebrow="Skills"
        title={<>My <span className="gradient-text">toolkit</span></>}
        description="The technologies and disciplines I reach for to ship great work."
      />

      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          {SKILLS.map((s) => <SkillBar key={s.name} {...s} />)}
        </div>

        <div className="reveal">
          <h3 className="mb-4 text-lg font-semibold">Tech stack</h3>
          <div className="flex flex-wrap gap-2">
            {STACK.map((s, i) => (
              <span
                key={s}
                style={{ animationDelay: `${i * 50}ms` }}
                className="rounded-full glass px-4 py-2 text-sm font-medium shadow-soft transition-transform hover:-translate-y-0.5 hover:scale-105"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}