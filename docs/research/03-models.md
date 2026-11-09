# 03. Existing models of mycelium, and how to simulate one in real time

Research topic 3 of [PLAN.md](../PLAN.md). Written 2026-11-09.

**How to read the evidence marks.** Every model below is tagged with how I know it:

- **[read]** I opened the paper (or an author-hosted copy) and took the equations or numbers from it.
- **[secondary]** I took it from another paper or page that describes it; the original was not opened.
- **[memory]** Reconstructed from general knowledge because the source was paywalled or blocked.
  Treat as a lead to check, not as a fact.

Browser cost figures in sections 4 and 5 are my engineering estimates. None were measured. The
plan already says targets are "to be measured not assumed"; that applies to every millisecond here.

## 1. Summary

1. Three families of mycelium model exist: continuum PDEs for densities (Edelstein, Boswell, Falconer, Schnepf), discrete tip/graph models (Neighbour-Sensing, Boswell's hybrid lattice model, Hopkins & Boswell, Vidal-Diez de Ulzurrun, Fuhr), and transport models on a fixed measured graph (Heaton, Bebber). No published model does all of growth, transport, signalling and fruiting.
2. The best-supported growth core is Boswell's five variables: active hyphae, inactive hyphae, tips, internal substrate, external substrate. It exists in PDE form (2003) and as a discrete network (2007, 2008, 2012). Use it as the backbone at every tier.
3. The best-supported transport model is Heaton's: growth itself drives mass flow. Growing parts are sinks, the inoculum is the source, conductance is proportional to cross-sectional area, pressures come from one sparse linear solve.
4. On a tree, that flow needs no solve at all (one leaf-to-root pass). Real cord networks are mostly tree-like (meshedness 0.11 to 0.20), so the "slow global solve" in the plan is much smaller than it looks.
5. The only published way to *grow* a fruiting-body shape from hyphae is the Neighbour-Sensing model, by switching tropism settings over time. Its cost is quadratic as published; a grid-deposited field makes it linear.
6. Electrical models of fungi are thin: FitzHugh-Nagumo equations run on an image of a colony, with parameters chosen to give waves, not fitted to a species.
7. PLAN section 4 is right about graphs and hashing at the hyphal scale. It is wrong or naive about five things: tip count grows exponentially, so "only tips do work" does not bound cost; old network is not free (transport, rendering); diffusion in the substrate is stiff relative to growth; "bundle the rest into cords" is not a level-of-detail scheme anyone has; and Workers, GPUs and `Math.sin` each threaten the repeatability rule.
8. Recommendation: 4K = tips on an occupancy bitmap (no graph); 40K = lattice-free graph with Boswell substrates and tree flow; 400K = the same in 3D with grid-based tropism fields, loop-corrected flow and FitzHugh-Nagumo on the graph; 4M = a continuum model as the simulation truth with explicit hyphae generated near the camera.

## 2. Survey of models

### 2.1 Edelstein (1982) and Edelstein & Segel (1983): tips and trails

**Represents.** A colony in one space dimension as two densities: tips `n(x,t)` and hyphal
length `ρ(x,t)`. Tips move; the trail they leave is hypha.

**Equations** [secondary: form confirmed from Schnepf et al. 2008, who adopt it; original not opened]

```
∂ρ/∂t = n·v − d·ρ                 hypha laid down by moving tips, minus hyphal death
∂n/∂t = −∂(n·v)/∂x + σ(n, ρ)      tip flux plus tip sources and sinks
```

`σ` is a sum of chosen terms. From memory of the original [memory]: dichotomous branching
`+α1·n`, lateral branching `+α2·ρ`, tip-tip fusion `−β1·n²`, tip-hypha fusion `−β2·n·ρ`, tip
death `−β3·n`, overcrowding death `−β4·ρ·n`. Edelstein & Segel (1983) add a nutrient and an
internal metabolite [memory, not opened].

**Reproduces.** Travelling-wave colony fronts; which combinations of branching and fusion can
propagate. A secondary source (David Moore's online textbook, seen in search results only)
reports that without hyphal death only dichotomous branching with tip-hypha fusion propagates.

**Cost.** Two fields on a 1D or 2D grid, explicit upwind step: trivial. A 256×256 grid is
roughly 0.3 ms per step in JavaScript (estimate).

### 2.2 Schnepf, Roose & Schweiger (2008): mycorrhizal hyphae from a root [read]

Edelstein's form, in radial geometry around a root, fitted to three arbuscular mycorrhizal
species. Useful to us because it is the only model in this survey with a full fitted parameter
table in real units.

```
∂n/∂t = −(1/r)·∂(r·v·n)/∂r + f
∂ρ/∂t = n·v − d·ρ
f = bn·n·(1 − n/nmax) − dn·n − a2·n·ρ − a1·n²
boundary at root surface: n(r0, t) = a·t + n0b
```

| Parameter | Units | *Scutellospora calospora* | *Glomus* sp. | *Acaulospora laevis* |
|---|---|---|---|---|
| tip speed `v` | cm/day | 0.25 | 0.13 | 0.28 |
| tip branching `bn` | 1/day | 0.02 | 1.91 | 1.47 |
| tip death `dn` | 1/day | 0.0052 | 0.15 | 0.73 |
| hyphal death `d` | 1/day | 0.18 | 0.28 | 0.08 |
| max tip density `nmax` | 1/cm³ | not used | 2238 | 1.78×10⁵ |
| tip-tip fusion `a1` | cm³/day | none | none | 7.0×10⁻⁷ |
| tip-hypha fusion `a2` | cm³/(m·day) | none | none | 0.15 |

*S. calospora* fits with linear branching and no fusion; *A. laevis* needs both fusion terms.
That is a direct, sourced example of "network family" differences expressed as parameters.

### 2.3 Davidson and co-workers (1996 to 1998): reaction-diffusion colonies [memory]

Not opened. From memory and from the reference list in Boswell et al. (2003, *Mycologist*):
activator-inhibitor-style systems coupling a biomass density to a substrate, giving rings and
patchy colonies on uniform media. Superseded for our purposes by Boswell and Falconer, which
have named physiological terms.

### 2.4 Boswell, Jacobs, Davidson, Gadd & Ritz (2002, 2003): the five-variable model

> **Superseded 2026-11-09.** The papers have since been read. The equations and values are in
> [09-boswell-check.md](09-boswell-check.md); the "as I remember it" system below has errors
> (hypha creation, tip movement, a maintenance term that is not in these papers).

**Represents.** *Rhizoctonia solani* on a plane. Five densities: active hyphae `m` (they
translocate), inactive hyphae `m'` (moribund, no transport), tips `p`, internal substrate `si`,
external substrate `se`. One generic limiting nutrient, taken to be carbon.

**Structure** [read: Boswell et al. 2003, *Mycologist* 17:165, the authors' own plain-language
summary, which gives the balance of terms in words]

```
change in active hyphae    = hypha laid down by moving tips + reactivation − inactivation
change in inactive hyphae  = inactivation − reactivation − degradation
change in tips             = tip flux + branching from active hyphae − fusion of tips into hyphae
change in internal subst.  = translocation (active + passive) + uptake
                             − maintenance − growth cost of tips − cost of active translocation
change in external subst.  = diffusion − uptake
```

Stated in that summary: tips move in near-straight lines with small random deflections; tip
speed depends on internal substrate; branching rate is proportional to internal substrate;
uptake depends on external substrate, on internal substrate (energy for active uptake) and on
hyphal density (membrane area).

**Translocation fluxes** [secondary: Bruno et al. review, arXiv q-bio/0402004, equation 4]

```
passive (diffusive):   J_passive = −Di · m · ∂si/∂x
active (tip-driven):   J_active  = −Da · m · si · ∂p/∂x     (substrate moves up the tip-density gradient)
```

**The PDE system as I remember it** [memory: the 2003 *Bull. Math. Biol.* paper is closed
access and I could not open it; check every term before it goes into MODEL.md]

```
∂m/∂t  = v·si·p − da·m
∂m'/∂t = da·m − di·m'
∂p/∂t  = −∂(v·si·p)/∂x + b·si·m − f·m·p
∂si/∂t = ∂/∂x( Di·m·∂si/∂x − Da·m·si·∂p/∂x ) + c1·si·m·se − c2·v·si·p − c4·|Da·m·si·∂p/∂x| − c5·m·si
∂se/∂t = De·∂²se/∂x² − c3·si·m·se
```

The published abstract (seen in search results) confirms the system is "mixed
hyperbolic-parabolic" and that the authors needed a positivity-preserving, mass-conserving
scheme. That is a warning for us: naive centred differences on the tip equation go negative.

**Parameter values.** Calibrated to *R. solani* in the 2002 paper. I could not get the table.
**Unverified; no values given here.**

**Reproduces.** Colony radial growth on uniform media; growth across nutrient-free gaps fed by
translocation; acidification of the medium. The authors' reading: diffusive translocation
serves exploration, tip-directed translocation serves exploitation.

**Cost.** Five 2D fields. About five times the Edelstein cost. Fine at 256² on the CPU.

### 2.5 Falconer, Bown, White & Crawford (2005): biomass recycling [read]

**Represents.** Colony phenotype as the outcome of local uptake, remobilisation and transport.
Three biomass pools plus substrate: non-insulated biomass `bn` (can take up and spread),
insulated biomass `bi` (fixed in place), mobile biomass `n`, external substrate `s`.

**Equations** (their equation 2.4; reconstructed from the PMC page, whose layout was garbled,
so check the signs against the PDF)

```
π = n / (bn + bi)                                    mobile biomass per unit immobile
∂bi/∂t = ζ·[ ∇·(Db·∇bn) + γ·(αn·π^θ − βn·π)·bn ] + γ·(αi·π^θ − βi·π)·bi
∂bn/∂t = (1−ζ)·[ ∇·(Db·∇bn) + γ·(αn·π^θ − βn·π)·bn ]
∂n/∂t  = ∇·(Dn·∇n) − (αn·π^θ − βn·π)·bn − (αi·π^θ − βi·π)·bi + (λ1·bn + λ2·bi)·s
∂s/∂t  = ω·(sm − s) − (λ1·bn + λ2·bi)·s
Dn switches between a high and a very low value around a threshold n0
```

`α` terms immobilise mobile biomass into structure, `β` terms remobilise it (recycling), `γ` is
conversion efficiency, `ζ` the insulation rate, `λ` uptake rates, `ω` substrate replenishment.

**Parameters as used in figures** (model units, not physical): `λ1 = 0.95`, `λ2 = 0.01`,
`ζ = 0.01`, `Db = 10`, `θ = 1 or 3`, `α, β` varied between 0.1 and 0.9, `γ` 0.2 to 0.95,
`ω = 0, 0.01, 0.1`. The page gives `Db` inconsistently (10 in captions, 10⁻⁷ in text).

**Numerics.** 128×128 lattice, Crank-Nicolson with successive over-relaxation, zero-flux edges.

**Reproduces.** Explorative versus exploitative fronts, fairy-ring profiles (centre exhausted),
concentric rings when `θ > 1`, reallocation of biomass to a second resource patch.

**Why it matters to us.** It is the published mechanism for "unused links are recycled" in the
40K tier, and it produces fairy rings with four fields.

### 2.6 Boswell et al. (2007, 2008): hybrid lattice network

**Represents.** The 2003 model made discrete: hyphae are occupied edges of a lattice, tips are
particles that hop along edges, substrates are continuous quantities held at lattice sites.

**Rules.** Tip movement, branching, fusion, inactivation, uptake and translocation become
per-step probabilities derived from the PDE coefficients. Fusion happens when a tip moves onto
an occupied site. [secondary: Schnepf et al. 2008 and Davidson et al. 2011 describe the model;
the detail that the 2007 planar lattice is triangular with an edge of about 100 µm is from
**memory** and unverified.] The 2008 paper moves to three dimensions on a face-centred cubic
lattice, calibrated for *R. solani* AG4 at 30 °C [secondary: abstract seen in search results].

**Reproduces.** Network statistics in uniform and patchy media, growth through pore structure.

**Cost.** Per step proportional to tips plus active edges. The lattice gives fusion detection
for free, at the price of six (planar) or twelve (FCC) growth directions, which is visible.

### 2.7 Hopkins & Boswell (2012): lattice-free velocity-jump model

**Represents.** The same biology with the lattice removed. [secondary: abstract, plus the
description in Davidson et al. 2011, which I read.] Hyphae are straight line segments in the
plane. Uptake is Michaelis-Menten. Internal substrate diffuses along the network and is
advected toward unconnected segment ends (tips). New segment direction is a biased circular
random walk (the Fokker-Planck description of a velocity-jump process), biased by the local
concentration of a self-secreted inhibitor. Published in *Fungal Ecology* 5:124-136, not
*Physical Review E*.

**Cost.** Needs explicit neighbour search for fusion (hence spatial hashing) and a field for
the inhibitor. This is the closest published match to the plan's 40K tier.

### 2.8 Vidal-Diez de Ulzurrun et al. (2015, 2017): lattice-free 3D [secondary: abstract only]

A lattice-free, three-dimensional growth model with fungus-substrate interaction and a
sensitivity analysis of its parameters (J. Theor. Biol. 414:35-49, 2017). The open-access copy
at Ghent redirected to a login, so I have no equations. The same group's image-analysis work
supplies in-vitro network measures to compare against. Check this paper properly in Phase 2: it
is the nearest published thing to the 400K tier.

### 2.9 Fuhr et al. (2011): event-driven growth in wood [read in part]

*Physisporinus vitreus* in Norway spruce. Nodes and edges in 3D; nutrients are discrete points
(the bordered pits of the wood). One iteration picks **one** active node with probability
proportional to its "polarisation" (number of Spitzenkörper), and adds at most one edge toward
a reachable pit. Laboratory time advances by edge length divided by mean hyphal growth rate and
the number of active nodes. Mean hyphal growth rate 1 to 2 mm/day; hyphal growth unit settles
at about 350 to 550 µm. Relevance: an event-driven (Gillespie-like) scheduler, and a ready
model for wood as a discrete network of pits.

### 2.10 Dikec et al. (2022): binary-tree model of *Podospora anserina* [read]

Not a physical model but the best source of **measured branching statistics** found here.
Lattice-free 2D binary tree. Branch lengths gamma-distributed; apical branching splits a tip
into an "exploratory" and an "operating" branch at different angles; lateral branching
probability falls with segment length as `p = p0·(x/x0)^(−α)`, `p0 ≈ 1/2`, `α ≈ 2`.

| Measured | Value |
|---|---|
| Colony front speed | about 7 mm/day |
| Doubling time of apex count | 1.81 ± 0.05 h |
| Doubling time of total length | 1.75 ± 0.06 h |
| Apical branch angles (direct) | 10 ± 5° and 71 ± 5° |
| Network at end of exponential phase | about 1,500 apexes, 600 mm of hypha |

Fusion was rare in this species; most crossings in the image were overlaps, not fusions.

### 2.11 Meškauskas, Fricker & Moore (2004): the Neighbour-Sensing model [read]

**Represents.** Tips in 3D as vectors. No nutrients, no transport. Each tip senses fields
produced by the rest of the mycelium and turns accordingly. All tips obey the same rules.

**Rules** (from the 2004 colonial-growth paper and the authors' mathematical description page;
the formulas on that page are images, so the algebra below is paraphrase):

- State per hyphal section: start point, end point, growth vector, age, length, may-branch flag.
- **Density field**: every section contributes a scalar that falls off as inverse square of
  distance. Its gradient gives *negative autotropism* (tips turn away from mycelium).
- **Long-range autotropism**: a second field, optionally falling off as inverse square root of
  distance, with impact factor `Im`.
- **Galvanotropism**: a vector field parallel to each hyphal axis, magnitude inversely
  proportional to distance; tips turn parallel to neighbours. This is what makes cords.
- **Gravitropism**: tips hold a chosen angle `β` to the vertical within a tolerance, impact `Ig`.
- **Horizontal-plane tropism**: confines growth to a slab, to imitate agar or soil.
- **Substrates**: spheres with a centre, radius and signed impact, attracting or repelling.
- **Update**: new growth vector = `k` × old vector + sum of tropism vectors, renormalised, so
  tropisms change direction, not speed. `k` is the persistence factor.
- **Branching**: if local density (or the count of tips within radius `R`) is below a
  threshold, branch with probability `Pbranch` per iteration.

**Parameter set published for one run** (model units): `Pbranch = 40 %` per iteration, density
threshold 0.06, `lc = 20`, `k = 0.1`, `Ig = 0.0020`, tolerance ±5°.

**Fruiting-body shapes.** A structure resembling the young primordium of *Coprinopsis cinereus*
was grown from a flat disc of mycelium by changing two settings by hand during the run, in four
phases: (1) high gravitropic angle, weak long-range autotropism; (2) low angle, increasing
autotropism; (3) low angle, weak autotropism; (4) increasing angle, weak autotropism. The
authors are explicit that this shows such switching is *sufficient*, not that real mushrooms
do it. Hollow cones and cord-like strands come from other settings.

**Cost.** Each tip sums a field over all sections: tips × sections per iteration. The authors
say a single processor of the time could not handle the 4,000 to 5,000 tips they wanted.

### 2.12 Heaton, López, Maini, Fricker & Jones (2010): growth-induced mass flow [read]

**Represents.** Water and solute movement in a cord network (*Phanerochaete velutina*) whose
geometry is measured from time-lapse photographs. No growth rules: growth is the input.

**Equations.**

```
cord of n vessels, radius r, length l:   C = n·π·r⁴ / (8·η·l)       (Hagen-Poiseuille)
so for a cord of area a:                 C_ij = σ·a_ij / l_ij       (conductance ∝ area)
flow in a cord:                          f_ij = C_ij·(p_i − p_j)
conservation at each node:               Σ_j C_ij·(p_i − p_j) = q_i
sources and sinks:                       a cord whose volume grew from u to v over time t
                                         draws (v − u)/(2t) at each of its two end nodes;
                                         shrinking cords are sources; the inoculum balances the total
```

Written as `A·p = q` with `A` the weighted graph Laplacian. `A` is singular; fix one pressure.

**Values.** Viscosity 2 g s⁻¹ m⁻¹; vessel radius 6 µm; vessels fill a fraction λ = 0.5 of cord
area; cord diameters 48 to 480 µm. Predicted speeds: 36 % of cords above 0.1 µm/s, 4 % above
1 µm/s. Pressure gradient about 4×10⁻⁵ bar/cm per µm/s, against 4 to 5 bar of turgor: tiny.
Networks grew about two cords and two nodes per hour.

**The fact that matters most for us.** Their supplement notes that in a branching tree the
currents do not depend on conductance at all, because the boundary conditions are currents.
Flow in a tree is just "sum the demand of everything downstream".

### 2.13 Heaton et al. (2012): advection, diffusion and delivery on a network [read]

**Represents.** Concentration of a solute in every edge of a network with known flows.

```
∂q/∂t + R·q + u·∂q/∂x − D·∂²q/∂x² = 0        per edge; q = amount per unit length
D_ij = Dm + u_ij²·r_ij² / (48·Dm)             Taylor dispersion in a tube of radius r
node concentration c_i = q_ij(0,t) / S_ij     consistent across all edges at the node
```

They solve it exactly in Laplace space with a "propagation matrix" over nodes, inverted with
BiCGStab (the matrix is sparse and non-symmetric), then return to the time domain with the
Gaver-Stehfest algorithm. Values: `Dm = 3.5×10⁻⁶ cm²/s` (the tracer AIB in water), delivery
rate `R = 0.05 /day`. Conclusion: growth-induced flow is enough to explain long-distance
transport if the cords are well insulated.

**Cost for us.** Their exact method is too heavy for real time. A first-order upwind
finite-volume step on the same equation is a few operations per edge.

### 2.14 Bebber et al. (2007): what real cord networks look like as graphs [read]

*P. velutina* microcosms, digitised by hand. About **700 nodes and 900 links** after five to
six weeks. Link weight = cross-sectional area; resistance = length / area. Meshedness (alpha
coefficient) rose from near zero to 0.11 ± 0.04, and to 0.20 ± 0.05 with an added wood block.
With real cord thicknesses the network's root-to-everywhere efficiency was more than four times
that of a uniform network of the same material cost, and it resisted link removal better.
These are the target statistics for the 40K tier's cord network.

### 2.15 Electrical and excitable-medium models

Only one modelling approach turned up. Adamatzky and co-workers (2020, "On Boolean gates in
fungal colony") [read] run FitzHugh-Nagumo on a grid masked by a micrograph of an *Aspergillus
niger* colony:

```
∂u/∂t = c1·u·(u − a)·(1 − u) − c2·u·v + I + Du·∇²u
∂v/∂t = b·(u − v)
a = 0.13, b = 0.013, c1 = 0.26, Du = 1, c2 between 0.05 and 0.015 (excitable to not)
explicit Euler, Δt = 0.015, five-point Laplacian, Δx = 2, grid 1000 × 960, zero-flux edges
```

All quantities are dimensionless and chosen to produce travelling waves. Nothing is fitted to a
recording. A 2023 *Scientific Reports* paper fits FitzHugh-Nagumo dynamics to *Schizophyllum
commune* spiking [secondary: search-result abstract only]. I found no cable-equation model of a
hypha with measured membrane parameters. So the plan's "tuned per species to published spike
rates" means choosing `a, b, c` and a time scale so the model's spike interval matches a
recording; it does not mean a validated mechanism. The plan's own caution (section 11) is right.

### 2.16 Fast algorithms from elsewhere

**Physarum particle model (Jones 2010)** [read: Jones 2015 follow-up, arXiv 1511.05869; the
2010 paper itself was blocked]. Agents on a 2D lattice with a trail field. Each agent reads the
trail at three sensors (front-left, front, front-right) at offset `SO` and angle `SA`, turns by
`RA` toward the strongest, steps forward, deposits trail. The trail is blurred and decayed each
step. Published example: 200×200 lattice, 6,000 agents, `SA 22.5°`, `RA 45°`, `SO 9` pixels.
`SA 60°, RA 60°` gives networks that minimise; `SA 90°, RA 45°` breaks into islands. Sage
Jenson's GPU version [read] drops the one-agent-per-cell rule and runs 5 to 10 million
particles in real time on a GTX 1070.

It is a slime mould model: the "network" is a density of moving particles with no persistent
tubes, no tips, no branching events. It cannot be the simulation core. Two parts are worth
stealing: the three-sensor steering rule (flip its sign and it is negative autotropism at O(1)
per tip), and the idea that a bitmap can be both the picture and the collision structure.

**Tero, Kobayashi & Nakagaki (2007)** [read]. Adaptive tube network:

```
Q_ij = D_ij·(p_i − p_j) / L_ij          Poiseuille flow, D = conductivity
Σ_i Q_ij = 0  (±I0 at source and sink)  solved for pressures each step
dD_ij/dt = f(|Q_ij|) − r·D_ij           tubes with flow thicken, others decay
f(Q) = Q^μ   or   f(Q) = (1+a)·Q^μ / (1 + a·Q^μ)
```

They solve pressures with a conjugate-gradient-type method (the name is partly lost in my text
extraction) and step `D` semi-implicitly. Dead ends always vanish first. With `μ = 1` the
shortest path always survives and with `μ < 1` competing tubes both survive (both confirmed in
the text); with `μ > 1` one path survives, chosen by initial conditions [memory for this case]. This is the natural rule for "used links thicken into cords": Heaton
supplies the flows, Tero supplies the thickening law. Heaton's data give some support: flow
correlated with cord area (Spearman 0.40) and with later thickening (0.28). Weak, but positive.

**Space colonisation, DLA, L-systems, Gray-Scott** [memory; none opened]. Space colonisation
(Runions et al. 2005, 2007) grows branches toward a cloud of attractor points and deletes
attractors when reached; it gives evenly spaced, non-crossing venation. Useful as a cheap way
to make a mycorrhizal network fill a root zone, with no physics. Diffusion-limited aggregation
(Witten & Sander 1981) gives fractal clusters of the right look for nutrient-starved colonies
but has no hyphae. L-systems give branching by rewriting and cannot fuse or respond to a field
without extensions. Gray-Scott reaction-diffusion gives rings and spots and is the cheapest
"colony" that fits in a fragment shader; it is a visual stand-in, not a mycelium model.

**Existing real-time work found** [secondary: search results only]. Peter Collingridge's hyphae
sketch (Python and JavaScript: point with speed, direction, curvature; random split at 45°; no
collision; "slows noticeably" as tips multiply) [read]. MycoRust (CPU, Rust: gradient following,
branching, fusion). A WebGL *Streptomyces* pellet model in a Leiden thesis. Pentagram's "Hypha"
type tool (WebGL plus Rust). I found no open, physically grounded, real-time mycelium simulator.

## 3. Comparison table

| Model | Type | Dim. | Growth | Fusion | Transport | Real units | Cost per step | Evidence |
|---|---|---|---|---|---|---|---|---|
| Edelstein 1982 | PDE, 2 fields | 1D/2D | yes | as a rate | no | yes | grid | secondary |
| Schnepf 2008 | PDE, 2 fields | radial | yes | as a rate | no | yes, fitted | grid | read |
| Boswell 2003 | PDE, 5 fields | 2D | yes | as a rate | diffusive + tip-directed | yes | grid × 5 | partly read |
| Falconer 2005 | PDE, 4 fields | 2D | yes | no | diffusion + recycling | no | grid × 4, implicit | read |
| Boswell 2007/08 | lattice hybrid | 2D/3D | yes | by site | on lattice | yes | tips + active edges | secondary |
| Hopkins & Boswell 2012 | lattice-free graph | 2D | yes | by search | on graph | yes | tips + edges + search | secondary |
| Vidal-Diez 2017 | lattice-free graph | 3D | yes | ? | ? | ? | ? | abstract |
| Fuhr 2011 | event-driven graph | 3D | yes | no | local | yes | one event | read in part |
| Neighbour-Sensing 2004 | tip vectors + fields | 3D | yes | no | none | no | tips × sections | read |
| Heaton 2010 | flow on given graph | graph | input | given | mass flow | yes | one sparse solve | read |
| Heaton 2012 | solute on given graph | graph | input | given | advection-diffusion | yes | heavy (Laplace) | read |
| Tero 2007 | adaptive graph | graph | no | n/a | flow + thickening | no | one sparse solve | read |
| Adamatzky FHN 2020 | excitable grid | 2D | no | n/a | electrical | no | grid | read |
| Jones Physarum 2010 | particles + trail | 2D | no | n/a | emergent | no | particles + grid | follow-up read |

## 4. Algorithms and data structures for the browser

### 4.1 Two graphs, not one

The plan's "nodes are tips, branch points and fusion points; edges are straight runs" does not
survive contact with curved hyphae. Keep two levels:

- **Segments**: short straight pieces (10 to 50 µm), the geometry. Used for drawing, collision
  and uptake. A segment is created once and never moves.
- **Links**: maximal unbranched chains of segments between junctions (branch, fusion, tip). Used
  for flow, transport and electrical state.

Most segment vertices have degree 2. A network of 100,000 segments typically has only a few
thousand links. Every solver should run on links. This single choice is worth more than a Worker.

### 4.2 Typed-array layout

Structure of arrays, preallocated, append-only, indices instead of objects:

```
segments:  ax, ay, (az), bx, by, (bz): Float32      link: Int32     radius: Float32
           birth: Float32                            flags: Uint8 (active, dead, cord)
links:     nodeA, nodeB: Int32    length, area, flux, substrate, age: Float32
nodes:     firstLink: Int32 (linked list through a nextLink array), pressure, demand: Float32
tips:      segment-end position, heading (unit vector), link, state: packed, swap-remove on death
```

Roughly 40 bytes per segment: a million segments is 40 MB, which is acceptable. Never delete
from the middle of the segment arrays; mark dead and compact rarely, at a fixed step number so
it stays repeatable. Object-per-node designs cost five to ten times more memory and stall on
garbage collection.

### 4.3 Spatial hashing for fusion

Uniform grid, cell size equal to maximum segment length, so a segment touches at most two cells
in 2D (insert it by both end cells). Store as `cellHead[cell]` plus `next[segment]`: two Int32
arrays, no allocation. A tip tests its next step against segments in the 3×3 (2D) or 3×3×3 (3D)
block. Cost per tip is constant. Three things the plan does not mention:

1. **Tip step ≤ cell size**, or tips tunnel through hyphae.
2. **In 3D, two lines almost never intersect.** Fusion needs a capture radius and, to look
   right, a short-range attraction between a tip and a nearby hypha. Without it a 3D network
   never fuses.
3. **A geometric crossing is not a fusion.** In *Podospora* most crossings are overlaps (Dikec
   et al. 2022); in *A. laevis* fusion is essential to the fit (Schnepf et al. 2008). Fusion
   probability per encounter must be a species parameter.

At the 4K tier, replace the hash with a bitmap: one byte per pixel, "is there hypha here".

### 4.4 Tropism without the quadratic cost

Neighbour-Sensing sums over all sections per tip. Instead deposit each new segment's length
into a coarse density grid, blur it occasionally, and let the tip read the gradient. Cost per
tip is constant. This also *is* Boswell's `m` field, so one grid serves autotropism, uptake
scaling and the level-of-detail hand-off in section 5.4.

### 4.5 Flow on the link graph

- **Tree part.** Order links from tips inward (the order they were created, reversed, works).
  One pass sums demand toward the inoculum. Exact, linear time, no iteration.
- **Loops.** Number of independent loops = links − nodes + 1; with meshedness 0.1 to 0.2 that
  is a small fraction. Solve the full Laplacian system `A·p = q` with conjugate gradients,
  Jacobi-preconditioned, **warm-started from the previous pressures**. `A` in compressed sparse
  row form: `rowStart`, `col`, `val`. One iteration is one sparse multiply: about `2 × links`
  multiply-adds.
- **Cost estimate.** Unpreconditioned CG needs iterations of the order of the square root of
  the condition number, which for a long stringy network with a wide range of conductances can
  be thousands from a cold start. Warm-started after a small change, tens. For 10,000 links:
  about 0.1 ms per iteration, so 1 to 5 ms per warm solve (estimate). For 1,000,000 raw
  segments unsolvable per frame; for their roughly 50,000 links, 20 to 50 ms warm, so run it in
  a Worker a few times per second.
- Fix one node's pressure (the inoculum) to remove the singularity. Disconnected fragments each
  need their own reference or they break CG; track components with union-find on fusion.

### 4.6 Solute transport on links

Heaton's exact method is out. Use one finite volume per link (or per few segments on long
links), first-order upwind for advection plus diffusion between neighbours through nodes, with
perfect mixing at nodes. Stable if `Δt < min(length / |u|)` and `Δt < length² / (2D)`; sub-step
the fast links or clamp. Mass-conserving by construction, which the repeatability hash will
appreciate.

### 4.7 Substrate fields are stiff

With `D = 350 µm²/s` (Heaton's value for a small solute in water) and a 100 µm grid, explicit
diffusion is stable only for `Δt < Δx²/(4D) ≈ 7 s` in 2D and about 4.8 s in 3D. A tip moving at
7 mm/day (0.08 µm/s) takes about 20 minutes to cross one cell: 170 diffusion steps. One day of
colony time is about 12,000 diffusion steps. Options, cheapest first:

1. Make the grid coarser (500 µm gives 25 times the time step) and accept blur.
2. Treat the field as quasi-steady: a few Jacobi or red-black sweeps of the implicit equation
   per growth step. Unconditionally stable, slightly wrong in time, which nobody will see.
3. Alternating-direction implicit, or multigrid, at the 400K and 4M tiers.

Explicit diffusion with a fixed number of sub-steps per frame will silently break the "real
units" rule as soon as the user turns the speed up.

### 4.8 Rendering

- **2D canvas**: redrawing 50,000 lines per frame will not hold 60 fps. Draw only *new*
  segments onto a persistent canvas. Redraw everything only on zoom, pan or when widths change
  (budget one full redraw per second for thickening cords).
- **WebGL**: one static vertex buffer, append with `bufferSubData`. A million line segments in
  one draw call is routine. `gl.LINES` is one pixel wide on almost all hardware, so cords need
  instanced quads or tubes: two triangles per segment in 2D, a low-sided prism in 3D for the
  near field only.
- Colour by link state (flux, substrate, voltage) through a small data texture indexed by link
  id, so state changes do not touch the big vertex buffer.

### 4.9 Workers, GPUs and repeatability

- A Worker result that is applied "when it arrives" makes the run depend on machine speed.
  Apply flow results at a fixed lag in simulation steps and block if the Worker is late.
- `SharedArrayBuffer` needs cross-origin isolation headers. GitHub Pages cannot set response
  headers, so plan on transferable `ArrayBuffer`s (copy or ping-pong ownership). [memory, but
  well known; check before the 400K tier.]
- `Math.sin`, `cos`, `exp`, `pow` are not guaranteed bit-identical across JavaScript engines.
  `+ − × ÷` and `Math.sqrt` are. For a network hash that matches "on every machine", headings
  must be unit vectors rotated by table lookups or exact arithmetic, not by `Math.sin`.
- GPU floating-point results differ across vendors. A GPU-computed simulation state cannot meet
  the repeatability rule. Use the GPU for drawing and for fields whose exact bits do not feed
  back into the hashed network, or exclude those tiers from bit-exact hashing.

### 4.10 What sizes are realistic

Estimates for one core of a mid-range laptop, to be replaced by `tools/bench.js`:

| Operation | Cost | 16 ms buys |
|---|---|---|
| Tip step with hash lookup and field read | 0.3 to 1 µs | 15,000 to 50,000 tips |
| 2D field stencil | 3 to 5 ns per cell | 256² about 60 times, 512² about 15 times |
| 3D field stencil | 5 to 8 ns per cell | 64³ about 10 times, 128³ about once |
| Link transport step | about 20 ns per link | 500,000 links |
| CG iteration | about 10 ns per link | see 4.5 |

The binding limit is **live tips and field cells**, not stored edges. A million stored segments
with 20,000 live tips is feasible. A million live tips is not.

## 5. Recommendation per tier

### 5.0 Where PLAN section 4 is wrong or naive

1. **"Only tips do work each step" does not bound the cost.** Tip number doubles every 1.8 h in
   a young colony (Dikec et al. 2022). Without a rule that stops tips, the tip list itself
   explodes within a simulated day. Every engine needs density-dependent branching suppression
   and tip death or dormancy (Edelstein's sink terms, Schnepf's `nmax`), and should track
   *active* versus *inactive* hyphae as Boswell does.
2. **"An old, quiet part costs almost nothing" is false for three of the four scopes.** Transport,
   recycling and electrical activity all live on the old network, and so does rendering. It is
   true only for growth. Budget for links, not just tips.
3. **A graph is the wrong store at colony and stand scale.** The plan itself says a gram of soil
   holds hundreds of metres of hypha. The literature's answer at that scale is densities
   (Boswell, Falconer, Schnepf), not a graph. "Store a graph, not a volume" should read "store
   a graph where hyphae are resolved, and a density where they are not".
4. **"Bundle the rest into cords with summary values" is not a known method.** Cords are organs
   the fungus builds, not a coarse view of fine mycelium, and no paper found here upscales an
   explicit graph. It also collides with repeatability: if what is simulated depends on where
   the camera is, the same seed no longer gives the same network. See 5.4 for the alternative.
5. **Coarse fields are fine but stiff** (section 4.7). The plan gives no time-stepping scheme.
6. **Spatial hashing needs the three caveats in 4.3**, especially 3D capture radius and
   fusion-is-not-crossing.
7. **The "slow global solve" is mostly avoidable** (tree pass, link contraction, warm starts),
   and the electrical model is not a global solve at all: FitzHugh-Nagumo is a local update.
   What it needs is a small time step during a spike and none between spikes.
8. **The size table mixes units.** "Edges" should say segments or links. A whole real cord
   microcosm is about 900 links (Bebber et al. 2007), so the 4K tier's "1,000 edges" is either
   a complete cord network or a tiny scrap of hyphal mat. And the 4K tier is limited by bytes of
   code, not speed: it can run 100,000 pixels of hypha.
9. **"Real units" and "runs in micrometres and seconds" conflict with a fixed frame step.** Choose
   the segment length first (it sets collision accuracy), then `Δt = segment length / tip speed`,
   then sub-cycle or go implicit for everything faster.

### 5.1 4K tier: tips on a bitmap

**Approach.** Lattice-free tips, with the picture as the data structure. No graph is stored.
Steering by three-sensor sampling (Jones) with the sign flipped: turn away from hypha, toward
nutrient. Fusion is "the pixel ahead is already hypha". Branching proportional to local
nutrient (Boswell's rule, with the external field standing in for the internal one).

**State.** Tips: `x, y, heading` (Float32 arrays). `occ[W×H]` Uint8 (hypha present). `nut[W×H]`
Float32 on the same or a quarter-resolution grid. Counters for the output signals.

**Species numbers (8):** tip speed, branch rate, branch angle, wobble, sensor angle,
avoidance strength, fusion probability, uptake rate.

```
step(dt):
  for each tip i:
    L, F, R = sample(occ·avoid − nut, ahead-left, ahead, ahead-right)
    heading[i] += turn toward the lowest of L, F, R  +  wobble·rand()
    x', y' = position + unit(heading)·1px          # 1 px = segment length; dt = that / speed
    if off-canvas or nut[x',y'] < minimum: kill tip; continue
    if occ[x',y']:
        if rand() < pFuse: fusions++; kill tip; continue      # else cross over
    occ[x',y'] = 1; length++; draw pixel
    nut[x',y'] −= uptake
    if rand() < branchRate·nut[x',y']·dt:
        new tip at x',y' with heading ± branchAngle; branches++
  every k steps: nut = diffuse(nut)                 # one 5-point pass
```

**Cost.** O(tips) + O(grid / k). At 512×512 with up to about 20,000 tips: 1 to 3 ms per step.
Drawing is free (only new pixels). Core logic should minify to about 1.5 KB, leaving room for
the page, controls and the packed species.

**Honest limits.** No graph, so no loop statistics, no widths, no transport. Headings from
`Math.sin` are not bit-repeatable across browsers; use eight or sixteen fixed directions with a
table if the hash must match everywhere (that also makes it Boswell's lattice model).

### 5.2 40K tier: lattice-free graph with substrates and tree flow

**Approach.** Hopkins & Boswell's structure: line segments, a biased random walk for heading,
Michaelis-Menten uptake, internal substrate moving along the network. Add Heaton's
growth-induced flow on links, Tero's thickening law for cords, and Falconer's remobilisation
for recycling.

**State.** Section 4.2 arrays. Fields on a grid of about 128² to 256²: external substrate `se`,
hyphal density `m` (for autotropism and crowding), moisture, temperature (static maps).
Per link: internal substrate `si`, area `a`, flux `Q`, active flag, age.

```
step(dt):                                  # dt = segment length / max tip speed
  # 1. growth
  for each tip:
    s = si[link(tip)]
    if s < sMin: tip dormant; continue
    heading = k·heading − wA·grad(m) + wN·grad(se) + noise        # persistence + tropisms
    advance by v(s, moisture, temperature)·dt; when a segment length is reached:
        hit = hash.query(new segment)
        if hit and rand() < pFuse: join links, make loop, remove tip
        else: append segment, hash.insert, deposit length into m
        si[link] −= growthCost
  for each active link: with probability b·si·length·dt (reduced where m is high): new tip
  # 2. uptake and field
  for each active link: U = Vmax·se/(Km+se)·surface·dt; si += U; se −= U
  relax(se) with 2 implicit sweeps
  # 3. flow (every step: it is cheap)
  demand at each node = volume added by growth this step (Heaton)
  tree pass tips→inoculum gives Q on every tree link
  if loops exist and step % 10 == 0: warm-started CG on links corrects Q
  # 4. transport and remodelling
  for each link: upwind advect si with Q/a, diffuse with Di
  for each link: a += (f(|Q|) − r·a)·dt                    # Tero: used links thicken
  for each link with a < aMin and age > tOld: mark inactive; return fraction of biomass
                                                           # to neighbours' si (Falconer)
  # 5. life stage
  if si summed near a site > fruiting threshold and trigger met: start primordium
```

**Cost.** 20,000 to 50,000 segments, 2,000 to 5,000 links, up to about 5,000 live tips: growth
2 to 4 ms, fields 1 ms, flow and transport under 1 ms, on the main thread. Incremental canvas
drawing; full redraw about once a second for width changes.

### 5.3 400K tier: the same model in 3D, with fields, loops and spikes

**Approach.** Section 5.2 in three dimensions, lattice-free, plus: Neighbour-Sensing tropisms
read from grids (section 4.4), capture-radius fusion, the full flow solve in a Worker, and
FitzHugh-Nagumo on the link graph. Fruiting bodies as parametric shapes (as the plan says).

**State.** As 5.2 with `z`. Grids of 64³ to 96³ for `se`, `m`, water, plus a vector grid for
mean hyphal direction (the galvanotropic field that aligns hyphae into cords). Per link:
`u, w` for the electrical model. Material map (soil layer, wood, root) on the same grid.

```
main thread, step(dt):
  growth as 5.2, with heading update
     heading = k·heading − wA·grad(m) + wG·alignField + wZ·gravity/plane term + wN·grad(se)
  fusion: nearest segment within capture radius rC, probability pFuse(compatibility)
  uptake, decay of wood cells (wood density −= uptake), root exchange at root-adjacent links
  tree-pass flow every step (approximate where loops exist)
  apply Worker pressures tagged for this step (fixed lag of N steps; wait if missing)
  transport and thickening as 5.2
  electrical, sub-stepped only while any link has u above threshold:
     u += dt_e·( c1·u·(u−a)·(1−u) − c2·u·w + Σ_neighbours g·(u_nb − u) + stimulus )
     w += dt_e·b·(u − w)
  every M steps: post link graph delta and demands to Worker

worker:
  maintain CSR Laplacian of links; Jacobi-preconditioned CG, warm start, fixed iteration count
  relax 3D fields with a fixed number of red-black sweeps; return with step tag
```

Fixed iteration counts (not "until converged") keep the result independent of timing.

**Cost.** 100,000 to 300,000 segments, 10,000 to 30,000 links, up to 20,000 live tips. Main
thread 6 to 10 ms. Worker: CG at about 0.3 ms per iteration on 30,000 links, 50 iterations per
solve, a few solves per second; 64³ field sweep 1.5 to 2 ms each. Rendering by WebGL lines,
with tubes for links above a radius threshold.

**Stimulus for spikes** is a modelling choice with no literature behind it. Candidates: flux
change at a link, a tip meeting a resource, injury. Mark it `unknown` in the basis scheme.

### 5.4 4M tier: continuum truth, explicit detail

**Approach.** Do not try to store the plot as hyphae. Make a continuum model the thing that is
simulated and hashed, and make explicit hyphae a deterministic *rendering* of it.

- **Truth, layer 1: fields** on a plot grid (for example 256 × 256 × 32 cells of a few
  centimetres). Boswell's five variables per cell, with Schnepf's fitted forms for mycorrhizal
  species and Falconer's remobilisation terms. Solved in a Worker or on the GPU.
- **Truth, layer 2: the cord network** as an explicit link graph at cord scale (thousands to
  tens of thousands of links, the Bebber scale), growing by the 5.3 rules with cords as the
  unit, with Heaton flow and Tero thickening. This is where transport and electrical signals
  live, and it is small enough to solve properly.
- **Detail: hyphae near the camera.** For each grid cell in view, grow fine hyphae with the 5.3
  rules from a seed derived from (run seed, cell index), to the length density `m` the field
  says that cell holds, rooted on the cords passing through. It never feeds back, so moving the
  camera cannot change the simulation, and the same cell always shows the same hyphae.
- **Fruiting bodies by growth:** a Neighbour-Sensing tip swarm with a scheduled tropism program
  per species (gravitropic angle and long-range autotropism over time, as in the *Coprinopsis*
  primordium), using grid fields so cost is linear. A few tens of thousands of tips per
  mushroom is affordable. This is the only published hyphal-level route to shape, and its
  authors do not claim it is how mushrooms actually form; say so in the species basis.
- **Optional:** a Jones-style GPU particle layer to texture dense mycelial mats. Visual only.

```
step(dt_field):                                # minutes to hours of sim time
  worker/GPU: advance m, m', p, si, se per cell (upwind for tips, implicit for diffusion)
  cord graph: grow cord tips where p and si are high; fuse; flow solve; transport; thicken; spikes
  couple: cords exchange si with the cells they cross; fields supply uptake to cords
  fruiting: where si and triggers allow, spawn a primordium swarm; step its tips each frame
view(camera):
  for cells within radius: if not cached, synthesise hyphae(seed ⊕ cell, m[cell]); draw
  beyond: draw m as volume fog, cords as tubes
audio taps: read link flux, link voltage, tip count at the simulation rate and interpolate
```

**Cost.** Fields: 2 million cells × 5 variables; a CPU sweep is 50 to 100 ms, so run at a few
hertz in a Worker, or on the GPU (WebGL2 float textures, or WebGPU compute) at frame rate. Cord
graph as 5.3. Detail synthesis: about 1 ms per cell, cached, a few new cells per frame.
A million drawn segments is realistic; a million simulated ones is unnecessary.

## 6. Open or contested points

- **Boswell's equations and parameter values are unverified here.** Both key papers are closed
  access. The term structure is confirmed from the authors' own summary; the exact PDE system
  and every coefficient need the papers. This is the largest gap in this write-up.
- **Vidal-Diez de Ulzurrun 2017 was not read.** It may already contain what 5.3 proposes.
- **Is growth-induced mass flow the whole story?** Heaton et al. argue it suffices for
  long-distance transport in insulated cords and that active transport matters only near tips.
  Boswell's model has explicit active, tip-directed translocation. These are different
  mechanisms, and both are published. 5.2 uses mass flow in cords and could add Boswell's
  active term in fine mycelium; which dominates is not settled here (topic 4 should rule).
- **Conductance ∝ area or ∝ r⁴?** Heaton and Bebber both use area, arguing a cord is a bundle of
  similar vessels. Bebber calls it a likely minimum estimate. A single hypha is Poiseuille, r⁴.
  The engine needs both: r⁴ for a hypha, area for a cord.
- **Does flow cause thickening?** Tero's law is a slime-mould assumption. Heaton's fungal data
  show only weak correlations (0.28 to 0.51). It is a reasonable modelling choice, not a finding.
- **Fusion rates differ hugely by species** and are poorly quantified outside a few species.
- **The electrical model has no mechanistic basis in the literature found.** It is curve-matching.
- **Neighbour-Sensing fields are phenomenological.** The model names no chemical or physical
  carrier for the autotropic field; its authors say so.
- **All browser costs are estimates.** In particular CG iteration counts on real fungal graphs
  with realistic conductance ranges should be measured before fixing the 400K design.
- **Bit-exact repeatability across browsers** may be too strict a rule for the 3D tiers. Consider
  hashing coarse statistics (tip count, total length, link count) instead of raw coordinates.

## 7. Sources

Web search was cut off partway through by a shared search quota, so some items below were found
but not followed up.

1. Edelstein L. (1982). The propagation of fungal colonies: a model for tissue growth. *J. Theor. Biol.* 98:679-701. **Not read**; form taken from source 3.
2. Edelstein L., Segel L.A. (1983). Growth and metabolism in mycelial fungi. *J. Theor. Biol.* 104:187-210. **Not read**; cited only.
3. Schnepf A., Roose T., Schweiger P. (2008). Growth model for arbuscular mycorrhizal fungi. *J. R. Soc. Interface* 5:773-784. https://pmc.ncbi.nlm.nih.gov/articles/PMC2375959 **Read.**
4. Boswell G.P., Jacobs H., Davidson F.A., Gadd G.M., Ritz K. (2002). Functional consequences of nutrient translocation in mycelial fungi. *J. Theor. Biol.* 217:459-477. **Not read.**
5. Boswell G.P., Jacobs H., Davidson F.A., Gadd G.M., Ritz K. (2003). Growth and function of fungal mycelia in heterogeneous environments. *Bull. Math. Biol.* 65:447-477. doi:10.1016/S0092-8240(03)00003-X. **Not read** (closed); abstract seen in search results.
6. Boswell G.P., Jacobs H., Gadd G.M., Ritz K., Davidson F.A. (2003). A mathematical approach to studying fungal mycelia. *Mycologist* 17:165-171. https://davidmoore.org.uk/assets/fungi4schools/Reprints/Mycologist_articles/Post-16/Growth&Kinetics/V17pp165-171maths_of_kinetics.pdf **Read** (model section).
7. Bruno and co-authors (2004). Mathematical modeling of filamentous microorganisms. arXiv:q-bio/0402004. https://arxiv.org/abs/q-bio/0402004 **Read** (section on translocation; author list not checked).
8. Boswell G.P., Jacobs H., Ritz K., Gadd G.M., Davidson F.A. (2007). The development of fungal networks in complex environments. *Bull. Math. Biol.* 69:605-634. doi:10.1007/s11538-005-9056-6. **Not read** (closed).
9. Boswell G.P. (2008). Modelling mycelial networks in structured environments. *Mycol. Res.* 112:1015-1025. **Not read**; abstract seen in search results.
10. Hopkins S., Boswell G.P. (2012). Mycelial response to spatiotemporal nutrient heterogeneity: a velocity-jump mathematical model. *Fungal Ecology* 5:124-136. **Not read**; abstract seen.
11. Davidson F.A., Boswell G.P., Fischer M.W.F., Heaton L., Hofstadler D., Roper M. (2011). Mathematical modelling of fungal growth and function. *IMA Fungus* 2:33-37. https://pmc.ncbi.nlm.nih.gov/articles/PMC3317364 **Read.**
12. Falconer R.E., Bown J.L., White N.A., Crawford J.W. (2005). Biomass recycling and the origin of phenotype in fungal mycelia. *Proc. R. Soc. B* 272:1727-1734. https://pmc.ncbi.nlm.nih.gov/articles/PMC1559848/ **Read.**
13. Vidal-Diez de Ulzurrun G., Baetens J.M., Van den Bulcke J., De Baets B. (2017). Modelling three-dimensional fungal growth in response to environmental stimuli. *J. Theor. Biol.* 414:35-49. doi:10.1016/j.jtbi.2016.11.020. **Not read** (abstract only; repository copy behind login).
14. Fuhr M.J., Schubert M., Schwarze F.W.M.R., Herrmann H.J. (2011). Modelling the hyphal growth of the wood-decay fungus *Physisporinus vitreus*. arXiv:1101.1747. https://arxiv.org/abs/1101.1747 **Read in part.**
15. Dikec J. and co-authors (2022). Hyphal network whole field imaging allows for accurate estimation of anastomosis rates and branching dynamics of the filamentous fungus *Podospora anserina* (title as indexed; check). *Sci. Rep.* 12. doi:10.1038/s41598-022-16245-9. https://pmc.ncbi.nlm.nih.gov/articles/PMC9296542/ **Read**; author list and exact title not checked.
16. Meškauskas A., Fricker M.D., Moore D. (2004). Simulating colonial growth of fungi with the Neighbour-Sensing model of hyphal growth. *Mycol. Res.* 108:1241-1256. https://davidmoore.org.uk/cyberweb/images_2016/Manuscripts/Meskauskas_etal_simulating_coloniesNS02.pdf **Read.**
17. Meškauskas A., McNulty L.J., Moore D. (2004). Concerted regulation of all hyphal tips generates fungal fruit body structures. *Mycol. Res.* 108:341-353. **Not read**; described in 16 and 18.
18. Meškauskas A., Moore D. Mathematical description of the Neighbour-Sensing model. https://davidmoore.org.uk/CyberWEB/Cyber03.htm **Read** (equations are images; text only).
19. Wikipedia, Neighbour-sensing model. https://en.wikipedia.org/wiki/Neighbour-sensing_model **Read.**
20. Heaton L.L.M., López E., Maini P.K., Fricker M.D., Jones N.S. (2010). Growth-induced mass flows in fungal networks. *Proc. R. Soc. B* 277:3265-3274. https://arxiv.org/abs/1005.5305 and https://pmc.ncbi.nlm.nih.gov/articles/PMC2981926 **Read.**
21. Heaton L.L.M., López E., Maini P.K., Fricker M.D., Jones N.S. (2012). Advection, diffusion, and delivery over a network. *Phys. Rev. E* 86:021905. https://www.ma.imperial.ac.uk/~nsjones/papers/HeatonL-PREyr12~advection%20diffusion%20delivery%20network.pdf **Read.**
22. Bebber D.P., Hynes J., Darrah P.R., Boddy L., Fricker M.D. (2007). Biological solutions to transport network design. *Proc. R. Soc. B* 274:2307-2315. https://pmc.ncbi.nlm.nih.gov/articles/PMC2288531/ **Read.**
23. Tero A., Kobayashi R., Nakagaki T. (2007). A mathematical model for adaptive transport network in path finding by true slime mold. *J. Theor. Biol.* 244:553-564. https://www.iasi.cnr.it/~vbonifaci/semcn/Tero2007.pdf **Read** (model sections).
24. Jones J. (2010). Characteristics of pattern formation and evolution in approximations of Physarum transport networks. *Artificial Life* 16:127-153. doi:10.1162/artl.2010.16.2.16202. **Not read** (blocked).
25. Jones J. (2015). Mechanisms inducing parallel computation in a model of *Physarum polycephalum* transport networks. arXiv:1511.05869. https://arxiv.org/abs/1511.05869 **Read.**
26. Jenson S. Physarum. https://cargocollective.com/sagejenson/physarum **Read.**
27. Adamatzky A., Tegelaar M., Wösten H.A.B., Powell A.L., Beasley A.E., Mayne R. (2020). On Boolean gates in fungal colony. arXiv:2002.09680. https://arxiv.org/abs/2002.09680 **Read** (author list from memory; check).
28. Adamatzky A. and co-authors (2023). Multiscalar electrical spiking in *Schizophyllum commune*. *Sci. Rep.* 13. doi:10.1038/s41598-023-40163-z. **Not read**; search-result abstract.
29. Collingridge P. Hyphae simulation. https://www.petercollingridge.co.uk/explorations/hyphae-simulation/ **Read.**
30. Davidson F.A. and co-workers (1996 to 1998), reaction-diffusion models of mycelia; Runions et al. (2005, 2007) space colonisation; Witten & Sander (1981) diffusion-limited aggregation; Prusinkiewicz & Lindenmayer (1990) L-systems. **Not read; from memory.** Cite properly before relying on them.
