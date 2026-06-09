/**
 * Layout barrel — re-exports the chrome that wraps every page so feature
 * code can import from a single `@/components/layout` path while the
 * underlying implementations stay in `components/site/`.
 */
export { Navbar } from "@/components/site/Navbar";
export { Footer } from "@/components/site/Footer";
export { AnimatedBackground } from "@/components/site/AnimatedBackground";
export { PageTransition } from "@/components/site/PageTransition";