import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin, Mail, MapPin, Send, Twitter } from "lucide-react";
import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Piyush" },
      { name: "description", content: "Get in touch with Piyush for collaborations, freelance projects, or just to say hi." },
      { property: "og:title", content: "Contact — Piyush" },
      { property: "og:description", content: "Get in touch with Piyush for collaborations, freelance projects, or just to say hi." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const ref = useReveal<HTMLDivElement>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();
    if (!name || !email || !message) {
      setError("Please fill in every field.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    setStatus("sending");
    // Simulated submit — wire to your backend / email service
    setTimeout(() => setStatus("sent"), 900);
  };

  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeader
        eyebrow="Contact"
        title={<>Let&rsquo;s build something <span className="gradient-text">together</span></>}
        description="Got a project, idea, or just want to say hi? Drop a message — I read every one."
      />

      <div className="grid gap-8 md:grid-cols-5">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="reveal md:col-span-3 rounded-2xl glass p-6 shadow-soft sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Your name</span>
              <input
                name="name"
                required
                placeholder="Hayao Miyazaki"
                className="mt-1.5 w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                name="email"
                type="email"
                required
                placeholder="hi@example.com"
                className="mt-1.5 w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-medium">Message</span>
            <textarea
              name="message"
              required
              rows={6}
              placeholder="Tell me a bit about what you're working on…"
              className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </label>

          {error && (
            <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>
          )}
          {status === "sent" && (
            <p className="mt-3 text-sm font-medium text-primary">Thanks! Your message is on its way ✨</p>
          )}

          <button
            type="submit"
            disabled={status !== "idle" && status !== "sent"}
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-70"
          >
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            {status === "sending" ? "Sending…" : status === "sent" ? "Sent!" : "Send message"}
          </button>
        </form>

        {/* Aside */}
        <aside className="reveal md:col-span-2 space-y-4">
          <div className="rounded-2xl glass p-6 shadow-soft">
            <h3 className="text-base font-semibold">Reach me directly</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:piyush@consumableai.com" className="hover:text-foreground">piyush@consumableai.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Jaipur, India
              </li>
            </ul>
          </div>

          <div className="rounded-2xl glass p-6 shadow-soft">
            <h3 className="text-base font-semibold">Find me online</h3>
            <div className="mt-3 flex gap-2">
              {[
                { href: "https://github.com/Hackerboy19", icon: Github, label: "GitHub" },
                { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
                { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-secondary/70 transition-transform hover:-translate-y-0.5 hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}