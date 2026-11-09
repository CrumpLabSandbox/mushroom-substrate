# Model specification

Version 0.1, 2026-11-09. This is the reference the engines are written from, and later the C++
port. It follows the research in [research/](research/README.md).

**Status.** Section 3 (the 4K model) is implemented and tested. Sections 4 to 6 are the design for
tiers not yet built. The growth and substrate equations in section 4 were checked against the
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
| `tips`, `len`, `br`, `fu` | signals: live tips, total hyphal length (in engine length units), branch count, fusion count |
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

`tools/pack.js` writes `engines/<tier>/species/<slug>.json` from the full file. For 4K that is
the species name and the eight numbers in the order above.

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

## 4. The 40K model: a graph in a patchy world (design)

Scale: colony, 2D, lattice-free. Two graphs: **segments** (straight pieces with geometry) and
**links** (unbranched runs of segments between junctions, carrying state).

**Per link:** length `l`, cross-sectional area `a`, internal substrate `si`, flux `Q`, age,
active flag. **Fields** on a 128² to 256² grid: external substrate `se`, hyphal density `m`,
moisture, temperature.

**Growth** (after Hopkins & Boswell 2012, read, and research/01 level 1 rules):
- Heading is a biased random walk: keep the heading or turn by a fixed step, with the odds
  biased toward lower crowding. The crowding field is hyphal density `m` or a diffusing
  inhibitor that hyphae emit. No steering on nutrient.
- A tip extends only if its segment's internal substrate exceeds the cost of one segment.
- Speed `v = E × g(si) × r_T(T) × r_W(ψ)`, where `r_T` and `r_W` are the temperature and
  water-potential response curves from research/06 (tabulated).
- New lateral branches start slow and reach full speed over 400 to 850 µm. Speed and diameter
  fall with branch order as 100 : 62 : 26 and 100 : 66 : 42.
- Inter-branch spacing drawn from a gamma distribution, shape 1.3 to 1.7.
- About 25% of tips dormant at any time.
- Branch angle defaults to a normal distribution, mean 79°, standard deviation 10°
  (Hopkins & Boswell 2012), unless the species has its own.
- Fusion: a spatial hash finds hits; a hit fuses with probability f and closes a loop.

**Substrate** (Boswell et al. 2003, 2007; Hopkins & Boswell 2012; all read):

```
uptake per segment  U = c1 · si/(c2 + si) · se · dt             si += U,  se −= U/efficiency
                    (needs internal substrate to run; saturates in si, linear in se;
                     efficiency 0.9; a segment has a maximum capacity)
cost of growth      si −= one segment's cost, taken when a tip extends or a branch forms
maintenance         si −= c5 · length · dt; below a floor ω the hypha turns inactive
inactive hypha      degrades at rate di (0 in the calibration; none was seen in 15 h)
passive transport   between joined segments, ∝ difference in si
active transport    toward the nearest tip, by distance through the network, ∝ si;
                    costs c4 per unit moved
external field      ∂se/∂t = De ∇²se − uptake        (implicit relaxation; it is stiff)
```

`De` for glucose in agar is 400 µm²/s (Olsson 1995, via Boswell 2002). The other coefficients
are in research/09 section 3. Active transport toward tips is the published stand-in for flow;
the flow model below replaces it where flow is computed.

**Flow** (Heaton et al. 2010, read): each link that grew draws half its new volume at each end
node; the inoculum balances the total. On a tree, the flux in a link is the summed demand
downstream of it: one pass, no solver. With loops, `A·p = q` with conductance `C = σ·a/l`,
solved by warm-started conjugate gradient with a fixed iteration count, one pressure pinned.

**Transport.** `si` is advected upwind at `Q/a` and diffuses along links.

**Remodelling.** Tero's law, `da/dt = f(|Q|) − r·a`: links that carry flow thicken into cords.
Links below a minimum area and above a minimum age become inactive and return a fraction of
their biomass to neighbours (after Falconer et al. 2005). Target: loopiness alpha of 0.11 to 0.20
and a rise-then-fall in link count for *Phanerochaete velutina* (Bebber et al. 2007).

**Fruiting.** A site starts a primordium when reserves nearby exceed a threshold and the trigger
holds (nutrient falling, temperature down 5 to 10 °C). Many initials start; they compete for the
same reserve and most are drained (research/05).

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
