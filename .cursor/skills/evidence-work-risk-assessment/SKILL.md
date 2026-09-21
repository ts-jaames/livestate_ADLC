---
name: evidence-work-risk-assessment
description: Run a risk, worry, or "what if X doesn't work" through Sparq's Evidence Work framework (Risk → Assumption → Slice → Signal → Confidence → Decision) using ratified, shared definitions — so any Sparq colleague gets the same rigor and vocabulary without pasting in context first. Use this whenever someone shares a risk or open question about an engagement, wants to stress-test a feature idea or technical bet, asks for a "risk assessment," wants to convert a vague concern into testable assumptions, needs to design a thin slice or define signal/success criteria for a test, wants Jira-ready Assumption/Slice tickets, or asks what needs to be proven before committing further. Trigger even if they don't use Sparq vocabulary explicitly — "is this even feasible," "what could go wrong here," "how do we test this before we build it" all qualify.
---

# Evidence Work Risk Assessment

Turns one risk into a structured, testable package: Risk → Assumption(s) → Slice(s) → Signal →
Confidence read → Decision. This is Sparq's Evidence Work discipline, applied consistently
regardless of who's running it or how much context they typed in.

**Ground rule:** the definitions in this skill are ratified. Don't loosen them to fit what feels
easier to test, and don't let the person's phrasing ("let's just build a small version and see")
quietly redefine a slice into a feature. Holding the line on vocabulary *is* the value this skill
adds over a generic "help me think about risk" conversation.

## Output voice

Write for a colleague reading GitHub Files changed — not for an engineer reading a lab protocol.
Keep the depth: who, how many, what counts as pass or fail, what we do if it fails. Drop the
costume: no codebook, no “sitting,” no lecture on Concept → Validation in the draft body.

- Short sentences. One idea each.
- Everyday words first. If you must use assumption, slice, signal, promote, iterate, or stop,
  say what that word means in the same line, once.
- Counts stay counts (`4 of 5`, not “most people”).
- Do not paraphrase a register risk statement.
- Do not add sections the ledger schema did not ask for.

## Before you start: what Evidence Work is (so you don't reframe it)

Evidence Work is not a discovery framework, a ceremony, or a template library. It's a
confidence-governed investment system: **work advances because uncertainty has been reduced, not
because time has passed.** Confidence is earned through signal, not through documentation,
stakeholder enthusiasm, or a polished demo.

If nothing has been said about a specific engagement, treat the risk as an internal or general
Sparq risk and run the same rigor. If an engagement or client is named, ask what's already known
before inventing details — don't fabricate client context to fill out the template.

## The workflow

Run these steps in order. Don't skip to writing assumptions before the risk is framed — vague
risks produce bundled, untestable assumptions.

### Step 1 — Frame the Risk

A risk is an uncertainty with consequence: *if we're operating as if X is true but haven't
validated it, that's a risk.* It is not a task, a feature, a preference, or a vague concern.

Use this template if the person's input is loose:

> "If **[uncertainty]** is true, then **[capability/initiative]** may fail because **[impact]**."

Classify it into one (sometimes two) of the five risk categories — don't skip this, it shapes
what a valid test looks like:

| Category | Question it answers |
|---|---|
| Value | Will users/clients care enough to change behavior? |
| Usability | Can users understand and use this effectively? |
| Feasibility | Can this be built given technical constraints? |
| Viability | Does this make business/commercial sense? |
| Operational | Can this be supported and scaled reliably? |

Prioritize with three dimensions, and say so explicitly: **impact if wrong × degree of
uncertainty × cost/speed to test.** High-impact + high-uncertainty + cheap-to-test is the one to
attack first. If it's high-impact but expensive to test directly, say that and propose a proxy
slice rather than skipping the risk.

**Gut-check before moving on** — apply the qualification filter:
- Unknown and expensive if wrong → this needs slicing now.
- Unknown but cheap to reverse → can be deferred; flag it, don't force a slice.
- Known and low risk (standard auth, CRUD, established patterns) → doesn't belong in Evidence
  Mode at all. Say so and stop here rather than manufacturing a test for something that isn't
  actually uncertain.

### Step 2 — Convert the Risk into 1–3 testable Assumptions

An assumption is a **declarative, testable statement**, never a question, and never vague.

> Bad: "Can we render LOD-300 smoothly?" / "Onboarding will be good."
> Good: "Assets under 25MB can render at ≥30fps on iPad Pro." / "Users will complete onboarding
> in under 2 minutes without guidance."

Extract the core uncertain variable(s) from the risk first, then write one assumption per
variable using: *"We believe that [specific measurable condition] will result in [measurable
outcome]."* If the risk implies more than 3 distinct measurable variables, that's a sign the
"risk" is actually several risks bundled together — split it before continuing, don't cram it
into one mega-assumption.

Each assumption needs, explicitly stated:
- **Risk category** (from Step 1)
- **Assumption statement** (declarative)
- **Success criteria** (observable, quantifiable)
- **Failure criteria** (observable, quantifiable)
- **Linked capability/initiative** (if known)

If you can't state success/failure criteria in observable or quantifiable terms, the assumption
isn't ready yet — refine it, don't pass it through anyway.

### Step 3 — Design the Slice for each Assumption

A slice is the **smallest buildable artifact that generates signal for one specific assumption.**
It is not a feature, not a workflow, not a full prototype.

The hard rule: **one assumption per slice.** "Does AR measurement work, feel intuitive, integrate
with pricing, and sync offline?" is five assumptions bundled into what looks like one test — call
this out explicitly if you see it, using this exact framing: *"That's not a slice, that's a
feature — it needs to be split."*

For each slice, define:
- **What is being tested** (one assumption, referenced by ID/name)
- **Test method** (load test / mock environment / prototype constraint / controlled cohort —
  something minimal, not "build the full thing")
- **Sample size / scope**
- **Time-box**
- Confirm it is disposable unless promoted — don't let it quietly become production code

### Step 4 — Define Signal

Signal is the measurable evidence a slice produces. It must be predefined *before* the slice
runs, not interpreted after the fact.

For each slice, state explicitly:
- **Success signal** — what measurable outcome increases confidence
- **Failure signal** — what measurable outcome decreases confidence
- **Threshold** — what specifically triggers promotion vs. iteration vs. stop

Reject soft signal. "It feels good," "looks smooth," "the team seemed confident" are not signal —
say so if the person offers them, and push for a quantifiable or directly observable substitute.

### Step 5 — Confidence read and Decision

Confidence is not a number and not a vote — it's a qualitative judgment of how much the signal
reduced uncertainty relative to what's being committed next. Don't invent a percentage or score.

State explicitly:
- What the signal showed (or, if no test has run yet, that confidence is currently **Low /
  undefined** — don't imply progress that hasn't happened)
- Whether the confidence threshold for the *next* commitment step is met (see thresholds below)
- The decision: **Promote | Iterate | Pivot | Stop** — always pick one, never leave it implicit

Confidence thresholds scale with irreversibility of the next step:
- **Concept → Validation**: problem is clearly defined, the assumption is explicit and
  measurable, success criteria exist, a realistic thin-slice test path exists, irreversibility
  stays low.
- **Validation → Commitment**: measurable (not just directional) signal exists, feasibility has
  been demonstrated in a working slice, secondary risks surfaced are documented, metrics can
  become production KPIs, the cost of being wrong is acceptable, and the decision is explicitly
  recorded.

## Output format

Default to this structure (matches Sparq's Jira hierarchy: Capability → Risk → Assumption →
Slice → Signal), scaled to however many assumptions the risk produced:

```
RISK
  Statement: [If X is true, then Y may fail because Z]
  Category: [Value / Usability / Feasibility / Viability / Operational]
  Priority: [Attack first / Watch-manage / Cluster-decompose / Defer] — with the impact ×
            uncertainty × test-cost reasoning stated

ASSUMPTION 1
  Statement: [declarative, testable]
  Success criteria: [...]
  Failure criteria: [...]

  SLICE 1.1
    Tests: Assumption 1
    Method: [...]
    Scope/time-box: [...]

    SIGNAL
      Success signal: [...]
      Failure signal: [...]
      Threshold: [...]

CONFIDENCE & DECISION
  Current confidence: [Low / Medium / High — with reasoning, not a number]
  Threshold check: [does it clear the next gate? which one?]
  Decision: [Promote | Iterate | Pivot | Stop]
```

If the person only gave you a rough risk and hasn't run any test yet, still produce the full
structure — Slice and Signal sections describe what *should* be run, and Confidence/Decision
should honestly say "no signal yet, confidence Low, recommend running Slice 1.1 before any
further commitment."

## Guardrails — do not

- Treat documentation, a polished deck, or stakeholder enthusiasm as evidence.
- Let a slice test more than one assumption.
- Invent a numeric confidence score — Evidence Work is qualitative judgment, not a scoring model.
- Skip straight to "build a small version" language — that's feature-thinking creeping back in.
- Fabricate client-specific facts (numbers, constraints, prior decisions) to fill out the
  template. If something's unknown, mark it unknown and ask.
- Silently drop the Decision step. Every pass through this framework ends in an explicit
  Promote/Iterate/Pivot/Stop, even if the honest answer is "not enough signal yet, stay in
  Evidence mode."

## When to go deeper

For the fuller glossary (Confidence, Commitment States, Evidence/Commitment Backlog, Promotion
Protocol, and the complete confidence-gate guidelines with all sub-conditions), see
`references/glossary.md`. Load it when a term needs precise definition, when someone asks about
promotion between commitment states in detail, or when the risk assessment needs to note which
backlog (Evidence vs. Commitment) the resulting work belongs in.
