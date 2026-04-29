import { Link } from "@tanstack/react-router";
import { siteConfig, socialLinksFor } from "@/config/site";

export function Footer() {
  const links = socialLinksFor("footer");
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="gradient-text text-xl font-bold">{siteConfig.brand}</h3>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Crafting calm, modern interfaces with a touch of magic.
          </p>
        </div>
        <nav className="text-sm" aria-label="Footer">
          <h4 className="mb-3 font-semibold">Explore</h4>
          <ul className="grid grid-cols-2 gap-2 text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/skills" className="hover:text-foreground">Skills</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/testimonials" className="hover:text-foreground">Testimonials</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </nav>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Find me online</h4>
          <div className="flex gap-2">
            {links.map(({ id, href, icon: Icon, label }) => (
              <a
                key={id}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full glass shadow-soft transition-transform hover:scale-110"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.brand} — Made with care.
      </div>
    </footer>
  );
}