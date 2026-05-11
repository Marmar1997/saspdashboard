# SASP Sunday Demo — Working Pack
## For: Sunday meeting with Francesco Minelli (Excellence)

**Run identifier:** SASP/IT/MTG/001
**Use case:** Mortgage product (Intesa Sanpaolo Mutuo Giovani) × under-40 freelance audience, Italy
**Version:** v0.1, demo scope (not production)

---

## What's in this pack

| # | File | What it is | When to use it |
|---|---|---|---|
| 00 | `README.md` | This file — orientation | Read first |
| 01 | `01_signal_corpus.md` | 22 paraphrased Italian signals across 6 themes, with source URLs | If Minelli asks "where does the data come from" |
| 02 | `02_knowledge_objects.md` | 13 Knowledge Objects with relations, source-grounded | If Minelli asks methodology questions |
| 03 | `03_distribution_data.md` | ISTAT, MEF, Banca d'Italia, Consap data for distributional weighting | If Minelli asks "is your audience representative" |
| 04 | `04_archetypes.md` | 4 archetypes defined as KO activation patterns + demographic anchors | The audience-construction step of the demo |
| 05 | `05_product_under_test.md` | Intesa Sanpaolo Mutuo Giovani — claims, features, 6 marketing/reality tensions | The product-side of the demo |
| 06 | `06_simulation_output.md` | Per-archetype T/C/PR scores + top 3 sourced objections + LLM-persona benchmark | The simulation result, with traceback. The substance. |
| 07 | `07_demo_narrative.md` | Sunday script with timing, key lines, anticipated Q&A | Read Saturday night before Sunday |
| — | `dashboard.html` | The visual asset — open in browser, full-screen, project | The screen Minelli mentally screenshots |

---

## Read order for tonight (if you have 30 minutes)

1. **`07_demo_narrative.md`** — the script. 8 minutes.
2. **`06_simulation_output.md`** — the substance. 10 minutes.
3. **`dashboard.html`** — open in browser, scroll through. 5 minutes.
4. Skim the rest as reference.

## Read order for Federico (if he has 15 minutes)

1. **`07_demo_narrative.md` § "Lines for Minelli to carry"** + **§ "Anticipated questions and answers"** — the commercial substance
2. **`06_simulation_output.md` § differentiation panel** — the moment that closes Minelli
3. **`02_knowledge_objects.md` § "Note for Federico"** — the density-matrix language alignment, important to discuss before Sunday

---

## What Minelli walks out with — the three things

1. **The dashboard** (visual artifact) — one screen, one product, four archetypes, sourced objections
2. **The differentiation moment** — generic LLM persona vs SASP A1, side-by-side, with the closing question: *"Which one would you brief a CMO with before €5M of launch spend?"*
3. **The close line** — "Name a product. We run it in 10 days."

---

## What's deliberately not in this pack

- **Density matrix language.** Per V2.1 design doc. External framing: "structured audience state model with source-grounded epistemic objects." The math stays internal until Federico and the engineering team are ready to externalize it precisely. Pre-align with Federico before Sunday.
- **France/Germany substance.** Roadmap-only. Don't pretend it's running. Stub framing: "EU-native architecture, country layers v0.1 next quarter."
- **Claims about ROI.** No numbers we can't defend. The pitch is methodological credibility + commercial path, not "save €X million."
- **Comparison with Mind/HyperMind by feature parity.** Compare on three differentiators only: grounding, EU-native, auditability. Don't fight on their terrain.

---

## Honest scope flags — surface, don't hide

These are in the dashboard footer, in `06_simulation_output.md`, and in the demo narrative. **Bring them up before Minelli does:**

1. N=22 signals is a curated demo corpus. Production target ≥500 with native-Italian human-in-the-loop validation.
2. 4 archetypes here, not the V2.1 MVP target of 20. Roadmap visible.
3. The LLM-persona benchmark in §06 was constructed for the demo, not run as a controlled experiment. Production validation methodology is part of the research track.
4. Scoring rubric is transparent and hand-computed for v0.1. Production simulator computes numerically.
5. Distributional weights are defensible first-pass from open public data; production weighting needs Banca d'Italia microdata access.

These flags *strengthen* the demo. A buyer who feels they got an honest read trusts the next read.

---

## Saturday checklist before Sunday

- [ ] Federico read `07_demo_narrative.md`, especially the density-matrix alignment note
- [ ] Pricing frame for "quanto costa?" decided between you and Federico (two-line answer)
- [ ] `dashboard.html` opens cleanly in your browser, full-screen ready
- [ ] Backup: one variation of the dashboard ready (e.g. swap product, re-run A1) — optional but nice
- [ ] The three lines for Minelli to carry are written on a card you hand him at the end
- [ ] You and Federico have agreed on who runs which section (suggested split in `07_demo_narrative.md`)
- [ ] Sleep

---

## Honest read on the work

This pack is what a curated, methodology-credible v0.1 demo looks like in two days from a near-zero start. It's not production. It is **demonstrably better than a generic LLM persona briefing on the same product**, and the differentiation panel proves that empirically.

The corpus and benchmark would not survive a serious academic review at this scale — they're too small, single-platform-skewed (Finanzaonline-heavy), and the LLM-benchmark wasn't a controlled experiment. Don't oversell. The argument for SASP isn't "this v0.1 is great" — it's "this v0.1 already demonstrates a structurally different approach, and the production version will scale this with the same methodology."

If Minelli asks any version of "is this enough to convince a bank to pay for it?" the honest answer is: *for a pilot, yes. For a production purchase, the bank will want to see this run on their product, with their data, against their proposition. Which is exactly what you sell to them.*

Good luck Sunday.
