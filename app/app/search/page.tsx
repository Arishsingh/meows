import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { requireSession, getWorkspace } from "@/lib/taskline/server";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await requireSession("/app/search");
  const params = await searchParams;
  const { tasks, lists } = await getWorkspace(session.user.id);
  const query = typeof params.query === "string" ? params.query : "";
  const listKey = typeof params.listKey === "string" ? params.listKey : "";
  const status = typeof params.status === "string" ? params.status : "all";
  const priority = typeof params.priority === "string" ? params.priority : "";
  const label = typeof params.label === "string" ? params.label : "";
  const due = typeof params.due === "string" ? params.due : "";

  const results = tasks.filter((task) => {
    if (query && !`${task.title} ${task.meta.details ?? ""} ${task.meta.labels.join(" ")}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (listKey && task.meta.listKey !== listKey) return false;
    if (status === "open" && task.done) return false;
    if (status === "done" && !task.done) return false;
    if (priority && task.meta.priority !== priority) return false;
    if (label && !task.meta.labels.includes(label.toLowerCase())) return false;
    if (due === "today" && (!task.meta.dueAt || new Date(task.meta.dueAt).toDateString() !== new Date().toDateString())) return false;
    if (due === "overdue" && (!task.meta.dueAt || new Date(task.meta.dueAt).getTime() >= Date.now() || task.done)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border-border bg-card py-0">
        <CardHeader className="px-5 pt-5">
          <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Search</CardDescription>
          <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Find work fast</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <form method="get" className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            <Input name="query" defaultValue={query} placeholder="Search tasks" className="border-border bg-background" />
            <select name="listKey" defaultValue={listKey} className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground">
              <option value="">All lists</option>
              <option value="inbox">Inbox</option>
              {lists.map((list) => (
                <option key={list.id} value={list.meta.listKey}>{list.title}</option>
              ))}
            </select>
            <select name="status" defaultValue={status} className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground">
              <option value="all">All status</option>
              <option value="open">Open</option>
              <option value="done">Done</option>
            </select>
            <select name="priority" defaultValue={priority} className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground">
              <option value="">All priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Input name="label" defaultValue={label} placeholder="Label" className="border-border bg-background" />
            <select name="due" defaultValue={due} className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground">
              <option value="">Any due date</option>
              <option value="today">Today</option>
              <option value="overdue">Overdue</option>
            </select>
            <div className="md:col-span-3 xl:col-span-6 flex justify-end gap-3">
              <Button type="submit" className="rounded-md">Filter</Button>
              <Button asChild variant="outline" className="rounded-md border-border bg-transparent"><Link href="/app/search">Reset</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border bg-card py-0">
        <CardHeader className="px-5 pt-5">
          <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Results</CardDescription>
          <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">{results.length} matching tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-5">
          {results.length ? results.map((task) => (
            <Link key={task.id} href={`/app/tasks/${task.id}`} className="block rounded-md border border-border bg-background px-4 py-3 transition-colors hover:bg-muted">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.meta.listKey === "inbox" ? "Inbox" : task.meta.listName ?? task.meta.listKey}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-full border-border text-[11px] text-muted-foreground">{task.meta.priority}</Badge>
                  {task.meta.labels.slice(0, 2).map((item) => <Badge key={item} variant="outline" className="rounded-full border-border text-[11px] text-muted-foreground">#{item}</Badge>)}
                </div>
              </div>
            </Link>
          )) : <p className="text-sm text-muted-foreground">No tasks match these filters.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
