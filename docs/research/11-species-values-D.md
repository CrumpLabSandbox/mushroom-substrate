# 11-D. Measured values for five ectomycorrhizal species

Group D: *Laccaria bicolor*, *Paxillus involutus*, *Suillus luteus*, *Pisolithus arhizus*
(syn. *P. tinctorius*), *Cenococcum geophilum*. Every number below was read in the page, abstract,
table or figure of the source named, opened in this session. "Sourced" means the number itself is
printed there; "inferred" means it was worked out from what is printed, by the step given.

One caution covers all five. The growth rates are colony edges advancing over agar with no host tree.
In soil, fed by a tree, the same fungus can extend faster (cords and rhizomorphs especially), and no
soil rate was found for any of these species. 1 mm/day = 41.7 um/h.

## Laccaria bicolor

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 113 um/h | sourced | [1]: 2.7 mm/day on potato dextrose agar (1.3 mm/day on wort agar). Temperature and strain not in the abstract |
| `substrate.uptake_rate` | 1.13 units/h | unknown | tuning value, tip speed / 100 |
| `fruit.size_cm` | 1 to 7 cm | sourced | [2], cap width |

Cross-check for the tip speed: strain S238N at 10 C grew 1.1 mm/day in radius (46 um/h), from colony
diameters of 1.7 cm at day 5 and 2.8 cm at day 10 [3]. That is about 40% of the rate in [1], which is
reasonable for a culture well below its optimum.

## Paxillus involutus

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 109 um/h | sourced | [4]: 5.23 mm/day of colony diameter on MMN agar at 20 C, isolate 87017, halved to 2.62 mm/day of radius |
| `substrate.uptake_rate` | 1.09 units/h | unknown | tuning value, tip speed / 100 |
| `substrate.transport_speed` | 7,500 um/h | sourced | [5]: at least 7.5 mm/h for phosphate through intact mycelium. A lower bound, and given for *P. involutus* and *Suillus variegatus* together |
| `fruit.size_cm` | 4 to 15 cm | sourced | [6], cap width |

The same paper [4] measured *Suillus bovinus* at 2.30 and *Rhizopogon subcaerulescens* at 1.30 mm/day
of diameter, and notes that other studies found *P. involutus* the slower of the two, so isolates differ.
In soil microcosms *P. involutus* mycelium spread faster than that of *S. bovinus* and older parts
persisted as cords between root tips [7]; the abstract gives no rate.

## Suillus luteus

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 25 um/h | sourced | [8]: 0.59 mm/day on MMN agar at 23 C, mean of three Chilean strains and three pH levels (single treatments 0.32 to 0.87) |
| `substrate.uptake_rate` | 0.25 units/h | unknown | tuning value, tip speed / 100 |
| `environment.t_opt` | 24 C | inferred | [9]: best of 24, 28 and 32 C; nothing cooler was tested, so the optimum may be lower |
| `environment.t_max` | 33 C | inferred | [9]: biomass 28.5 mg at 24 C, 17.3 mg at 28 C, 1.9 mg at 32 C, so growth has nearly stopped at 32 C |
| `fruit.size_cm` | 4 to 10 cm | sourced | [10], cap width |

## Pisolithus arhizus

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 43 um/h | inferred | [11]: two 5 mm plugs 3 cm apart on MMN agar at 25 C met after about 12 days, so each edge covered about 12.5 mm, 1.0 mm/day |
| `substrate.uptake_rate` | 0.43 units/h | unknown | tuning value, tip speed / 100 |
| `environment.t_opt` | 28 C | sourced | [12]: pure-culture growth greatest at 28 C. Single isolates ranged from 21 to 32 C [13] |
| `environment.t_max` | 38 C | inferred | above 34 C, since mycorrhizas formed best at 34 C [12]; 38 C is the hottest treatment in [13], whose abstract does not say whether growth stopped there. May be too low |
| `fruit.size_cm` | 4 to 10 cm | sourced | [14], width of the fruit body (5 to 16 cm high) |

A second study found the most dry weight at 28 C in a 15 to 30 C series in liquid MMN [15], which
agrees with [12].

## Cenococcum geophilum

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 20 um/h | inferred | [16], Figure 1: colonies about 31 to 43 mm across after 30 days at 25 C on MMN agar from 7 mm plugs, measured by eye against the 9 cm dish; about 0.48 mm/day |
| `substrate.uptake_rate` | 0.2 units/h | unknown | tuning value, tip speed / 100 |
| `environment.t_opt` | 21 C | inferred | [13]: optimum between 16 and 27 C depending on the isolate; the middle treatment is used |
| `environment.t_max` | 32 C | inferred | [13]: highest temperature with growth was 27 C, the next treatment was 32 C. Isolates differ a lot: at 30 C three made about 6% of their 25 C colony area and three others 108 to 146% [16] |

Fruit size is left as it was: there is no fruit body, and no measured size for the sclerotia was found.

## Sources

1. Belousov D. et al. 2026. Biotechnological parameters of cultivation of mycorrhizal fungi *Cortinarius caperatus* and *Laccaria bicolor*. Journal of Biotechnology (June 2026). Abstract read. https://pubmed.ncbi.nlm.nih.gov/41763614/
2. Kuo M. 2010. *Laccaria bicolor*. MushroomExpert.Com. https://www.mushroomexpert.com/laccaria_bicolor.html
3. Deveau A. et al. 2016. Role of secondary metabolites in the interaction between *Pseudomonas fluorescens* and soil microorganisms under iron-limited conditions. FEMS Microbiology Ecology 92(8):fiw107. Table 2 and methods read. https://pmc.ncbi.nlm.nih.gov/articles/PMC5975829/
4. Kim C.-G., Power S.A., Bell J.N.B. 2004. Effects of cadmium on radial growth and dry mass production of ectomycorrhizal fungi. Korean Journal of Ecology 27(5):301-306. Full text read (Table 1). https://accesson.kr/jecoenv/v.27/5/301/5207
5. Timonen S., Finlay R.D., Olsson S., Söderström B. 1996. Dynamics of phosphorus translocation in intact ectomycorrhizal systems: non-destructive monitoring using a beta-scanner. FEMS Microbiology Ecology 19(3):171-180. Abstract read. https://lup.lub.lu.se/record/2226278
6. Kuo M. 2008. *Paxillus involutus*. MushroomExpert.Com. https://www.mushroomexpert.com/paxillus_involutus.html
7. Donnelly D.P., Boddy L., Leake J.R. 2004. Development, persistence and regeneration of foraging ectomycorrhizal mycelial systems in soil microcosms. Mycorrhiza 14. Abstract read. https://link.springer.com/article/10.1007/s00572-003-0275-0
8. González M., Quiroz I., Travieso R., Chung P., García E. 2015. Determinación de medios de cultivo y pH para la masificación in vitro de cepas de *Suillus luteus* ... y *Scleroderma citrinum* ... de la región del Biobío, Chile. Revista Árvore 39(1):105-113. Full text read (Tables 2 and 3). https://www.scielo.br/j/rarv/a/jBnZbx5DZc5dspJTXpLvXRP/?lang=es
9. García-Rodríguez J.-L. et al. 2017. In vitro growth of ectomycorrhizal fungi associated with *Pinus radiata* plantations in Chile. Revista Fitotecnia Mexicana 40(4):415-423. Text read; radial rates are only in figures. https://www.redalyc.org/journal/610/61054247006/html
10. Kuo M. 2022. *Suillus luteus*. MushroomExpert.Com. https://www.mushroomexpert.com/suillus_luteus.html
11. Baptista P. et al. 2021. In vitro interactions between the ectomycorrhizal *Pisolithus tinctorius* and the saprotroph *Hypholoma fasciculare* fungi: morphological aspects and volatile production. Mycology 12(3):216-229. Methods and results read. https://www.tandfonline.com/doi/full/10.1080/21501203.2021.1876778
12. Marx D.H., Bryan W.C., Davey C.B. 1970. Influence of temperature on aseptic synthesis of ectomycorrhizae by *Thelephora terrestris* and *Pisolithus tinctorius* on loblolly pine. Forest Science 16(4):424-431. Abstract read. https://link.springer.com/article/10.1093/forestscience/16.4.424
13. Cline M.L., France R.C., Reid C.P.P. 1987. Intraspecific and interspecific growth variation of ectomycorrhizal fungi at different temperatures. Canadian Journal of Botany 65(5):869-875. Abstract read. https://cdnsciencepub.com/doi/10.1139/b87-119
14. Kuo M. 2018. *Pisolithus arhizus*. MushroomExpert.Com. https://www.mushroomexpert.com/pisolithus_arhizus.html
15. Zayed M.S. et al. 2025. Evaluating the effectiveness of *Pisolithus tinctorius* in enhancing the Eucalyptus' resistance to salt stress. AMB Express 15:4. Methods read. https://link.springer.com/article/10.1186/s13568-024-01799-w
16. Yan T. et al. 2022. Effects of high temperature-triggered transcriptomics on the physiological adaptability of *Cenococcum geophilum*, an ectomycorrhizal fungus. Microorganisms 10(10):2039. Text and Figure 1 read. https://pmc.ncbi.nlm.nih.gov/articles/PMC9607556/

## Not found

- **Electrical spiking** (interval, duration, amplitude): no recording for any of the five. The field
  study of *Laccaria bicolor* fruit bodies after rain (Fukasawa et al. 2023, Fungal Ecology 63:101229)
  was seen only in press coverage, and it reports slow potential changes, not a spike rate.
- **Growth unit and branch angle**: no morphometric study for any of the five.
- **Cold drop for fruiting**: nothing. None of the four mushroom-formers is fruited in routine culture;
  one report had *L. bicolor* primordia on pine seedlings that never matured (search result only).
- **Cardinal temperatures** for *L. bicolor* and *P. involutus*; `t_min` for all five. Laiho 1970
  (Acta Forestalia Fennica 106) has a temperature section for *P. involutus* but only its abstract
  could be read, which says only that strains differ. Hacskaylo, Palmer & Vozzo 1965 (Mycologia
  57:748-756) measured six species from 1.7 to 35 C; the page shows no abstract.
- **Extension rate in soil or microcosms** (Read, Finlay, Leake, Donnelly and co-workers): the abstracts
  opened give no rate in mm/day; the full texts are paywalled.
- **Transport speed** for the other four species; **cord or rhizomorph diameters** for any (so
  `network.cord_max` is untouched; *Cenococcum* already inherits 0 from its family).
- **Sclerotium size** for *Cenococcum geophilum*.
- Radial growth rates in Cline et al. 1987 and Samson & Fortin 1986 (Can. J. Bot. 64:3020) are in the
  paywalled full texts.
