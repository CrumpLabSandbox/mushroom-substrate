export const def = {
  id: 'soil-filter', name: 'Soil Filter', family: 'effect', kind: 'P', input: true, species: 'tuber-melanosporum',
  blurb: 'Sound heard through soil. Soil swallows sound, the high notes first, and more so the deeper the listener and the wetter the ground. The sound also arrives late, by the time it takes to travel. This is what a truffle would hear.',
  assumed: 'The numbers are rough: sound is taken to travel at 150 metres per second in loose soil and to lose its top end every 14 cm when dry. Real soils vary enormously. The species menu changes nothing here.',
  about: () => 'most mycelium lives in the top 10 to 20 cm',
  params: [
    { id: 'depth', label: 'Depth of the listener', min: 0, max: 100, value: 10, unit: 'cm', trace: 'How much soil the sound passes through. Litter and organic soil hold most mycelium; truffles fruit at 5 to 30 cm.', standing: 'from the species\' habit' },
    { id: 'wet', label: 'Wetness of the soil', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'Wet soil damps high sound more strongly.', standing: 'assumed' },
    { id: 'mix', label: 'Through soil or direct', min: 0, max: 1, value: 1, show: v => Math.round(v * 100) + '% through soil', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 4, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { params, view }) {
    g.fillStyle = '#3d3a1c'; g.fillRect(0, h * .2, w, h * .06); g.fillStyle = '#2a241c'; g.fillRect(0, h * .26, w, h * .2); g.fillStyle = '#1f1b16'; g.fillRect(0, h * .46, w, h * .54)
    g.fillStyle = `rgba(88,180,238,${params.wet * .35})`; g.fillRect(0, h * .2, w, h * .8)
    const y = h * .2 + params.depth / 100 * h * .75; g.beginPath(); g.arc(w / 2, y, 14, 0, 7); g.fillStyle = '#f2c94c'; g.fill()
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'; g.fillText('surface', 20, h * .17); g.fillText(`nothing above ${view ? view.cut.toFixed(0) : '—'} Hz reaches the listener`, 20, h - 18)
  }
}
