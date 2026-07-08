import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, json } from "../_lib";
import { getItem, updateItem } from "@/lib/crud/item";
import { reminderCreateSchema, reminderDeleteSchema, reminderUpdateSchema } from "@/lib/validators/taskline";
import { makeTaskNotes, parseTaskItem } from "@/lib/taskline/model";

export async function POST(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const parsed = reminderCreateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const item = await getItem(data.taskId, auth.session.user.id);
  const task = item ? parseTaskItem(item) : null;
  if (!task) return json({ error: "Task not found" }, { status: 404 });
  const reminder = {
    id: crypto.randomUUID(),
    at: data.at,
    label: data.label,
    createdAt: new Date().toISOString(),
  };
  const updated = await updateItem(task.id, auth.session.user.id, {
    notes: JSON.stringify(
      makeTaskNotes({
        listKey: task.meta.listKey,
        listName: task.meta.listName,
        dueAt: task.meta.dueAt,
        priority: task.meta.priority,
        labels: task.meta.labels,
        recurrence: task.meta.recurrence,
        reminders: [...task.meta.reminders, reminder],
        comments: task.meta.comments,
        order: task.meta.order,
        details: task.meta.details,
        rawInput: task.meta.rawInput,
      }),
    ),
  });
  return NextResponse.json({ task: updated ? parseTaskItem(updated) ?? updated : null, reminder }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const parsed = reminderUpdateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const item = await getItem(data.taskId, auth.session.user.id);
  const task = item ? parseTaskItem(item) : null;
  if (!task) return json({ error: "Task not found" }, { status: 404 });
  const reminders = task.meta.reminders.map((reminder) =>
    reminder.id === data.reminderId
      ? { ...reminder, at: data.at ?? reminder.at, label: data.label ?? reminder.label }
      : reminder,
  );
  const updated = await updateItem(task.id, auth.session.user.id, {
    notes: JSON.stringify(
      makeTaskNotes({
        listKey: task.meta.listKey,
        listName: task.meta.listName,
        dueAt: task.meta.dueAt,
        priority: task.meta.priority,
        labels: task.meta.labels,
        recurrence: task.meta.recurrence,
        reminders,
        comments: task.meta.comments,
        order: task.meta.order,
        details: task.meta.details,
        rawInput: task.meta.rawInput,
      }),
    ),
  });
  return json({ task: updated ? parseTaskItem(updated) ?? updated : null });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const parsed = reminderDeleteSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const item = await getItem(data.taskId, auth.session.user.id);
  const task = item ? parseTaskItem(item) : null;
  if (!task) return json({ error: "Task not found" }, { status: 404 });
  const updated = await updateItem(task.id, auth.session.user.id, {
    notes: JSON.stringify(
      makeTaskNotes({
        listKey: task.meta.listKey,
        listName: task.meta.listName,
        dueAt: task.meta.dueAt,
        priority: task.meta.priority,
        labels: task.meta.labels,
        recurrence: task.meta.recurrence,
        reminders: task.meta.reminders.filter((reminder) => reminder.id !== data.reminderId),
        comments: task.meta.comments,
        order: task.meta.order,
        details: task.meta.details,
        rawInput: task.meta.rawInput,
      }),
    ),
  });
  return json({ task: updated ? parseTaskItem(updated) ?? updated : null });
}
