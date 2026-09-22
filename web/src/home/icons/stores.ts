// Port of HomeIcons+Stores.swift: App Store, iTunes, YouTube, Contacts,
// Voice Memos, Game Center, Newsstand, TV. One IconDesign per redesign, with
// the Swift's years, background stops and glyph geometry unchanged. Each
// `art { edge in ... }` is an Art drawing in the 100 x 100 box, so Swift's
// `edge * f` is `100 * f` here; the file-private Swift views and shapes are
// the private functions below, named after them.
//
// Two SwiftUI habits matter here and are handled locally:
// - A Shape filled with a gradient takes the gradient over the Shape's
//   FRAME, not over the painted path. The "cut" slivers of the App Store A,
//   for instance, are strokes whose frame is the whole tile, so their
//   top-to-bottom gradient is the tile's own. spanLinear()/spanRadial() give
//   such gradients in the art's coordinates.
// - Swift's `max(0.5, edge * f)` hairline floors are points; hair() turns
//   them into the 100 box at a 60 pt tile.

import type { Art, HomeAppDef, Kit, Stop } from './kit'
import {
  capsule,
  capsulePath,
  circle,
  clip,
  design,
  ellipse,
  ellipsePath,
  era,
  fade,
  flat,
  gradientStops,
  hex,
  linear,
  mask,
  path,
  quadrantArt,
  rect,
  ring,
  rrect,
  rrectPath,
  shadow,
  symbol,
  text,
  weight,
} from './kit'

// ---------------------------------------------------------------- local helpers

type Pt = [number, number]

const n = (v: number) => +v.toFixed(3)

/** Swift's `max(0.5, x)` (or `max(floor, x)`) in points, in the 100 box of a 60 pt tile. */
const hair = (v: number, floorPt = 0.5) => Math.max((floorPt * 100) / 60, v)

/** A LinearGradient over an explicit span in the art's coordinates
 *  (userSpaceOnUse), blended like SwiftUI (Oklab, see kit.gradientStops). */
function spanLinear(k: Kit, list: Array<Stop | string>, x1: number, y1: number, x2: number, y2: number): string {
  const id = k.id('sl')
  k.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}">${gradientStops(list)}</linearGradient>`,
  )
  return `url(#${id})`
}

/** A RadialGradient with an absolute centre and end radius, in the art's coordinates. */
function spanRadial(k: Kit, list: Array<Stop | string>, cx: number, cy: number, r: number): string {
  const id = k.id('sr')
  k.def(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}">${gradientStops(list)}</radialGradient>`)
  return `url(#${id})`
}

/** UnevenRoundedRectangle(style: .continuous) as path data: [tl, tr, br, bl].
 *  Unlike kit.rrectPath, which clamps every radius to half the shorter side,
 *  a radius is kept while the corners on each edge fit it, as SwiftUI does
 *  (the 2008 bust's shoulders are 38 x 12.5 with top radii 11: iOS draws
 *  them at 11). The corner is kit.rrectPath's CoreGraphics curve: three
 *  cubics, the outer two shortening when an edge is short. */
function unevenPath(cx: number, cy: number, w: number, h: number, radii: [number, number, number, number]): string {
  const CONT = 1.52866
  const c1 = (l: number) => 0.96 + 0.24305 * (l - 1)
  const c2 = (l: number) => 0.82 + 0.091572 * (l - 1)
  const [tl, tr, br, bl] = radii.map((r) => Math.min(Math.max(0, r), Math.min(w, h)))
  const reach = (edge: number, a: number, b: number) => (a + b > 0 ? Math.min(CONT, edge / (a + b)) : CONT)
  const top = reach(w, tl, tr)
  const right = reach(h, tr, br)
  const bottom = reach(w, br, bl)
  const left = reach(h, bl, tl)
  const P = (x: number, y: number) => `${n(x)},${n(y)}`
  const x0 = cx - w / 2
  const y0 = cy - h / 2
  const x1 = x0 + w
  const y1 = y0 + h
  const corner = (px: number, py: number, ax: number, ay: number, bx: number, by: number, r: number, la: number, lb: number) => {
    const at = (u: number, v: number) => P(px + (ax * u + bx * v) * r, py + (ay * u + by * v) * r)
    if (r <= 0) return { start: P(px, py), body: '' }
    return {
      start: at(la, 0),
      body:
        `C${at(c1(la), 0)} ${at(c2(la), 0)} ${at(0.63149, 0.07491)} ` +
        `C${at(0.37282, 0.16906)} ${at(0.16906, 0.37282)} ${at(0.07491, 0.63149)} ` +
        `C${at(0, c2(lb))} ${at(0, c1(lb))} ${at(0, lb)} `,
    }
  }
  const cTR = corner(x1, y0, -1, 0, 0, 1, tr, top, right)
  const cBR = corner(x1, y1, 0, -1, -1, 0, br, right, bottom)
  const cBL = corner(x0, y1, 1, 0, 0, -1, bl, bottom, left)
  const cTL = corner(x0, y0, 0, 1, 1, 0, tl, left, top)
  const endTR = tr > 0 ? P(x1, y0 + right * tr) : P(x1, y0)
  return `M${endTR} L${cBR.start} ${cBR.body}L${cBL.start} ${cBL.body}L${cTL.start} ${cTL.body}L${cTR.start} ${cTR.body}Z`
}

/** A rectangle as path data, wound clockwise like CoreGraphics. */
const rectD = (x: number, y: number, w: number, h: number) => `M${n(x)},${n(y)} h${n(w)} v${n(h)} h${n(-w)} Z `

/** StoresStroke: a straight line between two points given as shares of the
 *  tile, `width` a share of the tile, round- or square-ended. */
function stroke(a: Pt, b: Pt, width: number, paint: string, round = true, extra = ''): string {
  return `<path d="M${n(a[0] * 100)},${n(a[1] * 100)} L${n(b[0] * 100)},${n(b[1] * 100)}" fill="none" stroke="${paint}" stroke-width="${n(width * 100)}" stroke-linecap="${round ? 'round' : 'butt'}" ${extra}/>`
}

/** The outline of a round-capped StoresStroke (a stadium), as path data, for
 *  when the stroke itself is filled with glass and outlined. */
function stadium(a: Pt, b: Pt, width: number): string {
  const ax = a[0] * 100
  const ay = a[1] * 100
  const bx = b[0] * 100
  const by = b[1] * 100
  const len = Math.hypot(bx - ax, by - ay)
  const ux = (bx - ax) / len
  const uy = (by - ay) / len
  const r = (width * 100) / 2
  const vx = -uy * r
  const vy = ux * r
  const P = (x: number, y: number) => `${n(x)},${n(y)}`
  const arc = `A${n(r)},${n(r)} 0 0 0`
  return `M${P(ax + vx, ay + vy)} L${P(bx + vx, by + vy)} ${arc} ${P(bx - vx, by - vy)} L${P(ax - vx, ay - vy)} ${arc} ${P(ax + vx, ay + vy)} Z`
}

/** storesPoint(on:_:y:): the point at height `y` on the line through a and b. */
function pointAt(a: Pt, b: Pt, y: number): Pt {
  const t = (y - a[1]) / (b[1] - a[1])
  return [a[0] + (b[0] - a[0]) * t, y]
}

/** StoresAlong: lays a vertical drawing (made in a w x l box, top-left at
 *  0,0) along the line from `a` (its top) to `b` (its bottom). */
function along(a: Pt, b: Pt, width: number, content: (w: number, l: number) => string): string {
  const dx = (b[0] - a[0]) * 100
  const dy = (b[1] - a[1]) * 100
  const l = Math.hypot(dx, dy)
  const w = width * 100
  const deg = (Math.atan2(-dx, dy) * 180) / Math.PI
  const mx = (a[0] + b[0]) * 50
  const my = (a[1] + b[1]) * 50
  return `<g transform="translate(${n(mx)} ${n(my)}) rotate(${n(deg)}) translate(${n(-w / 2)} ${n(-l / 2)})">${content(w, l)}</g>`
}

/** Text in any font stack, centred on (cx, cy) like a SwiftUI Text. `squeeze`
 *  narrows it horizontally (SF's `.width(.condensed)`, which the web's
 *  system font cannot be relied on to have). */
function word(
  str: string,
  cx: number,
  cy: number,
  size: number,
  fill: string,
  fontWeight: number,
  family: string,
  squeeze = 1,
): string {
  const fam = family.replace(/'/g, '&apos;')
  const tr = squeeze !== 1 ? ` transform="translate(${n(cx)} 0) scale(${squeeze} 1) translate(${n(-cx)} 0)"` : ''
  return `<text x="${n(cx)}" y="${n(cy)}" text-anchor="middle" dominant-baseline="central" font-family="${fam}" font-size="${n(size)}" font-weight="${fontWeight}" fill="${fill}"${tr}>${str}</text>`
}

const systemFont = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif`
const serifFont = `ui-serif, 'New York', Georgia, 'Times New Roman', serif`

// ---------------------------------------------------------------- shared bits

/** StoresGlow: a soft radial pool of colour over the whole tile, `radius` a
 *  share of the edge. */
function glow(k: Kit, colour: string, centre: Pt, radius: number): string {
  return rect(50, 50, 100, 100, spanRadial(k, [colour, fade(colour, 0)], centre[0] * 100, centre[1] * 100, radius * 100))
}

/** StoresSunburst / StoresRaysShape: sixteen faint 8-degree rays from a centre. */
function sunburst(centre: Pt, ink: string): string {
  const cx = centre[0] * 100
  const cy = centre[1] * 100
  const length = 90
  const half = (4 * Math.PI) / 180
  let d = ''
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * 2 * Math.PI + Math.PI / 16
    d +=
      `M${n(cx)},${n(cy)} L${n(cx + Math.cos(a - half) * length)},${n(cy + Math.sin(a - half) * length)} ` +
      `L${n(cx + Math.cos(a + half) * length)},${n(cy + Math.sin(a + half) * length)} Z `
  }
  return path(d, ink)
}

/** StoresTicksShape (horizontal): `count` thin vertical marks across a box. */
function ticksD(x0: number, y0: number, w: number, h: number, count: number): string {
  let d = ''
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count
    d += rectD(x0 + w * t - w * 0.02, y0, hair(w * 0.04, 0.6), h)
  }
  return d
}

// ---------------------------------------------------------------- App Store

/** StoresAppStoreClassic (2008-2012): the sunburst tile with the tools A in a
 *  ring a little above centre. */
function appStoreClassic(k: Kit, retina: boolean): string {
  const centre: Pt = [0.5, 0.475]
  return (
    glow(k, hex(retina ? 0x6dd8ee : 0x52b6e6), [0.5, 1], retina ? 0.6 : 0.5) +
    sunburst(centre, hex(0xffffff, retina ? 0.2 : 0.12)) +
    toolsA(k, {
      centre,
      scale: 0.75,
      ring: retina ? 0.645 : 0.64,
      ringStroke: retina ? 0.044 : 0.056,
      tool: retina ? 0.054 : 0.06,
      ruler: retina ? 0.066 : 0.072,
      detail: hex(0x3c78d6),
      cutTop: hex(0x2350c8),
      cutBottom: hex(0x2350c8),
      glossy: true,
      ticks: !retina,
    })
  )
}

interface ToolsOptions {
  centre?: Pt
  scale?: number
  ring: number
  ringStroke: number
  tool: number
  ruler: number
  ink?: string
  detail: string
  cutTop: string
  cutBottom: string
  glossy?: boolean
  ticks?: boolean
}

/** StoresToolsA (2008-2016): a pencil for the left leg, a paintbrush for the
 *  right, a ruler for the crossbar, in a ring. The iOS 7 icon's geometry;
 *  `scale` shrinks it about `centre`. Pencil and brush are cut free of the
 *  ruler by slivers of the background gradient. */
function toolsA(k: Kit, o: ToolsOptions): string {
  const [ox, oy] = o.centre ?? [0.496, 0.49]
  const s = o.scale ?? 1
  const ink = o.ink ?? '#fff'
  const p = (x: number, y: number): Pt => [ox + (x - 0.496) * s, oy + (y - 0.49) * s]
  const pencilTop = p(0.455, 0.334)
  const pencilTip = p(0.262, 0.683)
  const brushTop = p(0.497, 0.262)
  const brushTip = p(0.724, 0.683)
  const bar = p(0.4955, 0.5)
  const barWidth = 0.525 * s
  const above = bar[1] - o.ruler / 2 - 0.014
  const below = bar[1] + o.ruler / 2 + 0.014
  const cut = spanLinear(k, [o.cutTop, o.cutBottom], 0, 0, 0, 100)
  const cutWidth = o.tool + (o.glossy ? 0.024 : 0.04)
  const lead = o.glossy ? hex(0x1d3f8f) : undefined
  return (
    ring(ox * 100, oy * 100, o.ring * 100, o.ringStroke * 100, ink) +
    ruler(bar[0] * 100, bar[1] * 100, barWidth * 100, o.ruler * 100, ink, o.detail, o.ticks ?? false) +
    stroke(pointAt(pencilTop, pencilTip, above), pointAt(pencilTop, pencilTip, below), cutWidth, cut, false) +
    stroke(pointAt(brushTop, brushTip, above), pointAt(brushTop, brushTip, below), cutWidth, cut, false) +
    along(pencilTop, pencilTip, o.tool, (w, l) => pencil(w, l, ink, o.detail, lead)) +
    along(brushTop, brushTip, o.tool, (w, l) => brush(w, l, ink, o.detail))
  )
}

/** StoresRuler: a continuous rounded bar; the 2008 one has nine ticks along
 *  its lower edge. */
function ruler(cx: number, cy: number, w: number, h: number, ink: string, detail: string, ticks: boolean): string {
  let out = rrect(cx, cy, w, h, h * 0.15, ink, '', true)
  if (ticks) out += path(ticksD(cx - w / 2 + h / 2, cy + h / 2 - h * 0.3, w - h, h * 0.3, 9), fade(detail, 0.8))
  return out
}

/** StoresPencil, in a w x l box: round eraser end, two ferrule lines, a
 *  sharpened cone, and on the glossy icons a dark lead at the point. */
function pencil(w: number, l: number, ink: string, detail: string, lead?: string): string {
  const body = rrectPath(w / 2, l * 0.375, w, l * 0.75, [w / 2, w / 2, 0, 0], true) + ` M0,${n(l * 0.75)} L${n(w)},${n(l * 0.75)} L${n(w / 2)},${n(l)} Z`
  const b = hair(l * 0.03)
  let out = path(body, ink) + path(rectD(0, l * 0.14, w, b) + rectD(0, l * 0.75 - b, w, b), detail)
  if (lead) out += path(`M${n(w * 0.33)},${n(l * 0.915)} L${n(w * 0.67)},${n(l * 0.915)} L${n(w / 2)},${n(l)} Z`, lead)
  return out
}

/** StoresBrush, in a w x l box, handle end up: a long handle, a ferrule line,
 *  a metal ferrule, a tuft of bristles that flicks to one side. */
function brush(w: number, l: number, ink: string, detail: string): string {
  const line = hair(l * 0.022)
  const total = l * 0.64 + line + l * 0.11 + l * 0.228
  let y = (l - total) / 2
  const cx = w / 2
  const handle = rrectPath(cx, y + l * 0.32, w * 0.9, l * 0.64, [w * 0.45, w * 0.45, 0, 0], true)
  y += l * 0.64
  const ferruleLine = rect(cx, y + line / 2, w * 1.1, line, detail)
  y += line
  const ferrule = rectD(cx - w * 0.55, y, w * 1.1, l * 0.11)
  y += l * 0.11
  const bw = w * 1.4
  const bh = l * 0.228
  const bx = cx - bw / 2
  const bristle =
    `M${n(bx + bw * 0.1)},${n(y)} L${n(bx + bw * 0.9)},${n(y)} ` +
    `Q${n(bx + bw * 1.08)},${n(y + bh * 0.62)} ${n(bx + bw * 0.72)},${n(y + bh)} ` +
    `Q${n(bx - bw * 0.12)},${n(y + bh * 0.5)} ${n(bx + bw * 0.1)},${n(y)} Z`
  return path(`${handle} ${ferrule}${bristle}`, ink) + ferruleLine
}

type StickLook = 'solid' | 'glass' | 'clear'

/** StoresSticksA (2017+): three round-ended sticks. Solid: white, with
 *  slivers of the tile gradient where one passes over the next. Glass
 *  (iOS 26) and clear (iOS 27): whole frosted sticks with a shadow and a
 *  white rim, brighter where they overlap. */
function sticksA(k: Kit, look: StickLook, top: string, bottom: string): string {
  const sticks: Array<[Pt, Pt, number]> = [
    [[0.437, 0.215], [0.748, 0.755], 0.085],
    [[0.558, 0.215], [0.252, 0.755], 0.085],
    [[0.19, 0.617], [0.805, 0.617], 0.072],
  ]
  if (look === 'solid') {
    const background = spanLinear(k, [top, bottom], 0, 0, 0, 100)
    return (
      sticks.map(([a, b, w]) => stroke(a, b, w, '#fff')).join('') +
      // "/" over "\" just below the crossing; the crossbar over the "/" leg; "\" over the crossbar.
      stroke([0.58, 0.291], [0.516, 0.405], 0.03, background, false) +
      stroke([0.22, 0.668], [0.38, 0.668], 0.03, background, false) +
      stroke([0.576, 0.572], [0.66, 0.72], 0.03, background, false)
    )
  }
  const glass = look === 'glass'
  const fill = glass
    ? spanLinear(k, [hex(0xffffff, 0.8), hex(0xb6e2fe, 0.7)], 0, 0, 0, 100)
    : spanLinear(k, [hex(0xf4fafd, 0.72), hex(0xd2e8f8, 0.6)], 0, 0, 0, 100)
  const drop = shadow(k, hex(0x000000, glass ? 0.16 : 0.14), 1.8, 0, 1.2)
  const rim = hex(0xffffff, glass ? 0.6 : 0.7)
  return sticks
    .map(([a, b, w]) => {
      const d = stadium(a, b, w)
      return path(d, fill, `filter="${drop}"`) + path(d, 'none', `stroke="${rim}" stroke-width="${n(hair(0.7))}"`)
    })
    .join('')
}

// ---------------------------------------------------------------- iTunes

/** StoresITunesClassic (2007-2012): the purple sunburst, a ring, and a down
 *  arrow (1.1) or the beamed notes. */
function iTunesClassic(k: Kit, arrow: boolean, retina: boolean): string {
  const centre: Pt = [0.5, 0.475]
  let out =
    glow(k, hex(retina ? 0xcf74d4 : 0xb85cc2), [0.5, 1], retina ? 0.5 : 0.42) +
    sunburst(centre, hex(0xffffff, retina ? 0.14 : 0.09)) +
    ring(50, 47.5, 64.5, retina ? 4.2 : 5.2, '#fff')
  if (arrow) out += path(downArrowD(34, 30.5, 32, 36), '#fff')
  else out += path(noteD(0.74, [0.52, 0.48]), '#fff') + noteHeads(0.74, [0.52, 0.48], 1, '#fff')
  return out
}

type NoteVariant = 'ios7' | 'ios71' | 'ios9'

/** StoresITunesFlat (2013-2016): a thin ring and a big pair of beamed notes. */
function iTunesFlat(variant: NoteVariant): string {
  const scale = variant === 'ios71' ? 0.95 : 1
  const rise = variant === 'ios9' ? 0.062 : 0.047
  const head = variant === 'ios9' ? 1.07 : 1
  return ring(49.85, 49.2, 85, 3.6, '#fff') + path(noteD(scale, [0.49, 0.49], rise), '#fff') + noteHeads(scale, [0.49, 0.49], head, '#fff')
}

/** StoresDownArrow in an x0, y0, w, h box: a shaft and a wide head. */
function downArrowD(x0: number, y0: number, w: number, h: number): string {
  const P = (x: number, y: number) => `${n(x0 + w * x)},${n(y0 + h * y)}`
  return `M${P(0.32, 0)} L${P(0.68, 0)} L${P(0.68, 0.5)} L${P(1, 0.5)} L${P(0.5, 1)} L${P(0, 0.5)} L${P(0.32, 0.5)} Z`
}

/** StoresNoteShape: both stems and the beam as one outline, the iOS 7 icon's
 *  coordinates shrunk by `scale` about `centre`. */
function noteD(scale = 1, centre: Pt = [0.49, 0.49], beamRise = 0.047, stem = 0.027): string {
  const P = (x: number, y: number) => `${n(100 * (centre[0] + (x - 0.49) * scale))},${n(100 * (centre[1] + (y - 0.49) * scale))}`
  const left = 0.375
  const right = 0.668
  const top = 0.292
  const thickness = 0.098
  const beamBottom = (x: number) => top + thickness - (beamRise * (x - left)) / (right - left)
  return (
    `M${P(left, 0.662)} L${P(left, top)} L${P(right, top - beamRise)} L${P(right, 0.632)} ` +
    `L${P(right - stem, 0.632)} L${P(right - stem, beamBottom(right - stem))} ` +
    `L${P(left + stem, beamBottom(left + stem))} L${P(left + stem, 0.662)} Z`
  )
}

/** StoresNoteHeads: two oval heads tilted 22 degrees anticlockwise at the
 *  foot of each stem. */
function noteHeads(scale: number, centre: Pt, head: number, fill: string): string {
  const w = 2 * 7.7 * head * scale
  const h = 2 * 5.7 * head * scale
  return [
    [0.325, 0.662],
    [0.594, 0.632],
  ]
    .map(([x, y]) => {
      const cx = 100 * (centre[0] + (x - 0.49) * scale)
      const cy = 100 * (centre[1] + (y - 0.49) * scale)
      return ellipse(cx, cy, w, h, fill, `transform="rotate(-22 ${n(cx)} ${n(cy)})"`)
    })
    .join('')
}

/** StoresStarShape: a five-pointed star (inner radius 40%) in a `size`
 *  square, or with `facets` just the clockwise half of each arm. */
function starD(cx: number, cy: number, size: number, facets: boolean): string {
  const outer = size / 2
  const inner = outer * 0.4
  const vertex = (i: number) => {
    const a = (i / 10) * 2 * Math.PI - Math.PI / 2
    const r = i % 2 === 0 ? outer : inner
    return `${n(cx + Math.cos(a) * r)},${n(cy + Math.sin(a) * r)}`
  }
  if (facets) {
    let d = ''
    for (let arm = 0; arm < 5; arm++) d += `M${n(cx)},${n(cy)} L${vertex(arm * 2)} L${vertex(arm * 2 + 1)} Z `
    return d
  }
  let d = `M${vertex(0)}`
  for (let i = 1; i < 10; i++) d += ` L${vertex(i)}`
  return d + ' Z'
}

/** StoresITunesStar (2017+): the star in a 0.74 frame a little below centre,
 *  its arms split light and dark; from iOS 26 frosted, rimmed, shadowed. */
function iTunesStar(k: Kit, fill: string, facet: string, glass: boolean): string {
  const star = starD(50, 53.5, 74, false)
  let out = path(star, fill, glass ? `filter="${shadow(k, hex(0x000000, 0.2), 2.2, 0, 1.6)}"` : '')
  out += path(starD(50, 53.5, 74, true), facet)
  if (glass) out += path(star, 'none', `stroke="rgba(255,255,255,0.65)" stroke-width="${n(hair(0.9))}" stroke-linejoin="round"`)
  return out
}

// ---------------------------------------------------------------- YouTube

/** StoresYouTubeSet: the tube television head on; the tile's gradient is the
 *  walnut cabinet. `dim` darkens it all (iPhone OS 3). */
function youTubeSet(k: Kit, retina: boolean, dim = 0): string {
  const inset = retina ? 0.06 : 0.055
  const bezel = retina
    ? [0xbca56a, 0xd6c18a, 0xe9d6aa, 0xf5e7c4, 0xfbedcb].map((c) => hex(c))
    : [0xc6a157, 0xe3b862, 0xf8cb6d, 0xffd88c, 0xffe1a4].map((c) => hex(c))
  const screen: Stop[] = retina
    ? [
        [hex(0xd8dad3), 0],
        [hex(0xb0b5ab), 0.22],
        [hex(0x9da495), 0.42],
        [hex(0x7f8670), 0.52],
        [hex(0x8b947a), 0.72],
        [hex(0x97a384), 1],
      ]
    : [
        [hex(0xccd1c8), 0],
        [hex(0xa2aa98), 0.28],
        [hex(0x7c8770), 0.45],
        [hex(0x636f54), 0.56],
        [hex(0x6e7c5c), 0.8],
        [hex(0x7f9469), 1],
      ]
  const radius = retina ? 20 : 17
  const sw = retina ? 82 : 80
  const sh = retina ? 64 : 63
  const sy = 50 + (retina ? -6 : -7.5)
  const edgeLine = hair(1.4, 0.6)
  const knobY = 50 + (retina ? 36.5 : 33.5)
  const side = 100 * (1 - 2 * inset)
  let out =
    rrect(50, 50, side, side, 13, linear(k, bezel), '', true) +
    rrect(50, sy, sw, sh, radius, linear(k, screen), '', true) +
    path(rrectPath(50, sy, sw - edgeLine, sh - edgeLine, radius - edgeLine / 2, true), 'none', `stroke="${hex(retina ? 0x4e5248 : 0x444c3a)}" stroke-width="${n(edgeLine)}"`)
  for (const s of [-1, 1]) {
    const kx = 50 + 31.5 * s
    out +=
      circle(kx, knobY, 12.5, hex(retina ? 0xcfcfcf : 0x6c6766)) +
      circle(kx, knobY, 12.5 - 4.4, hex(retina ? 0x262626 : 0x1b1717)) +
      circle(kx, knobY, 3.5, hex(retina ? 0x9a9a9a : 0x5a4a40))
  }
  out += path(grilleD(39, knobY - 4.25, 22, 8.5), hex(retina ? 0x2a2a2a : 0x403838))
  if (dim > 0) out += rect(50, 50, 100, 100, hex(0x000000, dim))
  return out
}

/** StoresGrilleShape: seven round-ended vertical bars, the middle tallest. */
function grilleD(x0: number, y0: number, w: number, h: number): string {
  const heights = [0.4, 0.6, 0.8, 1.0, 0.8, 0.6, 0.4]
  const pitch = w / 7
  return heights
    .map((f, i) => {
      const bw = pitch * 0.4
      return rrectPath(x0 + pitch * i + pitch * 0.3 + bw / 2, y0 + h / 2, bw, h * f, bw / 2, true)
    })
    .join(' ')
}

// ---------------------------------------------------------------- Contacts

/** StoresAddressBook (iPhone OS 2-6): the spiral-bound address book; the
 *  tile's gradient is the cover. */
function addressBook(k: Kit, retina: boolean, dim = 0): string {
  const coils = retina ? 10 : 9
  const pitch = 90 / coils
  let coilD = ''
  for (let i = 0; i < coils; i++) {
    const h = pitch * 0.42
    coilD += rrectPath(-0.25 + 11.5 / 2, 5 + pitch * i + pitch * 0.3 + h / 2, 11.5, h, h / 2, true) + ' '
  }
  const drop = hair(0.8)
  let out =
    // The spine and its wire rings down the left edge (the rings cast a hard shadow).
    rect(6.5, 50, 13, 100, linear(k, [hex(retina ? 0x5e3e18 : 0xb0874f), hex(retina ? 0xa8783c : 0xd4ae78)], [0, 0.5], [1, 0.5])) +
    path(coilD, hex(0x000000, 0.45), `transform="translate(0 ${n(drop)})"`) +
    path(coilD, spanLinear(k, [hex(0xffffff), hex(0xa9a9ac)], 0, 5, 0, 95)) +
    bookTabs(k, retina) +
    bust(hex(retina ? 0x4c2816 : 0x502f1c))
  if (dim > 0) out += rect(50, 50, 100, 100, hex(0x000000, dim))
  return out
}

/** StoresBookTabs: six dark leather thumb tabs down the right edge, lettered
 *  A-F on the Retina book, each with a pale line under it. */
function bookTabs(k: Kit, letters: boolean): string {
  const h = 100 / 6
  const line = hair(0.8)
  let lines = ''
  let out = rect(93.5, 50, 13, 100, linear(k, [hex(0x7a4e2c), hex(0x42240f)], [0, 0.5], [1, 0.5]))
  for (let i = 0; i < 6; i++) {
    if (letters) out += text('ABCDEF'[i], 93.5, h * i + h / 2, 6, { fill: hex(0xead6ae), weight: weight.bold })
    lines += rectD(87, h * (i + 1) - line, 13, line)
  }
  return out + path(lines, hex(0xd2ae80, 0.7))
}

/** StoresBust: a head over square-cut shoulders, the pressed edge under them
 *  catching the light. */
function bust(ink: string): string {
  return (
    path(
      `${ellipsePath(50, 39.5, 15.5, 19)} ${rectD(46, 45.5, 8, 7)}${unevenPath(50, 56.8, 38, 12.5, [11, 11, 0, 0])}`,
      ink,
    ) + rect(50, 63.5, 38, hair(1), 'rgba(255,255,255,0.35)')
  )
}

/** StoresContactsBust (iOS 7-10): the grey "no photo" bust running off the
 *  bottom, and four lettered tabs. */
function contactsBust(sanFrancisco: boolean): string {
  const grey = hex(0x9a9a9a)
  return (
    path(headD(), grey) +
    ellipse(40, 102, 110, 44, grey) +
    tabColumn({
      width: 0.19,
      colours: [0xc8c7c4, 0x5ac8fa, 0x4cd964, 0xff9500],
      letters: ['A', 'B', 'C', 'D'],
      font: sanFrancisco ? { size: 10, weight: weight.regular, family: 'sf' } : { size: 10.5, weight: weight.light, family: 'helveticaNeue' },
      ink: hex(0x474747),
    })
  )
}

/** StoresHeadShape: the iOS 7 head and neck, a domed crown, near-straight
 *  sides, a jaw tapering into the neck. */
function headD(): string {
  return (
    'M19,30 Q19,8 40.5,8 Q62,8 62,30 L62,44 Q60,60 53,68 L53,86 L28,86 L28,68 Q21,60 19,44 Z'
  )
}

interface TabColumn {
  width: number
  colours: number[]
  letters?: string[]
  font?: { size: number; weight: number; family: 'sf' | 'helveticaNeue' }
  ink?: string
  soft?: boolean
}

/** StoresTabColumn: the right-hand column of coloured tabs, optionally
 *  lettered, with a faint line down its left edge; `soft` blends the
 *  colours and lets a little light bleed from the left, as Liquid Glass. */
function tabColumn(o: TabColumn, k?: Kit): string {
  const w = o.width * 100
  const x0 = 100 - w
  const count = o.colours.length
  if (o.soft && k) {
    const stops: Stop[] = []
    o.colours.forEach((c, i) => {
      stops.push([hex(c), i / count + (i === 0 ? 0 : 0.035)])
      stops.push([hex(c), (i + 1) / count - (i === count - 1 ? 0 : 0.035)])
    })
    return (
      rect(x0 + w / 2, 50, w, 100, spanLinear(k, stops, 0, 0, 0, 100)) +
      rect(x0 + (w * 0.35) / 2, 50, w * 0.35, 100, linear(k, ['rgba(255,255,255,0)', 'rgba(255,255,255,0.35)'], [0, 0.5], [1, 0.5]))
    )
  }
  const h = 100 / count
  let out = ''
  o.colours.forEach((c, i) => {
    out += rect(x0 + w / 2, h * i + h / 2, w, h, hex(c))
  })
  const letters = o.letters ?? []
  letters.forEach((letter, i) => {
    if (i < count && o.font) out += text(letter, x0 + w / 2, h * i + h / 2, o.font.size, { fill: o.ink, weight: o.font.weight, family: o.font.family })
  })
  const line = hair(0.6)
  return out + rect(x0 + line / 2, 50, line, 100, 'rgba(0,0,0,0.1)')
}

const tabsLater = [0xc4c2ba, 0x5ac8fa, 0xff9500, 0x4cd964]

/** StoresContactsCouple (iOS 11-12): a man and, in front of him, a woman with
 *  long hair, in a ring on stone. */
function contactsCouple(k: Kit): string {
  const ink = hex(0xa9a19b)
  const paper = hex(0xd8d5cb)
  const her = (colour: string, pad: number) => {
    const p = pad * 100
    return path(
      `${rrectPath(55, 48.5, 22 + 2 * p, 29 + 2 * p, [11 + p, 11 + p, 5, 5], true)} ` +
        `${rectD(55 - (13 + 2 * p) / 2, 60, 13 + 2 * p, 10)}` +
        `${rrectPath(53.5, 83, 34 + 2 * p, 32 + 2 * p, 12 + p, true)}`,
      colour,
    )
  }
  const him = path(`${ellipsePath(32.5, 44, 19, 19)} ${rectD(27.5, 52, 10, 12)}${rrectPath(25, 80, 36, 34, 11, true)}`, ink)
  const disc = clip(k, circle(43.5, 50, 60, '#fff'))
  return (
    ring(43.5, 50, 63, 2.5, ink) +
    `<g clip-path="${disc}">${him}${her(paper, 0.022)}${her(ink, 0)}</g>` +
    tabColumn({ width: 0.115, colours: tabsLater })
  )
}

/** StoresContactRing (iOS 13-18): one generic person in a ring. Apple's
 *  shoulders are a wide circular cap that runs INTO the ring and merges with
 *  it, not a rounded box floating clear of it, so the body is a disc of 0.567
 *  centred low and clipped by the ring's outer edge (0.31), and the head is a
 *  0.218 circle - both measured off the shipping iOS 18 icon. */
function contactRing(k: Kit, strokeWidth: number): string {
  const ink = hex(0xa9a29a)
  const disc = clip(k, circle(43.4, 50, 62, '#fff'))
  return (
    ring(43.4, 50, 62, strokeWidth * 100, ink) +
    path(`${ellipsePath(43.4, 43.2, 21.8, 21.8)} ${ellipsePath(43.4, 88.3, 56.7, 56.7)}`, ink, `clip-path="${disc}"`) +
    tabColumn({ width: 0.115, colours: tabsLater })
  )
}

/** StoresContactsGlass (iOS 26+): a grey glass disc holding a white head and
 *  a lens-shaped body, beside three soft glass tabs. */
function contactsGlass(k: Kit, beta5: boolean): string {
  const [cx, cy] = [43.7, 50]
  const d = 63.2
  const rim = hair(1)
  const discFill = linear(k, beta5 ? [hex(0xa4a296), hex(0xaba89b)] : [hex(0x96928a), hex(0xa29f93)])
  const rimPaint = spanLinear(k, ['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.35)'], 0, cy - d / 2, 0, cy + d / 2)
  const lift = shadow(k, hex(0x000000, beta5 ? 0.22 : 0.07), 2.5, 0, 1.6)
  const bodyLine = hair(1.2)
  const bodyClip = clip(k, circle(cx, cy, 60, '#fff'))
  let body = ellipse(43.7, 72, 42, 22, hex(0xffffff, beta5 ? 1 : 0.72))
  if (!beta5) body += ellipse(43.7, 72, 42 - bodyLine, 22 - bodyLine, 'none', `stroke="rgba(255,255,255,0.95)" stroke-width="${n(bodyLine)}"`)
  return (
    tabColumn({ width: 0.115, colours: beta5 ? [0x6fbbef, 0xee9335, 0x6ad463] : [0x58c4f7, 0xfc9719, 0x61d874], soft: true }, k) +
    `<g filter="${lift}">${circle(cx, cy, d, discFill)}${circle(cx, cy, d - rim, 'none', `stroke="${rimPaint}" stroke-width="${n(rim)}"`)}</g>` +
    circle(43.8, 42.5, 25, hex(0xffffff, beta5 ? 1 : 0.96)) +
    `<g clip-path="${bodyClip}">${body}</g>`
  )
}

// ---------------------------------------------------------------- Voice Memos

/** StoresChromeMic (iPhone OS 3): a chrome studio microphone, mesh head over
 *  a bright collar, on a thin stand, glowing red in the dark. */
function chromeMic(k: Kit): string {
  const chromeStops = [hex(0x7e7e82), hex(0xf6f6f8), hex(0xbdbdc1), hex(0x5a5a5e)]
  const across = (x0: number, w: number) => spanLinear(k, chromeStops, x0, 0, x0 + w, 0)
  const meshClip = clip(k, `<path d="${capsulePath(50, 32, 34, 48)}"/>`)
  return (
    glow(k, hex(0xd01e26), [0.5, 0.42], 0.64) +
    rect(50, 83, 5, 36, across(47.5, 5)) +
    rrect(50, 61.5, 32, 9, 3, linear(k, [hex(0x2a2a2c), hex(0x6e6e72), hex(0x1a1a1c)], [0, 0.5], [1, 0.5]), '', true) +
    capsule(50, 32, 42, 54, spanRadial(k, [hex(0x4a4a4e), hex(0x121214)], 29 + 42 * 0.4, 5 + 54 * 0.35, 28)) +
    dotGrid(33, 8, 34, 48, 7, 12, hex(0xd4d4d8), `clip-path="${meshClip}"`) +
    path(capsulePath(50, 32, 42 - 2.2, 54 - 2.2), 'none', `stroke="${across(29, 42)}" stroke-width="2.2"`) +
    rrect(50, 53.5, 46, 7.5, 1.5, across(27, 46), '', true)
  )
}

/** StoresDotGridShape: a staggered grid of small round holes, each a
 *  zero-length round-capped stroke (84 circles in one short path). */
function dotGrid(x0: number, y0: number, w: number, h: number, columns: number, rows: number, fill: string, extra = ''): string {
  const dx = w / columns
  const dy = h / rows
  const d = Math.min(dx, dy) * 0.5
  let out = ''
  for (let row = 0; row < rows; row++) {
    const shift = row % 2 === 0 ? 0 : dx / 2
    for (let column = 0; column < columns; column++) {
      out += `M${n(x0 + dx * (column + 0.5) + shift - dx / 4)},${n(y0 + dy * (row + 0.5))}h0.001`
    }
  }
  return `<path d="${out}" fill="none" stroke="${fill}" stroke-width="${n(d)}" stroke-linecap="round" ${extra}/>`
}

/** StoresWhiteMic (iOS 4.2-6): the flat white microphone in its U-shaped
 *  cradle, on a deep-blue-to-cyan tile. */
function whiteMic(k: Kit): string {
  return (
    rect(50, 50, 100, 100, linear(k, [[hex(0x1a63d3), 0], [hex(0x0450c8), 0.55], [hex(0x4fd2f9), 1]])) +
    rrect(50, 82, 36, 4.5, 2, '#fff', '', true) +
    rect(50, 72.5, 4.5, 16, '#fff') +
    `<path d="M71,45 A21,21 0 0 1 29,45" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>` +
    capsule(50, 37, 26, 42, linear(k, ['#fff', hex(0xd9efff)], [0, 0.5], [1, 0.5])) +
    rect(50, 47, 26, hair(1.2), hex(0x8cc4f0))
  )
}

/** StoresBarsShape: round-ended bars centred on the midline; positions and
 *  heights are shares of the edge. Drawn as one round-capped stroke (a
 *  bar 1.5 units wide cannot show its continuous corners), which keeps the
 *  36-bar waveform to one short path. */
function bars(heights: number[], startX: number, pitch: number, barWidth: number, fill: string): string {
  const w = barWidth * 100
  const d = heights
    .map((h, i) => {
      const half = Math.max(0.0005, (Math.max(w, 100 * h) - w) / 2)
      return `M${n(100 * (startX + pitch * i))},${n(50 - half)} V${n(50 + half)}`
    })
    .join(' ')
  return `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${n(w)}" stroke-linecap="round"/>`
}

/** The iOS 7 icon's waveform (of the word "Apple"), with the dotted baseline
 *  running out to both edges. */
const apple2013 = [
  0.018, 0.02, 0.018, 0.02, 0.021, 0.028, 0.021, 0.032, 0.066, 0.283, 0.211, 0.397, 0.352, 0.836, 0.579, 0.597, 0.354, 0.233, 0.11, 0.238,
  0.188, 0.273, 0.106, 0.115, 0.126, 0.083, 0.055, 0.071, 0.039, 0.035, 0.041, 0.028, 0.02, 0.018, 0.02, 0.018,
]

type WaveLook = 'ios12' | 'glass' | 'glass27'

/** StoresPlayheadWave (iOS 12+): red bars (played), a blue playhead with a dot
 *  at each end, white bars (to come). */
function playheadWave(look: WaveLook): string {
  const isGlass = look !== 'ios12'
  const red = hex(look === 'ios12' ? 0xff3b30 : look === 'glass' ? 0xdb4c3a : 0xdb5547)
  const white = look === 'glass' ? hex(0xefefef) : '#fff'
  const blue = hex(look === 'ios12' ? 0x1badf8 : look === 'glass' ? 0x4d8ce4 : 0x5292f0)
  const reds = isGlass
    ? [0.047, 0.148, 0.097, 0.343, 0.266, 0.765, 0.515, 0.577, 0.242, 0.343]
    : [0.016, 0.031, 0.023, 0.023, 0.016, 0.047, 0.086, 0.25, 0.18, 0.375, 0.32, 0.656, 0.508, 0.523, 0.328, 0.203, 0.117, 0.211]
  const whites =
    look === 'ios12'
      ? [0.242, 0.102, 0.117, 0.133, 0.086, 0.055, 0.07, 0.047, 0.039, 0.039, 0.031, 0.047, 0.031, 0.023, 0.031, 0.016, 0.016]
      : look === 'glass'
        ? [0.075, 0.202, 0.266, 0.116, 0.165, 0.047, 0.097, 0.047, 0.022]
        : [0.076, 0.205, 0.265, 0.114, 0.167, 0.045, 0.098, 0.045, 0.023, 0.038]
  const headX = (isGlass ? 0.499 : 0.512) * 100
  const reach = (isGlass ? 0.393 : 0.3765) * 100
  const dot = (isGlass ? 0.057 : 0.059) * 100
  let out =
    bars(reds, isGlass ? 0.1 : 0.023, isGlass ? 0.03988 : 0.0271, isGlass ? 0.015 : 0.016, red) +
    bars(whites, isGlass ? 0.539 : 0.537, isGlass ? 0.0399 : 0.02725, isGlass ? 0.015 : 0.016, white) +
    capsule(headX, 50, 1.6, reach * 2, blue)
  for (const side of [-1, 1]) {
    const y = 50 + reach * side
    out += circle(headX, y, dot, blue)
    if (isGlass) out += circle(headX - dot * 0.14, y - dot * 0.14, dot * 0.4, 'rgba(255,255,255,0.35)')
  }
  return out
}

// ---------------------------------------------------------------- Game Center

/** StoresGameQuadrants (iOS 4.1-6): chess on wood, baseball on grass, a
 *  rocket in space, darts on cork. */
function gameQuadrants(k: Kit): string {
  const white = '#fff'
  // The space quadrant's sky, and its rocket (StoresRocket, 0.5 of the edge,
  // turned 45 degrees about its own centre).
  const rocketAt: Pt = [25.5, 74.5]
  const s = 50
  const rocket =
    `<g transform="translate(${rocketAt[0]} ${rocketAt[1]}) rotate(45)" fill="${white}">` +
    `<path d="${flameD(-s * 0.06, s * 0.37 - s * 0.1, s * 0.12, s * 0.2)}"/>` +
    `<path d="${finsD(-s * 0.23, s * 0.14 - s * 0.15, s * 0.46, s * 0.3)}"/>` +
    `<path d="${rocketBodyD(-s * 0.12, -s * 0.04 - s * 0.3, s * 0.24, s * 0.6)}"/>` +
    circle(0, -s * 0.1, s * 0.1, hex(0x2a62d6)) +
    `</g>`
  const stars: Array<[number, number, number]> = [
    [0.12, 0.14, 0.03],
    [0.3, 0.08, 0.02],
    [0.82, 0.12, 0.025],
    [0.9, 0.4, 0.02],
    [0.18, 0.44, 0.02],
    [0.7, 0.3, 0.015],
    [0.86, 0.8, 0.025],
    [0.1, 0.86, 0.02],
    [0.5, 0.92, 0.015],
  ]
  const knight = knightD(9.5, 7.5, 30, 36)
  return (
    quadrantArt(k, { colours: [hex(0xdb8e2c), hex(0x5e9a05), hex(0x2a62d6), hex(0xde8b3a)], seam: hex(0x000000, 0.45) }) +
    // Chess: dark squares top left and bottom right, a white knight.
    path(rectD(0, 0, 25, 25) + rectD(25, 25, 25, 25), hex(0x6a2208)) +
    path(knight, white, `filter="${shadow(k, hex(0x000000, 0.4), 1, 0, 1)}"`) +
    // Baseball: the bat's barrel up to the right, its knob down to the left, the ball top left.
    stroke([0.69, 0.31], [0.875, 0.125], 0.1, white) +
    stroke([0.6, 0.4], [0.73, 0.27], 0.045, white) +
    circle(59.5, 40.5, 5.5, white) +
    circle(61.5, 13.5, 7.5, white) +
    // Space: a deeper blue with a few stars, a white rocket climbing to the right.
    rect(25, 75, 50, 50, spanRadial(k, [hex(0x3f86e0), hex(0x1c47c8)], 20, 70, 45)) +
    path(stars.map(([x, y, r]) => ellipsePath(50 * x, 50 + 50 * y, 50 * r, 50 * r)).join(' '), 'rgba(255,255,255,0.8)') +
    rocket +
    // Darts: a thick ring and a bull on cork, the dart in from the top left.
    ring(75.5, 75.5, 31, 4.2, white) +
    circle(75.5, 75.5, 9, white) +
    stroke([0.63, 0.63], [0.75, 0.75], 0.03, white) +
    stroke([0.595, 0.645], [0.645, 0.595], 0.035, white)
  )
}

/** StoresKnightShape: a chess knight facing left, in an x0, y0, w, h box. */
function knightD(x0: number, y0: number, w: number, h: number): string {
  const points: Pt[] = [
    [0.12, 1.0], [0.9, 1.0], [0.9, 0.9], [0.78, 0.86], [0.82, 0.66], [0.88, 0.44], [0.84, 0.24],
    [0.7, 0.1], [0.56, 0.04], [0.5, 0.0], [0.44, 0.08], [0.34, 0.12], [0.18, 0.26], [0.04, 0.44],
    [0.0, 0.54], [0.08, 0.62], [0.2, 0.6], [0.32, 0.54], [0.44, 0.52], [0.4, 0.66], [0.3, 0.8],
    [0.26, 0.86], [0.12, 0.9],
  ]
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${n(x0 + w * x)},${n(y0 + h * y)}`).join(' ') + ' Z'
}

/** StoresRocketBodyShape: a pointed nose swelling to full width, tapering a
 *  little to the tail. */
function rocketBodyD(x0: number, y0: number, w: number, h: number): string {
  const P = (x: number, y: number) => `${n(x0 + w * x)},${n(y0 + h * y)}`
  return `M${P(0.5, 0)} Q${P(1, 0.12)} ${P(1, 0.5)} L${P(0.86, 1)} L${P(0.14, 1)} L${P(0, 0.5)} Q${P(0, 0.12)} ${P(0.5, 0)} Z`
}

/** StoresFinsShape: two swept fins either side of the tail. */
function finsD(x0: number, y0: number, w: number, h: number): string {
  let d = ''
  for (const side of [-1, 1]) {
    const P = (x: number, y: number) => `${n(x0 + w / 2 + w * x * side)},${n(y0 + h * y)}`
    d += `M${P(0.18, 0)} L${P(0.5, 0.72)} L${P(0.5, 1)} L${P(0.18, 0.78)} Z `
  }
  return d
}

/** StoresFlameShape: round at the top, a point at the bottom. */
function flameD(x0: number, y0: number, w: number, h: number): string {
  const P = (x: number, y: number) => `${n(x0 + w * x)},${n(y0 + h * y)}`
  return `M${P(0, 0)} L${P(1, 0)} Q${P(1, 0.6)} ${P(0.5, 1)} Q${P(0, 0.6)} ${P(0, 0)} Z`
}

/** StoresGameBubbles (iOS 7-9): four glossy bubbles: a big blue one left, a
 *  yellow one top right that turns green where it lies over the blue,
 *  purple low left, pink in front. */
function gameBubbles2013(k: Kit): string {
  const blue = { dia: 62, x: 39.8, y: 43.3 }
  const bubble = (colours: number[], dia: number, x: number, y: number, lens = '') =>
    circle(x, y, dia, linear(k, colours.map((c) => hex(c))), 'opacity="0.93"') +
    lens +
    ring(x, y, dia, hair(0.6), 'rgba(0,0,0,0.08)') +
    ellipse(x, y - dia * 0.27, dia * 0.56, dia * 0.3, linear(k, ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.1)']))
  // The green lens is the yellow bubble seen through the blue one.
  const lens = circle(
    61.4,
    35,
    48,
    linear(k, [hex(0x5e9e00), hex(0x3b9b00), hex(0x12aa13), hex(0x02b34d)]),
    `clip-path="${clip(k, circle(blue.x, blue.y, blue.dia, '#fff'))}" opacity="0.95"`,
  )
  return (
    bubble([0x6a8cf2, 0x16aafd, 0x08c4ff, 0x34ccf2], blue.dia, blue.x, blue.y) +
    bubble([0xf0c200, 0xffe100, 0xf8ea4a], 48, 61.4, 35, lens) +
    bubble([0x7a2ed6, 0xb42aec, 0x7447fb], 30, 37, 78) +
    bubble([0xff4a6c, 0xff2c8e, 0xff3a7e, 0xffb145], 43, 67, 65.5)
  )
}

// ---------------------------------------------------------------- Newsstand

/** StoresShelf (iOS 5-6): an empty bookcase, a pale oak frame, a darker inner
 *  edge, two planks with shadows under them. */
function shelf(k: Kit): string {
  const rim = 7.5
  const inner = 100 - 2 * rim
  const d = inner * 0.13
  const lo = rim
  const hi = 100 - rim
  const walls =
    `M${lo},${lo} L${n(lo + d)},${n(lo + d * 0.8)} L${n(lo + d)},${n(hi - d * 0.8)} L${lo},${hi} Z ` +
    `M${hi},${lo} L${n(hi - d)},${n(lo + d * 0.8)} L${n(hi - d)},${n(hi - d * 0.8)} L${hi},${hi} Z`
  const fade38 = linear(k, ['rgba(0,0,0,0.38)', 'rgba(0,0,0,0)'])
  let planks = ''
  for (const y of [0.365, 0.675]) {
    const top = y * 100 - 1.25
    planks +=
      rect(50, top + 1.6, inner, 3.2, hex(0xe9c68c)) +
      rect(50, top + 3.2 + 0.7, inner, 1.4, hex(0x6e3f1b)) +
      rect(50, top + 4.6 + 3.5, inner, 7, fade38)
  }
  const rimLine = hair(1.6, 0.6)
  return (
    // The back wall, warm oak, lit from the middle, with faint grain.
    rect(50, 50, inner, inner, linear(k, [0xa06a3a, 0xc89156, 0xd5a369, 0xc89156, 0xa06a3a].map((c) => hex(c)), [0, 0.5], [1, 0.5])) +
    path(ticksD(50 - inner * 0.35, lo, inner * 0.7, inner, 6), hex(0x7a4722, 0.16)) +
    // The side walls, seen in perspective.
    path(walls, spanLinear(k, [hex(0x7e4e28), hex(0xa7713f)], 0, lo, 0, hi)) +
    // Shadow under the top rail.
    rect(50, lo + 4, inner, 8, linear(k, ['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)'])) +
    planks +
    `<rect x="${rim / 2}" y="${rim / 2}" width="${100 - rim}" height="${100 - rim}" rx="${17.5 - rim / 2}" fill="none" stroke="${spanLinear(k, [hex(0xe8c891), hex(0xd9ae70)], 0, 0, 0, 100)}" stroke-width="${rim}"/>` +
    `<rect x="${n(lo + rimLine / 2)}" y="${n(lo + rimLine / 2)}" width="${n(inner - rimLine)}" height="${n(inner - rimLine)}" rx="${n(10 - rimLine / 2)}" fill="none" stroke="${hex(0x6b3e1e)}" stroke-width="${n(rimLine)}"/>`
  )
}

/** StoresMagazines (iOS 7-8): ART, TRAVEL and SPORTS covers fanned in front
 *  of a newspaper. */
function magazines(k: Kit): string {
  const lift = shadow(k, hex(0x000000, 0.22), 1.2, -0.6, 0.4)
  const cover = (colour: string, w: number, h: number, cx: number, cy: number, content: string) => {
    const shape = rect(cx, cy, w, h, '#fff')
    return rect(cx, cy, w, h, colour, `filter="${lift}"`) + `<g clip-path="${clip(k, shape)}">${content}</g>`
  }
  let linen = ''
  for (let i = 0; i < 5; i++) linen += rectD(14, 25 + 2.4 * i, 18, hair(0.72))
  // The newspaper behind: grey page, a heavy serif masthead, a column of rules.
  const paper = rect(35.5, 38, 49, 52, hex(0xd6d8d6)) + word('News', 35.5, 19.2, 10, hex(0x1a1a1a), 900, serifFont) + path(linen, hex(0x8e9290))
  const art = cover(
    hex(0xf8d548),
    25.4,
    47,
    18,
    57.5,
    text('ART', 18, 40.5, 7.5, { fill: hex(0x222222), weight: weight.medium }) + circle(18, 54.5, 10, hex(0x1eb0ec)) + rect(13, 69.5, 8.5, 8.5, hex(0xee4b3e)),
  )
  const travelTop = 53.1 - 55.7 / 2
  const travel = cover(
    hex(0x31a9e1),
    38,
    55.7,
    49.7,
    53.1,
    rect(49.7, (travelTop + 12 + travelTop + 55.7) / 2, 38, 55.7 - 12, linear(k, [hex(0x31a9e1), hex(0x9ad6f2)])) +
      word('TRAVEL', 49.7, 53.1 - 21.5, 7.8, hex(0x1f3e8c), 700, systemFont, 0.8) +
      // SF's airplane points east and the Swift turns it -90 degrees; Phosphor's already points north.
      symbol('airplane', '#fff', 15, 49.7, 58.1),
  )
  const sports = cover(
    hex(0x4cbb5b),
    33.3,
    42,
    76.7,
    60,
    word('SPORTS', 76.7, 44, 6.2, '#fff', 700, systemFont, 0.8) +
      circle(76.7, 56.5, 11, hex(0xe9f03a)) +
      path(courtD(62.7, 69, 28, 11), 'none', `stroke="rgba(255,255,255,0.95)" stroke-width="${n(hair(0.8))}"`),
  )
  return paper + art + travel + sports
}

/** StoresCourtShape: a tennis court in perspective, with its service and
 *  centre lines. */
function courtD(x0: number, y0: number, w: number, h: number): string {
  const inset = w * 0.18
  const P = (x: number, y: number) => `${n(x)},${n(y)}`
  return (
    `M${P(x0 + inset, y0)} L${P(x0 + w - inset, y0)} L${P(x0 + w, y0 + h)} L${P(x0, y0 + h)} Z ` +
    `M${P(x0 + inset * 0.55, y0 + h / 2)} L${P(x0 + w - inset * 0.55, y0 + h / 2)} ` +
    `M${P(x0 + w / 2, y0)} L${P(x0 + w / 2, y0 + h)}`
  )
}

// ---------------------------------------------------------------- Videos / TV

/** StoresClapper: a clapper of black-and-white chevrons across the top. The
 *  glossy one (iOS 5-6) has a hinge pin and sits over tinted glass. */
function clapper(k: Kit, glossy: boolean): string {
  const band = glossy ? 0.34 : 0.3
  const bh = band * 100
  let out = ''
  if (glossy) {
    out += rect(50, 50, 100, 100, spanLinear(k, [hex(0x124e7e, 0.95), hex(0x124e7e, 0)], 100, 0, 0, 100))
    out += path('M0,100 L0,93 L100,50 L100,100 Z', 'rgba(255,255,255,0.2)')
  }
  out += rect(50, bh / 2, 100, bh, hex(glossy ? 0x151515 : 0x131313))
  out += path(
    chevronsD(glossy ? 0.189 : 0, glossy ? 0.356 : 0.35, glossy ? 0.165 : 0.182, band / 2, bh),
    spanLinear(k, glossy ? [hex(0xf4f4f4), hex(0xa2a2a2)] : [hex(0xf7f7f7), hex(0xf2f2f2)], 0, 0, 0, bh),
  )
  out += rect(50, bh / 2, 100, hair(0.8), 'rgba(0,0,0,0.25)')
  if (glossy) {
    out += rect(6.5, bh / 2, 13, bh, linear(k, [hex(0x8c8c8c), hex(0x55555a)]))
    out += circle(7.5, 17, 5, '#fff')
  }
  return out + rect(50, bh + 0.9, 100, 1.8, '#000')
}

/** StoresChevronsShape: right-pointing chevrons across a band of height `bh`;
 *  `point` is how far right a stripe travels from the top to the middle. */
function chevronsD(offset: number, pitch: number, stripe: number, point: number, bh: number): string {
  const P = (x: number, y: number) => `${n(100 * x)},${n(bh * y)}`
  let d = ''
  for (let x0 = offset - pitch * 2; x0 < 1; x0 += pitch) {
    d += `M${P(x0, 0)} L${P(x0 + stripe, 0)} L${P(x0 + stripe + point, 0.5)} L${P(x0 + stripe, 1)} L${P(x0, 1)} L${P(x0 + point, 0.5)} Z `
  }
  return d
}

/** StoresTVSet (iOS 10.2): a white-outlined flat screen with a green-to-blue
 *  picture, on a stand bar. */
function tvSet(k: Kit): string {
  // Measured off the shipping iOS 10.2 icon: the bezel is a heavy 3.3 line
  // (ours was 2.4, a third too light), the set 71.2 x 44.2 and the stand bar
  // 39.8 x 4.1 - the picture inside stays the same 64.6 wide.
  const [w, h, cy] = [71.2, 44.2, 46.1]
  const line = 3.3
  return (
    rrect(50, cy, w, h, 2, spanLinear(k, [hex(0x4fe9b8), hex(0x51e3cb), hex(0x38aad3)], 50 - w / 2, cy - h / 2, 50 + w / 2, cy + h / 2), '', true) +
    path(rrectPath(50, cy, w - line, h - line, 2 - line / 2, true), 'none', `stroke="#fff" stroke-width="${line}"`) +
    rrect(50, 73.05, 39.8, 4.1, 0.6, '#fff', '', true)
  )
}

type WordmarkLook = 'white' | 'iridescent' | 'muted'

// The wordmark's layout: HStack(alignment: .lastTextBaseline, spacing: 0) of
// the apple over a lowercase "tv", sharing one baseline. SwiftUI's text
// metrics are not available here, so the ink boxes are fitted to Apple's own
// artwork instead: every number below is measured off the shipping Apple TV
// icon (macOS 26 Tahoe's TV.app at 2048 px, whose mark is the late-2025
// rebrand), as a fraction of the tile x 100 -
//   apple x 11.73-42.89  y 27.64-66.10   (leaf 27.64-36.53, body from 36.89)
//   t     x 45.63-60.51  y 31.90-65.98   stem x 49.64-55.41, crossbar at y 41
//   v     x 63.00-88.21  y 38.34-65.74   arms 6.01 and 5.96 wide at y 40
// The web's SF (Text proportions) is heavier and a touch wider than iOS's SF
// Display at this size, so size, weight, squeeze and spacing are fitted to
// that measured ink rather than taken from the Swift: 540 rather than 600
// lands the t's stem at 0.0589 of the tile against Apple's 0.0577.
const mark = {
  apple: { x0: 11.73, x1: 42.89, y0: 27.64, y1: 66.1 },
  tv: { x: 45.18, baseline: 65.52, size: 51.84, weight: 540, squeeze: 1.0058, spacing: 0.079 },
}

// The Apple logo's own outline, in a unit box with y down. Traced from the
// system font's Apple glyph (U+F8FF) with CTFontCreatePathForGlyph, which is
// the same drawing SF's apple.logo uses: rasterised, the two agree to IoU
// 0.996, and both agree with the shipping TV icon's apple to IoU 0.992. (The
// old stand-in was Phosphor's apple-logo squeezed sideways, whose leaf reads
// as a crescent floating over a blob at icon size.) Body first, then leaf.
const APPLE_OUTLINE =
  'M0.7248 0.2418 Q0.7423 0.2418 0.7843 0.2463 Q0.8263 0.2508 0.8767 0.2718 Q0.927 0.2927 0.9683 0.3411 ' +
  'Q0.9659 0.343 0.9453 0.3549 Q0.9247 0.3669 0.8993 0.3897 Q0.8739 0.4126 0.8549 0.4478 Q0.8358 0.4829 0.8358 0.5313 ' +
  'Q0.8358 0.5867 0.86 0.6254 Q0.8842 0.6641 0.9163 0.6876 Q0.9485 0.7112 0.9734 0.7221 Q0.9984 0.7331 1 0.7337 ' +
  'Q0.9992 0.7363 0.9798 0.7795 Q0.9603 0.8227 0.9159 0.8756 Q0.8771 0.9213 0.8323 0.96 Q0.7875 0.9987 0.7248 0.9987 ' +
  'Q0.6828 0.9987 0.6558 0.9887 Q0.6289 0.9787 0.6003 0.9687 Q0.5718 0.9587 0.5234 0.9587 ' +
  'Q0.4766 0.9587 0.4453 0.9691 Q0.414 0.9794 0.3858 0.9897 Q0.3577 1 0.3196 1 Q0.2617 1 0.2181 0.9626 ' +
  'Q0.1745 0.9252 0.1285 0.873 Q0.0753 0.8111 0.0377 0.7218 Q0 0.6325 0 0.5416 Q0 0.4442 0.0452 0.3781 ' +
  'Q0.0904 0.3121 0.1614 0.2782 Q0.2324 0.2444 0.3085 0.2444 Q0.3489 0.2444 0.3846 0.255 Q0.4203 0.2656 0.4516 0.2766 ' +
  'Q0.483 0.2876 0.5083 0.2876 Q0.5329 0.2876 0.5654 0.276 Q0.5979 0.2643 0.6384 0.2531 Q0.6788 0.2418 0.7248 0.2418 Z ' +
  'M0.6812 0.1599 Q0.6503 0.1902 0.6035 0.2105 Q0.5567 0.2308 0.5147 0.2308 Q0.5059 0.2308 0.498 0.2295 ' +
  'Q0.4972 0.2276 0.4964 0.2224 Q0.4956 0.2173 0.4956 0.2115 Q0.4956 0.1728 0.5163 0.1364 Q0.5369 0.0999 0.563 0.0761 ' +
  'Q0.5964 0.0438 0.6471 0.0226 Q0.6979 0.0013 0.7439 0 Q0.7462 0.0084 0.7462 0.02 Q0.7462 0.0587 0.728 0.0951 ' +
  'Q0.7098 0.1315 0.6812 0.1599 Z'

/** The apple, its traced outline scaled into the measured ink box. */
function markApple(fill: string): string {
  const a = mark.apple
  return `<g transform="translate(${n(a.x0)} ${n(a.y0)}) scale(${n(a.x1 - a.x0)} ${n(a.y1 - a.y0)})">${path(APPLE_OUTLINE, fill)}</g>`
}

/** The Apple TV mark's glyphs, in one fill. */
function markGlyphs(fill: string): string {
  return (
    markApple(fill) +
    `<text x="${mark.tv.x}" y="${mark.tv.baseline}" transform="translate(${mark.tv.x} 0) scale(${mark.tv.squeeze} 1) translate(${-mark.tv.x} 0)" font-family="${systemFont.replace(/'/g, '&apos;')}" font-size="${mark.tv.size}" font-weight="${mark.tv.weight}" letter-spacing="${mark.tv.spacing}" fill="${fill}">tv</text>`
  )
}

// The 26.1 mark is dominantly WHITE: colour is a sweep that only comes up
// through the bottom third. Both gradients are fitted to the same 2048 px
// artwork, and their offsets are tile fractions, so each spans the whole
// tile rather than the mark's own frame.
//
// SWEEP: violet under the apple's left lobe, through cyan and green to
// yellow in the t and pink through the v. Read straight off the artwork's
// bottom band (y > 0.598, where the white has run out, so what is there IS
// the sweep), as hue/saturation at full value: 255deg s0.49 at x 0.16,
// 216/0.40 at 0.25, 200/0.47 at 0.31, 96/0.44 at 0.51, 43/0.59 at 0.57,
// 8/0.47 at 0.71, 339/0.33 at 0.80. The left end runs off the bottom of the
// apple's lobe, so its violet is taken from higher up and un-mixed instead.
const SWEEP: Array<[number, number]> = [
  [0.118, 0x8861ff], [0.16, 0xa282ff], [0.2, 0xa89dff], [0.25, 0x99c3ff],
  [0.31, 0x87d8ff], [0.37, 0x8cffed], [0.44, 0x8bffa3], [0.51, 0xbdff8f],
  [0.57, 0xffd568], [0.63, 0xffb478], [0.7, 0xff9a84], [0.77, 0xffa2b2],
  [0.84, 0xffabd2], [0.882, 0xffadd8],
]

// WHITE CAP: opaque to y 0.43 - the top 40% of the mark carries no colour at
// all - then down to nothing by 0.605. Apple's own saturation by tile row is
// 0.004 at y 0.39, 0.019 at 0.43, 0.066 at 0.47, 0.167 at 0.51, 0.305 at
// 0.55, 0.409 at 0.59, 0.474 at 0.63; ours was already at 0.091 by y 0.43,
// which is what washed the whole mark out.
const CAP: Array<[number, number]> = [
  [0, 1], [0.43, 1], [0.46, 0.94], [0.49, 0.856], [0.52, 0.683], [0.55, 0.437], [0.58, 0.178], [0.605, 0], [1, 0],
]

/** 2026's muted sibling: the same sweep dimmed to 0.86 of its value. */
const dim = (c: number, f: number): number =>
  (Math.round(((c >> 16) & 0xff) * f) << 16) | (Math.round(((c >> 8) & 0xff) * f) << 8) | Math.round((c & 0xff) * f)

/** StoresTVWordmark: the logo and a lowercase "tv". From iOS 26.1 the letters
 *  are white with an iridescent sweep rising through their bottom third
 *  (violet, cyan, green under the logo; yellow in the t; pink in the v), both
 *  gradients spanning the tile, with a soft shadow. */
function tvWordmark(k: Kit, look: WordmarkLook): string {
  if (look === 'white') return markGlyphs('#fff')
  const f = look === 'iridescent' ? 1 : 0.86
  const top = look === 'iridescent' ? '#ffffff' : hex(0xe6e6e8)
  const sweep = spanLinear(k, SWEEP.map(([at, c]): Stop => [hex(dim(c, f)), at]), 0, 0, 100, 0)
  const cap = spanLinear(k, CAP.map(([at, a]): Stop => [fade(top, a), at]), 0, 0, 0, 100)
  const glyphs = mask(k, markGlyphs('#fff'))
  const box = rect(50, 50, 100, 100, sweep) + rect(50, 50, 100, 100, cap)
  return `<g filter="${shadow(k, hex(0x000000, 0.45), 2, 0, 1.4)}"><g mask="${glyphs}">${box}</g></g>`
}

// ---------------------------------------------------------------- roster

const art = (draw: Art): Art => draw

export const stores: HomeAppDef[] = [
  {
    id: 'App Store',
    designs: [
      // iPhone OS 2-3: a pencil, a paintbrush and a ruler make an A in a white ring, on a blue sunburst.
      design(2008, 0x1638bc, 0x2a62d0, art((k) => appStoreClassic(k, false))),
      // iOS 4-6: the Retina redraw: thinner ring, cyan rays up from the bottom.
      design(2010, 0x0a36b8, 0x2f80d8, art((k) => appStoreClassic(k, true))),
      // iOS 7-10: flat, gradient reversed (light on top), a thin ring round thin tools.
      design(
        2013,
        0x64d0f9,
        0x3465e7,
        art((k) =>
          toolsA(k, { ring: 0.85, ringStroke: 0.034, tool: 0.05, ruler: 0.05, detail: hex(0x5daaf3), cutTop: hex(0x64d0f9), cutBottom: hex(0x3465e7) }),
        ),
      ),
      // iOS 11-17: three popsicle sticks; the crossbar and legs cut free of each other.
      design(2017, 0x1ac5fb, 0x1d73f2, art((k) => sticksA(k, 'solid', hex(0x1ac5fb), hex(0x1d73f2)))),
      // iOS 18: the release icon, a touch deeper at the bottom.
      design(2024, 0x19c7fc, 0x1c72f2, art((k) => sticksA(k, 'solid', hex(0x19c7fc), hex(0x1c72f2)))),
      // iOS 26: three whole sticks as frosted white glass, brighter where they overlap.
      design(2025, 0x21b4f9, 0x1a66f0, art((k) => sticksA(k, 'glass', hex(0x21b4f9), hex(0x1a66f0)))),
      // iOS 27 beta 5: deeper blue; the sticks clearer and whole, so each bar reads through the others.
      design(2026, 0x3f8ef1, 0x3162e2, art((k) => sticksA(k, 'clear', hex(0x3f8ef1), hex(0x3162e2)))),
    ],
  },
  {
    id: 'iTunes',
    names: [
      [era(2007), 'iTunes'],
      [era(2013), 'iTunes Store'],
    ],
    designs: [
      // iPhone OS 1.1: a white down arrow in a ring on a purple sunburst.
      design(2007, 0x62207f, 0x9c45ae, art((k) => iTunesClassic(k, true, false))),
      // iPhone OS 2-3: the arrow becomes a pair of beamed eighth notes.
      design(2008, 0x66217f, 0xa048b2, art((k) => iTunesClassic(k, false, false))),
      // iOS 4-6: Retina redraw, a brighter violet and stronger rays.
      design(2010, 0x7a2894, 0xb252c0, art((k) => iTunesClassic(k, false, true))),
      // iOS 7.0: flat pink to violet, a thin ring, a big note.
      design(2013, 0xf95bc6, 0xa945fc, art(() => iTunesFlat('ios7'))),
      // iOS 7.1: hotter magenta, the note a touch smaller.
      design(2014, 0xee49bb, 0xc336f2, art(() => iTunesFlat('ios71'))),
      // iOS 9: the note redrawn to match Apple Music's, on a more saturated magenta.
      design(2015, 0xf23eb9, 0xcb32fc, art(() => iTunesFlat('ios9'))),
      // iOS 11-17: a white star, its arms faintly faceted.
      design(2017, 0xe94cc0, 0xcd44f3, art((k) => iTunesStar(k, '#fff', hex(0xc43fb5, 0.06), false))),
      // iOS 18: minor adjustments to the star (Logopedia); the same at icon size.
      design(2024, 0xe94cc0, 0xcd44f3, art((k) => iTunesStar(k, '#fff', hex(0xc43fb5, 0.06), false))),
      // iOS 26: a pink-white glass star.
      design(2025, 0xd458c2, 0xbb4fec, art((k) => iTunesStar(k, hex(0xf9d8f4, 0.88), hex(0xb23fb0, 0.18), true))),
      // iOS 27: the tile turns violet, the star pale lavender.
      design(2026, 0xad55e4, 0xa53ee2, art((k) => iTunesStar(k, hex(0xf1ddfb, 0.88), hex(0x8c3fd0, 0.18), true))),
    ],
  },
  {
    id: 'YouTube',
    designs: [
      // iPhone OS 1-2: a walnut-framed tube television with a mustard bezel.
      design(2007, 0x7a4c2b, 0x6a3f24, art((k) => youTubeSet(k, false))),
      // iPhone OS 3: every icon slightly darkened.
      design(2009, 0x6e4427, 0x5e3820, art((k) => youTubeSet(k, false, 0.08))),
      // iOS 4-5: the Retina redraw: pale cream bezel, bigger screen, chrome knobs.
      design(2010, 0x74502d, 0x876549, art((k) => youTubeSet(k, true))),
    ],
  },
  {
    id: 'Contacts',
    designs: [
      // iPhone OS 2: a tan spiral-bound address book with a brown bust.
      design(2008, 0xe4c295, 0xcca66f, art((k) => addressBook(k, false))),
      // iPhone OS 3: every icon slightly darkened.
      design(2009, 0xd8b688, 0xbf9962, art((k) => addressBook(k, false, 0.07))),
      // iOS 4-6: Retina redraw: grained leather, silver rings, tabs lettered A to F.
      design(2010, 0xe3be86, 0xcb8d3a, art((k) => addressBook(k, true))),
      // iOS 7-8: flat grey, a huge grey bust, four tabs lettered A-D in Helvetica Neue.
      flat(2013, 0xdddddd, art(() => contactsBust(false))),
      // iOS 9-10: the tab letters reset in San Francisco.
      flat(2015, 0xdddddd, art(() => contactsBust(true))),
      // iOS 11-12: a man and a woman in a ring on stone; the letters gone.
      flat(2017, 0xd8d5cb, art((k) => contactsCouple(k))),
      // iOS 13-17: one generic person in the ring.
      flat(2019, 0xd8d6cc, art((k) => contactRing(k, 0.024))),
      // iOS 18: the ring thickened.
      flat(2024, 0xd8d6cc, art((k) => contactRing(k, 0.034))),
      // iOS 26: a grey glass disc, a white person, three tabs melting into glass.
      design(2025, 0xd7d7c9, 0xcdcdc0, art((k) => contactsGlass(k, false))),
      // iOS 27 beta 5: the disc lifts on a shadow, the person solid white, tabs deeper.
      design(2026, 0xd7d7c9, 0xcfcec1, art((k) => contactsGlass(k, true))),
    ],
  },
  {
    id: 'Voice Memos',
    designs: [
      // iPhone OS 3: a chrome studio microphone glowing red in the dark.
      design(2009, 0x3c0506, 0x240708, art((k) => chromeMic(k))),
      // iOS 4.2-6 (4.2 shipped November 2010): a flat white microphone on blue.
      design(2010, 0x0b57cc, 0x4ed2f9, art((k) => whiteMic(k))),
      // iOS 7-11: a black waveform on white.
      flat(2013, 0xffffff, art(() => bars(apple2013, 0.0219, 0.02727, 0.0155, hex(0x1c1c1c)))),
      // iOS 12-17: black; red bars left of a blue playhead, white bars right of it.
      flat(2018, 0x1a1a1b, art(() => playheadWave('ios12'))),
      // iOS 18: the black picks up a gradient.
      design(2024, 0x313130, 0x131313, art(() => playheadWave('ios12'))),
      // iOS 26: Liquid Glass; fewer, wider-spaced bars, a softer blue.
      design(2025, 0x313131, 0x111111, art(() => playheadWave('glass'))),
      // iOS 27: a darker tile, brighter white bars, one more of them.
      design(2026, 0x242424, 0x0f0f0f, art(() => playheadWave('glass27'))),
    ],
  },
  {
    id: 'Game Center',
    designs: [
      // iOS 4.1-6: chess on wood, baseball on grass, a rocket in space, darts on cork.
      design(2010, 0x8e3a16, 0xde8b3a, art((k) => gameQuadrants(k))),
      // iOS 7-9: four glossy bubbles on white.
      flat(2013, 0xffffff, art((k) => gameBubbles2013(k))),
    ],
  },
  {
    id: 'Newsstand',
    designs: [
      // iOS 5-6: an empty oak bookcase with two shelves.
      design(2011, 0xe2bf86, 0xdaae70, art((k) => shelf(k))),
      // iOS 7-8: ART, TRAVEL and SPORTS covers fanned in front of a newspaper.
      design(2013, 0xffffff, 0xededed, art((k) => magazines(k))),
    ],
  },
  {
    id: 'TV',
    names: [
      [era(2011), 'Videos'],
      [era(2016), 'TV'],
    ],
    designs: [
      // iOS 5-6 Videos: a chevron clapper with a hinge pin over glassy teal.
      design(2011, 0x2680b0, 0x86d6e6, art((k) => clapper(k, true))),
      // iOS 7-10.1 Videos: flat chevrons over aqua-to-blue.
      design(2013, 0x50f0c8, 0x5ac8fa, art((k) => clapper(k, false))),
      // iOS 10.2-13.0 TV: a white-outlined set with a green-to-blue screen, on black.
      flat(2016, 0x1e1e1f, art((k) => tvSet(k))),
      // iOS 13.1-26.0: the white Apple TV wordmark on charcoal.
      design(2019, 0x323232, 0x121212, art((k) => tvWordmark(k, 'white'))),
      // iOS 26.1: the rebrand: white on top, an iridescent sweep along the bottom.
      design(2025, 0x313131, 0x131313, art((k) => tvWordmark(k, 'iridescent'))),
      // iOS 27: a darker tile, silvery letters, muted colours.
      design(2026, 0x1f1e1f, 0x0f0f0f, art((k) => tvWordmark(k, 'muted'))),
    ],
  },
]
