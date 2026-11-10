// The web host for Mushroom World's skin: an implementation of the part of SynthLand's skin bridge
// (window.synthland) that this skin uses, driving the JavaScript engine in an AudioWorklet. Inside SynthLand this
// file is replaced by the host's own bridge.js and the skin is unchanged. Two things here go beyond the contract and
// are marked: `call('state')` returns what the pictures need (in SynthLand: an sl_call, as Nature has), and
// `audio.start()` is the web runtime's start button.
(() => {
  const skin = new URL('.', document.currentScript.src), plugin = new URL('../', skin), SIZES = ['4k', '40k', '400k', '4m']
  let man, byId = new Map(), P = {}, presets = [], cur = -1, ctx = null, node = null, spec = null, grower = null, state = { views: {}, tel: null, ids: {}, live: { taps: {} }, spec: null }, liveKey = ''
  const subs = { param: new Set(), preset: new Set(), meter: new Set(), tel: new Set() }, emit = (k, ...a) => subs[k].forEach(f => f(...a)), sub = k => cb => (subs[k].add(cb), () => subs[k].delete(cb))
  const post = m => node && node.port.postMessage(m), slug = () => man.species[Math.round(P['world.species'])].slug, size = () => SIZES[Math.round(P['world.scale'])]
  const atmoId = () => { const i = Math.round(P['atmo.engine']) - 1; return i >= 0 ? man.slots.atmo[i] : null }
  const loadSpec = async () => { const key = size() + '/' + slug(); spec = await (await fetch(new URL(`../specimens/${key}.json`, plugin))).json(); if (key != size() + '/' + slug()) return; state.spec = spec; post({ load: spec }); grow(true); emit('preset', cur) }
  // a live colony for the atmospheres that listen to one growing
  const grow = async again => {
    const id = atmoId(), live = id && man.modules[id].live, key = live && ctx ? id + size() + slug() : ''
    if (key == liveKey && !again) return; liveKey = key
    if (!key) { grower && grower.postMessage({ stop: 1 }); state.live = { taps: {} }; return }
    if (!grower) { grower = new Worker(new URL('../kit/live-worker.js', plugin)); grower.onmessage = e => { const m = e.data.live; if (m.stage) state.live.stage = m.stage; if (m.taps) state.live.taps = m.taps; post({ live: m }) } }
    const sp = man.species[Math.round(P['world.species'])], packed = await (await fetch(new URL(sp.invented ? `../aliens/${size()}/${sp.slug}.json` : `../../engines/${size()}/species/${sp.slug}.json`, plugin))).json()
    state.live = { taps: {} }; grower.postMessage({ start: { sp: packed, seed: 1, scn: live.world, tier: size() }, speed: P[id.replace(/-/g, '_') + '.' + live.speed] })
  }
  const clampTo = (p, v) => p.type == 'choice' ? Math.max(0, Math.min(p.choices.length - 1, Math.round(v))) : Math.max(p.min, Math.min(p.max, p.type == 'int' ? Math.round(v) : v))
  const def = p => p.type == 'choice' ? p.choices.indexOf(p.default) : p.default
  const ready = (async () => {
    man = await (await fetch(new URL('manifest.json', plugin))).json(); presets = await (await fetch(new URL('presets/index.json', plugin))).json()
    for (const p of man.parameters) { byId.set(p.id, p); P[p.id] = def(p) }
    const q = new URLSearchParams(location.hash.slice(1)); api.loadPreset(q.has('preset') ? +q.get('preset') : 0)
  })()
  const api = {
    ready: () => ready, manifest: () => man, params: () => man.parameters, get: id => P[id],
    set(id, value) {
      const p = byId.get(id); if (!p) return; const v = clampTo(p, value); if (P[id] === v) return; P[id] = v; post({ set: { [id]: v } }); emit('param', id, v)
      if (id == 'world.species' || id == 'world.scale') loadSpec(); else if (id == 'atmo.engine') grow(); else if (grower && id.endsWith('.speed')) grower.postMessage({ speed: v }); else if (grower && id.endsWith('.rain') && v > .5) grower.postMessage({ rain: 1 })
      if (cur != -1) { cur = -1; emit('preset', -1) }
    },
    beginGesture() {}, endGesture() {}, onParam: sub('param'),
    presets: () => presets.map((p, index) => ({ index, name: p.name, category: p.category, tags: p.tags || [] })), currentPreset: () => cur,
    loadPreset(i) { // a preset stores only what differs from the defaults; choices are stored by name
      const pre = presets[i]; if (!pre) return; const all = {}
      for (const p of man.parameters) { let v = def(p); if (p.id in pre.params) { const x = pre.params[p.id]; v = p.type == 'choice' ? p.choices.indexOf(x) : x } if (P[p.id] !== v) { P[p.id] = v; emit('param', p.id, v) } all[p.id] = v }
      post({ set: all }); cur = i; loadSpec()
    },
    onPreset: sub('preset'), onMeter: sub('meter'), onTelemetry: sub('tel'), telemetry: () => state.tel || [],
    noteOn(note, velocity = .8) { if (!ctx) api.audio.start(); post({ on: note, vel: velocity }) }, noteOff(note) { post({ off: note }) },
    capabilities: () => ({ midiKeyboard: false, audioInput: false, audition: false, host: 'web' }), resize() {},
    // beyond the contract: what the pictures need. 'state' -> { views, ids, live, spec }
    call: async name => name == 'state' ? state : undefined,
    audio: {
      running: () => !!ctx && ctx.state == 'running',
      async start() {
        if (ctx) { ctx.state == 'running' ? await ctx.suspend() : await ctx.resume(); return api.audio.running() }
        ctx = new AudioContext(); await ctx.audioWorklet.addModule(new URL('worklet.js', plugin))
        node = new AudioWorkletNode(ctx, 'mushroom-world', { numberOfInputs: 0, outputChannelCount: [2] }); node.connect(ctx.destination)
        node.port.onmessage = e => { const r = e.data.report; if (!r) return; state.views = r.views; state.ids = r.ids; state.tel = r.tel; state.notes = r.notes; for (const [id, v] of r.changed) { P[id] = v; emit('param', id, v) } emit('tel', r.tel); const pk = Math.pow(10, r.tel[3] / 20); emit('meter', { voices: 0, outL: pk, outR: pk }) }
        post({ set: P }); spec && post({ load: spec }); grow(true); return true
      }
    }
  }
  if (navigator.requestMIDIAccess) navigator.requestMIDIAccess().then(a => { const hook = () => a.inputs.forEach(i => i.onmidimessage = e => { const [st, k, v] = e.data, c = st & 0xf0; if (c == 0x90 && v > 0) api.noteOn(k, v / 127); else if (c == 0x80 || c == 0x90) api.noteOff(k) }); hook(); a.onstatechange = hook }).catch(() => {})
  window.synthland = api
})()
