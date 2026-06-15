import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark"; // SSR — site default is dark
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Reads the active theme from the `dark` class on <html> — the class that
 * `ThemeToggle` and the no-flash script in `__root.tsx` maintain — and updates
 * when it changes (via a MutationObserver on the class attribute).
 *
 * This app does NOT use `next-themes` (it has no Next.js / theme provider);
 * theme is class-based. This hook is a drop-in replacement for the slice of
 * `next-themes`' `useTheme()` that components here actually use: `{ theme }`.
 */
export function useTheme(): { theme: Theme } {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readTheme());
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return { theme };
}
