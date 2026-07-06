"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Mount once at the root of the app tree. Lenis is disabled when the user
 * prefers reduced motion or is on a coarse-pointer viewport narrower than
 * 768px — on those surfaces native scroll is cheaper and more expected.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch =
      window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 768;
    if (reduce || touch) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
