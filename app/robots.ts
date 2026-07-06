import type { MetadataRoute } from "next";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:6191").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/app","/dashboard","/api"], },
    sitemap: SITE + "/sitemap.xml",
  };
}
