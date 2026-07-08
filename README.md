# make a todo application

> make a todo application

Shipped by [Moonshift on OpenCode](https://github.com/HarjjotSinghh/moonshift-opencode) — a multi-agent night shift that turns a one-line project idea into a deployed web app while you sleep.

## The idea

make a todo application

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
