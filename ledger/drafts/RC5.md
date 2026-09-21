# RC5 — Confidence-gating requires judgment calls teams aren't equipped to make

## Risk
Statement: Confidence-gating requires judgment calls teams aren't equipped to make. The discipline collapses into guesswork or gets skipped entirely.
Category: Usability
Gate: Define
Area: Roles & Comms

## Assumption(s)
### A1
Statement: We believe that three people who have not been trained beyond the glossary's Concept → Validation and Validation → Commitment lists, given one completed draft with a filled Signal Result, will independently pick the same Promote / Iterate / Pivot / Stop as a pre-written answer key and will not skip the Decision line.
Success criteria: 3 of 3 match the answer key on Decision, and all three fill Decision (none leave it blank or write "LGTM" / "ship it" without a gate name).
Failure criteria: Any one of three disagrees with the key, leaves Decision blank, or chooses Promote while citing time pressure or stakeholder enthusiasm (glossary: not signal).

## Slice(s)
### S1 (tests A1)
Method: Prepare one worked example file cloned from a ledger draft shape with a fictional-but-numeric Signal Result written in advance, plus a sealed answer key written by one person who will not be a judge. Three other people get glossary section "Full Confidence Gate Guidelines" only (not a class). They mark Decision and which gate they think they are in. Compare to the key. Do not use a live client decision as the sample.
Type: Usability
Execution: Requires manual run
Scope / time-box: n=3 judges + 1 key author; 20 minutes; example file discarded after scoring unless reviewers keep it as a training fixture.

## Signal
Success signal: 3/3 Decision match to key; zero skips; zero Promote-from-enthusiasm rationales.
Failure signal: Any mismatch, skip, or enthusiasm/time rationale for Promote.
Threshold: Failure → Iterate enablement (who is allowed to decide, or a thinner decision aid) before requiring confidence-gating in delivery. Success → untrained-beyond-glossary judges can apply the gates on paper; that is not proof they will do it under commercial pressure (do not bundle that into S1).
Result: _pending — not yet run_

## Confidence & Decision
Current confidence: _pending signal_
Suggested read: Agent suggestion — not a decision: Low / undefined; this slice tests whether the written gates are usable, not whether this engagement's owners will actually pause.
Decision: _awaiting human review_

## Status
`draft`
