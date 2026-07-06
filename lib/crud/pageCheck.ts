import { db } from "@/lib/db";
import { pageChecks, type PageCheck, type NewPageCheck } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type PageCheckInput = Omit<NewPageCheck, "id" | "userId" | "createdAt" | "updatedAt">;

export async function listPageChecks(userId: string): Promise<PageCheck[]> {
  return db
    .select()
    .from(pageChecks)
    .where(eq(pageChecks.userId, userId))
    .orderBy(desc(pageChecks.createdAt));
}

export async function getPageCheck(id: string, userId: string): Promise<PageCheck | null> {
  const rows = await db
    .select()
    .from(pageChecks)
    .where(and(eq(pageChecks.id, id), eq(pageChecks.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createPageCheck(userId: string, data: PageCheckInput): Promise<PageCheck> {
  const rows = await db
    .insert(pageChecks)
    .values({ ...data, userId } as NewPageCheck)
    .returning();
  return rows[0]!;
}

export async function updatePageCheck(id: string, userId: string, data: Partial<PageCheckInput>): Promise<PageCheck | null> {
  const rows = await db
    .update(pageChecks)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(pageChecks.id, id), eq(pageChecks.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

export async function deletePageCheck(id: string, userId: string): Promise<void> {
  await db.delete(pageChecks).where(and(eq(pageChecks.id, id), eq(pageChecks.userId, userId)));
}
