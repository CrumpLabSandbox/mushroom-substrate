// 4M view: hand-written WebGL2. Draws the plot of ground, its logs, roots and trees, each
// individual's fine mycelium (a display-only haze from the density field), the cords (instanced ribbons),
// mushrooms at real size, and where spores have landed. The model runs in worker.js.
const $ = id => document.getElementById(id), cv = $('c'), gl = cv.getContext('webgl2', { antialias: true }),
  SCN = ['meadow turf', 'fallen logs', 'deep leaf litter', 'trees and their roots', 'one big log'],
  RGB = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255),
  TYPECOL = [[0, 0, 0], [.62, .4, .2], [.5, .46, .2], [.85, .38, .38], [.32, .5, .25]]
let W = 2.56e6, DZ = 6.4e5, H = 1.28e6, worker, sp = [], n = 0, busy = 0, run = 1, sig, fr = [], rec = [], trace, home, cells = 0, roots = [], trees = [], land = [],
  yaw = .7, pitch = .5, dist = 3.3, meshN = 0, lineN = 0, ptN = 0, recipe, owners = [], GGv = 0

const mul = (a, b) => { const o = new Float32Array(16); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) o[j * 4 + i] = a[i] * b[j * 4] + a[4 + i] * b[j * 4 + 1] + a[8 + i] * b[j * 4 + 2] + a[12 + i] * b[j * 4 + 3]; return o },
  persp = (f, asp, nr, fa) => new Float32Array([f / asp, 0, 0, 0, 0, f, 0, 0, 0, 0, (fa + nr) / (nr - fa), -1, 0, 0, 2 * fa * nr / (nr - fa), 0]),
  look = (e, t) => {
    let z = [e[0] - t[0], e[1] - t[1], e[2] - t[2]], l = Math.hypot(...z); z = z.map(v => v / l)
    let x = [z[2], 0, -z[0]]; l = Math.hypot(...x); x = x.map(v => v / l)
    const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]]
    return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -(x[0] * e[0] + x[1] * e[1] + x[2] * e[2]), -(y[0] * e[0] + y[1] * e[1] + y[2] * e[2]), -(z[0] * e[0] + z[1] * e[1] + z[2] * e[2]), 1])
  },
  P3 = (x, y, z) => [(x - H) / H, -z / H, (y - H) / H] // model (um, z = depth) to scene (surface at y = 0, y up, plot spans -1..1)

const prog = (vs, fs) => {
  const p = gl.createProgram()
  for (const [t, s] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) { const sh = gl.createShader(t); gl.shaderSource(sh, '#version 300 es\nprecision highp float;\n' + s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh)); gl.attachShader(p, sh) }
  gl.linkProgram(p); return p
}
const TO = 'uniform float u_h;vec4 to(vec3 p){return u_mvp*vec4((p.x-u_h)/u_h,-p.z/u_h,(p.y-u_h)/u_h,1.);}'
const pSeg = prog(`uniform mat4 u_mvp;uniform vec2 u_vp;uniform float u_w;in vec2 a_c;in vec3 a_p0,a_p1,a_d;out vec3 v_d;${TO}
void main(){vec4 a=to(a_p0),b=to(a_p1);vec2 d=(b.xy/b.w-a.xy/a.w)*u_vp;float l=length(d);d=l>1e-5?d/l:vec2(1,0);
vec4 p=mix(a,b,a_c.x);float st=mod(a_d.z,4.);float w=clamp(a_d.x*u_w,.8,14.)*(st>1.5?.6:1.);
p.xy+=vec2(-d.y,d.x)*a_c.y*w/u_vp*p.w;gl_Position=st>2.5?vec4(2,2,2,1):p;v_d=a_d;}`,
  `uniform int u_mode;uniform vec3 u_c[8];in vec3 v_d;out vec4 o;
void main(){float st=mod(v_d.z,4.);vec3 c=u_c[int(v_d.z/4.)];float a=1.;
if(u_mode==1)c=mix(vec3(.25,.18,.05),vec3(1.,.9,.45),v_d.y);if(u_mode==2)c=mix(vec3(.12,.2,.38),vec3(.75,.93,1.),v_d.y);
if(u_mode==3)c=mix(vec3(.1,.12,.3),vec3(1.,.95,.6),clamp(v_d.y,0.,1.));
if(st>1.5){c=vec3(.5,.46,.4);a=.25;}o=vec4(c,a);}`)
const pPt = prog(`uniform mat4 u_mvp;uniform float u_s;in vec3 a_p;in vec2 a_i;out vec2 v_i;${TO}
void main(){gl_Position=a_i.y>0.?to(a_p):vec4(2,2,2,1);gl_PointSize=u_s/gl_Position.w;v_i=a_i;}`,
  `uniform vec3 u_t[8];uniform float u_k;in vec2 v_i;out vec4 o;void main(){o=vec4(u_t[int(v_i.x)],v_i.y*u_k);}`)
const pLine = prog(`uniform mat4 u_mvp;in vec3 a_p;in vec4 a_col;out vec4 v_c;void main(){gl_Position=u_mvp*vec4(a_p,1.);gl_PointSize=3.;v_c=a_col;}`,
  `in vec4 v_c;out vec4 o;void main(){o=v_c;}`)
const pMesh = prog(`uniform mat4 u_mvp;in vec3 a_p,a_n,a_col;out vec3 v_n,v_c;void main(){gl_Position=u_mvp*vec4(a_p,1.);v_n=a_n;v_c=a_col;}`,
  `in vec3 v_n,v_c;out vec4 o;void main(){float l=.45+.55*max(0.,dot(normalize(v_n),normalize(vec3(.4,.8,.45))));o=vec4(v_c*l,1.);}`)
const buf = () => gl.createBuffer(), bGeom = buf(), bDyn = buf(), bQuad = buf(), bPt = buf(), bPi = buf(), bFp = buf(), bFi = buf(), bLine = buf(), bMesh = buf(),
  vaSeg = gl.createVertexArray(), vaPt = gl.createVertexArray(), vaFine = gl.createVertexArray(), vaLine = gl.createVertexArray(), vaMesh = gl.createVertexArray(), CAP = 1 << 18,
  attr = (p, name, b, size, stride, off, inst) => { const l = gl.getAttribLocation(p, name); if (l < 0) return; gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, gl.FLOAT, false, stride, off); inst && gl.vertexAttribDivisor(l, 1) }
gl.bindVertexArray(vaSeg)
gl.bindBuffer(gl.ARRAY_BUFFER, bQuad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -1, 0, 1, 1, -1, 1, 1]), gl.STATIC_DRAW); attr(pSeg, 'a_c', bQuad, 2, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, bGeom); gl.bufferData(gl.ARRAY_BUFFER, CAP * 24, gl.DYNAMIC_DRAW); attr(pSeg, 'a_p0', bGeom, 3, 24, 0, 1); attr(pSeg, 'a_p1', bGeom, 3, 24, 12, 1)
gl.bindBuffer(gl.ARRAY_BUFFER, bDyn); gl.bufferData(gl.ARRAY_BUFFER, CAP * 12, gl.DYNAMIC_DRAW); attr(pSeg, 'a_d', bDyn, 3, 12, 0, 1)
gl.bindVertexArray(vaPt); attr(pPt, 'a_p', bPt, 3, 0, 0); attr(pPt, 'a_i', bPi, 2, 0, 0)
gl.bindVertexArray(vaFine); attr(pPt, 'a_p', bFp, 3, 0, 0); attr(pPt, 'a_i', bFi, 2, 0, 0)
gl.bindVertexArray(vaLine); attr(pLine, 'a_p', bLine, 3, 28, 0); attr(pLine, 'a_col', bLine, 4, 28, 12)
gl.bindVertexArray(vaMesh); attr(pMesh, 'a_p', bMesh, 3, 36, 0); attr(pMesh, 'a_n', bMesh, 3, 36, 12); attr(pMesh, 'a_col', bMesh, 3, 36, 24)

// fruiting bodies and tree trunks: a profile (radius, height; cap radius = 1) spun around the axis
const FORM = {
  agaric: [[.18, 0, .14, 1.5, 1, 1.55, .92, 1.75, .6, 1.98, 0, 2.08], 2], tooth: [[.2, 0, .16, 1.2, 1, 1.3, .9, 1.5, .5, 1.7, 0, 1.78], 2],
  bolete: [[.35, 0, .3, 1.1, 1, 1.15, .95, 1.45, .6, 1.72, 0, 1.82], 2], puffball: [[0, 0, .5, .1, .95, .5, 1, .9, .8, 1.5, .4, 1.85, 0, 1.95], 0],
  truffle: [[0, -2.4, .7, -2.2, 1, -1.5, .8, -.8, 0, -.5], 0], bracket: [[0, 0, 1, 0, .95, .2, .5, .4, 0, .45], 0, .5], crust: [[0, 0, 1.3, 0, 1.3, .06, 0, .08], 0],
  coral: [[.1, 0, .13, 1.4, .08, 2.4, 0, 2.7], 0, 1, 6], club: [[.12, 0, .2, 1.6, .16, 2.4, 0, 2.7], 1], jelly: [[0, 0, .9, .1, 1, .4, .6, .75, 0, .85], 0],
  chanterelle: [[.15, 0, .2, 1, .6, 1.5, 1, 1.8, .85, 1.82, .3, 1.6, 0, 1.55], 2], morel: [[.22, 0, .2, 1, .5, 1.1, .6, 1.8, .4, 2.6, 0, 2.9], 2],
  cup: [[0, 0, .3, .05, .9, .5, 1, .9, .9, .9, .75, .5, 0, .2], 0], birdsnest: [[0, 0, .3, .05, .9, .5, 1, .9, .9, .9, .75, .5, 0, .2], 0],
  stinkhorn: [[.2, 0, .18, 2.8, .3, 2.85, .28, 3.4, 0, 3.6], 2], earthstar: [[0, 0, 1.6, 0, 1.6, .05, .6, .1, .7, .6, .4, .95, 0, 1], 3],
  trunk: [[1.25, 0, 1, 1.5, .9, 9, .82, 16], 9]
}
function lathe(out, form, cx, cy, cz, rad, capCol, stemCol) {
  if (form == 'none') return
  const [pr, stem, sweep = 1, copies = 1] = FORM[form] || FORM.agaric, T = 16
  for (let k = 0; k < copies; k++) {
    const ox = copies > 1 ? Math.cos(k * 2.4) * rad * .45 * Math.sqrt(k / copies) : 0, oz = copies > 1 ? Math.sin(k * 2.4) * rad * .45 * Math.sqrt(k / copies) : 0, sc = copies > 1 ? .7 + .3 * ((k * 7) % 5) / 5 : 1
    for (let i = 0; i + 2 < pr.length; i += 2) {
      const r0 = pr[i] * rad * sc, h0 = pr[i + 1] * rad * sc, r1 = pr[i + 2] * rad * sc, h1 = pr[i + 3] * rad * sc, dr = r1 - r0, dh = h1 - h0, col = i / 2 + 1 < stem ? stemCol : capCol
      for (let j = 0; j < T; j++) {
        const a0 = j / T * 6.2832 * sweep, a1 = (j + 1) / T * 6.2832 * sweep
        const v = (a, r, h) => out.push(cx + ox + Math.cos(a) * r, cy + h, cz + oz + Math.sin(a) * r, Math.cos(a) * dh, -dr, Math.sin(a) * dh, ...col)
        v(a0, r0, h0); v(a1, r0, h0); v(a0, r1, h1); v(a1, r0, h0); v(a1, r1, h1); v(a0, r1, h1)
      }
    }
  }
}
const spOf = o => sp.find(s => s.id == (sig ? sig.species[o] : '')) || sp[0]
function buildMeshes() {
  const out = [], ex = +$('big').value
  for (const [x, y, rad] of trees) { const p = P3(x, y, 0); lathe(out, 'trunk', p[0], 0, p[2], rad / H, [.36, .27, .2], [.36, .27, .2]) }
  for (const o of fr) {
    if (o.s > 1) continue
    const s = spOf(o.o), p = P3(o.x, o.y, 0), full = (s.z[0] + s.z[1]) / 4 * 1e4 / H * ex, g = Math.sqrt(Math.min(1, o.m / s.p[29]))
    lathe(out, s.f, p[0], 0, p[2], Math.max(.004, full * (o.s == 1 ? 1 : g * .6)), RGB(s.c[1]), RGB(s.c[2]))
  }
  meshN = out.length / 9; gl.bindBuffer(gl.ARRAY_BUFFER, bMesh); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(out), gl.DYNAMIC_DRAW)
}
function buildLines() {
  const out = [], hz = DZ / H, c = [.75, .7, .6, .5], seg = (a, b, col) => out.push(...a, ...col, ...b, ...col)
  for (const y of [0, -hz]) { seg([-1, y, -1], [1, y, -1], c); seg([1, y, -1], [1, y, 1], c); seg([1, y, 1], [-1, y, 1], c); seg([-1, y, 1], [-1, y, -1], c) }
  for (const [x, z] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) seg([x, 0, z], [x, -hz, z], c)
  for (let i = -4; i < 5; i++) { seg([i / 5.12 * 2, 0, -1], [i / 5.12 * 2, 0, 1], [.6, .55, .4, .13]); seg([-1, 0, i / 5.12 * 2], [1, 0, i / 5.12 * 2], [.6, .55, .4, .13]) } // a line every 50 cm
  for (const y of [-4e4 / H, -1.6e5 / H]) { seg([-1, y, 1], [1, y, 1], [.6, .5, .35, .3]); seg([1, y, 1], [1, y, -1], [.6, .5, .35, .3]) }
  for (const line of roots) for (let i = 0; i + 5 < line.length; i += 3) seg(P3(line[i], line[i + 1], line[i + 2]), P3(line[i + 3], line[i + 4], line[i + 5]), [.7, .46, .32, .85])
  lineN = out.length / 7
  for (let i = 0; i + 2 < land.length; i += 3) { const p = P3(land[i], land[i + 1], 0); out.push(p[0], .004, p[2], 1, 1, .92, .8) }
  ptN = out.length / 7 - lineN
  gl.bindBuffer(gl.ARRAY_BUFFER, bLine); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(out), gl.DYNAMIC_DRAW)
}

function draw() {
  const w = cv.clientWidth * devicePixelRatio | 0, h = cv.clientHeight * devicePixelRatio | 0
  if (cv.width != w || cv.height != h) { cv.width = w; cv.height = h }
  gl.viewport(0, 0, w, h); gl.clearColor(.078, .067, .047, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  const t = [0, -.1, 0], e = [t[0] + dist * Math.cos(pitch) * Math.sin(yaw), t[1] + dist * Math.sin(pitch), t[2] + dist * Math.cos(pitch) * Math.cos(yaw)],
    mvp = mul(persp(1 / Math.tan(.35), w / h, .02, 60), look(e, t)), U = (p, name) => gl.getUniformLocation(p, name)
  gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  if (meshN) { gl.useProgram(pMesh); gl.uniformMatrix4fv(U(pMesh, 'u_mvp'), false, mvp); gl.bindVertexArray(vaMesh); gl.drawArrays(gl.TRIANGLES, 0, meshN) }
  if (n) {
    gl.useProgram(pSeg); gl.uniformMatrix4fv(U(pSeg, 'u_mvp'), false, mvp); gl.uniform1f(U(pSeg, 'u_h'), H); gl.uniform2f(U(pSeg, 'u_vp'), w, h); gl.uniform1f(U(pSeg, 'u_w'), .8 * devicePixelRatio * 3.3 / dist)
    gl.uniform1i(U(pSeg, 'u_mode'), ['network', 'reserve', 'flow', 'voltage'].indexOf($('mode').value)); gl.uniform3fv(U(pSeg, 'u_c'), owners.flat())
    gl.bindVertexArray(vaSeg); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n)
  }
  gl.depthMask(false); gl.useProgram(pPt); gl.uniformMatrix4fv(U(pPt, 'u_mvp'), false, mvp); gl.uniform1f(U(pPt, 'u_h'), H); gl.uniform1f(U(pPt, 'u_s'), h * .075)
  if (cells && $('soil').checked) { gl.uniform3fv(U(pPt, 'u_t'), [...TYPECOL.flat(), 0, 0, 0, 0, 0, 0, 0, 0, 0]); gl.uniform1f(U(pPt, 'u_k'), 1); gl.bindVertexArray(vaPt); gl.drawArrays(gl.POINTS, 0, cells) }
  if (GGv && $('fine').checked) { gl.uniform3fv(U(pPt, 'u_t'), owners.flat()); gl.uniform1f(U(pPt, 'u_k'), .22); gl.bindVertexArray(vaFine); gl.drawArrays(gl.POINTS, 0, GGv) }
  gl.useProgram(pLine); gl.uniformMatrix4fv(U(pLine, 'u_mvp'), false, mvp); gl.bindVertexArray(vaLine); gl.drawArrays(gl.LINES, 0, lineN); ptN && gl.drawArrays(gl.POINTS, lineN, ptN)
  gl.depthMask(true)
}
function plot(c, series) {
  const g = c.getContext('2d'), w = c.width, h = c.height
  g.clearRect(0, 0, w, h)
  for (const [data, colour, sym] of series) {
    let lo = sym ? -1e-9 : 0, hi = 1e-9; for (const v of data) { v > hi && (hi = v); v < lo && (lo = v) }
    if (sym) hi = Math.max(hi, -lo), lo = -hi
    g.beginPath(); for (let i = 0; i < data.length; i++) g.lineTo(i / Math.max(1, data.length - 1) * w, h - 3 - (data[i] - lo) / (hi - lo) * (h - 6))
    g.strokeStyle = colour; g.lineWidth = 1.5; g.stroke()
  }
}
function readout() {
  const d = (v, k = 1) => v.toFixed(k), days = sig.t / 86400, names = [...new Set(sig.species)].map(id => sp.find(s => s.id == id).n).join(', ')
  $('out').innerHTML = `<b>${names}</b> in ${SCN[$('scn').value]}` +
    `<br>day ${d(days, 0)} (year ${d(days / 365 + 1, 0)}, ${['winter', 'spring', 'summer', 'autumn'][(days / 365 * 4 + .5 | 0) % 4]}) · surface ${d(sig.tsurf)} °C` +
    `<br>${sig.ni} individual${sig.ni > 1 ? 's' : ''} · ${sig.ntips} growing cord tips · ${d(sig.len / 1e6)} m of live cord` +
    `<br>fine mycelium in ${d(sig.mycel * 64 / 1000)} litres of ground · furthest cords ${d(sig.front / 1e4, 0)} cm out` +
    `<br>${sig.br} branches · ${sig.fu} fusions · ${sig.cords} thick cord segments · ${sig.wars} meetings between individuals` +
    `<br>wood left ${d(sig.wood * 100, 0)}% · reserve ${d(sig.res, 0)} · uptake ${d(sig.up)} per h` +
    `<br>mushrooms up now: ${fr.filter(o => o.s == 1).length} (${fr.filter(o => !o.s).length} forming) · ${sig.fruits} so far · ${sig.spores.toExponential(1)} spores shed` +
    `<br>electrodes: ${d(sig.volt, 2)} mV · ${sig.pspikes} spikes at the first one`
}

// ---------- the worker ----------
const settings = () => ({ mean: +$('temp').value, weather: +$('weather').checked, emode: +$('emode').value })
async function load(keep) {
  const get = async s => (await fetch('species/' + s + '.json')).json()
  sp = []; for (const id of ['sp', 'sp2', 'sp3']) { const v = $(id).value; v && sp.push(v == 'same' ? sp[0] : await get(v)) }
  if (!keep) { $('scn').value = sp[0].s; $('temp').value = Math.round(sp[0].p[19] - 8) }
  $('tv').textContent = $('temp').value + ' °C'
  worker && worker.terminate(); worker = new Worker('worker.js'); n = 0; busy = 1; fr = []; rec = []; meshN = 0; cells = 0; sig = null; land = []
  recipe = { engine: '4m', species: sp.map(s => s.id), seed: +$('seed').value, world: +$('scn').value, settings: settings() }
  worker.onmessage = e => {
    const m = e.data
    if (m.graph) { save(JSON.stringify({ recipe: { ...recipe, steps: Math.round(sig.t / sig.dt) }, ...m.graph }), 'network.json', 'application/json'); return }
    if (m.first) {
      [W, DZ] = m.world; H = W / 2; home = m.home; roots = m.roots; trees = m.trees; cells = m.cells.length
      const [, , G, GZ, CS] = m.world, pos = new Float32Array(cells * 3), all = new Float32Array(G * G * GZ * 3), at = (c, a, k) => { a[k * 3] = (c % G + .5) * CS; a[k * 3 + 1] = ((c / G | 0) % G + .5) * CS; a[k * 3 + 2] = ((c / (G * G) | 0) + .5) * CS }
      m.cells.forEach((c, k) => at(c, pos, k)); GGv = G * G * GZ; for (let c = 0; c < GGv; c++) at(c, all, c)
      gl.bindBuffer(gl.ARRAY_BUFFER, bPt); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW); m.types.forEach((t, k) => types[k] = t)
      gl.bindBuffer(gl.ARRAY_BUFFER, bFp); gl.bufferData(gl.ARRAY_BUFFER, all, gl.STATIC_DRAW)
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, bGeom); gl.bufferSubData(gl.ARRAY_BUFFER, m.from * 24, m.geom)
    gl.bindBuffer(gl.ARRAY_BUFFER, bDyn); gl.bufferSubData(gl.ARRAY_BUFFER, 0, m.dyn)
    const info = new Float32Array(cells * 2), K = [0, .3, .035, .7, .05]
    for (let k = 0; k < cells; k++) { info[k * 2] = types[k]; info[k * 2 + 1] = (.15 + .85 * m.level[k] / 255) * K[types[k]] }
    gl.bindBuffer(gl.ARRAY_BUFFER, bPi); gl.bufferData(gl.ARRAY_BUFFER, info, gl.DYNAMIC_DRAW)
    const fine = new Float32Array(GGv * 2); for (let c = 0; c < GGv; c++) { fine[c * 2] = m.fine[c * 2]; fine[c * 2 + 1] = m.fine[c * 2 + 1] / 255 }
    gl.bindBuffer(gl.ARRAY_BUFFER, bFi); gl.bufferData(gl.ARRAY_BUFFER, fine, gl.DYNAMIC_DRAW)
    n = m.n; sig = m.sig; fr = m.fr; trace = m.trace; land = m.land; rec.push(...m.rec); busy = 0
    // one colour per individual: its species' colour, shifted a little for each further individual of that species
    owners = Array.from({ length: 8 }, (_, o) => { const c = RGB(spOf(o).c[0]), k = sig.species.slice(0, o).filter(id => id == sig.species[o]).length; return o < sig.ni ? c.map((v, i) => Math.min(1, v * [1, .78, 1.08, .9, .7][k % 5] * (i == (k % 3) ? 1 : 1 - .16 * (k > 0)))) : [1, 1, 1] })
    buildMeshes(); buildLines(); readout()
    plot($('plot'), [[rec.map(r => r[1]), '#e9dcbc'], [rec.map(r => r[14]), '#b79ad6'], [rec.map(r => r[7]), '#f2c94c'], [rec.map(r => r[8]), '#e08572'], [rec.map(r => r[13]), '#b98a5a']])
    plot($('volt'), [[trace, '#58b4ee', 1]])
  }
  worker.postMessage({ init: { inds: sp.map(s => ({ id: s.id, p: s.p })), seed: recipe.seed, scn: recipe.world, set: settings(), mode: $('mode').value } })
}
const types = new Uint8Array(1 << 17)
function save(text, name, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = sp[0].id + '-' + name; a.click() }
function tick() {
  if (worker && !busy && run && sig) { busy = 1; worker.postMessage({ steps: +$('speed').value }) }
  draw(); requestAnimationFrame(tick)
}

fetch('list.json').then(r => r.json()).then(list => {
  for (const [slug, name, common] of list) for (const id of ['sp', 'sp2', 'sp3']) $(id).add(new Option(name + (common ? ' (' + common + ')' : ''), slug))
  SCN.forEach((s, i) => $('scn').add(new Option(s, i)))
  const q = new URLSearchParams(location.search)
  $('sp').value = q.get('s') || 'armillaria-gallica'; $('sp').value || ($('sp').value = 'armillaria-gallica'); q.get('seed') && ($('seed').value = q.get('seed'))
  load(); tick()
})
$('sp').onchange = () => load()
$('sp2').onchange = $('sp3').onchange = $('scn').onchange = $('seed').onchange = $('go').onclick = () => load(1)
$('temp').oninput = $('weather').onchange = $('emode').onchange = () => { $('tv').textContent = $('temp').value + ' °C'; worker.postMessage({ set: settings() }) }
$('mode').onchange = () => { worker.postMessage({ mode: $('mode').value }); run || worker.postMessage({ steps: 0 }) }
$('big').oninput = () => { $('bv').textContent = '×' + $('big').value; buildMeshes() }
$('rain').onclick = () => worker.postMessage({ set: { rain: 1 } })
$('pause').onclick = () => { run = !run; $('pause').textContent = run ? 'pause' : 'resume' }
$('csv').onclick = () => save('hours,cord_tips,live_cord_um,reserve,uptake_per_h,flow_per_h,front_um,mushrooms_up,surface_temp_c,spikes,meetings,spores,individuals,wood_fraction_left,fine_mycelium_cells\n' + rec.map(r => r.join(',')).join('\n'), 'signals.csv', 'text/csv')
$('wav').onclick = () => save('seconds_per_sample,' + sig.tdt + '\nmillivolts\n' + Array.from(trace, v => v.toFixed(4)).join('\n'), 'voltage.csv', 'text/csv')
$('net').onclick = () => worker.postMessage({ graph: 1 })
let drag = null
cv.onpointerdown = e => { drag = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId) }
cv.onpointermove = e => { if (!drag) return; yaw -= (e.clientX - drag[0]) * .006; pitch = Math.max(-.6, Math.min(1.5, pitch + (e.clientY - drag[1]) * .006)); drag = [e.clientX, e.clientY] }
cv.onpointerup = () => drag = null
cv.onwheel = e => { e.preventDefault(); dist = Math.max(.25, Math.min(30, dist * (1 + e.deltaY * .001))) }
