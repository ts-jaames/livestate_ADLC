# AGENT_BRIEF_LEDGER.md

Pinned context for agent runs that construct and progress Evidence Work drafts in this repo.
This governs the ledger loop only. It does not govern the client-facing ESOA build — see
`AGENT_BRIEF.md` for that.

## Standing goal

Take a named set of risk IDs from `data/register.csv` and turn each into a structured draft —
Assumption, Slice, Signal — using the ratified Evidence Work definitions already in this repo.
Nothing this brief produces is canonical until a human confirms it. Confirmation is a PR merge,
not a chat message.

## Before you do anything

Read, in this order:
1. `evidence-work-risk-assessment/SKILL.md` (or wherever the skill is mounted in this repo) —
   this is the workflow. Follow it exactly. Do not loosen a definition because it's harder to
   satisfy for a specific risk.
2. `evidence-work-risk-assessment/references/glossary.md` — ratified terms. If you're unsure what
   a word means, check here before guessing.
3. `data/register.csv` — read-only in this brief. You will reference rows by ID. You will not
   write to this file. Ever, in this brief. Promotion (below) is a separate, later step with its
   own explicit permission.

## The one hard rule

**Drafts live in `ledger/drafts/`. `data/register.csv` is never touched by a drafting run.**

This is the seam between "agent-produced, unconfirmed" and "canonical, client-visible." The ESOA
reads only `register.csv`. If draft content leaked there before a human confirmed it, an
unreviewed agent claim would sit one column away from what a client sees. Do not create that
condition under any circumstance, including being asked to "just this once."

## Repo shape this brief assumes

```
sparqos-evidence/
  data/
    register.csv              <- read-only to this brief
  evidence-work-risk-assessment/
    SKILL.md
    references/glossary.md
  ledger/
    drafts/
      {ID}.md                 <- one file per risk being worked
  AGENT_BRIEF.md               <- governs the ESOA build, not this
  AGENT_BRIEF_LEDGER.md         <- this file
```

If `ledger/drafts/` doesn't exist yet, create it as part of your first run — that's in scope.

## Draft file schema — `ledger/drafts/{ID}.md`

Every draft file uses this exact shape. Do not add sections, do not remove sections, do not
rename headers — reviewers and later promotion steps depend on this being predictable.

```markdown
# {ID} — {short risk name}

## Risk
Statement: [pulled verbatim from register.csv Risk / Clarifying statement — do not re-word]
Category: [Value / Usability / Feasibility / Viability / Operational]
Gate: [from register.csv Gate column]
Area: [from register.csv Area column]

## Assumption(s)
### A1
Statement: [declarative, testable — never a question]
Success criteria: [observable, quantifiable]
Failure criteria: [observable, quantifiable]

[repeat A2, A3 only if the risk genuinely contains multiple distinct measurable variables —
see SKILL.md Step 2 on when to split rather than bundle]

## Slice(s)
### S1 (tests A1)
Method: [what gets built/run/tested — minimal, disposable unless promoted]
Type: [Feasibility / Value / Usability / Viability / Operational]
Execution: [Agent-executable now / Requires manual run — see brief section below]
Scope / time-box: [...]

## Signal
Success signal: [...]
Failure signal: [...]
Threshold: [...]
Result: _pending — not yet run_

## Confidence & Decision
Current confidence: _pending signal_
Suggested read: [you may propose one, explicitly labeled "Agent suggestion — not a decision"]
Decision: _awaiting human review_

## Status
`draft` | `framing-reviewed` | `ready-to-run` | `signal-captured` | `decided`
```

Headers and field names stay exactly as above. The sentences under them follow the skill's
**Output voice**: plain, short, same bars and counts. A non-technical reviewer should be able
to digest the draft on Files changed without a glossary open.

The `Suggested read` line is the only place you're allowed to editorialize about confidence. Label
it exactly as shown. Never write into the `Decision` line yourself, under any status.

## What you do, step by step

### Step 1 — Frame (this is most of your job)
Given a list of risk IDs, for each one:
- Look up the row in `register.csv`.
- Run the Evidence Work Risk Assessment skill against it.
- Write the draft file per the schema above, Status: `draft`.
- Open one PR containing all draft files for this batch. Do not open one PR per risk unless
  told to — batch by run, not by risk, to keep review manageable.

**PR description — use this template, filled in, every time:**

```
## Ledger drafting run — [date]

Risks framed: {ID}, {ID}, {ID}

Reviewers: check three things per risk, nothing else at this stage —
1. Is the Assumption actually what we meant, stated as a testable claim?
2. Is the Bar (success/failure criteria) something we'd accept as proof either way?
3. Is the Slice minimal — one assumption, not a bundled feature?

Leave inline comments on anything off. This PR does not touch data/register.csv.
```

### Step 2 — Framing review (human, not you)
You do not act during this step. A reviewer comments on the PR. If comments land, you may be
asked to revise — same file, same schema, Status stays `draft` until merged.

### Step 3 — Confirm
Merge of this PR is the confirmation. Once merged, you may update Status to `framing-reviewed`
in a small follow-up commit if asked. Do not merge PRs yourself.

### Step 4 — Execution (only after framing-reviewed)
Split strictly by Slice Type:
- **Feasibility slices**: you may execute directly — run the test, hit the API, execute the
  script — inside this same run. Append the raw result under `Signal → Result`. Mark
  Status: `signal-captured`.
- **Value / Usability / Viability / Operational slices** you cannot personally observe (user
  behavior, stakeholder judgment, business context): do not simulate a result. Leave
  `Execution: Requires manual run` and `Result: _pending — not yet run_` exactly as-is. This is
  correct, not incomplete.

Open a second PR for execution results, separate from the framing PR.

### Step 5 — Decision (human, not you)
A human sets `Confidence & Decision` and updates Status to `decided` directly in the file
(GitHub web editor is fine — no local tooling required for this step). You are not involved
unless asked to draft a suggested read, per the labeling rule above.

### Step 6 — Promotion (separate permission, separate PR)
Only on an explicit instruction to promote a specific ID, and only after Status is `decided`
with a real Decision recorded:
- Update that single row's `Status` column in `data/register.csv` to match.
- Never touch `Client view` or `Client label` in this step — those are a separate, deliberate
  editorial decision about what the client sees, not a byproduct of promotion.
- Open this as its own PR, never bundled with a framing or execution PR.

## Non-negotiables (same spirit as the skill, restated for this repo)

- One assumption per slice. If you find yourself bundling, split the risk into A1/A2 instead.
- No numeric confidence scores anywhere in a draft file.
- No fabricated client or engagement detail to fill out a section. Mark unknowns as unknown.
- Never write to `data/register.csv` except in an explicit, separately-instructed Promotion run.
- Never merge your own PRs.
- Never advance Status past `draft` on your own authority.

## What "done" looks like for a drafting run

One PR, one description using the template above, one file per risk in `ledger/drafts/`,
zero changes to `data/register.csv`, and every draft's `Decision` line reading exactly
`_awaiting human review_`.
