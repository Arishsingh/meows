import { db } from "@/lib/db";
import { items, type Item, type NewItem } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type ItemInput = Omit<NewItem, "id" | "userId" | "createdAt" | "updatedAt">;

export async function listItems(userId: string): Promise<Item[]> {
  return db
    .select()
    .from(items)
    .where(eq(items.userId, userId))
    .orderBy(desc(items.createdAt));
}

export async function getItem(id: string, userId: string): Promise<Item | null> {
  const rows = await db
    .select()
    .from(items)
    .where(and(eq(items.id, id), eq(items.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createItem(userId: string, data: ItemInput): Promise<Item> {
  const rows = await db
    .insert(items)
    .values({ ...data, userId } as NewItem)
    .returning();
  return rows[0]!;
}

export async function updateItem(id: string, userId: string, data: Partial<ItemInput>): Promise<Item | null> {
  const rows = await db
    .update(items)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(items.id, id), eq(items.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

export async function deleteItem(id: string, userId: string): Promise<void> {
  await db.delete(items).where(and(eq(items.id, id), eq(items.userId, userId)));
}

export async function listAllItems(): Promise<Item[]> {
  return db.select().from(items).orderBy(desc(items.createdAt));
}

export async function listItemById(id: string): Promise<Item | null> {
  const rows = await db.select().from(items).where(eq(items.id, id)).limit(1);
  return rows[0] ?? null;
}
