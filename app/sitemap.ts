import type { MetadataRoute } from "next";

// Static sitemap of the public pages. metadataBase (set in app/layout.tsx) makes
// these resolve to absolute URLs on deploy.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const ROUTES = ["/", "/sign-in", "/sign-up", "/privacy", "/terms", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: SITE + path,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
