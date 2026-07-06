"use client";

import { useEffect, useState } from "react";

type Dict = Record<string, Record<string, string>>;

/**
 * Builds a tiny i18n dictionary helper. Pass a dictionary keyed by locale
 * and get back a `useDict` hook, a `setLang` setter that persists to
 * localStorage + `html[lang]`, and the list of available locales.
 *
 * Usage:
 *   const t = makeDict({ en: { hero: "Ship fast" }, fr: { hero: "Livre vite" } });
 *   function Hero() { const d = t.useDict(); return <h1>{d.hero}</h1>; }
 */
export function makeDict<T extends Dict>(d: T) {
  const fallback = "en" as keyof T;
  return {
    useDict(): T[keyof T] {
      const [lang, setLang] = useState<keyof T>(fallback);
      useEffect(() => {
        const saved = localStorage.getItem("lang") as keyof T | null;
        const html = document.documentElement.lang as keyof T;
        const initial: keyof T =
          saved && d[saved]
            ? saved
            : d[html]
            ? html
            : fallback;
        setLang(initial);
      }, []);
      return d[lang] ?? d[fallback];
    },
    setLang(lang: keyof T) {
      document.documentElement.lang = String(lang);
      localStorage.setItem("lang", String(lang));
    },
    available: Object.keys(d) as (keyof T)[],
  };
}
