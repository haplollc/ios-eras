// Port of HomeIcons+Media.swift: Photos, Camera, Maps, Weather, Clock.
//
// The Swift works in unit-square coordinates (origin top-left, fractions of
// the icon edge): `mediaAt(edge, cx, cy, w:, h:)` is a w*100 x h*100 box
// centred at (100cx, 100cy) here, and `mediaCircle(edge, cx, cy, r:)` a
// circle of diameter 200r at (100cx, 100cy).
//
// Two SwiftUI behaviours this file relies on:
// - A gradient fill resolves against the view's FRAME, not the path's
//   bounds, so gradients on custom shapes (petal rings, the camera body,
//   the cloud, routes) are set in user space over that frame (lin, rad).
// - Circle().trim(from:to:) runs clockwise from 3 o'clock and clamps `to`
//   at 1 (the sunflower's 1.12 draws to 3 o'clock, as the capture shows).
//
// Hairlines the Swift draws as max(0.6 pt, edge * k) use HAIR: 0.6 pt on a
// ~60 pt tile.

import type { Ink } from '../../core/ink'
import { css as inkCSS } from '../../core/ink'
import type { Family, HomeAppDef, Kit, Stop } from './kit'
import {
  blur,
  capsulePath,
  circle,
  clip,
  design,
  ellipse,
  ellipsePath,
  fade,
  flat,
  gradientStops,
  hex,
  lineHeightSF,
  mixInk,
  path,
  rect,
  ring,
  rrectPath,
  shadow,
  text,
  toInk,
  weight,
} from './kit'

// ---------------------------------------------------------------- helpers

const f = (v: number) => +v.toFixed(3)
const P = (x: number, y: number) => `${f(x)},${f(y)}`
const rot = (deg: number, x: number, y: number) => (deg ? `transform="rotate(${f(deg)} ${f(x)} ${f(y)})"` : '')
const HAIR = 1
const white = (a: number) => `rgba(255,255,255,${a})`
const black = (a: number) => `rgba(0,0,0,${a})`

/** A linear gradient in user space, from (x1, y1) to (x2, y2): SwiftUI's
 *  LinearGradient over the view's frame. */
function lin(k: Kit, list: Array<Stop | string>, x1: number, y1: number, x2: number, y2: number): string {
  const id = k.id('ml')
  k.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${gradientStops(list)}</linearGradient>`,
  )
  return `url(#${id})`
}

/** Top to bottom over a frame spanning y0...y1. */
const down = (k: Kit, list: Array<Stop | string>, y0: number, y1: number) => lin(k, list, 0, y0, 0, y1)

/** Leading to trailing over a frame spanning x0...x1. */
const across = (k: Kit, list: Array<Stop | string>, x0: number, x1: number) => lin(k, list, x0, 0, x1, 0)

/** RadialGradient(center:, startRadius: r0, endRadius: r1) in user space. */
function rad(k: Kit, list: Array<Stop | string>, cx: number, cy: number, r1: number, r0 = 0): string {
  const id = k.id('mr')
  const n = list.length
  const inner = r1 > 0 ? r0 / r1 : 0
  const shifted = list.map((s, i): Stop => {
    const [c, o] = Array.isArray(s) ? s : [s, n === 1 ? 0 : i / (n - 1)]
    return [c, inner + (1 - inner) * o]
  })
  k.def(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${f(cx)}" cy="${f(cy)}" r="${f(r1)}">${gradientStops(shifted)}</radialGradient>`)
  return `url(#${id})`
}

/** MediaGlow: an ellipse filling a w x h frame, solid `colour` at `alpha`
 *  for `core` of the radius, fading to clear at its edge. `deg` turns it
 *  about its own centre (rotationEffect before mediaAt). */
function glow(k: Kit, colour: string, alpha: number, core: number, cx: number, cy: number, w: number, h: number, deg = 0): string {
  const id = k.id('mg')
  const solid = fade(colour, alpha)
  const list: Stop[] = core > 0 ? [[solid, 0], [solid, core], [fade(colour, 0), 1]] : [[solid, 0], [fade(colour, 0), 1]]
  k.def(`<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5">${gradientStops(list)}</radialGradient>`)
  return ellipse(cx, cy, w, h, `url(#${id})`, rot(deg, cx, cy))
}

/** MediaCrescent in a circle of diameter d: the disc and a smaller disc
 *  (`inner` of the radius) shifted by (dx, dy) of the frame. Fill evenodd. */
function crescentPath(cx: number, cy: number, d: number, dx: number, dy: number, inner: number): string {
  const r = (d / 2) * inner
  return `${ellipsePath(cx, cy, d, d)} ${ellipsePath(cx + d * dx, cy + d * dy, r * 2, r * 2)}`
}

/** A MediaCrescent filled with an AngularGradient (SwiftUI degrees: 0 is 3
 *  o'clock, clockwise), light: the crescent clips a fan of `segments`
 *  wedges round (cx, cy), each the gradient's colour (blended like
 *  SwiftUI, see kit.mixInk) at its middle angle, and wedges that come out
 *  clear are left out. Before the first stop and after the last, the end
 *  colours hold, as in SwiftUI. A slight blur on the fan (applied before
 *  the clip, so the crescent's own edges stay sharp) smooths the wedge
 *  steps and closes pixel seams between them. */
function angularCrescent(
  k: Kit,
  list: Stop[],
  crescent: string,
  cx: number,
  cy: number,
  radius: number,
  startDeg = 0,
  endDeg = 360,
  segments = 120,
): string {
  const st = list.map(([c, l]): [Ink, number] => [toInk(c), l])
  const at = (t: number): Ink => {
    if (t <= st[0][1]) return st[0][0]
    for (let i = 1; i < st.length; i++) {
      const [c1, l1] = st[i]
      if (t <= l1) {
        const [c0, l0] = st[i - 1]
        return mixInk(c0, c1, l1 > l0 ? (t - l0) / (l1 - l0) : 1)
      }
    }
    return st[st.length - 1][0]
  }
  const R = radius * 1.1
  const p = (deg: number) => P(cx + R * Math.cos((deg * Math.PI) / 180), cy + R * Math.sin((deg * Math.PI) / 180))
  const span = endDeg - startDeg
  let wedges = ''
  for (let j = 0; j < segments; j++) {
    const colour = at((j + 0.5) / segments)
    if (colour.a < 0.004) continue
    const a0 = startDeg + (span * j) / segments
    const a1 = startDeg + (span * (j + 1)) / segments
    wedges += `<path d="M${P(cx, cy)} L${p(a0)} L${p(a1)} Z" fill="${inkCSS(colour)}"/>`
  }
  const fan = `<g shape-rendering="crispEdges">${wedges}</g>`
  return `<g clip-path="${clip(k, `<path d="${crescent}" clip-rule="evenodd"/>`)}" filter="${blur(k, 0.5)}">${fan}</g>`
}

/** Circle(radius r).trim(from:to:) as an open arc. */
function arcPath(cx: number, cy: number, r: number, from: number, to: number): string {
  const t1 = Math.min(1, to)
  const a0 = from * 2 * Math.PI
  const a1 = t1 * 2 * Math.PI
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${P(cx + r * Math.cos(a0), cy + r * Math.sin(a0))} A${f(r)},${f(r)} 0 ${large} 1 ${P(cx + r * Math.cos(a1), cy + r * Math.sin(a1))}`
}

/** A closed polygon from 100-box points. */
const polygon = (pts: Array<[number, number]>) => `M${pts.map(([x, y]) => P(x, y)).join(' L')} Z`

/** Path builder with CoreGraphics' addArc(tangent1End:tangent2End:radius:). */
class Pen {
  d = ''
  private x = 0
  private y = 0
  move(x: number, y: number): this {
    this.d += `M${P(x, y)} `
    this.x = x
    this.y = y
    return this
  }
  line(x: number, y: number): this {
    this.d += `L${P(x, y)} `
    this.x = x
    this.y = y
    return this
  }
  curve(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): this {
    this.d += `C${P(c1x, c1y)} ${P(c2x, c2y)} ${P(x, y)} `
    this.x = x
    this.y = y
    return this
  }
  /** Line to the tangent point on (current -> p1), arc of radius r round
   *  the corner p1 to the tangent point on (p1 -> p2). */
  arcTo(x1: number, y1: number, x2: number, y2: number, r: number): this {
    let ax = this.x - x1
    let ay = this.y - y1
    let bx = x2 - x1
    let by = y2 - y1
    const la = Math.hypot(ax, ay)
    const lb = Math.hypot(bx, by)
    if (la < 1e-9 || lb < 1e-9 || r <= 0) return this.line(x1, y1)
    ax /= la
    ay /= la
    bx /= lb
    by /= lb
    const theta = Math.acos(Math.max(-1, Math.min(1, ax * bx + ay * by)))
    if (theta < 1e-6 || Math.PI - theta < 1e-6) return this.line(x1, y1)
    const t = r / Math.tan(theta / 2)
    const sweep = -ax * by + ay * bx > 0 ? 1 : 0
    this.line(x1 + ax * t, y1 + ay * t)
    const ex = x1 + bx * t
    const ey = y1 + by * t
    this.d += `A${f(r)},${f(r)} 0 0 ${sweep} ${P(ex, ey)} `
    this.x = ex
    this.y = ey
    return this
  }
  close(): string {
    return this.d + 'Z'
  }
}

/** MediaArrowShape: Apple's navigation arrow. A slim triangle with a notch
 *  cut up to 0.66 of the height, and every corner rounded off - a blunt tip,
 *  soft swept-back wings, a soft notch. The outline is traced from the real
 *  iOS 18 Maps marker: straight sides, widest at 0.95 of the height, the
 *  wings rounded away so the bottom is two soft points, not two spikes. */
function arrowPath(cx: number, cy: number, w: number, h: number): string {
  const p = (u: number, v: number) => P(cx + w * (u - 0.5), cy + h * (v - 0.5))
  return (
    `M${p(0.5, 0)} ` +
    `C${p(0.5295, 0)} ${p(0.5657, 0.038)} ${p(0.5953, 0.1)} ` +
    `L${p(1, 0.95)} ` +
    `Q${p(1.024, 1)} ${p(0.945, 1)} ` +
    `Q${p(0.9074, 1)} ${p(0.8475, 0.95)} ` +
    `L${p(0.5479, 0.7)} ` +
    `Q${p(0.5, 0.66)} ${p(0.4521, 0.7)} ` +
    `L${p(0.1525, 0.95)} ` +
    `Q${p(0.0926, 1)} ${p(0.055, 1)} ` +
    `Q${p(-0.024, 1)} ${p(0, 0.95)} ` +
    `L${p(0.4047, 0.1)} ` +
    `C${p(0.4343, 0.038)} ${p(0.4705, 0)} ${p(0.5, 0)} Z`
  )
}

/** MediaShieldShape in a w x h frame at (x0, y0). */
function shieldPath(x0: number, y0: number, w: number, h: number): string {
  const p = (x: number, y: number) => P(x0 + w * x, y0 + h * y)
  return (
    `M${p(0.02, 0.17)} Q${p(0.17, 0)} ${p(0.34, 0.15)} Q${p(0.5, 0)} ${p(0.66, 0.15)} Q${p(0.83, 0)} ${p(0.98, 0.17)} ` +
    `C${p(1.02, 0.55)} ${p(0.82, 0.92)} ${p(0.5, 1)} C${p(0.18, 0.92)} ${p(-0.02, 0.55)} ${p(0.02, 0.17)} Z`
  )
}

/** MediaCloudShape in a w x h frame centred at (cx, cy). Like the Swift,
 *  both axes are measured in widths from the frame's top-left corner. */
function cloudPath(cx: number, cy: number, w: number, h: number): string {
  const x0 = cx - w / 2
  const y0 = cy - h / 2
  const lobe = (ux: number, uy: number, r: number) => ellipsePath(x0 + w * ux, y0 + w * uy, w * r * 2, w * r * 2)
  const rx = x0 + w * 0.18
  const ry = y0 + w * 0.42
  const rw = w * 0.57
  const rh = w * 0.25
  return `${lobe(0.18, 0.49, 0.18)} ${lobe(0.45, 0.3, 0.3)} ${lobe(0.75, 0.42, 0.25)} M${P(rx, ry)} L${P(rx + rw, ry)} L${P(rx + rw, ry + rh)} L${P(rx, ry + rh)} Z`
}

/** MediaRadialBars: `count` bars from `inner` to `outer` (fractions of
 *  `side`) round (cx, cy), the first at 12 o'clock, as one stroked path
 *  with round ends (the Swift's rounded rects of radius width / 2). */
function radialBars(count: number, inner: number, outer: number, width: number, ink: string, cx = 50, cy = 50, side = 100, skipEvery = 0): string {
  const w = side * width
  const r0 = side * inner + w / 2
  const r1 = side * outer - w / 2
  let d = ''
  for (let i = 0; i < count; i++) {
    if (skipEvery && i % skipEvery === 0) continue
    const a = (i / count) * 2 * Math.PI
    const s = Math.sin(a)
    const c = Math.cos(a)
    d += `M${P(cx + r1 * s, cy - r1 * c)} L${P(cx + r0 * s, cy - r0 * c)} `
  }
  return `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${f(w)}" stroke-linecap="round"/>`
}

/** MediaPetalRing: `count` pointed petals from `inner` to `outer`, bulging
 *  `width` either side, the first turned `phase` of a step from 12 o'clock. */
function petalRingPath(count: number, inner: number, outer: number, width: number, phase: number, cx: number, cy: number, side = 100): string {
  let d = ''
  const mid = (-side * (inner + outer)) / 2
  for (let i = 0; i < count; i++) {
    const a = ((i + phase) / count) * 2 * Math.PI
    const c = Math.cos(a)
    const s = Math.sin(a)
    const T = (x: number, y: number) => P(cx + x * c - y * s, cy + x * s + y * c)
    d += `M${T(0, -side * inner)} Q${T(-side * width, mid)} ${T(0, -side * outer)} Q${T(side * width, mid)} ${T(0, -side * inner)} Z `
  }
  return d
}

// ---------------------------------------------------------------- Photos

/** iPhone OS 1 - iOS 6: a sunflower on a hazy sky. */
function sunflowerArt(k: Kit): string {
  const fx = 53
  const fy = 43
  let out =
    // The deeper blue band across the middle of the sky, and a little haze.
    rect(50, 50, 100, 44, down(k, ['rgba(0,0,0,0)', hex(0x5e8cc8, 0.9), hex(0x8fb2de, 0.5), 'rgba(0,0,0,0)'], 28, 72)) +
    glow(k, '#fff', 0.75, 0, 10, 60, 40, 16) +
    glow(k, '#fff', 0.6, 0, 95, 66, 30, 14) +
    // Stem and leaves.
    path(capsulePath(47, 87, 6, 32), across(k, [hex(0xadc75d), hex(0x5b8412)], 44, 50), rot(8, 47, 87)) +
    ellipse(27, 72, 27, 11, down(k, [hex(0x5c9a22), hex(0x2f5a08)], 66.5, 77.5), rot(-32, 27, 72)) +
    ellipse(79, 81, 32, 8.5, down(k, [hex(0x4e8418), hex(0x1f3a04)], 76.75, 85.25), rot(-22, 79, 81))
  // Petals: three staggered rings, the back ones longest and shaded. Their
  // gradients run over the rings' 100 x 100 frame.
  const top = fy - 50
  const bottom = fy + 50
  out += path(petalRingPath(13, 0.12, 0.415, 0.085, 0.33, fx, fy), down(k, [hex(0xeaa416), hex(0xb86e06)], top, bottom))
  out += path(petalRingPath(13, 0.12, 0.39, 0.085, 0.67, fx, fy), down(k, [hex(0xffd834), hex(0xf0ac18)], top, bottom))
  out += path(petalRingPath(13, 0.12, 0.36, 0.09, 0, fx, fy), down(k, [hex(0xffe640), hex(0xffd42c), hex(0xf8c020)], top, bottom))
  // The seed disc: brown-black, a darker rim, a pale crescent of seeds.
  out += circle(fx, fy, 31, rad(k, [hex(0x1e1206), hex(0x2e1d0c), hex(0x4a3216)], fx - 15.5 + 0.45 * 31, fy - 15.5 + 0.45 * 31, 16))
  out += ring(fx, fy, 31, 1.4, hex(0x2a1a0a, 0.9))
  out += path(arcPath(53, 44, 7.5, 0.85, 1.12), 'none', `stroke="${hex(0x9c7e52, 0.8)}" stroke-width="2.2" stroke-linecap="round"`)
  return out
}

/** iOS 7 onward: eight capsules fanned round the centre, each multiplied
 *  into what is under it; the glass version adds a shadow per petal.
 *  - The Swift also overlays a white 45% rim on each glass petal, but
 *    SwiftUI's .blendMode, like .opacity, reaches each drawn leaf: the rim
 *    multiplies onto its own petal and vanishes (the iOS captures show no
 *    rim). So no rim is drawn here.
 *  - `tile` is the design's own background: SwiftUI multiplies the petals
 *    into the tile too, which an art layer cannot reach, so the tile
 *    gradient is multiplied back in over the petals (clipped to them). */
function pinwheelArt(
  k: Kit,
  o: { glass: boolean; width: number; inner: number; outer: number; petals: number[]; tile?: [number, number] },
): string {
  const length = o.outer - o.inner
  const w = o.width * 100
  const h = length * 100
  const cy = 50 - (o.inner + length / 2) * 100
  const d = capsulePath(50, cy, w, h)
  // The shadow sits before the rotation in SwiftUI, so it turns with the
  // petal (it falls toward the centre): the filter goes on the rotated path.
  const sh = o.glass ? ` filter="${shadow(k, black(0.18), 1.2, 0, 1.2)}"` : ''
  const n = o.petals.length
  let out = ''
  let union = ''
  o.petals.forEach((c, i) => {
    const turn = rot((i / n) * 360, 50, 50)
    out += path(d, hex(c), `${turn} style="mix-blend-mode:multiply"${sh}`)
    union += `<path d="${d}" ${turn}/>`
  })
  if (o.tile) {
    out += rect(50, 50, 100, 100, down(k, [hex(o.tile[0]), hex(o.tile[1])], 0, 100), `clip-path="${clip(k, union)}" style="mix-blend-mode:multiply"`)
  }
  if (!o.glass) out += circle(50, 50, 4, '#fff')
  return out
}

// ---------------------------------------------------------------- Camera

/** iPhone OS 1 - iOS 6: a black barrel, a stepped ridge, slate-blue glass,
 *  aperture reflections upper-left. */
function lensClassic(k: Kit): string {
  let out = circle(50, 50, 66, down(k, [hex(0x1c1c1c), hex(0x050505)], 17, 83), `filter="${shadow(k, black(0.45), 2, 0, 1.5)}"`)
  out += ring(50, 50, 49, 3.5, down(k, [hex(0x3c3c3c), hex(0x1a1a1a)], 25.5, 74.5))
  out += circle(50, 50, 39, rad(k, [hex(0x86a8c4), hex(0x4e7494), hex(0x263a4e), hex(0x0b1826)], 30.5 + 0.42 * 39, 30.5 + 0.38 * 39, 21))
  out += ring(50, 50, 25, 0.8, hex(0x9cbad2, 0.45))
  out += circle(51, 51, 14, rad(k, [hex(0x5e83a4, 0.9), hex(0x1c2c3c, 0.9)], 51, 51, 7))
  for (let i = 0; i < 3; i++) {
    const from = 0.53 + i * 0.065
    out += path(arcPath(50, 50, 13, from, from + 0.045), 'none', `stroke="${hex(i === 1 ? 0xdde8f2 : 0xb7ccdd, 0.9)}" stroke-width="3.5"`)
  }
  out += circle(56.5, 56, 3.6, white(0.9))
  out += circle(53.5, 60, 2, white(0.45))
  return out
}

/** iOS 26: a grey glass bezel, deep navy glass, a highlight upper-left and
 *  a blue-white flare arcing round the lower right. */
function lensGlass26(k: Kit): string {
  const bezel = circle(50, 50, 81, down(k, [hex(0x9c9c9c, 0.92), hex(0x676767, 0.95)], 9.5, 90.5)) + ring(50, 50, 81, 0.6, hex(0xc4c4c4, 0.85))
  let out = `<g filter="${shadow(k, black(0.28), 2, 0.8, 1.5)}">${bezel}</g>`
  out += circle(50, 50, 72.4, hex(0x16181f))
  out += circle(50, 50, 69, rad(k, [hex(0x161824), hex(0x1d2132), hex(0x2b3553)], 50, 50, 34.5, 6))
  out += ring(50, 50, 60, 0.7, hex(0x3f3b55, 0.9))
  out += ring(50, 50, 49, 0.5, hex(0x3f3b55, 0.6))
  // The flare round the lower right: a warm halo, a bright blue band, a white core.
  out += glow(k, hex(0x9a6263), 0.9, 0, 66, 52, 13, 8, -35)
  out += angularCrescent(
    k,
    [
      [hex(0x0a66c0, 0), 0],
      [hex(0x1f7fe0, 0.8), 0.1],
      [hex(0x7cc0ff), 0.22],
      [hex(0x2e86ea, 0.85), 0.34],
      [hex(0x0a66c0, 0), 0.45],
      [hex(0x0a66c0, 0), 1],
    ],
    crescentPath(50, 50, 48, -0.05, -0.045, 0.72),
    50,
    50,
    24,
    -40,
    320,
  )
  out += angularCrescent(
    k,
    [
      [white(0), 0.05],
      [hex(0xe8f4ff), 0.2],
      [white(0), 0.36],
    ],
    crescentPath(50, 50, 42, -0.07, -0.06, 0.8),
    50,
    50,
    21,
    -40,
    320,
  )
  // The highlight upper-left. The hot core stays small: on the real icon it
  // is a specular point in a wide haze, not a white blob.
  out += glow(k, hex(0x6f9bf2), 0.95, 0.2, 45, 36, 44, 26, -40)
  out += glow(k, hex(0xa06a62), 0.85, 0, 33.5, 46.5, 18, 8, -15)
  out += glow(k, hex(0xeef5ff), 1, 0.3, 42.5, 40, 21, 21)
  out += circle(42.5, 40, 4.6, '#fff')
  return out
}

/** iOS 27: a darker bezel; a highlight at the top, a blue crescent at the bottom. */
function lensGlass27(k: Kit): string {
  const bezel = circle(50, 50, 83, down(k, [hex(0x7c7c7c), hex(0x575757)], 8.5, 91.5)) + ring(50, 50, 83, 0.6, hex(0xa2a2a2, 0.7))
  let out = `<g filter="${shadow(k, black(0.25), 1.5, 0, 1.2)}">${bezel}</g>`
  out += circle(50, 50, 73, rad(k, [hex(0x10101a), hex(0x1a1a28), hex(0x24233b)], 50, 50, 36.5, 5))
  out += ring(50, 50, 60, 0.7, hex(0x34344c))
  out += angularCrescent(
    k,
    [
      [hex(0x6a78b2, 0), 0.08],
      [hex(0x7f8dc4, 0.85), 0.16],
      [hex(0xc4d7fa), 0.25],
      [hex(0x7f8dc4, 0.85), 0.34],
      [hex(0x6a78b2, 0), 0.42],
    ],
    crescentPath(50, 50, 47, 0, -0.07, 0.74),
    50,
    50,
    23.5,
  )
  out += angularCrescent(
    k,
    [
      [white(0), 0.15],
      [hex(0xeef7ff), 0.25],
      [white(0), 0.35],
    ],
    crescentPath(50, 50, 41, 0, -0.09, 0.8),
    50,
    50,
    20.5,
  )
  // Top highlight: a blue haze, warm fringes either side, a white core.
  out += glow(k, hex(0x9db4f5), 0.95, 0.2, 50, 34, 46, 29)
  out += glow(k, hex(0x946a6c), 0.8, 0, 37.5, 36, 15, 8)
  out += glow(k, hex(0x946a6c), 0.8, 0, 62.5, 36, 15, 8)
  out += glow(k, hex(0xf4fbff), 1, 0.3, 50, 33, 20, 16)
  out += ellipse(50, 33, 5.5, 4.4, '#fff')
  return out
}

interface CameraBody {
  x0: number
  x1: number
  y0: number
  y1: number
  corner: number
  humpTop: number
  humpTopX0: number
  humpTopX1: number
  humpBaseX0: number
  humpBaseX1: number
  curvedHump: boolean
  ring: [number, number]
  ringOuter: number
  ringInner: number
}

/** MediaCameraShape: the body with a pentaprism hump and a ring cut out
 *  for the lens. Fill it evenodd. */
function cameraPath(b: CameraBody): string {
  const s = 100
  const [x0, x1, y0, y1] = [b.x0 * s, b.x1 * s, b.y0 * s, b.y1 * s]
  const r = b.corner * s
  const ht = b.humpTop * s
  const [ht0, ht1, hb0, hb1] = [b.humpTopX0 * s, b.humpTopX1 * s, b.humpBaseX0 * s, b.humpBaseX1 * s]
  const pen = new Pen().move(x0 + r, y1).line(x1 - r, y1).arcTo(x1, y1, x1, y0, r).arcTo(x1, y0, hb1, y0, r).line(hb1, y0)
  if (b.curvedHump) {
    const w = hb1 - ht1
    pen.curve(hb1 - w * 0.6, y0, ht1 + w * 0.4, ht, ht1, ht).line(ht0, ht).curve(ht0 - w * 0.4, ht, hb0 + w * 0.6, y0, hb0, y0)
  } else {
    const hr = s * 0.02
    pen.arcTo(ht1, ht, ht0, ht, hr).arcTo(ht0, ht, hb0, y0, hr).line(hb0, y0)
  }
  pen.arcTo(x0, y0, x0, y1, r).arcTo(x0, y1, x1, y1, r)
  const cx = b.ring[0] * s
  const cy = b.ring[1] * s
  return `${pen.close()} ${ellipsePath(cx, cy, b.ringOuter * s * 2, b.ringOuter * s * 2)} ${ellipsePath(cx, cy, b.ringInner * s * 2, b.ringInner * s * 2)}`
}

type CameraGeneration = 'ios7' | 'ios11' | 'ios15' | 'ios18'

/** iOS 7 - iOS 18: the camera glyph in its four generations. */
function cameraArt(k: Kit, generation: CameraGeneration): string {
  const eo = 'fill-rule="evenodd"'
  switch (generation) {
    case 'ios7': {
      const body = cameraPath({
        x0: 0.15, x1: 0.85, y0: 0.275, y1: 0.758, corner: 0.03,
        humpTop: 0.192, humpTopX0: 0.383, humpTopX1: 0.617, humpBaseX0: 0.333, humpBaseX1: 0.667,
        curvedHump: false, ring: [0.5, 0.517], ringOuter: 0.15, ringInner: 0.125,
      })
      return (
        path(body, down(k, [hex(0x4a4a4a), hex(0x323232), hex(0x2b2b2b)], 0, 100), eo) +
        // The two light lines that made the body look concave.
        rect(50, 32.9, 70, 0.9, hex(0xb5b7bb)) +
        rect(50, 70.4, 70, 0.9, hex(0xa3a6aa)) +
        `<rect x="${f(24.6 - 2.9)}" y="${f(26.1 - 1.1)}" width="5.8" height="2.2" rx="0.6" fill="${hex(0x3a3a3a)}"/>` +
        circle(65.8, 38.8, 3.2, hex(0xe3bb46))
      )
    }
    case 'ios11': {
      const body = cameraPath({
        x0: 0.133, x1: 0.867, y0: 0.3, y1: 0.756, corner: 0.045,
        humpTop: 0.217, humpTopX0: 0.378, humpTopX1: 0.622, humpBaseX0: 0.328, humpBaseX1: 0.667,
        curvedHump: true, ring: [0.5, 0.5225], ringOuter: 0.156, ringInner: 0.133,
      })
      return (
        path(body, hex(0x2f2f2f), eo) +
        `<rect x="${f(25.3 - 3.6)}" y="${f(26.65 - 1.65)}" width="7.2" height="3.3" rx="0.8" fill="${hex(0x2f2f2f)}"/>` +
        circle(68.3, 37.8, 4.4, hex(0xffcc00))
      )
    }
    case 'ios15': {
      const body = cameraPath({
        x0: 0.1335, x1: 0.8667, y0: 0.278, y1: 0.772, corner: 0.09,
        humpTop: 0.2055, humpTopX0: 0.439, humpTopX1: 0.562, humpBaseX0: 0.335, humpBaseX1: 0.665,
        curvedHump: true, ring: [0.5, 0.522], ringOuter: 0.1667, ringInner: 0.1322,
      })
      return path(body, hex(0x2d2d2e), eo) + circle(71.6, 38.9, 5.54, hex(0xfecc00))
    }
    case 'ios18': {
      const body = cameraPath({
        x0: 0.136, x1: 0.865, y0: 0.28, y1: 0.773, corner: 0.09,
        humpTop: 0.207, humpTopX0: 0.44, humpTopX1: 0.563, humpBaseX0: 0.335, humpBaseX1: 0.665,
        curvedHump: true, ring: [0.5, 0.522], ringOuter: 0.1646, ringInner: 0.1276,
      })
      return path(body, hex(0x2d2d2e), eo) + circle(73.5, 38.9, 6.52, hex(0xffcc00))
    }
  }
}

// ---------------------------------------------------------------- Maps

/** MediaShieldArt: the "280" shield in a w x h frame centred at (cx, cy).
 *  A `border` shield, and inside it (inset `borderWidth` of the tile) the
 *  body gradient with the crown band and a border stripe across the top,
 *  clipped to the shield; "280" in bold white under the crown. */
function shieldArt(
  k: Kit,
  o: {
    crown: string
    body: string
    bodyBottom?: string
    border?: string
    borderWidth?: number
    crownHeight?: number
    shadow?: [number, number]
  },
  cx: number,
  cy: number,
  w: number,
  h: number,
): string {
  const border = o.border ?? '#fff'
  const crownHeight = o.crownHeight ?? 0.3
  const pad = 100 * (o.borderWidth ?? 0.012)
  const x0 = cx - w / 2
  const y0 = cy - h / 2
  const ix = x0 + pad
  const iy = y0 + pad
  const iw = w - pad * 2
  const ih = h - pad * 2
  const bodyFill = o.bodyBottom ? down(k, [o.body, o.bodyBottom], iy, iy + ih) : o.body
  const crown = h * crownHeight
  const stripe = h * 0.035
  const inner =
    rect(cx, iy + ih / 2, iw, ih, bodyFill) + rect(cx, iy + crown / 2, iw, crown, o.crown) + rect(cx, iy + crown + stripe / 2, iw, stripe, border)
  const size = h * 0.4
  const top = y0 + h * (crownHeight + 0.06)
  const out =
    path(shieldPath(x0, y0, w, h), border) +
    `<g clip-path="${clip(k, `<path d="${shieldPath(ix, iy, iw, ih)}"/>`)}">${inner}</g>` +
    text('280', cx, top + (size * lineHeightSF) / 2, size, { weight: weight.bold, fill: '#fff', letterSpacing: f(-h * 0.01) })
  return o.shadow ? `<g filter="${shadow(k, black(0.3), o.shadow[0], 0, o.shadow[1])}">${out}</g>` : out
}

/** Stroke markup for an open path. */
const stroke = (d: string, ink: string, width: number, extra = '') =>
  `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${f(width)}" ${extra}/>`
const roundStroke = 'stroke-linecap="round" stroke-linejoin="round"'

/** iPhone OS 1 - iOS 5: beige Cupertino, the Infinite Loop, an orange 280, a pushpin. */
function mapGoogleArt(k: Kit): string {
  const streets =
    rrectPath(37 + 13.5, 43 + 21.5, 27, 43, 13, true) +
    ' M80,42 L80,102 M64,86 L102,86 M80,55 L102,55 M-2,60 C10,70 22,58 37,66 M10,-2 L10,22 M50,-2 L50,22 M50,86 L50,102'
  let out = stroke(streets, hex(0xb3ae9e), 5, roundStroke) + stroke(streets, '#fff', 3, roundStroke)
  // The orange interstate, with white casing.
  out += rect(50, 31.75, 100, 20, '#fff')
  out += rect(50, 31.75, 100, 16.5, down(k, [hex(0xf2a00e), hex(0xfdb928)], 23.5, 40))
  // De Anza: the yellow road running top to bottom.
  out += rect(24.5, 50, 13.5, 100, '#fff')
  out += rect(24.5, 50, 11, 100, down(k, [hex(0xf2e83c), hex(0xdeda49)], 0, 100))
  out += shieldArt(k, { crown: hex(0xe8101c), body: hex(0x0b3ce8), bodyBottom: hex(0x0a2a9e), crownHeight: 0.3, shadow: [1, 1] }, 65.5, 27, 47, 36)
  // The pushpin.
  out += ellipse(36, 71, 20, 5, black(0.35), `filter="${blur(k, 0.8)}"`)
  out += path(capsulePath(24.5, 73.5, 2.4, 17), across(k, [hex(0xf5f3ef), hex(0x868378)], 23.3, 25.7))
  out += ellipse(24.5, 82.2, 4, 1.8, hex(0x2a2a2a))
  out += circle(
    24.5,
    57.5,
    15.6,
    rad(k, [hex(0xffd6db), hex(0xe8464c), hex(0xcc2b32), hex(0xa41d22)], 24.5 - 7.8 + 0.35 * 15.6, 57.5 - 7.8 + 0.3 * 15.6, 8.5),
    `filter="${shadow(k, black(0.35), 1, 0, 1)}"`,
  )
  return out
}

/** iOS 6: Apple's map, a yellow 280 and the blue route that turned left off it. */
function mapIOS6Art(k: Kit): string {
  const streets =
    rrectPath(43 + 12.5, 50 + 21, 25, 42, 12, true) +
    ' M82,40 L82,102 M68,88 L102,88 M82,58 L102,58 M29,62 L43,62 M12,-2 L12,20 M55,-2 L55,20 M55,92 L55,102'
  let out = stroke(streets, hex(0xc9c2ac), 4.5, roundStroke) + stroke(streets, hex(0xfffef8), 2.8, roundStroke)
  // The highway: gold edges round a yellow core.
  out += rect(50, 28.75, 100, 17.5, hex(0xeeb400))
  out += rect(50, 28.75, 100, 10.5, hex(0xfad800))
  // The white north-south road.
  out += rect(24, 50, 12, 100, hex(0xe8e2cc))
  out += rect(24, 50, 10, 100, hex(0xfffffd))
  // The route: in from the left along the overpass, then down to the puck.
  const route = 'M-2,28.75 L19,28.75 Q25.75,28.75 25.75,36 L25.75,66'
  out += stroke(route, hex(0x379acd), 7.8, roundStroke)
  out += stroke(route, down(k, [hex(0x22b2f6), hex(0x1fbaff)], 0, 100), 6.2, roundStroke)
  out += shieldArt(
    k,
    { crown: hex(0xc8101e), body: hex(0x1256ec), bodyBottom: hex(0x0a30b8), border: hex(0xf4f4f4), borderWidth: 0.02, crownHeight: 0.22, shadow: [1.2, 1.2] },
    66,
    26.5,
    49,
    38,
  )
  // The puck.
  out += circle(25.5, 75, 21, down(k, ['#fff', hex(0xccd8df)], 64.5, 85.5), `filter="${shadow(k, black(0.35), 1.5, 0, 1.2)}"`)
  out += circle(25.5, 75, 17, rad(k, [hex(0x49a6f9), hex(0x2f80e8)], 25.5, 75, 8.5))
  out += path(arrowPath(25.5, 74.25, 10, 11.5), '#fff')
  // trim(0.5...1).fill: the top half-disc.
  out += path(`M17.5,75 A8,8 0 0 1 33.5,75 Z`, white(0.35))
  return out
}

/** iOS 7 - iOS 10: flat blocks of park and paper, a corrected route, the shield bottom-left. */
function mapIOS7Art(k: Kit): string {
  let out =
    rect(34.5, 7.75, 69, 15.5, hex(0x76c63c)) +
    rect(92.25, 6.75, 15.5, 13.5, hex(0xfbc7d1)) +
    rect(42.25, 25, 84.5, 19, '#fff') +
    rect(77.25, 50, 14.5, 100, '#fff') +
    rect(92.25, 62.5, 15.5, 7, '#fff')
  // The yellow highway sweeping from the left edge out through the bottom.
  const highway = 'M-5,56 C30,56 45,74 60,105'
  out += stroke(highway, hex(0xecbf3d), 11.5) + stroke(highway, hex(0xffdf01), 9)
  out += rect(93, 97, 12, 9, hex(0xffdf01), rot(-40, 93, 97))
  // The route.
  out += stroke('M-2,23.25 L76.75,23.25 L76.75,60', hex(0x419cff), 7.5, 'stroke-linejoin="round"')
  out += shieldArt(k, { crown: hex(0xdb1d22), body: hex(0x007aff), borderWidth: 0.014, crownHeight: 0.17 }, 34.5, 54.5, 40, 32)
  out += circle(76.5, 68.5, 20, '#fff')
  out += circle(76.5, 68.5, 18.4, hex(0x007aff))
  out += path(arrowPath(76.5, 68, 6.8, 11), '#fff')
  return out
}

/** iOS 11 - iOS 14: Apple Park at the top-right, I-280 crossing diagonally.
 *  This ZStack holds a rectangle two edges wide and Apple Park rings 1.112
 *  edges across, so the ZStack is 200 x 111.2, centred on the tile, and
 *  SwiftUI lays its flexible children (the two MediaPolygons) out at that
 *  size: their unit points map into (-50, -5.6, 200, 111.2). So the green
 *  block reaches the top-left corner and the pink block lies wholly off the
 *  tile, as the iOS captures show. */
function mapParkArt(k: Kit): string {
  // The highway's upper edge: y = 0.136 + 0.70 (x - 0.019); it is 0.295 tall.
  const upper = (x: number) => 0.136 + 0.7 * (x - 0.019)
  const Q = (ux: number, uy: number): [number, number] => [-50 + 200 * ux, -5.6 + 111.2 * uy]
  let out =
    path(polygon([Q(0.25, -0.02), Q(1.02, -0.02), Q(1.02, upper(1.02)), Q(0.25, upper(0.25))]), hex(0x9de07b)) +
    path(polygon([Q(-0.02, upper(-0.02) + 0.295), Q(0.25, upper(0.25) + 0.295), Q(0.25, 1.02), Q(-0.02, 1.02)]), hex(0xffb2c2))
  // Apple Park: a cream ring round the top-right corner.
  out += ring(100, 0, 111.2, 24.1, hex(0x8ac66c))
  out += ring(100, 0, 108, 20.9, hex(0xf3f0e9))
  // I-280.
  out += rect(50.65, 62, 200, 24.2, hex(0xfcab1a), rot(35, 50.65, 62))
  out += rect(50.65, 62, 200, 20.9, hex(0xffd634), rot(35, 50.65, 62))
  // Wolfe Road and the route on it.
  out += rect(25, 50, 24.2, 100, hex(0xcbc8c1))
  out += rect(25, 50, 20.9, 100, '#fff')
  out += rect(25, 27, 12.5, 56, hex(0x3394e3))
  out += circle(25, 59.4, 35.4, hex(0x0078d9), `filter="${shadow(k, black(0.12), 0.8, 0, 1.5)}"`)
  out += path(arrowPath(25, 58.3, 15.8, 21.6), '#fff')
  out += shieldArt(k, { crown: hex(0xdf1d25), body: hex(0x0078d9), borderWidth: 0.015, crownHeight: 0.18 }, 75, 78.7, 38.8, 31.4)
  return out
}

type MapLook = 'ios15' | 'ios26' | 'ios27'

/** iOS 15 onward: Apple Park and I-280 as coloured blocks round a big marker. */
function mapModernArt(k: Kit, look: MapLook): string {
  // The diagonal road: upper edge y = 0.105 + 0.66 x, lower edge y = 0.39 + 0.655 x.
  const upper = (x: number): [number, number] => [x * 100, (0.105 + 0.66 * x) * 100]
  const lower = (x: number): [number, number] => [x * 100, (0.39 + 0.655 * x) * 100]
  const pick = <T,>(a: T, b: T, c: T) => (look === 'ios15' ? a : look === 'ios26' ? b : c)
  const green = pick(hex(0x7fee7e), hex(0x40dc5a), hex(0x40dc5a))
  const greenLow = pick(hex(0x43d761), hex(0x46db5f), hex(0x46db5f))
  const pink = pick(hex(0xed99d2), hex(0xfe88ce), hex(0xe774af))
  const yellow = pick(hex(0xfbc701), hex(0xfdce14), hex(0xf2bb09))
  const routeTop = pick(hex(0x358ff9), hex(0x1294fe), hex(0x0084ff))
  const routeLow = pick(hex(0x0771eb), hex(0x0983fe), hex(0x0485ff))
  const markerR = pick(0.2555, 0.284, 0.29) * 100
  const discR = pick(0.211, 0.226, 0.215) * 100
  // The arrow, measured off each icon: iOS 26 draws it bigger inside its disc.
  const arrowW = pick(0.224, 0.239, 0.239) * 100
  const arrowH = pick(0.271, 0.29, 0.29) * 100
  const arrowRise = pick(0.016, 0.0175, 0.0175) * 100
  const [mx, my] = look === 'ios15' ? [37.8, 62.2] : [37.5, 61]
  const rim = look === 'ios15' ? 0 : 0.6

  // Blocks.
  let out =
    path(polygon([[-2, -2], [23.3, -2], upper(0.233), upper(-0.02)]), green) +
    path(polygon([[52.2, -2], [102, -2], upper(1.02), upper(0.522)]), lin(k, [green, greenLow], 0, 0, 100, 100)) +
    path(polygon([lower(-0.02), lower(0.233), [23.3, 102], [-2, 102]]), pink) +
    path(polygon([[52.8, 73.5], [52.8, 102], [94, 102]]), yellow)
  // Apple Park round the top-right corner.
  if (look === 'ios15') {
    out += ring(100, 0, 77.2, 17.5, hex(0xf2f1f6)) + ring(100, 0, 72.8, 13.1, hex(0xd2d1d6))
  } else if (look === 'ios26') {
    out += ring(100, 0, 66, 6, hex(0xbff4c8)) + ring(100, 0, 80, 4, hex(0xbff4c8, 0.55))
  } else {
    out += ring(100, 0, 80, 15, hex(0x9ae398))
    for (const d of [50, 62, 76]) out += ring(100, 0, d, 0.9, '#fff')
  }
  // The route down the vertical road.
  out += rect(37.75, 20, 21.1, 44, down(k, [routeTop, routeLow], -2, 42))
  // The marker.
  if (look === 'ios27') {
    const lens = circle(mx, my, markerR * 2, white(0.28)) + ring(mx, my, markerR * 2, 1.2, white(0.9))
    out += `<g filter="${shadow(k, black(0.18), 2, 0, 1.5)}">${lens}</g>`
  } else {
    out += circle(mx, my, markerR * 2, '#fff', `filter="${shadow(k, black(look === 'ios15' ? 0.15 : 0.22), 3, 0, 2)}"`)
  }
  const discInk = look === 'ios27' ? [hex(0x43a0fe), hex(0x0786fe)] : look === 'ios15' ? [hex(0x3f8fec), hex(0x0178ff)] : [hex(0x1193fe), hex(0x47a0fa)]
  let disc = circle(mx, my, discR * 2, down(k, discInk, my - discR, my + discR))
  if (rim > 0) disc += ring(mx, my, discR * 2, rim, white(0.5))
  out += look === 'ios27' ? `<g filter="${shadow(k, black(0.3), 1.5, 0, 1.5)}">${disc}</g>` : disc
  out += path(arrowPath(mx, my - arrowRise, arrowW, arrowH), look === 'ios26' ? hex(0xe9f5fe) : '#fff')
  return out
}

// ---------------------------------------------------------------- Weather

type WeatherLook = 'classic2007' | 'retina2010' | 'flat2013' | 'flat2017' | 'ios15' | 'ios26' | 'ios27'

/** Below the horizon (y 0.42 - 1.0): a deep royal-blue band at the horizon
 *  that shades to cyan only near the bottom. */
function lowerSky(k: Kit, colours: number[]): string {
  const at = [0, 0.14, 0.22, 0.4, 0.57, 0.74, 1]
  return rect(50, 71, 100, 58, down(k, colours.map((c, i): Stop => [hex(c), at[i]]), 42, 100))
}

/** The skeuomorphic sun: orange at the top shading to yellow at the rim,
 *  with a warm glow. */
function skeuoSun(k: Kit, cx: number, cy: number, r: number, colours: number[], glowR: number): string {
  const X = cx * 100
  const Y = cy * 100
  const R = r * 100
  return (
    circle(X, Y, glowR * 200, rad(k, [hex(0xffc84a, 0.7), hex(0xffd54a, 0)], X, Y, glowR * 100, R * 0.85)) +
    circle(X, Y, R * 2, down(k, colours.map((c) => hex(c)), Y - R, Y + R)) +
    ring(X, Y, R * 2, 0.8, hex(0xe0800f, 0.8))
  )
}

/** "73°" in bold white with a hard navy shadow below it. */
function temperature(y: number, size: number): string {
  const s = size * 100
  const cy = y * 100
  return (
    text('73°', 56, cy + 1.2, s, { weight: weight.bold, fill: hex(0x0a3c8c, 0.6) }) +
    text('73°', 56, cy, s, { weight: weight.bold, fill: '#fff' })
  )
}

function glassSun(k: Kit, cx: number, cy: number, r: number, top: number, bottom: number): string {
  const X = cx * 100
  const Y = cy * 100
  const R = r * 100
  const body =
    circle(X, Y, R * 2, down(k, [hex(top), hex(bottom)], Y - R, Y + R)) +
    ring(X, Y, R * 2, 1.2, lin(k, [white(0.7), white(0)], X - R, Y - R, X, Y + R)) +
    ring(X, Y, R * 2, 0.6, hex(0xe08a0e, 0.55))
  return `<g filter="${shadow(k, hex(0x0a3c8c, 0.25), 1.5, 0, 1.2)}">${body}</g>`
}

/** A white cloud with the tinted cloud drawn a hair smaller on top: the
 *  sliver of white round the edge is the glass rim. */
function glassCloud(k: Kit, cx: number, cy: number, w: number, fill: number[]): string {
  const X = cx * 100
  const Y = cy * 100
  const W = w * 100
  const H = W * 0.674
  const d = cloudPath(X, Y, W, H)
  return (
    path(d, white(0.95), `filter="${shadow(k, hex(0x08306e, 0.35), 2, 1, 2)}"`) +
    path(d, down(k, fill.map((c) => hex(c)), Y - H / 2, Y + H / 2), `transform="translate(${f(X)} ${f(Y)}) scale(0.978) translate(${f(-X)} ${f(-Y)})"`)
  )
}

/** The sun showing through the cloud where they overlap. */
function glowThroughCloud(k: Kit, cx: number, cy: number, r: number, cloudX: number, cloudY: number, cloudW: number, tint: number): string {
  const X = cx * 100
  const Y = cy * 100
  const R = r * 100
  const cp = clip(k, `<path d="${cloudPath(cloudX * 100, cloudY * 100, cloudW * 100, cloudW * 67.4)}"/>`)
  return circle(X, Y, R * 2, rad(k, [hex(tint), hex(tint, 0)], X, Y, R, R * 0.5), `clip-path="${cp}"`)
}

/** A sun, a cloud, and for the first six years a temperature. */
function weatherArt(k: Kit, look: WeatherLook): string {
  switch (look) {
    case 'classic2007':
      return (
        lowerSky(k, [0x0472f0, 0x0279f2, 0x027ff3, 0x0c96f6, 0x1eaff9, 0x35c6fa, 0x40d2fb]) +
        skeuoSun(k, 0.508, 0.44, 0.225, [0xffb066, 0xff961e, 0xffb41c, 0xffda10, 0xfff604], 0.285) +
        temperature(0.855, 0.235)
      )
    case 'retina2010':
      return (
        lowerSky(k, [0x2f7ee4, 0x3584e6, 0x3c8be7, 0x4e9fec, 0x64b6f2, 0x7dd1f8, 0x89ddfb]) +
        radialBars(40, 0.19, 0.31, 0.006, hex(0xfff3b0, 0.55), 50, 43) +
        skeuoSun(k, 0.5, 0.43, 0.195, [0xffe2c0, 0xffa43e, 0xffb82c, 0xffd81d, 0xfffa0b], 0.26) +
        temperature(0.86, 0.235)
      )
    case 'flat2013':
      return circle(31.2, 39.2, 34, hex(0xffd900)) + path(cloudPath(53.35, 52.5, 61.7, 41.6), white(0.85))
    case 'flat2017':
      return circle(30.8, 38.9, 32.8, hex(0xffd500)) + path(cloudPath(54.7, 52.5, 62.8, 42.3), white(0.85))
    case 'ios15':
      return (
        circle(67.4, 41.7, 35.9, down(k, [hex(0xf6c743), hex(0xfae54c)], 41.7 - 17.95, 41.7 + 17.95)) +
        path(cloudPath(46.4, 53.1, 63, 42.5), down(k, [hex(0xf9f9fe), hex(0xe4ecf9), hex(0xc8ddf3), hex(0x9cc9ef)], 53.1 - 21.25, 53.1 + 21.25)) +
        glowThroughCloud(k, 0.674, 0.417, 0.2, 0.464, 0.531, 0.63, 0xf5f0bf)
      )
    case 'ios26':
      return (
        glassSun(k, 0.695, 0.373, 0.185, 0xfddd62, 0xf1bf25) +
        glassCloud(k, 0.4535, 0.535, 0.653, [0xedf5fd, 0xc9def0, 0xa3c3e6, 0x7aa6d8]) +
        glowThroughCloud(k, 0.695, 0.373, 0.2, 0.4535, 0.535, 0.653, 0xfce9b5)
      )
    case 'ios27':
      return (
        glassSun(k, 0.695, 0.375, 0.185, 0xffc81a, 0xffa500) +
        glassCloud(k, 0.4535, 0.535, 0.653, [0xf0f6fe, 0xcfe3fc, 0xafcef6, 0x8fbcf1]) +
        glowThroughCloud(k, 0.695, 0.375, 0.2, 0.4535, 0.535, 0.653, 0xffe3a6)
      )
  }
}

// ---------------------------------------------------------------- Clock

type HandStyle = 'tapered' | 'bar' | 'roundBar' | 'stem'
type CapStyle = 'redDisc' | 'whiteDisc' | 'dot' | 'ring'

interface ClockSpec {
  face: number | null
  faceRadius: number
  faceCentreY: number
  faceRim: number | null
  numeralInk: number
  numeralWeight: number
  numeralSize: number
  numeralRadius: number
  numeralFamily: Family
  quartersOnly: boolean
  swiss: boolean
  indexInk: number
  tickInk: number
  handInk: number
  handStyle: HandStyle
  hourWidth: number
  hourLength: number
  minuteWidth: number
  minuteLength: number
  secondInk: number
  secondWidth: number
  secondLength: number
  secondTail: number
  cap: CapStyle
  hourAngle: number
  minuteAngle: number
  secondAngle: number
  handShadow: boolean
}

/** MediaClockSpec's defaults: iOS 7.0 - 7.1. */
const clockBase: ClockSpec = {
  face: 0xf1f1f1,
  faceRadius: 0.433,
  faceCentreY: 0.5,
  faceRim: null,
  numeralInk: 0x000000,
  numeralWeight: weight.light,
  numeralSize: 0.1,
  numeralRadius: 0.335,
  numeralFamily: 'sf',
  quartersOnly: false,
  swiss: false,
  indexInk: 0x3c3c3c,
  tickInk: 0xc7c7c7,
  handInk: 0x000000,
  handStyle: 'bar',
  hourWidth: 0.019,
  hourLength: 0.18,
  minuteWidth: 0.019,
  minuteLength: 0.28,
  secondInk: 0xdc3e1c,
  secondWidth: 0.008,
  secondLength: 0.39,
  secondTail: 0.05,
  cap: 'dot',
  hourAngle: 306,
  minuteAngle: 54,
  secondAngle: 180,
  handShadow: false,
}

// iPhone OS 1 - 3: static 10:15, tapered black hands, red seconds straight up.
const skeuo2007: ClockSpec = {
  ...clockBase,
  face: 0xf4f4f4, faceRadius: 0.41, faceCentreY: 0.46, faceRim: 0x2a2a2a,
  numeralInk: 0x1e1e1e, numeralWeight: weight.bold, numeralSize: 0.095, numeralRadius: 0.315,
  handStyle: 'tapered', hourWidth: 0.042, hourLength: 0.21, minuteWidth: 0.036, minuteLength: 0.33,
  secondInk: 0xec0000, secondWidth: 0.014, secondLength: 0.36, secondTail: 0.06,
  cap: 'redDisc', hourAngle: 307.5, minuteAngle: 90, secondAngle: 0, handShadow: true,
}
// iOS 4 - iOS 5: the Retina redraw. The face grows and rises, the numerals
// darken, and the red cap becomes a white disc ringed in black.
const skeuo2010: ClockSpec = {
  ...skeuo2007,
  faceRadius: 0.415, faceCentreY: 0.45, face: 0xf6f6f6,
  numeralInk: 0x222222, numeralRadius: 0.325,
  hourWidth: 0.05, hourLength: 0.2, hourAngle: 314,
  minuteWidth: 0.042, minuteLength: 0.33, minuteAngle: 86,
  secondInk: 0xe00000, secondWidth: 0.016, secondLength: 0.37, secondTail: 0.04,
  cap: 'whiteDisc',
}
// iOS 6: the same clock with the hands rounded into bars.
const skeuo2012: ClockSpec = {
  ...skeuo2010,
  handStyle: 'roundBar',
  hourWidth: 0.036, hourLength: 0.225, hourAngle: 315,
  minuteWidth: 0.032, minuteLength: 0.33, minuteAngle: 87,
}
const flat2013 = clockBase
// iOS 8.0 - 8.2: bolder, longer hands.
const flat2014: ClockSpec = { ...clockBase, hourWidth: 0.025, hourLength: 0.26, minuteWidth: 0.025, minuteLength: 0.38 }
// iOS 8.3 - iOS 9: thin again, longer; San Francisco.
const flat2015: ClockSpec = { ...clockBase, face: 0xf5f5f8, numeralWeight: weight.regular, hourLength: 0.26, minuteLength: 0.38 }
// iOS 10: orange seconds.
const flat2016: ClockSpec = {
  ...clockBase,
  face: 0xf5f5f8, faceRadius: 0.439, numeralWeight: weight.regular,
  hourWidth: 0.021, hourLength: 0.24, minuteWidth: 0.021, minuteLength: 0.39,
  secondInk: 0xff9500, secondWidth: 0.012, secondLength: 0.41, secondTail: 0.06, cap: 'ring',
}
// iOS 11 - iOS 13: rounded ends, hands reach the numerals.
const flat2017: ClockSpec = {
  ...clockBase,
  face: 0xf5f5f8, numeralInk: 0x1c1c1d, numeralWeight: weight.semibold, numeralSize: 0.115, numeralRadius: 0.35,
  handStyle: 'roundBar', hourWidth: 0.025, hourLength: 0.27, minuteWidth: 0.025, minuteLength: 0.4,
  secondInk: 0xff9500, secondWidth: 0.012, secondLength: 0.41, secondTail: 0.06, cap: 'ring',
}
// iOS 14 - iOS 17: bold hands on a thin stem, semibold numerals.
const flat2020: ClockSpec = { ...flat2017, handStyle: 'stem', hourWidth: 0.036, hourLength: 0.23, minuteWidth: 0.033, minuteLength: 0.39 }
// iOS 18: the same face; the second hand reads a deeper orange.
const flat2024: ClockSpec = { ...flat2020, secondInk: 0xff8000 }
// iOS 26: the Swiss railway dial filling the tile.
const swiss2025: ClockSpec = {
  ...clockBase,
  face: null, numeralInk: 0x3c3c3c, numeralWeight: weight.semibold, numeralSize: 0.14, numeralRadius: 0.275,
  numeralFamily: 'rounded', quartersOnly: true, swiss: true,
  handStyle: 'stem', hourWidth: 0.04, hourLength: 0.27, minuteWidth: 0.04, minuteLength: 0.4,
  secondInk: 0xff9501, secondWidth: 0.015, secondLength: 0.391, secondTail: 0.067, cap: 'ring',
}
// iOS 27: lighter indices, a shorter second hand.
const swiss2026: ClockSpec = {
  ...swiss2025,
  numeralInk: 0x50504f, indexInk: 0x50504f, tickInk: 0xc8c8c8,
  secondInk: 0xff8e00, secondLength: 0.355, secondTail: 0.1,
}

function clockArt(k: Kit, s: ClockSpec): string {
  const cy = s.faceCentreY * 100
  let out = ''
  if (s.face !== null) {
    out += circle(50, cy, s.faceRadius * 200, hex(s.face))
    if (s.faceRim !== null) out += ring(50, cy, s.faceRadius * 200, HAIR, hex(s.faceRim))
  }
  if (s.swiss) {
    // Hour indices run out to the tile's edge (inset 5%); minute ticks only
    // in the band between that inset and one of 12%.
    const outer = rrectPath(50, 50, 90, 90, 17, true)
    const inner = rrectPath(50, 50, 76, 76, 10, true)
    out += `<g clip-path="${clip(k, `<path d="${outer}"/>`)}">${radialBars(12, 0.35, 0.8, 0.0135, hex(s.indexInk))}</g>`
    out += `<g clip-path="${clip(k, `<path d="${outer} ${inner}" clip-rule="evenodd"/>`)}">${radialBars(60, 0.3, 0.8, 0.011, hex(s.tickInk), 50, 50, 100, 5)}</g>`
  }
  // Numerals.
  const hours = s.quartersOnly ? [12, 3, 6, 9] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const R = s.numeralRadius * 100
  for (const hour of hours) {
    const a = (hour / 12) * 2 * Math.PI
    out += text(String(hour), 50 + R * Math.sin(a), cy - R * Math.cos(a), s.numeralSize * 100, {
      fill: hex(s.numeralInk),
      weight: s.numeralWeight,
      family: s.numeralFamily,
    })
  }
  // Hands, turning about (50, cy). The skeuomorphic shadows come after the
  // rotation in SwiftUI, so they fall straight down: filters go on an
  // unrotated wrapper.
  const ink = hex(s.handInk)
  const handShadow = s.handShadow && (s.handStyle === 'tapered' || s.handStyle === 'roundBar') ? shadow(k, black(0.35), 0.8, 0, 1.2) : ''
  const shaded = (markup: string, filter: string) => (filter ? `<g filter="${filter}">${markup}</g>` : markup)
  const hand = (width: number, length: number, angle: number): string => {
    const W = width * 100
    const L = length * 100
    const turn = rot(angle, 50, cy)
    switch (s.handStyle) {
      case 'tapered': {
        // From `length` above the pivot to 3% below it; widest at 86%.
        const top = cy - L
        const H = L + 3
        const d = polygon([
          [50, top],
          [50 + W / 2, top + H * 0.86],
          [50, top + H],
          [50 - W / 2, top + H * 0.86],
        ])
        return shaded(path(d, ink, turn), handShadow)
      }
      case 'bar':
        return rect(50, cy - (L - 2) / 2, W, L + 2, ink, turn)
      case 'roundBar':
        return shaded(path(capsulePath(50, cy - (L - 3) / 2, W, L + 3), ink, turn), handShadow)
      case 'stem':
        return `<g ${turn}>${path(capsulePath(50, cy - 3.5, 1.9, 9), ink)}${path(capsulePath(50, cy - (L + 7) / 2, W, L - 7), ink)}</g>`
    }
  }
  out += hand(s.hourWidth, s.hourLength, s.hourAngle)
  out += hand(s.minuteWidth, s.minuteLength, s.minuteAngle)
  const SL = s.secondLength * 100
  const ST = s.secondTail * 100
  const second = path(capsulePath(50, cy - (SL - ST) / 2, s.secondWidth * 100, SL + ST), hex(s.secondInk), rot(s.secondAngle, 50, cy))
  out += shaded(second, s.handShadow ? shadow(k, black(0.3), 0.8, 0, 1) : '')
  switch (s.cap) {
    case 'redDisc':
      out += circle(50, cy, 6, rad(k, [hex(0xff7a7a), hex(0xc80000)], 50, cy, 3))
      break
    case 'whiteDisc':
      out += circle(50, cy, 6, '#fff') + ring(50, cy, 6, HAIR, '#000')
      break
    case 'dot':
      out += circle(50, cy, 2.4, hex(s.secondInk))
      break
    case 'ring':
      out += circle(50, cy, 4.4, hex(s.secondInk)) + circle(50, cy, 1.6, hex(0xededed))
      break
  }
  return out
}

// ---------------------------------------------------------------- roster

export const media: HomeAppDef[] = [
  {
    id: 'Photos',
    designs: [
      // iPhone OS 1 - iOS 6: the sunflower photograph on a hazy sky.
      design(2007, 0xb7d2f6, 0xbdd6ea, sunflowerArt),
      // iOS 7 - iOS 18: the eight-petal pinwheel, unchanged for eleven years.
      flat(2013, 0xffffff, (k) =>
        pinwheelArt(k, {
          glass: false, width: 0.265, inner: 0.02, outer: 0.445,
          petals: [0xfaaa31, 0xf6e422, 0xb9d753, 0x6cbeb0, 0x79addc, 0xa48dc1, 0xd388b1, 0xf37a5d],
        }),
      ),
      // iOS 26: eight separate glass petals, saturated, with a white gap at the centre.
      design(2025, 0xffffff, 0xececec, (k) =>
        pinwheelArt(k, {
          glass: true, width: 0.22, inner: 0.06, outer: 0.4,
          petals: [0xff8502, 0xfec200, 0x6fc000, 0x1fa96a, 0x3f8ced, 0x9a74e0, 0xf155c1, 0xff5561],
          tile: [0xffffff, 0xececec],
        }),
      ),
      // iOS 27: candy-bright petals: the blue turns cyan, the green mint, the violet lavender.
      design(2026, 0xffffff, 0xe8e9ea, (k) =>
        pinwheelArt(k, {
          glass: true, width: 0.225, inner: 0.05, outer: 0.405,
          petals: [0xff8d00, 0xfecc00, 0x8fd500, 0x00d582, 0x00abf3, 0x9f8ce1, 0xff6db2, 0xff5960],
          tile: [0xffffff, 0xe8e9ea],
        }),
      ),
    ],
  },
  {
    id: 'Camera',
    designs: [
      // iPhone OS 1 - iOS 6: a photoreal lens on brushed silver.
      design(2007, 0xf6f6f6, 0x7e8186, lensClassic),
      // iOS 7 - iOS 10: a dark camera body with two light lines and a shutter button.
      design(2013, 0xdbdbdd, 0x898c92, (k) => cameraArt(k, 'ios7')),
      // iOS 11 - iOS 14: lines gone, body flat, shutter button floats above.
      design(2017, 0xe4e3e8, 0x909094, (k) => cameraArt(k, 'ios11')),
      // iOS 15 - iOS 17: rounder body, shutter button removed.
      design(2021, 0xe5e5ea, 0x8e8d92, (k) => cameraArt(k, 'ios15')),
      // iOS 18: a thicker lens ring and a bigger yellow dot, further right.
      design(2024, 0xe5e5ea, 0x8e8d92, (k) => cameraArt(k, 'ios18')),
      // iOS 26: the lens returns, large, in Liquid Glass.
      design(2025, 0xd5d5d5, 0xa4a4a4, lensGlass26),
      // iOS 27: lighter tile, darker bezel, reflections on the vertical axis.
      design(2026, 0xdadada, 0xbebebe, lensGlass27),
    ],
  },
  {
    id: 'Maps',
    designs: [
      // iPhone OS 1 - iOS 5: Google-era tile of 1 Infinite Loop, I-280 shield, red pushpin.
      design(2007, 0xf2efe7, 0xd3cfc1, mapGoogleArt),
      // iOS 6: Apple's own map; the blue route that turned left off the overpass.
      design(2012, 0xf6f1e1, 0xdad3bc, mapIOS6Art),
      // iOS 7 - iOS 10: the flat map, route corrected, shield bottom-left.
      flat(2013, 0xe5ddc9, mapIOS7Art),
      // iOS 11 - iOS 14: Apple Park beside I-280.
      flat(2017, 0xe3e1da, mapParkArt),
      // iOS 15 - iOS 18: the big location marker; the shield is gone.
      flat(2021, 0xf2f1f6, (k) => mapModernArt(k, 'ios15')),
      // iOS 26: same map as raised glass blocks, frosted marker ring.
      design(2025, 0xf6f6f6, 0xf0f0f0, (k) => mapModernArt(k, 'ios26')),
      // iOS 27: the marker ring becomes a clear lens; Apple Park is three thin arcs.
      design(2026, 0xefefef, 0xe2e2e2, (k) => mapModernArt(k, 'ios27')),
    ],
  },
  {
    id: 'Weather',
    designs: [
      // iPhone OS 1 - 3: a sun over a hard blue horizon and a static 73°.
      design(2007, 0x0f72ee, 0x40d2fb, (k) => weatherArt(k, 'classic2007')),
      // iOS 4 - iOS 6: the Retina redraw, paler sky, a sun with forty rays.
      design(2010, 0x3584e6, 0x89ddfb, (k) => weatherArt(k, 'retina2010')),
      // iOS 7 - iOS 10: a flat sun behind a translucent cloud.
      design(2013, 0x1d68f0, 0x19cefc, (k) => weatherArt(k, 'flat2013')),
      // iOS 11 - iOS 14: slightly less cyan, cloud a touch bigger.
      design(2017, 0x1d76f2, 0x1ac2fa, (k) => weatherArt(k, 'flat2017')),
      // iOS 15 - iOS 18: sun moves to the right, sky darker at the top, cloud blue-white.
      design(2021, 0x0c53af, 0x33a0e9, (k) => weatherArt(k, 'ios15')),
      // iOS 26: gradient reversed again, cloud and sun in Liquid Glass.
      design(2025, 0x369ae6, 0x0d53ad, (k) => weatherArt(k, 'ios26')),
      // iOS 27 release: brighter blue, a warmer sun.
      design(2026, 0x349eff, 0x1b73da, (k) => weatherArt(k, 'ios27')),
    ],
  },
  {
    id: 'Clock',
    designs: [
      // iPhone OS 1 - 3: glossy black tile, white face, tapered hands at 10:15, red cap.
      design(2007, 0x4a4a4a, 0x000000, (k) => clockArt(k, skeuo2007)),
      // iOS 4 - iOS 5: the Retina redraw; bigger face, white cap ringed in black.
      design(2010, 0x525252, 0x000000, (k) => clockArt(k, skeuo2010)),
      // iOS 6: the same clock, hands rounded into bars.
      design(2012, 0x4a4a4a, 0x000000, (k) => clockArt(k, skeuo2012)),
      // iOS 7: flat on black; hairline hands, red-orange seconds.
      flat(2013, 0x000000, (k) => clockArt(k, flat2013)),
      // iOS 8.0: bolder, longer hands.
      flat(2014, 0x000000, (k) => clockArt(k, flat2014)),
      // iOS 8.3 - iOS 9: thin again, tile softens to dark grey, San Francisco numerals.
      flat(2015, 0x1e1e1f, (k) => clockArt(k, flat2015)),
      // iOS 10: the second hand turns orange.
      flat(2016, 0x1e1e1f, (k) => clockArt(k, flat2016)),
      // iOS 11 - iOS 13: rounded hand ends, hands reach the numerals.
      flat(2017, 0x202021, (k) => clockArt(k, flat2017)),
      // iOS 14 - iOS 17: bold hands with a thin stem, semibold numerals.
      flat(2020, 0x1c1c1e, (k) => clockArt(k, flat2020)),
      // iOS 18: a gradient behind the same face.
      design(2024, 0x303030, 0x151515, (k) => clockArt(k, flat2024)),
      // iOS 26: Swiss railway dial filling the tile, only 12 / 3 / 6 / 9.
      design(2025, 0xffffff, 0xebebeb, (k) => clockArt(k, swiss2025)),
      // iOS 27: the same dial, lighter indices, a shorter second hand.
      design(2026, 0xfefefe, 0xf6f6f6, (k) => clockArt(k, swiss2026)),
    ],
  },
]
