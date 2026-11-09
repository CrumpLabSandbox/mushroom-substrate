# 02. Mycelial networks at colony and forest scale

Research write-up for Phase 1, topic 2. Written 2026-11-09.

**How to read the confidence marks.** Every number is tagged in the tables as `sourced` (I opened
the source and the number is in it), `inferred` (computed by me from sourced numbers, or carried
over from a related species) or `uncertain` (seen only in a search snippet or abstract, or
recalled from prior knowledge without being re-opened this session). The session's web-search
budget ran out part-way through, so several classic primary papers (Bolton & Boddy 1993, Boddy
1999, Agerer 2001, Dowson et al. 1989, Leake et al. 2004, Ekblad et al. 2013 full text) could
not be opened. Where that matters it is said next to the claim and again in section 6.

## 1. Summary

1. Foraging cord networks of *Phanerochaete velutina* are planar graphs of degree-1 tips and degree-3 junctions (rarely 4), with about 700 nodes and 900 links in a 24 cm tray after 5 to 6 weeks [1][2].
2. They start as trees (meshedness alpha near 0) and add loops by fusion until alpha is 0.1 to 0.2; real cities, ant galleries and *Physarum* sit in the same range [1][2].
3. The network is built by over-production then pruning: links carrying flow thicken, the rest are recycled, so material per unit area falls (1.0 to 0.6 mm3 cm-2) while transport efficiency and robustness rise [1][2][3].
4. Foraging style is a continuum from dense, slow, short-range fronts (*Hypholoma fasciculare*) to sparse, fast, long-range cords (*P. velutina*, *Resinicium bicolor*) [10][2]. Exact fractal dimensions and extension rates were not verified this session.
5. On finding a new resource the fungus thickens connecting cords and regresses the rest; *P. velutina* abandons its inoculum altogether when the new wood is larger than about 4 to 16 cm3, whatever the inoculum size [4].
6. *Armillaria* rhizomorph systems are looped too (alpha about 0.3, 4 to 6 m of rhizomorph per m2) and spread at 0.2 to 1.3 m per year; the largest genets are 75 ha (*A. gallica*, at least 2,500 years) and 965 ha (*A. ostoyae*, 1,900 to 8,650 years) [20][22][23].
7. Fairy rings advance 7 to 125 cm per year depending on genus; the largest reported is 800 m across and about 700 years old [24].
8. Ectomycorrhizal fungi are sorted by Agerer into contact, short-distance, medium-distance (fringe, mat, smooth) and long-distance exploration types; long-distance types carry about 15 times the mycelial length per root tip of short-distance types, but the types predict field foraging poorly [13][16].
9. Common mycorrhizal networks between trees are physically plausible and shown in the lab, but genet-level mapping exists for only two tree species and three fungi, and field evidence for benefit to seedlings is weak (5 of 28 experiments) [11].
10. Different individuals do not merge: fusion between incompatible genets kills the fused cells, and different species fight to deadlock or replacement along a rough, partly intransitive hierarchy [7][8][30].

## 2. Findings

### 2.1 Measured network architecture

**What a node is.** In the Fricker/Boddy/Bebber work a node is a branch point, a fusion
(anastomosis), a tip or the food source; a link is the cord between two nodes. Node degree is
therefore limited to 1 (tips), 3 (branch or fusion) and occasionally 4 (two cords that crossed and
then fused). Degree distributions carry almost no information, and no power law has been found.
Node *strength* (sum of the weights of attached links) is roughly log-normal. The clustering
coefficient is close to zero because the growth habit does not make triangles [2].

**Size and growth of the graph.** *P. velutina* from a 2 x 2 x 1 cm beech block on compressed
non-sterile soil in a 24 x 24 cm tray, three replicates per treatment [1]:

| Day | Area cm2 (control) | Nodes | Links | Material mm3 | Material mm3 cm-2 |
|---|---|---|---|---|---|
| 18 | 229 | 515 | 644 | 234 | 1.0 |
| 25 | 372 | 738 | 946 | 294 | 0.8 |
| 31 | 484 | 805 | 1040 | 287 | 0.6 |
| 39 | 505 | 697 | 883 | 292 | 0.6 |

Node and link counts peak at about day 31 and then fall while the area is still filled: this is
pruning, and it is visible in the raw counts. With an added bait block the material cost stayed
higher (378 mm3 at day 39) [1]. In a separate time-lapse of the same species, about 2 new cords
and 2 new nodes appeared per hour, and total volume grew at 0.5 to 1.1 mm3 per hour over the
first three weeks [3].

**Meshedness.** The alpha coefficient is the number of independent loops divided by the maximum
possible in a planar graph with the same nodes, alpha = (L - N + 1) / (2N - 5). It rose from near
0 to 0.11 +/- 0.04 (control) and 0.20 +/- 0.05 (baited); the inner colony was more looped than the
edge [1]. The review states the general range as 10 to 20 percent and notes that the value
depends on how much of the fine peripheral mycelium the image analysis captures [2]. From the
table above, mean degree 2L/N is about 2.5 to 2.6 throughout (inferred).

**Link weights.** Each cord is modelled as a cylinder packed with identical hyphae, so
conductance scales with cross-sectional area, not with radius to the fourth power. Link cost =
length x area; link resistance = length / area [1][2]. Measured cord diameters in these
microcosms run from 48 to 480 micrometres (finer ones are missed by the imaging) [3]; within a
single colony cords span micrometres to millimetres [2]. Inside a mature cord the inner medulla
holds wide, hollow, sparsely septate vessel hyphae of 10 to 15 micrometres, the outer medulla
holds hyphae down to 2 micrometres, and an outer rind limits exchange with the soil [2].

**Transport efficiency.** Compared with a Delaunay triangulation (DT) of the same nodes (the
well-connected reference) and a minimum spanning tree (MST, the cheapest), the real weighted
network had global efficiency close to the uniform-weight version (1.71 vs 1.59, MST 2.97;
lower is better in this normalisation) but root efficiency, from the inoculum outward, more than
fourfold better than a network with the same material spread evenly. The differential thickening
of cords, not the topology, is what gives the short effective paths [1][2].

**Hub dependence.** At 2 to 3 weeks about 90 percent of shortest paths pass through the
inoculum; by 5 to 6 weeks this falls to about 70 percent (control) and 55 percent (baited) as
tangential cross-links form [1].

**Robustness.** Under simulated link breakage an MST loses about half its mass after about 10
percent of links go; the real network tracks the fully triangulated reference until about 40
percent of link area is removed, and keeps a larger connected core than uniform-weight models
once more than about 30 percent is broken [1]. Real grazing by collembola trims the network back
to its reinforced core and increases tangential connections at the cost of exploration [2].
Grazing reduces extension and cover in *H. fasciculare*, *P. velutina* and *R. bicolor*, with
*R. bicolor* hit hardest (search snippet of Tordoff et al. 2006, not opened) [33].

**Flow.** A growth-induced mass-flow model (water must move toward wherever volume is being
added) predicts a heavy-tailed speed distribution: 36 percent of cords above 0.1 micrometres per
second, 11 percent above 0.5, 4 percent above 1 (if half the cord cross-section is vessel).
Cross-sectional area correlates with predicted current (Spearman 0.46), which supports "cords
that carry flow get thicker" [3]. Measured translocation: carbon label moving at about 7
micrometres per second in *P. velutina*; 4.4 to 9.8 in *Armillaria mellea*; 55 to 69 in *Serpula
lacrymans* [2] (units read as micrometres per second; the PDF text extraction dropped the mu
sign, and the values match the commonly quoted 25 cm per hour for *Serpula*).

**Fractal dimension.** Early work characterised cord systems by mass and border fractal
dimension [2]. Reviews describe diffuse, slow search fronts as having mass fractal dimension
close to 2 (plane-filling) and open, cord-dominated systems as lower, falling further as systems
age and thin out (*R. bicolor* given as an example) [10, snippet]. In soil trays fractal
dimension rose over the first 20 days and then held to day 42, while hyphal cover peaked at day
20 and had fallen by day 35 [7]. I could not open Bolton & Boddy (1993) or Donnelly & Boddy
(2001) for the per-species values. The range I recall, roughly 1.2 to 1.5 for *R. bicolor*, 1.4
to 1.7 for *P. velutina* and 1.7 to 1.9 for *H. fasciculare* in two dimensions, is unverified.

### 2.2 Foraging strategies

**Two axes that are often conflated.** (a) Whether the fungus can leave its resource at all:
"resource-unit-restricted" fungi (most bracket and crust fungi) spread only by spores, while
"non-unit-restricted" fungi grow out as mycelium or cords [34]. (b) Among those that grow out,
the phalanx to guerrilla continuum borrowed from clonal plants: a dense, slowly advancing front
that finds everything nearby (short-range), versus sparse, fast, well-separated cords that miss
small nearby items but reach distant large ones (long-range). *R. bicolor* and *P. velutina* are
described as long-range foragers that are less successful at exploiting local resources;
*H. fasciculare* produces dense fans and persistent fronts [10, snippet][2]. The phalanx and
guerrilla labels themselves were not confirmed in a source I could open.

**Response to a new resource.** Cords connecting the old and new resource thicken; mycelium
radiating in other directions regresses, to an extent that depends on the species and on the
relative sizes of old and new resource. Autophagy of the redundant mycelium funds the new growth
[2]. During baiting several cords compete for a week or two before one thickens enough to
dominate [2]. Quantitatively, for *P. velutina* at 20 C [4]:

- Inocula of 0.5, 2 and 4 cm3; baits of 0.5 to 36 cm3; bait added when the mycelium had grown
  6 cm; 48 days of contact.
- The fungus fully left its inoculum (no regrowth when the inoculum was moved to fresh soil) when
  the bait was above a threshold between 4 and 16 cm3, regardless of inoculum size. The trigger is
  absolute bait size, not the ratio.
- Overall, 67 percent of inocula regrew when moved.

Outgrowth effort also tracks the state of the home resource: after 27 days, cover on soil was
greater from small blocks and correlated with the *percentage* of the wood already decayed (20
percent mass loss for 0.5 cm3 blocks vs 12 percent for 1 to 2 cm3), not with absolute carbon
obtained [5]. In *Stropharia caerulea* extension slowed after contact with large baits (snippet of
Donnelly & Boddy 1997, not opened).

**Speed.** Absolute extension rates in mm per day for the classic species were not in any source I
could open. From the area table in [1], a colony of 229 cm2 at day 18 is a disc of radius 8.5 cm,
which gives about 4.7 mm per day for *P. velutina* at about 20 C (inferred, and tray-limited
later). *Clitocybe nebularis* reaches up to 3.4 mm per day in woodland, with agar rates only 30
to 40 percent of that (snippet of Dowson et al. 1989) [25]. Field translocation in *P. velutina*
cords has been recorded over 75 cm within 5 days, and 18 cm within 20 minutes in the lab (cited
in [4]).

### 2.3 Cords and rhizomorphs

**Cords** are linear aggregates of parallel hyphae that form behind a diffuse growing margin:
later hyphae grow along the first ones, fuse, and differentiate into vessel hyphae and a rind
[2][27]. They are indeterminate and need no apical organisation. **Rhizomorphs** (*Armillaria*,
some *Marasmius*) are more organ-like: an apically dominant growing point under a mucilage cap, a
melanised rind, a conducting medulla and a central air channel; they push through soil like a
root [27][22]. Reported maximum size: 5 mm diameter and 9 m length [27, citing Isaac 1995].

***Armillaria* rhizomorph networks.** Mapped *A. lutea* (= *A. gallica*) systems in two 25 m2
plantation plots had 109 and 152 m of rhizomorph (4.3 and 6.1 m per m2), with 84 and 48 percent
of that length in one connected component, 63 and 50 independent cycles, and 17 to 20 short
dead-end protrusions per m2 [23]. The better-connected plot had 169 edges and 107 nodes [23,
snippet], which gives mean degree 3.2 and alpha about 0.30 (inferred: 63 / (2 x 107 - 5)). Cutting
either of the two most critical edges disconnects 13 or 11 percent of the network [2][23].
Rhizomorphs lie mostly in the top 20 cm of soil [28].

**Spread rates.** For *A. ostoyae* in conifer forest: 0.22 m per year (110-year-old Douglas-fir),
0.87 m per year (young ponderosa pine), 0.7 to 1.3 m per year (20 to 27-year-old Douglas-fir
plantations). *A. ostoyae* is thought to spread more by root-to-root contact than by free
rhizomorphs [20]. A general figure of about 1 m per year for rhizomorph spread is widely quoted
[28]. *A. gallica* in Michigan expanded at about 0.2 m per year [24, citing 21].

**Largest individuals.**

| Genet | Area | Age estimate | Mass | Source |
|---|---|---|---|---|
| *A. ostoyae*, Malheur NF, Oregon | 965 ha, 3,810 m across | 1,900 to 8,650 years (from 1.0, 0.87 and 0.22 m per year) | not measured in [20] | [20] |
| *A. ostoyae*, same study, four others | 20, 95, 195, 260 ha | | | [20] |
| *A. gallica*, Crystal Falls, Michigan (1992 survey) | at least 15 ha | at least 1,500 years | over 10,000 kg | [21] |
| Same individual, resampled 2015 to 2017 | about 75 ha | at least 2,500 years | about 400,000 kg | [22] |
| *A. ostoyae*, Swiss National Park | mean 6.8 ha, largest about 37 ha | | | [29] |

Note the Oregon figure is quoted as 890 ha and 2,400 years in [24] and elsewhere; the primary
paper's abstract says 965 ha and 1,900 to 8,650 years [20]. Popular mass figures for the Oregon
genet (thousands of tonnes) are extrapolations, not measurements. Somatic mutation in the
Michigan genet is very low (163 variants among 15 sequenced samples), so the whole thing is one
genetic individual [22].

### 2.4 Fairy rings

Mechanism: a mycelial front expands radially through soil or litter and does not grow back into
ground it has already occupied. The old explanations are nutrient depletion (little support) and
self-inhibition by residues; a sod-inversion experiment showed *Clitocybe nebularis* will not
grow into soil it has conditioned, and current models attribute this to accumulating
self-inhibitory debris (the self-DNA hypothesis, proposed and modelled by the review's own
group) [24]. Effects on plants come from water-repellent mycelial mats (the main cause of the
dead zone in models), toxins such as cyanide in *Marasmius oreades*, and nutrient release behind
the front (the green band) [24].

Radial rates by genus [24]: *Marasmius* 7 to 39 cm per year; *Tricholoma* (ectomycorrhizal) about
17; *Armillaria gallica* about 20; *Russula* (ectomycorrhizal) about 22; *Agaricus* about 55;
*Lepista* about 60 (one *L. sordida* record of 125 on turf); *Clitocybe* about 75. Mat depth: up
to 4 cm (*Lycoperdon*), 10 cm (*Agaricus arvensis*), 15 cm (*Tricholoma matsutake*), 22 cm
(*Agaricus campestris*). Largest ring: *Infundibulicybe geotropa* in France, 800 m diameter,
about 700 years. 121 taxa are recorded forming rings [24].

Shantz & Piemeisel types: 1, dead zone plus stimulated zone; 2, stimulated zone only; 3, no
effect on vegetation, visible only as a ring of fruit bodies [24]. "Free" rings are saprotrophic
in grassland; "tethered" rings are ectomycorrhizal and tied to a tree. When two fronts meet,
three outcomes are modelled: both carry on, one is extinguished, or both are extinguished along
the contact line, leaving arcs [24]. Arcs and rotors (about 18 m) are as common as closed rings
(about 12 m) in mapped grasslands [24].

### 2.5 Ectomycorrhizal exploration types

Agerer (2001) classified ectomycorrhizas by how much mycelium leaves the root-tip mantle and
whether it forms rhizomorphs [14, via 13 and 15]:

| Type | Form | Wettability | Genera (dominant type) |
|---|---|---|---|
| Contact | smooth mantle, few emanating hyphae | hydrophilic | *Russula*, *Lactarius*, *Hyaloscypha*; some *Tomentella* |
| Short-distance | dense halo of short unaggregated hyphae, no rhizomorphs | mostly hydrophilic | *Cenococcum*, *Tylospora*, *Inocybe*, *Hygrophorus*; most ectomycorrhizal ascomycetes |
| Medium-distance smooth | little mycelium near root, smooth undifferentiated cords | variable | *Amanita* (hydrophobic), *Laccaria*, *Tomentella*, *Pseudotomentella* (hydrophilic) |
| Medium-distance fringe | fans of hyphae and hairy rhizomorphs that branch and re-fuse | hydrophobic | *Cortinarius*, *Piloderma*, *Amphinema*, *Tricholoma* |
| Medium-distance mat | dense mats that bind soil into a mass | hydrophobic | *Hydnellum*, *Ramaria* (also *Hysterangium*, *Gautieria*, from memory) |
| Long-distance | few, highly differentiated rhizomorphs with hollow vessel hyphae | hydrophobic | *Suillus*, *Rhizopogon*, *Boletus*, *Paxillus*, *Xerocomus* |

Genus assignments are from [13] (Table 3) and the Hobbie & Agerer table as reported in a search
result [17]; the two disagree on *Lactarius*/*Russula* versus medium-smooth and on *Hygrophorus*,
and large genera contain more than one type [15]. Distances are not given in any source I
opened. The figures usually quoted (contact and short: millimetres; medium: up to a few
centimetres; long: decimetres) are from memory and unverified.

Measured per-tip values (Weigt et al. 2012, abstract and erratum snippet only) [16]:
short-distance mycelia occupy 321 +/- 104 mm2 of potential space and 89 +/- 18 mm2 of actual
projected area per cm of mycorrhizal root length, with 0.39 mm2 of hypha per mm2 occupied.
Mycelial length and biomass per unit root are 1.9 times higher for medium-distance and 15 times
higher for long-distance types; density within the occupied area is about twice as high in
medium-distance as long-distance.

**How well the types predict behaviour.** In a field "cafeteria" test exploration type did not
predict which genera colonised ingrowth bags (P = 0.7); contact-type *Russula* and *Lactarius*
were as abundant in soil bags as on roots, and supposedly high-biomass *Cortinarius* and
*Piloderma* were scarce in bags within one season, probably because they build long-lived cords
slowly [13]. Treat exploration type as a morphology label, not a growth-rate label.

### 2.6 How much mycelium is in soil

- Production of ectomycorrhizal extramatrical mycelium (EMM): up to several hundred kg per ha
  per year across about 140 forest sites, biased to Norway spruce in Scandinavia; turnover is
  very uncertain [18, abstract].
- EMM is about one third of forest soil microbial biomass; about 23 percent of plant-fixed
  carbon goes to it in lab studies; longevity from months (diffuse hyphae) to years (cords) [15].
- Hyphal length density: 20 to 50 m per g soil is cited from Jones et al. 1990, and length per
  gram of mycelium is 1 to 3 x 10^5 m (Wallander) up to 8.3 x 10^5 m (Hunt & Fogel) [19, search
  snippet of a 2013 modelling review; not opened].
- Rhizomorphs of *Pisolithus* on pine seedlings were 7 percent of mycelial length but twice the
  dry mass of the diffuse mycelium [19, snippet].
- Worked example (inferred): 100 kg per ha standing EMM is 10 g per m2; at 2 x 10^5 m per g that
  is 2 x 10^6 m of hypha under each m2, or about 20 m per cm3 if spread over the top 10 cm.

No simulator tier can hold this explicitly (1 cm3 would need 20 m of edges). It has to be a
density field with explicit cords on top.

### 2.7 Common mycorrhizal networks between trees

**Demonstrated.** (a) In the lab, autoradiography shows 14C moving more than 20 cm from one
seedling into the mycorrhizal roots of another through shared mycelium [11]. (b)
Mycoheterotrophic plants live on carbon obtained through shared fungi [11]. (c) Genet mapping in
Douglas-fir: in a 30 x 30 m plot, 13 to 14 genets each of *Rhizopogon vesiculosus* and
*R. vinicolor*, single genets colonising up to 19 trees, big old trees with the most links [12,
abstract]. (d) Labelled carbon does move between trees in the field; in one birch and fir study
net gain by fir was 2 to 3 percent [32, secondary].

**Not demonstrated, per Karst, Jones & Hoeksema (2023)** [11]:

- *Claim 1, networks are widespread.* Only five mapping studies, two forest types, two tree
  species and three fungal species; only two show actual continuity. Shared fungal *species* is
  not a shared *genet*: some fungi form small, short-lived genets (largest genets about 1 to 9 m2
  in *Amanita*, *Russula*, *Lactarius* [31, snippet], against 20 to 40 m across in *Suillus*).
  Hyphae turn over and are grazed, so persistence of links is unknown.
- *Claim 2, resources move through them and help seedlings.* 26 field studies reviewed. Every
  positive result has an alternative explanation (transfer through soil solution, restricted
  soil volume in fine-mesh controls, changed pathogen or mycorrhizal communities). In 13 studies
  with a no-mesh treatment, 5 of 28 experiments (18 percent) showed a positive network effect not
  cancelled by root competition.
- *Claim 3, mother trees favour kin or send warnings.* No peer-reviewed field evidence. In the
  one greenhouse kin study carbon moved through soil solution; in the one defence-signal study
  the effect vanished when roots could intermingle.
- Unsupported citations rose to about 25 percent (structure) and almost 50 percent (function).

The authors do not dispute that mycorrhizas matter or that such networks can exist.

### 2.8 Remodelling over time

Sequence in *P. velutina* and *Phallus impudicus* microcosms: diffuse or densely cross-linked
outgrowth; cords form behind the front; tangential fusions add loops; unused fine mycelium and
weak cords are recycled; the system thins to a sparse skeleton linking resources as the wood is
used up [1][2]. Indicative times at 18 to 20 C: cover peaks at about 20 days; node and link
counts peak at about 31 days; "tangled" networks among nine blocks at about 34 days resolve into
clear trunk routes by 116 days [1][7][6]. Local damage strengthens cords around the wound and
the network regrows and reconnects [2].

### 2.9 Memory-like behaviour

Well supported (one species, replicated design) [4]: after 48 days connected to a bait, an
inoculum block moved to fresh soil regrew more from the side that had faced the bait. Bait-side
bias in the first period predicted bait-side bias in the second (risk ratio 1.64). The likely
substrate is structural: more surviving hyphae and reserves on that side of the block. A second
study reports that connection patterns among nine blocks differ between a circle and a cross
layout, and decay follows connectivity [6, press release only]. Words such as decision,
recognition and cognition are the authors' framing and are contested [35]. For a simulator,
"memory" is just state stored in the graph and in the wood: no extra mechanism is needed.

### 2.10 Interactions between individuals

**Same species, different genet.** Hyphae fuse, the fused compartments die, and a line of dead
or pigmented cells (a barrage or zone line) separates the two territories. This somatic
incompatibility acts in the secondary mycelium and is polygenic and not well resolved [30,
snippet]. It is how *Armillaria* genets are mapped in the field [20]. Same genet: fusion is
unrestricted, which is what makes the loops in section 2.1.

**Different species.** Outcomes are deadlock, partial replacement, complete replacement, or
mutual replacement [7][8]. There is a rough hierarchy: primary colonisers (*Vuilleminia
comedens*) lose to early secondary colonisers (*Trametes versicolor*, *Stereum hirsutum*,
*Bjerkandera adusta*), which lose to late-stage cord formers (*H. fasciculare*, *P. velutina*).
The hierarchy is not strict: *P. velutina* replaces *H. fasciculare*, which replaces
*S. hirsutum*, yet *P. velutina* deadlocks with *S. hirsutum*. Larger territories win more
often. Mechanisms include barrages, invasive cords, diffusible and volatile inhibitors and
oxidative enzymes [7]. *H. fasciculare* builds dense non-invasive fans and holds a persistent
front in deadlock (snippet of Donnelly & Boddy 2001).

## 3. Numbers for the model

| Parameter | Value or range | Units | Species | Source | Confidence |
|---|---|---|---|---|---|
| Node degree allowed | 1, 3, rarely 4 | count | cord formers | [2] | sourced |
| Mean degree (2L/N) | 2.5 to 2.6 | count | *P. velutina* | from [1] | inferred |
| Meshedness alpha, mature | 0.11 to 0.20 (range 0.1 to 0.2) | fraction | *P. velutina* | [1][2] | sourced |
| Meshedness alpha, young | about 0 | fraction | *P. velutina* | [1] | sourced |
| Meshedness alpha, rhizomorphs | about 0.30 | fraction | *Armillaria lutea* | from [23] | inferred |
| Nodes in a 24 cm tray at 5 to 6 weeks | about 700 | count | *P. velutina* | [1] | sourced |
| Links, same | about 900 | count | *P. velutina* | [1] | sourced |
| Node density, mature | about 1.4 | per cm2 | *P. velutina* | from [1] | inferred |
| New cords and nodes | about 2 each | per hour per colony | *P. velutina* | [3] | sourced |
| Material per area, young to mature | 1.0 to 0.6 (baited 1.2 to 0.7) | mm3 cm-2 | *P. velutina* | [1] | sourced |
| Volume growth, first 3 weeks | 0.5 to 1.1 | mm3 h-1 | *P. velutina* | [3] | sourced |
| Cord diameter (imaged) | 48 to 480 | micrometres | *P. velutina* | [3] | sourced |
| Vessel hypha diameter | 10 to 15 | micrometres | basidiomycete cords | [2] | sourced |
| Fraction of cord that conducts | 0.1 to 0.5 (assumed) | fraction | *P. velutina* | [2][3] | sourced as assumption |
| Link conductance | proportional to area / length | | cord formers | [1][2] | sourced |
| Shortest paths through inoculum | 90 falling to 55 to 70 | percent | *P. velutina* | [1] | sourced |
| Links removable before core fails | about 30 to 40 percent of link area | percent | *P. velutina* | [1] | sourced |
| Flow speed in major cords | 1 to 10 | micrometres s-1 | *P. velutina* | [2][3] | sourced |
| Translocation speed | 4.4 to 9.8; 55 to 69 | micrometres s-1 | *A. mellea*; *S. lacrymans* | [2] | sourced (unit reconstructed) |
| Radial extension on soil, about 20 C | about 4.7 | mm d-1 | *P. velutina* | from [1] | inferred |
| Radial extension, woodland | up to 3.4 | mm d-1 | *Clitocybe nebularis* | [25] | uncertain (snippet) |
| Cover peak; node-count peak | 20; 31 | days | *P. velutina* | [7][1] | sourced |
| Bait size that triggers full migration | between 4 and 16 | cm3 | *P. velutina* | [4] | sourced |
| Regrowth after 48 d on bait | 67 | percent of inocula | *P. velutina* | [4] | sourced |
| Directional carry-over (risk ratio) | 1.64 | ratio | *P. velutina* | [4] | sourced |
| Mass fractal dimension, 2D | near 2 (dense) down to about 1.2 to 1.5 (sparse) | none | cord formers | [10], memory | uncertain |
| Rhizomorph diameter, maximum | 5 | mm | *Armillaria* | [27] | sourced (secondary) |
| Rhizomorph length density | 4.3 to 6.1 | m m-2 | *A. lutea* | [23] | sourced |
| Largest connected component | 48 to 84 | percent of length | *A. lutea* | [23] | sourced |
| Rhizomorph depth | top 20 | cm | *Armillaria* | [28] | sourced (secondary) |
| Genet spread rate | 0.22 to 1.3 | m yr-1 | *A. ostoyae* | [20] | sourced |
| Genet spread rate | about 0.2 | m yr-1 | *A. gallica* | [24] | sourced (secondary) |
| Largest genet | 965 ha; 1,900 to 8,650 yr | | *A. ostoyae* | [20] | sourced |
| Largest weighed genet | 75 ha; 4 x 10^5 kg; 2,500 yr or more | | *A. gallica* | [22] | sourced |
| Fairy ring radial rate | 7 to 39 | cm yr-1 | *Marasmius* | [24] | sourced |
| Fairy ring radial rate | about 55; 60; 75 | cm yr-1 | *Agaricus*; *Lepista*; *Clitocybe* | [24] | sourced |
| Fairy ring radial rate, ectomycorrhizal | about 17; 22 | cm yr-1 | *Tricholoma*; *Russula* | [24] | sourced |
| Ring mat depth | 4 to 22 | cm | several | [24] | sourced |
| Largest ring | 800 m; about 700 yr | | *Infundibulicybe geotropa* | [24] | sourced |
| EMM length per root, relative to short-distance | 1.9 (medium), 15 (long) | ratio | by exploration type | [16] | uncertain (abstract) |
| Space occupied per cm of root, short-distance | 321 potential; 89 actual | mm2 cm-1 | short-distance type | [16] | uncertain (erratum snippet) |
| EMM production | up to several hundred | kg ha-1 yr-1 | forest ectomycorrhizal fungi | [18] | sourced (abstract) |
| Hyphal length density in soil | 20 to 50 | m g-1 soil | ectomycorrhizal forest soil | [19] | uncertain (snippet) |
| Hyphal length per mycelial mass | 1 x 10^5 to 8.3 x 10^5 | m g-1 | ectomycorrhizal | [19] | uncertain (snippet) |
| Hyphal length per soil volume | about 20 per 100 kg ha-1 standing | m cm-3 | ectomycorrhizal | from [19] | inferred |
| Genet size, small-genet fungi | 1 to 9 | m2 | *Amanita*, *Russula*, *Lactarius* | [31] | uncertain (snippet) |
| Genet size, large-genet fungi | 20 to 40 | m across | *Suillus* | [31] | uncertain (snippet) |
| Trees per fungal genet, maximum | 19 (30 x 30 m plot) | count | *Rhizopogon* | [12] | sourced (abstract) |
| Lab carbon transfer distance | more than 20 | cm | seedlings | [11] | sourced |
| Field experiments with net positive network effect | 5 of 28 | count | forest seedlings | [11] | sourced |

## 4. Proposed network families

All parameter ranges below are starting values. Unless a source is given they are inferred from
the nearest measured species and should be marked `inferred` in family files.

| # | Family | Defining traits | Front speed | Target alpha | Persistent link width | Example genera |
|---|---|---|---|---|---|---|
| 1 | Unit-restricted wood decayer | Stays inside one piece of wood; no outgrowth; territories bounded by zone lines | 1 to 10 mm d-1 in wood | high, dense (no cords) | none | *Trametes*, *Stereum*, *Bjerkandera*, *Fomes*, *Ganoderma*, *Pleurotus* |
| 2 | Short-range (phalanx) cord forager | Dense slow fans, high fractal dimension, cords late and short, holds ground | 1 to 3 mm d-1 | 0.15 to 0.25 | 0.05 to 0.5 mm | *Hypholoma*, *Stropharia*, *Megacollybia* |
| 3 | Long-range (guerrilla) cord forager | Sparse fast cords, low fractal dimension, strong reallocation, migrates | 4 to 8 mm d-1 | 0.1 to 0.2 [1] | 0.05 to 0.5 mm [3], up to mm | *Phanerochaete*, *Resinicium*, *Phallus*, *Serpula*, *Coprinopsis picacea* |
| 4 | Rhizomorph system | Apically organised melanised organs; decades-long persistence; parasitic and saprotrophic | 0.2 to 1.3 m yr-1 [20] | about 0.3 [23] | 1 to 5 mm [27] | *Armillaria*, *Desarmillaria*; aerial: *Marasmius crinis-equi* |
| 5 | Free fairy ring | Annular front in grass or litter, self-inhibited interior, mat 4 to 22 cm deep | 7 to 125 cm yr-1 [24] | high within band | none | *Marasmius oreades*, *Agaricus*, *Lepista*, *Clitocybe*, *Infundibulicybe*, *Calvatia* |
| 6 | Ectomycorrhizal contact and short-distance | Mycelium within millimetres of root tips; no cords; spreads with roots and spores; small genets | follows root growth | not applicable (halo) | none | *Russula*, *Lactarius*, *Cenococcum*, *Inocybe*, *Tuber*, *Tylospora* |
| 7 | Ectomycorrhizal medium-distance (fringe and smooth) | Fans plus re-fusing hairy cords (fringe) or smooth cords (smooth); centimetre reach | cm per month | 0.1 to 0.3 | 0.02 to 0.2 mm | *Cortinarius*, *Piloderma*, *Tricholoma*, *Amphinema*; *Amanita*, *Laccaria*, *Tomentella* |
| 8 | Ectomycorrhizal mat and tethered ring | Dense hydrophobic mats binding soil; ring-like "shiro" expanding from a host | 10 to 25 cm yr-1 [24] | high within mat | few | *Hydnellum*, *Ramaria*, *Hysterangium*, *Tricholoma matsutake* |
| 9 | Ectomycorrhizal long-distance | Few thick differentiated rhizomorphs with vessels; decimetre to metre reach; large genets linking many trees | dm per month | 0.05 to 0.15 | 0.1 to 1 mm | *Suillus*, *Rhizopogon*, *Boletus*, *Paxillus*, *Pisolithus*, *Scleroderma* |
| 10 | Ruderal dense colony | Fast, dense, short-lived radial colony on a rich ephemeral substrate; fruits quickly; no cords | 5 to 20 mm d-1 | high, dense | none | *Coprinopsis cinerea*, *Panaeolus*, *Volvariella*, *Schizophyllum* |
| 11 | Insect-tended garden | Network confined to a comb or garden, pruned and fed by insects; no free foraging | set by host | high | none | *Termitomyces*, *Leucoagaricus* |
| 12 | Insect parasite (optional) | Network fills a host body, then one stalk | host-limited | not applicable | none | *Ophiocordyceps*, *Cordyceps* |

**1. Unit-restricted wood decayer.** The network never leaves its log or trunk and arrives by
spore. What matters is the three-dimensional decay column, the boundary lines with neighbours and
the combat rank, not graph topology. Model as a filling front inside a wood volume with a
combat-strength parameter. Low on the combat hierarchy for primary colonisers, middle for
*Trametes* and *Bjerkandera* [7].

**2. Short-range cord forager.** Grows out of wood as a dense, slowly advancing fan and only
consolidates cords behind it. Finds small, close resources; defends territory with dense
non-invasive fans; high combat rank [7]. Regime: high branching rate, low tip speed, slow weak
pruning, many fusions.

**3. Long-range cord forager.** The best-measured family and the natural calibration target
(*P. velutina*). Sparse fast cords, early strong pruning, loops added tangentially, complete
migration to large new resources [1][4]. Regime: low branching, high tip speed, strong
flow-dependent thickening, aggressive recycling.

**4. Rhizomorph system.** Edges are organs with their own growing tip, a protective rind and
decade-scale survival, so pruning is very slow and dead-end protrusions persist (17 to 20 per
m2) [23]. Infects roots on contact. Stand-scale and seasonal time steps. One genet can cover
hundreds of hectares.

**5. Free fairy ring.** Not a foraging network but a travelling band. Needs a self-inhibition
field left behind the front, a hydrophobic mat state, and annihilation rules where fronts meet
[24]. Fruiting happens on the band.

**6. Ectomycorrhizal contact and short-distance.** The mycelium is a millimetre-scale halo
around each colonised root tip. The "network" is the root system. Model as a per-root-tip density
kernel with no explicit edges; genets are small and renewed from spores [31].

**7. Ectomycorrhizal medium-distance.** Fans and thin cords reach centimetres from roots,
branching and re-fusing (fringe) or running smooth (smooth). Hydrophobic in the fringe types.
Slow to build, long-lived once built [13]. Explicit thin cords over a density field.

**8. Ectomycorrhizal mat and tethered ring.** Dense, water-repellent mats that change the soil
itself; in *Tricholoma matsutake* the mat is a slowly expanding ring anchored to host roots (up
to four genets in one ring) [24]. Shares the band mechanics of family 5 but needs host roots
inside the band.

**9. Ectomycorrhizal long-distance.** A few differentiated rhizomorphs with vessel hyphae carry
water and nutrients over decimetres or more; about 15 times the mycelial length per root tip of
short-distance types [16]; genets tens of metres across that can colonise many trees [12][31].
The family in which tree-to-tree links are best documented.

**10. Ruderal dense colony.** Dung, compost and fresh-wound specialists: fast, dense, radially
symmetric, quick to fruit, then gone. Closest to an agar-plate colony. Parameters should come
from the growth-biology write-up (topic 1), not from this one.

**11. Insect-tended garden.** The insects do the foraging and pruning; the network is a dense
mat on a managed substrate. Outside the literature read for this topic; listed because the plan
names it. All values unknown.

**12. Insect parasite.** Optional; included only if the species list keeps *Cordyceps*-type
fungi. Not researched here.

## 5. What this means for the simulator

From simplest to most detailed.

**Rule 1 (4K). Fusion makes loops; target alpha, not degree.** Tips branch (creating a degree-3
node) and fuse on contact with their own network (another degree-3 node). Check the result with
alpha = (L - N + 1) / (2N - 5): near 0 for a young colony, 0.1 to 0.2 when mature. Do not aim
for a degree distribution; it is fixed at 1 and 3.

**Rule 2 (4K). One foraging dial.** A single parameter trades branching rate against tip speed
at fixed resource use: dense and slow (family 2) to sparse and fast (family 3). This one number
is the most useful species parameter at the smallest tier.

**Rule 3 (40K). Over-produce, then prune.** Every edge has a cross-sectional area. Each slow
step, area grows in proportion to the flow the edge carried and shrinks at a constant rate;
edges below a minimum area are deleted and their material returned to the pool. Calibrate so
that edge count peaks and then falls by 10 to 15 percent, and material per area falls from 1.0
to 0.6 mm3 cm-2 over about 3 weeks of model time [1].

**Rule 4 (40K). Conductance proportional to area.** Cords are bundles of similar tubes, so use
conductance = k x area / length, not a fourth-power law [1][2]. Flow is driven by growth: each
growing tip is a volume sink, the food source is the supply, solve the linear system on the
graph [3].

**Rule 5 (40K). New-resource response.** When a tip reaches a resource patch it becomes a second
supply node. Rule 3 then thickens the connecting path and starves the rest without extra code. Add
one explicit rule: if the new resource exceeds a species threshold (4 to 16 cm3 for
*P. velutina*) the old inoculum stops being maintained [4].

**Rule 6 (40K). Outgrowth effort follows resource state.** Tip production from a wood block
scales with the fraction of that block already decayed, not with its size [5].

**Rule 7 (40K). Bands.** Fairy rings (families 5 and 8) are a front that deposits an inhibitor
field that decays slowly; tips cannot enter inhibited cells. Fronts that meet annihilate or
cross according to a per-pair rule [24]. This is cheap and can run on the coarse grid alone.

**Rule 8 (400K). Non-self.** Each individual carries a genet id. Same id: fuse. Different id,
same species: both contacting segments die and the cells become a barrier. Different species:
look up a pairwise outcome (deadlock, A replaces B, B replaces A) from a combat matrix that need
not be transitive, weighted by local territory size [7].

**Rule 9 (400K). Two-layer mycorrhizal mycelium.** Diffuse mycelium is a density field in m per
cm3 (order 1 to 50) attached to root tips with a per-family kernel width; explicit edges are
used only for cords and rhizomorphs (families 7 to 9). Relative mycelial length per root tip:
1 : 1.9 : 15 for short : medium : long [16].

**Rule 10 (400K). Tree-to-tree links are an option, off by default.** A link exists only where
one genet's explicit cords touch roots of two trees. Any carbon transfer should be small (a few
percent of the receiver's gain at most) and switchable, and the interface should say that field
evidence for benefit is weak [11].

**Rule 11 (4M). Rhizomorph organs.** Family 4 edges have their own apex, a rind that blocks
exchange along the shaft, near-zero pruning rate and a yearly, not daily, time step: 0.2 to 1.3
m per year, 4 to 6 m of rhizomorph per m2 of ground, alpha about 0.3 [20][23].

**Rule 12 (4M). Validation targets to embed.** Table 1 of [1] (area, nodes, links, material at
days 18 to 39), the hub fraction (90 falling to 55 to 70 percent), the breakage curve (core
intact to 30 to 40 percent of link area removed), and the speed distribution (36, 11 and 4
percent of cords above 0.1, 0.5 and 1 micrometres per second) [1][3].

**Memory needs no rule.** Directional regrowth [4] falls out of rules 3 and 6 if the wood block
stores where its surviving hyphae and reserves are.

## 6. Open or contested points

- **Common mycorrhizal networks in forests**: existence at genet level is shown for very few
  systems; functional benefit to seedlings and kin signalling are not shown in the field [11].
  Others in the field regard the critique as too strict; that response literature was not read.
- **Fungal "memory", "decision" and "recognition"**: the observations are solid for one species
  [4]; the cognitive vocabulary is disputed [35].
- **Exploration types as predictors**: morphology is real; the link to foraging and biomass is
  weak in the one direct field test I read [13]. Genus-level assignments conflict between
  sources.
- **Why fairy ring interiors stay empty**: self-DNA inhibition is championed by the authors of
  the review I read [24] and is not independently established.
- **Ages and masses of giant *Armillaria***: ages rest entirely on assumed spread rates (a
  factor of 4.5 between extremes) [20]; the 400,000 kg figure is an extrapolation from sampled
  rhizomorph density [22]; whether a 965 ha genet is physically continuous is unknown [20].
- **Fraction of a cord that conducts**: assumed at 10 to 50 percent, not measured [2][3].
- **Alpha depends on imaging resolution** [2], so targets apply to the corded network only.
- **Not verified this session** (search budget exhausted; do not enter as `sourced`):
  per-species fractal dimensions; per-species extension rates in mm per day for *H. fasciculare*,
  *R. bicolor*, *Phallus impudicus*; the phalanx and guerrilla terminology in a primary source;
  exploration-type reach distances; full Weigt et al. table; Ekblad et al. standing biomass and
  turnover; hyphal length per gram of soil from a primary source; *T. matsutake* ring rate
  beyond the genus mean; Klein et al. 2016 and Simard et al. 1997 transfer figures; the
  full citation details of [8], [19] and [23].
- **Families 10 to 12** rest on general knowledge, not on sources read for this topic.

## 7. Sources

Status key: **read** = full text opened and used; **partial** = abstract, table page, press
release or first part only; **cited only** = seen in search results or in another source.

1. Bebber DP, Hynes J, Darrah PR, Boddy L, Fricker MD (2007). Biological solutions to transport network design. *Proc R Soc B* 274:2307-2315. doi:10.1098/rspb.2007.0459. https://pmc.ncbi.nlm.nih.gov/articles/PMC2288531 . **Read.**
2. Heaton L, Obara B, Grau V, Jones N, Nakagaki T, Boddy L, Fricker MD (2012). Analysis of fungal networks. *Fungal Biology Reviews* 26:12-29. doi:10.1016/j.fbr.2012.02.001. **Read** (PDF text; micro signs lost in extraction).
3. Heaton LLM, Lopez E, Maini PK, Fricker MD, Jones NS (2010). Growth-induced mass flows in fungal networks. *Proc R Soc B* 277:3265-3274. doi:10.1098/rspb.2010.0735. https://pmc.ncbi.nlm.nih.gov/articles/PMC2981926 . **Read.**
4. Fukasawa Y, Savoury M, Boddy L (2020). Ecological memory and relocation decisions in fungal mycelial networks: responses to quantity and location of new resources. *ISME J* 14:380-388. doi:10.1038/s41396-019-0536-3. https://pmc.ncbi.nlm.nih.gov/articles/PMC6976561 . **Read.**
5. Fukasawa Y, Kaga K (2020). Effects of wood resource size and decomposition on hyphal outgrowth of a cord-forming basidiomycete, *Phanerochaete velutina*. *Sci Rep* 10:21936. doi:10.1038/s41598-020-79058-8. **Read.**
6. Fukasawa Y, Hamano K, Kaga K, Akai D, Takehi T (2024). Spatial resource arrangement influences both network structures and activity of fungal mycelia: a form of pattern recognition? *Fungal Ecology* 101387. doi:10.1016/j.funeco.2024.101387. **Partial** (university press release, https://www.agri.tohoku.ac.jp/en/highlights/20240925-form ; title and author list not confirmed against the paper).
7. Hiscox J, Savoury M, Toledo S, Kingscott-Edmunds J, Bettridge A, Al Waili N, Boddy L (2017). Threesomes destabilise certain relationships: multispecies interactions between wood decay fungi in natural resources. *FEMS Microbiol Ecol* 93:fix014. doi:10.1093/femsec/fix014. **Read.**
8. Boddy L (2000). Interspecific combative interactions between wood-decaying basidiomycetes. *FEMS Microbiol Ecol* 31:185-194. **Cited only** (abstract via search; volume and pages from memory).
9. Boddy L (1999). Saprotrophic cord-forming fungi: meeting the challenge of heterogeneous environments. *Mycologia* 91:13-32. **Cited only.**
10. Boddy L, Hynes J, Bebber DP, Fricker MD (2009). Saprotrophic cord systems: dispersal mechanisms in space and time. *Mycoscience* 50:9-19. doi:10.1007/s10267-008-0450-4. **Cited only** (search snippets; publisher page blocked).
11. Karst J, Jones MD, Hoeksema JD (2023). Positive citation bias and overinterpreted results lead to misinformation on common mycorrhizal networks in forests. *Nature Ecology & Evolution* 7:501-511. doi:10.1038/s41559-023-01986-1. **Read** (author-hosted PDF; volume and pages from memory, DOI confirmed).
12. Beiler KJ, Durall DM, Simard SW, Maxwell SA, Kretzer AM (2010). Architecture of the wood-wide web: *Rhizopogon* spp. genets link multiple Douglas-fir cohorts. *New Phytologist* 185:543-553. doi:10.1111/j.1469-8137.2009.03069.x. **Partial** (abstract via search).
13. Jorgensen K, Clemmensen KE, Wallander H, Lindahl BD (2023). Do ectomycorrhizal exploration types reflect mycelial foraging strategies? *New Phytologist* 237:576-584. doi:10.1111/nph.18566. https://pmc.ncbi.nlm.nih.gov/articles/PMC10098516 . **Read.**
14. Agerer R (2001). Exploration types of ectomycorrhizae. *Mycorrhiza* 11:107-114. doi:10.1007/s005720100108. **Cited only.**
15. Wikipedia, "Ectomycorrhizal extramatrical mycelium". https://en.wikipedia.org/wiki/Ectomycorrhizal_extramatrical_mycelium . **Read** (secondary).
16. Weigt RB, Raidl S, Verma R, Agerer R (2012). Exploration type-specific standard values of extramatrical mycelium. *Mycological Progress* 11:287-297. doi:10.1007/s11557-011-0750-5 (erratum doi:10.1007/s11557-011-0772-z). **Partial** (abstract and erratum snippet).
17. Hobbie EA, Agerer R (2010). Nitrogen isotopes in ectomycorrhizal sporocarps correspond to belowground exploration types. *Plant and Soil* 327:71-83. **Cited only.**
18. Ekblad A, Wallander H, Godbold DL, et al. (2013). The production and turnover of extramatrical mycelium of ectomycorrhizal fungi in forest soils: role in carbon cycling. *Plant and Soil* 366:1-27. doi:10.1007/s11104-013-1630-3. **Partial** (abstract).
19. A 2013 to 2014 modelling review by Deckmyn and co-authors (including Ekblad) on ectomycorrhizal fungi in forest carbon and nitrogen models, citing Jones et al. 1990, Wallander et al. 2004 and Hunt & Fogel 1983. **Cited only** (search snippet; exact reference not confirmed).
20. Ferguson BA, Dreisbach TA, Parks CG, Filip GM, Schmitt CL (2003). Coarse-scale population structure of pathogenic *Armillaria* species in a mixed-conifer forest in the Blue Mountains of northeast Oregon. *Can J For Res* 33:612-623. doi:10.1139/x03-065. https://research.fs.usda.gov/treesearch/20135 . **Read.**
21. Smith ML, Bruhn JN, Anderson JB (1992). The fungus *Armillaria bulbosa* is among the largest and oldest living organisms. *Nature* 356:428-431. doi:10.1038/356428a0. **Partial** (abstract).
22. Anderson JB, Bruhn JN, Kasimer D, Wang H, Rodrigue N, Smith ML (2018). Clonal evolution and genome stability in a 2500-year-old fungal individual. *Proc R Soc B* 285:20182233. doi:10.1098/rspb.2018.2233. https://pmc.ncbi.nlm.nih.gov/articles/PMC6304041 . **Read.**
23. Lamour A, Termorshuizen AJ, Volker D, Jeger MJ (2007). Network formation by rhizomorphs of *Armillaria lutea* in natural soil: their description and ecological significance. *FEMS Microbiol Ecol* 62:222-232. **Partial** (results table page and abstract; author list and pages from memory and from the citation in [2]).
24. Zotti M, Bonanomi G, Mazzoleni S (2025). Fungal fairy rings: history, ecology, dynamics and engineering functions. *IMA Fungus* 16:e138320. doi:10.3897/imafungus.16.138320. https://pmc.ncbi.nlm.nih.gov/articles/PMC11881004/ . **Read** (first 100,000 of 178,000 characters).
25. Dowson CG, Rayner ADM, Boddy L (1989). Spatial dynamics and interactions of the woodland fairy ring fungus, *Clitocybe nebularis*. *New Phytologist* 111:699-705. **Cited only** (snippet; volume and pages from memory).
26. Shantz HL, Piemeisel RL (1917). Fungus fairy rings in eastern Colorado and their effect on vegetation. *J Agric Res* 11:191-245. **Cited only** (via [24]).
27. Wikipedia, "Mycelial cord", citing Isaac S (1995) *Mycologist* 9:90-91 and Shaw & Kile (1991). https://en.wikipedia.org/wiki/Mycelial_cord . **Read** (secondary).
28. Wikipedia, "Armillaria". https://en.wikipedia.org/wiki/Armillaria . **Read** (secondary).
29. Moore D, Robson GD, Trinci APJ. *21st Century Guidebook to Fungi*, section 14.4. https://davidmoore.org.uk/21st_Century_Guidebook_to_Fungi_PLATINUM/Ch14_04.htm . **Read** (secondary; cites Bendel et al. 2006).
30. Worrall JJ (1997). Somatic incompatibility in basidiomycetes. *Mycologia* 89:24-36. **Cited only.**
31. Redecker D, Szaro TM, Bowman RJ, Bruns TD (2001). Small genets of *Lactarius xanthogalactus*, *Russula cremoricolor* and *Amanita francheti* in late-stage ectomycorrhizal successions. *Molecular Ecology* 10:1025-1034. **Cited only** (snippet; journal details from memory).
32. Wikipedia, "Mycorrhizal network" (carries an accuracy-dispute banner), citing Philip et al. 2010 and Simard et al. 1997. https://en.wikipedia.org/wiki/Mycorrhizal_network . **Partial.**
33. Tordoff GM, Boddy L, Jones TH (2006). Grazing by *Folsomia candida* (Collembola) differentially affects mycelial morphology of the cord-forming basidiomycetes *Hypholoma fasciculare*, *Phanerochaete velutina* and *Resinicium bicolor*. *Mycological Research* 110:335-345. **Cited only** (snippet; title and pages from memory).
34. Boddy L, Jones TH (2007). Mycelial responses in heterogeneous environments: parallels with macroorganisms. In Gadd G, Watkinson SC, Dyer PS (eds), *Fungi in the Environment*, pp. 112-140. Cambridge University Press. doi:10.1017/CBO9780511541797.007. **Partial** (introduction only).
35. Sekrst K (2026). Fungal memory and minimal cognition. *Topics in Cognitive Science*, e70070; arXiv:2609.02345. **Partial** (abstract).
