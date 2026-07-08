"use client";

import { useState } from "react";

/**
 * A minimal locale picker. Hidden when only one option is available so
 * single-locale landings never render a useless control.
 */
export function LocaleSwitcher({
  options,
  onChange,
}: {
  options: string[];
  onChange: (lang: string) => void;
}) {
  const [current, setCurrent] = useState(options[0] ?? "en");

  if (options.length <= 1) return null;

  return (
    <select
      value={current}
      onChange={(e) => {
        setCurrent(e.target.value);
        onChange(e.target.value);
      }}
      aria-label="Language"
      className="h-9 rounded-md border border-white/10 bg-transparent px-2 text-sm"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
