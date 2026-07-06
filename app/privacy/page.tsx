export const metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <a href="/" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">&larr; Back home</a>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Your privacy matters. This explains what Rankly collects and how it is used.</p>
      <div className="mt-12 space-y-10">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">1. Overview</h2>
          <p className="leading-relaxed text-muted-foreground">This policy describes how Rankly collects, uses, and protects your information when you use the service.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">2. Information we collect</h2>
          <p className="leading-relaxed text-muted-foreground">Account information you provide (such as your email and name) and the data you create in the app (such as your habits and check-ins). We also collect basic technical data needed to operate the service.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">3. How we use information</h2>
          <p className="leading-relaxed text-muted-foreground">To provide and improve the service, authenticate you, store your data, and keep the product secure. We do not sell your personal information.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">4. Cookies & local storage</h2>
          <p className="leading-relaxed text-muted-foreground">We use cookies and local storage strictly to keep you signed in and to remember essential preferences. We do not use them for cross-site advertising.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">5. Data retention</h2>
          <p className="leading-relaxed text-muted-foreground">We retain your data for as long as your account is active. You can delete your data at any time, after which it is removed from active systems.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">6. Your rights</h2>
          <p className="leading-relaxed text-muted-foreground">You can access, correct, export, or delete your personal data. Contact us to exercise any of these rights.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">7. Security</h2>
          <p className="leading-relaxed text-muted-foreground">We use industry-standard measures to protect your data, including encrypted connections and scoped access. No method of transmission is perfectly secure, but we work to safeguard your information.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">8. Changes to this policy</h2>
          <p className="leading-relaxed text-muted-foreground">We may update this policy as the service evolves. Material changes will be reflected here with an updated date.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">9. Contact</h2>
          <p className="leading-relaxed text-muted-foreground">Questions about your privacy? Reach us via the <a class="underline underline-offset-4 hover:text-foreground" href="/contact">contact page</a>.</p>
        </section>
      </div>
    </main>
  );
}
