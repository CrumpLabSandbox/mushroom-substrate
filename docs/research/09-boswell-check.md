# Check of the growth-model equations against the papers

2026-11-09. Report 3 ([03-models.md](03-models.md), section 2.4) wrote the Boswell five-variable
model from memory because the papers were closed access. Matt supplied the PDFs. This note
records what the papers actually say, what was wrong, and what it means for the engines.

**Papers read** (local copies in `docs/papers/`, which is not committed because the papers are
copyrighted):

1. Boswell, Jacobs, Davidson, Gadd & Ritz (2002). Functional consequences of nutrient
   translocation in mycelial fungi. *J. Theor. Biol.* 217:459–477. Model, calibration and
   results sections read.
2. Boswell, Jacobs, Davidson, Gadd & Ritz (2003). Growth and function of fungal mycelia in
   heterogeneous environments. *Bull. Math. Biol.* 65:447–477. Model, Table 1 and numerical
   method read.
3. Boswell, Jacobs, Ritz, Gadd & Davidson (2007). The development of fungal networks in complex
   environments. *Bull. Math. Biol.* 69:605–634. Model construction and calibration read.
4. Hopkins & Boswell (2012). Mycelial response to spatiotemporal nutrient heterogeneity: a
   velocity-jump mathematical model. *Fungal Ecology* 5:124–136. Model, Table 1 read.
5. Fricker, Heaton, Jones & Boddy (2017). The mycelium as a network. *Microbiology Spectrum*.
   Only searched for specific figures so far; not read through. See section 6.

**How they were read.** As text extracted from the PDFs, not as page images (the page renderer
is not installed on this machine). Extraction flattens superscripts, so "10⁷" arrives as "107".
Exponents below are reconstructed from context and from the unit checks shown; they agree across
the papers where the same parameter appears, but anyone freezing a number should look at the
page.

## 1. The model, as published

Five densities over the plane: active hyphae `m`, inactive hyphae `m′`, tips `p`, internal
substrate `si`, external substrate `se`. From the 2003 paper, equations 11a to 11e:

```
∂m/∂t  = |v·si·p·∇m + Dp·si·∇p| − da·m
∂m′/∂t = da·m − di·m′
∂p/∂t  = ∇·(v·si·p·∇m + Dp·si·∇p) + b·si·m − f·m·p
∂si/∂t = ∇·(Di·m·∇si − Da·m·si·∇p) + c1·si·m·se
         − c2·|v·si·p·∇m + Dp·si·∇p| − c4·|Da·m·si·∇p|
∂se/∂t = De·∇²se − c3·si·m·se
```

with the fluxes

```
tips:                  Jp    = −v·si·p·∇m − Dp·si·∇p
passive translocation: Jpas  = −Di·m·∇si
active translocation:  Jact  =  Da·m·si·∇p
```

In words:
- Hypha is laid down at the rate tips move (the size of the tip flux). Active hypha becomes
  inactive at rate `da`; inactive hypha degrades at rate `di`.
- Tips drift **down the gradient of hyphal density** (away from existing mycelium) at a speed
  proportional to internal substrate, with a small random spread. They do not move at all where
  internal substrate is zero.
- Tips are created by branching at a rate proportional to internal substrate and hyphal density,
  and lost by fusion at a rate proportional to hyphal density × tip density.
- Uptake is `c1·si·m·se`: it needs internal substrate (to power it), hypha (surface) and
  external substrate. It is not Michaelis-Menten. The medium loses `c3·si·m·se`, with
  `c1 < c3`, so uptake is 90% efficient at the calibrated values.
- Growth costs `c2` per unit of tip movement. Active translocation costs `c4` per unit moved.
  Passive translocation is free.

The 2002 paper is the same model in one dimension, with the tip flux simply `v·si·p` and no
spread term.

## 2. What the from-memory version got wrong

| Item | Report 3, from memory | Published |
|---|---|---|
| Hypha creation | `v·si·p` | `\|v·si·p·∇m + Dp·si·∇p\|`: the size of the whole tip flux (the simple form is the 1D 2002 model) |
| Tip movement | plain advection `−∂(v·si·p)/∂x` | drift down the hyphal-density gradient plus a spread term |
| Maintenance | a term `−c5·m·si` in the `si` equation | **no maintenance term** in the 2002 or 2003 equations; the 2002 paper says maintenance is folded into the growth cost `c2`. A separate maintenance cost `c5` appears only in the 2007 lattice model, as a fixed amount per length per time |
| Growth cost | `c2·v·si·p` | `c2·\|tip flux\|` (same idea, correct flux) |
| Parameter values | none | Table below |
| 2007 lattice spacing | "100 µm, from memory" | Confirmed: each cell represents 0.1 mm in the simulations. The lattice is triangular (tips, hyphae) inside a hexagonal one (substrate), which gives 60° branching |

The structure in words (from the *Mycologist* summary the agent did read) was right.

## 3. Calibrated values (*Rhizoctonia solani* on 2% glucose mineral salts agar, 30 °C)

From the 2003 paper, Table 1. Exponents reconstructed as explained above.

| Symbol | Meaning | Value |
|---|---|---|
| m0 | initial active hyphae | 100 cm of hypha per cm² |
| p0 | initial tips | 100 per cm² (the 2002 paper uses 500) |
| si0 | initial internal substrate | 4 × 10⁻⁵ mol glucose per cm² |
| se0 | external substrate | 3 × 10⁻⁵ mol glucose per cm² |
| v | tip drift coefficient | 5 cm⁵ day⁻¹ mol⁻¹ (2D form) |
| Dp | tip spread coefficient | 10⁻⁵ cm⁴ day⁻¹ mol⁻¹ |
| da | inactivation rate | 0.5 per day |
| di | degradation rate | 0 (none seen in 15 h) |
| b | branching | 10⁷ branches per cm hypha per day per (mol per cm²) |
| f | fusion | 10 fusions per cm of hypha per day |
| c1 | uptake into the fungus | 9 × 10² cm mol⁻¹ day⁻¹ |
| c3 | loss from the medium | 10³ cm mol⁻¹ day⁻¹ |
| c2 | cost of growth | 10⁻⁷ mol per cm per tip |
| c4 | cost of active translocation | 10⁻⁸ per cm |
| Di | passive translocation | 10⁻² cm³ day⁻¹ |
| Da | active translocation | 10⁻⁵ cm³ day⁻¹ per tip in Table 1; the 2002 paper found the best fit to uniform-medium growth with Da = 0 |
| De | glucose diffusion in agar | 0.3456 cm² day⁻¹ = 4 × 10⁻⁶ cm² s⁻¹ = 400 µm² s⁻¹ (Olsson 1995) |
| λ | inoculum radius | 0.2 cm |

Checks and consequences:
- **Unit check on b.** `b·si` at si0 is 10⁷ × 4 × 10⁻⁵ = 400 branches per cm of hypha per day,
  about one branch per 25 µm per day. Plausible for a dense mould at 30 °C, which supports
  reading "107" as 10⁷.
- **Colony speed.** The 2003 paper derives a front speed of about 0.6 cm per day (250 µm/h) from
  these values and reports it matches the experiment.
- **Hyphal length per tip at the inoculum edge:** 100 cm ÷ 100 to 500 tips = 2 to 10 mm. This is
  a count on a young colony margin, not a hyphal growth unit measured the usual way.
- **Translocation speed.** The 2002 paper chose `Di` so a particle moves about 1 mm per hour,
  matching measured nuclear movement and cytoplasmic streaming.
- **How the values were obtained.** Tip speed, branching and fusion were counted on enlarged
  images after 15 hours; the paper calls the branching and fusion estimates "crude". `c1`, `c3`
  and `c2` are rough estimates from the assumption that a colony uses substrate about as fast as
  it takes it up. `c4` is "a working hypothesis". Only `De` is a literature measurement.

From the 2007 lattice paper (figure 2 caption), in that model's own lattice units: v = 10⁵,
Dp = 10⁴, b = 10⁶, Di = De = 0.3456, c1 = 10, c2 = 10⁻⁷, c3 = 10², c4 = 10⁻⁸, c5 = 10⁻⁹,
ω = 10⁻¹³. These are not directly comparable with the table above.

## 4. The lattice-free version (Hopkins & Boswell 2012)

This is the model the 40K design follows, and the paper confirms the structure report 3 gave.
Details now sourced:

- **Segments** of 0.05 mm, each holding an internal substrate concentration. Time step 0.01 day.
- **Steering.** The biomass emits an inhibitor that diffuses (`∂C/∂t = DC·∇²C + c3·B`). A tip
  either keeps its heading or turns by π/12 (15°), with the odds biased toward lower inhibitor.
  This is a biased random walk on heading, not three-sensor steering.
- **Extension** needs internal substrate above a threshold (the cost of one segment). The
  remainder is split between the old and new segment.
- **Branching** from the end of an existing segment (sub-apical), with probability
  `b·si·Δt` when `si` is above a threshold. Branch angle drawn from a normal distribution with
  mean 0.44π (79°) and standard deviation π/18 (10°), either side with equal chance.
- **Fusion.** A tip that meets a segment stops at the first intersection and a connection is
  made. Always: there is no fusion probability.
- **Uptake** per segment: `c1 · si/(c2 + si) · se · Δt`. It saturates in *internal* substrate
  and is linear in external substrate. A segment has a maximum capacity.
- **Translocation** between connected segments: a diffusive part `Tp·(si_k − si_j)` and a
  metabolically driven part toward the nearest tip, where "nearest" is the number of segments
  through the network, found by a breadth-first pass from all tips each step.
- **Values:** uptake coefficient 600, uptake constant 4 × 10⁻⁹, passive translocation 1 (same
  order as external diffusion), active translocation 20, initial `si` 4 × 10⁻⁹ and `se`
  3 × 10⁻⁸ mol per mm², capacity 6 × 10⁻⁸ mol per mm². Several are marked "assumed" in the
  paper's own table: the extension and branching thresholds, the inhibitor's diffusion and
  production rates, and the capacity.
- **Cost.** Each run took under an hour in C++ on a 2010 desktop, for a network a few
  millimetres across.

## 5. What this changes

1. **MODEL.md section 4 is no longer blocked on closed-access equations.** It has been revised
   to the published forms: uptake needs internal substrate; maintenance is a fixed cost per
   length with an inactivation threshold (2007); translocation has a passive part and a
   tip-directed part.
2. **Steering toward nutrient is not supported.** The 2003 paper states that tips of most
   mycelial fungi do not generally respond to external nutrient gradients, and both models steer
   tips away from *biomass* (the density gradient, or an inhibitor). The 4K engine steers on
   `A·occ − nut`. Its nutrient term is defensible only as a stand-in for the crowding field,
   because nutrient is low exactly where hypha has been laid. MODEL.md now says so. From 40K up,
   steering uses a density or inhibitor field and never the nutrient field.
3. **Fusion.** In the lattice-free model every meeting fuses. The 4K fusion probability is a
   tuning value with no support here; the growth-biology report's observation that hyphae also
   cross is the only reason to keep it below 1.
4. **Branch angle.** A sourced distribution to use as a default: 79° ± 10°, close to the 78° ±
   12° measured for *Rhodonia placenta*.
5. **The values are for a mould-like soil fungus, not a mushroom former.** *R. solani* is a
   basidiomycete but makes no mushroom, and these are one strain on rich agar at 30 °C. They are
   a tested starting point for the model's internal coefficients, not species data.
6. **A caution on cost.** The published lattice-free model took up to an hour per run for a
   colony a few millimetres across. The 40K engine needs the two-graph layout and the cheaper
   flow pass in the plan to be interactive; that part is our design, not theirs.

## 6. Fricker et al. 2017: figures found so far

Not read through. A search for rates turned up:

- Translocation velocities: more than 20 mm/h in *Armillaria*; 10 to 50 mm/h, and by other
  reports 20 to 30 cm/h, in *Serpula*; 20 to 100 mm/h in *Phanerochaete velutina* depending on
  how far cords have formed. Water transport 27 cm/h in *Suillus bovinus* and a mean of
  148 cm/h in *Serpula lacrymans*. Nuclei carried by mass flow reach 4 mm/h.
- Mass fractal dimension in 24 × 24 cm soil trays runs from about 1 (linear rhizomorphs of
  *Armillaria*, *Megacollybia platyphylla*) to nearly 2 (dense *Hypholoma fasciculare*,
  *Stropharia caerulea*), and falls with time as cords form and fine hyphae die back.

This review should be read in full before the 40K engine is tuned. It is the main source for
network structure and was one of the papers reports 1 and 2 could not open.
