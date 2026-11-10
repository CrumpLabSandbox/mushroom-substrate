# Research: index and synthesis

Phase 1 of [the plan](../PLAN.md). Eight reports, written 2026-11-09 by research agents, about
64,000 words in all.

**How far to trust these.** Each report marks every source as read, abstract only, snippet only or
from memory, and lists what it could not verify. The web-search budget ran out part-way through
seven of the eight, so later subtopics are thinner and some figures come from search summaries or
memory. No independent verification pass has been run yet. This synthesis is built from the
reports' own summaries and spot reads, not from a full check of each source. Treat a number as
usable only if its report tags it as sourced and read.

| # | Report | Covers |
|---|---|---|
| 1 | [Growth biology](01-growth-biology.md) | Tip growth, branching, fusion, colony kinetics, ageing, life cycle |
| 2 | [Networks](02-networks.md) | Measured network structure, foraging, cords, rhizomorphs, fairy rings, mycorrhizal types, network families |
| 3 | [Models](03-models.md) | Published mycelium models, algorithms for the browser, a recommendation per tier |
| 4 | [Transport and signaling](04-transport-signaling.md) | Mass flow, oscillating transport, electrical spiking and its critics, calcium |
| 5 | [Fruiting](05-fruiting.md) | Triggers, development, shape parameters, spore release |
| 6 | [Environment](06-environment.md) | Substrates, decay, temperature and moisture response, combat, grazing, climate |
| 7 | [Sound and rhythm](07-sound-rhythm.md) | Whether fungi make sound, timescales of every rhythm, signal taps |
| 8 | [Species survey](08-species-survey.md) | The 100 species, flagship six, coverage and gaps |
| 9 | [Boswell check](09-boswell-check.md) | The growth-model equations and values, checked against the papers Matt supplied |
| 10 | [Fricker 2017](10-fricker-2017.md) | Full read of "The Mycelium as a Network": transport speeds, cord behaviour, and where the 40K design departs from it |

## What the research says

**Growth.** Growth happens only at tips, at 60 to 350 µm per hour in mushroom-forming fungi. Two
relations from Trinci tie tip speed, branching and colony growth together (E = µG, Kr = µw).
Side branches outnumber tip splits 4 or 5 to 1; branch angles are usually 70 to 80°. Fusion
happens behind the front. The constants in those relations were measured in moulds; none were
found for a mushroom-forming species.

**Networks.** The cord networks of *Phanerochaete velutina* are the best-measured target: about
700 nodes and 900 links in a 24 cm tray, tips and three-way junctions, loopiness (alpha) rising
to 0.11 to 0.20. Networks over-produce and then prune; cords that carry flow thicken. Evidence for
tree-to-tree "wood wide web" effects in the field is thin (Karst et al. 2023).

**Transport.** Long-distance movement is pressure-driven mass flow at 0.1 to about 100 µm/s.
Heaton et al. 2010 give a complete graph-flow model. Amino-acid transport in *P. velutina* cords
pulses every 11 to 12 hours.

**Electrical activity.** Extracellular spikes are reported at intervals from about 3 minutes to
about 2 hours depending on species, but a substrate-only control produced a cycle of about 200
seconds, close to the fastest reported fungal rhythm (Blatt et al. 2024, Buffi et al. 2025). No
propagation speed has been measured. Calcium pulses at the tip (about every 26 seconds, measured
in a mould) are the best-supported fast signal.

**Fruiting.** A mycelium above a minimum size switches from importing to spending reserves when
nutrients fall, temperature drops 5 to 10 °C, CO2 falls, and light and humidity are right. Many
initials form and a few drain the rest. Final expansion is water uptake, not new mass. Caps
release on the order of 30,000 spores per second.

**Environment.** Log decay is exponential with a rate that roughly doubles or triples per 10 °C.
Across 37 wood-decay fungi, optima are similar and species differ mainly in niche width; fast,
thin growers decay wood faster and win fights more often (Maynard et al. 2019), so one
fast-versus-dense trait can drive several parameters.

**Sound.** Mycelium makes no documented sound. The only fungal sounds on record are by-ear
reports of explosive spore discharge in cup fungi and *Pilobolus*. By the sound report's own
calculation, hyphae cannot resonate (pressure diffuses along them). Rhythms are real but need
speeding up by 1,000 to 100,000,000 times; event streams (spore release, branching) are the
exception and are already dense.

## What changes in the plan

The models report found real faults in the plan's tractability section. The plan has been revised
to match.

1. **Cap the tips.** Tip counts grow exponentially, so every engine needs branching that slows
   with density, plus tip death or dormancy.
2. **Old network is not free.** Transport, recycling, electrical state and drawing all run on it.
   Budget for it.
3. **Two graphs.** Store segments (geometry) separately from links (unbranched runs between
   junctions). Solve flow on links only. Where the network is a tree, flow needs one pass and no
   solver.
4. **Two clocks.** Substrate diffusion needs steps of about 7 seconds; a tip crosses a 100 µm
   cell in about 20 minutes. Fields and tips step at different rates.
5. **Fusion in 3D needs a capture radius,** and a crossing is a fusion only with a
   species-dependent probability.
6. **No camera-dependent simulation.** At 4M the truth is density fields plus a cord-scale
   graph. Fine hyphae near the camera are generated for display from the seed and never feed
   back.
7. **Repeatability needs more care:** worker results applied at a fixed step lag, no GPU floats
   in the model, and no reliance on `Math.sin`/`Math.cos` being identical across browsers.
8. **The 4K engine stores no graph.** Tips steer on a bitmap; fusion is "the pixel ahead is
   occupied".
9. **Sound: drop the "physical sound from hyphae" route** as a main path. Keep spore-discharge
   events and cap resonance as optional physical sources; the main routes are speed-up and event
   streams. Record signals in simulation time and never bake in a speed-up.
10. **Electrical model: offer it as switchable modes** and label it as modelling disputed
    measurements.

## Network families (merged)

Reports 2 and 8 each proposed a set. This is the merge, 12 families:

| Code | Family | Type species |
|---|---|---|
| DIF | Fast, short-lived colony on dung or compost | *Coprinopsis cinerea* |
| MAT | Wood decayer confined to one piece of wood | *Pleurotus ostreatus* |
| CORD-S | Short-range cord forager (dense, slow) | *Hypholoma fasciculare* |
| CORD-L | Long-range cord forager (sparse, fast, migrates) | *Phanerochaete velutina* |
| RHIZ | Rhizomorph system | *Armillaria gallica* |
| RING | Fairy ring | *Marasmius oreades* |
| LIT | Diffuse litter mycelium, many small individuals | *Mycena galopus* |
| ECM-S | Mycorrhizal, contact and short-distance | *Tuber melanosporum* |
| ECM-M | Mycorrhizal, medium-distance | *Laccaria bicolor* |
| ECM-L | Mycorrhizal, long-distance | *Suillus luteus* |
| HOST | Confined to a living host (insect, trunk, other fungus) | *Ophiocordyceps unilateralis* |
| GARDEN | Tended by insects | *Leucoagaricus gongylophorus* |

Flags instead of more families: `sclerotium`, `perennial`, and `mat` (dense mycorrhizal mats and
matsutake-style rings, on ECM-M). The survey's species tables use its own 11 codes and need
re-tagging: its CORD splits into CORD-S and CORD-L.

## Biggest gaps

1. **The core growth model's equations.** Resolved: Matt supplied the papers and report 9 gives
   the published equations and values. Remaining caveat: the values are for *Rhizoctonia
   solani*, not a mushroom former. Fricker et al. 2017 has been read too (report 10); it gives no
   network statistics, so those still rest on Bebber et al. 2007.
2. **Kinetic constants for mushroom-forming fungi.** Hyphal growth unit, peripheral growth zone
   and specific growth rate were found only for moulds.
3. **Growth rates.** Sourced for 10 of 100 species. Missing for two proposed flagships
   (*Coprinopsis cinerea*, *Laccaria bicolor*); cord rates for *Phanerochaete* are in papers that
   could not be opened (Dowson et al. 1986, 1989).
4. **Death and recycling rates.** None found.
5. **Uptake kinetics.** No Vmax anywhere, no Km for a basidiomycete.
6. **Species tables.** Taxonomy, sizes, hosts and ranges are general knowledge unless tagged.
7. **Hyphal length in soil.** The reports conflict: report 2 gives 20 to 50 m per gram (from a
   search snippet), report 6 gives about 10,000 m per gram for forest topsoil. Unresolved.
8. **Formulas from memory** that need checking before the model is frozen: the cardinal
   temperature model, the FitzHugh-Nagumo figures, Falconer's signs.

## Questions for Matt

From the species survey (its section 6 has all nine):

1. Flagships: *Laccaria bicolor* or *Suillus*? *Serpula lacrymans* or the fairy-ring mushroom?
2. Keep *Psilocybe cubensis* on a public site?
3. Keep the three entries that barely or never make a mushroom (*Cenococcum*,
   *Leucoagaricus gongylophorus*, *Lichenomphalia*)?
4. Use all 100 slots now, or leave about 10 free?

## Species values (2026-11-10)

Measured values for 25 species, found by five agents in parallel, with sources and what was not found: [A](11-species-values-A.md) (cultivated), [B](11-species-values-B.md) (wood-decay polypores), [C](11-species-values-C.md) (cord and rot fungi), [D](11-species-values-D.md) (mycorrhizal), [E](11-species-values-E.md) (others).
