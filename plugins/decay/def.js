export const def = {
  id: 'decay', name: 'Decay', family: 'atmosphere', kind: 'P', species: 'serpula-lacrymans',
  blurb: 'A fallen log over years, heard as a wooden bar that raindrops strike. As fungi rot it the wood loses stiffness and weight. White rot takes everything together, so the note sinks slowly. Brown rot takes the cellulose and leaves the lignin: stiffness goes long before weight does, the note drops sharply, and the wood cracks into cubes.',
  assumed: 'The way stiffness and weight fall with each kind of rot is a simple curve drawn to match the well-known pattern (brown rot loses strength early), not fitted to data. A real log lies on the ground and would thud, not ring. In the field a log loses about 6% of its weight a year at 10 °C.',
  about: s => `${s.name} is a ${s.fruit.trophic || 'decay'} fungus` + (s.fruit.trophic == 'brown-rot' ? ': it leaves a brown, cubical residue' : s.fruit.trophic == 'white-rot' ? ': it bleaches and softens the wood' : ' (treated as white rot unless you choose)'),
  params: [
    { id: 'decay', label: 'How far gone', min: 0, max: .97, value: 0, show: v => Math.round(v * 100) + '%', trace: 'The share of the log that has rotted. Sets stiffness and weight, and so the note.', standing: 'from the model' },
    { id: 'years', label: 'Time for the log to go', min: 0, max: 300, value: 60, show: v => v < 1 ? 'held still' : v.toFixed(0) + ' s', trace: 'The log rots away over this time, then a fresh one falls. In the field this takes decades.', standing: 'sped up' },
    { id: 'kind', label: 'Kind of rot', min: 0, max: 2, step: 1, value: 0, show: v => ['as the species', 'white rot', 'brown rot'][Math.round(v)], trace: 'White rot removes lignin and cellulose together. Brown rot removes cellulose and leaves lignin, so the wood loses its strength early and cracks.', standing: 'sourced pattern' },
    { id: 'length', label: 'Length of the log', min: .4, max: 3, value: 1, unit: 'm', trace: 'A longer bar is lower, as one over its length squared.', standing: 'physics' },
    { id: 'rain', label: 'Drops landing on it', min: 0, max: 40, value: 6, unit: 'per s', trace: 'What strikes the log.', standing: 'a choice' },
    { id: 'ring', label: 'Ring time when sound', min: .05, max: 4, value: 1.2, unit: 's', trace: 'How long sound wood rings. Rot shortens it.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { view }) {
    if (!view) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on to start', 30, 50); return }
    const u = view.u, c = view.brown ? [120 - 60 * u, 74 - 40 * u, 38 - 20 * u] : [120 + 90 * u, 74 + 110 * u, 38 + 130 * u]
    g.fillStyle = `rgb(${c.map(Math.round).join(',')})`; g.fillRect(80, h * .34, w - 160, h * .2 * (1 - .3 * u))
    if (view.brown) { g.strokeStyle = '#14110c'; g.lineWidth = 2; for (let k = 0; k < u * 26; k++) { const x = 90 + (k * 137 % (w - 180)); g.beginPath(); g.moveTo(x, h * .34); g.lineTo(x + (k % 3 - 1) * 8, h * .34 + h * .2 * (1 - .3 * u)); g.stroke() } }
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'
    g.fillText(`${Math.round(u * 100)}% rotted · ${view.brown ? 'brown rot' : 'white rot'} · note ${view.f.toFixed(0)} Hz`, 80, h * .7)
    g.fillText(`stiffness ${Math.round(view.stiff * 100)}% · weight ${Math.round(view.weight * 100)}%`, 80, h * .7 + 32)
  }
}
