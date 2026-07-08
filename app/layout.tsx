import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { activeFontPairing } from "@/lib/fonts";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { ClickToEdit } from "@/components/dev/ClickToEdit";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  applicationName: "Taskline",
  keywords: ["taskline", "todo", "tasks", "projects", "reminders"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Resolve once at render-time. The pairing is a static (build-baked)
  // decision, but reading via `activeFontPairing()` keeps the override
  // chain (env vars, planner aesthetic) honoured without bringing logic
  // into the layout itself.
  const fonts = activeFontPairing();
  // Bridge family-specific CSS vars (e.g. --font-inter, --font-space-grotesk)
  // exposed by next/font/local to ROLE-specific vars (--font-body /
  // --font-display / --font-mono) the rest of the app references through
  // Tailwind's font-body / font-display / font-mono utilities. This is
  // what makes a single `font-display` className resolve to whichever
  // family the active pairing assigned to the display role.
  const roleVars = {
    "--font-display": fonts.displayVar,
    "--font-body": fonts.bodyVar,
    "--font-mono": fonts.monoVar,
  } as CSSProperties;
  return (
    <html lang="en" className={fonts.className} style={roleVars}>
      <body className="font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Task Flow",
              description: "Plan tasks, attach files, and finish faster.",
              category: "Productivity software",
              brand: {
                "@type": "Brand",
                name: "Task Flow",
              },
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/`,
            }),
          }}
        />
        {/* Enable scroll-reveal BEFORE paint (so revealable content starts hidden
            with no flash). Fail-visible: if JS is off or reduced-motion is set,
            the class is never added and everything renders fully visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var p=location.pathname;var app=p==='/app'||p.indexOf('/app/')===0||p==='/dashboard'||p.indexOf('/dashboard/')===0;if(!app&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reveal-on')}catch(e){}",
          }}
        />
        {/* Lenis smooth scroll — global, but self-disables on reduced-motion and on
            coarse-pointer (touch) viewports < 768px, where native scroll is expected. */}
        <SmoothScroll />
        {children}
        <ScrollReveal />
        {/* Dev-only click-to-edit bridge for the Moonshift Studio. Stripped from the
            production build (NODE_ENV !== "production"), so real visitors never get it. */}
        {process.env.NODE_ENV !== "production" && <ClickToEdit />}
      </body>
    </html>
  );
}
