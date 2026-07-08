import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requireSession, getWorkspace, collectTaskCounts, taskPriorityCounts, listTaskCounts } from "@/lib/taskline/server";

const nav = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/inbox", label: "Inbox" },
  { href: "/app/lists", label: "Lists" },
  { href: "/app/search", label: "Search" },
  { href: "/app/reminders", label: "Reminders" },
  { href: "/app/settings", label: "Settings" },
];

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession("/app");
  if (!session?.user?.id) redirect("/sign-in?next=/app");
  const { lists, tasks } = await getWorkspace(session.user.id);
  const counts = collectTaskCounts(tasks);
  const priorities = taskPriorityCounts(tasks);
  const listCounts = listTaskCounts(lists, tasks).slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-border bg-background lg:border-r lg:border-b-0">
          <div className="flex h-full flex-col gap-8 px-6 py-6 lg:sticky lg:top-0 lg:h-screen">
            <div className="flex items-center justify-between">
              <Link href="/app" className="font-display text-xl font-semibold tracking-tight">
                Taskline
              </Link>
              <Badge variant="outline" className="rounded-full border-border px-2 py-1 text-[11px]">
                {counts.open} open
              </Badge>
            </div>

            <nav className="space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                >
                  <span>{item.label}</span>
                  {item.href === "/app/inbox" ? <span className="text-xs text-primary">{counts.overdue > 0 ? `${counts.overdue} due` : ""}</span> : null}
                </Link>
              ))}
            </nav>

            <div className="space-y-4 border-t border-border pt-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Workload</p>
                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-md border border-border bg-card p-3">
                    <p className="text-xs text-muted-foreground">Open</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-foreground">{counts.open}</p>
                  </div>
                  <div className="rounded-md border border-border bg-card p-3">
                    <p className="text-xs text-muted-foreground">Today</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-foreground">{counts.dueToday}</p>
                  </div>
                  <div className="rounded-md border border-border bg-card p-3">
                    <p className="text-xs text-muted-foreground">High</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-foreground">{priorities.high}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Lists</p>
                <div className="mt-3 space-y-2">
                  {listCounts.map((list) => (
                    <div key={list.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                      <span className="truncate text-foreground">{list.title}</span>
                      <span className="text-xs text-muted-foreground">{list.openCount}</span>
                    </div>
                  ))}
                  {listCounts.length === 0 && (
                    <p className="text-sm text-muted-foreground">Create a list to organize active work.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">Signed in as {session.user.name ?? session.user.email}</p>
              <Button asChild variant="outline" className="w-full rounded-md border-border bg-transparent">
                <Link href="/app/inbox">Quick add</Link>
              </Button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Taskline</p>
              <h1 className="font-display text-lg font-semibold tracking-tight text-foreground">{counts.overdue > 0 ? "Stay ahead of the queue" : "Keep the queue moving"}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="rounded-full border-border px-3 py-1 text-xs text-foreground">{counts.overdue} overdue</Badge>
              <Badge variant="outline" className="rounded-full border-border px-3 py-1 text-xs text-foreground">{counts.dueToday} due today</Badge>
            </div>
          </header>
          <main className="px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
