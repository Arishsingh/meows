import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

// Resolve the public base URL in priority order:
//   1. BETTER_AUTH_URL — explicit operator override (matches Better Auth convention)
//   2. NEXT_PUBLIC_APP_URL — shared public app URL (also used by the client)
//   3. VERCEL_PROJECT_PRODUCTION_URL — stable prod alias (e.g. my-app.vercel.app)
//   4. VERCEL_URL — per-deployment URL (changes every deploy)
//   5. localhost fallback for `next dev`
const baseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

// Better Auth compares the incoming `Origin` header against baseURL + trustedOrigins
// and 403s with "Invalid origin" on mismatch. On Vercel, three hostnames can all hit
// the same deployment:
//   - VERCEL_URL                    → per-deployment URL (rotates every push)
//   - VERCEL_BRANCH_URL             → branch alias (e.g. my-app-git-main-team.vercel.app)
//   - VERCEL_PROJECT_PRODUCTION_URL → stable prod alias (the one users see)
// Trust all of them so sign-in works regardless of which hostname the browser lands on.
const vercelHosts = [
  process.env.VERCEL_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
]
  .filter((h): h is string => Boolean(h))
  .map((h) => `https://${h}`);

// The live PREVIEW (the pipeline's e2b sandbox + the Studio's iframe) is served at
// https://3000-<id>.e2b.app — a different origin from baseURL, so Better Auth would
// 403 ("Invalid origin") every sign-up / sign-in IN PREVIEW even though the app is
// correct (verified: the same POST returns 200 with no Origin header, 403 from the
// browser). Trust the e2b subdomain wildcard so auth works in preview, not only on
// Vercel. Harmless in production: no e2b origin can reach the prod deployment, and
// CSRF still needs the victim's cookie. PREVIEW_ORIGIN allows an exact override.
const previewOrigins = ["*.e2b.app", "https://*.e2b.app", process.env.PREVIEW_ORIGIN].filter(
  (o): o is string => Boolean(o),
);

const trustedOrigins = Array.from(
  new Set(
    [
      baseURL,
      "http://localhost:3000",
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      ...vercelHosts,
      ...previewOrigins,
    ].filter((o): o is string => Boolean(o)),
  ),
);

// Email + password is the ONLY supported auth method in generated apps.
// Social providers and OAuth flows of any kind are intentionally not
// configured. Frontend agents must NOT add social-sign-in buttons.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  baseURL,
  trustedOrigins,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
  plugins: [],
});

export type Session = typeof auth.$Infer.Session;
