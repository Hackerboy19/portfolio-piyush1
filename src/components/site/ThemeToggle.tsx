import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full glass shadow-soft transition-transform hover:scale-110 active:scale-95"
    >
      <Sun
        className={`h-4 w-4 transition-all ${theme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0"} absolute`}
      />
      <Moon
        className={`h-4 w-4 transition-all ${theme === "dark" ? "scale-100 rotate-0" : "scale-0 -rotate-90"} absolute`}
      />
    </button>
  );
}