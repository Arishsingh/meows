// Pre-bulletproofed 404 page (v1.51.17). Server Component with force-dynamic
// + headers() call so Next never tries to prerender it. Static prerender of
// /404 kept falling back to Pages-router default error page (the misleading
// "<Html> should not be imported" error).
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function NotFound() {
  await headers();
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
        gap: 8,
      }}
    >
      <h1 style={{ fontSize: 48, fontWeight: 600, margin: 0 }}>404</h1>
      <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
        We couldn&apos;t find that page.
      </p>
      <a
        href="/"
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "underline",
          textUnderlineOffset: 4,
        }}
      >
        Back to home
      </a>
    </div>
  );
}
