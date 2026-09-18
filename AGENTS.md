# Agent instructions

Standing goal and repo rules: **[AGENT_BRIEF.md](./AGENT_BRIEF.md)**. This is always on.

- Work milestones **one PR at a time**. Do not bundle.
- Do not overbuild. The overbuild line in `AGENT_BRIEF.md` is a hard stop.
- `data/register.csv` is the single source of truth. Never invent, reword, re-score, or add risks.
- `capability-model` stays its own repo (reference by contract URL, never merge).
- This repo co-locates three objects for the pilot only: a start-guardrail *method*, iteration-one *live-state* (the register **is** the data model), and a client *surface of sight* (not action). Do not build a write or decision-capture layer.
- Keep it one repo until a split trigger fires: a second engagement (live-state leaves) or a real client seeing the surface (client surface leaves).
- Iteration one tests that evidence stays in the one source — not that the UI renders.

Before any change, read `AGENT_BRIEF.md` in full.
