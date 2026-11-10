// The page for a symphony: several composers playing at once, mixed on a stem console. A symphony's index.html
// is a <main id="app"> and a module that calls startSymphony(def). def: { id, name, blurb, assumed, conductor,
// cast: [{ role, composer, instrument, species, scale, at, comp, inst, strip }], params, traces }.
import { SCALES, specimenUrl } from './kit.js'
import { COMPOSER_NAMES, INSTRUMENT_NAMES } from './composers.js'
import { INK, ground, network, mushroom, spores, text, rgba, clamp, hash, TAU, ripple } from './art.js'
const el = (tag, attrs = {}, html = '') => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); e.innerHTML = html; return e }
const STRIP = { ride: 1, target: -24, range: 12, pan: 0, fader: 0, duck_by: 0, duck_depth: 6, width: 100, hpf: 20 }

export async function startSymphony(def) {
  const app = document.getElementById('app'), q = new URLSearchParams(location.hash.slice(1)), N = def.cast.length, P = {}, $ = id => document.getElementById(id)
  for (const p of def.params) P[p.id] = q.has(p.id) ? +q.get(p.id) : p.value
  const C = { 'master.target': -18, 'out.ceiling': -1.5, 'out.level': 0, 'glue.on': 1 } // console settings
  def.cast.forEach((c, i) => { const s = { ...STRIP, ...(c.strip || {}) }; for (const k in s) C[`s${i + 1}.${k}`] = s[k] })
  const specs = [], pick = def.cast.map((c, i) => ({ species: q.get('p' + i) || c.species, scale: q.get('z' + i) || c.scale || '400k' }))
  let ctx = null, node = null, view = null, analyser = null
  app.innerHTML = `<nav><a href="../">All plugins</a> · <a href="../../">Mushroom Substrate</a></nav>
    <h1>${def.name}</h1>
    <p><span class="badge f">symphony</span><span class="badge S">model signal</span><span class="badge f">${N} voices on a stem console</span></p>
    <p class="lede">${def.blurb}</p>
    <div class="panel"><canvas id="view" width="1280" height="600" style="aspect-ratio:1280/600"></canvas><canvas id="scope" width="960" height="96"></canvas></div>
    <div class="panel"><button id="power">Turn sound on</button><span class="hint" id="state"></span><div class="condrow" id="params"></div></div>
    <h2>The console</h2>
    <div class="panel"><div class="console" id="console"></div><p class="hint">Each voice has its own strip: a loudness rider brings it to its own target, a later voice can dip an earlier one, and the sum is ridden to the master target, glued and limited. This console is a small stand-in for SynthLand's Stem Console and uses its control names; see the notes below.</p></div>
    <h2>What this traces to</h2><div class="panel"><table id="trace"><tr><th>Part</th><th>Mushroom process or measurement</th><th>Standing</th></tr></table></div>
    <h2>What is assumed</h2><p class="lede">${def.assumed}</p>`
  const post = m => node && node.port.postMessage(m)
  const saveHash = () => { const s = new URLSearchParams(); for (const p of def.params) s.set(p.id, +P[p.id].toFixed(4)); pick.forEach((p, i) => { s.set('p' + i, p.species); s.set('z' + i, p.scale) }); history.replaceState(null, '', '#' + s) }

  // ---- the conductor's controls
  for (const p of def.params) {
    const l = el('label', {}, `<b>${p.label}</b><span class="val"></span><input type="range" min="${p.min}" max="${p.max}" step="${p.step || (p.max - p.min) / 200}" value="${P[p.id]}">`), input = l.querySelector('input'), val = l.querySelector('.val')
    const show = () => val.textContent = (p.show ? p.show(P[p.id]) : +P[p.id].toFixed(2)) + (p.unit ? ' ' + p.unit : '')
    show(); input.oninput = () => { P[p.id] = +input.value; show(); post({ set: { [p.id]: P[p.id] } }); saveHash() }
    $('params').appendChild(l); $('trace').appendChild(el('tr', {}, `<td>${p.label}</td><td>${p.trace}</td><td>${p.standing || 'a choice'}</td>`))
  }
  for (const t of def.traces || []) $('trace').appendChild(el('tr', {}, `<td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td>`))

  // ---- the console: a strip for each voice, then the master
  const list = await (await fetch('../specimens/index.json')).json(), meters = []
  const slider = (id, label, min, max, step, fmt, vertical) => `<label class="${vertical ? 'fader' : 'mini'}"><span>${label} <i data-v="${id}"></i></span><input data-c="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${C[id]}"></label>`
  def.cast.forEach((c, i) => {
    const k = i + 1, s = el('div', { class: 'strip' }, `<b>${c.role}</b><small>${COMPOSER_NAMES[c.composer]} on ${INSTRUMENT_NAMES[c.instrument]}</small>
      <select data-sp="${i}"></select><select data-sc="${i}"></select>
      <div class="chan"><canvas width="44" height="220" data-m="${i}"></canvas>${slider(`s${k}.fader`, 'Fader', -60, 12, .5, 0, true)}</div>
      <button class="quiet mute" data-mute="${i}">Mute</button>
      ${slider(`s${k}.target`, 'Target', -40, -10, .5)}${slider(`s${k}.pan`, 'Pan', -100, 100, 1)}${slider(`s${k}.duck_depth`, c.strip && c.strip.duck_by ? 'Dips for voice ' + c.strip.duck_by : 'Dip', 0, 24, .5)}`)
    $('console').appendChild(s)
    const sp = s.querySelector('[data-sp]'), sc = s.querySelector('[data-sc]'), real = el('optgroup', { label: 'Species' }), inv = el('optgroup', { label: 'Invented (not real)' })
    for (const [slug, name, , , , invented] of list) (invented ? inv : real).appendChild(new Option(name, slug)); sp.append(real, inv); sp.value = pick[i].species
    for (const z in SCALES) sc.add(new Option(SCALES[z][0], z)); sc.value = pick[i].scale
    sp.onchange = sc.onchange = () => { pick[i] = { species: sp.value, scale: sc.value }; load(i); saveHash() }
    s.querySelector('[data-mute]').onclick = e => { const id = `s${k}.mute`; C[id] = C[id] ? 0 : 1; e.target.classList.toggle('on', !!C[id]); post({ set: { [id]: C[id] } }) }
    meters.push(s.querySelector('canvas').getContext('2d'))
  })
  $('console').appendChild(el('div', { class: 'strip master' }, `<b>Master</b><small>the sum of the voices</small>
    <div class="chan"><canvas width="44" height="220" id="mm"></canvas>${slider('out.level', 'Level', -60, 0, .5, 0, true)}</div>
    <div class="reads" id="reads"></div>${slider('master.target', 'Target', -23, -12, .5)}${slider('out.ceiling', 'Ceiling', -6, 0, .1)}
    <button class="quiet mute on" id="glue">Glue</button>`))
  const fmtC = (id, v) => id.endsWith('pan') ? (v == 0 ? 'centre' : (v < 0 ? 'L' : 'R') + Math.abs(v)) : id.endsWith('target') ? v + ' LUFS' : (v > 0 ? '+' : '') + v + ' dB'
  for (const inp of document.querySelectorAll('[data-c]')) { const id = inp.dataset.c, lab = document.querySelector(`[data-v="${id}"]`); lab.textContent = fmtC(id, C[id]); inp.oninput = () => { C[id] = +inp.value; lab.textContent = fmtC(id, C[id]); post({ set: { [id]: C[id] } }) } }
  $('glue').onclick = e => { C['glue.on'] = C['glue.on'] ? 0 : 1; e.target.classList.toggle('on', !!C['glue.on']); post({ set: { 'glue.on': C['glue.on'] } }) }
  const mm = $('mm').getContext('2d')

  // ---- specimens: one for each voice, each at its own size of simulator
  const load = async i => { specs[i] = await (await fetch(specimenUrl('../', pick[i].scale, pick[i].species))).json(); post({ load: { part: i, spec: specs[i] } }) }
  await Promise.all(def.cast.map((_, i) => load(i)))

  // ---- sound
  $('power').onclick = async () => {
    if (ctx) { ctx.state == 'running' ? await ctx.suspend() : await ctx.resume(); $('power').textContent = ctx.state == 'running' ? 'Turn sound off' : 'Turn sound on'; return }
    ctx = new AudioContext(); await ctx.audioWorklet.addModule('../kit/symphony-worklet.js')
    analyser = ctx.createAnalyser(); analyser.fftSize = 2048; analyser.connect(ctx.destination)
    node = new AudioWorkletNode(ctx, 'symphony', { numberOfInputs: 0, outputChannelCount: [2], processorOptions: { cast: def.cast.map(c => ({ composer: c.composer, instrument: c.instrument, at: c.at, comp: c.comp, inst: c.inst })), conductor: def.conductor } })
    node.connect(analyser); node.port.onmessage = e => { if (e.data.view) view = e.data.view }
    post({ set: { ...P, ...C } }); specs.forEach((spec, i) => spec && post({ load: { part: i, spec } }))
    $('power').textContent = 'Turn sound off'
  }

  // ---- drawing: every voice as its mushroom over its own network, lit as it plays
  const cv = $('view'), g = cv.getContext('2d'), sc = $('scope'), sg = sc.getContext('2d'), wave = new Float32Array(2048), bar = (m, w, h, lu, target, extra) => {
    m.clearRect(0, 0, w, h); m.fillStyle = '#0e0c08'; m.fillRect(0, 0, w, h); const y = v => h - clamp((v + 60) / 60) * h
    m.fillStyle = lu > -12 ? INK.ember : INK.amber; m.fillRect(8, y(lu), w - 16, h - y(lu)); if (target != null) { m.fillStyle = '#fff'; m.fillRect(2, y(target), w - 4, 2) }
    if (extra) { m.fillStyle = '#8cc4ea'; m.fillRect(0, 0, 5, clamp(extra / 24) * h) }
  }
  const frame = ms => {
    const t = ms / 1000, w = cv.width, h = cv.height, y0 = ground(g, w, h, { horizon: .46, seed: def.id.length * 7 }), tel = view ? view.tel : null
    def.cast.forEach((c, i) => {
      const spec = specs[i]; if (!spec) return
      const x = w * (i + .5) / N, lvl = view ? view.want[i] : .5, busy = view ? clamp(view.parts[i].nps / 8) : 0, st = spec.stages[spec.stages.length - 1 - (i % 2)], sizeCm = (spec.fruit.size_cm[0] + spec.fruit.size_cm[1]) / 2
      network(g, st, x - w / N * .48, y0 + 14, w / N * .96, h - y0 - 60, { colour: spec.colours[0], tilt: .55, alpha: .35 + .65 * lvl, pulse: view ? [{ at: (t * (.2 + busy) + i * .3) % 1, a: lvl, colour: spec.invented ? '#9fe8ff' : INK.gold, size: 4 + busy * 5 }] : [], t })
      const S = clamp(34 + Math.log2(1 + sizeCm) * 30, 30, 190)
      mushroom(g, x, y0 + 4, S, spec.fruit.form, spec.colours, { light: lvl * (.3 + .7 * busy), grown: .35 + .65 * lvl, sway: Math.sin(t * .8 + i) * .02, t })
      if (lvl > .3 && busy > .1) spores(g, 14, 0, 0, w / N, y0, t, { from: [x, y0 - S * .9], colour: spec.colours[1], speed: 1.5, wind: .2, alpha: .5 * lvl, seed: i * 50 })
      text(g, c.role, x, h - 34, { align: 'center', size: 19, colour: rgba('#e9dcbc', .55 + .45 * lvl) }); text(g, `${spec.name} · ${SCALES[pick[i].scale][0]}`, x, h - 12, { align: 'center', size: 15, colour: INK.dim })
    })
    if (view && def.conductor != 'together') { const x = view.x; g.strokeStyle = rgba(INK.gold, .5); g.lineWidth = 2; g.beginPath(); g.moveTo(x * w, 8); g.lineTo(x * w, y0 - 6); g.stroke(); g.fillStyle = INK.gold; g.beginPath(); g.arc(x * w, 14, 7, 0, TAU); g.fill(); text(g, def.where ? def.where(x) : '', Math.min(w - 220, x * w + 14), 22, { size: 17, colour: INK.amber }) }
    if (!view) text(g, 'Turn sound on to start the piece', w / 2, 40, { align: 'center', size: 22 })
    if (tel) {
      def.cast.forEach((_, i) => bar(meters[i], 44, 220, tel[8 + i * 6] + tel[8 + i * 6 + 2] - tel[8 + i * 6 + 4], C[`s${i + 1}.ride`] ? C[`s${i + 1}.target`] : null, tel[8 + i * 6 + 4])) // each strip after its rider and its dip
      bar(mm, 44, 220, tel[1], C['master.target'], tel[5] + tel[4])
      $('reads').innerHTML = `<span>${tel[0].toFixed(1)}<i>now</i></span><span>${tel[1].toFixed(1)}<i>short</i></span><span>${tel[2].toFixed(1)}<i>whole</i></span><span>${(tel[4] + tel[5]).toFixed(1)}<i>dB held back</i></span>`
    }
    sg.clearRect(0, 0, sc.width, sc.height)
    if (analyser) { analyser.getFloatTimeDomainData(wave); sg.beginPath(); for (let i = 0; i < 960; i++) sg.lineTo(i, 48 - wave[i * 2] * 46); sg.strokeStyle = '#d2a866'; sg.lineWidth = 2; sg.stroke() }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}
