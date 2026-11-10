export const def = {
  id: 'cap-drums', name: 'Cap Drums', family: 'instrument', kind: 'P', keys: true, lowKey: 36, species: 'amanita-muscaria',
  blurb: 'Each key is a mushroom cap of a different size, struck by a raindrop. A cap is treated as a small plate: the bigger it is, the lower it sounds. The species\' fruit form sets the overtones, so a flat cap, a shelf, a cup and a ball each ring differently.',
  assumed: 'A cap\'s lowest note is put at 90 Hz for a 3 cm radius, rising as the cap gets smaller: an estimate from one research report. The overtone sets are textbook shapes standing in for each form. Real caps are soft and barely ring, so the ring time is a choice.',
  about: s => `${s.fruit.form}, ${s.fruit.size_cm.join(' to ')} cm across in life · a real cap of this species sounds near ${s.cap.lowest_hz.toFixed(0)} Hz · a key an octave higher is a cap half the size`,
  params: [
    { id: 'ring', label: 'Ring time', min: .03, max: 3, value: .6, unit: 's', trace: 'How long a struck cap rings. Real caps are damped almost at once.', standing: 'a choice' },
    { id: 'wet', label: 'How wet the cap is', min: 0, max: 1, value: .15, show: v => Math.round(v * 100) + '%', trace: 'A soaked cap carries water: it is heavier, so up to 6% lower, and more damped.', standing: 'assumed' },
    { id: 'pos', label: 'Where the drop lands', min: 0, max: 1, value: .3, show: v => v < .2 ? 'centre' : v > .8 ? 'rim' : 'between', trace: 'A hit at the centre wakes different overtones from a hit at the rim.', standing: 'physics, simplified' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['Pitch', 'The key sets the cap\'s size: its lowest note rises as 1 ÷ radius.', 'research estimate'], ['Overtones', 'From the species\' fruit form: plate, beam, bowl or ball.', 'assumed']],
  draw(g, w, h, { spec, view }) {
    const key = view ? view.key : 60, age = view ? view.age : 9, hz = 440 * Math.pow(2, (key - 69) / 12), radius = 90 * 3 / hz, r = Math.min(h * .4, Math.max(8, radius * 22))
    g.beginPath(); g.ellipse(w / 2, h * .46, r, r * .42, 0, 0, 7); g.fillStyle = spec.colours[1]; g.fill(); g.strokeStyle = '#14110c'; g.lineWidth = 3; g.stroke()
    g.fillStyle = spec.colours[2]; g.fillRect(w / 2 - r * .1, h * .46, r * .2, Math.min(h * .4, r * 1.2))
    if (age < 1) { g.beginPath(); g.ellipse(w / 2, h * .46, r * (.1 + age), r * .42 * (.1 + age), 0, 0, 7); g.strokeStyle = `rgba(190,220,255,${1 - age})`; g.lineWidth = 3; g.stroke() }
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'; g.fillText(`this key is a cap about ${(radius * 2).toFixed(1)} cm across, at ${hz.toFixed(0)} Hz`, 20, h - 20)
  }
}
