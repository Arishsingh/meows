import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// === moonshift: generated app tables (regenerated each run) ===

export const sites = sqliteTable("sites", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  baseUrl: text("base_url").notNull(),
  targetLocale: text("target_locale").notNull(),
  defaultOgImageUrl: text("default_og_image_url").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull(),
  notes: text("notes").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;

export const auditRuns = sqliteTable("audit_runs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  siteId: text("site_id").references(() => sites.id, { onDelete: "cascade" }).notNull(),
  status: text("status").notNull(),
  score: integer("score").notNull(),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  finishedAt: integer("finished_at", { mode: "timestamp" }).notNull(),
  summary: text("summary", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
export type AuditRun = typeof auditRuns.$inferSelect;
export type NewAuditRun = typeof auditRuns.$inferInsert;

export const pageChecks = sqliteTable("page_checks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  auditRunId: text("audit_run_id").references(() => auditRuns.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  path: text("path").notNull(),
  title: text("title").notNull(),
  metaDescription: text("meta_description").notNull(),
  canonicalUrl: text("canonical_url").notNull(),
  hasOpenGraph: integer("has_open_graph", { mode: "boolean" }).notNull(),
  hasTwitterCard: integer("has_twitter_card", { mode: "boolean" }).notNull(),
  hasJsonLd: integer("has_json_ld", { mode: "boolean" }).notNull(),
  robotsIndexable: integer("robots_indexable", { mode: "boolean" }).notNull(),
  issues: text("issues", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
export type PageCheck = typeof pageChecks.$inferSelect;
export type NewPageCheck = typeof pageChecks.$inferInsert;

export const findings = sqliteTable("findings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  auditRunId: text("audit_run_id").references(() => auditRuns.id, { onDelete: "cascade" }).notNull(),
  pageCheckId: text("page_check_id").references(() => pageChecks.id, { onDelete: "cascade" }).notNull(),
  severity: text("severity").notNull(),
  issueCode: text("issue_code").notNull(),
  message: text("message").notNull(),
  details: text("details", { mode: "json" }).notNull(),
  resolved: integer("resolved", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
export type Finding = typeof findings.$inferSelect;
export type NewFinding = typeof findings.$inferInsert;

export const brandAssets = sqliteTable("brand_assets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  siteId: text("site_id").references(() => sites.id, { onDelete: "cascade" }).notNull(),
  kind: text("kind").notNull(),
  fileUrl: text("file_url").notNull(),
  altText: text("alt_text").notNull(),
  mimeType: text("mime_type").notNull(),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
export type BrandAsset = typeof brandAssets.$inferSelect;
export type NewBrandAsset = typeof brandAssets.$inferInsert;
