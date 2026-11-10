import { DATA } from './dsp.js'
const sp = (id, i) => ({ id, label: DATA[i][0], min: 0, max: 1, value: 1, show: v => v < .05 ? 'off' : Math.round(v * 100) + '%', trace: `Measured interval between spikes: ${DATA[i][1]} minutes (extracellular recordings).`, standing: 'sourced, disputed' })
export const def = {
  id: 'spike-chord', name: 'Spike Chord', family: 'atmosphere', kind: 'S', species: 'pleurotus-ostreatus',
  blurb: 'A chord whose intervals are measurements. Five species have a measured interval between electrical spikes. Sped up by one factor, each becomes a pitch, and together they make a chord whose notes stand in the ratios of the data. Each voice is one unit of the engines\' electrical model running at its species\' rate.',
  assumed: 'The recordings themselves are disputed: a control with substrate and no fungus showed a similar rhythm. The wave shape is the model\'s, not a recorded one. The sixth voice is the loaded species\' own interval, which for most species is a family default of 60 minutes.',
  about: s => `the sixth voice is ${s.name}, at ${s.numbers.spike_interval_min} minutes`,
  params: [
    { id: 'top', label: 'Pitch of the fastest', min: 60, max: 900, value: 330, unit: 'Hz', trace: 'Sets the one speed-up applied to every species. The fastest is the split gill, one spike every 41 minutes.', standing: 'sped up' },
    sp('a', 0), sp('b', 1), sp('c', 2), sp('d', 3), sp('e', 4),
    { id: 'own', label: 'The loaded species', min: 0, max: 1, value: 1, show: v => v < .05 ? 'off' : Math.round(v * 100) + '%', trace: 'The species chosen above, at its own spike interval.', standing: 'from the species' },
    { id: 'drive', label: 'Drive', min: .36, max: 1.3, value: .6, trace: 'How hard each unit is pushed: the shape of the wave.', standing: 'model constant' },
    { id: 'drift', label: 'How much the intervals wander', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'Real spike intervals vary from one spike to the next.', standing: 'assumed' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { view }) {
    if (!view) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on to start', 30, 50); return }
    const names = DATA.map(d => d[0]).concat(['the loaded species']), top = Math.max(...view.hz)
    g.font = '22px system-ui'
    view.hz.forEach((hz, k) => { const y = 70 + k * (h - 120) / 5; g.fillStyle = '#d2a866'; g.fillRect(20, y, hz / top * (w - 40), 18); g.fillStyle = '#a89c82'; g.fillText(`${names[k]}: every ${view.mins[k]} min, here ${hz.toFixed(0)} Hz`, 20, y - 8) })
    g.fillText(`everything ${(view.speed / 1e6).toFixed(2)} million times faster than life`, 20, h - 14)
  }
}
