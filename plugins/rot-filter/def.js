export const def = {
  id: 'rot-filter', name: 'Rot Filter', family: 'effect', kind: 'M', input: true, species: 'trametes-versicolor',
  blurb: 'Your sound through a rotting log. The sound going in drives a wooden bar. As the bar rots it loses stiffness and weight, so its notes fall and blur. White rot takes both together; brown rot takes stiffness first, and the notes drop sharply.',
  assumed: 'The way stiffness and weight fall with each kind of rot is a simple curve matching the known pattern, not fitted to data. A real log would not ring like a bar.',
  about: s => `${s.name} is a ${s.fruit.trophic || 'decay'} fungus`,
  params: [
    { id: 'decay', label: 'How far gone', min: 0, max: .97, value: .2, show: v => Math.round(v * 100) + '%', trace: 'The share of the log that has rotted. Sets stiffness and weight, and so every resonance.', standing: 'from the model' },
    { id: 'kind', label: 'Kind of rot', min: 0, max: 2, step: 1, value: 0, show: v => ['as the species', 'white rot', 'brown rot'][Math.round(v)], trace: 'White rot removes lignin and cellulose together. Brown rot leaves the lignin and the wood loses its strength early.', standing: 'sourced pattern' },
    { id: 'length', label: 'Length of the log', min: .3, max: 3, value: 1, unit: 'm', trace: 'A longer bar is lower, as one over its length squared.', standing: 'physics' },
    { id: 'ring', label: 'Ring time when sound', min: .02, max: 3, value: .5, unit: 's', trace: 'How long sound wood rings. Rot shortens it.', standing: 'a choice' },
    { id: 'mix', label: 'Log or the sound itself', min: 0, max: 1, value: .7, show: v => Math.round(v * 100) + '% log', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { params, view }) {
    const u = params.decay, brown = view && view.brown, c = brown ? [120 - 60 * u, 74 - 40 * u, 38 - 20 * u] : [120 + 90 * u, 74 + 110 * u, 38 + 130 * u]
    g.fillStyle = `rgb(${c.map(Math.round).join(',')})`; g.fillRect(80, h * .36, w - 160, h * .2 * (1 - .3 * u))
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'; g.fillText(`${Math.round(u * 100)}% rotted · ${brown ? 'brown rot' : 'white rot'} · lowest resonance ${view ? view.f.toFixed(0) : '—'} Hz`, 80, h * .72)
  }
}
