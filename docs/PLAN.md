# Mushroom Substrate: Plan

Written 2026-11-09 from [notes.md](../notes.md) and Matt's answers to four scoping questions.

**Status of the science in this plan:** revised 2026-11-09 after the first research pass
([docs/research/README.md](research/README.md)). Sections 4, 5, 6 and 11 reflect it. That pass
was cut short by a search limit and has not been independently verified, so figures here are
still starting estimates unless the research reports tag them as sourced and read.

## 1. What we are building

Physical simulators of how fungi grow: mycelial networks first, then transport and signaling
inside them, the mushrooms they produce, and the substrate and environment around them. Up to
100 kinds of mushroom, each a research-backed data file. Four simulator engines of increasing
size (4K, 40K, 400K, 4M) that can each load any species.

Later, and designed for now but not built: sound from the networks, a SynthLand plugin whose
sound engine is a network, and a lightweight mushroom layer for the Worldbuilder globe.

## 2. Decisions already made

| Decision | Choice |
|---|---|
| Structure | Shared engines + species data. One engine per tier; each species is a parameter file |
| Stack | Plain browser JavaScript, canvas/WebGL, no build step, published on GitHub Pages |
| Scope | All four: network growth, transport and signaling, fruiting bodies, environment and substrate |
| Visuals | 4K and 40K are 2D; 400K and 4M are 3D |
| Size cap | Nothing above 4 MB. No 40M tier |
| Species cap | At most 100 |
| Git | Work on `main`, push to `main`. Pages built by GitHub Actions |

## 3. Rules

**The byte rule.** A "substrate" is one engine plus one species loaded into it. Everything the
browser downloads to run it counts: HTML, JavaScript, shaders, the species parameters, any
library, any data. No CDN, so nothing is hidden. Limits: 4,096 / 40,960 / 409,600 / 4,194,304
bytes. `tools/check.js` measures every engine with its largest species and fails if any is over.

Consequences worth knowing up front:

- The 400K tier cannot afford Three.js (roughly 700 KB or more), so its 3D is hand-written WebGL.
  The 4M tier can include Three.js.
- A full species file will not fit in 4K. A tool packs each species down to the fields each tier
  can read (a handful of numbers for 4K, the whole record for 4M). The packed form is what counts.

**Core and view are separate.** Every engine is `core.js` (the model: no DOM, no drawing, runs in
Node) and `view.js` (drawing and controls). This is what makes testing, benchmarking, the C++
port for SynthLand and the Worldbuilder export possible.

**Seeded and repeatable.** Same species + same seed + same settings gives the same network, on
every machine. A test hashes the network after N steps and compares.

**Real units.** The model runs in micrometres, seconds and moles (or declared stand-ins), with one
explicit number for how much faster than real time it is running. Nothing is "per frame".

**Every fact has a basis.** As in the `style` repo: each species parameter is marked `sourced`
(with a citation), `inferred` (from a related species or a general rule) or `unknown` (a default).

## 4. Making it computationally tractable

The real thing is far out of reach: a gram of forest soil holds somewhere between tens of metres and
kilometres of hyphae (the research reports disagree), each a few micrometres wide. The first version of this section was too optimistic; the
models research ([research/03-models.md](research/03-models.md)) corrected it. The rules now:

1. **Cap the tips.** Tip numbers grow exponentially if left alone. Every engine has branching
   that slows as local density rises, and tips that die or go dormant.
2. **Two graphs.** *Segments* hold geometry. *Links* are unbranched runs between junctions and
   hold width, flow and electrical state. Flow is solved on links only, which are far fewer.
   Where the network is a tree, flow is one pass from the tips inward with no solver; loops are
   handled by a warm-started iterative solve with a fixed number of iterations.
3. **The old network is not free.** Transport, recycling, signaling and drawing all run on it,
   so each has its own budget and update rate.
4. **Two clocks.** Substrate diffusion on a 100 µm grid needs steps of about 7 seconds, while a
   tip takes about 20 minutes to cross a cell. Fields step often and cheaply; tips step rarely.
5. **Coarse fields for the surroundings.** Nutrients, water, temperature and the "crowding"
   signal tips steer by live on a grid. Tips read the grid, which keeps steering linear in cost.
6. **Fusion.** A grid of buckets finds nearby hyphae. Steps are never longer than a cell. In 3D,
   lines never exactly meet, so fusion uses a capture radius, and a meeting becomes a fusion only
   with a species-set probability.
7. **Scale by representation, not by camera.** Small scenes are explicit hyphae. Large scenes
   are density fields plus an explicit graph of cords. Fine hyphae near the camera in a large
   scene are generated for display from the seed and never feed back into the model, so what you
   look at cannot change the result.
8. **Repeatability.** Worker results are applied at a fixed step lag, never "when they arrive".
   No GPU arithmetic in the model. No reliance on `Math.sin` or `Math.cos` matching across
   browsers (use tables or polynomials in the core).

**Size targets, estimates to be measured:**

| Tier | Size at interactive speed | Species parameters |
|---|---|---|
| 4K | up to about 20,000 tips on a 512 x 512 bitmap | about 8 numbers |
| 40K | 20,000 to 50,000 segments, 2,000 to 5,000 links | about 40 |
| 400K | 100,000 to 300,000 segments, up to 20,000 live tips | about 150 |
| 4M | fields plus a cord graph over a plot; display hyphae on top | whole record plus reference data |

## 5. What each tier models

Each tier is built from the one below and keeps everything it did.

**4K, 2D. The one trick: a network that grows like a fungus.**
No stored graph: tips move over a bitmap. They extend, branch at a species-set rate and angle
(more where there is more nutrient, less where it is crowded), steer away from occupied pixels,
and fuse when the pixel ahead is already occupied. One nutrient field that tips deplete. Output
signals: tip count, total length, branch and fusion events.

**40K, 2D. A colony in a patchy world.**
- A real graph (segments and links) with widths: links that carry flow thicken into cords,
  unused ones are recycled.
- Nutrient uptake, diffusion in the substrate, and movement of resources inside the network
  toward growing fronts.
- Patchy substrate: wood blocks, litter, bare soil. Moisture and temperature response curves per
  species.
- Foraging style per species (dense slow fronts versus sparse fast explorers).
- A life-stage clock: spore, germination, colony, primordia, fruiting, shown as simple 2D
  mushrooms where and when the network can afford them.
- A recorder for every output signal.

**400K, 3D. A volume of soil and wood with the physics inside the network.**
- Soil layers, buried wood, tree roots. Hand-written WebGL.
- Flow: pressure-driven movement of water and nutrients through the graph, solved as a network
  flow problem.
- Electrical activity as switchable modes (integrate-and-fire, an excitable-medium model, or a
  "voltage" derived from flow), tuned per species to published spike rates where they exist, and
  labelled as modelling disputed measurements.
- Mycorrhizal exchange with roots; saprotrophs decaying wood (and the wood changing as it goes).
- Two or more individuals meeting: fusion if compatible, combat zones if not.
- 3D fruiting bodies from a parametric shape per species (cap profile, stem, gills or pores,
  bracket, puffball, coral and so on), triggered by weather.
- A weather and season driver. Save and load a network as JSON. Worker thread.

**4M, 3D. The closest emulation.**
- Multi-scale: density fields plus an explicit cord graph are the model, over a plot with
  several trees and logs. Fine hyphae near the camera are display only.
- Fruiting bodies grown by a swarm of tips following a scheduled steering program (the one
  published route to mushroom shape), then expanded by water uptake.
- Spore release and dispersal as physical events (ballistic discharge, puffing, splash).
- Embedded reference data: measured growth curves and network statistics per species to tune
  against, and textures.
- Three.js allowed; WebGPU if it earns its place.
- Signals available at audio rate, as a first step toward the sound work.

## 6. Species: choosing up to 100

Fungi with mushrooms run to many thousands of species, so the 100 are chosen to cover the
*differences that change the simulation*, not to be a field guide. Research settles the list; the
selection grid is:

- **How it feeds:** wood decay (white rot, brown rot), litter and soil, dung, mycorrhizal partner
  of trees, parasite of trees, parasite of insects, farmed by insects (termites, leafcutter ants).
- **Network form:** dense mats, fairy rings, long cords and rhizomorphs (honey fungus), the
  mycorrhizal exploration types (contact, short, medium, long distance).
- **Fruiting form:** gilled, bolete, bracket, crust, puffball, earthstar, coral, jelly, morel,
  truffle, stinkhorn, bird's nest, cup.
- **Where it lives:** biome and climate, for Worldbuilder placement later.
- **How much is known:** well-studied lab and cultivated species (oyster, shiitake, button, ink
  cap, split gill, honey fungus) come first because their numbers can be sourced.

Research produced 12 **network families** (listed in [research/README.md](research/README.md)):
fast dung colony, confined wood decayer, short-range and long-range cord foragers, rhizomorph
system, fairy ring, litter mycelium, three mycorrhizal types, host-confined, and insect-tended.
Each species belongs to one family and inherits its defaults, which is what makes 100 species
affordable. The candidate list of 100 and a proposed flagship six are in
[research/08-species-survey.md](research/08-species-survey.md).

**Species file** (`species/<slug>.json`), in sections: identity and taxonomy; ecology and habitat
(substrates, hosts, biomes, season); hyphae (diameter, tip speed, branching rate and angle, fusion
behaviour); network (family, cord formation, foraging style); transport and electrical
parameters; fruiting (triggers, shape parameters, size, colour, spore release); environment
response curves; a `basis` and citation per field; and a small `lite` block for Worldbuilder.

**Depth by group:** about 6 flagship species tuned by hand against published measurements; about
24 with mostly sourced values; the rest mostly inherited from their family with the sourced
differences filled in. Each file says which it is.

## 7. Phases

Each phase ends with something visible on the Pages site and pushed to `main`.

**Phase 0. Repository setup.**
Rename `master` to `main`. Folder layout (below). Pages workflow. `tools/check.js` (byte limits,
schema validation, repeatability). A landing page. `CLAUDE.md` with the rules in section 3.

**Phase 1. Research.** Written up in `docs/research/`, each with sources:
1. Growth biology: spore to hypha to mycelium to primordium to mushroom; tip growth; branching;
   fusion.
2. Networks: measured structure, foraging strategies, cords and rhizomorphs, mycorrhizal
   networks, how networks remodel.
3. Existing mathematical and computer models of mycelium, and what each costs to run.
4. Transport and signaling: mass flow, translocation, electrical spiking (including how contested
   its interpretation is), chemical signals.
5. Fruiting: triggers, development, shape, spore release mechanics.
6. Environment: substrates, moisture, temperature, competition, hosts.
7. Sound and rhythm: whether any fungal process makes real sound, and the timescales of every
   rhythmic process (for the later audio work).
8. Species survey: the network families and the list of up to 100.

Run as parallel research agents with a verification pass, one topic each.

**Phase 2. Model specification** (`docs/MODEL.md`).
The state variables, equations, units, parameter list with ranges, the species schema, the
output-signal list, and which parts each tier implements. This is the document the C++ port
would later be written from.

**Phase 3. 4K engine**, with three contrasting species. First thing on the site.

**Phase 4. 40K engine**, with the six flagship species.

**Phase 5. Species data, first 30**, with a species browser on the site.

**Phase 6. 400K engine.**

**Phase 7. 4M engine.**

**Phase 8. Species data to the final count**, each checked in every engine.

**Phase 9. Hooks for later projects** (section 9), built only as far as exports and documents.

Phases 5 and 8 can overlap the engine work, since they touch different files.

## 8. How we know it is right

- **Limits:** `tools/check.js` in the Pages workflow; a tier over its limit fails the build.
- **Repeatability:** hash of the network after N steps, per engine, per flagship species.
- **Against the science:** for flagship species, compare simulated measures with published ones:
  colony radial growth rate, branching frequency, branch angle, fractal dimension, how looped the
  network is, cord thickness distribution. Reported per tier on a comparison page, including
  where it misses.
- **Speed:** `tools/bench.js` runs each core in Node and records steps per second at the target
  network size.
- **Across tiers:** a page showing the same species and seed in all four engines side by side, as
  in the `style` repo.
- **By eye:** Matt rates them.

## 9. Designing for the later projects

Not built now. These are the choices that keep them possible.

**Sound.** Every engine publishes named output signals with units and native rates (tip count,
growth-front speed, flow at a chosen point, voltage at a chosen node) and a timestamped event
stream (branch, fusion, spike, primordium, spore discharge). Sim time is separate from real time,
so "speed this up 100,000 times" is one number. Fungal rhythms are mostly very slow (spikes are
reported at minutes to hours apart), so the likely routes are speeding up and amplifying; whether
anything makes real sound is research question 7.

**SynthLand plugin.** A saved network is a JSON file (species + seed + settings, or the full
graph), in the same spirit as SynthLand presets. Model parameters are flat, named and ranged so
they can become host parameters. `docs/MODEL.md` plus the Node-runnable core are the reference
for a C++ port.

**Worldbuilder.** Each species carries a `lite` block: habitat rules for placement, a few shape
and colour numbers for a cheap mushroom, and a network-family tag. An export tool writes one
small JSON pack for all species. Worldbuilder would place and draw from that pack without
running any simulator here.

## 10. Repository layout

```
notes.md                      Matt's running notes
CLAUDE.md                     rules for sessions
docs/PLAN.md                  this file
docs/MODEL.md                 the model specification
docs/research/                research write-ups with sources
species/schema.json           the species schema
species/families/*.json       network-family defaults
species/<slug>.json           one per species
engines/4k/ 40k/ 400k/ 4m/    core.js, view.js, index.html each
tools/check.js                limits, schema, repeatability
tools/pack.js                 packs a species for each tier
tools/bench.js                speed measurements
site/                         landing page, species browser, comparison pages
export/                       Worldbuilder pack and saved networks (later)
.github/workflows/pages.yml   build, check, publish
```

## 11. Open questions

- **Do fungi make sound?** Answered: mycelium makes none on record. Only explosive spore
  discharge has been heard. The sound work will rely on speeding rhythms up and on event streams.
- **How literal should the electrical model be?** Settled as above: switchable modes, labelled.
- **Research still owed** (see "Biggest gaps" in [research/README.md](research/README.md)): the
  closed-access growth-model papers, kinetic constants and growth rates for the flagship species,
  death and recycling rates, and a verification pass over anything tagged as from memory.
- **For Matt:** the flagship choices, whether *Psilocybe cubensis* stays, whether the three
  entries that make no real mushroom stay, and whether to hold back about 10 of the 100 slots.
