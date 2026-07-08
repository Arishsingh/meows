import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, json } from "../_lib";
import { getItem, updateItem } from "@/lib/crud/item";
import { commentCreateSchema, commentDeleteSchema } from "@/lib/validators/taskline";
import { makeTaskNotes, parseTaskItem } from "@/lib/taskline/model";

export async function POST(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const parsed = commentCreateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const item = await getItem(data.taskId, auth.session.user.id);
  const task = item ? parseTaskItem(item) : null;
  if (!task) return json({ error: "Task not found" }, { status: 404 });
  const comment = {
    id: crypto.randomUUID(),
    body: data.body,
    author: data.author ?? auth.session.user.name ?? auth.session.user.email,
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
        reminders: task.meta.reminders,
        comments: [...task.meta.comments, comment],
        order: task.meta.order,
        details: task.meta.details,
        rawInput: task.meta.rawInput,
      }),
    ),
  });
  return NextResponse.json({ task: updated ? parseTaskItem(updated) ?? updated : null, comment }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const parsed = commentDeleteSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const { taskId, commentId } = parsed.data;
  const item = await getItem(taskId, auth.session.user.id);
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
        reminders: task.meta.reminders,
        comments: task.meta.comments.filter((comment) => comment.id !== commentId),
        order: task.meta.order,
        details: task.meta.details,
        rawInput: task.meta.rawInput,
      }),
    ),
  });
  return json({ task: updated ? parseTaskItem(updated) ?? updated : null });
}
