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
| `sound/synth.js` | Turns a recording into stereo audio from three layers, each with its own gain, and writes 32-bit float WAV |
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

## What was checked

- A short recording renders to finite audio at a sensible level, and the electrode voices come out
  near the pitch asked for (`tools/test.js` checks this on every run; in a 12-second render aimed at
  180 Hz the strongest frequency was 175 Hz).
- The listening page grew, recorded and rendered a network and drew its waveform and spectrogram
  with no console errors.
- **Nobody has listened to it yet.** It was built and checked by numbers and pictures only.

## What it is not, and what comes next

- **Not physical modelling of sound.** The research's estimate is that hyphae cannot ring (pressure
  diffuses along them) and that a soft cap would have heavily damped modes at 45 to 130 Hz. None of
  that is used yet. A resonator built from the network's own structure is the obvious next layer.
- **Not live.** The page grows the whole run, then renders. The 4M engine's "listen" button is the
  only live sound, and it is cruder.
- **The electrical wave shape is the model's**, a relaxation oscillator, not a recorded shape, and
  the measurements behind its timing are disputed.
- **One species at a time**, one individual, four electrodes at fixed places.
- **Toward the SynthLand plugin:** the recorder and synthesiser are plain JavaScript with no page
  in them, and the recording is a defined data shape (meta, voltages, events, signals). A plugin
  could read a recording as it stands, or run the core and recorder itself; neither is built.
