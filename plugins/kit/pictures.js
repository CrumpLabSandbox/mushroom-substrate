// The drawing for every plugin: each shows the mushroom process that is making its sound, from the same numbers
// the sound uses (the specimen, the controls, and what the sound code reports back as `view`). One module, so the
// library page and the combined plugin can show them too. picture(id)(g, w, h, { spec, spec2, params, view, iview, live, t }).
import { INK, TAU, hash, mix, clamp, ease, rgba, blend, shade, text, ground, network, hypha, mushroom, capUnder, spores, rain, ripple, graph, memory, since, stageOf, caption } from './art.js'
const soilPlan = (g, w, h, seed = 3) => { const gd = g.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * .7); gd.addColorStop(0, '#241a11'); gd.addColorStop(1, '#120d08'); g.fillStyle = gd; g.fillRect(0, 0, w, h); for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(120,96,66,${.05 + .1 * hash(seed + i)})`; g.beginPath(); g.ellipse(hash(seed + i * 3) * w, hash(seed + i * 7) * h, 2 + hash(i) * 7, 2 + hash(i * 5) * 4, hash(i) * 3, 0, TAU); g.fill() } }
const night = (g, w, h) => { const gd = g.createLinearGradient(0, 0, 0, h); gd.addColorStop(0, INK.night); gd.addColorStop(1, '#17120c'); g.fillStyle = gd; g.fillRect(0, 0, w, h) }
const V = (v, k, d) => v && v[k] != null ? v[k] : d
const cm = spec => (spec.fruit.size_cm[0] + spec.fruit.size_cm[1]) / 2
const fruitPx = (spec, lo = 60, hi = 240) => clamp(40 + Math.log2(1 + cm(spec)) * 44, lo, hi)
const wave = (amps, phases, n, H = 14) => Array.from({ length: n }, (_, i) => { let y = 0; for (let k = 0; k < Math.min(H, amps.length); k++) y += amps[k] * Math.cos(TAU * (k + 1) * i / n + (phases ? phases[k] : 0)); return y })

const P = {}
// ------------------------------------------------------------------ instruments
P['hyphal-harp'] = (g, w, h, { spec, params: p, view: v, t }) => {
  soilPlan(g, w, h); const pos = V(v, 'stage', p.stage), st = stageOf(spec, pos), e = clamp(V(v, 'energy', 0) * 3), struck = since('harp', V(v, 'held', 0), t)
  const net = network(g, st, 0, 20, w * .68, h - 90, { colour: spec.colours[0], t, tips: true, glow: (i, x, y) => Math.abs(Math.hypot(x, y) - p.pos) < .09 ? .2 + e : (V(v, 'dying', 0) > 0 && Math.hypot(x, y) < .3 ? -1 : 0), pulse: e > .02 ? [{ at: clamp(p.pos + struck * .5), a: e }, { at: clamp(p.pos - struck * .5), a: e }] : [] })
  g.setLineDash([5, 9]); g.strokeStyle = rgba(INK.gold, .55); g.lineWidth = 2; g.beginPath(); g.arc(net.cx, net.cy, Math.max(5, p.pos * net.m * net.scale), 0, TAU); g.stroke(); g.setLineDash([])
  if (V(v, 'dying', 0) > 0) { const gd = g.createRadialGradient(net.cx, net.cy, 0, net.cx, net.cy, net.m * net.scale * .36); gd.addColorStop(0, rgba('#000000', .7 * v.dying)); gd.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gd; g.beginPath(); g.arc(net.cx, net.cy, net.m * net.scale * .36, 0, TAU); g.fill() }
  // the modes as strings strung from the fruit body: each shakes as hard as it was struck
  const fx = w * .86, fy = h - 96, S = fruitPx(spec, 70, 150), modes = V(v, 'modes', []); mushroom(g, fx, fy, S, spec.fruit.form, spec.colours, { light: e, t })
  for (let i = 0; i < 16; i++) { const a = clamp((modes[i] || 0) * 6), x = w * .71 + i * (w * .27 / 16), y1 = 60 + i * 6, y2 = fy - 6; g.strokeStyle = rgba(a > .02 ? INK.gold : INK.hypha, .25 + .75 * a); g.lineWidth = 1 + a * 2; g.beginPath(); for (let u = 0; u <= 1.001; u += .05) g.lineTo(x + Math.sin(u * Math.PI) * Math.sin(t * (30 + i * 6)) * a * 9, mix(y1, y2, u)); g.stroke() }
  text(g, 'its modes, as strings', w * .71, 40, { size: 18 }); caption(g, w, h, [`day ${st.days} · reaches ${st.reach_mm} mm`, V(v, 'scaleNote', '') || 'the dashed ring is where it is struck'])
}
P['cap-drums'] = (g, w, h, { spec, params: p, view: v, t }) => {
  night(g, w, h); const key = V(v, 'key', 60), age = V(v, 'age', 9), rcm = V(v, 'radius_cm', spec.cap.radius_cm), r = clamp(Math.sqrt(rcm) * 62, 26, h * .36), wet = V(v, 'wet', p.wet), cx = w / 2, cy = h * .43
  const cols = [spec.colours[0], blend(spec.colours[1], '#20262e', wet * .5), spec.colours[2]]
  capUnder(g, cx, cy, r, cols, { gills: clamp(Math.round(r / 4), 18, 64), t, light: () => age < 1.2 ? (1 - age / 1.2) * .8 : 0, rings: spec.cap.overtones.slice(0, 4).map((o, k) => [clamp(.95 / Math.sqrt(o)), age < 2 ? (1 - age / 2) * .8 : .12]) })
  if (age < .9) { ripple(g, cx + (p.pos - .5) * r, cy, r * 1.1, age / .9, INK.water); const d = V(v, 'drop_mm', 3); g.fillStyle = rgba(INK.water, 1 - age); g.beginPath(); g.arc(cx + (p.pos - .5) * r, cy - 14 - age * 40, d * 2, 0, TAU); g.fill() }
  for (let i = 0; i < 5; i++) mushroom(g, 70 + i * (w - 140) / 4, h - 70, clamp(Math.sqrt(spec.cap.radius_cm * (0.5 + i * .35)) * 34, 16, 120) * (.6 + .4 * V(v, 'open', 1)), V(v, 'open', 1) < .4 ? 'puffball' : spec.fruit.form, spec.colours, { light: age < 1 && Math.abs((key - 48) / 24 - (4 - i) / 4) < .13 ? 1 - age : 0, t })
  caption(g, w, h, [`this key is a cap about ${(rcm * 2).toFixed(1)} cm across · ${Math.round(wet * 100)}% soaked`]); text(g, 'seen from below; the dotted rings are where the cap stays still', 22, 34, { size: 18 })
}
P['spike-table'] = (g, w, h, { spec, view: v, params: p, t }) => {
  night(g, w, h); const wt = spec.wavetable, F = wt.amps.length, pos = V(v, 'pos', p.pos), right = V(v, 'right', pos), rows = 30
  for (let r = 0; r < rows; r++) { // ridges of one cycle each, young at the back, as the wave changed while the fungus grew
    const f = Math.round(r / (rows - 1) * (F - 1)), y = 110 + r * (h - 330) / rows, x0 = 120 + (rows - r) * 5, ww = w - 240 - (rows - r) * 10 + r * 0, wv = wave(wt.amps[f], wt.phases[f], 90), near = Math.abs(f / (F - 1) - pos) < .6 / rows, nearR = Math.abs(f / (F - 1) - right) < .6 / rows && !near
    g.beginPath(); g.moveTo(x0, y + 30); for (let i = 0; i < 90; i++) g.lineTo(x0 + i / 89 * ww, y - wv[i] * 30); g.lineTo(x0 + ww, y + 30); g.closePath(); g.fillStyle = '#0c0d11'; g.fill()
    g.beginPath(); for (let i = 0; i < 90; i++) g.lineTo(x0 + i / 89 * ww, y - wv[i] * 30); g.strokeStyle = near ? INK.gold : nearR ? '#9fe8ff' : rgba(spec.colours[0], .2 + .5 * r / rows); g.lineWidth = near || nearR ? 3.5 : 1.4; g.stroke()
  }
  hypha(g, 60, h - 110, w - 120, 16, { colour: spec.colours[0], t, pulses: [(t * .23) % 1, (t * .23 + .5) % 1], flow: .3 }); text(g, 'young', 40, 112, { size: 17 }); text(g, 'full grown', 40, h - 222, { size: 17 })
  caption(g, w, h, [V(v, 'scaleNote', '') || (wt.from == 'unit' ? 'one excitable unit, not a network: this size has no electrical model' : `the voltage between two points on the network, ${F} moments of its growth`)])
}
P['coupled-spikes'] = (g, w, h, { spec, view: v, params: p, t }) => {
  night(g, w, h); const u = V(v, 'v', []), n = u.length || Math.round(p.units), x0 = 90, L = w - 180, y = h * .52
  hypha(g, x0, y, L, 26, { colour: spec.colours[0], t, walls: n, pulses: u.map((x, i) => x > .3 ? (i + .5) / n : -1).filter(x => x >= 0), flow: .2 })
  for (let i = 0; i < n; i++) { const x = x0 + (i + .5) / n * L, a = clamp((u[i] + 2) / 4), m = memory('cs' + i, u[i] || 0, 120); g.strokeStyle = rgba('#9fe8ff', .25 + .75 * a); g.lineWidth = 2; g.beginPath(); m.forEach((q, k) => g.lineTo(x - L / n * .4 + k / 120 * L / n * .8, y - 120 - q * 34)); g.stroke(); text(g, 'unit ' + (i + 1), x, y + 80, { align: 'center', size: 17 }); if (i) { g.strokeStyle = rgba(INK.amber, .2 + p.coupling * 1.6); g.lineWidth = 2 + p.coupling * 10; g.beginPath(); g.moveTo(x - L / n * .62, y + 50); g.lineTo(x - L / n * .38, y + 50); g.stroke() } }
  const c = V(v, 'cardinal_c', null); if (c) { const X = 90, Y = h - 96, W2 = 300; g.fillStyle = '#2a2318'; g.fillRect(X, Y, W2, 10); const f = q => X + clamp((q - c[0]) / (c[2] - c[0])) * W2; g.fillStyle = INK.moss; g.fillRect(f(c[1]) - 2, Y - 5, 4, 20); g.fillStyle = INK.gold; g.beginPath(); g.arc(f(V(v, 'temp_c', c[1])), Y + 5, 8, 0, TAU); g.fill(); text(g, `${c[0]} °C`, X, Y - 10, { size: 15 }); text(g, `${c[2]} °C`, X + W2, Y - 10, { size: 15, align: 'right' }) }
  text(g, 'each unit of the hypha fires, recovers, and nudges its neighbours', 22, 40, { size: 18 }); caption(g, w, h, [V(v, 'scaleNote', '') || (V(v, 'firing', true) ? 'firing' : 'held below its threshold: silent')])
}
P['turgor-bow'] = (g, w, h, { spec, view: v, params: p, t }) => {
  const y0 = ground(g, w, h, { horizon: .16, seed: 11, stars: false }), e = clamp(V(v, 'energy', 0) * 3), n = V(v, 'tips', 1), pulses = V(v, 'pulses', 0), kick = Math.max(0, 1 - since('tb', pulses, t) * 6)
  for (let i = 0; i < Math.min(n, 5); i++) { // growing tips forcing their way between the grains, each advancing in pulses
    const y = y0 + 90 + i * (h - y0 - 200) / Math.max(1, Math.min(n, 5)), len = w * (.5 + .08 * hash(i * 3)) + ((t * p.rate * .4 + i * 13) % 60)
    hypha(g, -20, y, len, 22 - Math.min(n, 5) * 2, { colour: spec.colours[0], t, pressure: p.pressure * (1 + kick), flow: clamp(p.rate / 60), wobble: 3 })
    for (let k = 0; k < 9; k++) { const a = (hash(i * 31 + k) - .5) * 2.2, d = 30 + hash(k * 7 + i) * 60 + kick * 10, X = len - 20 + Math.cos(a) * d, Y = y + Math.sin(a) * d; g.fillStyle = `rgba(${130 + hash(k) * 50 | 0},${100 + hash(k + 2) * 40 | 0},${70 + hash(k + 4) * 30 | 0},.55)`; g.beginPath(); g.ellipse(X, Y, 9 + hash(k * 3) * 12, 7 + hash(k * 5) * 8, hash(k) * 3, 0, TAU); g.fill() }
  }
  const st = stageOf(spec, V(v, 'stage', p.stage)); g.fillStyle = rgba('#000000', .45); g.fillRect(w - 250, y0 + 14, 236, 236); network(g, st, w - 246, y0 + 18, 228, 228, { colour: spec.colours[0], glow: (i, x, y) => Math.abs(Math.hypot(x, y) - p.pos) < .12 ? .3 + e : 0 })
  text(g, 'the web it bows', w - 244, y0 + 272, { size: 16 }); caption(g, w, h, [`${n} tip${n > 1 ? 's' : ''} · ${V(v, 'rate', p.rate).toFixed(0)} pushes a second` + (V(v, 'temp_c', null) != null ? ` · ${v.temp_c.toFixed(0)} °C` : ''), V(v, 'scaleNote', '') || 'turgor pressure drives each tip forward in small jumps'])
}
P['rhizomorph-bass'] = (g, w, h, { spec, view: v, params: p, t }) => {
  const y0 = ground(g, w, h, { horizon: .2, seed: 5, stars: false }), y = y0 + (h - y0) * .45, x0 = 110, L = w - 220, thick = V(v, 'thick', 1 + p.contrast * 3), on = V(v, 'sounding', 0), j = p.joint, amp = on ? 16 : 2, strands = 9
  for (const X of [x0 - 70, x0 + L]) { g.fillStyle = '#4a3320'; g.fillRect(X, y - 70, 70, 140); g.strokeStyle = rgba('#2b1c10', .8); g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(X + 6, y - 60 + k * 24); g.lineTo(X + 64, y - 56 + k * 24); g.stroke() } }
  for (let s = 0; s < strands; s++) { g.beginPath(); for (let u = 0; u <= 1.001; u += .02) { const mid = u > j && u < 1 - j ? 1 : 0, wdt = (8 + mid * thick * 7) * ((s / (strands - 1)) - .5) * 2, yy = y + wdt + Math.sin(u * Math.PI) * Math.sin(t * 22) * amp + Math.sin(u * Math.PI * 3) * Math.sin(t * 61) * amp * .3; g.lineTo(x0 + u * L, yy) } g.strokeStyle = rgba(s == 0 || s == strands - 1 ? blend(spec.colours[0], '#1a1208', clamp(V(v, 'rind', p.rind)) * .8 + .2) : spec.colours[0], .8); g.lineWidth = s == 0 || s == strands - 1 ? 4 : 2; g.stroke() }
  text(g, 'wood', x0 - 60, y - 84, { size: 16 }); text(g, 'wood', x0 + L + 8, y - 84, { size: 16 }); text(g, 'a cord strung between two pieces of wood: thin where it leaves, thick in the middle', 22, 40, { size: 18 })
  caption(g, w, h, [`the middle is ${thick.toFixed(1)} times as heavy as the ends · this species' cords reach ${V(v, 'cord_max', spec.numbers.cord_max)} hyphae thick`, V(v, 'scaleNote', '')])
}
P['fairy-ring'] = (g, w, h, { spec, view: v, params: p, t }) => {
  const gd = g.createRadialGradient(w / 2, h * .55, 30, w / 2, h * .55, w * .7); gd.addColorStop(0, '#1d2a17'); gd.addColorStop(1, '#0b1009'); g.fillStyle = gd; g.fillRect(0, 0, w, h)
  for (let i = 0; i < 500; i++) { g.strokeStyle = `rgba(${70 + hash(i) * 50 | 0},${110 + hash(i * 3) * 60 | 0},60,.25)`; g.beginPath(); const x = hash(i * 7) * w, y = hash(i * 11) * h; g.moveTo(x, y); g.lineTo(x + 2, y - 7); g.stroke() }
  const rad = V(v, 'radius', p.age * .3), R = clamp(60 + Math.log2(1 + rad) * 95, 60, w * .44), cx = w / 2, cy = h * .54, sq = .5, on = V(v, 'sounding', 0), gap = V(v, 'gap', p.gap), band = clamp(p.band * 26, 6, 60)
  g.strokeStyle = rgba('#2e4a22', .9); g.lineWidth = band; g.beginPath(); g.ellipse(cx, cy, R - band, (R - band) * sq, 0, 0, TAU); g.stroke() // the dark, fed grass just inside the ring
  g.strokeStyle = rgba('#5a4a2a', .5); g.lineWidth = band * .5; g.beginPath(); g.ellipse(cx, cy, R - band * 1.9, (R - band * 1.9) * sq, 0, 0, TAU); g.stroke()
  const N = clamp(Math.round(R / 7), 10, 60), order = Array.from({ length: N }, (_, i) => i).sort((a, b) => Math.sin(a / N * TAU) - Math.sin(b / N * TAU))
  for (const i of order) { const a = i / N * TAU; if (gap > 0 && Math.abs(a - Math.PI * 1.5) < gap * 1.2) continue; const wv = on ? Math.max(0, Math.cos(a - t * 2.2), Math.cos(a + t * 2.2)) ** 6 : 0; mushroom(g, cx + Math.cos(a) * R, cy + Math.sin(a) * R * sq, 22 + 16 * (.5 + .5 * Math.sin(a)) + hash(i) * 6, spec.fruit.form, spec.colours, { light: wv, t }) }
  caption(g, w, h, [`a ring ${(rad * 2).toFixed(1)} m across, widening ${V(v, 'advance_m_y', 0).toFixed(2)} m a year` + (V(v, 'beat_hz', 0) > 0 ? ` · beating ${v.beat_hz.toFixed(1)} times a second` : ''), V(v, 'scaleNote', '') || 'the wave runs both ways round the ring'])
}
P['gill-comb'] = (g, w, h, { spec, view: v, params: p, t }) => {
  night(g, w, h); const n = Math.round(p.gills), e = clamp(V(v, 'energy', 0) * 4), struck = V(v, 'struck', -1), of = V(v, 'of', n), cx = w / 2, cy = h * .46, r = h * .36, kind = V(v, 'under', 'gills')
  capUnder(g, cx, cy, r, spec.colours, { gills: Math.max(n * 3, 24), t, light: (i, N) => { const k = Math.floor(i / N * n); return (struck >= 0 && k <= struck ? e * (1 - (struck - k) / Math.max(1, of)) : 0) }, turn: -Math.PI / 2 })
  if (kind == 'tubes' || kind == 'spines') for (let i = 0; i < 260; i++) { const a = hash(i * 3) * TAU, d = Math.sqrt(hash(i * 7)) * r * .92; g.fillStyle = rgba(kind == 'tubes' ? '#000000' : spec.colours[0], kind == 'tubes' ? .5 : .7); g.beginPath(); g.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, kind == 'tubes' ? 3.5 : 2, 0, TAU); g.fill() }
  text(g, 'the cap from below: each ' + (kind == 'tubes' ? 'tube' : kind == 'spines' ? 'spine' : 'gill') + ' is a thin plate fixed along one edge', 22, 40, { size: 18 })
  caption(g, w, h, [`${n} sounding · a real cap of this kind has about ${V(v, 'real_count', '?')}`, V(v, 'scaleNote', '') || (V(v, 'has_gills', true) ? '' : 'this species has none of its own: played as gills')])
}
// ------------------------------------------------------------------ atmospheres
P['rain-on-caps'] = (g, w, h, { spec, view: v, params: p, t }) => {
  const gd = g.createLinearGradient(0, 0, 0, h); gd.addColorStop(0, '#0f1712'); gd.addColorStop(1, '#1a2015'); g.fillStyle = gd; g.fillRect(0, 0, w, h); const sq = .62, s = w * .86, ox = (w - s) / 2, oy = h * .12
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(${60 + hash(i) * 40 | 0},${90 + hash(i * 3) * 50 | 0},50,.3)`; g.fillRect(ox + hash(i * 7) * s, oy + hash(i * 11) * s * sq, 3, 3) }
  g.strokeStyle = rgba(INK.dim, .6); g.setLineDash([4, 8]); g.strokeRect(ox, oy, s, s * sq); g.setLineDash([])
  const caps = V(v, 'caps', Array.from({ length: Math.round(p.count || 12) }, (_, i) => [.08 + hash(i * 3) * .84, .08 + hash(i * 7) * .84, spec.cap.radius_cm * (.5 + hash(i * 11)) * (p.size || 1)])).slice().sort((a, b) => a[1] - b[1]), wet = V(v, 'wet', 0)
  for (const [x, y, r] of caps) { const X = ox + x * s, Y = oy + y * s * sq, R = Math.max(4, r / 100 * s), c = blend(spec.colours[1], '#1c2530', wet * .45), gd2 = g.createRadialGradient(X - R * .2, Y - R * .2, 1, X, Y, R); gd2.addColorStop(0, shade(c, .3)); gd2.addColorStop(1, shade(c, -.3)); g.fillStyle = rgba('#000000', .35); g.beginPath(); g.ellipse(X + R * .25, Y + R * .5, R, R * sq, 0, 0, TAU); g.fill(); g.fillStyle = gd2; g.beginPath(); g.ellipse(X, Y, R, R * sq, 0, 0, TAU); g.fill() }
  for (const [x, y, r, age, d] of V(v, 'hits', [])) if (age < .8) ripple(g, ox + x * s, oy + y * s * sq, (r ? r / 100 * s : 4) + 30 + (d || 2) * 6, age / .8, r ? '#cfe6ff' : INK.water, sq)
  rain(g, w, h, t, clamp(V(v, 'rainNow', p.rain) / 40 + (v ? .08 : 0)))
  if (!v) text(g, 'Turn sound on to start the rain', w / 2, 40, { align: 'center', size: 22 })
  caption(g, w, h, [`one square metre · ${caps.length} caps · ${Math.round(wet * 100)}% soaked`, V(v, 'scaleNote', '')])
}
P['spore-cloud'] = (g, w, h, { spec, view: v, params: p, t }) => {
  const hour = V(v, 'hour', 12), dayL = clamp(Math.cos((hour - 12) / 24 * TAU) * .5 + .5), y0 = ground(g, w, h, { horizon: .7, seed: 21, sky: blend('#141a24', '#3b4a5c', dayL) }), humidRaw = V(v, 'humid', p.humid), humid = clamp(humidRaw > 1.5 ? humidRaw / 100 : humidRaw)
  g.fillStyle = rgba('#c8d8e0', humid * .12); g.fillRect(0, y0 - 150, w, 150)
  const a = (hour / 24) * TAU - Math.PI / 2; g.fillStyle = dayL > .5 ? rgba('#f4c86a', .8) : rgba('#c9d6ea', .7); g.beginPath(); g.arc(w / 2 + Math.cos(a) * w * .4, y0 * .6 - Math.sin(a + Math.PI / 2) * y0 * .45, 16, 0, TAU); g.fill()
  const caps = V(v, 'caps', Array.from({ length: Math.round(p.count) }, (_, i) => [(i + .5) / p.count, spec.cap.radius_cm, 0]))
  caps.forEach(([pan, r, out], i) => { const x = 60 + pan * (w - 120), S = clamp(Math.sqrt(r) * 54, 26, 210); mushroom(g, x, y0 + 4, S, spec.fruit.form, spec.colours, { light: clamp(out * 2), t, under: true }); if (v) spores(g, Math.round(6 + clamp(out) * 60), 0, 0, w * .5, y0 * .9, t, { from: [x, y0 - S * (V(v, 'thrown', true) ? .9 : .5)], colour: spec.colours[1] == '#000000' ? INK.spore : shade(spec.colours[1], .4), speed: .6 + p.speed, wind: .5, fall: V(v, 'thrown', true) ? -.1 : .5, seed: i * 97, alpha: .8 }) })
  caption(g, w, h, [`${['launched from the gills', 'fired in puffs', 'knocked out by raindrops'][V(v, 'way', 0)] || 'launched'} · air ${Math.round(humid * 100)}% humid · ${hour.toFixed(0)}:00`, V(v, 'scaleNote', '')])
}
P['spike-chord'] = (g, w, h, { spec, view: v, t }) => {
  night(g, w, h); const mins = V(v, 'mins', [70]), hz = V(v, 'hz', []), gains = V(v, 'gains', []), up = V(v, 'up', []), n = mins.length
  for (let i = 0; i < n; i++) { const y = 90 + i * (h - 190) / n, rate = hz[i] ? clamp(Math.log2(1 + hz[i] / (hz[n - 1] || hz[i])) * .5, .05, 2) : .3, a = clamp((gains[i] == null ? 1 : gains[i]) * 1.4, .15, 1); g.globalAlpha = a; hypha(g, 210, y, w - 260, 11, { colour: spec.colours[0], t, flow: .2, walls: 3, pulses: [(t * rate * .3) % 1, (t * rate * .3 + .33) % 1, (t * rate * .3 + .66) % 1], pulseColour: up[i] === 0 ? '#5a8aa0' : '#9fe8ff' }); g.globalAlpha = 1; text(g, `every ${mins[i] >= 1 ? mins[i].toFixed(0) + ' min' : (mins[i] * 60).toFixed(0) + ' s'}`, 22, y + 6, { size: 18 }); text(g, hz[i] ? hz[i].toFixed(0) + ' Hz' : '', 122, y + 6, { size: 16, colour: INK.dim }) }
  text(g, 'six fungi whose spiking has been timed, all sped up by the same amount', 22, 40, { size: 18 }); caption(g, w, h, [V(v, 'speed', 0) ? `sped up ${Math.round(v.speed).toLocaleString()} times` : 'Turn sound on to start', V(v, 'scaleNote', '')])
}
P['decay'] = (g, w, h, { spec, view: v, params: p, t }) => {
  const y0 = ground(g, w, h, { horizon: .5, seed: 31 }), x0 = 70, L = w - 140, R = 62, prof = V(v, 'profile', Array(12).fill(p.decay)), brown = V(v, 'brown', p.kind > .5), y = y0 - R + 22
  for (let k = 0; k < prof.length; k++) { const u = prof[k], xa = x0 + k / prof.length * L, ww = L / prof.length + 1, base = blend('#8a623a', brown ? '#3a2616' : '#d8cdb4', clamp(u)); g.fillStyle = base; g.fillRect(xa, y - R + u * 14, ww, R * 2 - u * 22)
    g.strokeStyle = rgba('#2b1c10', .5); g.lineWidth = 1.5; for (let q = 0; q < 6; q++) { g.beginPath(); g.moveTo(xa, y - R + 14 + q * 20); g.lineTo(xa + ww, y - R + 14 + q * 20 + (hash(k * 7 + q) - .5) * 6); g.stroke() }
    if (brown) for (let q = 0; q < u * 6; q++) { g.strokeStyle = rgba('#120a05', .8); g.lineWidth = 2; const X = xa + hash(k * 13 + q) * ww; g.beginPath(); g.moveTo(X, y - R + 16); g.lineTo(X + (hash(q + k) - .5) * 10, y + R - 20); g.stroke() } else for (let q = 0; q < u * 16; q++) { g.strokeStyle = rgba('#fffaf0', .5); g.beginPath(); const X = xa + hash(k * 17 + q) * ww, Y = y - R + 16 + hash(q * 5 + k) * (R * 2 - 40); g.moveTo(X, Y); g.lineTo(X + 14, Y + (hash(q) - .5) * 5); g.stroke() } }
  g.fillStyle = '#5c4026'; g.beginPath(); g.ellipse(x0, y, 16, R - 2, 0, 0, TAU); g.fill(); g.fillStyle = '#6e4e30'; g.beginPath(); g.ellipse(x0 + L, y, 16, R - 2, 0, 0, TAU); g.fill(); for (let q = 1; q < 4; q++) { g.strokeStyle = rgba('#3a2616', .7); g.beginPath(); g.ellipse(x0 + L, y, 16 * q / 4, (R - 2) * q / 4, 0, 0, TAU); g.stroke() }
  const front = V(v, 'front', 1); g.strokeStyle = rgba(INK.gold, .7); g.setLineDash([4, 6]); g.beginPath(); g.moveTo(x0 + front * L, y - R - 16); g.lineTo(x0 + front * L, y + R + 6); g.stroke(); g.setLineDash([])
  for (const [fx, fr, grown] of V(v, 'fruits', [])) mushroom(g, x0 + fx * L, y - R + 4, clamp(Math.sqrt(fr) * 40, 18, 110), spec.fruit.form, spec.colours, { grown, t })
  network(g, stageOf(spec, clamp(V(v, 'age', .3))), x0, y0 + 10, L, h - y0 - 70, { colour: spec.colours[0], tilt: .5, alpha: .5, grown: clamp(.2 + V(v, 'age', .3)) })
  if (p.rain > 0) rain(g, w, y - R, t, clamp(p.rain / 30))
  const m = V(v, 'modes', []); caption(g, w, h, [`${brown ? 'brown rot: the wood cracks into cubes and loses its stiffness' : 'white rot: the wood turns pale and stringy and loses its weight'} · lowest note ${m[0] ? m[0].toFixed(0) : V(v, 'f', 0).toFixed(0)} Hz`, V(v, 'scaleNote', '')])
}
P['after-rain'] = (g, w, h, { spec, view: v, params: p, t }) => {
  const y0 = ground(g, w, h, { horizon: .2, seed: 41, wet: v ? Math.max(...v.wet) : 0 }), wet = V(v, 'wet', Array(8).fill(0)), u = V(v, 'v', Array(8).fill(-1.2)), n = wet.length, D = h - y0 - 60
  for (let i = 0; i < n; i++) { g.fillStyle = rgba('#3f7ea8', clamp(wet[i]) * .45); g.fillRect(0, y0 + i * D / n, w, D / n + 1); const y = y0 + (i + .5) * D / n, a = clamp((u[i] + 2) / 4), X = w * .5 + Math.sin(i * 1.7) * w * .2
    hypha(g, 80, y, w - 160, 9, { colour: spec.colours[0], t, flow: clamp(wet[i]), walls: 4, wobble: 4, pulses: a > .55 ? [.5 + Math.sin(t * 3 + i) * .4] : [] })
    const gd = g.createRadialGradient(X, y, 0, X, y, 14 + a * 34); gd.addColorStop(0, rgba('#9fe8ff', a)); gd.addColorStop(1, rgba('#9fe8ff', 0)); g.fillStyle = gd; g.beginPath(); g.arc(X, y, 14 + a * 34, 0, TAU); g.fill() }
  if (V(v, 'since', 99) < 3) rain(g, w, y0, t, 1 - V(v, 'since', 0) / 3)
  text(g, 'surface', 22, y0 + 22, { size: 16 }); text(g, `${V(v, 'depth', 20).toFixed ? V(v, 'depth', 20).toFixed(0) : 20} cm down`, 22, h - 70, { size: 16 })
  caption(g, w, h, [V(v, 'since', 99) < 99 ? `rain ${V(v, 'since', 0).toFixed(0)} s ago: the wet front is moving down and each layer of mycelium fires as it arrives` : 'waiting for rain', V(v, 'scaleNote', '')])
}
const liveScene = flow => (g, w, h, { spec, view: v, live, t }) => {
  const st = live.stage, tp = live.taps || {}, y0 = ground(g, w, h, { horizon: .34, seed: flow ? 51 : 61, wet: V(v, 'wet', 0) })
  if (!st) { text(g, 'Turn sound on: a colony will start to grow', w / 2, y0 - 30, { align: 'center', size: 24 }); return }
  const ev = since('ff' + flow, V(v, 'strikes', 0), t), net = network(g, st, 20, y0 + 6, w - 40, h - y0 - 96, { colour: spec.colours[0], cord: flow ? INK.amber : null, tilt: .62, tips: true, t, flow: clamp(V(v, 'flowPush', 0) * 3), pulse: [{ at: clamp(ev * 2), a: clamp(1 - ev * 2), size: 5 }] })
  for (const [pan, grown, shed] of V(v, 'capList', [])) { const x = 60 + pan * (w - 120), S = fruitPx(spec, 50, 190); mushroom(g, x, y0 + 4, S, spec.fruit.form, spec.colours, { grown, t, light: shed ? .5 : 0 }); if (shed) spores(g, 20, 0, 0, w * .3, y0, t, { from: [x, y0 - S * .8], wind: .4, seed: pan * 100 | 0 }) }
  if (V(v, 'wet', 0) > .3) rain(g, w, y0, t, V(v, 'wet', 0))
  caption(g, w, h, [`${tp.days > 400 ? (tp.days / 365).toFixed(1) + ' years' : 'day ' + (tp.days || 0).toFixed(1)} · ${tp.tips || 0} growing tips · reaches ${st.reach_mm > 100 ? (st.reach_mm / 1000).toFixed(2) + ' m' : st.reach_mm.toFixed(1) + ' mm'} · lowest note ${st.hz[0] ? (st.hz[0] < 20 ? st.hz[0].toFixed(1) : st.hz[0].toFixed(0)) : '—'} Hz` + (flow ? ` · ${tp.cords || 0} cord pieces` : ''), V(v, 'scaleNote', '')])
}
P['forest-floor'] = liveScene(0); P['foraging'] = liveScene(1)
P['combat-zone'] = (g, w, h, { spec, spec2, view: v, params: p, t }) => {
  soilPlan(g, w, h, 9); const share = V(v, 'share', .5), hush = V(v, 'hush', [0, 0]), stg = V(v, 'stage', [p.stage, p.stage]), mx = w * clamp(share, .15, .85), touch = V(v, 'touch', p.meet)
  g.save(); g.beginPath(); g.rect(0, 0, mx, h); g.clip(); network(g, stageOf(spec, stg[0]), -w * .1 + (mx - w * .5) * .5, 10, w * .7, h - 80, { colour: spec.colours[0], alpha: 1 - .6 * hush[0], tips: true, t }); g.restore()
  if (spec2) { g.save(); g.beginPath(); g.rect(mx, 0, w - mx, h); g.clip(); network(g, stageOf(spec2, stg[1]), w * .4 + (mx - w * .5) * .5, 10, w * .7, h - 80, { colour: blend(spec2.colours[0], '#9ed0e6', .45), alpha: 1 - .6 * hush[1], tips: true, t }); g.restore() }
  g.strokeStyle = rgba('#3b1d12', .5 + .5 * touch); g.lineWidth = 6 + 22 * touch; g.beginPath(); for (let y = 0; y <= h; y += 14) g.lineTo(mx + Math.sin(y * .04 + 2) * 14 + (hash(y) - .5) * 8, y); g.stroke() // the pigmented barrier where they meet
  const flash = Math.max(hush[0], hush[1]); if (flash > .05) { g.strokeStyle = rgba(INK.ember, flash); g.lineWidth = 3; g.beginPath(); for (let y = 0; y <= h; y += 14) g.lineTo(mx + Math.sin(y * .04 + 2) * 14 + (hash(y) - .5) * 8, y); g.stroke() }
  text(g, spec.name, 22, 36, { size: 20, serif: true, colour: spec.colours[0] }); if (spec2) text(g, spec2.name, w - 22, 36, { size: 20, serif: true, colour: '#9ed0e6', align: 'right' })
  caption(g, w, h, [`${V(v, 'meetings', 0)} meetings · the left one holds ${Math.round(share * 100)}% of the ground` + (V(v, 'phase', '') ? ` · ${v.phase}` : ''), V(v, 'scaleNote', '')])
}
// ------------------------------------------------------------------ effects
P['mycelium-reverb'] = (g, w, h, { spec, view: v, params: p, t }) => {
  soilPlan(g, w, h, 13); const pos = V(v, 'pos', p.stage), st = stageOf(spec, pos), e = clamp(V(v, 'energy', 0) * 2.5), where = V(v, 'where', p.where), m = memory('rev', e, 90)
  const net = network(g, st, w * .14, 14, w * .72, h - 90, { colour: spec.colours[0], t, tips: V(v, 'growing', 0) > 0, glow: (i, x, y) => Math.abs(Math.hypot(x, y) - where) < .08 ? .25 + e : e * .25 * hash(i + (t * 12 | 0)), pulse: [0, 1, 2, 3, 4].map(k => ({ at: (where + (t * .35 + k / 5) % 1) % 1, a: (m[m.length - 1 - k * 12 | 0] || 0) * (1 - k / 6), colour: '#9fe8ff', size: 5 })) })
  for (let k = 0; k < 4; k++) { g.strokeStyle = rgba('#9fe8ff', (.5 - k * .1) * (e + .15)); g.lineWidth = 3; g.beginPath(); g.arc(30, h / 2, 30 + k * 26 + (t * 60) % 26, -.5, .5); g.stroke() } // the sound coming in
  text(g, 'sound in', 16, h / 2 - 96, { size: 17 }); caption(g, w, h, [`day ${st.days} · reaches ${st.reach_mm} mm · lowest mode ${V(v, 'low', st.hz[0]).toFixed(0)} Hz`, V(v, 'scaleNote', '') || 'the sound shakes the web; what you hear is the web ringing on'])
}
P['cord-delay'] = (g, w, h, { spec, view: v, params: p, t }) => {
  const y0 = ground(g, w, h, { horizon: .14, seed: 71, stars: false }), ms = V(v, 'ms', [80, 120, 160, 210, 260, 330]), thick = V(v, 'thick', ms.map(() => 1)), pan = V(v, 'pan', ms.map((_, i) => i / 5)), back = V(v, 'back', ms.map(() => .5)), mm = V(v, 'mm', ms), top = Math.max(...ms, 1), e = clamp(V(v, 'energy', 0) * 3)
  g.fillStyle = '#4a3320'; g.fillRect(20, y0 + 30, 50, h - y0 - 110); text(g, 'sound in', 22, y0 + 22, { size: 16 })
  ms.forEach((d, i) => { const y = y0 + 60 + pan[i] * (h - y0 - 190), len = 70 + d / top * (w - 210), r = clamp(4 + Math.sqrt(thick[i]) * 3.5, 5, 22), trip = Math.max(.15, d / 1000); hypha(g, 70, y, len, r, { colour: spec.colours[0], t, flow: .4, walls: 2, pulses: [(t / trip / 2) % 1, 1 - ((t / trip / 2 + .5) % 1)].map(x => x), pulseColour: rgba('#9fe8ff', .5 + .5 * e) }); g.fillStyle = '#5c4026'; g.beginPath(); g.arc(70 + len + 14, y, 16 + back[i] * 12, 0, TAU); g.fill(); text(g, `${d.toFixed(0)} ms · ${(mm[i] || 0).toFixed(0)} mm`, 70 + len + 40, y + 6, { size: 15 }) })
  caption(g, w, h, [`six cords of this network: a sound travels out along each and comes back from the wood at its end`, V(v, 'scaleNote', '')])
}
P['excitable-gate'] = (g, w, h, { view: v, params: p, spec, t }) => {
  night(g, w, h); const X = q => w * .3 + q * w * .1, Y = q => h * .42 - q * h * .16, m = memory('gate', [V(v, 'v', -1.2), V(v, 'w', -.6)], 160), open = V(v, 'gate', 0)
  g.strokeStyle = rgba(INK.dim, .7); g.lineWidth = 2; g.beginPath(); for (let q = -2.3; q <= 2.3; q += .05) g.lineTo(X(q), Y(q - q * q * q / 3 + .3)); g.stroke(); g.beginPath(); g.moveTo(X(-2.3), Y((-2.3 + .7) / .8)); g.lineTo(X(1.2), Y((1.2 + .7) / .8)); g.stroke()
  g.beginPath(); m.forEach(([a, b], i) => g.lineTo(X(a), Y(b))); g.strokeStyle = rgba('#9fe8ff', .8); g.lineWidth = 3; g.stroke(); const [a, b] = m[m.length - 1]; g.fillStyle = open > .5 ? INK.gold : '#9fe8ff'; g.beginPath(); g.arc(X(a), Y(b), 10, 0, TAU); g.fill()
  text(g, 'resting', X(-1.9), Y(-1.3) + 30, { size: 16 }); text(g, 'firing', X(1.5), Y(.6), { size: 16 }); text(g, 'voltage →', X(-.4), h * .78, { size: 16 })
  const ch = V(v, 'chain', [a]); hypha(g, w * .62, h * .3, w * .32, 16, { colour: spec.colours[0], t, walls: ch.length, pulses: ch.map((q, i) => q > .3 ? (i + .5) / ch.length : -1).filter(q => q >= 0) })
  for (const [lab, val, yy] of [['left ear', open, h * .5], ['right ear', V(v, 'gateR', open), h * .6]]) { g.fillStyle = rgba(INK.gold, .15 + .85 * val); g.fillRect(w * .62, yy, w * .32 * (.1 + .9 * val), 26); g.strokeStyle = INK.dim; g.strokeRect(w * .62, yy, w * .32, 26); text(g, lab, w * .62, yy - 8, { size: 15 }) }
  text(g, 'one excitable unit: sound pushes it; past its threshold it fires and lets the sound through', 22, 40, { size: 18 }); caption(g, w, h, [`${V(v, 'fired', 0)} firings · this species spikes every ${V(v, 'interval', spec.numbers.spike_interval_min)} min`, V(v, 'scaleNote', '')])
}
P['spore-granulator'] = (g, w, h, { spec, view: v, params: p, t }) => {
  night(g, w, h); const S = clamp(Math.sqrt(V(v, 'radius', spec.cap.radius_cm)) * 90, 90, 300), cx = w / 2
  mushroom(g, cx, S * 1.25 + 30, S, spec.fruit.form, spec.colours, { under: true, light: clamp(V(v, 'burst', 0)), t })
  const top = S * .25 + 40
  for (const [back, pan] of V(v, 'seen', [])) { const y = top + clamp(back / .6) * (h - top - 90), x = 60 + pan * (w - 120); g.fillStyle = rgba(INK.spore, .75); g.beginPath(); g.ellipse(x, y, 5, 3.4, pan, 0, TAU); g.fill(); g.strokeStyle = rgba(INK.spore, .16); g.beginPath(); g.moveTo(cx + (pan - .5) * S * .8, top); g.quadraticCurveTo(x, top + 30, x, y); g.stroke() }
  const site = V(v, 'site', null); if (site) mushroom(g, 60 + site[1] * (w - 120), h - 70, 40, spec.fruit.form, spec.colours, { grown: clamp(1 - site[2]), light: .6 })
  text(g, 'each grain of the sound leaves like a spore: flung off, slowed by the air, carried sideways', 22, h - 60, { size: 17 }); caption(g, w, h, [`${V(v, 'rate', p.rate).toFixed(1)} grains a second · further down was taken from longer ago`])
}
P['rot-filter'] = (g, w, h, { spec, view: v, params: p, t }) => {
  night(g, w, h); const u = clamp(V(v, 'u', p.decay)), brown = V(v, 'brown', p.kind > .5), cx = w * .36, cy = h * .46, R = h * .34
  g.fillStyle = '#8a623a'; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill(); for (let k = 1; k < 12; k++) { g.strokeStyle = rgba('#5c4026', .7); g.lineWidth = 2; g.beginPath(); g.arc(cx + k, cy - k * .5, R * k / 12, 0, TAU); g.stroke() }
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip() // rot eating in from one side, in the manner of its kind
  const edge = cx - R + u * R * 2.1; g.fillStyle = brown ? rgba('#2c1a0e', .88) : rgba('#e6dcc6', .85); g.beginPath(); g.moveTo(cx - R, cy - R); for (let y = cy - R; y <= cy + R; y += 12) g.lineTo(edge + Math.sin(y * .05 + t * .3) * 18 + (hash(y | 0) - .5) * 14, y); g.lineTo(cx - R, cy + R); g.closePath(); g.fill()
  for (let i = 0; i < 90; i++) { const x = cx - R + hash(i * 3) * (edge - cx + R), y = cy - R + hash(i * 7) * R * 2; if (brown) { g.strokeStyle = rgba('#0c0603', .9); g.lineWidth = 2; g.strokeRect(x, y, 16 + hash(i) * 14, 14 + hash(i * 5) * 12) } else { g.strokeStyle = rgba('#fffdf5', .55); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 26, y + (hash(i) - .5) * 8); g.stroke() } }
  g.restore(); g.strokeStyle = '#3a2616'; g.lineWidth = 10; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke()
  mushroom(g, cx + R * .7, cy - R * .64, 90, spec.fruit.form == 'agaric' ? 'bracket' : spec.fruit.form, spec.colours, { t, sway: .5 })
  const X0 = w * .68, W2 = w * .28; for (const [lab, val, col, yy] of [['stiffness', V(v, 'stiff', 1 - u * (brown ? .9 : .4)), INK.amber, h * .3], ['weight', V(v, 'weight', 1 - u * (brown ? .3 : .8)), INK.hypha, h * .42]]) { text(g, lab, X0, yy - 10, { size: 17 }); g.fillStyle = '#2a2318'; g.fillRect(X0, yy, W2, 16); g.fillStyle = col; g.fillRect(X0, yy, W2 * clamp(val), 16) }
  text(g, `rings at ${V(v, 'f', 460).toFixed(0)} Hz`, X0, h * .56, { size: 22, colour: '#e9dcbc', serif: true })
  caption(g, w, h, [`${Math.round(u * 100)}% rotted · ${brown ? 'brown rot takes the stiffness first, so the note falls fast' : 'white rot takes weight and stiffness together, so the note holds'}` + (V(v, 'logs', 0) ? ` · log ${v.logs + 1}` : ''), V(v, 'scaleNote', '')])
}
P['soil-filter'] = (g, w, h, { spec, view: v, params: p, t }) => {
  const wetN = V(v, 'wetNow', p.wet), y0 = ground(g, w, h, { horizon: .16, seed: 81, wet: wetN, stars: false }), D = h - y0 - 80, dy = y0 + clamp(p.depth / 100) * D, sx = w * (.5 + (p.side - .5) * .5), front = V(v, 'front', -1)
  for (let k = 1; k < 5; k++) { g.strokeStyle = rgba('#5a4630', .35); g.beginPath(); g.moveTo(0, y0 + k * D / 5); g.lineTo(w, y0 + k * D / 5 + Math.sin(k) * 8); g.stroke(); text(g, `${k * 20} cm`, 12, y0 + k * D / 5 - 6, { size: 14, colour: INK.dim }) }
  if (front >= 0 && front < 1.2) { g.fillStyle = rgba('#3f7ea8', .28); g.fillRect(0, y0, w, clamp(front) * D); g.strokeStyle = rgba(INK.water, .7); g.setLineDash([6, 6]); g.beginPath(); g.moveTo(0, y0 + clamp(front) * D); g.lineTo(w, y0 + clamp(front) * D); g.stroke(); g.setLineDash([]) }
  for (let k = 0; k < 5; k++) ripple(g, sx, y0, 70 + D * 1.1, ((t * .5 + k / 5) % 1), '#9fe8ff', 1); g.fillStyle = '#9fe8ff'; g.beginPath(); g.arc(sx, y0, 9, 0, TAU); g.fill(); text(g, 'sound', sx + 14, y0 - 8, { size: 16 })
  for (const [i, ex, cut] of [[0, w * .5 - 44, V(v, 'cutL', 0)], [1, w * .5 + 44, V(v, 'cutR', 0)]]) { g.strokeStyle = rgba('#9fe8ff', .25); g.beginPath(); g.moveTo(sx, y0); g.lineTo(ex, dy); g.stroke(); mushroom(g, ex, dy + 16, 34, 'truffle', spec.colours, { light: .4 }); text(g, cut ? `${cut.toFixed(0)} Hz` : '', ex, dy + 44, { size: 15, align: 'center' }) }
  network(g, stageOf(spec, 1), w * .2, dy - 60, w * .6, 150, { colour: spec.colours[0], tilt: .4, alpha: .25 + p.web * .7 })
  caption(g, w, h, [`two listeners ${p.depth.toFixed(0)} cm down · soil ${Math.round(wetN * 100)}% wet · high sound is lost first, and wet soil loses more`, V(v, 'scaleNote', '')])
}
// ------------------------------------------------------------------ composers
P['spike-canon'] = (g, w, h, { spec, view: v, params: p, t }) => {
  night(g, w, h); const u = V(v, 'v', []), lit = V(v, 'lit', []), pitch = V(v, 'pitch', []), n = u.length || Math.round(p.voices), x0 = 80, L = w - 160, y = h * .7, split = V(v, 'split', 0)
  const roll = memory('canon', lit.map(q => q > .5 ? 1 : 0), 200), lo = Math.min(...pitch, 0), hi = Math.max(...pitch, 1)
  roll.forEach((row, k) => row.forEach((on, i) => { if (on) { g.fillStyle = rgba(i < split || !split ? INK.gold : '#9fe8ff', .25 + .75 * k / 200); g.fillRect(x0 + k / 200 * L, 70 + (1 - ((pitch[i] || 0) - lo) / (hi - lo || 1)) * (h * .42), 5, 8) } }))
  hypha(g, x0, y, L, 20, { colour: spec.colours[0], t, walls: n, pulses: u.map((q, i) => q > .3 ? 1 - (i + .5) / n : -1).filter(q => q >= 0) })
  for (let i = 0; i < n; i++) { const x = x0 + (1 - (i + .5) / n) * L, a = clamp(lit[i] || 0); g.fillStyle = rgba(INK.gold, .15 + .85 * a); g.beginPath(); g.arc(x, y - 46, 8 + a * 8, 0, TAU); g.fill() }
  text(g, 'tip', x0 + L - 18, y + 54, { size: 16 }); text(g, 'the notes each unit sounded, newest at the right', x0, 50, { size: 17 })
  caption(g, w, h, [V(v, 'coupled', true) ? 'a spike starts at the tip and passes down the hypha; each unit it reaches sounds its own note' : 'no wave at this size: the units fire on their own and drift apart', V(v, 'scaleNote', '')])
}
P['hyphal-walk'] = (g, w, h, { spec, view: v, params: p, t }) => {
  soilPlan(g, w, h, 17); const st = stageOf(spec, V(v, 'stage', p.stage)), at = V(v, 'at', []), inw = V(v, 'inward', []), trail = memory('walk', at.slice(), 40)
  const net = network(g, st, 20, 14, w - 40, h - 96, { colour: spec.colours[0], t, alpha: .8 })
  trail.forEach((row, k) => row.forEach((node, i) => { if (node < net.n) { g.fillStyle = rgba(inw[i] ? '#9fe8ff' : INK.gold, k / 40 * .5); g.beginPath(); g.arc(net.px(node), net.py(node), 4 + k / 40 * 5, 0, TAU); g.fill() } }))
  at.forEach((node, i) => { if (node >= net.n) return; const X = net.px(node), Y = net.py(node), gd = g.createRadialGradient(X, Y, 0, X, Y, 30); gd.addColorStop(0, rgba(inw[i] ? '#9fe8ff' : INK.gold, 1)); gd.addColorStop(1, rgba(inw[i] ? '#9fe8ff' : INK.gold, 0)); g.fillStyle = gd; g.beginPath(); g.arc(X, Y, 30, 0, TAU); g.fill() })
  caption(g, w, h, [`walkers step from junction to junction; each junction's distance from the centre is its note · ${V(v, 'notes', '?')} notes in this network` + (inw.some(Boolean) ? ' · blue ones carry food inward' : ''), V(v, 'scaleNote', '')])
}
P['tip-chorus'] = (g, w, h, { spec, view: v, t }) => {
  soilPlan(g, w, h, 23); if (!v) { network(g, spec.stages[1], w * .2, h * .15, w * .6, h * .6, { colour: spec.colours[0], tips: true, t, alpha: .6 }); text(g, 'Turn sound on: the tips will start to grow', w / 2, 44, { align: 'center', size: 22 }); return }
  const s = Math.min(w, h) * .45, cx = w / 2, cy = h / 2 - 20, L = v.lines, cols = [spec.colours[0], '#9ed0e6', '#e6b0c8', '#c8e6a0']
  g.lineCap = 'round'; for (const [lw, al] of [[9, .08], [2.2, .8]]) { g.strokeStyle = rgba(spec.colours[0], al); g.lineWidth = lw; g.beginPath(); for (let i = 0; i < L.length; i += 4) { g.moveTo(cx + L[i] * s, cy + L[i + 1] * s); g.lineTo(cx + L[i + 2] * s, cy + L[i + 3] * s) } g.stroke() }
  v.tips.forEach(([x, y], i) => { const c = cols[(v.who ? v.who[i] : 0) % 4], X = cx + x * s, Y = cy + y * s, gd = g.createRadialGradient(X, Y, 0, X, Y, 18); gd.addColorStop(0, rgba(c == spec.colours[0] ? INK.gold : c, 1)); gd.addColorStop(1, rgba(INK.gold, 0)); g.fillStyle = gd; g.beginPath(); g.arc(X, Y, 18, 0, TAU); g.fill() })
  if (V(v, 'fusedAgo', 9) < .5) ripple(g, cx, cy, s, v.fusedAgo * 2, '#9fe8ff'); if (V(v, 'branchedAgo', 9) < .3) ripple(g, cx, cy, s * .5, v.branchedAgo * 3.3, INK.gold)
  text(g, 'low', cx - s, h - 70, { size: 17 }); text(g, 'high', cx + s, h - 70, { size: 17, align: 'right' })
  caption(g, w, h, [`${v.tips.length} tips, each a voice: left to right is pitch · a branch adds a voice, a fusion ends one` + (V(v, 'celsius', null) != null ? ` · ${v.celsius.toFixed(0)} °C` : ''), V(v, 'scaleNote', '')])
}
P['growth-form'] = (g, w, h, { spec, view: v, t }) => {
  night(g, w, h); const u = V(v, 'u', 0), c = spec.curves, st = spec.stages[V(v, 'stageIndex', 0)]
  network(g, st, w * .56, 30, w * .42, h * .62, { colour: spec.colours[0], t, tips: true, pulse: V(v, 'fusedAgo', 9) < .6 ? [{ at: v.fusedAgo, colour: '#9fe8ff' }] : [] })
  const rows = [['growing tips', c.tips, INK.gold, 'how many notes'], ['flow', c.flow, '#9fe8ff', 'how loud'], ['reserve', c.reserve, INK.moss, 'how long'], ['reach', c.front_um, INK.amber, 'how low']]
  rows.forEach(([lab, vals, col, role], i) => { const y = 70 + i * (h - 200) / 4; text(g, lab, 30, y - 8, { size: 17, colour: col }); text(g, role, w * .5, y - 8, { size: 15, colour: INK.dim, align: 'right' }); graph(g, vals, 30, y, w * .5 - 30, (h - 200) / 4 - 46, { colour: col, fill: rgba(col, .08), at: u }) })
  caption(g, w, h, [`the story of the colony's growth, read from left to right: ${st.days > 400 ? (st.days / 365).toFixed(1) + ' years' : 'day ' + st.days}` + (V(v, 'individuals', 1) > 1 ? ` · ${v.individuals} individuals` : ''), V(v, 'scaleNote', '')])
}
P['season-cycle'] = (g, w, h, { spec, view: v, t }) => {
  const y = V(v, 'y', 0), T = V(v, 'T', 10), act = clamp(V(v, 'act', 0)), sun = Math.cos((y - .5) * TAU) * .5 + .5, y0 = ground(g, w, h, { horizon: .56, seed: 91, wet: V(v, 'wet', 0), sky: blend('#101623', ['#2b3a4a', '#3d5a4a', '#5a4a2a'][y < .3 || y > .9 ? 0 : y < .62 ? 1 : 2], .35 + .4 * sun), stars: sun < .4 })
  g.fillStyle = rgba('#f4c86a', .25 + .6 * sun); g.beginPath(); g.arc(w * .12 + y * w * .76, y0 * (.75 - .5 * sun), 20, 0, TAU); g.fill()
  network(g, stageOf(spec, .5 + .5 * act), 40, y0 + 8, w - 80, h - y0 - 90, { colour: spec.colours[0], tilt: .55, alpha: .25 + .75 * act, tips: act > .3, t, flow: clamp(V(v, 'reserve', 0) / 8) })
  const caps = V(v, 'caps', 0), fr = V(v, 'fruiting', false); for (let i = 0; i < Math.min(9, caps || (fr ? 3 : 0)); i++) { const x = 90 + hash(i * 7 + 3) * (w - 180), S = fruitPx(spec, 44, 170) * (.7 + .4 * hash(i)); mushroom(g, x, y0 + 4, S, spec.fruit.form, spec.colours, { grown: fr ? .5 + .5 * Math.sin(t * .3 + i) ** 2 : 1, light: V(v, 'shedding', 0) > 0 ? .4 : 0, t }); if (V(v, 'shedding', 0) > 0) spores(g, 16, 0, 0, w * .4, y0, t, { from: [x, y0 - S * .8], wind: .5, seed: i * 31 }) }
  if (V(v, 'wet', 0) > .35) rain(g, w, y0, t, v.wet); if (T < 0) for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect((hash(i * 3) * w + t * 20 * hash(i)) % w, (hash(i * 7) + t * .15) % 1 * y0, 3, 3) }
  const cx = w - 110, cy = 106, r = 70; g.strokeStyle = '#3a3326'; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); g.strokeStyle = fr ? INK.ember : rgba(INK.moss, .3 + .7 * act); g.beginPath(); g.arc(cx, cy, r, y * TAU - Math.PI / 2 - .5, y * TAU - Math.PI / 2); g.stroke()
  ;['winter', 'spring', 'summer', 'autumn'].forEach((s, k) => { const a = (k / 4) * TAU - Math.PI / 2; text(g, s, cx + Math.cos(a) * (r - 30), cy + Math.sin(a) * (r - 30) + 5, { size: 13, align: 'center', colour: INK.dim }) }); text(g, T.toFixed(0) + ' °C', cx, cy + 9, { size: 26, align: 'center', colour: '#e9dcbc', serif: true })
  caption(g, w, h, [fr ? `fruiting: it has turned colder than ${V(v, 'fruitsBelow', 0).toFixed(0)} °C with reserves stored` : act < .02 ? 'dormant: too cold or too hot for this species' : `growing at ${Math.round(act * 100)}% of its best rate`, V(v, 'scaleNote', '')])
}
P['spore-scatter'] = (g, w, h, { spec, view: v, params: p, t }) => {
  const y0 = ground(g, w, h, { horizon: .62, seed: 97 }), cx = w / 2, S = fruitPx(spec, 80, 230), spore = V(v, 'spores', true)
  if (!v) { mushroom(g, cx, y0 + 4, S, spec.fruit.form, spec.colours, { under: true }); text(g, 'Turn sound on to start', cx, 60, { align: 'center', size: 24 }); return }
  const ps = clamp(V(v, 'parentShare', 0)); if (ps > .02) mushroom(g, cx - (v.centre - v.parent) * 16, y0 + 4, S, spec.fruit.form, spec.colours, { under: true, grown: 1, light: 0, t })
  mushroom(g, cx, y0 + 4, S * (ps > .02 ? clamp(.3 + V(v, 'moved', 9) / 6) : 1), spec.fruit.form, spec.colours, { under: true, t, light: .3 })
  for (const [d, age, old] of v.last) { if (age > 2.5) continue; const x = cx + d * 16 - (old ? (v.centre - v.parent) * 16 : 0), u = clamp(age / .5), ax = mix(cx, x, u), ay = mix(y0 - S * .8, y0 + 8 + (Math.abs(d) * 9 % 40), u * u) - Math.sin(u * Math.PI) * 60; g.fillStyle = rgba(INK.spore, 1 - age / 2.5); g.beginPath(); g.arc(ax, ay, 5, 0, TAU); g.fill(); if (u >= 1) ripple(g, x, ay, 22, (age - .5) / 2, INK.spore, .4) }
  g.strokeStyle = rgba(INK.water, .4); g.lineWidth = 2; for (let k = 0; k < 4; k++) { const yy = 60 + k * 34, x1 = cx - 120 + ((t * 60 * (p.wind || .01)) % 240); g.beginPath(); g.moveTo(x1, yy); g.lineTo(x1 + 60 * Math.sign(p.wind || 1), yy); g.stroke() }
  caption(g, w, h, [spore ? 'each note is a spore landing: where it lands is its pitch, and the wind pushes the whole cloud' + (V(v, 'moved', 9) < 3 ? ' · a spore has founded a new individual' : '') : 'no spores at this size of simulator: each note is a new branch inside the growing front', V(v, 'scaleNote', '')])
}
export const PICTURES = P
// draws a plugin's picture, or says so if it fails (a drawing must never stop the sound)
export const picture = id => (g, w, h, c) => { const f = P[id]; if (!f) return false; g.save(); try { f(g, w, h, c) } catch (e) { g.restore(); g.save(); text(g, 'drawing: ' + e.message, 20, 30, { size: 16, colour: INK.ember }) } g.restore(); g.globalAlpha = 1; g.setLineDash([]); return true }
