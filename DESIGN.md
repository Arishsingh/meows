# DESIGN.md — Taskline

> Taskline is a clean, fast todo app for busy individuals and small teams who want to capture tasks instantly, organize them into simple lists, and move work to done without clutter. It combines natural-language task entry, drag-and-drop prioritization, recurring tasks, reminders, search and filters, and lightweight shared-list collaboration so users can stay focused on execution instead of administration.

## Direction
- **Aesthetic:** brutally-minimal — stark monochrome, hairline borders, generous whitespace, one accent
- **Theme:** LIGHT background (#ffffff).
- **Background FX must match the theme:** this is a LIGHT theme, so do NOT use glow / aurora / beams / fog / dark-gradient background components — on a light background they render muddy, grey and washed-out. Keep the hero background clean: a subtle brand-tint gradient, a scrimmed generated image, or a crisp solid surface.
- **Mood:** crisp, focused, efficient, modern
- **Motion:** balanced (use motion/Framer for purposeful transitions; respect prefers-reduced-motion)

## Art direction (commit to this — it is what separates award-grade from generic-AI)
- **Layout archetype:** Swiss editorial: a hard left-aligned, oversized headline, vast negative space, a single hairline-ruled grid. Asymmetric — never a dead-centered hero.
- **Signature moment (pick ONE, fail-visible, reduced-motion-safe):** a KineticHeading H1; keep the background clean (no busy FX).
- Be deliberately ASYMMETRIC where the archetype calls for it — a confident off-center composition reads as DESIGNED; a dead-centered hero over three equal cards reads as generic-AI. (Intentional asymmetry only — never let elements overlap, collide, or clip.)
- ONE signature moment, executed with craft, beats five competing effects. Restraint reads as premium.

## Typography (scaffold-loaded — do NOT call next/font or invent font names)
- The scaffold has loaded a curated font pairing for this "brutally-minimal" direction. Use the Tailwind ROLE classes only: **font-display** (hero + section headings), **font-body** (prose, UI, paragraphs).
- **font-mono is OFF-LIMITS for headings and body/prose.** Reserve it for inline code, keyboard keys, or a tiny technical label only — and even then sparingly. An all-monospace or mono-headline landing reads as a developer/terminal tool and looks generic on a normal product. Headings → font-display, everything else → font-body.
- Make the type DRAMATIC: an oversized, confident hero display (think clamp(2.5rem, 6vw, 5rem)), a clear scale, tight heading tracking, comfortable body line-height (1.5–1.7). Big type is half of a cinematic landing.

## Color tokens
| token | value |
|-------|-------|
| background | #ffffff |
| surface | #fafafa |
| foreground | #0a0a0a |
| muted | #737373 |
| primary | #0a0a0a |
| accent | #2563eb |
| border | #e5e5e5 |

- Radius: 0.25rem. Borders are hairline (1px, #e5e5e5). Prefer one accent, used sparingly.

## Layout principles
- Strong visual hierarchy; one primary action per view.
- The dashboard + the primary workflow ("Quick-add a task in the inbox with a natural-language due date, then organize it into a list/project and see it persist in the ordered task view.") get the most polish.
- Real empty / loading / error states for every data view (never a blank screen).
- Consistent spacing scale (4/8/12/16/24/32). Align to a grid. Avoid generic-AI gradients-on-everything.

## Components
- Use shadcn/ui primitives already in the template. Compose, don't reinvent.
- Buttons: clear primary vs secondary; visible focus rings; disabled + loading states.
- Forms: inline validation, helpful errors, optimistic feedback where it helps.

## Cinematic craft layer (the signature that separates award-grade from generic)
Build a digital INSTRUMENT, not a webpage. Every scroll is intentional, every motion is weighted, every section earns its place. Eradicate the generic-AI tells (centered hero over three equal cards, default shadcn, empty voids, gradients on everything). Confidence and restraint over noise.

- **Room / identity:** A control room for the future — raw precision, pure information density, zero decoration. Let this guide tone, imagery and copy — the landing should feel like THAT place.
- **Hero headline pattern (two beats):** a direct setup verb-phrase on line one, then a single SYSTEM noun on line two as the payoff (accent or oversized) — e.g. "Ship the" / "signal." The headline renders ONCE (no duplicate-text / split / typewriter effects), every word SOLID and high-contrast — you may colour or oversize the ONE payoff word, never ghost the rest.
- **Signature SHAPE:** assemble the landing from the scaffold's cinematic landing kit — at minimum a floating-island nav + an opening-shot hero (tall, full-bleed, content anchored off-centre), plus a manifesto band and/or sticky protocol where the product fits (see the builder brief for the exact `@/components/landing/*` imports). This is how the page escapes the generic centred-hero-then-cards template.
- **Texture & motion:** an optional barely-there grain (≤6% opacity) adds filmic depth — keep a calm, near-solid zone behind all text. Weighted, purposeful easing; everything visible by default; honour prefers-reduced-motion. These are a PALETTE — pick the few that fit, executed with craft. One signature moment beats five competing effects.

## THIS BUILD'S STRUCTURE RECIPE — make THIS landing structurally DIFFERENT, do not reach for the default template
Every generic AI builder ships the SAME landing shape (floating-pill nav -> centered hero -> 3-card features -> how-it-works -> testimonials -> FAQ -> CTA). DO NOT. For THIS build, compose the page around this recipe:
- HERO: FULL-BLEED IMAGE — the generated hero image under a readable gradient scrim, hero content anchored BOTTOM-LEFT (the OpeningShot component is fine). Use the EXISTING generated image — do NOT hand-build a mockup.
- NAV: MINIMAL LEFT BAR — wordmark left, 2-3 links + CTA right, a single hairline bottom border, NO pill.
- SECTION ORDER STRATEGY: DEMO-FIRST — show the product working (a large feature deep-dive or interactive section) immediately after the hero, BEFORE any card grid.
- SIGNATURE MOVE (the ONE bold compositional move, used once): A single STICKY-SCROLL sequence as the centerpiece.
Then CHOOSE the sections (and their order) that tell THIS specific product's story — a subset from the palette, NOT a fixed checklist, NOT a fixed count. Two different products must produce visibly different page STRUCTURES, not the same skeleton recolored.
This recipe guides COMPOSITION and ORDER — it is NOT a licence to add build work. FINISH a COMPLETE landing (every chosen section fully written with real content) and a WORKING app FIRST; achieve the look through layout, type, spacing and the already-generated images, NOT by hand-building expensive bespoke components. A complete page in this style beats an elaborate half-built one. All readability / visibility / token-only / no-shadow / one-CTA rules still apply on top of this recipe.


## Demo data
Realistic example rows are generated in `lib/demo-data.ts` (one array per entity). Import them to render rich, believable content in PREVIEW / empty / loading states (and seed the first view) so the app never looks blank — never ship "Item 1 / Item 2" placeholders.
