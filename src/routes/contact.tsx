import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { siteConfig, socialLinksFor } from "@/config/site";
import { submitContactMessage } from "@/server/contact.functions";
import { CyberDownloadButton } from "@/components/site/CyberDownloadButton";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${siteConfig.name}` },
      {
        name: "description",
        content: `Get in touch with ${siteConfig.shortName} for collaborations, freelance projects, or just to say hi.`,
      },
      { property: "og:title", content: `Contact — ${siteConfig.name}` },
      {
        property: "og:description",
        content: `Get in touch with ${siteConfig.shortName} for collaborations, freelance projects, or just to say hi.`,
      },
      { property: "og:url", content: `${siteConfig.url}/contact` },
      { name: "twitter:title", content: `Contact — ${siteConfig.name}` },
      {
        name: "twitter:description",
        content: `Get in touch with ${siteConfig.shortName} for collaborations or freelance work.`,
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const ref = useReveal<HTMLDivElement>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const links = socialLinksFor("contact");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
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
    try {
      const res = await submitContactMessage({
        data: { name, email, message, source: "contact-page" },
      });
      if (res.ok) {
        setStatus("sent");
        toast.success("Message sent!", {
          description: "Thanks for reaching out — I'll get back to you soon.",
        });
        formEl.reset();
      } else {
        setStatus("idle");
        setError(res.error);
        toast.error("Could not send message", { description: res.error });
      }
    } catch (err) {
      console.error(err);
      setStatus("idle");
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      toast.error("Could not send message", { description: msg });
    }
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
                maxLength={100}
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
                maxLength={255}
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
              maxLength={5000}
              placeholder="Tell me a bit about what you're working on…"
              className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </label>

          {error && (
            <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>
          )}
          {status === "sent" && (
            <p className="mt-3 text-sm font-medium text-primary">
              Thanks! Your message is on its way ✨
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={status === "sending"}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-70"
            >
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              {status === "sending" ? "Sending…" : status === "sent" ? "Sent!" : "Send message"}
            </button>
            <CyberDownloadButton />
          </div>
        </form>

        {/* Aside */}
        <aside className="reveal md:col-span-2 space-y-4">
          <div className="rounded-2xl glass p-6 shadow-soft">
            <h3 className="text-base font-semibold">Reach me directly</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href={siteConfig.phoneHref} className="hover:text-foreground">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> {siteConfig.location}
              </li>
            </ul>
          </div>

          <div className="rounded-2xl glass p-6 shadow-soft">
            <h3 className="text-base font-semibold">Find me online</h3>
            <div className="mt-3 flex gap-2">
              {links.map(({ id, href, icon: Icon, label }) => (
                <a
                  key={id}
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