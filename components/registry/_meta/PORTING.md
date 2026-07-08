# Porting Upstream Components

Reserved for PR 3 of todo #20. Documents the React 19 + Tailwind v4 to
React 18 + Tailwind 3.4 port template used when bringing react-bits
sources into this registry.

The Moonshift starter stack pins:

- React 18.3 (no `useActionState`, no `use()`-as-hook on promises).
- Next 14.2 (App Router).
- Tailwind 3.4 (config-based, NOT v4 CSS-first; no `@import "tailwindcss"`).
- motion v12 (re-exporting Framer Motion API; `import { motion } from "motion/react"`).
- ogl, lenis (already in starter for shader / smooth scroll).

When porting:

- Replace any Chakra UI primitive with the matching shadcn primitive from
  `components/ui/*` (Button, Card, Dialog, etc.).
- Replace any `useActionState`, `useFormStatus` with React 18 equivalents
  (`useState` + manual pending boolean).
- Replace Tailwind v4 `@theme inline` blocks with Tailwind 3.4 config
  entries (or inline arbitrary values).
- Strip `next-themes` dependency unless the component actually uses it;
  the starter already has a working theme provider.
- Verify the ported file builds in isolation: `bunx tsc --noEmit` should
  pass against the saas-starter tsconfig.

Then add the entry to `_manifest.json` and pin any new npm packages in
`_meta/registry-versions.json`.
