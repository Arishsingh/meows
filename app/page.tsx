import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rankly — SEO audits for deployed sites",
  description:
    "Scan public routes for missing metadata, broken canonicals, robots tags, sitemap coverage, and JSON-LD—then track every fix.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Rankly — SEO audits for deployed sites",
    description:
      "Scan public routes for missing metadata, broken canonicals, robots tags, sitemap coverage, and JSON-LD—then track every fix.",
    url: "/",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rankly — SEO audits for deployed sites",
    description:
      "Scan public routes for missing metadata, broken canonicals, robots tags, sitemap coverage, and JSON-LD—then track every fix.",
    images: ["/opengraph-image"],
  },
};

// __MOONSHIFT_STARTER_PLACEHOLDER__
// Intentionally MINIMAL — a holding screen shown only while the app is being
// generated. There is deliberately NO sample hero, badge, section, list, or
// product copy here: the senior-builder authors the ENTIRE real landing in this
// file from scratch, so a model can never keep, echo, or lightly-reword placeholder
// content (that was shipping build-pipeline meta like "what ships next" to prod).
// If a deployed site still shows this screen, the build failed to replace it.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-foreground" aria-hidden />
      <p data-reveal className="text-sm text-muted-foreground">Preview is live — generating your app…</p>
    </main>
  );
}
