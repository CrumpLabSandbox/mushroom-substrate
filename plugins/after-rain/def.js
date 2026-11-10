export const def = {
  id: 'after-rain', name: 'After Rain', family: 'atmosphere', kind: 'S', species: 'laccaria-bicolor',
  blurb: 'Electrical activity after rain. A column of excitable units runs from the surface down. Dry, they are at rest. Rain wets the top: the wet units are driven past their threshold and start to fire, and the firing passes down the column to the drier units below. As the ground dries the activity fades. The units run fast enough to be heard.',
  assumed: 'One study reported electrical changes of more than 100 millivolts in Laccaria bicolor after rain; only a press release of it was read. That wetness drives the units, and that activity passes downward, is this model\'s reading of it. Real changes took hours.',
  about: () => 'between rains there is silence: the units are at rest',
  params: [
    { id: 'rain', label: 'Rain', min: 0, max: 30, value: 4, unit: 'falls a minute', trace: 'How often it rains.', standing: 'a choice' },
    { id: 'dry', label: 'Time to dry', min: .5, max: 30, value: 6, unit: 's', trace: 'How long the ground stays wet, and so how long the activity lasts. In life, hours to days.', standing: 'sped up' },
    { id: 'soak', label: 'How far the water soaks', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'How much of the wetness reaches each deeper unit.', standing: 'assumed' },
    { id: 'coupling', label: 'Coupling down the column', min: 0, max: .4, value: .12, trace: 'How strongly firing above stirs the units below.', standing: 'model constant' },
    { id: 'pitch', label: 'Rate of firing', min: 30, max: 600, value: 140, unit: 'Hz', trace: 'How fast a driven unit fires. In the recordings, minutes to hours; sped up here.', standing: 'sped up' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { view }) {
    if (!view) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on to start', 30, 50); return }
    const N = view.v.length
    for (let k = 0; k < N; k++) {
      const y = 50 + k * (h - 100) / N, e = (view.v[k] + 2.2) / 4.4
      g.fillStyle = `rgba(88,180,238,${view.wet[k] * .8})`; g.fillRect(40, y, w - 80, (h - 100) / N - 6)
      g.beginPath(); g.arc(w / 2, y + (h - 100) / N / 2 - 3, 8 + e * 24, 0, 7); g.fillStyle = `rgb(${90 + e * 150},${80 + e * 120},60)`; g.fill()
    }
    g.fillStyle = '#a89c82'; g.font = '20px system-ui'; g.fillText('surface', 44, 40); g.fillText('deeper', 44, h - 18)
  }
}
