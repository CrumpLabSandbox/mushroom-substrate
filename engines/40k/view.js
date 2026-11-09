// 40K view: draws the substrate, the network (by width, reserve or flow), fruiting sites, the
// signal plot and the readout. Reads the core's state; never changes it except the temperature.
const $ = id => document.getElementById(id), cv = $('c'), x = cv.getContext('2d'), pl = $('plot'), px = pl.getContext('2d'),
  bg = document.createElement('canvas'), bx = bg.getContext('2d'),
  SCN = ['dish of agar', 'wood blocks in soil', 'leaf litter patches', 'tree roots in soil', 'one large log'],
  TYPE = [[42, 36, 28], [112, 74, 38], [84, 78, 36], [150, 70, 70], [44, 50, 58]], // soil, wood, litter, root, agar
  RAMP = { reserve: ['#4a3a12', '#8a6a14', '#c99a1c', '#f2c94c', '#fff3b0'], flow: ['#3a5f95', '#3f7fc0', '#4a9fe0', '#7cc6f5', '#e2f5ff'] }
let S, P, run = 1, frame = 0
bg.width = bg.height = 128
SCN.forEach((s, i) => $('scn').add(new Option(s, i)))

async function load(keepScn) {
  P = await (await fetch('species/' + $('sp').value + '.json')).json()
  if (!keepScn) $('scn').value = P.s
  S = M(P.p, +$('seed').value, +$('scn').value)
  $('temp').value = S.temp; $('tv').textContent = S.temp + ' °C'; frame = 0
}

function draw() {
  const k = cv.width / S.W, n = S.n, mode = $('mode').value, img = bx.createImageData(128, 128), se = S.se
  for (let c = 0; c < 16384; c++) {
    const t = TYPE[S.typ[c]], f = .45 + .55 * Math.min(1, se[c] / S.SE0[S.typ[c]])
    img.data[c * 4] = t[0] * f; img.data[c * 4 + 1] = t[1] * f; img.data[c * 4 + 2] = t[2] * f; img.data[c * 4 + 3] = 255
  }
  bx.putImageData(img, 0, 0); x.imageSmoothingEnabled = false; x.drawImage(bg, 0, 0, cv.width, cv.height)
  const path = [0, 1, 2, 3, 4, 5].map(() => new Path2D())
  for (let i = 0; i < n; i++) {
    const st = S.st[i]; if (st > 2) continue
    let b = 5 // inactive
    if (st == 1) {
      const v = mode == 'reserve' ? S.si[i] / S.SMAX * 2.5 : mode == 'flow' ? Math.sqrt(S.Q[i]) * 1.5 : Math.sqrt(S.ar[i]) * .8
      b = Math.min(4, v | 0)
    }
    path[b].moveTo(S.x0[i] * k, S.y0[i] * k); path[b].lineTo(S.x1[i] * k, S.y1[i] * k)
  }
  x.lineCap = 'round'
  x.strokeStyle = 'rgba(150,140,120,.22)'; x.lineWidth = 1; x.stroke(path[5])
  for (let b = 0; b < 5; b++) {
    x.strokeStyle = mode == 'network' ? P.c[0] : RAMP[mode][b]
    x.lineWidth = mode == 'network' ? [.8, 1.5, 2.3, 3.2, 4.5][b] : mode == 'flow' ? 1 + b * .6 : 1.2
    x.globalAlpha = mode == 'network' && !b ? .8 : 1; x.stroke(path[b])
  }
  x.globalAlpha = 1
  for (const o of S.fr) {
    const rad = Math.max(2, 800 * k * Math.sqrt(Math.min(1, o.m / S.MM)))
    x.beginPath(); x.arc(o.x * k, o.y * k, o.s == 2 ? 2 : rad, 0, 7)
    x.fillStyle = o.s == 2 ? '#665' : P.c[1]; x.globalAlpha = o.s == 1 ? .95 : .6; x.fill(); x.globalAlpha = 1
    if (o.s == 1) { x.strokeStyle = '#14110c'; x.lineWidth = 1.5; x.stroke(); x.beginPath(); x.arc(o.x * k, o.y * k, rad * .3, 0, 7); x.stroke() }
  }
}

function plot() {
  const R = S.rec, w = pl.width, h = pl.height
  px.clearRect(0, 0, w, h)
  ;[[1, '#e9dcbc'], [3, '#f2c94c'], [4, '#7fbf8b'], [5, '#58b4ee']].forEach(([col, colour]) => {
    let m = 1e-9; for (const row of R) m = Math.max(m, row[col])
    px.beginPath(); R.forEach((row, i) => px.lineTo(i / Math.max(1, R.length - 1) * w, h - 2 - row[col] / m * (h - 6)))
    px.strokeStyle = colour; px.lineWidth = 1.5; px.stroke()
  })
}

function readout() {
  const h = S.t / 3600, f = S.fr, d = (v, n = 1) => v.toFixed(n)
  $('out').innerHTML = `<b>${P.n}</b> in ${SCN[$('scn').value]}, ${d(S.temp, 0)} °C` +
    `<br>${d(h, 0)} h (${d(h / 24)} days), running ${d(S.dt * $('speed').value * 60 / 3600, 0)} simulated hours per second` +
    `<br>${S.ntips} growing tips · ${d(S.len / 1e4)} cm of live hypha · front ${d(S.front / 1e3)} mm from the centre` +
    `<br>${S.br} branches · ${S.fu} fusions · ${S.cords} cord segments` +
    `<br>loopiness (alpha) ${d(S.alpha, 3)} from fusions, ${d(S.alphaX, 3)} if every crossing counts` +
    `<br>reserve ${d(S.res, 0)} · uptake ${d(S.up)} per h · flow from the centre ${d(S.flow)} per h` +
    `<br>fruiting: ${f.filter(o => o.s == 1).length} mature, ${f.filter(o => !o.s).length} growing, ${f.filter(o => o.s == 2).length} aborted`
}

function tick() {
  if (S) {
    if (run) for (let k = +$('speed').value; k--;) S.step()
    if (run || !frame) { (S.n < 2e4 || frame % 3 == 0) && draw(); frame % 6 || (plot(), readout()) }
    frame++
  }
  requestAnimationFrame(tick)
}

$('sp').onchange = () => load()
$('scn').onchange = $('seed').onchange = $('go').onclick = () => load(1)
$('temp').oninput = () => { S.temp = +$('temp').value; $('tv').textContent = $('temp').value + ' °C' }
$('mode').onchange = () => S && draw()
$('pause').onclick = cv.onclick = () => { run = !run; $('pause').textContent = run ? 'pause' : 'resume' }
$('csv').onclick = () => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['hours,tips,live_length_um,reserve,uptake_per_h,flow_per_h,front_um,fruits\n' + S.rec.map(r => r.join(',')).join('\n')], { type: 'text/csv' }))
  a.download = $('sp').value + '-seed' + $('seed').value + '.csv'; a.click()
}
fetch('list.json').then(r => r.json()).then(list => {
  for (const [slug, name, common] of list) $('sp').add(new Option(name + (common ? ' (' + common + ')' : ''), slug))
  const q = new URLSearchParams(location.search)
  $('sp').value = q.get('s') || 'phanerochaete-velutina'; $('sp').value || ($('sp').value = 'phanerochaete-velutina'); q.get('seed') && ($('seed').value = q.get('seed'))
  load().then(tick)
})
