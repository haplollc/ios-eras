// The kit every home-screen icon is drawn with: a web port of the SwiftUI
// icon system (HomeErasIcons.swift + HomeErasGlyphs.swift).
//
// CONVENTIONS (read before porting an icon)
// - An icon's artwork is SVG markup in a 100 x 100 box; (50, 50) is the
//   centre of the tile. SwiftUI `edge * f` becomes `100 * f`.
// - SwiftUI centres a view in its ZStack, so `X.frame(width: edge * w,
//   height: edge * h).offset(x: edge * dx, y: edge * dy)` is a w*100 by
//   h*100 box centred at (50 + dx*100, 50 + dy*100).
// - `.rotationEffect(.degrees(d))` turns about the view's own centre. When
//   it comes AFTER an `.offset`, the pivot is the un-offset centre, so the
//   offset content orbits (tick rings, petals): use place() with `dx/dy`
//   and `rotate`, which does exactly that.
// - LinearGradient(startPoint:endPoint:) uses unit points of the shape's
//   bounding box; linear() takes the same unit points.
// - The system draws the tile shape, the pre-2013 gloss, the tile shadow,
//   the 2025+ glass rim and the label. Icons draw only background and glyph.
//
// SWIFTUI BEHAVIOUR, MEASURED (ImageRenderer on the 27 SDK, and the iOS
// captures) and already built into the helpers below:
// - Gradients blend in Oklab with premultiplied alpha, not in sRGB:
//   linear(), radial(), angular() and gradientStops() do this for you.
// - .shadow(radius: r) is a Gaussian of standard deviation r; .blur(radius:
//   r) is 0.94 r. shadow() and blur() take the SwiftUI radius.
// - Capsule() has continuous corners (capsule(), capsulePath()), and
//   `style: .continuous` is Apple's exact corner (rrect(..., true)).
// - Shapes fill with the nonzero rule, and CoreGraphics winds ellipses and
//   rounded rects clockwise, so a subpath wound the other way cuts a hole
//   where it overlaps them (as in BubbleShape and PinShape).
// NOT built in, so mind it when porting:
// - `.opacity()` on a ZStack/VStack fades EACH child separately (overlaps
//   show through each other). place({ opacity }) and <g opacity> fade the
//   group as one, which is `.compositingGroup().opacity()`. To match plain
//   SwiftUI, put opacity="..." on each element.

import { hex as hexColour } from '../../core/ink'
import type { Ink } from '../../core/ink'
import { ink, css as inkCSS } from '../../core/ink'

// ---------------------------------------------------------------- types

/** Collects <defs> and hands out ids that are unique within one SVG. */
export class Kit {
  private defs: string[] = []
  private n = 0
  constructor(private readonly prefix: string) {}
  id(tag = 'd'): string {
    this.n += 1
    return `${this.prefix}-${tag}${this.n}`
  }
  def(markup: string): void {
    this.defs.push(markup)
  }
  get defsMarkup(): string {
    return this.defs.length ? `<defs>${this.defs.join('')}</defs>` : ''
  }
}

/** Draws artwork in the 100 x 100 box. */
export type Art = (k: Kit) => string

/** One redesign of one app's icon. `from` is the first timeline index
 *  (year - 2007) it shows at. `top`/`bottom` are the tile's background
 *  gradient, blended between redesigns; `art` is drawn above it; `over`, if
 *  present, is drawn ABOVE the system's pre-2013 gloss. */
export interface IconDesign {
  from: number
  top: Ink
  bottom: Ink
  art: Art
  over?: Art
  /** Set only by the drop-in image hook: a whole-tile image URL. */
  imageURL?: string
}

/** An app and its list of redesigns. `names` are [timeline index, label]
 *  for renames (Text -> Messages); `span` is 2 for a small widget. */
export interface HomeAppDef {
  id: string
  names?: Array<[number, string]>
  span?: number
  designs: IconDesign[]
}

// ---------------------------------------------------------------- helpers

export const era = (year: number): number => year - 2007

/** CSS colour from 0xRRGGBB (and alpha). */
export const hex = hexColour

export const nothing: Art = () => ''

export function design(year: number, top: number, bottom: number, art: Art, over?: Art): IconDesign {
  return { from: era(year), top: ink(top), bottom: ink(bottom), art, over }
}

export function flat(year: number, colour: number, art: Art, over?: Art): IconDesign {
  return design(year, colour, colour, art, over)
}

// ---------------------------------------------------------------- paint

/** [css colour, location 0...1]. Plain colours are spread evenly. */
export type Stop = [string, number]

// SwiftUI gradients blend in Oklab with premultiplied alpha (measured off
// ImageRenderer and the iOS captures: red -> blue passes through a mauve
// with green 84, not sRGB's purple). SVG and CSS stops blend in sRGB, so
// each segment is cut into sub-stops computed in Oklab.
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toGamma = (c: number) => {
  const v = Math.min(1, Math.max(0, c))
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
}
function oklab(i: Ink): [number, number, number] {
  const r = toLinear(i.r)
  const g = toLinear(i.g)
  const b = toLinear(i.b)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
function fromOklab(L: number, A: number, B: number): { r: number; g: number; b: number } {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  return {
    r: toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  }
}

/** The colour a SwiftUI gradient shows `t` of the way from x to y:
 *  Oklab, premultiplied by alpha (so a fade to clear keeps its hue). */
export function mixInk(x: Ink, y: Ink, t: number): Ink {
  const a = x.a + (y.a - x.a) * t
  if (a <= 1e-6) return { r: y.r, g: y.g, b: y.b, a: 0 }
  const p = oklab(x)
  const q = oklab(y)
  const w0 = x.a * (1 - t)
  const w1 = y.a * t
  return { ...fromOklab((p[0] * w0 + q[0] * w1) / a, (p[1] * w0 + q[1] * w1) / a, (p[2] * w0 + q[2] * w1) / a), a }
}

function tryInk(c: string): Ink | null {
  try {
    return toInk(c)
  } catch {
    return null
  }
}

/** <stop> markup for a list of stops, blended like SwiftUI (see mixInk).
 *  Colours kit.toInk() cannot read are passed through unblended. */
export function gradientStops(list: Array<Stop | string>, steps = 8): string {
  const n = list.length
  const norm = list.map((s, i): Stop => (Array.isArray(s) ? s : [s, n === 1 ? 0 : i / (n - 1)]))
  const inks = norm.map(([c]) => tryInk(c))
  const plain = (c: string, o: number) => `<stop offset="${+o.toFixed(4)}" stop-color="${c}"/>`
  if (n < 2 || inks.some((i) => i === null)) return norm.map(([c, o]) => plain(c, o)).join('')
  const stop = (i: Ink, o: number) => plain(inkCSS(i), o)
  // A clear end takes its neighbour's hue: the premultiplied limit.
  const end = (p: Ink, other: Ink): Ink => (p.a <= 1e-4 ? { r: other.r, g: other.g, b: other.b, a: 0 } : p)
  let out = ''
  for (let i = 0; i < n - 1; i++) {
    const x = inks[i]!
    const y = inks[i + 1]!
    const o0 = norm[i][1]
    const o1 = norm[i + 1][1]
    const same = x.r === y.r && x.g === y.g && x.b === y.b && x.a === y.a
    const k = same || o1 <= o0 ? 1 : steps
    for (let j = 0; j <= k; j++) {
      const t = j / k
      const c = j === 0 ? end(x, y) : j === k ? end(y, x) : mixInk(x, y, t)
      out += stop(c, o0 + (o1 - o0) * t)
    }
  }
  return out
}

const stops = (list: Array<Stop | string>): string => gradientStops(list)

/** A linear gradient over the painted shape's bounding box, like SwiftUI's
 *  LinearGradient(startPoint:endPoint:). Returns a fill value. */
export function linear(k: Kit, list: Array<Stop | string>, from: [number, number] = [0.5, 0], to: [number, number] = [0.5, 1]): string {
  const id = k.id('lg')
  k.def(`<linearGradient id="${id}" x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}">${stops(list)}</linearGradient>`)
  return `url(#${id})`
}

/** A radial gradient, like SwiftUI's RadialGradient. `centre` is a unit
 *  point of the bounding box; `r0`/`r1` are the start/end radii as a
 *  fraction of the bounding box (objectBoundingBox units). */
export function radial(k: Kit, list: Array<Stop | string>, centre: [number, number] = [0.5, 0.5], r1 = 0.5, r0 = 0): string {
  const id = k.id('rg')
  const inner = r1 > 0 ? r0 / r1 : 0
  const shifted = list.map((s, i): Stop => {
    const [c, o] = Array.isArray(s) ? s : [s, list.length === 1 ? 0 : i / (list.length - 1)]
    return [c, inner + (1 - inner) * o]
  })
  k.def(`<radialGradient id="${id}" cx="${centre[0]}" cy="${centre[1]}" r="${r1}">${stops(shifted)}</radialGradient>`)
  return `url(#${id})`
}

// Filter regions are fixed in user space round the 100 box, so a thin
// shape's blur or shadow is not cut off at its own bounding box.
const filterRegion = `filterUnits="userSpaceOnUse" x="-60" y="-60" width="220" height="220"`

/** A drop shadow filter, like SwiftUI .shadow(color:radius:x:y:), in 100-box
 *  units. Returns a `filter` attribute value. SwiftUI's shadow is a
 *  Gaussian with standard deviation = radius (measured). */
export function shadow(k: Kit, colour: string, radius: number, dx = 0, dy = 0): string {
  const id = k.id('sh')
  k.def(`<filter id="${id}" ${filterRegion}><feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${f(radius)}" flood-color="${colour}"/></filter>`)
  return `url(#${id})`
}

/** A Gaussian blur filter, like SwiftUI .blur(radius:): standard deviation
 *  0.94 x radius (measured). */
export function blur(k: Kit, radius: number): string {
  const id = k.id('bl')
  k.def(`<filter id="${id}" ${filterRegion}><feGaussianBlur stdDeviation="${f(radius * 0.94)}"/></filter>`)
  return `url(#${id})`
}

/** A clip path from markup; returns the `clip-path` attribute value. */
export function clip(k: Kit, shapeMarkup: string): string {
  const id = k.id('cp')
  k.def(`<clipPath id="${id}">${shapeMarkup}</clipPath>`)
  return `url(#${id})`
}

/** A luminance mask from markup (white shows); returns the `mask` value. */
export function mask(k: Kit, markup: string): string {
  const id = k.id('mk')
  k.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="-50" y="-50" width="200" height="200">${markup}</mask>`)
  return `url(#${id})`
}

/** Reads a CSS colour as an Ink: rgba()/rgb() (what hex() returns), #rgb,
 *  #rrggbb, #rrggbbaa, and white / black / clear / transparent / none. */
export function toInk(colour: string): Ink {
  const s = colour.trim().toLowerCase()
  const fn = /^rgba?\(([^)]*)\)$/.exec(s)
  if (fn) {
    const p = fn[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat)
    return { r: (p[0] ?? 0) / 255, g: (p[1] ?? 0) / 255, b: (p[2] ?? 0) / 255, a: p[3] ?? 1 }
  }
  const h = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(s)
  if (h) {
    let v = h[1]
    if (v.length === 3) v = v.split('').map((c) => c + c).join('')
    const n = (i: number) => parseInt(v.slice(i, i + 2), 16) / 255
    return { r: n(0), g: n(2), b: n(4), a: v.length === 8 ? n(6) : 1 }
  }
  if (s === 'white') return { r: 1, g: 1, b: 1, a: 1 }
  if (s === 'black') return { r: 0, g: 0, b: 0, a: 1 }
  if (s === 'clear' || s === 'transparent' || s === 'none') return { r: 0, g: 0, b: 0, a: 0 }
  throw new Error(`kit.toInk: unsupported colour ${colour}`)
}

/** SwiftUI's `colour.opacity(alpha)`: multiplies the colour's alpha. */
export function fade(colour: string, alpha: number): string {
  const i = toInk(colour)
  return inkCSS({ ...i, a: i.a * alpha })
}

/** An AngularGradient as a paint (a fill or stroke value), like SwiftUI's
 *  AngularGradient(colors:/stops:, center:, startAngle:, endAngle:).
 *  SVG has no conic gradient, so this is a <pattern> of `segments` thin
 *  wedges round (cx, cy), each the gradient's colour at its middle angle.
 *  `cx`/`cy` are in the user space of the element it paints (the gradient
 *  turns with that element's transform, as in SwiftUI). Angles are SwiftUI
 *  degrees: 0 is 3 o'clock, positive is clockwise on screen. Outside a
 *  span shorter than 360 degrees, the nearer end colour shows. */
export function angular(k: Kit, list: Array<Stop | string>, cx = 50, cy = 50, startDeg = 0, endDeg = 360, segments = 180): string {
  const n = list.length
  const st = list.map((s, i): [Ink, number] => (Array.isArray(s) ? [toInk(s[0]), s[1]] : [toInk(s), n === 1 ? 0 : i / (n - 1)]))
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
  const R = 4000
  const wedge = (a0: number, a1: number, colour: Ink) => {
    const p = (a: number) => `${f(cx + R * Math.cos((a * Math.PI) / 180))},${f(cy + R * Math.sin((a * Math.PI) / 180))}`
    return `<path d="M${f(cx)},${f(cy)} L${p(a0)} L${p(a1)} Z" fill="${inkCSS(colour)}"/>`
  }
  const span = endDeg - startDeg
  let body = ''
  for (let j = 0; j < segments; j++) {
    body += wedge(startDeg + (span * j) / segments, startDeg + (span * (j + 1)) / segments, at((j + 0.5) / segments))
  }
  if (Math.abs(span) < 360) {
    // The gap: the end colour runs on to the middle, the start colour back from it.
    const gap = 360 - Math.abs(span)
    const dir = Math.sign(span) || 1
    const mid = endDeg + (dir * gap) / 2
    const steps = Math.max(1, Math.ceil(gap / 45))
    for (let j = 0; j < steps; j++) {
      body += wedge(endDeg + (dir * gap * j) / (2 * steps), endDeg + (dir * gap * (j + 1)) / (2 * steps), st[st.length - 1][0])
      body += wedge(mid + (dir * gap * j) / (2 * steps), mid + (dir * gap * (j + 1)) / (2 * steps), st[0][0])
    }
  }
  const id = k.id('ag')
  k.def(
    `<pattern id="${id}" patternUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000" viewBox="-2000 -2000 4000 4000"><g shape-rendering="crispEdges">${body}</g></pattern>`,
  )
  return `url(#${id})`
}

// ---------------------------------------------------------------- shapes
// All take the CENTRE of the shape (SwiftUI frame + offset) unless noted.
// `extra` is appended raw to the element (e.g. `opacity="0.5"`,
// `filter="${shadow(...)}"`, `stroke="#fff" stroke-width="2"`).

const f = (v: number) => +v.toFixed(3)

export function rect(cx: number, cy: number, w: number, h: number, fill: string, extra = ''): string {
  return `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`
}

// Outlines as path data, wound like CoreGraphics (clockwise on screen,
// starting on the right edge), so combining them in one path leaves the
// same nonzero-rule holes SwiftUI leaves.

/** Corner-radius order for rrectPath(): top-left, top-right, bottom-right,
 *  bottom-left (SwiftUI's UnevenRoundedRectangle, leading = left). */
export type Radii = [number, number, number, number]

// Apple's .continuous corner, measured off CoreGraphics' own path: three
// cubics per corner. When the corners on one edge need more room than the
// edge has, only the first and last cubic shorten, linearly.
const CONT = 1.52866
const contC1 = (l: number) => 0.96 + 0.24305 * (l - 1)
const contC2 = (l: number) => 0.82 + 0.091572 * (l - 1)

/** SwiftUI's RoundedRectangle / UnevenRoundedRectangle outline as path data,
 *  centred at (cx, cy). `r` is one radius or [tl, tr, br, bl]; each is
 *  clamped to half the shorter side, as SwiftUI does. `continuous` is
 *  `style: .continuous` (exact geometry, not an approximation). */
export function rrectPath(cx: number, cy: number, w: number, h: number, r: number | Radii, continuous = false): string {
  const x0 = cx - w / 2
  const y0 = cy - h / 2
  const lim = Math.max(0, Math.min(w, h) / 2)
  const [tl, tr, br, bl] = (Array.isArray(r) ? r : [r, r, r, r]).map((v) => Math.min(Math.max(0, v), lim))
  // How far each corner may reach along each edge (continuous only).
  const reach = (edge: number, a: number, b: number) => (a + b > 0 ? Math.min(CONT, edge / (a + b)) : CONT)
  const top = reach(w, tl, tr)
  const right = reach(h, tr, br)
  const bottom = reach(w, br, bl)
  const left = reach(h, bl, tl)
  const P = (x: number, y: number) => `${f(x)},${f(y)}`
  // One corner at (px, py): `a` points back along the incoming edge, `b`
  // along the outgoing one; la/lb are the reaches on those edges.
  const corner = (px: number, py: number, ax: number, ay: number, bx: number, by: number, rad: number, la: number, lb: number) => {
    const at = (u: number, v: number) => P(px + (ax * u + bx * v) * rad, py + (ay * u + by * v) * rad)
    if (rad <= 0) return { start: P(px, py), body: '' }
    if (!continuous) {
      return { start: at(1, 0), body: `A${f(rad)},${f(rad)} 0 0 1 ${at(0, 1)} ` }
    }
    return {
      start: at(la, 0),
      body:
        `C${at(contC1(la), 0)} ${at(contC2(la), 0)} ${at(0.63149, 0.07491)} ` +
        `C${at(0.37282, 0.16906)} ${at(0.16906, 0.37282)} ${at(0.07491, 0.63149)} ` +
        `C${at(0, contC2(lb))} ${at(0, contC1(lb))} ${at(0, lb)} `,
    }
  }
  const x1 = x0 + w
  const y1 = y0 + h
  const cTR = corner(x1, y0, -1, 0, 0, 1, tr, top, right)
  const cBR = corner(x1, y1, 0, -1, -1, 0, br, right, bottom)
  const cBL = corner(x0, y1, 1, 0, 0, -1, bl, bottom, left)
  const cTL = corner(x0, y0, 0, 1, 1, 0, tl, left, top)
  const endTR = tr > 0 ? (continuous ? P(x1, y0 + right * tr) : P(x1, y0 + tr)) : P(x1, y0)
  return `M${endTR} L${cBR.start} ${cBR.body}L${cBL.start} ${cBL.body}L${cTL.start} ${cTL.body}L${cTR.start} ${cTR.body}Z`
}

/** SwiftUI's Capsule() outline. Its default style is .continuous: a
 *  continuous rounded rect with radius half the short side, NOT a stadium
 *  of two semicircles (checked against CoreGraphics). */
export function capsulePath(cx: number, cy: number, w: number, h: number): string {
  return rrectPath(cx, cy, w, h, Math.min(w, h) / 2, true)
}

/** An ellipse (or circle, w = h) as path data, clockwise from 3 o'clock like
 *  Path(ellipseIn:). Use it to combine an ellipse with other subpaths. */
export function ellipsePath(cx: number, cy: number, w: number, h: number): string {
  const rx = f(w / 2)
  const ry = f(h / 2)
  const a = `A${rx},${ry} 0 0 1`
  return `M${f(cx + w / 2)},${f(cy)} ${a} ${f(cx)},${f(cy + h / 2)} ${a} ${f(cx - w / 2)},${f(cy)} ${a} ${f(cx)},${f(cy - h / 2)} ${a} ${f(cx + w / 2)},${f(cy)} Z`
}

/** Rounded rectangle. `continuous` is SwiftUI's `style: .continuous`, drawn
 *  with the exact CoreGraphics corner (see rrectPath). The default,
 *  circular, matches `RoundedRectangle(cornerRadius:)`. */
export function rrect(cx: number, cy: number, w: number, h: number, r: number, fill: string, extra = '', continuous = false): string {
  if (continuous) return `<path d="${rrectPath(cx, cy, w, h, r, true)}" fill="${fill}" ${extra}/>`
  const rr = Math.max(0, Math.min(r, w / 2, h / 2))
  return `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(rr)}" fill="${fill}" ${extra}/>`
}

export function circle(cx: number, cy: number, d: number, fill: string, extra = ''): string {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(d / 2)}" fill="${fill}" ${extra}/>`
}

export function ellipse(cx: number, cy: number, w: number, h: number, fill: string, extra = ''): string {
  return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(w / 2)}" ry="${f(h / 2)}" fill="${fill}" ${extra}/>`
}

/** SwiftUI's Capsule(): continuous corners of radius half the short side. */
export function capsule(cx: number, cy: number, w: number, h: number, fill: string, extra = ''): string {
  return `<path d="${capsulePath(cx, cy, w, h)}" fill="${fill}" ${extra}/>`
}

/** A stroked ring, like Circle().strokeBorder(colour, lineWidth: lw) on a
 *  frame of diameter d (the stroke sits inside the frame). */
export function ring(cx: number, cy: number, d: number, lw: number, colour: string, extra = ''): string {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(d / 2 - lw / 2)}" fill="none" stroke="${colour}" stroke-width="${f(lw)}" ${extra}/>`
}

export function path(d: string, fill: string, extra = ''): string {
  return `<path d="${d}" fill="${fill}" ${extra}/>`
}

export type Family = 'sf' | 'helvetica' | 'helveticaNeue' | 'rounded'

const families: Record<Family, string> = {
  sf: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif`,
  helvetica: `Helvetica, 'Helvetica Neue', Arial, sans-serif`,
  helveticaNeue: `'Helvetica Neue', Helvetica, Arial, sans-serif`,
  rounded: `ui-rounded, 'SF Pro Rounded', -apple-system, 'Helvetica Neue', Arial, sans-serif`,
}

/** Text centred on (cx, cy), like a SwiftUI Text in a ZStack. `size` is the
 *  SwiftUI font size in 100-box units. */
export function text(
  str: string,
  cx: number,
  cy: number,
  size: number,
  opts: { fill?: string; weight?: number; family?: Family; letterSpacing?: number; extra?: string } = {},
): string {
  const esc = str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const fam = families[opts.family ?? 'sf'].replace(/'/g, '&apos;')
  return `<text x="${f(cx)}" y="${f(cy)}" text-anchor="middle" dominant-baseline="central" font-family="${fam}" font-size="${f(size)}" font-weight="${opts.weight ?? 400}" fill="${opts.fill ?? '#fff'}"${opts.letterSpacing ? ` letter-spacing="${opts.letterSpacing}"` : ''} ${opts.extra ?? ''}>${esc}</text>`
}

/** SwiftUI-style placement of already-drawn markup. The content is first
 *  moved by (dx, dy) (`.offset`), then turned by `rotate` degrees and scaled
 *  by `scale` about `pivot` (default the tile centre, i.e. the view's
 *  un-offset centre). */
export function place(
  markup: string,
  t: { dx?: number; dy?: number; rotate?: number; scale?: number | [number, number]; pivot?: [number, number]; opacity?: number; extra?: string },
): string {
  const [px, py] = t.pivot ?? [50, 50]
  const parts: string[] = []
  if (t.rotate || t.scale !== undefined) {
    parts.push(`translate(${f(px)} ${f(py)})`)
    if (t.rotate) parts.push(`rotate(${f(t.rotate)})`)
    if (t.scale !== undefined) {
      const [sx, sy] = Array.isArray(t.scale) ? t.scale : [t.scale, t.scale]
      parts.push(`scale(${f(sx)} ${f(sy)})`)
    }
    parts.push(`translate(${f(-px)} ${f(-py)})`)
  }
  if (t.dx || t.dy) parts.push(`translate(${f(t.dx ?? 0)} ${f(t.dy ?? 0)})`)
  const tr = parts.length ? ` transform="${parts.join(' ')}"` : ''
  const op = t.opacity !== undefined && t.opacity < 1 ? ` opacity="${f(t.opacity)}"` : ''
  return `<g${tr}${op} ${t.extra ?? ''}>${markup}</g>`
}

/** Group markup with an attribute (filter, clip-path, mask, opacity...). */
export const group = (markup: string, attrs: string): string => `<g ${attrs}>${markup}</g>`

// ---------------------------------------------------------------- glyphs
// Open-source stand-ins for the few SF Symbols the SwiftUI version uses
// (SF Symbols may not be used off Apple platforms). Phosphor Icons, MIT.

import airplane from '@phosphor-icons/core/assets/fill/airplane-fill.svg?raw'
import appleLogo from '@phosphor-icons/core/assets/fill/apple-logo-fill.svg?raw'
import check from '@phosphor-icons/core/assets/bold/check-bold.svg?raw'
import globe from '@phosphor-icons/core/assets/fill/globe-fill.svg?raw'
import key from '@phosphor-icons/core/assets/fill/key-fill.svg?raw'
import navArrow from '@phosphor-icons/core/assets/fill/navigation-arrow-fill.svg?raw'
import magnifier from '@phosphor-icons/core/assets/bold/magnifying-glass-bold.svg?raw'
import phone from '@phosphor-icons/core/assets/fill/phone-fill.svg?raw'
import sun from '@phosphor-icons/core/assets/fill/sun-fill.svg?raw'
import tag from '@phosphor-icons/core/assets/fill/tag-fill.svg?raw'
import video from '@phosphor-icons/core/assets/fill/video-camera-fill.svg?raw'

const glyphSources = {
  'airplane': airplane,
  'apple.logo': appleLogo,
  'checkmark': check,
  'globe': globe,
  'key.fill': key,
  'location.north.fill': navArrow,
  'magnifyingglass': magnifier,
  'phone.fill': phone,
  'sun.max.fill': sun,
  'tag.fill': tag,
  'video.fill': video,
} as const

export type SymbolName = keyof typeof glyphSources

/** Turns that stand a Phosphor glyph the way the SF Symbol stands:
 *  Phosphor's navigation arrow points north-west (SF's points north), its
 *  key lies diagonally head top-right (SF's stands upright, head up). */
const glyphTurn: Partial<Record<SymbolName, number>> = {
  'location.north.fill': 45,
  'key.fill': -45,
}

const glyphInner: Partial<Record<SymbolName, string>> = {}
function inner(name: SymbolName): string {
  const cached = glyphInner[name]
  if (cached) return cached
  const src = glyphSources[name]
  const body = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<rect width="256" height="256" fill="none"\/>/g, '')
  glyphInner[name] = body
  return body
}

/** An SF-Symbol-like glyph centred at (cx, cy). `size` is the SwiftUI font
 *  size in 100-box units (a symbol's body is roughly that tall). Phosphor
 *  glyphs sit in a 256 box with a margin, so they are scaled up a little to
 *  match. `rotate` in degrees. */
export function symbol(name: SymbolName, colour: string, size: number, cx = 50, cy = 50, rotate = 0): string {
  const s = (size * 1.18) / 256
  const rot = rotate + (glyphTurn[name] ?? 0)
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(rot)}) scale(${f(s)}) translate(-128 -128)" fill="${colour}">${inner(name)}</g>`
}

// ---------------------------------------------------------------- render

/** A whole icon layer as a standalone SVG document string (100 x 100). */
export function renderArt(art: Art, idPrefix: string): string {
  const k = new Kit(idPrefix)
  const body = art(k)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" overflow="visible">${k.defsMarkup}${body}</svg>`
}

const urlCache = new WeakMap<Art, string>()
let counter = 0

/** A data URL for an art layer, cached per Art function. */
export function artURL(art: Art): string {
  const hit = urlCache.get(art)
  if (hit) return hit
  counter += 1
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderArt(art, `a${counter}`))}`
  urlCache.set(art, url)
  return url
}

// ---------------------------------------------------------------- composites
// Ports of HomeErasGlyphs.swift and the shared composites in
// HomeErasIcons.swift (GameBubbles, WalletCards, CalcKey, CalcSign), named
// after the Swift type in lowerCamelCase, with the Swift fractions as is.
//
// - Views (xxxArt, tickRing): `(k, opts, size = 100, cx = 50, cy = 50)`,
//   drawn in a `size` square centred at (cx, cy). SwiftUI's `side` (the
//   GeometryReader's min(width, height)) is `size`, so a view given the
//   whole tile is `xxxArt(k, opts)`, and `XxxArt().frame(width: edge * 0.8,
//   height: edge * 0.8).offset(x: edge * 0.1)` is `xxxArt(k, opts, 80, 60, 50)`.
//   Views whose Swift body fills its frame (calendar page, notepad paper,
//   map land, quadrants) fill that square.
// - Shapes (xxxPath): `(cx, cy, w, h, ...)` return path data for the
//   Shape's path(in:) of a w x h frame centred at (cx, cy); draw them with
//   path(d, fill). Windings follow CoreGraphics, so the overlaps SwiftUI
//   leaves as holes (bubble tail, pin stem) are holes here too.
// - Colours are CSS strings (hex(0xRRGGBB, a), '#fff', 'rgba(...)').
// - Composites of HomeErasIcons.swift (gameBubbles, walletCards, calcKey,
//   calcSign) take `edge` (the tile edge the fractions are of) instead of a
//   square: their pieces are fixed fractions of the tile.

/** Line height of a SwiftUI Text in SF (CoreText ascender 0.9668 +
 *  descender 0.2109), per point of font size. Use it for VStack maths: a
 *  Text is size * lineHeightSF tall (SwiftUI then rounds that to the pixel
 *  grid, which can move stacked text by a fraction of a point). */
export const lineHeightSF = 1.178

/** Font.Weight as a CSS weight. */
export const weight = {
  ultraLight: 100,
  thin: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 800,
  black: 900,
} as const

const rot =(d: number, x: number, y: number) => (d ? `transform="rotate(${f(d)} ${f(x)} ${f(y)})"` : '')

// ---- shapes

/** BubbleShape: a chat bubble, a rounded body (top 82% of the frame,
 *  continuous corners) with a tail off the lower left. `roundness` 0 is the
 *  squarer 2007 bubble, 1 the rounder iOS 7 one. `tailOverlap` is Swift's
 *  hard-coded 1 pt the tail reaches up into the body (in your units; at
 *  a 60 pt tile that is ~1.7 in the 100 box). As in SwiftUI, that overlap
 *  strip is a hole under the nonzero rule; pass 0 to close it. */
export function bubbleShapePath(cx: number, cy: number, w: number, h: number, roundness = 1, tailOverlap = 1): string {
  const x0 = cx - w / 2
  const y0 = cy - h / 2
  const bodyH = h * 0.82
  const body = rrectPath(cx, y0 + bodyH / 2, w, bodyH, bodyH * (0.34 + 0.16 * roundness), true)
  const bodyMaxY = y0 + bodyH
  const maxY = y0 + h
  const P = (x: number, y: number) => `${f(x)},${f(y)}`
  const tail =
    `M${P(x0 + w * 0.2, bodyMaxY - tailOverlap)} ` +
    `Q${P(x0 + w * 0.2, maxY - h * 0.04)} ${P(x0 + w * 0.08, maxY)} ` +
    `Q${P(x0 + w * 0.3, maxY - h * 0.02)} ${P(x0 + w * 0.42, bodyMaxY - tailOverlap)} Z`
  return `${body} ${tail}`
}

/** EnvelopeFlap: an open V from the top corners down to 58% of the height
 *  at the middle. Stroke it (fill="none"), or fill it as a triangle. */
export function envelopeFlapPath(cx: number, cy: number, w: number, h: number): string {
  const x0 = cx - w / 2
  const y0 = cy - h / 2
  return `M${f(x0)},${f(y0)} L${f(cx)},${f(y0 + h * 0.58)} L${f(x0 + w)},${f(y0)}`
}

/** GearShape: `teeth` flat-topped teeth round a hub, a polygon of teeth*4
 *  points (two on the tooth, two in the gap). Outer radius is half the
 *  shorter side; `depth` is the tooth depth as a share of that radius. */
export function gearShapePath(cx: number, cy: number, w: number, h: number, teeth = 12, depth = 0.16): string {
  const outer = Math.min(w, h) / 2
  const inner = outer * (1 - depth)
  const steps = teeth * 4
  let d = ''
  for (let step = 0; step < steps; step++) {
    const a = (step / steps) * 2 * Math.PI
    const r = step % 4 < 2 ? outer : inner
    d += `${step === 0 ? 'M' : 'L'}${f(cx + Math.cos(a) * r)},${f(cy + Math.sin(a) * r)} `
  }
  return d + 'Z'
}

/** PinShape: a map pin, a ball (diameter w, at the top) on a tapering stem
 *  down to the bottom middle. The stem's top overlaps the ball; as in
 *  SwiftUI that sliver is a hole under the nonzero rule. */
export function pinShapePath(cx: number, cy: number, w: number, h: number): string {
  const y0 = cy - h / 2
  const headMaxY = y0 + w
  return (
    `${ellipsePath(cx, y0 + w / 2, w, w)} ` +
    `M${f(cx - w * 0.12)},${f(headMaxY - w * 0.1)} L${f(cx)},${f(y0 + h)} L${f(cx + w * 0.12)},${f(headMaxY - w * 0.1)} Z`
  )
}

/** NeedleShape: a long diamond touching the middle of each side. */
export function needleShapePath(cx: number, cy: number, w: number, h: number): string {
  return `M${f(cx)},${f(cy - h / 2)} L${f(cx + w / 2)},${f(cy)} L${f(cx)},${f(cy + h / 2)} L${f(cx - w / 2)},${f(cy)} Z`
}

// ---- views

/** TickRing: `count` capsule ticks round the edge of the square, each
 *  `length` long and `width` wide (fractions of size), outer ends touching
 *  the edge, the first at 12 o'clock. Defaults: length 0.08, width 0.012. */
export function tickRing(k: Kit, o: { count: number; length?: number; width?: number; ink: string }, size = 100, cx = 50, cy = 50): string {
  const length = o.length ?? 0.08
  const width = o.width ?? 0.012
  const id = k.id('tick')
  k.def(`<path id="${id}" d="${capsulePath(cx, cy - size / 2 + (size * length) / 2, size * width, size * length)}"/>`)
  let out = `<g fill="${o.ink}">`
  for (let i = 0; i < o.count; i++) out += `<use href="#${id}" ${rot((i / o.count) * 360, cx, cy)}/>`
  return out + '</g>'
}

/** CompassArt: a filled face, two tick rings (36 fine, 12 long, inset
 *  5%), and a two-tone needle 0.15 x 0.78 leaning `lean` degrees (default
 *  45) clockwise from vertical: `north` on the upper half, `south` below. */
export function compassArt(
  k: Kit,
  o: { face: string; ticks: string; north: string; south: string; lean?: number },
  size = 100,
  cx = 50,
  cy = 50,
): string {
  const s = size
  const nw = s * 0.15
  const nh = s * 0.78
  const P = (x: number, y: number) => `${f(x)},${f(y)}`
  const north = `M${P(cx, cy - nh / 2)} L${P(cx + nw / 2, cy)} L${P(cx - nw / 2, cy)} Z`
  const south = `M${P(cx + nw / 2, cy)} L${P(cx, cy + nh / 2)} L${P(cx - nw / 2, cy)} Z`
  return (
    circle(cx, cy, s, o.face) +
    tickRing(k, { count: 36, length: 0.06, width: 0.01, ink: o.ticks }, s * 0.9, cx, cy) +
    tickRing(k, { count: 12, length: 0.11, width: 0.016, ink: o.ticks }, s * 0.9, cx, cy) +
    `<g ${rot(o.lean ?? 45, cx, cy)}>${path(north, o.north)}${path(south, o.south)}</g>`
  )
}

/** PinwheelArt: one capsule petal (0.27 x 0.44, centred 0.235 above the
 *  middle) per colour, fanned evenly from 12 o'clock, each at 88% opacity
 *  and multiplied into what is under it (mix-blend-mode: multiply). The
 *  multiply only reaches things drawn in the SAME art layer: draw a white
 *  backing in the art if the petals must multiply with the tile. */
export function pinwheelArt(k: Kit, o: { petals: string[] }, size = 100, cx = 50, cy = 50): string {
  const s = size
  const d = capsulePath(cx, cy - s * 0.235, s * 0.27, s * 0.44)
  return o.petals
    .map((c, i) => path(d, fade(c, 0.88), `${rot((i / o.petals.length) * 360, cx, cy)} style="mix-blend-mode:multiply"`))
    .join('')
}

/** FlowerArt: 16 elliptical petals (0.17 x 0.40, centred 0.27 out; odd
 *  ones turned 6 degrees further), each shaded `petal` at its outer tip to
 *  `petalShade` at its inner end, and a 0.34 centre that darkens from 75%
 *  `centre` in the middle to `centre` at radius 0.16. */
export function flowerArt(k: Kit, o: { petal: string; petalShade: string; centre: string }, size = 100, cx = 50, cy = 50): string {
  const s = size
  const shade = linear(k, [o.petal, o.petalShade])
  let out = ''
  for (let i = 0; i < 16; i++) {
    out += ellipse(cx, cy - s * 0.27, s * 0.17, s * 0.4, shade, rot((i / 16) * 360 + (i % 2 ? 6 : 0), cx, cy))
  }
  return out + circle(cx, cy, s * 0.34, radial(k, [fade(o.centre, 0.75), o.centre], [0.5, 0.5], 0.16 / 0.34))
}

/** LensArt: a camera lens head-on. A barrel disc (75% `barrel` at the top
 *  to `barrel`), a black 85% disc inset 10%, glass (radial `glass` to black
 *  from 40%/35%, radius 0.36) inset 17%, and a blurred 0.10 catch-light up
 *  and left. */
export function lensArt(k: Kit, o: { barrel: string; glass: string; glint: string }, size = 100, cx = 50, cy = 50): string {
  const s = size
  return (
    circle(cx, cy, s, linear(k, [fade(o.barrel, 0.75), o.barrel])) +
    circle(cx, cy, s * 0.8, 'rgba(0,0,0,0.85)') +
    circle(cx, cy, s * 0.66, radial(k, [o.glass, '#000'], [0.4, 0.35], 0.36 / 0.66)) +
    circle(cx - s * 0.11, cy - s * 0.12, s * 0.1, o.glint, `filter="${blur(k, s * 0.012)}"`)
  )
}

/** ClockArt: ten past ten. A `face` disc, 12 ticks (0.07 x 0.022, inset
 *  6%) and hour/minute capsule hands in `ink`, a long thin `second` hand
 *  pointing down with a `second` hub. */
export function clockArt(k: Kit, o: { face: string; ink: string; second: string }, size = 100, cx = 50, cy = 50): string {
  const s = size
  const hand = (w: number, h: number, off: number, deg: number, fill: string) =>
    path(capsulePath(cx, cy - s * off, s * w, s * h), fill, rot(deg, cx, cy))
  return (
    circle(cx, cy, s, o.face) +
    tickRing(k, { count: 12, length: 0.07, width: 0.022, ink: o.ink }, s * 0.88, cx, cy) +
    hand(0.045, 0.27, 0.115, -55, o.ink) +
    hand(0.032, 0.38, 0.17, 60, o.ink) +
    hand(0.014, 0.46, 0.13, 180, o.second) +
    circle(cx, cy, s * 0.05, o.second)
  )
}

/** CalendarArt: a page (fills the square) with a weekday over a big "9".
 *  `flat` 0 sets the weekday in `headerInk` on a filled `header` strip
 *  (top 30%, 2007); 1 fades the strip and sets the weekday in `header`
 *  colour on the page (iOS 7). The weekday is 0.15 of size (0.17 if 3
 *  letters or fewer) at `weekdayWeight` (default 500), 8% from the top; the
 *  date is 0.62 at `dateWeight`, tucked 3% up under it. Weights are CSS
 *  numbers (see `weight`). */
export function calendarArt(
  k: Kit,
  o: {
    header: string
    headerInk: string
    page: string
    dateInk: string
    flat: number
    dateWeight: number
    weekday?: string
    weekdayWeight?: number
  },
  size = 100,
  cx = 50,
  cy = 50,
): string {
  const s = size
  const top = cy - s / 2
  const weekday = o.weekday ?? 'Tuesday'
  const ws = s * (weekday.length > 3 ? 0.15 : 0.17)
  const ds = s * 0.62
  const wy = top + s * 0.08 + (ws * lineHeightSF) / 2
  const dy = top + s * 0.08 + ws * lineHeightSF - s * 0.03 + (ds * lineHeightSF) / 2
  const strip = 1 - o.flat
  return (
    rect(cx, cy, s, s, o.page) +
    (strip > 0.001 ? rect(cx, top + s * 0.15, s, s * 0.3, o.header, strip < 1 ? `opacity="${f(strip)}"` : '') : '') +
    text(weekday, cx, wy, ws, { fill: o.flat > 0.5 ? o.header : o.headerInk, weight: o.weekdayWeight ?? weight.medium }) +
    text('9', cx, dy, ds, { fill: o.dateInk, weight: o.dateWeight })
  )
}

/** NotepadArt: `paper` filling the square, a `binding` band across the
 *  top (`bandHeight`, default 0.26), and `rules` (default 5) full-width
 *  lines 0.012 thick starting 0.14 below the band, 0.13 apart (0.22 when
 *  there are two or fewer). */
export function notepadArt(
  k: Kit,
  o: { binding: string; paper: string; rule: string; bandHeight?: number; rules?: number },
  size = 100,
  cx = 50,
  cy = 50,
): string {
  const s = size
  const top = cy - s / 2
  const band = o.bandHeight ?? 0.26
  const rules = o.rules ?? 5
  const lh = s * 0.012
  const gap = s * (rules > 2 ? 0.13 : 0.22)
  let out = rect(cx, cy, s, s, o.paper)
  for (let i = 0; i < rules; i++) out += rect(cx, top + s * (band + 0.14) + i * (lh + gap) + lh / 2, s, lh, o.rule)
  return out + rect(cx, top + (s * band) / 2, s, s * band, o.binding)
}

/** MapArt: `land` filling the square, a `park` block low left (it runs
 *  past the left edge, unclipped, as in Swift), a road at -28 degrees and a
 *  highway at 22 degrees (both 1.6 long), and a marker. `marker` 0 is the
 *  red 2007 pushpin (PinShape in `pin`, with a soft shadow) up and left; 1
 *  is the iOS 7 location dot (white ring, `pin` disc, white arrow) down and
 *  right, growing from 60% as it fades in. */
export function mapArt(
  k: Kit,
  o: { land: string; park: string; road: string; highway: string; pin: string; marker?: number },
  size = 100,
  cx = 50,
  cy = 50,
): string {
  const s = size
  const marker = o.marker ?? 0
  let out =
    rect(cx, cy, s, s, o.land) +
    rect(cx - s * 0.3, cy + s * 0.32, s * 0.5, s * 0.42, o.park) +
    rect(cx, cy + s * 0.1, s * 1.6, s * 0.09, o.road, rot(-28, cx, cy + s * 0.1)) +
    rect(cx + s * 0.14, cy, s * 0.15, s * 1.6, o.highway, rot(22, cx + s * 0.14, cy))
  if (marker < 0.999) {
    const pin = pinShapePath(cx - s * 0.18, cy - s * 0.17, s * 0.17, s * 0.36)
    const op = marker > 0.001 ? ` opacity="${f(1 - marker)}"` : ''
    out += path(pin, o.pin, `filter="${shadow(k, 'rgba(0,0,0,0.3)', s * 0.015, 0, s * 0.01)}"${op}`)
  }
  if (marker > 0.001) {
    const mx = cx + s * 0.16
    const my = cy + s * 0.14
    // SwiftUI fades each part of the ZStack separately, so mid-fade the
    // blue disc shows through the arrow and the white ring through both.
    const op = marker < 0.999 ? `opacity="${f(marker)}"` : ''
    const dot =
      circle(mx, my, s * 0.3, '#fff', op) +
      circle(mx, my, s * 0.24, o.pin, op) +
      `<g ${op}>${symbol('location.north.fill', '#fff', s * 0.12, mx, my)}</g>`
    out += place(dot, { scale: 0.6 + 0.4 * marker, pivot: [cx, cy] })
  }
  return out
}

/** WeatherArt: a `sun` disc (0.44; 0.36 up and left when there is a
 *  `temperature`) and a three-part `cloud` (a 0.56 x 0.22 capsule under two
 *  circles) that slides in as `cloudy` goes 0 -> 1, pushing the sun up and
 *  away. `temperature` (e.g. "73°") is set bold white, 0.30, low right,
 *  with a hard shadow above it. `sunOnRight` mirrors the layout (iOS 15).
 *  Like SwiftUI, the cloud's opacity applies to each part, so a
 *  translucent cloud is denser where its parts overlap. */
export function weatherArt(
  k: Kit,
  o: { sun: string; cloud: string; cloudy: number; temperature?: string; sunOnRight?: boolean },
  size = 100,
  cx = 50,
  cy = 50,
): string {
  const s = size
  const flip = o.sunOnRight ? -1 : 1
  const hasTemp = o.temperature !== undefined
  const sun = s * (hasTemp ? 0.36 : 0.44)
  let out = circle(
    cx - s * 0.1 * o.cloudy * flip - s * (hasTemp ? 0.18 : 0),
    cy - s * 0.08 * o.cloudy - s * (hasTemp ? 0.16 : 0),
    sun,
    o.sun,
  )
  if (o.cloudy > 0.001) {
    const gx = cx + s * 0.08 * flip
    const gy = cy + s * 0.12
    const op = o.cloudy < 0.999 ? `opacity="${f(o.cloudy)}"` : ''
    out +=
      capsule(gx, gy + s * 0.07, s * 0.56, s * 0.22, o.cloud, op) +
      circle(gx - s * 0.1, gy, s * 0.26, o.cloud, op) +
      circle(gx + s * 0.08, gy - s * 0.05, s * 0.34, o.cloud, op)
  }
  if (hasTemp) {
    out += text(o.temperature!, cx + s * 0.12, cy + s * 0.2, s * 0.3, {
      weight: weight.bold,
      fill: '#fff',
      extra: `filter="${shadow(k, 'rgba(0,0,0,0.35)', 0, 0, -s * 0.012)}"`,
    })
  }
  return out
}

/** TelevisionArt: a tube TV. A 0.82 x 0.62 `cabinet` (continuous corner
 *  0.12), a 0.56 x 0.46 `screen` (corner 0.10) left of centre, and two
 *  0.09 `trim` dials stacked on the right. */
export function televisionArt(k: Kit, o: { cabinet: string; screen: string; trim: string }, size = 100, cx = 50, cy = 50): string {
  const s = size
  return (
    rrect(cx, cy, s * 0.82, s * 0.62, s * 0.12, o.cabinet, '', true) +
    rrect(cx - s * 0.09, cy, s * 0.56, s * 0.46, s * 0.1, o.screen, '', true) +
    circle(cx + s * 0.29, cy - s * 0.075, s * 0.09, o.trim) +
    circle(cx + s * 0.29, cy + s * 0.075, s * 0.09, o.trim)
  )
}

/** StickLetterA: an A of three capsules `weight` thick (default 0.075):
 *  two 0.62 legs leaning 30 degrees, 0.10 either side of centre, and a 0.62
 *  crossbar 0.14 below centre. */
export function stickLetterA(k: Kit, o: { ink: string; weight?: number }, size = 100, cx = 50, cy = 50): string {
  const s = size
  const w = s * (o.weight ?? 0.075)
  return (
    capsule(cx - s * 0.1, cy, w, s * 0.62, o.ink, rot(30, cx - s * 0.1, cy)) +
    capsule(cx + s * 0.1, cy, w, s * 0.62, o.ink, rot(-30, cx + s * 0.1, cy)) +
    capsule(cx, cy + s * 0.14, s * 0.62, w, o.ink)
  )
}

/** RocketArt: a 0.26 x 0.62 capsule `body` with a 0.12 `window`, turned 45
 *  degrees to point up and right. Faithful to the Swift, the two fin Paths
 *  are laid out from the frame's top-left corner (a Path fills the whole
 *  ZStack), so they float near that corner rather than on the body. */
export function rocketArt(k: Kit, o: { body: string; window: string }, size = 100, cx = 50, cy = 50): string {
  const s = size
  const x0 = cx - s / 2
  const y0 = cy - s / 2
  const fin = (dir: number) => {
    const ox = x0 + s * 0.11 * dir
    const oy = y0 + s * 0.06
    return path(`M${f(ox)},${f(oy)} L${f(ox)},${f(oy + s * 0.22)} L${f(ox + s * 0.12 * dir)},${f(oy + s * 0.24)} Z`, o.body)
  }
  return `<g ${rot(45, cx, cy)}>${capsule(cx, cy, s * 0.26, s * 0.62, o.body)}${fin(-1)}${fin(1)}${circle(cx, cy - s * 0.12, s * 0.12, o.window)}</g>`
}

/** ButterflyArt: up to four wings, in order upper-left, upper-right,
 *  lower-left, lower-right. Upper wings 0.30 x 0.34 (outer corners 0.24,
 *  inner 0.06) tilted 18 degrees out; lower 0.30 x 0.26 (outer corners
 *  0.20) tilted 12 degrees; all continuous, 0.18 either side of the seam. */
export function butterflyArt(k: Kit, o: { wings: string[] }, size = 100, cx = 50, cy = 50): string {
  const s = size
  return o.wings
    .slice(0, 4)
    .map((colour, i) => {
      const upper = i < 2
      const left = i % 2 === 0
      const outer = s * (upper ? 0.24 : 0.06)
      const lower = s * (upper ? 0.06 : 0.2)
      const wx = cx + s * 0.18 * (left ? -1 : 1)
      const wy = cy + s * (upper ? -0.14 : 0.16)
      const d = rrectPath(wx, wy, s * 0.3, s * (upper ? 0.34 : 0.26), [outer, outer, lower, lower], true)
      return path(d, colour, rot((upper ? -18 : 12) * (left ? 1 : -1), wx, wy))
    })
    .join('')
}

/** KeysArt: up to three key.fill glyphs (0.58) fanned -25, 0, +25 degrees,
 *  0.14 apart left to right. */
export function keysArt(k: Kit, o: { colours: string[] }, size = 100, cx = 50, cy = 50): string {
  const s = size
  return o.colours
    .slice(0, 3)
    .map((c, i) => symbol('key.fill', c, s * 0.58, cx + s * (-0.14 + 0.14 * i), cy, -25 + 25 * i))
    .join('')
}

/** QuadrantArt: four colours filling the square's quarters (reading
 *  order), parted by 0.012 seams of `seam` (default black at 50%). */
export function quadrantArt(k: Kit, o: { colours: [string, string, string, string]; seam?: string }, size = 100, cx = 50, cy = 50): string {
  const s = size
  const gap = s * 0.012
  const q = (s - gap) / 2
  const off = (q + gap) / 2
  return (
    rect(cx, cy, s, s, o.seam ?? 'rgba(0,0,0,0.5)') +
    rect(cx - off, cy - off, q, q, o.colours[0]) +
    rect(cx + off, cy - off, q, q, o.colours[1]) +
    rect(cx - off, cy + off, q, q, o.colours[2]) +
    rect(cx + off, cy + off, q, q, o.colours[3])
  )
}

/** SiriOrbArt (iOS 27 Siri): a chrome sphere, dark above a bright horizon
 *  just below the middle and silver under it, ringed by a 0.035 band of the
 *  Siri colours (an angular gradient from 3 o'clock) at 55%. */
export function siriOrbArt(k: Kit, size = 100, cx = 50, cy = 50): string {
  const s = size
  const c = (r: number, g: number, b: number) => inkCSS({ r, g, b, a: 1 })
  const body = linear(k, [
    [c(0.23, 0.24, 0.25), 0],
    [c(0.34, 0.35, 0.36), 0.44],
    [c(0.99, 1.0, 1.0), 0.5],
    [c(0.67, 0.7, 0.75), 0.56],
    [c(0.96, 0.96, 0.97), 1],
  ])
  const pink = c(0.99, 0.45, 0.62)
  const band = angular(k, [pink, c(0.62, 0.42, 0.98), c(0.3, 0.72, 1.0), c(0.99, 0.75, 0.4), pink], cx, cy)
  return circle(cx, cy, s, body) + ring(cx, cy, s, s * 0.035, band, 'opacity="0.55"')
}

// ---- shared composites of HomeErasIcons.swift (fractions of the tile edge)

/** GameBubbles: four 0.36 circles (pink, purple, blue, yellow) at +-0.12
 *  from (cx, cy), each at `alpha` (default 1), later ones on top. */
export function gameBubbles(k: Kit, o: { alpha?: number } = {}, edge = 100, cx = 50, cy = 50): string {
  const a = o.alpha ?? 1
  const d = edge * 0.36
  const o12 = edge * 0.12
  return (
    circle(cx - o12, cy - o12, d, hexColour(0xff2d55, a)) +
    circle(cx + o12, cy - o12, d, hexColour(0xaf52de, a)) +
    circle(cx - o12, cy + o12, d, hexColour(0x5ac8fa, a)) +
    circle(cx + o12, cy + o12, d, hexColour(0xffcc00, a))
  )
}

/** WalletCards: four 0.62 x 0.40 cards (red, green, blue, yellow; corner
 *  0.04) stacked 0.09 apart from 0.16 above centre, and a 0.68 x 0.30
 *  `sleeve` (default 0x2C2C2E, corner 0.05) 0.22 below centre in front. */
export function walletCards(k: Kit, o: { sleeve?: string } = {}, edge = 100, cx = 50, cy = 50): string {
  const cards = [0xff3b30, 0x4cd964, 0x007aff, 0xffcc00]
    .map((c, i) => rrect(cx, cy + edge * (-0.16 + 0.09 * i), edge * 0.62, edge * 0.4, edge * 0.04, hexColour(c), '', true))
    .join('')
  return cards + rrect(cx, cy + edge * 0.22, edge * 0.68, edge * 0.3, edge * 0.05, o.sleeve ?? hexColour(0x2c2c2e), '', true)
}

/** CalcKey: one skeuomorphic calculator key, 0.36 x 0.30 of the tile edge
 *  (continuous corner 0.06) centred at (cx, cy), shaded 85% `colour` to
 *  `colour` top to bottom, with a white calcSign on it. */
export function calcKey(k: Kit, o: { colour: string; sign: string }, edge = 100, cx = 50, cy = 50): string {
  return rrect(cx, cy, edge * 0.36, edge * 0.3, edge * 0.06, linear(k, [fade(o.colour, 0.85), o.colour]), '', true) + calcSign(o.sign, '#fff', edge, cx, cy)
}

/** CalcSign: an operator sign ("+", "−", "×", "÷", "=") in SF medium at
 *  0.2 of the tile edge, centred at (cx, cy). */
export function calcSign(sign: string, ink: string, edge = 100, cx = 50, cy = 50): string {
  return text(sign, cx, cy, edge * 0.2, { fill: ink, weight: weight.medium })
}
