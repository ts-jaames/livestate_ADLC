# Footing (PROVISIONAL)

This file is **doctrine, not a second source of truth**. Row values live only in
`data/register.csv`. Footing is a **reading of that register**. It is
**PROVISIONAL** — render it; do not enshrine it. The owner may replace this
rubric.

## What it is

Footing is the ground under the next increment of commitment: whether earned
confidence keeps pace with the irreversibility being taken on.

## v1 scope

The gating set is every register row where:

- `Gate` equals the current gate in `data/next_gate.json` (`gate`)
- `Client view = Y`

Scoring (Collapse × Uncertainty) orders that set. It does not choose membership.
A high-scoring row on a gate that is not in reach stays out.

Do not invent gate membership. Empty-with-integrity is correct if no client-view
rows sit on the current gate.

## What counts

- Only `Status = Validated` or `Status = Committed` counts toward footing.
- `In test` is **momentum**, reported separately. It does not raise the %.
- `Undefined` and `Parked` do not count.
- Do not re-score, reword, or add rows here.

## Weighted % (provisional, equal weights)

Each gating row has equal weight `1`.

```
footing % = 100 × (count of gating rows that are Validated or Committed)
                 / (count of gating rows)
```

If the gating set is empty, footing is **No footing / 0%**. Do not invent
risks to fill it.

## Band ladder

| Band | When |
| --- | --- |
| **No footing** | % = 0 and no gating row is `In test` |
| **Testing** | % = 0 and at least one gating row is `In test` (momentum only) |
| **Partial** | 0 < % < 100 |
| **Load-bearing** | % = 100 |

Honest empty: **No footing / 0%** is muted, never an alarm.

## Over time

`data/footing_history.csv` is the trajectory (date, %). At day zero there is
one point at 0%. Do not fabricate a series.
