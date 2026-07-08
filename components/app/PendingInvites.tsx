"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PendingInvites({ invites }: { invites: { listId: string; listKey: string; listTitle: string; invite: { id: string; email: string; status: string; createdAt: string } }[] }) {
  const [items, setItems] = useState(invites);
  const [message, setMessage] = useState<string | null>(null);

  async function accept(listId: string) {
    const res = await fetch("/api/shares", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listId }),
    });
    const data = await res.json();
    if (res.ok) {
      setItems((current) => current.filter((invite) => invite.listId !== listId));
      setMessage(`Accepted ${data.list?.title ?? "shared list"}.`);
    } else {
      setMessage(data?.error ?? "Could not accept invite");
    }
  }

  return (
    <Card className="rounded-xl border-border bg-card py-0">
      <CardHeader className="px-5 pt-5">
        <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Collaborators</CardDescription>
        <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Pending invites</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-5">
        {items.length ? items.map((item) => (
          <div data-reveal key={`${item.listId}-${item.invite.id}`} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-4 py-3">
            <div>
              <p data-reveal className="font-medium text-foreground">{item.listTitle}</p>
              <p data-reveal className="text-xs text-muted-foreground">{item.invite.email}</p>
            </div>
            <Button type="button" onClick={() => accept(item.listId)} className="rounded-md">Accept</Button>
          </div>
        )) : <p data-reveal className="text-sm text-muted-foreground">No pending invites.</p>}
        {message ? <p data-reveal className="text-sm text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
