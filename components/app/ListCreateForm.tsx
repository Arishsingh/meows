"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ListCreateForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus("saving");
    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const data = await res.json();
    if (res.ok) {
      setName("");
      setDescription("");
      router.refresh();
      setStatus("idle");
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New list" className="border-border bg-background" />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="border-border bg-background" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p data-reveal className="text-xs text-muted-foreground">Create a project or team list.</p>
        <Button type="submit" disabled={status === "saving" || !name.trim()} className="rounded-md">{status === "saving" ? "Creating…" : "Create list"}</Button>
      </div>
    </form>
  );
}
