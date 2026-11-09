// 400K view: hand-written WebGL2. Draws the soil block, resources, roots, the network (instanced
// ribbons), fruiting bodies (lathe meshes) and the electrodes; plots signals and the voltage trace.
// The model runs in worker.js; this file only displays what it sends.
const $ = id => document.getElementById(id), cv = $('c'), gl = cv.getContext('webgl2', { antialias: true }),
  SCN = ['block of agar', 'buried wood in soil', 'deep leaf litter', 'tree roots in soil', 'half-buried log'],
  RGB = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255),
  TYPECOL = [[0, 0, 0], [.62, .4, .2], [.5, .46, .2], [.85, .38, .38], [.3, .38, .5]]
let W = 25600, DZ = 12800, worker, sp = [], n = 0, busy = 0, run = 1, sig, fr = [], rec = [], trace, home, cells = 0, roots = [],
  yaw = .7, pitch = .45, dist = 3.1, meshN = 0, lineN = 0, frame = 0, recipe

// ---------- small matrix kit ----------
const mul = (a, b) => { const o = new Float32Array(16); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) o[j * 4 + i] = a[i] * b[j * 4] + a[4 + i] * b[j * 4 + 1] + a[8 + i] * b[j * 4 + 2] + a[12 + i] * b[j * 4 + 3]; return o },
  persp = (f, asp, nr, fa) => new Float32Array([f / asp, 0, 0, 0, 0, f, 0, 0, 0, 0, (fa + nr) / (nr - fa), -1, 0, 0, 2 * fa * nr / (nr - fa), 0]),
  look = (e, t) => {
    let z = [e[0] - t[0], e[1] - t[1], e[2] - t[2]], l = Math.hypot(...z); z = z.map(v => v / l)
    let x = [z[2], 0, -z[0]]; l = Math.hypot(...x); x = x.map(v => v / l)
    const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]]
    return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -(x[0] * e[0] + x[1] * e[1] + x[2] * e[2]), -(y[0] * e[0] + y[1] * e[1] + y[2] * e[2]), -(z[0] * e[0] + z[1] * e[1] + z[2] * e[2]), 1])
  },
  // model space (um, z = depth) to scene space (soil surface at y = 0, y up)
  P3 = (x, y, z) => [(x - W / 2) / 12800, -z / 12800, (y - W / 2) / 12800]

// ---------- shaders ----------
const prog = (vs, fs) => {
  const p = gl.createProgram()
  for (const [t, s] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) { const sh = gl.createShader(t); gl.shaderSource(sh, '#version 300 es\nprecision highp float;\n' + s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh)); gl.attachShader(p, sh) }
  gl.linkProgram(p); return p
}
const TO = 'vec4 to(vec3 p){return u_mvp*vec4((p.x-12800.)/12800.,-p.z/12800.,(p.y-12800.)/12800.,1.);}'
const pSeg = prog(`uniform mat4 u_mvp;uniform vec2 u_vp;uniform float u_w;in vec2 a_c;in vec3 a_p0,a_p1,a_d;out vec3 v_d;${TO}
void main(){vec4 a=to(a_p0),b=to(a_p1);vec2 d=(b.xy/b.w-a.xy/a.w)*u_vp;float l=length(d);d=l>1e-5?d/l:vec2(1,0);
vec4 p=mix(a,b,a_c.x);float st=mod(a_d.z,4.);float w=clamp(a_d.x*u_w,.8,14.)*(st>1.5?.6:1.);
p.xy+=vec2(-d.y,d.x)*a_c.y*w/u_vp*p.w;gl_Position=st>2.5?vec4(2,2,2,1):p;v_d=a_d;}`,
  `uniform int u_mode;uniform vec3 u_c0,u_c1;in vec3 v_d;out vec4 o;
void main(){float st=mod(v_d.z,4.);vec3 c=v_d.z>3.5?u_c1:u_c0;float a=1.;
if(u_mode==1)c=mix(vec3(.25,.18,.05),vec3(1.,.9,.45),v_d.y);if(u_mode==2)c=mix(vec3(.12,.2,.38),vec3(.75,.93,1.),v_d.y);
if(u_mode==3)c=mix(vec3(.1,.12,.3),vec3(1.,.95,.6),clamp(v_d.y,0.,1.));
if(st>1.5){c=vec3(.5,.46,.4);a=.25;}o=vec4(c,a);}`)
const pPt = prog(`uniform mat4 u_mvp;uniform float u_s;in vec3 a_p;in vec2 a_i;out vec2 v_i;${TO}
void main(){gl_Position=to(a_p);gl_PointSize=u_s/gl_Position.w;v_i=a_i;}`,
  `uniform vec3 u_t[5];in vec2 v_i;out vec4 o;void main(){float k=v_i.x>3.5?.03:v_i.x>2.5?2.5:v_i.x>1.5?.12:1.;o=vec4(u_t[int(v_i.x)],(.05+.3*v_i.y)*k);}`)
const pLine = prog(`uniform mat4 u_mvp;in vec3 a_p;in vec4 a_col;out vec4 v_c;void main(){gl_Position=u_mvp*vec4(a_p,1.);v_c=a_col;}`,
  `in vec4 v_c;out vec4 o;void main(){o=v_c;}`)
const pMesh = prog(`uniform mat4 u_mvp;in vec3 a_p,a_n,a_col;out vec3 v_n,v_c;void main(){gl_Position=u_mvp*vec4(a_p,1.);v_n=a_n;v_c=a_col;}`,
  `in vec3 v_n,v_c;out vec4 o;void main(){float l=.45+.55*max(0.,dot(normalize(v_n),normalize(vec3(.4,.8,.45))));o=vec4(v_c*l,1.);}`)
const buf = () => gl.createBuffer(), bGeom = buf(), bDyn = buf(), bQuad = buf(), bPt = buf(), bPi = buf(), bLine = buf(), bMesh = buf(),
  vaSeg = gl.createVertexArray(), vaPt = gl.createVertexArray(), vaLine = gl.createVertexArray(), vaMesh = gl.createVertexArray(), CAP = 1 << 18,
  attr = (p, name, b, size, stride, off, inst) => { const l = gl.getAttribLocation(p, name); if (l < 0) return; gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, gl.FLOAT, false, stride, off); inst && gl.vertexAttribDivisor(l, 1) }
gl.bindVertexArray(vaSeg)
gl.bindBuffer(gl.ARRAY_BUFFER, bQuad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -1, 0, 1, 1, -1, 1, 1]), gl.STATIC_DRAW); attr(pSeg, 'a_c', bQuad, 2, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, bGeom); gl.bufferData(gl.ARRAY_BUFFER, CAP * 24, gl.DYNAMIC_DRAW); attr(pSeg, 'a_p0', bGeom, 3, 24, 0, 1); attr(pSeg, 'a_p1', bGeom, 3, 24, 12, 1)
gl.bindBuffer(gl.ARRAY_BUFFER, bDyn); gl.bufferData(gl.ARRAY_BUFFER, CAP * 12, gl.DYNAMIC_DRAW); attr(pSeg, 'a_d', bDyn, 3, 12, 0, 1)
gl.bindVertexArray(vaPt); attr(pPt, 'a_p', bPt, 3, 0, 0); attr(pPt, 'a_i', bPi, 2, 0, 0)
gl.bindVertexArray(vaLine); attr(pLine, 'a_p', bLine, 3, 28, 0); attr(pLine, 'a_col', bLine, 4, 28, 12)
gl.bindVertexArray(vaMesh); attr(pMesh, 'a_p', bMesh, 3, 36, 0); attr(pMesh, 'a_n', bMesh, 3, 36, 12); attr(pMesh, 'a_col', bMesh, 3, 36, 24)

// ---------- fruiting bodies: a profile (radius, height; cap radius = 1) spun around the stem ----------
// [profile, number of points that belong to the stem, sweep (1 = full turn, .5 = a shelf), copies]
const FORM = {
  agaric: [[.18, 0, .14, 1.5, 1, 1.55, .92, 1.75, .6, 1.98, 0, 2.08], 2], tooth: [[.2, 0, .16, 1.2, 1, 1.3, .9, 1.5, .5, 1.7, 0, 1.78], 2],
  bolete: [[.35, 0, .3, 1.1, 1, 1.15, .95, 1.45, .6, 1.72, 0, 1.82], 2], puffball: [[0, 0, .5, .1, .95, .5, 1, .9, .8, 1.5, .4, 1.85, 0, 1.95], 0],
  truffle: [[0, -2.4, .7, -2.2, 1, -1.5, .8, -.8, 0, -.5], 0], bracket: [[0, 0, 1, 0, .95, .2, .5, .4, 0, .45], 0, .5], crust: [[0, 0, 1.3, 0, 1.3, .06, 0, .08], 0],
  coral: [[.1, 0, .13, 1.4, .08, 2.4, 0, 2.7], 0, 1, 6], club: [[.12, 0, .2, 1.6, .16, 2.4, 0, 2.7], 1], jelly: [[0, 0, .9, .1, 1, .4, .6, .75, 0, .85], 0],
  chanterelle: [[.15, 0, .2, 1, .6, 1.5, 1, 1.8, .85, 1.82, .3, 1.6, 0, 1.55], 2], morel: [[.22, 0, .2, 1, .5, 1.1, .6, 1.8, .4, 2.6, 0, 2.9], 2],
  cup: [[0, 0, .3, .05, .9, .5, 1, .9, .9, .9, .75, .5, 0, .2], 0], birdsnest: [[0, 0, .3, .05, .9, .5, 1, .9, .9, .9, .75, .5, 0, .2], 0],
  stinkhorn: [[.2, 0, .18, 2.8, .3, 2.85, .28, 3.4, 0, 3.6], 2], earthstar: [[0, 0, 1.6, 0, 1.6, .05, .6, .1, .7, .6, .4, .95, 0, 1], 3]
}
function lathe(out, form, cx, cy, cz, rad, capCol, stemCol) {
  const [pr, stem, sweep = 1, copies = 1] = FORM[form] || FORM.agaric, T = 20
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
function buildMeshes() {
  const out = [], real = $('real').checked
  for (const o of fr) {
    if (o.s == 2) continue
    const s = sp[o.o], [x, , z] = P3(o.x, o.y, 0), full = real ? (s.z[0] + s.z[1]) / 4 * 1e4 / 12800 : .12, g = Math.sqrt(Math.min(1, o.m / s.p[29]))
    lathe(out, s.f, x, 0, z, Math.max(.012, full * (o.s == 1 ? 1 : g * .6)), RGB(s.c[1]), RGB(s.c[2]))
  }
  meshN = out.length / 9; gl.bindBuffer(gl.ARRAY_BUFFER, bMesh); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(out), gl.DYNAMIC_DRAW)
}
function buildLines() {
  const out = [], hx = W / 25600, hz = DZ / 12800, c = [.75, .7, .6, .5], seg = (a, b, col) => out.push(...a, ...col, ...b, ...col)
  for (const y of [0, -hz]) { seg([-hx, y, -hx], [hx, y, -hx], c); seg([hx, y, -hx], [hx, y, hx], c); seg([hx, y, hx], [-hx, y, hx], c); seg([-hx, y, hx], [-hx, y, -hx], c) }
  for (const [x, z] of [[-hx, -hx], [hx, -hx], [hx, hx], [-hx, hx]]) seg([x, 0, z], [x, -hz, z], c)
  for (let i = -3; i < 4; i++) { seg([i / 4 * hx, 0, -hx], [i / 4 * hx, 0, hx], [.6, .55, .4, .16]); seg([-hx, 0, i / 4 * hx], [hx, 0, i / 4 * hx], [.6, .55, .4, .16]) }
  for (const y of [-800 / 12800, -4000 / 12800]) { seg([-hx, y, hx], [hx, y, hx], [.6, .5, .35, .3]); seg([hx, y, hx], [hx, y, -hx], [.6, .5, .35, .3]) } // layer boundaries
  for (const line of roots) for (let i = 0; i + 5 < line.length; i += 3) seg(P3(line[i], line[i + 1], line[i + 2]), P3(line[i + 3], line[i + 4], line[i + 5]), [.75, .5, .35, .9])
  if (home && sig) for (const k of [0, 1]) { const e = P3(...electrode[k]), col = k ? [.4, .8, 1, 1] : [1, .5, .4, 1]; seg([e[0], e[1], e[2]], [e[0], .25, e[2]], col); seg([e[0] - .03, .25, e[2]], [e[0] + .03, .25, e[2]], col) }
  lineN = out.length / 7; gl.bindBuffer(gl.ARRAY_BUFFER, bLine); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(out), gl.DYNAMIC_DRAW)
}
let electrode = [[0, 0, 0], [0, 0, 0]]

// ---------- drawing ----------
function draw() {
  const w = cv.clientWidth * devicePixelRatio | 0, h = cv.clientHeight * devicePixelRatio | 0
  if (cv.width != w || cv.height != h) { cv.width = w; cv.height = h }
  gl.viewport(0, 0, w, h); gl.clearColor(.078, .067, .047, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  const t = [0, -.32, 0], e = [t[0] + dist * Math.cos(pitch) * Math.sin(yaw), t[1] + dist * Math.sin(pitch), t[2] + dist * Math.cos(pitch) * Math.cos(yaw)],
    mvp = mul(persp(1 / Math.tan(.35), w / h, .05, 60), look(e, t)), U = (p, name) => gl.getUniformLocation(p, name)
  gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  if (meshN) { gl.useProgram(pMesh); gl.uniformMatrix4fv(U(pMesh, 'u_mvp'), false, mvp); gl.bindVertexArray(vaMesh); gl.drawArrays(gl.TRIANGLES, 0, meshN) }
  if (n) {
    gl.useProgram(pSeg); gl.uniformMatrix4fv(U(pSeg, 'u_mvp'), false, mvp); gl.uniform2f(U(pSeg, 'u_vp'), w, h); gl.uniform1f(U(pSeg, 'u_w'), devicePixelRatio * 3.1 / dist)
    gl.uniform1i(U(pSeg, 'u_mode'), ['network', 'reserve', 'flow', 'voltage'].indexOf($('mode').value))
    gl.uniform3fv(U(pSeg, 'u_c0'), RGB(sp[0].c[0])); gl.uniform3fv(U(pSeg, 'u_c1'), sp[1] ? (sp[1].id == sp[0].id ? [.62, .85, .95] : RGB(sp[1].c[0]).map((v, i) => v * [.75, .95, 1.1][i])) : [1, 1, 1])
    gl.bindVertexArray(vaSeg); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n)
  }
  gl.depthMask(false)
  if (cells && $('soil').checked) { gl.useProgram(pPt); gl.uniformMatrix4fv(U(pPt, 'u_mvp'), false, mvp); gl.uniform1f(U(pPt, 'u_s'), h * .075); gl.uniform3fv(U(pPt, 'u_t'), TYPECOL.flat()); gl.bindVertexArray(vaPt); gl.drawArrays(gl.POINTS, 0, cells) }
  gl.useProgram(pLine); gl.uniformMatrix4fv(U(pLine, 'u_mvp'), false, mvp); gl.bindVertexArray(vaLine); gl.drawArrays(gl.LINES, 0, lineN)
  gl.depthMask(true)
}
function plot(c, series) {
  const g = c.getContext('2d'), w = c.width, h = c.height
  g.clearRect(0, 0, w, h)
  for (const [data, colour, sym] of series) {
    let lo = sym ? -1e-9 : 0, hi = 1e-9; for (const v of data) { v > hi && (hi = v); sym && v < lo && (lo = v) }
    if (sym) hi = Math.max(hi, -lo), lo = -hi
    g.beginPath(); for (let i = 0; i < data.length; i++) g.lineTo(i / Math.max(1, data.length - 1) * w, h - 3 - (data[i] - lo) / (hi - lo) * (h - 6))
    g.strokeStyle = colour; g.lineWidth = 1.5; g.stroke()
  }
}
function readout() {
  const d = (v, k = 1) => v.toFixed(k), h = sig.t / 3600, names = sp.map(s => s.n).join(' and ')
  $('out').innerHTML = `<b>${names}</b> in ${SCN[$('scn').value]}` +
    `<br>${d(h, 0)} h (${d(h / 24)} days) · surface ${d(sig.tsurf)} °C` +
    `<br>${sig.tipsOf.join(' + ')} growing tips · ${d(sig.len / 1e4, 0)} cm of live hypha · ${sig.n} segments` +
    `<br>${sig.br} branches · ${sig.fu} fusions · ${sig.cords} cord segments · front ${d(sig.front / 1e3)} mm` +
    `<br>reserve ${d(sig.res, 0)} · uptake ${d(sig.up, 0)} per h · flow ${d(sig.flow, 0)} per h` +
    (sp[1] ? `<br>${sig.wars} meetings between the two individuals` : '') +
    `<br>electrodes: ${d(sig.volt, 2)} mV now · ${sig.pspikes} spikes at the red one` +
    `<br>fruiting: ${fr.filter(o => o.s == 1).length} mature, ${fr.filter(o => !o.s).length} growing, ${fr.filter(o => o.s == 2).length} aborted`
}

// ---------- the worker ----------
const settings = () => ({ mean: +$('temp').value, weather: +$('weather').checked, emode: +$('emode').value })
async function load(keepScn) {
  const get = async s => (await fetch('species/' + s + '.json')).json()
  sp = [await get($('sp').value)]
  const second = $('sp2').value
  if (second) sp.push(second == 'same' ? sp[0] : await get(second))
  if (!keepScn) { $('scn').value = sp[0].s; $('temp').value = sp[0].p[19] - sp[0].p[26] }
  $('tv').textContent = $('temp').value + ' °C'
  worker && worker.terminate(); worker = new Worker('worker.js'); n = 0; busy = 1; fr = []; rec = []; meshN = 0; cells = 0; sig = null
  recipe = { engine: '400k', species: sp.map(s => s.id), seed: +$('seed').value, world: +$('scn').value, settings: settings() }
  worker.onmessage = e => {
    const m = e.data
    if (m.graph) { save(JSON.stringify({ recipe: { ...recipe, steps: Math.round(sig.t / sig.dt) }, ...m.graph }), 'network.json', 'application/json'); return }
    if (m.first) {
      [W, DZ] = m.world; home = m.home; roots = m.roots; cells = m.cells.length
      const [, , G, , CS] = m.world, pos = new Float32Array(cells * 3)
      m.cells.forEach((c, k) => { pos[k * 3] = (c % G + .5) * CS; pos[k * 3 + 1] = ((c / G | 0) % G + .5) * CS; pos[k * 3 + 2] = ((c / (G * G) | 0) + .5) * CS })
      gl.bindBuffer(gl.ARRAY_BUFFER, bPt); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW); m.types.forEach((t, k) => types[k] = t)
      electrode = [[home[0][0], home[0][1], home[0][2]], [home[0][0] + 4000, home[0][1], home[0][2]]]
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, bGeom); gl.bufferSubData(gl.ARRAY_BUFFER, m.from * 24, m.geom)
    gl.bindBuffer(gl.ARRAY_BUFFER, bDyn); gl.bufferSubData(gl.ARRAY_BUFFER, 0, m.dyn)
    const info = new Float32Array(cells * 2); for (let k = 0; k < cells; k++) { info[k * 2] = types[k]; info[k * 2 + 1] = m.level[k] / 255 }
    gl.bindBuffer(gl.ARRAY_BUFFER, bPi); gl.bufferData(gl.ARRAY_BUFFER, info, gl.DYNAMIC_DRAW)
    n = m.n; sig = m.sig; fr = m.fr; trace = m.trace; rec.push(...m.rec); busy = 0
    buildMeshes(); buildLines(); readout()
    plot($('plot'), [[rec.map(r => r[1]), '#e9dcbc'], [rec.map(r => r[3]), '#f2c94c'], [rec.map(r => r[4]), '#7fbf8b'], [rec.map(r => r[8]), '#e08572']])
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

// ---------- controls ----------
fetch('list.json').then(r => r.json()).then(list => {
  for (const [slug, name, common] of list) { const label = name + (common ? ' (' + common + ')' : ''); $('sp').add(new Option(label, slug)); $('sp2').add(new Option(label, slug)) }
  SCN.forEach((s, i) => $('scn').add(new Option(s, i)))
  const q = new URLSearchParams(location.search)
  $('sp').value = q.get('s') || 'phanerochaete-velutina'; $('sp').value || ($('sp').value = 'phanerochaete-velutina'); q.get('seed') && ($('seed').value = q.get('seed'))
  load(); tick()
})
$('sp').onchange = () => load()
$('sp2').onchange = $('scn').onchange = $('seed').onchange = $('go').onclick = () => load(1)
$('temp').oninput = $('weather').onchange = $('emode').onchange = () => { $('tv').textContent = $('temp').value + ' °C'; worker.postMessage({ set: settings() }) }
$('mode').onchange = () => { worker.postMessage({ mode: $('mode').value }); run || worker.postMessage({ steps: 0 }) }
$('real').onchange = () => buildMeshes()
$('rain').onclick = () => worker.postMessage({ set: { rain: 1 } })
$('pause').onclick = () => { run = !run; $('pause').textContent = run ? 'pause' : 'resume' }
$('csv').onclick = () => save('hours,tips,live_length_um,reserve,uptake_per_h,flow_per_h,front_um,fruits,surface_temp_c,spikes,meetings\n' + rec.map(r => r.join(',')).join('\n'), 'signals.csv', 'text/csv')
$('wav').onclick = () => save('seconds_per_sample,' + sig.tdt + '\nmillivolts\n' + Array.from(trace, v => v.toFixed(4)).join('\n'), 'voltage.csv', 'text/csv')
$('net').onclick = () => worker.postMessage({ graph: 1 })
let drag = null
cv.onpointerdown = e => { drag = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId) }
cv.onpointermove = e => { if (!drag) return; yaw -= (e.clientX - drag[0]) * .006; pitch = Math.max(-1.3, Math.min(1.5, pitch + (e.clientY - drag[1]) * .006)); drag = [e.clientX, e.clientY] }
cv.onpointerup = () => drag = null
cv.onwheel = e => { e.preventDefault(); dist = Math.max(.5, Math.min(30, dist * (1 + e.deltaY * .001))) }
