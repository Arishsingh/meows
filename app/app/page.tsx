import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskBoard } from "@/components/app/TaskBoard";
import { requireSession, getWorkspace, collectTaskCounts, taskPriorityCounts } from "@/lib/taskline/server";

export default async function AppHomePage() {
  const session = await requireSession("/app");
  const { lists, tasks } = await getWorkspace(session.user.id);
  const counts = collectTaskCounts(tasks);
  const priorities = taskPriorityCounts(tasks);
  const recentTasks = tasks.slice(0, 5);
  const listPreview = lists.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
        <div className="space-y-4">
          <Badge variant="outline" className="rounded-full border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Dashboard
          </Badge>
          <h2 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Capture quickly, then move the work.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Today&apos;s queue, tomorrow&apos;s follow-up, and the next project all live in one clean flow.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-md">
              <Link href="/app/inbox">Open inbox</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-md border-border bg-transparent">
              <Link href="/app/lists">View lists</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Open", value: counts.open },
            { label: "Due today", value: counts.dueToday },
            { label: "High priority", value: priorities.high },
          ].map((stat) => (
            <Card key={stat.label} className="rounded-xl border-border bg-card py-0">
              <CardHeader className="px-4 pt-4">
                <CardDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</CardDescription>
                <CardTitle className="font-display text-4xl font-semibold tracking-tight text-foreground">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-xl border-border bg-card py-0">
          <CardHeader className="px-5 pt-5">
            <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Today</CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">What needs attention</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-3">
              {recentTasks.length ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.meta.listKey === "inbox" ? "Inbox" : task.meta.listName ?? task.meta.listKey}</p>
                    </div>
                    <Badge variant="outline" className="rounded-full border-border text-[11px] text-muted-foreground">
                      {task.meta.priority}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
                  {tasks.length ? "Nothing is waiting right now." : "Add your first task in the inbox."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-card py-0">
          <CardHeader className="px-5 pt-5">
            <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Lists</CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Current projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5">
            {listPreview.length ? (
              listPreview.map((list) => (
                <div key={list.id} className="rounded-md border border-border bg-background px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{list.title}</p>
                      <p className="text-xs text-muted-foreground">{list.meta.description ?? "Simple, ordered work."}</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-md border-border bg-transparent">
                      <Link href={`/app/lists/${list.meta.listKey}`}>Open</Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Create a list to organize work beyond the inbox.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">Ordered by list</h3>
          </div>
          <Button asChild variant="outline" className="rounded-md border-border bg-transparent">
            <Link href="/app/lists">Manage lists</Link>
          </Button>
        </div>
        <TaskBoard tasks={tasks} lists={lists} onTaskChanged={() => {}} emptyLabel="Create tasks in the inbox to start." />
      </section>
    </div>
  );
}
