"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll-scrubbed parallax — translates its children as the section scrolls past,
 * for premium depth on a hero visual or a decorative layer. Award sites use this;
 * the per-element AOS reveal does not give it.
 *
 * FAIL-VISIBLE by design: children render at their natural position in SSR/markup
 * (no opacity hiding, no clipping). The transform is added only in the browser,
 * only when JS is on AND reduced-motion is off — so no-JS, reduced-motion, or a
 * GSAP failure all leave the content fully visible and in place.
 *
 * Wrap a hero IMAGE / mockup / decorative shape — NOT body text or a whole section
 * (a moving paragraph hurts readability). Keep `speed` small (0.1–0.3).
 */
export default function Parallax({
  children,
  speed = 0.2,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      gsap.registerPlugin(ScrollTrigger);
      const dist = Math.max(-180, Math.min(180, speed * 200));
      const tween = gsap.fromTo(
        el,
        { y: -dist },
        {
          y: dist,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    } catch {
      /* leave content in place */
    }
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
