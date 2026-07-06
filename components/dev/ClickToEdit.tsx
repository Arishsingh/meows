"use client";

// Dev-only click-to-edit bridge. The Moonshift Studio renders this app in a
// cross-origin <iframe>, so the Studio itself cannot read the rendered DOM. This
// component lives INSIDE the app, listens for the Studio's "enter pick mode"
// message, highlights whatever the user hovers, and on click sends a compact
// descriptor of the chosen element back to the Studio (visible text + a CSS-ish
// selector + nearest context, plus the React source location when the dev fiber
// exposes it). The Studio attaches that descriptor to the next iterate turn so the
// agent edits exactly the element the user pointed at.
//
// Rendered only in development (see app/layout.tsx) — it is dead-code-eliminated
// from the production deploy, so it never ships to real users.

import { useEffect, useRef, useState } from "react";

interface EditTarget {
  text?: string;
  tag?: string;
  selector?: string;
  componentHint?: string;
  sourceFile?: string;
  sourceLine?: number;
}

function cssPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  for (let depth = 0; node && depth < 4 && node.nodeType === 1; depth++) {
    let part = node.tagName.toLowerCase();
    if (node.id) {
      part += `#${node.id}`;
      parts.unshift(part);
      break; // an id is unique enough — stop here
    }
    const cls = (typeof node.className === "string" ? node.className : "")
      .split(/\s+/)
      .filter((c) => c && !c.startsWith("reveal") && c.length < 24)
      .slice(0, 2);
    if (cls.length) part += "." + cls.join(".");
    const parent = node.parentElement;
    if (parent) {
      const sibs = Array.from(parent.children).filter((c) => c.tagName === node!.tagName);
      if (sibs.length > 1) part += `:nth-of-type(${sibs.indexOf(node) + 1})`;
    }
    parts.unshift(part);
    node = node.parentElement;
  }
  return parts.join(" > ");
}

/** Nearest semantic anchor (aria-label / data-* / section id / heading text). */
function contextHint(el: Element): string | undefined {
  let node: Element | null = el;
  for (let i = 0; node && i < 6; i++) {
    const aria = node.getAttribute("aria-label");
    if (aria) return `aria-label="${aria}"`;
    const sectionId = node.tagName === "SECTION" && node.id ? node.id : null;
    if (sectionId) return `section#${sectionId}`;
    node = node.parentElement;
  }
  // Fall back to the nearest preceding heading.
  const heading = el.closest("section, article, main, body")?.querySelector("h1,h2,h3");
  const ht = heading?.textContent?.trim();
  return ht ? `under heading "${ht.slice(0, 60)}"` : undefined;
}

/** Best-effort React source location from the dev fiber (file:line). */
function sourceLoc(el: Element): { sourceFile?: string; sourceLine?: number } {
  try {
    const key = Object.keys(el).find((k) => k.startsWith("__reactFiber$"));
    if (!key) return {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fiber: any = (el as any)[key];
    for (let i = 0; fiber && i < 30; i++) {
      const src = fiber._debugSource || fiber.memoizedProps?.__source;
      if (src?.fileName) {
        const file = String(src.fileName).split("/").slice(-4).join("/");
        return { sourceFile: file, sourceLine: typeof src.lineNumber === "number" ? src.lineNumber : undefined };
      }
      fiber = fiber.return;
    }
  } catch {
    /* fiber internals vary by React version — degrade to text/selector locator */
  }
  return {};
}

function describe(el: Element): EditTarget {
  const text = (el as HTMLElement).innerText?.trim().replace(/\s+/g, " ").slice(0, 120) || undefined;
  return {
    text,
    tag: el.tagName.toLowerCase(),
    selector: cssPath(el),
    componentHint: contextHint(el),
    ...sourceLoc(el),
  };
}

export function ClickToEdit() {
  const [active, setActive] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const hovered = useRef<Element | null>(null);

  // Listen for the Studio toggling pick mode.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { source?: string; type?: string; on?: boolean } | null;
      if (d?.source === "moonshift-studio" && d.type === "edit-mode") setActive(!!d.on);
    };
    window.addEventListener("message", onMsg);
    // Announce readiness so the Studio can re-assert state after a reload.
    try {
      window.parent?.postMessage({ source: "moonshift-cte", type: "ready" }, "*");
    } catch {
      /* no parent */
    }
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // While active: highlight on hover, capture on click, esc to cancel.
  useEffect(() => {
    if (!active) {
      if (boxRef.current) boxRef.current.style.display = "none";
      return;
    }
    const moveBox = (el: Element | null) => {
      const box = boxRef.current;
      if (!box) return;
      if (!el) {
        box.style.display = "none";
        return;
      }
      const r = el.getBoundingClientRect();
      box.style.display = "block";
      box.style.top = `${r.top}px`;
      box.style.left = `${r.left}px`;
      box.style.width = `${r.width}px`;
      box.style.height = `${r.height}px`;
    };
    const onMove = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el || boxRef.current?.contains(el)) return;
      hovered.current = el;
      moveBox(el);
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element) || hovered.current;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      try {
        window.parent?.postMessage({ source: "moonshift-cte", type: "select", target: describe(el) }, "*");
      } catch {
        /* no parent */
      }
      setActive(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [active]);

  return (
    <>
      <div
        ref={boxRef}
        aria-hidden
        style={{
          position: "fixed",
          display: "none",
          zIndex: 2147483646,
          pointerEvents: "none",
          border: "2px solid #6366f1",
          background: "rgba(99,102,241,0.12)",
          borderRadius: 4,
          transition: "all 60ms ease-out",
        }}
      />
      {active && (
        <div
          style={{
            position: "fixed",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2147483647,
            pointerEvents: "none",
            padding: "6px 12px",
            borderRadius: 9999,
            background: "#111118",
            color: "#fff",
            fontSize: 12,
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            boxShadow: "0 6px 24px -8px rgba(0,0,0,0.6)",
          }}
        >
          Click an element to edit · Esc to cancel
        </div>
      )}
    </>
  );
}
