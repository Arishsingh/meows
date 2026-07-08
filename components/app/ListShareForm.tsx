"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ListShareForm({ listId }: { listId: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("saving");
    const res = await fetch("/api/shares", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listId, email }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Invited ${email}.`);
      setEmail("");
      setStatus("idle");
    } else {
      setMessage(data?.error ?? "Invite failed");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <p data-reveal className="text-sm font-medium text-foreground">Share by email</p>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" className="border-border bg-background" />
      <div className="flex items-center justify-between gap-3">
        <p data-reveal className="text-xs text-muted-foreground">Invite a collaborator to this list.</p>
        <Button type="submit" disabled={status === "saving" || !email.trim()} className="rounded-md">{status === "saving" ? "Sending…" : "Send invite"}</Button>
      </div>
      {message ? <p data-reveal className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}
