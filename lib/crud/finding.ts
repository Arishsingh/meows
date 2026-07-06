import { db } from "@/lib/db";
import { findings, type Finding, type NewFinding } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type FindingInput = Omit<NewFinding, "id" | "userId" | "createdAt" | "updatedAt">;

export async function listFindings(userId: string): Promise<Finding[]> {
  return db
    .select()
    .from(findings)
    .where(eq(findings.userId, userId))
    .orderBy(desc(findings.createdAt));
}

export async function getFinding(id: string, userId: string): Promise<Finding | null> {
  const rows = await db
    .select()
    .from(findings)
    .where(and(eq(findings.id, id), eq(findings.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createFinding(userId: string, data: FindingInput): Promise<Finding> {
  const rows = await db
    .insert(findings)
    .values({ ...data, userId } as NewFinding)
    .returning();
  return rows[0]!;
}

export async function updateFinding(id: string, userId: string, data: Partial<FindingInput>): Promise<Finding | null> {
  const rows = await db
    .update(findings)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(findings.id, id), eq(findings.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

export async function deleteFinding(id: string, userId: string): Promise<void> {
  await db.delete(findings).where(and(eq(findings.id, id), eq(findings.userId, userId)));
}
