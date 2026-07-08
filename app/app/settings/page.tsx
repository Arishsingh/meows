import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PendingInvites } from "@/components/app/PendingInvites";
import { requireSession } from "@/lib/taskline/server";
import { allItems } from "@/lib/taskline/server";
import { parseListItem } from "@/lib/taskline/model";

export default async function SettingsPage() {
  const session = await requireSession("/app/settings");
  const items = await allItems();
  const invites = items
    .map(parseListItem)
    .filter(Boolean)
    .flatMap((list) =>
      list!.meta.invites
        .filter((invite) => invite.email.toLowerCase() === session.user.email.toLowerCase() && invite.status === "pending")
        .map((invite) => ({ listId: list!.id, listKey: list!.meta.listKey, listTitle: list!.title, invite })),
    );

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-xl border-border bg-card py-0">
          <CardHeader className="px-5 pt-5">
            <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account</CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Signed in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5">
            <div className="rounded-md border border-border bg-background px-4 py-3">
              <p className="text-sm font-medium text-foreground">{session.user.name ?? "Taskline member"}</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full border-border text-xs text-muted-foreground">Email sign-in</Badge>
              <Badge variant="outline" className="rounded-full border-border text-xs text-muted-foreground">Task reminders</Badge>
              <Badge variant="outline" className="rounded-full border-border text-xs text-muted-foreground">Shared lists</Badge>
            </div>
          </CardContent>
        </Card>

        <PendingInvites invites={invites} />
      </section>
    </div>
  );
}
