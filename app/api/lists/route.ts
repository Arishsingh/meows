import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, json } from "../_lib";
import { createItem, deleteItem, listItems, updateItem } from "@/lib/crud/item";
import { listCreateSchema, listUpdateSchema } from "@/lib/validators/taskline";
import { makeListNotes, parseListItem } from "@/lib/taskline/model";
import { getWorkspaceTasks } from "@/lib/taskline/server";

function nextListOrder(lists: ReturnType<typeof parseListItem>[]) {
  return lists.reduce((max, list) => (list ? Math.max(max, list.meta.order ?? 0) : max), 0) + 1;
}

export async function GET() {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const items = await listItems(auth.session.user.id);
  const lists = items.map(parseListItem).filter(Boolean).filter((list): list is NonNullable<ReturnType<typeof parseListItem>> => Boolean(list));
  return json({ lists });
}

export async function POST(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const parsed = listCreateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const lists = (await listItems(auth.session.user.id)).map(parseListItem).filter(Boolean).filter((list): list is NonNullable<ReturnType<typeof parseListItem>> => Boolean(list));
  const created = await createItem(auth.session.user.id, {
    title: data.name,
    notes: JSON.stringify(
      makeListNotes({
        listKey: data.listKey ?? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        description: data.description,
        order: data.order ?? nextListOrder(lists),
      }),
    ),
    done: false,
  });
  return NextResponse.json({ list: parseListItem(created) ?? created }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const parsed = listUpdateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const current = await listItems(auth.session.user.id);
  const item = current.find((entry) => entry.id === data.id);
  const parsedList = item ? parseListItem(item) : null;
  if (!parsedList) return json({ error: "List not found" }, { status: 404 });
  const updated = await updateItem(data.id, auth.session.user.id, {
    title: data.name ?? parsedList.title,
    notes: JSON.stringify(
      makeListNotes({
        listKey: parsedList.meta.listKey,
        description: data.description ?? parsedList.meta.description,
        sharedWith: parsedList.meta.sharedWith,
        invites: parsedList.meta.invites,
        order: data.order ?? parsedList.meta.order,
      }),
    ),
  });
  return json({ list: updated ? parseListItem(updated) ?? updated : null });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  if (!body.id) return json({ error: "Missing id" }, { status: 400 });
  const existing = await listItems(auth.session.user.id);
  const parsedList = existing.find((entry) => entry.id === String(body.id)) ? parseListItem(existing.find((entry) => entry.id === String(body.id))!) : null;
  if (parsedList?.meta.listKey) {
    const tasks = await getWorkspaceTasks(auth.session.user.id);
    for (const task of tasks.filter((task) => task.meta.listKey === parsedList.meta.listKey)) {
      await updateItem(task.id, auth.session.user.id, {
        notes: JSON.stringify(
          {
            ...task.meta,
            listKey: "inbox",
            listName: "Inbox",
          }
        ),
      });
    }
  }
  await deleteItem(String(body.id), auth.session.user.id);
  return json({ ok: true });
}
