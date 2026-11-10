// Builds a plugin page from a declaration. A plugin's index.html is a <main id="app"> and a module that
// calls start({ ... }). The kit supplies the species presets, the parameter panel with each control's
// trace, the keyboard (pointer, computer keys, Web MIDI with controller learn), input sources for
// effects, the level scope, and the drawing loop. The sound runs in the plugin's own worklet.
import { PLAYABLE } from './playable.js'
const KINDS = { P: 'physical model', S: 'model signal', M: 'model as modulator' }
const el = (tag, attrs = {}, html = '') => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); e.innerHTML = html; return e }

export async function start(def) {
  const app = document.getElementById('app'), q = new URLSearchParams(location.hash.slice(1)), P = {}
  for (const p of def.params) P[p.id] = q.has(p.id) ? +q.get(p.id) : p.value
  let spec = null, spec2 = null, ctx = null, node = null, view = null, iview = null, analyser = null, inputNode = null, learn = null, inst = null, grower = null, live = { taps: {} }
  const IP = {} // the played instrument's own settings, when this is a composer
  const midiMap = JSON.parse(localStorage.getItem('midi-' + def.id) || '{}')

  app.innerHTML = `<nav><a href="../">All plugins</a> · <a href="../../">Mushroom Substrate</a></nav>
    <h1>${def.name}</h1>
    <p><span class="badge f">${def.family}</span>${def.kind.split('/').map(k => `<span class="badge ${k}">${KINDS[k]}</span>`).join('')}</p>
    <p class="lede">${def.blurb}</p>
    <div class="cols"><div>
      <div class="panel"><canvas id="view" width="960" height="720"></canvas><canvas id="scope" width="960" height="128"></canvas>
        ${def.keys ? '<div id="keys"></div><p class="hint">Click or touch the keys, type A W S E D F T G Y H U J K, or play a MIDI keyboard.</p>' : ''}</div>
    </div><div>
      <div class="panel"><button id="power">Turn sound on</button><span id="state" class="hint"></span>
        <label><b>Species</b><select id="species"></select><small id="spinfo"></small></label>
        ${def.second ? '<label><b>The other individual</b><select id="species2"></select></label>' : ''}
        ${def.input ? '<label><b>Sound going in</b><select id="source"><option value="clicks">clicks, one a second<option value="noise">bursts of noise<option value="tone">a low sawtooth note<option value="file">a sound file…<option value="mic">the microphone</select><input id="file" type="file" accept="audio/*" hidden></label>' : ''}
        ${def.composer ? '<label><b>Played on</b><select id="inst"></select><small>The composer decides the notes; this instrument sounds them.</small></label>' : ''}
        <div id="params"></div>${def.composer ? '<h2 style="margin-top:18px">The instrument</h2><div id="iparams"></div>' : ''}</div>
    </div></div>
    <h2>What this traces to</h2><div class="panel"><table id="trace"><tr><th>Control</th><th>Mushroom process or measurement</th><th>Standing</th></tr></table></div>
    <h2>What is assumed</h2><p class="lede">${def.assumed}</p>`

  // ---- parameters
  const post = m => node && node.port.postMessage(m)
  const saveHash = () => { const s = new URLSearchParams(); s.set('s', $('species').value); def.composer && $('inst').value && s.set('on', $('inst').value); for (const p of def.params) s.set(p.id, +P[p.id].toFixed(4)); history.replaceState(null, '', '#' + s) }
  const $ = id => document.getElementById(id)
  const addParam = (p, store, into, key, all) => {
    const l = el('label', {}, `<b>${p.label}</b><span class="midi" title="Click, then move a MIDI controller">MIDI</span><span class="val"></span><input type="range" min="${p.min}" max="${p.max}" step="${p.step || (p.max - p.min) / 200}" value="${store[p.id]}">${p.note ? `<small>${p.note}</small>` : ''}`)
    const input = l.querySelector('input'), val = l.querySelector('.val'), midi = l.querySelector('.midi')
    const text = () => (p.show ? p.show(store[p.id]) : (Math.abs(store[p.id]) >= 100 ? store[p.id].toFixed(0) : +store[p.id].toFixed(2))) + (p.unit ? ' ' + p.unit : '')
    val.textContent = text(); p.input = input; p.val = val
    input.oninput = () => { store[p.id] = +input.value; val.textContent = text(); post({ [key]: { [p.id]: store[p.id] } }); key == 'set' && saveHash(); if (def.live && grower && p.id == def.live.speed) grower.postMessage({ speed: store[p.id] }); if (def.live && grower && p.id == def.live.rain && store[p.id] > .5) grower.postMessage({ rain: 1 }) }
    midi.onclick = e => { e.preventDefault(); learn = learn == p ? null : p; document.querySelectorAll('.midi').forEach(m => m.classList.remove('learn')); learn && midi.classList.add('learn') }
    into.appendChild(l); all.push(p)
  }
  const controls = [] // every slider on the page, for MIDI controllers
  for (const p of def.params) {
    addParam(p, P, $('params'), 'set', controls)
    $('trace').appendChild(el('tr', {}, `<td>${p.label}</td><td>${p.trace}</td><td>${p.standing || 'assumed'}</td>`))
  }
  for (const t of def.traces || []) $('trace').appendChild(el('tr', {}, `<td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td>`))

  // ---- the instrument a composer plays
  const makeNode = () => {
    if (node) node.disconnect()
    node = new AudioWorkletNode(ctx, def.id, { numberOfInputs: def.input ? 1 : 0, outputChannelCount: [2], processorOptions: { instrument: inst && inst.id } })
    node.connect(analyser); node.port.onmessage = e => { if (e.data.view) { view = e.data.view; iview = e.data.iview } }
    post({ load: spec }); spec2 && post({ load2: spec2 }); post({ set: P }); inst && post({ iset: IP }); grow()
  }
  // ---- a network growing live in its own thread, feeding the sound as it grows
  const grow = async () => {
    if (!def.live || !ctx) return
    if (!grower) { grower = new Worker('../kit/live-worker.js'); grower.onmessage = e => { const m = e.data.live; if (m.stage) live.stage = m.stage; if (m.taps) live.taps = m.taps; post({ live: m }) } }
    const sp = await (await fetch('../../engines/400k/species/' + $('species').value + '.json')).json()
    grower.postMessage({ start: { sp, seed: 1, scn: def.live.world }, speed: P[def.live.speed] })
  }
  const pickInstrument = async () => {
    inst = (await import('../' + $('inst').value + '/def.js')).def
    $('iparams').innerHTML = ''; for (const k in IP) delete IP[k]
    controls.splice(def.params.length)
    for (const p of inst.params) { IP[p.id] = p.value; addParam({ ...p }, IP, $('iparams'), 'iset', controls) }
    if (ctx) makeNode()
  }
  if (def.composer) {
    for (const id of PLAYABLE) { const d = (await import('../' + id + '/def.js')).def; $('inst').add(new Option(d.name, id)) }
    $('inst').value = q.get('on') || def.instrument || PLAYABLE[0]; $('inst').onchange = pickInstrument
    await pickInstrument()
  }

  // ---- species presets
  const list = await (await fetch('../specimens/index.json')).json()
  for (const [slug, name, common] of list) $('species').add(new Option(name + (common ? ' (' + common + ')' : ''), slug))
  const loadSpecies = async () => {
    spec = await (await fetch('../specimens/' + $('species').value + '.json')).json()
    $('spinfo').textContent = def.about ? def.about(spec) : `${spec.family} · ${spec.fruit.form}, ${spec.fruit.size_cm.join(' to ')} cm · grown ${spec.grown.days} days`
    post({ load: spec }); saveHash(); grow()
  }
  $('species').value = q.get('s') || def.species || list[0][0]; $('species').value || ($('species').value = list[0][0])
  $('species').onchange = loadSpecies
  await loadSpecies()
  if (def.second) {
    for (const [slug, name, common] of list) $('species2').add(new Option(name + (common ? ' (' + common + ')' : ''), slug))
    const load2 = async () => { spec2 = await (await fetch('../specimens/' + $('species2').value + '.json')).json(); post({ load2: spec2 }) }
    $('species2').value = def.second; $('species2').onchange = load2; await load2()
  }

  // ---- sound
  const power = async () => {
    if (ctx) { ctx.state == 'running' ? await ctx.suspend() : await ctx.resume(); $('power').textContent = ctx.state == 'running' ? 'Turn sound off' : 'Turn sound on'; return }
    ctx = new AudioContext(); await ctx.audioWorklet.addModule('worklet.js')
    analyser = ctx.createAnalyser(); analyser.fftSize = 2048; analyser.connect(ctx.destination)
    makeNode()
    if (def.input) source($('source').value)
    $('power').textContent = 'Turn sound off'; $('state').textContent = ''
  }
  $('power').onclick = power

  // ---- input sources for effects
  let fileBuffer = null
  async function source(kind) {
    if (!ctx) return
    if (inputNode) { try { inputNode.stop && inputNode.stop() } catch (e) {} inputNode.disconnect(); inputNode = null }
    const sr = ctx.sampleRate
    if (kind == 'mic') { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); inputNode = ctx.createMediaStreamSource(s) }
    else {
      let b = fileBuffer
      if (kind != 'file' || !b) {
        b = ctx.createBuffer(1, sr * 2, sr); const d = b.getChannelData(0)
        if (kind == 'clicks') for (const at of [0, 1]) for (let i = 0; i < 64; i++) d[at * sr + i] = (1 - i / 64) * (i % 2 ? -1 : 1)
        if (kind == 'noise' || kind == 'file') for (const at of [0, .9]) for (let i = 0; i < sr * .12; i++) d[at * sr + i | 0] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * .03))
        if (kind == 'tone') for (let i = 0; i < sr * .7; i++) d[i] = ((i * 110 / sr) % 1 * 2 - 1) * Math.min(1, i / 200) * Math.exp(-i / (sr * .25)) * .6
      }
      inputNode = ctx.createBufferSource(); inputNode.buffer = b; inputNode.loop = true; inputNode.start()
    }
    inputNode.connect(node)
  }
  if (def.input) {
    $('source').onchange = () => { if ($('source').value == 'file') $('file').click(); else source($('source').value) }
    $('file').onchange = async () => { const f = $('file').files[0]; if (!f) return; if (!ctx) await power(); fileBuffer = await ctx.decodeAudioData(await f.arrayBuffer()); source('file') }
  }

  // ---- keyboard: pointer, computer keys, MIDI
  const noteOn = async (k, vel = .8) => { if (!ctx) await power(); if (ctx.state != 'running') await power(); post({ on: k, vel }); const d = document.querySelector(`#keys [data-k="${k}"]`); d && d.classList.add('on') }
  const noteOff = k => { post({ off: k }); const d = document.querySelector(`#keys [data-k="${k}"]`); d && d.classList.remove('on') }
  if (def.keys) {
    const low = def.lowKey || 48, black = [1, 3, 6, 8, 10], K = $('keys')
    for (let k = low; k <= low + 24; k++) { const d = el('div', { 'data-k': k }); if (black.includes(k % 12)) { d.className = 'b'; d.innerHTML = '<i></i>' } K.appendChild(d) }
    let held = null
    const at = e => { const t = document.elementFromPoint(e.clientX, e.clientY), d = t && t.closest('#keys > div'); return d ? +d.dataset.k : null }
    K.onpointerdown = e => { held = at(e); held != null && noteOn(held, .5 + .5 * e.offsetY / 100); K.setPointerCapture(e.pointerId) }
    K.onpointermove = e => { if (held == null) return; const k = at(e); if (k != null && k != held) { noteOff(held); held = k; noteOn(k) } }
    K.onpointerup = K.onpointercancel = () => { held != null && noteOff(held); held = null }
    const row = 'awsedftgyhujk', down = {}
    addEventListener('keydown', e => { const i = row.indexOf(e.key.toLowerCase()); if (i < 0 || down[i] || e.metaKey || e.ctrlKey || ['INPUT', 'SELECT'].includes(e.target.tagName)) return; down[i] = 1; noteOn(low + 12 + i) })
    addEventListener('keyup', e => { const i = row.indexOf(e.key.toLowerCase()); if (i < 0) return; down[i] = 0; noteOff(low + 12 + i) })
  }
  if (navigator.requestMIDIAccess) navigator.requestMIDIAccess().then(access => {
    const hook = () => access.inputs.forEach(inp => inp.onmidimessage = e => {
      const [st, a, b] = e.data, cmd = st & 0xf0
      if (cmd == 0x90 && b > 0) def.keys && noteOn(a, b / 127)
      else if (cmd == 0x80 || (cmd == 0x90 && b == 0)) def.keys && noteOff(a)
      else if (cmd == 0xb0) {
        if (learn) { midiMap[a] = controls.indexOf(learn); localStorage.setItem('midi-' + def.id, JSON.stringify(midiMap)); learn = null; document.querySelectorAll('.midi').forEach(m => m.classList.remove('learn')) }
        const p = controls[midiMap[a]]; if (p) { p.input.value = p.min + (p.max - p.min) * b / 127; p.input.oninput() }
      }
    })
    hook(); access.onstatechange = hook
  }).catch(() => {})

  // ---- drawing
  const cv = $('view'), g = cv.getContext('2d'), sc = $('scope'), sg = sc.getContext('2d'), wave = new Float32Array(2048)
  const frame = t => {
    g.clearRect(0, 0, cv.width, cv.height)
    if (spec) def.draw(g, cv.width, cv.height, { spec, spec2, params: P, view, iview, live, t: t / 1000 })
    sg.clearRect(0, 0, sc.width, sc.height)
    if (analyser) { analyser.getFloatTimeDomainData(wave); sg.beginPath(); for (let i = 0; i < 960; i++) sg.lineTo(i, 64 - wave[i * 2] * 60); sg.strokeStyle = '#d2a866'; sg.lineWidth = 2; sg.stroke() }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

// Shared drawing: a stage's reduced network seen from above, fitted to a box. glow(i) may return 0..1 per node.
export function drawNetwork(g, stage, x, y, w, h, colour, glow) {
  const xy = stage.xy, E = stage.edges; let m = 1; for (let i = 0; i < xy.length; i++) m = Math.max(m, Math.abs(xy[i]))
  const s = Math.min(w, h) / 2 / m * .94, px = i => x + w / 2 + xy[i * 2] * s, py = i => y + h / 2 + xy[i * 2 + 1] * s
  g.lineCap = 'round'
  for (let e = 0; e < E.length; e += 3) { g.beginPath(); g.moveTo(px(E[e]), py(E[e])); g.lineTo(px(E[e + 1]), py(E[e + 1])); g.strokeStyle = colour; g.globalAlpha = .75; g.lineWidth = Math.min(9, .8 + Math.sqrt(E[e + 2]) * .9); g.stroke() }
  g.globalAlpha = 1
  if (glow) for (let i = 0; i < xy.length / 2; i++) { const a = glow(i, xy[i * 2] / m, xy[i * 2 + 1] / m); if (a > .02) { g.beginPath(); g.arc(px(i), py(i), 3 + a * 9, 0, 7); g.fillStyle = `rgba(242,201,76,${Math.min(1, a)})`; g.fill() } }
  return { px, py, scale: s, m }
}
