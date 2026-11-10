# Mushroom Substrate: rules for sessions

Physical simulators of fungal growth. Read [docs/PLAN.md](docs/PLAN.md) first; Matt's running
notes are in [notes.md](notes.md).

## Workflow

- Work on `main` and push to `main`. No feature branches or pull requests.
- GitHub Pages is built by `.github/workflows/pages.yml` on every push. The build fails if a tier
  is over its byte limit.
- Before pushing: `node tools/pack.js`, `node tools/check.js`, `node tools/test.js`. If a core's
  behaviour changed on purpose, `node tools/test.js --update` rewrites the stored hashes.
- No `Math.sin`, `Math.cos`, `Math.exp` or `Math.pow` in a core (not bit-identical across
  browsers). See docs/MODEL.md section 1.

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
| `docs/papers/` | Local copies of copyrighted papers. Git-ignored; never commit or publish them |
| `species/` | `schema.json`, `families/*.json`, one `<slug>.json` per species |
| `engines/4k` `40k` `400k` `4m` | One engine each: `core.js`, `view.js`, `index.html` |
| `tools/check.js` | Byte limits, and that every species value has a valid basis |
| `tools/pack.js` | Writes each engine's packed species files from `species/` |
| `tools/test.js` | Repeatability (stored hashes in `tools/hashes.json`) and speed |
| `tools/calibrate.js` | Runs the engines against published measurements; writes `docs/calibration/results.json`. Run by hand after changing an engine or a species |
| `tools/export.js` | Writes the site's data files, including the Worldbuilder pack |
| `tools/build-site.js` | Assembles `_site/` for Pages |
| `sound/` | `record.js` (records an engine run, unscaled), `resonator.js` (the network's modes as taut strings), `synth.js` (recording to audio, physical models only), `wavetable.js` and `wt-worklet.js` (wavetables from electrode voltage; not physical modelling, kept separate), `worker.js`. `sound/renders/` is git-ignored |
| `tools/render-audio.js` | Renders a species to a WAV from the command line |
| `tools/make-wavetable.js` | Cuts a 64 x 2,048 wavetable from a species' electrical activity |
| `site/` | Landing page and, later, the species browser and comparison pages |
