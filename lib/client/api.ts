"use client";

/**
 * Browser-side fetch wrapper for `/api/...` routes. Wraps native fetch
 * with three concerns the agents otherwise forget every single time:
 *
 *   1. `credentials: "include"` so the better-auth session cookie is
 *      attached on cross-port (3000 ↔ 3001) and preview/prod domains.
 *   2. JSON content negotiation + parse, so callers can `await apiPost`
 *      and get a typed object instead of a Response.
 *   3. Throws a typed `ApiError` on non-2xx so the UI's `try/catch`
 *      surfaces a real message instead of silently swallowing failures.
 */

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
    if (res.status === 401 && typeof window !== "undefined") {
      // Surface 401 visibly. Caller may also redirect to /sign-in.
      // We intentionally do NOT auto-redirect here — that would mask
      // legitimate per-action permission errors.
    }
    const msg =
      typeof body === "object" && body && "error" in body
        ? String((body as { error: unknown }).error)
        : `API ${res.status}`;
    throw new ApiError(res.status, body, msg);
  }
  return body as T;
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, {
    method: "GET",
    headers: { accept: "application/json" },
    credentials: "include",
    signal,
  });
  return parseOrThrow<T>(res);
}

export async function apiSend<T>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
    signal,
  });
  return parseOrThrow<T>(res);
}

export const apiPost = <T>(path: string, body?: unknown, signal?: AbortSignal) =>
  apiSend<T>("POST", path, body, signal);
export const apiPut = <T>(path: string, body?: unknown, signal?: AbortSignal) =>
  apiSend<T>("PUT", path, body, signal);
export const apiPatch = <T>(path: string, body?: unknown, signal?: AbortSignal) =>
  apiSend<T>("PATCH", path, body, signal);
export const apiDelete = <T>(path: string, body?: unknown, signal?: AbortSignal) =>
  apiSend<T>("DELETE", path, body, signal);
