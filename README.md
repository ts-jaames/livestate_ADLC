# sparqos-evidence

The Evidence Work engagement kit + its client-facing progress experience, built on a single
source of truth. One object, one altitude.

- `data/register.csv` — canonical risk register (the source of truth)
- `rules/` — scoring rubric and definitions
- `internal/index.html` — internal risk-log view (read/filter/sort)
- `index.html` — client experience (confidence progress board)
- `sparqos.repos.yaml` — manifest of SparqOS repos and what each owns
- `AGENT_BRIEF.md` — build rules + standing goal (pin as a Cursor Custom Mode)

**Rule:** views read from `data/register.csv`. Change the data, every view updates.
Nothing is fabricated; every rendered item traces to a register `ID`.
