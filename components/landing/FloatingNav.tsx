"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Cinematic "floating island" nav — a CENTERED pill that floats over the hero,
 * transparent at the top and gaining a translucent blurred surface once the page
 * scrolls. The signature replacement for a generic full-width sticky bar.
 *
 * FAIL-VISIBLE + token-only: no shadow (separation comes from the border + blur),
 * semantic colour tokens throughout, links always legible. Compose it at the top
 * of app/page.tsx. `links` are in-page anchors (#features) or routes; `cta` is the
 * single primary action.
 */
export default function FloatingNav({
  brand,
  links = [],
  cta,
}: {
  brand: React.ReactNode;
  links?: { label: string; href: string }[];
  cta?: { label: string; href: string };
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <nav
        className={[
          "flex items-center gap-6 rounded-full border px-5 py-2.5 transition-colors duration-300",
          scrolled ? "border-border bg-background/70 backdrop-blur-xl" : "border-transparent bg-transparent",
        ].join(" ")}
      >
        <Link href="/" className="font-display text-base font-semibold tracking-tight text-foreground">
          {brand}
        </Link>
        {links.length > 0 && (
          <ul className="hidden items-center gap-5 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        {cta && (
          <Link
            href={cta.href}
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            {cta.label}
          </Link>
        )}
      </nav>
    </header>
  );
}
