// Grows a network and records it, off the main thread. The page sends { tier, inds, seed, scn, opt }.
importScripts('record.js')
onmessage = e => {
  const m = e.data
  importScripts('../engines/' + m.tier + '/core.js')
  let last = 0
  const rec = record(M, m.inds, m.seed, m.scn, Object.assign({}, m.opt, { progress: p => { if (p - last > .02) { last = p; postMessage({ progress: p }) } } }))
  postMessage({ rec }) // the typed arrays are copied across; they are a few megabytes
}
