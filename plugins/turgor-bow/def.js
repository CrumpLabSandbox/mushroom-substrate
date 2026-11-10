import { drawNetwork } from '../kit/kit.js'
export const def = {
  id: 'turgor-bow', name: 'Turgor Bow', family: 'instrument', kind: 'P', keys: true, species: 'serpula-lacrymans',
  blurb: 'The web sustained, not plucked. Hyphal tips do not grow smoothly: they advance in pulses. Here that pulsing is the bow. While a key is held, small strikes arrive at the pulse rate, a little irregular, with a faint hiss of smaller yields between them, and the web rings on under them.',
  assumed: 'Pulsed tip growth is reported at 2.7 to 14 pulses a minute and is contested; here it is sped up by ear. That each pulse pushes on the web is an assumption. The web is the same bare, resized string web as the Hyphal Harp, and real hyphae are too damped to ring.',
  about: s => `${s.family} · the web's own modes at the chosen stage of ${s.grown.days} days of growth`,
  params: [
    { id: 'rate', label: 'Growth pulses', min: 2, max: 120, value: 24, unit: 'per s', trace: 'How often the tips pulse. Measured at 2.7 to 14 a minute; sped up here.', standing: 'sourced, contested, sped up' },
    { id: 'jitter', label: 'How irregular the pulses are', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'Real pulses are not evenly spaced.', standing: 'assumed' },
    { id: 'pressure', label: 'Turgor', min: .05, max: 1.5, value: .6, trace: 'The pressure inside the hyphae. More pressure, a harder push at each pulse.', standing: 'physics' },
    { id: 'stage', label: 'Stage of growth', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'Which snapshot of the network supplies the modes.', standing: 'from the model' },
    { id: 'pos', label: 'Where the tips are', min: 0, max: 1, value: .5, show: v => v < .2 ? 'centre' : v > .8 ? 'edge' : 'between', trace: 'Distance from the centre at which the pulsing acts. Tips are at the edge of a growing colony.', standing: 'from the model' },
    { id: 'own', label: 'Its own modes', min: 0, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'At 100% the overtones are the network\'s own; at 0% a plain string\'s.', standing: 'from the model' },
    { id: 'ring', label: 'Ring time', min: .05, max: 4, value: .8, unit: 's', trace: 'How long the web rings between pulses.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, params, view, t }) {
    const n = spec.stages.length - 1, st = spec.stages[Math.min(n, Math.floor(params.stage * n))], e = view ? view.energy : 0
    drawNetwork(g, st, 0, 0, w, h, spec.colours[0], (i, x, y) => Math.abs(Math.hypot(x, y) - params.pos) < .12 ? e * (.5 + .5 * Math.sin(t * params.rate + i)) : 0)
  }
}
