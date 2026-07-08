import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListCreateForm } from "@/components/app/ListCreateForm";
import { TaskBoard } from "@/components/app/TaskBoard";
import { requireSession, getWorkspace } from "@/lib/taskline/server";

export default async function ListsPage() {
  const session = await requireSession("/app/lists");
  const { lists, tasks } = await getWorkspace(session.user.id);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-xl border-border bg-card py-0">
          <CardHeader className="px-5 pt-5">
            <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Lists</CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Organize by project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5">
            <ListCreateForm />
            <div className="space-y-2">
              {lists.map((list) => (
                <div key={list.id} className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{list.title}</p>
                    <p className="text-xs text-muted-foreground">{list.meta.description ?? "Simple ordered work."}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="rounded-md border-border bg-transparent">
                    <Link href={`/app/lists/${list.meta.listKey}`}>Open</Link>
                  </Button>
                </div>
              ))}
              {lists.length === 0 && <p className="text-sm text-muted-foreground">No lists yet. Create one to move work out of the inbox.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-card py-0">
          <CardHeader className="px-5 pt-5">
            <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Board</CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Drag tasks between lists</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <p className="mb-4 text-sm leading-6 text-muted-foreground">Drop a task onto another list to persist its assignment and order.</p>
            <TaskBoard tasks={tasks} lists={lists} emptyLabel="Start by creating a task in the inbox." />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
