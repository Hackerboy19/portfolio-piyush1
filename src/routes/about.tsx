import { createFileRoute, Link } from "@tanstack/react-router";
import { Coffee, Heart, MapPin, Sparkles } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import heroCharacter from "@/assets/hero-character.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Piyush" },
      { name: "description", content: "Learn about Piyush: my story, values, and what I love to build on the web." },
      { property: "og:title", content: "About — Piyush" },
      { property: "og:description", content: "Learn about Piyush: my story, values, and what I love to build on the web." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeader
        eyebrow="About"
        title={<>Hi, I&rsquo;m <span className="gradient-text">Piyush</span></>}
        description="A creative developer with a soft spot for animation, calm UI, and tiny delightful details."
      />

      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="reveal relative mx-auto w-full max-w-sm">
          <div className="absolute inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--lavender)] via-[var(--peach)] to-[var(--mint)] opacity-60 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] glass p-2 shadow-glow">
            <img
              src={heroCharacter}
              alt="Illustrated portrait of Piyush"
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 80vw, 384px"
              className="h-auto w-full rounded-[1.6rem]"
            />
          </div>
        </div>

        <div className="reveal space-y-4 text-base text-muted-foreground sm:text-lg">
          <p>
            I&rsquo;ve been designing and building on the web for over five years. My favourite
            kind of problem sits where engineering meets a feeling — making things both fast
            and quietly joyful to use.
          </p>
          <p>
            Outside of work I draw a little, drink a lot of tea, and play through cosy indie
            games. I believe small details add up to something magical.
          </p>

          <ul className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            {[
              { icon: MapPin, label: "Based in Jaipur" },
              { icon: Coffee, label: "Tea over coffee" },
              { icon: Heart, label: "Animation lover" },
              { icon: Sparkles, label: "Detail obsessed" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 rounded-xl glass px-4 py-2.5 text-sm text-foreground shadow-soft">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5"
            >
              Let&rsquo;s work together
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}