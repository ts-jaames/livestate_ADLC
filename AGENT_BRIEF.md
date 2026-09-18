# sparqos-evidence — Build Brief & Repo Rules

> Standing goal for a Cursor Cloud Agent. Also the repo's rules file.
> Pin this as a Custom Mode / project rule so it stays on across the build.
> Work milestone by milestone. One PR per milestone. Do not bundle.

---

## Goal

Build and maintain **one repo** that houses the Evidence Work kit and its client-facing
progress experience, reading from a **single source of truth**:

1. the **register** (data),
2. the **rules** (definitions/scales),
3. an **internal risk-log view** (app-like: read, filter, sort),
4. a **client experience** (confidence progress board — see ESOA reference).

This repo is the *Evidence Work engagement kit*. It is one object at one altitude.
The capability model is a **separate** repo at a different altitude — referenced, never merged.

---

## Non-negotiable rules (obey these before any feature)

1. **Single source of truth is `data/register.csv`.** Never invent, reword, re-score, or add
   risks. If something is missing, surface it in the PR description — do not fabricate it into
   the data. Every rendered item must trace to a register row by `ID`. No orphan content.
2. **Views read from the source. They are not independent truth.** Editing `register.csv` must
   propagate to every view (internal and client) with no other change.
3. **Client-facing discipline.** The client experience renders ONLY rows where
   `Client view = Y`, and shows ONLY the `Client label` text. Internal columns
   (`Risk`, `Clarifying statement`), internal IDs, and internal vocabulary
   (e.g. "swap/kill", "Seam", "Fabric", "collapse") never reach the client surface.
4. **Confidence honesty.** Render `Status` as-is (`Undefined / In test / Validated / Committed /
   Parked`). Never simulate progress. **Empty "Proven" and "Committed" columns are correct**, not
   gaps to fill. Do not add flourish that implies more certainty than the data holds.
5. **Traceability over polish.** A clean, incomplete view beats a complete-looking fabricated one.

---

## Repo structure (lean — do not exceed without a stated reason in the PR)

```
sparqos-evidence/
  AGENT_BRIEF.md          <- this file (rules + standing goal)
  README.md
  sparqos.repos.yaml      <- manifest: which SparqOS repo owns what (reference-by-contract)
  data/
    register.csv          <- canonical source of truth (provided; do not regenerate)
  rules/
    scales.md             <- collapse / uncertainty / test-effort rubric
    README.md             <- where doctrine/definitions live (owner drops docs here)
  index.html              <- client experience (GitHub Pages serves at root)
  internal/
    index.html            <- internal risk-log view (read + filter + sort)
```

Both views fetch `data/register.csv` **same-origin** (relative path). No external hosting,
no Google Sheets wiring, no server.

---

## Data contract — `data/register.csv`

Columns: `ID, Area, Risk, Clarifying statement, Type, Collapse, Uncertainty, Test effort,
Priority cue, Status, Client view, Client label`.

- `Collapse / Uncertainty / Test effort` ∈ `Low / Medium / High`.
- `Priority cue` is derived from those three (High collapse + High uncertainty = "Attack first";
  all three High = "Cluster - decompose"). Recompute in the view; don't trust a stale cell.
- `Status` ∈ `Undefined / In test / Validated / Committed / Parked`.
- `Client view` ∈ `Y / N`. `Client label` = client-safe phrasing.

---

## Milestones (one PR each)

- **M1 — Skeleton.** Repo tree above, `data/register.csv` committed as-is, `README.md`,
  `sparqos.repos.yaml`. No app logic yet.
- **M2 — Rules.** `rules/scales.md` (the rubric) + `rules/README.md` (a pointer for where
  doctrine/definitions go). Static.
- **M3 — Internal risk-log view** (`internal/index.html`). Reads `register.csv`. A table with
  filter + sort by Area, Type, Collapse, Uncertainty, Test effort, Priority cue, Status.
  **Read + filter first.** In-place editing is OPTIONAL and DEFERRED — do not build it in M3.
- **M4 — Client experience** (`index.html`). The confidence progress board (below).
- **M5 — Manifest wiring.** In `sparqos.repos.yaml`, reference the capability-model repo by its
  published contract URL. **Stub the reference only — do not integrate its data.**

---

## Client experience — reference ESOA (https://esoa.vercel.app)

Open the live site and match its **behaviors and feel** — do not scrape its assets.

**Behaviors to match:**
- **Dark theme.** Sparq type: IBM Plex Sans (UI), IBM Plex Mono (labels/meta), Newsreader
  (display). Accent `#E75437`, off-white `#F2EFE9`.
- **Nav as operational conditions, not features:** "When nothing's on fire / When something
  changes / What lasts."
- **The change loop is the show.** ESOA runs: scenario → absorbed → confirm → reprice + human →
  new number → everyone hears. For the ADLC, the analog is: a change/risk event → what the
  system holds as true → what must be proven next → the decision → who is informed.
- **Confidence-tiered truth:** an explicit "What's true" set vs a "Still a bet" set. Map to
  `Status` (Validated/Committed = true; In test/Undefined = bet).
- **State labels** in ESOA's register: Steady / Reassessing / Provisional / Rebuilding.

**The progress board itself (this is the client view's core):**
- Axis is **confidence, not time**: `Unknown · mapped → Being proven → Proven → Committed`.
- **Coverage always visible** — every Area is on the board so nothing looks ignored.
- **Gate headline:** "To justify the next increment of commitment, the ADLC must prove: …"
  naming the items in `Being proven` (default: the `Attack first` rows).
- **Parked = shown with a reason**, never a false progress bar. This is NOT a Gantt.

A working v0 of this board (hardcoded data, correct structure) exists as prior art — match its
structure, but wire it to `register.csv` and the `Client view = Y` filter.

---

## Overbuild line — do NOT build yet

- No auth, accounts, database, ingestion pipeline, or live-state automation.
- No in-place editing UI until the read views are validated in real use.
- No capability-model data integration — stub the manifest reference only.
- No new risks, states, or columns beyond the data contract.

Reason: the single source of truth plus honest views is the entire benefit right now.
Everything else is unearned until use proves it's needed.

---

## Definition of done (every view)

- Fetches `data/register.csv` same-origin; editing the CSV changes the view, nothing else.
- Client surface shows only `Client view = Y` rows and only `Client label` text.
- Every rendered item traces to an `ID`. Nothing fabricated.
- Renders correctly with **empty** Proven/Committed columns.
- PR description states what was built, what was deferred, and any risk the register is missing.
