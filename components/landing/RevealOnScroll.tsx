"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fades and lifts children when they scroll into view. Uses `amount: 0.1`
 * so content reveals on scroll-in (a11y requirement) rather than waiting
 * for the element to be half-visible.
 */
export function RevealOnScroll({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
