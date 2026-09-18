# Scoring scales

Static rubric for the three scored fields on each register row, and how
`Priority cue` is derived from them.

This file records **only** what the data contract already states
(`AGENT_BRIEF.md` → Data contract) plus the `Priority cue` strings that
already appear in `data/register.csv`. It does not invent a scoring system,
cue names, or field definitions.

It is **doctrine, not a second source of truth**. Row values live only in
`data/register.csv`. This file does not override, re-score, or fill any cell.

## Collapse / Uncertainty / Test effort

Each field is scored on the same three-point scale. Allowed values, as
written in the register:

`Low` · `Medium` · `High`

No other grades are in the contract. This file does not define the meaning of
the three field names; semantic definitions are owner-dropped doctrine in
this folder, not invented here.

## Priority cue (derived)

`Priority cue` is derived from those three scores. The data contract states
exactly two derivation rules:

| When | Priority cue |
| --- | --- |
| Collapse = High **and** Uncertainty = High | `Attack first` |
| Collapse = High **and** Uncertainty = High **and** Test effort = High | `Cluster - decompose` |

All-three-High is a subset of High collapse + High uncertainty. The more
specific contracted rule (`Cluster - decompose`) applies in that case.

Views should recompute the cue from these rules rather than treating a stale
cell as independent truth. That recompute belongs in the views (M3+), not
here. This file does **not** invent further derivation rules.

## Cue names as they appear in the register

Current `data/register.csv` contains these `Priority cue` values, documented
as written (including blank). No new names are introduced.

| Value in the cell | In the contract? | In the current register? |
| --- | --- | --- |
| `Attack first` | Yes — High collapse + High uncertainty | Yes |
| `Cluster - decompose` | Yes — all three High | No. No current row has Collapse, Uncertainty, and Test effort all High. |
| `Watch / manage` | Not stated | Yes |
| _(empty)_ | Not stated | Yes. Empty is a real cell value, not a gap to fill. |

`Watch / manage` and empty have **no contracted derivation**. They are
documented because they appear in the register. Do not back-fill empty cells.
Do not re-score any row. Do not mint a name for the empty cell.

## What this file is not

- Not a register, risk list, or place to add columns
- Not a write / decision-capture layer
- Not capability-model data
- Not live-state or spot wiring
