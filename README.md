# [GROWTH-AB] You are the always-on growth

> [GROWTH-AB] You are the always-on growth

Shipped by [Moonshift on OpenCode](https://github.com/HarjjotSinghh/moonshift-opencode) — a multi-agent night shift that turns a one-line project idea into a deployed web app while you sleep.

## The idea

[GROWTH-AB] You are the always-on growth agent setting up a landing-page A/B test on a deployed app. Add a SECOND hero variant and a cookie-bucketed 50/50 split, with the SMALLEST possible change. Do NOT touch anything below the hero.
Do exactly this:
- Create one alternate hero variant (variant B): a different headline + subheadline angle and CTA wording for the SAME offer. Keep layout, colors, and components identical - only the copy differs.
- Add a server-side 50/50 split: assign each visitor a sticky bucket via a cookie (e.g. `ab_hero=a|b`) set on first visit, and render variant A or B from that cookie. Reuse the app's existing cookie/middleware approach if it has one.
- Make the split deterministic per visitor and stable across reloads (read the cookie if present, else assign + set it).
- Do NOT add any analytics SDK or external service; just render the assigned variant. Measurement rides the app's existing analytics.
Rules (follow exactly):
- Read the existing hero/landing component first. The app is already on disk.
- Touch only the landing hero + the minimal cookie/bucket plumbing. Keep every other route, page, and feature intact.
- No new dependencies. Plain cookies + the framework's existing primitives only.

The deployed app is at: http://localhost:6191
For context only, the app was originally built from: make a portflio

## Stack

- **Next.js 14** (App Router, RSC)
- **TypeScript** strict
- **Tailwind CSS**
- **Better Auth** + **Drizzle ORM** on LibSQL
- **`@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`** pre-installed. Use these for any drag-and-drop UI (kanban columns, sortable lists, draggable cards). Do not write raw HTML5 `draggable` handlers.
- Deployed to **Vercel**

## Run locally

```bash
cp .env.example .env
# fill in secrets
bun install   # or pnpm / npm
bun run db:push
bun run dev
```

Visit http://localhost:3000.

## Project structure

```
app/            # Next.js routes — pages, layouts, API handlers
app/api/auth/   # Better Auth catch-all route
lib/auth.ts     # server-side auth config
lib/auth-client.ts  # client-side auth hooks
lib/db/         # schema + drizzle client
```

Extend by adding endpoints under `app/api/<feature>/route.ts` and tables to `lib/db/schema.ts`.

## Credits

Scaffold generated at commit time by Moonshift's `deployer` agent. Landing copy + deploy URL written by the same pipeline.
