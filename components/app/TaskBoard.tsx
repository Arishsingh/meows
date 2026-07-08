"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, GripVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { dueLabel, formatRelativeDue, sortTasks, taskLabel, type WorkspaceList, type WorkspaceTask } from "@/lib/taskline/model";

function priorityTone(priority: WorkspaceTask["meta"]["priority"]) {
  return priority === "high" ? "text-primary" : priority === "medium" ? "text-foreground" : "text-muted-foreground";
}

export function TaskBoard({
  tasks: initialTasks,
  lists: initialLists,
  defaultListKey,
  onTaskChanged,
  emptyLabel = "No tasks yet.",
}: {
  tasks: WorkspaceTask[];
  lists: WorkspaceList[];
  defaultListKey?: string;
  onTaskChanged?: () => void;
  emptyLabel?: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [lists, setLists] = useState(initialLists);
  const [dragId, setDragId] = useState<string | null>(null);
  const grouped = useMemo(() => {
    const buckets = new Map<string, WorkspaceTask[]>();
    const keys = new Set(["inbox", ...lists.map((list) => list.meta.listKey)]);
    for (const key of keys) buckets.set(key, []);
    for (const task of tasks) {
      const key = task.meta.listKey || "inbox";
      const bucket = buckets.get(key) ?? [];
      bucket.push(task);
      buckets.set(key, bucket);
    }
    for (const [key, items] of buckets) buckets.set(key, sortTasks(items));
    return buckets;
  }, [tasks, lists]);

  async function persistOrder(listKey: string, orderedIds: string[]) {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderedIds, listKey, listName: lists.find((list) => list.meta.listKey === listKey)?.title }),
    });
    onTaskChanged?.();
  }

  async function moveTask(taskId: string, targetListKey: string) {
    setTasks((current) => {
      const moved = current.find((task) => task.id === taskId);
      if (!moved) return current;
      const sourceKey = moved.meta.listKey || "inbox";
      const next = current.map((task) => (task.id === taskId ? { ...task, meta: { ...task.meta, listKey: targetListKey } } : task));
      const targetTasks = next.filter((task) => (task.meta.listKey || "inbox") === targetListKey && task.id !== taskId).concat({ ...moved, meta: { ...moved.meta, listKey: targetListKey } });
      const sourceTasks = next.filter((task) => (task.meta.listKey || "inbox") === sourceKey && task.id !== taskId);
      void Promise.all([
        persistOrder(sourceKey, sourceTasks.map((task) => task.id)),
        persistOrder(targetListKey, targetTasks.map((task) => task.id)),
      ]);
      return next;
    });
  }

  async function toggleDone(taskId: string, done: boolean) {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, done } : task)));
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: taskId, done }),
    });
    onTaskChanged?.();
  }

  function updateOrderWithin(listKey: string, taskId: string, index: number) {
    const items = sortTasks(grouped.get(listKey) ?? []);
    const currentIndex = items.findIndex((task) => task.id === taskId);
    if (currentIndex === -1 || currentIndex === index) return;
    const reordered = [...items];
    const [picked] = reordered.splice(currentIndex, 1);
    reordered.splice(index, 0, picked);
    setTasks((current) =>
      current.map((task) => {
        const found = reordered.findIndex((next) => next.id === task.id);
        if (found === -1) return task;
        return { ...task, meta: { ...task.meta, order: found } };
      }),
    );
    void persistOrder(listKey, reordered.map((task) => task.id));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {(lists.length ? lists : ([{ id: "inbox", title: "Inbox", notes: JSON.stringify({ kind: "list", listKey: "inbox", order: 0, sharedWith: [], invites: [] }), userId: "", done: false, createdAt: new Date(), updatedAt: new Date(), meta: { listKey: "inbox", order: 0, sharedWith: [], invites: [], kind: "list" as const } } as unknown as WorkspaceList])).map((list) => {
          const listKey = list.meta.listKey;
          const bucket = grouped.get(listKey) ?? [];
          return (
            <section
              key={list.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && moveTask(dragId, listKey)}
              className="rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <h3 data-reveal className="font-display text-base font-semibold tracking-tight text-foreground">{list.title}</h3>
                  <p data-reveal className="text-xs text-muted-foreground">{bucket.length} task{bucket.length === 1 ? "" : "s"}</p>
                </div>
                <Badge variant="outline" className="rounded-full border-border text-[11px] text-muted-foreground">
                  {listKey === "inbox" ? "Capture" : taskLabel(bucket[0] ?? { meta: { listKey, listName: list.title } } as WorkspaceTask)}
                </Badge>
              </div>
              <div className="space-y-2 p-3">
                {bucket.length ? (
                  bucket.map((task, index) => (
                    <article
                      key={task.id}
                      draggable
                      onDragStart={() => setDragId(task.id)}
                      onDragEnd={() => setDragId(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        updateOrderWithin(listKey, task.id, index);
                      }}
                      className={cn("rounded-md border border-border bg-background p-3", task.done && "opacity-70")}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleDone(task.id, !task.done)}
                          className="mt-0.5 text-foreground"
                          aria-label={task.done ? "Mark open" : "Mark done"}
                        >
                          {task.done ? <CheckCircle2 className="size-4 text-primary" /> : <Circle className="size-4" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <Link href={`/app/tasks/${task.id}`} className="block min-w-0 flex-1">
                              <p data-reveal className={cn("truncate font-medium text-foreground", task.done && "line-through")}>{task.title}</p>
                            </Link>
                            <button type="button" className="cursor-grab text-muted-foreground" aria-label="Drag task">
                              <GripVertical className="size-4" />
                            </button>
                          </div>
                          <p data-reveal className="mt-1 text-xs text-muted-foreground">
                            {task.meta.dueAt ? dueLabel(task.meta.dueAt) : "No due date"} · {formatRelativeDue(task.meta.dueAt)}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className={cn("rounded-full border-border text-[11px]", priorityTone(task.meta.priority))}>
                              {task.meta.priority}
                            </Badge>
                            {task.meta.labels.slice(0, 3).map((label) => (
                              <Badge key={label} variant="outline" className="rounded-full border-border text-[11px] text-muted-foreground">
                                #{label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div data-reveal className="rounded-md border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                    {emptyLabel}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
