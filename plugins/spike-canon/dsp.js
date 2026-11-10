// Spike Canon: rhythm and counterpoint from electrical activity. A short chain of excitable units, the same
// model the engines use for spiking, runs live. The unit at the growing tip is driven and fires on its own;
// the units behind it fire only when the wave reaches them. Each firing is a note, so the voices follow one
// another down the hypha like a canon. Each unit plays one of the network's own notes.
// The tip's drive can come and go, so the spikes arrive in trains with quiet between, and the rate can follow
// the species' own recorded spike interval.
import { Notes, ownNotes, clamp, rng } from '../kit/dsp.js'
const ALL = { flow: true, cords: true, electrical: true, fruit: true, weather: true, spores: true, rivals: true, depth: true } // a specimen with no `has` has everything
export const create = sr => {
  const MAX = 8, P = { voices: 5, rate: 1.4, coupling: .14, spread: .6, recovery: .08, base: 48, length: .4, stage: .6, octave: 0, thin: 1, apart: .3, trains: 0, species: 0 }, notes = new Notes()
  const v = new Float32Array(MAX).fill(-1.2), w = new Float32Array(MAX).fill(-.62), d = new Float32Array(MAX), lit = new Float32Array(MAX)
  let spec = null, pitch = [0], carry = 0, phase = 0, env = 1, rateNow = 1.4, H = ALL, two = false, scaleNote = ''
  // Every note goes through here: moved by whole octaves, thinned, and ended before it is started again.
  const thinRnd = rng(101); let started = 0, nps = 0
  const play = (key, vel, samples) => {
    if (thinRnd() >= P.thin) return
    key += 12 * Math.round(P.octave); while (key < 12) key += 12; while (key > 120) key -= 12 // kept on the keyboard by whole octaves
    for (let i = notes.live.length; i--;) if (notes.live[i][0] == key) { notes.live.splice(i, 1); notes.out.push({ off: key }) }
    notes.play(key, vel, samples); started++
  }
  const done = n => { nps += (started * sr / n - nps) * Math.min(1, n / sr / 2); started = 0; return notes.tick(n) }
  // the network's notes, with modes closer together than `apart` counted as one note
  const tune = () => { let kept = 0; pitch = ownNotes(spec, P.stage, 24).filter((x, i) => !i || x - kept >= P.apart ? (kept = x, true) : false) }
  return {
    load(s) {
      spec = s; H = s.has || ALL; two = s.engine == '4m'; tune()
      scaleNote = !H.electrical ? 'No electrical network at this size: each unit runs alone, uncoupled, so no wave travels and the voices drift against each other.' : two ? 'Several individuals at this size: the chain is two hyphae that do not join, each with its own tip.' : ''
    },
    set(k, x) { P[k] = x; if (spec && (k == 'stage' || k == 'apart')) tune() },
    advance(n) {
      if (!spec) return []
      const N = Math.round(P.voices), h = .2, half = two && N >= 4 ? Math.ceil(N / 2) : N, cpl = H.electrical ? P.coupling : 0
      // the species' own interval, against a 60-minute one, moves the rate; the result is kept inside what can be heard as rhythm
      rateNow = clamp(P.rate * Math.pow(60 / Math.max(.001, spec.numbers.spike_interval_min), P.species), .1, 12)
      // trains: the tip's drive comes and goes once in about sixteen spikes
      phase += 6.2832 * rateNow / 16 * n / sr; if (phase > 6.2832) phase -= 6.2832
      env = H.electrical ? clamp((Math.cos(phase) + 1.2 - 1.4 * P.trains) * 5, 0, 1) : 1
      carry += 40 * rateNow * n / sr / h // one cycle of a driven unit is 40 of the model's time units
      for (; carry >= 1; carry--) {
        d.fill(0); for (let k = 0; k < N - 1; k++) { if (k == half - 1) continue; const g = cpl * (v[k + 1] - v[k]); d[k] += g; d[k + 1] -= g } // different individuals do not join
        for (let k = 0; k < N; k++) {
          const kk = k < half ? k : k - half, len = k < half ? half : N - half // place along its own hypha
          const drive = .3 + P.spread * .3 * (1 - kk / Math.max(1, len - 1)) * env * (k < half ? 1 : .92), a = v[k] // the tip end is driven hardest
          v[k] = clamp(a + h * (a - a * a * a / 3 - w[k] + drive + d[k]), -2.5, 2.5); w[k] += h * P.recovery * (a + .7 - .8 * w[k])
          if (a < 1 && v[k] >= 1) { play(P.base + pitch[k % pitch.length], .45 + .5 * (drive - .3) / .3, P.length * sr); lit[k] = 1 }
        }
      }
      for (let k = 0; k < MAX; k++) lit[k] *= .9
      return done(n)
    },
    // ends every note that is sounding (for whoever stops this composer)
    release() { const out = notes.live.map(l => ({ off: l[0] })); notes.live.length = 0; notes.out.length = 0; return out },
    view() { const N = Math.round(P.voices); return { v: Array.from(v.subarray(0, N)), lit: Array.from(lit.subarray(0, N)), pitch: Array.from({ length: N }, (_, k) => pitch[k % pitch.length]), drive: env, rate: rateNow, coupled: !!H.electrical, split: two && N >= 4 ? Math.ceil(N / 2) : 0, scaleNote, sounding: notes.count(), nps } }
  }
}
