# 06. Environment and substrate

Research write-up for Phase 1, topic 6. Written 2026-11-09.

**How to read the source marks.** `[n]` points to the numbered list in section 7. Each source there
says whether I read the full text, read only part of it, or only saw it cited. Statements marked
**(unverified)** come from general knowledge and were not checked against a source in this pass,
because the shared web-search budget ran out partway through. Treat those as `inferred` or
`unknown` in species files, never as `sourced`.

## 1. Summary

1. Wood is roughly 40-50% cellulose, 15-25% hemicellulose and 15-30% lignin, with very little nitrogen (about 0.05-0.08% N in sound wood), so wood decayers are carbon-rich and nitrogen-starved [17][10][22].
2. White rot removes lignin and polysaccharides and leaves pale fibrous cellulose; brown rot removes polysaccharides and leaves a brown, cubically cracked, lignin-rich residue; soft rot (ascomycetes) works in wood too wet, hot or cold for the others [16].
3. Log decay is well described by a single exponential, `M(t) = M0 exp(-k t)`, with k about 0.06 per year at 10 °C and a Q10 of about 2.6; k ranges 244-fold worldwide [8].
4. For 37 wood-decay isolates, growth optima sit in a narrow band (22-32 °C, -0.2 to -1.0 MPa); species differ in niche *width*, not optimum, and wide-niche fungi grow slower and lose fights [3].
5. Faster hyphal extension predicts faster wood decay (Spearman rho = 0.67) and higher combat rank (Kendall tau = 0.55) [2][3].
6. Combat between wood decayers ends in deadlock or replacement, with a rough hierarchy (primary colonisers < early secondary < late secondary cord-formers) that has frequent exceptions [4][5].
7. Forest topsoil holds on the order of 10^4 m of hyphae per gram (pasture 10^3, arable 10^2); saprotrophs dominate fresh litter and ectomycorrhizal fungi the older humus beneath [11][12].
8. Light collembola grazing (783 per m²) stimulates cord-former extension; double that density suppresses it; grazers can reverse the outcome of fights [6].
9. Fruiting usually needs a 5-10 °C temperature downshift, lower CO2 and high humidity; in the field, warm late summers delay autumn fruiting and seasonal rain sets the yield [13][14][15].
10. Globally, climate is the strongest predictor of fungal distribution; ectomycorrhizal fungi have the narrowest climate niches, and ectomycorrhizal trees dominate cold or seasonally dry forests where decomposition is slow [18][19][20].

## 2. Findings

### 2.1 Substrates

**Wood composition.** Wood is 40-50% cellulose, 15-25% hemicellulose and 15-30% lignin by dry
mass [17]. Hardwoods carry much more xylan (19-35%) than softwoods (10-14%); softwoods carry more
glucomannan (12-18% against 3-4%) [1, search summary of a wood-chemistry review, not opened].
Softwood lignin is higher in amount and guaiacyl-only, which is the usual explanation for white
rot being weaker on conifers [1]. Typical air-dry densities: conifers 320-480 kg/m³ (western
redcedar 320, Douglas-fir 480), temperate hardwoods 550-680 kg/m³ (beech 640, white oak 680) [17].

**Decay types** [16]:

| Type | Fungi | What is removed | What is left |
|---|---|---|---|
| White rot | Basidiomycetes (*Trametes versicolor*, *Phanerochaete*); some ascomycetes | Lignin (lignin, manganese and versatile peroxidases, laccase) plus cellulose and hemicellulose | Pale, fibrous or crumbly cellulose-rich residue |
| Brown rot | Basidiomycetes (*Serpula lacrymans*, *Coniophora puteana*, *Fomitopsis pinicola*, *Laetiporus sulphureus*) | Hemicellulose and cellulose, by small diffusing oxidants, so damage runs ahead of the hyphae | Brown, shrunken, cubically cracked, demethylated lignin |
| Soft rot | Ascomycetes (*Chaetomium*, *Kretzschmaria deusta*) | Cellulose, through microscopic cavities in the cell wall | Softened surface layer; tolerates wetter, hotter or colder wood than the other two |

Brown-rot fungi are concentrated on conifers and in cool northern forests; few occur in the
tropics [16]. In one comparative block test, poplar lost 81% of its mass to the white rot
*T. versicolor* against 66% and 37% to the brown rots *Gloeophyllum trabeum* and *Rhodonia
placenta*, while softwoods lost more to brown rot [1, via search summary]. Brown-rot residue is the
proposed reason some log data fit an asymptotic curve better than a simple exponential [8].

**Decay rates.** A synthesis of coarse-wood decay constants [8] gives: single exponential
`M(t) = M0 exp(-k t)` as the standard form; k for downed logs from about 0.0025 per year (*Thuja*)
to 0.975 per year (tropical *Heliocarpus*), a 244-fold range; time to lose 95% of mass from 3 to
750 years; k at 10 °C of 0.058-0.061 per year with Q10 of 2.5-2.6 across all data (Q10 2.7 for
non-durable species, 1.6 for decay-resistant ones). Species at one site can differ 76-fold
(Pacific Northwest: *Alnus* 0.08, *Thuja* 0.007). In 16 of 27 studies k fell as diameter rose.
Standing dead wood is usually drier and slower (13 of 23 comparisons) but occasionally up to 3
times faster. Conifers decay more slowly than angiosperms at shared sites [9, abstract only]. In a
laboratory test, 10 x 10 x 5 mm maple blocks were incubated 122 days at 10, 16 and 22 °C, and mass
loss scaled with hyphal extension rate with a log-log slope of 0.39 [2].

**Decay classes.** The five-class log system (1 = sound with bark, 5 = soft and merged into the
forest floor) has measured residence times for Douglas-fir of 7, 17, 33, 82 and 219 years in
classes 1 to 5 (Means et al. 1985) and basic densities of 0.43, 0.39, 0.37, 0.29 and 0.20 g/cm³
(Casagli et al. 2022) [21, both via search summary, not opened].

**Nitrogen in wood.** Norway spruce logs hold about 0.5-0.6 mg N per g in decay classes 1-4,
rising to about 7 mg/g in class 5; the isotope signature shows the gain is nitrogen moved in from
soil, which the authors attribute mainly to fungal translocation [10]. *Betula* sapwood at 0.083%
N, *Ganoderma applanatum* fruit bodies at 1.13% N and spores at 3.05% N mean that all the nitrogen
in 13.6 g of wood makes 1 g of bracket, and 36.1 g of wood makes 1 g of spores [13] (the chapter
prints 0.83%, but its own 13.6 g figure only works with 0.083%). Taking wood as 50% carbon, these
give C:N of roughly 600-1000 for sound wood and about 70 for class 5 (my arithmetic, `inferred`).
Cord-forming fungi raise the nitrogen concentration of wood they are decaying, and add foraging
mycelium and fruit bodies rather than releasing surplus nutrients [22, abstracts only].

**Leaf litter and soil organic matter.** In a Swedish pine forest, saprotrophs occupy the fresh
surface litter, where carbon is respired and nitrogen retained; ectomycorrhizal fungi dominate the
older litter, humus and mineral soil below, where nitrogen is mobilised [12, via search summary
and commentary]. Soil microbes are near C:N 10, and a feedstock C:N of about 24-30 is the usual
balance point between nitrogen immobilisation and release [23]. Litter decay constants are far
higher than wood's, on the order of 0.1 to more than 1 per year **(unverified)**.

**Dung.** Coprophilous fungi have spores that survive gut passage and germinate in fresh dung,
which is nitrogen-rich and briefly free of competitors; *Pilobolus* shoots its sporangium more than
2 m to reach clean grass [24]. The classic fruiting order is zygomycetes (*Pilobolus*, *Mucor*,
days 2-7), then ascomycetes (*Ascobolus*, *Sordaria*, *Podospora*, weeks 1-3), then basidiomycetes
(*Coprinopsis*, *Panaeolus*, weeks 2-5 onward), and all groups are present from the start; the
order mostly reflects how long each takes to build a fruit body **(unverified; Harper and Webster
1964 is the usual citation, not opened)**.

**Living trees.** *Armillaria* disease centres expand at 0.2-2.5 m per year; measured values
include 0.22 m per year in 110-year-old Douglas-fir and 0.7-1.3 m per year in young plantations;
rhizomorphs grow less than 3 m per year; lesions inside a root slow from 127 mm in the first year
to 26 mm per year after ten years [25, via search summary]. *Heterobasidion annosum* advances
25 cm per year in stump roots and 9 cm per year in living tree roots of Norway spruce, with up to
52 cm per year inside stems [25]. The largest known *Armillaria ostoyae* individual covers about
910 ha and is estimated at about 8,000 years old; stumps stay infective for about 50 years; trees
under 10 years old are the most often killed [26].

**Insects.** *Ophiocordyceps unilateralis* kills carpenter ants in 4-10 days; the ant dies biting
a leaf vein about 25 cm above the ground, at 20-30 °C and 94-95% relative humidity; graveyards
reach 20-30 dead ants per m² [27].

**Cultivation substrates.**

| Species | Substrate | Colonisation | Fruiting conditions | Yield | Source |
|---|---|---|---|---|---|
| *Agaricus bisporus* | Composted straw and horse manure, 1.5-1.9% N dry weight, with gypsum; Phase II 7-18 days, pasteurised at 60 °C for 2 h | Spawn run 14-21 days at 24-25 °C substrate; damaged above 27-29 °C | Cased, then air 15-17 °C and CO2 lowered to about 0.08%; first harvest 15-21 days after casing; flushes every 7-10 days; whole cycle about 14 weeks | 4.4-27 kg/m² depending on casing (one study) | [28][29] |
| *Pleurotus ostreatus* | Pasteurised straw, cottonseed hulls, sawdust | Mycelium at 25 °C; full colonisation about 2-3 weeks; first fruit bodies at about 24-34 days | 20 °C, 90-95% RH, 12 h light; very CO2-sensitive | Biological efficiency about 74% on cottonseed hulls, 36% on wheat straw, 10% on sawdust in one trial | [30][31] |
| *Lentinula edodes* | Supplemented sawdust blocks | About 3 months from inoculation to clean-out, including a browning phase | Fruit-body pH optimum about 4 | Biological efficiency 75-125% | [29][13] |

Biological efficiency is fresh mushroom mass divided by dry substrate mass, times 100. Values vary
enormously between studies (one mixed-residue trial reports 239%) [30].

### 2.2 Soil structure

- **Hyphal length:** about 10², 10³ and 10⁴ m per g of soil in arable, pasture and forest topsoil.
  Fungal biomass 50-1000 µg per g dry soil, equal to 2-45 t/ha [11].
- **Pore classes (Brewer):** macropores above 75 µm (air-filled at field capacity; cracks, root and
  animal channels), mesopores 30-75 µm, micropores 5-30 µm, ultramicropores 0.1-5 µm, cryptopores
  below 0.1 µm [32]. Hyphae a few µm wide fit micropores and above; grazers cannot follow into
  pores narrower than their bodies, so some mycelium always escapes grazing [11].
- **Bulk density:** most mineral soils 1.0-1.6 g/cm³; organic horizons well below 1; particle
  density 2.65 g/cm³ [32]. *Rhizoctonia solani* colonised *more* of an arable soil at higher bulk
  density and less at low density [11].
- **Geometry:** path length between resources through the pore network is much longer than the
  straight line; a colony fed from one point reaches less far in 3D soil than across a surface.
  Growth along a macropore is significantly greater than growth across one, so crossing air gaps
  has a cost [11].
- **Water and air:** water films in small pores block gas exchange; fungi spread less where
  air-filled porosity is low [11].
- **Ectomycorrhizal mycelium:** production up to several hundred kg/ha per year across about 140
  forest sites (120-800 quoted; 590 ± 70 in Swedish spruce) [33, abstract and search summary];
  turnover 7-10 times per year reported for Mediterranean forests [33, search summary only].
  Ectomycorrhizal fungi take roughly 15% of host photosynthate [34].

### 2.3 Abiotic responses

**Temperature and water potential (wood decayers).** Maynard et al. [3] grew 37 isolates of 23
North American species on malt agar from 10 to 40 °C and from -0.5 to -4.5 MPa (adjusted with
KCl). Optimum temperature was 22-32 °C for all but five isolates, with a typical optimum near
28 °C. Optimum water potential was -0.2 to -1.0 MPa for every isolate (mean -0.47; *Armillaria
gallica* drier at -0.78). Niche width, defined as the range giving at least half the maximum
extension rate, ran from about 10 to 25 °C and from about 2 to 5 MPa. Peak extension rates ran
from under 1 to about 15 mm per day (read from figure axes). Wider moisture niche went with slower
extension (tau = -0.43) and lower combat rank (tau = -0.27). Curves were fitted with a skew-normal
function (error 4.3% for temperature, 9.4% for moisture). The fungi came from Alaska to Puerto
Rico, so optimum does not track home climate, but thermal niche width does.

**Other cardinal values found:**

| Species | Min | Optimum | Max | Notes | Source |
|---|---|---|---|---|---|
| Wood-decay basidiomycetes (37 isolates) | below 10 °C | 22-32 °C | up to and above 40 °C in some | optimum -0.2 to -1.0 MPa | [3] |
| *Agaricus bisporus* mycelium | | 24 °C | damaged at 27-29 °C | fruit bodies develop at 16 °C | [13][28] |
| *Serpula lacrymans* | 3 °C | 21-22 °C | 26 °C | range marked "citation needed" in source | [35] |
| *Pleurotus ostreatus*, *P. pulmonarius* mycelium | | 30 °C | | abstract only | [36] |
| *Lentinula edodes* mycelium | | 20-30 °C by strain; 24 °C in one study | | abstract only | [36] |
| *Ophiocordyceps unilateralis* | | 20-30 °C, 94-95% RH | | conditions at host death | [27] |
| "*S. caerulea*" (probably *Stropharia caerulea*; genus not given in the summary I saw) | | | extension sensitive above 25 °C and below -1.3 MPa | search summary of Donnelly and Boddy 1997 | [37] |
| *Pleurotus sajor-caju* primordia | | | form at -2.5 MPa, none at -3.5 MPa although mycelium still grows | fruiting is more drought-sensitive than growth | [13] |

**Wood moisture.** Decay needs wood near or above fibre saturation, which is variously put at 23-39%
moisture content (dry-mass basis) depending on species and definition; -0.1 MPa corresponds to
99.93% relative humidity. Measured minimum for decay without liquid water: 25.3% moisture content
(96% RH) for *T. versicolor* on beech and 16.3% in piled Norway spruce; no decay in 12 months at 97% RH in
another study. *Coniophora puteana* pumps water into dry wood, lifting it above fibre saturation
within days. Spores germinate down to about 89-90% RH [38]. The upper limit is set by loss of air
space: the usual textbook optimum is 40-80% moisture content with decay stopping in saturated wood
**(unverified in this pass)**.

**pH.** Fungal growth in an arable soil gradient peaked at pH 4.5 and fell more than five-fold
toward pH 8.3, while bacterial growth did the reverse; later work attributes much of the fungal
decline to bacterial competition [39, abstract]. Fruit-body development is optimal at pH 6-7 for
several species but pH 4 for shiitake [13]. Basidiomycetes acidify wood and ascomycetes raise its
pH during colonisation [5]. Mushroom casing peat is limed from pH 3.5-4.5 to 7.5 [28].

**Oxygen and CO2.** Mycelium tolerates far higher CO2 than fruit bodies do. Raised CO2 suppresses
basidiome initiation in *Schizophyllum commune*, lengthens the stem and holds back the cap in
*Agaricus* [13]; in oyster mushroom, 1% CO2 stopped cap expansion and spore release [31]; edible
fungi are generally said to suffer above 0.1% CO2, with cap formation blocked at 5% [31].
*Agaricus* pinning needs room CO2 at or below about 0.08% [28]. Wood decayers grow down to roughly
1% O2 and tolerate CO2 of 10% or more inside logs **(unverified; Jensen 1967 and Scheffer 1986 are
the usual citations, not opened)**.

**Light.** Many basidiomycetes need light to initiate or complete fruit bodies; blue and
near-ultraviolet (320-400 nm) are the effective wavelengths [13]. Vegetative mycelium grows in the
dark [31].

**Diffusion coefficients** (25 °C): O2 in air 2.1 x 10⁻⁵ m²/s, CO2 in air 1.6 x 10⁻⁵, water vapour
in air 2.6 x 10⁻⁵; O2 in water 2.1 x 10⁻⁹ m²/s, CO2 in water 1.92 x 10⁻⁹ [40]; glucose in water
6.0 x 10⁻¹⁰ m²/s (600 µm²/s) [41]. Gases move about 10,000 times faster through air-filled pores
than water-filled ones. In porous media, effective diffusivity is `De = D * porosity *
constrictivity / tortuosity` [40], and the common soil-gas form is Millington-Quirk, `Ds/D0 =
a^(10/3) / phi²`, with a the air-filled porosity and phi the total porosity [42, via search
summary]. No measured values for glucose diffusion in wood were found.

### 2.4 Nutrient economics

- **Uptake:** *Neurospora crassa* has a dual glucose system: high-affinity transporters with Km
  16 µM and 99 µM, and a low-affinity transporter with Km 18.4 mM [43, via search summary]. No
  Vmax values and no basidiomycete values were found.
- **Yield:** 0.45-0.61 g biomass per g glucose for *Penicillium* in stirred reactors; 0.20 g/g for
  *Phanerochaete chrysosporium* biofilm [44, via search summary].
- **Maintenance:** 0.018 g glucose per g biomass per hour for *Aspergillus nidulans* at 30 °C
  (0.029 excluding melanin); 0.028 per hour for *P. chrysosporium* biofilm [44].
- **Enzyme cost:** fast-extending decay fungi produce *less* hydrolytic enzyme per unit biomass
  (acid phosphatase R² = 0.31, negative) and have lower hyphal density (rho = -0.61 with decay
  rate); dense, slow fungi invest more per hypha [2]. No direct measurement of secretion cost as a
  carbon fraction was found.
- **Nitrogen:** best C:N for fruiting ranges from 30:1 to 5:1 by species; protein is a better
  nitrogen source for fruiting than ammonium [13]. Large brackets need the nitrogen of kilograms
  of wood, so fruiting capacity scales with the territory a mycelium holds [13]. Nitrogen
  fertilisation of forests suppresses ectomycorrhizal fruiting and cut species richness from over
  30 to 9 in one gradient [34].

### 2.5 Biotic environment

**Combat.** Outcomes are deadlock (neither loses ground), replacement, partial replacement, or
mutual replacement [4][5]. General ranking on beech: primary colonisers (*Vuilleminia comedens*) <
early secondary (*Trametes versicolor*, *Stereum hirsutum*, *Bjerkandera adusta*) < late secondary
cord-formers (*Hypholoma fasciculare*, *Phanerochaete velutina*) [4]. In 2 x 2 x 1 cm beech blocks
at 20 °C over 84 days, cord-formers always replaced *V. comedens* and *B. adusta*; *P. velutina*
replaced *H. fasciculare* and *T. versicolor*; *T. versicolor* deadlocked with *H. fasciculare*;
*P. velutina* deadlocked with *S. hirsutum*, which holds ground better than it takes it. A fungus
sitting between two opponents, or holding extra territory, did better, and three-way results were
not predictable from pairs [4]. Across 615 pairwise trials of 20 species, combat rank rose with
extension rate [2][3].

**Succession and priority.** In beech discs pre-colonised by one of nine species and left on a
woodland floor, 42.8% still held the original fungus at harvest and 92.8% held invaders; ascomycete
pre-colonisers were replaced fast, late-stage basidiomycetes slowly; primary colonisers
(*V. comedens*, *Hypoxylon fragiforme*, *Biscogniauxia nummularia*) were gone within 12 months;
94% of invading isolates were opportunists (*Mucor*, *Rhizopus*, *Hypocrea*), not decay fungi [5].

**Grazing.** *Folsomia candida* at 783 per m² stimulated extension of *H. fasciculare* and
*P. velutina*; at 1,566 per m² it restricted both. Woodlice (*Oniscus asellus*) can remove
*Resinicium bicolor* systems entirely, which prevents it excluding the other two species.
Nematode grazing let *H. fasciculare* overcome *R. bicolor*. Grazing raises enzyme output and wood
decay in *H. fasciculare* and lowers both in *R. bicolor*. Grazers prefer saprotrophs to
mycorrhizal fungi [6].

**Bacteria.** Bacteria out-compete fungi at high soil pH [39]. No quantitative wood data found.

**Hosts.** About 2% of plant species are ectomycorrhizal, but they make up about 60% of tree
stems on Earth [20][34]. Host families: Pinaceae, Fagaceae, Betulaceae, Salicaceae, Myrtaceae,
Dipterocarpaceae. Most ectomycorrhizal fungi are host generalists; the suilloid group (*Suillus*,
*Rhizopogon*, *Gomphidius*) is almost entirely restricted to Pinaceae [34].

### 2.6 Season and weather

- Most basidiomycetes fruit in autumn after spring and summer mycelial growth [13].
- Fruiting generally needs a 5-10 °C downshift and lower CO2; the optimum for fruiting is below
  the optimum for growth [13].
- Swiss 21-year plot: a 1 °C rise in July-August temperature delays saprotroph fruiting by 7 days;
  yield follows June-October precipitation [13].
- Mediterranean oak forest: weather in the 5 days before a survey has little effect; weather
  10-30 days before does [13].
- Norway 1940-2006: autumn fruiting 12.9 days later since 1980; early species delayed most; only
  7.2% of variation in fruiting date is explained by shared responses to yearly weather, and 58%
  is within-species within-year scatter [15].
- Europe 1970-2007: season widened in all four countries; the season end moved 1.1 to 6.4 days
  later per decade; ectomycorrhizal fungi have a more compressed season than saprotrophs [14].
- UK: of saprotrophs with significant change, first fruiting advanced 7.9 days per decade and last
  fruiting moved 7.2 days later per decade [13].

**Weather generator.** The standard cheap approach is the Richardson (WGEN) type: a two-state
first-order Markov chain for wet and dry days (two probabilities per month: wet after dry, wet
after wet), a gamma or exponential draw for rain amount on wet days, and daily maximum and minimum
temperature as a seasonal cosine mean plus a lag-1 autoregressive residual, with the mean shifted
down on wet days **(structure from general knowledge; Richardson 1981 was not opened)** [45].

### 2.7 Biomes and global patterns

- Climate is the strongest predictor of soil fungal richness and composition worldwide, ahead of
  soil and spatial variables; fungal richness is decoupled from plant richness except for
  ectomycorrhizal fungi; the plant-to-fungus richness ratio falls toward the poles [18, abstract].
- In a 3,084-sample meta-analysis, 97% of common taxa had climate-constrained distributions;
  of explained variation 65.5% was climate, 23.7% soil, 11.2% vegetation; the top variables were
  mean temperature of the driest quarter and precipitation seasonality [19].
- Niche breadth: ectomycorrhizal fungi span 4.2 °C of mean annual temperature and about 330 mm of
  precipitation on average; other guilds span 6.7-9.6 °C and 430-860 mm [19].
- 8% of frequent taxa occur on all continents; 23% on one only [19].
- Ectomycorrhizal trees dominate where cold or seasonally dry climate slows decomposition (high
  latitude and altitude); arbuscular trees dominate warm aseasonal tropics; the switch between them
  along the decomposition gradient is abrupt [20, abstract].
- Brown-rot fungi are mostly boreal and montane conifer associates, rare in the tropics [16].
- Ectomycorrhizal richness peaks at temperate to boreal northern latitudes, tracking host
  abundance and soil pH, while saprotroph richness follows precipitation **(my recollection of
  Tedersoo et al. 2014 full text, which I could not open; unverified)**.

## 3. Numbers for the model

| Parameter | Value or range | Units | Species or material | Source | Confidence |
|---|---|---|---|---|---|
| Cellulose / hemicellulose / lignin | 40-50 / 15-25 / 15-30 | % dry mass | Wood, general | [17] | High |
| Wood N | 0.5-0.6 (sound) to 7 (class 5) | mg/g | Norway spruce logs | [10] | High |
| Wood N | 0.083 | % | *Betula* sapwood | [13] corrected | Medium |
| Fruit body N; spore N | 1.13; 3.05 | % | *Ganoderma applanatum* | [13] | Medium |
| Wood needed per g fruit body (N basis) | 13.6 | g/g | *G. applanatum* on birch | [13] | Medium |
| Log decay constant k | 0.0025-0.975 | per year | Downed logs, global | [8] | High |
| k at 10 °C | 0.058-0.061 | per year | All coarse wood | [8] | High |
| Q10 of k | 2.5-2.6 (1.6 durable species) | none | Coarse wood | [8] | High |
| Residence time, decay classes 1-5 | 7, 17, 33, 82, 219 | years | Douglas-fir | [21] | Medium (not opened) |
| Density, decay classes 1-5 | 0.43, 0.39, 0.37, 0.29, 0.20 | g/cm³ | Douglas-fir | [21] | Medium (not opened) |
| Optimum temperature | 22-32 (typical 28) | °C | 37 wood-decay isolates | [3] | High |
| Thermal niche width (half-max) | about 10-25 | °C | same | [3] figure | Medium |
| Optimum water potential | -0.2 to -1.0 (mean -0.47) | MPa | same | [3] | High |
| Moisture niche width (half-max) | about 2-5 | MPa | same | [3] figure | Medium |
| Peak extension rate on agar | under 1 to about 15 | mm/day | same | [3] figure | Medium |
| Extension rate vs decay | rho 0.67; log-log slope 0.39 | none | 34 isolates, maple blocks | [2] | High |
| Min wood moisture for decay | 16-25 (no liquid water); usually near fibre saturation 23-39 | % dry basis | *T. versicolor*, beech and spruce | [38] | Medium |
| Water potential to RH | -0.1 MPa = 99.93% RH | | | [38] | High |
| Fruiting limit | primordia at -2.5, none at -3.5 | MPa | *Pleurotus sajor-caju* | [13] | Medium |
| Fruiting temperature downshift | 5-10 | °C | Cultivated basidiomycetes | [13] | High |
| *Agaricus* growth / fruiting temperature | 24 / 16 | °C | *A. bisporus* | [13][28] | High |
| *Agaricus* pinning CO2 | at or below 800 | ppm | *A. bisporus* | [28] | High |
| CO2 blocking cap expansion | 10,000 (1%) | ppm | *P. ostreatus* | [31] | Medium |
| Spawn run | 14-21 at 24-25 °C | days | *A. bisporus* in compost | [28] | High |
| Biological efficiency | 10-74 (to 125 for shiitake blocks) | % | Oyster, shiitake | [29][30] | Low (study-specific) |
| Soil fungal pH optimum | 4.5 (5-fold drop by 8.3) | pH | Arable soil community | [39] | Medium |
| Hyphal length | 10² / 10³ / 10⁴ | m per g soil | Arable / pasture / forest | [11] | Medium (order of magnitude) |
| Fungal biomass | 50-1000 | µg per g soil | Soils | [11] | Medium |
| EM mycelium production | 120-800 | kg/ha/yr | Forests, mostly spruce | [33] | Medium (not opened) |
| Pore classes | over 75 / 30-75 / 5-30 / 0.1-5 / under 0.1 | µm | Soil | [32] | High |
| Bulk density | 1.0-1.6 | g/cm³ | Mineral soil | [32] | High |
| D O2 air / water | 2.1e-5 / 2.1e-9 | m²/s, 25 °C | | [40] | High |
| D CO2 air / water | 1.6e-5 / 1.92e-9 | m²/s, 25 °C | | [40] | High |
| D glucose in water | 6.0e-10 | m²/s | | [41] | Medium (temperature not stated) |
| Glucose Km high / low affinity | 16 and 99 µM / 18.4 mM | | *Neurospora crassa* | [43] | Medium (not opened) |
| Yield on glucose | 0.20-0.61 | g/g | *P. chrysosporium*, *Penicillium* | [44] | Medium (not opened) |
| Maintenance | 0.018-0.029 | g glucose/g/h | *A. nidulans*, 30 °C | [44] | Medium (not opened) |
| Grazing switch | stimulates at 783; suppresses at 1,566 | collembola per m² | *H. fasciculare*, *P. velutina* | [6] | Medium |
| *Armillaria* spread | 0.2-2.5 (rhizomorphs under 3) | m/yr | In forest | [25] | Medium (not opened) |
| *Heterobasidion* spread | 9 (living roots), 25 (stump roots), to 52 (stem) | cm/yr | Norway spruce | [25] | Medium (not opened) |
| Insect kill time | 4-10 | days | *O. unilateralis* in ants | [27] | Medium |
| Fruiting delay per °C late summer | 7 | days per °C | Swiss saprotrophs | [13] | Medium |
| Weather lag for fruiting | 10-30 | days | Mediterranean oak forest | [13] | Medium |
| EM climate niche | 4.2 °C; 330 mm | MAT, MAP span | Ectomycorrhizal taxa | [19] | High |
| Other guild climate niche | 6.7-9.6 °C; 430-860 mm | MAT, MAP span | Saprotrophs, pathogens | [19] | High |
| EM share of host carbon | about 15 | % | | [34] | Low (tertiary) |

## 4. Response curves

**Temperature (recommended): cardinal temperature model with inflection** [7]. Three readable
parameters per species.

```
gT(T) = (T - Tmax)(T - Tmin)^2
        / ( (Topt - Tmin) * [ (Topt - Tmin)(T - Topt) - (Topt - Tmax)(Topt + Tmin - 2T) ] )
gT = 0 outside Tmin < T < Tmax;  gT(Topt) = 1
```

The equation is quoted from a secondary source and matches my memory of Rosso et al. 1993; I read
only the abstract of the 1995 paper, so check it against the original before MODEL.md is frozen.
Default family values from [3]: Topt 28, Tmin about 5, Tmax about 38-40 °C. For the 4K tier a
triangle through (Tmin, Topt, Tmax) is enough.

**Decay and respiration with temperature** [8]: `k(T) = k10 * Q10^((T - 10)/10)`, k10 = 0.06 per
year, Q10 = 2.6, capped by gT above Topt.

**Water potential.** Maynard et al. fitted a skew-normal [3]. A cheaper form with the same shape:

```
gW(psi) = exp( -((psi - psi_opt) / w_dry)^2 )   for psi < psi_opt
gW(psi) = exp( -((psi - psi_opt) / w_wet)^2 )   for psi > psi_opt
```

Defaults: psi_opt = -0.5 MPa; w_dry chosen so the half-maximum width is 2-5 MPa (each side reaches half
maximum at 0.83 w from the optimum, so w_dry is about width / 0.83 when the wet side is narrow). Fruiting uses the same curve with about half the dry width
[13].

**Wood moisture and air** (two limits multiplied, my construction from [38] and [11]):

```
gM = clamp((MC - MCmin) / (MCopt - MCmin), 0, 1) * clamp(air_fraction / air_crit, 0, 1)
```

MCmin about 25%, MCopt about 40% (dry basis); air_crit is a free parameter (start at 0.1-0.2,
**unverified**).

**pH: cardinal pH model** [7]:

```
gpH = (pH - pHmin)(pH - pHmax) / ( (pH - pHmin)(pH - pHmax) - (pH - pHopt)^2 )
```

Defaults for saprotrophic basidiomycetes: pHopt 4.5-5.5, pHmin about 2.5, pHmax about 8
(optimum from [39]; the limits are **unverified**).

**Combining factors** (gamma concept, [7]): `growth = mu_opt * gT * gW * gpH * gS`, each factor
between 0 and 1 and treated as independent.

**Uptake and growth:**

```
uptake  q  = Vmax * S / (Km + S)             Km = 20-100 µM (high affinity), about 20 mM (low)
growth  mu = Y * (q - m)                     Y = 0.2-0.6 g/g; m = 0.02 g/g/h at 30 °C
gS         = S / (Km + S)
```

Scale m with the same Q10 as decay. For wood, S is the soluble sugar released by enzymes, not the
wood itself: `dWood/dt = -kdec * B_local * gT * gM`, with a species-set fraction of lignin left
behind (brown rot leaves nearly all lignin, white rot little).

**Nitrogen limit:** `gN = min(1, N_supply * CN_biomass / (Y * C_supply))`, CN_biomass about 10-20
for active mycelium (10 is the soil-microbe value in [23]; fungal mycelium is usually higher,
**unverified**). Translocated nitrogen from soil counts toward N_supply [10].

**Fruiting trigger:** fruit when (a) stored resource exceeds a species threshold proportional to
fruit-body nitrogen, (b) the 10-30 day running mean of soil water potential is above the fruiting
limit, and (c) temperature has dropped by 5 °C or more from its recent running mean [13].

## 5. What this means for the simulator

From simplest to most detailed.

1. **4K tier.** One scalar "vigour" multiplies tip speed: a triangle in temperature and a
   triangle in moisture. Two of the eight species numbers are Topt and a drought-tolerance width.
2. **Species differ in width, not optimum.** Give every wood-decay species nearly the same
   optimum (28 °C, -0.5 MPa) and vary the niche width. Tie width to speed: wide niche means slower
   extension and lower combat rank [3]. This one trade-off axis generates believable species.
3. **Speed is the master trait.** Decay rate rises with extension rate to the power 0.4, and
   hyphal density falls with it [2]. A single "fast-thin versus slow-dense" slider can set tip
   speed, branching density, decay rate and combat rank together for inherited-family species.
4. **Substrate patches (40K).** Each cell carries type (wood, litter, soil, dung), carbon stock,
   nitrogen stock, moisture and a decay-class index. Wood loses mass exponentially while colonised,
   at k10 = 0.06 per year times Q10, times moisture, times the species speed factor. Density falls
   through the decay classes (0.43 to 0.20 g/cm³).
5. **Rot type is a residue rule.** White rot depletes all three polymers and whitens the cell;
   brown rot depletes polysaccharide only and leaves a brown lignin cell that later becomes soil
   organic matter; soft rot is allowed only in near-saturated cells.
6. **Nitrogen gates growth and fruiting.** Sound wood at C:N 600-1000 cannot pay for fruit bodies
   at about 1% N. Let cords import nitrogen from soil cells into wood cells and require a
   nitrogen budget of about 14 g wood-equivalent per g of fruit body [13].
7. **Soil as layers (400K).** Litter (saprotrophs), humus (ectomycorrhizal), mineral soil. Each
   layer has porosity, air-filled fraction and bulk density. Gas diffusivity follows
   Millington-Quirk; tips slow where air-filled porosity is low and prefer to follow macropores
   rather than cross them.
8. **Combat.** When two individuals meet, draw the outcome from a species-pair table seeded from
   combat rank: a large rank gap gives replacement, a small one deadlock. Add a territory bonus
   for the larger individual and let temperature shift rank, since outcomes are not strictly
   transitive [4][5].
9. **Succession for free.** Give primary colonisers high spore arrival and low combat rank, and
   cord-formers the reverse; succession then emerges. Fresh dung gets a fixed timer per group.
10. **Grazing.** A grazer density field removes fine hyphae outside protected pores. Low density
    multiplies tip speed above 1; density over a threshold (about 1,500 collembola per m²)
    multiplies it below 1. Species have a palatability value.
11. **Weather driver.** Daily Markov-chain rain, gamma rain depth, cosine-plus-AR(1) temperature;
    a bucket soil-water model turns rain into water potential. Fruiting reads the 10-30 day
    history, not the current day.
12. **Parasites.** Root pathogens advance through living roots at centimetres to decimetres per
    year, far slower than through dead wood, and rhizomorphs bridge soil gaps at under 3 m per
    year.
13. **Globe placement (`lite` block).** Store mean annual temperature and precipitation centre
    and span per species. Give ectomycorrhizal species narrow spans (about 4 °C, 330 mm) and a
    host-family list; give saprotrophs and pathogens wider ones (7-10 °C, 430-860 mm). Put
    ectomycorrhizal species in cold or seasonally dry forest biomes, brown rots on conifers in
    boreal and montane cells, and insect and termite associates in the wet tropics.

## 6. Open or contested points

- **Is the phenology shift caused by warming?** Kauserud et al. attribute the longer fruiting
  season to warming [14]; a published reply argues the attribution is not justified and that host
  resources matter for mycorrhizal species [14, via search summary]. Sampling effort biased 40-59%
  of the season-length trends [14].
- **Fibre saturation as a hard decay threshold.** Some studies find decay well below it, others
  none at 97% RH for a year; agar in the test rig inflates results, and fungi move their own water
  [38].
- **Agar optima versus field.** Maynard's optima are on malt agar with KCl. Matric and osmotic
  stress are not equivalent, and wood changes the picture.
- **The combat hierarchy is not a ranking.** Deadlocks, intransitive triplets and three-way
  effects are routine; pairwise tables mispredict multi-species outcomes [4].
- **Soil pH effect on fungi** is partly a bacterial competition effect, not fungal physiology [39].
- **CO2 and stem length.** The classical result is longer stems under high CO2 [13]; one recent
  oyster study reports shorter, thinner stems at 1% CO2 [31]. Probably dose-dependent.
- **High-latitude fungal diversity.** Větrovský et al. find the highest diversity at high
  latitudes [19]; Tedersoo et al. describe gradients broadly like other organisms, with exceptions
  [18]. The tropics are undersampled.
- **Gaps I could not fill:** minimum O2 and CO2 tolerance of mycelium in wood; glucose diffusion in
  wood; Vmax for any uptake system; basidiomycete Km values; litter decay constants; dung
  succession timings; cardinal temperatures for most of the likely flagship species; the Boddy
  1983 temperature and water-potential data (paywalled); full-text numbers from Tedersoo 2014,
  Weedon 2009 and Ekblad 2013.

## 7. Sources

Read status: **full** = full text read; **part** = some of the text read through a fetch tool that
truncates long pages; **abstract** = abstract or repository record only; **summary** = known only
from a search-engine summary of the page; **cited** = seen cited, not opened.

1. Wood-chemistry and comparative decay studies returned by search (a review giving cellulose 39-45%, xylan and glucomannan contents; a block-decay study with *T. versicolor*, *G. trabeum*, *R. placenta*). Individual papers not opened; exact citations to be recovered. **summary**
2. Lustenhouwer N, Maynard DS, Bradford MA, et al. 2020. A trait-based understanding of wood decomposition by fungi. PNAS 117:11551. https://pmc.ncbi.nlm.nih.gov/articles/PMC7261009 **part**
3. Maynard DS, Bradford MA, Covey KR, et al. 2019. Consistent trade-offs in fungal trait expression across broad spatial scales. Nature Microbiology 4:846. doi:10.1038/s41564-019-0361-5. PDF: https://research.fs.usda.gov/treesearch/57631 **full**
4. Hiscox J, Savoury M, Toledo S, Kingscott-Edmunds J, Bettridge A, Al Waili N, Boddy L. 2017. Threesomes destabilise certain relationships: multispecies interactions between wood decay fungi in natural resources. FEMS Microbiology Ecology 93:fix014. https://pmc.ncbi.nlm.nih.gov/articles/PMC5399798 **part**. Also Boddy L. 2000. Interspecific combative interactions between wood-decaying basidiomycetes. FEMS Microbiology Ecology 31:185. **abstract**
5. Hiscox J, Savoury M, Müller CT, Lindahl BD, Rogers HJ, Boddy L. 2015. Priority effects during fungal community establishment in beech wood. ISME Journal 9:2246. https://www.nature.com/articles/ismej201538 **part**
6. Crowther TW, Boddy L, Jones TH. 2012. Functional and ecological consequences of saprotrophic fungus-grazer interactions. ISME Journal 6:1992. https://pmc.ncbi.nlm.nih.gov/articles/PMC3475375 **part**
7. Rosso L, Lobry JR, Bajard S, Flandrois JP. 1995. Convenient model to describe the combined effects of temperature and pH on microbial growth. Applied and Environmental Microbiology 61:610. https://pmc.ncbi.nlm.nih.gov/articles/PMC1388350 **abstract**; and Rosso L, Lobry JR, Flandrois JP. 1993. Journal of Theoretical Biology 162:447. **cited**. Equation text taken from https://metricgate.com/docs/cardinal-temperature-model-ctmi/ **summary**
8. Harmon ME, Fasth BG, Yatskov M, Kastendick D, Rock J, Woodall CW. 2020. Release of coarse woody detritus-related carbon: a synthesis across forest biomes. Carbon Balance and Management 15:1. https://pmc.ncbi.nlm.nih.gov/articles/PMC7227111 **part**
9. Weedon JT, Cornwell WK, Cornelissen JHC, Zanne AE, Wirth C, Coomes DA. 2009. Global meta-analysis of wood decomposition rates: a role for trait variation among tree species? Ecology Letters 12:45. doi:10.1111/j.1461-0248.2008.01259.x **abstract**
10. Mäkipää R, Rajala T, Schigel D, Rinne KT, Pennanen T, Abrego N, Ovaskainen O. 2017. Interactions between soil- and dead wood-inhabiting fungal communities during the decay of Norway spruce logs. ISME Journal 11:1964. https://pmc.ncbi.nlm.nih.gov/articles/PMC5563949 **part**
11. Ritz K, Young IM. 2004. Interactions between soil structure and fungi. Mycologist 18:52. https://davidmoore.org.uk/assets/fungi4schools/Reprints/Mycologist_articles/Post-16/Environment/V18pp052-059soil_structure.pdf **full**
12. Lindahl BD, Ihrmark K, Boberg J, et al. 2007. Spatial separation of litter decomposition and mycorrhizal nitrogen uptake in a boreal forest. New Phytologist 173:611. **summary**
13. Moore D, Gange AC, Gange EG, Boddy L. 2008. Fruit bodies: their production and development in relation to environment. Chapter 5 in Boddy, Frankland, van West (eds), Ecology of Saprotrophic Basidiomycetes. Elsevier. (PDF fetched by another agent in this project; URL not recorded by me.) **full**
14. Kauserud H, Heegaard E, Büntgen U, et al. 2012. Warming-induced shift in European mushroom fruiting phenology. PNAS 109:14488. https://pmc.ncbi.nlm.nih.gov/articles/PMC3437857 **part**. Reply by Gange et al. 2013, PNAS. **summary**
15. Kauserud H, Stige LC, Vik JO, Økland RH, Høiland K, Stenseth NC. 2008. Mushroom fruiting and climate change. PNAS 105:3811. doi:10.1073/pnas.0709037105 **part** (first pages)
16. Wikipedia. Wood-decay fungus. https://en.wikipedia.org/wiki/Wood-decay_fungus **part** (tertiary)
17. Wikipedia. Wood. https://en.wikipedia.org/wiki/Wood **part** (tertiary)
18. Tedersoo L, Bahram M, Põlme S, et al. 2014. Global diversity and geography of soil fungi. Science 346:1256688. doi:10.1126/science.1256688 **abstract**
19. Větrovský T, Kohout P, Kopecký M, et al. 2019. A meta-analysis of global fungal distribution reveals climate-driven patterns. Nature Communications 10:5142. https://www.nature.com/articles/s41467-019-13164-8 **part**
20. Steidinger BS, Crowther TW, Liang J, et al. 2019. Climatic controls of decomposition drive the global biogeography of forest-tree symbioses. Nature 569:404. https://www.nature.com/articles/s41586-019-1128-0 **abstract**
21. Means JE, Cromack K, MacMillan PC. 1985. Comparison of decomposition models using wood density of Douglas-fir logs. Canadian Journal of Forest Research 15:1092; and Casagli A, et al. 2022. Forest Systems. https://fs.revistas.csic.es/index.php/fs/article/view/19186 **summary**
22. Boddy L, Watkinson SC. 1995. Wood decomposition, higher fungi, and their role in nutrient redistribution. Canadian Journal of Botany 73:S1377. doi:10.1139/b95-400; Bebber DP, Watkinson SC, Boddy L, Darrah PR. 2011. Simulated nitrogen deposition affects wood decomposition by cord-forming fungi. Oecologia. **abstract / summary**
23. Wikipedia. Carbon-to-nitrogen ratio. https://en.wikipedia.org/wiki/Carbon-to-nitrogen_ratio **part** (tertiary)
24. Wikipedia. Coprophilous fungi. https://en.wikipedia.org/wiki/Coprophilous_fungi **full** (tertiary)
25. *Armillaria* and *Heterobasidion* spread rates: EPPO summary sheets (https://rnqp.eppo.int/recommendations2/summarysheet_host?id=429), a USDA Forest Service chapter (https://www.fs.usda.gov/rm/pubs_journals/2022/rmrs_2022_kim_m002.pdf), and journal abstracts returned by search. **summary**
26. Wikipedia. Armillaria ostoyae. https://en.wikipedia.org/wiki/Armillaria_ostoyae **full** (tertiary)
27. Wikipedia. Ophiocordyceps unilateralis. https://en.wikipedia.org/wiki/Ophiocordyceps_unilateralis **full** (tertiary)
28. Penn State Extension. Basic procedures for Agaricus mushroom growing, https://extension.psu.edu/basic-procedures-for-agaricus-mushroom-growing **part**; Six steps to mushroom farming, https://extension.psu.edu/six-steps-to-mushroom-farming **part**
29. Shiitake and *Agaricus* yield figures: Royse-type HortTechnology article (https://journals.ashs.org/downloadpdf/view/journals/horttech/12/4/article-p652.pdf) and casing-yield studies returned by search. **summary**
30. Girmay Z, Gorems W, Birhanu G, Zewdie S. 2016. Growth and yield performance of *Pleurotus ostreatus* on different substrates. AMB Express 6:87. doi:10.1186/s13568-016-0265-1 **summary**; other oyster substrate trials from the same search. **summary**
31. Lin R, et al. 2022. Responses of the mushroom *Pleurotus ostreatus* under different CO2 concentration by comparative proteomic analyses. Journal of Fungi 8:652. https://pmc.ncbi.nlm.nih.gov/articles/PMC9321156/ **part**
32. Wikipedia. Pore space in soil. https://en.wikipedia.org/wiki/Pore_space_in_soil **full** (tertiary; classification after Brewer 1964)
33. Ekblad A, Wallander H, Godbold DL, et al. 2013. The production and turnover of extramatrical mycelium of ectomycorrhizal fungi in forest soils: role in carbon cycling. Plant and Soil 366:1. doi:10.1007/s11104-013-1630-3 **abstract / summary**
34. Wikipedia. Ectomycorrhiza. https://en.wikipedia.org/wiki/Ectomycorrhiza **part** (tertiary)
35. Wikipedia. Serpula lacrymans. https://en.wikipedia.org/wiki/Serpula_lacrymans **full** (tertiary; figures flagged there as needing citation)
36. Zervakis G, Philippoussis A, Ioannidou S, Diamantopoulou P. 2001. Mycelium growth kinetics and optimal temperature conditions for the cultivation of edible mushroom species on lignocellulosic substrates. Folia Microbiologica 46:231. PMID 11702409 **summary**
37. Donnelly DP, Boddy L. 1997 (temperature and water potential effects on a cord-forming basidiomycete); Boddy L. 1983. The effect of temperature and water potential on the growth rate of wood-rotting basidiomycetes. Transactions of the British Mycological Society 80:141. **summary / cited**
38. Brischke C, Alfredsen G. 2020. Wood-water relationships and their role for wood susceptibility to fungal decay. Applied Microbiology and Biotechnology 104:3781. https://link.springer.com/article/10.1007/s00253-020-10479-1 **part**
39. Rousk J, Brookes PC, Bååth E. 2009. Contrasting soil pH effects on fungal and bacterial growth suggest functional redundancy in carbon mineralization. Applied and Environmental Microbiology 75:1589. https://pmc.ncbi.nlm.nih.gov/articles/PMC2655475 **summary**
40. Wikipedia. Mass diffusivity. https://en.wikipedia.org/wiki/Mass_diffusivity **full** (tertiary)
41. BioNumbers ID 104089, diffusion coefficient of glucose in water, citing Stein 1990. https://bionumbers.hms.harvard.edu/bionumber.aspx?id=104089 **full**
42. Millington RJ, Quirk JP. 1961. Permeability of porous solids. Transactions of the Faraday Society 57:1200. **cited**; formula as given in the ConFluxPro R package documentation. **summary**
43. Wang B, Li J, Gao J, Cai P, Han X, Tian C. 2017. Identification and characterization of the glucose dual-affinity transport system in *Neurospora crassa*. Biotechnology for Biofuels 10:17. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5244594/ **summary**
44. Yield and maintenance coefficients: Carter and Bull (*Aspergillus nidulans* chemostat maintenance); a *Phanerochaete chrysosporium* biofilm reactor study; a *Penicillium* yield compilation; all from one search result page. Exact citations to be recovered. **summary**
45. Richardson CW. 1981. Stochastic simulation of daily precipitation, temperature, and solar radiation. Water Resources Research 17:182. doi:10.1029/WR017i001p00182 **cited** (publisher page refused the fetch)
