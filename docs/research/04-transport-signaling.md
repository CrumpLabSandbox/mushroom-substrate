# 04. Transport and signaling inside mycelial networks

Research write-up for Phase 1, topic 4. Written 2026-11-09.

Every number below carries a source reference like [4]. The source list at the end says, for each
entry, whether the full text was read, only the abstract, or only a secondary description. Where a
value comes from a secondary description the text says so. Section 5 (model proposals) contains
my own derivations; these are marked as such and are not literature values.

## 1. Summary

- Long-distance transport in mycelia is mass flow, not diffusion. Measured speeds span 0.1 to about 100 µm/s; diffusion alone would take months over 10 cm [1][4][9].
- The best-quantified rhythm in a mushroom-forming fungus is pulsatile amino-acid transport in *Phanerochaete velutina* cords: period 11 to 12 h, mean velocity 23 mm/h, peak 50 mm/h [1].
- Flow is pressure-driven and well described by Hagen-Poiseuille flow on a graph with Kirchhoff node balance; the pressure gradients needed are tiny compared with turgor (about 0.4 to 0.5 MPa) [4][8].
- Flow is commonly bidirectional and reverses on timescales from seconds (AM hyphae) to 3 h (*Coprinopsis*) [6][9][10].
- Extracellular "spiking" has been recorded in many species, with intervals of 2.6 min to about 2 h and amplitudes of 0.007 to a few mV [15][16][17]. These are measurements, not demonstrated action potentials.
- The interpretation is contested. Critics attribute much of the signal to electrode and substrate artefacts; a substrate-only control produced a 0.005 Hz cycle, the same band as the reported fast spiking [23][25].
- No propagation speed for extracellular fungal spikes has been measured. The only figure, 0.5 mm/s, is a 1995 speculation [14][15].
- Calcium is the best-supported fast signal: tip pulses every 26 s and waves at 4 to 50 µm/s that die out within 1.5 mm [26][27].
- For the simulator: solve pressure on the graph for flow, advect and diffuse resources along edges, and treat the electrical layer as a tunable excitable medium that reproduces spike statistics without claiming a mechanism.

## 2. Findings

### 2.1 Nutrient uptake and translocation

**Diffusion is too slow.** The diffusion coefficient of a small fluorescent solute inside vacuoles
of *Phanerochaete velutina* was measured at (0.34 ± 0.046) × 10⁻⁵ cm² s⁻¹ at 20 °C, about 75% of
its value in water [3]. The vacuole network is a real longitudinal pathway, but once tubule
constrictions and branching are counted, the effective diffusion coefficient for a 2 mm branched
hypha drops to about 1.6 × 10⁻⁸ cm² s⁻¹ [3]. The authors calculate that diffusion through an
unbranched tubular-vacuole hypha could supply nitrogen to a tip over about 24 mm at most [3].
Whiteside et al. estimated that crossing a 3 cm gap by diffusion would take 100 to 2,600 days [9].

**Mass flow in cords: the radiolabel imaging work.** Tlalka, Fricker, Watkinson and Darrah imaged
¹⁴C-labelled aminoisobutyric acid (AIB, an amino-acid analogue the fungus takes up but does not
metabolise, so it marks the nitrogen pathway) moving through intact *P. velutina* colonies with a
photon-counting camera, at sub-millimetre resolution and a sampling interval of 10 to 60 min [1].
Results [1]:

- maximum velocity toward the colony margin 50 mm/h, average 23 mm/h;
- mass transfer 4.6 to 51.5 pmol AIB per hour per cord;
- a pulsatile component with a period of 11 to 12 h;
- transport much faster than diffusion.

A follow-up reported preferential nitrogen allocation to carbon-rich sinks, simultaneous
bidirectional transport, abrupt switching between pre-existing routes, and "locally synchronised,
oscillatory phase domains": regions of the colony that pulse together and differ in phase from
their neighbours [2]. I could read only the abstract of [2]; it gives no period or temperature
dependence. A 2003 paper by the same group is titled as describing these oscillations as
noncircadian; I did not retrieve it.

**Growth-induced mass flow.** Heaton et al. showed that growth alone drives flow: cytoplasm is
incompressible, so every volume of new hypha at the margin must be supplied from behind. They
digitised *P. velutina* networks over 36 days and computed the currents that account for the
observed volume changes at minimum viscous work [4]. Predicted speeds: with half of each cord's
cross-section conducting, 36% of edges exceeded 0.1 µm/s, 11% exceeded 0.5 µm/s and 4% exceeded
1 µm/s; with 10% conducting and fine hyphae included, 4% of cords exceeded 10 µm/s [4]. Cords
predicted to carry large or fast currents were significantly more likely to thicken later [4].
This is the empirical basis for "used links thicken" in the plan.

**Speeds reported elsewhere, as cited in [4]** (I did not read the originals): *Neurospora crassa*
cytoplasm moves with the tip at 0.2 to 0.5 µm/s, mass flow is typically 5 µm/s and up to 60 µm/s
(Lew 2005 [32]); the highest reported velocity in *P. velutina* is about 900 µm/s (Wells et al.
1995 [31]), which Heaton et al. note is difficult to measure accurately.

**Nuclei as flow tracers.** In *N. crassa*, nuclei travel at about 3 mm/h on average and up to
10 mm/h, more than three times the colony growth rate; flow in leading hyphae reaches about
5 µm/s against a tip speed of about 0.3 µm/s, and nuclei are drawn from 20 to 30 mm behind the
colony edge [5]. Adding 10 µL of 0.6 M sucrose reversed the flow within seconds for 1 to 2 min,
confirming osmotic-pressure control [5]. Hyphal diameters were about 12 µm (leading), 8 µm
(primary branches) and 6 µm (secondary) [5].

**Bidirectional transport.** In the mushroom-former *Coprinopsis cinerea*, a locally applied
nutrient analogue and a defence response both propagated long distances in a subset of hyphae, in
both directions, and the direction in an individual hypha alternated every 3 h [6]. (Abstract
only; no speed given.) In arbuscular mycorrhizal (AM) hyphae, particle tracking found 1,353
tracks moving toward the root and 1,342 away, with reversals on the order of seconds [9].

**Motor and vesicle transport.** I found no measured motor-transport speeds for mushroom-forming
fungi in the sources I could open. Guhr et al. argue that cytoplasmic streaming, vesicle motors
and vacuolar pathways are all too slow to account for the water fluxes they measured [7]. The
review by Fricker et al. [29] states that the relative contribution of streaming, vesicle
transport, growth-induced flow and evaporative flow is poorly known (search snippet only; the
full text returned an access error).

**Carbon and phosphorus.** Cairney's review concludes that rapid carbon movement toward the tip
in rhizomorphs is probably turgor-driven mass flow through empty "vessel" hyphae, while movement
back toward the base runs in living hyphae [30] (abstract snippet only). I did not find and
verify numerical velocities for ³²P or ¹⁴C-sugar in cords; classical values exist (Wells, Boddy,
Brownlee and Jennings on *Serpula lacrymans*) but I could not open them.

**Source-sink behaviour.** Allocation follows sinks: nitrogen goes preferentially to carbon-rich
new resources [2]; AM fungi move phosphorus from rich to poor patches, more strongly as
inequality increases [9].

### 2.2 Water and hydraulics

**Turgor.** Pressure-probe turgor in *N. crassa*: 530 ± 67 kPa in wild type, 400 ± 97 kPa in a
mechanosensitive-channel mutant [8]. Heaton et al. take hyphal hydrostatic pressure as 4 to 5 bar
(0.4 to 0.5 MPa) [4]. A search summary reported a range of 0.4 to 0.7 MPa across organisms and a
2024 study finding no correlation between tip turgor and growth rate; I did not open those.

**Pressure gradients needed.** For Poiseuille flow in a conducting tube of radius 6 µm with
viscosity 2 × 10⁻³ Pa s, the gradient is about 4 × 10⁻⁵ bar/cm per µm/s of velocity [4]. So
1 µm/s needs about 4 Pa/cm, while 900 µm/s would need about 0.04 bar/cm, sustainable only over a
few tens of centimetres [4]. Wall shear stress is about 10⁻³ Pa per µm/s [4].

**Cytoplasmic streaming and flow speeds in AM hyphae.** Whiteside et al.: mean 18.8 ± 11.8 µm/s
(SD), fastest above 50 µm/s, slowest 0.32 µm/s, with modes near 5, 20 and 30 µm/s [9]. Oyarte
Galvez et al., from about 100,000 trajectories: speeds of 2 to 5 µm/s in young networks, often
around 20 µm/s, with rare bursts of 50 to 120 µm/s; speed rises roughly linearly with distance
from the tip over the first 20 mm and with an edge's betweenness centrality; tipward flow is about
30% faster than rootward flow early on [10]. Their automatic tracking is reliable only up to 40
to 50 µm/s [10].

**Hydraulic redistribution.** *Agaricus bisporus* moved water from moist soil (−0.03 MPa) across
an air gap into dry soil (−9.5 MPa), raising it to −6.9 MPa in 72 h against −8.2 MPa in controls
[7]. Figures [7]: flux 67 µL cm⁻² d⁻¹; about 0.03 µL per hypha per day; about 2,300 hyphae per
cm² across the gap; velocity about 0.3 cm/min (50 µm/s) in single hyphae of 4.4 µm outer
diameter. The velocity is calculated, not imaged. The authors conclude it is passive flow down
the water-potential gradient [7]. A follow-up on *Schizophyllum commune* reported 0.43 cm/min
[33] (search summary only).

**Water exit points.** Mass flow needs somewhere for water to leave the pathway: exudation
(guttation droplets, documented in *Serpula lacrymans*), evaporation, or new growth [4]. I found
no measured guttation rates.

**Cords and rhizomorphs.** Cord diameters in the *P. velutina* study were 48 to 480 µm, with
internal vessel hyphae of about 12 µm diameter [4]. I found no directly measured hydraulic
conductivity for a cord; in practice it is computed from Poiseuille's law with an assumed
conducting fraction of 0.1 to 0.5 [4]. Water velocities in ectomycorrhizal rhizomorphs
(Duddridge et al. 1980) are often quoted, but my search budget ran out before I could verify the
figure, so it is omitted.

### 2.3 Electrical activity: what was measured

Two very different kinds of measurement share the word "spike". Intracellular recordings put a
glass microelectrode inside one hypha and measure membrane voltage. Extracellular recordings put
two metal needles into a mushroom or a colonised substrate and log the voltage difference between
them. The numbers differ by orders of magnitude and should not be mixed.

**Intracellular.**

- *Neurospora crassa* (Slayman, Long and Gradmann 1976 [13]). Spontaneous depolarisations
  recorded with microelectrodes. I could not open the paper. Secondary reviews describe a resting
  potential near −180 mV shifting to about −40 mV at the peak, events lasting 1 to 2 min, at a low
  spontaneous rate that stimulation or injected current could not raise. Treat these as
  unverified. For comparison, a later pressure-probe paper gives *N. crassa* resting potential as
  −164 ± 13 mV [8].
- *Armillaria bulbosa* and *Pleurotus ostreatus* (Olsson and Hansson 1995 [14]). Not opened. The
  Buffi et al. review reports spontaneous firing at 0.5 to 5 Hz with amplitude 5 to 50 mV and
  notes the reference electrode sat in the agar [25]. A search summary added durations of 20 to
  500 ms and increased firing on contact with wood, malt extract or acid. Adamatzky attributes to
  them a speculated propagation speed of 0.5 mm/s [15]; this is not a measurement.

**Extracellular, Adamatzky and colleagues.** All used paired sub-dermal needle electrodes 1 to
5 cm apart and a Pico ADC-24 logger saving one averaged sample per second [15][16][17].

| Species | Preparation | Interval | Amplitude | Spike duration | Source |
|---|---|---|---|---|---|
| *Pleurotus djamor*, fast mode | fruit bodies on kit | 160.5 ± 15.1 s | 0.88 ± 0.14 mV | 115.5 ± 28.1 s | [15] |
| *Pleurotus djamor*, slow mode | fruit bodies on kit | 838.8 ± 147.2 s | 1.3 ± 0.21 mV | 142.6 ± 33.1 s | [15] |
| *Pleurotus ostreatus* | mycelium on hemp | about one spike per 70 min (27 min in another recording) | median 0.48 to 0.51 mV | median 62 s | [17] |
| *Pleurotus* sp. (species inconsistent in the paper) | colonised wood shavings | not reported | 0.5 to 6 mV | mean dominant 402 s; range 84 to 1,015 s | [18] |
| *Cordyceps militaris* | colonised substrate | mean 116 min (881 spikes) | mean 0.2 mV | not given | [16] |
| *Flammulina velutipes* | fruit bodies | mean 102 min (958 spikes) | mean 0.3 mV; trains at 2.1 mV | 64 min within trains | [16] |
| *Schizophyllum commune* | on wood | mean 41 min (530 spikes) | mean 0.03 mV | not given | [16] |
| *Omphalotus nidiformis* | colonised substrate | mean 92 min (1,117 spikes) | mean 0.007 mV | not given | [16] |
| *Ganoderma resinaceum* | colonised substrate | not verified | not verified | most common width 5 to 8 min | [19] |

Further detail:

- *P. djamor* trains: fast-mode trains last 80 to 150 min and slow-mode trains 130 to 360 min,
  with 10 to 30 spikes per train and transitions from fast to slow; refractory-like period 25.5 s
  (fast) and 256 s (slow); depolarisation rate about 0.02 mV/s [15].
- *P. djamor* stimulus responses: water drop on cap 6.1 mV for 141.5 s; 5 s flame 2.1 mV for
  99 s; 40% ethanol 0.8 mV for 51 s; after a 60 s flame, a 38 mV depolarisation over 18 s, and a
  neighbouring mushroom 6 cm away responded within 4 s [15]. A 4 s response at 6 cm would imply
  15 mm/s, far faster than any proposed biological conduction; the paper does not compute a speed
  and radiant heat or shared-electrode coupling are not excluded.
- *P. ostreatus* under chloroform: spike rate fell from one per 70 min to one per 254 min and then
  to near zero; median amplitude fell from 0.51 to 0.11 mV; partial recovery after removal [17].
  This is the strongest evidence in this body of work that part of the signal is biological.
- The 2022 "language" paper [16]: abstract states spike durations from 1 to 21 h and amplitudes
  from 0.03 to 2.1 mV. Spikes closer than a threshold θ (the mean interval, or twice it) were
  grouped into "words"; mean word length was 3.3 to 4.7 spikes at θ = mean interval and 7.0 to
  8.9 at twice that, compared by the author with 4.8 letters for English [16]. Recordings ran
  about 5 days (1.5 days for *S. commune*) at 21 °C in darkness. Detection thresholds differed by
  species (for example 0.1 mV for *C. militaris*, 0.003 mV for *O. nidiformis*) [16].
- Internal inconsistencies worth knowing: the *O. nidiformis* mean of 0.007 mV lies below the
  0.03 mV minimum in the same paper's abstract [16]; the 2018 paper's text and table disagree on
  spike duration [15]; [18] names two different species.

**Signal transfer test.** *Ganoderma lucidum* blocks driven with ±5 V square waves at 100 Hz to
10 kHz passed a recoverable frequency, with output medians of 0.07 to 0.20 mV; moist medium
without mycelium passed nothing; amplitude was not reproducible; conduction velocity was not
measured [20]. This shows colonised substrate conducts, not that the fungus signals.

**Fukasawa and colleagues.**

- *Laccaria bicolor*, field, 2023 [21]. Six fruit bodies monitored for about two days. Potentials
  were low in dry weather and fluctuated after rain, "sometimes going over 100 mV"; fluctuations
  correlated with precipitation and temperature; a causality analysis suggested directional
  transfer between nearby fruit bodies. I could reach only the university press release, so
  sampling rate, lag and statistics are unverified.
- *Pholiota brunnescens*, laboratory, 2024 [22]. Colonies on water agar at 20 °C, electrodes
  1.5 cm apart, logged every 10 min for 104 days. An oscillation of about 7 days appeared only at
  the electrode under a wood bait, starting around day 60 to 63. Transfer-entropy analysis showed
  directed influence from the bait electrode in two of three baited dishes before the oscillation
  began; unbaited controls showed significant transfer in every direction with no pattern. The
  authors say the signal is not a membrane action potential and probably reflects transport and
  exudation; they also note oxalic acid secretion could change the agar's electrical properties.

**Propagation speed.** None of [15] to [22] reports a measured conduction speed.

### 2.4 Electrical activity: the criticism

- **Blatt, Pullum, Draguhn, Bowman, Robinson and Taiz (2024)** [23] argue the fungal language
  claim is "premature and unsupported by the evidence presented". Their points, as quoted in
  [24]: the fluctuations "are likely to originate as nonbiological noise and experimental
  artifacts", including mechanical drift of the electrode tip; the spikes are not clearly above
  noise; it has not been shown that they arise from electrochemical activity in the fungus; and
  even if spike groups were real, a word-length match gives no support for syntax. They compare
  the work to Backster's 1970s recordings from yogurt. They also note the paper misnames the
  Lempel-Ziv algorithm. I read the abstract and the quotations in [24], not the full article.
- **Buffi et al. (2025)** [25], a review that includes the authors' own replication attempts:
  - extracellular needle electrodes record field potentials whose origin, biological or not,
    cannot be told apart;
  - stainless-steel needles in ionic gels are prone to Donnan potentials (voltages that arise at
    the boundary of a charged gel without any living cell);
  - in *Pleurotus pulmonarius*, a cut fruiting body gave a signal resembling the substrate-only
    control, and that control showed a cyclic signal of about 0.005 Hz (200 s period);
  - recordings changed when an incubator door opened or people walked past;
  - a microelectrode-array recording showed ±50 µV oscillations that did not change with a
    calcium ionophore or cycloheximide, so were judged noise;
  - homology searches find candidate ion channels across fungal proteomes, but only yeast TOK1
    is functionally characterised and it is not an action-potential channel.
  The review puts expected fungal signals at 0.0003 to 0.1 Hz and recommends Faraday shielding,
  substrate-only and killed-fungus controls, reference electrodes outside the agar, and
  single-hypha microfluidics [25].
- **What stands.** Voltage fluctuations at these timescales are reproducibly recorded from
  colonised substrates and fruit bodies; they change with anaesthetic [17], wetting [15][21] and
  a food source [22]. **What does not.** No demonstrated ionic mechanism, no measured
  propagation, no demonstrated function, and no control that cleanly separates membrane
  activity from moisture, ion and electrode chemistry. The 200 s abiotic cycle in [25] sits
  almost on top of the 160 s fast mode in [15].

### 2.5 Calcium signalling and waves

- Tip calcium pulses in *Aspergillus nidulans*: interval 26 ± 7 s, with actin (29 ± 8 s) and
  secretory vesicles (30 ± 7 s) following by a few seconds; growth is stepwise at a mean of
  1.8 µm/min. In *N. crassa* the vesicle oscillation is 17 ± 6 s and tip speed oscillates between
  0.15 and 0.45 µm/s [27].
- Wound-induced calcium signals in *A. nidulans* colonies [26]: after a cut, signal peaked at
  about 10 s and faded by 120 s; two waves travelled at about 41 and 50 µm/s; range grew with
  colony age but never exceeded 1,500 µm. After 3 M NaCl, signal spread at 4.9 ± 1.8 µm/s. After
  laser stimulation of a tip, 4 ± 2 pulses in 2 min propagated at 4 ± 2 µm/s over 25 ± 15 µm.
  Signals crossed septa but slowed there. The authors conclude the response is local and
  decentralised, and caution it may not hold for basidiomycetes.

Both species are ascomycete moulds, not mushrooms. No equivalent measurements for a mushroom
former were found.

### 2.6 Chemical signalling and rhythms

- **Chemical signals.** The search budget ran out before I could source this subtopic. From
  general knowledge, unverified here: mushroom-forming fungi use peptide pheromones and receptors
  in mating; the volatile 1-octen-3-ol acts as a self-inhibitor of spore germination in several
  moulds; hyphal fusion in *Neurospora* involves two cells alternating signal sending and
  receiving with a period of minutes; quorum-sensing molecules such as farnesol are established
  mainly in yeasts. None of this should enter the model without a sourcing pass.
- **Circadian clock.** The *Neurospora crassa* clock has a period of about 22 h in constant
  conditions and is temperature-compensated (Q10 near 1 below 30 °C) [28] (search summary of the
  paper; not opened). A circadian clock is not established for most mushroom-forming species.
- **Non-circadian rhythms.** The 11 to 12 h AIB pulse in *P. velutina* [1], the 3 h flow reversal
  in *C. cinerea* [6] and the 7 day electrical oscillation in *P. brunnescens* [22].

### 2.7 Mycorrhizal exchange

- **Carbon to the fungus.** Globally, plants are estimated to allocate 13.12 Gt CO₂-equivalent
  per year to mycorrhizal mycelium: 9.07 to ectomycorrhizal fungi (the mushroom formers), 3.93 to
  AM fungi and 0.12 to ericoid, about 36% of annual fossil-fuel emissions; the authors call the
  estimate imperfect [11]. A press-level figure of 4 to 20% of plant photosynthate going to the
  fungus is widely repeated; I did not verify it in a primary source.
- **Biological market.** Kiers et al. 2011 [12] showed that plants send more carbon to fungal
  partners supplying more phosphorus, and fungi send more phosphorus to roots supplying more
  carbon (search summary only). Whiteside et al. tracked quantum-dot-tagged phosphorus: with
  0.18 nmol tagged apatite split 90:10, 70:30 or 50:50 between patches, fungi moved phosphorus
  from rich to poor patches in proportion to inequality, stored more in vacuoles when there was
  no inequality, and obtained a better carbon-for-phosphorus exchange rate in poor patches [9].
- **Travelling-wave growth.** Oyarte Galvez et al. imaged *Rhizophagus irregularis* networks
  (over 500,000 nodes) and found the colony front advances as a wave at about 280 µm/h, pulled by
  fast tips at the same speed, with mean tip speed 240 µm/h. Behind the front, hyphal density
  saturates at about 1,000 µm per mm² because fusion removes tips as fast as branching adds them:
  branching rate about 0.04 per tip per hour, fusion coefficient about 23 µm/h. Phosphorus
  depletion reached 40 mm in about 9 days. Hyphae on high-traffic edges were wider and carried
  faster flow [10]. Model:

  ∂n/∂t = αn − βnρ + ∇·J(n),  ∂ρ/∂t = v n

  with n the tip density, ρ the hyphal length density, v the tip speed [10].

I did not find verified per-hypha molar fluxes of phosphorus or nitrogen to the plant.

## 3. Numbers for the model

| Parameter | Value or range | Units | Species | Source | Confidence |
|---|---|---|---|---|---|
| Solute diffusion coefficient in vacuole | 3.4 × 10⁻¹⁰ | m² s⁻¹ | *P. velutina* | [3] | high |
| Effective diffusion, 2 mm branched hypha | 1.6 × 10⁻¹² | m² s⁻¹ | *P. velutina* | [3] | medium (model-derived) |
| Solute diffusion used near AM tips | 1.25 × 10⁻¹⁰ | m² s⁻¹ | *R. irregularis* | [10] | medium |
| AIB translocation velocity, mean / max | 6.4 / 13.9 (23 / 50 mm/h) | µm s⁻¹ | *P. velutina* | [1] | high |
| AIB mass transfer per cord | 4.6 to 51.5 | pmol h⁻¹ | *P. velutina* | [1] | high |
| Growth-induced flow in cords | 0.1 to 10 | µm s⁻¹ | *P. velutina* | [4] | medium (computed) |
| Mass flow, typical / max | 5 / 60 | µm s⁻¹ | *N. crassa* | [32] via [4] | medium (secondary) |
| Nuclear flow, mean / max | 0.83 / 2.8 (3 / 10 mm/h) | µm s⁻¹ | *N. crassa* | [5] | high |
| Flow in AM hyphae, mean ± SD | 18.8 ± 11.8 | µm s⁻¹ | *R. irregularis* | [9] | high |
| Flow in AM hyphae, bursts | 50 to 120 | µm s⁻¹ | *R. irregularis* | [10] | medium |
| Water flow in single hyphae | 50 (0.3 cm/min) | µm s⁻¹ | *A. bisporus* | [7] | medium (calculated) |
| Water flux per hypha | 0.03 | µL d⁻¹ | *A. bisporus* | [7] | medium |
| Turgor pressure | 0.40 to 0.53 | MPa | *N. crassa* | [8] | high |
| Cytoplasm viscosity (assumed) | 2 × 10⁻³ | Pa s | general | [4] | low (assumption) |
| Conducting vessel radius in cords | 6 | µm | *P. velutina* | [4] | medium |
| Conducting fraction of cord cross-section | 0.1 to 0.5 | none | *P. velutina* | [4] | low (assumption) |
| Cord diameter | 48 to 480 | µm | *P. velutina* | [4] | medium |
| Pressure gradient per unit velocity | about 440 | Pa m⁻¹ per µm s⁻¹ | r = 6 µm tube | [4] | high (physics) |
| Hyphal diameter, leading / branches | 12 / 8 / 6 | µm | *N. crassa* | [5] | high |
| Resting membrane potential | −164 ± 13 | mV | *N. crassa* | [8] | high |
| Intracellular spike amplitude | 5 to 50 | mV | *A. bulbosa*, *P. ostreatus* | [14] via [25] | low (secondary) |
| Intracellular spike rate | 0.5 to 5 | Hz | same | [14] via [25] | low (secondary) |
| Extracellular spike interval, fast / slow | 160.5 / 838.8 | s | *P. djamor* | [15] | medium |
| Extracellular spike amplitude, fast / slow | 0.88 / 1.3 | mV | *P. djamor* | [15] | medium |
| Extracellular spike duration, fast / slow | 115.5 / 142.6 | s | *P. djamor* | [15] | medium |
| Refractory-like period, fast / slow | 25.5 / 256 | s | *P. djamor* | [15] | medium |
| Spikes per train | 10 to 30 | count | *P. djamor* | [15] | medium |
| Mean spike interval | 116 | min | *C. militaris* | [16] | medium |
| Mean spike interval | 102 | min | *F. velutipes* | [16] | medium |
| Mean spike interval | 41 | min | *S. commune* | [16] | medium |
| Mean spike interval | 92 | min | *O. nidiformis* | [16] | medium |
| Mean spike amplitude | 0.2 / 0.3 / 0.03 / 0.007 | mV | the four above, in order | [16] | low to medium |
| Spike interval; median duration | 70 min; 62 s | min; s | *P. ostreatus* | [17] | medium |
| Spike width, most common | 5 to 8 | min | *G. resinaceum* | [19] | low (snippet) |
| Post-rain potential | above 100 | mV | *L. bicolor* | [21] | low (press release) |
| Slow electrical oscillation | about 7 | days | *P. brunnescens* | [22] | medium |
| Calcium pulse interval at tip | 26 ± 7 | s | *A. nidulans* | [27] | high |
| Calcium wave speed | 4 to 50 | µm s⁻¹ | *A. nidulans* | [26] | high |
| Calcium wave range | up to 1,500 | µm | *A. nidulans* | [26] | high |
| Front speed | 280 | µm h⁻¹ | *R. irregularis* | [10] | high |
| Branching rate per tip | 0.04 | h⁻¹ | *R. irregularis* | [10] | high |
| Fusion coefficient β | 23 | µm h⁻¹ | *R. irregularis* | [10] | high |
| Saturation hyphal density | about 1,000 | µm mm⁻² | *R. irregularis* | [10] | high |
| Global carbon to ectomycorrhizal mycelium | 9.07 | Gt CO₂e y⁻¹ | all | [11] | low to medium |

All electrical "confidence" ratings describe confidence that the number was reported, not that it
represents fungal membrane activity.

## 4. Timescales and frequencies

| Process | Species | Period or speed | SI | Source |
|---|---|---|---|---|
| Intracellular spikes | *A. bulbosa*, *P. ostreatus* | 0.5 to 5 Hz | 0.2 to 2 s | [14] via [25] |
| Vesicle oscillation at tip | *N. crassa* | 17 s | 59 mHz | [27] |
| Calcium pulses at tip | *A. nidulans* | 26 s | 38 mHz | [27] |
| Flow reversals | AM fungi | seconds | about 0.1 to 1 Hz | [9] |
| Extracellular spiking, fast mode | *P. djamor* | 160.5 s | 6.2 mHz | [15] |
| Substrate-only control cycle | none (abiotic) | about 200 s | 5 mHz | [25] |
| Extracellular spiking, slow mode | *P. djamor* | 838.8 s | 1.19 mHz | [15] |
| Extracellular spiking | *S. commune* | 2,460 s | 0.41 mHz | [16] |
| Extracellular spiking | *P. ostreatus* | 4,200 s | 0.24 mHz | [17] |
| Extracellular spiking | *O. nidiformis* | 5,520 s | 0.18 mHz | [16] |
| Extracellular spiking | *F. velutipes* | 6,120 s | 0.16 mHz | [16] |
| Extracellular spiking | *C. militaris* | 6,960 s | 0.14 mHz | [16] |
| Spike trains | *P. djamor* | 80 to 360 min | 4,800 to 21,600 s | [15] |
| Transport direction switch | *C. cinerea* | every 3 h | 10,800 s | [6] |
| Pulsatile amino-acid transport | *P. velutina* | 11 to 12 h | 23 to 25 µHz | [1] |
| Circadian clock | *N. crassa* | about 22 h | 12.6 µHz | [28] |
| Slow electrical oscillation | *P. brunnescens* | about 7 d | 1.65 µHz | [22] |
| Calcium wave | *A. nidulans* | 4 to 50 µm/s | 4 to 50 × 10⁻⁶ m/s | [26] |
| Amino-acid translocation | *P. velutina* | 23 to 50 mm/h | 6.4 to 13.9 × 10⁻⁶ m/s | [1] |
| Cytoplasmic flow | AM fungi | 2 to 120 µm/s | 2 to 120 × 10⁻⁶ m/s | [9][10] |
| Water flow in hyphae | *A. bisporus* | 0.3 cm/min | 5 × 10⁻⁵ m/s | [7] |
| Nuclear flow | *N. crassa* | 3 to 10 mm/h | 0.8 to 2.8 × 10⁻⁶ m/s | [5] |
| Colony front | AM fungi | 280 µm/h | 7.8 × 10⁻⁸ m/s | [10] |
| Electrical propagation (speculated) | *P. ostreatus* | 0.5 mm/s | 5 × 10⁻⁴ m/s | [14] via [15] |

For the audio work: bringing the 6.2 mHz fast mode to 220 Hz needs a speed-up of about 35,000;
the 0.14 mHz *Cordyceps* rhythm needs about 1.5 million; the 12 h transport pulse needs about
9.5 million to reach 220 Hz, or about 43,000 to become a 1 Hz pulse. Calcium pulses reach audio
with a speed-up of a few thousand.

## 5. What this means for the simulator

Everything in this section is a proposal derived from the sources above, not a literature result.

### 5.1 Simplest (4K tier): no transport solve

Let each tip draw from the local nutrient field only. Optionally give the colony one shared
reserve that fills from uptake and is spent by tips, which mimics fast internal redistribution
without solving anything. This is defensible because pressure equilibrates almost instantly
relative to growth [4].

### 5.2 Growth-induced flow on the graph (40K and 400K tiers)

State: pressure pᵢ at each node; conductance Cᵢⱼ on each edge.

- Edge conductance (Poiseuille): Cᵢⱼ = N π r⁴ / (8 η Lᵢⱼ), with N conducting tubes of radius r, or
  equivalently Cᵢⱼ = λ Aᵢⱼ r² / (8 η Lᵢⱼ) for a cord of cross-section A and conducting fraction λ [4].
- Node balance (Kirchhoff): Σⱼ Cᵢⱼ (pᵢ − pⱼ) = qᵢ, where qᵢ is the net volume source at node i:
  positive where water is taken up, negative at growing tips (qᵢ = −tip cross-section × tip speed)
  and at exudation or evaporation sites [4].
- Edge flow Qᵢⱼ = Cᵢⱼ (pᵢ − pⱼ); velocity vᵢⱼ = Qᵢⱼ / (λ Aᵢⱼ).

This is one sparse symmetric linear system (a weighted graph Laplacian). Conjugate gradient with
the previous solution as the starting guess converges in few iterations because the network
changes little between solves. Solve every few seconds to minutes of simulated time, not every
step.

Worked scale check, my arithmetic: a single hypha with r = 2.5 µm, η = 2 × 10⁻³ Pa s and
L = 1 mm has C ≈ 7.7 × 10⁻¹⁸ m³ Pa⁻¹ s⁻¹. A tip of the same radius advancing at 0.3 µm/s needs
Q ≈ 5.9 × 10⁻¹⁸ m³/s, so the pressure drop is under 1 Pa per mm. Turgor is 4 × 10⁵ Pa [8], so
the model should carry pressure as a small deviation from turgor.

**Thickening rule.** Grow an edge's radius when its |Q| or |v| is high and shrink or recycle it
when low, as observed [4] and as seen in AM networks where central edges are wider and faster
[10]. A standard form is dr/dt = k (|Q|^γ − r/r₀); γ and k are tuning parameters to fit against
the cord-thickness distributions from research topic 2.

### 5.3 Advection-diffusion of resources

For each resource (carbon, nitrogen, phosphorus) with concentration c along an edge:

∂c/∂t + v ∂c/∂x = D ∂²c/∂x² + uptake − consumption

Use D ≈ 1 to 3.4 × 10⁻¹⁰ m² s⁻¹ in lumen and far lower for the branched effective value [3][10].
The Péclet number v L / D decides which term matters: at v = 5 µm/s and L = 1 mm, it is about 15,
so advection dominates beyond about a millimetre, while near tips (the last 3 mm in AM fungi
[10]) diffusion matters. On a graph, a first-order upwind finite-volume scheme (each node's
content moves along outgoing flows) is cheap, conserves mass exactly, and is stable if the time
step is below the smallest edge volume divided by its flow.

**Bidirectional transport.** Single-channel Poiseuille flow cannot move material both ways in one
edge. Two cheap options: (a) give each edge two lanes, a mass-flow lane following the pressure
solve and a slower return lane (vacuolar or motor-driven) with its own diffusion-like
coefficient; (b) keep one lane and add an enhanced effective diffusion. Option (a) reproduces
simultaneous bidirectional transport [2] and is closer to Cairney's vessel versus living-hypha
picture [30].

**Pulsation.** To reproduce the 11 to 12 h pulse [1] without claiming a mechanism, modulate
source loading: qᵢ(t) = q̄ᵢ [1 + m sin(2π t / T + φᵢ)], T = 11.5 h, with phases φᵢ coupled
between neighbouring source nodes by a Kuramoto term, dφᵢ/dt = ω + K Σⱼ sin(φⱼ − φᵢ). Weak K
gives phase domains like those in [2]. The modulation depth m is unknown; start at 0.3.

### 5.4 Electrical layer: excitable medium on the graph

Design position: reproduce the measured spike statistics and expose them as signals; do not claim
they are action potentials.

**Option A, stochastic integrate-and-fire per node (cheapest).** Each node has a level u that
rises at rate 1/T̄ with noise, fires at u = 1, resets, and is refractory for t_ref. On firing it
adds a kick w to neighbours after a delay L/c. Parameters per species from the table in section 3:
T̄ = mean interval, t_ref = refractory-like period, output pulse shape = a raised cosine of the
reported duration and amplitude. For trains, add a slow two-state switch (bursting, quiet): for
*P. djamor*, burst length 10 to 30 spikes at 160 s, bursts lasting 80 to 150 min [15].

**Option B, FitzHugh-Nagumo on the graph (waves and refractoriness emerge).**

dv/dt = (v − v³/3 − w + I + D Σⱼ (vⱼ − vᵢ)/Lᵢⱼ²) / τ
dw/dt = ε (v + a − b w) / τ

With the textbook values a = 0.7, b = 0.8, ε = 0.08, the model is excitable at I = 0 and
oscillates for I roughly between 0.33 and 1.4, with a period of roughly 35 to 40 dimensionless
time units. These dimensionless figures are from memory of the standard model and must be
checked numerically before use. Mapping to data is then one scale factor τ:

| Target | Period | τ (period / 37) |
|---|---|---|
| *P. djamor* fast | 160 s | about 4.3 s |
| *P. djamor* slow | 839 s | about 23 s |
| *S. commune* | 41 min | about 66 s |
| *F. velutipes* | 102 min | about 165 s |
| *C. militaris* | 116 min | about 190 s |

Spike duty cycle (duration over period) differs by species: about 0.7 for the *P. djamor* fast
mode but about 0.015 for *P. ostreatus* (62 s in 70 min). FitzHugh-Nagumo in its oscillatory
regime gives broad spikes, which suits the former. For sparse narrow spikes, run it in the
excitable regime (I = 0) and trigger it with a Poisson process at the measured mean rate; then τ
sets spike width (τ ≈ width / 10 as a starting guess) and the Poisson rate sets the interval.
Scale output to the reported amplitude (0.007 to 2 mV).

**Propagation speed** is a free parameter because none has been measured. Wave speed in such a
medium scales as c ~ √(D/τ). Two anchors: a calcium-like wave at 5 µm/s with τ = 4 s gives
D ≈ 100 µm²/s; the speculated 0.5 mm/s [14] gives D ≈ 1 mm²/s. I recommend the calcium anchor as
the default since it is the only measured fungal wave speed [26], with attenuation so that waves
die within about 1.5 mm unless re-triggered.

**Option C, flow-coupled.** Since several authors suggest the slow potentials reflect transport
and exudation rather than membrane spikes [22][24], an honest alternative is to derive the
"voltage" from the transport model: V at a node proportional to local solute concentration or to
flow velocity (a streaming-potential-like term), plus noise. This costs nothing extra and ties
the electrical signal to rain, wetting and food sources the way the field and bait data suggest
[21][22]. Offer B and C as switchable modes.

### 5.5 Mycorrhizal exchange

At each root contact node, exchange carbon for phosphorus with a rate that rises with the
partner's recent supply (reciprocal rewards [12]) and let the fungus hoard phosphorus when all
patches are equal [9]. The Oyarte Galvez tip-density equations [10] are a ready-made coarse model
for distant, bundled parts of the network in the 4M tier.

### 5.6 Output signals for the sound work

Flow speed and direction on a chosen edge (reverses in seconds to hours), resource concentration
at a node (12 h pulses), voltage at a node (minutes to hours), calcium at a tip (26 s), and spike
events with timestamps. All are slow; they are control-rate signals that need a declared speed-up.

## 6. Open or contested points

1. Whether extracellular fungal "spikes" are membrane events at all. The abiotic 200 s cycle in
   a substrate-only control [25] and the lack of killed-fungus controls in the original papers
   are unresolved. The chloroform result [17] argues some of it is biological.
2. No measured propagation speed for any electrical signal in a mushroom-forming fungus.
3. Mechanism of the 11 to 12 h transport pulse and of phase domains [1][2] is unknown; period
   dependence on temperature and species is not in the sources I could open.
4. The relative share of mass flow, vacuolar diffusion and motor transport is not quantified [29].
5. The 900 µm/s velocity in *P. velutina* [31] is far above everything else and flagged as
   uncertain by those who cite it [4].
6. Whether calcium waves travel further in basidiomycete cords than the 1.5 mm seen in
   *Aspergillus* [26] is unknown.
7. Hydraulic-redistribution velocities [7] are calculated from flux and an assumed lumen, not
   observed.
8. The *L. bicolor* figure of over 100 mV [21] is about 100 times larger than laboratory
   extracellular spikes; wet electrodes in a forest are an obvious alternative explanation that
   I could not check against the paper's controls beyond the press release.
9. Not sourced in this pass (search budget exhausted): chemical signalling, guttation rates,
   classical ³²P and ¹⁴C cord velocities, rhizomorph water velocities, per-hypha N and P fluxes
   to plants, the Slayman 1976 and Olsson and Hansson 1995 primary numbers, and the full text of
   Blatt et al. 2024 and Fukasawa et al. 2023.

## 7. Sources

Status key: **read** = full text or most of it read; **abstract** = abstract only; **secondary** =
known only from another source's description or a search summary.

1. Tlalka M, Watkinson SC, Darrah PR, Fricker MD (2002). Continuous imaging of amino-acid translocation in intact mycelia of *Phanerochaete velutina* reveals rapid, pulsatile fluxes. New Phytologist 153:173-184. doi:10.1046/j.0028-646X.2001.00288.x. **Abstract** (Oxford repository record).
2. Tlalka M, Bebber DP, Darrah PR, Watkinson SC, Fricker MD (2007). Emergence of self-organised oscillatory domains in fungal mycelia. Fungal Genetics and Biology 44:1085-1095. PMID 17467314. **Abstract**. (Volume and pages from memory, not verified.)
3. Darrah PR, Tlalka M, Ashford A, Watkinson SC, Fricker MD (2006). The vacuole system is a significant intracellular pathway for longitudinal solute transport in basidiomycete fungi. Eukaryotic Cell 5:1111-1125. doi:10.1128/EC.00026-06. https://pmc.ncbi.nlm.nih.gov/articles/PMC1489287 **Read**.
4. Heaton LLM, López E, Maini PK, Fricker MD, Jones NS (2010). Growth-induced mass flows in fungal networks. Proc R Soc B 277:3265-3274. doi:10.1098/rspb.2010.0735. arXiv:1005.5305. **Read** (arXiv version).
5. Roper M, Simonin A, Hickey PC, Leeder A, Glass NL (2013). Nuclear dynamics in a fungal chimera. PNAS 110:12875-12880. doi:10.1073/pnas.1220842110. https://pmc.ncbi.nlm.nih.gov/articles/PMC3740868 **Read**. (Page numbers from memory.)
6. Schmieder SS, Stanley CE, Rzepiela A, van Swaay D, Sabotič J, Nørrelykke SF, deMello AJ, Aebi M, Künzler M (2019). Bidirectional propagation of signals and nutrients in fungal networks via specialized hyphae. Current Biology 29:217-228. doi:10.1016/j.cub.2018.11.058. **Abstract**.
7. Guhr A, Borken W, Spohn M, Matzner E (2015). Redistribution of soil water by a saprotrophic fungus enhances carbon mineralization. PNAS 112:14647-14651. doi:10.1073/pnas.1514435112. https://pmc.ncbi.nlm.nih.gov/articles/PMC4664368 **Read**. (Page numbers from memory.)
8. Lew RR, Abbas Z, Anderca MI, Free SJ (2008). Phenotype of a mechanosensitive channel mutant, mid-1, in a filamentous fungus, *Neurospora crassa*. Eukaryotic Cell 7:647-655. doi:10.1128/EC.00411-07. https://pmc.ncbi.nlm.nih.gov/articles/PMC2292622 **Read**.
9. Whiteside MD, Werner GDA, Caldas VEA, et al., Kiers ET (2019). Mycorrhizal fungi respond to resource inequality by moving phosphorus from rich to poor patches across networks. Current Biology 29:2043-2050. https://pmc.ncbi.nlm.nih.gov/articles/PMC6584331 **Read** (first 100,000 characters of the page).
10. Oyarte Galvez L, Bisot C, Bourrianne P, et al. (2025). A travelling-wave strategy for plant-fungal trade. Nature 639:172-180. doi:10.1038/s41586-025-08614-x. https://pmc.ncbi.nlm.nih.gov/articles/PMC11882455/ **Read** (main text and methods; supplementary methods not seen).
11. Hawkins H-J, Cargill RIM, Van Nuland ME, Hagen SC, Field KJ, Sheldrake M, Soudzilovskaia NA, Kiers ET (2023). Mycorrhizal mycelium as a global carbon pool. Current Biology 33:R560-R573. doi:10.1016/j.cub.2023.02.027. **Abstract**. (Pages from memory.)
12. Kiers ET, Duhamel M, Beesetty Y, et al. (2011). Reciprocal rewards stabilize cooperation in the mycorrhizal symbiosis. Science 333:880-882. **Secondary**.
13. Slayman CL, Long WS, Gradmann D (1976). "Action potentials" in *Neurospora crassa*, a mycelial fungus. Biochimica et Biophysica Acta 426:732-744. doi:10.1016/0005-2736(76)90138-3. **Secondary** (numbers from unverified reviews).
14. Olsson S, Hansson BS (1995). Action potential-like activity found in fungal mycelia is sensitive to stimulation. Naturwissenschaften 82:30-31. doi:10.1007/BF01167867. **Secondary** (via [25] and [15]).
15. Adamatzky A (2018). On spiking behaviour of oyster fungi *Pleurotus djamor*. Scientific Reports 8:7873. doi:10.1038/s41598-018-26007-1. https://pmc.ncbi.nlm.nih.gov/articles/PMC5959856/ **Read**.
16. Adamatzky A (2022). Language of fungi derived from their electrical spiking activity. Royal Society Open Science 9:211926. doi:10.1098/rsos.211926. https://pmc.ncbi.nlm.nih.gov/articles/PMC8984380 **Read**.
17. Adamatzky A, Gandia A (2022). Fungi anaesthesia. Scientific Reports 12:340. doi:10.1038/s41598-021-04172-0. https://pmc.ncbi.nlm.nih.gov/articles/PMC8748941 **Read**.
18. Dehshibi MM, Adamatzky A (2021). Electrical activity of fungi: spikes detection and complexity analysis. BioSystems 203:104373. arXiv:2008.10276. **Read** (arXiv version).
19. Adamatzky A, Gandia A (2021). On electrical spiking of *Ganoderma resinaceum*. Biophysical Reviews and Letters 16(4). doi:10.1142/S1793048021500089. **Secondary** (search snippet).
20. Mayne R, Roberts N, Phillips N, Weerasekera R, Adamatzky A (2023). Propagation of electrical signals by fungi. BioSystems 229:104933. arXiv:2304.10675. **Read** (arXiv version).
21. Fukasawa Y, Akai D, Ushio M, Takehi T (2023). Electrical potentials in the ectomycorrhizal fungus *Laccaria bicolor* after a rainfall event. Fungal Ecology 63:101229. doi:10.1016/j.funeco.2023.101229. **Secondary** (Tohoku University press release, https://www.tohoku.ac.jp/en/press/mushrooms_and_their_postrain_electrical_conversations.html).
22. Fukasawa Y, Akai D, Takehi T, Osada Y (2024). Electrical integrity and week-long oscillation in fungal mycelia. Scientific Reports 14:15601. doi:10.1038/s41598-024-66223-6. https://pmc.ncbi.nlm.nih.gov/articles/PMC11227530/ **Read**.
23. Blatt MR, Pullum GK, Draguhn A, Bowman B, Robinson DG, Taiz L (2024). Does electrical activity in fungi function as a language? Fungal Ecology 68:101326. doi:10.1016/j.funeco.2023.101326. **Abstract** plus quotations in [24].
24. Liberman M (2023). Mushroom language? Language Log. https://languagelog.ldc.upenn.edu/nll/?p=62109 **Read**.
25. Buffi M, Kelliher JM, Robinson AJ, et al., Junier P (2025). Electrical signaling in fungi: past and present challenges. FEMS Microbiology Reviews 49:fuaf009. doi:10.1093/femsre/fuaf009. https://pmc.ncbi.nlm.nih.gov/articles/PMC11995700/ **Read** (first 100,000 characters of the page).
26. Itani A, et al. (2023). Local calcium signal transmission in mycelial network exhibits decentralized stress responses. PNAS Nexus. https://pmc.ncbi.nlm.nih.gov/articles/PMC9991499/ **Read**. (Full author list and volume not recorded.)
27. Takeshita N, Evangelinos M, Zhou L, et al., Fischer R (2017). Pulses of Ca²⁺ coordinate actin assembly and exocytosis for stepwise cell extension. PNAS 114:5701-5706. doi:10.1073/pnas.1700204114. https://pmc.ncbi.nlm.nih.gov/articles/PMC5465874/ **Read**. (Page numbers from memory.)
28. Comprehensive modelling of the *Neurospora* circadian clock and its temperature compensation (2012). PLoS Computational Biology. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3320131/ **Secondary** (search summary; authors not verified).
29. Fricker MD, Heaton LLM, Jones NS, Boddy L (2017). The mycelium as a network. Microbiology Spectrum 5(3). doi:10.1128/microbiolspec.funk-0033-2017. **Secondary** (search snippet; repository copy returned an access error).
30. Cairney JWG (1992). Translocation of solutes in ectomycorrhizal and saprotrophic rhizomorphs. Mycological Research 96:135-141. doi:10.1016/S0953-7562(09)80928-3. **Secondary** (abstract snippet).
31. Wells JM, Boddy L, Evans R (1995). Carbon translocation in mycelial cord systems of *Phanerochaete velutina*. New Phytologist. **Secondary** (cited in [4] as "Wells et al. 1995b"; exact title and authors not verified).
32. Lew RR (2005). Mass flow and pressure-driven hyphal extension in *Neurospora crassa*. Microbiology 151. **Secondary** (cited in [4]; title from memory, not verified).
33. Guhr A, Marzini C, Borken W, Poll C, Matzner E (2016). Effect of water redistribution by two distinct saprotrophic fungi on carbon mineralization and nitrogen translocation in dry soil. Soil Biology and Biochemistry. **Secondary** (search summary; author list from memory, not verified).
