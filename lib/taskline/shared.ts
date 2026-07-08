import { createItem, updateItem } from "@/lib/crud/item";
import { allItems } from "./server";
import { makeListNotes, makeTaskNotes, parseListItem, parseTaskItem, type ShareInvite, type WorkspaceList, type WorkspaceTask } from "./model";

export async function findInviteForEmail(listId: string, email: string) {
  const items = await allItems();
  const match = items.find((item) => item.id === listId);
  const list = match ? parseListItem(match) : null;
  if (!list) return null;
  const invite = list.meta.invites.find(
    (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.status === "pending",
  );
  return invite ? { list, invite } : null;
}

export async function cloneSharedListToUser(
  sourceList: WorkspaceList,
  recipientUserId: string,
  recipientEmail: string,
) {
  const all = await allItems();
  const sourceTasks = all
    .map(parseTaskItem)
    .filter((task): task is WorkspaceTask => Boolean(task && task.meta.listKey === sourceList.meta.listKey));

  const clonedList = await createItem(recipientUserId, {
    title: sourceList.title,
    notes: JSON.stringify(
      makeListNotes({
        listKey: sourceList.meta.listKey,
        description: sourceList.meta.description,
        sharedWith: [recipientEmail],
        invites: [],
        order: sourceList.meta.order,
      }),
    ),
    done: false,
  });

  for (const task of sourceTasks) {
    await createItem(recipientUserId, {
      title: task.title,
      notes: JSON.stringify(
        makeTaskNotes({
          listKey: task.meta.listKey,
          listName: task.meta.listName,
          dueAt: task.meta.dueAt,
          priority: task.meta.priority,
          labels: task.meta.labels,
          recurrence: task.meta.recurrence,
          reminders: task.meta.reminders,
          comments: task.meta.comments,
          order: task.meta.order,
          rawInput: task.meta.rawInput,
        }),
      ),
      done: task.done,
    });
  }

  return clonedList;
}

export async function acceptInviteInOwnerWorkspace(listId: string, email: string) {
  const all = await allItems();
  const ownerList = all.find((item) => item.id === listId);
  const parsed = ownerList ? parseListItem(ownerList) : null;
  if (!parsed) return null;
  const invite = parsed.meta.invites.find(
    (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.status === "pending",
  );
  if (!invite) return null;
  const updatedInvites: ShareInvite[] = parsed.meta.invites.map((entry) =>
    entry.id === invite.id ? { ...entry, status: "accepted" as const, acceptedAt: new Date().toISOString() } : entry,
  );
  const updatedSharedWith = Array.from(new Set([...(parsed.meta.sharedWith ?? []), email.toLowerCase()]));
  await updateItem(parsed.id, parsed.userId, {
    notes: JSON.stringify(
      makeListNotes({
        listKey: parsed.meta.listKey,
        description: parsed.meta.description,
        sharedWith: updatedSharedWith,
        invites: updatedInvites,
        order: parsed.meta.order,
      }),
    ),
  });
  return parsed;
}
