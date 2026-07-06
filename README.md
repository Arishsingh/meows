# [GROWTH-SEO] You are the always-on growt

> [GROWTH-SEO] You are the always-on growt

Shipped by [Moonshift on OpenCode](https://github.com/HarjjotSinghh/moonshift-opencode) — a multi-agent night shift that turns a one-line project idea into a deployed web app while you sleep.

## The idea

[GROWTH-SEO] You are the always-on growth agent doing an SEO pass on a deployed app. Audit the app's SEO and fix the gaps with the SMALLEST possible change. Do NOT redesign or restyle anything.
Fix only these, and only where missing or wrong:
- Page <title> and meta description on every public route (unique, descriptive, under length limits).
- Open Graph + Twitter card tags (og:title, og:description, og:image, twitter:card) so shared links preview correctly.
- A sitemap.xml and robots.txt (Next.js app/sitemap.ts + app/robots.ts conventions if the app is Next.js).
- JSON-LD structured data for the app's primary entity (Organization / WebSite / Product as appropriate).
- Canonical URLs and a sensible <html lang>.
Rules (follow exactly):
- Read the relevant existing files first. The app is already on disk.
- Touch only metadata / head / sitemap / robots files. Do NOT change app logic, routes, data, styling, or copy meaning.
- Keep all existing routes, pages, and features intact.
- Do not invent an OG image binary; reference the app's existing image or its /api/og route if present, otherwise a sensible static path.

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
