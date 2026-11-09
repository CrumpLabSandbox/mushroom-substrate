# Calibration

2026-11-09. `node tools/calibrate.js` sets the engines the same tasks as published experiments and
writes `docs/calibration/results.json`; the site shows it at `calibration.html`. This note records
what the first run found and what was changed because of it.

## The result, read honestly

After fitting, **21 of 24** comparisons fall within the measured range. That number flatters the
model: 20 of the 24 had a value fitted to them, were derived from the same number, or check that
an input comes back out. Only **4 comparisons had nothing tuned to them, and 3 of those pass**.
There is no held-out data. Before any fitting, 8 of 24 were within range.

Several targets come from search summaries of papers that were not opened (marked in each row),
and the electrical recordings are themselves disputed.

## What the first run showed, and what was changed

| Finding | Cause | Change |
|---|---|---|
| Colony fronts 8 to 18% slower than measured in every fast species | Tips wander, so the front advances slower than the tips move; and the agar dish had patchy moisture | Agar is now evenly wet at the species' optimum. Effective tip speed is the species value × 1.15 in the 40K engine, one factor fitted to all nine front speeds |
| Oyster mushroom right at 20 and 30 °C, 18% low at 25 °C | Its temperature curve used a guessed minimum and maximum | Curve refitted to the three measured rates: optimum 28, minimum 8.5, maximum 33 °C. Two ratios cannot fix three values, so this is one of several curves that fit; all three are now marked inferred |
| Number of tips doubling every 8 h in the test organism, against 1.8 h measured | Branching was tied to laying a segment, so slow young branches barely branched; and one branch per segment | Branching now happens in time at rate E/G per tip, as the kinetics say; up to two branches per segment. Now 2.4 h: still a miss |
| 2 to 3 fusions per 8 branches, against 1 measured | Fusion probability 0.7 was a guess | 0.15 for every family, fitted to the test organism |
| Fruiting site mature in 1.9 days, against 4 to 5 | Draw rate was a guess | Draw rate refitted; now 5.0 days, at the edge of the range |
| Spike interval at the electrode 2 to 5 times the species' value | Only nodes whose first segment held a tip were driven, so few pacemakers and failed propagation | Every live node is now driven just into its rhythmic range, and nodes with a growing tip lead. One case was numerically unstable; the electrical step is now capped lower |
| Two stand-scale species did not spread at all | Upkeep was a fixed cost per day, which starved slow-growing species | Upkeep in the 4M engine scales with the species' growth rate |
| Log decaying at 0.015 per year, against about 0.06 | Amount of substrate in wood was arbitrary | Set so a colonised log gives about 0.09 per year |

## What still misses

- **Early branching** in the test organism: tips double every 2.4 h, not 1.6 to 2.0 h. Young
  branches start slow in the engine (a measured effect), and the measured doubling time already
  includes that, so the engine counts it twice.
- ***Schizophyllum commune* front** at 30 °C: 1% under the measured range.
- ***Coprinopsis* fruiting time**: 5.01 days against a 4 to 5 day range.

## What was not, and cannot yet be, compared

- **Network structure at the measured scale.** Loopiness is compared with networks ten times
  wider and weeks older. Link counts, the rise and fall of link number, cord widths and material
  per area have no engine at the right scale.
- **Transport speed.** It is an input.
- **Anything about most species.** The comparisons cover 14 species and one test organism.
- **Electrical activity as prediction.** The interval is an input; propagation speed has never
  been measured.
- **Fruiting triggers**, mushroom yields, spore numbers per species, and every 400K-specific
  behaviour (combat, depth, weather response).
- **Stand-scale behaviour** beyond three spread rates and one decay constant, two of which use
  tip speeds derived from the same field figures.

## Rerunning

```bash
node tools/calibrate.js
```

It takes about half a minute. It changes no parameter. Commit the new `results.json` with any
change to an engine or a species that moves a result.
