export const def = {
  id: 'season-cycle', name: 'Season Cycle', family: 'composer', kind: 'S', composer: true, instrument: 'cap-drums', species: 'flammulina-velutipes',
  blurb: 'Form and dynamics from the year. The mycelium is active according to the species\' own temperature curve: a slow line of low notes. Rain comes at random as a burst of quick high notes. Through the warm months the fungus stores reserve, and when autumn cools the ground below the species\' fruiting temperature it fruits: each mushroom a short falling figure, stepping down the network\'s own notes as the cap expands, slower for a species with a bigger cap. The open caps then shed spores for a while. Winter is silence.',
  assumed: 'The year is a single smooth temperature wave and rain is random. The falling figure for a mushroom is a choice: it steps down the network\'s notes, and a bigger cap takes longer. That caps shed for a twelfth of a year, and more in damp air, is assumed. Most species\' temperature limits are family defaults.',
  about: s => `grows best at ${s.numbers.t_opt_c} °C, between ${s.numbers.t_min_c} and ${s.numbers.t_max_c} °C · fruits when it cools to ${s.numbers.t_opt_c - s.numbers.cold_drop_c} °C`,
  params: [
    { id: 'year', label: 'Length of a year', min: 15, max: 300, value: 60, unit: 's', trace: 'One year of seasons in this time.', standing: 'sped up' },
    { id: 'climate', needs: 'weather', label: 'Climate', min: -10, max: 10, value: 0, show: v => (v >= 0 ? '+' : '') + v.toFixed(1) + ' °C', trace: 'Shifts the yearly mean, which starts 8 °C below the species\' optimum. Too cold and it never grows; too warm and it never fruits.', standing: 'from the species' },
    { id: 'swing', needs: 'weather', label: 'Summer to winter', min: 0, max: 20, value: 9, show: v => '±' + v.toFixed(0) + ' °C', trace: 'How far the temperature swings through the year.', standing: 'a choice' },
    { id: 'rain', needs: 'weather', label: 'Rain', min: 0, max: 80, value: 24, unit: 'falls a year', trace: 'How often it rains. Rain wakes activity for a while, as the electrical recordings after rain suggest.', standing: 'a choice' },
    { id: 'base', label: 'Lowest note', min: 24, max: 60, step: 1, value: 43, show: v => 'key ' + Math.round(v), trace: 'Where the network\'s lowest mode is put.', standing: 'a choice' },
    { id: 'spores', needs: 'spores', label: 'Spores heard after fruiting', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'Open caps shed spores for days. After each flush a thinning shower of very short, quiet, high notes is heard, more of them for more caps and in damp air. A tiny sample of the real number.', standing: 'assumed' },
    { id: 'apart', label: 'Modes closer than this are one note', min: 0, max: 2, value: .3, unit: 'semitones', trace: 'A dense network has many modes at almost the same frequency. Those nearer than this to the one below are counted once, so the voices are not all on one pitch. At 0 every mode is used.', standing: 'a choice' },
    { id: 'octave', label: 'Register', min: -3, max: 3, step: 1, value: 0, show: v => (v > 0 ? '+' : '') + Math.round(v) + ' octaves', trace: 'Moves every note by whole octaves. The intervals between the network\'s notes are kept.', standing: 'a choice' },
    { id: 'thin', label: 'Share of notes heard', min: .05, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'The process runs the same; only this share of its events is sounded, picked at random. For playing alongside other composers.', standing: 'a choice' },
  ],
  scales: {
    '4k': "No weather, mushrooms or reserve: a steady temperature, and one line of low notes whose pace follows the number of growing tips.",
    '40k': "No weather, but flow and simple mushrooms: the low line, and a flush of mushrooms whenever enough reserve is stored.",
    '400k': "The full year: temperature, rain, reserve, and fruiting when autumn cools. No spores at this size.",
    '4m': "Year after year, with spores: each year's spores can found a new individual, up to four, each working from its own note.",
  }
}
