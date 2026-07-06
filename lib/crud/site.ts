import { db } from "@/lib/db";
import { sites, type Site, type NewSite } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type SiteInput = Omit<NewSite, "id" | "userId" | "createdAt" | "updatedAt">;

export async function listSites(userId: string): Promise<Site[]> {
  return db
    .select()
    .from(sites)
    .where(eq(sites.userId, userId))
    .orderBy(desc(sites.createdAt));
}

export async function getSite(id: string, userId: string): Promise<Site | null> {
  const rows = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, id), eq(sites.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createSite(userId: string, data: SiteInput): Promise<Site> {
  const rows = await db
    .insert(sites)
    .values({ ...data, userId } as NewSite)
    .returning();
  return rows[0]!;
}

export async function updateSite(id: string, userId: string, data: Partial<SiteInput>): Promise<Site | null> {
  const rows = await db
    .update(sites)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(sites.id, id), eq(sites.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

export async function deleteSite(id: string, userId: string): Promise<void> {
  await db.delete(sites).where(and(eq(sites.id, id), eq(sites.userId, userId)));
}
