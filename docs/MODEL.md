# Model specification

Version 0.1, 2026-11-09. This is the reference the engines are written from, and later the C++
port. It follows the research in [research/](research/README.md).

**Status.** All four engines (sections 3, 4, 5 and 5b) are implemented and tested. The growth and substrate equations in section 4 were checked against the
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
world, two display colours and 35 numbers (the seventeenth is the transport speed); the order is the `keys` list in `tools/pack.js`,
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

1. **Tips.** A tip needs 1 unit in its segment to extend. If it is short, mass flow delivers the
   difference from upstream: the tip draws from its ancestors along the hypha, nearest first, as
   far back as substrate could travel in one step at the species' transport speed (for
   *Phanerochaete velutina*, 20 mm/h, the low end of the measured 20 to 100 mm/h, which is 57
   segments per step). Its progress per step is the product
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
   `U = rate · dt · age · affinity(type) · rT · rW · si/(k + si) · se/(se + 5)`, limited by what
   the cell holds and by the segment's capacity (`capacity × ar`); the fungus keeps 90%. The
   `age` factor is `1 / (1 + (age ÷ TU)²)` with `TU` the time a tip takes to travel 3 mm, so
   uptake is concentrated behind the growing front. Its floor is 0.03 on agar and soil (old
   colony centres are measured at 3% of the margin's uptake, research/01) and 0.5 inside wood,
   litter and root tips (an assumption: hyphae inside a food source keep feeding). Cords
   (cross-section above 4) take up at one fifth, as they are insulated. Maintenance
   removes a fixed amount per hour. Cross-section relaxes toward `1 + cord_max · |Q|/(|Q| + 1)`, where `Q` includes the loop
   correction below. A
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
   tree no solver is needed). `Q` is a running average of that. Then loops: every fusion closes
   one loop, made of the fusion and the two paths back to their common ancestor. For up to 300
   loops per step, in rotation, the engine balances the head around the loop (head loss in a
   segment = flux ÷ cross-section) by adding a circulating flow. This is Hardy Cross relaxation,
   the standard hand method for pipe networks; repeated over steps it converges on the flow a
   full pressure solve would give. Flux in a segment can come out reversed.
5. **Translocation**, 2 to 8 passes per step: diffusion between each segment and its parent; a
   segment that is more than 80% full pushes a quarter of the surplus toward the centre, so a
   food source that a branch has found feeds the trunk; and each fusion carries substrate across
   in the direction of its loop flow.
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
a network strung along root tips for *Laccaria*. For *Phanerochaete velutina* after 300 steps,
alpha is 0.10 from fusions and 0.13 with crossings counted, against 0.11 to 0.20 measured in
much larger and older networks (Bebber et al. 2007). Loop flows stay finite and smaller than
the tree flows they correct. Nothing else has been compared with measurements.

**What it honestly is not.**
- **Loop flow is approximate.** It is relaxed a few hundred loops per step and lags the growth
  it responds to. Delivery to a starving tip still draws only from its own ancestors, not
  through fusions.
- **Alpha is over every hypha ever laid**, including abandoned ones. Two versions are reported:
  from true fusions, and with every crossing counted as a junction, which is what a network
  extracted from a photograph would show (Fricker et al. 2017). The second is the one to
  compare with measurements.
- **The shape of the uptake fall-off is a guess.** That uptake falls behind the tip and that
  cords are insulated is from the literature; the curve, the 3 mm scale and the one-fifth
  factor are not.
- **Fusion is too simple.** Real fusion is mostly secondary branches behind the front homing on
  neighbours; here any tip that crosses a hypha in a dense area may fuse.
- **Delivery is a reach, not a moving front.** Transport speed sets how far upstream a sink can
  draw within one step. It is sourced for three species and inferred for the rest. Substrate
  does not travel as a visible pulse, and the measured 11 to 12 hour oscillation in
  *P. velutina* is not modelled.
- **Diffusion inside hyphae is too slow.** It is counted in passes per step; the measured
  coefficient (1 to 2 × 10⁻⁹ m²/s) would spread substrate several times further.
- **Flow-driven thickening is an inference.** The review supports a correlation between flow and
  cord thickness and says how cords are chosen for strengthening is unknown.
- **The scale is wrong for cord data.** Measured cord networks are 24 to 50 cm across and 3 to
  14 weeks old; this field is 2.5 cm and runs for days.
- **Bait blocks are found by chance.** That matches the literature (tips do not sense nutrient
  at a distance). The measured response afterwards, thickening the connecting route and
  abandoning the rest, does appear in runs, but it has only been seen by eye, not measured.
- **Fruiting sites are symbols.** A real mushroom of most of these species is larger than the
  field.
- **Most coefficients are tuning values.** Uptake rate, capacity, maintenance, transport, cord
  growth, the fruiting thresholds and the substrate amounts have no measurement behind them and
  are marked `unknown` in the species files. The uptake rate is simply set so that one feeding
  segment can supply about one growing tip.

## 5. The 400K model: a block of soil (implemented)

The 40K model moved into three dimensions, in `engines/400k/`. Everything in section 4 applies
unless stated here. The core runs in a Web Worker; the page only displays what it sends.

**Space.** A block 25.6 mm square and 12.8 mm deep; `z` is depth below the surface. Fields live on
a 64 × 64 × 32 grid (cells of 400 µm). Up to 262,144 segments. Soil is layered: leaf litter to
0.8 mm, organic soil to 4 mm, mineral soil below. Five worlds: a block of agar, buried wood, deep
litter, tree roots (lines that descend through the soil, with root tips along them), and a
half-buried log.

**Tips in 3D.** A tip's heading is a unit vector. Each segment it adds a random wobble, turns down
the gradient of its own individual's inhibitor, and drifts weakly toward the family's preferred
depth. At the surface it turns back down. A branch leaves at the branch angle in a random
direction around its parent. Lines in 3D never exactly meet, so a tip fuses when it comes within
a capture radius of 40 µm of one of its own hyphae in a dense place.

**More than one individual.** Each individual has its own inhibitor field, so rivals do not repel
each other. When a tip comes within 200 µm of a rival's hypha, that hypha dies. If the rival is
the same species (a different genet), the tip dies too and a barrier is left. If it is another
species, the tip wins with probability `0.6 × its score ÷ (sum of the two scores)` and grows on
into the rival's ground; otherwise it dies (deadlock). Scores are family values inferred from the
published combat hierarchy.

**Weather.** Surface temperature is the mean plus a yearly and a daily cycle, damped with depth.
Rain falls at random (about once per 60 hours) or on demand, wets the surface, and soaks down;
the surface dries between rains. Growth and uptake respond through the same temperature and
moisture curves as before, evaluated per depth layer.

**Electrical activity** runs on a coarser graph, one node per 0.8 mm of hypha, on its own faster
clock (up to 120 sub-steps per growth step). Three switchable models:
- *Excitable network* (FitzHugh-Nagumo, a = 0.7, b = 0.8, ε = 0.08): nodes holding a growing tip
  are driven and fire rhythmically; the rest of the network is excitable and carries the spikes;
  rain excites the top 1.6 mm. Time is scaled so a driven node's period (40 model time units,
  checked numerically) equals the species' measured spike interval.
- *Integrate and fire*: charge builds faster where there is growth; a spike kicks the neighbours.
- *Voltage follows flow*: no dynamics, the potential is a saturating function of flux.
Two electrodes sit on the network; the signal is the difference between them, in millivolts
scaled by the species' measured amplitude, with a known time per sample. This trace is the first
audio-ready signal in the project.

**Fruiting bodies** start only within 2.4 mm of the surface and are drawn as 3D shapes: a profile
for each of 16 forms (agaric, bolete, bracket, puffball, coral, morel and so on) spun around the
stem, in the species' colours. They can be drawn at the species' real size, which is usually
larger than the block.

**Saving.** Signals and the voltage trace save as CSV. The network saves as JSON with the recipe
that reproduces it (species, seed, world, settings, number of steps) and every segment's end
points, cross-section, reserve, flux, state and individual.

**What was checked.** Same seed gives the same state for eight species with stored hashes, and for
two individuals in one block, which must also meet (`tools/test.js`). Every other species gets a
short run that must grow and stay finite. The FitzHugh-Nagumo period and stability were checked
numerically before use. In the browser the page drew single colonies, two individuals, the
voltage trace and the soil with no console errors, in a preview pane that throttles animation, so
the live frame rate and the fruiting-body shapes have not been checked by eye.

**What it honestly is not.**
- **Everything in the 40K list still applies** (tuning values, approximate loop flow, simple
  fusion, guessed uptake fall-off).
- **The electrical models reproduce disputed measurements.** The spikes may be electrode
  artefacts (Blatt et al. 2024). No propagation speed has been measured in a fungus; here it is
  whatever the coupling and node spacing give. Only the first individual's electrical values are
  used.
- **Slow growers are under-sampled electrically.** Their growth step is hours long, more than the
  sub-step cap covers, so each step simulates only part of that time.
- **Rhizomorph species use intracellular figures** (about 1 Hz), a different kind of measurement
  from the hour-scale extracellular spikes used for the others.
- **Combat is a coin weighted by an inferred score.** There is no chemistry, no change of outcome
  with temperature or territory size, and only two individuals.
- **Weather is a toy.** Two cycles made of parabolas and random rain, not a climate.
- **Wood does not change as it decays** beyond losing substrate; white and brown rot differ only
  in their parameters.
- **In 3D the same branching rule fills space faster**, so dense species reach the segment limit
  within days and stop.
- **Most species are their family.** Of the 90 species, 69 set no parameter of their own and
  behave exactly as their family default; they differ only in name, colours and fruiting body.

## 5b. The 4M model: a plot of ground over years (implemented)

Stand scale, in `engines/4m/`. It is not the 400K engine made bigger: the state changes kind.

**Space and time.** A plot 2.56 m square and 64 cm deep. Segments are **cords** 1 cm long; fields
live on a 64 × 64 × 16 grid of 4 cm cells. One step is the time the fastest cord takes to grow
1 cm, at most a day, so a year is a few hundred steps. Ground is 4 cm of leaf litter (or turf)
over organic soil to 16 cm over mineral soil. Five kinds of ground: meadow turf, fallen logs,
deep litter with fallen branches, trees with their roots and one log, and one big log.

**Two representations, as planned.** Each individual is (1) an explicit graph of cords, which
explore, carry reserves, thicken with flow, fuse and are abandoned exactly as in sections 4 and
5, and (2) a **field of fine mycelium**, a number between 0 and 1 per cell. Fine mycelium grows
where there is food the species can use and room left, seeded by cords and by neighbouring
cells; it feeds itself; it dies back where food has run out. It does the feeding: each cord in
a cell receives a share of what that cell's mycelium takes up. Cords themselves do not feed.
The haze drawn on the page is this field. It is display only in the sense the plan meant:
nothing about the camera changes the model.

**Mushrooms.** An initial starts on a cord within 12 cm of the surface when the colony is old
enough, the surface has cooled to `t_opt − cold_drop`, and reserves allow. It grows by drawing
on the cord network, faster when the surface is wet. When it reaches its mature mass it stands
for ten days and then rots. The page draws it in the species' form and colours at its real size
(with a size control, since a 5 cm cap is small on a 2.5 m plot).

**Spores.** A standing mushroom sheds 1.08 × 10⁸ spores per hour (3 × 10⁴ per second, the order
reported in research/05). A few landing points per step are drawn from a distance rule with a
median of 8 cm and about 95% within a metre. A spore founds a new individual only if it lands
on food its species can use, where no mycelium has a hold, and then with probability 0.004. Up
to 8 individuals. A new individual is a different genet: where its cords meet its parent's,
both die back and leave a barrier.

**Climate.** The mean yearly temperature defaults to 8 °C below the first species' optimum, with
a yearly swing of ±8 °C and a daily one of ±3 °C, so most species grow through summer and fruit
as autumn cools the surface.

**Wood.** Logs lose substrate only as fungi take it up; "wood left" is the remaining fraction.

**Sound.** The page's "listen" button is the project's first sound: each kind of event in a batch
of steps (branch, fusion, spike, rivals meeting, spore release, rain, a mushroom maturing, a
spore founding an individual) becomes a short synthesised sound, and the electrode voltage
bends a drone. It is a mapping chosen by hand, not a recording, and runs in the browser's own
audio clock, so it is not part of the repeatable model.

**What was checked.** Same seed gives the same state for five species with stored hashes; every
other species gets a short run that must grow and stay finite. Event counts match the counters,
including one founding event per extra individual. Headless runs of 900 days show colonies
spreading 0.2 to 1.3 m, yearly flushes of mushrooms, spores founding individuals and rivals
meeting. In the browser the page drew a honey fungus colony on a log with its mushrooms and
plots, with no console errors. The sound has not been listened to.

**What it honestly is not.**
- **Not the plan's fruiting model.** Mushrooms are not grown by a swarm of steered tips
  (Meškauskas et al. 2004). They are a mass that grows and a drawn shape.
- **Nothing here is calibrated at this scale.** Cord growth uses the hyphal tip speed. The
  feeding rate, the fine-mycelium growth and death rates, the spore-landing rule and the
  founding probability are tuning values. Logs decay several times faster than real ones.
- **The fine mycelium is one number per 4 cm cell.** It has no age, no direction and no
  structure, and the Boswell density equations were not used for it.
- **Every 4K to 400K caveat about parameters still applies**, and 69 of the 90 species behave
  as their family default.
- **Trees are scenery plus root tips that supply carbon.** They do not grow, die or respond.
- **It uses about 60 KB of its 4 MB.** No embedded reference data, no Three.js, no learned
  component: the size budget is almost entirely unspent.

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
