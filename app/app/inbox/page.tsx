import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskComposer } from "@/components/app/TaskComposer";
import { TaskBoard } from "@/components/app/TaskBoard";
import { requireSession, getWorkspace } from "@/lib/taskline/server";

export default async function InboxPage() {
  const session = await requireSession("/app/inbox");
  const { lists, tasks } = await getWorkspace(session.user.id);
  const inboxTasks = tasks.filter((task) => task.meta.listKey === "inbox");
  const captureLists = [{ id: "inbox", listKey: "inbox", title: "Inbox" }, ...lists.map((list) => ({ id: list.id, listKey: list.meta.listKey, title: list.title }))];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-xl border-border bg-card py-0">
          <CardHeader className="px-5 pt-5">
            <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Inbox</CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Quick capture</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <TaskComposer lists={captureLists} defaultListKey="inbox" />
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Type naturally: due dates, priority, and labels are parsed on save.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-card py-0">
          <CardHeader className="px-5 pt-5">
            <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workflow</CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Capture, then organize</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Add a task in one line",
                "Move it to a list",
                "Keep the order intact",
              ].map((step, index) => (
                <div key={step} className="rounded-md border border-border bg-background p-4">
                  <Badge variant="outline" className="rounded-full border-border text-[11px] text-muted-foreground">0{index + 1}</Badge>
                  <p className="mt-3 text-sm font-medium text-foreground">{step}</p>
                </div>
              ))}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              The inbox stays light while lists give the work a home.
            </p>
          </CardContent>
        </Card>
      </section>

      <TaskBoard tasks={inboxTasks} lists={lists} emptyLabel="Your inbox is clear." />
    </div>
  );
}
