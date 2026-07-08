import { createAuthClient } from "better-auth/react";

// In the browser, always use the current origin — this is correct for
// localhost dev, Vercel previews, and production without any env wiring.
// On the server (SSR / RSC), fall back through explicit env then the
// auto-injected NEXT_PUBLIC_VERCEL_URL / VERCEL_URL. Never hardcode
// http://localhost:3000 as the top fallback, or deployed apps will try
// to reach the developer's machine.
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_APP_URL ??
        process.env.BETTER_AUTH_URL ??
        (process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000"));

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signOut, useSession } = authClient;
