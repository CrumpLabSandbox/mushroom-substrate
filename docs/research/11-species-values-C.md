# Species values, group C

Measured values for five species, written into `species/<slug>.json`. Each value is tagged
`sourced` (the number is in a publication opened for this write-up), `inferred` (derived from one
by a stated step) or `unknown`. Numbers in square brackets refer to the source list. Keys not
listed keep the family default.

## Hypholoma fasciculare (CORD-S)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 58 um/h | sourced | [1], read from the bar chart in Fig. 3: about 0.14 cm/day at 16 C, ungrazed, over compressed woodland soil from beech blocks. About 0.13 cm/day at 20 C. Not corrected to the optimum |
| `substrate.uptake_rate` | 0.58 units/h | unknown | tuning value, tip speed / 100 |
| `fruit.size_cm` | 2 to 5 cm | sourced | [2], cap width |

The family default was 83 um/h. The measured rate is for a mycelium competing with two other
fungi in the same dish, so it may be lower than for the fungus growing alone.

## Coniophora puteana (CORD-S)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.branch_angle` | 80 deg | sourced | [3], midpoint of the mean branching angles, 1.22 to 1.56 rad (70 to 89 deg), strain MUCL 11662 (BAM 15) |
| `environment.t_opt` | 24 C | sourced | [3], which reports Schmidt et al. 2002: 22.5 C for 7 of 15 isolates, 25 C for 8. The 2002 paper itself could not be opened |

In [3] the fungus grew best at 20 C and 75% relative humidity and poorly at 30 C, but that was
over a bare plastic surface where drying limits growth. [3] lists published optima from 20 to
32 C.

## Phanerochaete chrysosporium (DIF)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 590 um/h | inferred | [4]: strain ATCC 34541 covered a 9 cm plate in 3 days from a 0.5 cm plug at 37 and at 42 C. (45 - 2.5) mm / 3 days = 14.2 mm/day. A lower bound |
| `substrate.uptake_rate` | 5.9 units/h | unknown | tuning value, tip speed / 100 |
| `environment.t_opt` | 40 C | sourced | [6], stated as about 40 C without the underlying data; consistent with [4] and with 37 C for the growth phase in [7] |
| `environment.t_max` | 50 C | unknown | no measurement found. Above 42 C by [4]. Set because the family maximum (38 C) is below the optimum |

A second measurement, not used for the value: radial expansion of 585 um/h at 25 C on
miscanthus agar and 64 um/h on plain agar, strain BRFM 531 [5]. It is close to the rate in [4]
even though 25 C is well below the optimum, so strain and medium matter as much as temperature.

## Chondrostereum purpureum (MAT)

| Key | Value | Basis | Source |
|---|---|---|---|
| `environment.t_opt` | 25 C | sourced | [8], abstract: cultures grew at 5 to 35 C, fastest at 25 C |

The family minimum (4 C) and maximum (38 C) were left alone. They agree with growth at 5 C [8]
and with most New Zealand isolates still growing at 36 C [9].

## Stropharia rugosoannulata (CORD-S)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 100 um/h | inferred | [11] prints 0.293 and 0.181 "mm/d" for two strains on PDA at 25 C. Read here as cm/d (mean 2.37 mm/day), because the printed unit would mean months to cover a plate, and because the regressions in [12] give about 2.3 to 2.7 at 25 C (units not shown on the page opened) |
| `substrate.uptake_rate` | 1 units/h | unknown | tuning value, tip speed / 100 |
| `environment.t_opt` | 26 C | sourced | [10] |
| `environment.t_min` | 5 C | sourced | [10] |
| `environment.t_max` | 35 C | sourced | [10]; strains range from 34 to 42 C [13] |
| `fruiting.cold_drop` | 6 C | inferred | primordia form at 10 to 20 C [10]; 26 - 20 = 6 |
| `fruit.size_cm` | 4 to 13 cm | sourced | [14], cap width; up to 25 cm in cultivation [10] |

The tip speed needs checking against a source with unambiguous units.

## Sources

1. A'Bear AD, Murray W, Webb R, Boddy L, Jones TH (2013). Contrasting effects of elevated temperature and invertebrate grazing regulate multispecies interactions between decomposer fungi. *PLoS ONE* 8(10):e77610. https://doi.org/10.1371/journal.pone.0077610 (full text and Fig. 3 opened)
2. Kuo M (2014). *Hypholoma fasciculare*. MushroomExpert.Com. https://www.mushroomexpert.com/hypholoma_fasciculare.html
3. De Ligne L, Vidal-Diez de Ulzurrun G, Baetens JM, Van den Bulcke J, Van Acker J, De Baets B (2019). Analysis of spatio-temporal fungal growth dynamics under different environmental conditions. *IMA Fungus* 10:7. https://doi.org/10.1186/s43008-019-0009-3 (full text opened)
4. Khanongnuch C, Wanphrut N, Lumyong S, Watanabe T (2004). Thermotolerant wood rotting fungi isolated from northern Thailand and their potential uses in lignin degrading applications. *Fungal Diversity* 15:187-196. https://fungaldiversity.org/fdp/sfdp/15-9.pdf (full text opened; the year is taken from the volume number and was not printed in the text extracted)
5. Khalil H, Legin E, Kurek B, Perre P, Taidi B (2021). Morphological growth pattern of *Phanerochaete chrysosporium* cultivated on different *Miscanthus x giganteus* biomass fractions. *BMC Microbiology* 21:318. https://doi.org/10.1186/s12866-021-02350-8 (full text opened)
6. Volk TJ (1997, revised 2004). *Phanerochaete chrysosporium*, Tom Volk's Fungus of the Month for May 1997. https://botit.botany.wisc.edu/toms_fungi/may97.html
7. Asther M, Capdevila C, Corrieu G (1988). Control of lignin peroxidase production by *Phanerochaete chrysosporium* INA-12 by temperature shifting. *Applied and Environmental Microbiology* 54:3194-3196. https://pmc.ncbi.nlm.nih.gov/articles/PMC204453 (abstract opened)
8. Wall RE (1986). Pathogenicity of *Chondrostereum purpureum* to yellow birch. *Plant Disease* 70:158-160. https://europepmc.org/article/AGR/ADL86017524 (abstract opened)
9. Spiers AG, Brewster DT, Slade A, Gardiner SE (2000). Characterization of New Zealand isolates of *Chondrostereum purpureum* with regard to morphology, growth, pathogenicity and RAPD banding patterns. *Mycological Research* 104:395-402. https://doi.org/10.1017/s0953756299001732 (abstract opened)
10. Huang L, Si C, He C-M, Liu X-C, Duan J (2025). The rise of *Stropharia rugosoannulata* industry in China: current state and prospects. *Applied Microbiology and Biotechnology* 109:188. https://doi.org/10.1007/s00253-025-13576-1 (full text opened; a review)
11. Hao H, Zhang J, Wu S, Bai J, Zhuo X, Zhang J, Kuai B, Chen H (2022). Transcriptomic analysis of *Stropharia rugosoannulata* reveals carbohydrate metabolism and cold resistance mechanisms under low-temperature stress. *AMB Express* 12:56. https://doi.org/10.1186/s13568-022-01400-2 (full text opened)
12. Chen X-T, Zhang L-J, Sun P, Hu W-J, Wang R-J, Zhang M-Y, Wei Y-H, Wang H-X, Hu J, Xiong Z-Y (2021). Genetic diversity and cultivation characteristics of the main cultivars of *Stropharia rugosoannulata* in China. *Mycosystema* 40(12):3081-3095. https://manu40.magtech.com.cn/Jwxb/article/2021/1672-6472/1672-6472-40-12-3081/T4.html (Table 4 only)
13. Ren J, Wang Q, Zuo J, Jiang S (2021). Study of thermotolerant mechanism of *Stropharia rugosoannulata* under high temperature stress based on the transcriptome sequencing. *Mycoscience* 62:95-105. https://doi.org/10.47371/mycosci.2020.11.006 (full text opened)
14. Kuo M (2017). *Stropharia rugosoannulata*. MushroomExpert.Com. https://www.mushroomexpert.com/stropharia_rugosoannulata.html

## Not found

- **Electrical spiking**: nothing for any of the five species (Europe PMC abstract search on each
  name with "electrical activity", "action potential", "electrical potential", "spiking").
- **Hyphal growth unit**: nothing for any of the five. [3] counts tips and area for *C. puteana*
  but gives no total hyphal length. [5] gives no growth unit for *P. chrysosporium*.
- **Branch angle**: only *C. puteana* [3].
- **Translocation speed**: none as a speed. For *H. fasciculare*, Wells & Boddy 1995 (*New
  Phytologist* 129:289-297, abstract only) give phosphorus transfer in nmol per day (up to 18.46
  across three species), and Lindahl et al. 2001 (*New Phytologist* 150:189-194, abstract only)
  show transport in both directions at once; neither abstract gives a distance per time.
- **Cord diameters**: none found. `network.cord_max` not changed for any species.
- ***H. fasciculare* cardinal temperatures**: Dowson, Boddy & Rayner 1989 (*Mycological
  Research*, doi 10.1016/S0953-7562(89)80181-9) is reported to show extension rising from 5 to 20 or 27 C, but the paper
  and its abstract could not be opened (publisher and Cardiff repository pages refused).
  Fruiting trigger: not found.
- ***C. puteana* growth rate and temperature limits**: the papers that hold them could not be
  opened: Schmidt et al. 2002 (*Z. Mykologie* 68:141-152, refused), McPhee 1978 (Glasgow PhD
  thesis, abstract says radial rates vary a lot between strains, numbers only in a scanned PDF).
  Fruit body size: a web search summary gave 4 to 20 cm and 5 to 100 cm from two sites, neither
  of which could be opened, so the existing value was left.
- ***P. chrysosporium* minimum and maximum temperature**: Burdsall & Eslyn 1974 (*Mycotaxon*
  1:123-133) is on the Biodiversity Heritage Library but its pages refused automated reading.
  Lamar, Larsen & Kirk 1990 (*Appl Environ Microbiol* 56:3519-3526) measured extension rates of
  this species at several temperatures; only the abstract is machine-readable and it gives no
  number for this species. Fruit body size: not found (a thin crust; [6]).
- ***C. purpureum* growth rate**: Spiers et al. 2000 [9] say growth on malt agar is rapid but
  the abstract has no number; Vartiamäki et al. 2008 (*Biological Control* 47:46-54) measured
  growth of 21 isolates, abstract without numbers. The web search tool refused queries on this
  species, so only Europe PMC was searched. Fruit body size: Wikipedia gives brackets up to
  about 3 cm, without a lower figure; the existing 2 to 5 cm was left.
- ***S. rugosoannulata* growth rate with clear units**: see the note above; Bonenfant-Magné et
  al. 1997 (fastest growth at 25 C for every strain, some growth above 35 C) is behind a
  publisher log-in.
