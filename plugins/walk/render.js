// The renderer: hand-written WebGL2, after the manner of the Moebius comics. The scene is drawn in flat colour
// with three bands of light and coloured (not black) shadows; a second pass draws the sky behind it, finds the
// edges of every shape from depth and surface direction and inks them, hatches the darkest shadows, and adds the
// grain of paper. No library and nothing fetched: everything is in this file.
import { hex } from './shapes.js'

// ---- matrices (column-major, as WebGL wants)
export const perspective = (fov, aspect, near, far) => { const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far); return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]) }
export const mul = (a, b) => { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s } return o }
export const view = (eye, yaw, pitch) => { // looking along yaw (0 = north, -z) and pitch (up positive)
  const cp = Math.cos(pitch), f = [Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp], r = [Math.cos(yaw), 0, Math.sin(yaw)], u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]]
  return new Float32Array([r[0], u[0], -f[0], 0, r[1], u[1], -f[1], 0, r[2], u[2], -f[2], 0, -(r[0] * eye[0] + r[1] * eye[1] + r[2] * eye[2]), -(u[0] * eye[0] + u[1] * eye[1] + u[2] * eye[2]), f[0] * eye[0] + f[1] * eye[1] + f[2] * eye[2], 1])
}
export const invert = m => { const a = m, o = new Float32Array(16)
  const b00 = a[0] * a[5] - a[1] * a[4], b01 = a[0] * a[6] - a[2] * a[4], b02 = a[0] * a[7] - a[3] * a[4], b03 = a[1] * a[6] - a[2] * a[5], b04 = a[1] * a[7] - a[3] * a[5], b05 = a[2] * a[7] - a[3] * a[6]
  const b06 = a[8] * a[13] - a[9] * a[12], b07 = a[8] * a[14] - a[10] * a[12], b08 = a[8] * a[15] - a[11] * a[12], b09 = a[9] * a[14] - a[10] * a[13], b10 = a[9] * a[15] - a[11] * a[13], b11 = a[10] * a[15] - a[11] * a[14]
  const d = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06)
  o[0] = (a[5] * b11 - a[6] * b10 + a[7] * b09) * d; o[1] = (a[2] * b10 - a[1] * b11 - a[3] * b09) * d; o[2] = (a[13] * b05 - a[14] * b04 + a[15] * b03) * d; o[3] = (a[10] * b04 - a[9] * b05 - a[11] * b03) * d
  o[4] = (a[6] * b08 - a[4] * b11 - a[7] * b07) * d; o[5] = (a[0] * b11 - a[2] * b08 + a[3] * b07) * d; o[6] = (a[14] * b02 - a[12] * b05 - a[15] * b01) * d; o[7] = (a[8] * b05 - a[10] * b02 + a[11] * b01) * d
  o[8] = (a[4] * b10 - a[5] * b08 + a[7] * b06) * d; o[9] = (a[1] * b08 - a[0] * b10 - a[3] * b06) * d; o[10] = (a[12] * b04 - a[13] * b02 + a[15] * b00) * d; o[11] = (a[9] * b02 - a[8] * b04 - a[11] * b00) * d
  o[12] = (a[5] * b07 - a[4] * b09 - a[6] * b06) * d; o[13] = (a[0] * b09 - a[1] * b07 + a[2] * b06) * d; o[14] = (a[13] * b01 - a[12] * b03 - a[14] * b00) * d; o[15] = (a[8] * b03 - a[9] * b01 + a[10] * b00) * d
  return o }

// ---- shaders
const LIGHT = `
uniform vec3 uSun, uShade, uFog, uEye; uniform float uFar, uFogNear, uNight;
vec3 toon(vec3 base, vec3 n, vec3 p) {
  float l = dot(normalize(n), uSun);
  float band = l > .5 ? 1. : l > .08 ? .8 : .58;                       // three bands of light
  vec3 c = mix(base * uShade * 1.6, base, band);                        // shadows take the palette's shade, not black
  float rim = pow(1. - abs(dot(normalize(n), normalize(uEye - p))), 3.); c += rim * .08 * (1. - uNight);
  return c;
}`
const SCENE_VS = `#version 300 es
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aN; layout(location=2) in vec3 aC; layout(location=3) in float aPart;
uniform mat4 uVP; out vec3 vP, vN, vC; out float vPart, vGlow;
void main() { vP = aPos; vN = aN; vC = aC; vPart = aPart; vGlow = 0.; gl_Position = uVP * vec4(aPos, 1.); }`
const MUSH_VS = `#version 300 es
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aN; layout(location=2) in vec3 aC; layout(location=3) in float aPart;
layout(location=4) in vec4 iPos;     // x, y, z, height in metres
layout(location=5) in vec4 iTurn;    // yaw, lean, how grown (0..1), glow (0..1)
layout(location=6) in vec3 iStem; layout(location=7) in vec3 iCap; layout(location=8) in vec3 iGill;
uniform mat4 uVP; uniform float uTime;
out vec3 vP, vN, vC; out float vPart, vGlow;
void main() {
  float g = iTurn.z, h = iPos.w * (.08 + .92 * g), sway = sin(uTime * .9 + iPos.x * .3 + iPos.z * .2) * .025 * aPos.y;
  float cy = cos(iTurn.x), sy = sin(iTurn.x), lean = iTurn.y + sway;
  vec3 p = aPos * vec3(.75 + .25 * g, 1., .75 + .25 * g);               // a young fruit body is a narrow button
  p.x += p.y * lean;
  p = vec3(cy * p.x - sy * p.z, p.y, sy * p.x + cy * p.z) * h;
  vec3 n = vec3(cy * aN.x - sy * aN.z, aN.y, sy * aN.x + cy * aN.z);
  vP = p + iPos.xyz; vN = n; vPart = aPart; vGlow = iTurn.w;
  vC = aPart < 1.5 ? iStem : aPart < 2.5 ? iCap : iGill;
  gl_Position = uVP * vec4(vP, 1.);
}`
const SCENE_FS = `#version 300 es
precision highp float;
in vec3 vP, vN, vC; in float vPart, vGlow;
layout(location=0) out vec4 oC; layout(location=1) out vec4 oND;
${LIGHT}
uniform float uMush;
void main() {
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 c = toon(vC, n, vP);
  float glow = uMush > .5 ? vGlow : 0.;
  if (uMush > .5) { if (vPart > 2.5) c = mix(c, vC * 1.2, .5); c += vC * glow * (vPart > 1.5 ? .9 : .45) + vec3(1., .85, .5) * glow * .25; }
  float d = length(uEye - vP);
  float f = smoothstep(uFogNear, uFar * .92, d); c = mix(c, uFog, f * (1. - glow * .5));
  oC = vec4(c, 1.);
  oND = vec4(n * .5 + .5, d / uFar);
}`
const COMP_VS = `#version 300 es
out vec2 vUv; void main() { vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); vUv = p; gl_Position = vec4(p * 2. - 1., 0., 1.); }`
const COMP_FS = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uC, uND; uniform vec2 uPx; uniform mat4 uInv; uniform vec3 uEyeC; uniform vec3 uSky0, uSky1, uSky2, uSunC, uSun, uInk, uFog, uShade, uHill; uniform float uSeed, uTime, uNight, uInkW;
float h1(float x) { return fract(sin(x * 127.1 + uSeed) * 43758.5453); }
float n1(float x) { float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(h1(i), h1(i + 1.), f); }
float ridge(float a, float k) { return n1(a * k) * .6 + n1(a * k * 2.3 + 7.) * .3 + n1(a * k * 5.1 + 3.) * .1; }
vec3 sky(vec3 d) {
  float y = d.y, az = atan(d.z, d.x);
  vec3 c = y < .25 ? mix(uSky0, uSky1, smoothstep(-.05, .25, y)) : mix(uSky1, uSky2, smoothstep(.25, .9, y));
  float s = max(0., dot(d, uSun)); c = mix(c, uSunC, smoothstep(.9986, .9992, s)); c += uSunC * pow(s, 60.) * .35;   // a flat disc of sun with a soft ring
  if (uNight > .5) { vec2 g = floor(vec2(az * 300., y * 300.)); float st = fract(sin(dot(g, vec2(12.9898, 78.233)) + uSeed) * 43758.5); c += step(.9975, st) * smoothstep(.0, .2, y) * .9; }
  // long flat clouds, in bands
  float band = sin(y * 38. + n1(az * 3.) * 4.) * .5 + .5, cl = smoothstep(.62, .7, n1(az * 5. + uTime * .01) * band) * smoothstep(.06, .2, y) * (1. - smoothstep(.45, .6, y));
  c = mix(c, mix(uSky0, vec3(1.), .5 + .2 * (1. - uNight)), cl * .7);
  // two ranges of far hills, flat colour with an inked edge
  for (int k = 1; k >= 0; k--) {
    float fk = float(k), top = .015 + ridge(az + fk * 3., 2. + fk * 2.5) * (.07 + fk * .05) * (1. - fk * .3);
    vec3 hc = mix(uHill, uFog, .55 - fk * .25);
    if (y < top) { c = hc; if (top - y < .0025) c = mix(c, uInk, .45); }
  }
  return c;
}
void main() {
  vec4 nd = texture(uND, vUv); vec3 col = texture(uC, vUv).rgb;
  vec4 w = uInv * vec4(vUv * 2. - 1., 1., 1.); vec3 dir = normalize(w.xyz / w.w - uEyeC);
  if (nd.a <= 0.) col = sky(dir);
  // ink: where depth jumps or the surface turns sharply
  float ink = 0., d0 = nd.a;
  if (d0 > 0.) {
    vec2 e = uPx * uInkW;
    vec4 a = texture(uND, vUv + vec2(e.x, 0.)), b = texture(uND, vUv - vec2(e.x, 0.)), c = texture(uND, vUv + vec2(0., e.y)), dd = texture(uND, vUv - vec2(0., e.y));
    float da = a.a <= 0. ? 1. : a.a, db = b.a <= 0. ? 1. : b.a, dc = c.a <= 0. ? 1. : c.a, de = dd.a <= 0. ? 1. : dd.a;
    float lap = abs(4. * d0 - da - db - dc - de) / d0;
    vec3 n0 = nd.xyz * 2. - 1.;
    float nt = max(max(1. - dot(n0, a.xyz * 2. - 1.), 1. - dot(n0, b.xyz * 2. - 1.)), max(1. - dot(n0, c.xyz * 2. - 1.), 1. - dot(n0, dd.xyz * 2. - 1.)));
    ink = max(smoothstep(.07, .16, lap), smoothstep(.22, .45, nt) * .85) * (1. - smoothstep(.55, .95, d0));
    // hatching in the darkest shadows, in screen space, as a pen would
    float lum = dot(col, vec3(.3, .55, .15));
    vec2 fc = gl_FragCoord.xy;
    float hatch = step(fract((fc.x + fc.y) / 7.), .22) * smoothstep(.42, .25, lum) + step(fract((fc.x - fc.y) / 7.), .22) * smoothstep(.27, .15, lum);
    col = mix(col, uInk, min(hatch, 1.) * .22 * (1. - smoothstep(.3, .8, d0)));
  }
  col = mix(col, uInk, ink * .9);
  // paper: a little grain and a warm edge
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - .5) * .035;
  vec2 q = vUv - .5; col *= 1. - dot(q, q) * .35;
  o = vec4(col, 1.);
}`

export function makeRenderer(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: false, powerPreference: 'high-performance' })
  if (!gl) throw new Error('This page needs WebGL2.')
  const float = !!gl.getExtension('EXT_color_buffer_float')
  const prog = (vs, fs) => { const p = gl.createProgram(); for (const [t, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); gl.attachShader(p, s) } gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); u[a.name] = gl.getUniformLocation(p, a.name) } return { p, u } }
  const scene = prog(SCENE_VS, SCENE_FS), mush = prog(MUSH_VS, SCENE_FS), comp = prog(COMP_VS, COMP_FS)
  // geometry: 10 floats a vertex
  const layout = () => { const S = 40; gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, S, 0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, S, 12); gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 3, gl.FLOAT, false, S, 24); gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 1, gl.FLOAT, false, S, 36) }
  const upload = data => { const vao = gl.createVertexArray(), buf = gl.createBuffer(); gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); layout(); gl.bindVertexArray(null); return { vao, buf, n: data.length / 10 } }
  const free = m => { gl.deleteVertexArray(m.vao); gl.deleteBuffer(m.buf); m.inst && gl.deleteBuffer(m.inst) }
  // a form of fruit body, with room for instances: 17 floats each (pos+height 4, turn 4, stem 3, cap 3, gill 3)
  const instanced = data => { const m = upload(data); m.inst = gl.createBuffer(); gl.bindVertexArray(m.vao); gl.bindBuffer(gl.ARRAY_BUFFER, m.inst); const S = 68; [[4, 4, 0], [5, 4, 16], [6, 3, 32], [7, 3, 44], [8, 3, 56]].forEach(([l, k, o]) => { gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, k, gl.FLOAT, false, S, o); gl.vertexAttribDivisor(l, 1) }); gl.bindVertexArray(null); m.count = 0; return m }
  const fill = (m, data, count) => { gl.bindBuffer(gl.ARRAY_BUFFER, m.inst); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW); m.count = count }
  // the off-screen targets: colour, and surface direction with depth
  let fb, tC, tND, rb, W = 0, H = 0
  const resize = (w, h) => {
    if (w == W && h == H) return; W = w; H = h; canvas.width = w; canvas.height = h
    if (fb) { gl.deleteFramebuffer(fb); gl.deleteTexture(tC); gl.deleteTexture(tND); gl.deleteRenderbuffer(rb) }
    const tex = (fmt, ifmt, type) => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, ifmt, w, h, 0, fmt, type, null); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t }
    tC = tex(gl.RGBA, gl.RGBA8, gl.UNSIGNED_BYTE); tND = float ? tex(gl.RGBA, gl.RGBA16F, gl.HALF_FLOAT) : tex(gl.RGBA, gl.RGBA8, gl.UNSIGNED_BYTE)
    fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tC, 0); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, tND, 0)
    rb = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, rb); gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, w, h); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb)
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]); gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
  const emptyVao = gl.createVertexArray()
  // draw a frame. f: { eye, vp, inv, pal, sun, far, time, chunks: [mesh], forms: [mesh], seed }
  const frame = f => {
    const P = f.pal, sky = P.sky.map(hex), shade = hex(P.shade), fog = hex(P.fog), ink = hex(P.ink)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.viewport(0, 0, W, H)
    gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 1]); gl.clearBufferfv(gl.COLOR, 1, [0, 0, 0, 0]); gl.clear(gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE)
    const common = (pr, isMush) => { const u = pr.u; gl.useProgram(pr.p); gl.uniformMatrix4fv(u.uVP, false, f.vp); gl.uniform3fv(u.uSun, f.sun); gl.uniform3fv(u.uShade, shade); gl.uniform3fv(u.uFog, fog); gl.uniform3fv(u.uEye, f.eye); gl.uniform1f(u.uFar, f.far); gl.uniform1f(u.uFogNear, f.far * .35); gl.uniform1f(u.uNight, P.night ? 1 : 0); gl.uniform1f(u.uMush, isMush ? 1 : 0); u.uTime && gl.uniform1f(u.uTime, f.time) }
    common(scene, false); for (const m of f.chunks) { gl.bindVertexArray(m.vao); gl.drawArrays(gl.TRIANGLES, 0, m.n) }
    common(mush, true); for (const m of f.forms) if (m.count) { gl.bindVertexArray(m.vao); gl.drawArraysInstanced(gl.TRIANGLES, 0, m.n, m.count) }
    gl.bindVertexArray(null)
    // the composite: sky, ink, hatching, paper
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H); gl.disable(gl.DEPTH_TEST)
    const u = comp.u; gl.useProgram(comp.p)
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tC); gl.uniform1i(u.uC, 0)
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tND); gl.uniform1i(u.uND, 1)
    gl.uniform2f(u.uPx, 1 / W, 1 / H); gl.uniformMatrix4fv(u.uInv, false, f.inv); gl.uniform3fv(u.uEyeC, f.eye)
    gl.uniform3fv(u.uSky0, sky[0]); gl.uniform3fv(u.uSky1, sky[1]); gl.uniform3fv(u.uSky2, sky[2]); gl.uniform3fv(u.uSunC, hex(P.sun)); gl.uniform3fv(u.uSun, f.sun)
    gl.uniform3fv(u.uInk, ink); gl.uniform3fv(u.uFog, fog); gl.uniform3fv(u.uShade, shade); gl.uniform3fv(u.uHill, hex(P.ground[2])); gl.uniform1f(u.uSeed, f.seed % 1000); gl.uniform1f(u.uTime, f.time); gl.uniform1f(u.uNight, P.night ? 1 : 0); gl.uniform1f(u.uInkW, Math.max(1, Math.round(W / 1100)))
    gl.bindVertexArray(emptyVao); gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  return { gl, upload, instanced, fill, free, resize, frame, float }
}
