"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazy-mounts a Calendly scheduling iframe. Accepts the full Calendly
 * URL (e.g. https://calendly.com/acme/intro).
 */
export function CalendlyEmbed({
  url,
  title = "Book a meeting",
  minHeight = 700,
}: {
  url: string;
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

  const embedUrl = url.includes("embed_domain")
    ? url
    : `${url}${url.includes("?") ? "&" : "?"}embed_domain=${typeof window !== "undefined" ? window.location.hostname : "localhost"}&embed_type=Inline`;

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-lg bg-black/40"
      style={{ minHeight }}
    >
      {visible && (
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  );
}
