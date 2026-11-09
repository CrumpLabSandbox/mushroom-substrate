# 10. Fricker, Heaton, Jones & Boddy (2017), "The Mycelium as a Network"

Source: Microbiology Spectrum 5(3): FUNK-0033-2017, doi:10.1128/microbiolspec.FUNK-0033-2017.
Read in full from a text extraction (32 pages; body on pages 1 to 26, references 26 to 32).
Page numbers below are the PDF page markers in the extraction. Numbers in brackets such as
[33] are the review's own reference numbers; the primary source is named beside each.
Everything is paraphrased. "Not given" means the review's text does not state a value
(figures were not readable, so a value printed only inside a figure counts as not given).

## 1. Summary

1. The review is strongest on transport physics and on qualitative colony behaviour. It is
   weak on network statistics: it gives no alpha values, no node or link counts, no
   comparison numbers against spanning trees or Delaunay triangulations, and no fractal
   dimensions per species in the text. Those must still come from Bebber et al. 2007 [144].
2. Hyphae are 2 to 20 µm wide; cords in *P. velutina* and *Phallus impudicus* microcosms span
   about 50 to 500 µm (image colour scales); vessel hyphae inside cords are 10 to 15 µm.
3. Transport velocities form a clear ladder: diffusion (minutes over 400 µm, about 20 h over
   10 mm), motors (at most about 4 µm/s = 14.4 mm/h), mass flow in cords (20 to 100 mm/h in
   *P. velutina*, up to 148 cm/h for water in *Serpula*).
4. Growth-induced mass flow, with water taken up at the inoculum, is the supported mechanism
   for *P. velutina*. The Heaton advection-diffusion-delivery model predicts tracer
   distribution with Pearson r = 0.56 using one free parameter.
5. Tips avoid each other at the margin; fusion is done by secondary branches in the interior
   that home on neighbours. Cords form behind the front, not at it.
6. Flow-dependent thickening and thinning of cords is described as supported by "some
   evidence", not as established; how a cord is chosen for strengthening or recycling is
   stated to be unknown.
7. New resources cause connecting hyphae to aggregate into cords while the rest dies back,
   over weeks to months; grazing speeds the loss of fine hyphae.
8. *P. velutina* shows oscillating transport; *Serpula* and *Neurospora* do not. No period is
   given and the cause is unknown.
9. The planar graph extraction treats every crossing as a junction, so measured loop
   statistics overcount fusions.
10. Uptake is thought to fall sharply behind the tips, and cords are insulated; MODEL.md
    section 4 has uniform uptake along all segments.

## 2. Findings

### 2.1 Hyphal-level building blocks

**Diameters.**
- Individual hyphae are roughly 2 to 20 µm in diameter (p. 3; [4] Riquelme 2013).
- A hyphal radius of 6 µm is used as "typical" in the shear-stress calculation (p. 9; no
  reference, the authors' worked example).
- Outer-medulla hyphae in rhizomorphs are only about 2 µm wide (p. 11; [134] Eamus et al.
  1985 is the nearest citation).

**Tip growth.**
- Growth is by tip extension through polar secretion; intercalary growth has been seen but is
  the exception (p. 3, p. 9; [4]; [107, 108]).
- *Neurospora* maximum tip rate: 1 µm/s = 3.6 mm/h (p. 4; [69] Pieuchot et al. 2015). In the
  oil-droplet experiments tips extended at 0.2 to 0.5 µm/s (p. 5; [66] Lew 2005).
- No tip rate is given for *P. velutina* or any other cord former. Not given.
- Turgor must exceed some minimum but is not rate limiting: hyphae at different turgor grow
  at the same rate (p. 4; [41, 47 to 50] Steinberg 2007, Money 1997/2008, Lew 2011).
- Tip speed starts proportional to the volume of cytoplasm behind the tip, then saturates at
  a constant once vesicle supply is maximal. The saturating volume per tip is the hyphal
  growth unit, seen at colony level as the width of the peripheral growth zone (p. 10; [110]
  Plomley 1959; [111] Trinci 1971; [102] Prosser & Trinci 1979). Established.
- Apical compartment length in *P. velutina*: 400 µm, called "typical" (p. 4; no reference
  attached to the figure itself).

**Branching.**
- Branching is apical (tip splitting) or subapical, and also lateral/secondary in older
  parts, by different cellular mechanisms (p. 7 Fig. 2A, p. 10; [8] Harris 2008; [120]).
- Daughter hyphae at the margin show negative autotropism (avoidance), under Cdc42 control
  (p. 9; [7] Brand & Gow 2009; [106]). Established.
- Tip-count identity: N = V·g/(A·v), with V colony volume, g specific growth rate, A mean
  hyphal cross-section, v mean tip speed. With g and v constant, tips and volume both grow at
  relative rate g. Branching rate is expected to be only slightly above g because fusion
  removes tips (p. 9; [102]; [109] Katz et al. 1972).
- Consequence stated by the review: colony diameter grows linearly while volume grows
  exponentially, so density rises until inhibitors and depletion in the core stop it (p. 10).
- Distance between adjacent branch points is independent of tip extension rate in *N. crassa*
  across temperatures (p. 10; [121] Watters et al. 2000). A sudden temperature rise gives a
  transient burst of branching; a sudden drop gives one unusually long interval (p. 10; [122]
  Watters & Griffiths 2001). The review explains this with a four-assumption vesicle model
  (tip rate ∝ vesicle deposition; branching ∝ vesicle number; production responds fast and
  deposition slowly to metabolic rate). It labels these assumptions "plausible", i.e.
  speculative.
- Branching is thought more likely where tip-growth vesicles are dense, for instance too far
  behind the apex to feed it, and possibly at septa where vesicles collect (p. 10; [29]
  Boswell & Hopkins 2009; [102]; [103] Hayakawa et al. 2011; [117]). Speculative.
- Branch angles and inter-branch length distributions: no values given. The review points to
  [116] Du et al. 2016 as the first data set tracking branch length and angle through a whole
  colony over 17 days (p. 15).

**Fusion.**
- Where: tips at the margin avoid each other; secondary branches in the colony interior show
  positive autotropism and fuse with neighbours, making a looped micro-hydraulic network
  (p. 7 Fig. 2A, p. 11; [7]; [9] Read et al. 2010; [11 to 13]; [49]). Early fusion also
  happens between germinating conidia via anastomosis tubes (p. 11).
- Function: the fusion-less *so* mutant of *Neurospora* grows as a pure tree and moves less
  radiolabelled amino acid (p. 11; [123] Fleissner et al. 2005; [124] Simonin et al. 2012).
  The review judges that loops matter more for resilience and rapid reallocation than for
  raw transport rate. Lateral tracer movement at the margin is attributed to anastomosis
  (p. 11; [125] Olsson & Gray 1998). "Probably" is the review's own hedge.
- Fusion frequency, homing range, fusion probability: not given.

**Septa and compartments.**
- In Dikarya the apical cell divides after a period of growth, leaving compartments joined by
  septal pores (p. 7).
- Pore diameter: 10 to 70 nm for plasmodesma-like pores, 50 to 500 nm for most other types,
  often partly blocked (p. 7; [6] Jedd 2011; [96] Lutzoni et al. 2004).
- Pores can close irreversibly after damage, and also open or close developmentally and
  reversibly with conditions (p. 8; [99] Bleichrodt et al. 2012; [100] Samalova et al. 2014;
  [101]).
- Velocity through a pore rises as (r_hypha / r_pore)²; more than 200 µm/s measured in
  *Neurospora* (p. 8 to 9; [69]).
- Wall shear stress: τ = 4ηv/r. With viscosity 2 g s⁻¹ m⁻¹ and r = 6 µm, τ (Pa) ≈ v (µm/s) ×
  10⁻³. At a pore it is larger by about (r_h / r_p)³. Pressure drop across a transiently
  plugged pore in *N. crassa* estimated as up to 2 bar (p. 9; [69]; [104]; [68] Abadeh & Lew
  2013). The authors suggest, as a plausible idea only, that flow sensed at pores could drive
  septal dissolution and branching.
- Graph analyses assume all pores open and hyphae behave as plain pipes (p. 18).

### 2.2 Cords and rhizomorphs

- Cords form **behind** the front of apically extending hyphae; how much aggregation there is
  within the front differs between species (p. 11; [126, 127] Agerer 2006/2007).
- Near the front, wide and narrow hyphae coexist with many branches and anastomoses linking
  them. Wide hyphae start out full of cytoplasm and become empty "vessel" hyphae with
  distance from the front (p. 11; [17] Cairney 1992; [128] Cairney 1991).
- *Serpula lacrymans*: narrow tendril hyphae arise at clamp connections, branch, and grow
  both forward and backward around neighbouring hyphae (p. 11; [129] Butler 1958).
- Mature cords contain thick-walled fibre hyphae and vessel hyphae of about 10 to 15 µm
  diameter (p. 11).
- Cord widths: the extracted *P. velutina* (21 days, sand) and *Phallus impudicus* (21 days,
  soil) networks are colour coded from 50 µm to 500 µm (p. 8 Fig. 3; p. 19 Fig. 7; [32]
  Heaton et al. 2012; [193] Obara et al. 2012). This is a display range, not a reported
  distribution.
- Flow in a single vessel scales as r⁴, but the review stresses that septal pore size and the
  extent of septal dissolution matter more (p. 11). For whole cords the conductance used in
  graph work is G = r²/L, on the assumption that a cord is a bundle of equal vessels rather
  than one widening pipe (p. 18; [144] Bebber et al. 2007).
- Rhizomorphs (e.g. *Armillaria*) grow from a meristem-like tip and have a central lacuna,
  inner medulla of large thin-walled vessels, outer medulla of loose 2 µm hyphae, and a
  melanised hydrophobic rind (p. 11).
- Longitudinal hydraulic conductivity of such organs: 1.5 to 3 × 10^(±2) cm² bar⁻¹ s⁻¹ (p. 11;
  [134] Eamus et al. 1985). **Exponent sign is ambiguous in the extraction** ("× 102").
  Transverse conductivity is unmeasured, expected low.
- Walls of mature aggregates are impregnated with melanin and phenolics, replacing the more
  nitrogen-costly hydrophobins (p. 7; [92]).
- Thickening and thinning: in blood vessels and slime moulds remodelling follows flow, and
  "there is evidence" of the same in fungi: high flow with thickening, low flow with thinning
  (p. 12; [33] Heaton et al. 2010; [144]; [143] Tero et al. 2010 for the slime-mould rule).
  Restated on p. 22 as "some evidence" that cords carrying more current are more likely to
  thicken [33]. Supported, not established; no rate law or exponent is given.
- Regression: redundant mycelium regresses and its contents are recycled toward the margin,
  most visibly in larger systems on wood (p. 12; [14] Olsson 2001; [31] Heaton et al. 2015;
  [56] Olsson 1995; [141, 142] Falconer et al. 2007, 2005). Mechanism is probably autophagy
  and apoptosis-like death rather than necrosis (p. 12; [145, 146]).
- Timescales: figures show cords present by 21 to 28 days from wood inocula (pp. 8, 17, 19).
  After a new resource is found, short-range foragers reduce to the connecting cord plus new
  outgrowth "after a few months" (p. 14; [168] Dowson et al. 1986; [170] Wood et al. 2006).
  No rate constants given.

### 2.3 Transport

**Diffusion** (p. 4; [51, 52] Olsson & Jennings 1991; [53] Darrah et al. 2006):
- Small molecules and ions: D = 1 to 2 × 10⁻⁹ m² s⁻¹ (1000 to 2000 µm² s⁻¹). Proteins:
  2 × 10⁻¹¹ m² s⁻¹ (20 µm² s⁻¹). Exponents were flattened in the extraction; these readings
  are confirmed by the review's own worked times (l²/D).
- Times: 400 µm apical compartment, about 2 min (small) and about 2 h (protein); 10 mm colony,
  about 20 h and about 7 weeks; 25 cm microcosm, about 1.5 years and about 100 years.
- Diffusion through cytosol or the tubular vacuole system may be enough for slow or
  "non-translocating" species (p. 4; [56]; [57] Schutte 1956).

**Motor-driven transport** (p. 4):
- Fungal microtubule motors: 1 to 4 µm/s ([59] Steinberg & Schliwa 1996). Yeast myosin V
  moves secretory vesicles at about 3 µm/s ([44]; [60] Schott et al. 2002).
- Upper bound on motor-driven movement: about 4 µm/s = 14.4 mm/h ([61] Steinberg & Schliwa
  1993).
- Faster actomyosin streaming (40 to 60 µm/s in pollen tubes, 100 µm/s in characean algae)
  is stated not to occur in fungi ([62] Goldstein & van de Meent 2015).
- Energetic cost: no fungal estimates exist; the authors think it is high compared with mass
  flow. Speculative.
- Branching does not change motor velocity; total flux halves at each branch point (p. 10).

**Mass flow at hyphal scale** (*Neurospora*):
- Injected oil droplets move at about 5 µm/s while the tip extends at 0.2 to 0.5 µm/s (p. 5;
  [66] Lew 2005). Direct evidence for growth-induced flow.
- Nuclei move by mass flow at 5 to 20 µm/s, scaling with the number of downstream tips, in
  both wild type and the *so* mutant (p. 11; [67] Roper et al. 2013; [69]).
- Elsewhere: nuclei reach up to 4 mm/h with wide variation between hyphae (p. 12; [67]).
  Note 4 mm/h is about 1.1 µm/s, so the two statements describe different measures
  (probably a mean versus peak values); the review does not reconcile them.
- Péclet number v·l/D for the *Neurospora* apical compartment at 1 µm/s: about 0.3 for small
  solutes, about 20 for proteins (p. 5; [62]). So small solutes are diffusion dominated at
  compartment scale even in the fastest species.
- Velocity through septal pores: more than 200 µm/s (p. 9; [69]).

**Growth-induced mass flow, the rule** (p. 7 Fig. 2B, pp. 10 to 11; [32]; [33]; [16] Heaton
et al. 2012 review):
- Flow needs water to leave the pathway somewhere: new growth volume, exudation, evaporation,
  drier soil, or a host plant (p. 5).
- Three cases. Water taken up only at the inoculum: volumetric flow in a hypha is proportional
  to the number of growing tips downstream. Uptake equal everywhere with constant
  cross-section: velocity everywhere equals the extension rate. Uptake only at tips: no
  long-distance flow.
- *Neurospora* matches the first case even though water is freely available in the medium,
  so uptake is spatially regulated (p. 11). Established for *Neurospora*.
- Turgor equalises quickly across the colony because flow is nearly unimpeded, so water
  uptake reflects the whole colony's osmotic state (p. 22; [49]; [231]).

**Mass flow at cord scale** (pp. 11 to 12):

| Organism | Velocity | What moved | Reference |
|---|---|---|---|
| *Suillus bovinus* | 27 cm/h | water | [136] Duddridge et al. 1980 |
| *Serpula lacrymans* | mean 148 cm/h | water | [70] Thompson et al. 1985 |
| *Armillaria* | more than 20 mm/h | various solutes | [137] Granlund et al. 1985 |
| *Serpula lacrymans* | 10 to 50 mm/h | solutes (AIB) | [138] Tlalka et al. 2008 |
| *Serpula lacrymans* | 20 to 30 cm/h | solutes | [135] Cairney 2005; [139] Brownlee & Jennings 1982 |
| *P. velutina* | 20 to 100 mm/h, rising with extent of cord formation | solutes (AIB) | [32], [33], [131, 132] Tlalka et al. 2003, 2002; plus unpublished |
| saprotroph, moist to dry soil | 18 cm/h | water, hydraulic redistribution | [74] Guhr et al. 2015 |
| mycorrhiza coupled to host | 27 cm/h | water | [136]; [140] Lehto & Zwiazek 2011 |

**The ADD model** (p. 8 Fig. 3, p. 12; [32] Heaton et al. 2012; [33] Heaton et al. 2010):
- Measured cord-by-cord growth of a *P. velutina* network (21 days, wood block on compressed
  black sand) gives the growth-induced flows; an advection-diffusion-delivery model then
  predicts where a tracer goes. Compared against photon-counting images of 14C-AIB, the
  prediction has Pearson correlation 0.56.
- Essentially one free parameter: the fraction of each cord's cross-section that carries the
  flow. Its fitted value is not given in the review.
- Flow velocities are very uneven across the network; some cords carry far more than their
  neighbours (p. 22; [32, 33, 67]).

**Water permeability** (p. 5):
- Plasma membrane osmotic permeability without aquaporins (yeast): 0.34 µm/s at 7 °C, 2 µm/s
  at 23 °C ([80]); equivalent to a hydraulic conductivity of about 2.5 to 15 × 10⁻¹⁵ m s⁻¹
  Pa⁻¹ (exponent confirmed by recomputing from P_f·V_w/RT). One to two orders below plant
  and animal membranes.
- Aquaporins raise it: 9-fold in yeast at 7 °C; up to 147 µm/s for *Laccaria bicolor*
  aquaporins in oocytes ([83]).
- Wall pore size 2 nm in the water mould *Achlya* ([93]); hydrophobins about 15 kDa.
- Where water actually enters a colony is described as critical and largely unresolved.

**Bidirectional transport and oscillations** (p. 12):
- Tracers move both toward and away from the margin in the same colony ([125]; [137]; [138];
  [147 to 152]). A single pressure-driven flow goes one way at a time, so models invoke two
  pathways: outward mass flow in vessel hyphae and inward cytoplasmic streaming in adjacent
  living hyphae (p. 7 Fig. 2D; [17] Cairney 1992). Hypothesis, not demonstrated.
- *P. velutina* shows marked oscillations on top of net transport ([131], [132]; [153]
  Fricker et al. 2007). *S. lacrymans* [138] and *N. crassa* [124] do not.
- **Period: not given in this review.** Origin: stated as unknown. The authors suggest a
  reciprocating (shuttle) transfer rather than a steady circulation, likening it to *Physarum*
  shuttle streaming at a much longer timescale ([154] Alim et al. 2013). Speculative.

**Electrical signals** (p. 15; [171] Olsson & Hansson 1995; [172] Olsson 1999):
- Strands of *Pleurotus ostreatus* and rhizomorphs of *Armillaria gallica* fire spontaneous
  action-potential-like spikes at 0.5 to 5 Hz; frequency rises when nutrients are added.
- The response propagated at 0.5 mm/s over a few centimetres when nutrient was added remotely.
- A proposed role in preventing apoptosis and reinforcing cords is flagged as a proposal.

**Routing: what is and is not known.**
- Known: early tracer and dye movement follows particular routes, probably the developing
  cords (p. 11; [125]; [130 to 132]). Growth-induced flow with inoculum uptake reproduces
  the broad pattern (r = 0.56).
- Not known: internal connectivity within cords (rarely traced); the quantitative share of
  streaming, vesicles, growth-induced flow and evaporative flow (p. 1; [15 to 17]); the source
  of oscillations; how basipetal movement is achieved.

### 2.4 Colony dynamics and behaviour

**Scale.** Mycelia in discrete resources work at millimetres to centimetres; cord and
rhizomorph systems foraging between resources work at metres and cover square metres to
hectares. Largest known genet: *Armillaria ostoyae*, 965 ha, fronts up to 3,810 m apart
(p. 13; [157] Ferguson et al. 2003). *Clitocybe nebularis* litter rings have an active annulus
30 to 40 cm wide (p. 13; [158] Dowson et al. 1989).

**Foraging strategies** (p. 13; [34, 35] Boddy 1993, 1999; [159]):
- Slow, dense fronts unlikely to miss a resource: *Hypholoma fasciculare* ("phalanx",
  short-range).
- Faster, sparser systems: *P. velutina*; most extreme, *Armillaria* ("guerrilla",
  long-range).
- No extension rates are given for any of these. Not given.
- Mass-fractal species extend faster than border-fractal species, implying a trade-off
  between space filling and extension rate (p. 16).

**Finding a new resource** (pp. 13 to 15; [168]; [169] Boddy et al. 2010; [170]):
- The parts of the network that connect old and new resources aggregate into cords;
  non-connecting mycelium dies back.
- Short-range foragers reallocate fast and thoroughly: after a few months often only the
  connecting cord and the new outgrowth remain.
- Long-range foragers reallocate little unless the new resource is much larger than the old.
- Speed and extent depend on strategy, relative size and quality of resources, and grazers.
- Experimental frame: *P. velutina* from beech wood on compressed non-sterile soil in 50 × 50
  cm trays; four extra wood blocks added behind the margin at 36 days; 250 *Folsomia candida*
  added at 49 days; photographed at 99 days (p. 14 Fig. 5; [170]).
- Field: a *P. velutina* cord map re-surveyed after 13 months (p. 13 Fig. 4; [155] Thompson &
  Rayner 1982).
- How a cord is chosen for strengthening or recycling, and how breakdown products are
  retrieved and redirected, are stated to be unknown (p. 15).

**Nutrient status.** Growth and branching rates must be lower on poor or recalcitrant
substrates (p. 10; [114, 115]). Recycling pays most on such substrates (p. 21; [31]).

**Agar colony morphology** (p. 21; [217] Lopez & Jensen 2002; [218] Matsuura 2002):
*Aspergillus oryzae* colonies are smooth and circular when nutrient is low and diffusion
through the agar is hard; lowering agar concentration (faster diffusion of nutrient and
waste) gives denser, branched colonies with an irregular front. Explained by a
reaction-diffusion model with a growth-limiting nutrient and a self-produced inhibitor.

**Grazing and damage** (pp. 14, 23 to 24):
- Microcosms: 24 × 24 cm or 50 × 50 cm compressed non-sterile woodland soil ([238 to 240]).
- Heavy grazing can destroy a mycelium outright; lighter grazing reshapes it.
- Where grazing lands depends on species: tips in the unpalatable *H. fasciculare*;
  everywhere in *Resinicium bicolor*; fine interior hyphae and tips in *P. velutina* ([241]
  Tordoff et al. 2006). Woodlice (*Oniscus asellus*) cut swathes and sever thick cords ([242]
  Crowther et al. 2011).
- Thin, young, poorly resourced mycelia are more vulnerable than sclerotised cord systems
  ([170]; [239]).
- In 50 × 50 cm trays, cover after several months was similar with and without collembola,
  apparently because they ate fine hyphae that would have regressed anyway ([170]).
- Extension usually slows under grazing ([239]) but sometimes speeds up, switching from slow
  exploitative to fast explorative growth, locally or all round the margin, depending on
  grazer density ([242]; [238]).
- Under collembola grazing of *P. velutina*, most interstitial hyphae are lost but some
  survive and thicken, raising local cross-connection and hence robustness ([169]).

**Interactions between colonies.** *P. velutina* against *H. fasciculare* with collembola:
growth curtailed except toward the opponent, where overgrowth sped up (p. 24; [243] Rotheray
et al. 2008). Interactions change cover and fractal dimension locally (p. 16; [190]). An
estimated 30 to 80% of fungi carry mycoviruses that spread through anastomosis (p. 24; [245,
246]).

**Migration and memory-like effects.** Not discussed in this review. Not given.

### 2.5 Quantitative network architecture

**Extraction** (pp. 15 to 18):
- Growth is constrained to 2D: agar, cellophane or cellulose nitrate on agar, or compressed
  soil or sand. Hyphal-scale analysis is mostly limited to under 72 h and millimetres to
  centimetres, because the interior becomes too dense to trace ([173] Vidal-Diez de Ulzurrun
  et al. 2015). Confocal 3D tracking has reached 17 days ([116] Du et al. 2016).
- Pipeline: ridge enhancement (second-derivative Gaussian filters, anisotropic kernels [197],
  or phase congruency for corded systems with uneven brightness [193, 198]), then
  segmentation (hysteresis thresholding, or watershed with edge pruning) to a one-pixel
  skeleton.
- Width: assumed, or estimated by granulometry (successive openings; integrated intensity
  gives relative widths even below resolution, assuming brightness scales with width).
- Graph: planar, weighted, undirected. Nodes at tips, branches and anastomoses. Link weights:
  Euclidean length L and radius r, combined as volume V = πr²L (material cost) or conductance
  G = r²/L (p. 18; [144]; [173]; [175]; [182]; [199 to 201]).
- The resource block is a single node joined to every cord that meets its edge; in Fig. 7
  those joining links are set to the maximum width (pp. 18, 19).
- **Caveat stated by the review:** every crossing in a 2D image becomes a fully connected
  node whether or not a fusion is there (p. 18). Loop measures from such graphs are upper
  bounds on true fusion.

**Measures named:** tips, junctions, edges; total length, area, volume; branch-angle and
internode-length distributions; tip density; node degree; α-index; shortest-path measures
such as betweenness centrality (p. 18). These show species-dependent change over
development ([144]; [173]; [199 to 203]).

**Values given in the text:**
- Node and link counts: not given (Fig. 8 plots log N, log M and edge density ρ = 2M/[N(N−1)]
  for 270 networks, but no numbers appear in the text).
- Node degree: not given.
- α-index / meshedness and its time course: not given.
- Cost, transport efficiency, comparison with minimum spanning tree or Delaunay
  triangulation: **not discussed in this review**. The source for these remains [144] Bebber
  et al. 2007, and [199], [201], [202].
- Robustness: links removed at random in silico while counting surviving paths; *P. velutina*
  networks fail faster than *Phallus impudicus* (p. 24 Fig. 9; unpublished). No numbers.
  *P. impudicus* is the more cross-connected species; connection is also greater from larger
  resources and in older systems (p. 24; [144]; [169]; [243]; [244]). Suggested attack rules:
  remove long thin cords first (collembola), or delete a local patch (woodlice) (p. 23).
- Theory: optimal networks contain loops when they must tolerate random damage or serve
  fluctuating sources and sinks ([237] Katifori et al. 2010); a single source feeding many
  sinks is best served by a tree ([234 to 236]) (pp. 22 to 23).

**Community structure / taxonomy** (pp. 20 to 21; [204] Onnela et al. 2012; [205] Lee et al.
2017): 270 fungal and slime-mould networks clustered by mesoscopic response functions, with
edge weights from volume, conductance or path score. Species, developmental stages and
treatments group sensibly. Described as in its infancy.

**Fractal dimension** (pp. 15 to 16; [187] Boddy et al. 1999; [188] Boddy & Donnelly 2008;
[35]):
- Box counting, N(s) ≈ c·s^(−D), box sides 3 to 63 pixels for 24 × 24 cm microcosms. Border
  boxes give the surface dimension D_S; interior boxes the mass dimension D_M.
- D_M ranges from about 1 (linear rhizomorphs of *Armillaria* spp., *Megacollybia
  platyphylla*) to nearly 2 (dense *H. fasciculare*, *Stropharia caerulea*). **Per-species
  values are printed only in Fig. 6 (six species, 28 days) and were not recoverable from the
  text.** No value for *P. velutina* is given in the text.
- D_M falls with time and size even in the dense species, as cords form and interstitial
  hyphae die back.
- Dense species have D_S below D_M (fractal only at the border); others have D_S ≈ D_M
  (fractal throughout).
- Both dimensions rose with inoculum volume from 0.5 to 4 cm³ in *H. fasciculare*,
  *P. velutina* and *R. bicolor*, not *S. caerulea*. *S. caerulea* from 84-day-decayed inocula
  took 10 days longer to reach the same values as from 22-day inocula.
- Lower on soils poor in N and P. *P. velutina*: significantly lower at 5 °C than at 10 to
  25 °C for several weeks; little effect of water potential between −0.02 and −0.002 MPa
  (where *S. caerulea* D_S fell as soil got wetter).

**Predictive models of which links thicken or go.** None is given beyond the statements that
flow correlates with thickening [33, 144] and that betweenness centrality can rank a cord's
importance for transport from the resource (p. 19 Fig. 7D). No fitted rule, threshold or
success rate.

### 2.6 Modelling approaches

- **Tip-scale biophysics**: vesicle delivery and viscoelastic wall models ([42]; [206 to
  211]).
- **Continuum (Edelstein-type) models** ([216] Edelstein 1982): densities of tips, hyphae,
  nutrient and inhibitor. Good for the gross shape of dense colonies. Extended with mobile
  versus immobile biomass and recycling ([141, 142] Falconer et al.; [24, 26] Boswell et
  al.). Recycling rate changes morphology; three limiting forms are fairy rings, uniform
  density, and alternating rings ([220]). The review's criticism: uptake depends on surface
  area, which is not a simple function of colony diameter or density.
- **Spatially explicit tip-and-trail models**, lattice ([26]; [29]) or lattice-free ([28]
  Hopkins & Boswell 2012; [30] Carver & Boswell 2008): tips carry position and heading;
  trails carry internal and external substrate; fusion is assumed whenever a tip enters an
  occupied site.
- Branching is called fundamentally hard to model. Option one: impose a measured inter-branch
  distribution ([226] Nieminen et al. 2013), which is fine when branching is constant and
  apical or subapical, but unclear in a patchy environment. Option two: make tip growth and
  branching functions of internal substrate ([29]; [227] Boswell & Davidson 2012), which
  shows why transport matters but rests on uptake and translocation mechanisms that are
  poorly quantified. The review says it is unclear whether either captures the real relation.
- Remote conditions affect local behaviour through translocation, so purely local rules are
  insufficient ([32]; [219]; [229, 230]).
- **Flow models**: growth-induced mass flow on the measured network plus ADD ([32], [33]),
  with G = r²/L conductances.
- Fungi are not single-source distribution trees; nutrients enter at many points, so the
  relevant transport distance is from uptake site to consumption site, not colony radius
  (p. 23; [147]; [219]).
- Efficient potential-driven flow never backtracks, yet mixing and bidirectional exchange are
  also needed; the trade-off between directed transport and mixing is flagged for future
  modelling (p. 23).

## 3. Numbers for the model

| Parameter | Value | Units | Species | Page | Primary reference | Extraction ambiguity |
|---|---|---|---|---|---|---|
| Hyphal diameter | 2 to 20 | µm | fungi in general | 3 | [4] Riquelme 2013 | none |
| "Typical" hyphal radius (worked example) | 6 | µm | generic | 9 | authors' example | none |
| Apical compartment length | 400 | µm | *P. velutina* | 4 | none attached | none |
| Max tip extension rate | 1 (= 3.6 mm/h) | µm/s | *Neurospora* | 4 | [69] Pieuchot et al. 2015 | "μms−1" read as µm s⁻¹; consistent with mm/h figure |
| Tip extension in droplet experiments | 0.2 to 0.5 | µm/s | *Neurospora* | 5 | [66] Lew 2005 | none |
| Tip extension rate | not given | | *P. velutina* | | | |
| Vessel hypha diameter in cords | 10 to 15 | µm | cord formers generally | 11 | not specific ([126, 127] nearby) | none |
| Outer-medulla hypha width | about 2 | µm | rhizomorphs | 11 | [134] Eamus et al. 1985 (nearest) | none |
| Cord width range (image colour scale) | 50 to 500 | µm | *P. velutina*, *Phallus impudicus*, 21 days | 8, 19 | [32] Heaton et al. 2012; [193] Obara et al. 2012 | display range, not a measured distribution |
| Cord conductance weight | G = r²/L | relative | cord formers | 18 | [144] Bebber et al. 2007 | none |
| Cord cost weight | V = πr²L | volume | cord formers | 18 | [144] | none |
| Longitudinal hydraulic conductivity of cords/rhizomorphs | 1.5 to 3 × 10^(?2) | cm² bar⁻¹ s⁻¹ | basidiomycete translocating organs | 11 | [134] Eamus et al. 1985 | **exponent sign unknown** ("× 102"); check primary |
| Septal pore diameter, plasmodesma type | 10 to 70 | nm | various | 7 | [6] Jedd 2011; [96] | none |
| Septal pore diameter, other types | 50 to 500 | nm | various | 7 | [6]; [96] | none |
| Velocity through septal pore | more than 200 | µm/s | *Neurospora* | 9 | [69] | none |
| Pressure across plugged pore | up to 2 | bar | *N. crassa* | 9 | [69] | none |
| Cytoplasm dynamic viscosity (worked example) | 2 (= 2 mPa s) | g s⁻¹ m⁻¹ | generic | 9 | authors' example | none |
| Wall shear stress | τ ≈ v × 10⁻³ (v in µm/s, r = 6 µm) | Pa | generic | 9 | [104] | exponent confirmed by recomputation |
| Diffusion coefficient, ions and small molecules | 1 to 2 × 10⁻⁹ | m² s⁻¹ | in cytoplasm | 4 | [51, 52] Olsson & Jennings 1991; [53] Darrah et al. 2006 | exponent confirmed by the worked times |
| Diffusion coefficient, proteins | 2 × 10⁻¹¹ | m² s⁻¹ | in cytoplasm | 4 | as above | exponent confirmed by the worked times |
| Diffusion time over 400 µm | about 2 min (small), about 2 h (protein) | | *P. velutina* compartment | 4 | authors' calculation | none |
| Diffusion time over 10 mm | about 20 h (small), about 7 weeks (protein) | | small colony | 4 | authors' calculation | none |
| Diffusion time over 25 cm | about 1.5 y (small), about 100 y (protein) | | microcosm | 4 | authors' calculation | none |
| Microtubule motor speed | 1 to 4 | µm/s | fungi (*Neurospora* kinesin) | 4 | [59] Steinberg & Schliwa 1996 | none |
| Myosin V vesicle speed | about 3 | µm/s | yeast | 4 | [60] Schott et al. 2002 | none |
| Ceiling on motor-driven transport | about 4 (= 14.4 mm/h) | µm/s | fungi | 4 | [61] Steinberg & Schliwa 1993 | none |
| Oil droplet mass-flow speed | about 5 | µm/s | *Neurospora* | 5 | [66] | none |
| Nuclear mass-flow speed | 5 to 20 | µm/s | *Neurospora* (wild type and *so*) | 11 | [67] Roper et al. 2013; [69] | none |
| Nuclear mass-flow speed (other statement) | up to 4 | mm/h | *Neurospora* | 12 | [67] | inconsistent with the row above (4 mm/h ≈ 1.1 µm/s); not reconciled in the review |
| Péclet number, apical compartment at 1 µm/s | about 0.3 (solutes), about 20 (proteins) | none | *Neurospora* | 5 | [62] | none |
| Solute velocity in cords | 20 to 100, rising with cord development | mm/h | *P. velutina* | 11 to 12 | [32]; [33]; [131, 132] Tlalka et al. | none |
| Solute velocity | more than 20 | mm/h | *Armillaria* | 11 | [137] Granlund et al. 1985 | none |
| Solute velocity | 10 to 50 | mm/h | *S. lacrymans* | 11 | [138] Tlalka et al. 2008 | none |
| Solute velocity | 20 to 30 | cm/h | *S. lacrymans* | 11 | [135]; [139] Brownlee & Jennings 1982 | text ran together ("to20to30cmh−1") but reads cleanly |
| Water velocity | mean 148 | cm/h | *S. lacrymans* | 11 | [70] Thompson et al. 1985 | none |
| Water velocity | 27 | cm/h | *Suillus bovinus* | 11 | [136] Duddridge et al. 1980 | none |
| Water flow, hydraulic redistribution | 18 | cm/h | saprotroph, moist to dry soil | 12 | [74] Guhr et al. 2015 | none |
| ADD model fit to tracer map | Pearson r = 0.56 | none | *P. velutina*, 21 days | 8 | [32] Heaton et al. 2012 | none |
| ADD free parameter (fraction of cord carrying flow) | value not given | | *P. velutina* | 12 | [32] | |
| Transport oscillation period | not given | | *P. velutina* | 12 | [131, 132]; [153] | |
| Membrane osmotic permeability, no aquaporins | 0.34 at 7 °C; 2 at 23 °C | µm/s | yeast | 5 | [80] | none |
| Membrane hydraulic conductivity | about 2.5 to 15 × 10⁻¹⁵ | m s⁻¹ Pa⁻¹ | yeast | 5 | [80] | exponent confirmed by recomputation |
| Aquaporin-raised permeability | up to 147 | µm/s | *Laccaria bicolor* AQP in oocytes | 5 | [83] | none |
| Action-potential-like spike rate | 0.5 to 5 | Hz | *Pleurotus ostreatus* strands, *Armillaria gallica* rhizomorphs | 15 | [171] Olsson & Hansson 1995; [172] Olsson 1999 | none |
| Electrical signal propagation speed | 0.5 | mm/s | same | 15 | [171]; [172] | "mm s–1" clean |
| Mass fractal dimension range | about 1 to nearly 2 | none | *Armillaria*, *M. platyphylla* (low) to *H. fasciculare*, *S. caerulea* (high) | 16 | [188] Boddy & Donnelly 2008; [35] | per-species values only in Fig. 6, not recovered |
| Box sizes for fractal analysis | 3 to 63 | pixels | 24 × 24 cm microcosms | 15 to 16 | [188] | none |
| Inoculum volume range tested | 0.5 to 4 | cm³ | *H. fasciculare*, *P. velutina*, *R. bicolor*, *S. caerulea* | 16 | [187]; [188] | "4cm3" read as 4 cm³ |
| Temperature effect on fractal dimension | lower at 5 °C than 10 to 25 °C | | *P. velutina* | 16 | [188] | none |
| Microcosm sizes | 24 × 24 and 50 × 50 | cm | cord formers on compressed soil | 14, 16, 23 | [170]; [238 to 240] | none |
| Resource-addition experiment times | blocks at 36 d, grazers at 49 d, image at 99 d | days | *P. velutina* | 14 | [170] Wood et al. 2006 | none |
| Reallocation after new resource | "a few months" | | short-range foragers | 14 | [168]; [170] | qualitative only |
| Imaging limit for hyphal-scale networks | under 72 | h | agar colonies | 15 | [173] | none |
| α-index, node degree, node/link counts, MST/DT ratios | not given | | | | see [144] Bebber et al. 2007 | |

## 4. What this means for the 40K engine

### 4.1 Targets to check against

1. **Advection speed in cords.** `Q/a` in thickened links should fall in 20 to 100 mm/h
   (5.6 to 28 µm/s) for a *P. velutina* parameter set, and should rise as cords develop.
   This is the best single number in the review for the flow model.
2. **Speed ladder.** In fine hyphae with only growth-induced flow, velocities of a few µm/s
   (about 5 µm/s for droplets, 5 to 20 µm/s near the inoculum where many tips are
   downstream), against tip speeds of 0.2 to 1 µm/s in *Neurospora*. Flow speed must exceed
   tip speed and must increase toward the inoculum in proportion to downstream tip count. On
   a tree this is an exact check of the one-pass flux sum.
3. **Diffusion versus advection.** With D of 1000 to 2000 µm²/s inside hyphae, diffusion
   alone moves small solutes 400 µm in about 2 min and 10 mm in about 20 h. A colony a few
   centimetres across cannot be supplied by diffusion within the run; if the engine's colony
   still grows normally with advection switched off, something is wrong. Péclet numbers
   should be below 1 in a single fine compartment and well above 1 along cords.
4. **Motor ceiling.** If the "active transport toward the nearest tip" term is kept anywhere,
   its implied velocity should not exceed about 4 µm/s (14.4 mm/h).
5. **Tracer test.** Reproduce the Heaton experiment in silico: mark `si` at the inoculum,
   run, and compare the map with the same network's prediction from growth-induced flow
   alone. The real system gives r = 0.56, so the engine does not need, and should not show,
   near-perfect agreement between pure growth-induced flow and the full dynamics.
6. **Geometry.** Fine links 2 to 20 µm; cords 50 to 500 µm across after about three weeks.
   Cords must appear behind the front, never at it.
7. **Density trend.** Box-counting mass dimension should fall over time as cords form and
   interstitial links are removed; it should be lower for a cold run (5 °C versus 10 to
   25 °C) and higher from a larger inoculum. Only the direction is given.
8. **Robustness ordering.** Under random link removal a *P. velutina*-like network should
   lose paths faster than a more cross-linked *Phallus impudicus*-like one. Direction only.
9. **New resource.** Adding a food patch behind the margin should thicken the links on the
   route between patches and thin or remove the rest, over weeks to months of simulated
   time, faster with a "grazing" removal process on fine links.
10. **Timescale reality check.** The review's cord and regression data are from 21 to 99 day
    systems 24 to 50 cm across. A colony a few centimetres across in its first days will
    show little of this. The rise-then-fall in link count belongs to that longer, larger
    regime; the engine either needs accelerated time for remodelling or should say that the
    target applies to a scaled-up run.

### 4.2 Rules to implement or change

1. **Fusion by position and branch type.** Leading tips at the margin avoid other hyphae;
   fusion is done by secondary (lateral) branches in the interior that grow toward
   neighbours. Replace the single probability `f` with: low or zero fusion for primary
   margin tips steering on the crowding field, and high fusion for late-formed lateral
   branches, with attraction rather than repulsion. This needs a secondary-branching process
   behind the front, which section 4 does not have.
2. **Uptake should decline behind the tips.** The review reports the general belief that
   uptake is much reduced behind the tips and that cords are insulated. Scale `c1` down with
   link age and with area `a`, so thick cords are transport-only.
3. **Keep the conductance law as area/length.** `C = σ·a/l` matches the published cord
   weighting G = r²/L (bundle of equal vessels). Do not switch to r⁴ for cords.
4. **Keep water uptake at the inoculum** as the default boundary condition for *P. velutina*
   and *Neurospora*. Expose the alternative (uptake spread over the network, which collapses
   velocities to the tip speed) as a species option, since the review treats the site of
   uptake as species- and condition-dependent.
5. **Add the flowing fraction.** The one fitted parameter in the Heaton model is the fraction
   of cord cross-section that carries flow. Advect `si` at `Q/(φ·a)` with φ as a species
   parameter (value to be taken from Heaton et al. 2012; not given here).
6. **Remodelling.** Keep Tero-type thickening but treat it as a hypothesis: the review only
   says there is some evidence that higher-flow cords thicken. Record betweenness centrality
   as a second candidate predictor so the two can be compared. Pruning should also depend on
   whether a link lies on a path between resources, which is the review's description of
   what survives.
7. **Aggregation.** Real cords are bundles formed by hyphae growing along a lead hypha, not
   one hypha swelling. A single link with growing `a` is an acceptable abstraction, but the
   thickening should be gated to regions behind the front and should cost substrate.
8. **Branching.** Drawing inter-branch distance from a fixed distribution is supported for
   uniform conditions (distance is independent of tip speed in *N. crassa*). In a patchy
   world the review says this is not clearly right. Let the gamma scale depend on `si` so
   branching falls on poor substrate, and note it as inferred.
9. **Recycling.** Returning a fraction of biomass from removed links to neighbours agrees
   with the review. The review adds that recycling matters most on poor substrates, so the
   recovered fraction is a meaningful species parameter rather than a constant.
10. **Bidirectional transport and oscillation.** A single pressure field gives one direction
    per link. To let resource move back from a newly found patch, the engine needs either
    diffusion strong enough along cords (it is not, at these lengths) or a second pathway.
    The cheapest honest option is a slow reverse channel at motor speed (at most 4 µm/s) in
    the non-flowing fraction (1 − φ) of each cord. Oscillating transport in *P. velutina* is
    real but has no period or mechanism in this review; do not add it from this source.
11. **Grazing and damage.** Two removal modes match the review: preferential removal of long
    thin links (collembola) and deletion of a contiguous patch (woodlice). Surviving fine
    links near the damage should be allowed to thicken.
12. **Signals (MODEL.md section 6).** Spike rate 0.5 to 5 Hz rising on nutrient contact, and
    a propagation speed of 0.5 mm/s, are usable for event timing, with the caveat that they
    come from *Pleurotus* and *Armillaria*, not *P. velutina*.

### 4.3 Where the review contradicts or strains MODEL.md section 4

1. **"A hit fuses with probability f"** applied to all tips. The review places fusion in the
   interior, by secondary branches with positive autotropism, and avoidance at the margin.
   A uniform `f` is not what is described. (The crowding-field steering itself is supported.)
2. **Uniform uptake per segment.** Contradicted by the statement that uptake is greatly
   reduced behind tips and that cords are insulated.
3. **Loopiness target of 0.11 to 0.20.** The review neither confirms nor disputes the values
   (it gives none), but it states that 2D extraction turns every crossing into a junction.
   The engine should compute alpha the same way the data were made (counting crossings as
   nodes) when comparing with Bebber et al. 2007, and separately report alpha from true
   fusions only. Comparing true-fusion alpha with the published range would be wrong.
4. **"Active transport toward the nearest tip ∝ si"** has no counterpart in the review's
   physics: motors are bidirectional, capped near 4 µm/s, and the dominant tipward movement
   is mass flow. Section 4 already says the flow model replaces it; the review supports
   removing it entirely wherever flow is computed and capping it elsewhere.
5. **Tero's law as the thickening rule** is stated in MODEL.md as the mechanism. The review
   calls flow-dependent thickening evidenced but the decision logic unknown. Mark it
   `inferred`, not `sourced`.
6. **Inactive-hypha degradation rate of 0** (none seen in 15 h) is fine for a 15 h Boswell
   calibration but cannot produce the regression the review describes over weeks. The
   rise-then-fall target requires a non-zero rate at long times.
7. **Single-direction advection** cannot reproduce the bidirectional tracer movement the
   review reports as well documented.
8. **Scale.** "A colony a few centimetres across" overlaps only the smallest end of the
   systems in which cords, regression and the *P. velutina* network statistics were measured
   (24 cm trays, three weeks and more). Not a contradiction of a rule, but the calibration
   target and the stated domain do not coincide.

Points in section 4 that the review supports: lattice-free tip-and-trail growth; steering
away from crowding; growth gated on internal substrate; conductance ∝ a/l; demand-driven
flow with the inoculum balancing; pressure solve treated as quasi-static (turgor equalises
fast); flow-linked thickening as the leading hypothesis; recycling of biomass from pruned
links.

## 5. Things the review flags as unknown

- The quantitative share of each transport pathway (streaming, vesicles, growth-induced
  flow, evaporative flow) and how it varies with species and stage (p. 1).
- Where in the colony water is taken up, outside *Neurospora*; the roles of aquaporins and
  possible water pumps; transverse hydraulic conductivity of cords (pp. 5, 11).
- The molecular events behind hyphal aggregation and differentiation into cords (p. 1); the
  internal connectivity of cords (p. 11).
- How a hypha is selected for autophagy, and how its contents are broken down and carried to
  the front; how a cord is chosen for strengthening or recycling (pp. 12, 15).
- The origin of transport oscillations in *P. velutina*, and how simultaneous two-way
  transport is achieved (p. 12).
- Whether younger hyphae, or hyphae carrying more flow, are more likely to branch; what
  controls branching at all; few statistics exist on where branches form (p. 10).
- Which branching rule a model should use in a heterogeneous environment; whether current
  models represent uptake and translocation accurately enough (p. 22).
- The energetic cost of motor-driven transport in fungi (p. 4).
- Whether flow-induced shear at septal pores is sensed and regulates development (p. 9).
- The "developmental logic" of fungal networks in general: which links thicken, which go
  (p. 22).
- The trade-off between efficient directed transport and efficient mixing (p. 23).
- Network structure inside wood and soil in 3D; no connected 3D network can yet be extracted
  (pp. 13, 25). Structure of networks in homogeneous litter (fairy rings).
- Whether electrical spikes coordinate growth or cord formation (p. 15).
- Which network metrics best describe organisation and how they relate to fitness (p. 26).
- Internal connectivity of very large genets (p. 13).
