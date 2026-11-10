# Project Notes

## Git / Workflow
- Work directly on `main` and push everything to `main` (no feature branches/PRs).
  - Note: local branch is currently `master`; will need to align with `main`.
- GitHub Pages will be turned on (by Matt) using GitHub Actions as the source, so we can build and view a website later if needed.

## Project Purpose
- Build **physical modeling simulators of mushroom growth** and related mushroom processes.
- There are many kinds of mushrooms, so we may need to model different species/types.
- Aim for detailed simulation, like a 3D physical simulator of anything else. Analogies Matt gave:
  - A physical model of a tuning fork that produces sound.
  - Sam's "Watertownies" repo, a SimCity-style simulation of the city of Watertown. (Possible reference for approach/style; look at it later.)
- Focus: model mushroom growth processes and mushroom processes in depth.

## Scoping: "Orders of Magnitude" Concept
- Matt will provide context to help decide **how much computational effort** to put in.
- We'll use an **orders of magnitude** framing to scale effort and detail (details to come).
- Matt will list many things he wants; collect them here before planning.
- **Source:** borrowed from the `style` repo (`../style`, StyleVoyager). That repo got it from DemoVoyager's `magnitude/` idea: one subject, several size limits, each step adding what can be expressed.
- Tier limits used in `style` (bytes of source per tier):

  | Tier | Limit | What the size buys (style repo's framing) |
  |---|---|---|
  | 4K | 4,096 B | The single core trick, one self-contained file |
  | 40K | 40,960 B | Several mechanisms, real parameters, variation by seed |
  | 400K | 409,600 B | Libraries of components, richer synthesis, many seeds |
  | 4M | 4,194,304 B | Embedded reference data / asset banks, maybe a small learned piece |
  | 40M | 41,943,040 B | Room for a small model or large data; closest emulation |

  - In `style`, each tier is a self-contained, seedable generator. Tiers are built from 4K up, and each reuses ideas from the one below. A build script checks each tier against its byte limit.
  - The Rust version (`voyager-rs/src/tiers/`) has one source file per tier, a `limit` constant, and a list of the files counted against it.
- **Apply here:** the same ladder for **growing simulated mushroom substrates**. Each tier is a mushroom-growth simulator capped at that code size. What each tier means for mushrooms is still to be decided.

## Future: Worldbuilder Connection (fun idea, think ahead)
- Matt's **Worldbuilder** repo (`../Worldbuilder`) is a procedurally generated globe built with Three.js and Vite. You can fly around it, explore and build on it. It's self-hosted on Coolify via Docker.
- This repo stays **separate** (digital mushroom substrates). At some point, though, connect it to Worldbuilder to create a **mushroom network across the entire world**.
- Research in this repo should build up knowledge of **many kinds of mushrooms**. Later, place as many individuals of those kinds as possible across the globe, so there are different kinds of mushrooms everywhere.
- It must be **lightweight** in Worldbuilder: it must not slow the world down or add much computational cost.
- Implications to keep in mind now:
  - Keep species data in a clean, portable format (e.g. JSON) that Worldbuilder could import.
  - Probably needs a cheap "low tier" representation for the globe (placement + simple visuals/growth), separate from the heavy simulators here.
  - Placement could depend on species habitat (climate, biome, substrate), mapped to Worldbuilder's terrain or biomes.
- Not in scope yet. Just design so it's possible later.

## Simulation Ambition
- Build **process descriptions and simulations that are as detailed as possible**. Real time where we can.
- Subjects: **mushroom networks** and **different kinds of mycelial networks**, not just fruiting bodies.

## Future: Sonification / "What does the network sound like?"
- Later goal: be able to **audio record what these networks hypothetically sound like**.
- Possible routes:
  1. **Physical sound:** some modeled processes might actually emit sound, if they're simulated in a pretend physical environment that we can "record" from. (Unknown whether this is real; worth researching.)
  2. **Amplification:** take the real frequencies of processes and make them loud enough to hear.
  3. **Time-scaling:** speed processes up (or shift them) so their frequencies fall in the audible range (~20 Hz–20 kHz).
- **Requirement for now:** once the substrates are built, they must be **parameterized** with exposed time series, rates, frequencies and physical quantities. That way the audio work can tap into them later without rewriting the simulators.
- Design implications to keep in mind:
  - Simulators should log or stream state variables over time (growth-front speed, branching events, nutrient/water flow, electrical spiking, etc.) with known time units.
  - Keep sim time separate from wall-clock time so the speed-up factors are explicit.
  - Possible later research: fungal electrical spiking, hydraulic/cytoplasmic flow pulses, and acoustic emissions from hyphal growth.

## Future: SynthLand "Mushroom" Plugin (very experimental)
- Matt's **SynthLand** project (`../SynthLandExplorer`, with web build in `../SynthLandWeb` and app in `../synthland-studio`) is a family of GPLv3 synth/reverb plugins. Each is written once in plain C++ and shipped as VST3/AU, WebAssembly and standalone. Every preset parameter is a host parameter and every preset is a JSON file.
- Idea: a **mushroom sound plugin**. It loads one of our digital mycelial-network simulations, and that simulation **becomes the plugin's sound engine**.
- Later work, not now. Design implications to keep in mind:
  - Simulation state should be exportable or loadable (a saved network or seed + parameters as JSON, matching SynthLand's preset style).
  - A port of the core sim to C++ (or another engine that compiles to WASM) may eventually be needed to run inside a plugin. Keep the core model separable from rendering/UI.
  - Simulation parameters should map cleanly onto plugin/host parameters.
  - Ties into the sonification section above: the plugin is one way to hear the networks.

## Current Focus (what to do first)
- **Physical modeling of mycelial networks**, with **different kinds of networks for different mushroom types**.
- Worldbuilder, sonification and the SynthLand plugin are all later. Design for them, don't build them yet.

## Research Mandate
- Do **as much in-depth research as possible** about mushrooms:
  - how they grow (spore → germination → hyphae → mycelium → primordia → fruiting body)
  - what is known about their networks (structure, branching, fusion/anastomosis, transport, signaling, mycorrhizal networks)
  - differences between species and types (growth forms, substrates, habitats)
  - everything needed to build **as detailed a simulation as possible** for all the aims above
- Research results should feed a species database (also needed for Worldbuilder placement) and the simulator models.

## Guardrails
- **Size cap:** no individual mushroom substrate goes beyond **4 MB** for now (so the ladder is 4K / 40K / 400K / 4M; no 40M tier).
- **Species cap:** at most **100 different types of mushrooms**, even if research turns up thousands. Research decides the actual number and which ones.
- The approach must be **computationally tractable**; research should work out how.

## Decisions (2026-11-09, Matt's answers to scoping questions)
- **Structure:** shared engines + species data. One engine per tier; each mushroom type is a parameter file any engine can load.
- **Stack:** plain browser JavaScript, canvas/WebGL, no build step, on GitHub Pages. Core model kept separate from drawing.
- **Scope:** all four: mycelial network growth, transport and signaling, fruiting bodies, environment and substrate.
- **Visuals:** 2D at 4K and 40K; 3D at 400K and 4M.

## Plan
- The comprehensive plan is in [docs/PLAN.md](docs/PLAN.md).

## Decisions (2026-11-09, after the first research pass; Matt: "go with your recommendations")
- **Next step:** write the model specification and build the 4K engine now; fill research gaps later.
- **Flagship six:** keep the survey's proposal: *Coprinopsis cinerea*, *Pleurotus ostreatus*, *Phanerochaete velutina*, *Armillaria gallica*, *Laccaria bicolor*, *Serpula lacrymans*. *Suillus luteus* and *Marasmius oreades* are first in the second tier, so the long-distance mycorrhizal and fairy-ring families still get early attention.
- ***Psilocybe cubensis*:** stays. It is there as a well-documented tropical dung species, and the site only simulates mycelium.
- **Slots:** hold back about 10 of the 100 for later additions (the survey's ten weakest go to the bench).
- **Network families:** the merged 12 in [docs/research/README.md](docs/research/README.md).

## Papers supplied (2026-11-09)
- Matt put five PDFs in `docs/papers/`: Boswell 2002, 2003, 2007 (file `boswell2006.pdf`), Hopkins & Boswell 2012, and Fricker et al. 2017.
- They are copyrighted, so `docs/papers/` is git-ignored and stays local. The repo is public.
- The Boswell equations are now checked: [docs/research/09-boswell-check.md](docs/research/09-boswell-check.md).
- Fricker 2017 still needs a full read before the 40K engine is tuned.

## 40K engine built (2026-11-09)
- `engines/40k/`: a lattice-free graph model with seven species, five worlds, flow, cord thickening, pruning and fruiting sites. About 20 KB of the 41 KB limit.
- Its limits are listed under "What it honestly is not" in [docs/MODEL.md](docs/MODEL.md) section 4. The biggest: flow ignores loops, and most coefficients are tuning values.
- Fricker 2017 has been read in full: [docs/research/10-fricker-2017.md](docs/research/10-fricker-2017.md).

## Full build (2026-11-09)
- All four engines are built: 4K (bitmap), 40K (2D graph), 400K (3D block of soil, in a worker, WebGL), 4M (2.56 m plot over years, with sound).
- 90 species in 12 families; 10 slots held back. Only 21 species set any growth value of their own.
- Site: species browser, side-by-side page, and `data/worldbuilder.json` (26 KB) for the Worldbuilder globe.
- Each engine's honest limits are in [docs/MODEL.md](docs/MODEL.md) under "What it honestly is not".
- Not done from the plan: tip-swarm fruiting bodies, a calibration page against measurements, a C++ port for SynthLand.

## Calibration (2026-11-09)
- `tools/calibrate.js` compares the engines with 24 published measurements; the site shows it at `calibration.html`.
- 21 of 24 within range after fitting, but only 4 had nothing tuned to them (3 pass). Details and what changed: [docs/CALIBRATION.md](docs/CALIBRATION.md).

## Sound, first version (2026-11-09)
- Recorder, synthesiser and a listening page (`listen.html`). Three layers: electrode voltages played as sound, growth events as short sounds, and a drone that follows flow.
- Two clocks, two stated speed-ups; recordings stay unscaled. Details: [docs/SOUND.md](docs/SOUND.md).
- Not yet listened to by anyone. Next layer would be a resonator built from the network's structure.

## Sound: the resonator (2026-11-09)
- Fourth layer: the network as a web of taut strings, struck by its own growth events. Notes come from its real size, shape and cord thickness; nothing is sped up. Real hyphae are too damped to ring, so the ring time is a choice.
- The possible mappings (sources, targets, four ways to combine them) are listed in [docs/SOUND.md](docs/SOUND.md).

## Sound: four ways of listening (2026-11-09)
- Built all four: as it is faster, the fungus plays itself, data by ear, and music; plus the free mix. Chosen on the listening page or with `--way` in `tools/render-audio.js`.
- A second individual can be recorded with the first; the data way gives each its own voice.

## Sound rule (2026-11-09, Matt)
- **All sounds must come from physical modelling.** No sound is assigned to an event. Matt rejected the event ticks, drone, data voices and music; they were removed.
- A sound exists only if there is a body that can vibrate, a force the simulation says acted on it, and a microphone. Current bodies: the network as taut strings, and each cap as a plate. Current forces: growth, electrical spikes (assumed pressure pulse), spores leaving, rain.
- Details and what is still not physical: [docs/SOUND.md](docs/SOUND.md).

## Wavetables (2026-11-09, Matt's idea)
- The voltage between two points on the network as a morphing wavetable: built as `wavetable.html`, `sound/wavetable.js` and `tools/make-wavetable.js`.
- 64 frames of 2,048 samples, one cycle per stage of growth; same shape as SynthLand's wavetable engine. Exports WAV (Serum, Vital, Ableton) and harmonics JSON.
- Kept separate from the physical-modelling sound, since it uses the voltage directly as an oscillator shape.

## Plugin platform (2026-11-09)
- Matt asked for a small exploratory plugin platform for the web, like SynthLand Explorer but built on the mushroom models: many sonifying approaches as adjustable synths, each with its own page, a library page, species as presets.
- His answers: sounds are allowed if every control is **traceable** to a mushroom process (this relaxes the earlier physical-modelling-only rule for the platform; each plugin is labelled physical model, model signal or model as modulator); families are instruments, atmospheres and effects (not rhythm); hybrid of prebuilt specimens and live engines; on-screen keys, computer keys and Web MIDI.
- Plan with a 22-plugin catalogue: [docs/PLUGINS.md](docs/PLUGINS.md).
- Batch A built: the kit, 90 baked specimens, the library page, and Hyphal Harp, Rain on Caps and Mycelium Reverb.

## Composers, and the overnight build (2026-11-09 to 10)
- Matt asked for a compositional plugin type: ideas from mushroom processes that play the sound engines, so the fungus plays itself; at least five, each emphasising a different aspect. Six are built (Spike Canon, Hyphal Walk, Tip Chorus, Growth Form, Season Cycle, Spore Scatter), plus Cap Drums as a second instrument for them to play.
- Matt then said: build **all** the planned plugins overnight, on Claude's own recommendations, and **stop if only 10% of usage is left** (weekly usage was 67% at that point; stop at 90%).
- How a plugin is put together, for whoever continues: a folder in `plugins/` with `dsp.js` (`create(sampleRate)` -> `load, set, noteOn, noteOff, process(L, R, input), view`; composers have `advance(frames)` returning note events instead of `process`), `def.js` (the declaration: params with `trace` and `standing`, `draw`), `plugin.js` (`start(def)`), `worklet.js` (`register` or `registerComposer`), `index.html` (copy any). Add it to `plugins/plugins.json` with `"built": true`; instruments also go in `plugins/kit/instruments.js` and `playable.js`. Check with `node tools/test-plugins.js`.
- **Finished (2026-11-10): all 28 plugins are built.** Last three: Forest Floor and Foraging run the 400K engine live beside the sound (`plugins/kit/live-worker.js`); Combat Zone uses two prebuilt specimens and a second species menu.
- Claude's own choices in the last batch: the live plugins sound 3.3 times lower than real size by default (a young network's lowest note is about 9 kHz at real size); a live colony is restarted when the block fills or growth stops; Foraging's low tone assumes that flow through cords pushes on them.
- Checked: `node tools/test-plugins.js` renders every plugin offline; every page was loaded and sound turned on in a browser with no errors. **Not checked: nobody has listened to any of it.** MIDI, the microphone and dropped files are untested.
