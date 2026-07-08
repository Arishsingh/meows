import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listItems, listAllItems, getItem } from "@/lib/crud/item";
import { makeListNotes, parseListItem, parseTaskItem, sortTasks, type WorkspaceList, type WorkspaceTask, type Priority } from "./model";
import { createItem, updateItem, deleteItem } from "@/lib/crud/item";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession(nextPath?: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect(`/sign-in${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`);
  }
  return session;
}

export async function getWorkspaceLists(userId: string): Promise<WorkspaceList[]> {
  const items = await listItems(userId);
  return items.map(parseListItem).filter(Boolean) as WorkspaceList[];
}

export async function getWorkspaceTasks(userId: string): Promise<WorkspaceTask[]> {
  const items = await listItems(userId);
  return items.map(parseTaskItem).filter(Boolean) as WorkspaceTask[];
}

export async function getWorkspace(userId: string) {
  const items = await listItems(userId);
  const lists = items.map(parseListItem).filter(Boolean) as WorkspaceList[];
  const tasks = sortTasks(items.map(parseTaskItem).filter(Boolean) as WorkspaceTask[]);
  return { lists, tasks };
}

export async function getTaskOrThrow(userId: string, taskId: string) {
  const item = await getItem(taskId, userId);
  const task = item ? parseTaskItem(item) : null;
  if (!task) throw new Error("Task not found");
  return task;
}

export function defaultInboxList() {
  return makeListNotes({ listKey: "inbox", description: "Unassigned work lives here.", order: 0 });
}

export function listByKey(lists: WorkspaceList[], key: string) {
  return lists.find((list) => list.meta.listKey === key) ?? null;
}

export function collectTaskCounts(tasks: WorkspaceTask[]) {
  const open = tasks.filter((task) => !task.done).length;
  const overdue = tasks.filter((task) => task.meta.dueAt && new Date(task.meta.dueAt).getTime() < Date.now() && !task.done).length;
  const dueToday = tasks.filter((task) => {
    if (!task.meta.dueAt) return false;
    const d = new Date(task.meta.dueAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;
  return { open, overdue, dueToday };
}

export function taskPriorityCounts(tasks: WorkspaceTask[]) {
  return {
    high: tasks.filter((task) => task.meta.priority === "high").length,
    medium: tasks.filter((task) => task.meta.priority === "medium").length,
    low: tasks.filter((task) => task.meta.priority === "low").length,
  };
}

export function listTaskCounts(lists: WorkspaceList[], tasks: WorkspaceTask[]) {
  return lists.map((list) => ({
    ...list,
    taskCount: tasks.filter((task) => task.meta.listKey === list.meta.listKey).length,
    openCount: tasks.filter((task) => task.meta.listKey === list.meta.listKey && !task.done).length,
  }));
}

export async function createListRecord(userId: string, title: string, description?: string, listKey?: string, order = 0) {
  return createItem(userId, {
    title,
    notes: JSON.stringify({ kind: "list", listKey: listKey ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), description, sharedWith: [], invites: [], order }),
    done: false,
  });
}

export async function updateWorkspaceRecord(id: string, userId: string, patch: Partial<{ title: string; notes: string; done: boolean }>) {
  return updateItem(id, userId, patch);
}

export async function deleteWorkspaceRecord(id: string, userId: string) {
  return deleteItem(id, userId);
}

export async function allItems() {
  return listAllItems();
}

export type WorkspaceCounts = ReturnType<typeof collectTaskCounts> & ReturnType<typeof taskPriorityCounts>;
export type { WorkspaceTask, WorkspaceList, Priority } from "./model";
