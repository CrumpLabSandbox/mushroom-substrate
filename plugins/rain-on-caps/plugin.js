import { start } from '../kit/kit.js'
start({
  id: 'rain-on-caps', name: 'Rain on Caps', family: 'atmosphere', kind: 'P', species: 'amanita-muscaria',
  blurb: 'A square metre of ground with mushrooms on it, in real rain, in real time. Drops arrive at the true rate for the rainfall. A drop on a cap strikes that cap, a small plate whose notes depend on its size and form; a drop on the ground is a short thud in the soil.',
  assumed: 'A cap is treated as a plate with a lowest note of 90 Hz at 3 cm radius, rising as the cap gets smaller, with a textbook overtone set for its form: estimates, not measurements. Real caps are soft and barely ring, so the ring time is a choice. The soil thud is a guess at a heavily damped ground.',
  about: s => `${s.fruit.form}, ${s.fruit.size_cm.join(' to ')} cm across · a middling cap sounds at ${s.cap.lowest_hz.toFixed(0)} Hz`,
  params: [
    { id: 'rain', label: 'Rainfall', min: 0, max: 50, value: 8, unit: 'mm/h', trace: 'Sets how many drops fall per square metre per second: rainfall divided by the volume of one drop. Light rain is 2, heavy is 20 and more.', standing: 'physics' },
    { id: 'drop', label: 'Drop size', min: 1, max: 6, value: 3, unit: 'mm', trace: 'A bigger drop is heavier and falls faster, so it hits harder, and for the same rainfall there are fewer of them.', standing: 'physics' },
    { id: 'count', label: 'Mushrooms', min: 1, max: 40, step: 1, value: 12, show: v => Math.round(v), trace: 'How many fruiting bodies stand in the square metre. Sizes are drawn from the species\' range.', standing: 'a choice' },
    { id: 'size', label: 'Cap size', min: .4, max: 2.5, value: 1, show: v => '×' + v.toFixed(2), trace: 'Scales every cap. Smaller caps are higher and, being lighter, louder for the same drop.', standing: 'from the species' },
    { id: 'ring', label: 'Ring time', min: .02, max: 2, value: .3, unit: 's', trace: 'How long a struck cap rings. Wet caps ring shorter and lower as they take on water.', standing: 'a choice' },
    { id: 'ground', label: 'Ground', min: 0, max: 1.5, value: .5, trace: 'How loud drops on bare ground are beside drops on caps.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['Overtones', 'Flat caps use a free round plate, shelves and clubs a beam fixed at one end, cups a bowl, balls a sphere.', 'assumed'], ['Left and right', 'Where each mushroom stands across the square metre.', 'a choice']],
  draw(g, w, h, { spec, view, t }) {
    g.fillStyle = '#19150e'; g.fillRect(0, 0, w, h)
    if (!view) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on to start the rain', 30, 50); return }
    const s = Math.min(w, h) * .9, ox = (w - s) / 2, oy = (h - s) / 2
    g.strokeStyle = '#3a3326'; g.strokeRect(ox, oy, s, s)
    for (const [x, y, r] of view.caps) { g.beginPath(); g.arc(ox + x * s, oy + y * s, Math.max(3, r / 100 * s), 0, 7); g.fillStyle = spec.colours[1]; g.globalAlpha = .9; g.fill(); g.globalAlpha = 1; g.strokeStyle = '#14110c'; g.lineWidth = 2; g.stroke() }
    for (const [x, y, r, age] of view.hits) { if (age > .8) continue; g.beginPath(); g.arc(ox + x * s, oy + y * s, (r ? r / 100 * s : 2) + age * 60, 0, 7); g.strokeStyle = `rgba(190,220,255,${.8 - age})`; g.lineWidth = r ? 3 : 1.5; g.stroke() }
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'; g.fillText(`one square metre · caps ${Math.round(view.wet * 100)}% soaked`, ox, oy + s + 28)
  }
})
