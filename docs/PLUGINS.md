# Mushroom plugins: plan

2026-11-09. A small exploratory plugin platform for the web, in the spirit of SynthLand Explorer,
where every synthesiser, atmosphere and effect is built on the mushroom models in this repo. Each
plugin has its own page, adjustable parameters and a way to hear or play it. A library page lists
them. Species are the presets.

## 1. Decisions (Matt's answers)

| Question | Answer |
|---|---|
| What sounds are allowed | **Anything traceable.** Every control that shapes the sound must trace to a named mushroom process or measurement. Each plugin is labelled by kind (below). No arbitrary sounds pinned to events |
| Families | **Playable instruments, atmospheres, effects.** (Rhythm and pattern plugins were not chosen) |
| Where the model comes from | **Hybrid.** Prebuilt specimen files for instant loading, plus a live mode that runs an engine in the browser where it matters |
| Control | **On-screen keys, computer keys and Web MIDI** (notes and controllers; Chrome and Edge) |

**Kinds**, shown on every plugin and in the library:

- **Physical model**: a body that can vibrate, driven by a force. The sound is the body's response.
- **Model signal**: something the model computes (a voltage, a rate) is used directly as the sound
  source or the oscillator. The wavetable is this kind.
- **Model as modulator**: a conventional sound path whose settings are moved by model quantities.

Every plugin page has a "what this traces to" table: each parameter, the process or measurement
behind it, and whether that number is sourced, inferred or assumed.

## 2. How it is built

```
plugins/
  index.html            the library: every plugin, filter by family and kind
  plugins.json          the manifest the library reads
  package.json          marks plugins/ as ES modules, so Node can run the sound code for tests
  kit/
    kit.js              builds a plugin page from a declaration: species presets, parameter panel,
                        keyboard, computer keys, Web MIDI, input sources for effects, meter, scope
    kit.css
    worklet-base.js     the audio thread wrapper every plugin shares
    dsp.js              shared sound parts: resonator banks, noise, envelopes, delay lines
    live.js             runs an engine in a worker and feeds a plugin as the network grows
  specimens/
    index.json          the species that have a specimen
    <slug>.json         one prebuilt specimen per species (section 3)
  <plugin-id>/
    index.html          the page
    plugin.js           the declaration: name, kind, parameters with their traces, the drawing
    dsp.js              the sound, as a plain module with no browser in it
    worklet.js          three lines joining dsp.js to the audio thread
tools/
  bake-specimens.js     grows each species locally and writes its specimen
  test-plugins.js       renders every plugin offline with several species: finite, audible, in range
```

- **The sound code has no browser in it.** Each `dsp.js` exports `create(sampleRate)` returning an
  object with `load(specimen)`, `set(param, value)`, `noteOn`, `noteOff` and `process(left, right,
  input)`. The page runs it in an AudioWorklet; the test tool runs the same file in Node. This is
  also the shape a later port to SynthLand's C++ cores would follow.
- **Plugins are outside the engines' byte limits.** Those limits are for the simulators.
- **State lives in the page address**, so a species and a set of parameter values can be linked.

## 3. Specimens: the prebuilt models

`node tools/bake-specimens.js` grows each species in the 400K engine on this machine and writes a
small file (aim: under 60 KB) holding what plugins need:

| Part | What it is | Used by |
|---|---|---|
| Identity | name, family, colours, fruit form and size, spike interval and amplitude, tip speed, growth unit, branch angle | everything |
| Stages | the network at 8 points in its growth: a reduced graph for drawing, and its modes as a web of taut strings (frequency, moving mass, how strongly each of six zones from centre to edge drives it, how strongly two microphones hear it) | resonator plugins, reverb |
| Wavetable | 64 cycles of the voltage between two electrodes across growth, as harmonics | wavetable and oscillator plugins |
| Curves | tips, length, flow, uptake, reserve and front radius over the run | atmospheres, modulation |
| Event rates | branches, fusions and abandonments per hour at each stage | atmospheres |
| Cap | lowest note and overtone set for the species' fruit form and size | cap plugins |

Baking is done locally because it is faster and repeatable (same seed, same specimen). All 90
species can be baked; the first batch covers the flagships and the species with their own data.

## 4. Real-time modelling

Three levels, and each plugin says which it uses:

1. **The model is the sound engine, at audio rate.** Resonator banks, strings and plates, and the
   electrical model itself run sample by sample. Turning a parameter changes the physics as you
   listen. Most plugins are this.
2. **A live engine at control rate.** `kit/live.js` runs the 40K or 400K core in a worker while
   you listen. As the network grows it sends new modes, events and curves, and the sound follows.
   Solving a network's modes takes 7 to 20 ms, so a growing network can retune a resonator several
   times a second. Used by the atmospheres and offered as a "grow live" switch on instruments.
3. **Prebuilt specimens.** Instant, repeatable, and the default.

To explore: how fast a live network can be allowed to change before retuning is heard as steps;
whether the electrical model can run at audio rate on a whole network graph (a few hundred nodes)
rather than a handful; and coupling in the other direction, where what you play becomes a force on
the model (a struck network's electrical drive, an input signal that feeds the fungus).

## 5. The catalogue

Kind: **P** physical model, **S** model signal, **M** model as modulator. Level is the real-time
level from section 4. Batch is build order.

### Playable instruments

| # | Plugin | Kind | What it is | Traces to | Level | Batch |
|---|---|---|---|---|---|---|
| 1 | **Hyphal Harp** | P | Pluck the network. Each note strikes the web of hyphae at a chosen distance from the centre; the web is resized so its lowest mode is the key you play, and its own mode ratios give the tone | network shape and cord thickness; turgor wave speed; stage of growth | 1, 2 | A |
| 2 | **Cap Drums** | P | Each key is a mushroom cap of a different size, struck by a raindrop. The fruit form sets the overtones: flat cap, bell, shelf, ball, cup, club | cap size and form; plate estimate from the research; drop momentum; wetness as damping | 1 | B |
| 3 | **Spike Table** | S | The wavetable synth: one cycle of electrode voltage per stage of growth, scanned as you hold a note | electrical model; growth | 3 | B |
| 4 | **Coupled Spikes** | S | The electrical model itself as the oscillator: a ring of excitable units run at audio rate, coupled as hyphae are. Keys set the rate; drive, coupling and recovery are the model's own constants | FitzHugh-Nagumo units, tip drive, coupling along hyphae; species spike interval as tuning ratio | 1 | B |
| 5 | **Turgor Bow** | P | The web bowed, not plucked: tips grow in pulses, and that stick-slip drive sustains the note | pulsed tip growth (2.7 to 14 per minute, contested); turgor; network modes | 1 | C |
| 6 | **Rhizomorph Bass** | P | One long cord as a string with thick and thin stretches, so waves partly reflect inside it | rhizomorph diameter profile; reflection from cross-section steps | 1 | C |
| 7 | **Fairy Ring** | P | A wave travelling round a ring whose circumference grows year by year; inner and outer fronts beat | ring radius and advance per year; band width | 1, 3 | C |
| 8 | **Gill Comb** | P | The gills as a row of thin plates: a comb of resonances that widens as the cap opens | gill count and spacing; cap expansion | 1 | D |

### Atmospheres

| # | Plugin | Kind | What it is | Traces to | Level | Batch |
|---|---|---|---|---|---|---|
| 9 | **Rain on Caps** | P | A patch of mushrooms in real rain, in real time: drops arrive at the true rate for the rainfall and each cap rings at its size | rainfall rate and drop size; cap sizes of the species; wetness | 1 | A |
| 10 | **Forest Floor** | P | A colony growing live: the web struck by its own growth, caps forming, rain, seasons. The time-lapse listening page, made endless and adjustable | all growth events as forces; live engine | 2 | C |
| 11 | **Spore Cloud** | P/S | The hiss of spores leaving: tens of thousands of launches a second shaking the cap, coloured by cap and gills, drifting as they disperse | spore rate and launch speed; humidity; dispersal distance | 1 | B |
| 12 | **Spike Chord** | S | Several species' measured spike intervals under one speed-up become one chord: the intervals between the notes are the ratios in the data | measured spike intervals per species | 1 | B |
| 13 | **Decay** | P | A fallen log over years as a struck wooden bar whose stiffness and weight fall as it rots; white rot and brown rot fall differently | decay constant; what each rot removes | 1, 3 | C |
| 14 | **Foraging** | P | A cord-former searching soil for wood, live: quiet exploration, then the route to a find thickening and the rest dying back | 40K engine: flow, thickening, pruning | 2 | C |
| 15 | **Combat Zone** | P | Two individuals meeting: two webs with different notes, the barrier forming between them | rival meetings, barrier, replacement | 2 | D |
| 16 | **After Rain** | S | The burst of electrical activity after rain, spreading down from the surface | rain-driven excitation; soil wetting | 1, 2 | D |

### Effects

Each takes sound in: a built-in test source, a file you drop on the page, or the microphone.

| # | Plugin | Kind | What it is | Traces to | Level | Batch |
|---|---|---|---|---|---|---|
| 17 | **Mycelium Reverb** | P | Your sound shakes the network and you hear it ring: the room is a fungus. Species and stage of growth set its colour | network modes; microphone positions; damping | 1, 2 | A |
| 18 | **Cord Delay** | P | Echoes that travel the cords: delay times from cord lengths, reflections from where thick meets thin | cord lengths and cross-sections; transport speed | 1 | B |
| 19 | **Excitable Gate** | S | A gate that behaves like an excitable cell: sound above threshold fires a spike, then it must recover before it can fire again | FitzHugh-Nagumo threshold and recovery | 1 | C |
| 20 | **Spore Granulator** | M | Cuts your sound into grains thrown like spores: rate from the discharge rate, length from flight time, scatter from how far spores land | spore rate, launch speed, landing distances | 1 | C |
| 21 | **Rot Filter** | M | A set of resonances that drift down and blur as decay proceeds | decay constant; rot type | 1 | D |
| 22 | **Soil Filter** | P | Sound heard through soil: duller with depth and with wetness | depth; moisture; soil layers | 1 | D |

## 6. What every plugin page has

- A species menu (the presets) and, where it applies, a stage-of-growth control.
- Its parameters, each with a unit and a one-line trace.
- For instruments: an on-screen keyboard, computer keys and MIDI. For effects: a choice of input.
- A drawing of the process that is making the sound, moving with it.
- A level meter and an oscilloscope.
- Its kind, its real-time level, and a plain statement of what is assumed.

## 7. Batches

- **A. The platform and one plugin per family.** Kit, specimen baker with the first twelve species,
  the library page, Hyphal Harp, Rain on Caps, Mycelium Reverb, and the offline test tool.
- **B. Six more:** Cap Drums, Spike Table (the wavetable page moved in), Coupled Spikes, Spore
  Cloud, Spike Chord, Cord Delay. Specimens for all 90 species.
- **C. Live modelling:** `kit/live.js`, then Forest Floor, Foraging, Turgor Bow, Rhizomorph Bass,
  Fairy Ring, Decay, Excitable Gate, Spore Granulator.
- **D. The rest:** Gill Comb, Combat Zone, After Rain, Rot Filter, Soil Filter.

A plugin is done when its page loads without errors, the offline test renders it finite and
audible for at least three species, every parameter has its trace, and it has a drawing.

## 8. Known limits, stated now

- **Nobody has listened to any of this yet.** Sound is checked by numbers and pictures on this
  machine. Matt's ears are the test.
- **Real hyphae and caps are too damped to ring.** Ring times are choices, on every plugin.
- **Most species are their family** (69 of 90 set no growth value of their own), so many presets
  differ mainly in size, fruit form and network stage.
- **Web MIDI does not work in Safari.**
- **The physical numbers for caps** (stiffness, density, thickness) are estimates from one
  research report, not measurements.
