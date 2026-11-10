// Mushroom World's audio thread.
import { makeWorld } from './engine.js'
registerProcessor('mushroom-world', class extends AudioWorkletProcessor {
  constructor() {
    super(); this.w = makeWorld(sampleRate); this.count = 0
    this.port.onmessage = e => { const m = e.data, w = this.w; if (m.load) w.load(m.load); if (m.live) w.live(m.live); if (m.set) for (const k in m.set) w.set(k, m.set[k]); if (m.on != null) w.noteOn(m.on, m.vel == null ? .8 : m.vel); if (m.off != null) w.noteOff(m.off) }
  }
  process(_, outputs) { const o = outputs[0]; this.w.process(o[0], o[1] || o[0]); if ((this.count += o[0].length) >= 2048) { this.count = 0; this.port.postMessage({ report: this.w.report() }) } return true }
})
