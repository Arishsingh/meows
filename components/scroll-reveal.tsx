"use client";

import { useEffect } from "react";

/**
 * Per-element scroll-reveal (AOS-style). A finalize-verify codemod tags the landing's
 * content elements — headings, paragraphs, images, cards — with `data-reveal` IN THE
 * MARKUP, so the pre-paint CSS hides them before first paint (no flash). This driver:
 *  - DE-DUPES nesting: if a `[data-reveal]` contains another, only the OUTER animates
 *    (a card reveals as one unit); the inner one is un-tagged so it rides with its
 *    parent instead of double-animating or staying stuck hidden.
 *  - STAGGERS: each item gets a small transition-delay by its order within its section,
 *    so a section's heading → text → cards cascade in quickly.
 *  - Reveals each item as it scrolls into view (subtle rise + fade).
 * FAIL-VISIBLE: only runs when <html> has `reveal-on` (JS on + reduced-motion off); a
 * failsafe reveals anything in-view but still hidden, so a stuck observer can never
 * leave content invisible.
 *
 * BACK/FORWARD SAFE: the setup is a re-runnable `run()` invoked on mount AND on
 * `pageshow` (bfcache restore — the back button serves the frozen page, so the mount
 * effect never re-fires) AND on `popstate` (client-side back/forward). Without this,
 * navigating away and pressing Back left every below-fold [data-reveal] stuck at
 * opacity:0 — the page looked blank until a manual refresh.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    let io: IntersectionObserver | null = null;
    let sweepTimer: number | undefined;

    const reveal = (el: HTMLElement) => {
      el.classList.add("is-revealed");
      window.setTimeout(() => {
        el.style.transitionDelay = "";
      }, 700); // clear so later transitions aren't delayed
    };

    const run = () => {
      if (!root.classList.contains("reveal-on")) return; // reduced-motion / no-JS → stay visible

      // NEVER reveal-animate the authenticated app/dashboard. Scroll-reveal there
      // caused content to stay hidden until a hard refresh (a stuck observer + the
      // pre-paint opacity:0 left text invisible). Strip every reveal marker so the
      // dashboard paints fully and instantly — reveals belong on the landing only.
      const path = window.location.pathname;
      if (path === "/app" || path.startsWith("/app/") || path === "/dashboard" || path.startsWith("/dashboard/")) {
        document.querySelectorAll("[data-reveal]").forEach((el) => el.removeAttribute("data-reveal"));
        return;
      }

      // Re-runs (back/forward, bfcache) start fresh: drop the previous observer so a
      // restored page re-observes its still-hidden items instead of relying on the
      // disconnected one from the first visit.
      io?.disconnect();
      if (sweepTimer) window.clearTimeout(sweepTimer);

      const all = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      if (all.length === 0) return;

      // keep only the OUTERMOST tagged elements; un-tag the rest so they un-hide and ride
      // with their parent (a card animates as a unit, not card + its own heading + text).
      const outerAll = all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
      const keep = new Set(outerAll);
      for (const el of all) if (!keep.has(el)) el.removeAttribute("data-reveal");

      // Drop items hidden on load (inside a collapsed accordion / tab / closed <details>):
      // AOS would leave them stuck invisible when a CLICK — not a scroll — reveals them
      // later (the FAQ-answer-blank bug). Un-tag so they just render normally on expand.
      const items = outerAll.filter((el) => {
        const r = el.getBoundingClientRect();
        const hidden = !!el.closest('[data-state="closed"],[hidden],[aria-hidden="true"],details:not([open])') || (r.width < 1 && r.height < 1);
        if (hidden) {
          el.removeAttribute("data-reveal");
          return false;
        }
        return true;
      });

      // Items already shown on a previous visit keep `is-revealed`; only stagger the
      // ones still waiting so a re-entry doesn't re-delay already-visible content.
      const pending = items.filter((el) => !el.classList.contains("is-revealed"));
      const idx = new Map<Element, number>();
      for (const el of pending) {
        const sec = (el.closest("section") as Element) ?? el.parentElement ?? document.body;
        const i = idx.get(sec) ?? 0;
        el.style.transitionDelay = `${Math.min(i * 65, 360)}ms`;
        idx.set(sec, i + 1);
      }

      if (!("IntersectionObserver" in window)) {
        pending.forEach(reveal);
        return;
      }
      const obs = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              reveal(e.target as HTMLElement);
              obs.unobserve(e.target);
            }
          }),
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );
      io = obs;
      for (const el of pending) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) reveal(el); // already in view → show now
        else obs.observe(el);
      }
      // Safety net: force-reveal ONLY items that are in view but still hidden (a stuck
      // observer) — never below-fold ones, so each animates as it scrolls in. A blanket
      // reveal-all here would flash the WHOLE page in on load and kill the scroll effect.
      const sweep = () => {
        for (const el of pending)
          if (!el.classList.contains("is-revealed") && el.getBoundingClientRect().top < window.innerHeight) reveal(el);
      };
      sweepTimer = window.setTimeout(sweep, 1200);
    };

    run();

    // bfcache restore (e.persisted) re-serves the frozen page without remounting React,
    // so re-run here. popstate covers client-side back/forward; a rAF lets the restored
    // DOM settle before we re-measure.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) requestAnimationFrame(run);
    };
    const onPopState = () => requestAnimationFrame(run);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("popstate", onPopState);

    return () => {
      io?.disconnect();
      if (sweepTimer) window.clearTimeout(sweepTimer);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return null;
}
