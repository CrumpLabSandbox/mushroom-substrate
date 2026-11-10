# Overnight build: where it stands and what is left

Working notes for the session building the plugins while Matt sleeps (night of 2026-11-09). Delete
this file when everything in it is done.

**Matt's instruction:** build all the planned plugins, on Claude's own recommendations; stop if only
10% of usage is left (weekly usage was 67% when he said it; stop at 90%, check with the usage tool
after each batch). Nobody has listened to anything; say so in the morning report.

**Also built and pushed since (6):** Turgor Bow, Rhizomorph Bass, Fairy Ring (instruments, all playable by composers), Decay (atmosphere), Excitable Gate, Spore Granulator (effects). Still left in batch C: kit/live.js, Forest Floor, Foraging. Then batch D.

**Built and pushed (15):** Hyphal Harp, Cap Drums, Spike Table, Coupled Spikes (instruments); Rain on
Caps, Spore Cloud, Spike Chord (atmospheres); Mycelium Reverb, Cord Delay (effects); Spike Canon,
Hyphal Walk, Tip Chorus, Growth Form, Season Cycle, Spore Scatter (composers).

**How to add one:** `tools/new-plugin.sh <id> "<Name>" [composer]`, then write `dsp.js` and `def.js`
by hand (copy the shape of a neighbour), set `"built": true` in `plugins/plugins.json`, and for an
instrument add it to `plugins/kit/instruments.js` and `playable.js`. Check: `node tools/test-plugins.js`
(all lines must end `ok`), `node tools/build-site.js`, then load the page in the browser pane from a
local server on `_site` and look for console errors (an iframe loop from `/plugins/` works).
Commit and push after each batch. Shared parts are in `plugins/kit/dsp.js`: `Bank` (resonators),
`ownNotes`, `Notes`, `stageAt`, `fhnCycle`, `fhnStep`, `rng`, `soften`.

## Left to build

### Batch C
- **kit/live.js** and a "grow live" mode: run `engines/400k/core.js` (or 40k) in a Worker from the page,
  step it while sound plays, and every so often send the plugin fresh modes (use `sound/record.js`'s
  snapshot idea and `sound/resonator.js`) and the events of the last steps. In the audio thread the
  plugin receives them through `load`-like messages. Simplest route: the page worker posts
  `{ live: { stage: {hz, mass, zone, mic, xy, edges}, events: [[type, x, y, z], ...], taps } }` and the
  kit forwards it to the node as `{ live }`; `worklet-base` calls `d.live && d.live(msg)`.
- **Forest Floor** (atmosphere, P, live): the listening page's physical model made endless. Web bank
  retuned from each live stage; growth events strike it (one hypha's turgor force for a millisecond);
  caps appear on fruiting events and ring; rain. Controls: species, world, time-lapse speed, ring,
  rain, balance.
- **Foraging** (atmosphere, P, live): 40K engine in the wood-blocks world. Same striking, plus cords:
  thick-cord count and flow drive a sustained tone from the web's low modes, so finding wood is heard
  as the route swelling.
- **Turgor Bow** (instrument, P): sustained web. Excite the harp's modal bank with a stick-slip drive:
  pulses at the pulsed-growth rate (measured 2.7 to 14 per minute, contested; sped up to a bow rate
  slider) with jitter, each a small strike; pressure = turgor scales strike size.
- **Rhizomorph Bass** (instrument, P): one long string as a delay-line waveguide with two or three
  scattering points where cross-section steps (reflection = (A1 - A2)/(A1 + A2)); pluck position;
  thickness profile from the species' `cord_max`. Low register.
- **Fairy Ring** (instrument, P): a ring waveguide (circular delay line) whose circumference is the
  ring's size: key sets the fundamental; "years" control grows the ring so pitch falls; two fronts
  (inner, outer) slightly detuned by the band width beat against each other.
- **Decay** (atmosphere, P): a log as a struck bar (bar overtones 1, 2.76, 5.4, 8.93). Over a chosen
  time its stiffness and density fall with rot: pitch goes as sqrt(stiffness/density). White rot
  removes both together (pitch falls slowly, ring shortens); brown rot removes cellulose and keeps
  lignin, so stiffness falls much faster than weight (pitch drops sharply, then it cracks: small
  random strikes). Decay constant from research/06 (about 0.06 per year at 10 C, doubling or more
  per 10 C).
- **Excitable Gate** (effect, S): envelope follower feeds one FitzHugh-Nagumo unit as its drive; the
  unit's spike (v above 1) opens a gate on the input; recovery sets how soon it can fire again.
  Controls: threshold (drive scaling), recovery, how long a spike holds open, mix.
- **Spore Granulator** (effect, M): record input into a 2 s buffer; launch grains at the spore rate
  (scaled down), each grain's length the flight time (range = launch speed x Stokes time: 0.004 to
  1.8 mm, so sub-millisecond to tens of ms, scaled), read position scattered by the landing rule
  d = reach * u / (1.02 - u), pan by wind.

### Batch D
- **Gill Comb** (instrument, P): gills as N thin plates of slightly different length: a comb of
  resonances, spacing set by gill count; cap opening control spreads them.
- **Combat Zone** (atmosphere, P): two specimens loaded (second species menu needed: kit option
  `second: true`), two web banks struck alternately at rates from their event rates; where they meet
  both are damped (barrier). Meeting rate from combat scores (not in specimens: add to bake, or use
  0.5).
- **After Rain** (atmosphere, S): a chain of FHN units from surface to depth; rain excites the top
  and the wave travels down; heard through Coupled-Spikes-style audification at a chosen speed-up.
- **Rot Filter** (effect, M): a bank of bar resonances that the input drives, drifting down and
  blurring with a decay amount control (same rot model as Decay).
- **Soil Filter** (effect, P): one-pole low-pass cascades for depth (more depth, lower cutoff) and
  wetness (wetter, more damping), with a short delay for travel time at about 150 m/s.

### Then
- Update `docs/PLUGINS.md` (mark what is built, note anything dropped or changed), `notes.md`,
  `plugins/plugins.json`; remove this file; final `node tools/test-plugins.js`; push; confirm the
  deploy; write the morning report (what was built, what was checked, what nobody has heard).
