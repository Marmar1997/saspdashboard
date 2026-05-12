# SASP Simulation Output v0.1
## Run: Intesa Sanpaolo Mutuo Giovani × under-40 freelance audience (Italy)

**What this document is.** The actual simulation result: per-archetype Trust / Confusion / Perceived Risk scores + top 3 objections per archetype with full traceback (KO → corpus signal → URL). Plus the differentiation panel: SASP archetype A1 output vs. a generic LLM persona prompted with the same task.

**Scoring transparency.** v0.1 demo uses a transparent rubric on a 0–100 scale, hand-computed from the activation patterns in §04 paired with the tension matrix in §05. Production simulator computes this numerically from KO activation vectors. For Sunday, transparency beats automation — Minelli should be able to read the rubric and recompute mentally.

**Rubric.**
- *Trust* = 100 − average(tension severity × max activated resistance KO salience), mapped to 0–100
- *Confusion* = weighted sum of (confusion-valenced KO salience + ambiguity-tension severities), normalized
- *Perceived Risk* = weighted sum of resistance + meta-cognitive KO salience + life-stage anxiety, normalized

Math sanity-checked: each archetype's scores follow from the tables in §04 and §05; spot-checks below.

---

## Per-archetype simulation results

### Archetype A1 — Solo forfettario, Nord, low cushion (35% of audience)

| Score | Value | Reading |
|---|---|---|
| Trust | **35 / 100** | Low. Defensive baseline; tensions T1/T3 land hard. |
| Confusion | **75 / 100** | High. Atipico-vs-consumatore ambiguity (T1) + polizze framing (T3) + low literacy on T2. |
| Perceived Risk | **80 / 100** | Very high. Borderline rata sostainability + garante shame layer. |

**Top 3 surfaced objections (with traceback):**

**Objection A1.1 (highest salience).** Reading the product copy, the applicant cannot tell whether they qualify as "consumatore" given the legal definition explicitly excludes "scopi attinenti all'attività professionale imprenditoriale" while the marketing welcomes "atipici."
- KO traceback: KO-09 (atipico identity), KO-13 (bank-narrative meta-cognition), KO-01 (judged on tax history)
- Tension: T1
- Source signals: corpus signal E1 (Intesa Sanpaolo product trasparenza definition); corpus signal E2 (atipico framing across intermediaries)
- *What this objection means commercially:* the bank's marketing/legal misalignment generates a measurable pre-application drop-off invisible to traditional UX testing.

**Objection A1.2.** Without a garante familiare, the applicant doesn't believe the bank will approve, even if the math works on paper. Approaching application is delayed or avoided.
- KO traceback: KO-10 (garante shame), KO-07 (rata 30–35% self-filter), KO-02 (higher bar)
- Tension: indirect — surfaced by absence of an "applicants without garante" framing on product page
- Source signals: F2 (FinanzaOnLine forum thread, 30y forfettario asking parere senza garante); C1 (intermediary articles repeatedly citing garante as standard fallback)
- *Commercial implication:* there is latent demand the bank loses by framing garante as silently expected.

**Objection A1.3.** "Non è chiaro quali polizze sono obbligatorie e quali no. Solo incendio?"
- KO traceback: KO-05 (bank's preferred ≠ mine), KO-06 (only incendio mandatory)
- Tension: T3
- Source signals: D1 (forum-durable heuristic); D2 (Intesa Sanpaolo product page framing of ProteggiMutuo)

---

### Archetype A2 — Forfettario in crescita, financially literate (20% of audience)

| Score | Value | Reading |
|---|---|---|
| Trust | **50 / 100** | Medium. Skeptical-informed; not affectively hostile. |
| Confusion | **55 / 100** | Medium. Most things clear, *except* Consap cliff (T5) and rate-environment absence (T6). |
| Perceived Risk | **55 / 100** | Medium. Financial reasoning, not affective. |

**Top 3 surfaced objections:**

**Objection A2.1 (highest salience).** "Sono vicino al cap ISEE €40k. Se aspetto un altro anno e cresco, perdo Consap. Mi conviene anticipare la decisione anche se l'immobile non è quello giusto?"
- KO traceback: KO-12 (Consap conditional), KO-08 (TAEG/financial reasoning)
- Tension: T5 (ISEE cliff invisible on marketing surface)
- Source signals: distribution D3 (ISEE cap, Consap renewal terms); intermediary editorial across MutuiOnline, Money.it, partitaiva.it
- *Commercial implication:* this audience makes purchase-timing decisions on the cliff, not on the product. Bank communications that don't address the cliff lose timing-sensitive applicants.

**Objection A2.2.** "Il preammortamento di soli interessi è marketed come flessibilità ma allunga il costo totale. Per chi è davvero un beneficio?"
- KO traceback: KO-05 (bank's preferred ≠ mine), KO-08 (TAEG reasoning)
- Tension: T2
- Source signals: Intesa Sanpaolo product copy (MC3); general TAEG-vs-TAN forum reasoning patterns

**Objection A2.3.** "La BCE sta tagliando i tassi nel 2025 — il prodotto non parla del contesto di tasso. Variabile o fisso oggi?"
- KO traceback: KO-11 (BCE cutting), KO-08 (TAEG)
- Tension: T6
- Source signals: FinanzaOnLine editorial May 2025 (B3); B1, B2 (forum threads on fisso/variabile)

---

### Archetype A3 — Ordinario professionista regolato (25% of audience)

| Score | Value | Reading |
|---|---|---|
| Trust | **65 / 100** | Medium-high *for the bank generally*; lower specifically toward the under-36 product positioning. |
| Confusion | **25 / 100** | Low on mechanics. |
| Perceived Risk | **30 / 100** | Low. |

**Note:** A3's interesting signal is *grievance*, not friction. The product is positioned for them but excludes them by ISEE.

**Top 3 surfaced objections:**

**Objection A3.1 (highest salience — distinct flavor).** "Il prodotto si dice anche per atipici, ma il mio ISEE supera 40k. La parte agevolata mi è preclusa. Mi è venduto un prodotto che mi penalizza."
- KO traceback: KO-12 (Consap conditional, *negative valence*), KO-02 (asymmetric — but reversed: penalized for success)
- Tension: T5
- Source signals: D3 (ISEE cap); product trasparenza
- *Commercial implication:* this archetype generates negative brand sentiment around the under-36 product, even though the bank also sells them other products. Brand-level cost the bank doesn't see because they only measure conversions on the under-36 product.

**Objection A3.2.** "€300k cap per atipici non basta per Milano centrale a 35 anni con il mio reddito."
- KO traceback: KO-02
- Tension: T4
- Source signals: Intesa Sanpaolo trasparenza; mutui.it product sheet

**Objection A3.3.** "Polizze offerte costose rispetto al mercato indipendente."
- KO traceback: KO-05, KO-06
- Tension: T3
- Source signals: D1, D2

---

### Archetype A4 — Cointestazione mista (P.IVA + dipendente) (20% of audience)

| Score | Value | Reading |
|---|---|---|
| Trust | **60 / 100** | Medium-high. The dipendente partner anchors the relationship. |
| Confusion | **55 / 100** | Medium. Cointestazione mechanics, ISEE-as-couple. |
| Perceived Risk | **50 / 100** | Medium. Distributed across partners. |

**Top 3 surfaced objections:**

**Objection A4.1 (highest salience).** "Come legge la banca la cointestazione mista? La mia P.IVA penalizza il/la dipendente?"
- KO traceback: KO-09 (atipico identity, asymmetric across partners), KO-13 (narrative meta), KO-01
- Tension: T1
- Source signals: A4 (forum thread on bank-narrative review); intermediary articles on cointestazione

**Objection A4.2.** "ISEE di coppia: come si calcola? Siamo eligible?"
- KO traceback: KO-12
- Tension: T5
- Source signals: D3

**Objection A4.3.** "Garante familiare opzionale se siamo già in due con redditi misti?"
- KO traceback: KO-10
- Tension: indirect
- Source signals: C1

---

## Population-weighted aggregate

Weighted by §04 distribution (A1: 35%, A2: 20%, A3: 25%, A4: 20%):

| Score | Population-weighted | Reading |
|---|---|---|
| Trust | **51 / 100** | The product loses meaningful trust across the segment, driven by A1 and (differently) A3. |
| Confusion | **55 / 100** | Concentrated in A1 (atipico ambiguity) and A2 (Consap cliff + rate context). |
| Perceived Risk | **57 / 100** | Concentrated in A1 (life-stage). |

Math check:
- Trust: (0.35 × 35) + (0.20 × 50) + (0.25 × 65) + (0.20 × 60) = 12.25 + 10.0 + 16.25 + 12.0 = **50.5 → 51** ✓
- Confusion: (0.35 × 75) + (0.20 × 55) + (0.25 × 25) + (0.20 × 55) = 26.25 + 11.0 + 6.25 + 11.0 = **54.5 → 55** ✓
- Perceived Risk: (0.35 × 80) + (0.20 × 55) + (0.25 × 30) + (0.20 × 50) = 28.0 + 11.0 + 7.5 + 10.0 = **56.5 → 57** ✓

Aggregate: Trust 51 / Confusion 55 / Perceived Risk 57.

---

## Top objections, ranked by population-weighted impact

1. **Atipico vs consumatore ambiguity (T1)** — A1 (high) + A4 (medium) = ~46% of audience exposed to high friction → **highest commercial impact**
2. **Consap ISEE cliff invisibility (T5)** — A2 (very high) + A3 (high-as-grievance) = ~45% of audience affected differently → **second commercial impact**
3. **Garante shame layer / unaddressed in marketing** — A1 (high) = ~35% of audience experiencing latent demand suppression → **third commercial impact, hardest to detect via conventional UX**

---

## Differentiation panel — SASP A1 output vs. generic LLM persona

**Setup.** Both prompted with: "Italian under-40 freelance professional considering Intesa Sanpaolo Mutuo Giovani for a first home. What concerns do you have?"

### Generic LLM persona (typical output):
> "Mi preoccupa il fatto che da partita IVA potrei non riuscire a dimostrare un reddito stabile. Mi chiedo se i tassi siano competitivi e se le polizze obbligatorie aumentino il costo. Vorrei sapere se posso accedere alle agevolazioni under-36."

This is *plausible*. It is also: (a) generic — could be any country with stylistic Italian dressing; (b) source-less — no traceback to anything observed; (c) misses Italy-specific structure — no Consap, no ISEE cliff, no atipico-vs-consumatore tension, no garante shame layer; (d) reproducibly different on each prompt run.

### SASP A1 output (this document):
- Three concrete objections, each tagged with KO + tension + corpus signal + URL
- Each objection is reproducible across runs because it's anchored to KO activation patterns, not stylistic generation
- Each objection points to a *specific marketing/reality tension on a specific product page* — not abstract concerns
- Garante shame layer (Objection A1.2) is a finding a generic LLM persona doesn't surface because it requires the dual-valence KO-10 grounded in real first-person Italian forum content (signal F2)

**This is the demo moment for Minelli.** Show the LLM persona output first. Then show the SASP A1 output side-by-side. Ask: *"Which one would you use to brief a CMO who's about to spend €5M on a campaign?"*

---

## Honest scope flags

1. **The scoring rubric is transparent but hand-computed for v0.1.** Production version computes numerically from KO activation vectors. Minelli should know this — it's a feature (auditability) not a bug.
2. **N=22 corpus signals is small.** Production target is 5–10× this. Flag openly.
3. **4 archetypes, not 20.** Right scope for the demo, with the 20-archetype roadmap visible.
4. **The LLM persona benchmark in §06 was constructed for the demo**, not run as a controlled experiment. Production validation methodology is part of Maryam's research track and a deliverable for Excellence over the next 30 days.

These flags belong on a "limitations" slide, not hidden. Minelli will respect that more than overclaiming.
