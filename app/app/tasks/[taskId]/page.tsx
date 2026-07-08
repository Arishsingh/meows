import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { TaskDetailEditor } from "@/components/app/TaskDetailEditor";
import { requireSession, getWorkspace } from "@/lib/taskline/server";

export default async function TaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const session = await requireSession("/app/tasks");
  const { taskId } = await params;
  const { lists, tasks } = await getWorkspace(session.user.id);
  const task = tasks.find((entry) => entry.id === taskId);
  if (!task) notFound();

  return (
    <Card className="rounded-xl border-border bg-card py-0">
      <CardContent className="px-5 py-5">
        <TaskDetailEditor task={task} lists={lists} />
      </CardContent>
    </Card>
  );
}
