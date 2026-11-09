# Mushroom Substrate: rules for sessions

Physical simulators of fungal growth. Read [docs/PLAN.md](docs/PLAN.md) first; Matt's running
notes are in [notes.md](notes.md).

## Workflow

- Work on `main` and push to `main`. No feature branches or pull requests.
- GitHub Pages is built by `.github/workflows/pages.yml` on every push. The build fails if a tier
  is over its byte limit.
- Before pushing: `node tools/check.js`.

## Rules

- **Byte limits.** A substrate is one engine plus one species. Everything in `engines/<tier>/`
  counts, plus the largest packed species file in `engines/<tier>/species/`. Limits: 4,096 /
  40,960 / 409,600 / 4,194,304 bytes. Nothing is loaded from a CDN. No tier above 4M.
- **Core and view are separate.** `core.js` is the model: no DOM, no drawing, runs in Node.
  `view.js` draws and handles controls.
- **Seeded and repeatable.** Same species, seed and settings give the same network. No
  `Math.random()` and no wall-clock time inside a core.
- **Real units.** Micrometres, seconds, and declared units for everything else. Sim time is
  separate from real time; the speed-up is one explicit number.
- **Every species value has a basis:** `sourced` (with a citation), `inferred` or `unknown`.
  Never fill a gap with a guess presented as fact.
- **At most 100 species.**
- **Output signals.** Engines publish named signals with units and a timestamped event stream,
  so the later sound work can use them.

## Layout

| Path | What it holds |
|---|---|
| `docs/PLAN.md` | The plan |
| `docs/MODEL.md` | The model specification (Phase 2) |
| `docs/research/` | Research write-ups with sources |
| `species/` | `schema.json`, `families/*.json`, one `<slug>.json` per species |
| `engines/4k` `40k` `400k` `4m` | One engine each: `core.js`, `view.js`, `index.html` |
| `tools/check.js` | Byte limits (schema and repeatability checks to be added) |
| `tools/build-site.js` | Assembles `_site/` for Pages |
| `site/` | Landing page and, later, the species browser and comparison pages |
