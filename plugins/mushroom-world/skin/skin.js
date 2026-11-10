// Mushroom World's skin. It talks only to window.synthland (docs/skin-bridge.md in SynthLand): it reads the
// manifest, builds a card for each part and knobs for whichever part is selected, and draws the picture of that
// part. The pictures are the separate plugins' own (plugins/kit/pictures.js), fed by what the engine reports.
import { PICTURES } from '../../kit/pictures.js'
import { INK, TAU, hash, clamp, rgba, blend, text, ground, network, mushroom, spores, rain } from '../../kit/art.js'
const host = window.synthland, $ = id => document.getElementById(id)
await host.ready()
const man = host.manifest(), theme = (man.skin && man.skin.theme) || {}
for (const k in theme) document.documentElement.style.setProperty('--sl-' + k, theme[k])
document.title = man.name; $('plugin-name').textContent = man.name
const us = id => id.replace(/-/g, '_'), SIZES = ['4k', '40k', '400k', '4m'], KIND = { P: 'physical model', S: 'model signal', M: 'model as modulator' }
const LACK = { flow: 'flow', cords: 'cords', electrical: 'electrical', fruit: 'mushrooms', weather: 'weather', spores: 'spores', rivals: 'rivals', depth: 'depth' }
let sel = 'world', state = { views: {}, ids: {}, live: { taps: {} }, spec: null, tel: null }, lastNotes = 0, pulse = 0

// ---- start button (web host only)
if (host.audio) { const b = $('audio-btn'); b.hidden = false; b.onclick = async () => { const on = await host.audio.start(); b.classList.toggle('on', on); b.textContent = on ? 'Audio on' : 'Start audio' } }

// ---- species
const pick = $('sp-pick'), real = document.createElement('optgroup'), inv = document.createElement('optgroup'); real.label = 'Species'; inv.label = 'Invented species (not real)'
man.species.forEach((s, i) => (s.invented ? inv : real).appendChild(new Option(s.name + (s.common ? ' · ' + s.common : ''), i))); pick.append(real, inv)
const showSpecies = () => { const i = Math.round(host.get('world.species')), s = man.species[i]; $('sp-name').textContent = s.name; $('sp-common').innerHTML = (s.invented ? '<span class="inv">invented</span>' : '') + (s.common || '') + ' · ' + s.form; pick.value = i }
pick.onchange = () => host.set('world.species', +pick.value)
$('sp-prev').onclick = () => host.set('world.species', (Math.round(host.get('world.species')) - 1 + man.species.length) % man.species.length)
$('sp-next').onclick = () => host.set('world.species', (Math.round(host.get('world.species')) + 1) % man.species.length)

// ---- the parts: a card each
const SLOTS = [['world', 'The fungus', null], ['v1', 'Voice 1', 'v1.engine'], ['v2', 'Voice 2', 'v2.engine'], ['atmo', 'Atmosphere', 'atmo.engine'], ['fx', 'Effect', 'fx.engine']]
const rail = $('rail')
for (const [key, label, param] of SLOTS) {
  const d = document.createElement('div'); d.className = 'slot'; d.dataset.k = key
  d.innerHTML = `<div class="head"><canvas width="52" height="44"></canvas>${label}<span class="lamp"></span></div>` + (param ? `<mw-choice param="${param}" select></mw-choice>` : '<div class="by"><span id="world-line"></span></div>') + (key[0] == 'v' ? `<div class="by" data-k="${key}p"><span>played by</span><mw-choice param="${key}.player" select></mw-choice></div>` : '')
  d.onclick = e => { const by = e.target.closest('.by[data-k]'); select(by && modOf(by.dataset.k) ? by.dataset.k : key) }
  rail.appendChild(d)
}
const modOf = k => { // which plugin a part is now, from the choice parameters
  if (k == 'world') return null; const p = k.endsWith('p') ? k[0] + k[1] + '.player' : k + '.engine', i = Math.round(host.get(p)), list = k.endsWith('p') ? ['', ...man.slots.players] : k == 'v1' ? man.slots.v1 : ['', ...man.slots[k]]
  return list[i] || null
}
const select = k => { sel = k; rail.querySelectorAll('.slot').forEach(d => d.classList.toggle('sel', d.dataset.k == k.slice(0, k.endsWith('p') ? -1 : undefined))); rail.querySelectorAll('.by[data-k]').forEach(d => d.classList.toggle('sel', d.dataset.k == k)); detail() }

// ---- the selected part: its name, what it is, and a knob for every control it has
const detail = () => {
  const D = $('detail'), id = modOf(sel), spec = state.spec, z = SIZES[Math.round(host.get('world.scale'))]
  if (!id) {
    if (sel != 'world') { D.innerHTML = `<h2>${SLOTS.find(s => s[0] == sel.slice(0, 2) || s[0] == sel)[1]}</h2><p>Nothing is chosen here. Pick one from the list on the left.</p>`; return }
    const s = man.species[Math.round(host.get('world.species'))], n = spec ? spec.numbers : null, has = spec ? spec.has || {} : {}
    D.innerHTML = `<h2>${s.name}<small>${s.invented ? 'invented' : s.family}</small></h2><p>${spec && spec.story ? spec.story : `${s.common ? s.common[0].toUpperCase() + s.common.slice(1) + '. ' : ''}A ${s.form == 'none' ? 'fungus with no fruit body' : s.form} of the ${s.family} network family. Everything in this plugin is built from this one fungus as the simulator grew it: its network supplies the notes, its fruit body the plates and gills, its numbers the rates.`}</p>`
      + (n ? `<div class="facts"><span>tips grow<b>${n.tip_speed_um_h} µm/h</b></span><span>branches every<b>${n.growth_unit_um} µm</b></span><span>branch angle<b>${n.branch_angle_deg}°</b></span><span>fuses<b>${Math.round(n.fusion_probability * 100)}%</b></span><span>best at<b>${n.t_opt_c} °C</b></span><span>lives from<b>${n.t_min_c} to ${n.t_max_c} °C</b></span><span>spikes every<b>${n.spike_interval_min >= 1 ? n.spike_interval_min + ' min' : (n.spike_interval_min * 60).toFixed(0) + ' s'}</b></span><span>cords up to<b>${n.cord_max || 'none'}</b></span><span>grown<b>${spec.grown.days > 400 ? (spec.grown.days / 365).toFixed(1) + ' years' : spec.grown.days + ' days'}</b></span><span>across<b>${spec.grown.size_mm[0] >= 1000 ? spec.grown.size_mm[0] / 1000 + ' m' : spec.grown.size_mm[0] + ' mm'}</b></span></div>` : '')
      + `<p class="scale">At ${z.toUpperCase()} the simulator has:</p><div class="has">${Object.keys(LACK).map(k => `<i class="${has[k] === false ? 'no' : ''}">${LACK[k]}</i>`).join('')}</div>`
    return
  }
  const m = man.modules[id], has = spec ? spec.has || {} : {}
  D.innerHTML = `<h2>${m.name}<small>${m.kind.split('/').map(k => KIND[k]).join(' + ')}</small></h2><p>${m.blurb}</p>${m.scales[z] ? `<p class="scale">At ${z.toUpperCase()}: ${m.scales[z]}</p>` : ''}<div class="knobs">${m.params.map(p => { const q = man.parameters.find(x => x.id == us(id) + '.' + p); return `<mw-knob param="${q.id}"${q.needs && has[q.needs] === false ? ' disabled' : ''}></mw-knob>` }).join('')}</div>`
}
document.addEventListener('mw-hint', e => { const p = e.detail; $('hint').innerHTML = `<b>${p.group} · ${p.name}</b> &nbsp;${p.description || ''}${p.standing ? ` &nbsp;<i>${p.standing}</i>` : ''}` })

// ---- keeping up with the host
host.onParam(id => { if (id == 'world.species') showSpecies(); if (id.endsWith('.engine') || id.endsWith('.player') || id == 'world.scale') { if (sel != 'world' && !modOf(sel)) sel = sel.endsWith('p') ? sel.slice(0, -1) : sel; detail() } })
host.onPreset(() => { showSpecies(); detail() })
setInterval(async () => { const s = await host.call('state'); if (!s) return; const fresh = s.spec != state.spec; state = s; if (fresh && (sel == 'world' || true)) detail(); if ((s.notes || 0) != lastNotes) { lastNotes = s.notes; pulse = performance.now() / 1000 } }, 50)
showSpecies(); select('world')

// ---- pictures
const hero = $('hero').getContext('2d'), bg = $('bg').getContext('2d'), paramsOf = id => Object.fromEntries(man.modules[id].params.map(p => [p, host.get(us(id) + '.' + p)]))
// the fungus itself: its fruit bodies above ground and its network below, in the weather the world controls set
const worldScene = (g, w, h, t) => {
  const spec = state.spec, grow = host.get('world.growth'), wet = host.get('world.wet'), warm = host.get('world.temp'), tel = state.tel, loud = tel ? clamp((tel[1] + 50) / 35) : 0, hit = Math.max(0, 1 - (t - pulse) * 3)
  const y0 = ground(g, w, h, { horizon: .5, seed: 5, wet, sky: blend(blend('#141a24', '#1c2a44', clamp(-warm / 25)), '#4a3320', clamp(warm / 15) * .5) })
  if (!spec) return
  const st = spec.stages[Math.round(grow * (spec.stages.length - 1))], col = spec.colours, glow = spec.invented ? '#9fe8ff' : INK.gold
  network(g, st, 30, y0 + 10, w - 60, h - y0 - 60, { colour: col[0], tilt: .58, tips: true, t, grown: 1, pulse: [{ at: clamp((t - pulse) * .9), a: hit, colour: glow, size: 7 }, { at: (t * .12) % 1, a: .35 * loud, colour: glow, size: 4 }], flow: loud })
  const cm = (spec.fruit.size_cm[0] + spec.fruit.size_cm[1]) / 2, S = clamp(46 + Math.log2(1 + cm) * 46, 50, 250), n = spec.has && spec.has.fruit === false ? 0 : 1 + Math.round(grow * 6)
  for (let j = n - 1; j >= 0; j--) { const i = j, side = i % 2 ? -1 : 1, x = w * (.5 + side * (.11 + .065 * i + .03 * hash(i * 7 + 1)) * (i ? 1 : 0)), k = clamp(grow * 1.5 - i * .12 + .2); mushroom(g, x, y0 + 4, S * (i ? .55 + .4 * hash(i * 3) : 1), spec.fruit.form, col, { grown: k, light: (i ? .25 : .5) * hit + loud * .25, lightColour: glow, sway: Math.sin(t * .7 + i) * .015, t, under: i == 0 }) }
  if (n == 0) text(g, 'this size of simulator grows no mushrooms: only the network', w / 2, y0 - 30, { align: 'center', size: 20 })
  if (loud > .05 && n) spores(g, 50, 0, 0, w * .6, y0, t, { from: [w / 2, y0 - S * .85], colour: blend(col[1], '#ffffff', .5), wind: .35, speed: .6 + loud, alpha: .6 })
  if (wet > .55) rain(g, w, y0, t, (wet - .55) * 2.2)
  for (let i = 0; i < 16; i++) { const a = .5 + .5 * Math.sin(t * (1 + hash(i)) + i * 9); g.fillStyle = rgba(spec.invented ? '#9fe8ff' : '#c8f08a', a * .7); g.beginPath(); g.arc(hash(i * 3) * w + Math.sin(t * .3 + i) * 30, y0 * (.25 + .7 * hash(i * 5)) + Math.cos(t * .4 + i) * 12, 2.2, 0, TAU); g.fill() }
  text(g, `${st.days > 400 ? (st.days / 365).toFixed(1) + ' years' : 'day ' + st.days} · reaches ${st.reach_mm >= 1000 ? (st.reach_mm / 1000).toFixed(2) + ' m' : st.reach_mm + ' mm'} · lowest note ${st.hz[0] < 20 ? st.hz[0].toFixed(1) : st.hz[0].toFixed(0)} Hz at its real size`, 22, h - 20)
}
const icon = (g, k, t) => { // the small picture on each card
  g.clearRect(0, 0, 52, 44); const spec = state.spec; if (!spec) return
  if (k == 'world' || k[0] == 'v') mushroom(g, 26, 42, k == 'world' ? 34 : 26, k == 'world' ? spec.fruit.form : ['agaric', 'bracket', 'coral', 'cup'][(Math.round(host.get(k + '.engine')) + (k == 'v2' ? 3 : 0)) % 4], spec.colours, { t })
  else if (k == 'atmo') { for (let i = 0; i < 9; i++) { g.fillStyle = rgba(INK.water, .7); g.fillRect(4 + i * 5.2, (hash(i) * 44 + t * 30) % 44, 1.6, 7) } }
  else { for (let i = 0; i < 3; i++) { g.strokeStyle = rgba('#9fe8ff', .8 - i * .22); g.lineWidth = 2; g.beginPath(); g.arc(8, 22, 8 + i * 9 + (t * 8) % 9, -.7, .7); g.stroke() } }
}
const lamps = [...rail.querySelectorAll('.slot')], icons = lamps.map(d => d.querySelector('canvas').getContext('2d')), faders = [...document.querySelectorAll('mw-fader')]
let bgDone = ''
const frame = ms => {
  const t = ms / 1000, spec = state.spec, id = modOf(sel), g = hero
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 960, 720)
  if (spec && id && PICTURES[id]) { try { g.save(); PICTURES[id](g, 960, 720, { spec, spec2: spec, params: paramsOf(id), view: state.views[sel] || null, iview: null, live: state.live, t }); g.restore() } catch (e) { g.restore(); text(g, 'drawing: ' + e.message, 20, 30, { size: 16 }); if (!window['bad' + id]) { window['bad' + id] = 1; console.warn('picture ' + id + ': ' + e.message) } } g.globalAlpha = 1; g.setLineDash([]) } else worldScene(g, 960, 720, t)
  const tel = state.tel
  lamps.forEach((d, i) => { const k = d.dataset.k, on = k == 'world' ? tel && tel[1] > -45 : tel && tel[8 + (i - 1) * 6 + 5] > 0 && tel[8 + (i - 1) * 6] > -55; d.querySelector('.lamp').classList.toggle('on', !!on); icon(icons[i], k, t) })
  if (tel) { faders.forEach(f => f.level && f.level(tel[8 + +f.dataset.stem * 6])); const r = $('reads').querySelectorAll('b'); r[0].textContent = tel[1] > -69 ? tel[1].toFixed(1) : '—'; r[1].textContent = tel[2] > -69 ? tel[2].toFixed(1) : '—'; r[2].textContent = (tel[4] + tel[5]).toFixed(1) }
  const wl = $('world-line'); if (wl && spec) wl.textContent = `${SIZES[Math.round(host.get('world.scale'))].toUpperCase()} · ${spec.fruit.form} · ${spec.family}`
  // the panel's own ground: this specimen's network, very faint, behind everything; redrawn only when the specimen changes
  if (spec && bgDone != spec.slug + spec.engine) { bgDone = spec.slug + spec.engine; bg.clearRect(0, 0, 1180, 700); network(bg, spec.stages[spec.stages.length - 1], -200, -260, 1580, 1220, { colour: spec.colours[0], alpha: .16 }) }
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
