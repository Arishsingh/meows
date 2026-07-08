import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Drawn entirely with CSS shapes — NO text glyph. next/og has no bundled font for
// exotic glyphs (e.g. "◐") and tries to fetch one dynamically, which 400s on the
// Vercel edge runtime ("Failed to download dynamic font"). A pure-CSS crescent
// renders with zero font fetches, so the favicon is bulletproof in production.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b10",
          borderRadius: 6,
        }}
      >
        <div style={{ position: "relative", width: 18, height: 18, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#ffffff" }} />
          <div style={{ position: "absolute", top: -3, left: 6, width: 18, height: 18, borderRadius: "50%", background: "#0b0b10" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
