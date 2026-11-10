export const def = {
  id: 'fairy-ring', name: 'Fairy Ring', family: 'instrument', kind: 'P', keys: true, species: 'marasmius-oreades',
  blurb: 'A ring of mycelium as a ring that carries a wave round and round. The living part of a fairy ring is a band: an outer edge advancing into fresh ground and an inner edge where it dies back. Each edge is a loop a little different in length, so the two beat. Every year the ring grows by the species\' advance, and its note falls.',
  assumed: 'Nothing travels round a real fairy ring as a wave. This takes the ring\'s shape and growth and treats it as a loop. The key played is the note of a ring half a metre in radius; a real ring of that size, at the speed of a wave in a hypha, would sound at about 7 Hz.',
  about: s => `advances about ${(s.numbers.tip_speed_um_h * 8.76e-3).toFixed(2)} m a year in the model (measured rings: 0.07 to 1.25 m a year)`,
  params: [
    { id: 'age', label: 'Age of the ring', min: 0, max: 40, value: 3, unit: 'years', trace: 'Each year the radius grows by the species\' advance, the loop lengthens and the note falls.', standing: 'from the species' },
    { id: 'band', label: 'Width of the living band', min: 0, max: 1.5, value: .3, unit: 'm', trace: 'The outer edge is longer than the inner by this much radius, so the two loops are slightly out of tune and beat. Measured mats are 4 to 22 cm deep; bands vary.', standing: 'a choice' },
    { id: 'ring', label: 'Ring time', min: .1, max: 6, value: 1.5, unit: 's', trace: 'How long the wave keeps going round.', standing: 'a choice' },
    { id: 'bright', label: 'High notes kept', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'How much of the high end survives each lap.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, view, t }) {
    const r = view ? view.radius : .5, band = view ? view.band : .3, s = Math.min(w, h) * .42 / Math.max(2, r + band), cx = w / 2, cy = h / 2
    g.fillStyle = '#1b2414'; g.fillRect(0, 0, w, h)
    g.beginPath(); g.arc(cx, cy, (r + band / 2) * s, 0, 7); g.strokeStyle = '#3f6b33'; g.lineWidth = Math.max(4, band * s); g.stroke()
    for (let k = 0; k < Math.min(40, 6 + r * 6); k++) { const a = k * 2.399; g.beginPath(); g.arc(cx + Math.cos(a) * (r + band * .5) * s, cy + Math.sin(a) * (r + band * .5) * s, 6, 0, 7); g.fillStyle = spec.colours[1]; g.fill() }
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'; g.fillText(`${(r * 2).toFixed(1)} m across`, 20, h - 20)
  }
}
