// AUTO-GENERATED per build by deterministic-prep (src/prep/font-pairings.ts).
// Only the ONE chosen pairing's fonts are declared so next/font bundles ~3 families,
// not the whole 10-pairing menu — keeps the production build fast. Runtime interface
// (activeFontPairing) is identical to the old static module; app/layout.tsx is the
// only consumer.
import localFont from "next/font/local";

const f0 = localFont({ src: [{ path: "../public/fonts/bricolage-grotesque/400.woff2", weight: "400", style: "normal" }, { path: "../public/fonts/bricolage-grotesque/700.woff2", weight: "700", style: "normal" }], variable: "--font-bricolage", display: "swap", fallback: ["system-ui", "sans-serif"] });
const f1 = localFont({ src: [{ path: "../public/fonts/work-sans/400.woff2", weight: "400", style: "normal" }, { path: "../public/fonts/work-sans/500.woff2", weight: "700", style: "normal" }], variable: "--font-work-sans", display: "swap", fallback: ["system-ui", "sans-serif"] });
const f2 = localFont({ src: [{ path: "../public/fonts/jetbrains-mono/400.woff2", weight: "400", style: "normal" }, { path: "../public/fonts/jetbrains-mono/700.woff2", weight: "700", style: "normal" }], variable: "--font-jetbrains-mono", display: "swap", fallback: ["ui-monospace", "monospace"] });

export interface FontPairing { key: string; label: string; className: string; displayVar: string; bodyVar: string; monoVar: string; }

export function activeFontPairing(): FontPairing {
  return {
    key: "atelier",
    label: "Atelier",
    className: [f0.variable, f1.variable, f2.variable].join(" "),
    displayVar: "var(--font-bricolage)",
    bodyVar: "var(--font-work-sans)",
    monoVar: "var(--font-jetbrains-mono)",
  };
}
