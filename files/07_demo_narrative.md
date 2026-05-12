# SASP Demo Narrative — Sunday with Minelli
## ~12 minute demo + Q&A

**Audience.** Francesco Minelli (Excellence). Sophisticated. Will retell this to bank/insurer CMOs and eventually Adecco. Every slide and every demo moment needs a one-sentence version Minelli can carry.

**Goal of the meeting.** Not "convince Minelli SASP works." It's "give Minelli the asset he's about to sell" — three reusable demo moments and three reusable lines.

**What Minelli walks out with.**
1. **The dashboard image** (§visual_dashboard) — one screen, one product, one objection traced to a real source. Mental screenshot.
2. **The differentiation panel** (§06) — SASP A1 output vs generic LLM persona, side-by-side, with the question: *"which one would you use to brief a CMO about to spend €5M?"*
3. **Three lines** to use in his next CMO meetings (see §lines_to_carry below).

---

## Suggested running order

### 0:00 — Open with the use case, not the methodology

**Open with:** "Banca leader italiana lancia il prodotto mutuo per under-36, posiziona anche per partita IVA atipici. Spende milioni in advertising. Ha mai stress-testato il prodotto contro un'audience di freelance reali, prima del lancio? Ecco cosa abbiamo fatto."

Skip "we are KBA, founded in...". Minelli knows you. Open with the demo target.

### 1:00 — Show the audience layer (briefly)

Walk through the 4 archetypes (§04) at high level. Don't read every KO — show that each archetype is a *belief activation pattern*, not a description. **Key line:** "Marco-32-da-Milano è un costume. L'archetipo SASP è un pattern di credenze, paure, euristiche. La differenza è che l'output è riproducibile."

Pop-up the source corpus (§01) for ~10 seconds. Don't dwell. **Key line:** "Ogni archetipo è ancorato a segnali reali italiani — forum, recensioni, marketing copy. Per la demo abbiamo curato 22 segnali. In produzione: 500+ con validazione human-in-the-loop."

Be honest about the scope. Don't pretend it's full ingestion. The honesty plays.

### 2:30 — Show the product under test

Pull up the Intesa Sanpaolo Mutuo Giovani product page (§05). On-screen, side-by-side:
- Marketing line: *"Pensato per gli under 36... anche per lavoratori atipici e a tutele crescenti"*
- Legal definition (from trasparenza): *"Consumatori (persone fisiche che agiscono per scopi estranei all'attività professionale imprenditoriale eventualmente svolta)"*

**Key line:** "Una partita IVA che legge entrambe queste righe non sa più se è dentro o fuori dal prodotto. Questa è la prima tensione che SASP rileva."

This is your hook. It's a real bank, real product, real contradiction. Minelli will notice.

### 4:00 — The simulation moment

Show the dashboard (visual artifact, see file). For each archetype:
- T / C / P scores (one number each, large)
- Top 3 objections, each with KO traceback and source citation

**Don't read the whole dashboard.** Pick A1. Walk through Objection A1.1 (consumatore ambiguity) — show the KO traceback, click through to the source signal in the corpus, show the URL.

**Key line:** "Questa obiezione non è inventata. Non è generata stocasticamente. È la conclusione di un percorso: KO → segnale reale → URL. Lo riproduciamo identico, ogni volta che facciamo girare la simulazione. È auditabile."

Auditability is the word. Use it once, deliberately.

### 6:00 — The differentiation moment

Now the side-by-side: generic LLM persona output vs SASP A1 output (§06 differentiation panel).

Read the LLM persona output verbatim. Pause. **Key line:** "Suonava bene, vero? Ma è generico. Potrebbe essere qualunque paese, qualunque banca. Non c'è ISEE, non c'è Consap, non c'è atipico, non c'è il garante familiare come marker di vergogna."

Then SASP output. **Key line:** "Stesso prompt. Output diverso. Tre obiezioni concrete, ciascuna tracciabile a un segnale italiano specifico. Quale di queste due si porta a un CMO che sta per spendere cinque milioni in lancio?"

This is the close-the-deal moment. Don't speak after asking the question. Let it land.

### 8:00 — Position vs Mind / HyperMind

Three differences. Spoken slowly.

**Key line 1:** "Mind/HyperMind partono da personas sintetiche — generate da prompt. Noi partiamo da segnali reali — corpus italiano. La differenza è il grounding."

**Key line 2:** "Le loro audience sono USA/UK-default. La nostra è EU-native, country-aware. L'Italia ha Consap, ISEE, P.IVA, partita IVA forfettario. Niente di questo è in un modello US."

**Key line 3:** "Le loro simulazioni sono opache. La nostra ogni obiezione è tracciabile a un KO e a un URL. Per un regolatore, questo è la differenza tra usabile e non usabile."

Don't say "density matrix." If pressed, say "modello di stato d'audience strutturato." The math stays internal — design doc V2.1.

### 9:30 — Roadmap (for his Adecco conversation, three months from now)

One slide.
- **Today:** Italy live, mortgage v0.1
- **Q1+:** 20-archetype mortgage MVP Italy + France/Germany country layers
- **Q2:** Regulatory Knowledge Base v0.1 (MCD, MiFID II POG, PRIIPs, IDD + transposizioni nazionali)
- **Q3:** Cross-Border Launch Pack as a SKU — *that's* the Adecco asset

**Key line:** "L'architettura V2.1 è EU-native dal giorno uno. Quando porti SASP ad Adecco tra tre mesi, la storia cross-country non è una promessa — è già nel design."

### 11:00 — The close

**Key line (write this down for him):** "Dimmi un prodotto. Te lo facciamo girare in 10 giorni. Mortgage, polizza, fondo, prestito personale. Il framework è lo stesso, cambia solo il corpus e i KO."

This is the line he takes to his next CMO meeting and books a pilot.

### 11:30 — Q&A

---

## Lines for Minelli to carry (write these on a card for him)

1. **The hook:** "Banca italiana, prodotto under-36, marketing che dice 'anche atipici', legale che dice 'consumatore non per scopi imprenditoriali'. La partita IVA non sa se è dentro o fuori. SASP lo rileva, traccia l'obiezione, e ne dimostra la fonte."

2. **The differentiation:** "LLM personas vs SASP: entrambe sembrano reali, una sola è auditabile. Per un budget di lancio da milioni, l'auditabilità non è opzionale."

3. **The close:** "Dimmi un prodotto. 10 giorni. Te lo testiamo prima che lo lanci."

---

## Anticipated questions and answers

**Q: "Avete un buyer?"**
A: "Tu. Ed Excellence. Da lì ai partner di Excellence — banche, assicurazioni — il path è chiaro."

**Q: "Quanto sono robusti questi 22 segnali del corpus?"**
A: "Per la demo, sufficienti — ogni archetipo è ancorato a almeno tre segnali reali. Per produzione, target 500+ con validazione native-Italian. Sappiamo che 22 è poco. È trasparente, non nascosto."

**Q: "Mind / HyperMind ha già clienti, voi no. Perché dovreste vincere?"**
A: "Tre motivi. (1) Grounding: noi partiamo da segnali reali, loro da personas generate. (2) EU-native: Consap, ISEE, MCD, POG — non sono nei loro modelli. (3) Tracciabilità: le nostre obiezioni hanno un URL dietro. Per un regolatore, questa è la differenza tra usabile e non usabile."

**Q: "Quanto tempo ci vuole per un cliente nuovo?"**
A: "Pilot: 10 giorni per un prodotto, una geografia. Cross-border: 4-6 settimane. Production con RKB compliance check: 8-12 settimane. SKU separati, prezzi separati."

**Q: "Quanto costa?"**
A: [Federico answers — commercial. Possible frame: pilot fisso, poi licenza annua + per-test fee. Define before Sunday.]

**Q: "Ma se uno volesse simulare in 30 paesi insieme?"**
A: "Non oggi. La V2.1 ha Italy full + France/Germany stubs. Cross-border Launch Pack è SKU separato. Onestamente: SASP non è una piattaforma globale chiavi-in-mano. È una piattaforma EU-native con copertura per-country profonda. Se serve global broad-and-shallow, c'è altro nel mercato."

(Don't oversell EU coverage. Minelli will respect the line.)

**Q: "La parte matematica è solida?"**
A: "Sì. La rappresentazione interna è uno stato d'audience strutturato sopra gli oggetti epistemici. Per la demo abbiamo deliberatamente tenuto la matematica fuori dalla narrativa esterna — è interna, auditata, ma non è il pitch. Il pitch è il grounding e la tracciabilità."

(Federico, please don't lead with density matrix. Per design doc V2.1.)

**Q: "Posso vederlo girare in tempo reale?"**
A: "Per la versione completa con corpus production e RKB, no — sono settimane. Per una variazione del prodotto attuale (cambia un'archetypo, cambia un claim), sì — possiamo farlo qui adesso o nei prossimi giorni in modo asincrono."

(Have one variation ready as a backup demo if asked. Switching the product page from Intesa Sanpaolo Mutuo Giovani to e.g. UniCredit Mutuo Sicuro and re-running A1 takes ~30min if prepared.)

**Q: "Privacy / GDPR?"**
A: "Tutto il corpus è da fonti pubbliche, nessun dato personale identificabile. Non scrapiamo dietro autenticazione. La validazione humana è interna al team. Per produzione cliente, un Data Protection Impact Assessment è parte del setup."

---

## Pre-Sunday alignment checklist (do these before)

1. **Pre-align with Federico** on density-matrix language — keep external framing as "structured audience state model with source-grounded epistemic objects." Don't litigate this live.
2. **Confirm pricing frame** for the "quanto costa" question. Two-line answer ready.
3. **Have the dashboard image polished** (see visual artifact below). One screen, one moment, screenshottable.
4. **Decide who runs each section.** Suggestion: Maryam runs methodology (sections 1:00, 4:00, 11:00). Federico runs framing and close (0:00, 8:00, 11:30 Q&A commercial). This plays to strengths.
5. **Sleep before the demo.** Saturday night discipline.

---

## What you don't want to do

- Don't apologize for the 22-signal corpus. Frame it as "demo curated, production scale-up."
- Don't promise things in months that are quarters.
- Don't say "AI" without follow-up — "AI" is meaningless to a sophisticated buyer. Say "structured epistemic model + simulation."
- Don't leave with "we'll send you something." Leave with **"name a product, we run it in 10 days."** That's the close.
