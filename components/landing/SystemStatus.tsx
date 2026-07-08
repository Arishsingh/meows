/**
 * Cinematic "system operational" footer detail — a tiny live-status chip: a
 * pulsing dot + a short monospace label. A small, confident sign-off that reads
 * as a real product (the one place font-mono is sanctioned — a micro technical
 * label, never headings or body).
 *
 * FAIL-VISIBLE + token-only: pure markup + a CSS pulse (motion-reduce disables the
 * animation, dot stays visible). Drop it in the footer.
 */
export default function SystemStatus({ label = "All systems operational" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      {label}
    </span>
  );
}
