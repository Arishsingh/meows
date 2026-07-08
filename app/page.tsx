import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, CheckCircle2, ListTodo, AlarmClock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OpeningShot from "@/components/landing/OpeningShot";
import KineticHeading from "@/components/scroll/KineticHeading";
import StickyProtocol from "@/components/landing/StickyProtocol";
import Manifesto from "@/components/landing/Manifesto";
import SystemStatus from "@/components/landing/SystemStatus";
import { GridPattern } from "@/components/registry/magicui/grid-pattern";
import { demoItems } from "@/lib/demo-data";

const links = [
  { label: "How it works", href: "#workflow" },
  { label: "Lists", href: "#lists" },
  { label: "Share", href: "#share" },
];

const steps = [
  {
    title: "Capture in one line",
    body: "Type naturally and Taskline lifts out the due date, priority, and labels without slowing you down.",
    media: (
      <div className="space-y-3 p-4">
        <div data-reveal className="rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground">Send proposal tomorrow 3pm p1 #client</div>
        <div className="grid gap-2 sm:grid-cols-3">
          <div data-reveal className="rounded-md border border-border bg-background px-3 py-2"><p data-reveal className="text-xs text-muted-foreground">Title</p><p data-reveal className="text-sm text-foreground">Send proposal</p></div>
          <div data-reveal className="rounded-md border border-border bg-background px-3 py-2"><p data-reveal className="text-xs text-muted-foreground">Due</p><p data-reveal className="text-sm text-foreground">Tomorrow 3:00 PM</p></div>
          <div data-reveal className="rounded-md border border-border bg-background px-3 py-2"><p data-reveal className="text-xs text-muted-foreground">Priority</p><p data-reveal className="text-sm text-foreground">High</p></div>
        </div>
      </div>
    ),
  },
  {
    title: "Drop it into a list",
    body: "Move the task out of the inbox and Taskline keeps the order with it.",
    media: (
      <div className="grid gap-2 p-4">
        {demoItems.slice(0, 3).map((item) => (
          <div data-reveal key={item.id} className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3">
            <div>
              <p data-reveal className="text-sm font-medium text-foreground">{item.title}</p>
              <p data-reveal className="text-xs text-muted-foreground">{item.notes}</p>
            </div>
            <Badge variant="outline" className="rounded-full border-border text-[11px] text-muted-foreground">Ordered</Badge>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Finish with context",
    body: "Comments, reminders, and recurrence stay attached so follow-through is always close at hand.",
    media: (
      <div className="space-y-3 p-4">
        <div data-reveal className="rounded-md border border-border bg-background px-4 py-3">
          <p data-reveal className="text-sm font-medium text-foreground">Weekly review</p>
          <p data-reveal className="mt-1 text-xs text-muted-foreground">Reminder · Fri 4:00 PM</p>
        </div>
        <div data-reveal className="rounded-md border border-border bg-background px-4 py-3">
          <p data-reveal className="text-sm font-medium text-foreground">Design sync</p>
          <p data-reveal className="mt-1 text-xs text-muted-foreground">Recurring · every Monday</p>
        </div>
      </div>
    ),
  },
];

const heroVariants = {
  a: {
    eyebrow: "Fast capture for real work",
    headline: "Capture work fast finish clean",
    accent: "clean",
    subhead:
      "Taskline turns quick thoughts into organized tasks, so inbox noise becomes a clear list you can actually finish.",
    primaryCta: "Start free",
    secondaryCta: "Open your account",
  },
  b: {
    eyebrow: "Stay ahead of the day",
    headline: "Keep tasks moving stay focused",
    accent: "moving",
    subhead:
      "Taskline turns loose notes into a calm task list, so your day stays organized without another heavy system.",
    primaryCta: "Try Taskline",
    secondaryCta: "See it in action",
  },
} as const;

export default function Home() {
  const cookieBucket = cookies().get("ab_hero")?.value;
  const heroBucket = cookieBucket === "a" || cookieBucket === "b" ? cookieBucket : Math.random() < 0.5 ? "a" : "b";
  const hero = heroVariants[heroBucket];

  return (
    <main className="bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight text-foreground">
            Taskline
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-md border-border bg-transparent">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="rounded-md">
              <Link href="/signup">Start free</Link>
            </Button>
          </div>
        </div>
      </header>

      <OpeningShot image="/generated/hero.png" className="border-b border-border">
        <div className="max-w-3xl space-y-6">
          <Badge variant="outline" className="rounded-full border-border bg-background/70 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-foreground">
            {hero.eyebrow}
          </Badge>
          <KineticHeading
            as="h1"
            text={hero.headline}
            accent={hero.accent}
            className="max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-tight text-foreground md:text-7xl"
          />
          <p data-reveal className="max-w-2xl text-base leading-7 text-foreground/90 md:text-lg">
            {hero.subhead}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-md">
              <Link href="/signup">
                {hero.primaryCta} <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-md border-border bg-background/80">
              <Link href="/login">{hero.secondaryCta}</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 pt-2 text-sm text-foreground">
            {[
              "Natural-language capture",
              "Drag tasks between lists",
              "Comments, reminders, recurrence",
            ].map((item) => (
              <div key={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.cookie="ab_hero=${heroBucket}; Path=/; SameSite=Lax";`,
          }}
        />
      </OpeningShot>

      <section id="workflow" className="border-b border-border px-6 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-5">
              <Badge variant="outline" className="rounded-full border-border px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Demo first
              </Badge>
              <h2 data-reveal className="max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                The inbox stays light.
              </h2>
              <p data-reveal className="max-w-lg text-base leading-7 text-muted-foreground md:text-lg">
                Quick-add captures the thought, lists give it a home, and the order stays intact as work moves forward.
              </p>
              <div data-reveal className="space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <ListTodo className="size-5 text-primary" />
                  <p data-reveal className="text-sm text-foreground">Inbox capture</p>
                </div>
                <div className="flex items-center gap-3">
                  <AlarmClock className="size-5 text-primary" />
                  <p data-reveal className="text-sm text-foreground">Parsed due date and priority</p>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="size-5 text-primary" />
                  <p data-reveal className="text-sm text-foreground">Shared list access when the work is bigger than one person</p>
                </div>
              </div>
            </div>

            <div data-reveal className="relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="absolute inset-0 opacity-[0.08]">
                <GridPattern className="h-full w-full" />
              </div>
              <div className="relative grid gap-4 p-5 lg:grid-cols-3">
                <Card className="rounded-xl border-border bg-background/95 py-0">
                  <CardHeader className="px-4 pt-4">
                    <CardDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Capture</CardDescription>
                    <CardTitle className="font-display text-xl font-semibold text-foreground">One line</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 text-sm leading-6 text-muted-foreground">
                    Add a task with a date, label, or priority and Taskline parses it instantly.
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-border bg-background/95 py-0">
                  <CardHeader className="px-4 pt-4">
                    <CardDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Organize</CardDescription>
                    <CardTitle className="font-display text-xl font-semibold text-foreground">Drag it</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 text-sm leading-6 text-muted-foreground">
                    Drop the task into the right list and keep the sequence ordered.
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-border bg-background/95 py-0">
                  <CardHeader className="px-4 pt-4">
                    <CardDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Finish</CardDescription>
                    <CardTitle className="font-display text-xl font-semibold text-foreground">Close it out</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 text-sm leading-6 text-muted-foreground">
                    Notes, reminders, and comments stay with the task until it is done.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StickyProtocol
        steps={steps.map((step, index) => ({
          n: String(index + 1).padStart(2, "0"),
          title: step.title,
          body: step.body,
          media: step.media,
        }))}
      />

      <Manifesto
        kicker="Why it works"
        setup="Most todo tools create more managing than doing."
        payoff="Taskline keeps capture, ordering, and follow-through in one place."
      />

      <section id="lists" className="border-b border-border px-6 py-24 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div data-reveal className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
            <div className="absolute inset-0 opacity-[0.06]">
              <img data-reveal src="/generated/texture.png" alt="" aria-hidden className="h-full w-full object-cover" />
            </div>
            <div className="relative space-y-5">
              <Badge variant="outline" className="rounded-full border-border px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Showcase
              </Badge>
              <h2 data-reveal className="max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                Shared lists stay simple.
              </h2>
              <p data-reveal className="max-w-lg text-base leading-7 text-muted-foreground md:text-lg">
                Invite a teammate, accept the share, and keep working without another heavy project tool.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-foreground">
                <div className="rounded-full border border-border bg-background/85 px-3 py-1.5">Email invites</div>
                <div className="rounded-full border border-border bg-background/85 px-3 py-1.5">Task comments</div>
                <div className="rounded-full border border-border bg-background/85 px-3 py-1.5">Recurrence</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {demoItems.map((item, index) => (
              <div data-reveal key={item.id} className="flex items-start justify-between rounded-2xl border border-border bg-background px-5 py-4">
                <div>
                  <p data-reveal className="font-medium text-foreground">{item.title}</p>
                  <p data-reveal className="mt-1 text-sm leading-6 text-muted-foreground">{item.notes}</p>
                </div>
                <Badge variant="outline" className="rounded-full border-border text-[11px] text-muted-foreground">0{index + 1}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border px-6 py-24 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            { title: "Capture", body: "Type naturally and move on.", icon: ListTodo },
            { title: "Order", body: "Drag work into the right list.", icon: CheckCircle2 },
            { title: "Finish", body: "Reminders, notes, and comments remain attached.", icon: AlarmClock },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="rounded-xl border-border bg-card py-0">
                <CardHeader className="px-5 pt-5">
                  <Icon className="size-5 text-primary" />
                  <CardTitle className="font-display text-2xl font-semibold tracking-tight text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 text-sm leading-6 text-muted-foreground">{item.body}</CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-24 md:py-28">
        <div data-reveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-card p-8 md:flex-row md:items-end">
          <div className="space-y-3">
            <p data-reveal className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Get started</p>
            <h2 data-reveal className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Make the next task obvious.
            </h2>
            <p data-reveal className="max-w-2xl text-base leading-7 text-muted-foreground">
              Sign up, capture one task, and move it into the right list before the day gets noisy.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-md">
              <Link href="/signup">
                Start free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-md border-border bg-transparent">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p data-reveal className="font-display text-xl font-semibold tracking-tight text-foreground">Taskline</p>
            <p data-reveal className="max-w-md text-sm leading-6 text-muted-foreground">
              A clean, fast todo app for busy individuals and small teams.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </div>
            <SystemStatus label="All systems operational" />
          </div>
        </div>
      </footer>
    </main>
  );
}
