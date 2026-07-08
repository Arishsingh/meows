"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazy-mounts a Cal.com booking page as a simple iframe. Pass either the
 * full URL (https://cal.com/acme/30min) or a `user/event` slug via `link`.
 *
 * For richer routing/embeds, swap to @calcom/embed-react; this component
 * opts for zero extra dependencies.
 */
export function CalEmbed({
  link,
  title = "Book a meeting",
  minHeight = 700,
}: {
  link: string;
  title?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setVisible(true);
      },
      { rootMargin: "200px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const src = link.startsWith("http") ? link : `https://cal.com/${link}`;

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-lg bg-black/40"
      style={{ minHeight }}
    >
      {visible && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  );
}
