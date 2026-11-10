# Sound

Revised 2026-11-09. Matt's rule for the sound work: **every sound comes from physical modelling.**
Nothing is assigned a sound. The earlier versions (event ticks, a drone, voltages played directly,
a data mapping, a musical mapping) were removed; they are in the git history.

What that means here: a sound exists only if there is a **body that can vibrate**, a **force the
simulation says acted on it**, and a **microphone** that hears it. The synthesiser renders exactly
that and nothing else.

It keeps to what the research found ([research/07-sound-rhythm.md](research/07-sound-rhythm.md)):
mycelium makes no sound that anyone has measured, and hyphae are too damped to ring. So this is
physical modelling of an idealised fungus, not a prediction of a real sound.

## The pieces

| File | What it does |
|---|---|
| `sound/record.js` | Runs the 400K or 4M engine and records, unscaled: every event with its time and place, electrode voltages in millivolts, the engine's signals each step, and the network as a small graph eight or nine times as it grows |
| `sound/resonator.js` | Finds how a network graph would ring as a web of taut strings: its lowest 28 modes, each with a frequency, a pattern of movement and the mass that moves |
| `sound/synth.js` | Drives the bodies with the recorded forces, hears them through two microphones, and writes 32-bit float WAV |
| `sound/worker.js` | Runs the recorder off the main thread for the page |
| `site/listen.html` | Grow, record, play, see the waveform and spectrogram, change the physical settings, save the WAV and the recording |
| `tools/render-audio.js` | The same from the command line: `node tools/render-audio.js 400k coprinopsis-cinerea` |

## The bodies

**The network, as a web of taut strings.** A hypha is a tube held taut by its own turgor pressure.
Its tension is pressure × cross-section and its mass per length is density × cross-section, so
waves travel along it at √(pressure ÷ density): about 22 m/s at 0.5 MPa, whatever its width.
Thick cords are heavier and tighter, so a wave partly reflects where thick meets thin. The fungus
is held still where it is anchored in its food. The recorder reduces the network to a graph of at
most 170 nodes and the resonator solves for its modes. A 4-day *Coprinopsis* colony in the block of
soil has a lowest note that falls from about 6,000 Hz to about 420 Hz as it grows.

**Each cap, as a small plate on a stem.** The research estimates a soft cap's lowest mode at 45 to
130 Hz. Here a cap of 3 cm radius has a lowest note of 90 Hz, rising as 1 ÷ radius (thickness is
taken as a quarter of the radius), with the overtones of a free round plate. A cap's notes fall
while it expands. A quarter of its mass (at 700 kg/m³) moves.

## The forces

| Force | On | What it is | Size |
|---|---|---|---|
| Growth | network | a branch breaking out, two walls dissolving in a fusion, a piece losing its turgor when abandoned or killed | one hypha's turgor force (0.5 MPa × the cross-section of a 5 µm hypha, about 10 µN) for 1 ms; a fusion is two |
| Growth | caps | the same small yields at random while the cap expands | 1,000 per second of real time (**assumed**) |
| Electrical | network | each spike at an electrode taken as a brief change of turgor there | 1% of turgor (**assumed**; no such pulse has been measured, and the spikes are disputed) |
| Spores | caps | each spore's launch pushing back on the cap | 30,000 spores a second at about 1 m/s, 2.6 × 10⁻¹³ N s each |
| Rain | caps | drops landing on the cap | 4 mm drops (34 mg) at 9 m/s; 5 mm of rain in an hour |
| Rain | network | drops on the ground reaching the hyphae beneath | the same drop, weakened by e^(−depth ÷ 5 mm) (**assumed**) |

A strike of impulse J at a node sets each mode moving at (the mode's movement at that node) × J ÷
(the mode's moving mass). The microphones hear velocity.

## Time

A strike rings at its real pitch for its real length. Only the schedule is compressed: days of
growth play in seconds, by one time-lapse factor for everything, reported with the sound (for
example "4.3 days in 16 seconds, 23 thousand times faster than life"). Electrical spikes are
placed at their real times under the same factor. Where that would put them faster than can be
placed (millions per second at stand scale), they are left out and the description says so.

## Loudness

The forces differ by many orders of magnitude, and in this idealised model so do the results. Each
force on each body is rendered separately, brought to an audible level, and mixed with a slider
per force and a network-or-mushrooms balance. The description lists every sound present and how
much quieter each really is in the model than the loudest, in decibels. In one run: rain on the
network loudest, growth on the network 42 dB below it, growth on the caps 66 dB, electrical on the
network 97 dB. Within one force on one body, relative loudness is the model's. Those differences
are properties of the idealisation (bare strings with almost no mass), not measurements.

## The microphones

Two, at the surface, a fifth of the way in from each side. A moving point is heard at
1 ÷ (1 + distance ÷ a tenth of the plot width). There is no soil or air in between: no absorption,
no delay.

## What is not physical

- **The ring.** Real hyphae and caps are damped almost at once. The ring time (0.35 s by default) is
  a free choice and the honest setting is near zero.
- **The strings are bare.** No soil loading them, no bending stiffness, one pressure and one
  diameter for every species.
- **The caps are plain plates.** No gills, no flesh, no stem movement.
- **Three assumed numbers:** how long a yield lasts (1 ms), how many yields a growing cap makes, and
  the pressure of a spike.
- **Tip growth itself makes no sound here.** Tips pulse as they grow (a measured, contested
  effect); the recording does not keep each segment laid, so that force is missing.
- **The graph is coarse.** 170 nodes blur fine structure and cut off higher modes.

## What was checked

- A short recording renders to finite sound at a sensible level, the network's modes are finite
  and rising, and every sound present names its force and its body (`tools/test.js`, every run).
- The listening page grew, recorded and rendered a network, drew its waveform and spectrogram and
  listed the sounds present, with no console errors.
- **Nobody has listened to it.** It was built and checked by numbers and pictures only.

## Wavetables (a separate thing, by Matt's suggestion)

Matt's idea: the voltage between two points on the network could be a morphing wavetable for a
wavetable synthesiser. It is built, and kept apart from everything above because it is **not
physical modelling**: the model's voltage is used directly as an oscillator's shape.

- `sound/wavetable.js` takes a recording and cuts one cycle of the voltage between two electrodes
  at each of 64 stages of the network's growth. Each cycle is resampled to 2,048 samples, closed
  into a loop (the second electrode need not repeat in exactly the first one's period), stripped of
  its mean, reduced to its first 512 harmonics and brought to full scale. If the two electrodes
  are exactly in step, so that their difference vanishes, that frame uses one electrode alone.
- The frames change because the electrical model is a set of coupled oscillators with the growing
  tips running slightly fast: two electrodes drift in and out of step as the network grows.
  Scanning the table replays that change; the played note sets the pitch.
- The shape is **64 frames × 2,048 samples, 512 harmonics a frame**, which is what SynthLand's
  wavetable engine uses for its own tables (`engines/wavetable/tables.json` there).
- `site/wavetable.html` grows a network, cuts the table, shows the frames, and plays it with a
  small wavetable oscillator (band-limited copies, eight notes, a keyboard, a scan position that
  can sweep through growth). The electrode pair and the electrical model can be changed.
- Two downloads: a mono 32-bit float WAV with the frames end to end and the `clm ` marker Serum and
  Vital read for the frame size; and a JSON with each frame's harmonic amplitudes and phases.
- `node tools/make-wavetable.js 400k phanerochaete-velutina` does the same from the command line.

What it is not: the cycle really lasts minutes to hours, the wave shape is the model's
(FitzHugh-Nagumo or integrate-and-fire), not a recorded one, and the spike recordings behind the
timing are disputed. The tables are fairly dark: most of the energy is in the first few
harmonics. Nothing imports the JSON into SynthLand yet.

## Toward the SynthLand plugin

The recorder, resonator and synthesiser are plain JavaScript with no page in them, and a recording
is a defined shape (meta, events, voltages, signals, network graphs). A plugin could load a
recording as it stands and use the network's modes as its resonator bank. Not built.
