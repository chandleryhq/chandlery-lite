# Agent Skills (on demand)

Skills are optional procedures an agent installs when the task matches. They are not part of the
app runtime. Prefer a skill from this catalog over inventing long Cloudflare, UI, or debugging
procedures from memory.

## Install

Project scope, all agents:

```bash
npx skills add <owner/repo> --skill <name> -a '*' -y
```

Multiple skills from one repo (space-separated after `--skill`, or repeat `--skill`):

```bash
npx skills add cloudflare/skills --skill cloudflare wrangler workers-best-practices -a '*' -y
```

If a multi-skill install fails, run one skill per command instead.

Skip reinstall when the skill is already present under `.agents/skills/`, `.claude/skills/`, or
`.codex/skills/`. Always install into the project (never `-g`). Stick to this catalog; public
repos only.

List what a repo offers without installing: `npx skills add <owner/repo> -l`.

---

## Cloudflare — required before CF work

Before any Workers, D1, wrangler, deploy, or Cloudflare architecture work, install at least:

| Skill | Repo | When |
| --- | --- | --- |
| `cloudflare` | `cloudflare/skills` | Product choice and architecture |
| `wrangler` | `cloudflare/skills` | CLI, local/dev, deploy, resources |
| `workers-best-practices` | `cloudflare/skills` | Writing or reviewing Workers |

```bash
npx skills add cloudflare/skills --skill cloudflare wrangler workers-best-practices -a '*' -y
```

Also on demand from the same repo:

| Skill | When |
| --- | --- |
| `durable-objects` | Durable Objects state / coordination |
| `agents-sdk` | Cloudflare Agents SDK (`agents` package) |
| `cf-cli` | `cf` CLI vs wrangler; API / resource commands |
| `workers-profiling` | CPU / memory on deployed Workers or DOs |

Security review (separate repo):

| Skill | Repo | When |
| --- | --- | --- |
| `security-audit` | `cloudflare/security-audit-skill` | Security questions, audits, vulnerability review |

```bash
npx skills add cloudflare/security-audit-skill --skill security-audit -a '*' -y
```

---

## UI

| Skill | Repo | When |
| --- | --- | --- |
| `frontend-design` | `anthropics/skills` | Distinctive, production-grade frontend UI |
| `design-taste-frontend` | `Leonxlnx/taste-skill` | Art direction; anti-slop landing / product pages |
| `impeccable` | `pbakaus/impeccable` | Design polish, critique, DESIGN.md / tokens |
| `shadcn` | `shadcn-ui/ui` | shadcn/ui add, search, fix, compose |

```bash
npx skills add anthropics/skills --skill frontend-design -a '*' -y
npx skills add Leonxlnx/taste-skill --skill design-taste-frontend -a '*' -y
npx skills add pbakaus/impeccable --skill impeccable -a '*' -y
npx skills add shadcn-ui/ui --skill shadcn -a '*' -y
```

---

## Quality

| Skill | Repo | When |
| --- | --- | --- |
| `systematic-debugging` | `obra/superpowers` | Bugs, test failures, unexpected behaviour |
| `verification-before-completion` | `obra/superpowers` | Before claiming done / green / merge-ready |
| `writing-plans` | `obra/superpowers` | Multi-step work before touching code |
| `executing-plans` | `obra/superpowers` | Running an agreed implementation plan |
| `web-quality-audit` | `addyosmani/web-quality-skills` | Evidence-led perf / a11y / SEO audit |

```bash
npx skills add obra/superpowers --skill systematic-debugging verification-before-completion writing-plans executing-plans -a '*' -y
npx skills add addyosmani/web-quality-skills --skill web-quality-audit -a '*' -y
```

---

## i18n and copy (on demand)

| Skill | Repo | When |
| --- | --- | --- |
| `internationalization` | `rampstackco/claude-skills` | Locales, hreflang, RTL, translation workflow |
| `copywriting` | `coreyhaines31/marketingskills` | Marketing / landing / product copy |

```bash
npx skills add rampstackco/claude-skills --skill internationalization -a '*' -y
npx skills add coreyhaines31/marketingskills --skill copywriting -a '*' -y
```

---

## Agent rules

1. Match the task to a row above; install only what you need.
2. Do not invent long Cloudflare, UI, or debug playbooks when a catalog skill covers them.
3. Do not install skills outside this catalog unless the user names a public repo.
4. After install, follow the skill's own `SKILL.md` — it wins over memory.
