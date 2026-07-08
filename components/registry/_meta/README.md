# Component Registry

Pre-bundled, vetted React components available to the frontend + landing
agents at codegen time. Components are imported from
`@/components/registry/<source>/<name>` and trimmed by the
`prune-registry` build_phase step before deploy so unused files never
reach the user's repo.

## What lives here

- `_manifest.json` - controlled-vocabulary catalog (read by agents + pruner).
- `_meta/registry-versions.json` - pinned npm versions for component deps.
- `_meta/LICENSES.md` - per-source attribution.
- `_meta/PORTING.md` - template for porting upstream components.

## How agents pick

Architects read `_manifest.json` once, choose components by `id`, and emit
them in the planner output `componentsPicked[]`. The editor agent imports
the chosen files directly. Hard-rail categories (hero-animation, background,
scroll, marquee, particles, beam, bento, dock, terminal, orbit, text-effect,
3d) MUST be picked from this registry rather than reinvented.

## Lifecycle

PR 1 (this one) ships the directory empty. PR 2 populates it with MagicUI
components fetched via MCP. PR 3 adds ported react-bits components after
React-19-to-React-18 + Tailwind-v4-to-Tailwind-3.4 conversion.

## Pruner behavior

When the generated app finishes the contract-validation phase, the build
runs `prune-registry`: it walks every `.tsx`/`.ts`/`.jsx`/`.js` file under
`app/`, `components/app/`, `components/landing/`, and `lib/`, collects
every static `from "@/components/registry/..."` import specifier, marks
those manifest entries as used (plus their transitive `peer_helpers`),
deletes every other registry file, and splices the surviving entries'
`deps` into `package.json` using versions from `registry-versions.json`.

Dynamic `import("@/components/registry/...")` is intentionally NOT scanned.
Components needing dynamic survival should declare `runtime_dynamic: true`
in their manifest entry.
