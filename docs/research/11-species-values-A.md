# 11-A. Measured values for five cultivated species

Species: *Ganoderma lingzhi*, *Hericium erinaceus*, *Volvariella volvacea*, *Psilocybe cubensis*,
*Auricularia auricula-judae*. Numbers in brackets refer to the source list below.

How to read the basis column. `sourced` means the number was read in the publication itself in
this session (the page or its abstract). `inferred` means it was derived by a stated step, comes
from a relative, or was read only in a search snippet. Each species file carries the full note.
Where a tip speed was set, `substrate.uptake_rate` was set to tip speed / 100 (a tuning value,
basis `unknown`), as the brief asked.

## Ganoderma lingzhi (family MAT)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 325 um/h | inferred | 7.8 mm/day at the 30 to 34 C optimum, North American "G. lucidum" [2]; abstract seen only as a search snippet. Korean strains give a plate-limited lower bound of about 4 mm/day [1] |
| `environment.t_opt` | 30 C | sourced | [1] ten Korean strains on PDA; range 25 to 30 C |
| `fruit.size_cm` | 3 to 15.5 cm | sourced | [3] pileus 3.0-14.5 x 6.0-15.5 cm, cultivated Chinese Ling-zhi |
| `electrical.spike_interval` | 25 min | inferred | [4] *G. resinaceum* fruit bodies: trains with 731 s and 2300 s mean intervals |
| `electrical.spike_duration` | 6.5 min | inferred | [4] *G. resinaceum*: most common width 5 to 8 min |
| `electrical.spike_amplitude` | 0.25 mV | inferred | [4] *G. resinaceum*: most common 0.1 to 0.4 mV |

The temperature limits vary by strain in [1] (two strains did not grow at 15 C, three did not grow
at 35 C, others grew well at 35 C), so `t_min` and `t_max` were left at the family default.

## Hericium erinaceus (family MAT)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 205 um/h | sourced | [6] strain 20190111, 4.92 mm/day; plate tests at 25 C |
| `environment.t_opt` | 25 C | sourced | [5] four strains on PDA, 15 to 35 C |
| `environment.t_max` | 35 C | inferred | [5] growth lowest and sometimes absent at 35 C |
| `fruiting.cold_drop` | 8.5 C | inferred | [6] bags colonised at 25 C, fruited at 15 to 18 C |
| `fruit.size_cm` | 8 to 24 cm | sourced | [7] |

## Volvariella volvacea (family DIF)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 503 um/h | inferred | [8] colony radius 0.0503 cm/h on PDA, strain V971; measured at about 30 C, not the optimum, and not corrected |
| `environment.t_opt` | 35 C | sourced | [9]; [10] gives 37 C |
| `environment.t_min` | 15 C | inferred | [9] poor below 20 C; [11] damage below 15 C. [10] gives 25 C |
| `environment.t_max` | 40 C | sourced | [10]; [9] agrees |
| `fruiting.cold_drop` | 0 C | inferred | [11] growth and fruiting share the 28 to 35 C range; chilling does damage |
| `fruit.size_cm` | 5 to 12 cm | sourced | [12] cap width |

## Psilocybe cubensis (family DIF)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 90 um/h | inferred | [14] genotype B+ filled an 85 mm plate between day 15 and day 20 at room temperature: 1.9 to 2.6 mm/day |
| `environment.t_opt` | 30 C | sourced | [13] dry weight after 15 days in still liquid culture |
| `environment.t_min` | 18 C | inferred | [13] no growth at 15 or 18 C in 15 days; scanned text, digits garbled |
| `environment.t_max` | 40 C | inferred | [13] no growth at 40 C, growth at 35 C; scanned text |
| `fruit.size_cm` | 1.6 to 8 cm | inferred | Wikipedia, citing Singer & Smith 1958 [15]; original not opened |

The tip speed is weak: it is bracketed from two time points, at an unstated room temperature, for
the fastest of three genotypes. The true rate at 30 C is probably higher.

## Auricularia auricula-judae (family MAT)

| Key | Value | Basis | Source |
|---|---|---|---|
| `hyphae.tip_speed` | 170 um/h | inferred | [16] 62.2 mm colony in 7 days at 30 C on PDA; table values from a search snippet |
| `environment.t_opt` | 30 C | inferred | [16] abstract says 25 C, [17] says 25 to 30 C, [18] has *A. heimuer* faster at 35 C than 25 C |
| `environment.t_min` | 10 C | inferred | [16] no growth at 10 C in 7 days (snippet) |
| `environment.t_max` | 45 C | inferred | [18] *A. heimuer*: strongly inhibited at 45 C |

`fruit.size_cm` was left as it was (3 to 10 cm, unchecked): only uncited figures were found.

## Sources

Opened and read in this session unless marked otherwise.

1. Jayasinghe C, Imtiaj A, Hur H, Lee GW, Lee TS, Lee UY (2008). Favorable culture conditions for
   mycelial growth of Korean wild strains in *Ganoderma lucidum*. Mycobiology 36(1):28-33.
   https://pmc.ncbi.nlm.nih.gov/articles/PMC3755248/ (text read; the per-temperature table is an image)
2. Adaskaveg JE, Gilbertson RL (1986). Cultural studies and genetics of sexuality of *Ganoderma
   lucidum* and *G. tsugae* in relation to the taxonomy of the *G. lucidum* complex. Mycologia
   78(5):694-705. https://doi.org/10.1080/00275514.1986.12025312 (NOT opened: the publisher refused
   the fetch; numbers are from a search snippet of the abstract)
3. Wang X-C, Xi R-J, Li Y, Wang D-M, Yao Y-J (2012). The species identity of the widely cultivated
   *Ganoderma*, 'G. lucidum' (Ling-zhi), in China. PLoS ONE 7(7):e40857.
   https://pmc.ncbi.nlm.nih.gov/articles/PMC3401198/
4. Adamatzky A, Gandia A (2021). On electrical spiking of *Ganoderma resinaceum*. bioRxiv
   2021.06.18.449000. https://www.biorxiv.org/content/10.1101/2021.06.18.449000.full
5. Imtiaj A, Jayasinghe C, Lee GW, Shim MJ, Rho HS, Lee HS, Hur H, Lee MW, Lee UY, Lee TS (2008).
   Vegetative growth of four strains of *Hericium erinaceus* collected from different habitats.
   Mycobiology 36(2):88-92. https://pmc.ncbi.nlm.nih.gov/articles/PMC3755240/ (text read; the
   per-temperature figure is an image)
6. Lu Z, Liu L, Ren Z, et al. (2024). Optimization of substrate formulation for *Hericium erinaceus*
   by replacing wood by straw and their effect on enzyme activities. Frontiers in Plant Science
   15:1436385. https://www.frontiersin.org/articles/10.3389/fpls.2024.1436385/full
7. Kuo M (2022). *Hericium erinaceus*. MushroomExpert.Com.
   https://www.mushroomexpert.com/hericium_erinaceus.html
8. Chen X, Zhang Z, Liu X, Cui B, Miao W, Cheng W, Zhao F (2019). Characteristics analysis reveals
   the progress of *Volvariella volvacea* mycelium subculture degeneration. Frontiers in
   Microbiology 10:2045. https://pmc.ncbi.nlm.nih.gov/articles/PMC6733957/
9. Kiran Kumar N, Krishnamoorthy AS, Kamalakannan A, Amirtham D (2016). Influence of temperature and
   pH on mycelial growth and chlamydospore production of paddy straw mushroom *Volvariella
   volvaceae*. The Journal of Research ANGRAU 44(1&2):1-7.
   https://epubs.icar.org.in/index.php/TJRA/article/view/140244 (abstract)
10. Chang SC, Steinkraus KH (1982). Lignocellulolytic enzymes produced by *Volvariella volvacea*,
    the edible straw mushroom. Applied and Environmental Microbiology 43(2):440-446.
    https://pmc.ncbi.nlm.nih.gov/articles/PMC241845/ (abstract)
11. Bao D, Gong M, Zheng H, et al. (2013). Sequencing and comparative analysis of the straw
    mushroom (*Volvariella volvacea*) genome. PLoS ONE 8(3):e58294.
    https://pmc.ncbi.nlm.nih.gov/articles/PMC3602538/
12. Kuo M (2018). *Volvariella volvacea*. MushroomExpert.Com.
    https://www.mushroomexpert.com/volvariella_volvacea.html
13. Ulloa M, Herrera T (1967). Factores que influyen en el crecimiento de los micelios de
    *Psilocybe mexicana* (Heim) y *Psilocybe cubensis* (Earle) Sing. Anales del Instituto de
    Biologia UNAM, Serie Botanica 38(1):165-192.
    https://anales.ib.unam.mx/index.php/SerBot/article/download/1354/1506 (scan; text layer read)
14. Pepe M, Hesami M, Fleishmann L, Hsiang T, Jones AMP (2025). Mycelium growth and development of
    *Psilocybe* spp. mother cultures on agar-based media. Journal of Fungi 11(6):450.
    https://pmc.ncbi.nlm.nih.gov/articles/PMC12194638/
15. Wikipedia, *Psilocybe cubensis*. https://en.wikipedia.org/wiki/Psilocybe_cubensis (cites Singer
    R, Smith AH 1958, Mycologia 50; that paper was not opened)
16. Yu Y-J, Choi K-H, Jeong J-S, Lee G-K, Choi S-R (2013). Study on characteristic of mycelial
    culture in ear mushroom. Journal of Mushroom 11(1):15-20.
    https://koreascience.kr/article/JAKO201307954512226.page (abstract and methods read; the
    temperature table could not be extracted, so its numbers are from a search snippet)
17. Jo W-S, Kim D-G, Seok S-J, Jung H-Y, Park S-C (2014). The culture conditions for the mycelial
    growth of *Auricularia auricula-judae*. Journal of Mushroom 12(2):88-95.
    https://koreascience.kr/article/JAKO201424750260007.page (abstract)
18. Nie C, Wei S, Wu S, Qi L, Feng J, Wang X (2025). Transcriptomic, and metabolic profiling reveals
    adaptive mechanisms of *Auricularia heimuer* to temperature stress. PeerJ 13:e19713.
    https://pmc.ncbi.nlm.nih.gov/articles/PMC12288747/
19. Phillips N, Gandia A, Adamatzky A (2023). Electrical response of fungi to changing moisture
    content. Fungal Biology and Biotechnology 10:8. https://pmc.ncbi.nlm.nih.gov/articles/PMC10069029/
    (checked for *Hericium* spiking; it has none)
20. Zervakis G, Philippoussis A, Ioannidou S, Diamantopoulou P (2001). Mycelium growth kinetics and
    optimal temperature conditions for the cultivation of edible mushroom species on lignocellulosic
    substrates. Folia Microbiologica 46(3):231-234. https://doi.org/10.1007/BF02818539 (only a
    truncated abstract was reachable; no number taken from it)

## Not found

- **Electrical spiking** for *H. erinaceus*, *V. volvacea*, *P. cubensis* and *A. auricula-judae*.
  [19] uses *Hericium* blocks but reports their drying only; all its spike numbers are for
  *Pleurotus ostreatus*. Nothing for *G. lingzhi* itself, only for *G. resinaceum* [4].
- **Hyphal growth unit, branch angle, translocation speed**: nothing for any of the five.
- **Cords** (`network.cord_max`): no cord or rhizomorph diameters. [14] mentions rhizomorphic
  mycelium in one *P. cubensis* genotype, without measurements.
- **Ganoderma**: the per-temperature table in [1] (image only); the upper temperature limit (search
  snippets disagree, 37 C or 42 C, for [2]); a fruiting temperature drop (one snippet mentions a 5 C
  cold shock for boreal strains; not opened).
- **Hericium**: per-temperature colony sizes in [5] (figure only); a lower temperature limit.
- **Volvariella**: a growth rate at the 35 C optimum; the rates in [20].
- **Psilocybe cubensis**: any radial growth rate at a stated temperature; a peer-reviewed fruiting
  temperature; the Singer & Smith or Guzman size description in the original.
- **Auricularia**: the temperature table in [16] in readable form; a cited fruit body size
  (Wikipedia gives "up to 9 cm" with no reference); fruiting temperatures. The rates in [20].
