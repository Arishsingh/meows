"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="w-full max-w-md rounded-xl border border-border/60 bg-card p-8 text-card-foreground shadow-sm">
            <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          </div>
        </main>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const params = useSearchParams();
  const next = params?.get("next") ?? "/app";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }
    setStatus("sending");
    setMessage(null);
    try {
      const res = await authClient.signUp.email({ email, password, name });
      if (res?.error) throw new Error(res.error.message ?? "sign-up failed");
      // Cookie-race fix (see sign-in for full rationale): force a full
      // navigation so middleware sees the freshly-set session cookie.
      window.location.assign(next);
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message ?? "sign-up failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border border-border/60 bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start with your email. No verification email required.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Name</span>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40"
              data-testid="sign-up-name"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40"
              data-testid="sign-up-email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Password</span>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40"
              data-testid="sign-up-password"
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              At least 8 characters.
            </span>
          </label>

          <button
            type="submit"
            disabled={status === "sending" || !email || !password || !name}
            data-testid="sign-up-submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "sending" ? "Creating…" : "Create account"}
          </button>

          {message ? (
            <p className="text-sm text-destructive" role="status">
              {message}
            </p>
          ) : null}
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/sign-in?next=${encodeURIComponent(next)}`}
            className="text-foreground underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
