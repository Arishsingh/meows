"use client";

// Sign-in is auth UI — never prerender it. force-dynamic + a <Suspense>
// wrapper around the useSearchParams call site (Next 14 requires BOTH:
// force-dynamic alone still trips "useSearchParams() should be wrapped in
// a suspense boundary" at build time on some configs).
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="w-full max-w-md rounded-xl border border-border/60 bg-card p-8 text-card-foreground shadow-sm">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          </div>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const params = useSearchParams();
  const next = params?.get("next") ?? "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage(null);
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res?.error) throw new Error(res.error.message ?? "sign-in failed");
      // Cookie-race fix: better-auth sets the session cookie on the response
      // to /api/auth/sign-in/email, but Next's client-side router.push() does
      // NOT forward that Set-Cookie before the next request. Result: middleware
      // gates /app on the missing cookie and bounces to /sign-in, leaving the
      // user stuck at "Signing in…" until they refresh. window.location.assign
      // forces a full document navigation that includes the freshly-set cookie.
      window.location.assign(next);
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message ?? "sign-in failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border border-border/60 bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back. Sign in with your email and password.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40"
              data-testid="sign-in-email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40"
              data-testid="sign-in-password"
            />
          </label>

          <button
            type="submit"
            disabled={status === "sending" || !email || !password}
            data-testid="sign-in-submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "sending" ? "Signing in…" : "Sign in"}
          </button>

          {message ? (
            <p className="text-sm text-destructive" role="status">
              {message}
            </p>
          ) : null}
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          New here?{" "}
          <Link
            href={`/sign-up?next=${encodeURIComponent(next)}`}
            className="text-foreground underline-offset-2 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
