import { NextResponse, type NextRequest } from "next/server";

export function GET(req: NextRequest) {
  const bucket = req.nextUrl.searchParams.get("bucket") === "b" ? "b" : "a";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1" fill="none">
      <rect width="1" height="1" fill="transparent" />
    </svg>
  `;
  const res = new NextResponse(svg, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "no-store, max-age=0",
    },
  });

  res.cookies.set({
    name: "ab_hero",
    value: bucket,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });

  return res;
}
