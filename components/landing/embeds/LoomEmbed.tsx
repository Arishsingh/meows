"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazy-mounts a Loom video iframe. Accepts the Loom share id
 * (the `xxxx` in https://www.loom.com/share/xxxx).
 */
export function LoomEmbed({ id, title }: { id: string; title: string }) {
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
    <div ref={ref} className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/40">
      {visible && (
        <iframe
          src={`https://www.loom.com/embed/${id}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  );
}
