import { createFileRoute } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Piyush" },
      { name: "description", content: "Kind words from teammates and clients Piyush has worked with." },
      { property: "og:title", content: "Testimonials — Piyush" },
      { property: "og:description", content: "Kind words from teammates and clients Piyush has worked with." },
      { property: "og:url", content: `${siteConfig.url}/testimonials` },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}/testimonials` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          QUOTES.map((q) => ({
            "@context": "https://schema.org",
            "@type": "Review",
            reviewBody: q.text,
            author: { "@type": "Person", name: q.name, jobTitle: q.role },
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            itemReviewed: {
              "@type": "Person",
              name: siteConfig.name,
              url: siteConfig.url,
            },
          })),
        ),
      },
    ],
  }),
  component: TestimonialsPage,
});

const QUOTES = [
  { name: "Mika S.", role: "Product Lead, Lumen", text: "Piyush shipped a calm, fast UI that our users keep mentioning. Easy to work with and obsessed with the details.", avatar: "M" },
  { name: "Jonas T.", role: "Founder, Cozy Cafe", text: "Beautiful brand site, and it actually loads fast. Sales jumped after launch — couldn't be happier.", avatar: "J" },
  { name: "Priya K.", role: "Engineering Manager", text: "One of the strongest frontend collaborators I've worked with. Thoughtful, kind, and incredibly fast.", avatar: "P" },
  { name: "Ren H.", role: "Designer", text: "Piyush understood the design intent so well that the final build felt better than the mockups.", avatar: "R" },
  { name: "Lina O.", role: "PM, Sora", text: "Animations that finally made the dashboard feel premium. Tiny touches, huge difference.", avatar: "L" },
  { name: "Daniel V.", role: "CTO, Mochi", text: "We hired Piyush for a sprint. Two months later we're still finding new little delights they added.", avatar: "D" },
];

function TestimonialsPage() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeader
        as="h1"
        eyebrow="Testimonials"
        title={<>Kind <span className="gradient-text">words</span></>}
        description="What people I've worked with say."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {QUOTES.map((q) => (
          <figure
            key={q.name}
            className="reveal relative rounded-2xl glass p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow"
          >
            <Quote className="absolute right-5 top-5 h-6 w-6 text-primary/30" />
            <blockquote className="text-sm leading-relaxed text-foreground/90">
              {q.text}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[var(--lavender)] via-[var(--peach)] to-[var(--mint)] font-bold text-foreground">
                {q.avatar}
              </span>
              <span>
                <span className="block text-sm font-semibold">{q.name}</span>
                <span className="block text-xs text-muted-foreground">{q.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}