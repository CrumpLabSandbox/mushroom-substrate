export const def = {
  id: 'gill-comb', name: 'Gill Comb', family: 'instrument', kind: 'P', keys: true, species: 'pleurotus-ostreatus',
  blurb: 'The gills as a row of thin blades. Under a cap hang dozens of gills, each a thin plate fixed along its top edge. No two are quite the same length, so struck together they sound as a comb of close notes. As the cap opens the gills spread and their notes move apart.',
  assumed: 'A real gill is soft, wet tissue and does not ring. Each is treated as a blade fixed at one edge, with the overtone such a blade has. The key played sets the note of the middle gill; the species menu changes only the drawing\'s colours.',
  about: s => `${s.fruit.form}, ${s.fruit.size_cm.join(' to ')} cm`,
  params: [
    { id: 'gills', label: 'Gills', min: 2, max: 16, step: 1, value: 12, show: v => Math.round(v), trace: 'How many gills sound. A real cap has tens to hundreds.', standing: 'a sample' },
    { id: 'open', label: 'How far the cap has opened', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'As the cap opens the gills fan out and differ more in length, so their notes spread.', standing: 'assumed' },
    { id: 'second', label: 'The blade\'s second bend', min: 0, max: 1, value: .4, trace: 'A blade fixed at one edge has a second way of bending, 6.27 times higher.', standing: 'physics' },
    { id: 'ring', label: 'Ring time', min: .05, max: 4, value: .9, unit: 's', trace: 'How long the gills ring.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, params, view }) {
    const n = Math.round(params.gills), e = view ? view.energy : 0
    g.beginPath(); g.ellipse(w / 2, h * .28, w * .38, h * .12, 0, 3.14, 6.28); g.fillStyle = spec.colours[1]; g.fill()
    for (let k = 0; k < n; k++) { const x = n > 1 ? k / (n - 1) - .5 : 0; g.fillStyle = `rgba(233,220,188,${.5 + .5 * e})`; g.fillRect(w / 2 + x * w * .7 * (.6 + .4 * params.open), h * .28, 5, h * .32 * (1 - x * params.open * .5) + Math.sin(Date.now() / 40 + k) * e * 8) }
  }
}
