"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type ListOption = { id: string; listKey: string; title: string };

export function TaskComposer({
  lists,
  defaultListKey = "inbox",
  onCreated,
}: {
  lists: ListOption[];
  defaultListKey?: string;
  onCreated?: () => void;
}) {
  const [value, setValue] = useState("");
  const [listKey, setListKey] = useState(defaultListKey);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setStatus("saving");
    setMessage(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input: value, listKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to create task");
      setValue("");
      onCreated?.();
      router.refresh();
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to create task");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p data-reveal className="text-sm font-medium text-foreground">Quick add</p>
          <p data-reveal className="text-xs text-muted-foreground">Try: “Send proposal tomorrow 3pm p1 #client”</p>
        </div>
        <Badge variant="outline" className="rounded-full border-border text-[11px] text-muted-foreground">
          Inbox capture
        </Badge>
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Capture a task in one line"
        className="h-11 rounded-md border-border bg-background"
      />
      <div className="flex flex-wrap items-center gap-2">
        {lists.map((list) => (
          <button
            key={list.id}
            type="button"
            onClick={() => setListKey(list.listKey)}
            className={[
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              listKey === list.listKey ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted",
            ].join(" ")}
          >
            {list.title}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p data-reveal className="text-xs text-muted-foreground">
          Saved into {lists.find((list) => list.listKey === listKey)?.title ?? "Inbox"}
        </p>
        <Button type="submit" disabled={status === "saving" || !value.trim()} className="rounded-md">
          {status === "saving" ? "Saving…" : "Add task"}
        </Button>
      </div>
      {message ? <p data-reveal className="text-sm text-destructive">{message}</p> : null}
    </form>
  );
}
