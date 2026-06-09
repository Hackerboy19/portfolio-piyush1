import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";

export function TestimonialCard({ name, role, text, avatar }: Testimonial) {
  return (
    <figure className="reveal relative rounded-2xl glass p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow">
      <Quote className="absolute right-5 top-5 h-6 w-6 text-primary/30" aria-hidden="true" />
      <blockquote className="text-sm leading-relaxed text-foreground/90">{text}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--lavender)] via-[var(--peach)] to-[var(--mint)] font-bold text-foreground"
        >
          {avatar}
        </span>
        <span>
          <span className="block text-sm font-semibold">{name}</span>
          <span className="block text-xs text-muted-foreground">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}