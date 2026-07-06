"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazy-mounts a Typeform as a simple iframe. Accepts the form id
 * (the `xxxxx` in https://form.typeform.com/to/xxxxx).
 */
export function TypeformEmbed({
  id,
  title = "Survey",
  minHeight = 600,
}: {
  id: string;
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

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-lg bg-black/40"
      style={{ minHeight }}
    >
      {visible && (
        <iframe
          src={`https://form.typeform.com/to/${id}`}
          title={title}
          allow="camera; microphone; autoplay; encrypted-media; fullscreen"
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  );
}
