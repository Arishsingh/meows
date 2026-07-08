import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { TaskBoard } from "@/components/app/TaskBoard";
import { ListShareForm } from "@/components/app/ListShareForm";
import { requireSession, getWorkspace } from "@/lib/taskline/server";

export default async function ListDetailPage({ params }: { params: Promise<{ listId: string }> }) {
  const session = await requireSession("/app/lists");
  const { listId } = await params;
  const { lists, tasks } = await getWorkspace(session.user.id);
  const list = lists.find((entry) => entry.meta.listKey === listId);
  if (!list) notFound();
  const filteredTasks = tasks.filter((task) => task.meta.listKey === list.meta.listKey || task.meta.listKey === "inbox");
  const boardLists = [
    { id: "inbox", title: "Inbox", meta: { listKey: "inbox", order: 0, sharedWith: [], invites: [], kind: "list" as const } },
    list,
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-xl border-border bg-card py-0">
          <CardHeader className="px-5 pt-5">
            <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">List</CardDescription>
            <CardTitle className="font-display text-3xl font-semibold tracking-tight text-foreground">{list.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5">
            <p className="text-sm leading-6 text-muted-foreground">{list.meta.description ?? "Simple ordered work for this project."}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full border-border text-xs text-muted-foreground">{tasks.filter((task) => task.meta.listKey === list.meta.listKey).length} tasks</Badge>
              <Badge variant="outline" className="rounded-full border-border text-xs text-muted-foreground">{list.meta.sharedWith.length} collaborators</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-md border-border bg-transparent"><Link href="/app/lists">All lists</Link></Button>
              <Button asChild className="rounded-md"><Link href="/app/inbox">Capture a task</Link></Button>
            </div>
          </CardContent>
        </Card>

        <ListShareForm listId={list.id} />
      </section>

      <Card className="rounded-xl border-border bg-card py-0">
        <CardHeader className="px-5 pt-5">
          <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Board</CardDescription>
          <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Move work into this list</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <TaskBoard tasks={filteredTasks} lists={boardLists as any} emptyLabel="Drop a task here from the inbox." />
        </CardContent>
      </Card>
    </div>
  );
}
