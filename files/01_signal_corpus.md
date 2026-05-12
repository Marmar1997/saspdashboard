# SASP Signal Corpus v0.1
## Use case: Mortgage for under-40 freelance professionals, Italy

**Method.** Curated extraction from publicly accessible Italian sources. All items paraphrased, source-tagged, dated. No verbatim reproduction (copyright + GDPR posture). For the demo this is a **bench corpus**, not a production ingestion run — production target is N ≥ 500 across forums, comments, reviews, with native-Italian human-in-the-loop validation. **Disclosure to Minelli on Sunday: this is a curated demo corpus, not a live pipeline output.**

**Source mix in this v0.1 corpus.**
- Forum di FinanzaOnLine (mutui sub-forum) — first-person threads, 2018–2026
- Italian aggregator/comparator editorial (MutuiOnline, idealista, immobiliare.it) — captures *positioning language* used by intermediaries to talk to this audience
- Bank product pages (Intesa Sanpaolo) — captures *marketing framing*
- Industry/government sources (ISTAT, MEF) — distribution context, used in §03

**Important caveat.** Forum threads on Finanzaonline skew toward more financially literate, urban, often male users. This is the platform-bias problem flagged in our methodology — the corpus is good for extracting *language, fears, and reasoning patterns*, not for inferring distribution shape. Distribution comes from §03 (ISTAT/MEF).

---

## Theme A — Income volatility & "the bank doesn't trust me" anxiety

**Signal A1.** Recurring framing: a freelance applicant must *prove* that what looks like irregular income is actually stable. The burden of proof is felt as asymmetric vs. dipendente a tempo indeterminato. Multiple intermediary articles describe this as the central narrative obstacle.
*Source: immobiliare.it (Dec 2025), tassomutuo.it, idealista.it (Apr 2024), partitaiva.it.*

**Signal A2.** Mentioned threshold: many sources cite **partita IVA aged at least 2–3 years + two completed Modello Unico/Redditi PF declarations** as a soft floor for serious bank consideration. This is a folk standard rather than a regulated one and is repeated nearly verbatim across non-bank intermediary sites — suggesting a memetic norm shaping applicant expectations.
*Source: immobiliare.it (Dec 2025), tassomutuo.it, idealista.it (Apr 2024).*

**Signal A3.** Forum thread (broker question, FinanzaOnLine 2018, still indexed and referenced): explicit framing that brokers are useful precisely *because* the applicant is partita IVA "fresca" or has stretched rata-reddito ratios — but the broker route comes with worse-than-average conditions. This encodes a heuristic the audience uses: *broker = signal that you're a marginal applicant.*
*Source: FinanzaOnLine thread "Mutuo prima casa non so da dove partire", paraphrased.*

**Signal A4.** Forum thread "Mutuo fattibile o lascio perdere?" (FinanzaOnLine 2018): respondent walks through a hypothetical bank-side analysis of an applicant who switched dipendente → partita IVA → dipendente, concluding the bank will scrutinize the trajectory. The reasoning style here is what synthetic personas typically miss — *the applicant imagines the bank's narrative review of their CV.*
*Source: FinanzaOnLine thread, paraphrased.*

---

## Theme B — Tasso fisso vs. variabile under shifting BCE expectations

**Signal B1.** Heuristic visible across multiple FinanzaOnLine threads: for long durations (25–30y), most respondents default-recommend tasso fisso, framed as risk transfer — paraphrased as "at least you know how you'll die." This dark-humor heuristic is durable across years (2021, 2023, 2024 threads).
*Source: FinanzaOnLine threads "Fisso o Variabile in questo momento?" (2021), "Convincetemi che il tasso fisso..." (2023).*

**Signal B2.** Recurring counter-frame: variabile is "rational" only if you can plausibly extinguish early or surrogate. Forum discussion explicitly weighs surrogate friction (banks not always accepting, 12-month minimum). The audience understands surrogate is not a free option, contrary to bank-side framing.
*Source: FinanzaOnLine "Convincetemi..." (2023).*

**Signal B3.** Industry/news framing (FinanzaOnLine editorial, May 2025): under expected BCE rate cuts in 2025, variabile and fisso converged, and intermediaries began signaling variabile may regain its conventional discount. This shifts the rational frame and creates an opening for confusion among applicants who locked in fisso at recent peaks.
*Source: FinanzaOnLine news, May 2025; MutuiOnline editorial.*

**Signal B4.** "Mutuo opzione fisso" (rate-locked-then-floats hybrid): bank-side proposed alternative to pure variabile. Forum discussion notes the bank's structural incentive — implicit reading is that the bank's preferred product is rarely the applicant's optimal product. *Distrust-of-default-offer* heuristic.
*Source: FinanzaOnLine thread "Mutuo tasso variabile VS Mutuo opzione fisso", paraphrased.*

---

## Theme C — Garante, Fondo Consap, ISEE: shame, eligibility, and gatekeeping

**Signal C1.** Garante familiare appears across the corpus as the standard fallback for partita IVA applicants — repeatedly framed as both *practical recourse* and *signal of dependence on family*. The dual framing is the signal — synthetic audiences that treat garante as purely transactional miss this.
*Source: telemutuo.it, partitaiva.it, mutuiqui.it, tassomutuo.it.*

**Signal C2.** Fondo Garanzia Mutui Prima Casa (Consap): repeatedly cited as the under-36 lever, with state guarantee up to 80% in some cases, total loans to ~€250k. Idealista and MutuiOnline editorial frame it as the central enabler for under-36s; Consap data via MutuiOnline (Q1 2025): under-35s = ~39% of fund applications.
*Source: idealista.it (Apr 2024), MutuiOnline editorial (May 2025).*

**Signal C3.** Forum-level skepticism (FinanzaOnLine, "Parere mutuo prima casa / Autonomo con P Iva"): paraphrased — *the actual Consap experience is reported as worse than the marketing suggests.* Specifically, treatment and rates "for the lucky ones" who access the fund are different from what's advertised online. This is a confidence gap signal that bank marketing cannot close.
*Source: FinanzaOnLine thread, paraphrased.*

**Signal C4.** ISEE ≤ 40k threshold for high-LTV (>80%) under-36 access via Consap: appears across bank product pages and intermediaries. For an under-40 freelancer in regime forfettario with rising fatturato, *the ISEE calculation creates a visible cliff* that becomes a gaming/anxiety surface.
*Source: Intesa Sanpaolo product pages (mutui giovani), Mutuionline product sheets.*

---

## Theme D — Hidden costs, polizze, and "what they don't tell you"

**Signal D1.** Forum heuristic (FinanzaOnLine, multiple threads): *the only mandatory insurance for a mutuo is incendio e scoppio; everything else is facoltativo* — and the bank will push it anyway. This is one of the strongest recurring forum-side defensive heuristics.
*Source: FinanzaOnLine "Mutuo prima casa non so da dove partire", paraphrased.*

**Signal D2.** Bank-side framing on the same product (Intesa Sanpaolo): polizza Incendio Mutui is "obbligatoria" for the property; ProteggiMutuo (life/job-loss) is presented prominently in product copy without explicit "facoltativa" framing in the consumer-facing surface. The asymmetry between forum-side framing and product-page framing is itself a confusion signal — testable.
*Source: Intesa Sanpaolo product pages.*

**Signal D3.** Forum heuristic: imposta sostitutiva 0.25% (prima casa) vs 2.00% (seconda casa); cost of perizia by importo bracket (€320 to €890+). These costs are individually small but the audience-side narrative is *aggregated friction* — the cumulative perception of being nickeled-and-dimed even when each item is regulated.
*Source: Intesa Sanpaolo product trasparenza docs, multiple intermediary recaps.*

**Signal D4.** "Spread bancario" opacity: forum users repeatedly compare TAEG/ISC across banks because the headline TAN is misleading without it. This is a *literacy heuristic* the audience has built — and bank product pages that emphasize TAN over TAEG generate detectable confusion.
*Source: FinanzaOnLine threads on rate comparison, telemutuo / mutuionline TAEG references.*

---

## Theme E — Identity language: "atipico," "consumatore," and the partita IVA paradox

**Signal E1 (CRITICAL — surfaced for the demo).** Intesa Sanpaolo Mutuo Giovani product pages explicitly target "Consumatori (persone fisiche che agiscono per scopi estranei all'attività professionale imprenditoriale eventualmente svolta)." Simultaneously the same product family is marketed as available for "lavoratori atipici e a tutele crescenti." A partita IVA applicant reading the product page faces a definitional ambiguity: *am I a consumatore or am I excluded by the parenthetical?* This is precisely the kind of confusion SASP should surface, and is invisible to a generic LLM persona that doesn't read product trasparenza copy.
*Source: Intesa Sanpaolo product pages, mutui.it product sheet, mutuisupermarket.it.*

**Signal E2.** "Lavoratori atipici" as a banking category absorbs partita IVA, contratti a tutele crescenti, co.co.co. — the catch-all framing mutes within-group differences (regime forfettario vs ordinario, anzianità diverse). For a 32-year-old forfettario with 3 years of P.IVA, the term feels demeaning — *atipico = irregolare = a problem to be solved.*
*Source: MutuiOnline editorial, idealista.it, multiple intermediary articles.*

**Signal E3.** Cap on importo finanziabile for "lavoratori atipici" at €300k (Intesa Sanpaolo Mutuo Giovani Fisso) — half the no-cap consumer offer. A buried cap in the trasparenza document. The perception: *the same product, but with a partita IVA tax.*
*Source: Intesa Sanpaolo product trasparenza, mutui.it product sheet.*

---

## Theme F — Sostenibilità della rata & life-stage anxiety

**Signal F1.** 30–35% rata/reddito netto threshold appears as folk standard across multiple sources. The audience uses this as a self-filter *before* applying — if their math doesn't clear it, they don't apply, generating selection bias the bank doesn't see. *Latent demand invisibility signal.*
*Source: immobiliare.it (Dec 2025), laquiloneimmobiliare.it.*

**Signal F2.** Forum thread (FinanzaOnLine, 2026): a 30-year-old solo applicant with €1,800–1,900 net/month, 4 years of partita IVA, asking whether ~€650/month rata is "sostenibile" — explicit phrasing "ho qualche speranza senza garante?" Captures the affective landscape: hope, isolation, garante-as-shame. **This is the single most useful first-person signal in the corpus** for archetype A1 in §04.
*Source: FinanzaOnLine "Parere mutuo prima casa / Autonomo con P Iva", paraphrased.*

**Signal F3.** Preammortamento up to 10 years on Intesa Sanpaolo Mutuo Giovani is marketed as flexibility ("rate leggere di soli interessi per i primi anni"). Forum-side counter-reading: paying interest-only doesn't reduce capital, lengthens total cost, and is *flexibility for the bank's risk profile*, not the applicant's wealth-building. **Marketing/reality tension — testable.**
*Source: Intesa Sanpaolo product copy + general forum reasoning patterns on amortization.*

---

## Corpus summary

| Theme | # signals | Source spread |
|---|---|---|
| A — income volatility & proof asymmetry | 4 | Forum + intermediaries |
| B — tasso fisso/variabile | 4 | Forum-heavy + editorial |
| C — garante / Consap / ISEE | 4 | Mixed |
| D — hidden costs / polizze | 4 | Forum + bank pages |
| E — atipico / consumatore identity | 3 | Bank pages + intermediaries |
| F — sostenibilità rata / life-stage | 3 | Forum-heavy + bank copy |
| **Total** | **22** | — |

**Honest scope flag for Sunday.** This is 22 distinct paraphrased signals from ~15 sources. A production corpus targets 5–10× this volume with native-Italian human extraction. For a methodology demo to Minelli, what matters is that each Knowledge Object in §02 is traceable to ≥1 real source — not corpus volume. **Frame to Minelli: "Curated demo corpus, traceable; production ingestion targets X over Y weeks."**

**Sources cited (full list, dated):**
- forum.finanzaonline.com — 6 threads, 2014–2026
- intesasanpaolo.com — Mutuo Giovani product pages and trasparenza PDF, current
- mutui.it / mutuionline.it / mutuisupermarket.it — product comparator sheets
- immobiliare.it — Dec 2025 article
- idealista.it — Apr 2024 article
- partitaiva.it, tassomutuo.it, telemutuo.it, mutuiqui.it, laquiloneimmobiliare.it — intermediary editorial
