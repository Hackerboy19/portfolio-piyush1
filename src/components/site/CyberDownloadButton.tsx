import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Terminal, Download } from "lucide-react";
import { siteConfig } from "@/config/site";

interface CyberDownloadButtonProps {
  href?: string;
  label?: string;
  filename?: string;
  className?: string;
}

export function CyberDownloadButton({
  href = siteConfig.resume.url,
  label = siteConfig.resume.label,
  filename = siteConfig.resume.filename,
  className = "",
}: CyberDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // External links open in a new tab; same-origin downloads stay in-page so
  // the browser triggers the file download instead of a blank tab.
  const isExternal = /^https?:\/\//i.test(href);

  const handleClick = () => {
    setDownloading(true);
    window.setTimeout(() => setDownloading(false), 1600);
  };

  const text = downloading ? "[ Downloading... ]" : label;

  return (
    <motion.a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
      download={filename}
      aria-label={`Download resume (${filename})`}
      onClick={handleClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={prefersReducedMotion ? undefined : { y: -2 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      animate={{
        boxShadow: hovered
          ? "0 0 12px rgba(0,255,170,0.7), 0 0 28px rgba(0,255,170,0.45), inset 0 0 12px rgba(0,255,170,0.2)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-md border border-[rgba(0,255,170,0.6)] bg-[#05100c] px-5 py-3 font-mono text-sm font-semibold text-[#7CFFCB] no-underline ${className}`}
      style={{ textShadow: "0 0 6px rgba(0,255,170,0.6)" }}
    >
      {/* Scanline sweep on hover */}
      {!prefersReducedMotion && (
        <motion.span
          aria-hidden
          initial={{ x: "-110%" }}
          animate={{ x: hovered ? "110%" : "-110%" }}
          transition={{ duration: 0.9, ease: "easeInOut", repeat: hovered ? Infinity : 0 }}
          className="pointer-events-none absolute inset-y-0 w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,255,170,0.18), transparent)",
          }}
        />
      )}

      {/* Glitch layers on hover */}
      <span className="relative inline-flex items-center gap-2">
        {downloading ? (
          <Download className={`h-4 w-4 ${prefersReducedMotion ? "" : "animate-pulse"}`} />
        ) : (
          <Terminal className="h-4 w-4" />
        )}
        <span className="relative">
          <span className="relative z-10">{text}</span>
          {hovered && !downloading && !prefersReducedMotion && (
            <>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 text-[#ff00aa]"
                style={{ mixBlendMode: "screen" }}
                animate={{ x: [0, -2, 1, -1, 0], y: [0, 1, -1, 0, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {text}
              </motion.span>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 text-[#00e0ff]"
                style={{ mixBlendMode: "screen" }}
                animate={{ x: [0, 2, -1, 1, 0], y: [0, -1, 1, 0, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {text}
              </motion.span>
            </>
          )}
        </span>
        <span
          className={`ml-1 inline-block h-4 w-[2px] bg-[#7CFFCB] ${prefersReducedMotion ? "" : "animate-blink"}`}
          aria-hidden
        />
      </span>
    </motion.a>
  );
}