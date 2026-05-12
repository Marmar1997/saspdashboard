# SASP Product Under Test v0.1
## Intesa Sanpaolo Mutuo Giovani — under-36 prima casa offering

**Why this product.** Real, current, marketed by Italy's largest bank, available through their Mutuo Domus Giovani / Offerta Giovani / XME Mutuo Offerta Giovani product family. Marketing positions it as inclusive of "lavoratori atipici e a tutele crescenti" — placing partita IVA applicants squarely in the audience. *And* the product page contains observable tensions that a synthetic audience grounded in the corpus will surface and a generic LLM persona will likely miss.

**Why this product is the right demo target.**
1. It has a real, dated, public marketing surface
2. It contains at least three measurable tensions with audience belief
3. The bank is sophisticated — surfaced objections cannot be dismissed as "obvious bank failure"
4. The under-40 freelance demo audience is exactly the targeted demographic
5. Minelli will recognize the bank instantly and the demo gains immediate credibility

---

## Product features (extracted from product pages, current)

| Feature | Value | Source |
|---|---|---|
| Eligibility age | 18–36 (not yet 36 at signing) | Intesa Sanpaolo product page |
| Loan-to-Value max | up to 100% (with Consap) | Same |
| Duration | up to 40 years | Same |
| Preammortamento | up to 10 years interest-only option | Same |
| Tasso fisso, LTV ≤80%, 30y | ~3.44% | Same |
| Tasso fisso, LTV 80.01–100%, 30y | ~3.38% (with Consap fund) | Same |
| Sospensione rate | up to 6 consecutive payments, 3 times during loan life | Same |
| Polizza incendio | mandatory | Same |
| Polizza ProteggiMutuo (life/job) | offered, framed prominently | Same |
| Importo finanziabile cap (lavoratori atipici) | €300,000 | Intesa Sanpaolo trasparenza, mutui.it |
| Importo finanziabile cap (Consap-eligible) | €250,000 | Intesa Sanpaolo |
| Spese istruttoria (under-36) | azzerate | Same |
| Recipient definition (legal) | "Consumatori (persone fisiche che agiscono per scopi estranei all'attività professionale imprenditoriale eventualmente svolta)" | Intesa Sanpaolo product trasparenza |
| ISEE cap for high LTV (>80%) Consap access | €40,000 | Same |

---

## Marketing claims (extracted, paraphrased)

**MC1.** "Pensato per gli under 36 alle prese con l'acquisto della loro prima casa" — positioned as the targeted product for this life stage.

**MC2.** "Anche per lavoratori con contratti atipici e a tutele crescenti" — explicit inclusivity gesture toward partita IVA, co.co.co., contratti a termine.

**MC3.** "Rate leggere di soli interessi per i primi anni" — preammortamento marketed as flexibility / reduced early burden.

**MC4.** "Possibilità di sospendere i pagamenti fino a 6 mesi consecutivi in caso di necessità" — sospensione rate framed as borrower flexibility.

**MC5.** "Tassi promozionali" + "azzeramento spese istruttoria" — marketed as cost-friendly to young applicants.

**MC6.** "Soluzione semplice, completa e conveniente, modificabile a seconda delle esigenze" — positioning as personalized.

---

## Tensions (where audience belief meets product surface)

**T1 — The "consumatore" definitional ambiguity.** The product's legal definition of recipient explicitly excludes "scopi attinenti all'attività professionale imprenditoriale", while the marketing says "anche atipici". A partita IVA applicant reading both lines simultaneously cannot reliably tell whether they are inside or outside the product. **Activates KO-09 (atipico identity), KO-13 (bank-narrative meta-cognition).** Differentiation moment: this is testable, observable, and synthetic-LLM-personas don't usually read trasparenza copy.

**T2 — Preammortamento marketed as benefit, audience reads as bank-side risk shifting.** The product page frames "rate leggere di soli interessi per i primi anni" as flexibility. A forum-trained applicant (KO-05) reads interest-only periods as the bank loading interest into the early period when they would otherwise pay capital faster — extending total cost of credit. **Activates KO-05 (bank's preferred ≠ mine), KO-08 (TAEG vs TAN literacy).** Marketing claim 3 is a high-friction surface for archetypes A1 and A2.

**T3 — Polizze framing asymmetry.** Product page presents incendio (mandatory) and ProteggiMutuo (facoltativa, life/job) without consistent "facoltativa" framing on the consumer-facing surface. Forum-trained applicants (KO-06) treat anything beyond incendio as push. Reading the product page front-to-back, an unsophisticated applicant could plausibly believe both polizze are required. **Activates KO-05, KO-06.**

**T4 — €300k atipici cap vs €250k Consap cap vs no-cap consumatore offer.** The same product family offers different finanziabile maxima by applicant type, buried in trasparenza documents. Marketing surface presents "soluzione completa per under 36" without surfacing the cap stratification. A partita IVA applicant looking at €380k properties in Milano discovers post-application that the cap excludes them. **Activates KO-02 (asymmetric bar), KO-09, KO-13.** Latent friction → surfaceable in simulation.

**T5 — ISEE €40k cliff invisible on marketing surface.** The under-36 boost (Consap 80% guarantee) is contingent on ISEE ≤ €40k, but the marketing surface foregrounds inclusivity. A successful forfettario near the cap (archetype A2) reads the marketing as targeting them, then discovers the cliff. **Activates KO-12 (Consap conditional), high salience for A2 specifically.**

**T6 — Rate environment context absent.** The product page doesn't address the BCE cutting cycle or the fisso/variabile spread inversion of 2025. An applicant deciding now (archetype A2 specifically) faces a live decision the page doesn't help with. **Activates KO-11 (BCE cutting), KO-08 (TAEG).** Confusion-generating for the literate subgroup.

---

## Tension severity matrix (for §06 simulation)

| Tension | A1 | A2 | A3 | A4 | Population-weighted |
|---|---|---|---|---|---|
| T1 (consumatore ambiguity) | high | medium | low | medium | medium-high |
| T2 (preammortamento) | medium | high | low | medium | medium |
| T3 (polizze framing) | high | medium | low | medium | medium-high |
| T4 (importo cap) | medium | high | low | low | medium |
| T5 (ISEE cliff) | low | very high | high (via grievance) | medium | medium-high |
| T6 (rate context) | low | high | medium | medium | medium |

---

## What this gives the simulation

For each archetype, the simulator pairs activated KOs against tensions to generate:
- **Trust score** = inverse-weighted sum of triggered resistance KOs vs product
- **Confusion score** = sum of confusion-valenced KO activations + tension severities
- **Perceived Risk score** = weighted sum of resistance + ambiguity + life-stage anxiety KOs
- **Top 3 surfaced objections per archetype**, each with KO traceback + source citation

The Sunday demo screen is exactly this: archetype name → T/C/PR scores → top 3 objections each with a corpus source citation. Generic LLM persona benchmarks (run separately) produce stylistically similar objections without source grounding — that's the comparison Minelli sees.
