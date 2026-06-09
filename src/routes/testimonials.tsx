import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { siteConfig } from "@/config/site";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import type { Testimonial } from "@/types";

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

const QUOTES: Testimonial[] = [
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
          <TestimonialCard key={q.name} {...q} />
        ))}
      </div>
    </div>
  );
}