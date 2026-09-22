# Risk qualification scorecard

Paper test of every row in `data/register.csv` (51 rows). Date: 2026-09-22.

This file is **not** the register. It does not change Collapse, Uncertainty, Status, or Client view. Confirmation is a PR merge, not a chat message.

## The test 

1. **Uncertainty with consequence** — Are we behaving as if X is true without having proven it? If it is just work to do → task, not a risk.
2. **Material consequence** — If wrong, does it collapse a capability, force a rebuild, move cost in a real way, or get expensive to undo? If no → normal planning, not Evidence Mode.
3. **Category** — Value, Usability, Feasibility, Viability, or Operational. Cannot place it → not framed, or several risks stacked.
4. **Testability** — Can it be a clear claim with a visible pass/fail, checked by a thin slice? If you cannot say what "wrong" looks like → refine before assessing.
5. **Slice cost (A / B / C)** — Unknown and expensive if wrong → gating risk, attack now. Unknown and cheap to undo → real, but can wait. Known and low risk → not a risk, just delivery.

Source of the wording: register Risk column. Notes are the agent's read of that text. Status on every row is still `Undefined`.

## Counts

| Call | n |
|---|---|
| Holds as a risk | 34 |
| Not a risk | 4 |
| Too large (stacked) | 5 |
| Too small (symptom, duplicate, or cheap to undo) | 8 |

## Scorecard

| ID | Gate | Type | Call | Note |
|---|---|---|---|---|
| H1 | Run | Operational | Holds | Handoff loss is material and testable. |
| H2 | Run | Operational | Too large | Same mechanism as H1. Keep one. |
| H3 | Sell | Value | Holds | Scope/price without a confidence basis. |
| H4 | Run | Operational | Not a risk | Can be a definition (when start is). Not an unproven X we are already acting on. |
| D1 | Run | Usability | Holds | Narrative vs testable claim. Attack-shaped. |
| D2 | Run | Operational | Too small | Mostly follows if D1 and D3 hold. |
| D3 | Run | Operational | Holds | Time vs dropped uncertainty. |
| D4 | Run | Usability | Holds | Unbounded discovery is a real failure mode. |
| D5 | Sell | Value | Holds | Client wants "discovery done"; the method does not. |
| D6 | Run | Feasibility | Holds | Engineering missing from discovery. |
| B1 | Run | Feasibility | Holds | Many claims in one test. False confidence. |
| B2 | Run | Feasibility | Holds | No reliability floor on agent steps. |
| B3 | Run | Feasibility | Holds | No human review before agent work advances. |
| B4 | Run | Operational | Holds | Spike hardened before confidence is earned. |
| B5 | Run | Operational | Holds | No line between evidence-build and commitment-build. |
| B6 | Scale | Feasibility | Holds | Unstandardized agent tooling. Real at Scale; not the Define gate. |
| B7 | Run | Usability | Holds | Polish read as a decision. |
| B8 | Run | Feasibility | Too large | "A traditional step" is many steps. Name one per slice. |
| R1 | Run | Operational | Holds | Signal not set before the slice runs. |
| R2 | Run | Operational | Holds | Gate with no explicit decision. |
| R3 | Run | Operational | Holds | Confidence not recorded. |
| R4 | Run | Usability | Too small | Calendar reviews are how R2 fails. Symptom. |
| R5 | Run | Operational | Holds | No owner; gates skipped under pressure. |
| R6 | Run | Value | Holds | Stop not allowed; failed claims get promoted. |
| L1 | Scale | Operational | Holds | Learning dies with the engagement. |
| L2 | Scale | Operational | Too small | Cheap to undo: write the rationale. Defer. |
| L3 | Scale | Value | Too small | Firm-level "the method learns." Not engagement collapse. Defer. |
| L4 | Support | Operational | Holds | Handoff is docs, not the evidence layer. |
| T1 | Scale | Operational | Holds | No live store; evidence scatters. |
| T2 | Scale | Operational | Too small | Manual capture is the cheap face of T1. |
| T3 | Scale | Operational | Holds | Captured evidence not usable at decision time. |
| T4 | Scale | Value | Not a risk | Manual artifacts eating time is delivery work, not a capability collapse. |
| RC1 | Scale | Usability | Holds | Method only runs when person X enforces it. |
| RC2 | Scale | Operational | Too large | Same ownership risk as RC1. Keep one. |
| RC3 | Run | Operational | Not a risk | Channels / translator PM is alignment, not Evidence Mode. |
| RC4 | Scale | Usability | Too small | Shared words are a slice of RC5, not a second risk. |
| G1 | Sell | Value | Holds | No progress surface; stakeholders pull a Gantt back. |
| G2 | Sell | Operational | Too large | Same commercial object as CA1. Keep CA1. |
| G3 | Sell | Value | Holds | Deliverables cannot show proven vs still open. |
| G4 | Sell | Value | Holds | Value only if the client adopts the method. |
| M1 | Define | Value | Holds | Swap/kill: is ADLC a new object? |
| M2 | Define | Usability | Too small | Word "lifecycle" is a cut of M6 (breaks not legible vs SDLC). |
| M3 | Define | Operational | Holds | Seam vs Fabric not assignable. |
| M4 | Scale | Operational | Not a risk | Collapse is already Low. Instrumenting the pilot is a task. |
| FN1 | Scale | Operational | Holds | No token/cost budget; margin burns before slices finish. |
| CA1 | Sell | Value | Holds | Fixed SOW vs evidence-gated delivery. |
| D7 | Support | Operational | Too large | Register already says cluster: Day-2, drift, injection, evals. Split. |
| M5 | Define | Value | Holds | Value in the model vs the wrapper. Different test from M1 if the slice stays "which would you keep." |
| G5 | Define | Value | Too small | Row points at the progress-surface problem. That is G1. |
| M6 | Define | Usability | Holds | Under pressure, teams fall back to SDLC. |
| RC5 | Define | Usability | Holds | People cannot make the gate judgment; the method gets skipped. |

## Flagged IDs (read these first)

- **Not a risk:** H4, T4, RC3, M4
- **Too large:** H2, B8, G2, RC2, D7
- **Too small:** D2, R4, L2, L3, T2, RC4, M2, G5

Define drafts already in play: M1, M3, M5, RC5, M6 hold. M2 and G5 are the ones on that batch that this scorecard would drop or fold.
