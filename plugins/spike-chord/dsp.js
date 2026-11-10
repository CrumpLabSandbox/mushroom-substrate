// Spike Chord: a chord whose intervals are measurements. Five species have a measured interval between
// electrical spikes. Sped up by one factor, each becomes a pitch, and together they are a chord whose notes
// stand in the ratios of the data. Each voice is one unit of the engines' electrical model running at its
// species' rate. The loaded species adds its own.
// The same intervals under a second, smaller speed-up give a rhythm: each voice swells each time a slow copy
// of its unit fires, so the chord pulses in the ratios of the data too. The measured sizes of the spikes can
// set how loud each voice is. A key sets the pitch of the fastest voice.
import { soften, fhnCycle, fhnStep, rng, midiHz, TAU } from '../kit/dsp.js'
export const DATA = [['Schizophyllum commune', 41, .03], ['Pleurotus ostreatus', 70, .5], ['Omphalotus nidiformis', 92, .007], ['Flammulina velutipes', 102, .3], ['Cordyceps militaris', 116, .2]] // name, minutes between spikes, spike size in mV
export const create = sr => {
  const P = { top: 330, drive: .6, drift: .3, amps: 0, pulse: 0, own: 1, a: 1, b: 1, c: 1, d: 1, e: 1, level: 1 }, rnd = rng(29), N = 6
  const v = new Float32Array(N).fill(-1.2), w = new Float32Array(N).fill(-.62), dc = new Float32Array(N), wob = new Float32Array(N), gain = new Float32Array(N), want = new Float32Array(N)
  const pv = new Float32Array(N).fill(-1.2), pw = new Float32Array(N).fill(-.62), gate = new Float32Array(N).fill(1), ratio = new Float32Array(N)
  let mins = DATA.map(d => d[1]).concat([60]), mv = DATA.map(d => d[2]).concat([.5]), count = 0, top = P.top, goal = P.top, touch = 1, octaves = 0, note = ''
  const ratios = () => { // each voice's rate beside the fastest measured one. A species far faster than the rest is brought down by whole octaves
    for (let k = 0; k < N; k++) ratio[k] = mins[0] / Math.max(1e-4, mins[k])
    octaves = 0; while (ratio[5] > 4) { ratio[5] /= 2; octaves++ }
  }
  ratios()
  return {
    load(s) {
      mins[5] = s.numbers.spike_interval_min || 60; mv[5] = s.numbers.spike_amplitude_mv || .5; ratios()
      note = !s.has || s.has.electrical !== false ? '' : 'No electrical activity at this size: the loaded species\' voice is its recorded interval, played by one model unit, as the other five always are.'
    },
    set(k, x) { P[k] = x; if (k == 'top') goal = x },
    noteOn(key, vel) { goal = midiHz(key); touch = .4 + .75 * vel }, // the key is the pitch of the fastest voice: the one speed-up, chosen by ear
    noteOff() {},
    process(L, R) {
      const n = L.length, per = fhnCycle(P.drive); let big = 1e-9
      top += (goal - top) * Math.min(1, n / sr / .03)
      for (let k = 0; k < N; k++) big = Math.max(big, mv[k])
      const on = [P.a, P.b, P.c, P.d, P.e, P.own]
      if ((count += n) > 4800) { count = 0; for (let k = 0; k < N; k++) wob[k] += (rnd() - .5) * .02 - wob[k] * .05 } // real intervals vary from spike to spike
      for (let k = 0; k < N; k++) {
        if (P.pulse > 0) { // the slow copy: the same unit at the rhythm speed-up. While it is firing the voice is up
          const dtau = per * P.pulse * ratio[k] * n / sr, sub = Math.max(1, Math.ceil(dtau / .15)), h = dtau / sub
          for (let s = 0; s < sub; s++) fhnStep(pv, pw, k, h, P.drive, 0)
          gate[k] = pv[k] > 0 ? 1 : .06
        } else gate[k] = 1
        want[k] = on[k] * (1 - P.amps + P.amps * mv[k] / big) * gate[k] * touch
        const f = top * ratio[k] * (1 + wob[k] * P.drift), dtau = per * f / sr, sub = Math.min(40, Math.max(1, Math.ceil(dtau / .15))), h = dtau / sub, pan = k / (N - 1), gl = Math.cos(pan * TAU / 4), gr = Math.sin(pan * TAU / 4), rate = P.pulse > 0 ? .003 : .0004
        for (let i = 0; i < n; i++) {
          gain[k] += rate * (want[k] - gain[k])
          for (let s = 0; s < sub; s++) fhnStep(v, w, k, h, P.drive, 0)
          dc[k] += .001 * (v[k] - dc[k]); const x = (v[k] - dc[k]) * gain[k] * .1
          L[i] += x * gl; R[i] += x * gr
        }
      }
      soften(L, R, P.level)
    },
    view() { return { hz: Array.from(ratio, r => top * r), mins: mins.slice(), speed: top * mins[0] * 60, mv: mv.slice(), gains: Array.from(gain), up: Array.from(gate, g => g > .5 ? 1 : 0), ownOctavesDown: octaves, pulseHz: Array.from(ratio, r => P.pulse * r), scaleNote: note } }
  }
}
