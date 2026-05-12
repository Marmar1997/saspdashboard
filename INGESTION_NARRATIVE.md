# Ingestion / Architecture

**Run identifier:** SASP/IT/INGESTION/001
**Date:** 2026-05-11
**Scope:** companion document to the Sunday demo pack (SASP/IT/MTG/001). Standalone, not part of the simulation run.

---

## §1 — What ingestion is and is not in SASP

Ingestion in SASP covers **layers 1–3** of an 8-layer architecture *[verify]*: Data Sources → Source Ranking / Channel Analysis → Raw-to-Social-Signal Extraction. The differentiator lives downstream in **layers 4–6** — epistemic structuring into Knowledge Objects, archetype generation as KO activation patterns, and the simulation itself. Ingestion is the foundation that makes those downstream layers worth running: a clean, traceable, country-deep substrate of language, belief, and distribution. If ingestion is opaque or unrepresentative, every downstream layer inherits the problem.

**What ingestion is NOT.**

- **Not "more data = better."** Volume past the representativeness frontier is noise, and noise compounds through the KO layer. A 500-signal corpus that mirrors Finanzaonline's user skew is worse than a 100-signal corpus that doesn't.
- **Not Reddit-first.** Reddit under-represents Italian mortgage language by an order of magnitude vs. Finanzaonline and the Italian intermediary editorial ecosystem. Defaulting to Reddit is a tell that the ingestion is not country-deep.
- **Not scrape-everything.** The legal posture is public-only, paraphrased, no authenticated scraping. TOS compliance is a per-source design decision, not a default.

The frame to hold: **representativeness, not volume**.

---

## §2 — The methodological line

Two source families, two roles, never mixed in the same weighting step.

**Forums and first-person sources** — Finanzaonline threads, intermediary reader-comment surfaces, paraphrased forum exchanges — feed the **Knowledge Object library**. They are the qualitative substrate for belief, fear, heuristic, idiom, distrust-pattern. They tell us what the audience actually says, what language they recognize, what shame layers exist (e.g. garante familiare as both practical recourse and identity marker, KO-10).

**Official sources** — ISTAT, MEF, Banca d'Italia, Consap, Agenzia delle Entrate, BCE / ECB — feed **distribution shape**. They are the quantitative substrate for population weighting, age distribution, regional intensity, regime forfettario vs. ordinario splits, ISEE cliff dynamics, rate-environment context.

**The failure mode is mixing the two.** Counting Finanzaonline post-volume as a proxy for population frequency, or treating ISTAT averages as belief signals, collapses two distinct epistemic inputs into one noisy aggregate. Forum scrape volume does not estimate Italy. A clean methodology keeps these inputs separate, weights them separately, and joins them only at the audience-generation step (layer 5) under explicit, documented rules.

---

## §3 — Source inventory for the Italian mortgage use case

All sources below are present in the v0.1 corpus (`files/01_signal_corpus.md`) or distribution layer (`files/03_distribution_data.md`). No external sources invented. Status is per the v0.1 demo state.

### Forums & first-person

| Source | Type | Access method | Refresh cadence | Role | Legal posture | Status |
|---|---|---|---|---|---|---|
| forum.finanzaonline.com (Mutui sub-forum, 6 threads, 2014–2026) | Public Italian finance forum | Public web read, no auth | Manual today; weekly polling planned *[verify]* | Language & belief → KOs | Public, paraphrased, no PII | Live in v0.1 (manual); automation planned |

### Bank & intermediary marketing surfaces

| Source | Type | Access method | Refresh cadence | Role | Legal posture | Status |
|---|---|---|---|---|---|---|
| intesasanpaolo.com — Mutuo Giovani product pages + trasparenza PDF | Bank product marketing & legal disclosure | Public web + PDF download | Manual; monthly polling planned *[verify]* | Marketing/reality tension surface (product-side) | Public, paraphrased | Live in v0.1 (manual) |
| MutuiOnline / mutui.it / mutuisupermarket.it (incl. Osservatorio) | Mortgage comparator & aggregator | Public web read | Manual; monthly planned *[verify]* | Intermediary positioning language + Q1 market data | Public, paraphrased | Live in v0.1 (manual) |
| immobiliare.it (Dec 2025 article) | Real-estate portal editorial | Public web read | Manual today | Intermediary framing, threshold heuristics | Public, paraphrased | Live in v0.1 (manual) |
| idealista.it (Apr 2024 article) | Real-estate portal editorial | Public web read | Manual today | Consap framing, under-36 positioning | Public, paraphrased | Live in v0.1 (manual) |
| Italian intermediary editorial — tassomutuo.it, telemutuo.it, mutuiqui.it, partitaiva.it, laquiloneimmobiliare.it | Mortgage & freelance-finance intermediary editorial | Public web read | Manual today | "Folk standard" thresholds, memetic norms (partita IVA 2–3y, 30–35% rata/reddito) | Public, paraphrased | Live in v0.1 (manual) |

### Official / regulatory

| Source | Type | Access method | Refresh cadence | Role | Legal posture | Status |
|---|---|---|---|---|---|---|
| ISTAT (lavoratori autonomi, Oct 2025) | National statistical office | Public statistical release | Quarterly | Distribution shape — total autonomi count (5.23M), YoY change | Public, attributed | Live in v0.1 (manual) |
| MEF / Agenzia delle Entrate (P.IVA statistics, regime forfettario data) | Tax & finance ministry | Public release / agency statistics | Annual | Distribution shape — P.IVA stock, forfettario share, mean reddito | Public, attributed | Live in v0.1 (manual) |
| Banca d'Italia (mortgage erogato Q1 2025) | Central bank | Public; accessed via MutuiSupermarket aggregation in v0.1 | Quarterly | Market context — €13.03B erogato, +52.6% YoY, surroghe doubling | Public, attributed | Live in v0.1 (manual via aggregator); planned direct |
| Consap (Fondo Garanzia Mutui Prima Casa) | State-run guarantee fund | Public reporting via MutuiOnline; Legge di Bilancio 2025 | Annual / on legislative change | Under-36 segment dynamics, ISEE cliff, fund renewal terms | Public, attributed | Live in v0.1 (manual) |
| Agenzia delle Entrate — Osservatorio Mercato Immobiliare | Real-estate transactions registry | Public release | Quarterly | Compravendite volumes, prima-casa share, mortgage incidence | Public, attributed | Live in v0.1 (manual) |
| BCE / ECB | European central bank | Public communications, rate decisions | Per policy meeting | Rate-environment context (KO-11 anchor) | Public, attributed | Live in v0.1 (referenced indirectly via Italian financial press) |
| Italian financial press — Sole 24 Ore, Money.it | Press aggregating official data | Public web read | Manual today; RSS planned *[verify]* | Distribution shape (P.IVA opens by demographic), policy timing | Public, paraphrased | Live in v0.1 (manual) |

---

## §4 — Pipeline architecture (layers 1–3)

**Layer 1 — Data Sources.** Per-source-type connectors: HTML/RSS crawler for public web (forum threads, intermediary editorial, press), PDF parser for bank trasparenza documents, structured-data fetchers for official statistics endpoints (ISTAT, MEF, Agenzia delle Entrate Osservatorio). One connector class per source family, each with its own rate limits, TOS, and authentication posture documented. For v0.1 the connectors are stand-ins for hand extraction; the abstraction holds and the production swap is plumbing.

**Layer 2 — Source Ranking / Channel Analysis.** Per-item relevance scoring against the active corpus theme set (A through F for the mortgage case), freshness weighting (recency-decayed for time-sensitive themes like rate environment, neutral for durable heuristics like garante shame), platform-bias annotation (Finanzaonline-heavy items flagged as urban/male-skewed per the corpus disclosure), and near-duplicate clustering at the paraphrase level so the same heuristic repeated across five intermediary articles registers as one signal, not five.

**Layer 3 — Raw-to-Social-Signal Extraction.** Each raw item passes through a paraphraser that preserves semantic content while breaking verbatim string match (copyright posture); a source-tagger that records URL, date, platform, and access path; a theme assigner that maps to the active corpus taxonomy; and a native-Italian human-in-the-loop validator who catches what the paraphraser misses — irony, regional idiom, affective register, the difference between *atipico* as legal category and *atipico* as identity wound.

---

## §5 — Validation and human-in-the-loop

**Native-Italian validation step.** Each signal is reviewed by a validator with Italian as a working language — not as a translation gate, but as an interpretive gate. The validator's job is the work the paraphraser cannot do: detect irony (forum users say *"fisso, almeno sai come muori"* meaning it humorously and seriously at once); catch regional idiom and tax-regime-specific vocabulary; distinguish *atipico* as legal category from *atipico* as identity wound; flag platform-bias drift (e.g. when a corpus theme drifts Finanzaonline-heavy and needs counter-balancing). For v0.1 this is ad-hoc and single-validator; the production protocol is multi-validator with inter-rater agreement checks.

**Conflict-resolution protocol.** When two sources disagree on a substantive claim — bank product page says a polizza is "obbligatoria", forum heuristic says only incendio is legally mandatory — the default rule is to preserve both as separate KOs with their relations annotated (`contradicts`, see KO-05 ↔ bank framing of ProteggiMutuo in `files/02_knowledge_objects.md`). Resolution-by-truth is explicitly out of scope at the ingestion layer. The contradiction itself is the signal, and surfacing it is part of what SASP delivers downstream.

**Freshness checks and signal expiry.** Time-sensitive signals (rate-environment narratives, regulatory window dates like the Consap renewal through 31 Dec 2027) carry an expiry; durable heuristics (atipico identity, garante shame, TAEG vs TAN literacy) do not. Expired signals are not deleted — they are retired from the active corpus and retained for longitudinal comparison.

**Why automated-only ingestion is methodologically insufficient.** Paraphrase quality, irony detection, affective register, platform-bias correction, and country-specific tax/regulatory nuance are all places where automation systematically loses precisely what makes the SASP corpus differentiated from a generic LLM persona. A generic ingestion pipeline produces a generic output. The HITL step is the structural feature that prevents drift to the mean.

---

## §6 — Current state vs production roadmap

| Dimension | Demo v0.1 (today) | Production target | Timeline |
|---|---|---|---|
| Signal volume | 22 manually curated signals across 6 themes | ≥500 signals per use case | 6–8 weeks *[verify]* |
| Source coverage | 6 source types (forum, bank, intermediary editorial, real-estate portal, official statistics, financial press) | 12+ source types per country | 6–8 weeks *[verify]* |
| Automation | 0% (fully manual extraction for v0.1) | ~60% automated + ~40% HITL *[verify]* | 8–12 weeks |
| Italian validation | Ad-hoc, single-validator | Systematic, multi-validator with inter-rater agreement | 4 weeks *[verify]* |
| Country coverage | Italy (mortgage v0.1) | Italy full + France / Germany stubs | Q1 deliverable |

**Owners.**

- **Adan** *[verify]* — engineering / ingestion infrastructure (connectors, paraphraser, source-tagger)
- **Maryam** — methodology / validation protocol / corpus theme taxonomy
- **Carlo** *[verify]* — archetype-layer integration (layer 4 → 5 handoff)
- **Federico** — commercial framing / scope decisions / client scoping

---

## §7 — Legal and GDPR posture

- **Public sources only, no authenticated scraping.** No login walls, no API endpoints requiring OAuth, no paywalled content. Each connector is reviewed against source TOS before going live.
- **All content paraphrased, never reproduced verbatim.** The paraphraser preserves semantic content while breaking exact string match. This is the corpus-side disclosure already in `files/01_signal_corpus.md` and the position we hold publicly.
- **No PII collected or stored.** Forum-level handles, where retained, are at the granularity already public on the source platform, and are not linked to identity. No emails, names, addresses, phone numbers, or fiscal codes are extracted or stored.
- **Production client deployments include DPIA setup.** Per the demo narrative (`files/07_demo_narrative.md`, Q&A on privacy), a Data Protection Impact Assessment is part of every client-facing production deployment.
- **TOS compliance per source.**
  - **Reddit API restrictions since 2023** *[verify]* make Reddit-based ingestion increasingly costly and bandwidth-capped. Not material for the Italian mortgage use case (Finanzaonline carries the equivalent corpus role), but relevant for any future non-IT use case.
  - **Facebook groups are closed unless joined manually** *[verify]* and are explicitly out of scope for automated ingestion.

---

## §8 — What this is NOT

- **NOT a substitute for live customer research with the bank's actual customers.** SASP simulates a synthetic audience grounded in public Italian signals. It complements — does not replace — direct customer interviews, branch-level qualitative work, or transactional cohort analysis that only the bank's own data can support.
- **NOT a global broad-and-shallow ingestion.** SASP is EU-native and country-deep by design. Buyers wanting a one-pipeline-30-countries platform should go elsewhere — that is a different product with different trade-offs, and we should not pretend to be it.
- **NOT a justification for compensating thin local data with cross-country volume.** Re-using French forum signals to fill gaps in Italian coverage breaks the country-layer logic the architecture exists to protect. Every country layer stands on its own corpus, validators, and distributional anchors — or it does not stand.

---

*kba / sasp · ingestion · 2026-05-11*
