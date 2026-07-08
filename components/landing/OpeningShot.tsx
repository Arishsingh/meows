import type { ReactNode } from "react";

/**
 * Cinematic "opening shot" hero shell — a tall, full-bleed first frame (≈92svh)
 * with the content anchored confidently to ONE corner (bottom-left by default),
 * never dead-centre. Optional generated-image background sits under a GRADIENT
 * scrim (denser where the text block lives, fading across the rest) so the image
 * stays clearly SEEN and the copy stays crisp.
 *
 * FAIL-VISIBLE + token-only: content renders in normal flow over the scrim (the
 * one sanctioned text-over-image case). Pass the hero copy/CTAs as children; put
 * a KineticHeading inside for the signature kinetic H1. No shadow, semantic
 * tokens only. `image` is a public path (e.g. /generated/hero.png); omit it for a
 * clean tinted gradient instead (correct for LIGHT themes).
 */
export default function OpeningShot({
  children,
  image,
  align = "bottom-left",
  className = "",
}: {
  children: ReactNode;
  image?: string;
  align?: "bottom-left" | "center" | "bottom-center";
  className?: string;
}) {
  const place =
    align === "center"
      ? "items-center justify-center text-center"
      : align === "bottom-center"
        ? "items-end justify-center text-center pb-20"
        : "items-end justify-start pb-20 md:pb-28";

  return (
    <section className={`relative flex min-h-[92svh] w-full overflow-hidden ${place} ${className}`}>
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-reveal src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          {/* Gradient scrim: dense at the anchor, fading away — image stays visible, text stays crisp. */}
          <div
            aria-hidden
            className={
              align === "center"
                ? "absolute inset-0 bg-gradient-to-b from-background/40 via-background/55 to-background/75"
                : "absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20"
            }
          />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background to-muted" />
      )}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">{children}</div>
    </section>
  );
}
