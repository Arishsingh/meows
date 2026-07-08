import { NextRequest, NextResponse } from "next/server";
import { requireApiSession, errorResponse, json } from "../_lib";
import { createItem, getItem, updateItem, deleteItem, listItems } from "@/lib/crud/item";
import { filterSchema, taskCreateSchema, taskUpdateSchema } from "@/lib/validators/taskline";
import { makeTaskNotes, parseNaturalTaskInput, parseTaskItem, sortTasks, type Priority } from "@/lib/taskline/model";

function taskListMaxOrder(tasks: ReturnType<typeof parseTaskItem>[], listKey: string) {
  return tasks.reduce((max, task) => (task && task.meta.listKey === listKey ? Math.max(max, task.meta.order ?? 0) : max), 0);
}

function mergeLabels(current: string[] | undefined, incoming?: string[]) {
  return Array.from(new Set([...(current ?? []), ...(incoming ?? [])]));
}

export async function GET(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const filters = filterSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  const items = await listItems(auth.session.user.id);
  const tasks = items.map(parseTaskItem).filter(Boolean).filter((task): task is NonNullable<ReturnType<typeof parseTaskItem>> => Boolean(task));
  const parsed = filters.success ? filters.data : {};
  let filtered = tasks;
  if (parsed.listKey) filtered = filtered.filter((task) => task.meta.listKey === parsed.listKey);
  if (parsed.status === "open") filtered = filtered.filter((task) => !task.done);
  if (parsed.status === "done") filtered = filtered.filter((task) => task.done);
  if (parsed.priority) filtered = filtered.filter((task) => task.meta.priority === parsed.priority);
  if (parsed.label) {
    const label = parsed.label.toLowerCase();
    filtered = filtered.filter((task) => task.meta.labels.includes(label));
  }
  if (parsed.query) {
    const q = parsed.query.toLowerCase();
    filtered = filtered.filter((task) => {
      const hay = [task.title, task.notes ?? "", task.meta.labels.join(" "), task.meta.listName ?? "", task.meta.recurrence ?? ""].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }
  if (parsed.due) {
    filtered = filtered.filter((task) => {
      const due = task.meta.dueAt ? new Date(task.meta.dueAt) : null;
      if (!due) return false;
      if (parsed.due === "today") return due.toDateString() === new Date().toDateString();
      if (parsed.due === "overdue") return due.getTime() < Date.now() && !task.done;
      return due.toISOString().slice(0, 10) === parsed.due;
    });
  }
  return json({ tasks: sortTasks(filtered) });
}

export async function POST(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const parsed = taskCreateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const rawInput = data.input ?? data.title ?? "";
  const extracted = data.input ? parseNaturalTaskInput(data.input) : null;
  const title = data.title ?? extracted?.title ?? rawInput;
  const priority: Priority = data.priority ?? extracted?.priority ?? "medium";
  const labels = mergeLabels(extracted?.labels, data.labels);
  const listKey = data.listKey ?? "inbox";
  const userTasks = (await listItems(auth.session.user.id)).map(parseTaskItem).filter(Boolean).filter((task): task is NonNullable<ReturnType<typeof parseTaskItem>> => Boolean(task));
  const order = data.order ?? taskListMaxOrder(userTasks, listKey) + 1;
  const created = await createItem(auth.session.user.id, {
    title,
    notes: JSON.stringify(
      makeTaskNotes({
        listKey,
        listName: data.listName,
        dueAt: data.dueAt ?? extracted?.dueAt ?? null,
        priority,
        labels,
        recurrence: data.recurrence ?? null,
        reminders: [],
        comments: [],
        order,
        details: data.notes,
        rawInput: rawInput || data.notes,
      }),
    ),
    done: data.done ?? false,
  });
  return NextResponse.json({ task: parseTaskItem(created) ?? created }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  if (Array.isArray(body.orderedIds) && typeof body.listKey === "string") {
    const orderedIds: string[] = body.orderedIds;
    const userItems = await listItems(auth.session.user.id);
    const taskMap = new Map(userItems.map((item) => [item.id, item]));
    const updates = await Promise.all(
      orderedIds.map(async (id, index) => {
        const current = taskMap.get(id);
        if (!current) return null;
        const parsedTask = parseTaskItem(current);
        if (!parsedTask) return null;
        const updated = await updateItem(id, auth.session.user.id, {
          notes: JSON.stringify(
            makeTaskNotes({
              listKey: body.listKey,
              listName: body.listName ?? parsedTask.meta.listName,
              dueAt: parsedTask.meta.dueAt,
              priority: parsedTask.meta.priority,
              labels: parsedTask.meta.labels,
              recurrence: parsedTask.meta.recurrence,
              reminders: parsedTask.meta.reminders,
              comments: parsedTask.meta.comments,
              order: index,
              details: parsedTask.meta.details,
              rawInput: parsedTask.meta.rawInput,
            }),
          ),
        });
        return updated;
      }),
    );
    return json({ tasks: updates.filter(Boolean).map((item) => parseTaskItem(item!)).filter(Boolean) });
  }

  const parsed = taskUpdateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const existing = await getItem(data.id, auth.session.user.id);
  if (!existing) return json({ error: "Task not found" }, { status: 404 });
  const currentTask = parseTaskItem(existing);
  if (!currentTask) return json({ error: "Task not found" }, { status: 404 });
  const updatedNotes = data.notes
    ? data.notes
    : JSON.stringify(
        makeTaskNotes({
          listKey: data.listKey ?? currentTask.meta.listKey,
          listName: data.listName ?? currentTask.meta.listName,
          dueAt: data.dueAt ?? currentTask.meta.dueAt,
          priority: data.priority ?? currentTask.meta.priority,
          labels: data.labels ? mergeLabels([], data.labels) : currentTask.meta.labels,
          recurrence: data.recurrence ?? currentTask.meta.recurrence,
          reminders: data.reminders ?? currentTask.meta.reminders,
          comments: data.comments ?? currentTask.meta.comments,
          order: data.order ?? currentTask.meta.order,
          details: data.notes ?? currentTask.meta.details,
          rawInput: currentTask.meta.rawInput,
        }),
      );
  const updated = await updateItem(data.id, auth.session.user.id, {
    title: data.title ?? currentTask.title,
    notes: updatedNotes,
    done: data.done ?? currentTask.done,
  });
  return json({ task: updated ? parseTaskItem(updated) ?? updated : null });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  if (!body.id) return json({ error: "Missing id" }, { status: 400 });
  await deleteItem(String(body.id), auth.session.user.id);
  return json({ ok: true });
}
