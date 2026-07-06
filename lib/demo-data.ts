// AUTO-GENERATED demo data (deterministic). Import these to render realistic
// example content in empty/loading states so the app feels alive on first load —
// e.g. `import { demoSites } from "@/lib/demo-data"`.

// Site — plausible example rows for rich empty states / previews.
export const demoSites = [
  { id: "demo-site-1", name: "Avery Chen", baseUrl: "https://example.com/1", targetLocale: "Draft the spec", defaultOgImageUrl: "https://example.com/1", isActive: true, notes: "A focused block to make real progress." },
  { id: "demo-site-2", name: "Jordan Blake", baseUrl: "https://example.com/2", targetLocale: "Ship the update", defaultOgImageUrl: "https://example.com/2", isActive: false, notes: "Keep momentum with a small daily step." },
  { id: "demo-site-3", name: "Sam Rivera", baseUrl: "https://example.com/3", targetLocale: "Review feedback", defaultOgImageUrl: "https://example.com/3", isActive: true, notes: "Reviewed and ready for the next round." },
  { id: "demo-site-4", name: "Riley Okafor", baseUrl: "https://example.com/4", targetLocale: "Plan the sprint", defaultOgImageUrl: "https://example.com/4", isActive: false, notes: "Captured the key details to act on." },
];

// AuditRun — plausible example rows for rich empty states / previews.
export const demoAuditRuns = [
  { id: "demo-auditrun-1", siteId: 7, status: "Active", score: 1, startedAt: "2026-06-10T09:00:00.000Z", finishedAt: "2026-06-10T09:00:00.000Z", summary: {} },
  { id: "demo-auditrun-2", siteId: 14, status: "In progress", score: 2, startedAt: "2026-06-11T09:00:00.000Z", finishedAt: "2026-06-11T09:00:00.000Z", summary: {} },
  { id: "demo-auditrun-3", siteId: 21, status: "Done", score: 3, startedAt: "2026-06-12T09:00:00.000Z", finishedAt: "2026-06-12T09:00:00.000Z", summary: {} },
  { id: "demo-auditrun-4", siteId: 28, status: "Planned", score: 4, startedAt: "2026-06-13T09:00:00.000Z", finishedAt: "2026-06-13T09:00:00.000Z", summary: {} },
];

// PageCheck — plausible example rows for rich empty states / previews.
export const demoPageChecks = [
  { id: "demo-pagecheck-1", auditRunId: 7, url: "https://example.com/1", path: "Draft the spec", title: "Morning routine", metaDescription: "A focused block to make real progress.", canonicalUrl: "https://example.com/1", hasOpenGraph: true, hasTwitterCard: true, hasJsonLd: true, robotsIndexable: true, issues: {} },
  { id: "demo-pagecheck-2", auditRunId: 14, url: "https://example.com/2", path: "Ship the update", title: "Weekly review", metaDescription: "Keep momentum with a small daily step.", canonicalUrl: "https://example.com/2", hasOpenGraph: false, hasTwitterCard: false, hasJsonLd: false, robotsIndexable: false, issues: {} },
  { id: "demo-pagecheck-3", auditRunId: 21, url: "https://example.com/3", path: "Review feedback", title: "Launch checklist", metaDescription: "Reviewed and ready for the next round.", canonicalUrl: "https://example.com/3", hasOpenGraph: true, hasTwitterCard: true, hasJsonLd: true, robotsIndexable: true, issues: {} },
  { id: "demo-pagecheck-4", auditRunId: 28, url: "https://example.com/4", path: "Plan the sprint", title: "Q3 planning", metaDescription: "Captured the key details to act on.", canonicalUrl: "https://example.com/4", hasOpenGraph: false, hasTwitterCard: false, hasJsonLd: false, robotsIndexable: false, issues: {} },
];

// Finding — plausible example rows for rich empty states / previews.
export const demoFindings = [
  { id: "demo-finding-1", auditRunId: 7, pageCheckId: 7, severity: "Draft the spec", issueCode: "Draft the spec", message: "Draft the spec", details: {}, resolved: true },
  { id: "demo-finding-2", auditRunId: 14, pageCheckId: 14, severity: "Ship the update", issueCode: "Ship the update", message: "Ship the update", details: {}, resolved: false },
  { id: "demo-finding-3", auditRunId: 21, pageCheckId: 21, severity: "Review feedback", issueCode: "Review feedback", message: "Review feedback", details: {}, resolved: true },
  { id: "demo-finding-4", auditRunId: 28, pageCheckId: 28, severity: "Plan the sprint", issueCode: "Plan the sprint", message: "Plan the sprint", details: {}, resolved: false },
];

// BrandAsset — plausible example rows for rich empty states / previews.
export const demoBrandAssets = [
  { id: "demo-brandasset-1", siteId: 7, kind: "Draft the spec", fileUrl: "https://example.com/1", altText: "Draft the spec", mimeType: "Active", isPrimary: true },
  { id: "demo-brandasset-2", siteId: 14, kind: "Ship the update", fileUrl: "https://example.com/2", altText: "Ship the update", mimeType: "In progress", isPrimary: false },
  { id: "demo-brandasset-3", siteId: 21, kind: "Review feedback", fileUrl: "https://example.com/3", altText: "Review feedback", mimeType: "Done", isPrimary: true },
  { id: "demo-brandasset-4", siteId: 28, kind: "Plan the sprint", fileUrl: "https://example.com/4", altText: "Plan the sprint", mimeType: "Planned", isPrimary: false },
];
