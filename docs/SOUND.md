# Sound

2026-11-09. The first sound work: a recorder, a synthesiser and a listening page. This is the start
of the goal in [notes.md](../notes.md), to hear what these networks would sound like, and it keeps to
what the research found ([research/07-sound-rhythm.md](research/07-sound-rhythm.md)):

- Mycelium makes no sound that anyone has measured. Nothing here is a recording or a physical
  prediction of sound.
- The rhythms are real in kind (growth, branching, flow, electrical spiking) but very slow. To be
  heard they must be sped up by thousands to millions of times.
- So every sound is a stated mapping with a stated speed-up, and the unscaled data is kept.

## The pieces

| File | What it does |
|---|---|
| `sound/record.js` | Runs the 400K or 4M engine and records, unscaled: four electrode voltages in millivolts at the electrical clock's rate, every growth event with its time and place, and the engine's signals once per step |
| `sound/synth.js` | Turns a recording into stereo audio from four layers, each with its own gain, and writes 32-bit float WAV |
| `sound/resonator.js` | Finds how a snapshot of the network would ring as a web of taut strings: its lowest modes |
| `sound/worker.js` | Runs the recorder off the main thread for the page |
| `site/listen.html` | Grow, record, play, see the waveform and spectrogram, change the mapping, save the WAV and the recording |
| `tools/render-audio.js` | The same from the command line: `node tools/render-audio.js 400k phanerochaete-velutina` writes a WAV and a JSON beside it into `sound/renders/` (not committed) |

The engines gained one thing for this: their electrical model can now run on its own
(`S.elec(m)`), with a callback per electrical sample, so a recorder can listen to a network for as
long as it likes between growth steps. Growth results are unchanged (the stored hashes still match).

## Two clocks

A growth step is minutes to a day long. One electrical sample is seconds to a minute long, and a
growth step holds far more electrical time than can be simulated sample by sample. So the recorder
alternates: grow one step, then listen for a fixed number of electrical samples (2,400 by default).
The recording therefore has two clocks, and it says so:

- **growth time**: how long the network grew for;
- **electrical time**: how long its activity was listened to in total, which is much less.

The synthesiser speeds each up by a different amount and reports both, for example: "Electrical
activity is sped up 648 thousand times, which puts one spike every 60 minutes at 180 Hz. Growth is
sped up 12 thousand times: 1.8 days in 12.4 seconds." Nothing is baked in: the recording holds
seconds and millivolts, and the speed-ups are properties of a render.

## The three layers

1. **Electrode voices.** Each electrode's voltage is played directly as a waveform (audification),
   resampled so that the species' spike interval lands at a chosen pitch. Electrodes are spread
   across the stereo field. Because the electrical model is a set of coupled oscillators with the
   growing tips running slightly fast, the voices beat against each other and shift as tips come
   and go. Species differ only if they are rendered at the same speed-up: at a fixed speed-up a
   species that spikes every 41 minutes sounds higher than one that spikes every 116.
2. **Growth events.** Each event is a short sound: branch (tick), fusion (knock), tip stopped,
   hypha abandoned (hiss), fruiting initial, mushroom mature (tone), rivals meeting (growl), rain
   (noise), spores, a spore founding an individual (chime). Position left to right gives the pan;
   depth gives the pitch, shallow higher and deep lower.
3. **Body drone.** A 55 Hz hum whose loudness follows flow through the network and whose upper
   harmonics follow the number of growing tips.

## The fourth layer: the network as a resonator

Added after the first three. `sound/resonator.js` treats a snapshot of the network as a web of taut
strings and works out how it would ring.

- **The physics.** A hypha is a tube held taut by its own turgor pressure, so its tension is
  pressure × cross-section and its mass per length is density × cross-section. Waves then travel
  along it at √(pressure ÷ density), about 22 m/s at 0.5 MPa, whatever its width
  ([research/07](research/07-sound-rhythm.md)). Thick cords are heavier and tighter, so a wave
  partly reflects where thick meets thin. The fungus is held still where it is anchored in its food.
- **The modes.** The recorder reduces the network to a graph of at most 170 nodes, eight or nine
  times during a run. For each, the resonator solves for the lowest 28 modes: a frequency and a
  pattern of movement over the nodes.
- **The sound.** Each growth event strikes the web at the node nearest to where it happened, with
  a strength set by the kind of event. Every mode it reaches rings and dies away. Four pickups at
  the electrode positions hear it, spread left to right.
- **Nothing is sped up, and no note is chosen.** A 1.8-day *Phanerochaete velutina* network in the
  block of soil starts with a lowest note near 2,800 Hz and ends near 90 Hz: the network's notes
  fall as it grows, and thick cords shift them. At stand scale the lowest notes are below hearing
  (a metre of cord has a lowest note of a few hertz), so the page has a size control that shrinks
  the resonating network; the factor is stated.
- **What is not real.** Hyphae do not ring. The same research estimates their motion is damped out
  almost at once, so the ring time (0.35 s by default) is a free choice, and the honest setting is
  near zero. The strings are also idealised: no soil around them, no bending stiffness, one
  pressure and one diameter for every species. Reducing the network to 170 nodes blurs its fine
  structure and cuts off its higher modes.

## Possible mappings

A mapping takes something the model produces and lets it control something you hear. What exists
is one choice per layer; these are the options.

**What the model can supply**

| Source | Kind | Natural pace |
|---|---|---|
| Electrode voltage (any number of electrodes, anywhere on the network) | continuous wave | minutes to hours per cycle |
| Electrical spikes (time and place of each) | events | very many |
| Branch, fusion, tip stopping, hypha abandoned | events with a place | tens to thousands per simulated hour |
| Fruiting: initial, abort, mature, rot; spores shed; a spore founding an individual | events with a place | a few per day to a few per year |
| Rivals meeting (barrier or replacement), rain | events | occasional |
| Tips, live length, reserve, uptake, flow, front radius, cord count, loopiness | slow curves | change over hours to months |
| Temperature, moisture, season | slow curves | daily and yearly cycles |
| Flow or reserve at one chosen place; flow reversing in a loop | curve at a point | hours |
| The network's shape: its modes, its number of loops, its depth profile, its cord widths | structure | changes as it grows |
| Fine-mycelium cover and wood left (stand scale) | slow curves | months to years |

**What a source can control**

| Target | Notes |
|---|---|
| The waveform itself (audification) | only for continuous waves; pitch follows the speed-up. Used for the electrode voices |
| When a sound happens | events placed by the growth speed-up. Used for the event layer and the resonator |
| Pitch | by depth (used), by distance from the centre, by branch order, by cord thickness, by local temperature; or quantised to a scale, which is a musical choice rather than a physical one |
| Loudness | by kind of event (used), by local flow or reserve, by cord thickness |
| Left-right position, or full surround | by where it happened (used) |
| Timbre: brightness, filter, noisiness | by tips (used in the drone), by moisture, by how starved the hypha is |
| Which resonator it excites, and where | the network's own modes (used), a single cord as a string, a mushroom cap as a drum (the research estimates 45 to 130 Hz), the soil block as a room |
| Rhythm or tempo | spike trains as pulses, growth steps as beats |
| A second synthesiser's controls | the route to the SynthLand plugin: curves and events become control signals, the network's modes become its oscillator bank |

**Four ways to put them together.** All four are built: the page's "way of listening" menu, or
`--way` on the command line.

| Way | What sounds | What is chosen |
|---|---|---|
| `faster`: as it is, faster | The electrode voltages as sound waves; every growth event as the same plain click, left to right where it happened | Only the two speed-ups |
| `instrument`: the fungus plays itself | The network as a web of taut strings. Growth strikes it, electrical spikes at the electrodes bow it, and each mushroom that matures is a drum pitched by its cap (about 90 Hz for 6 cm, from the research estimate) | The ring time; drum and strike loudness |
| `data`: data you can read by ear | One steady voice per individual: three octaves of pitch from its fewest to its most growing tips, loudness from feeding rate, brightness from temperature. Two notes a semitone apart when rivals meet, a bell for a mature mushroom, a hiss for rain | The whole mapping, but each part carries one quantity and says which |
| `music` | Events snapped to sixteenth notes at 96 beats per minute and a five-note minor scale. Depth picks the note, a fusion drops an octave, flow rising drives the kick, hyphae stopping or abandoned are the hi-hat, the key moves with temperature | Almost everything. The furthest from the model |
| `mix` | The four original layers with a volume each | Their balance |

Two individuals can be recorded together (a second species, or a spore-founded one at stand scale);
the `data` way gives each its own voice, left and right.

None of the four has been listened to. They were checked for being finite, not silent and within
level, and their descriptions are generated with the sound so the two cannot drift apart.

## What was checked

- A short recording renders to finite audio at a sensible level, and the electrode voices come out
  near the pitch asked for (`tools/test.js` checks this on every run; in a 12-second render aimed at
  180 Hz the strongest frequency was 175 Hz).
- The listening page grew, recorded and rendered a network and drew its waveform and spectrogram
  with no console errors.
- **Nobody has listened to it yet.** It was built and checked by numbers and pictures only.

## What it is not, and what comes next

- **Only the first step in physical modelling.** The network resonator exists; a mushroom cap as a
  drum (the research estimates heavily damped modes at 45 to 130 Hz) and the soil as a room do not.
- **Not live.** The page grows the whole run, then renders. The 4M engine's "listen" button is the
  only live sound, and it is cruder.
- **The electrical wave shape is the model's**, a relaxation oscillator, not a recorded shape, and
  the measurements behind its timing are disputed.
- **One species at a time**, one individual, four electrodes at fixed places.
- **Toward the SynthLand plugin:** the recorder and synthesiser are plain JavaScript with no page
  in them, and the recording is a defined data shape (meta, voltages, events, signals). A plugin
  could read a recording as it stands, or run the core and recorder itself; neither is built.
