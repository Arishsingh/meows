import { NextResponse, type NextRequest } from "next/server";

/**
 * Parses the client's `Accept-Language` header and attaches the primary
 * language tag (e.g. "en") as a response header. Client components can
 * then pick it up via document headers / server component props to seed
 * the dictionary.
 *
 * Scoped to the landing route ("/") only — the app surface runs under
 * /app and has no need for server-side locale hints.
 */
export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept-language") ?? "";
  const lang = accept.split(",")[0]?.split("-")[0]?.toLowerCase() || "en";
  const res = NextResponse.next();
  res.headers.set("x-lang", lang);
  return res;
}

export const config = {
  matcher: "/",
};
