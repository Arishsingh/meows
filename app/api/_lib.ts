import { NextResponse } from "next/server";
import { getSession } from "@/lib/taskline/server";

export async function requireApiSession() {
  const session = await getSession();
  if (!session?.user?.id) {
    return { session: null as null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null as null };
}

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function errorResponse(error: unknown, status = 500) {
  return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status });
}
