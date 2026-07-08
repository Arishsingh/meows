import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { requireSession, getWorkspace } from "@/lib/taskline/server";

export default async function RemindersPage() {
  const session = await requireSession("/app/reminders");
  const { tasks } = await getWorkspace(session.user.id);
  const upcoming = tasks.filter((task) => task.meta.dueAt && !task.done).sort((a, b) => new Date(a.meta.dueAt ?? 0).getTime() - new Date(b.meta.dueAt ?? 0).getTime());
  const reminders = tasks.flatMap((task) => task.meta.reminders.map((reminder) => ({ task, reminder }))).sort((a, b) => new Date(a.reminder.at).getTime() - new Date(b.reminder.at).getTime());

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-xl border-border bg-card py-0">
          <CardHeader className="px-5 pt-5">
            <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Upcoming</CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Due work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5">
            {upcoming.length ? upcoming.slice(0, 8).map((task) => (
              <Link key={task.id} href={`/app/tasks/${task.id}`} className="block rounded-md border border-border bg-background px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(task.meta.dueAt!).toLocaleString()}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full border-border text-[11px] text-muted-foreground">{task.meta.priority}</Badge>
                </div>
              </Link>
            )) : <p className="text-sm text-muted-foreground">No due dates yet.</p>}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-card py-0">
          <CardHeader className="px-5 pt-5">
            <CardDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reminders</CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">Scheduled prompts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5">
            {reminders.length ? reminders.slice(0, 10).map(({ task, reminder }) => (
              <div key={reminder.id} className="rounded-md border border-border bg-background px-4 py-3">
                <p className="font-medium text-foreground">{task.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(reminder.at).toLocaleString()}</p>
                {reminder.label ? <p className="mt-1 text-sm text-muted-foreground">{reminder.label}</p> : null}
              </div>
            )) : <p className="text-sm text-muted-foreground">No reminders scheduled.</p>}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
