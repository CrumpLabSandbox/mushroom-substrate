# Species values, group E

Measured values for five species, found by web search in November 2026. "Sourced" means the number was read on
the page or abstract cited. "Inferred" means it was derived from a cited measurement by the step given in the
species file's note, or was read only from a search snippet. Nothing here was run through the engines.

## Morchella importuna (black morel)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 540 um/h | sourced | [1]: nearly 13 mm/day at 24 C on CYM agar; [2] agrees (0.45 to 0.55 mm/h at 23 C) |
| `environment.t_opt` | 24 C | inferred | [3] fastest at 20 and 25 C, inhibited at 30 C; [1] still rising at 28 C |
| `environment.t_min` | 0 C | inferred | [3] grows thinly at 5 C; [4] field spawn run at 2 to 20 C |
| `fruiting.cold_drop` | 10 C | inferred | [4]: cultivation practice, day-night swing of more than 10 C |
| `fruit.size_cm` | 2 to 9 cm | sourced | [5]: cap width (cap 3 to 15 cm tall) |
| `substrate.uptake_rate` | 5.4 units/h | unknown | tuning value, tip speed / 100 |

The earlier tip speed of 860 um/h was a genus figure and has been replaced. The two temperature studies disagree
about what happens above 25 C, so `t_max` was left at the family value.

## Coprinus comatus (shaggy mane)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 134 um/h | inferred | [6]: 63 mm after 9 days at 26 C, read as a colony diameter |
| `environment.t_opt` | 26 C | sourced | [6]: best range 23 to 26 C, poor above 29 C and below 20 C |
| `fruiting.cold_drop` | 3 C | inferred | [7]: a spawn supplier's growing sheet |
| `fruit.size_cm` | 3 to 15 cm | sourced | [8]: cap |
| `substrate.uptake_rate` | 1.34 units/h | unknown | tuning value, tip speed / 100 |

The tip speed is the weakest number here: the paper does not say whether 63 mm is a diameter, and its
per-temperature table is an image that could not be read. Read as a radius it would give about 290 um/h.

## Tuber melanosporum (Perigord black truffle)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 8.9 um/h | inferred | [9]: 1.1 to 1.9 mm/week (search snippet of the full text; the abstract gives 1.1 to 14 mm/week for six species) |
| `environment.t_opt` | 22.5 C | inferred | [10]: best at 20 and 25 C, worst at 33 C |
| `environment.t_min`, `t_max` | 5 C, 34 C | inferred | [11]: range quoted for four Tuber species together |
| `fruit.size_cm` | 3 to 10 cm | sourced | [12]: usually 3 to 5 cm, up to 10 cm |
| `substrate.uptake_rate` | 0.089 units/h | unknown | tuning value, tip speed / 100 |

## Amanita muscaria (fly agaric)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 18 um/h | inferred | [13]: 0.43 mm/day on MMN agar at 20 C (search snippet of the full text; the abstract has no numbers) |
| `fruit.size_cm` | 5 to 25 cm | sourced | [14]: cap, North American variety flavivolvata |
| `substrate.uptake_rate` | 0.18 units/h | unknown | tuning value, tip speed / 100 |

18 um/h is about a fifth of the family default (85 um/h). It was measured at 20 C and the optimum is not known.

## Hebeloma cylindrosporum

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 60 um/h | inferred | [15]: genets spread 0.45 to 0.60 m per year in the field, averaged over the whole year |
| `fruiting.cold_drop` | 0 C | inferred | [16]: fruits at a constant 18 C; a 6 C shock did not change the number of fruit bodies |
| `fruit.size_cm` | 1.2 to 4.0 cm | sourced | [17]: cap, 42 collections |
| `substrate.uptake_rate` | 0.6 units/h | unknown | tuning value, tip speed / 100 |

## Sources

1. Elso M, Sanz-Rocha M, Escobar-Hernandez T, Guillen Y, Gerding M, Chavez D, Machuca A 2026. In vitro physiological characterization of strains from transcontinental and endemic Morchella species from south-central Chile. Journal of Fungi 12(8):572. https://pmc.ncbi.nlm.nih.gov/articles/PMC13514834/
2. Cai Y, Ma X, Zhang Q, Yu F, Zhao Q, Huang W, Song J, Liu W 2021. Physiological characteristics and comparative secretome analysis of Morchella importuna grown on glucose, rice straw, sawdust, wheat grain, and MIX substrates. Frontiers in Microbiology 12:636344. https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2021.636344/full
3. Yue Y, Hao H, Wang Q, Xiao T, Zhang Y, Chen H, Zhang J 2024. Comparative transcriptome profiles of the response of mycelia of the genus Morchella to temperature stress. Journal of Fungi 10(3):178. https://pmc.ncbi.nlm.nih.gov/articles/PMC10971721/
4. Hao H, Zhang J, Wang H, Wang Q, Chen M, Juan J, Feng Z, Chen H 2019. Comparative transcriptome analysis reveals potential fruiting body formation mechanisms in Morchella importuna. AMB Express 9:103. https://pmc.ncbi.nlm.nih.gov/articles/PMC6626090/
5. Kuo M 2012. Morchella importuna. MushroomExpert.Com. https://www.mushroomexpert.com/morchella_importuna.html
6. Jang M-J, Lee Y-H, Liu J-J, Ju Y-C 2009. Optimal conditions for the mycelial growth of Coprinus comatus strains. Mycobiology 37(2):103-108. https://pmc.ncbi.nlm.nih.gov/articles/PMC3749398
7. Mycelia NV. M8102 Coprinus comatus (growing sheet). https://mycelia.be/?p=3732
8. Kuo M 2008. Coprinus comatus: the shaggy mane. MushroomExpert.Com. https://www.mushroomexpert.com/coprinus_comatus.html
9. Iotti M, Amicucci A, Stocchi V, Zambonelli A 2002. Morphological and molecular characterization of mycelia of some Tuber species in pure culture. New Phytologist 155:499-505. https://doi.org/10.1046/j.1469-8137.2002.00486.x (abstract only)
10. Liou C-F 2010. Study on colony growth in agar medium and mycorrhiza morphological characteristics formed on Cyclobalanopsis glauca of five Asian and European Tuber species. Doctoral thesis, National Taiwan University. https://tdr.lib.ntu.edu.tw/handle/123456789/46767 (abstract only)
11. Nakano S, Kinoshita A, Obase K, Nakamura N, Furusawa H, Noguchi K, Yamanaka T 2022. Physiological characteristics of pure cultures of a white-colored truffle Tuber japonicum. Mycoscience 63(2):53-57. https://www.jstage.jst.go.jp/article/mycosci/63/2/63_MYC564/_html/-char/ja
12. CNR-IBBR 2025. TuberID database, record 9: Tuber melanosporum. https://www.ibbr.cnr.it/tuberid/record/9
13. Schrey SD, Salo V, Raudaskoski M, Hampp R, Nehls U, Tarkka MT 2007. Interaction with mycorrhiza helper bacterium Streptomyces sp. AcH 505 modifies organisation of actin cytoskeleton in the ectomycorrhizal fungus Amanita muscaria. Current Genetics 52:77-85. https://doi.org/10.1007/s00294-007-0138-x (abstract only)
14. Kuo M 2013. Amanita muscaria var. flavivolvata. MushroomExpert.Com. https://www.mushroomexpert.com/amanita_muscaria_flavivolvata.html
15. Gryta H, Debaud JC, Marmeisse R 2000. Population dynamics of the symbiotic mushroom Hebeloma cylindrosporum: mycelial persistence and inbreeding. Heredity 84:294-302. https://doi.org/10.1046/j.1365-2540.2000.00668.x (abstract only)
16. Debaud JC, Gay G 1987. In vitro fruiting under controlled conditions of the ectomycorrhizal fungus Hebeloma cylindrosporum associated with Pinus pinaster. New Phytologist 105:429-435. https://doi.org/10.1111/j.1469-8137.1987.tb00880.x (abstract only)
17. Hebeloma Project. Hebeloma cylindrosporum: species description and distribution. https://hebeloma.org/species/cylindrosporum

## Not found

- **Electrical spiking**: nothing for any of the five species (searched Adamatzky's fruit-body and mycelium papers).
- **Growth unit, branch angle, transport speed, cord diameters**: nothing for any of the five. Iotti et al. 2002 [9]
  measured branch angle and hyphal diameter for T. melanosporum, but the numbers are in the paywalled full text.
- **Morchella importuna**: the per-temperature growth table (supplementary Table S2 of [3] and Figure 6 of [1]);
  a measured upper temperature limit.
- **Coprinus comatus**: a growth rate in mm/day; lower and upper temperature limits; a peer-reviewed fruiting
  temperature (Chaiyama et al. 2007 and a Thai Department of Agriculture report would not load).
- **Tuber melanosporum**: medium and temperature of the Iotti growth rate; colony sizes from the Liou thesis; any
  fruiting temperature trigger; spread of soil mycelium per year (one orchard study was found but could not be opened).
- **Amanita muscaria**: any growth-versus-temperature study, so no cardinal temperatures; a fruiting trigger.
  Smith, Bogar and Moeller 2023 (FEMS Microbiology Ecology 99:fiad108) grew both A. muscaria and H. cylindrosporum on
  MMN agar but report growth only as a log-area slope in a figure.
- **Hebeloma cylindrosporum**: any agar growth rate or cardinal temperature. A 2008 study comparing strains at 12
  and 22 C exists (Rasouli et al., in Persian) but only its abstract, without numbers, was reachable.
