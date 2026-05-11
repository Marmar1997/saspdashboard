# SASP Knowledge Object Library v0.1
## Use case: Mortgage for under-40 freelance professionals, Italy

**What this is.** Knowledge Objects (KOs) are the structured-epistemic unit between raw signals and audience generation. Each KO encodes a belief / fear / heuristic / objection that is *empirically observed in the corpus* (not invented), with relations to other KOs (supports / contradicts / co_occurs / triggers) and at least one source pointer.

**OIDA-style structure.** Each KO has: ID, label, content, evidence pointers, valence (resistance / openness / neutral), salience tier (1 = surface in nearly all simulations, 3 = surfaces only when triggered).

**This is what generic LLM personas don't have.** A GPT-prompted "Italian freelance mortgage applicant" produces stylistically convincing reasoning that is *not anchored in observed Italian language or heuristics*. KOs are the anchor.

---

## KO library (12 objects)

### KO-01 — "I'll be judged on my tax history more than my income"

**Type:** belief / fear
**Content:** Bank evaluation of partita IVA applicants centers on stability of declared income across consecutive years, not absolute income. The applicant rehearses their own CV imagining the bank's narrative review.
**Evidence:** Signal A1, A2, A4
**Valence:** resistance (raises perceived friction)
**Salience tier:** 1
**Relations:**
- supports → KO-02 (proof asymmetry)
- co_occurs → KO-09 (atipico identity)
- triggers → KO-10 (garante consideration)

---

### KO-02 — "The bar is higher for me than for a dipendente"

**Type:** belief / heuristic
**Content:** Asymmetric proof requirement is *the* defining frame of the partita IVA mortgage experience. Felt as structural unfairness even when respondent acknowledges the bank's risk logic.
**Evidence:** Signal A1, E2, E3
**Valence:** resistance
**Salience tier:** 1
**Relations:**
- supports → KO-09 (atipico identity)
- contradicts → KO-12 (Consap-as-equalizer)

---

### KO-03 — "Tasso fisso for long durations — at least you know"

**Type:** heuristic (durable)
**Content:** Default-recommend rule for long mutui. Risk-transfer framing dominates rational-optimization framing in non-expert conversation.
**Evidence:** Signal B1, B2
**Valence:** openness (toward fisso products)
**Salience tier:** 1 for ≥20y duration; tier 2 for shorter
**Relations:**
- contradicts → KO-04 (variabile-with-exit)
- co_occurs → KO-07 (rata sostenibile heuristic)

---

### KO-04 — "Variabile only if I can extinguish or surrogate"

**Type:** heuristic (rationalist subset)
**Content:** Variabile is rational only conditional on near-term ability to repay or refinance. Surrogate is understood as not free or guaranteed.
**Evidence:** Signal B2, B3
**Valence:** conditional openness
**Salience tier:** 2 (triggers when applicant has savings/inheritance buffer)
**Relations:**
- contradicts → KO-03
- triggers → KO-11 (rate-environment narrative)

---

### KO-05 — "The bank's preferred product is rarely my optimal product"

**Type:** distrust heuristic
**Content:** When the bank counter-proposes a product the applicant didn't ask for, the applicant should suspect the bank's incentive, not assume protective intent.
**Evidence:** Signal B4, D2
**Valence:** resistance (broad)
**Salience tier:** 1
**Relations:**
- supports → KO-06 (mandatory-vs-pushed insurance)
- supports → KO-08 (TAN/TAEG opacity)
- triggers (high salience) → KO-13 (bank-as-counterparty mental model)

---

### KO-06 — "Only incendio is mandatory; the rest is push"

**Type:** defensive heuristic
**Content:** Forum-durable rule: incendio e scoppio is the only legally required polizza on a mutuo; vita / impiego / multirischio products are facoltative regardless of how branch staff frame them.
**Evidence:** Signal D1, D2
**Valence:** resistance (toward bundled offers)
**Salience tier:** 1
**Relations:**
- supports → KO-05
- contradicts → bank-side framing of ProteggiMutuo as quasi-default

---

### KO-07 — "30–35% rata/reddito or I don't apply"

**Type:** self-filter heuristic
**Content:** Folk threshold widely cited and internalized. Applicants run the math themselves before approaching the bank, generating self-selection bias the bank doesn't directly observe.
**Evidence:** Signal F1, F2
**Valence:** filter (gatekeeping at the applicant side)
**Salience tier:** 1
**Relations:**
- co_occurs → KO-03
- triggers → latent demand invisibility (note for Federico's commercial framing)

---

### KO-08 — "Compare TAEG, not TAN"

**Type:** literacy heuristic
**Content:** A subset of the audience (more financially literate) explicitly knows the headline TAN is misleading and looks for TAEG/ISC. Distribution of this heuristic is uneven across the audience and a source of within-segment variance.
**Evidence:** Signal D3, D4
**Valence:** filter / resistance to headline-rate marketing
**Salience tier:** 2 (subgroup-dependent)
**Relations:**
- supports → KO-05
- distinguishes archetype A2 from A1 in §04

---

### KO-09 — "Atipico" identity tax

**Type:** identity / affective belief
**Content:** Banking sector's "lavoratori atipici" framing collapses meaningful within-group differences (forfettario vs ordinario, anzianità, settore) and the term itself is felt as demeaning. Increases emotional friction independently of objective product terms.
**Evidence:** Signal E1, E2, E3
**Valence:** resistance (affective)
**Salience tier:** 1
**Relations:**
- co_occurs → KO-01, KO-02
- amplifies any product-side friction

---

### KO-10 — Garante familiare: necessary safety net + shame trigger

**Type:** dual-valence belief
**Content:** Family co-signing is the standard partita IVA fallback AND a marker of dependence. Applicants who can avoid garante read avoidance as a milestone of adulthood. **Critical: a generic LLM persona will likely treat garante as transactional only — missing the shame layer is the differentiation moment.**
**Evidence:** Signal C1, F2
**Valence:** dual (practical openness + affective resistance)
**Salience tier:** 1
**Relations:**
- triggered by → KO-01, KO-07 (when ratio fails alone)
- contradicts (affectively) → bank framing of garante as "additional flexibility"

---

### KO-11 — "BCE is cutting; my fisso may have been a bad lock"

**Type:** rate-environment narrative (time-dependent, currently active)
**Content:** Italian financial press in 2025 framed the BCE cutting cycle as making variabile competitive again. Applicants who locked fisso at 2023–2024 peaks experience or anticipate regret; new applicants face fisso-vs-variabile decision under shifting expectations.
**Evidence:** Signal B3
**Valence:** confusion (time-sensitive, not stable)
**Salience tier:** 1 *as of demo date*; will need refresh
**Relations:**
- destabilizes → KO-03 in active-decision moments
- exposes any product page that doesn't address rate-environment context

---

### KO-12 — Consap as conditional equalizer

**Type:** belief about state-mediated access
**Content:** Fondo Garanzia Mutui Prima Casa is the central state lever for under-36 access. Audience belief is split: under-36s with ISEE ≤ 40k frame it positively as enabling; those above the cliff (rising fatturato, regime forfettario growth) frame it as a system that punishes earned progress.
**Evidence:** Signal C2, C3, C4
**Valence:** dual — openness for eligibles, resistance for cliff-adjacent
**Salience tier:** 1 for under-36; tier 3 otherwise
**Relations:**
- partially neutralizes → KO-02
- triggers cliff anxiety for forfettario applicants near €40k ISEE

---

### KO-13 — "I imagine the bank's narrative about me"

**Type:** meta-cognitive heuristic (rare in non-Italian-speaker corpora — likely under-represented in any LLM training mix)
**Content:** Applicants explicitly mentally simulate how the bank narrator will read their CV — the language switch from dipendente to partita IVA back to dipendente, the gaps, the trajectory. This *meta* layer is what shapes pre-application behavior.
**Evidence:** Signal A4
**Valence:** resistance (preemptive)
**Salience tier:** 2 (triggers for non-linear careers, common in this segment)
**Relations:**
- supports → KO-01
- generates → preemptive document gathering, garante consideration

---

## Relation graph (summary)

Resistance cluster (high salience, mutually reinforcing): **KO-01 → KO-02 → KO-09**
Heuristic cluster (decision rules): **KO-03 ↔ KO-04 ↔ KO-11** (rate environment), **KO-07** (rata threshold), **KO-08** (TAEG literacy)
Defensive cluster (vs bank): **KO-05 → KO-06, KO-08**
Affective cluster: **KO-09, KO-10, KO-13** — these are the high-differentiation KOs vs generic LLM personas

## Note for Federico (commercial framing)

The cluster that most distinguishes SASP output from a GPT-prompted persona is **KO-09 (atipico identity), KO-10 (garante shame layer), KO-13 (bank-narrative meta-cognition)**. These are observed in corpus, hard to recover from training-data priors, and produce demo moments where SASP surfaces objections a generic LLM persona doesn't. *That's the asset for Minelli.*

## Note for the methodological warning

KOs as structured here are interpretable, source-grounded, and Minelli can read each one. The density-matrix layer sits *behind* this representation in production (state vector over KO activation patterns; basis = KO set; observables = Trust/Confusion/Perceived Risk; measurement = simulation run). Per the design doc V2.1, the math stays internal in Sunday's external framing. If Federico wants to mention it, the line is: "structured audience state model with source-grounded epistemic objects" — not "density matrix."
