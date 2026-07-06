"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Brief brand intro overlay on FIRST load only — a wordmark settles in, then the
 * curtain lifts to reveal the page. A signature award-site opening for a bold
 * brand. Drop <Intro label="Brandname" /> once (e.g. at the top of the landing).
 *
 * FAIL-VISIBLE: starts hidden in SSR (overlay state is false), so the page is fully
 * visible immediately — the overlay only appears via JS, on the first visit per
 * session, and never on reduced-motion. It removes itself after ~1.3s.
 */
export default function Intro({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("intro-seen")) return;
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      /* private mode — just play once */
    }
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 1300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        >
          <motion.span
            className="font-display text-2xl tracking-tight text-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {label}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
