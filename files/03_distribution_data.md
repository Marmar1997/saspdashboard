# SASP Distribution Layer v0.1
## Use case: Mortgage for under-40 freelance professionals, Italy

**Purpose.** Distribution shape for the synthetic audience comes from official and aggregator sources, not from forum scraping. This is the methodological line we hold: forums = language and belief input; ISTAT/MEF/Banca d'Italia = distribution shape. Synthetic audience generation in §04 weights archetypes against these numbers.

**All figures dated and source-tagged. Numbers below verified from search results — minor rounding noted where I round for archetype calibration.**

---

## D1 — Population: lavoratori autonomi in Italia

| Metric | Value | Source / date |
|---|---|---|
| Total lavoratori autonomi | ~5.23M | ISTAT, October 2025 |
| YoY change | +123k (+2.4%) | ISTAT |
| Persone fisiche titolari di partita IVA (most recent published) | ~3.7M | MEF/Agenzia Entrate, 2020 stats released 2022 |
| Of which: regime forfettario / vantaggio | ~47.2% (~1.74M) | MEF |
| Average reddito imponibile, regime forfettario | ~€12,961/year | MEF (2020 stats) |
| Avg imposta sostitutiva paid (forfettario) | ~€1,556/year | MEF |
| Share of new partita IVA aperture by women (2024) | 39.6% | Sole 24 Ore reading MEF data |
| Share born outside EU (2024) | 17.5% | Sole 24 Ore reading MEF data |
| Share of new partita IVA from age 18–34 | ~50% (historically; declining with demographics) | Sole 24 Ore |

**Calibration note for §04 archetypes:** The MEF €12,961 mean masks high variance — it includes very small/seasonal partita IVA. For the under-40 freelance mortgage segment, realistic *applicants* sit higher (typically €18–35k/year net for forfettario, more for ordinario). Forum thread F2 confirms €1,800–1,900 net/month (≈€21–23k net/year) as an active applicant data point. **For archetype distributions I use a reweighted income profile that reflects mortgage-applicant selection, not the full forfettario distribution. Flagging because conflating the two is a common error.**

---

## D2 — Mortgage market context (Q1 2025, Banca d'Italia / MutuiSupermarket / Agenzia Entrate observatorio)

| Metric | Value | Source |
|---|---|---|
| Total mutui erogati Q1 2025 | €13.03B | Banca d'Italia via MutuiSupermarket |
| YoY change | +52.6% | Same |
| Of which: mutui acquisto YoY | +47.2% | Same |
| Of which: surroghe YoY | +100.8% | Same |
| Avg tasso prima rata Q1 2025 | 3.22% | Same |
| YoY change in avg rate | −76 bps | Same |
| Compravendite immobiliari YoY (Q1 2025) | +11.2% | Agenzia Entrate observatorio |
| % compravendite with prima casa benefit | 72.5% (vs 69.6% YoY) | Same |
| Mortgage incidence in compravendite | 45.8% (vs 38.6% YoY) | Same |

**Implication for demo narrative:** the market is *expanding*, rates are dropping, surroghe are doubling. This is *exactly* the context in which a stress-test platform earns budget — banks are launching/repricing products fast and need pre-launch diagnostic. Useful framing for Minelli.

---

## D3 — Under-36 segment specifics (relevant because our mortgage product is the Intesa Sanpaolo Mutuo Giovani)

| Metric | Value | Source |
|---|---|---|
| Share of mortgage requests from under-36 (MutuiOnline platform) | 42% | MutuiSupermarket Osservatorio, 2025 |
| Of which: requests with LTV > 80% | 54% | Same |
| Share of Consap fund applications from under-35 | 39.1% (Q1 2025) | MutuiOnline citing Consap |
| Consap fund: total cumulative requests since 2014 | >600k | MutuiOnline |
| Consap fund: total erogazioni since 2014 | >480k | MutuiOnline |
| Consap fund renewal | extended through 31 Dec 2027 | Legge di Bilancio 2025 |
| Consap fund refinancing | €670M (3-year window); +€130M (2025), +€270M/yr (2026, 2027) | Same |
| ISEE cap for 80% guarantee | €40,000 | Decreto Sostegni-bis, conf. 2025 |
| Mortgage amount cap | €250,000 | Same |
| Tax exemptions (registro/ipotecaria/catastale) | NOT renewed in 2024+; expired 31 Dec 2023 | Agenzia Entrate, Money.it |

**Critical timing note for Sunday.** Tax exemptions on the act ended; only the Fondo Consap guarantee remains for 2025–2027. Any synthetic audience reasoning must reflect this — applicants in 2025–2026 face a *narrower* under-36 incentive than the 2021–2023 cohort experienced. The "i giovani vanno aiutati" public narrative has not fully caught up with the policy shrinkage. **Latent confusion source — testable as KO-12 cliff dynamics.**

---

## D4 — Tasso environment (KO-11 anchor)

| Metric | Value | Source |
|---|---|---|
| BCE policy stance, mid-2025 | cutting cycle (cuts in early/mid 2025) | FinanzaOnLine editorial, May 2025 |
| Avg fisso 30y (Q2 2025) | ~3.4–3.6% (varies by LTV) | Intesa Sanpaolo trasparenza, Mutuionline product sheets |
| Avg fisso 20y (Q2 2025) | ~2.7% IRS reference | FinanzaOnLine editorial |
| Mutui at variabile gaining share | yes (per intermediaries' framing) | MutuiOnline |
| Headline TAN vs TAEG gap | typically 30–60 bps for under-36 products | Intesa Sanpaolo product sheets |

**Implication:** an applicant deciding now faces the highest live confusion in years between fisso and variabile. This is what gives KO-11 high salience in this demo run — and is part of why the Intesa Sanpaolo Mutuo Giovani product page (which doesn't address rate environment) generates testable confusion.

---

## D5 — Geographic / settorial distribution (rough, for archetype variation)

ISTAT regional breakdown of partita IVA distribution is uneven. For the demo, I use three stylized geographies (Nord industriale, Roma/centro servizi, Sud/isole) with weighting roughly proportional to ISTAT regional employment data — *but I flag this as a stub*. Production version pulls full ISTAT regional breakdown by ATECO code. For Sunday this is enough; archetypes in §04 use a Nord-weighted distribution because that's where most mortgage demand for this segment lives.

| Region cluster | Share of partita IVA (rough) | Mortgage demand intensity |
|---|---|---|
| Nord (Lombardia, Veneto, Emilia-R., Piemonte) | ~50% | High |
| Centro (Lazio, Toscana, Marche) | ~22% | Medium-high |
| Sud + Isole | ~28% | Lower (income + price gap) |

---

## Distribution shape used for synthetic audience generation (§04)

Given §04 produces 4 archetypes (not 20 — that's MVP scope, not demo scope per the plan), distributional weighting is applied at archetype level:

| Archetype | Population weight | Anchored to |
|---|---|---|
| A1 — Solo forfettario, Nord, low cushion | 35% | F2 forum signal + ISTAT Nord weighting + €18–25k income band |
| A2 — Forfettario growing, financially literate | 20% | TAEG-aware subgroup; rising-fatturato Consap cliff |
| A3 — Ordinario professionista regolato (avvocato/architetto/medico) | 25% | Albo-iscritti subgroup; older anzianità P.IVA |
| A4 — Cointestazione con dipendente, partita IVA del compagno/a | 20% | Mixed-income household; common pattern at Consap |

**Total weights = 100%.** Math double-checked: 35 + 20 + 25 + 20 = 100. ✓

**Caveat held openly:** these weights are a defensible first-pass distribution, not a measured one. A production run would weight these archetypes against actual Consap applicant data + Banca d'Italia mutuatario microdata (we'd need to acquire access). For Sunday's demo this is *good enough to demonstrate the methodology*, and labeling it transparently as "v0.1 distributional weighting from open public data" protects credibility better than overselling it.
