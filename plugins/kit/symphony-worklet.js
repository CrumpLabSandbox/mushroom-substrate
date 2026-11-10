// The audio thread for every symphony: the cast and the conductor are given when the node is made.
import { makeSymphony } from './symphony.js'
registerProcessor('symphony', class extends AudioWorkletProcessor {
  constructor(o) {
    super(); this.s = makeSymphony(sampleRate, o.processorOptions.cast, o.processorOptions.conductor); this.count = 0
    this.port.onmessage = e => { const m = e.data; if (m.load) this.s.load(m.load.part, m.load.spec); if (m.set) for (const k in m.set) this.s.set(k, m.set[k]); if (m.pset) this.s.pset(m.pset.part, m.pset.which, m.pset.k, m.pset.v) }
  }
  process(_, outputs) { const o = outputs[0]; this.s.process(o[0], o[1] || o[0]); if ((this.count += o[0].length) >= 2048) { this.count = 0; this.port.postMessage({ view: this.s.view() }) } return true }
})
