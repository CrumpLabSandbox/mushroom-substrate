# Model specification

Version 0.1, 2026-11-09. This is the reference the engines are written from, and later the C++
port. It follows the research in [research/](research/README.md).

**Status.** Sections 3 and 4 (the 4K and 40K models) are implemented and tested. Section 5 is
the design for tiers not yet built. The growth and substrate equations in section 4 were checked against the
published papers on 2026-11-09 ([research/09-boswell-check.md](research/09-boswell-check.md)).
Their coefficients were calibrated on *Rhizoctonia solani*, which is not a mushroom former, so
they are a starting point and not species data.

## 1. Conventions

**Units.** Length in micrometres (µm). Time in seconds (s). Angles in degrees in species files;
engines convert. Pressure in pascals. Amount of substrate is a dimensionless concentration
between 0 and 1 until uptake kinetics are sourced (see 7).

**Time.** `t` is simulation time in seconds. An engine advances by `step()`, which adds a fixed
`dt` to `t`. The view decides how many steps to run per frame. The ratio of simulated seconds to
real seconds is displayed and is never used inside a core.

**Randomness.** One seeded generator per run (mulberry32). No `Math.random()`, no clock.

**Repeatability.** The same species, seed and step count give a byte-identical state on every
machine. To hold that:
- Cores use only `+ − × ÷`, comparisons, `Math.imul`, `Math.max/min` and typed arrays. These are
  exactly specified.
- No `Math.sin`, `Math.cos`, `Math.exp` or `Math.pow` in a core: they may differ in the last bit
  between browsers. Directions come from a table built by repeated rotation with literal
  constants. Curves that need `exp` are tabulated the same way or use rational forms.
- Worker results are applied at a fixed step lag. No GPU arithmetic in a core.
- `tools/test.js` hashes the state after a fixed number of steps and compares with a stored hash.

**Core interface.** Every core exposes a function `M(params, seed)` returning a state object with
at least:

| Member | Meaning |
|---|---|
| `step()` | advance by one `dt` |
| `t` | simulation time, s |
| `dt` | seconds per step |
| `len`, `br`, `fu` | signals: total hyphal length (pixels in 4K, µm of live hypha in 40K), branch count, fusion count |
| live tips | `T.length` in the 4K core, `ntips` in the 40K core |
| `ev` | optional callback `ev(type, x, y)` called on each event; `type` 0 = branch, 1 = fusion |

Larger tiers add signals and events (section 6) but keep these names.

## 2. Species parameters

A species file is `species/<slug>.json`. Every measured quantity is an object:

```json
{ "value": 350, "unit": "um/h", "basis": "sourced", "source": "research/01 [22]", "note": "search snippet; paper not opened" }
```

`basis` is `sourced` (needs `source`), `inferred` (needs `note` saying from what) or `unknown`
(a default). `tools/check.js` enforces this.

The parameters the 4K engine reads, and where each tier's packed file takes them from:

| Symbol | Field | Unit | Meaning |
|---|---|---|---|
| E | `hyphae.tip_speed` | µm/h | tip extension rate |
| G | `hyphae.growth_unit` | µm | hyphal growth unit: hyphal length per tip. Branching rate per tip is µ = E/G |
| θ | `hyphae.branch_angle` | degrees | angle between a branch and its parent |
| ω | `hyphae.wobble` | degrees | largest random change of heading per step |
| A | `hyphae.avoidance` | — | weight of occupied space against nutrient when steering |
| f | `hyphae.fusion_probability` | — | chance that a tip meeting a hypha fuses (otherwise it crosses) |
| u | `hyphae.uptake` | per pixel laid | nutrient removed from a cell per pixel of new hypha |
| τ | `hyphae.turn` | degrees | size of one steering correction |

The 4K steering, fusion and uptake values live under `tuning_4k` in the species file, apart
from the values the 40K engine reads, because the two engines mean different things by them.

`tools/pack.js` writes `engines/<tier>/species/<slug>.json` from the full file. For 4K that is
the species name and the eight numbers in the order above. For 40K it is the name, the default
world, two display colours and 35 numbers; the order is the `keys` list in `tools/pack.js`,
which matches the first line of the 40K core.

Later tiers add the sections listed in the plan (network, transport, electrical, fruiting,
environment response, `lite`).

## 3. The 4K model: tips on a bitmap (implemented)

Scale: hyphal. One pixel is 20 µm; the field is 512 × 512 pixels (10.24 mm). No graph is stored.
The bitmap is the network.

**State.**
- Tips: position `(x, y)` in pixels (real numbers), heading `h` in 256ths of a turn, age in steps.
- `occ`: one byte per pixel, 1 where hypha has been laid.
- `nut`: nutrient on a 128 × 128 grid (cells of 4 pixels, 80 µm), starting at 1.

**Start.** Twelve tips at the centre, evenly spaced in heading.

**One step** (`dt` = 20 µm ÷ E, so every tip advances one pixel per step). For each tip:

1. **Sense.** Sample `A·occ − nut` at three points 6 pixels (120 µm) ahead: 45° left, straight,
   45° right. Off-field counts as fresh, empty substrate, so tips leave the field and stop
   there. The sensors must reach past the tip's own nutrient cell: at 3 pixels the tip read its
   own depletion as "worse ahead" and locked onto the grid, drawing straight axis-aligned lines.
2. **Steer.** Add a uniform random wobble in ±ω. If the left sample is the lowest, turn left by τ;
   if the right is, turn right by τ.
3. **Move** one pixel along the heading. If that leaves the field, or the nutrient in the new
   cell is below 0.05, the tip stops for good.
4. **Meet.** If the new pixel is already occupied and the tip is older than 3 steps: with
   probability f the tip fuses (fusion count + 1, the tip is removed); otherwise it crosses.
5. **Lay.** If the new pixel was empty: mark it, length + 1, and take `u` from the cell's
   nutrient (not below 0).
6. **Branch.** With probability `(20 µm ÷ G) × nut`, a new tip starts here with heading
   `h ± θ` (sign random). This is µ = E/G per unit time, scaled by local nutrient. No new tips
   once there are 20,000.

Then the nutrient grid takes one relaxation pass,
`nut ← nut + 0.2 × (sum of 4 neighbours − 4·nut)`, with the outer ring held at 1.

**What limits growth.** Branching falls with nutrient, tips stop where nutrient is exhausted,
and there is a hard cap on tips. Fusion removes tips where the network is dense.

**What it honestly is not.**
- The nutrient relaxation is a stand-in, not physical diffusion. Its effective diffusion
  coefficient is `0.2 × (80 µm)² ÷ dt`, which is around 1 to 20 µm²/s depending on species,
  well below glucose in water (about 350 to 700 µm²/s). Read it as a poorly mobile resource in a
  solid substrate, resupplied from outside the field.
- All tips of a species move at the same speed.
- Branches start at the tip, not behind it.
- No widths, no transport, no loop statistics. Fusion is counted but the bitmap cannot say which
  hypha joined which.
- A, ω, τ, f and u are not measured quantities. They are tuning values, marked `unknown` in the
  species files.
- Steering on nutrient is a stand-in. The published models steer tips away from biomass, and
  Boswell et al. 2003 state that tips do not generally respond to external nutrient gradients.
  Here nutrient is low exactly where hypha has been laid, so the nutrient term acts as a blurred
  crowding field. From 40K up, steering reads a density or inhibitor field, never nutrient.
- In the published lattice-free model every meeting fuses. The fusion probability below 1 rests
  only on the observation that hyphae also cross each other.

**Signals.** `tips` (count), `len` (pixels; × 20 for µm), `br`, `fu`, `t`. Events: branch and
fusion with position.

## 4. The 40K model: a graph in a patchy world (implemented)

Scale: colony, 2D, lattice-free. The field is 25.6 mm across. Hyphae are straight segments of
100 µm. Fields live on a 128 × 128 grid (cells of 200 µm). One step is the time a tip at full
speed takes to lay one segment (`dt` = 100 µm ÷ E).

**Units.** Substrate is counted in units of "the cost of laying one segment". It is not moles.

**State per segment:** end points, parent segment (the one it grew from), internal substrate
`si`, cross-section `ar` (1 = a single hypha), smoothed flux `Q`, birth time, and a state:
active, inactive (abandoned) or gone. Because a child is always created after its parent, the
segments form a tree in index order; fusions are stored as extra pairs.

**Fields:** substrate type, external substrate `se`, moisture (fixed, from the seed), hyphal
density, and a diffusing inhibitor that hyphae emit.

**Worlds.** Five substrate types: soil (poor, 0.6 units per cell), wood (400), leaf litter (60),
root tip (40, resupplied by the tree at 6 units per hour), agar (25, and the only one whose
substrate diffuses freely). Five worlds built from the seed: a dish of agar, wood blocks in soil,
litter patches, tree roots in soil, one large log.

**One step, in order:**

1. **Tips.** A tip needs 1 unit in its segment to extend. Its progress per step is the product
   of the temperature response, the moisture response, a ramp for young branches (0.3 rising to
   1 over 600 µm), and the species' willingness to grow over bare soil. Heading changes by a
   random wobble plus a turn away from the more crowded side, read from the inhibitor field
   400 µm ahead-left and ahead-right. Laying a segment costs 1 unit; the rest is split with the
   new segment. If the new segment crosses a hypha in a place where density is above 1 per cell,
   it fuses with the species' probability, ending there and closing a loop; otherwise it
   crosses. After each segment laid, with probability `(100 µm ÷ G) × (1 − density ÷ cap)`, a
   branch starts from a segment 1 to 5 back along the hypha, at the branch angle (normal, with
   the species' mean and spread), either side.
2. **Every active segment.** Uptake
   `U = rate · dt · affinity(type) · rT · rW · si/(k + si) · se/(se + 5)`, limited by what the
   cell holds and by the segment's capacity (`capacity × ar`); the fungus keeps 90%. Maintenance
   removes a fixed amount per hour. Cross-section relaxes toward `1 + cord_max · Q/(Q + 1)`. A
   segment that has no tip, carries no flow, is older than the inactivation age and is nearly
   empty is abandoned at the inactivation rate, returning half its contents plus 0.3 units to
   its parent. Abandoned segments disappear at the degradation rate.
3. **Fruiting.** Once the colony is old enough, the temperature is at or below
   `t_opt − cold_drop`, and the reserve is either twice the threshold or above the threshold
   with uptake below 60% of its peak, initials start at random well-fed segments, at least 3 mm
   apart, up to 14. Each initial draws from its segment at a rate that rises with its own mass,
   so early starters win. An initial that gets nothing for 80 steps aborts and returns half its
   mass. One that reaches the mature mass is a fruiting site.
4. **Flow.** Each extension and each initial's draw is a demand. One pass from the youngest
   segment to the oldest sums the demand downstream of every segment (Heaton et al. 2010: on a
   tree no solver is needed). `Q` is a running average of that.
5. **Translocation**, 2 to 8 passes per step: between each segment and its parent, a passive
   part proportional to the difference in `si`, and a directed part that moves substrate toward
   demand in proportion to the child's share of the parent's flux. Fusion links carry the
   passive part only.
6. **Fields.** Root tips are resupplied. Substrate spreads where the type allows. The inhibitor
   is emitted in proportion to hyphal density, spreads and decays.

**Response curves.** Temperature: the cardinal temperature model, a rational curve that is 0 at
`t_min` and `t_max` and 1 at `t_opt` (the standard Rosso et al. 1993 form; not yet checked
against the paper). Moisture: `max(0.1, 1 − ((wet − wet_opt)/wet_width)²)`, a stand-in.

**Signals** (also recorded every 10 steps, and saved as CSV from the page): time, growing tips,
live hyphal length, reserve, uptake per hour, flow from the centre per hour, front radius,
fruiting sites, cord segments, and alpha. Events: branch, fusion, tip stop, segment abandoned,
initial started, initial aborted, fruiting site matured.

**What was checked.** Same seed gives the same state, and a different seed a different one, for
all seven species (`tools/test.js`). In the browser, all species grow without errors and look
different from each other: sparse cord networks with thick trunks for *Phanerochaete* and
*Serpula*, a few long rhizomorphs for *Armillaria*, a dense mat held to its log for *Pleurotus*,
a network strung along root tips for *Laccaria*. After 250 steps alpha is 0.09 for
*Phanerochaete velutina*, against 0.11 to 0.20 measured in much larger and older networks
(Bebber et al. 2007). Nothing else has been compared with measurements.

**What it honestly is not.**
- **Flow ignores loops.** Flux is computed on the growth tree only. Fusion links carry no flow,
  so loops cannot yet reroute supply, which is the main thing loops are for.
- **Alpha counts true fusions only**, over every hypha ever laid, including abandoned ones.
  Measured networks are extracted from photographs, where every crossing looks like a junction
  (Fricker et al. 2017), so the two numbers are not directly comparable.
- **Uptake is uniform along a hypha.** The review says uptake falls sharply behind the tip and
  that cords are insulated.
- **Fusion is too simple.** Real fusion is mostly secondary branches behind the front homing on
  neighbours; here any tip that crosses a hypha in a dense area may fuse.
- **Directed translocation has no physical counterpart.** It stands in for mass flow. Real
  motor transport is capped near 4 µm/s and real cords carry tracer both ways at once.
- **Translocation speed scales with tip speed** (it is counted in passes per step), not with
  time. Measured solute speeds in *P. velutina* cords are 20 to 100 mm/h; the engine's are far
  lower and have not been calibrated.
- **Flow-driven thickening is an inference.** The review supports a correlation between flow and
  cord thickness and says how cords are chosen for strengthening is unknown.
- **The scale is wrong for cord data.** Measured cord networks are 24 to 50 cm across and 3 to
  14 weeks old; this field is 2.5 cm and runs for days.
- **Nothing steers toward wood.** Finding a bait block is by chance. The measured response
  (thicken the connecting route, abandon the rest) appears only as far as flow-driven
  thickening and starvation pruning produce it.
- **Fruiting sites are symbols.** A real mushroom of most of these species is larger than the
  field.
- **Most coefficients are tuning values.** Uptake rate, capacity, maintenance, transport, cord
  growth, the fruiting thresholds and the substrate amounts have no measurement behind them and
  are marked `unknown` in the species files. The uptake rate is simply set so that one feeding
  segment can supply about one growing tip.

## 5. The 400K and 4M models (outline)

**400K, 3D.** Section 4 in a volume. Steering reads gridded fields so cost stays linear. Fusion
uses a capture radius. Flow and field relaxation run in a Worker and are applied at a fixed lag.
Electrical activity as three switchable modes on links: integrate-and-fire, FitzHugh-Nagumo with
a per-species time scale, and a voltage derived from flow. Roots as sources of carbon for
mycorrhizal families; wood blocks whose mass decays as `M = M0·exp(−k·t)` with a Q10 temperature
factor. Meetings between individuals: same genet fuses; different genets of one species form a
dead barrier; different species deadlock or replace by a combat score tied to the
fast-versus-dense trait. Parametric 3D fruiting bodies.

**4M, 3D.** Density fields (active hyphae, inactive hyphae, tips, internal and external
substrate) plus an explicit cord-scale graph are the state. Fine hyphae near the camera are
generated from the seed for display and never feed back. Fruiting bodies are grown by a swarm of
tips following a scheduled steering program (Meškauskas, Fricker & Moore 2004), then expanded by
water uptake. Spore discharge as events at about 3 × 10⁴ per second per cap.

## 6. Signals and events for later sound work

From research/07. Engines publish these as they become able to:

| Signal | Unit | From tier |
|---|---|---|
| live tips, total length, branch rate, fusion rate | count, µm, 1/s | 4K |
| growth-front radius and speed | µm, µm/s | 40K |
| reserve (total `si`), uptake rate | —, 1/s | 40K |
| flux and flow speed at a chosen link | µm³/s, µm/s | 40K |
| link count, loop count, alpha | count | 40K |
| voltage at a chosen node | mV | 400K |
| spore discharge rate | 1/s | 4M |

Events carry a type, a simulation time and a position: branch, fusion, tip stop, link
inactivated, primordium start, primordium abort, spike, spore discharge.

Recording is in simulation time. A speed-up is applied only on playback, never stored.

## 7. Known gaps in this specification

1. The growth equations are now checked (research/09), but their coefficients are for
   *Rhizoctonia solani* on rich agar at 30 °C, and the authors call several of them crude
   estimates or working hypotheses. Exponents were read from extracted text, not page images.
2. G, the peripheral growth zone and µ: measured only in moulds. Values for mushroom-forming
   species are inferred.
3. Uptake kinetics: no Vmax found, no Km for a basidiomycete. Until then substrate is
   dimensionless.
4. Death and recycling rates: none found.
5. The response-curve formulas in research/06 (cardinal temperature model) and the
   FitzHugh-Nagumo figures in research/04 are from memory and need checking.
6. 4K steering weights (A, ω, τ), fusion probability and uptake are tuning values with no
   measurement behind them.
