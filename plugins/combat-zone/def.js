import { drawNetwork } from '../kit/kit.js'
export const def = {
  id: 'combat-zone', name: 'Combat Zone', family: 'atmosphere', kind: 'P', species: 'phanerochaete-velutina', second: 'trametes-versicolor',
  blurb: 'Two individuals growing toward each other. Each is a web with its own notes, struck by its own growth at its own rate, one to the left and one to the right. Where they meet, hyphae of both die and a barrier forms: a meeting strikes both webs at their edges at once and deadens them for a moment. Give one the advantage and it grows on while the other falls quiet.',
  assumed: 'The two webs are prebuilt, not growing live, and they do not really share a block of soil here. How often they meet and which has the advantage are set by hand; in the simulator the advantage comes from combat scores inferred from the published pecking order (cord-formers beat later colonisers, which beat pioneers).',
  about: s => `on the left: ${s.name}, ${s.family}`,
  params: [
    { id: 'stage', label: 'Stage of growth', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'How grown both networks are: their notes, and how many events an hour each has.', standing: 'from the model' },
    { id: 'pace', label: 'Time-lapse', min: 1, max: 400, value: 30, show: v => v.toFixed(0) + '× life', trace: 'How much faster than life. Each web is struck at its species\' own rate of branching and fusion at this stage.', standing: 'sped up' },
    { id: 'meet', label: 'How much of the two fronts touch', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'How often hyphae of the two individuals meet. Each meeting kills hyphae of both and deadens both webs.', standing: 'a choice' },
    { id: 'edge', label: 'Advantage', min: -1, max: 1, value: 0, show: v => v < -.05 ? 'to the right-hand one' : v > .05 ? 'to the left-hand one' : 'evenly matched', trace: 'The winner keeps growing into the other\'s ground; the loser\'s growth is held back.', standing: 'a choice here; inferred scores in the simulator' },
    { id: 'ring', label: 'Ring time', min: .03, max: 4, value: .6, unit: 's', trace: 'How long each web rings.', standing: 'a choice' },
    { id: 'size', label: 'Size of the networks', min: .1, max: 4, value: .5, show: v => '×' + (1 / v).toFixed(2), trace: 'Scales both webs\' notes.', standing: 'physics' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, spec2, params, view }) {
    const pick = s => s.stages[Math.min(s.stages.length - 1, Math.floor(params.stage * (s.stages.length - 1)))], hush = view ? view.hush : [0, 0]
    g.globalAlpha = 1 - .6 * hush[0]; drawNetwork(g, pick(spec), 0, 0, w * .52, h, spec.colours[0]); g.globalAlpha = 1
    if (spec2) { g.globalAlpha = 1 - .6 * hush[1]; drawNetwork(g, pick(spec2), w * .48, 0, w * .52, h, '#9ed0e6'); g.globalAlpha = 1 }
    g.fillStyle = `rgba(224,133,114,${.25 + .6 * Math.max(hush[0], hush[1])})`; g.fillRect(w / 2 - 3 + params.edge * w * .08, 20, 6, h - 40)
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'; g.fillText(`${view ? view.meetings : 0} meetings`, w / 2 - 50, h - 14)
  }
}
