// Joins a plugin's sound code (dsp.js: create(sampleRate) -> { load, set, noteOn, noteOff, process, view })
// to the audio thread. Every plugin's worklet.js is: import this, import its dsp, register.
import { INSTRUMENTS } from './instruments.js'

export const register = (name, create) => registerProcessor(name, class extends AudioWorkletProcessor {
  constructor() {
    super(); this.d = create(sampleRate); this.count = 0
    this.port.onmessage = e => {
      const m = e.data, d = this.d
      if (m.load) d.load(m.load)
      if (m.load2) d.load2 && d.load2(m.load2)
      if (m.live) d.live && d.live(m.live)
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

// A composer and the instrument it plays, together in the audio thread. The composer's code
// (create(sampleRate) -> { load, set, advance(frames) -> [{ on, vel } | { off }], view }) decides the notes;
// the chosen instrument sounds them. Which instrument is given when the node is made.
export const registerComposer = (name, create) => registerProcessor(name, class extends AudioWorkletProcessor {
  constructor(o) {
    super(); this.comp = create(sampleRate); this.inst = INSTRUMENTS[o.processorOptions.instrument](sampleRate); this.count = 0
    this.port.onmessage = e => {
      const m = e.data
      if (m.load) { this.inst.load(m.load); this.comp.load(m.load) }
      if (m.set) for (const k in m.set) this.comp.set(k, m.set[k])
      if (m.iset) for (const k in m.iset) this.inst.set(k, m.iset[k])
    }
  }
  process(_, outputs) {
    const o = outputs[0], L = o[0], R = o[1] || o[0]
    for (const ev of this.comp.advance(L.length)) ev.off != null ? this.inst.noteOff(ev.off) : this.inst.noteOn(ev.on, ev.vel)
    this.inst.process(L, R, null)
    if ((this.count += L.length) >= 2048) { this.count = 0; this.port.postMessage({ view: this.comp.view(), iview: this.inst.view ? this.inst.view() : null }) }
    return true
  }
})
