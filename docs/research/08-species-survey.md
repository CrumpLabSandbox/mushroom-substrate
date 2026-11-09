# 08. Species survey: the 100 species and their network families

Research agent 8 of 8. Written 2026-11-09.

**Read this first: how far to trust this file.** The shared web-search budget ran out after
about 16 searches, so only part of the planned checking was done. Every cell is marked one of
three ways:

- `[n]` = the value comes from source n in section 7, which says whether I read the page or only
  a search snippet of it.
- `(M)` = from my general knowledge of the literature, **not checked this session**. Treat as
  `inferred` in the species file until someone sources it.
- `n.f.` = not found. I looked and found no number, or could not look. No guess is given.

Growth rates and temperature numbers are only ever `[n]` or `n.f.`. Taxonomy (order, family),
fruit body sizes, hosts and ranges are standard field-guide knowledge and are `(M)` for the whole
column unless tagged; names should be checked against Index Fungorum when each species file is
written.

## 1. Summary

1. About 148,000 fungi are described and 2.2 to 3.8 million are estimated [2][3]. The class that
   holds nearly all mushrooms, Agaricomycetes, had about 21,000 described species in the 2008
   count [1]; later counts are higher but I could not verify a current figure.
2. The list below has exactly 100 species in 10 feeding groups: white rot 20, brown rot 9, litter
   and soil 18, dung 5, ectomycorrhizal 24, tree parasites 10, insect parasites 3, insect-farmed
   4, mycoparasites 4, other 3.
3. I propose 11 network families (section 3.0). Every species is assigned to one.
4. Flagship six: *Coprinopsis cinerea*, *Pleurotus ostreatus*, *Phanerochaete velutina*,
   *Armillaria gallica*, *Laccaria bicolor*, *Serpula lacrymans*. 24 more are second tier.
5. Sourced growth rates were found for 10 species or groups; the rest are `n.f.`.
6. Published electrical-spiking recordings exist for 6 listed or closely related species [9][10].
7. All 10 biomes in the grid are covered, but desert, savanna and alpine each rest on 3 to 5
   species with thin data.
8. Main gaps: numeric cord extension rates for the cord-formers (the papers exist but I could not
   open them), and almost all numbers for tropical and southern-hemisphere species.
9. Three inclusions bend the "mushroom-forming" rule and need the owner's decision (section 6).

## 2. How many kinds there are, and the major groups

### 2.1 Counts

| Quantity | Figure | Source and status |
|---|---|---|
| Fungi described, all kinds | about 148,000 (as of 2020) | [2], read |
| Fungi estimated to exist | 2.2 to 3.8 million | [2][3], read on Wikipedia; primary paper seen as snippet |
| New fungi described per year | 1,882 in 2019; 2,905 in 2020 | [2], read |
| Agaricomycetes described | about 21,000 species in 1,147 genera, 100 families, 17 orders (2008 count) | [1], read on Wikipedia; primary is Kirk et al. 2008 |
| Agaricomycetes orders now recognised | 22 listed | [1], read |
| Agaricales alone | "over 25,000" species, 46 families, more than 400 genera | [5], snippet only. Note this is larger than the 2008 figure for the whole class, so the two counts use different dates and methods |
| Basidiomycota genera | 1,928 (2019 outline); 2,134 (2024 outline) | [4], snippets only |
| "Mushrooms" in the broad sense (large fruit bodies, any group) | about 14,000 described, about 140,000 estimated | (M), **not verified**. I recall this from Hawksworth (2001); my search did not find it |
| Ectomycorrhizal species with a described exploration type | over 550 | [12], read |

A fair one-line answer for the project: **roughly 20,000 to 30,000 described mushroom-forming
species, and the true number is several times that.** The 100 chosen here are well under 1%.

### 2.2 Major groups

Mushrooms come from two phyla. Order contents below are (M) apart from the order list itself [1].

**Basidiomycota, class Agaricomycetes** (the bulk):

| Order | What is in it | Species on our list |
|---|---|---|
| Agaricales | Most gilled mushrooms; also puffballs, bird's nests, some corals, clubs and crusts | 45 |
| Boletales | Boletes, plus gilled (*Paxillus*), crust (*Serpula*, *Coniophora*), puffball-like (*Pisolithus*, *Astraeus*) and truffle-like (*Rhizopogon*) forms | 8 |
| Polyporales | Most brackets and many crusts; white and brown rot | 12 |
| Russulales | *Russula*, *Lactarius*, plus tooth (*Hericium*), bracket (*Heterobasidion*) and crust (*Amylostereum*) forms | 6 |
| Hymenochaetales | Tough perennial brackets and crusts | 3 or 4 (placement of *Rigidoporus* is unsettled) |
| Cantharellales | Chanterelles, hedgehogs | 1 |
| Phallales, Geastrales, Gomphales, Hysterangiales | Stinkhorns; earthstars and *Sphaerobolus*; coral *Ramaria*; mat-forming false truffles | 2, 2, 1, 1 |
| Thelephorales, Atheliales | Earth fans and thin crusts, mostly ectomycorrhizal | 1, 1 |
| Auriculariales, Gloeophyllales | Wood ears; a small brown-rot order | 1, 1 |
| Amylocorticiales, Corticiales, Jaapiales, Lepidostromatales, Sebacinales, Stereopsidales, Trechisporales, Tremellodendropsidales | Mostly thin crusts, lichenised clubs, root associates | 0 (gap, see 5.3) |

**Basidiomycota outside Agaricomycetes:** Dacrymycetes (orange jelly fungi, brown rot; 1 listed)
and Tremellomycetes (jelly fungi that parasitise other fungi; 1 listed).

**Ascomycota that make mushrooms:**

| Group | What is in it | Species on our list |
|---|---|---|
| Pezizomycetes, order Pezizales | Morels, true truffles, desert truffles, cup fungi | 5 |
| Sordariomycetes, Hypocreales | *Cordyceps*, *Ophiocordyceps*, *Hypomyces* | 4 |
| Sordariomycetes, Xylariales | Dead man's fingers and relatives | 1 |
| Leotiomycetes, Cyttariales | *Cyttaria*, gall parasite of southern beech | 1 |
| Dothideomycetes | *Cenococcum* (no fruit body; see section 6) | 1 |

## 3. The species list

### 3.0 Proposed network families

The plan expects 8 to 12 families that species inherit defaults from. These 11 are my proposal,
drawn from the forms in the selection grid. The family code appears in every table.

| Code | Family | Defining behaviour | Type species |
|---|---|---|---|
| DIF | Diffuse fast coloniser | Thin, fast, unbundled hyphae; short-lived; fruits quickly then dies back | *Coprinopsis cinerea* |
| MAT | Dense mat in one resource | Stays inside its log or bale; thick fronts; fights neighbours at the boundary | *Pleurotus ostreatus* |
| CORD | Cord-forming forager | Leaves the resource as fans that bundle into cords; thickens used routes, recycles unused | *Phanerochaete velutina* |
| RHIZ | Rhizomorph former | Root-like organs with a growing tip and a rind; grows through soil or air without feeding | *Armillaria gallica* |
| RING | Fairy ring | An outward-moving band that dies behind itself | *Marasmius oreades* |
| LIT | Diffuse litter mycelium | Small patches binding leaves or needles; many small individuals | *Mycena galopus* |
| ECM-S | Ectomycorrhizal, contact and short-distance | Mantle on root tips, little or no soil mycelium | *Tuber melanosporum* |
| ECM-M | Ectomycorrhizal, medium-distance (fringe, mat, smooth) | Soil mycelium to a few centimetres, simple rhizomorphs or dense mats | *Laccaria bicolor* |
| ECM-L | Ectomycorrhizal, long-distance | Differentiated rhizomorphs with hollow vessel hyphae; links trees | *Suillus luteus* |
| HOST | Confined to a living host | Grows inside an insect, a gall, a trunk or another fungus | *Ophiocordyceps unilateralis* |
| GARDEN | Tended by insects | Growth, shape and spread are controlled by the insect | *Leucoagaricus gongylophorus* |

A separate yes/no flag, **sclerotium**, is better than a twelfth family: several species in
different families store reserves in a resting body (marked "sclerotium" in the notes).

Exploration types follow Agerer (2001) [11]. Genus assignments tagged [13] come from a published
table; type definitions are from [12].

### 3.0.1 Column key

- **Tier:** F = flagship, 2 = second tier, 3 = inherits mostly from family.
- **Data:** 3 = model organism with many measured parameters, 2 = some published measurements,
  1 = mostly inferred from relatives.
- **Biomes:** BOR boreal, TBL temperate broadleaf, TCF temperate conifer, MED Mediterranean,
  TRF tropical rainforest, SAV savanna, GRS grassland, DES desert and arid, ALP alpine and arctic,
  URB urban and disturbed.
- **Continents:** NA, SA, EU, AS, AF, AU (Australasia); "cosm." = on most continents.
- **Size** is cap or fruit body width in cm unless stated.

### 3.1 Wood decay, white rot (20)

| # | Species (common name) | Order: Family | Substrate or hosts | Family; network form | Fruit form; size cm | Biomes; continents | Climate and season | Growth rate | Notes for simulation | Data | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | *Pleurotus ostreatus* (oyster) | Agaricales: Pleurotaceae | Dead and dying broadleaf trunks; cultivated on straw | MAT; dense white mat, no cords | Gilled shelf; 5–25 | TBL, BOR, URB; cosm. | Fruits autumn to winter, cold-triggered (M). Optimum about 25 °C on agar [18] | 6.7, 11.7, 12.0 mm/day at 20, 25, 30 °C on PDA (one study) [18] | Cultivated; genome (M); traps nematodes (M); electrical spikes recorded by Olsson and Hansson 1995 (M); related *P. djamor* spikes at 2.6 and 14 min periods [10] | 3 | F |
| 2 | *Pleurotus tuber-regium* (king tuber) | Agaricales: Pleurotaceae | Buried dead wood | MAT + sclerotium; | Gilled funnel; 8–20; sclerotium to 30 | TRF, SAV; AF, AS, AU | Warm tropics; fruits in rains (M) | n.f. | Large underground sclerotium fruits when wetted; cultivated in West Africa (M) | 1 | 3 |
| 3 | *Lentinula edodes* (shiitake) | Agaricales: Omphalotaceae | Dead Fagaceae logs | MAT; forms a brown crust on the log surface before fruiting (M) | Gilled; 5–15 | TBL; AS (cultivated worldwide) | Optimum 25 °C; inhibited at 30 °C and above [19]. Spring and autumn (M) | 8.8–10.0 mm/day at 25 °C, two strains; 8.7 mm/day on PDA [19] | Second most cultivated mushroom (M); genome (M); log colonisation times well documented in cultivation literature | 3 | 2 |
| 4 | *Schizophyllum commune* (split gill) | Agaricales: Schizophyllaceae | Dead wood of almost any kind | MAT; thin, fast | Small fan with split gills; 1–4 | All forested biomes, URB; cosm. | Best growth 30–35 °C, least at 15 °C [21]. Fruit bodies dry out and revive (M) | 10.9 ± 0.4 mm/day on MEA, pH 6, 30 °C [21] | Model organism for mating and hyphal growth; genome (M); spikes every 41 min on average, 0.03 mV [9]; thousands of mating types (M) | 3 | 2 |
| 5 | *Trametes versicolor* (turkey tail) | Polyporales: Polyporaceae | Dead broadleaf wood | MAT; classic combat zones (M) | Thin bracket; 2–8 | TBL, BOR, TCF, URB; cosm. | All year; n.f. for numbers | n.f. | Standard test fungus for wood decay and for fungus-fungus combat experiments (M); genome (M) | 3 | 2 |
| 6 | *Trametes sanguinea* (syn. *Pycnoporus sanguineus*) | Polyporales: Polyporaceae | Sun-exposed dead wood | MAT | Thin red bracket; 2–8 | TRF, SAV, URB; pantropical | Heat and drought tolerant (M) | n.f. | Tropical counterpart of #5; bright pigment (cinnabarin) (M) | 1 | 3 |
| 7 | *Phanerochaete velutina* | Polyporales: Phanerochaetaceae | Fallen broadleaf wood, grows through soil between pieces | CORD; fans that bundle into persistent cords | Thin crust under logs; patches 5–30 | TBL; EU, NA | Extension roughly linear in time and rises with temperature from 5 to 20 or 27 °C [14] | Numeric rate n.f.; reported in [14] and [15], which I could not open | The best-measured foraging network of any fungus: cord graphs, remodelling, nutrient routing (Boddy and Fricker groups) (M). Smaller inocula give slower extension [15]; grazing by soil animals slows it [15] | 3 | F |
| 8 | *Phanerochaete chrysosporium* | Polyporales: Phanerochaetaceae | Wood chips, compost piles | DIF/MAT; very fast, makes asexual spores | Thin crust; small | TBL, URB; NA, EU, AS | Heat-loving (M); numbers n.f. | n.f. | First basidiomycete genome (M); the laboratory model for lignin breakdown (M) | 3 | 2 |
| 9 | *Hypholoma fasciculare* (sulphur tuft) | Agaricales: Strophariaceae | Stumps and buried wood | CORD; shorter-range than #7, strongly combative (M) | Gilled, clustered; 2–7 | TBL, TCF, BOR; EU, NA, AS | Rate rises with temperature 5–20 °C [14]; fruits autumn (M) | Numeric rate n.f.; in [14][15] | Paired with #7 in most cord experiments; used as biocontrol against *Armillaria* (M) | 3 | 2 |
| 10 | *Ganoderma lingzhi* / *G. lucidum* (reishi, lingzhi) | Polyporales: Ganodermataceae | Broadleaf stumps and roots | MAT; tough skin-like mycelium | Varnished stalked bracket; 5–20 | TBL, TRF; AS, EU (species limits disputed) | Warm; n.f. for numbers | n.f. | Cultivated; genome (M); antler form in high CO2 (M); related *G. resinaceum* spikes 5–8 min wide [10]; used in mycelium materials (M) | 3 | 2 |
| 11 | *Fomes fomentarius* (tinder hoof) | Polyporales: Polyporaceae | Birch and beech trunks | MAT; decay column inside trunk | Perennial hoof; 10–40 | BOR, TBL; EU, NA, AS | Cold-hardy; sheds spores in spring (M) | n.f. | Fruit body adds a layer each year for decades (M); weak parasite then saprotroph | 2 | 3 |
| 12 | *Flammulina velutipes* (enoki, velvet shank) | Agaricales: Physalacriaceae | Broadleaf stumps | MAT | Gilled, clustered; 2–8 | TBL, BOR, URB; EU, NA, AS | Fruits in winter, survives freezing (M) | n.f. | Cultivated (long-stem form in dark, high CO2) (M); spikes every 102 min on average, 0.3 mV [9] | 3 | 2 |
| 13 | *Hericium erinaceus* (lion's mane) | Russulales: Hericiaceae | Wounds on old beech and oak | MAT; slow heart rot | Tooth cushion; 10–30 | TBL; EU, NA, AS | Late summer to autumn (M) | n.f. | Tooth form; cultivated; genome (M) | 2 | 3 |
| 14 | *Auricularia auricula-judae* group (wood ear) | Auriculariales: Auriculariaceae | Elder and other broadleaf branches | MAT | Jelly ear; 3–10 | TBL, TRF, URB; cosm. (as a species group) | Dries and rehydrates repeatedly (M) | n.f. | Jelly form; Asian *A. heimuer* is a major crop (M) | 2 | 3 |
| 15 | *Xylaria polymorpha* (dead man's fingers) | Xylariales: Xylariaceae (Ascomycota) | Buried broadleaf wood and stumps | MAT; walls itself in with black zone lines (M) | Black club; 3–10 tall | TBL; EU, NA, AS | Persists all year (M) | n.f. | Ascomycete wood decayer; zone lines are a visible territory boundary | 1 | 3 |
| 16 | *Panellus stipticus* (bitter oyster) | Agaricales: Mycenaceae | Broadleaf logs | MAT | Small gilled shelf; 1–3 | TBL; NA, EU, AS, AU | Autumn; revives after drying (M) | n.f. | Bioluminescent in eastern North American strains, mycelium and gills (M) | 2 | 3 |
| 17 | *Omphalotus nidiformis* (ghost fungus) | Agaricales: Omphalotaceae | Dead and living eucalypt and other wood | MAT; also weak parasite | Gilled funnel; 5–30 | TBL, MED; AU | Autumn (M) | n.f. | Bioluminescent; spikes every 92 min on average, 0.007 mV [9] | 2 | 2 |
| 18 | *Neonothopanus gardneri* (flor de coco) | Agaricales: Omphalotaceae | Base of palms (*Attalea*), decaying palm leaves [30] | MAT | Gilled; 1–9 [30] | SAV, TRF; SA (Brazil: Goiás, Piauí, Tocantins) [30] | Tropical, n.f. for numbers | n.f. | Brightest known glowing mushroom [30]; glow reported to follow a daily clock and draw insects (M, Oliveira 2015) | 2 | 3 |
| 19 | *Mycena chlorophos* | Agaricales: Mycenaceae | Fallen twigs and woody litter | LIT | Tiny gilled; 1–3 | TRF; AS, AU, SA | Warm, wet season (M) | n.f. | Tiny glowing cap; brightness depends on temperature (M) | 1 | 3 |
| 20 | *Phellinus ellipsoideus* | Hymenochaetales: Hymenochaetaceae | Fallen oak logs (*Quercus* subgenus *Cyclobalanopsis*) [26] | MAT | Perennial crust-bracket; record 1,085 long × 82–88 wide × 4.6–5.5 thick [26] | TRF, TBL (subtropical); AS (China) | n.f. | n.f. | Largest fruit body recorded: 400–500 kg, about 20 years old, Hainan, found 2010 [26] | 1 | 3 |

### 3.2 Wood decay, brown rot (9)

| # | Species (common name) | Order: Family | Substrate or hosts | Family; network form | Fruit form; size cm | Biomes; continents | Climate and season | Growth rate | Notes for simulation | Data | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 21 | *Serpula lacrymans* (dry rot) | Boletales: Serpulaceae | Structural softwood in buildings; wild on conifer logs | CORD; strands 1 to several mm wide cross plaster and brick [16] | Rusty pancake crust; 10–100 | URB worldwide; wild in ALP/TCF of AS (Himalaya), also N. California, Czechia, East Asia [16] | Optimum 20–22 °C; scanty at 26–27 °C, none above 28 °C; survives 3–26 °C [16] | "Several millimetres per day" (trade source, no temperature) [16]; a 14-strain growth model exists (J Appl Microbiol 2011), fastest at 20 °C [16], numbers n.f. | Genome: 42.7 Mbp, 12,789 genes [16]; carries water and nutrients over non-nutrient surfaces; uses calcium and iron from masonry [16]; narrow temperature window is a strong test of response curves | 3 | F |
| 22 | *Coniophora puteana* (cellar fungus) | Boletales: Coniophoraceae | Wet timber, conifer logs | CORD; fine dark strands (M) | Warty crust; 5–50 | URB, TCF, BOR; cosm. | Wetter and more heat-tolerant than #21 (M); numbers n.f. | n.f. | Standard brown-rot test fungus; genome (M) | 3 | 2 |
| 23 | *Rhodonia placenta* (syn. *Postia placenta*) | Polyporales: Dacryobolaceae | Conifer timber | MAT | Thin crust with pores; 5–20 | TCF, BOR, URB; NA, EU, AS | n.f. | n.f. | Model for the brown-rot chemistry; genome (M); decay advances in two stages behind the hyphal front (M) | 3 | 2 |
| 24 | *Gloeophyllum trabeum* | Gloeophyllales: Gloeophyllaceae | Sun-heated timber, decking, poles | MAT | Small tough bracket; 2–8 | URB, TCF, SAV; cosm. | Heat and drought tolerant (M) | n.f. | Genome (M); third standard brown-rot test species | 2 | 3 |
| 25 | *Fomitopsis pinicola* (red-belted conk) | Polyporales: Fomitopsidaceae | Dead conifers and birch | MAT | Perennial bracket; 10–40 | BOR, TCF, ALP treeline; EU, AS (North American forms now split off) | Cold-hardy (M) | n.f. | A main decayer of boreal dead wood; genome (M) | 2 | 3 |
| 26 | *Fomitopsis betulina* (birch polypore) | Polyporales: Fomitopsidaceae | Birch only | MAT; sits latent in living tree, then decays it after death (M) | Annual bracket; 10–25 | BOR, TBL; EU, NA, AS | Autumn (M) | n.f. | One host; latent-then-burst life history | 2 | 3 |
| 27 | *Laetiporus sulphureus* (chicken of the woods) | Polyporales: Laetiporaceae | Heartwood of living oak and others | MAT/HOST; heart rot in standing trunk | Tiered soft shelves; 10–50 | TBL, URB; EU, NA | Late spring to autumn (M) | n.f. | Parasite and saprotroph; hollows trees | 2 | 3 |
| 28 | *Wolfiporia cocos* (fu ling, tuckahoe) | Polyporales: Laetiporaceae | Pine roots | MAT + sclerotium | Thin crust; sclerotium 10–30 | TBL, TCF (warm temperate); AS, NA | n.f. | n.f. | Sclerotium weighing kilograms; farmed in China on buried pine; genome (M) | 2 | 3 |
| 29 | *Calocera viscosa* (yellow stagshorn) | Dacrymycetales: Dacrymycetaceae | Buried conifer wood and stumps | MAT | Orange jelly antlers; 3–8 tall | TCF, BOR; EU, NA, AS | Autumn (M) | n.f. | Brown rot from a separate class; jelly-coral form | 1 | 3 |

### 3.3 Litter and soil saprotrophs (18)

| # | Species (common name) | Order: Family | Substrate or hosts | Family; network form | Fruit form; size cm | Biomes; continents | Climate and season | Growth rate | Notes for simulation | Data | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 30 | *Agaricus bisporus* (button mushroom) | Agaricales: Agaricaceae | Composted litter and manure; wild under cypress and on coastal litter | DIF to strands; fluffy front then stranded behind (M) | Gilled; 5–12 | GRS, MED, URB; EU, NA, cultivated worldwide | Optimum about 25–26 °C, falls off above 28 °C [20]; 25 °C better than 20 °C for five strains [20] | About 5 mm/day in sterile compost; 7.2 mm/day in compost pre-grown with the thermophile *Scytalidium* (temperature not in snippet); 2.7 rising to 5.3 mm/day on agar at 24 °C [20] | Most cultivated mushroom; genome (M); fruits in repeating flushes about a week apart (M); needs a casing layer and bacteria to fruit (M) | 3 | 2 |
| 31 | *Marasmius oreades* (fairy ring mushroom) | Agaricales: Marasmiaceae | Lawn and pasture thatch | RING | Gilled; 1–5 [22] | GRS, URB; EU, NA [22], also AS, AU (M) | Late spring to autumn; all year where mild [22] | Ring radius grows about 10–30 cm/year: 30 cm (RHS); 15–30 cm (Bayliss, cited 1916) [22]. No modern measured study found | Stimulated grass at the live edge, dead zone behind [22]; fruit bodies revive after drying [22]; genome sequenced from rings (M, Hiltunen 2019) | 2 | 2 |
| 32 | *Coprinus comatus* (shaggy mane) | Agaricales: Agaricaceae | Disturbed, compacted, nitrogen-rich soil | DIF | Tall gilled, dissolves into ink; 5–15 tall | URB, GRS; cosm. | Spring and autumn after rain (M) | n.f. | Cap self-digests to release spores; pushes through asphalt; attacks nematodes (M); cultivated | 2 | 3 |
| 33 | *Calvatia gigantea* (giant puffball) | Agaricales: Agaricaceae | Meadow and woodland-edge soil [28] | RING | Puffball; 10–50, to 80 [28] | GRS, TBL, URB; temperate worldwide [28] | Late summer and autumn [28] | n.f. | Record 23 kg [28]; several trillion spores per fruit body (uncited in source) [28]; passive puff release | 2 | 3 |
| 34 | *Lycoperdon perlatum* (common puffball) | Agaricales: Agaricaceae | Woodland soil and litter | LIT; white strands at base | Small puffball; 2–6 | TBL, TCF, BOR, URB; cosm. | Summer to autumn (M) | n.f. | Raindrops striking the skin puff spores out through a pore (M); good small test for the spore-release model | 2 | 3 |
| 35 | *Geastrum triplex* (collared earthstar) | Geastrales: Geastraceae | Leaf litter under broadleaf trees | LIT | Earthstar; 5–10 across open | TBL, URB; cosm. | Autumn; persists through winter (M) | n.f. | Outer wall splits into rays that lift the spore sac | 1 | 3 |
| 36 | *Mycena galopus* (milking bonnet) | Agaricales: Mycenaceae | Leaf and needle litter | LIT | Tiny gilled; 1–2 | TBL, TCF, BOR; EU, NA | Autumn (M) | n.f. | The classic field-studied litter decomposer (Frankland) (M); many small individuals per square metre | 2 | 3 |
| 37 | *Marasmius crinis-equi* (horsehair fungus) | Agaricales: Marasmiaceae | Living and dead leaves and twigs in the canopy and understorey | RHIZ; black wiry aerial rhizomorphs that net and catch falling litter (M) | Tiny gilled on hair-like stalk; 0.3–1 | TRF; AS, AF, AU, SA | Wet tropics (M) | n.f. | The only network on the list that hangs in air; birds use the rhizomorphs as nest material (M) | 1 | 3 |
| 38 | *Stropharia rugosoannulata* (wine cap) | Agaricales: Strophariaceae | Wood chips, straw mulch | CORD; thick white cords in mulch | Gilled; 5–20 | URB, TBL; EU, NA, AS | Spring to autumn (M) | n.f. | Cultivated outdoors; spiny cells that kill nematodes (M); its relative *S. caerulea* is a Boddy-lab cord species [15] | 2 | 3 |
| 39 | *Volvariella volvacea* (paddy straw mushroom) | Agaricales: Pluteaceae | Rice straw, oil palm waste | DIF; very fast | Gilled, from an egg sac; 5–12 | TRF, SAV, URB; AS, AF, cultivated in tropics | Needs heat; killed by chilling (M); numbers n.f. | n.f. | Fastest crop cycle of the cultivated mushrooms (M); genome (M) | 3 | 2 |
| 40 | *Morchella importuna* (black morel) | Pezizales: Morchellaceae (Ascomycota) | Disturbed soil, wood chips, burns | DIF + sclerotium | Morel; 5–15 tall | URB, TCF, MED; NA, EU, AS | Spring fruiting (M) | *Morchella* on PDA: 20.6 mm/day at 26 °C (species not isolated) [23]; *M. angusticeps* 5.2 mm/day at 25 °C, 4.1 at 20 °C [23] | Field-cultivated in China with external nutrient bags (M); genome (M); sclerotia [23] | 2 | 2 |
| 41 | *Podaxis pistillaris* (desert shaggy mane) | Agaricales: Agaricaceae | Sandy soil; termite mounds in Africa (M) | DIF | Stalked puffball; 5–15 tall | DES, SAV; AF, AS, AU, NA, SA | Fruits after rare rains; dry fruit body stands for months (M) | n.f. | Main hot-desert representative | 1 | 3 |
| 42 | *Chlorophyllum molybdites* (green-spored parasol) | Agaricales: Agaricaceae | Lawns and pasture | RING | Gilled; 10–30 | GRS, URB, SAV; pantropical and subtropical | Warm, wet season (M) | n.f. | Large tropical fairy rings | 1 | 3 |
| 43 | *Phallus impudicus* (common stinkhorn) | Phallales: Phallaceae | Buried rotting wood | CORD; thick white cords to "eggs" | Stinkhorn; 10–25 tall | TBL, TCF, URB; EU, AS | Rate rises with temperature 5–20 °C [14]; summer to autumn (M) | Numeric rate n.f.; in [14] | Egg expands in hours; flies carry the spores | 2 | 2 |
| 44 | *Phallus indusiatus* (bamboo fungus, veiled lady) | Phallales: Phallaceae | Rich soil with rotted wood; bamboo groves [32] | CORD | Stinkhorn with net skirt; to 25 tall, egg to 6 [32] | TRF, URB; AF, AS, AU, SA, Central America [32] | Optimum about 24 °C, 90–95% humidity [32]; fruits after heavy rain [32] | Mycelium n.f. Fruit body rose 12.5 cm in one hour; fully out in 10–15 h [32] | Cultivated in China since 1979 [32]; best data on expansion-type fruiting | 2 | 3 |
| 45 | *Cyathus striatus* (fluted bird's nest) | Agaricales: Nidulariaceae | Woody debris, mulch | CORD/LIT; brown mat binding debris | Bird's nest cup; 0.6–1 | TBL, URB; cosm. temperate | Summer to autumn (M) | n.f. | Raindrops splash the "eggs" out; each egg trails a sticky cord that wraps a stem (M) | 2 | 3 |
| 46 | *Sphaerobolus stellatus* (artillery fungus) | Geastrales: Geastraceae | Wood mulch, dung, rotting wood | LIT | Tiny star cup; 0.2 | URB, TBL; cosm. | Cool wet weather (M) | n.f. | Inner cup flips inside-out and throws a 1 mm spore ball several metres toward light (M; distance not verified) | 2 | 3 |
| 47 | *Pyronema omphalodes* | Pezizales: Pyronemataceae (Ascomycota) | Burnt or steam-sterilised soil | DIF; extremely fast, first on fresh burns | Tiny merged orange cups; 0.1–0.2 | TCF, BOR, MED, URB (fire sites); cosm. | Appears within weeks of fire (M) | n.f. | Fire specialist; genome (M); loses to competitors once soil life returns | 2 | 3 |

### 3.4 Dung (5)

| # | Species (common name) | Order: Family | Substrate or hosts | Family; network form | Fruit form; size cm | Biomes; continents | Climate and season | Growth rate | Notes for simulation | Data | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 48 | *Coprinopsis cinerea* (grey ink cap) | Agaricales: Psathyrellaceae | Horse dung, compost [17] | DIF | Gilled ink cap; 2–5 | GRS, URB; AS, EU, NA [17] | Grows best at 37 °C; fruits only at about 25–28 °C [17] | n.f. (plates are routinely filled at 37 °C in Kües-lab methods, but no rate was in what I read) [17] | The model mushroom for development: genome 37.5 Mb [17]; light and dark steps gate each fruiting stage, stalk elongates without a cap in darkness [17]; whole cycle about two weeks in the lab (M) | 3 | F |
| 49 | *Psilocybe cubensis* | Agaricales: Hymenogastraceae | Cattle dung | DIF, some strands | Gilled; 2–8 | GRS, SAV, TRF edge; pantropical | Warm, humid (M) | n.f. | Very widely grown, so hobby-level growth data are abundant but rarely peer-reviewed; genome (M). See section 6 | 2 | 3 |
| 50 | *Panaeolus papilionaceus* (petticoat mottlegill) | Agaricales: placement unsettled | Horse and cattle dung | DIF | Small gilled; 1–4 | GRS; cosm. | Spring to autumn (M) | n.f. | Typical grassland dung agaric | 1 | 3 |
| 51 | *Protostropharia semiglobata* (dung roundhead) | Agaricales: Strophariaceae | Herbivore dung | DIF | Small gilled; 1–4 | GRS, ALP, BOR pasture; cosm. | Cool-tolerant (M) | n.f. | Reaches arctic and alpine pasture | 1 | 3 |
| 52 | *Ascobolus immersus* | Pezizales: Ascobolaceae (Ascomycota) | Herbivore dung | DIF | Minute cup; 0.05–0.2 | GRS; cosm. | n.f. | n.f. | Classic genetics model (M); shoots large spores toward light so grazers eat them (M) | 2 | 3 |

### 3.5 Ectomycorrhizal partners of trees (24)

Exploration type is given in the network column.

| # | Species (common name) | Order: Family | Hosts | Family; exploration type | Fruit form; size cm | Biomes; continents | Climate and season | Growth rate | Notes for simulation | Data | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 53 | *Laccaria bicolor* | Agaricales: Hydnangiaceae | Pine, spruce, Douglas-fir, poplar | ECM-M; medium-distance smooth (genus) [13] | Gilled; 2–7 | TCF, BOR, TBL; NA, EU | Autumn (M) | n.f. | First ectomycorrhizal genome (M, Martin 2008); grows well in culture; standard partner of poplar in lab systems (M); nursery inoculant; reported to take nitrogen from springtails (M) | 3 | F |
| 54 | *Amanita muscaria* (fly agaric) | Agaricales: Amanitaceae | Birch, pine, spruce; eucalypt and southern beech where introduced | ECM-M; medium-distance smooth (genus) [13] | Gilled; 8–20 | BOR, TCF, TBL, ALP; NA, EU, AS; invasive AU, SA, AF | Late summer to autumn (M) | n.f. | Genome (M); spreading in the southern hemisphere with planted pines | 2 | 2 |
| 55 | *Amanita loosii* (syn. *A. zambiana*) | Agaricales: Amanitaceae | Miombo trees (*Brachystegia*, *Julbernardia*) (M) | ECM-M (inferred from genus) | Large gilled; 10–25 | SAV (miombo woodland); AF | Early rainy season (M) | n.f. | African savanna-woodland representative; **name and details not verified this session** | 1 | 3 |
| 56 | *Pisolithus arhizus* (syn. *P. tinctorius*; dyeball) | Boletales: Sclerodermataceae | Pine, oak, eucalypt | ECM-L (M; family is long-distance) | Puffball-like with pea chambers; 5–20 | MED, DES edge, URB, mine waste; cosm. (as a species group) | Tolerates hot, dry, acid, metal-rich soil (M) | n.f. | Most used commercial inoculant (M); genome (M); yellow rhizomorphs | 3 | 2 |
| 57 | *Suillus luteus* (slippery jack) | Boletales: Suillaceae | Pines only | ECM-L; long-distance [13] | Bolete; 5–12 | TCF, BOR; EU, AS; invasive with pine in SA, AF, AU | 22 °C suited *Suillus* isolates in one study [25]; autumn (M) | Ectomycorrhizal isolates incl. *Suillus*: 0.25–0.95 mm/day on MMN at 22 °C [25] | Genome (M); relative *S. bovinus* is the classic species in root-window microcosms showing carbon moving between seedlings (M) | 3 | 2 |
| 58 | *Paxillus involutus* (brown roll-rim) | Boletales: Paxillaceae | Birch, spruce, many others | ECM-L; long-distance [13] | Gilled bolete relative; 5–15 | BOR, TBL, TCF, URB; EU, NA, AS | Summer to autumn (M) | n.f. | Model for how mycorrhizal fungi break down organic matter (M); genome (M); easy in culture | 3 | 2 |
| 59 | *Boletus edulis* (porcini, cep) | Boletales: Boletaceae | Spruce, pine, oak, beech, chestnut | ECM-L; long-distance [13] | Bolete; 8–25 | BOR, TBL, TCF, MED, ALP; EU, NA, AS; introduced AF, AU | Summer to autumn (M) | n.f. | Not cultivated; genome (M) | 2 | 3 |
| 60 | *Rhizopogon vinicolor* (with *R. vesiculosus*) | Boletales: Rhizopogonaceae | Douglas-fir only | ECM-L; long-distance [13] | Underground false truffle; 1–4 | TCF; NA | n.f. | n.f. | The only species with a mapped tree-to-tree network in a real forest (M, Beiler 2010); spores spread by small mammals | 2 | 3 |
| 61 | *Cortinarius caperatus* (gypsy) | Agaricales: Cortinariaceae | Pine, spruce, birch, heath | ECM-M; medium-distance fringe (genus) [13] | Gilled; 5–12 | BOR, TCF, ALP; EU, NA, AS | Late summer to autumn (M) | n.f. | Stands for the largest mushroom genus; cannot be cultured easily | 1 | 3 |
| 62 | *Cortinarius magellanicus* | Agaricales: Cortinariaceae | Southern beech (*Nothofagus*) | ECM-M (inferred from genus) | Slimy purple gilled; 3–8 | TBL (cool temperate rainforest); SA (Patagonia) | Autumn, March to May (M) | n.f. | South American representative; species limits in doubt | 1 | 3 |
| 63 | *Hebeloma cylindrosporum* | Agaricales: Hymenogastraceae | Maritime pine on coastal dunes | ECM-M; medium-distance fringe (genus) [13] | Gilled; 2–6 | MED, TCF (coastal dune); EU | Autumn (M) | n.f. | Lab model: completes its life cycle in culture; genome (M); short-lived individuals mapped in the field (M) | 3 | 3 |
| 64 | *Tricholoma matsutake* (matsutake) | Agaricales: Tricholomataceae | Red pine and other conifers | ECM-M; medium-distance fringe (genus) [13]; forms a dense white soil colony ("shiro") in a ring (M) | Gilled; 8–20 | TCF, BOR; AS, EU | Autumn (M) | n.f. | A mycorrhizal fairy ring; partly harmful to its host roots (M); not cultivated | 2 | 3 |
| 65 | *Russula cyanoxantha* (charcoal burner) | Russulales: Russulaceae | Beech, oak | ECM-M/ECM-S; genus listed as medium-distance smooth [13], many *Russula* are contact type (M) | Gilled, brittle; 5–15 | TBL; EU, AS | Summer to autumn (M) | n.f. | Stands for the largest ectomycorrhizal genus | 1 | 3 |
| 66 | *Russula nana* | Russulales: Russulaceae | Dwarf willow, mountain avens, alpine bistort | ECM-S (inferred) | Small red gilled; 2–5 | ALP; EU, NA, AS | Short late-summer season (M) | n.f. | Arctic-alpine representative; hosts are 5 cm tall shrubs | 1 | 3 |
| 67 | *Lactarius deliciosus* (saffron milk cap) | Russulales: Russulaceae | Pines | ECM-S; contact (genus) [13]; this species is reported with rhizomorphs (M) | Gilled, bleeds orange; 5–15 | MED, TCF; EU, AS; introduced AU, SA, AF | Autumn (M) | n.f. | Fruited in plantations on inoculated seedlings (M) | 2 | 3 |
| 68 | *Cantharellus cibarius* (chanterelle) | Cantharellales: Hydnaceae | Oak, beech, spruce, pine, birch | ECM-M; medium-distance smooth [13] | Chanterelle; 3–10 | BOR, TBL, TCF; EU, AS (North American look-alikes are other species) | Summer to autumn (M) | n.f. | Very slow fruit bodies that last weeks (M); needs bacteria in culture (M) | 2 | 3 |
| 69 | *Tuber melanosporum* (Périgord black truffle) | Pezizales: Tuberaceae (Ascomycota) | Oak, hazel on limestone | ECM-S; short-distance (most ascomycetes are) [12] | Truffle; 2–8 | MED; EU; orchards in AU, NA, SA, AF | Ripens in winter (M); a 2025 model study links warm dry summers to soil mycelium growth [24] | *Tuber* species in culture: 0.6–0.9 mm in 40 days, i.e. about 0.02 mm/day, not specific to this species [24] | Genome (M, Martin 2010); kills surrounding plants in a "burnt" circle (M); two mating types needed; spread by animals | 3 | 2 |
| 70 | *Terfezia claveryi* (desert truffle) | Pezizales: Pezizaceae (Ascomycota) | Rockrose family herbs and shrubs (*Helianthemum*) | ECM-S (inferred); mycorrhiza form changes with moisture (M) | Truffle; 3–10 | DES, MED; AF (north), AS (west), EU (south) | Fruits in spring after autumn rain (M) | n.f. | Hot-desert mycorrhiza; cultivated in Spain (M) | 2 | 3 |
| 71 | *Cenococcum geophilum* | Dothideomycetes: Gloniaceae (Ascomycota) | Almost any ectomycorrhizal tree | ECM-S; short-distance [12] | **None.** Black sclerotia 0.1–0.4 | Every forested biome incl. ALP; cosm. | Drought tolerant (M) | n.f. | Possibly the most widespread ectomycorrhizal fungus (M); genome (M); sclerotia persist for years. See section 6 | 2 | 3 |
| 72 | *Thelephora terrestris* (earth fan) | Thelephorales: Thelephoraceae | Pine and other seedlings | ECM-M; medium-distance smooth (M) | Fan or crust; 2–6 | TCF, BOR, URB (nurseries); cosm. | n.f. | n.f. | Pioneer on seedlings; fruit body climbs stems | 2 | 3 |
| 73 | *Piloderma croceum* | Atheliales: Atheliaceae | Spruce, pine, oak | ECM-M; medium-distance fringe (M) | Thin yellow crust under wood; patches | BOR, TCF; EU, NA, AS | n.f. | n.f. | Bright yellow mycelium fills boreal humus; genome (M); indicator of old forest (M) | 2 | 3 |
| 74 | *Hysterangium setchellii* | Hysterangiales: Hysterangiaceae | Douglas-fir | ECM-M; medium-distance mat (M) | False truffle; 1–3 | TCF; NA | n.f. | n.f. | Dense mats that change soil chemistry over square metres (M) | 1 | 3 |
| 75 | *Ramaria botrytis* (pink-tipped coral) | Gomphales: Gomphaceae | Beech, oak, conifers | ECM-M; medium-distance mat (M) | Coral; 7–20 | TBL, TCF; EU, NA, AS | Autumn (M) | n.f. | Coral form | 1 | 3 |
| 76 | *Astraeus hygrometricus* (barometer earthstar) | Boletales: Diplocystidiaceae | Pine, oak, dipterocarps (as a species group) | ECM-L (inferred from relatives) | Earthstar-like; 2–8 open | MED, SAV, DES edge, TBL; cosm. (as a species group) | Sandy dry soils (M) | n.f. | Rays open when wet and close when dry, for years | 1 | 3 |

### 3.6 Parasites of trees (10)

| # | Species (common name) | Order: Family | Hosts | Family; network form | Fruit form; size cm | Biomes; continents | Climate and season | Growth rate | Notes for simulation | Data | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 77 | *Armillaria gallica* (bulbous honey fungus) | Agaricales: Physalacriaceae | Stressed oak and many others [7] | RHIZ; black rhizomorphs 1–3 mm thick in a looped soil network [7] | Gilled; 2.5–9.5 [7] | TBL, URB; EU, NA, AS; introduced AF [7] | Autumn (M) | Rhizomorphs 0.3–0.6 m/year in soil (Rishbeth 1991) [7] | Michigan individual: 15 ha, over 9,500 kg, 1,500 years (1992) [7]; revised to 2,500 years, about 400 tonnes (2018) [7][8]; mycelium glows, brighter when disturbed [7]; spikes recorded by Olsson and Hansson 1995 under its old name *A. bulbosa* (M); genome (M) | 3 | F |
| 78 | *Armillaria ostoyae* (dark honey fungus) | Agaricales: Physalacriaceae | Douglas-fir, firs, pines, hemlock [8] | RHIZ; plus direct root-to-root spread | Gilled, scaly; 5–12 | TCF, BOR; NA, EU, AS [8] | Autumn (M) | Spread through forest 0.22 to 1.3 m/year (three studies compiled) [6] | Oregon individual: 965 ha, isolates up to 3,810 m apart, age 1,900–8,650 years [6]; kills trees in expanding circles; glows [8]; genome (M) | 3 | 2 |
| 79 | *Heterobasidion annosum* (root rot) | Russulales: Bondarzewiaceae | Pine, spruce | HOST; no free soil mycelium, moves through root contacts (M) | Perennial bracket at stump base; 5–25 | TCF, BOR; EU (close relatives in NA, AS) | Spores infect fresh stumps (M) | n.f. | Most costly forest disease in Europe (M); genome of North American relative (M); spread set by root layout, not by the fungus | 3 | 2 |
| 80 | *Ganoderma boninense* | Polyporales: Ganodermataceae | Oil palm, coconut | HOST; root contact | Bracket; 5–20 | TRF (plantations); AS, AU (Pacific) | Humid tropics (M) | n.f. | Basal stem rot of oil palm; genome (M) | 2 | 3 |
| 81 | *Rigidoporus microporus* (white root rot) | Hymenochaetales or Polyporales (placement revised; check) | Rubber and other tropical trees | RHIZ; white rhizomorphs ahead of the rot (M) | Orange bracket; 5–20 | TRF; AS, AF | Humid tropics (M) | n.f. | Tropical rhizomorph parasite | 2 | 3 |
| 82 | *Coniferiporia weirii* (syn. *Phellinus weirii*; laminated root rot) | Hymenochaetales: Hymenochaetaceae | Douglas-fir, cedar | HOST; mycelium runs along root surface | Brown crust; 10–100 | TCF; NA, AS | n.f. | n.f. | Disease centres last centuries; survives decades in stumps (M) | 2 | 3 |
| 83 | *Inonotus obliquus* (chaga) | Hymenochaetales: Hymenochaetaceae | Birch | HOST; trunk heart rot | Sterile black canker 10–40; true fruit body is a hidden crust | BOR; EU, AS, NA | Cold (M) | n.f. | Grows for decades in the living trunk; fruits once after the tree dies | 2 | 3 |
| 84 | *Moniliophthora perniciosa* (witches' broom) | Agaricales: Marasmiaceae | Cacao | HOST; first lives between plant cells, then kills and feeds | Tiny pink gilled; 0.5–2.5 | TRF; SA, Caribbean | Fruits on dead brooms in wet season (M) | n.f. | Two-phase parasite; genome (M) | 2 | 3 |
| 85 | *Cyttaria darwinii* (Darwin's fungus) | Cyttariales: Cyttariaceae (Ascomycota) | Southern beech (*Nothofagus*) | HOST; perennial in a branch gall | Orange pitted ball; 2–5 | TBL (cool temperate), ALP treeline; SA (Patagonia, Tierra del Fuego) | Spring, October to December (M) | n.f. | Gall-forming; southern-hemisphere ascomycete | 1 | 3 |
| 86 | *Chondrostereum purpureum* (silver leaf) | Agaricales: Cyphellaceae | Plum, cherry, birch, poplar | MAT/HOST; enters fresh wounds | Purple crust-bracket; 2–5 | TBL, URB, BOR; cosm. temperate | Autumn to spring (M) | n.f. | Sold as a stump-killing treatment (M); toxin silvers leaves far from the mycelium | 2 | 3 |

### 3.7 Parasites of insects (3)

| # | Species (common name) | Order: Family | Hosts | Family; network form | Fruit form; size cm | Biomes; continents | Climate and season | Growth rate | Notes for simulation | Data | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 87 | *Ophiocordyceps unilateralis* group (zombie-ant fungus) | Hypocreales: Ophiocordycipitaceae (Ascomycota) | Carpenter ants | HOST; cells link into a network around muscle inside the ant (M) | Stalk with side cushion from the ant's head; 1–3 | TRF, some TBL; SA, AS, AF, AU, NA | Humid understorey (M) | n.f. | Ant bites onto a leaf at a set height before death (M); spore rain onto ant trails | 2 | 3 |
| 88 | *Ophiocordyceps sinensis* (caterpillar fungus) | Hypocreales: Ophiocordycipitaceae (Ascomycota) | Ghost moth larvae (Hepialidae; 57 host taxa) [35] | HOST | Club from soil; 4–10 [35] | ALP (3,000–5,000 m); AS (Tibetan Plateau, Himalaya) [35] | Infects in late autumn, emerges early spring, sheds spores late summer [35]; described as slow-growing [35] | n.f. | Highest-altitude species on the list; Vulnerable on the IUCN list [35] | 2 | 3 |
| 89 | *Cordyceps militaris* (scarlet caterpillar club) | Hypocreales: Cordycipitaceae (Ascomycota) | Buried moth pupae | HOST | Orange club; 2–6 | TBL, BOR, GRS; EU, NA, AS | Autumn (M) | n.f. | Cultivated on grain at scale; genome (M); spikes every 116 min on average, 0.2 mV, the slowest of four species [9] | 3 | 2 |

### 3.8 Farmed by insects (4)

| # | Species (common name) | Order: Family | Partner | Family; network form | Fruit form; size cm | Biomes; continents | Climate and season | Growth rate | Notes for simulation | Data | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 90 | *Termitomyces titanicus* | Agaricales: Lyophyllaceae | *Macrotermes* termites, on chewed plant matter [27] | GARDEN; comb inside the mound, with a long root-like stalk to the surface (M) | Gilled; cap to about 100, stalk to 57 [27] | SAV; AF (West Africa, Zambia, DR Congo) [27] | Fruits in rains (M); mound interior is held near constant warmth by the termites (M) | n.f. | Largest gilled mushroom [27]; described only in 1980 [27] | 2 | 3 |
| 91 | *Leucoagaricus gongylophorus* | Agaricales: Agaricaceae | Leafcutter ants (*Atta*, *Acromyrmex*) [34] | GARDEN; makes swollen food tips for the ants [34] | Gilled, rarely seen: ants remove young mushrooms; fruits after a nest is abandoned [34] | TRF, SAV, GRS; SA, Central America, Caribbean [34] | n.f. | n.f. | Lineage passed nest to nest for over 23 million years [34]; five-way symbiosis with a garden parasite and protective bacteria [34]; genome (M) | 3 | 2 |
| 92 | *Myrmecopterula velohortorum* | Agaricales: Pterulaceae | *Apterostigma* ants [29] | GARDEN; hanging garden wrapped in a mycelial veil [29] | Coral-like in the genus [29]; n.f. for this species | TRF; SA, Central America [29] | n.f. | n.f. | A second, independent ant-farmed lineage; named 2014, genus 2020 [29] | 1 | 3 |
| 93 | *Amylostereum areolatum* | Russulales: Amylostereaceae | *Sirex* woodwasp, which injects it into pines (M) | GARDEN/MAT; white rot in the trunk | Crust; 2–10 | TCF, plantations; EU, AS, AF (north); invasive AU, SA, AF (south), NA | n.f. | n.f. | Spread as clones by the wasp; a nematode used for biocontrol eats it (M) | 2 | 3 |

### 3.9 Parasites of other fungi (4)

| # | Species (common name) | Order: Family | Hosts | Family; network form | Fruit form; size cm | Biomes; continents | Climate and season | Growth rate | Notes for simulation | Data | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 94 | *Tremella fuciformis* (snow fungus) | Tremellales: Tremellaceae (Tremellomycetes) | A wood-decay ascomycete (*Annulohypoxylon*) | HOST; yeast phase plus hyphae that tap the host's hyphae (M) | White jelly fronds; 5–15 | TRF, TBL (subtropical); AS, SA, AF, AU, NA | Warm, wet (M) | n.f. | Cultivated in China as a two-fungus culture (M); genome (M) | 2 | 3 |
| 95 | *Asterophora lycoperdoides* (powdery piggyback) | Agaricales: Lyophyllaceae | Rotting *Russula* and *Lactarius* fruit bodies | HOST | Tiny gilled, cap turns to spore powder; 1–2 | TBL, TCF, BOR; EU, NA, AS | Late summer to autumn (M) | n.f. | A mushroom on a mushroom; depends on #65 | 1 | 3 |
| 96 | *Hypomyces lactifluorum* (lobster mushroom) | Hypocreales: Hypocreaceae (Ascomycota) | *Russula* and *Lactifluus* fruit bodies | HOST | Orange crust that reshapes the host; 5–15 | TCF, TBL; NA | Summer to autumn (M) | n.f. | Replaces the host's surface and chemistry | 1 | 3 |
| 97 | *Entoloma abortivum* | Agaricales: Entolomataceae | *Armillaria* fruit bodies (M) | HOST/LIT | Gilled, plus lumpy aborted masses; 4–10 | TBL; NA, AS | Autumn (M) | n.f. | Attacks a flagship (#77); direction of parasitism was only settled in 2001 (M) | 1 | 3 |

### 3.10 Others (3)

| # | Species (common name) | Order: Family | Mode | Family; network form | Fruit form; size cm | Biomes; continents | Climate and season | Growth rate | Notes for simulation | Data | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 98 | *Lichenomphalia umbellifera* | Agaricales: Hygrophoraceae | Lichen: fungus wraps green algae on peat and rotting wood | LIT; a film of algal granules | Tiny gilled; 0.5–2 | ALP, BOR; EU, NA, AS | Cold, wet (M) | n.f. | The fungus is fed by algae, not by decay | 1 | 3 |
| 99 | *Typhula ishikariensis* (grey snow mould) | Agaricales: Typhulaceae | Parasite of grasses and winter cereals under snow [33] | DIF + sclerotium | Small club; size n.f. | ALP, BOR, GRS; EU, AS, NA incl. Svalbard, Greenland, Alaska [33] | Minimum below −7 °C, optimum 5–10 °C, maximum 20 °C; needs over 150 days of snow cover [33] | n.f. | Coldest growth range on the list; sclerotia sized to snow duration [33] | 2 | 3 |
| 100 | *Psathyrella aquatica* | Agaricales: Psathyrellaceae | Saprotroph on submerged wood, silt and gravel [31] | LIT | Small gilled, under water; size n.f. | TCF (river); NA (Rogue River, Oregon, one 1 km stretch) [31] | Cold spring-fed water, about 0.5 m deep [31] | n.f. | Spores collect in gas bubbles under the cap and float up [31]; fruited in the lab [31] | 1 | 3 |

## 4. Flagship six

The six were picked to differ as much as possible in network form while each having enough
published measurement to tune against. Between them they cover six of the eleven network families
and five feeding modes.

**1. *Coprinopsis cinerea* (DIF, dung).** The standard laboratory mushroom for the question the
project cares about in Phase 4: how a colony decides to fruit and builds a mushroom on a clock.
It grows best at 37 °C but fruits only near 25–28 °C, and each fruiting stage needs a light or
dark signal [17], which gives clear triggers to model. The genome is 37.5 Mb [17]. Data that
exist: stage-by-stage timing of fruit body development (Kües 2000, not read this session),
hyphal and mating behaviour, many mutants. What I did not find: a colony growth rate in mm/day.
It certainly exists in the literature and is the first number to chase.

**2. *Pleurotus ostreatus* (MAT, white rot).** The dense, single-resource mat. It has the most
growth data of any species here because it is grown everywhere: 6.7, 11.7 and 12.0 mm/day at 20,
25 and 30 °C on agar in one study [18], with many more in cultivation papers. Fruiting triggers
(cold shock, fresh air, light) are documented in cultivation manuals. It also has the oldest
electrical recordings in fungi (Olsson and Hansson 1995, from memory) and its relative
*P. djamor* was Adamatzky's first species, with two spiking periods of 2.6 and 14 minutes [10].
It kills nematodes with toxin droplets, a useful extra behaviour for the 400K tier.

**3. *Phanerochaete velutina* (CORD, white rot).** The species for which a mycelial network has
actually been digitised as a graph and analysed for efficiency, robustness and remodelling
(Boddy, Fricker, Bebber and colleagues; not read this session). It is the direct test for the
40K tier's "used links thicken, unused ones are recycled". Verified this session: extension is
linear in time and rises with temperature between 5 and 20 or 27 °C [14], drops with smaller
food bases [15] and with grazing [15]. Not verified: the numeric rates themselves. Those papers
(Dowson et al. 1986, 1989) are the top priority to obtain.

**4. *Armillaria gallica* (RHIZ, parasite).** Rhizomorphs are a different organ from cords: they
grow from an organised tip like a root. *A. gallica* has field rates (0.3–0.6 m/year) and
thickness (1–3 mm) [7], the mapped Michigan individual (15 ha in 1992; revised to 2,500 years
and about 400 tonnes in 2018) [7][8], glowing mycelium [7], and electrical recordings under its
old name. Its sister *A. ostoyae* (#78) supplies the stand-scale numbers: spread of 0.22 to
1.3 m/year and a 965 ha individual [6]. I chose *gallica* over *ostoyae* because the rhizomorph
network studies I know of (Mihail and Bruhn on foraging; Lamour et al. 2007 on network structure,
both from memory) used it. The two share a family file.

**5. *Laccaria bicolor* (ECM-M, mycorrhizal).** The model ectomycorrhizal fungus: first genome,
grows readily on agar, and forms mycorrhizas with poplar and conifers in the lab on a known
schedule. That makes root-exchange parameters sourceable in principle. Verified this session:
only its exploration type at genus level (medium-distance smooth) [13]. Not found: growth rate.
A fair warning: it has the thinnest sourced data of the six in this file, and a long-distance
*Suillus* would show a more dramatic network (see section 6).

**6. *Serpula lacrymans* (CORD strands, brown rot).** It adds brown rot (the wood changes in a
different way), an indoor habitat, and the best temperature data here: optimum 20–22 °C, almost
no growth at 26–27 °C, none above 28 °C [16], with a 14-strain growth model published [16]. Its
strands carry water and nutrients across bare masonry, which tests the transport model in a way
no forest species does. Genome 42.7 Mbp [16].

## 5. Coverage matrix and gaps

### 5.1 Feeding mode by network family (species counts)

| Feeding mode | DIF | MAT | CORD | RHIZ | RING | LIT | ECM-S | ECM-M | ECM-L | HOST | GARDEN | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| White rot | 1 | 16 | 2 | | | 1 | | | | | | 20 |
| Brown rot | | 7 | 2 | | | | | | | | | 9 |
| Litter and soil | 6 | | 4 | 1 | 3 | 4 | | | | | | 18 |
| Dung | 5 | | | | | | | | | | | 5 |
| Ectomycorrhizal | | | | | | | 5 | 13 | 6 | | | 24 |
| Tree parasite | | 1 | | 3 | | | | | | 6 | | 10 |
| Insect parasite | | | | | | | | | | 3 | | 3 |
| Insect-farmed | | | | | | | | | | | 4 | 4 |
| Mycoparasite | | | | | | | | | | 4 | | 4 |
| Other | 1 | | | | | 2 | | | | | | 3 |
| **Total** | 13 | 24 | 8 | 4 | 3 | 7 | 5 | 13 | 6 | 13 | 4 | 100 |

Species with two codes are counted under the first. MAT is the largest family because most wood
decayers stay inside one log; it may need splitting into "soft annual" and "perennial bracket".

### 5.2 Fruiting form

| Form | Species numbers |
|---|---|
| Gilled agaric | 1–4, 9, 12, 16–19, 30–32, 36–39, 42, 48–51, 53–55, 61–67, 77, 78, 84, 90, 91, 95, 97, 98, 100 |
| Bolete | 57, 59 (58 is a gilled relative) |
| Bracket or polypore | 5, 6, 10, 11, 20, 24–27, 79–81 |
| Crust | 7, 8, 21–23, 28, 72, 73, 82, 86, 93, 96 |
| Puffball, stalked puffball | 33, 34, 41, 56 |
| Earthstar | 35, 76 |
| Coral | 75, 92; jelly-coral 29 |
| Club | 15, 88, 89, 99; stalk on insect 87 |
| Jelly | 14, 29, 94 |
| Tooth | 13 |
| Chanterelle | 68 |
| Morel | 40 |
| Cup | 47, 52 |
| Truffle and false truffle | 60, 69, 70, 74 |
| Stinkhorn | 43, 44 |
| Bird's nest, artillery | 45, 46 |
| Bioluminescent | 16–19, 77, 78 |
| Giant | 20 (largest fruit body), 90 (largest gilled), 33, 77 and 78 (largest individuals) |
| Tiny (under 1 cm) | 37, 46, 47, 52 |
| Sclerotium | 2, 28, 40, 71, 99 |
| No fruit body, or almost never | 71, 91 |
| Gall, canker | 83, 85 |

### 5.3 Biome and continent

| Biome | Count (approx.) | Examples | Strength |
|---|---|---|---|
| Temperate broadleaf | 45+ | 1, 7, 9, 77 | Strong |
| Temperate conifer | 30+ | 23, 57, 60, 78 | Strong |
| Boreal | 20+ | 11, 25, 61, 73, 83 | Good |
| Urban and disturbed | 25+ | 21, 32, 38, 46 | Good |
| Tropical rainforest | 17 | 6, 19, 37, 44, 80, 81, 84, 87, 91, 92 | Fair; data scores mostly 1 |
| Mediterranean | 9 | 56, 63, 67, 69, 70 | Fair |
| Grassland | 12 | 30, 31, 33, 42, 48–52 | Fair |
| Savanna | 8 | 18, 41, 42, 55, 90, 91 | Thin |
| Alpine and arctic | 8 | 51, 66, 71, 88, 98, 99 | Thin |
| Desert and arid | 4 | 41, 56, 70, 76 | Thin |

Continents: every continent except Antarctica has species that are native only there or nearly
so: Africa (55, 90), South America (18, 62, 84, 85, 91, 92), Australasia (17), Asia (3, 20, 64,
88), North America (60, 74, 96, 100), Europe (63, 69).

### 5.4 Data richness

| Score | Count | Meaning for the build |
|---|---|---|
| 3 | 26 | Enough literature to source most fields |
| 2 | 47 | A few sourced values; rest from family |
| 1 | 27 | Family defaults plus habitat and shape |

Tiers: 6 flagship, 24 second tier, 70 third tier.

### 5.5 Gaps, stated plainly

1. **Fairy ring is not a flagship.** *Marasmius oreades* is second tier because I found only
   ring-expansion figures from secondary and century-old sources [22].
2. **No hand-tuned long-distance mycorrhizal network.** *Suillus* is second tier.
3. **Tropical numbers.** Of 17 rainforest species, none has a sourced mycelial growth rate.
4. **Australia and Africa** are thin: one native Australian species (17) and two African (55, 90),
   plus pantropical ones. Left out: Australian truffle-like fungi eaten by marsupials
   (*Mesophellia*), the fire-fruiting "native bread" sclerotium (*Laccocephalum mylittae*),
   African miombo chanterelles and milk caps.
5. **Orders with no species:** Sebacinales and other root-associate crusts, Trechisporales,
   Corticiales. Also no earth tongues, saddle fungi (*Helvella*), or stalked polypores.
6. **Left out by the mushroom-only rule:** arbuscular mycorrhizal fungi, ambrosia-beetle fungi,
   orchid and heather mycorrhizas, moulds, yeasts.
7. **Waxcap grasslands** (*Hygrocybe*) are missing; their feeding mode is still unclear.
8. **Hydnoid, cyphelloid and resupinate ectomycorrhizal crusts** (*Tomentella*), which dominate
   many root-tip surveys, have one stand-in (72).
9. **Electrical data** exist for only six species or near relatives; for the other 94 the
   electrical parameters will be inherited.

## 6. Open questions for the project owner

1. **Flagship swap candidates.** (a) *Laccaria bicolor* versus *Suillus luteus* or *S. bovinus*:
   *Laccaria* is the genome model; *Suillus* has the long rhizomorphs and the classic
   tree-to-tree transfer experiments. (b) *Serpula lacrymans* versus *Agaricus bisporus* or
   *Marasmius oreades*: I chose brown-rot strands over a second mat or a thinly sourced ring.
   (c) *Armillaria gallica* versus *A. ostoyae*: same family file either way.
2. **Non-mushroom inclusions.** *Cenococcum geophilum* (71) makes no fruit body at all.
   *Leucoagaricus gongylophorus* (91) almost never fruits. *Lichenomphalia* (98) is a lichen.
   Keep, or swap for benched species?
3. **Plant-crop and grass parasites.** *Typhula* (99) and *Moniliophthora* (84) attack non-tree
   plants. They are in for climate range and life history. Acceptable?
4. ***Psilocybe cubensis* (49).** Included as a well-documented tropical dung species. It is a
   controlled species in many places; drop it if the public site should avoid that.
5. **Species groups.** Several entries are really clusters of look-alike species (*Auricularia
   auricula-judae*, *Ganoderma lucidum*/*lingzhi*, *Pisolithus*, *Astraeus*, *Ophiocordyceps
   unilateralis*, cultivated "enoki" which is now *Flammulina filiformis*). One file per cluster,
   or pick one exact species each?
6. **Leave slots free?** The list uses all 100. If the owner wants room for later additions, the
   weakest ten by data and distinctiveness are 6, 35, 50, 51, 62, 75, 76, 95, 96, 97.
7. **Bench (first in if anything is dropped):** *Resinicium bicolor* and *Megacollybia
   platyphylla* (cord-formers with Boddy-lab data [15]), *Suillus bovinus*, *Clitocybe nebularis*
   (woodland fairy ring), *Stereum hirsutum* (combat experiments), *Ganoderma applanatum*,
   *Termitomyces microcarpus* (tiny, contrast to 90), *Hydnum repandum*, *Tomentella sublilacina*,
   *Laccocephalum mylittae*, *Mesophellia*, *Hygrocybe conica*, *Pleurotus djamor* (has the
   spiking data directly [10]), *Armillaria mellea*, *Elaphomyces granulatus* with its parasite
   *Tolypocladium ophioglossoides*.
8. **MAT is 24 species.** Should it be split, or is one family with a "perennial" flag enough?
9. **A follow-up search pass is needed.** The search budget ran out. Priority order: cord
   extension rates [14][15]; *Coprinopsis* and *Laccaria* colony growth rates; cultivation
   parameters from Stamets for species 1, 3, 10, 12, 13, 38, 39, 49; *Heterobasidion* and
   *Tricholoma matsutake* spread rates; verification of every (M) cell for the 30 flagship and
   second-tier species.

## 7. Sources

"Read" means I fetched the page this session and took values from it. "Snippet" means I saw only
the search engine's summary of it; the value should be rechecked against the full text.

1. Wikipedia, "Agaricomycetes" (cites Kirk et al. 2008, *Dictionary of the Fungi*, 10th ed.).
   https://en.wikipedia.org/wiki/Agaricomycetes . **Read.**
2. Wikipedia, "Fungus" (cites Cheek et al. 2020; Lücking/Hawksworth 2017; Wang et al. 2021).
   https://en.wikipedia.org/wiki/Fungus . **Read** (first 100,000 characters).
3. Hawksworth DL, Lücking R (2017). Fungal diversity revisited: 2.2 to 3.8 million species.
   *Microbiology Spectrum* 5(4). doi:10.1128/microbiolspec.FUNK-0052-2016. **Snippet** (DOI
   given from memory).
4. He M-Q et al. (2019). Notes, outline and divergence times of Basidiomycota. *Fungal Diversity*
   99:105–367. doi:10.1007/s13225-019-00435-4; and the 2024 update in *Fungal Diversity*.
   **Snippet.**
5. Wikipedia, "Agaricales". https://en.wikipedia.org/wiki/Agaricales . **Snippet.**
6. Ferguson BA, Dreisbach TA, Parks CG, Filip GM, Schmitt CL (2003). Coarse-scale population
   structure of pathogenic *Armillaria* species in a mixed-conifer forest in the Blue Mountains
   of northeast Oregon. *Can. J. For. Res.* 33:612–623.
   https://research.fs.usda.gov/treesearch/20135 . **Snippet** (author list and pages from
   memory).
7. Wikipedia, "Armillaria gallica" (cites Smith et al. 1992 *Nature* 356:428; Rishbeth 1991
   *Eur. J. For. Path.* 21:239; Mihail & Bruhn 2007 *Mycologia* 99:341).
   https://en.wikipedia.org/wiki/Armillaria_gallica . **Read.** Note: the page's 2018 revision
   cites a magazine article, and its "four times" wording does not match its own numbers.
8. Wikipedia, "Armillaria ostoyae" (cites Anderson et al. 2018, *Proc. R. Soc. B*).
   https://en.wikipedia.org/wiki/Armillaria_ostoyae . **Read.** Note: this page gives the Oregon
   individual as about 9.1 km² and about 8,000 years, and the Michigan one as 37 ha and 440 tons;
   these differ from [6] and [7]. I used [6] for Oregon.
9. Adamatzky A (2022). Language of fungi derived from their electrical spiking activity.
   *R. Soc. Open Sci.* 9:211926. doi:10.1098/rsos.211926.
   https://pmc.ncbi.nlm.nih.gov/articles/PMC8984380 . **Read.** Recordings at 21 °C, 80%
   humidity, in darkness; 1.5 days for *Schizophyllum*, about 5 days for the others.
10. Adamatzky A (2018). On spiking behaviour of oyster fungi *Pleurotus djamor*. *Sci. Rep.*
    8:7873. doi:10.1038/s41598-018-26007-1; and Adamatzky & Gandia on *Ganoderma resinaceum*
    (exact reference not confirmed). **Snippet.**
11. Agerer R (2001). Exploration types of ectomycorrhizae. *Mycorrhiza* 11:107–114.
    doi:10.1007/s005720100108. **Not read**; used through [12] and [13]. DOI from memory.
12. Wikipedia, "Ectomycorrhizal extramatrical mycelium".
    https://en.wikipedia.org/wiki/Ectomycorrhizal_extramatrical_mycelium . **Read.**
13. Genus-by-exploration-type table in *Annals of Forest Science*,
    https://annforsci.biomedcentral.com/articles/10.1007/s13595-010-0005-7/tables/2 .
    **Snippet.**
14. Dowson CG, Boddy L, Rayner ADM (1989). Development and extension of mycelial cords in soil at
    different temperatures and moisture contents. *Mycological Research* 92:383–391. **Abstract
    snippet only**; the full text with the rates was not obtained.
15. Cord-system papers seen as snippets only: Dowson, Rayner & Boddy (1986), Outgrowth patterns
    of mycelial cord-forming basidiomycetes (the PDF at scispace.com returned empty); Wells,
    Harris & Boddy (1999) on inoculum size in *P. velutina*; Tordoff, Boddy & Jones (2006)
    *Mycological Research* 110:335–345 on grazing, https://orca.cardiff.ac.uk/id/eprint/62592/ ;
    a *Stropharia caerulea* cord study. **Snippets.**
16. *Serpula lacrymans*: Wikipedia, https://en.wikipedia.org/wiki/Serpula_lacrymans (**read**;
    its temperature line is flagged "citation needed" there); Property Care Association, "Dry rot:
    insights from fungal biology", https://property-care.org/News/dry-rot-insights-fungal-biology
    (**snippet**); *Zeitschrift für Mykologie* 68 and 69 papers at zobodat.at (**snippet**);
    "Modelling the effect of temperature, water activity and pH on the growth of *Serpula
    lacrymans*", *J. Appl. Microbiol.* 2011, PMID 21951641 (**snippet**; PubMed page would not
    load).
17. *Coprinopsis cinerea*: Wikipedia, https://en.wikipedia.org/wiki/Coprinopsis_cinerea
    (**read**); *Appl. Microbiol. Biotechnol.* 2018, doi:10.1007/s00253-018-9227-7 (**snippet**,
    source of the 37 °C and 25–28 °C statement).
18. *Pleurotus ostreatus* growth on PDA at three temperatures. The search summary did not say
    which of these two papers carried the numbers:
    https://www.plantarchives.org/SPECIAL%20ISSUE%2021-1/120%20(798-801).pdf or
    https://ajpp.scione.com/cms/fulltext.php?id=36 . **Snippet; attribution not confirmed.**
19. *Lentinula edodes* growth: one or more of
    https://epubs.icar.org.in/index.php/MR/article/download/116196/45324/500223 ,
    https://phytojournal.com/archives/2018/vol7issue3/PartU/7-3-67-784.pdf ,
    https://koreascience.kr/article/JAKO201412837594181.pdf . **Snippet; attribution not
    confirmed.**
20. *Agaricus bisporus* growth: *J. Gen. Microbiol.* 137:1471 (1991),
    doi:10.1099/00221287-137-7-1471; a Springer paper, doi:10.1007/BF02017174; a Brazilian
    five-strain study, https://www.redalyc.org/pdf/3030/303026590021.pdf ; US patent 6,029,394
    for the temperature optimum. **Snippets.**
21. *Schizophyllum commune* growth: AIP Conference Proceedings 2020 (record at
    ris.unimap.edu.my); Korean study, https://pmc.ncbi.nlm.nih.gov/articles/PMC3755249 .
    **Snippets.**
22. *Marasmius oreades*: Wikipedia, https://en.wikipedia.org/wiki/Marasmius_oreades (**read**);
    Royal Horticultural Society, "Fairy rings", https://www.rhs.org.uk/advice/profile?PID=158
    (**snippet**); Ramaley (1916), *Torreya*,
    https://archive.org/download/biostor-276989/biostor-276989.pdf (**snippet**);
    MushroomExpert, https://mushroomexpert.com/fairy_ring.html (**snippet**).
23. *Morchella* growth: https://pmc.ncbi.nlm.nih.gov/articles/PMC6678217 (address inferred from
    the PMC number in the search result; **snippet**);
    https://www.plantarchives.org/20-2/5847-5853%20(6505).pdf (**snippet**).
24. *Tuber* growth: Iotti et al. (2002) as quoted in a later paper (one of
    https://par.nsf.gov/servlets/purl/10486751 or the *Mycoscience* 63(2) article); the 2025
    model study is https://hal.inrae.fr/hal-05360765v1 . **Snippets.**
25. Ectomycorrhizal isolates from *Pinus heldreichii*, *Forest Systems*,
    https://fs.revistas.csic.es/index.php/fs/article/download/7036/2798?inline=1 . **Snippet.**
26. Wikipedia, "Phellinus ellipsoideus" (cites Cui & Dai 2011, *Fungal Biology* 115:813).
    https://en.wikipedia.org/wiki/Phellinus_ellipsoideus . **Read.**
27. Wikipedia, "Termitomyces titanicus" (cites Pegler & Piearce 1980, *Kew Bulletin* 35:475).
    https://en.wikipedia.org/wiki/Termitomyces_titanicus . **Read.**
28. Wikipedia, "Calvatia gigantea". https://en.wikipedia.org/wiki/Calvatia_gigantea . **Read.**
29. Wikipedia, "Myrmecopterula" (cites Leal-Dutra et al. 2020, *IMA Fungus* 11:2).
    https://en.wikipedia.org/wiki/Myrmecopterula . **Read.**
30. Wikipedia, "Neonothopanus gardneri" (cites Capelari et al. 2011, *Mycologia* 103:1433).
    https://en.wikipedia.org/wiki/Neonothopanus_gardneri . **Read.**
31. Wikipedia, "Psathyrella aquatica" (cites Frank, Coffan & Southworth 2010, *Mycologia*
    102:93, doi:10.3852/07-190). https://en.wikipedia.org/wiki/Psathyrella_aquatica . **Read.**
32. Wikipedia, "Phallus indusiatus" (cites Chang & Miles 2004; Yang & Jong 1987; Went 1963).
    https://en.wikipedia.org/wiki/Phallus_indusiatus . **Read.**
33. Wikipedia, "Typhula ishikariensis" (cites Hoshino et al. 2009, *Mycoscience* 50).
    https://en.wikipedia.org/wiki/Typhula_ishikariensis . **Read.** The temperature paragraph
    has no inline citation there.
34. Wikipedia, "Leucoagaricus gongylophorus".
    https://en.wikipedia.org/wiki/Leucoagaricus_gongylophorus . **Read.**
35. Wikipedia, "Ophiocordyceps sinensis". https://en.wikipedia.org/wiki/Ophiocordyceps_sinensis .
    **Read.**
36. **Named from memory, not opened this session, details unconfirmed.** These stand behind the
    (M) cells and need checking before any is cited in a species file: Olsson & Hansson (1995)
    *Naturwissenschaften* 82:30 (action-potential-like activity in *Pleurotus* and *Armillaria*);
    Boddy (1999) *Mycologia* 91:13 (cord-forming fungi review); Fricker, Bebber, Boddy and
    colleagues on *Phanerochaete* network graphs; Lamour et al. (2007) on *Armillaria*
    rhizomorph networks; Kües (2000) *Microbiol. Mol. Biol. Rev.* 64:316 (*Coprinopsis*
    development); Stajich et al. (2010) *PNAS* (*Coprinopsis* genome); Martin et al. (2008)
    *Nature* (*Laccaria* genome); Martin et al. (2010) *Nature* (*Tuber* genome); Eastwood et al.
    (2011) *Science* (*Serpula* genome); Floudas et al. (2012) *Science* (wood-decay genomes);
    Sipos et al. (2017) *Nature Ecol. Evol.* (*Armillaria* genomes); Kohler et al. (2015)
    *Nature Genetics* (mycorrhizal genomes); Beiler et al. (2010) *New Phytologist*
    (*Rhizopogon* network); Oliveira et al. (2015) *Current Biology* (*Neonothopanus* clock);
    Hiltunen et al. (2019) *Current Biology* (*Marasmius* ring genomes); Stamets (2000) *Growing
    Gourmet and Medicinal Mushrooms*; JGI MycoCosm for genome status.

Pages that failed: Wikipedia "Amanita loosii" and "Sphaerobolus stellatus" (not found), PubMed
21951641 (blocked), scispace PDF of Dowson 1986 (empty).
