export const def = {
  id: 'excitable-gate', name: 'Excitable Gate', family: 'effect', kind: 'S', input: true, species: 'pleurotus-ostreatus',
  blurb: 'A gate that behaves like an excitable cell. The loudness of the sound going in is the drive on one unit of the engines\' electrical model. Below its threshold nothing passes. Above it the unit fires: a spike that runs its full course whatever the input does, and lets the sound through while it lasts. Then it must recover before it can fire again, however loud the input.',
  assumed: 'That loud sound could excite a fungus is not claimed; the input simply stands where the drive from a growing tip stands in the engines. A real spike takes minutes. The species menu changes nothing here: the unit is the same model for all.',
  about: () => 'the same excitable unit the engines use for electrical activity',
  params: [
    { id: 'threshold', label: 'Threshold', min: .02, max: 1, value: .5, trace: 'How loud the sound must be before the unit can fire.', standing: 'model constant, rescaled' },
    { id: 'speed', label: 'Speed of the unit', min: .5, max: 40, value: 6, unit: 'cycles per s', trace: 'How fast the unit lives: a spike and its recovery take one cycle. In life, minutes to hours.', standing: 'sped up' },
    { id: 'hold', label: 'How much of the spike lets sound through', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'The gate is open while the unit\'s voltage is above a level; this moves the level.', standing: 'a choice' },
    { id: 'mix', label: 'Gated or untouched', min: 0, max: 1, value: 1, show: v => Math.round(v * 100) + '% gated', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { view }) {
    if (!view) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on to start', 30, 50); return }
    const cx = w / 2, cy = h / 2, e = (view.v + 2.2) / 4.4
    g.beginPath(); g.arc(cx, cy, 60 + e * 120, 0, 7); g.fillStyle = `rgb(${70 + e * 170},${60 + e * 140},${50 + e * 30})`; g.fill()
    g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText(view.gate > .5 ? 'firing: open' : view.w > -.3 ? 'recovering: shut' : 'resting: shut', 30, 44)
    g.fillStyle = '#58b4ee'; g.fillRect(30, h - 40, Math.min(1, view.env * 3) * (w - 60), 14)
  }
}
