import Link from "next/link";
import { cookies } from "next/headers";

import FloatingNav from "@/components/landing/FloatingNav";
import OpeningShot from "@/components/landing/OpeningShot";
import KineticHeading from "@/components/scroll/KineticHeading";
import { Button } from "@/components/ui/button";

const email = "mailto:hello@lumen.studio?subject=Lumen%20project%20inquiry";

type Variant = {
  eyebrow: string;
  headline: string;
  accent: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
};

const variants: Record<"a" | "b", Variant> = {
  a: {
    eyebrow: "01 / Selected work",
    headline: "First impressions made exact.",
    accent: "exact",
    subheadline:
      "Lumen is a calm portfolio for solo creators and small studios who want the work to land clearly before the conversation starts.",
    primaryCta: "See selected work",
    secondaryCta: "Ask about a project",
  },
  b: {
    eyebrow: "01 / Selected work",
    headline: "Attention, shaped into trust.",
    accent: "trust",
    subheadline:
      "Lumen gives your projects the polish and breathing room they need so the right clients know exactly why to reach out.",
    primaryCta: "Browse the portfolio",
    secondaryCta: "Send an inquiry",
  },
};

export default function Home() {
  const cookieBucket = cookies().get("ab_hero")?.value;
  let randomBucket: "a" | "b" = "a";
  if (Math.floor(Math.random() * 2) === 1) randomBucket = "b";
  let bucket: "a" | "b" = randomBucket;
  if (cookieBucket === "a" || cookieBucket === "b") bucket = cookieBucket;
  const variant = variants[bucket];
  const shouldSeedCookie = cookieBucket !== "a" && cookieBucket !== "b";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNav brand="Lumen" cta={{ label: "Start a project", href: email }} />

      <OpeningShot image="/generated/hero.png" align="bottom-left" className="pt-28 md:pt-32">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-16">
          <div className="max-w-2xl">
            <p data-reveal className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground">{variant.eyebrow}</p>
            <div className="mt-6 h-px w-20 bg-border" aria-hidden />
            <KineticHeading
              text={variant.headline}
              accent={variant.accent}
              className="mt-6 font-display text-[clamp(2.75rem,6vw,5.2rem)] leading-[0.92] tracking-[-0.04em] text-foreground"
            />
            <p data-reveal className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">{variant.subheadline}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href={email}>{variant.primaryCta}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link href={email}>{variant.secondaryCta}</Link>
              </Button>
            </div>
            <p data-reveal className="mt-6 text-sm text-muted-foreground">Replies usually land in one business day.</p>
            {shouldSeedCookie && (
              <img data-reveal
                src={`/ab-hero?bucket=${bucket}`}
                alt=""
                aria-hidden
                className="pointer-events-none absolute h-px w-px opacity-0"
              />
            )}
          </div>

          <figure data-reveal className="overflow-hidden rounded-[0.625rem] border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-reveal
              src="/generated/texture.png"
              alt="Abstract portfolio texture"
              className="aspect-[4/5] w-full object-cover"
            />
            <figcaption className="border-t border-border px-5 py-4">
              <p data-reveal className="font-display text-base leading-snug text-foreground">
                A curated presentation for work that needs room to breathe.
              </p>
              <p data-reveal className="mt-1 text-sm leading-6 text-muted-foreground">
                Clear structure, quiet confidence, and a path to inquiry.
              </p>
            </figcaption>
          </figure>
        </div>
      </OpeningShot>
    </main>
  );
}
