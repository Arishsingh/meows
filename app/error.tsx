"use client";

// Pre-bulletproofed error boundary (v1.51.16). Zero imports, inline styles.
// Survives any layout/font crash during error prerender.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        gap: 12,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>
        Something went wrong
      </h1>
      <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
        {error?.message ?? "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          padding: "8px 14px",
          borderRadius: 6,
          border: "1px solid #d1d5db",
          background: "transparent",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Try again
      </button>
    </div>
  );
}
