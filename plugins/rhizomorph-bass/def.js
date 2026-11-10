export const def = {
  id: 'rhizomorph-bass', name: 'Rhizomorph Bass', family: 'instrument', kind: 'P', keys: true, lowKey: 24, species: 'armillaria-gallica',
  blurb: 'One long cord as a string. A rhizomorph is not even along its length: it has thick and thin stretches. A wave travelling along it partly turns back wherever the thickness changes, so the cord rings with echoes inside it. Three stretches, two joints; how much turns back at each joint comes from the two cross-sections.',
  assumed: 'A real rhizomorph is far too damped to ring like a string. The thin-thick-thin shape is a simple stand-in for a real cord\'s profile. The key played sets the cord\'s length; at 22 metres per second a cord sounding the lowest key here would be about a third of a metre long.',
  about: s => `${s.family} · cords up to ${s.numbers.cord_max} hyphae thick in the model`,
  params: [
    { id: 'contrast', label: 'Thick against thin', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'How much thicker the middle stretch is than the ends, up to the species\' thickest cord. More contrast, more of the wave turns back at each joint.', standing: 'from the species' },
    { id: 'joint', label: 'Where the cord thickens', min: .1, max: .45, value: .35, show: v => Math.round(v * 100) + '% from each end', trace: 'Where along the cord the thick stretch begins and ends. This places the echoes.', standing: 'a choice' },
    { id: 'pluck', label: 'Where it is plucked', min: 0, max: 1, value: .2, show: v => v < .5 ? 'the thin end' : 'the thick middle', trace: 'Where the cord is disturbed.', standing: 'a choice' },
    { id: 'ring', label: 'Ring time', min: .05, max: 3, value: .6, unit: 's', trace: 'How long it rings. Real cords are damped almost at once.', standing: 'a choice' },
    { id: 'bright', label: 'High notes kept', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'How much of the high end survives each trip along the cord.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['Reflection', 'At a joint between cross-sections A and B the share that turns back is (B − A) ÷ (B + A).', 'physics']],
  draw(g, w, h, { spec, params, view }) {
    const a = params.joint, thick = 10 + params.contrast * 60, y = h / 2, x0 = 60, x1 = w - 60, len = x1 - x0
    g.fillStyle = spec.colours[0]
    g.fillRect(x0, y - 6, len * a, 12); g.fillRect(x0 + len * a, y - thick / 2, len * (1 - 2 * a), thick); g.fillRect(x1 - len * a, y - 6, len * a, 12)
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'
    if (view) { g.fillText(`${Math.round(Math.abs(view.k[0]) * 100)}% turns back here`, x0 + len * a - 80, y + thick / 2 + 40); g.fillText(`and here`, x1 - len * a - 40, y + thick / 2 + 40) }
  }
}
