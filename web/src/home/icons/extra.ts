// Port of HomeIcons+Extra.swift: the rest of the stock apps. FaceTime and
// Podcasts, the utilities that lived in Apple's default folder (Tips, Watch,
// Find My, Find Friends, Magnifier, Fitness), the folder itself, and the two
// small widgets iOS 15 put at the top of the page (defined, not currently
// placed).
//
// Each app lists one design per redesign, starting at the timeline year the
// redesign shipped. Years, background stops and glyph geometry are the Swift
// values as they are; the Swift's unit-square fractions are x 100 here (the
// 100 x 100 tile box, origin top-left).
//
// PORTING NOTES
// - SwiftUI resolves a gradient style in the frame of the view it paints.
//   Many glyphs here are laid out edge x edge (the whole tile), so their
//   gradients run over the whole tile, not over the painted outline:
//   frameLinear() pins such a gradient in user space. The same goes for a
//   diagonal gradient on a non-square frame: SwiftUI's isolines are square
//   to the start-end line in user space, which frameLinear() also gives
//   (objectBoundingBox units would skew them).
// - `Circle().stroke` centres the line on the outline (circleStroke());
//   `strokeBorder` insets it (kit.ring()).
// - `Path(roundedRect:cornerRadius:)` defaults to `.continuous` (SwiftUI
//   27 SDK interface), so the FaceTime button and bar are continuous too.
// - `trim(from:to:)` runs clockwise from 3 o'clock by path length; ellipse
//   trims are found by arc length (ellipseTrim()).
// - Separate translucent parts (a filament's bar and stem, the magnifier's
//   plus) each carry their own alpha, so overlaps are denser, as in SwiftUI.
// - sun.max.fill (SF Symbols) is kit.symbol('sun.max.fill'), a Phosphor
//   stand-in.

import type { Art, HomeAppDef, Kit, Radii, Stop } from './kit'
import {
  angular,
  capsule,
  capsulePath,
  circle,
  design,
  ellipse,
  era,
  fade,
  flat,
  gradientStops,
  hex,
  lineHeightSF,
  linear,
  nothing,
  path,
  radial,
  ring,
  rrect,
  rrectPath,
  symbol,
  weight,
} from './kit'

// ---------------------------------------------------------------- helpers

const f = (v: number) => +v.toFixed(3)
const P = (x: number, y: number) => `${f(x)},${f(y)}`

const white = '#fff'
/** `.white.opacity(a)` */
const whiteA = (a: number): string => fade(white, a)

/** A linear gradient fixed in user space from (x1, y1) to (x2, y2): a
 *  SwiftUI gradient resolved in a frame other than the painted outline's
 *  bounds. */
function frameLinear(k: Kit, list: Array<Stop | string>, x1: number, y1: number, x2: number, y2: number): string {
  const id = k.id('xl')
  k.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${gradientStops(list)}</linearGradient>`,
  )
  return `url(#${id})`
}

/** Top to bottom over the whole tile (a style on a view framed edge x edge). */
const tileLinear = (k: Kit, list: Array<Stop | string>): string => frameLinear(k, list, 0, 0, 0, 100)

/** A stroked outline. CoreGraphics' miter limit is 10 (SVG's default is 4). */
function stroke(d: string, colour: string, width: number, extra = ''): string {
  return `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${f(width)}" stroke-miterlimit="10" ${extra}/>`
}

/** `Circle().stroke(colour, lineWidth: lw)` on a frame of diameter d: the
 *  line is centred on the circle. */
function circleStroke(cx: number, cy: number, d: number, lw: number, colour: string, extra = ''): string {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(d / 2)}" fill="none" stroke="${colour}" stroke-width="${f(lw)}" ${extra}/>`
}

/** An open circular arc, clockwise on screen from `a0` to `a1` degrees
 *  (0 = 3 o'clock), as `Circle().trim()` lays it out. */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number) => P(cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180))
  return `M${p(a0)} A${f(r)},${f(r)} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`
}

/** `Ellipse().trim(from:to:)` of a w x h ellipse centred at (cx, cy): the
 *  trim fractions are of the path's length, clockwise from 3 o'clock. */
function ellipseTrim(cx: number, cy: number, w: number, h: number, from: number, to: number): string {
  const a = w / 2
  const b = h / 2
  const N = 720
  const lengths = [0]
  for (let i = 1; i <= N; i++) {
    const t0 = ((i - 1) / N) * 2 * Math.PI
    const t1 = (i / N) * 2 * Math.PI
    lengths.push(lengths[i - 1] + Math.hypot(a * (Math.cos(t1) - Math.cos(t0)), b * (Math.sin(t1) - Math.sin(t0))))
  }
  const total = lengths[N]
  const angleAt = (frac: number): number => {
    const target = frac * total
    let i = 1
    while (i < N && lengths[i] < target) i++
    const span = lengths[i] - lengths[i - 1]
    const u = span > 0 ? (target - lengths[i - 1]) / span : 0
    return ((i - 1 + u) / N) * 2 * Math.PI
  }
  const t0 = angleAt(from)
  const t1 = angleAt(to)
  const p = (t: number) => P(cx + a * Math.cos(t), cy + b * Math.sin(t))
  return `M${p(t0)} A${f(a)},${f(b)} 0 ${t1 - t0 > Math.PI ? 1 : 0} 1 ${p(t1)}`
}

// ---------------------------------------------------------------- unit-square boxes

/** extraBox: a box in unit-square coordinates, from its corners. */
interface UBox {
  x0: number
  y0: number
  x1: number
  y1: number
}

const ubox = (x0: number, y0: number, x1: number, y1: number): UBox => ({ x0, y0, x1, y1 })

/** A unit box in the 100 box: centre and size. */
function inTile(b: UBox): { cx: number; cy: number; w: number; h: number } {
  return { cx: (b.x0 + b.x1) * 50, cy: (b.y0 + b.y1) * 50, w: (b.x1 - b.x0) * 100, h: (b.y1 - b.y0) * 100 }
}

/** extraRoundedPolygon: a closed polygon (unit-square points) with every
 *  corner rounded by CGPath's addArc(tangent1End:tangent2End:radius:),
 *  starting halfway along the closing edge. `radius` is a fraction of the
 *  tile edge. */
function roundedPolygon(points: Array<[number, number]>, radius: number): string {
  if (points.length < 3) return ''
  const pts = points.map(([x, y]): [number, number] => [x * 100, y * 100])
  const r = radius * 100
  const last = pts[pts.length - 1]
  let cur: [number, number] = [(last[0] + pts[0][0]) / 2, (last[1] + pts[0][1]) / 2]
  let d = `M${P(cur[0], cur[1])}`
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i]
    const p2 = pts[(i + 1) % pts.length]
    const ux = cur[0] - p1[0]
    const uy = cur[1] - p1[1]
    const vx = p2[0] - p1[0]
    const vy = p2[1] - p1[1]
    const lu = Math.hypot(ux, uy)
    const lv = Math.hypot(vx, vy)
    const cross = (p1[0] - cur[0]) * vy - (p1[1] - cur[1]) * vx
    if (lu < 1e-9 || lv < 1e-9 || Math.abs(cross) < 1e-9 || r <= 0) {
      d += ` L${P(p1[0], p1[1])}`
      cur = p1
      continue
    }
    const cos = (ux * vx + uy * vy) / (lu * lv)
    const theta = Math.acos(Math.max(-1, Math.min(1, cos)))
    const t = r / Math.tan(theta / 2)
    const s: [number, number] = [p1[0] + (ux / lu) * t, p1[1] + (uy / lu) * t]
    const e: [number, number] = [p1[0] + (vx / lv) * t, p1[1] + (vy / lv) * t]
    d += ` L${P(s[0], s[1])} A${f(r)},${f(r)} 0 0 ${cross > 0 ? 1 : 0} ${P(e[0], e[1])}`
    cur = e
  }
  return d + ' Z'
}

/** ExtraTaper: a bar `topHalf` wide at y0, `bottomHalf` wide at y1, its
 *  corners rounded. */
function taperPath(y0: number, y1: number, topHalf: number, bottomHalf: number, radius: number): string {
  return roundedPolygon(
    [
      [0.5 - topHalf, y0],
      [0.5 + topHalf, y0],
      [0.5 + bottomHalf, y1],
      [0.5 - bottomHalf, y1],
    ],
    radius,
  )
}

/** ExtraGlassGlyph: a Liquid Glass glyph. A frosted fill (top to bottom over
 *  the tile) over a shade dropped 0.02, with a bright rim (white to clear,
 *  top to centre) 0.012 wide. */
function glassGlyph(k: Kit, d: string, top: string, bottom: string, shade: string): string {
  return (
    path(d, shade, 'transform="translate(0 2)"') +
    path(d, tileLinear(k, [top, bottom])) +
    stroke(d, frameLinear(k, [white, whiteA(0)], 0, 0, 0, 50), 1.2)
  )
}

/** ExtraLook */
type Look = { glass: false } | { glass: true; top: string; bottom: string; shade: string }
const flatLook: Look = { glass: false }

// ---------------------------------------------------------------- FaceTime

/** ExtraCameraShape: a rounded body, a lens hood, and (iOS 7-11) a small
 *  button left of the body and a flat bar right of the hood. */
interface CameraSpec {
  box: UBox
  boxRadius: number
  /** Hood: its narrow edge at x0 (half-height `inner`), wide at x1. */
  hood: { x0: number; x1: number; inner: number; outer: number; radius: number }
  centreY: number
  button?: UBox
  bar?: UBox
}

const camera: Record<'ios7' | 'ios11' | 'ios12' | 'ios18' | 'ios26', CameraSpec> = {
  /** iOS 7.0-10: button, body, hood and bar. */
  ios7: {
    box: ubox(0.152, 0.285, 0.648, 0.703),
    boxRadius: 0.055,
    hood: { x0: 0.668, x1: 0.824, inner: 0.063, outer: 0.162, radius: 0.008 },
    centreY: 0.494,
    button: ubox(0.117, 0.383, 0.141, 0.438),
    bar: ubox(0.844, 0.338, 0.867, 0.65),
  },
  /** iOS 11: the same parts pulled slightly apart. */
  ios11: {
    box: ubox(0.152, 0.285, 0.648, 0.703),
    boxRadius: 0.055,
    hood: { x0: 0.676, x1: 0.824, inner: 0.065, outer: 0.16, radius: 0.008 },
    centreY: 0.494,
    button: ubox(0.109, 0.383, 0.133, 0.438),
    bar: ubox(0.852, 0.338, 0.875, 0.65),
  },
  /** iOS 12-17: no button, the hood filled into a solid trapezoid. */
  ios12: {
    box: ubox(0.152, 0.285, 0.637, 0.715),
    boxRadius: 0.075,
    hood: { x0: 0.66, x1: 0.848, inner: 0.086, outer: 0.227, radius: 0.035 },
    centreY: 0.5,
  },
  /** iOS 18: a wider gap between body and hood. */
  ios18: {
    box: ubox(0.164, 0.279, 0.633, 0.721),
    boxRadius: 0.08,
    hood: { x0: 0.676, x1: 0.836, inner: 0.086, outer: 0.218, radius: 0.04 },
    centreY: 0.5,
  },
  /** iOS 26-27: a taller body and a slim wedge of a hood all but touching
   *  it. Fitted to Apple's icon, whose hood is half 0.092 high at x 0.67
   *  and 0.204 at x 0.80 (the old blunt trapezoid was 0.076 and 0.173). */
  ios26: {
    box: ubox(0.148, 0.258, 0.652, 0.738),
    boxRadius: 0.085,
    hood: { x0: 0.66, x1: 0.86, inner: 0.085, outer: 0.25, radius: 0.04 },
    centreY: 0.5,
  },
}

function cameraPath(c: CameraSpec): string {
  const b = inTile(c.box)
  const { x0, x1, inner, outer, radius } = c.hood
  let d = rrectPath(b.cx, b.cy, b.w, b.h, c.boxRadius * 100, true)
  d +=
    ' ' +
    roundedPolygon(
      [
        [x0, c.centreY - inner],
        [x1, c.centreY - outer],
        [x1, c.centreY + outer],
        [x0, c.centreY + inner],
      ],
      radius,
    )
  if (c.button) {
    const t = inTile(c.button)
    d += ' ' + rrectPath(t.cx, t.cy, t.w, t.h, t.w * 0.35, true)
  }
  if (c.bar) {
    const t = inTile(c.bar)
    d += ' ' + rrectPath(t.cx, t.cy, t.w, t.h, t.w * 0.3, true)
  }
  return d
}

/** ExtraCameraArt */
function cameraArt(c: CameraSpec, look: Look = flatLook): Art {
  return (k) => {
    const d = cameraPath(c)
    return look.glass ? glassGlyph(k, d, look.top, look.bottom, look.shade) : path(d, white)
  }
}

// ---------------------------------------------------------------- Podcasts

type PodcastsLook = 'ios7' | 'ios9' | 'ios18' | 'ios26' | 'ios27'

/** A ring of `radius`, `width` wide, opened `gap` degrees either side of 6
 *  o'clock: `Circle().trim(gap/360 ... 1 - gap/360).stroke(butt)` turned 90
 *  degrees. The style turns with it, so the iOS 7 fade (top to bottom
 *  before the turn) runs right to left. */
function podcastRing(k: Kit, radius: number, width: number, gap: number, centreY: number, style: 'fade' | string): string {
  const cy = centreY * 100
  const r = radius * 100
  const paint = style === 'fade' ? frameLinear(k, [whiteA(0.5), whiteA(0.3), whiteA(0.02)], 50, cy - r, 50, cy + r) : style
  const body = gap > 0 ? stroke(arcPath(50, cy, r, gap, 360 - gap), paint, width * 100) : circleStroke(50, cy, r * 2, width * 100, paint)
  return `<g transform="rotate(90 50 ${f(cy)})">${body}</g>`
}

const podcastHead = (y: number, diameter: number, fill: string): string => circle(50, y * 100, diameter * 100, fill)

/** A glass disc: a translucent fill and a white rim fading downwards,
 *  centred 0.461 down. */
function podcastDisc(k: Kit, diameter: number, fill: string): string {
  const d = diameter * 100
  const cy = 46.1
  return circle(50, cy, d, fill) + ring(50, cy, d, 0.8, frameLinear(k, [whiteA(0.55), whiteA(0.04)], 50, cy - d / 2, 50, cy + d / 2))
}

/** ExtraPodcastsArt */
function podcastsArt(look: PodcastsLook): Art {
  return (k) => {
    switch (look) {
      case 'ios7':
        // Two whole rings in translucent white, fading out (see podcastRing).
        return (
          podcastRing(k, 0.315, 0.055, 0, 0.44, 'fade') +
          podcastRing(k, 0.184, 0.055, 0, 0.44, 'fade') +
          podcastHead(0.426, 0.164, white) +
          path(taperPath(0.547, 0.883, 0.068, 0.055, 0.05), tileLinear(k, [white, hex(0xf3e6f7)]))
        )
      case 'ios9':
      case 'ios18': {
        // Solid white rings, cut open at the bottom where the body stands.
        const refined = look === 'ios18'
        const w = refined ? 0.044 : 0.042
        return (
          podcastRing(k, 0.329, w, 20, 0.458, white) +
          podcastRing(k, 0.212, w, 36, 0.458, white) +
          podcastHead(0.433, 0.167, white) +
          path(
            taperPath(0.55, refined ? 0.878 : 0.883, refined ? 0.09 : 0.088, refined ? 0.056 : 0.054, refined ? 0.056 : 0.06),
            white,
          )
        )
      }
      case 'ios26':
      case 'ios27': {
        // The rings become two nested glass discs.
        const deep = look === 'ios27'
        return (
          podcastDisc(k, deep ? 0.718 : 0.726, deep ? hex(0xa55cd8, 0.55) : hex(0xc68de5, 0.42)) +
          podcastDisc(k, 0.454, deep ? hex(0xc9a3e6, 0.72) : hex(0xd6aeec, 0.5)) +
          podcastHead(0.447, 0.172, deep ? hex(0xf4e8fd) : hex(0xfbf7fe)) +
          glassGlyph(
            k,
            taperPath(0.562, 0.865, 0.095, 0.066, 0.062),
            deep ? hex(0xf4e8fd) : hex(0xfcf9ff),
            deep ? hex(0xdcc6ee, 0.8) : hex(0xe4d7ee, 0.78),
            hex(0x4a1b78, 0.35),
          )
        )
      }
    }
  }
}

// ---------------------------------------------------------------- Fitness

type RingsLook = 'ios8' | 'ios18' | 'ios26' | 'ios27'

/** (start, end) per ring, outer to inner. */
const ringColours: Record<RingsLook, Array<[number, number]>> = {
  ios8: [
    [0xff2618, 0xff2890],
    [0x93f900, 0xd8ff00],
    [0x00dff7, 0x00ffa9],
  ],
  ios18: [
    [0xff2616, 0xff2990],
    [0x96fc00, 0xd5ff00],
    [0x00dbf7, 0x00ffa8],
  ],
  ios26: [
    [0xff0010, 0xff0096],
    [0x7bff00, 0xccff00],
    [0x00f0fa, 0x00ffa4],
  ],
  ios27: [
    [0xea3534, 0xea3390],
    [0xa3fc4e, 0xd2fd50],
    [0x6eedf0, 0x75fca8],
  ],
}

/** ExtraActivityRings: three Activity rings, each a closed loop whose
 *  rounded end laps its start at twelve o'clock, shading from its start
 *  colour to its end colour (an angular gradient from 12 o'clock, the end
 *  colour reached at 72%). Glass rings sit in a dark groove and carry a
 *  pale sheen along their upper outside. */
function activityArt(look: RingsLook): Art {
  return (k) => {
    const glass = look === 'ios26' || look === 'ios27'
    const radii = glass ? [0.357, 0.2445, 0.131] : [0.387, 0.2635, 0.139]
    const line = (glass ? 0.086 : 0.094) * 100
    let out = ''
    ringColours[look].forEach(([s, e], i) => {
      const r = radii[i] * 100
      const start = hex(s)
      const end = hex(e)
      if (glass) out += circleStroke(50, 50, r * 2, line * 1.3, 'rgba(0,0,0,0.55)')
      out += circleStroke(50, 50, r * 2, line, angular(k, [[start, 0], [end, 0.72], [end, 1]], 50, 50, -90, 270, 72))
      if (glass) {
        const R = r + line * 0.3
        out += circleStroke(50, 50, R * 2, line * 0.16, frameLinear(k, [whiteA(0.55), whiteA(0)], 50, 50 - R, 50, 50))
      }
      // The end cap laps the start; its shade falls clockwise only.
      out += circle(50 + line * 0.16, 50 - r, line, 'rgba(0,0,0,0.35)')
      out += circle(50, 50 - r, line, end)
    })
    return out
  }
}

// ---------------------------------------------------------------- Tips

/** ExtraBulbShape: a round globe (a 24-segment polygon over its top)
 *  narrowing through curved shoulders to a flat-bottomed neck. `leave` is
 *  the degrees below the globe's equator where the neck curves away. */
function bulbPath(o: { centreY: number; radius: number; leave: number; neckY: number; neckHalf: number; controlHalf: number; controlY: number }): string {
  const u = (x: number, y: number) => P(x * 100, y * 100)
  const a = (o.leave * Math.PI) / 180
  let d = `M${u(0.5 - o.neckHalf, o.neckY)} Q${u(0.5 - o.controlHalf, o.controlY)} ${u(0.5 - o.radius * Math.cos(a), o.centreY + o.radius * Math.sin(a))}`
  const steps = 24
  for (let step = 1; step <= steps; step++) {
    const angle = Math.PI - a + (step / steps) * (Math.PI + 2 * a)
    d += ` L${u(0.5 + o.radius * Math.cos(angle), o.centreY + o.radius * Math.sin(angle))}`
  }
  return d + ` Q${u(0.5 + o.controlHalf, o.controlY)} ${u(0.5 + o.neckHalf, o.neckY)} Z`
}

/** The T-shaped filament: a bar and a stem, each its own capsule. */
function filament(barY: number, barHalf: number, stemBottom: number, ink: string, barH = 0.028, stemW = 0.034): string {
  return (
    capsule(50, barY * 100, barHalf * 200, barH * 100, ink) +
    capsule(50, (barY + stemBottom) * 50, stemW * 100, (stemBottom - barY) * 100, ink)
  )
}

const band = (y: number, half: number, height: number, ink: string): string => capsule(50, y * 100, half * 200, height * 100, ink)

type TipsLook = 'ios8' | 'ios18' | 'ios26' | 'ios27'

/** ExtraTipsArt */
function tipsArt(look: TipsLook): Art {
  return (k) => {
    switch (look) {
      case 'ios8':
        return (
          path(
            bulbPath({ centreY: 0.39, radius: 0.234, leave: 25, neckY: 0.71, neckHalf: 0.074, controlHalf: 0.09, controlY: 0.6 }),
            frameLinear(k, [hex(0xfff1d6), white], 0, 0, 0, 50),
          ) +
          filament(0.441, 0.11, 0.69, hex(0xf6bf43)) +
          band(0.745, 0.075, 0.03, white) +
          band(0.8, 0.064, 0.03, white) +
          band(0.855, 0.045, 0.03, white)
        )
      case 'ios18': {
        const base: Radii = [0.8, 0.8, 5, 5]
        return (
          path(bulbPath({ centreY: 0.375, radius: 0.242, leave: 30, neckY: 0.75, neckHalf: 0.105, controlHalf: 0.12, controlY: 0.63 }), white) +
          filament(0.47, 0.102, 0.69, hex(0xffc000)) +
          band(0.7875, 0.09, 0.025, white) +
          path(rrectPath(50, 84.25, 15, 5.5, base, true), white)
        )
      }
      case 'ios26':
      case 'ios27': {
        // A clear glass bulb, the ground's yellow showing through its top,
        // on a stack of brass rings. Geometry measured off Apple's icon: a
        // round globe that keeps its curve to 44 degrees below the equator,
        // then a short, wide neck straight into the base.
        const muted = look === 'ios27'
        const bulb = bulbPath({ centreY: 0.35, radius: 0.246, leave: 44, neckY: 0.63, neckHalf: 0.132, controlHalf: 0.1455, controlY: 0.5755 })
        const fill = tileLinear(k, [
          [muted ? hex(0xfae666) : hex(0xfdd545), 0.1],
          [muted ? hex(0xfffdee) : hex(0xfce9ab), 0.55],
          [muted ? hex(0xfbefcc) : hex(0xfff6d0), 1],
        ])
        return (
          path(bulb, fill) +
          stroke(bulb, tileLinear(k, [white, whiteA(0.35)]), 1.2) +
          filament(0.45, 0.104, 0.625, whiteA(muted ? 0.88 : 0.8), 0.042, 0.042) +
          band(0.655, 0.135, 0.042, muted ? hex(0xa38b3d) : hex(0xd9b23c)) +
          band(0.7, 0.128, 0.042, muted ? hex(0x8e7632) : hex(0xc49a2a)) +
          band(0.745, 0.112, 0.042, muted ? hex(0x715610) : hex(0xb48b1e))
        )
      }
    }
  }
}

// ---------------------------------------------------------------- Watch

type WatchLook = 'sportBand' | 'series4' | 'soloLoop' | 'ios17' | 'ios18' | 'glass26' | 'glass27'

interface WatchSpec {
  watchCase: UBox
  caseRadius: number
  caseTop: number
  caseBottom: number
  crown: [number, number]
  crownSize: number
  button?: UBox
  band: UBox
  bandWidth: number
  tuck?: boolean
  lugs?: boolean
}

const watchSpecs: Record<WatchLook, WatchSpec> = {
  sportBand: {
    watchCase: ubox(0.215, 0.3, 0.315, 0.7),
    caseRadius: 0.03,
    caseTop: 0xbdbdbd,
    caseBottom: 0x8a8a8a,
    crown: [0.262, 0.42],
    crownSize: 0.085,
    button: ubox(0.245, 0.52, 0.28, 0.635),
    band: ubox(0.215, 0.17, 0.805, 0.83),
    bandWidth: 0.026,
    tuck: true,
  },
  series4: {
    watchCase: ubox(0.18, 0.285, 0.295, 0.715),
    caseRadius: 0.035,
    caseTop: 0xb5b5b5,
    caseBottom: 0x858585,
    crown: [0.235, 0.415],
    crownSize: 0.075,
    button: ubox(0.215, 0.52, 0.255, 0.665),
    band: ubox(0.185, 0.15, 0.84, 0.85),
    bandWidth: 0.028,
    tuck: true,
  },
  soloLoop: {
    watchCase: ubox(0.215, 0.3, 0.315, 0.7),
    caseRadius: 0.03,
    caseTop: 0xb8b8b8,
    caseBottom: 0x8c8c8c,
    crown: [0.262, 0.43],
    crownSize: 0.065,
    button: ubox(0.248, 0.515, 0.278, 0.625),
    band: ubox(0.225, 0.18, 0.8, 0.82),
    bandWidth: 0.03,
  },
  ios17: {
    watchCase: ubox(0.212, 0.295, 0.315, 0.705),
    caseRadius: 0.032,
    caseTop: 0xb0b0b0,
    caseBottom: 0x8a8a8a,
    crown: [0.262, 0.43],
    crownSize: 0.068,
    button: ubox(0.247, 0.515, 0.279, 0.628),
    band: ubox(0.225, 0.175, 0.8, 0.825),
    bandWidth: 0.032,
  },
  ios18: {
    watchCase: ubox(0.2, 0.27, 0.33, 0.73),
    caseRadius: 0.035,
    caseTop: 0x929293,
    caseBottom: 0x8a8a8a,
    crown: [0.268, 0.43],
    crownSize: 0.07,
    band: ubox(0.235, 0.18, 0.785, 0.82),
    bandWidth: 0.032,
  },
  glass26: {
    watchCase: ubox(0.16, 0.27, 0.29, 0.73),
    caseRadius: 0.045,
    caseTop: 0xdadada,
    caseBottom: 0x8e8e8e,
    crown: [0.215, 0.42],
    crownSize: 0.065,
    // Measured off Apple's icon: the loop is centred on the tile and its
    // strap is thin, not the fat tube a 0.05 stroke drew.
    band: ubox(0.169, 0.14, 0.835, 0.862),
    bandWidth: 0.038,
    lugs: false,
  },
  glass27: {
    watchCase: ubox(0.16, 0.27, 0.29, 0.73),
    caseRadius: 0.045,
    caseTop: 0xdadada,
    caseBottom: 0x8e8e8e,
    crown: [0.215, 0.42],
    crownSize: 0.065,
    band: ubox(0.169, 0.14, 0.835, 0.862),
    bandWidth: 0.038,
    lugs: false,
  },
}

/** ExtraWatchArt: an Apple Watch in profile, the case on the left, crown
 *  and button on its side, and the band looping round to the right. Every
 *  part is placed over a unit-square box (extraPlace). */
function watchArt(look: WatchLook): Art {
  return (k) => {
    const s = watchSpecs[look]
    const glass = look === 'glass26' || look === 'glass27'
    const bw = s.bandWidth * 100
    const b = inTile(s.band)
    let out = ''
    // The band.
    const bandPaint = glass ? linear(k, [hex(0xf2f2f2, look === 'glass27' ? 0.95 : 0.9), hex(0x8f8f8f, 0.85)]) : white
    out += ellipse(b.cx, b.cy, b.w, b.h, 'none', `stroke="${bandPaint}" stroke-width="${f(bw)}"`)
    if (s.tuck) {
      // The sport band's tail, tucked back over the loop, and its pin.
      const tail = ubox(s.band.x0 - 0.032, s.band.y0 - 0.032, s.band.x1 + 0.032, s.band.y1 + 0.032)
      const t = inTile(tail)
      const cap = 'stroke-linecap="round"'
      out += stroke(ellipseTrim(t.cx, t.cy, t.w, t.h, 0.83, 1), white, bw, cap)
      out += stroke(ellipseTrim(t.cx, t.cy, t.w, t.h, 0, 0.05), white, bw, cap)
      out += circle((tail.x1 - 0.015) * 100, (t.cy / 100 + (tail.y1 - tail.y0) * 0.14 + 0.015) * 100, 3, white)
    }
    // The case.
    const c = inTile(s.watchCase)
    out += rrect(c.cx, c.cy, c.w, c.h, s.caseRadius * 100, linear(k, [hex(s.caseTop), hex(s.caseBottom)]), '', true)
    if (s.lugs !== false) {
      const lugX = (s.watchCase.x1 - 0.035) * 100
      const topY = (s.watchCase.y0 + 0.014) * 100
      const bottomY = (s.watchCase.y1 - 0.014) * 100
      out += circle(lugX, topY, 4.4, white) + circle(lugX, bottomY, 4.4, white)
      if (look === 'ios18') {
        // iOS 18's band ends show their pins.
        out += circle(lugX, topY, 2.2, hex(0x2a2a2a)) + circle(lugX, bottomY, 2.2, hex(0x2a2a2a))
      }
    }
    // The crown.
    const [kx, ky] = [s.crown[0] * 100, s.crown[1] * 100]
    const kd = s.crownSize * 100
    switch (look) {
      case 'sportBand':
        // A black sapphire crown in a white rim.
        out += circle(kx, ky, kd, '#000') + ring(kx, ky, kd, 1.4, white)
        break
      case 'series4':
      case 'soloLoop':
      case 'ios17':
        out += circle(kx, ky, kd, hex(0x2a2a2a)) + ring(kx, ky, kd, 1.3, white)
        break
      case 'ios18':
        out += ring(kx, ky, kd, 1.4, hex(0x2a2a2a))
        break
      case 'glass26':
      case 'glass27':
        out += circle(kx, ky, kd, linear(k, [white, hex(0xc8c8c8)]))
        break
    }
    if (s.button) {
      const t = inTile(s.button)
      const lw = 0.9
      out += capsule(t.cx, t.cy, t.w, t.h, hex(0x2a2a2a))
      out += stroke(capsulePath(t.cx, t.cy, t.w - lw, t.h - lw), white, lw)
    }
    return out
  }
}

// ---------------------------------------------------------------- Find iPhone and Find My

/** ExtraRadarArt: Find iPhone, iOS 7-12. A green radar in a black bezel,
 *  its sweep just past one-thirty with the glow trailing behind it. */
const radarArt: Art = (k) => {
  const sweep = angular(
    k,
    [
      [hex(0x184a20), 0],
      [hex(0x1f5a28), 0.125],
      [hex(0x266a31), 0.375],
      [hex(0x359e46), 0.625],
      [hex(0x41c858), 0.875],
      [hex(0x54db63), 1],
    ],
    50,
    50,
    -45,
    315,
    72,
  )
  return (
    circle(50, 50, 90, '#000') +
    circle(50, 50, 85.5, sweep) +
    [0.25, 0.54, 0.835].map((d) => circleStroke(50, 50, d * 100, 1.1, hex(0x45dc48))).join('') +
    // The sweep's leading edge, turned about the tile centre.
    capsule(50, 29, 0.8, 42, hex(0x7ceb86, 0.55), 'transform="rotate(45 50 50)"')
  )
}

/** ExtraBeamShape: a wedge from the centre to `radius` (of the tile), 2 x
 *  `halfAngle` wide, pointing up; its arc is 8 straight steps. */
function beamPath(radius: number, halfAngle: number): string {
  let d = `M${P(50, 50)}`
  const steps = 8
  for (let step = 0; step <= steps; step++) {
    const angle = ((-90 - halfAngle + (2 * halfAngle * step) / steps) * Math.PI) / 180
    d += ` L${P(50 + Math.cos(angle) * radius * 100, 50 + Math.sin(angle) * radius * 100)}`
  }
  return d + ' Z'
}

type FindMyLook = 'ios13' | 'ios18' | 'ios26' | 'ios27'

interface FindMyPalette {
  disc: [number, number]
  zone: [number, number]
  zoneEdge: number
  beam: number[]
  halo: number
  dot: [number, number]
  radius: number
}

const findMyPalettes: Record<FindMyLook, FindMyPalette> = {
  ios13: {
    disc: [0x38d46b, 0x2eba58],
    zone: [0x4cdc66, 0x42ce5a],
    zoneEdge: 0x5be275,
    beam: [0x36cf76, 0x1da7b4, 0x0a84ec],
    halo: 0xefeff4,
    dot: [0x007aff, 0x007aff],
    radius: 0.42,
  },
  ios18: {
    disc: [0x38d46a, 0x2cb452],
    zone: [0x4ddd66, 0x43ce5b],
    zoneEdge: 0x5ce277,
    beam: [0x3ad370, 0x25b3a2, 0x0f89d9],
    halo: 0xefeff4,
    dot: [0x007aff, 0x007aff],
    radius: 0.42,
  },
  ios26: {
    disc: [0x1fd05a, 0x33b462],
    zone: [0x1add5c, 0x13d759],
    zoneEdge: 0x6af09c,
    beam: [0x15e7b9, 0x08cbc2, 0x018ccf],
    halo: 0xc8f3d8,
    dot: [0x0382f4, 0x0096d1],
    radius: 0.4,
  },
  ios27: {
    disc: [0x5acf58, 0x4cb446],
    zone: [0x6aec55, 0x62e04f],
    zoneEdge: 0x86f070,
    beam: [0x5cc993, 0x52b9a9, 0x439acf],
    halo: 0xe3e5e7,
    dot: [0x3c80f7, 0x3176ee],
    radius: 0.4,
  },
}

/** ExtraFindMyArt: a green disc with a blue dot and its heading beam. */
function findMyArt(look: FindMyLook): Art {
  return (k) => {
    const p = findMyPalettes[look]
    const glass = look === 'ios26' || look === 'ios27'
    const D = p.radius * 200
    let out = circle(50, 50, D, linear(k, [hex(p.disc[0]), hex(p.disc[1])]))
    if (glass) out += ring(50, 50, D, 1.2, frameLinear(k, [whiteA(0.7), whiteA(0.15)], 50, 50 - D / 2, 50, 50 + D / 2))
    // iOS 27 lifts the inner zone off the disc with a shadow.
    if (look === 'ios27') out += circle(50, 51.2, 53, hex(0x2f8a22, 0.55))
    out += circle(50, 50, 52, linear(k, [hex(p.zone[0]), hex(p.zone[1])]))
    out += circleStroke(50, 50, 52, glass ? 1.4 : 1.2, hex(p.zoneEdge))
    out += path(
      beamPath(p.radius - 0.004, 29),
      frameLinear(k, p.beam.map((c) => hex(c, look === 'ios27' ? 0.85 : 1)), 0, 0, 0, 50),
    )
    out += circle(50, 50, 22.5, hex(p.halo))
    out += circle(50, 50, 16.5, linear(k, [hex(p.dot[0]), hex(p.dot[1])]))
    if (glass) out += ring(50, 50, 16.5, 0.8, frameLinear(k, [whiteA(0.8), whiteA(0)], 50, 41.75, 50, 50))
    return out
  }
}

// ---------------------------------------------------------------- Find Friends

/** One figure: head, body and two splayed legs, centred on x. */
function friendFigure(x: number): string {
  const cx = x * 100
  const leg = (lx: number, lean: number) => capsule(lx * 100, 65.5, 5.6, 29, white, `transform="rotate(${lean} ${f(lx * 100)} 65.5)"`)
  return circle(cx, 26.5, 11.3, white) + rrect(cx, 46, 13.3, 20, 2, white, '', true) + leg(x - 0.0685, 13.9) + leg(x + 0.0685, -13.9)
}

/** ExtraFriendsArt: two figures standing arm in arm, their outstretched
 *  arms one bar; framed until iOS 9 (the pair then 95% and 0.008 lower). */
function friendsArt(framed: boolean): Art {
  return () => {
    const pair = capsule(50, 38.5, 75, 5, white) + friendFigure(0.352) + friendFigure(0.648)
    if (!framed) return pair
    return (
      stroke(rrectPath(50, 50, 85.5, 85.5, 16, true), whiteA(0.95), 1.3) +
      // .scaleEffect(0.95) about the tile centre, then .offset(y: 0.008).
      `<g transform="translate(0 0.8) translate(50 50) scale(0.95) translate(-50 -50)">${pair}</g>`
    )
  }
}

// ---------------------------------------------------------------- Magnifier

/** The lens centre. */
const LX = 42.4
const LY = 40.5

/** The handle, from 0.26 to 0.60 out from the lens centre, at 45 degrees. */
function magnifierHandle(width: number, fill: (cx: number, cy: number, w: number, h: number) => string): string {
  const mid = 43
  const hx = LX + mid * Math.cos(Math.PI / 4)
  const hy = LY + mid * Math.sin(Math.PI / 4)
  const w = width * 100
  return capsule(hx, hy, w, 34, fill(hx, hy, w, 34), `transform="rotate(-45 ${f(hx)} ${f(hy)})"`)
}

function magnifierCross(ink: string, weightFraction: number, reach: number): string {
  return capsule(LX, LY, reach * 100, weightFraction * 100, ink) + capsule(LX, LY, weightFraction * 100, reach * 100, ink)
}

/** ExtraMagnifierArt: a loupe, a ring round a yellow plus, its handle out to
 *  the lower right. `plus` for the flat look; `rim` for the glass one. */
function magnifierArt(look: { plus: number } | { rim: number }): Art {
  return (k) => {
    if ('plus' in look) {
      return magnifierHandle(0.056, () => white) + circleStroke(LX, LY, 48, 3.6, white) + magnifierCross(hex(look.plus), 0.028, 0.25)
    }
    return (
      // topLeading -> bottomTrailing over the capsule's own frame (it turns
      // with the capsule).
      magnifierHandle(0.055, (cx, cy, w, h) => frameLinear(k, [white, hex(0x9a9a9a)], cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)) +
      circle(LX, LY, 48, radial(k, [hex(0x5a5638), hex(0x2e2c1e)], [0.4, 0.35], 0.26 / 0.48)) +
      magnifierCross(hex(0xf5cf2a, 0.9), 0.016, 0.246) +
      circleStroke(LX, LY, 49, look.rim * 100, frameLinear(k, [white, hex(0xb4b4b4)], LX, LY - 24.5, LX, LY + 24.5))
    )
  }
}

// ---------------------------------------------------------------- widgets

const sfFamily = `-apple-system, BlinkMacSystemFont, &apos;SF Pro Text&apos;, &apos;Helvetica Neue&apos;, Arial, sans-serif`

/** A leading-aligned Text: left edge at x, its line box centred on cy. */
function leadingText(str: string, x: number, cy: number, size: number, fill: string, fontWeight: number, extra = ''): string {
  const esc = str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  return `<text x="${f(x)}" y="${f(cy)}" text-anchor="start" dominant-baseline="central" font-family="${sfFamily}" font-size="${f(size)}" font-weight="${fontWeight}" fill="${fill}" ${extra}>${esc}</text>`
}

/** A VStack(alignment: .leading, spacing: 0) with `padding` all round and a
 *  Spacer between `top` and `bottom`: each row is [height, draw(centreY)]. */
function leadingStack(padding: number, top: Array<[number, (cy: number) => string]>, bottom: Array<[number, (cy: number) => string]>): string {
  let out = ''
  let y = padding
  for (const [h, draw] of top) {
    out += draw(y + h / 2)
    y += h
  }
  y = 100 - padding
  for (const [h, draw] of [...bottom].reverse()) {
    out += draw(y - h / 2)
    y -= h
  }
  return out
}

const lineOf = (size: number): number => size * lineHeightSF

/** ExtraWeatherWidget: city, big temperature, condition, range. */
const weatherWidgetArt: Art = () => {
  const x = 9.5
  const sun = 9
  // An SF Symbol image is about 1.1 x its point size.
  const sunBox = sun * 1.1
  return leadingStack(
    9.5,
    [
      [lineOf(8.5), (cy) => leadingText('Cupertino', x, cy, 8.5, white, weight.semibold)],
      // .padding(.top, -edge * 0.01)
      [lineOf(26) - 1, (cy) => leadingText('72°', x, cy - 0.5, 26, white, weight.light)],
    ],
    [
      [sunBox, (cy) => symbol('sun.max.fill', hex(0xffd60a), sun, x + sunBox / 2, cy)],
      [lineOf(8), (cy) => leadingText('Sunny', x, cy, 8, white, weight.semibold)],
      [lineOf(7.5), (cy) => leadingText('H:75°  L:58°', x, cy, 7.5, white, weight.medium, 'opacity="0.85" xml:space="preserve"')],
    ],
  )
}

/** ExtraCalendarWidget: red weekday, the date, an empty day. */
const calendarWidgetArt: Art = () => {
  const x = 9.5
  return leadingStack(
    9.5,
    [
      [lineOf(7.5), (cy) => leadingText('TUESDAY', x, cy, 7.5, hex(0xff3b30), weight.semibold)],
      [lineOf(22), (cy) => leadingText('9', x, cy, 22, '#000', weight.regular)],
    ],
    [[lineOf(7), (cy) => leadingText('No more events today', x, cy, 7, hex(0x8e8e93), weight.regular)]],
  )
}

// ---------------------------------------------------------------- roster

export const extra: HomeAppDef[] = [
  // 7.0 | 7.1 darker | 11 wider gaps | 12 button gone, lens filled |
  // 18 wider gap | 26 glass | 27 softer green.
  {
    id: 'FaceTime',
    designs: [
      design(2013, 0x83fb6c, 0x0fd41a, cameraArt(camera.ios7)),
      design(2014, 0x65fb7e, 0x07b724, cameraArt(camera.ios7)),
      design(2017, 0x58f473, 0x0dbc2a, cameraArt(camera.ios11)),
      design(2018, 0x5af675, 0x0ebf2c, cameraArt(camera.ios12)),
      design(2024, 0x62fc7c, 0x04b722, cameraArt(camera.ios18)),
      design(2025, 0x54ef6e, 0x25c041, cameraArt(camera.ios26, { glass: true, top: hex(0xeafcee), bottom: hex(0xd2f2d8), shade: hex(0x117a28, 0.45) })),
      design(2026, 0x82ec7c, 0x62cd53, cameraArt(camera.ios26, { glass: true, top: hex(0xfbfefb), bottom: hex(0xedf8ee), shade: hex(0x2e8f2a, 0.35) })),
    ],
  },

  // Apple's default folder. Its tile is drawn from what is inside it; this
  // design is only its fallback.
  {
    id: 'Utilities',
    names: [
      [era(2010), 'Utilities'],
      [era(2014), 'Extras'],
      [era(2020), 'Utilities'],
    ],
    designs: [flat(2010, 0x3a3a3c, nothing)],
  },

  // 8-17 white bulb on amber | 18 brighter yellow, new base | 26 glass
  // bulb, gradient flips | 27 muted gold, pale glass.
  {
    id: 'Tips',
    designs: [
      design(2014, 0xf4ad3d, 0xf8cb46, tipsArt('ios8')),
      design(2024, 0xffb700, 0xffca00, tipsArt('ios18')),
      design(2025, 0xffca00, 0xffb302, tipsArt('ios26')),
      design(2026, 0xf4c241, 0xf0b13c, tipsArt('ios27')),
    ],
  },

  // 8.2 sport band | 12.1.1 Series 4 | 14.2 Solo Loop | 17 retouched |
  // 18.1 gradient, side button gone | 26 glass | 27 darker glass.
  {
    id: 'Watch',
    designs: [
      flat(2015, 0x1b1b1b, watchArt('sportBand')),
      flat(2018, 0x1b1a1d, watchArt('series4')),
      flat(2020, 0x1b1b1c, watchArt('soloLoop')),
      flat(2023, 0x1b1b1c, watchArt('ios17')),
      design(2024, 0x303030, 0x151515, watchArt('ios18')),
      design(2025, 0x313131, 0x141414, watchArt('glass26')),
      design(2026, 0x232323, 0x101010, watchArt('glass27')),
    ],
  },

  // Find iPhone (iOS 7 icon): a green radar sweep in a black bezel.
  // Find My: a green disc with a blue dot and its heading beam.
  {
    id: 'Find My',
    names: [
      [era(2015), 'Find iPhone'],
      [era(2019), 'Find My'],
    ],
    designs: [
      flat(2015, 0xf0eff4, radarArt),
      design(2019, 0xddddda, 0xccccca, findMyArt('ios13')),
      design(2024, 0xf7f7f6, 0xd5d3d6, findMyArt('ios18')),
      design(2025, 0xe1e1df, 0xbfbfbd, findMyArt('ios26')),
      design(2026, 0xdedede, 0xc1c1c1, findMyArt('ios27')),
    ],
  },

  // Two figures arm in arm on amber: framed until iOS 9, bare from iOS 10.
  // Merged into Find My in iOS 13.
  {
    id: 'Find Friends',
    designs: [design(2015, 0xf8d757, 0xf09b39, friendsArt(true)), design(2016, 0xf8ce45, 0xf29a38, friendsArt(false))],
  },

  // A loupe with a yellow plus: 14 flat black | 18 gradient | 26 glass
  // lens | 27 darker, heavier rim.
  {
    id: 'Magnifier',
    designs: [
      flat(2020, 0x1a1a1b, magnifierArt({ plus: 0xffd800 })),
      design(2024, 0x303030, 0x151515, magnifierArt({ plus: 0xffda00 })),
      design(2025, 0x303030, 0x141414, magnifierArt({ rim: 0.034 })),
      design(2026, 0x232323, 0x101010, magnifierArt({ rim: 0.038 })),
    ],
  },

  // Activity's three rings: Move, Exercise, Stand. 8.2-17 flat black |
  // 18 gradient | 26 glass tubes | 27 softer rings, darker ground.
  {
    id: 'Fitness',
    names: [
      [era(2015), 'Activity'],
      [era(2020), 'Fitness'],
    ],
    designs: [
      flat(2015, 0x1e1e1e, activityArt('ios8')),
      design(2024, 0x2f2f2f, 0x151515, activityArt('ios18')),
      design(2025, 0x313131, 0x131313, activityArt('ios26')),
      design(2026, 0x1f1f1f, 0x0f0f0f, activityArt('ios27')),
    ],
  },

  // 7 dark-to-light violet, fading rings | 9 light-to-dark, solid rings |
  // 18 refined | 26 glass discs | 27 deeper violet.
  {
    id: 'Podcasts',
    designs: [
      design(2013, 0x842bc1, 0xd36afa, podcastsArt('ios7')),
      design(2015, 0xd46dfc, 0x862ec3, podcastsArt('ios9')),
      design(2024, 0xd66efd, 0x8528c3, podcastsArt('ios18')),
      design(2025, 0xa454cf, 0x7530ad, podcastsArt('ios26')),
      design(2026, 0x883fbb, 0x6f3399, podcastsArt('ios27')),
    ],
  },

  // The small Weather widget: city, big temperature, condition, range.
  {
    id: 'Weather Widget',
    names: [[era(2021), 'Weather']],
    span: 2,
    designs: [design(2021, 0x2f6ed6, 0x1e4ca8, weatherWidgetArt), design(2025, 0x3b8bea, 0x1c4fb0, weatherWidgetArt)],
  },

  // The small Calendar widget: red weekday, the date, an empty day.
  {
    id: 'Calendar Widget',
    names: [[era(2021), 'Calendar']],
    span: 2,
    designs: [flat(2021, 0xffffff, calendarWidgetArt), design(2025, 0xffffff, 0xf2f2f4, calendarWidgetArt)],
  },
]
