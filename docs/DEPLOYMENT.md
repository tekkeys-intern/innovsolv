# Deployment (Vercel) & operations

## First deploy
1. Push the project to a Git repository (GitHub/GitLab/Bitbucket).
2. Vercel → *Add New Project* → import it. Framework preset: **Other** (already set by `vercel.json`).
3. Environment variables (Project → Settings → Environment Variables):
   `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_TO` (and optional `SMTP_FROM_NAME`, `SITE_URL`). See `.env.example`.
4. Deploy. The build runs `npm run gen` automatically (`prebuild`) → industry pages, job pages, sitemap, legal pages, then `vite build`.
5. Domain: Project → Domains → add `innovsol.ai` and `www`; set the canonical domain; HTTPS is automatic.
6. Smoke test on the live URL: home · an industry page · a job page (Apply opens email) · contact form (real email arrives) · `/sitemap.xml` · `/robots.txt`.

## Everyday commands
| Command | What it does |
|---|---|
| `npm run dev` | Local dev server (http://localhost:5173) |
| `npm run gen` | Regenerate industry pages, job pages, sitemap/legal pages from `content/*.json` |
| `npm run check` | Link / CTA / image / SEO checker (exit 1 on problems) — run before every deploy |
| `npm run build` | Production build (runs `gen` first) |

## Changing content
* **Industry copy / stats / modules:** edit `content/industries.json` (art & icons: `META` in `scripts/industries/build.cjs`) → `npm run gen`.
* **Job details:** edit `content/jobs.json` → `npm run gen` (then `node scripts/supabase-seed.cjs` if the portal is on).
* **Home / careers sections:** edit the section's folder in `src/modules/` (see its README).
* **Apply / Playbook email wording:** `scripts/mailto.cjs` → `node scripts/apply-mailto.cjs && npm run gen`.
* **Recipient address:** `TO` in `scripts/mailto.cjs`, `SMTP_TO` env var for the contact form.

## Before you announce the site
- [ ] `npm run check` passes
- [ ] SMTP variables set, contact form tested
- [ ] `SITE_URL` / canonical domain correct
- [ ] Legal pages reviewed by counsel
- [ ] Search Console + sitemap submitted
- [ ] (If using the portal) Supabase configured, `connect-src` updated, first admin created — see `ARCHITECTURE-V2.md`
- [ ] Replace the 4 remote Unsplash photos with your own (see `PERFORMANCE.md`)
- [ ] Confirm the Apply/Playbook mailbox (`hello@innovsol.ai`) is monitored

## Rollback
Vercel keeps every deployment: Deployments → pick the last good one → *Promote to Production*.
