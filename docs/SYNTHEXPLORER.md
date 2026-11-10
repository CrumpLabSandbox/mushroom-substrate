# Taking the mushroom plugins into SynthLand Explorer: suggestions

2026-11-10. Matt asked how the mushroom plugins could be packaged into SynthLand Explorer
efficiently, perhaps as one "mushroom world" plugin instead of many. This is a set of suggestions
with one recommendation. Nothing in SynthLand has been touched. I read SynthLand's `CLAUDE.md`,
`docs/skin-bridge.md`, `docs/wasm-abi.md`, the Nature plan (`docs/plans/endless-spa-nature.md`), the
Stem Console plan and `docs/plugin-codes.md` as they stood on 2026-11-09.

A working draft of the recommendation is on the site:
[plugins/mushroom-world](https://crumplabsandbox.github.io/mushroom-substrate/plugins/mushroom-world/).

## 1. What there is to package

| | Count | Where |
|---|---|---|
| Playable instruments | 8 | `plugins/<id>/dsp.js` |
| Atmospheres | 8 | (Combat Zone needs two species) |
| Effects | 6 | |
| Composers | 6 | play any instrument |
| Symphonies | 6 | several composers on a console |
| Species | 90 real, 25 invented | `plugins/specimens/<size>/<slug>.json` |
| Sizes of simulator | 4 | 4K, 40K, 400K, 4M |

The sound code is small: 1,760 lines of JavaScript for all 28 plugins and 260 more for the shared
parts, the console, the symphony engine and Mushroom World. The data is the large part: 115 species
at four sizes is 25 MB of JSON.

## 2. The options

| Option | Plugin codes | Skins | What the player sees | Verdict |
|---|---|---|---|---|
| **A. One plugin, Mushroom World** | 1 | 1 | One instrument with voices, an atmosphere, an effect and composers inside, as Nature holds its voices | **Recommended** |
| **B. A plus a thin effect plugin** on the same core | 2 | 2 (the second small) | A, and the six effects usable on any track | Recommended as the second step |
| C. Mushroom atmospheres as **Nature voices** | 0 | 0 | Forest Floor, Rain on Caps and others appear inside Nature | Cheap and a good fit; do after A |
| D. A **wavetable pack** only | 0 | 0 | 115 species of tables in the existing wavetable plugins | A day's work; worth doing first |
| E. All 34 as separate plugins | 34 | 34 | A long list | Not recommended |

### A. One plugin: Mushroom World (recommended)

SynthLand already has the pattern. Nature is one plugin that links several voice engines into one
core, exposes a fixed parameter list to the host and puts the choice of voice in data. Mushroom
World is the same shape:

- **The world** is a species and a size of simulator (two `choice` parameters), and three controls
  that move every part at once: growth, wetness and warmth.
- **Two voices**, each one of the eight instruments, each played from the keys or by one of the six
  composers.
- **An atmosphere** underneath and **an effect** the voices are sent through.
- **A console**: four stems to a master with a loudness target and a limiter.

The draft on the site is this, working, with 261 parameters and 18 presets. Its parameter table is
generated from the separate plugins' declarations (`tools/build-world.js`), so adding a control to
one plugin adds it to Mushroom World.

Why one plugin and not many:
- One plugin code, one skin, one set of tests, one entry in the library.
- The species and scale are chosen once and shared, which is the point of the collection.
- The instruments are small. Each is a few dozen lines around the same shared parts.

What it costs: the world controls and the slots are new design, about the size of Nature's v1.

### B. A thin effect plugin on the same core

A JUCE plugin is a synth or an effect, not both, so the six effects inside Mushroom World cannot be
put on another track. A second manifest (`kind: effect`) bound to the same core in an effect mode
gives that: species, scale, one effect, its controls. SynthLand's rule that a plugin is thin and
binds a manifest to an engine makes this cheap once the core exists.

### C. Atmospheres as Nature voices

Nature's voice contract (its plan, section 2.2) lets any core become a voice by declaring how it
answers the world: weather, wind, time of day, temperature, activity. The mushroom atmospheres
answer the same things:

| Atmosphere | Weather | Temperature | Time of day | Activity |
|---|---|---|---|---|
| Rain on Caps | rain rate | | | |
| After Rain | when it rains | firing rate | | |
| Spore Cloud | humidity | | day and night swing | spore rate |
| Decay | rain | pace of rot | | |
| Forest Floor | rain, wet ground | | | growth speed |

So a mushroom floor could sit under Nature's forest and rain with no new plugin. This needs the
same C++ core as A, so it comes after A.

### D. A wavetable pack

Spike Table's tables are already in the shape of SynthLand's wavetable engine (64 frames of 2,048
samples). `tools/make-wavetable.js` writes them. A pack of 115 species needs no new engine at all.
It is only one of the 28 sounds, but it could be in SynthLand within a day. Note that only the 400K
and 4M sizes have an electrical model; the smaller sizes fall back to one excitable unit.

### E. All of them separately

Not recommended. It would take 34 plugin codes, 34 skins and 34 sets of golden renders, and the
species would have to be chosen again in each.

## 3. What the port involves

SynthLand's engines are C++ compiled for the plugin and to WebAssembly for the web. The mushroom
plugins are JavaScript. So everything below is a port, not a copy.

| Part | Size here | What SynthLand needs | Notes |
|---|---|---|---|
| Shared sound parts (`plugins/kit/dsp.js`) | 60 lines | New headers under `core/include/sl/`, one block per file: a modal bank, the excitable unit, a note holder | The modal bank is the heart of 15 of the 28 plugins |
| The 28 plugins' sound code | 1,760 lines | One core, `engines/mushroom/`, with a module per plugin | No allocation, locks or exceptions in `process`; some JavaScript here still builds small arrays in `view()` |
| Parameters | 261, generated | `params.json` with `group.name` ids | Ids here are already in that form (`hyphal_harp.ring`). Freeze them before release: SynthLand never renames a released id |
| Smoothing | none | Inside the engine | The JavaScript sets parameters at block edges |
| Seeds | every plugin is seeded | `setSeed` | Already repeatable; golden renders will work |
| Specimens | 25 MB of JSON | Bundled data, chosen by name through a `choice` parameter | See section 4 |
| Console | a JavaScript stand-in | Link the real `stems` core | The stand-in uses the Stem Console's control names and meter layout for the part it has |
| Pictures | `plugins/kit/pictures.js`, canvas | The skin may draw; it needs the engine's state | Through `telemetry` (256 numbers) or a `sl_call` with its own glue, as Nature has |
| Skin | `plugins/mushroom-world/skin/` | As it is, with the host's `bridge.js` | See section 5 |
| Presets | 18, in `presets/index.json` | `synthland.preset/1`, one file each | Already real units, choices by name, unlisted parameters at their defaults |

Two things do not carry over simply:

- **The live atmospheres.** Forest Floor and Foraging listen to a simulator running beside them.
  Here that is a browser Worker. In a plugin it would be the 400K engine ported to C++ (53 KB of
  JavaScript) on its own thread, handing results to the audio thread without locks. Suggested: leave
  them out of the first version, or drive them from the recorded event rates in the specimen, and
  say so.
- **The composers as MIDI.** Inside Mushroom World a composer plays a voice directly. A composer
  that sent MIDI out to other plugins would be more useful in a DAW and is a separate piece of work.

## 4. The data

A specimen is 55 KB at 400K. Half is the wavetable and most of the rest is the eight stages.

| Choice | Size of all 115 species | What is lost |
|---|---|---|
| As JSON, all four sizes | 25 MB | nothing |
| Binary, all four sizes: modes as floats, zone and microphone weights as bytes, 16 wavetable harmonics, drawing data quantised | about 3 to 4 MB (estimated, not built) | nothing audible, probably |
| Binary, 400K only | about 1 MB | the Scale switch |
| Grow at load | none shipped | needs the engines in C++, and seconds to minutes of growing |

Suggested: the binary pack with all four sizes. The Scale switch is central to the project and
should not be the thing dropped. If size matters more, ship the real species at all four sizes and
the invented ones at 400K only.

## 5. The skin

The draft panel was made to SynthLand's skin rules as I read them:

- A folder `skin/` with `index.html`, `skin.css`, `skin.js`, at a fixed size (1180 by 700).
- It loads `./bridge.js` first and talks only to `window.synthland`. Here `bridge.js` is a web
  stand-in; SynthLand's hosts supply their own.
- Theme colours as `--sl-accent`, `--sl-panel`, `--sl-text` and extra `--sl-*` tokens, set from the
  manifest. System fonts. Nothing fetched from the network by the skin.
- A look of its own: knobs are caps seen from below, with gills as ticks and a spore as the pointer;
  faders are a bead on a hypha; the panel's background is the chosen species' own network.
- Plain words for names. No trademarks.

Where it departs, to settle before a real build:

1. **Components.** The controls are the skin's own (`mw-knob`, `mw-choice`, `mw-fader`,
   `mw-keyboard`, `mw-meter`, `mw-preset-browser`) with the same attribute names as SynthLand's
   (`param`, `label`, `size`, `select`). SynthLand's rule is plain DOM plus the `@synthland/ui`
   components. Either restyle `sl-knob` to look like a cap, or allow a skin its own components.
2. **State for the pictures.** The skin asks `synthland.call('state')` for each part's view and the
   specimen. In SynthLand that is a `sl_call`, which only cores with their own glue have.
3. **Specimens.** The stand-in bridge fetches the specimen file for the picture. In SynthLand the
   engine holds the data and the skin must get what it draws through `call`.
4. **Height.** 700 is taller than Stem Console (640) and Nature (560).

## 6. A suggested order

1. **Wavetable pack** (option D). No new code in SynthLand. Proves the species names and the data path.
2. **Core headers and one instrument**: the modal bank, then Hyphal Harp as an ordinary SynthLand
   plugin with one species pack. This is where the port's real cost shows.
3. **Mushroom World** (option A): the core with all eight instruments, the world controls, the
   console (linking `stems`), the skin.
4. **Effects and atmospheres** into the core, then the thin effect plugin (option B).
5. **Composers**, inside Mushroom World.
6. **Nature voices** (option C).
7. **Live growth**, last.

## 7. Decisions for Matt

1. One plugin (A), or A with the effect plugin (B)?
2. Plugin code: `SLmy` was free in `docs/plugin-codes.md` on 2026-11-09 (`SLmw` is Modern Wave).
3. All four sizes in the plugin, or 400K only?
4. Do the 25 invented species go in? They are marked as invented everywhere here.
5. May the skin have its own components, or should it use `sl-knob` restyled?
6. SynthLand's repository is private and shared with Sam; this one is public. Nothing from SynthLand
   was copied here. The console in the symphonies is my own stand-in, written from the Stem
   Console's parameter list, because publishing its compiled engine on a public site was not mine to
   decide. Say if you want the real one used on the site.

## 8. What is not known

- Nobody has listened to any of this, so which of the 28 are worth porting is not known.
- The size estimate for the binary pack is an estimate.
- CPU: Mushroom World runs 25 to 70 times faster than real time in Node with three to five parts
  playing. That says nothing certain about the C++ core, but it is unlikely to be a problem.
- I have not checked the skin inside a JUCE web view.
