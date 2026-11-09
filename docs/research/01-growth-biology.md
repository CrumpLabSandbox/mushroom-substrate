# 01. Growth biology at the hyphal scale

Research agent 1 of 8, written 2026-11-09. Scope: spore to hypha to mycelium to primordium.
Fruiting-body detail, network-scale structure, transport and existing models belong to other files.

**How to read the confidence marks.** "Read" means I opened the source and the number is in it.
"Snippet" means I saw the number only in a search-result excerpt of the abstract and could not
open the paper. "Recalled" means it is from general knowledge and was not checked this session;
treat it as a lead, not a fact. The shared web-search budget ran out part-way through, so several
basidiomycete-specific questions are answered with fewer sources than I wanted (see section 5).

## 1. Summary

1. Hyphae grow only at the tip. Tip speed spans three orders of magnitude: about 5 to 30 µm/h in a
   confined brown-rot culture, 60 to 350 µm/h for typical mushroom-forming fungi on agar or soil,
   and up to 6,000 µm/h in *Neurospora crassa* at 37 °C [1][4][9][12].
2. Three linked quantities describe a growing mycelium: specific growth rate µ (per hour), hyphal
   growth unit G (µm of hypha per tip) and mean tip speed E, with E = µ·G. Colony radial rate is
   Kr = µ·w, where w is the peripheral growth zone width [1][2][3].
3. G is 35 to 682 µm in 21 moulds (mean 182 µm); about 1,000 to 1,700 µm in *Podospora anserina*.
   No basidiomycete value was found; about 70 to 120 µm is inferred for *Postia placenta* [1][8][9].
4. New tips appear at rate µ per existing tip (0.3 to 0.4 per hour in *P. anserina*). Most
   branches are lateral, about 4 to 5 lateral sites per apical one in *Postia placenta* [8][9].
5. Branch angles are near 75 to 80° with SD about 12° in monokaryon-like mycelia; dikaryons of
   *Coprinopsis cinerea* branch at 10 to 45° [7][9][10].
6. Hyphal diameter: 3 µm (monokaryon) and 7 µm (dikaryon) in *C. cinerea*; 3 µm in *P. placenta* [7][9].
7. Hyphae avoid each other at the margin (closest approach 24 to 30 µm) and fuse behind it; about
   one fusion per eight branch events in *P. anserina* [5][8]. Whether avoidance is real steering
   or only slowing is contested [11].
8. Turgor is 400 to 600 kPa; it is necessary but does not set the speed. Supply of wall vesicles
   does (38,000 vesicles per minute per tip in *N. crassa*) [4][6][13].
9. Old mycelium goes quiet (3% of marginal uptake rate), vacuolates, and is partly recycled [14][15].
10. *C. cinerea* completes spore to spore in about 2 weeks; hyphal knots are 0.2 mm [7].

## 2. Findings

### 2.1 Spore germination

- Two stages in all fungi: isotropic swelling (diameter can increase up to 4 times, mainly water
  uptake, with a sharp rise in metabolism), then polarised emergence of one or more germ tubes [16].
- Dormancy is exogenous (waiting for water, nutrients, temperature) or endogenous (needs ageing or
  a shock). Dormant spores run at roughly half normal metabolism [16].
- After emergence the germ tube accelerates to a constant maximum speed; branches appear before
  that maximum is reached, and from then on total length and tip count both rise exponentially at
  the same specific rate [2][3][17].
- Timing: *P. anserina* ascospores germinate after about 5 h at 27 °C, with a further lag of about
  5 h before exponential length growth; three initial hyphae emerge about 120° apart [8][10].
- First branches of young germlings are at about 90° to the germ tube [16].
- Basidiospores: a basidiospore gives a monokaryon (one nucleus type; in *C. cinerea* up to half of
  the compartments actually hold 2 to 3 nuclei) [7][18]. Basidiospore germination is often poor in
  the lab: below 0.5% on water agar in *Agaricus blazei*, improved by 5 to 10 min at 50 °C; first
  germination after 8 h in free water in the polypore *Rigidoporus lignosus* (both snippet only) [19].
  I found no germination-time data for oyster, shiitake, button or split gill.
- Clustered spores fuse with each other through germ tubes or short "conidial anastomosis tubes"
  (shown in *N. crassa*), so a colony often starts from several spores acting as one [5].

### 2.2 Tip growth: mechanism

- All extension is at the apex. Wall material arrives in vesicles: small ones 20 to 80 nm
  (including chitosomes, which carry chitin synthase) and large ones 80 to 200 nm [6].
- The Spitzenkörper is the cluster of vesicles just behind the apex. In *N. crassa* its vesicle
  population turns over in 20 to 40 s [13]. At maximum speed about 38,000 vesicles per minute
  (more than 600 per second) fuse with the apical membrane of each tip [6].
- Vesicle supply centre (VSC) model, Bartnicki-Garcia et al. 1989: if a point source moving at
  speed V releases N vesicles per unit time in all directions, the wall takes the "hyphoid" shape
  y = x·cot(x·V/N). Tip shape and diameter follow from N/V; moving the VSC sideways turns the
  hypha [6][13]. This is the simplest physical basis for "the tip steers by moving its Spitzenkörper".
- The new wall at the apex is plastic and rigidifies within a short distance. In *N. crassa* the
  extension zone completes its expansion in under 60 s at 25 °C [2].
- Turgor: 400 to 600 kPa in *N. crassa* by pressure probe [4][20]. A turgor of 600 kPa needs about
  250 mM more internal osmolyte than outside [20]. Growth follows the Lockhart form,
  rate = extensibility × (pressure − yield threshold) [4].
- Turgor is regulated, not a free variable: after an osmotic shock turgor and growth collapse
  within about 2 min, ion uptake restores turgor in about 10 min (permeant salt) and osmolyte
  synthesis in 60 to 90 min [4][20].
- Cytoplasm flows toward tips by mass flow at about 5 µm/s in *N. crassa* trunk hyphae (15 to 20 µm
  wide), driven by pressure gradients of only 0.05 to 10 kPa/cm, far below what a probe can
  resolve [4][20].
- Marker experiments on the basidiomycete *Rhizoctonia solani* show wall elements moving
  perpendicular to the surface as the tip expands, as expected if turgor is the driving force [21].

### 2.3 Tip extension rates

All speeds converted to µm/h for comparison. Radial colony rate on agar is close to the speed of
the leading hyphae.

| Species | Rate | Conditions | Source |
|---|---|---|---|
| *Neurospora crassa* | up to 6,000 µm/h (100 µm/min) | 37 °C | [2][12] |
| *N. crassa* colony | 2,152 µm/h | optimum temperature | [1] |
| *Mucor hiemalis* colony | 377 µm/h (mean per tip 125 ± 11; single branches 21 to 329) | 25 °C | [3] |
| *Aspergillus nidulans* colony | 127 µm/h (mean per tip 33 ± 4, branch maximum 80) | 25 °C | [3] |
| *Geotrichum candidum* colony | 132 µm/h (mean per tip 48 ± 3, branch maximum 120) | 25 °C | [3] |
| *Penicillium chrysogenum* | 75 to 76 µm/h (mean per tip 8) | 25 °C | [1][3][12] |
| *Podospora anserina* | 307 ± 18 µm/h (about 7 mm/day) | 27 °C | [10][11] |
| *Phanerochaete velutina* (cord former) | 8.4 mm/day = 350 µm/h | soil trays, ungrazed | [22] snippet |
| *Pleurotus ostreatus* | 5.6 mm/day = 233 µm/h | 22 °C, cottonseed hull bags | [23] snippet |
| *Serpula lacrymans* | 4 to 5.1 mm/day = 167 to 213 µm/h (5 to 6 mm/day in another study) | agar | [24] snippet |
| *Armillaria gallica* hyphae | 1.5 mm/day = 63 µm/h | agar | [25] snippet |
| *A. gallica* rhizomorphs | 3.5 mm/day, rising to 7.4 mm/day on stiffer gel | agar | [25] snippet |
| *Postia placenta* (brown rot) | 5.3 to 28.8 µm/h per active tip | 20 °C, 4 mm agar film under coverslip | [9] |
| *Coprinopsis cinerea* | at least 50 to 150 µm/h (inferred: nuclear migration 1 to 3 mm/h is "up to 20 times" tip growth) | — | [7] |

- The general range quoted in reviews is 10 to 100 µm/min for fast moulds [4]; mushroom-forming
  fungi sit at 1 to 6 µm/min.
- Within one mycelium tip speeds vary widely. In *M. hiemalis* hyphae present for a full hour
  extended 21 to 329 µm/h, and some branches grew faster than their own length could support, so
  the parent must feed them [3]. In *P. placenta* tip speed fits a gamma distribution
  (shape 1.51, rate 0.09 per µm/h) and only 70 to 77% of tips are active at any time, falling to
  about 50% in stationary phase [9]. In *M. hiemalis* tip speed was fitted with a half-normal
  distribution [26].
- A new branch speeds up with length and reaches full speed when it is about 400 µm
  (*A. nidulans*, *G. candidum*) or 850 µm (*M. hiemalis*) long [3].
- Leader versus branch (*N. crassa* after about 22 h): diameters 100 : 66 : 42 and speeds
  100 : 62 : 26 for leading hyphae : primary : secondary branches [27]. Wider hyphae are faster.
- Temperature changes speed through µ; it does not change extension-zone length or diameter [2].

### 2.4 Pulsed growth

- López-Franco, Bartnicki-Garcia and Bracker (1994) imaged tips every 1 to 5 s in seven species
  including the basidiomycete *R. solani*, and reported that elongation alternates fast and slow
  phases. Pulse frequency ranged from 2.7 per minute (*Fusarium culmorum*) to 13 to 14 per minute
  (*N. crassa*, *Trichoderma viride*); mean pulse amplitude 0.012 to 0.068 µm/s. Fast phases
  coincided with satellite Spitzenkörper merging into the main one [28] (abstract read; per-species
  table not accessible).
- Contested: a later time-series study argued the pulses are not statistically distinguishable
  from noise (Sampson, Lew and Heath 2003, recalled, not checked). Treat as optional detail.
- Slower rhythms exist: colony banding with a roughly 24 h period, from cyclic changes in speed
  and branching [29].

### 2.5 Hyphal diameter

- *C. cinerea*: monokaryon about 3 µm, dikaryon about 7 µm [7].
- *P. placenta*: 3 µm average by confocal microscopy [9].
- *P. anserina*: apparent width about 10 µm in images; authors quote a general range of 2 to 20 µm [11].
- *N. crassa* trunk hyphae 15 to 20 µm [4][20]. *Candida albicans* about 2 µm [30].
- Cords of *P. velutina* are bundles 48 to 480 µm across, with vessel hyphae assumed about 12 µm [31].
- Diameter is set at the tip and a hypha does not widen afterwards; thick trunks arise from wider
  tips and from bundling (well established in textbooks; not separately sourced here).

### 2.6 Septa, clamps, monokaryon and dikaryon

- Basidiomycete septa are dolipore septa with a membranous pore cap (parenthesome); ascomycetes
  have a simple pore plugged by Woronin bodies [18][32]. The dolipore normally blocks nuclei, and
  is dissolved during mating to let nuclei migrate [18].
- The apical compartment can be up to about 10 times longer than compartments behind it [32]. In
  *N. crassa* a new septum forms about 165 µm behind the tip [13]. Lew assumes about 200 µm between
  septa for flow calculations [20].
- Duplication cycle (*A. nidulans*): the apical compartment grows, its nuclei (about 50) divide
  over about 12 min, then 2 to 6 septa cut the compartment to about half its length; whole cycle
  2.1 h, equal to the biomass doubling time. Monokaryons and dikaryons run the same cycle with 1
  or 2 nuclei per compartment [33].
- Branches commonly arise just behind septa, some set time after the septum forms [27].
- Dikaryon: two compatible monokaryons fuse, nuclei migrate through the partner at 1 to 3 mm/h
  (*C. cinerea*; up to 20 times tip speed), and every compartment ends with one nucleus of each
  type [7]. The two tip nuclei sit 15 to 20 µm apart and divide in synchrony [7].
- Clamp connection: at each division a backward hook grows from the tip cell, one daughter nucleus
  passes through it, two septa form, and the hook fuses with the cell behind [7][34]. So a
  dikaryon makes one small self-fusion per compartment. No duration was found in any source read.
- Clamps are not universal; very wide hyphae and some species manage without [34].
- What changes for the simulator between the two states (*C. cinerea*): diameter 3 to 7 µm, branch
  angle 70 to 75° to 10 to 45°, and asexual spores (oidia) stop being produced by default [7].
  Only the dikaryon normally fruits [34].

### 2.7 Branching

- Kinetics. Total length L and tip number N both grow as e^(µt), so G = L/N settles to a constant
  after damped oscillations (G doubles as the germ tube grows, halves at the first branch) [3].
  Trinci's interpretation: a new branch starts when the cytoplasm volume per tip exceeds a
  critical value [3]. Equivalent statements: each tip gives rise to a new tip at rate µ; branching
  rate per unit hyphal length is µ/G = E/G².
- Measured: *P. anserina* branching rate constant 0.37 ± 0.01 per hour; tip doubling time
  2.11 ± 0.09 h; length doubling time 2.27 ± 0.03 h (so µ ≈ 0.305 per hour) [8]. From their
  tables L/N at 18 to 21 h is 0.99 to 1.67 mm per tip (my arithmetic), and µ·G ≈ 0.305 × 1,000
  ≈ 305 µm/h, matching the independently measured tip speed of 307 µm/h [8][11].
- G in 21 moulds: 35 to 682 µm, mean 182 µm (e.g. *P. chrysogenum* 48, *A. nidulans* 130,
  *N. crassa* 402, *Fusarium avenaceum* 620) [1][2]. G is strain-specific and shifts with medium [3].
- Apical versus lateral. Most branches are lateral, formed behind the tip from mature wall, which
  requires building a new apex [27]. *P. placenta*: 4 to 5 lateral branch sites per apical one [9].
  Apical branching (tip splitting) happens when vesicle supply exceeds what the apex can absorb
  (Prosser and Trinci 1979, via [1]).
- Apical dominance. The tip suppresses branching close behind it; the term covers the observed
  hierarchy of wider, faster leaders over branches [27]. In *A. nidulans* reactive oxygen species
  at the tip are implicated (Semighini and Harris 2008, title seen only) [35]. Strands, cords and
  rhizomorphs are described as increasing degrees of apical dominance [36].
- Spacing between branches along a hypha: gamma distributed. *P. placenta* gamma (shape, rate per
  µm) = (1.32, 0.022) at day 5, (1.71, 0.039) at day 7, (1.52, 0.045) at day 9; most frequent
  spacing 15 to 25 µm; means 60, 44 and 34 µm by my arithmetic [9]. *M. hiemalis* spacing is also
  gamma [26].
- Angles.
  - *P. placenta*: normal, mean 77.6°, SD 12.3°, same for apical and lateral, same at all ages [9].
  - *P. anserina* apical branching gives two daughters at unequal angles from the parent axis:
    71 ± 5° (SD 12°) and 10 ± 5° (SD 9°) by hand; 75° and 43° by automated extraction. Lateral
    branches follow the wide-angle distribution [10].
  - *N. crassa*: 90° up to about 20 h, falling to 63° after about 22 h [27].
  - *C. cinerea*: monokaryon 70 to 75°, dikaryon 10 to 45° [7].
  - *M. hiemalis*: normal distribution (values not accessible) [26].
- Branch orders: number of branches per order falls logarithmically with order [27].
  Fractal dimension of *Ashbya gossypii*: 1.94 whole colony, 1.45 at the edge [26].
- Paramorphogens (e.g. L-sorbose) and nutrient state trade speed for branching: slower and
  denser, or faster and sparser [27].

### 2.8 Tropisms and self-avoidance

- Negative autotropism: marginal hyphae turn away from neighbours. Closest approach before one
  deflects: 30 µm (*N. crassa*), 27 µm (*A. nidulans*), 24 µm (*M. hiemalis*), grown on cellophane
  so hyphae stay in one plane (Trinci et al. 1979, via [5]). Most evident at low density [5].
- Mechanism unproven: local oxygen depletion, CO2, or a secreted "staling" metabolite are the
  candidates [5][30]. All three are fields produced by hyphae, so a simulator can use one generic
  inhibitor or "density" field.
- New evidence against simple steering: in *P. anserina* trajectories, a tip approaching another
  hypha (within a cone of radius 180 µm and angle 90°) slows down, while its sideways
  reorientations are symmetric and last about one 18 min frame; no systematic turn away [11].
- Moore's Neighbour-Sensing model produces realistic colonies with a rule on branching only:
  branch with probability P when the number of segments within radius R is below a threshold [1].
- Chemotropism toward nutrients is poorly supported in true fungi; established chemical cues are
  mating pheromones, oxygen, and the self-signal used in fusion [30]. Hyphae find food mainly by
  growing everywhere and then reinforcing what succeeds.
- Other tropisms: thigmotropism (following surface ridges), galvanotropism (toward the cathode in
  *C. albicans*), both calcium dependent [30]. Mushroom tissue shows gravitropism (fruiting agent).
- Hyphae on hard or semi-solid surfaces can grow in sinusoids or spirals [30].

### 2.9 Fusion (anastomosis)

- Sequence (from *N. crassa* imaging, Hickey et al. 2002 and Glass et al. 2004, via [5]): a tip
  nears another hypha; a diffusible signal makes the target put out a short peg or branch; the
  two grow toward each other; on contact extension stops; adhesive is secreted; tips swell; wall
  dissolves; membranes merge; the pore widens and cytoplasm flows, sometimes violently.
- Three geometries: tip to tip, tip to side (via an induced peg), peg to peg [5].
- Homing uses a "ping-pong" self-signal: the two tips alternate between sending and receiving
  (Read et al. 2009, via [5]). The period is several minutes and the sensing range is of the
  order of 10 to 15 µm for germlings (recalled from Fleißner et al. 2009 and Roca et al. 2005;
  not checked this session).
- Where: fusion is a property of the colony interior. In *N. crassa* fusing hyphae are 1 to 2 cm
  behind the margin [5]; at the margin avoidance dominates and reverses to attraction as mycelium
  matures [5].
- How often: *P. anserina* anastomosis rate constant 0.05 ± 0.01 per hour against branching 0.37,
  ratio 8.1 ± 0.5. Because fusions add loops, nodes outgrow tips: nodes per tip pass 1 at about
  5 h and 10 at 26 to 29 h. About 20% of apparent crossings in a 2D image are overlaps, not
  fusions [8].
- Basidiomycetes: anastomosis occurs "very readily" [18]. In a wood-rot basidiomycete, self-fusion
  pores opened from a single contact point by local wall lysis and septa re-formed within about
  2 h ([37], snippet; attribution to Aylmore and Todd 1986 on *Trametes versicolor* is my best
  guess, not verified). Fusion frequencies in *Schizophyllum commune* were counted by Ahmad and
  Miles (1970) but the scan was unreadable to me [38].
- Compatibility. Recognition is after fusion. If the two hyphae differ at any vegetative
  incompatibility locus (7 to 11 loci in studied ascomycetes), the fused compartments seal their
  septal pores and die, leaving a "barrage" line between colonies [39]. In basidiomycetes
  plugging of dolipore septa limits the spread of the death reaction ([37], snippet). Self always
  fuses; in nature most non-self pairings of dikaryons are rejected (well-established textbook
  point; the Guidebook page read does not quantify it).
- Mating fusions between compatible monokaryons are a separate case: they succeed and are
  followed by nuclear migration at 1 to 3 mm/h [7].

### 2.10 Colony-level consequences

- Phases of a colony on a plate: lag, exponential, linear (constant Kr), deceleration [40].
- Kr = µ·w. Measured peripheral growth zone widths: *P. chrysogenum* 496 µm, *G. candidum* 420 µm,
  *A. nidulans* 660 µm, *N. crassa* 6,800 µm (5 to 6 mm of hypha feeds each *N. crassa* tip)
  [1][2][3]. The published table does not satisfy Kr = µ·w exactly (e.g. *N. crassa* gives 1,768
  against 2,152), so treat it as accurate to about 20%.
- G is the mean hypha length per tip; w is the maximum length feeding a leading tip. They are of
  similar size, with w larger [3].
- Consequence: radial rate depends on µ and on how far back the hypha can feed its tip, not on
  nutrient concentration over a wide range. Richer medium gives denser mycelium, not a faster
  front (standard result from Trinci's work; stated qualitatively in [1][27]).
- Density profile. Sparse, radially aligned, mutually avoiding leaders at the edge; branching
  fills in behind; fusion converts the interior to a net; the centre ages. In a mature
  *Aspergillus niger* colony: peripheral zone 1.5 mm (100% phosphate uptake rate), productive
  zone 2.0 mm (31%), fruiting zone 4.5 mm (6%), aged zone 3.5 mm (3%) [14].
- As the circumference grows, branches are promoted to leaders to keep marginal spacing constant [27].
- Fries's colony types for mushroom mycelia (*Boletus*, *Tricholoma*, *Amanita* forms) differ in
  when and how densely secondary branching fills in behind the leaders [1][12].

### 2.11 Ageing, autolysis and recycling

- Behind the front, compartments vacuolate and metabolic activity drops steeply (3% of marginal
  uptake in the aged zone of *A. niger*) [14].
- Carbon-starved *Paxillus involutus* (an ectomycorrhizal bolete relative) loses biomass, releases
  ammonium, chitin fragments and proteases, upregulates chitinases, peptidases and nitrogen
  transporters: autolysis, autophagy and re-uptake together. About 45% of transcripts change [15].
- In wood decayers, chitin-degrading enzymes are concentrated in older mycelium, read as nitrogen
  recovery from senescing hyphae in a nitrogen-poor substrate (Lindahl and Finlay 2006, snippet) [41].
- In *Aspergillus*, starved old hyphae fragment and thinner secondary hyphae regrow from the
  recycled carbon (snippet) [42].
- Network scale: *P. velutina* systems lose many fine links between day 8 and day 34 while main
  cords thicken ([43], snippet); *S. lacrymans* resorbs old strands, letting the colony "migrate" [36].
- No source read gives a rate constant for hyphal death or recycling. This is a gap.

### 2.12 Life cycle to the primordium (*Coprinopsis cinerea*, the best-timed case)

1. Basidiospore germinates to a monokaryon: thin (3 µm), wide-angled, simple septa, makes oidia [7].
2. Two compatible monokaryons fuse; nuclei migrate at 1 to 3 mm/h; a dikaryon with clamps forms
   (7 µm, acute branching) [7].
3. Hyphal knots: local intense branching makes a compact knot about 0.2 mm across. Knots form in
   the dark; blue light represses knot formation but is then required to go further [7].
4. Fate switch at the knot: at 22 to 28 °C with light it becomes a fruit-body initial; kept dark
   (and warm, 30 to 37 °C) it becomes a sclerotium about 0.25 mm across [7][44].
5. Initial 0.2 to 0.5 mm; tissue differentiation visible at 0.4 to 0.7 mm; mushroom outline at
   0.8 to 1.0 mm; veil at 1.5 to 2 mm; primordium 2 to 9 mm [7].
6. Initial to mature mushroom: 4 to 5 days. Whole cycle: about 2 weeks at 25 °C with a 12 h
   light/dark cycle [7]. Light doses are tiny: about 1 s at 1 lux is enough to induce [7].
7. General rule: fruiting starts where a mycelium that has accumulated reserves meets a local
   check to growth (nutrient exhaustion, an edge, cooler temperature, light) [44].

## 3. Numbers for the model

| Parameter | Value or range | Units | Species | Source | Confidence |
|---|---|---|---|---|---|
| Tip speed, fast mould | up to 6,000 | µm/h | *N. crassa*, 37 °C | [2][12] | sourced |
| Tip speed, coprophilous ascomycete | 307 ± 18 | µm/h | *P. anserina*, 27 °C | [11] | sourced |
| Tip speed, cord-forming wood decayer | 350 | µm/h | *P. velutina* | [22] | sourced (snippet) |
| Tip speed, oyster on substrate | 233 | µm/h | *P. ostreatus*, 22 °C | [23] | sourced (snippet) |
| Tip speed, dry rot | 167 to 250 | µm/h | *S. lacrymans* | [24] | sourced (snippet) |
| Tip speed, honey fungus hyphae | 63 | µm/h | *A. gallica* | [25] | sourced (snippet) |
| Rhizomorph speed | 146 to 308 | µm/h | *A. gallica* | [25] | sourced (snippet) |
| Tip speed, brown rot in thin film | 5 to 29 | µm/h | *P. placenta*, 20 °C | [9] | sourced |
| Tip speed distribution | gamma, shape 1.5 | — | *P. placenta* | [9] | sourced |
| Fraction of tips active | 0.70 to 0.77 (0.5 when stationary) | — | *P. placenta* | [9] | sourced |
| Branch length to reach full speed | 400 to 850 | µm | *A. nidulans*, *M. hiemalis* | [3] | sourced |
| Speed ratio leader : 1st : 2nd branch | 100 : 62 : 26 | — | *N. crassa* | [27] | sourced |
| Diameter ratio leader : 1st : 2nd | 100 : 66 : 42 | — | *N. crassa* | [27] | sourced |
| Hyphal diameter, monokaryon | 3 | µm | *C. cinerea* | [7] | sourced |
| Hyphal diameter, dikaryon | 7 | µm | *C. cinerea* | [7] | sourced |
| Hyphal diameter, wood decayer | 3 | µm | *P. placenta* | [9] | sourced |
| Cord diameter | 48 to 480 | µm | *P. velutina* | [31] | sourced |
| Specific growth rate µ | 0.16 to 0.39 (moulds); 0.305 | 1/h | several; *P. anserina* | [1][8] | sourced |
| µ for mushroom-forming fungi | 0.05 to 0.15 | 1/h | — | none | uncertain (my estimate) |
| Hyphal growth unit G | 35 to 682, mean 182 | µm | 21 moulds | [1][2] | sourced |
| G | 990 to 1,670 | µm | *P. anserina* | [8], my arithmetic | inferred |
| G, dense wood decayer | 70 to 120 | µm | *P. placenta* | from [9] spacing | inferred |
| Branching rate per tip | 0.37 ± 0.01 (= µ in general) | 1/h | *P. anserina* | [8] | sourced |
| Lateral : apical branch sites | 4 to 5 : 1 | — | *P. placenta* | [9] | sourced |
| Inter-branch spacing | gamma, shape 1.3 to 1.7, mean 34 to 60, mode 15 to 25 | µm | *P. placenta* | [9] | sourced |
| Branch angle | 77.6 ± 12.3 (normal) | degrees | *P. placenta* | [9] | sourced |
| Apical branch angles | 71 ± 12 and 10 ± 9 | degrees | *P. anserina* | [10] | sourced |
| Branch angle, monokaryon | 70 to 75 | degrees | *C. cinerea* | [7] | sourced |
| Branch angle, dikaryon | 10 to 45 | degrees | *C. cinerea* | [7] | sourced |
| Branch angle, young / mature colony | 90 / 63 | degrees | *N. crassa* | [27] | sourced |
| Avoidance distance | 24 to 30 | µm | *M. hiemalis*, *A. nidulans*, *N. crassa* | [5] | sourced |
| Range at which a tip slows near a hypha | up to 180 (detection cone, not a fitted range) | µm | *P. anserina* | [11] | uncertain |
| Fusion : branching rate ratio | 1 : 8.1 (0.05 vs 0.37 per h) | — | *P. anserina* | [8] | sourced |
| Fusion zone distance behind margin | 10 to 20 | mm | *N. crassa* | [5] | sourced |
| Fusion homing range | 10 to 15 | µm | *N. crassa* germlings | recalled | uncertain |
| Septum re-formation after fusion | about 2 | h | wood-rot basidiomycete | [37] | uncertain (snippet) |
| Peripheral growth zone w | 420 to 660; 6,800 | µm | moulds; *N. crassa* | [1][3] | sourced |
| w for mushroom-forming fungi | 1,000 to 4,000 | µm | — | Kr/µ with estimated µ | uncertain |
| Septum distance from tip | 165 | µm | *N. crassa* | [13] | sourced |
| Apical : intercalary compartment length | up to 10 : 1 | — | general | [32] | sourced |
| Duplication cycle | 2.1 | h | *A. nidulans* | [33] | sourced |
| Nuclear migration speed | 1 to 3 | mm/h | *C. cinerea* | [7] | sourced |
| Turgor | 400 to 600 | kPa | *N. crassa* | [4][20] | sourced |
| Turgor recovery after shock | 10 to 90 | min | *N. crassa* | [4] | sourced |
| Cytoplasmic mass flow | 5 | µm/s | *N. crassa* | [4][20] | sourced |
| Vesicle fusion rate per tip | 38,000 | 1/min | *N. crassa* | [6] | sourced |
| Spitzenkörper turnover | 20 to 40 | s | *N. crassa* | [13] | sourced |
| Growth pulse frequency | 2.7 to 14 | 1/min | 7 species | [28] | sourced, contested |
| Growth pulse amplitude | 0.012 to 0.068 | µm/s | 7 species | [28] | sourced, contested |
| Activity of aged zone | 3% of margin | — | *A. niger* | [14] | sourced |
| Colony zone widths (edge inward) | 1.5 / 2.0 / 4.5 / 3.5 | mm | *A. niger* | [14] | sourced |
| Spore swelling | up to 4× diameter | — | general | [16] | sourced |
| Germination lag | about 5 (+5 before exponential growth) | h | *P. anserina* | [8] | sourced |
| Hyphal knot size | 0.2 | mm | *C. cinerea* | [7] | sourced |
| Initial to mushroom | 4 to 5 | days | *C. cinerea* | [7] | sourced |
| Spore to spore | about 14 | days | *C. cinerea* | [7] | sourced |
| Fractal dimension, whole / edge | 1.94 / 1.45 | — | *A. gossypii* | [26] | sourced |

## 4. What this means for the simulator

Ordered from what fits in 4 KB to what belongs in the 4 MB tier.

**Level 0. The minimum that grows like a fungus (4K).**

1. State: a list of tips (position, heading) and a list of segments. Only tips do work.
2. Each tip advances at speed E along its heading with a small random heading wobble.
3. Branching: each tip spawns a new tip at rate µ = E/G. Place it on the hypha behind the tip (not
   at the tip) and give it heading = parent heading ± θ, θ drawn from normal(θ0, 12°). This single
   rule reproduces exponential tip growth and a constant G.
4. Crowding: sample a coarse density grid; suppress branching where density is above a threshold
   (the Neighbour-Sensing rule) and slow the tip when another hypha is within about 30 µm ahead.
5. Fusion: if a tip comes within one hyphal diameter of a segment, stop the tip and record an
   edge. Gate it so that it only happens when local density is high (i.e. behind the front).
6. One nutrient field; tip speed and branching rate scale with local nutrient; tips deplete it.
7. Four species numbers do most of the work: E, G, θ0, diameter. Suggested packed defaults:
   fast explorer (E 350 µm/h, G 1,000 µm, θ0 45°), dense exploiter (E 30 to 100 µm/h, G 100 µm,
   θ0 78°), monokaryon versus dikaryon switch (θ0 72° to 30°, diameter 3 to 7 µm).

**Level 1. Correct kinetics and variation (40K).**

8. Lateral branches start slow and accelerate to full speed over the first 400 to 850 µm of
   their own length; speed and diameter fall with branch order (100 : 62 : 26 and 100 : 66 : 42).
9. Draw each tip's speed from a gamma distribution (shape about 1.5); keep about 25% of tips
   dormant at any time, able to restart.
10. Use two branch types: lateral (80%) at the wide angle, and apical splitting (20%) producing
    one daughter near 10° and one near 70°.
11. Draw inter-branch spacing from a gamma distribution (shape 1.3 to 1.7) instead of a constant
    rate; this avoids branches unrealistically close together.
12. Feeding distance: a tip's speed depends on the active hyphal length within w behind it
    (E = µ × min(length available, w)). This gives the lag, exponential and linear phases and
    makes Kr = µ·w emerge instead of being imposed.
13. Promote a branch to leader status (full speed, wider) when the gap between neighbouring
    leaders at the margin exceeds a set spacing.
14. Life-stage flags per mycelium: monokaryon or dikaryon; compatible meeting converts a
    monokaryon at a front moving 1 to 3 mm/h; only dikaryons make knots.
15. Ageing: segment activity decays with distance behind the front (to about 3% at 5 to 10 mm);
    unused segments are deleted and a fraction of their mass returns to the nearest active hypha.
16. Hyphal knot rule: where density, stored resource and a growth check coincide, start an
    aggregate of 0.2 mm; light and temperature choose between initial and sclerotium.

**Level 2. Mechanism (400K and 4M).**

17. Replace the density proxy for avoidance with a diffusing inhibitor (or oxygen deficit) field
    released by all hyphae; tips slow and branch less at high concentration, and optionally steer
    down the gradient (keep the steering strength as a parameter because the evidence is mixed).
18. Fusion with homing: within 10 to 15 µm, the tip turns toward the nearest competent hypha and
    the target grows a peg toward it; tip-to-tip, tip-to-side and peg-to-peg all allowed; fusion
    takes minutes and is followed by a flow adjustment; septa re-form within about 2 h.
19. Compatibility: each individual carries a genotype tag; fusion between different tags kills
    the fused compartments and seals neighbours (a barrage); same tag merges networks.
20. Septa and compartments: place a septum about 150 to 200 µm behind each tip; apical
    compartment up to 10 times longer than the rest; branches emerge just behind septa; in
    dikaryons draw a clamp at each septum. Septa can be closed to isolate damaged or dying parts.
21. Tip speed from supply: vesicle production proportional to active cytoplasm within w, delivered
    to tips by flow (about 5 µm/s); tip speed = supply/(wall area per unit length); apical
    branching when supply exceeds tip capacity. Turgor (400 to 600 kPa) as a slow regulated
    variable that stops growth when it collapses (drought, osmotic shock) and recovers in 10 to
    90 min.
22. Optional fast detail for audio: pulsed tip advance at 3 to 14 pulses per minute, and
    Spitzenkörper vesicle turnover on a 20 to 40 s cycle. Mark as contested.
23. Tip shape for close-up rendering: the hyphoid curve y = x·cot(x·V/N).

**Validation targets from this file:** G constant after start-up; exponential then linear growth;
Kr ≈ µ·w; nodes per tip passing 1 then 10 as fusion accumulates; fractal dimension near 1.5 at the
edge and near 2 in the interior; branch-angle histogram matching the species.

## 5. Open or contested points

- **Is self-avoidance steering or just slowing?** Classic work reports deflection at 24 to 30 µm;
  2025 trajectory analysis in *P. anserina* finds deceleration and unbiased turning. The signal
  (oxygen, CO2, metabolite) has never been identified [5][11][30].
- **Do tips pulse?** Reported in 1994 across seven species [28]; disputed later (recalled, not
  re-read). Do not build anything essential on it.
- **Does turgor drive growth?** Accepted for true fungi, but oomycetes can grow with little
  measurable turgor and *Saprolegnia* speed is flat between 100 and 300 kPa [6][20]. For
  basidiomycetes there are essentially no direct turgor measurements in what I read.
- **Basidiomycete G, w and µ are not sourced.** Every measured G and w here is from moulds or
  *P. anserina*. Values for mushroom-forming fungi in the table are inferences and need either a
  source from the other agents or calibration against radial growth rates.
- **Tip speeds for cultivated mushrooms** (button, shiitake, oyster on agar) were not found as
  primary data. Only substrate colonisation rates from snippets.
- **Fusion frequency in basidiomycetes** is not quantified in anything I could read. The 1 : 8
  fusion to branch ratio is from an ascomycete in a 2D plate.
- **Clamp formation time, basidiomycete compartment length, basidiospore germination times**
  for the flagship species: not found.
- **Death and recycling rates**: qualitative only.
- **Branch angle in *P. placenta*** did not change with age, but in *N. crassa* it fell from 90°
  to 63°; whether angle should be age-dependent is species-specific.
- **The Guidebook's Kr = µ·w table** is internally inconsistent by up to 20%.
- The *P. placenta* tip speeds (5 to 29 µm/h) are far below agar radial rates for comparable
  fungi and probably reflect the confined imaging chamber; use its geometry statistics, not its
  speed, as typical.

## 6. Sources

Status: **read** = opened and extracted this session; **abstract** = only the abstract was
accessible; **snippet** = seen only in a search-result excerpt; **cited** = known only through
another source.

1. Moore D, Robson GD, Trinci APJ (2019–2020). *21st Century Guidebook to Fungi*, 2nd ed., section 4.9 Growth kinetics (includes Oliver and Trinci 1985 table; Neighbour-Sensing model). https://davidmoore.org.uk/21st_Century_Guidebook_to_Fungi_PLATINUM/Ch04_09.htm — read. Also the older page https://davidmoore.org.uk/Sec02_02.htm (Bull and Trinci 1977 G table) — read.
2. Same book, section 4.4 Mycelium growth kinetics (Steele and Trinci 1975; Bull and Trinci 1977). https://davidmoore.org.uk/21st_Century_Guidebook_to_Fungi_PLATINUM/Ch04_04.htm — read.
3. Trinci APJ (1974). A study of the kinetics of hyphal extension and branch initiation of fungal mycelia. *J. Gen. Microbiol.* 81:225–236. https://www.davidmoore.org.uk/21st_Century_Guidebook_to_Fungi_PLATINUM/REPRINT_collection/Trinci_kinetics_hyphal-extension1974.pdf — read (text extracted from the PDF; parts of tables 1 and 2 were garbled and only unambiguous values are used).
4. Lew RR (2011). How does a hypha grow? The biophysics of pressurized growth in fungi. *Nat. Rev. Microbiol.* 9:509–518. doi:10.1038/nrmicro2591. Author manuscript: https://zenodo.org/records/941380 — read.
5. Guidebook sections 4.10 Autotropic reactions and 5.17 Hyphal fusions (report Trinci et al. 1979; Hickey et al. 2002; Glass et al. 2004; Read et al. 2009). https://davidmoore.org.uk/21st_Century_Guidebook_to_Fungi_PLATINUM/Ch04_10.htm and .../Ch05_17.htm — read. The primary papers were not read (Trinci et al. 1979 is a scanned PDF I could not extract).
6. Guidebook sections 5.1 and 5.16 Cell biology of the hyphal apex. .../Ch05_01.htm, .../Ch05_16.htm — read.
7. Kües U (2000). Life history and developmental processes in the basidiomycete *Coprinus cinereus*. *Microbiol. Mol. Biol. Rev.* 64:316–353. https://pmc.ncbi.nlm.nih.gov/articles/PMC98996 — read (first 200,000 characters of the page).
8. Dikec J, Olivier A, Bobée C, D'Angelo Y, Catellier R, David P, Filaine F, Herbert S, Lalanne C, Lalucque H, Monasse L, Rieu M, Ruprich-Robert G, Véber A, Chapeland-Leclerc F, Herbert E (2020). Hyphal network whole field imaging allows for accurate estimation of anastomosis rates and branching dynamics of the filamentous fungus *Podospora anserina*. *Sci. Rep.* 10:3131. https://pmc.ncbi.nlm.nih.gov/articles/PMC7035296 — read (author list from memory of the paper header; check before formal citation).
9. Du H, Lv P, Ayouz M, Besserer A, Perré P (2016). Morphological characterization and quantification of the mycelial growth of the brown-rot fungus *Postia placenta* for modeling purposes. *PLoS ONE* 11:e0162469. https://pmc.ncbi.nlm.nih.gov/articles/PMC5014427/ — read.
10. Ledoux C, Chapeland-Leclerc F, Ruprich-Robert G, Bobée C, Lalanne C, Herbert E, David P (2022). Prediction and experimental evidence of the optimisation of the angular branching process in the thallus growth of *Podospora anserina*. *Sci. Rep.* 12. doi:10.1038/s41598-022-16245-9. https://pmc.ncbi.nlm.nih.gov/articles/PMC9296542/ — read (author order not verified).
11. Chassereau T, Chapeland-Leclerc F, Herbert E (2025). Direct evidence of apex–hypha interactions during vegetative growth of fungal thallus via comprehensive network and trajectory extraction. arXiv:2507.06280v1 (preprint, not peer reviewed as far as I know). https://arxiv.org/html/2507.06280v1 — read.
12. Guidebook section 4.3 The fungal lifestyle: colony formation. .../Ch04_03.htm — read.
13. Riquelme M, Aguirre J, Bartnicki-García S, et al. (2018). Fungal morphogenesis, from the polarized growth of hyphae to complex reproduction and infection structures. *Microbiol. Mol. Biol. Rev.* 82:e00068-17. https://pmc.ncbi.nlm.nih.gov/articles/PMC5968459 — read in part (first 200,000 characters; the fusion section was not reached).
14. Guidebook section 4.6 Morphological differentiation of fungal colonies (A. niger zone table). .../Ch04_06.htm — read.
15. Ellström M, Shah F, Johansson T, Ahrén D, Persson P, Tunlid A (2015). The carbon starvation response of the ectomycorrhizal fungus *Paxillus involutus*. *FEMS Microbiol. Ecol.* 91(4). doi:10.1093/femsec/fiv027 — abstract.
16. Guidebook section 4.2 Spore germination and dormancy. .../Ch04_02.htm — read.
17. Guidebook section 4.5 Colony growth to maturity. .../Ch04_05.htm — read.
18. Guidebook section 7.1 Compatibility and the individualistic mycelium. .../Ch07_01.htm — read.
19. Basidiospore germination snippets: a study on *Agaricus blazei* spore germination in *Mushroom Science and Biotechnology* 16(2) (J-STAGE), and a study on *Rigidoporus lignosus* basidiospores (dl.nsf.gov.lk) — snippet only; authors and years not verified.
20. Lew RR (2019). Biomechanics of hyphal growth. In *The Mycota VIII: Biology of the Fungal Cell*, 3rd ed., pp. 83–94. Author manuscript: https://zenodo.org/records/4432540 — read.
21. Bartnicki-Garcia S, Bracker CE, Gierz G, López-Franco R, Lu H (2000). Mapping the growth of fungal hyphae: orthogonal cell wall expansion during tip growth and the role of turgor. *Biophys. J.* 79:2382–2390. https://pmc.ncbi.nlm.nih.gov/articles/PMC1301125 — abstract (author list recalled).
22. Study of *Folsomia candida* grazing on *Phanerochaete velutina* mycelial development (Cardiff group; ORCA record https://orca.cardiff.ac.uk/id/eprint/62636/) — snippet only; the record returned HTTP 403. Authors and year not verified.
23. Hu et al. (2023), *Horticulturae*, on temperature and *Pleurotus ostreatus* bag cultivation — snippet only.
24. *Serpula* growth-rate studies: one in *Zeitschrift für Mykologie* 69 (2003) 287–298, and "Modelling the effect of temperature, water activity and pH on the growth of *Serpula lacrymans*" (2011/2012) — snippet only.
25. Yafetto L, Davis DJ, Money NP (2009). Biomechanics of invasive growth by *Armillaria* rhizomorphs. *Fungal Genet. Biol.* 46 — snippet only (journal and volume recalled).
26. Guidebook older page 2.4 Describing branching patterns (Hutchinson et al. 1980; Obert et al. 1990). https://davidmoore.org.uk/Sec02_04.htm — read. Hutchinson SA, Sharma P, Clarke KR, Macdonald I (1980) *Trans. Br. Mycol. Soc.* 75:177–191 itself — cited only.
27. Guidebook section 4.11 Hyphal branching (McLean and Prosser 1987; Trinci, Wiebe and Robson 1994). .../Ch04_11.htm — read.
28. López-Franco R, Bartnicki-Garcia S, Bracker CE (1994). Pulsed growth of fungal hyphal tips. *Proc. Natl Acad. Sci. USA* 91:12228–12232. https://pmc.ncbi.nlm.nih.gov/articles/PMC45410 — abstract (full text is a scanned PDF).
29. Guidebook section 9.2 Mycelial differentiation. .../Ch09_02.htm — read.
30. Brand A, Gow NAR (2009). Mechanisms of hypha orientation of fungi. *Curr. Opin. Microbiol.* 12:350–357. https://pmc.ncbi.nlm.nih.gov/articles/PMC2728830 — read.
31. Heaton LLM, López E, Maini PK, Fricker MD, Jones NS (2010). Growth-induced mass flows in fungal networks. *Proc. R. Soc. B* 277:3265–3274. https://pmc.ncbi.nlm.nih.gov/articles/PMC2981926 — read.
32. Guidebook section 4.12 Septation. .../Ch04_12.htm — read.
33. Guidebook section 4.7 Duplication cycle in moulds (Fiddy and Trinci 1976). .../Ch04_07.htm — read.
34. Guidebook section 7.4 The dikaryon. .../Ch07_04.htm — read. Also Wikipedia, "Clamp connection" — read, used only for the step order.
35. Harris SD (2008). Branching of fungal hyphae: regulation, mechanisms and comparison with other branching systems. *Mycologia* 100:823–832. doi:10.3852/08-177 — abstract/snippet. Semighini CP, Harris SD (2008) on reactive oxygen and apical dominance in *A. nidulans* — cited only.
36. Guidebook section 9.7 Linear structures: strands, cords, rhizomorphs and stipes. .../Ch09_07.htm — read.
37. A 1986 *J. Gen. Microbiol.* 132 paper on self-fusion cytology in a wood-rotting basidiomycete (https://mic.microbiologyresearch.org/content/journal/micro/10.1099/00221287-132-3-581, HTTP 403) and a companion on non-self fusions — snippet only. Probably Aylmore RC and Todd NK on *Coriolus (Trametes) versicolor*; attribution not verified.
38. Ahmad SS, Miles PG (1970). Hyphal fusions in the wood-rotting fungus *Schizophyllum commune*. I. The effects of incompatibility factors. *Genet. Res.* doi:10.1017/S0016672300001336 — located but unreadable (scanned PDF); year recalled.
39. Guidebook section 7.5 Vegetative compatibility. .../Ch07_05.htm — read.
40. Guidebook section 4.5 (phases of colony growth, after Trinci 1969) — read; same URL as [17].
41. Lindahl BD, Finlay RD (2006) on chitinolytic enzymes in older mycelium of wood-decay fungi; and a review in *Phytoprotection* 86(3) (erudit.org, blocked by a bot check) — snippet only.
42. Leiden University theses on carbon starvation and autophagy in *Aspergillus niger* — snippet only.
43. Cardiff group paper (2008) on collembola grazing and network change in cord-forming fungi — snippet only.
44. Guidebook section 9.8 Globose structures (Moore 1981 on *C. cinerea* sclerotia versus initials; Moore 1998). .../Ch09_08.htm — read.

Sources I looked for and could not open: Fricker, Heaton, Jones and Boddy (2017) "The Mycelium as
a Network" (Cardiff repository, HTTP 403); Schmieder et al. (2019) on *C. cinerea* in microfluidic
devices (CORE, HTTP 403); Glass et al. (2004) and Hickey et al. (2002) on fusion; Hutchinson et
al. (1980) on *Mucor* branch statistics; Steele and Trinci (1975).
