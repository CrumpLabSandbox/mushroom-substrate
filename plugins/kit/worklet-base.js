// Joins a plugin's sound code (dsp.js: create(sampleRate) -> { load, set, noteOn, noteOff, process, view })
// to the audio thread. Every plugin's worklet.js is: import this, import its dsp, register.
export const register = (name, create) => registerProcessor(name, class extends AudioWorkletProcessor {
  constructor() {
    super(); this.d = create(sampleRate); this.count = 0
    this.port.onmessage = e => {
      const m = e.data, d = this.d
      if (m.load) d.load(m.load)
      if (m.set) for (const k in m.set) d.set(k, m.set[k])
      if (m.on != null) d.noteOn && d.noteOn(m.on, m.vel == null ? .8 : m.vel)
      if (m.off != null) d.noteOff && d.noteOff(m.off)
    }
  }
  process(inputs, outputs) {
    const o = outputs[0], L = o[0], R = o[1] || o[0], x = inputs[0] && inputs[0][0]
    this.d.process(L, R, x && x.length ? x : null)
    if (this.d.view && (this.count += L.length) >= 2048) { this.count = 0; this.port.postMessage({ view: this.d.view() }) }
    return true
  }
})
