import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * SmartImage — responsive <picture> with AVIF/WebP fallback chain,
 * lazy-loading, async decoding, and a blur-up placeholder.
 *
 * - `src`: original image URL (jpg/png) used as the final fallback.
 * - `widths`: candidate widths used to generate srcSet entries.
 * - `transform(src, format, width)`: optional URL builder for a CDN
 *   (Cloudinary, imgix, etc). When omitted, the original `src` is reused
 *   for every entry — safe but no real responsive gain. Wire this up
 *   when you put images behind a CDN.
 * - `blurDataURL`: tiny base64 (LQIP) shown until the full image decodes.
 */
export type SmartImageProps = {
  src: string;
  alt: string;
  widths?: number[];
  sizes?: string;
  className?: string;
  imgClassName?: string;
  blurDataURL?: string;
  aspectRatio?: string;
  transform?: (src: string, format: "avif" | "webp" | "orig", width: number) => string;
};

const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280];

function buildSrcSet(
  src: string,
  format: "avif" | "webp" | "orig",
  widths: number[],
  transform?: SmartImageProps["transform"],
): string {
  return widths
    .map((w) => `${transform ? transform(src, format, w) : src} ${w}w`)
    .join(", ");
}

export function SmartImage({
  src,
  alt,
  widths = DEFAULT_WIDTHS,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
  imgClassName,
  blurDataURL,
  aspectRatio = "4 / 3",
  transform,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Catch images that loaded before hydration (SSR / cached).
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio,
        backgroundImage: blurDataURL ? `url("${blurDataURL}")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <picture>
        <source
          type="image/avif"
          srcSet={buildSrcSet(src, "avif", widths, transform)}
          sizes={sizes}
        />
        <source
          type="image/webp"
          srcSet={buildSrcSet(src, "webp", widths, transform)}
          sizes={sizes}
        />
        <img
          ref={ref}
          src={src}
          srcSet={buildSrcSet(src, "orig", widths, transform)}
          sizes={sizes}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[opacity,filter,transform] duration-500",
            loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105",
            imgClassName,
          )}
        />
      </picture>
    </div>
  );
}

/**
 * 1x1 transparent PNG — neutral placeholder when no LQIP is available.
 * Replace with a real base64 LQIP per-image for the best blur-up effect
 * (generate with `sharp` or `plaiceholder` at build time).
 */
export const EMPTY_BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=";