# Deployment — SASP dashboard + Finanzaonline ingestion

Two surfaces ship together: the static dashboard ([`SASP.html`](SASP.html), [`SASP-tour.html`](SASP-tour.html), [`ingestion.html`](ingestion.html)) and the live-ingestion backend in [`api/`](api/). Target host: **Vercel**. The Anthropic API key is the existing Kakashi Ventures project key.

## One-time setup

1. **Create the Vercel project.** Connect the `kakashi-ventures/saspdashboard` repo. Framework preset: *Other* (no build needed for static, [`vercel.json`](vercel.json) handles the rest). Output directory: project root.

2. **Attach Vercel KV.** Project → *Storage* → *Create Database* → *KV*. Vercel auto-injects `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, and `KV_URL` env vars across Preview + Production.

3. **Set environment variables** (project → *Settings* → *Environment Variables*):

| Key | Where | Value |
|---|---|---|
| `ANTHROPIC_API_KEY` | Production + Preview | Kakashi Ventures project key |
| `VALIDATOR_PASSWORD` | Production + Preview | Pick a strong password — shared with Maryam |
| `INGEST_USER_AGENT` | Production (optional) | `SASP-research/1.0 (+https://kakashi.ventures)` |

4. **Verify cron registration.** First deploy registers the cron declared in [`vercel.json`](vercel.json) (`0 4 * * *` UTC, hits `/api/ingest`). Project → *Cron Jobs* should list it after the first deploy.

5. **Deploy.** Vercel does this on push. First deploy URL is your preview; promote to Production from the Vercel dashboard.

## Verification (in order)

Treat as the smoke-test checklist before declaring v0 live.

1. **Manual ingest run.**
   ```
   curl -X POST https://<your-vercel-domain>/api/ingest
   ```
   Expect `{ ok: true, posts_seen: N, posts_added: M }` where N > 0 and M ≥ 0.
2. **KV inspection.** Vercel KV dashboard → confirm `signals:pending` ZSET has new entries and `signals:hashes` SET grew.
3. **Validator queue.** Open `https://<your-vercel-domain>/validator.html`, sign in with `VALIDATOR_PASSWORD`. Pending signals appear. Approve at least one (try editing a paraphrase first).
4. **Dashboard view.** Open `https://<your-vercel-domain>/SASP.html` → *Sources* screen → **Fresh signals · Finanzaonline** tile shows the approved signals with theme badges and "Open original" links.
5. **Cron self-run.** Wait one cron cycle (next 04:00 UTC) — confirm `last_run.ts` in the validator footer updates without manual trigger.
6. **Verbatim-leak guard test.** From a shell with access:
   ```
   curl -s -X POST https://<host>/api/ingest && curl -s -X GET https://<host>/api/signals?status=pending \
     -H "Authorization: Basic $(echo -n validator:$VALIDATOR_PASSWORD | base64)"
   ```
   Spot-check that no paraphrase shares ≥4 consecutive words with an original — the in-pipeline guard rejects these, but the validator should still sample.
7. **Tour still plays.** `https://<host>/SASP-tour.html?org=banca-esempio&product=personal-loan-young-pros` — Sunday-demo tour unchanged (backwards-compat aliases in [`data.jsx`](data.jsx) are intact).

## Local development

Vercel CLI handles `/api/*` routing locally so it matches production:

```
npm install
vercel link    # connect to the deployed project
vercel env pull .env.local
npm run dev    # = vercel dev — serves static files + /api/* together at http://localhost:3000
```

`vercel dev` injects the KV + Anthropic env vars from `.env.local`. Without those, `/api/ingest` will fail with a clear error — that's expected; the dashboard's *Fresh signals* tile degrades to an empty state in that case (see [`getFreshSignals()`](data.jsx) in `data.jsx`).

Type-check the API:

```
npm run typecheck
```

## What runs where

| Surface | Path | Runtime |
|---|---|---|
| Dashboard | `SASP.html`, `SASP-tour.html`, `ingestion.html` | Static, browser-Babel `.jsx` |
| Validator | `validator.html`, `validator.jsx` | Static, browser-Babel `.jsx` |
| Crawl + paraphrase orchestrator | `/api/ingest` | Vercel Function, cron-triggered |
| Signal read + decisions | `/api/signals` | Vercel Function |
| State | Vercel KV | Managed (Upstash Redis under the hood) |

## Operational hygiene

- **Monitor `last_run`.** The validator queue footer surfaces the most recent ingest. If `posts_seen` is 0 for two days in a row, the Finanzaonline HTML structure has likely drifted — update selectors in [`api/_lib/finanzaonline.ts`](api/_lib/finanzaonline.ts).
- **Cost.** ~10 paraphrases/day × ~500 tokens × Claude Haiku ≈ pennies/month. Vercel KV and Functions free tier covers v0.
- **TOS.** Per [`INGESTION_NARRATIVE.md`](INGESTION_NARRATIVE.md) §7 the posture is public-web, no auth, paraphrased. The crawler sends an honest User-Agent and rate-limits to 1 req/sec. If Finanzaonline's TOS changes, pause the cron from the Vercel dashboard.
- **Signal expiry.** Out of scope for v0. Future: a `prune` endpoint that retires signals older than N months.

## Out of scope for v0

- Multi-source ingestion (intermediary editorial, MEF/ISTAT, etc.)
- Multi-validator + inter-rater agreement (per [`INGESTION_NARRATIVE.md`](INGESTION_NARRATIVE.md) §6 production target)
- Auto-archetype updates when new KOs land
- Public anonymous read of `/api/signals` — kept authenticated to avoid scraping
