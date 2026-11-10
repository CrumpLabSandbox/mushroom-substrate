import { drawNetwork } from '../kit/kit.js'
export const liveDraw = (g, w, h, { spec, live, view }) => {
  const st = live.stage, t = live.taps
  if (!st) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on: a colony will start to grow', 30, 50); return }
  drawNetwork(g, st, 0, 0, w, h * .9, spec.colours[0])
  g.fillStyle = '#a89c82'; g.font = '22px system-ui'
  g.fillText(`day ${(t.days || 0).toFixed(1)} · ${t.tips || 0} growing tips · ${t.segments || 0} pieces of hypha · reaches ${st.reach_mm.toFixed(1)} mm`, 20, h - 44)
  g.fillText(`lowest note now ${st.hz[0] ? st.hz[0].toFixed(0) : '—'} Hz · ${t.cords || 0} cord pieces · ${view ? view.caps : 0} mushrooms forming · surface ${(t.surface || 0).toFixed(0)} °C`, 20, h - 14)
}
export const def = {
  id: 'forest-floor', name: 'Forest Floor', family: 'atmosphere', kind: 'P', species: 'coprinopsis-cinerea', live: { speed: 'speed', rain: 'rain' },
  blurb: 'A colony growing live, heard as it grows. The simulator runs beside the sound. Every branch, fusion and abandoned hypha strikes the web of hyphae where it happened; about once a second the web is retuned to the network as it now is, so its notes fall as it grows. Mushrooms that begin to form ring as small plates while they expand. When the block of soil is full, a new colony starts.',
  assumed: 'Real hyphae are too damped to ring, so the ring time is a choice. The listening level is turned up slowly as the network grows, because a bigger network is heavier and each strike moves it less. Strikes are placed by ring from the centre, not at their exact spot. Growth is far faster than life.',
  about: s => `${s.family} · grows in its usual ground in a block of soil 25.6 mm across`,
  params: [
    { id: 'speed', label: 'Growth speed', min: .5, max: 30, value: 2, unit: 'steps per s', trace: 'How fast the simulator runs. One step is the time a tip takes to grow 0.1 mm: minutes to hours of real time.', standing: 'sped up' },
    { id: 'ring', label: 'Ring time', min: .03, max: 4, value: .5, unit: 's', trace: 'How long the web rings after a strike.', standing: 'a choice' },
    { id: 'size', label: 'Size of everything that rings', min: .1, max: 4, value: .3, show: v => v == 1 ? 'real' : '×' + (1 / v).toFixed(2), trace: 'Scales every note. At real size a young network is very high.', standing: 'physics' },
    { id: 'caps', label: 'Mushrooms', min: 0, max: 2, value: .6, trace: 'How loud forming mushrooms are beside the network.', standing: 'a choice' },
    { id: 'rain', label: 'Make it rain', min: 0, max: 1, step: 1, value: 0, show: v => v > .5 ? 'raining' : 'push right for a shower', trace: 'Rain wets the surface in the simulator and strikes the ground above the network.', standing: 'from the model' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['Each strike', 'One hypha\'s turgor force (pressure × cross-section) for a moment: a branch breaking out, a fusion (two), a piece abandoned or killed.', 'physics, with an assumed duration'], ['The notes', 'The network\'s modes as a web of taut strings, worked out again about once a second from its present shape and cord thickness.', 'from the model, live']],
  draw: liveDraw
}
