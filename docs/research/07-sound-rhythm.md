# 07. Sound, vibration and rhythm in fungi

Research topic 7 of Phase 1. Written 2026-11-09. Every number is tagged in the text or the
tables as **measured** (from a source I opened), **reported** (seen only second-hand, in a search
summary or another paper's review), or **estimated** (my own calculation, shown in section 4).
Sources are numbered in section 7, each marked "read" or "cited only".

## 1. Summary

1. **Do fungi make sound? Almost none, and nothing from the mycelium.** The only fungal sounds
   documented by ear are from explosive spore discharge: cup fungi that "puff" (a hiss) and
   *Pilobolus* (a click on launch and a tap when the sporangium hits something) [1][2].
2. Gilled mushrooms release tens of thousands of spores per second, and Buller, who listened for
   it, heard nothing [1]. My estimate puts it far below hearing threshold and ultrasonic (4.4).
3. The one direct instrumental search for sound from fungal tissue (10 to 210 kHz, during
   drying) found nothing [3]. Soil ecoacoustics records animals, not fungi [4][5].
4. "Acoustic emission from decaying wood" is real but is the wood cracking under load or
   drying, not the fungus [6][7].
5. Fungal rhythms are real and slow: from about 0.2 Hz (pulsed tip growth) down to one cycle a
   week (electrical oscillation). Speed-ups of 10^2 to 10^8 bring them to audio rate.
6. The large exception is event counts: spore discharge already runs at about 3 x 10^4 events
   per second per cap [8][9], and branching in a million-tip network is of order 100 per second.
7. Hyphae are too small and too viscous to ring. A hypha is a lossy pressure line (a low-pass
   filter), not a string. Mushroom caps would have heavily damped modes around 30 to 150 Hz.
8. All existing "mushroom music" is a mapping from slow electrode voltage or resistance to
   notes chosen by people; the practitioners say so themselves [10][11].
9. The electrical "spikes" most often sonified are contested as possible artefacts [12].
10. Recommendation: record events and slow signals in simulation time, never at a baked audio
    rate, and treat every audible result as sonification, not as a recording.

## 2. Findings

### 2.1 Do fungi or mycelium emit sound or vibration?

**Spore discharge in cup fungi (ascomycete "puffing"): anecdotal but repeated, plausible.**
Buller's *Researches on Fungi* vol. 1 (1909) has a chapter, "The Sound produced by the Discharge
of Spores, with special reference to Pilobolus". It quotes de Bary as hearing "a very
perceptible hissing sound" from strong specimens of *Peziza acetabulum* and *Helvella crispa*
[1]. A 1917 paper is titled "Upon the audibility of spore discharge in *Helvella elastica*"; I
saw the title only [13]. A modern blog video of *Urnula craterium* shows a visible spore cloud
about one second after blowing on the cup, with a hiss on the soundtrack [2]. I found no
calibrated acoustic measurement (no spectrum, no sound level) of any puff. The mechanism that
makes it loud enough is known: thousands of asci fire almost together and drive a jet of air,
shown by high-speed imaging in *Sclerotinia* and *Ascobolus* [14]. Individual asci launch at a
median 14 m/s (*Ascobolus immersus*) to 21 m/s (*Podospora anserina*), with accelerations up to
1.8 x 10^6 m/s^2, powered by ordinary hyphal turgor [15]. Status: **anecdotal, physically
credible; unmeasured as sound.**

**Pilobolus: anecdotal, credible.** Grove described "a faint but distinctly audible 'puff', like
the sound of a minute pop-gun". Buller, in a quiet room with *Pilobolus kleinii*, heard a small
click as each sporangium left and a "more metallic" sound when it struck the glass dish; a
colleague stretched tissue paper over a funnel as a drum and heard each impact from 21 feet [1].
Launch speed is a median 9 m/s [15]. The impact is the louder part: section 4.4 puts the
kinetic energy near 1 microjoule, about the same as a sand grain dropped 14 cm.

**Gilled and pored mushrooms: silent, by observation and by calculation.** Buller listened to
agarics and *Polyporus squamosus* shedding "about a million per minute" and concluded the
process "must, for ever be a quite silent process" to unaided ears [1]. Each ballistospore is
launched by a surface-tension catapult at roughly 0.8 to 1.5 m/s with acceleration above
10^4 g [16][17][18]. Section 4.4 estimates the total sound from a whole cap at well under 0 dB
SPL and mostly above 100 kHz. Status: **measured mechanics, estimated sound, effectively
silent.**

**Puffballs and earthstars.** Spores leave when a raindrop or animal deforms the sac. Any sound
is the impact, not the fungus. I found no acoustic measurement. Status: **speculative.**

**Mycelium and hyphae: nothing detected.** Phillips et al. (2023) recorded several species
while they dehydrated, over 5 terabytes of data, and detected no emissions between 10 and
210 kHz [3] (I saw the abstract and summaries, not the full methods). This is the only direct
test I found. Plants are the useful comparison: drying wood does emit ultrasonic clicks, each
one tied to a single cavitation bubble in a water-conducting vessel, with energy rising with
vessel size [7]. Hyphae are 10 to 100 times narrower than xylem vessels and are not held under
tension, so the same mechanism is not expected. A bursting hyphal tip releases of order
10^-10 J into liquid (4.4). Status: **measured null in one study; no positive report.**

**Wood decay and acoustic emission (AE).** AE monitoring detects early decay, but as the wood's
response to load: lightly decayed specimens emit as soon as compression starts, sound wood only
near its limit [6]; one study reports AE changes at under 1% mass loss [19]. Both seen in search
summaries only. I found no report of spontaneous AE caused by hyphal activity in unloaded wood.
In a simulator, decay could reasonably modulate the rate of substrate cracking events during
drying and wetting, labelled as wood sound.

**Soil ecoacoustics.** Buried probes and contact microphones pick up scraping, chewing and
movement of invertebrates and roots [4][5]. Acoustic complexity is higher in restored than in
cleared plots and tracks invertebrate abundance; fungi are not identified as sources [4]. A
press quote that "all living organisms produce sounds" is a general claim, not evidence [5].
Status for fungi: **not shown.**

**Growing mushrooms lifting and cracking things.** Buller measured a *Coprinus sterquilinus*
fruit body lifting about 200 g, an upward pressure of about two-thirds of an atmosphere
[20][21] (two secondary sources give 204 g and 250 g). Mushrooms lifting paving and tarmac are
documented anecdotes [20]. Any sound is the substrate fracturing at rare intervals. Status:
**force measured, sound anecdotal.**

**Laser vibrometry or microphones on mushrooms.** I found no published vibrometry of a living
mushroom or mycelium. Absence of a find, not proof of absence.

### 2.2 Effects of sound on fungi

This literature is small, inconsistent and mostly weak.

- **Robinson et al. 2024, *Biology Letters*** [22] (read). *Trichoderma harzianum* on agar, 20
  dishes stimulated and 20 controls. Stimulus: band-limited noise peaking at 8 kHz, 80 dB, 30
  minutes a day for 5 days, from a tinnitus-masker video through a Bluetooth speaker the dishes
  sat on. Results: colony diameter about 7% larger by day 5 (89.6 against 83.4 mm), spore
  density about 4.5 times higher (2.42 x 10^6 against 5.42 x 10^5 per ml). Weaknesses, some
  stated by the authors: one chamber per treatment, so chamber and treatment are confounded; no
  blinding reported; paired t-tests on an unpaired design; "biomass" in the abstract is radial
  growth. My added concern: dishes resting on a speaker receive direct vibration and possibly
  warmth, so "airborne sound" is not isolated. One isolate, one stimulus. Treat as a pilot.
- ***Aspergillus*, 2009** [23] (reported): tones of 5, 10 and 15 kHz slowed growth, most at
  15 kHz. Opposite sign to [22].
- **Oyster mushrooms** (reported): a 2026 study exposing blocks to 50 to 750 Hz at 80 dB for
  300 s found *Pleurotus ostreatus* yields reduced at every frequency, with gains in
  *P. eryngii* [24]. Small conference papers report faster growth of *P. sajor-caju* with sound
  or music [25]. I did not open these.
- No systematic review or meta-analysis turned up. Proposed mechanisms (mechanosensitive
  channels, favoured by [22]) are untested for sound.

**Assessment.** There is no dose-response curve, no agreed sign and no mechanism. A simulator
can honestly expose "acoustic or mechanical stimulation" as an optional input acting on growth
rate and sporulation, defaulting to no effect, with basis marked `unknown`. A better-grounded
mechanical input is direct stress: in *Sclerotinia*, mechanical stress appears to trigger
synchronised firing of asci [14].

### 2.3 Inventory of rhythmic, pulsed and event-like processes

Numbers and speed-up factors are in the table in section 3.

**Electrical activity.** Three bodies of data that should not be merged:

1. *Intracellular* recordings. Slayman et al. (1976) in *Neurospora*: oscillations of 10 to
   20 mV with periods of 3 to 4 minutes and of 20 to 30 seconds, and damped oscillations of 50
   to 100 mV with periods of 0.2 to 2 minutes. Olsson and Hansson (1995) in *Pleurotus
   ostreatus* and *Armillaria bulbosa*: spikes of 5 to 50 mV, 20 to 500 ms long, at 0.5 to 5 Hz.
   Both as summarised in [26]; I did not open the originals. The Olsson and Hansson figures
   are thousands of times faster than anything recorded since and have not, as far as I found,
   been replicated.
2. *Extracellular needle electrodes* (Adamatzky and colleagues), sampled once per second.
   *Pleurotus djamor* fruit bodies: two modes, period 160 s (0.88 mV) and 839 s (1.3 mV), each
   spike lasting about 2 minutes, in trains of 1 to 6 hours [26]. Four species on colonised
   substrate, mean interval and amplitude: *Schizophyllum commune* 41 min, 0.03 mV; *Omphalotus
   nidiformis* 92 min, 0.007 mV; *Flammulina velutipes* 102 min, 0.3 mV; *Cordyceps militaris*
   116 min, 0.2 mV; spike durations 1 to 21 hours [27]. *P. ostreatus* mycelium: spikes of
   about 0.5 mV lasting about 62 s, about one per 70 minutes overall, in trains [28].
3. *Long records.* *Pholiota brunnescens* on agar with a wood bait, sampled every 10 minutes
   for 104 days: an oscillation with a period of about 7 days at the bait after about day 60.
   The authors attribute it to transport and exudation of metabolites, not action potentials
   [29]. *Laccaria bicolor* mushrooms in a forest: potential fluctuated after rain, at times
   above 100 mV [30] (reported).

Caution: Blatt et al. (2024) argue that the extracellular "spikes" may be non-biological noise
or electrode drift, and that the "language" analysis is unsupported [12]. The papers also
contain internal inconsistencies (in [26] durations in the text and table disagree; in [28] one
interval is given as both 53 min and 55 s). The model should reproduce measured statistics and
claim nothing about meaning.

**Pulsed tip growth.** Hyphal tips advance in pulses in every fungus tested: about 13 to 14
pulses per minute in *Trichoderma viride* and *Neurospora crassa*, 2.7 per minute in *Fusarium
culmorum* [31]. Measured on isolated tips under the microscope.

**Calcium and actin oscillations at the tip.** In *Aspergillus nidulans*, calcium pulses,
actin assembly, vesicle fusion and growth rate oscillate together [32]. I could not open a
source stating the period; my recollection is tens of seconds. **Unverified.**

**Oscillatory nutrient transport.** In *Phanerochaete velutina*, imaging of a labelled amino
acid analogue shows a pulsatile component with a period of 11 to 12 hours in cords [33] and
16 hours at 21 C with a temperature coefficient of 2.1, so not a temperature-compensated
circadian clock [34]. Colonies organise into domains with different phases [35]. Seen in
abstracts and summaries. This is the best-evidenced colony-scale oscillator and a natural slow
modulator.

**Cytoplasmic streaming and vacuole traffic.** Continuous flow, not a rhythm. In *Neurospora*,
cytoplasm moves with the tips at 0.2 to 0.5 micrometres per second [36]; bulk streaming reaches
60 micrometres per second, about 70 in some basidiomycetes [37]; nuclei travel at about 6 to
20 micrometres per second and bunch into fast-moving groups [38]. In *P. velutina*, vacuole
tubes connect and break on a timescale of seconds to tens of seconds [39].

**Circadian rhythm.** *Neurospora* conidiation free-runs at about 22 hours in darkness [40].
I found no solid source for a circadian clock in a mushroom-forming species; diurnal patterns
in spore release are widely described but I did not verify one. **Open.**

**Spore discharge rates.** One *Agaricus campestris* cap: about 31,000 spores per second, 2.7
billion per day [8]; a review gives 30,000 per second for a gilled mushroom [9]; Buller, about
a million per minute (17,000 per second) [1]. Each launch lasts microseconds. The series is
effectively a Poisson process: white noise at the event level, modulated over minutes to hours
by humidity and maturity. Cup-fungus puffs are bursts of thousands to tens of thousands of asci
in well under a second, separated by quiet minutes [1][14].

**Branching and fusion.** I found no direct per-tip event rates for a mushroom-forming species.
From a tip speed of 124 micrometres per hour in *P. velutina* [39] and a typical hyphal growth
unit of 100 to 300 micrometres per tip (general figure, not sourced here), each tip makes a new
branch about every 1 to 2.5 hours (**estimated**). A single fusion in *Tuber borchii* takes 115
to 200 minutes from redirection to completion [41] (reported). Event rate scales with tip
count: 10^4 tips give about 1 to 3 branch events per second, 10^6 tips give 100 to 300.

**Growth-front speed.** 124 micrometres per hour for *P. velutina* tips [39], about 3 mm per
day. Topics 1 and 2 hold the per-species figures.

**Diurnal, weather and seasonal cycles.** 24-hour temperature and humidity cycles, rain events
(which trigger electrical change [30] and fruiting), and the annual fruiting season.

### 2.4 Existing fungal sonification and bio-music

**What the devices measure.** MIDI Sprout, its successor PlantWave, and the DIY "biodata
sonification" boards send a small current through two electrodes and measure resistance. The
circuit is a 555 timer running as an oscillator whose frequency depends on the resistance
between the electrodes, "similar to a simple lie detector" [42][43]. Firmware watches for
changes and emits a MIDI note in proportion to the change [43]. Pitch set, scale, instrument
and reverb are the designer's. The device does not record a voltage produced by the organism.
What changes the resistance is not established and includes water content, drying, electrode
contact and movement; Tarun Nayar says as much [10].

**Tarun Nayar (Modern Biology).** Electrodes on mushrooms and plants, resistance changes
triggering notes on a modular synthesiser. His own field guide states that plants do not make
music; the fluctuations trigger note and rhythm changes [10][44].

**Michael Prime.** *L-Fields* (2000) and related work amplify small voltages from plants and
fungi (fly agaric, peyote) and use them to modulate oscillators [11]. Closer to the organism's
own electrical state than the resistance devices, but still slow control of a human-built
sound source.

**Adamatzky's group and Eduardo Miranda.** The peer-reviewed precedent is on the slime mould
*Physarum* (not a fungus): electrode voltages drive a bank of sine oscillators [45]. I found no
peer-reviewed paper that sonifies the fungal spike trains of [27]; the sonifications circulating
are artists' work [46]. **Mileece** (plant biofeedback) and **John Cage** (a mycologist as well
as a composer) are often named here; I verified nothing specific about either.

**Mappings used.** (a) change in resistance to a MIDI note within a fixed scale; (b) voltage as
control voltage to pitch, filter or amplitude; (c) one oscillator per electrode with voltage
setting amplitude or frequency; (d) time compression of logged data.

**Criticism.** (1) The musical content is authored by the mapping: one essay notes the
organism's irregular signal is "heavily filtered through human expectations" [47]. (2) Controls
are missing: nobody appears to have published the same patch on an inert wet object, the
obvious test [48]. (3) The spikes themselves are contested [12]. (4) "Hearing the mushroom" is
wrong in every case: nothing acoustic is recorded. For this project, describe any audio as
"sonification of a simulated quantity" and keep the mapping explicit.

### 2.5 Physical-modelling ideas

Calculations are in section 4.

**Material properties.**

| Property | Value | Basis |
|---|---|---|
| Hyphal wall Young's modulus | 110 +/- 10 MPa; 64 +/- 4 MPa at high osmolarity (*A. nidulans*, AFM) | reported [49] |
| Wall modulus along the hypha | increases with distance from the tip | reported [50] |
| Hyphal turgor | 0.4 to 0.7 MPa (*Neurospora*, *Achlya*); 0.8 to 1.2 MPa (*Achlya*, probe); rarely above 0.8 MPa | reported [51] |
| Wall thickness | about 0.1 micrometre | assumed, not sourced |
| Fresh mushroom tissue modulus | 0.5 MPa along the stem, 0.3 MPa across | reported [52], species not confirmed |
| Stipe stiffness | proportional to tissue density; falls quickly after harvest | reported [53] |
| Fresh mushroom tissue density | about 700 kg/m^3 | assumed, not sourced |
| Dried pure-mycelium sheet modulus | 408 to 710 MPa (tension) | reported [54] |
| Mycelium composite | 0.1 to 1.5 MPa, 60 to 250 kg/m^3 | reported [54] |

**Hypha as a fluid-filled elastic tube.** Wave speed about 45 m/s, but viscosity wins at this
radius, so pressure diffuses instead of propagating. The honest model is an RC line: each edge
a low-pass element with time constant L^2/D_p. This is the same network-flow problem the 400K
tier already solves, so a pressure tap comes almost for free.

**Hypha as a string.** Turgor puts the wall in tension; transverse wave speed is sqrt(P/rho),
about 22 m/s, independent of radius. A free aerial hypha 1 mm long would have a fundamental
near 11 kHz with a quality factor of a few; embedded hyphae cannot vibrate. As a sound-design
device ("each edge is a string, tension from turgor, length from the graph") it gives
physically motivated tuning that responds to hydration. It is a design choice, not a
prediction of real sound.

**Cap as a plate, stipe as a beam.** Soft cap plate modes of about 30 to 150 Hz; stipe swaying
at a few Hz. Woody brackets would sit in the hundreds of Hz to low kHz. All heavily damped
(wet tissue; I guess Q of 2 to 10, unmeasured). Good "body resonator" candidates, with mode
frequencies from the species shape parameters.

**Event-based synthesis.** Each branch, fusion, spike or spore discharge triggers a grain or a
band-limited impulse. Spore discharge at 3 x 10^4 per second is physically a noise source with
a slowly varying rate: synthesise it as rate-modulated noise, not individual grains. Puffs are
natural percussive bursts. Branch and fusion events from a large network give a sparse to
dense crackle, spatialised by event position.

**Modal and waveguide synthesis on the graph.** (a) Waveguide network: each edge a delay line
with delay L/c, each node a scattering junction with admittances from cross-section. Cost
grows with edges, so affordable for hundreds to low thousands of edges at audio rate. (b)
Modal: solve K v = omega^2 M v for the graph (stiffness K from edges, mass M from node
volumes), keep the lowest 32 to 128 modes, run them as damped resonators excited at the node
where an event happens. The graph Laplacian is the special case of unit masses and
conductance weights. Its spectrum reflects network structure: loops and fusions raise the
low eigenvalues, long unbranched cords lower them, so growth and remodelling retune the
instrument audibly. Recompute with a Lanczos solve at a slow rate and crossfade. Physically
the eigenvalues are relaxation rates (overdamped), so using them as pitches is an artistic
mapping: omega_k = omega_ref * sqrt(lambda_k / lambda_1).

**Scanned synthesis.** Treat a slow state (voltage, pressure or concentration along a path)
as a wavetable and scan it at audio rate. This suits fungi well: the state evolves at haptic
rates and below, exactly the regime scanned synthesis was designed for. Scan paths could be a
cord, the growth front, or a walk ordered by the Laplacian's second eigenvector.

### 2.6 Signal taps

Section 5.

## 3. Timescales table

Speed-up = target frequency divided by natural frequency. "Meas." = measured in a source I
read; "Rep." = reported second-hand; "Est." = my estimate.

| Process | Natural frequency or rate | Speed-up to 100 Hz / 1 kHz | Status | Source |
|---|---|---|---|---|
| Ballistospore launch (single event) | lasts about 10 microseconds, content near 100 kHz | slow down 100x to 1000x | Est. from meas. speeds | [16][17] |
| Spore discharge, one agaric cap | 1.7 to 3.1 x 10^4 events/s | none (noise already) | Rep. | [1][8][9] |
| Cup-fungus puff | burst under 1 s, 10^4 to 10^5 asci; minutes apart | none for the burst | Rep. | [1][14] |
| Intracellular spikes (*Pleurotus*, *Armillaria*) | 0.5 to 5 Hz, 20 to 500 ms each | 20 to 200 / 200 to 2,000 | Rep., unreplicated | [26] |
| Pulsed tip growth, *Neurospora*, *Trichoderma* | 0.22 to 0.23 Hz | 440 / 4,400 | Meas. | [31] |
| Pulsed tip growth, *Fusarium* | 0.045 Hz | 2,200 / 22,000 | Meas. | [31] |
| Tip calcium/actin pulses, *A. nidulans* | tens of seconds (period not verified) | about 3,000 / 30,000 | Unverified | [32] |
| Vacuole tube connect/break | 0.01 to 0.1 Hz (irregular) | 10^3 to 10^4 / 10^4 to 10^5 | Meas. | [39] |
| *Neurospora* membrane oscillation, fast | 0.033 to 0.05 Hz | 2,000 to 3,000 / 20,000 to 30,000 | Rep. | [26] |
| *Neurospora* membrane oscillation, slow | 0.0042 to 0.0056 Hz | about 2 x 10^4 / 2 x 10^5 | Rep. | [26] |
| *P. djamor* fruit body, fast mode | 6.2 x 10^-3 Hz (160 s) | 1.6 x 10^4 / 1.6 x 10^5 | Meas. | [26] |
| *P. djamor* fruit body, slow mode | 1.2 x 10^-3 Hz (839 s) | 8.4 x 10^4 / 8.4 x 10^5 | Meas. | [26] |
| *P. ostreatus* mycelium, within a train | 4.7 x 10^-3 Hz (214 s) | 2.1 x 10^4 / 2.1 x 10^5 | Meas. | [28] |
| *P. ostreatus* mycelium, overall | 2.4 x 10^-4 Hz (70 min) | 4.2 x 10^5 / 4.2 x 10^6 | Meas. | [28] |
| *S. commune* spikes | 4.1 x 10^-4 Hz (41 min) | 2.5 x 10^5 / 2.5 x 10^6 | Meas. | [27] |
| *O. nidiformis* spikes | 1.8 x 10^-4 Hz (92 min) | 5.5 x 10^5 / 5.5 x 10^6 | Meas. | [27] |
| *F. velutipes* spikes | 1.6 x 10^-4 Hz (102 min) | 6.1 x 10^5 / 6.1 x 10^6 | Meas. | [27] |
| *C. militaris* spikes | 1.4 x 10^-4 Hz (116 min) | 7.0 x 10^5 / 7.0 x 10^6 | Meas. | [27] |
| Branching, per tip | 1 to 3 x 10^-4 Hz (every 1 to 2.5 h) | 3 x 10^5 to 10^6 / 10x more | Est. | [39] + assumption |
| Branching, network of 10^4 tips | 1 to 3 events/s | 30 to 100 / 300 to 1,000 | Est. | as above |
| Branching, network of 10^6 tips | 100 to 300 events/s | about 1 / 3 to 10 | Est. | as above |
| One hyphal fusion | 115 to 200 min to complete | event marker only | Rep. | [41] |
| Front advance by one hyphal width (5 um at 124 um/h) | 6.9 x 10^-3 Hz | 1.5 x 10^4 / 1.5 x 10^5 | Est. from meas. | [39] |
| Amino acid transport pulses, cords | 2.3 to 2.5 x 10^-5 Hz (11 to 12 h) | 4 x 10^6 / 4 x 10^7 | Rep. | [33] |
| Amino acid transport oscillation, 21 C | 1.7 x 10^-5 Hz (16 h) | 5.8 x 10^6 / 5.8 x 10^7 | Rep. | [34] |
| Circadian (*Neurospora*) | 1.3 x 10^-5 Hz (22 h) | 7.9 x 10^6 / 7.9 x 10^7 | Rep. | [40] |
| Diurnal cycle | 1.16 x 10^-5 Hz | 8.6 x 10^6 / 8.6 x 10^7 | exact | |
| Week-long electrical oscillation (*Pholiota*) | 1.65 x 10^-6 Hz | 6 x 10^7 / 6 x 10^8 | Meas. | [29] |
| Annual fruiting season | 3.2 x 10^-8 Hz | 3.2 x 10^9 / 3.2 x 10^10 | exact | |
| Cytoplasmic streaming | 0.2 to 70 um/s, continuous | not a rhythm; modulator | Rep. | [36][37][38] |

At a speed-up of 10^6, a day lasts 86 ms (11.6 Hz, a tremolo), a spike every 41 minutes becomes
407 Hz, a 16-hour transport cycle 17 Hz, and a season of 90 days lasts 7.8 seconds. One factor
spreads the processes across rhythm, pitch and timbre at once. Factors of 10^5 to 10^6 are the
musically useful range for electrical activity, 10^3 to 10^4 for tip pulsing.

## 4. Physical-modelling estimates

All are order-of-magnitude. Inputs: wall modulus E = 100 MPa [49], wall thickness h = 0.1 um
(assumed), hyphal radius R = 2.5 um, turgor P = 0.5 MPa [51], fluid density 1000 kg/m^3,
water viscosity 10^-3 Pa s (cytoplasm is more viscous, which strengthens the conclusions).

### 4.1 Hypha as an elastic tube

Moens-Korteweg speed: c = sqrt(E h / (rho * 2R)) = sqrt(10^8 x 10^-7 / (10^3 x 5 x 10^-6))
= sqrt(2000) = 45 m/s.

Standing-wave fundamental, f = c / 2L: 224 kHz for a 100 um compartment, 22 kHz for 1 mm,
2.2 kHz for 1 cm.

Womersley number, alpha = R sqrt(omega rho / mu). At 22 kHz: 2.5 x 10^-6 x sqrt(1.4 x 10^5 x
10^6) = 0.93. At 2.2 kHz: 0.29. Below about 1, flow is viscous and no wave propagates. So no
hypha of any length rings.

What remains is pressure diffusion, D_p = c^2 R^2 / (8 nu) = 2000 x 6.25 x 10^-12 / (8 x 10^-6)
= 1.6 x 10^-3 m^2/s. Equilibration time L^2 / D_p: 0.6 ms over 1 mm, 64 ms over 1 cm, 6 s over
10 cm, longer with real cytoplasm and septal pores. A turgor disturbance spreads across a
centimetre-scale colony in tenths of a second: fast compared with every biological rhythm,
slow compared with audio. Wall strain check: hoop stress P R / h = 12.5 MPa, about 12% strain
at E = 100 MPa, so the wall is a strongly stretched spring.

### 4.2 Hypha as a string

Axial tension T = P pi R^2 = 5 x 10^5 x 1.96 x 10^-11 = 9.8 x 10^-6 N. Mass per length mu =
rho pi R^2 = 1.96 x 10^-8 kg/m. Speed c = sqrt(T / mu) = sqrt(P / rho) = 22 m/s, independent
of radius. Fundamental f = c / 2L: 112 kHz at 100 um, 11 kHz at 1 mm, 1.1 kHz at 1 cm.

Air damping (viscous drag per length about 4 pi mu_air v): gamma = 4 pi x 1.8 x 10^-5 /
1.96 x 10^-8 = 1.2 x 10^4 per second. Q = omega / gamma: about 6 at 11 kHz, 0.6 at 1.1 kHz.
Only short aerial hyphae could ring at all, weakly and ultrasonically or near it; wall
viscoelasticity would lower Q further. In water, agar, soil or wood: no vibration.

### 4.3 Cap, stipe and bracket

Free circular plate, lowest mode: f = (lambda^2 / (2 pi a^2)) sqrt(D / (rho h)), lambda^2 about
5.3, D = E h^3 / (12 (1 - nu^2)), nu = 0.45.

- Large soft cap: E = 0.5 MPa [52], h = 10 mm, a = 40 mm, rho = 700. D = 0.052 N m;
  sqrt(D / rho h) = 0.086; f = 5.3 x 0.086 / (2 pi x 1.6 x 10^-3) = **about 45 Hz**.
- Small cap: h = 4 mm, a = 15 mm: **about 130 Hz**.
- The cap is thick for its radius, so thin-plate theory overestimates; real values lower.
- Bulk speeds in fresh tissue: bar wave sqrt(E / rho) = 27 m/s, shear about 15 m/s.
- Stipe as a cantilever, L = 80 mm, radius 7 mm: f = (3.52 / (2 pi L^2)) x (r / 2) x
  sqrt(E / rho) = 87.4 x 0.0935 = **about 8 Hz**, lower with the cap's mass on top.
- Woody bracket, E = 500 MPa (dried-mycelium figure [54], an upper bound for living tissue),
  rho = 500, h = 30 mm, a = 100 mm: about 800 Hz. Speculative; brackets are clamped along one
  edge, which changes the mode set.

### 4.4 Energy and loudness of discharge events

**Ballistospore.** Spore about 10 x 6 um, mass about 2 x 10^-13 kg, launch speed about 1 m/s
[16][17]: kinetic energy 10^-13 J. Surface energy available in a 2.5 um Buller's drop, 4 pi
r^2 x 0.072 = 6 x 10^-12 J. At 3 x 10^4 launches per second the cap's mechanical output is
about 3 x 10^-9 W. If all of it became sound (it cannot), the level at 10 cm would be about
47 dB. The source is about 10 um across and acts over about 10 us (1 m/s reached at 10^5
m/s^2), so its content is near 100 kHz where the wavelength is 3 mm; such a small source
radiates with an efficiency of order (2 pi a / wavelength)^3, about 10^-5. Result: of order
**-3 dB SPL, ultrasonic**. Inaudible, in agreement with Buller [1].

**Pilobolus.** Sporangium about 0.4 mm across, mass about 3.4 x 10^-8 kg, 9 m/s [15]: kinetic
energy 1.4 x 10^-6 J. Hitting glass, an audible tap is expected, as reported.

**Cup-fungus puff.** 10^4 to 10^5 spores of about 2 x 10^-13 kg at about 10 m/s: 10^-7 to
10^-6 J in under a second, about 2 x 10^-6 W. With an acoustic efficiency of 10^-4 to 10^-3
(the jet is millimetres to centimetres across, so far better coupled than a single spore),
the level at 5 cm is roughly 40 to 50 dB SPL: a faint hiss with the ear close, in a quiet
room. Consistent with the anecdotes; efficiency is a guess.

**Hyphal tip burst.** Elastic energy in a 100 um compartment: 0.5 x P x dV, with dV about 25%
of 2 x 10^-15 m^3: about 10^-10 J, released into liquid. Undetectable in air; consistent with
the null result of [3].

### 4.5 Modes from the graph

For a network with N nodes: build K (edge stiffness or conductance) and M (node mass or
volume), solve K v = lambda M v. Diffusive reading (physically right for pressure): each mode
decays at rate lambda_k, a bank of one-pole low-pass filters. Wave reading (design choice):
omega_k = sqrt(lambda_k), rescaled to a chosen fundamental. A chain of n equal edges gives
lambda_k proportional to 4 sin^2(k pi / 2n), close to a harmonic series at low k under the wave
reading; branching and loops make the series inharmonic, so "a cord sounds like a string, a
mat sounds like a gong" follows from the mathematics. Cost: Lanczos for 64 modes on a sparse
graph of 10^4 nodes is a few hundred sparse multiplies, fine at a control rate in a worker.

## 5. What the simulators must expose

**Principles.**

1. Record in simulation time (float64 seconds). Never bake in a speed-up or a sample rate.
2. Because runs are seeded and repeatable, the smallest complete recording is species + seed +
   settings + tap list; everything else can be regenerated at any rate.
3. Continuous taps carry a unit, a native rate in sim-Hz and a position. Events carry time,
   type, position, node or edge id and a magnitude.
4. Audio code will turn events into band-limited impulses and resample continuous taps, so the
   engines need no audio awareness beyond accurate time stamps (sub-step where possible).

**Continuous taps.**

| Name | Quantity | Unit | Native rate (sim time) |
|---|---|---|---|
| `tips.count` | active tips | count | per step |
| `length.total` | total hyphal length | um | per step |
| `front.speed` | mean front advance speed | um/s | 0.01 to 1 Hz |
| `front.radius` | colony radius by angular sector (8 to 64 sectors) | um | 0.001 to 0.1 Hz |
| `tip.speed[i]` | extension speed of a chosen tip, pulsing included | um/s | 1 to 10 Hz |
| `v.node[i]` | electrical potential at a chosen node | mV | 1 to 10 Hz (matches 1 Hz loggers) |
| `v.pair[i,j]` | potential difference between two "electrodes" | mV | 1 to 10 Hz |
| `p.node[i]` | turgor at a node | Pa | 10 to 1000 Hz (equilibrates in ms to s) |
| `flow.edge[e]` | volume flow through an edge or cord | um^3/s | 0.01 to 1 Hz |
| `conc.node[i]` | internal nutrient concentration (carries the 11 to 16 h oscillation) | mol/um^3 | 0.001 to 0.01 Hz |
| `field.sample[x]` | substrate nutrient, moisture, temperature at a point | mol/um^3, fraction, K | 0.001 to 0.1 Hz |
| `ca.tip[i]` | tip calcium (if modelled) | mol/um^3 | 1 to 10 Hz |
| `spore.rate[f]` | discharge rate of a fruit body | events/s | 0.01 to 1 Hz |
| `fruit.size[f]` | cap radius, cap thickness, stipe length and radius | um | 0.001 Hz |
| `fruit.turgor[f]` | tissue turgor or water content (sets modulus) | Pa | 0.001 to 0.01 Hz |
| `graph.modes` | lowest 32 to 128 eigenvalues, plus mode shapes at tap nodes | 1/s (declared scaling) | 0.001 to 0.1 Hz |
| `graph.stats` | nodes, edges, loop count, mean degree, cord-width histogram | counts, um | 0.001 to 0.1 Hz |
| `scan.path[k]` | a state variable sampled along an ordered node path (64 to 1024 points) | as the variable | 0.1 to 10 Hz |
| `env.*` | temperature, humidity, rain, light, season phase | K, fraction, um/s, W/m^2 | driver rate |
| `stim.in` | (input) mechanical or acoustic stimulation at a point | Pa or m/s^2 | host rate |

**Events** (time, type, x, y, z, id, magnitude):

| Type | Magnitude | Note |
|---|---|---|
| `branch` | parent width, branch angle | apical or lateral flag |
| `fusion` | widths of both hyphae | marks a new loop; triggers a mode recompute |
| `tip_stop` / `tip_death` | age | |
| `tip_pulse` | step size, um | optional; high volume |
| `spike` | amplitude mV, duration s | plus node of origin; propagation as arrival events at taps |
| `cord_thicken` / `edge_recycle` | new width | remodelling |
| `burst` | released volume, turgor | tip lysis under osmotic shock |
| `primordium`, `fruit_stage` | stage id | |
| `spore_discharge` | count in batch, launch speed | batched: one event per step with a count, since single events reach 3 x 10^4 per second |
| `puff` | spore count, duration | cup fungi; `sporangium_launch` and `sporangium_impact` for *Pilobolus* types |
| `substrate_crack` | energy, J | wood or soil fracture during decay, drying, emergence |
| `rain_onset`, `frost`, `contact` | intensity | external triggers |

**Recording format.**

- **Events:** append-only binary records (float64 time, uint8 type, uint32 id, three float32
  position, two float32 magnitudes: 32 bytes), with a JSON Lines export for inspection.
- **Continuous taps:** one stream per rate group, float32 samples with float64 start time and
  period. Export as 32-bit float WAV (multichannel; float WAV preserves DC and values beyond
  1.0) with the nominal sample rate equal to the tap's native rate times the chosen speed-up,
  plus a JSON sidecar: channel names, units, scale, sim-seconds per sample, species, seed,
  engine version. Do not high-pass or normalise at record time.
- **Graph snapshots:** the JSON network save at chosen times, so modal or waveguide models
  can be rebuilt offline.
- **For the plugin:** the same tap names become modulation sources and the event stream
  becomes trigger buses. Flat, named, ranged, as the plan already requires.

## 6. Open or contested points

1. **No acoustic measurement of any fungal sound exists that I could find.** Puffing and
   *Pilobolus* rest on listening reports from 1909 and earlier, plus casual video. A microphone
   beside a puffing *Peziza* would settle the spectrum and level in an afternoon.
2. **Are extracellular spikes biological?** Contested [12]. Amplitudes sit close to electrode
   drift levels, and the dramatic early intracellular result (0.5 to 5 Hz) is unreplicated.
3. **Ultrasound from mycelium:** one null study, during dehydration only [3]. Growth,
   wounding and osmotic shock are untested as far as I found.
4. **Sound as a stimulus:** effects reported in both directions, weak designs, no mechanism.
5. **Mushroom tissue mechanics** are thinly measured: I found one modulus figure with the
   species unconfirmed, no sourced density, no damping. Modal estimates may be off by 3x.
6. **Branch and fusion rates** per tip are estimated here, not sourced; topics 1 and 2 should
   supply them.
7. **Circadian clocks in mushroom-forming fungi** and diurnal spore-release rhythms: not
   verified here.
8. **Transport oscillations** [33][34][35] are known for one species from one laboratory.
9. **Honest labelling.** Apart from a puff, a *Pilobolus* tap and substrate cracking, every
   sound this project makes will be sonification or physically inspired synthesis. The eigen
   modes of an overdamped network are relaxation rates; calling them pitches is a mapping.

## 7. Sources

"Read" = I opened the text (through a fetch tool that summarises pages, so quoted wording
should be rechecked before publication). "Summary only" = seen in a search-result summary or
abstract. "Cited only" = known through another source.

1. Buller, A.H.R. (1909). *Researches on Fungi*, vol. 1, Part II ch. II. Longmans, Green.
   https://archive.org/details/researchesonfung01bull . **Read** (chapter text via archive.org
   full text).
2. "Hissing mushrooms, no lie" (2011), Mycologista blog (*Urnula craterium* video).
   https://mycologista.blogspot.com/2011/06/hissing-mushrooms-no-lie.html . **Read.** Anecdote.
3. Phillips, N., Remedios, S.W., Nikolaidou, A., Baracskai, Z., Adamatzky, A. (2023). No
   ultrasounds detected from fungi when dehydrated. *Ultrasonics* 135:107111.
   doi:10.1016/j.ultras.2023.107111 . **Summary only** (repository page refused the fetch).
4. Robinson, J.M. et al. (2024). Sounds of the underground reflect soil biodiversity dynamics
   across a grassy woodland restoration chronosequence. *J. Applied Ecology* 61(9).
   doi:10.1111/1365-2664.14738 . **Summary only.**
5. Maeder, M. et al. (2022). Temporal and spatial dynamics in soil acoustics and their relation
   to soil animal diversity. *PLOS ONE*; and press coverage of soil ecoacoustics (Knowable
   2022, Phys.org 2024). **Summary only.**
6. Noguchi, M. et al. (1992). Acoustic emission monitoring during partial compression to detect
   early stages of decay. *Wood Science and Technology* 26. doi:10.1007/BF00200163 . **Summary
   only.**
7. Ponomarenko, A. et al. (2014). Ultrasonic emissions reveal individual cavitation bubbles in
   water-stressed wood. *J. R. Soc. Interface* 11:20140480. **Summary only.**
8. Money, N.P. (2011). *Mushroom* (Oxford University Press), excerpt at NPR.
   https://www.npr.org/2012/01/18/145395705/excerpt-mushroom . **Summary only.**
9. Review in PMC stating 30,000 basidiospores per second for a gilled mushroom (PMC4624964).
   **Summary only**; full reference not confirmed.
10. Nayar, T. "A field guide to making plant and mushroom music", Modern Biology Substack;
    interview in *The Scientist*, "Mushroom music: tuning into nature's bioelectric rhythms".
    https://www.the-scientist.com/mushroom-music-tuning-into-nature-s-bioelectric-rhythms-73646
    **Summary only.**
11. Prime, M. (2000). *L-Fields* (recording) and artist pages, e.g.
    https://tang.skidmore.edu/exhibitions/87-elevator-music-18-michael-prime-l-fields .
    **Summary only.**
12. Blatt, M.R., Pullum, G.K., Draguhn, A., Bowman, B., Robinson, D.G., Taiz, L. (2024). Does
    electrical activity in fungi function as a language? *Fungal Ecology* 68:101326. **Summary
    only** (abstract and Language Log commentary, https://languagelog.ldc.upenn.edu/nll/?p=62109).
13. "Upon the audibility of spore discharge in *Helvella elastica*" (1917).
    https://zenodo.org/records/1525904 . **Title only**; author not confirmed.
14. Roper, M., Seminara, A., Bandi, M.M., Cobb, A., Dillard, H.R., Pringle, A. (2010).
    Dispersal of fungal spores on a cooperatively generated wind. *PNAS* 107:17474-17479.
    doi:10.1073/pnas.1003577107 . **Summary only** (full-text fetch failed).
15. Yafetto, L. et al. (2008). The fastest flights in nature: high-speed spore discharge
    mechanisms among fungi. *PLoS ONE* 3:e3237. doi:10.1371/journal.pone.0003237 . **Summary
    only** (numbers from the paper's results as quoted in search output).
16. Pringle, A., Patek, S.N., Fischer, M., Stolze, J., Money, N.P. (2005). The captured launch
    of a ballistospore. *Mycologia* 97:866-871. **Summary only.**
17. Noblin, X., Yang, S., Dumais, J. (2009). Surface tension propulsion of fungal spores.
    *J. Exp. Biol.* 212:2835-2843. **Summary only.**
18. Iapichino, M., Wang, Y.-W., Gentry, S., Pringle, A., Seminara, A. (2019/2021). A precise
    relationship among Buller's drop, ballistospore and gill morphology. arXiv:1904.08127.
    **Summary only.**
19. Raczkowski, J. et al. Detection of early stages of wood decay by acoustic emission
    technique. **Summary only**; year and journal not confirmed.
20. Moore, D., Robson, G., Trinci, A. *21st Century Guidebook to Fungi*, section 13.3.
    https://davidmoore.org.uk/21st_Century_Guidebook_to_Fungi_PLATINUM/Ch13_03.htm . **Summary
    only.**
21. Wikipedia, "Coprinus sterquilinus" (citing Buller 1931). **Summary only.**
22. Robinson, J.M., Annells, A., Cando-Dumancela, C., Breed, M.F. (2024). Sonic restoration:
    acoustic stimulation enhances plant growth-promoting fungi activity. *Biology Letters*
    20:20240295. doi:10.1098/rsbl.2024.0295 . https://pmc.ncbi.nlm.nih.gov/articles/PMC11444772
    **Read.**
23. "Experimental investigation on the effects of audible sound to the growth of *Aspergillus*
    spp." (2009). *Modern Applied Science* 3(4):137.
    https://ccsenet.org/journal/index.php/mas/article/view/1264 . **Summary only.**
24. Study of 50 to 750 Hz sound on *Pleurotus* yields (2026), reported in search output as
    *Microbiological Methods*. **Summary only**; reference not confirmed.
25. "Enhancing growth and yield of grey oyster mushroom (*Pleurotus sajor-caju*) using sound
    treatment at different intervals" (2017). *AIP Conf. Proc.* doi:10.1063/1.5002248 .
    **Summary only.**
26. Adamatzky, A. (2018). On spiking behaviour of oyster fungi *Pleurotus djamor*. *Scientific
    Reports* 8:7873. https://pmc.ncbi.nlm.nih.gov/articles/PMC5959856/ . **Read.** Also my
    source for Slayman, Long and Gradmann (1976) and Olsson and Hansson (1995,
    *Naturwissenschaften* 82:30-31), both **cited only**.
27. Adamatzky, A. (2022). Language of fungi derived from their electrical spiking activity.
    *R. Soc. Open Science* 9:211926. https://pmc.ncbi.nlm.nih.gov/articles/PMC8984380/ . **Read.**
28. Adamatzky, A., Gandia, A. (2022). Fungi anaesthesia. *Scientific Reports* 12:340.
    https://pmc.ncbi.nlm.nih.gov/articles/PMC8748941 . **Read.**
29. Fukasawa, Y. et al. (2024). Electrical integrity and week-long oscillation in fungal
    mycelia. *Scientific Reports* 14:15601. https://pmc.ncbi.nlm.nih.gov/articles/PMC11227530/
    **Read.**
30. Fukasawa, Y. et al. (2023). Electrical potentials in the ectomycorrhizal fungus *Laccaria
    bicolor* after a rainfall event. *Fungal Ecology*. **Summary only** (press release).
31. Lopez-Franco, R., Bartnicki-Garcia, S., Bracker, C.E. (1994). Pulsed growth of fungal
    hyphal tips. *PNAS* 91:12228-12232. https://pmc.ncbi.nlm.nih.gov/articles/PMC45410 .
    **Read** (abstract).
32. Takeshita, N. et al. (2017). Pulses of Ca2+ coordinate actin assembly and exocytosis for
    stepwise cell extension. *PNAS* 114:5701-5706. **Summary only**; period not verified.
33. Tlalka, M., Watkinson, S.C., Darrah, P.R., Fricker, M.D. (2002). Continuous imaging of
    amino-acid translocation in intact mycelia of *Phanerochaete velutina* reveals rapid,
    pulsatile fluxes. *New Phytologist* 153:173-184. **Summary only.**
34. Tlalka, M., Hensman, D., Darrah, P.R., Watkinson, S.C., Fricker, M.D. (2003). Noncircadian
    oscillations in amino acid transport have complementary profiles in assimilatory and
    foraging hyphae of *Phanerochaete velutina*. *New Phytologist* 158:325-335. **Summary only.**
35. Tlalka, M., Bebber, D.P., Darrah, P.R., Watkinson, S.C., Fricker, M.D. (2007). Emergence of
    self-organised oscillatory domains in fungal mycelia. *Fungal Genetics and Biology*
    44:1085-1095. **Cited only** (could not open).
36. Heaton, L.L.M. et al. (2010). Growth-induced mass flows in fungal networks.
    arXiv:1005.5305. **Summary only.**
37. "Cytoplasmic streaming in *Neurospora*: disperse the plug to increase the flow?" *PLoS
    Genetics* commentary (PMC2694278). **Summary only.**
38. Hickey, P.C., Dou, H., Foshe, S., Roper, M. (2016). Anti-jamming in a fungal transport
    network. arXiv:1601.06097. **Read** (abstract); speeds from search output.
39. Darrah, P.R., Tlalka, M., Ashford, A., Watkinson, S.C., Fricker, M.D. (2006). The vacuole
    system is a significant intracellular pathway for longitudinal solute transport in
    basidiomycete fungi. *Eukaryotic Cell* 5:1111-1125.
    https://pmc.ncbi.nlm.nih.gov/articles/PMC1489287 . **Read.**
40. *Neurospora* circadian reviews (e.g. PMC1450195, PMC20535). **Summary only.**
41. Time-lapse study of anastomosis in *Tuber borchii* (115 to 200 min per fusion). **Summary
    only**; reference not confirmed.
42. "The Symbiotic Biodata Sonification Midisprout board", HKU bookstack.
    https://bookstack.hku.nl/books/bio-data-sonification-using-midi/page/the-symbiotic-biodata-sonification-midisprout-board
    **Summary only.**
43. "MIDI Sprout helps plants play music" (2014), WPSU. **Summary only.**
44. "Plant music synthesizer: Tarun Nayar", Atlas Obscura. **Summary only.**
45. Miranda, E.R., Adamatzky, A., Jones, J. (2011). Sounds synthesis with slime mould of
    *Physarum polycephalum*. *J. Bionic Engineering* 8:107-113.
    https://uwe-repository.worktribe.com/output/962094 . **Summary only.**
46. Salvaggio, E. "Toward sympoietic mycomusicology".
    https://mail.cyberneticforests.com/toward-mycomusicology/ . **Read.**
47. "Listening to plants, or ourselves?", World Sensorium.
    https://worldsensorium.com/listening-to-plants-or-ourselves . **Summary only.**
48. Reader question on the PlantWave crowdfunding page about electrodes on an inert object, as
    relayed in search output. **Summary only**; weak source.
49. Zhao, L. et al. (2005). Elastic properties of the cell wall of *Aspergillus nidulans*
    studied with atomic force microscopy. *Biotechnology Progress* 21:292-299 (and a conference
    version giving 100 and 59 MPa). **Summary only.**
50. Chevalier, L. et al. (2023), as described in *Frontiers in Bioengineering and
    Biotechnology* (2024) doi:10.3389/fbioe.2024.1449167 . **Cited only.**
51. Money, N.P. (1990). Measurement of hyphal turgor. *Experimental Mycology* 14; Lew et al.
    (2004) on *Neurospora* and *Achlya*; Money (2004) Hyphal biomechanics, *Mycologist* 18.
    **Summary only.**
52. Bohdziewicz, J. Compression-test study of mushroom fruit bodies (0.5 and 0.3 MPa).
    https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-8bb4c8c2-307f-4680-aa54-65da0d0d33e2
    **Summary only**; species and year not confirmed.
53. McGarry, A., Burton, K.S. (1994). Mechanical properties of the mushroom, *Agaricus
    bisporus*. *Mycological Research* 98:241-245. **Summary only.**
54. van den Brandhof, J.G. et al. (2025). Characterization of pure mycelium materials from
    different mushroom-forming fungi; and review tables on mycelium composites. **Summary only.**
