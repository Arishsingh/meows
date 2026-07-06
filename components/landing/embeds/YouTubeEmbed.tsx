"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazy-mounts a privacy-enhanced YouTube iframe once the container
 * intersects the viewport (with a 200px rootMargin so playback is ready
 * just before the user sees it).
 */
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
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
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  );
}
