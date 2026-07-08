/**
 * Cinematic "manifesto" band — a deliberate moment of stillness between busier
 * sections: a quiet, near-solid surface carrying ONE confident contrast statement
 * (the common way → "We focus on:" the better way). Large, restrained type; the
 * payoff line lands in solid foreground while the setup stays muted.
 *
 * FAIL-VISIBLE + token-only: plain markup, visible by default; the scaffold's
 * global AOS reveals the lines as they enter view (the `data-reveal` hooks are
 * advisory — content never depends on JS to appear). No shadow, semantic tokens.
 */
export default function Manifesto({
  kicker,
  setup,
  payoff,
}: {
  /** small eyebrow, e.g. "Our approach" */
  kicker?: string;
  /** the muted "most people do X" line */
  setup: string;
  /** the solid, confident "we do Y" line — the emphasis */
  payoff: string;
}) {
  return (
    <section className="bg-muted px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        {kicker && (
          <p data-reveal className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {kicker}
          </p>
        )}
        <p data-reveal className="font-display text-2xl leading-snug tracking-tight text-muted-foreground md:text-4xl">
          {setup}
        </p>
        <p data-reveal className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
          {payoff}
        </p>
      </div>
    </section>
  );
}
