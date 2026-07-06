"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Subtle route-change transition — fades/rises the page content on navigation, a
 * premium touch award sites use. Wrap the children inside a CLIENT layout (e.g. the
 * marketing layout) with <PageTransition>{children}</PageTransition>.
 *
 * FAIL-VISIBLE: the end state is always opacity 1 / y 0; transitions are tiny
 * (350ms) so it stays unobtrusive, and motion honours prefers-reduced-motion.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
