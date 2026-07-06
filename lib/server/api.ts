import { headers } from "next/headers";

/**
 * RSC-safe fetch wrapper for calling internal `/api/...` routes from a
 * Server Component or Route Handler.
 *
 * Why this exists: Next 14 RSC `fetch()` does NOT forward the incoming
 * request's cookies/headers automatically. better-auth needs the session
 * cookie on the outbound call to `getSession()`, so without forwarding
 * every internal API call from an RSC returns 401 even when the user is
 * signed in. This helper rebuilds the absolute URL from the current
 * request host and forwards `cookie` + `authorization`.
 *
 * Usage:
 *   const data = await apiGet<{ items: Task[] }>("/api/tasks");
 *   const created = await apiPost<Task>("/api/tasks", { title: "..." });
 */

function resolveBaseUrl(h: Headers): string {
  const explicit =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : null);
  if (explicit) return explicit;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

function forwardedHeaders(h: Headers, extra?: HeadersInit): HeadersInit {
  const out = new Headers(extra);
  const cookie = h.get("cookie");
  if (cookie) out.set("cookie", cookie);
  const auth = h.get("authorization");
  if (auth) out.set("authorization", auth);
  return out;
}

function absolutize(h: Headers, path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${resolveBaseUrl(h)}${path.startsWith("/") ? path : `/${path}`}`;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string,
  ) {
    super(message ?? `API ${status}`);
    this.name = "ApiError";
  }
}

async function parseOrThrow<T>(res: Response): Promise<T> {
  const text = await res.text();
  let body: unknown = text;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      // leave as raw text
    }
  }
  if (!res.ok) {
    const msg =
      typeof body === "object" && body && "error" in body
        ? String((body as { error: unknown }).error)
        : `API ${res.status}`;
    throw new ApiError(res.status, body, msg);
  }
  return body as T;
}

export async function apiGet<T>(
  path: string,
  init?: { revalidate?: number; tags?: string[] },
): Promise<T> {
  const h = await headers();
  const res = await fetch(absolutize(h, path), {
    method: "GET",
    headers: forwardedHeaders(h, { accept: "application/json" }),
    next: { revalidate: init?.revalidate ?? 0, tags: init?.tags },
  });
  return parseOrThrow<T>(res);
}

export async function apiSend<T>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const h = await headers();
  const res = await fetch(absolutize(h, path), {
    method,
    headers: forwardedHeaders(h, {
      accept: "application/json",
      "content-type": "application/json",
    }),
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  return parseOrThrow<T>(res);
}

export const apiPost = <T>(path: string, body?: unknown) => apiSend<T>("POST", path, body);
export const apiPut = <T>(path: string, body?: unknown) => apiSend<T>("PUT", path, body);
export const apiPatch = <T>(path: string, body?: unknown) => apiSend<T>("PATCH", path, body);
export const apiDelete = <T>(path: string, body?: unknown) => apiSend<T>("DELETE", path, body);
