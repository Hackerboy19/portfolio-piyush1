import { Github, Linkedin, Mail, Twitter, type LucideIcon } from "lucide-react";

/**
 * Single source of truth for personal/site info.
 * Edit values here — they propagate to the navbar, footer, hero, contact page,
 * resume button, SEO meta tags, etc. No need to touch components.
 */

export interface SocialLink {
  /** Stable id used as React key */
  id: string;
  /** Visible label / aria-label */
  label: string;
  /** Full URL (https://… or mailto:…) */
  href: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Where the link appears. Omit/empty to show everywhere. */
  show?: Array<"hero" | "contact" | "footer">;
}

export const siteConfig = {
  name: "Piyush Mishra",
  shortName: "Piyush",
  brand: "Piyush Portfolio",
  role: "Creative Developer & Designer",
  email: "piyush@consumableai.com",
  location: "Jaipur, India",
  url: "https://portfolio-piyush1.lovable.app",
  description:
    "Hi, I'm Piyush — a creative developer crafting calm, modern, animated web experiences with care.",
  ogImage:
    "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/fd138bfb-a393-4af3-bdd4-1ee6108caa20",
  /** Used for twitter:site meta — replace with your @handle when you have one. */
  twitterHandle: "@piyush",
  /** Path served from /public — drop a new file at this path to swap the resume. */
  resumeUrl: "/piyush-mishra-resume.pdf",
} as const;

/**
 * Social links — add or remove entries here to update every component
 * (hero, contact page, footer). To remove a link, delete the entry.
 * To add a new platform, import an icon from lucide-react and append.
 */
export const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Hackerboy19",
    icon: Github,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/piyush-mishra-3549a114b/",
    icon: Linkedin,
  },
  {
    id: "email",
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    icon: Mail,
  },
  // Example — uncomment to bring Twitter back:
  // { id: "twitter", label: "Twitter", href: "https://twitter.com/yourhandle", icon: Twitter },
];

// Silences "imported but never used" if Twitter is not in the active list.
void Twitter;

/** Filter helper: get only links that should appear in a given location. */
export function socialLinksFor(location: "hero" | "contact" | "footer"): SocialLink[] {
  return socialLinks.filter((l) => !l.show || l.show.includes(location));
}