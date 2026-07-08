import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, json } from "../_lib";
import { createItem, listItems, updateItem } from "@/lib/crud/item";
import { shareAcceptSchema, shareInviteSchema } from "@/lib/validators/taskline";
import { allItems } from "@/lib/taskline/server";
import { acceptInviteInOwnerWorkspace, cloneSharedListToUser } from "@/lib/taskline/shared";
import { makeListNotes, parseListItem } from "@/lib/taskline/model";

function normalize(email: string) {
  return email.trim().toLowerCase();
}

export async function GET() {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const email = normalize(auth.session.user.email);
  const items = await allItems();
  const invites = items
    .map(parseListItem)
    .filter(Boolean)
    .flatMap((list) =>
      list!.meta.invites
        .filter((invite) => normalize(invite.email) === email && invite.status === "pending")
        .map((invite) => ({ listId: list!.id, listKey: list!.meta.listKey, listTitle: list!.title, invite })),
    );
  const sharedLists = items
    .map(parseListItem)
    .filter((list): list is NonNullable<ReturnType<typeof parseListItem>> => Boolean(list))
    .filter((list) => (list.meta.sharedWith ?? []).includes(email));
  return json({ invites, sharedLists });
}

export async function POST(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const parsed = shareInviteSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const { listId, email } = parsed.data;
  const items = await listItems(auth.session.user.id);
  const item = items.find((entry) => entry.id === listId);
  const list = item ? parseListItem(item) : null;
  if (!list) return json({ error: "List not found" }, { status: 404 });
  const invite = { id: crypto.randomUUID(), email: normalize(email), status: "pending" as const, createdAt: new Date().toISOString() };
  const updated = await updateItem(list.id, auth.session.user.id, {
    notes: JSON.stringify(
      makeListNotes({
        listKey: list.meta.listKey,
        description: list.meta.description,
        sharedWith: list.meta.sharedWith,
        invites: [...list.meta.invites, invite],
        order: list.meta.order,
      }),
    ),
  });
  return NextResponse.json({ list: updated ? parseListItem(updated) ?? updated : null, invite }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const parsed = shareAcceptSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const email = normalize(auth.session.user.email);
  const found = await acceptInviteInOwnerWorkspace(parsed.data.listId, email);
  if (!found) return json({ error: "Invite not found" }, { status: 404 });
  const cloned = await cloneSharedListToUser(found, auth.session.user.id, email);
  return json({ list: parseListItem(cloned) ?? cloned, accepted: true });
}
