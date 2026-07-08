import type { Item } from "@/lib/db/schema";

export type Priority = "low" | "medium" | "high";
export type TaskKind = "task" | "list";

export type TaskComment = {
  id: string;
  body: string;
  author: string;
  createdAt: string;
};

export type TaskReminder = {
  id: string;
  at: string;
  label?: string;
  createdAt: string;
};

export type ShareInvite = {
  id: string;
  email: string;
  status: "pending" | "accepted";
  createdAt: string;
  acceptedAt?: string;
};

export type TaskNotes = {
  kind: "task";
  listKey: string;
  listName?: string;
  dueAt?: string | null;
  priority: Priority;
  labels: string[];
  recurrence?: string | null;
  reminders: TaskReminder[];
  comments: TaskComment[];
  order: number;
  details?: string;
  rawInput?: string;
};

export type ListNotes = {
  kind: "list";
  listKey: string;
  description?: string;
  sharedWith: string[];
  invites: ShareInvite[];
  order: number;
};

export type WorkspaceNotes = TaskNotes | ListNotes;

export type WorkspaceTask = Item & { kind: "task"; meta: TaskNotes };
export type WorkspaceList = Item & { kind: "list"; meta: ListNotes };

export type ParsedTaskInput = {
  title: string;
  dueAt?: string | null;
  priority: Priority;
  labels: string[];
};

const priorityMap: Record<string, Priority> = {
  p1: "high",
  high: "high",
  urgent: "high",
  p2: "medium",
  medium: "medium",
  med: "medium",
  normal: "medium",
  p3: "low",
  low: "low",
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function nextWeekday(dayIndex: number, from = new Date(), forceNext = false) {
  const date = new Date(from);
  const current = date.getDay();
  let delta = dayIndex - current;
  if (delta < 0 || (delta === 0 && forceNext)) delta += 7;
  if (delta === 0 && forceNext) delta = 7;
  date.setDate(date.getDate() + delta);
  return date;
}

function setTime(date: Date, hour = 9, minute = 0) {
  const out = new Date(date);
  out.setHours(clampNumber(hour, 0, 23), clampNumber(minute, 0, 59), 0, 0);
  return out;
}

function parseTimeToken(token?: string | null) {
  if (!token) return null;
  const match = token.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const period = match[3].toLowerCase();
  if (period === "pm" && hour < 12) hour += 12;
  if (period === "am" && hour === 12) hour = 0;
  return { hour, minute };
}

export function parseNaturalTaskInput(input: string): ParsedTaskInput {
  const raw = input.trim().replace(/\s+/g, " ");
  let priority: Priority = "medium";
  const labels: string[] = [];
  const stripped = raw
    .replace(/#([a-z0-9_-]+)/gi, (_, label: string) => {
      labels.push(label.toLowerCase());
      return " ";
    })
    .replace(/\b(p1|p2|p3|high|medium|med|normal|low|urgent)\b/gi, (match) => {
      const mapped = priorityMap[match.toLowerCase()];
      if (mapped) priority = mapped;
      return " ";
    });

  const dayNames: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const duePatterns = [
    /\b(today|tomorrow|tonight|eod)\b/i,
    /\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
    /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
  ];

  const timeMatch = stripped.match(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i);
  const timeToken = timeMatch?.[1] ?? null;
  const parsedTime = parseTimeToken(timeToken);

  let dueAt: string | null | undefined = undefined;
  let title = stripped;

  const applyDue = (date: Date, defaultHour = 9) => {
    const adjusted = parsedTime ? setTime(date, parsedTime.hour, parsedTime.minute) : setTime(date, defaultHour, 0);
    dueAt = adjusted.toISOString();
  };

  const keyword = stripped.match(/\b(today|tomorrow|tonight|eod)\b/i)?.[1]?.toLowerCase();
  if (keyword) {
    const date = new Date();
    if (keyword === "tomorrow") date.setDate(date.getDate() + 1);
    if (keyword === "tonight") applyDue(date, 18);
    else if (keyword === "eod") applyDue(date, 17);
    else applyDue(date, 9);
  } else {
    const nextMatch = stripped.match(/\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i)?.[1]?.toLowerCase();
    if (nextMatch) {
      const date = nextWeekday(dayNames[nextMatch], new Date(), true);
      applyDue(date, 9);
    } else {
      const dayMatch = stripped.match(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i)?.[1]?.toLowerCase();
      if (dayMatch) {
        const date = nextWeekday(dayNames[dayMatch], new Date(), false);
        applyDue(date, 9);
      }
    }
  }

  title = title
    .replace(/\b(today|tomorrow|tonight|eod)\b/gi, " ")
    .replace(/\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/gi, " ")
    .replace(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/gi, " ")
    .replace(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    title: title || raw,
    dueAt,
    priority,
    labels,
  };
}

export function readNotes(raw?: string | null): WorkspaceNotes | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WorkspaceNotes;
  } catch {
    return null;
  }
}

export function makeTaskNotes(input: {
  listKey: string;
  listName?: string;
  dueAt?: string | null;
  priority?: Priority;
  labels?: string[];
  recurrence?: string | null;
  reminders?: TaskReminder[];
  comments?: TaskComment[];
  order?: number;
  details?: string;
  rawInput?: string;
}): TaskNotes {
  return {
    kind: "task",
    listKey: input.listKey,
    listName: input.listName,
    dueAt: input.dueAt ?? null,
    priority: input.priority ?? "medium",
    labels: input.labels ?? [],
    recurrence: input.recurrence ?? null,
    reminders: input.reminders ?? [],
    comments: input.comments ?? [],
    order: input.order ?? 0,
    details: input.details,
    rawInput: input.rawInput,
  };
}

export function makeListNotes(input: {
  listKey: string;
  description?: string;
  sharedWith?: string[];
  invites?: ShareInvite[];
  order?: number;
}): ListNotes {
  return {
    kind: "list",
    listKey: input.listKey,
    description: input.description,
    sharedWith: input.sharedWith ?? [],
    invites: input.invites ?? [],
    order: input.order ?? 0,
  };
}

export function parseTaskItem(item: Item): WorkspaceTask | null {
  const notes = readNotes(item.notes);
  if (!notes || notes.kind !== "task") return null;
  return { ...item, kind: "task", meta: notes };
}

export function parseListItem(item: Item): WorkspaceList | null {
  const notes = readNotes(item.notes);
  if (!notes || notes.kind !== "list") return null;
  return { ...item, kind: "list", meta: notes };
}

export function taskLabel(task: WorkspaceTask) {
  return task.meta.listName ?? (task.meta.listKey === "inbox" ? "Inbox" : task.meta.listKey);
}

export function dueLabel(iso?: string | null) {
  if (!iso) return "No due date";
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeDue(iso?: string | null) {
  if (!iso) return "No due date";
  const date = new Date(iso);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const abs = Math.abs(diff);
  const hours = Math.round(abs / (1000 * 60 * 60));
  if (hours < 1) return diff < 0 ? "Overdue" : "Due soon";
  if (hours < 24) return diff < 0 ? `${hours}h late` : `in ${hours}h`;
  const days = Math.round(hours / 24);
  if (days === 1) return diff < 0 ? "1 day late" : "tomorrow";
  return diff < 0 ? `${days} days late` : `in ${days} days`;
}

export function sortTasks(tasks: WorkspaceTask[]) {
  return [...tasks].sort((a, b) => {
    const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    const ap = priorityRank[a.meta.priority];
    const bp = priorityRank[b.meta.priority];
    if (ap !== bp) return ap - bp;
    const ad = a.meta.dueAt ? new Date(a.meta.dueAt).getTime() : Number.POSITIVE_INFINITY;
    const bd = b.meta.dueAt ? new Date(b.meta.dueAt).getTime() : Number.POSITIVE_INFINITY;
    if (ad !== bd) return ad - bd;
    return (a.meta.order ?? 0) - (b.meta.order ?? 0);
  });
}

export function groupTasksByList(tasks: WorkspaceTask[]) {
  const groups = new Map<string, WorkspaceTask[]>();
  for (const task of tasks) {
    const key = task.meta.listKey || "inbox";
    const list = groups.get(key) ?? [];
    list.push(task);
    groups.set(key, list);
  }
  for (const [key, items] of groups) groups.set(key, sortTasks(items));
  return groups;
}

export function isTaskItem(item: Item) {
  return Boolean(readNotes(item.notes)?.kind === "task");
}

export function isListItem(item: Item) {
  return Boolean(readNotes(item.notes)?.kind === "list");
}

export function defaultListKey(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || crypto.randomUUID();
}
