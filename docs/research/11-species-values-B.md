# 11-B. Measured values for five wood-decay polypores

Species: *Trametes versicolor*, *Fomes fomentarius*, *Fomitopsis pinicola*, *Laetiporus sulphureus*,
*Gloeophyllum trabeum*. All are filed under the MAT family, whose defaults are tip speed 230 um/h,
t_opt 28 C, t_min 4 C, t_max 38 C, cold drop 5 C.

Basis: `sourced` means the number was read in the opened paper or page; `inferred` means it was
derived by a stated step, or read only from a search snippet. Conversion: 1 mm/day = 41.7 um/h,
applied to radial growth. Where a paper gives colony diameter, the inoculum plug is subtracted and
the result halved. `substrate.uptake_rate` is set to tip speed / 100 in every file (tuning value,
basis `unknown`).

Colony growth on agar is a strain-level measurement. Every tip speed below comes from one study and
a handful of strains, so treat it as "this order of size", not as a species constant.

## Trametes versicolor

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 311 um/h | inferred | [1]: 14.93 mm/day at 25 C on malt extract agar. The paper does not say radius or diameter; taken as diameter and halved. If radial, 622 um/h |
| `environment.t_opt` | 25 C | sourced | [1]; [2] finds 25 to 30 C, [3] finds 25 and 32 C alike |
| `environment.t_max` | 40 C | sourced | [1]: fast at 35 C, none at 40 C |
| `fruiting.cold_drop` | 0 C | sourced | [1]: spawn run at 25 C, fruited at 24 to 25 C |
| `fruit.size_cm` | 1.7 to 10 | sourced | [1]: cultivated caps 17 to 100 mm; [10] gives up to 10 cm wild |

The isolate in [1] is tropical (Western Ghats) and did not grow at 15 C. That is not used for t_min.

## Fomes fomentarius

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 225 um/h | sourced | [4]: net colony diameter 7.0 to 8.1 cm in 7 days at 25 to 30 C, three strains; 5.0 to 5.8 mm/day radial. Plates nearly full, so a lower bound |
| `environment.t_opt` | 25 C | sourced | [4]: four of five strains; one Italian strain 32 C. [6] gives 30 C (Korea, abstract) |
| `fruit.size_cm` | 10 to 40 | sourced | [10] |

Also read, not used as a model key: hyphal diameter 2.8 um (sd 0.7, n 300) and colony area doubling
in 6 h on malt extract agar at 25 C [5].

## Fomitopsis pinicola

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 125 um/h | sourced | [7] Table 3: 66.1 mm colony diameter in 10 days at 25 C, 6 mm plug; 3.0 mm/day radial. Fastest of five strains |
| `environment.t_opt` | 25 C | sourced | [4]: most Alpine strains; [7] finds 25 and 30 C equal |
| `environment.t_max` | 40 C | sourced | [7]: growth at 35 C, none at 40 C, and no recovery afterwards |
| `fruit.size_cm` | 8 to 25 | sourced | [10]; [7] says 10 to 50 cm in its introduction |

[7] records weak growth at 5 C, so t_min is below 5 C; the family default (4 C) was left in place.
The strains in [7] are Korean and may not be *F. pinicola* in the strict European sense.

## Laetiporus sulphureus

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 325 um/h | sourced | [8]: radial growth 5.2 to 10.4 mm/day across 13 strains; midpoint used. Thesis abstract only |
| `environment.t_opt` | 28 C | sourced | [8]; [9] finds 25 C for two Thai strains |
| `environment.t_max` | 38 C | sourced | [8]; the Thai strains in [9] did not grow at 35 C |
| `fruiting.cold_drop` | 13 C | inferred | [11]: mycelium at 23 C, fruiting forced by 10 C water (or 24 h at 2 to 4 C). A short shock, not a lasting drop |
| `fruit.size_cm` | 10 to 40 | sourced | [10], one bracket |

[9] reports 11.5 to 12.2 mm/day at 25 C, but its tables suggest the rate was not worked out as
stated, and the strains are tropical "sensu lato" material, so it was not used for tip speed.

## Gloeophyllum trabeum

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 338 um/h | inferred | [13], search snippet only: 7.1 to 9.1 mm radial per day on agar |
| `environment.t_opt` | 34 C | sourced | [12] abstract, as *Lenzites trabea*: vigorous from 32 to 36 C. [13] snippet: 30 to 37.5 C |
| `environment.t_max` | 45 C | inferred | [13], snippet: survived three weeks at 45 C. Survival, not growth |
| `fruit.size_cm` | 3 to 8 | sourced | [14]: cap 10x30 to 30x80 mm |

This is the warmest-growing of the five by a clear margin, which matches its habitat (sun-heated
timber).

## Sources

1. Veena SS, Pandey M. 2012. Physiological and cultivation requirements of *Trametes versicolor*, a medicinal mushroom to diversify Indian mushroom industry. Indian Journal of Agricultural Sciences 82(8):672-675. https://epubs.icar.org.in/index.php/IJAgS/article/download/23047/11181/48969 (read in full)
2. Reyes C, Poulin A, Nystrom G, Schwarze FWMR, Ribera J. 2021. Enzyme activities of five white-rot fungi in the presence of nanocellulose. Journal of Fungi 7(3):222. https://pmc.ncbi.nlm.nih.gov/articles/PMC8003285 (text read; rates are only in figures)
3. Fabros JA and others. 2023. The effect of nutritional and physical factors on the growth of *Trametes versicolor* (L.) Lloyd and its mycochemical and cytotoxic properties. Studies in Fungi 8:18. https://maxapress.com/article/doi/10.48130/SIF-2023-0018 (read; the temperature table contradicts itself at 9 C)
4. Dresch P, D'Aguanno MN, Rosam K, Grienke U, Rollinger JM, Peintner U. 2015. Fungal strain matters: colony growth and bioactivity of the European medicinal polypores *Fomes fomentarius*, *Fomitopsis pinicola* and *Piptoporus betulinus*. AMB Express 5:4. https://pmc.ncbi.nlm.nih.gov/articles/PMC4305089 (text read; per-temperature diameters are in a figure and supplement, not read)
5. Pohl C and others. 2022. Establishment of the basidiomycete *Fomes fomentarius* for the production of composite materials. Fungal Biology and Biotechnology 9:4. https://pmc.ncbi.nlm.nih.gov/articles/PMC8876124/
6. Kim Y-I, Chai J-K. 2004. The physiological and degradational characteristics of *Fomes fomentarius*. Journal of Mushrooms 2(4):200-206. https://www.earticle.net/Article/A193262 (abstract only)
7. Chang H-Y, Oh S-H, Lee H-J. 2004. Mycelial characteristics for artificial cultivation of *Fomitopsis pinicola*. Journal of Mushroom Science and Production 2(4):207-213. https://koreascience.kr/article/JAKO200414364646483.pdf (tables and English abstract read)
8. Dzyhun LP. 2020. Biology of basidiomycete macromycetes *Laetiporus sulphureus* and *Cerioporus squamosus* in culture. PhD thesis, M.G. Kholodny Institute of Botany, Kyiv. https://uacademic.info/en/document/0420U102146 (abstract only)
9. Luangharn T, Karunarathna SC, Hyde KD, Chukeatirote E. 2014. Optimal conditions of mycelia growth of *Laetiporus sulphureus* sensu lato. Mycology 5(4):221-227. https://pmc.ncbi.nlm.nih.gov/articles/PMC4270415/
10. First Nature species pages (field guide web site): https://www.first-nature.com/fungi/trametes-versicolor.php , https://www.first-nature.com/fungi/fomes-fomentarius.php , https://www.first-nature.com/fungi/fomitopsis-pinicola.php , https://www.first-nature.com/fungi/laetiporus-sulphureus.php
11. Pleszczynska M, Wiater A, Siwulski M, Szczodrak J. 2013. Successful large-scale production of fruiting bodies of *Laetiporus sulphureus* (Bull.: Fr.) Murrill on an artificial substrate. World Journal of Microbiology and Biotechnology 29(4):753-758. https://pmc.ncbi.nlm.nih.gov/articles/PMC3599174
12. Mizumoto S. 1954. Studies on *Lenzites abietina* Fr. and some of its allied species. Journal of the Japanese Forestry Society 36(2):48-52. https://www.jstage.jst.go.jp/article/jjfs1953/36/2/36_2_48/_article/-char/en (abstract only)
13. Paper on the three *Gloeophyllum* species found in buildings, Zeitschrift fuer Mykologie 68:141-152, 2002. https://www.zobodat.at/pdf/Z-Mykologie_68_2002_0141-0152.pdf (NOT opened: the server refused the request. Numbers are from a search snippet of its summary; authors unchecked. Worth opening by hand to turn two `inferred` values into `sourced`)
14. Lindsey JK. *Gloeophyllum trabeum*. Ecology of Commanster. https://commanster.eu/Commanster/Fungi/Basidio/SpBasidio/Gloeophyllum.trabeum.html
15. Phillips N, Gandia A, Adamatzky A. 2023. Electrical response of fungi to changing moisture content. Fungal Biology and Biotechnology 10:8. https://pmc.ncbi.nlm.nih.gov/articles/PMC10069029/ (read; it is about *Pleurotus ostreatus*, not *Fomes*, so nothing was used)

## Not found

- **Electrical spiking** for any of the five. Searched for Adamatzky-group work on *Fomes fomentarius*
  and on mycelium composites; the composite recordings [15] turned out to be oyster mushroom. No
  electrical values were written.
- **Hyphal growth unit, branch angle** for any of the five. [5] gives only hyphal diameter for *Fomes*.
- **Translocation speed** for any of the five.
- **t_min** for any of the five. Lowest tested temperatures: 15 C (no growth, tropical *Trametes* [1]),
  10 C (*Fomes*, [4], result in a figure), 5 C (weak growth, *F. pinicola* [7]).
- **t_max** for *Fomes fomentarius*: [4] tested 37 C but the result is only in a figure.
- **Cold drop** for *Fomes*, *F. pinicola* and *Gloeophyllum*. Perennial brackets are not cultivated
  for fruit bodies, and no fruiting study was found.
- **Cords**: none of the five forms cords; the MAT default for `network.cord_max` is already 0.
- A clean radial growth rate for temperate *Trametes versicolor*. The Cardiff (Boddy, Hiscox) papers
  that report extension rates could not be opened. [13] and the full text of Girometta et al. 2025
  (Forests 17:19, *Fomes* at 15, 24 and 30 C) also refused automated access.
