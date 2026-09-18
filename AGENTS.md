# Agent instructions

Standing goal and repo rules: **[AGENT_BRIEF.md](./AGENT_BRIEF.md)**. This is always on.

- Work milestones **one PR at a time**. Do not bundle.
- Do not overbuild. The overbuild line in `AGENT_BRIEF.md` is a hard stop.
- `data/register.csv` is the single source of truth. Never invent, reword, re-score, or add risks.
- `capability-model` stays its own repo (reference by contract URL, never merge). `live-state` and `spot` are direction only — do not wire.

Before any change, read `AGENT_BRIEF.md` in full.
