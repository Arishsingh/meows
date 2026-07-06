import { db } from "@/lib/db";
import { auditRuns, type AuditRun, type NewAuditRun } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type AuditRunInput = Omit<NewAuditRun, "id" | "userId" | "createdAt" | "updatedAt">;

export async function listAuditRuns(userId: string): Promise<AuditRun[]> {
  return db
    .select()
    .from(auditRuns)
    .where(eq(auditRuns.userId, userId))
    .orderBy(desc(auditRuns.createdAt));
}

export async function getAuditRun(id: string, userId: string): Promise<AuditRun | null> {
  const rows = await db
    .select()
    .from(auditRuns)
    .where(and(eq(auditRuns.id, id), eq(auditRuns.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createAuditRun(userId: string, data: AuditRunInput): Promise<AuditRun> {
  const rows = await db
    .insert(auditRuns)
    .values({ ...data, userId } as NewAuditRun)
    .returning();
  return rows[0]!;
}

export async function updateAuditRun(id: string, userId: string, data: Partial<AuditRunInput>): Promise<AuditRun | null> {
  const rows = await db
    .update(auditRuns)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(auditRuns.id, id), eq(auditRuns.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

export async function deleteAuditRun(id: string, userId: string): Promise<void> {
  await db.delete(auditRuns).where(and(eq(auditRuns.id, id), eq(auditRuns.userId, userId)));
}
