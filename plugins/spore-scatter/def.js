export const def = {
  id: 'spore-scatter', name: 'Spore Scatter', family: 'composer', kind: 'S', composer: true, instrument: 'cap-drums', species: 'amanita-muscaria',
  blurb: 'The spread of pitches from the spread of spores. Each note is a spore landing. Most fall close to the mushroom and a few travel far, by the same rule the stand-scale engine uses; distance on the ground is distance in pitch from a centre note. Rarely a far spore founds a new individual, and the centre moves there.',
  assumed: 'Turning distance on the ground into distance in pitch is a choice. The landing rule is fitted to one figure from an abstract (95% of spores within a metre). A real cap sheds tens of thousands of spores a second; only a few a second are heard here.',
  about: s => `${s.fruit.form}, ${s.fruit.size_cm.join(' to ')} cm · in the model about 94% of spores land within a metre`,
  params: [
    { id: 'rate', label: 'Spores heard', min: .5, max: 40, value: 8, unit: 'per s', trace: 'A tiny sample of the real discharge, which is about 30,000 a second from one cap.', standing: 'a sample' },
    { id: 'reach', label: 'Middling landing distance', min: .25, max: 12, value: 2.5, unit: 'semitones', trace: 'Half the spores land nearer than this. On the ground the engine uses 8 cm.', standing: 'a choice' },
    { id: 'wind', label: 'Wind', min: -1, max: 1, value: 0, show: v => v < -.05 ? 'toward low' : v > .05 ? 'toward high' : 'still', trace: 'Pushes more spores to one side.', standing: 'a choice' },
    { id: 'gust', label: 'How much discharge comes and goes', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'Spore release depends on humidity and moving air, so it arrives in waves.', standing: 'assumed' },
    { id: 'found', label: 'Founding', min: 0, max: 5, value: 1, show: v => '×' + v.toFixed(1), trace: 'How readily a spore that lands far out founds a new individual, which moves the centre. In the engine this is rare.', standing: 'from the model' },
    { id: 'base', label: 'Centre note', min: 36, max: 84, step: 1, value: 60, show: v => 'key ' + Math.round(v), trace: 'Where the first mushroom stands.', standing: 'a choice' },
    { id: 'length', label: 'Note length', min: .05, max: 1.5, value: .25, unit: 's', trace: 'How long each landing sounds.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, view }) {
    if (!view) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on to start', 30, 50); return }
    const cx = w / 2, cy = h * .55
    g.fillStyle = '#19150e'; g.fillRect(0, cy, w, h - cy)
    g.beginPath(); g.ellipse(cx, cy - 60, 70, 30, 0, 0, 7); g.fillStyle = spec.colours[1]; g.fill(); g.fillStyle = spec.colours[2]; g.fillRect(cx - 9, cy - 60, 18, 60)
    for (const [d, age] of view.last) { if (age > 2.5) continue; const x = cx + d * 18; g.beginPath(); g.arc(x, cy + 14 + (Math.abs(d) * 7 % 60), 4, 0, 7); g.fillStyle = `rgba(233,220,188,${1 - age / 2.5})`; g.fill() }
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'; g.fillText(`centre: key ${view.centre.toFixed(1)}` + (view.moved < 3 ? ' · a spore has founded a new individual' : ''), 20, 36)
  }
}
