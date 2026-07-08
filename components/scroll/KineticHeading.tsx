"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Kinetic display heading — splits the REAL heading text into word spans and
 * staggers them up into place as the heading enters view. This is the SANCTIONED
 * way to do kinetic type here: the text is rendered exactly ONCE (no duplicate-DOM
 * "ghost" the banned split/scramble/typewriter effects cause), and the end state is
 * always the full, solid heading.
 *
 * FAIL-VISIBLE: the words are visible in SSR/markup. JS only hides-then-animates
 * them when reduced-motion is off; a 1.8s failsafe force-clears to visible, so a
 * stuck ScrollTrigger can never leave the headline blank. Use for the hero H1
 * (or one big section H2). Colour ONE word with `accent` (kept solid — never a
 * gradient). Everything else stays `text-foreground` via your className.
 */
export default function KineticHeading({
  text,
  as = "h1",
  className,
  accent,
  accentClassName = "text-primary",
}: {
  text: string;
  as?: "h1" | "h2";
  className?: string;
  /** exactly one word (case-sensitive, punctuation-stripped) to colour with the accent. */
  accent?: string;
  accentClassName?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-kw]"));
    if (!words.length) return;
    let failsafe = 0;
    try {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(words, { yPercent: 55, opacity: 0 });
      const tween = gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      // Never leave the headline hidden: if it hasn't animated in 1.8s, reveal it.
      failsafe = window.setTimeout(() => gsap.set(words, { yPercent: 0, opacity: 1, clearProps: "transform,opacity" }), 1800);
      return () => {
        window.clearTimeout(failsafe);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    } catch {
      gsap.set(words, { yPercent: 0, opacity: 1, clearProps: "transform,opacity" });
    }
  }, []);

  const words = text.split(" ");
  const norm = (w: string) => w.replace(/[^\p{L}\p{N}]/gu, "");
  // Render each word in its own inline-block wrapper, with the inter-word space as a
  // SEPARATE text node BETWEEN wrappers — NOT a trailing space inside an inline-block
  // (trailing whitespace inside an inline-block collapses, joining words into "in60").
  const inner: ReactNode[] = [];
  words.forEach((w, i) => {
    inner.push(
      <span key={`w${i}`} className="inline-block" style={{ verticalAlign: "bottom" }}>
        <span data-kw className={`inline-block ${accent && norm(w) === accent ? accentClassName : ""}`}>{w}</span>
      </span>,
    );
    if (i < words.length - 1) inner.push(<span key={`s${i}`}> </span>);
  });

  return as === "h2" ? (
    <h2 data-reveal ref={ref} className={className}>{inner}</h2>
  ) : (
    <h1 data-reveal ref={ref} className={className}>{inner}</h1>
  );
}
