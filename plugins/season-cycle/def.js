export const def = {
  id: 'season-cycle', name: 'Season Cycle', family: 'composer', kind: 'S', composer: true, instrument: 'cap-drums', species: 'flammulina-velutipes',
  blurb: 'Form and dynamics from the year. The mycelium is active according to the species\' own temperature curve: a slow line of low notes. Rain comes at random as a burst of quick high notes. Through the warm months the fungus stores reserve, and when autumn cools the ground below the species\' fruiting temperature it fruits: each mushroom a short falling figure, its note dropping as the cap expands. Winter is silence.',
  assumed: 'The year is a single smooth temperature wave and rain is random. The falling figure for a mushroom follows the cap model (a bigger cap is lower); its exact shape is a choice. Most species\' temperature limits are family defaults.',
  about: s => `grows best at ${s.numbers.t_opt_c} °C, between ${s.numbers.t_min_c} and ${s.numbers.t_max_c} °C · fruits when it cools to ${s.numbers.t_opt_c - s.numbers.cold_drop_c} °C`,
  params: [
    { id: 'year', label: 'Length of a year', min: 15, max: 300, value: 60, unit: 's', trace: 'One year of seasons in this time.', standing: 'sped up' },
    { id: 'climate', label: 'Climate', min: -10, max: 10, value: 0, show: v => (v >= 0 ? '+' : '') + v.toFixed(1) + ' °C', trace: 'Shifts the yearly mean, which starts 8 °C below the species\' optimum. Too cold and it never grows; too warm and it never fruits.', standing: 'from the species' },
    { id: 'swing', label: 'Summer to winter', min: 0, max: 20, value: 9, show: v => '±' + v.toFixed(0) + ' °C', trace: 'How far the temperature swings through the year.', standing: 'a choice' },
    { id: 'rain', label: 'Rain', min: 0, max: 80, value: 24, unit: 'falls a year', trace: 'How often it rains. Rain wakes activity for a while, as the electrical recordings after rain suggest.', standing: 'a choice' },
    { id: 'base', label: 'Lowest note', min: 24, max: 60, step: 1, value: 43, show: v => 'key ' + Math.round(v), trace: 'Where the network\'s lowest mode is put.', standing: 'a choice' },
  ],
  draw(g, w, h, { view }) {
    if (!view) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on to start', 30, 50); return }
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * .36, a = view.y * 6.2832 - 1.5708
    g.beginPath(); g.arc(cx, cy, r, 0, 7); g.strokeStyle = '#3a3326'; g.lineWidth = 30; g.stroke()
    g.beginPath(); g.arc(cx, cy, r, a - .5, a); g.strokeStyle = view.fruiting ? '#e08572' : `rgba(127,191,139,${.25 + .75 * Math.min(1, view.act)})`; g.stroke()
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'
    ;['winter', 'spring', 'summer', 'autumn'].forEach((s, k) => { const b = (k / 4 + .02) * 6.2832 - 1.5708; g.fillText(s, cx + Math.cos(b) * (r + 46) - 30, cy + Math.sin(b) * (r + 46)) })
    g.fillStyle = '#e9dcbc'; g.font = '40px ui-serif, Georgia'; g.fillText(view.T.toFixed(0) + ' °C', cx - 48, cy)
    g.font = '22px system-ui'; g.fillStyle = '#a89c82'; g.fillText(view.fruiting ? 'fruiting' : view.act < .02 ? 'dormant' : view.wet > .3 ? 'wet, active' : 'active', cx - 48, cy + 34)
    g.fillStyle = '#f2c94c'; g.fillRect(cx - 80, cy + 56, Math.min(160, view.reserve * 20), 10); g.strokeStyle = '#6d665a'; g.lineWidth = 1; g.strokeRect(cx - 80, cy + 56, 160, 10)
  }
}
