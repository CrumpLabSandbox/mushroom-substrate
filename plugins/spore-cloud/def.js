export const def = {
  id: 'spore-cloud', name: 'Spore Cloud', family: 'atmosphere', kind: 'P', species: 'pleurotus-ostreatus',
  blurb: 'The sound of spores leaving. A mature cap sheds tens of thousands of spores a second, each launched at about a metre per second and pushing back on the cap as it goes. So many small random pushes make a steady hiss of force, and the cap, a small plate, answers at its own notes. Discharge rises and falls with the air.',
  assumed: 'In life this is far too quiet to hear: each push is about a tenth of a millionth of a millionth of a newton-second. Here it is brought up to listening level. Caps are treated as plates that ring; real ones are soft and damped, so the ring time is a choice.',
  about: s => `${s.fruit.form}, ${s.fruit.size_cm.join(' to ')} cm · a middling cap answers at ${s.cap.lowest_hz.toFixed(0)} Hz`,
  params: [
    { id: 'rate', label: 'Spores leaving each cap', min: 1, max: 140, value: 30, unit: 'thousand per s', trace: 'About 30,000 a second is reported; up to 140,000 for some species. More launches make a stronger, smoother hiss.', standing: 'sourced' },
    { id: 'speed', label: 'Launch speed', min: .1, max: 1.8, value: 1, unit: 'm/s', trace: 'Measured launch speeds run from 0.1 to 1.8 m/s. A faster launch pushes back harder.', standing: 'sourced' },
    { id: 'waves', label: 'How much discharge comes and goes', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'Discharge depends on humidity and moving air, so each cap\'s output swells and fades.', standing: 'assumed' },
    { id: 'count', label: 'Mushrooms', min: 1, max: 16, step: 1, value: 6, show: v => Math.round(v), trace: 'How many caps are shedding, spread left to right.', standing: 'a choice' },
    { id: 'size', label: 'Cap size', min: .3, max: 2.5, value: 1, show: v => '×' + v.toFixed(2), trace: 'Scales every cap. Smaller caps answer higher.', standing: 'from the species' },
    { id: 'ring', label: 'Ring time', min: .01, max: 1.5, value: .15, unit: 's', trace: 'How sharply each cap picks out its notes from the hiss.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 4, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, view, t }) {
    if (!view) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on to start', 30, 50); return }
    for (const [pan, r, out] of view.caps) {
      const x = 80 + pan * (w - 160), y = h * .45, R = Math.max(14, r * 9)
      for (let k = 0; k < 40 * out; k++) { const a = (k * 2.4 + t * 2) % 6.28, d = (t * 60 + k * 37) % 200; g.fillStyle = `rgba(233,220,188,${.5 * (1 - d / 200)})`; g.fillRect(x + Math.cos(a) * R * .8 + Math.sin(d / 30 + k) * 8, y + R * .3 + d, 2, 2) }
      g.beginPath(); g.ellipse(x, y, R, R * .4, 0, 0, 7); g.fillStyle = spec.colours[1]; g.fill(); g.fillStyle = spec.colours[2]; g.fillRect(x - 4, y, 8, R * 1.2)
    }
  }
}
