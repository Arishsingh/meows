"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/**
 * Toggles between dark and light themes by setting `data-theme` on the
 * <html> element. Reads the user's saved preference from localStorage,
 * falling back to the OS-level `prefers-color-scheme`.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const pref: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial: Theme = saved ?? pref;
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-transparent text-sm transition hover:bg-white/5"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
