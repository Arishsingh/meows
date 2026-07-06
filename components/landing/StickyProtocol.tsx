import type { ReactNode } from "react";

/**
 * Cinematic "protocol" / how-it-works as a STICKY scroll sequence — each step pins
 * to the viewport while the next scrolls up beneath it, a deliberate cinematic
 * cadence for an otherwise plain numbered list. Pure CSS `position: sticky` (no JS,
 * no ScrollTrigger) so it is inherently fail-visible and reduced-motion-safe: with
 * sticky unsupported or motion reduced it simply reads as a clean stacked list.
 *
 * Token-only, no shadow. Each step = a big watermark number (kept readable, not a
 * ghost), a title, one line, and an optional visual (canvas/SVG/mockup) as `media`.
 */
export default function StickyProtocol({
  steps,
}: {
  steps: { n?: string; title: string; body: string; media?: ReactNode }[];
}) {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        {steps.map((s, i) => (
          <div data-reveal
            key={i}
            className="sticky top-24 mb-8 grid items-center gap-8 rounded-2xl border border-border bg-card p-8 md:grid-cols-2 md:p-12"
            style={{ top: `calc(6rem + ${i * 0.75}rem)` }}
          >
            <div>
              <span className="font-display text-5xl font-semibold tracking-tight text-muted-foreground md:text-6xl">
                {s.n ?? String(i + 1).padStart(2, "0")}
              </span>
              <h3 data-reveal className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {s.title}
              </h3>
              <p data-reveal className="mt-3 text-base leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
            {s.media && <div data-reveal className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">{s.media}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
