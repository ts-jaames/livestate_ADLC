# Evidence Work — Glossary & Confidence Gate Detail

Ratified definitions. These are structural, not marketing language — don't paraphrase them into
something looser when explaining them to someone.

## Core terms

**Evidence Work** — The continuous discipline of reducing product uncertainty through measurable
signal. Governs when additional investment is justified. Produces confidence, not documentation.

**Confidence** — The degree to which uncertainty around a capability has been reduced through
validated signal. Earned through evidence, never inferred from documentation or alignment alone.
Confidence is a qualitative judgment informed by evidence, not a numerical score.

**Confidence Threshold** — A predefined level of validated signal required to justify increased
investment or promotion to a higher commitment state. Thresholds are explicit and recorded, and
scale with irreversibility: the more irreversible the next step, the stronger the required
signal.

**Commitment State** — The level of irreversible investment applied to a capability: **Concept →
Validation → Commitment.** Commitment increases only when confidence thresholds are exceeded.
Capabilities may sit in different commitment states simultaneously — the initiative never moves
as one monolithic block.

- **Concept**: low investment, exploratory, reversible. Reduce high-impact uncertainty through
  minimal slices. No production hardening.
- **Validation**: moderate investment. Thin vertical slices test feasibility/viability in
  realistic conditions. Architecture stays adaptable.
- **Commitment**: high investment. Architecture hardened, operational obligations introduced,
  SLAs and governance apply. Irreversibility increases.

**Investment Intensity** — Relative level of production effort applied to a capability. Increases
as confidence increases; independent of time or phase.

**Capability** — A durable, production-grade system behavior derived from validated hypotheses.
Not synonymous with a feature — capabilities are outcomes, not interface elements.

**Hypothesis** — A testable assumption about value, usability, feasibility, viability, or
operational risk. Lives in the Evidence Backlog until validated or invalidated.

**Evidence Spike** — A time-boxed, instrumented slice designed to test a specific hypothesis. Must
have defined success criteria, generate measurable signal, be disposable unless promoted. Must
not be production-hardened prematurely or introduce unnecessary irreversible dependencies.

**Evidence Ledger** — The structured record of assumptions, signals, decisions, and confidence
state. Conceptual — tooling may vary, but if it reduces uncertainty, it belongs here.

## Dual Backlog Discipline

**Evidence Backlog** — Hypotheses, experiments, spikes, prototypes, instrumentation work.
Exploratory and non-production. Applies when confidence is below threshold, core assumptions are
unresolved, or investment is exploratory.

**Commitment Backlog** — Scoped production capabilities, hardening work, integrations,
release-bound items. Reflects earned commitment. Applies when confidence threshold is exceeded,
risk is materially reduced, and a promotion decision is recorded.

Both backlogs run concurrently. Work never transfers automatically between them — promotion is
explicit (see Promotion Protocol below), never silent.

**Promotion Protocol** — The explicit process by which a capability moves from Evidence to
Commitment. Requires: confidence threshold exceeded → decision recorded → assumption status
updated (Validated / Invalidated / Conditional) → commitment backlog work created. Never
automatic. A validated hypothesis becomes a scoped epic with defined acceptance criteria and
operational obligations — not production by default. Spike code must be explicitly assessed:
harden, refactor, or rewrite.

## What belongs in Evidence Mode (and what doesn't)

Governing question: *if this assumption is wrong, does it materially affect irreversible
investment?* If yes → Evidence Mode. If no → normal planning/delivery.

**Must enter Evidence Mode**: collapse-level risk, architectural impact, cost-structure impact,
timeline impact, hard-to-reverse decisions, technical uncertainty, behavioral uncertainty.

**Does NOT belong in Evidence Mode**: operational alignment (kickoff logistics, stakeholder
mapping, status tracking, RACI), known/low-risk engineering (standard auth flows, CRUD
dashboards, established infra patterns), narrative/concept framing (vision statements, journey
maps, architecture brainstorming) — narrative only becomes Evidence when it produces a testable
assumption.

Slice qualification filter — before creating a slice, classify the assumption:
- **A.** Unknown and expensive if wrong → requires immediate slicing.
- **B.** Unknown but cheap to reverse → can be deferred.
- **C.** Known and low risk → belongs directly in delivery, no slice needed.

## Full Confidence Gate Guidelines

Principled guidance, intentionally non-formulaic — confidence is judgment informed by evidence,
not a score.

**Core principle**: promotion between commitment states occurs when uncertainty has been
sufficiently reduced *relative to the investment being introduced.* Thresholds are proportional
to irreversibility.

### Concept → Validation
Move when substantially met:
1. The core problem is clearly defined in behavioral/operational terms (not hypothetical).
2. A high-risk assumption is explicit and measurable.
3. Success criteria are defined in observable terms.
4. A realistic test path exists (a thin slice/prototype can generate meaningful signal).
5. Irreversibility remains low — no architectural hardening or operational commitments yet.

Does NOT require: MVP scope definition, full roadmap clarity, production architecture
commitment, or organizational alignment across all stakeholders.

### Validation → Commitment
Move when substantially met:
1. Measurable signal exists — real-world data, not just directional feedback.
2. Feasibility has been demonstrated by a working slice within known constraints.
3. Secondary risks surfaced during testing are documented and bounded.
4. Success metrics can transition into production KPIs.
5. The cost of being wrong is acceptable relative to the investment being introduced.
6. The promotion decision is explicitly recorded — never assumed.

This transition introduces materially more irreversibility, so the burden of evidence is higher
than Concept → Validation.

### Commitment → Expanded Scale
As capabilities scale within Commitment: architecture hardening, operational obligations, SLA
commitments, and financial exposure all increase. Expanding requires stable performance under
load, measurable adoption, monitoring in place, and assigned operational ownership.

### What confidence is NOT
Agreement in a workshop. Stakeholder enthusiasm. Executive pressure. Roadmap urgency.
Documentation completeness. Time elapsed. — None of these move confidence. Only signal does.

### Judgment and authority
Confidence evaluation is cross-functional, but: product leadership governs uncertainty
prioritization; engineering leadership governs feasibility confidence; delivery leadership
governs gate discipline. If commercial pressure conflicts with a confidence threshold,
operational discipline governs — not the deadline.

## Jira structure (if the output is headed into tickets)

Capability (Epic) → Risk (documented in Epic description, not its own ticket) → Assumption
(primary Jira work item — testable, declarative) → Slice (subtask — one assumption, minimal,
instrumented). We do not create tickets for Risks directly; we create tickets for Assumptions
derived from Risks. Multiple slices can test one assumption, but each slice stays targeted to
that one assumption.
