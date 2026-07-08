"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { dueLabel, type WorkspaceList, type WorkspaceTask } from "@/lib/taskline/model";

export function TaskDetailEditor({ task, lists }: { task: WorkspaceTask; lists: WorkspaceList[] }) {
  const [title, setTitle] = useState(task.title);
  const [details, setDetails] = useState(task.meta.details ?? "");
  const [priority, setPriority] = useState(task.meta.priority);
  const [listKey, setListKey] = useState(task.meta.listKey);
  const [dueAt, setDueAt] = useState(task.meta.dueAt ? task.meta.dueAt.slice(0, 16) : "");
  const [labels, setLabels] = useState(task.meta.labels.join(", "));
  const [recurrence, setRecurrence] = useState(task.meta.recurrence ?? "");
  const [done, setDone] = useState(Boolean(task.done));
  const [comments, setComments] = useState(task.meta.comments);
  const [reminders, setReminders] = useState(task.meta.reminders);
  const [commentBody, setCommentBody] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [reminderLabel, setReminderLabel] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setTitle(task.title);
    setDetails(task.meta.details ?? "");
    setPriority(task.meta.priority);
    setListKey(task.meta.listKey);
    setDueAt(task.meta.dueAt ? task.meta.dueAt.slice(0, 16) : "");
    setLabels(task.meta.labels.join(", "));
    setRecurrence(task.meta.recurrence ?? "");
    setDone(Boolean(task.done));
    setComments(task.meta.comments);
    setReminders(task.meta.reminders);
  }, [task]);

  const listOptions = useMemo(() => lists.map((list) => ({ id: list.id, label: list.title, listKey: list.meta.listKey })), [lists]);

  async function saveTask() {
    setStatus("saving");
    setMessage(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          title,
          notes: details,
          done,
          listKey,
          listName: lists.find((list) => list.meta.listKey === listKey)?.title,
          dueAt: dueAt ? new Date(dueAt).toISOString() : null,
          priority,
          labels: labels.split(",").map((label) => label.trim()).filter(Boolean),
          recurrence: recurrence || null,
          comments,
          reminders,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to save task");
      setStatus("idle");
      setMessage("Saved.");
      setTimeout(() => setMessage(null), 1500);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to save task");
    }
  }

  async function addComment(e: FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ taskId: task.id, body: commentBody }),
    });
    const data = await res.json();
    if (res.ok) {
      setComments(data.task.meta.comments);
      setCommentBody("");
    }
  }

  async function addReminder(e: FormEvent) {
    e.preventDefault();
    if (!reminderAt) return;
    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ taskId: task.id, at: new Date(reminderAt).toISOString(), label: reminderLabel || undefined }),
    });
    const data = await res.json();
    if (res.ok) {
      setReminders(data.task.meta.reminders);
      setReminderAt("");
      setReminderLabel("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p data-reveal className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Task detail</p>
          <h2 data-reveal className="font-display text-2xl font-semibold tracking-tight text-foreground">{task.title}</h2>
        </div>
        <Badge variant="outline" className="rounded-full border-border text-xs text-muted-foreground">{dueLabel(task.meta.dueAt)}</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-foreground">Title</span>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="border-border bg-background" />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-foreground">List</span>
              <Select value={listKey} onValueChange={setListKey}>
                <SelectTrigger className="w-full border-border bg-background">
                  <SelectValue placeholder="Select list" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbox">Inbox</SelectItem>
                  {listOptions.map((list) => (
                    <SelectItem key={list.id} value={list.listKey}>
                      {list.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-foreground">Due date</span>
              <Input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className="border-border bg-background" />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-foreground">Priority</span>
              <Select value={priority} onValueChange={(value) => setPriority(value as typeof priority)}>
                <SelectTrigger className="w-full border-border bg-background">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm text-foreground">Notes</span>
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)} className="min-h-32 border-border bg-background" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-foreground">Labels</span>
              <Input value={labels} onChange={(e) => setLabels(e.target.value)} placeholder="marketing, client" className="border-border bg-background" />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-foreground">Recurrence</span>
              <Input value={recurrence} onChange={(e) => setRecurrence(e.target.value)} placeholder="weekly, every 2 weeks" className="border-border bg-background" />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={Boolean(done)} onChange={(e) => setDone(e.target.checked)} className="h-4 w-4 rounded border-border" />
            Mark complete
          </label>

          <div className="flex items-center gap-3">
            <Button type="button" onClick={saveTask} disabled={status === "saving"} className="rounded-md">
              {status === "saving" ? "Saving…" : "Save changes"}
            </Button>
            {message ? <p data-reveal className="text-sm text-muted-foreground">{message}</p> : null}
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div>
            <p data-reveal className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Comments</p>
            <div className="mt-3 space-y-3">
              {comments.length ? (
                comments.map((comment) => (
                  <article data-reveal key={comment.id} className="rounded-md border border-border bg-background p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p data-reveal className="font-medium text-foreground">{comment.author}</p>
                      <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p data-reveal className="mt-2 text-muted-foreground">{comment.body}</p>
                  </article>
                ))
              ) : (
                <p data-reveal className="text-sm text-muted-foreground">No comments yet.</p>
              )}
            </div>
            <form onSubmit={addComment} className="mt-3 space-y-2">
              <Textarea value={commentBody} onChange={(e) => setCommentBody(e.target.value)} placeholder="Add a note or decision" className="min-h-20 border-border bg-background" />
              <Button type="submit" variant="outline" className="rounded-md border-border bg-transparent">Add comment</Button>
            </form>
          </div>

          <div className="border-t border-border pt-4">
            <p data-reveal className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reminders</p>
            <div className="mt-3 space-y-2">
              {reminders.length ? (
                reminders.map((reminder) => (
                  <div data-reveal key={reminder.id} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <div>
                      <p data-reveal className="text-foreground">{new Date(reminder.at).toLocaleString()}</p>
                      {reminder.label ? <p data-reveal className="text-xs text-muted-foreground">{reminder.label}</p> : null}
                    </div>
                  </div>
                ))
              ) : (
                <p data-reveal className="text-sm text-muted-foreground">No reminders scheduled.</p>
              )}
            </div>
            <form onSubmit={addReminder} className="mt-3 grid gap-2">
              <Input type="datetime-local" value={reminderAt} onChange={(e) => setReminderAt(e.target.value)} className="border-border bg-background" />
              <Input value={reminderLabel} onChange={(e) => setReminderLabel(e.target.value)} placeholder="Reminder label" className="border-border bg-background" />
              <Button type="submit" variant="outline" className="rounded-md border-border bg-transparent">Add reminder</Button>
            </form>
          </div>

          <div className="border-t border-border pt-4">
            <p data-reveal className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Navigate</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="outline" className="rounded-md border-border bg-transparent"><Link href="/app/inbox">Inbox</Link></Button>
              <Button asChild variant="outline" className="rounded-md border-border bg-transparent"><Link href="/app/lists">Lists</Link></Button>
              <Button asChild variant="outline" className="rounded-md border-border bg-transparent"><Link href="/app/search">Search</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
