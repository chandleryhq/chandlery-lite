# Chandlery Lite

A working TanStack Start app on Cloudflare Workers, with a real database and real
accounts: D1 with Drizzle migrations, Better Auth email-and-password sign-in, the
account screens wired up, shadcn/ui, and tests that run on the actual Workers
runtime rather than a Node approximation.

It is a starting point, not a showcase. Sign up, sign in, add a row, deploy it — the parts
that usually take a weekend to connect are already connected.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/chandleryhq/chandlery-lite)

**Running, right now:** [chandlery-lite.limitless-ai.workers.dev](https://chandlery-lite.limitless-ai.workers.dev)
— this repository, deployed with nothing changed but the database id. Make an account on it and see
what you get.

## Deploy it

Click the button. Cloudflare forks this repository into your own GitHub account,
creates the D1 database, applies the migrations and deploys the Worker.

One thing to do afterwards, because no deploy flow can invent a secret for you:

```bash
openssl rand -base64 32   # copy the output
npx wrangler secret put BETTER_AUTH_SECRET
```

Sign-in works from that point on. You do not have to set `BETTER_AUTH_URL` —
with it unset the app reads the origin from the request, which is what makes the
first deploy work before you own a domain. Once you have one, set it explicitly:
an origin you pinned is a stronger guarantee than one inferred from a header.

## Or run it locally

```bash
npm create cloudflare@latest -- --template=chandleryhq/chandlery-lite
```

Then, in the directory it creates:

```bash
cp .dev.vars.example .dev.vars   # fill in BETTER_AUTH_SECRET
pnpm install
pnpm cf-typegen                  # generate the Env and Cloudflare types
pnpm dev:setup                   # create the local D1 tables
pnpm dev
```

`worker-configuration.d.ts` is generated, not committed, so `cf-typegen` is the
step that makes your editor and `pnpm typecheck` agree with your bindings. Run it
again whenever you change `wrangler.jsonc` or add a key to `.dev.vars`.

`pnpm test` runs the suite against workerd. `pnpm deploy:live` applies migrations and
then deploys; it needs a real `database_id` in `wrangler.jsonc`, which you get
from `npx wrangler d1 create chandlery-lite-db`.

## What is in here

| | |
| --- | --- |
| Framework | TanStack Start, React 19, Vite |
| Runtime | Cloudflare Workers, Smart Placement, observability on |
| Database | D1 with Drizzle ORM and generated migrations |
| Accounts | Better Auth, email and password, session cookie cache |
| API | oRPC, end-to-end typed |
| UI | shadcn/ui and Tailwind |
| Tests | Vitest on the Workers runtime |
| Lint | Biome |

## What is deliberately not in here

This is the stack, and nothing beyond it. No feature recipes, no example
gallery, no provisioning or deploy automation, no staged guidance for somebody
who has never opened a terminal, and no support.

Those are the paid product, [Chandlery](https://chandlery.app/?utm_source=github&utm_medium=readme&utm_campaign=lite).
If you are a developer, you probably want this repository and nothing else — take
it, it is MIT. If you are not a developer and the terminal is the obstacle rather
than the code, that is the problem the paid version exists to solve.

## Licence

MIT. See [LICENSE](LICENSE).
