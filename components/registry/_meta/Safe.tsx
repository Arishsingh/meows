"use client";
// Per-component error boundary used by the registry e2e test pages.
// Catches render-time exceptions for ONE component so a single broken
// component does not crash the whole test page.
//
// Distinguishes two failure modes:
//   1. "needs data" - error message looks like missing required prop
//      ("Cannot read properties of undefined", "is not iterable",
//      "is not a function"). Yellow card; not a registry bug, just
//      means the component needs data we did not pass.
//   2. "broken" - any other render-time exception. Red card; needs
//      registry fix.
import { Component, type ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message: string;
  needsData: boolean;
}

const NEEDS_DATA_RE =
  /Cannot read prop|is not iterable|is not a function|Cannot destructure|Required prop|Missing required|getAttribLocation|getUniformLocation|parameter 1 is not of type|Could not load|must be a string|must be an array|async\/await is not yet supported in Client Components/;

export class Safe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "", needsData: false };
  }
  static getDerivedStateFromError(err: Error): State {
    const message = err?.message ?? String(err);
    return { hasError: true, message, needsData: NEEDS_DATA_RE.test(message) };
  }
  componentDidCatch(err: Error): void {
    // eslint-disable-next-line no-console
    console.error(`[Safe] ${this.props.label}:`, err);
  }
  render() {
    if (this.state.hasError) {
      const kind = this.state.needsData ? "needs-data" : "broken";
      const tone =
        kind === "needs-data"
          ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
          : "border-red-500/50 bg-red-500/15 text-red-300";
      return (
        <div data-registry-status={kind} data-registry-label={this.props.label} className={`rounded border p-3 text-xs ${tone}`}>
          <strong>{this.props.label}</strong> [{kind}]: {this.state.message.slice(0, 240)}
        </div>
      );
    }
    return (
      <div data-registry-status="ok" data-registry-label={this.props.label} className="rounded border border-white/10 p-2">
        {this.props.children}
      </div>
    );
  }
}
