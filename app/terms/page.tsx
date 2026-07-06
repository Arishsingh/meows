export const metadata = { title: "Terms of Service" };

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <a href="/" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">&larr; Back home</a>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">Terms of Service</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">By using Lumen you agree to these terms. Please read them carefully.</p>
      <div className="mt-12 space-y-10">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">1. Acceptance of terms</h2>
          <p className="leading-relaxed text-muted-foreground">By creating an account or using Lumen, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">2. Your account</h2>
          <p className="leading-relaxed text-muted-foreground">You are responsible for keeping your login credentials secure and for all activity under your account. Notify us promptly of any unauthorized use.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">3. Acceptable use</h2>
          <p className="leading-relaxed text-muted-foreground">Use the service lawfully and respectfully. Do not attempt to disrupt, reverse-engineer, or abuse the service, or use it to store unlawful content.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">4. Service availability</h2>
          <p className="leading-relaxed text-muted-foreground">We work to keep the service available and reliable, but it is provided on an “as available” basis. Features may change, and occasional downtime can occur.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">5. Disclaimer</h2>
          <p className="leading-relaxed text-muted-foreground">Lumen is provided “as is” without warranties of any kind, express or implied, including fitness for a particular purpose.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">6. Limitation of liability</h2>
          <p className="leading-relaxed text-muted-foreground">To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">7. Changes to these terms</h2>
          <p className="leading-relaxed text-muted-foreground">We may update these terms from time to time. Continued use after changes take effect constitutes acceptance of the revised terms.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">8. Contact</h2>
          <p className="leading-relaxed text-muted-foreground">Questions about these terms? Reach us via the <a class="underline underline-offset-4 hover:text-foreground" href="/contact">contact page</a>.</p>
        </section>
      </div>
    </main>
  );
}
