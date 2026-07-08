import { ImageResponse } from "next/og";

// Dynamic Open Graph / Twitter card. Next auto-attaches this to every page's
// og:image + twitter:image (1200x630). Edge runtime, no external assets.
export const runtime = "edge";
export const alt = "Taskline";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b0b12 0%, #16162a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>Taskline</div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#b9b9d4", maxWidth: 900, lineHeight: 1.3 }}>Capture work fast, stay organized, finish cleanly.</div>
      </div>
    ),
    { ...size },
  );
}
