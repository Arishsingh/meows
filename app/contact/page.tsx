export const metadata = { title: "Contact" };

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <a href="/" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">&larr; Back home</a>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">Contact</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Questions, feedback, or need a hand with Taskline? Send a message and we&apos;ll get back to you within a couple of business days.
      </p>
      <form className="mt-10 space-y-5" action="mailto:hello@example.com" method="post" encType="text/plain">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
          <input id="name" name="name" type="text" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
          <input id="email" name="email" type="email" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-foreground">Message</label>
          <textarea id="message" name="message" rows={5} required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90">Send message</button>
      </form>
      <p className="mt-8 text-sm text-muted-foreground">Prefer email? Write to <span className="text-foreground">hello@example.com</span>.</p>
    </main>
  );
}
