import { db } from "@/lib/db";
import { brandAssets, type BrandAsset, type NewBrandAsset } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type BrandAssetInput = Omit<NewBrandAsset, "id" | "userId" | "createdAt" | "updatedAt">;

export async function listBrandAssets(userId: string): Promise<BrandAsset[]> {
  return db
    .select()
    .from(brandAssets)
    .where(eq(brandAssets.userId, userId))
    .orderBy(desc(brandAssets.createdAt));
}

export async function getBrandAsset(id: string, userId: string): Promise<BrandAsset | null> {
  const rows = await db
    .select()
    .from(brandAssets)
    .where(and(eq(brandAssets.id, id), eq(brandAssets.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createBrandAsset(userId: string, data: BrandAssetInput): Promise<BrandAsset> {
  const rows = await db
    .insert(brandAssets)
    .values({ ...data, userId } as NewBrandAsset)
    .returning();
  return rows[0]!;
}

export async function updateBrandAsset(id: string, userId: string, data: Partial<BrandAssetInput>): Promise<BrandAsset | null> {
  const rows = await db
    .update(brandAssets)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(brandAssets.id, id), eq(brandAssets.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

export async function deleteBrandAsset(id: string, userId: string): Promise<void> {
  await db.delete(brandAssets).where(and(eq(brandAssets.id, id), eq(brandAssets.userId, userId)));
}
