import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { siteConfig } from "@/config/site";
import { SkillBar } from "@/components/skills/SkillBar";
import { StackBadges } from "@/components/skills/StackBadges";
import type { Skill } from "@/types";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Piyush" },
      { name: "description", content: "Piyush's tech stack and core skills: React, TypeScript, design systems, motion, and more." },
      { property: "og:title", content: "Skills — Piyush" },
      { property: "og:description", content: "Piyush's tech stack and core skills: React, TypeScript, design systems, motion, and more." },
      { property: "og:url", content: `${siteConfig.url}/skills` },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}/skills` }],
  }),
  component: SkillsPage,
});

const SKILLS: Skill[] = [
  { name: "React & TypeScript", level: 95 },
  { name: "UI / UX Design", level: 88 },
  { name: "Tailwind CSS", level: 92 },
  { name: "Motion & Animation", level: 85 },
  { name: "Node.js & APIs", level: 78 },
  { name: "Accessibility", level: 82 },
];

const STACK = [
  "React",
  "TypeScript",
  "Next.js",
  "TanStack",
  "Tailwind",
  "Figma",
  "Node.js",
  "Vite",
  "Zod",
  "PostgreSQL",
  "Supabase",
  "Vercel",
] as const;

function SkillsPage() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeader
        as="h1"
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
          <StackBadges items={STACK} />
        </div>
      </div>
    </div>
  );
}