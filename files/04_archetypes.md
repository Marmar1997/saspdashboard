# SASP Synthetic Audience v0.1 — 4 Archetypes
## Use case: Mortgage for under-40 freelance professionals, Italy

**What this is.** Four archetypes covering the under-40 freelance mortgage segment, distributionally weighted (§03), with each archetype defined by a *KO activation pattern* rather than a fixed persona description. This is the methodological line vs. generic personas: each archetype is a distribution over KO salience, not a fictional individual.

**Naming convention.** Archetype IDs are letter+number; KO activations are listed by ID with weight in [0,1].

**Important framing for Federico/Minelli.** A persona — "Marco, 32, web designer da Milano, ama la pizza" — is just a stylistic costume. Two LLM personas with identical surface descriptors can produce wildly different reasoning. An *archetype* in SASP is the *belief activation pattern*: which KOs fire, with what salience, in what relations. The pattern is what's reproducible, comparable across runs, and benchmarkable against generic LLM personas in §06.

---

## Archetype A1 — "Solo forfettario, Nord, low cushion"

**Population weight:** 35%

**Demographic anchor (for narrative only — not the model):**
- Age 28–35
- Partita IVA forfettario, 3–5 years anzianità
- Net income €18–25k/year, growing slowly
- Lives in northern metro (MI, BO, TO, PD, BS area), high property prices
- Single or partnered with another freelancer / part-timer
- Limited family financial backing (vs A4)
- ISEE plausibly under €40k → Consap-eligible

**KO activation pattern:**

| KO | Salience | Notes |
|---|---|---|
| KO-01 (judged on tax history) | 0.95 | Core fear |
| KO-02 (higher bar than dipendente) | 0.95 | Identifies strongly with this |
| KO-03 (fisso for long durations) | 0.85 | Default heuristic |
| KO-07 (rata 30–35%) | 0.95 | Active self-filter — borderline applicant |
| KO-09 (atipico identity) | 0.90 | Affective resistance |
| KO-10 (garante shame) | 0.85 | Avoiding garante = milestone |
| KO-12 (Consap conditional) | 0.80 | Eligible, frames positively |
| KO-13 (bank's narrative of me) | 0.75 | Active meta-cognition |
| KO-04, 06, 08 | 0.30–0.50 | Lower literacy on these |

**Source anchor in corpus:** Signal F2 (FinanzaOnLine 30y forfettario, €1,800/mo, asks for parere senza garante). This is the *defining real-world signal* for A1.

**Anticipated Trust / Confusion / Perceived Risk on a generic under-36 mortgage:**
- Trust: medium-low (defensive, expects friction)
- Confusion: medium-high (atipico vs consumatore ambiguity highly active)
- Perceived Risk: high (rata sostenibility on borderline income)

---

## Archetype A2 — "Forfettario in crescita, financially literate"

**Population weight:** 20%

**Demographic anchor:**
- Age 30–38
- Partita IVA forfettario, 5–8 years anzianità, fatturato approaching €60–85k cap
- Net income €30–45k/year
- Northern or central Italy
- Familiar with TAEG/ISC, follows BCE moves, reads forums actively
- ISEE may approach €40k cliff → Consap eligibility uncertain

**KO activation pattern:**

| KO | Salience | Notes |
|---|---|---|
| KO-01, 02, 09 | 0.70 | Present but tempered by literacy |
| KO-04 (variabile-with-exit) | 0.75 | Active — has savings buffer |
| KO-05 (bank's preferred ≠ mine) | 0.90 | Strong distrust default |
| KO-06 (only incendio mandatory) | 0.85 | Forum-trained heuristic |
| KO-08 (compare TAEG) | 0.95 | Defining literacy marker |
| KO-11 (BCE cutting) | 0.85 | Following rate environment |
| KO-12 (Consap cliff) | 0.95 | High activation — at the cliff |
| KO-13 (narrative meta) | 0.85 | Sophisticated self-presentation |

**Source anchor:** Signals A3, B2, B3, B4, C4, D1, D4. Multiple FinanzaOnLine threads showing this exact reasoning style.

**Anticipated T/C/PR:**
- Trust: medium (skeptical but informed)
- Confusion: medium (clear on most things, *but* high confusion on Consap cliff dynamics specifically)
- Perceived Risk: medium (financial but not affective)

---

## Archetype A3 — "Ordinario professionista regolato"

**Population weight:** 25%

**Demographic anchor:**
- Age 32–40
- Partita IVA ordinario, iscritto ad albo (avvocato, architetto, ingegnere, commercialista, medico)
- Net income €40–80k/year
- Anzianità 5–12 years
- Lower platform-bias representation (less active on FinanzaOnLine; more likely on professional forums or Linkedin)
- ISEE typically over €40k → *not* Consap-eligible
- Cassa professionale contributions visible in tax history

**KO activation pattern:**

| KO | Salience | Notes |
|---|---|---|
| KO-01 (tax history) | 0.80 | Accustomed to documenting income |
| KO-02 (higher bar) | 0.60 | Less acute — albo and reddito profile help |
| KO-03 (fisso default) | 0.80 | Conservative profile |
| KO-09 (atipico identity) | 0.40 | Identifies as "professionista", not "atipico" |
| KO-10 (garante) | 0.30 | Often doesn't need it |
| KO-12 (Consap) | 0.20 (negative valence) | Excluded by ISEE → resentful |
| KO-13 (narrative meta) | 0.55 | Less needed — track record is clean |
| Others | 0.40–0.60 | Mixed |

**Source anchor:** Implicit across albo references in intermediary articles + the forfettario/ordinario distinction in MEF data. Less visible in forums precisely because this group has fewer pain points to discuss publicly.

**Anticipated T/C/PR on the Intesa Sanpaolo Mutuo Giovani product:**
- Trust: medium-high *for the bank generally*, but the under-36 product specifically generates resentment (excluded by ISEE)
- Confusion: low on product mechanics, high on "why am I excluded from a state benefit while earning what I earn"
- Perceived Risk: low

**This archetype is a key edge case** — the Intesa Sanpaolo Mutuo Giovani is *positioned* as inclusive of "lavoratori atipici" but the Consap-related under-36 boost is gated by ISEE €40k. A successful A3 freelancer reads this as "the system penalizes my success." Latent grievance signal that bank communications rarely address.

---

## Archetype A4 — "Cointestazione mista (P.IVA + dipendente)"

**Population weight:** 20%

**Demographic anchor:**
- Couple, both under 40, one partita IVA (any regime), one tempo indeterminato
- Combined household income €45–70k/year
- The dipendente partner typically anchors the application; the partita IVA partner is a *risk amplifier* in bank's eyes despite being a *capacity adder* in household reality
- Common at Consap (mixed-income households are a recognized category)

**KO activation pattern:**

| KO | Salience | Notes |
|---|---|---|
| KO-01, 02 | 0.85 (P.IVA partner) / 0.30 (dipendente) | Asymmetric |
| KO-09 (atipico) | 0.70 (P.IVA partner specifically) | Internalized |
| KO-10 (garante) | 0.40 | Less needed — they ARE each other's garante |
| KO-12 (Consap) | 0.85 | Active beneficiary likely |
| KO-13 (narrative meta) | 0.75 | "How will the bank read US together" |

**Source anchor:** Implicit in idealista, MutuiOnline editorial framing of "giovani coppie" as a Consap priority category. Less first-person forum content because households apply differently from solos.

**Anticipated T/C/PR:**
- Trust: medium-high (the dipendente anchor calms the relationship with the bank)
- Confusion: medium (cointestazione mechanics, ISEE-as-couple, garante dynamics)
- Perceived Risk: medium

---

## Archetype distribution summary

| Archetype | Weight | Defining KOs | Predicted T/C/PR signature |
|---|---|---|---|
| A1 — Solo forfettario, low cushion | 35% | 01, 02, 07, 09, 10 | T-low / C-high / PR-high |
| A2 — Forfettario in crescita, literate | 20% | 04, 05, 08, 11, 12 | T-medium / C-medium / PR-medium |
| A3 — Ordinario professionista | 25% | 01, 03 + Consap exclusion | T-medium / C-low (mech.) / PR-low |
| A4 — Cointestazione mista | 20% | mixed across partners | T-med-hi / C-medium / PR-medium |

Weights sum: 35+20+25+20 = 100%. ✓

---

## What the simulation does with this

For each archetype, the simulator (§06):
1. Loads the KO activation vector
2. Reads the product (§05) as a series of marketing claims and product features
3. For each claim/feature, scores how it interacts with the activated KOs (supports, contradicts, triggers fear, generates confusion)
4. Aggregates per-archetype to T/C/PR scores + top objections (with KO traceback + source traceback)
5. Aggregates across archetypes (weighted by population) for a portfolio-level read

**The differentiation moment:** the top objection per archetype, traced back to specific KOs and specific source signals. *That's* what a generic LLM persona cannot do — its objections are stylistically convincing but not source-grounded and not reproducibly traceable.

---

## Honest scope flag

This is 4 archetypes. The V2.1 design doc calls for 20 Italian mortgage archetypes at MVP. **For Sunday's demo to Minelli, 4 is right** — beyond that and the demo loses focus. The roadmap slide should mention the path from 4 → 20 explicitly so Minelli has the answer for "is this all?" already loaded.
