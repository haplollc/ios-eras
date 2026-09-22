// Port of HomeIcons+Dock.swift: Phone, Mail, Safari, Music, Messages.
//
// Every generation is a vector reading of the real icon of that release;
// the years, background stops and glyph geometry are the Swift values as
// they are. Coordinates are in the 100 x 100 tile box (Swift's unit-square
// fractions x 100), origin top-left. The system layer draws the tile, gloss,
// shadow, glass rim and label; only the background stops and the glyph live
// here.
//
// Year -> release: 2007 OS 1, 2008 OS 2, 2009 OS 3, 2010 iOS 4, 2011 iOS 5,
// 2012 iOS 6, 2013 iOS 7.0, 2014 iOS 7.1/8, 2015 iOS 8.4/9, 2017 iOS 11,
// 2020 iOS 14, 2024 iOS 18, 2025 iOS 26, 2026 iOS 27.
//
// PORTING NOTES
// - Where the Swift draws a glyph above the system shine (dockOverShine(),
//   a raised zIndex), the glyph is the design's `over` layer.
// - SwiftUI resolves a gradient fill in the SHAPE'S FRAME, which for many
//   glyphs here is the whole tile (a note or bubble laid out edge x edge),
//   not the painted outline's bounds. frameLinear() is that gradient in
//   user space, so its stops land where the Swift's do.
// - Swift line widths are `max(floor pt, edge * f)`. The art here is
//   resolution independent, so the floor is read at a nominal 60 pt edge
//   (see lineWidth()).
// - The handset is a hand-drawn shape (DockHandsetShape), the same anchors
//   in both files, so the two stay identical without an SF Symbol.

import type { HomeAppDef, Kit, Stop } from './kit'
import {
  circle,
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
  place,
  radial,
  rect,
  ring,
  rrectPath,
  shadow,
  text,
  weight,
} from './kit'

// ---------------------------------------------------------------- helpers

const f = (v: number) => +v.toFixed(3)
const P = (x: number, y: number) => `${f(x)},${f(y)}`

/** The tile edge (pt) the Swift's minimum line widths are read at. */
const NOMINAL_EDGE = 60

/** `max(floorPt, edge * fraction)` in the 100 box. */
const lineWidth = (fraction: number, floorPt: number): number => Math.max(fraction * 100, (floorPt * 100) / NOMINAL_EDGE)

/** A linear gradient fixed in user space from (x1, y1) to (x2, y2): a
 *  SwiftUI gradient resolved in a frame larger than the painted outline. */
function frameLinear(k: Kit, list: Array<Stop | string>, x1: number, y1: number, x2: number, y2: number): string {
  const id = k.id('fl')
  k.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${gradientStops(list)}</linearGradient>`,
  )
  return `url(#${id})`
}

/** Top-to-bottom over the whole tile: a style on a view framed edge x edge. */
const tileLinear = (k: Kit, list: Array<Stop | string>): string => frameLinear(k, list, 0, 0, 0, 100)

/** A stroked outline (fill none). */
function stroke(d: string, colour: string, width: number, extra = ''): string {
  return `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${f(width)}" ${extra}/>`
}

const withFilter = (markup: string, filter: string): string => `<g filter="${filter}">${markup}</g>`

// ---------------------------------------------------------------- placement

/** DockBox: a glyph's bounding box, in the 100 box. */
interface Box {
  x0: number
  y0: number
  x1: number
  y1: number
  w: number
  h: number
  cx: number
  cy: number
}

function box(x0: number, y0: number, x1: number, y1: number): Box {
  const [a, b, c, d] = [x0 * 100, y0 * 100, x1 * 100, y1 * 100]
  return { x0: a, y0: b, x1: c, y1: d, w: c - a, h: d - b, cx: (a + c) / 2, cy: (b + d) / 2 }
}

/** The iOS 7-18 handset footprint: a 0.64 square, measured identical from
 *  iOS 7.0 through iOS 18. */
const flatHandset = box(0.184, 0.176, 0.822, 0.814)

/** DockGround.striped: iPhone OS 3 - iOS 6 Phone and Messages, one shared
 *  striped green, dark under the shine and neon over the bottom third. */
const striped: Stop[] = (
  [
    [0x0c820c, 0],
    [0x007c00, 0.3],
    [0x007c00, 0.5],
    [0x029800, 0.6],
    [0x04bc00, 0.7],
    [0x00d100, 0.8],
    [0x0af203, 0.9],
    [0x0af203, 1],
  ] as Array<[number, number]>
).map(([c, o]): Stop => [hex(c), o])

/** DockGround: a multi-stop vertical background over the whole tile. */
const ground = (k: Kit, stops: Stop[]): string => rect(50, 50, 100, 100, linear(k, stops))

/** DockStripes: 45-degree pinstripes rising to the right, `period` apart
 *  (perpendicular, share of the side), stroked `width` wide. */
function stripes(period: number, colour: string, width: number): string {
  const step = period * 100 * Math.SQRT2
  let d = ''
  for (let x = -100; x < 100 + step; x += step) d += `M${P(x, 100)} L${P(x + 100, 0)} `
  return stroke(d, colour, width)
}

// ---------------------------------------------------------------- Phone

type HandsetLook = { kind: 'skeuomorphic'; heavy: boolean } | { kind: 'flat' } | { kind: 'glass'; tint: string }

// DockHandsetShape. Apple's handset is not a bar of one thickness: it is a
// band whose centreline follows a single arc and whose walls taper to a thin
// waist at the elbow and flare out again at the earpiece and the mouthpiece.
// The arc below is fitted through the three points measured off the icon
// (earpiece end, elbow, mouthpiece end) in the glyph's unit box, and
// HANDSET is the outline as (degrees, radius) anchors round that centre.
const HANDSET_CENTRE: [number, number] = [0.80762, 0.22189]
const HANDSET_RADIUS = 0.64145

/** One closed loop: down the OUTER edge from the earpiece to the mouthpiece,
 *  round the mouthpiece's cap, back up the INNER edge (through the waist at
 *  158-116 degrees, where the wall sits ~0.09 off the centreline against
 *  ~0.17 at the flares), and round the earpiece's cap. */
const HANDSET: Array<[number, number]> = [
  [198, 0.6963], [192, 0.763], [186, 0.7993], [178, 0.8134], [170, 0.7993], [162, 0.7811],
  [152, 0.7569], [142, 0.7408], [132, 0.7387], [122, 0.7428], [112, 0.7589], [102, 0.7791],
  [94, 0.7892], [86, 0.7751], [78, 0.7206], [74, 0.6741],
  [72.3, 0.6227],
  [74, 0.5672], [78, 0.5248], [86, 0.4582], [94, 0.4218], [102, 0.434], [110, 0.4945],
  [116, 0.543], [126, 0.5409], [138, 0.543], [150, 0.553], [158, 0.5591], [164, 0.5066],
  [172, 0.4501], [178, 0.442], [186, 0.4844], [192, 0.5349], [198, 0.6075],
  [200.3, 0.6519],
]

/** DockHandsetShape: the handset filling `b`, wound as one closed curve
 *  (quadratics through the anchors' midpoints, as DockContinents does).
 *  `weight` pushes every wall away from the centreline: 1 is Apple's
 *  handset, and the chunkier iPhone OS 1-2 one is a little fuller. */
function handsetPath(b: Box, weight: number): string {
  const pts = HANDSET.map(([deg, r]): [number, number] => {
    const a = (deg * Math.PI) / 180
    const rr = HANDSET_RADIUS + (r - HANDSET_RADIUS) * weight
    return [b.x0 + b.w * (HANDSET_CENTRE[0] + rr * Math.cos(a)), b.y0 + b.h * (HANDSET_CENTRE[1] + rr * Math.sin(a))]
  })
  const mid = (i: number, j: number) => P((pts[i][0] + pts[j][0]) / 2, (pts[i][1] + pts[j][1]) / 2)
  const n = pts.length
  let d = `M${mid(n - 1, 0)} `
  for (let i = 0; i < n; i++) d += `Q${P(pts[i][0], pts[i][1])} ${mid(i, (i + 1) % n)} `
  return d + 'Z'
}

/** DockHandset: earpiece top-left, mouthpiece bottom-right. `heavy` is the
 *  chunky iPhone OS 1-2 handset; iPhone OS 3 slimmed it to Apple's weight. */
function handset(k: Kit, b: Box, look: HandsetLook): string {
  const d = handsetPath(b, look.kind === 'skeuomorphic' && look.heavy ? 1.16 : 1)
  switch (look.kind) {
    case 'skeuomorphic':
      return withFilter(
        path(d, linear(k, ['#fff', hex(0xdcdcdc)], [0, 0], [1, 1])),
        shadow(k, 'rgba(0,0,0,0.35)', 1.2, 0, 1.4),
      )
    case 'flat':
      return path(d, '#fff')
    case 'glass':
      return (
        place(path(d, fade(look.tint, 0.7)), { dy: 1.4 }) +
        path(d, linear(k, ['#fff', hex(0xf1fef3), fade(look.tint, 0.95)]))
      )
  }
}

const flatPhone = (k: Kit) => handset(k, flatHandset, { kind: 'flat' })

// ---------------------------------------------------------------- Messages

/** DockBubbleShape: an ellipse with a tail off the lower left, one closed
 *  path. `from`/`to` are degrees on the ellipse (0 = right, 90 = bottom)
 *  where the tail's outer edge leaves and its inner edge returns. */
interface Bubble {
  cx: number
  cy: number
  rx: number
  ry: number
  from: number
  to: number
  tipX: number
  tipY: number
}

/** iOS 7.0 - 18: bbox x 0.135-0.863, y 0.176-0.822. The tail is a narrow
 *  nub: its roots are only 14 degrees apart on the ellipse (measured at
 *  0.308, 0.733 and 0.387, 0.763), not the broad thumb a wider root draws. */
const flatBubble: Bubble = { cx: 0.499, cy: 0.475, rx: 0.364, ry: 0.3, from: 122, to: 108, tipX: 0.264, tipY: 0.82 }
/** iOS 26: a slightly narrower body, and a longer tail that leaves the
 *  ellipse higher (measured root 0.185, 0.64) and sweeps further left. */
const glassBubble: Bubble = { cx: 0.496, cy: 0.48, rx: 0.354, ry: 0.3, from: 148, to: 123, tipX: 0.187, tipY: 0.776 }

function bubblePath(b: Bubble): string {
  const at = (deg: number): [number, number] => {
    const a = (deg * Math.PI) / 180
    return [100 * (b.cx + b.rx * Math.cos(a)), 100 * (b.cy + b.ry * Math.sin(a))]
  }
  const inner = at(b.to)
  const outer = at(b.from)
  const tip: [number, number] = [100 * b.tipX, 100 * b.tipY]
  // Round the ellipse the long way (counter-clockwise) from the tail's inner
  // root to its outer root; the Swift traces the same arc in 4-degree chords.
  const arc = `A${f(100 * b.rx)},${f(100 * b.ry)} 0 1 0 ${P(...outer)}`
  // The outer edge runs almost straight down to the point; the inner edge
  // sweeps back up in a concave curve.
  const c1 = P(outer[0] - 1, (outer[1] + tip[1]) / 2)
  const c2 = P(tip[0] + (inner[0] - tip[0]) * 0.45, tip[1] - (tip[1] - inner[1]) * 0.05)
  return `M${P(...inner)} ${arc} Q${c1} ${P(...tip)} Q${c2} ${P(...inner)} Z`
}

const flatBubbleArt = () => path(bubblePath(flatBubble), '#fff')

// ---------------------------------------------------------------- Mail

/** DockEnvelopeFlap.addV: from the top-left corner down to the apex and up
 *  to the top-right corner, its point eased into a curve when `round` > 0. */
function flapV(b: Box, apex: number, round: number): string {
  const ax = b.cx
  const ay = b.y0 + b.h * apex
  if (round <= 0) return `L${P(ax, ay)} L${P(b.x1, b.y0)}`
  const dx = b.w * round
  const dy = (b.h * apex * dx) / (b.w / 2)
  return `L${P(ax - dx, ay - dy)} Q${P(ax, ay + dy * 0.35)} ${P(ax + dx, ay - dy)} L${P(b.x1, b.y0)}`
}

/** DockEnvelopeFlap: the flap alone. */
const flapPath = (b: Box, apex = 0.73, round = 0): string => `M${P(b.x0, b.y0)} ${flapV(b, apex, round)} Z`

/** DockEnvelopeSeams: the flap's V, and the pocket's two diagonals from the
 *  bottom corners up to the flap edge (`meetX` along the width). */
function seamsPath(b: Box, apex = 0.73, meetX = 0.3, round = 0): string {
  const meetY = b.y0 + (b.h * apex * meetX) / 0.5
  return (
    `M${P(b.x0, b.y0)} ${flapV(b, apex, round)} ` +
    `M${P(b.x0, b.y1)} L${P(b.x0 + b.w * meetX, meetY)} ` +
    `M${P(b.x1, b.y1)} L${P(b.x1 - b.w * meetX, meetY)}`
  )
}

const roundCaps = 'stroke-linecap="round" stroke-linejoin="round"'

/** DockEnvelope: the flat iOS 7-18 envelope, white paper with seams
 *  showing the background. Widths and corner are shares of the tile. */
function envelope(b: Box, seam: string, seamWidth: number, corner: number, apexRound: number): string {
  return (
    path(rrectPath(b.cx, b.cy, b.w, b.h, corner * 100, true), '#fff') +
    stroke(seamsPath(b, 0.73, 0.3, apexRound), seam, lineWidth(seamWidth, 0.6), roundCaps)
  )
}

/** DockCloudPuff: bright in the middle, fading to nothing at its rim. */
function puff(k: Kit, x: number, y: number, w: number, h: number, alpha = 0.95): string {
  const fill = radial(k, [
    [fade('#fff', alpha), 0],
    [fade('#fff', alpha * 0.85), 0.5],
    ['rgba(255,255,255,0)', 1],
  ])
  return ellipse(x * 100, y * 100, w * 100, h * 100, fill)
}

/** DockSkyMail: iPhone OS 1 - iOS 6. A sky that darkens under the shine,
 *  soft cumulus low left and on the right edge, and a paper envelope with a
 *  shallow flap, thin seams and a drop shadow. */
function skyMail(k: Kit, sky: Array<[number, number]>, seam: string, retina: boolean): string {
  let out = rect(50, 50, 100, 100, linear(k, sky.map(([c, o]): Stop => [hex(c), o])))
  if (retina) {
    out +=
      puff(k, 0.16, 0.94, 0.78, 0.3, 1) +
      puff(k, 0.44, 0.99, 0.56, 0.15, 0.85) +
      puff(k, 0.82, 0.94, 0.5, 0.11, 0.7) +
      puff(k, 0.8, 0.79, 0.3, 0.06, 0.5)
  } else {
    out += puff(k, 0.1, 0.95, 0.56, 0.24, 1) + puff(k, 0.34, 0.99, 0.4, 0.1, 0.75) + puff(k, 0.84, 0.95, 0.44, 0.09, 0.6)
  }
  out += puff(k, 0.96, 0.57, 0.32, 0.17, 0.9) + puff(k, 0.86, 0.61, 0.22, 0.07, 0.6)
  // Envelope: bbox x 0.17-0.83, y 0.30-0.72, square corners, the flap
  // reaching a little past halfway down.
  const b = box(0.17, 0.3, 0.83, 0.72)
  const border = lineWidth(0.006, 0.4)
  const envelopeMarkup =
    rect(b.cx, b.cy, b.w, b.h, linear(k, [hex(0xf4f6f8), hex(0xdde2e7)])) +
    path(flapPath(b, 0.57), frameLinear(k, ['#fff', hex(0xf1f3f5)], b.cx, b.y0, b.cx, b.y1)) +
    stroke(seamsPath(b, 0.57, 0.34), seam, lineWidth(0.009, 0.5)) +
    rect(b.cx, b.cy, b.w - border, b.h - border, 'none', `stroke="${hex(0xb9c1cb)}" stroke-width="${f(border)}"`)
  return out + withFilter(envelopeMarkup, shadow(k, hex(0x0b2b66, 0.45), 1.2, 0, 1.4))
}

/** DockGlassEnvelope: iOS 26. An opaque white flap over a translucent
 *  blue-white pocket, bright seam lines and a thin specular outline. */
function glassEnvelope(k: Kit, b: Box): string {
  const corner = 3
  const outline = rrectPath(b.cx, b.cy, b.w, b.h, corner, true)
  const clipID = k.id('cp')
  k.def(`<clipPath id="${clipID}"><path d="${outline}"/></clipPath>`)
  const rim = lineWidth(0.008, 0.5)
  const markup =
    // The pocket: translucent blue-white glass, bluer toward the bottom.
    path(outline, linear(k, [hex(0xdcebfe), hex(0xb4d2f6), hex(0x8db8f3)])) +
    `<g clip-path="url(#${clipID})">` +
    // A soft blue shade cast by the flap onto the pocket.
    path(flapPath(b, 0.68, 0.09), hex(0x2f6fd6, 0.22), 'transform="translate(0 1.2)"') +
    // The flap: opaque white, a rounded apex about two thirds down.
    path(flapPath(b, 0.64, 0.09), frameLinear(k, ['#fff', hex(0xf4f8fd)], b.cx, b.y0, b.cx, b.y1)) +
    `</g>` +
    // The lower seams read as bright glowing lines, not cut-outs.
    stroke(seamsPath(b, 0.64, 0.33, 0.09), 'rgba(255,255,255,0.9)', lineWidth(0.009, 0.5), roundCaps) +
    stroke(rrectPath(b.cx, b.cy, b.w - rim, b.h - rim, corner - rim / 2, true), 'rgba(255,255,255,0.95)', rim)
  return withFilter(markup, shadow(k, hex(0x0a3c9a, 0.28), 2, 0, 1.6))
}

// ---------------------------------------------------------------- Safari

/** DockTickRing: `count` radial ticks round (cx, cy) in a ring of radius
 *  `r`; even ticks run in from `longInner`, odd from `shortInner` (shares
 *  of r), all out to `outer`. The first tick points at 3 o'clock. */
function tickRingPath(count: number, longInner: number, shortInner: number, outer: number, r: number, cx = 50, cy = 50): string {
  let d = ''
  for (let i = 0; i < count; i++) {
    const a = (i / count) * 2 * Math.PI
    const inner = (i % 2 === 0 ? longInner : shortInner) * r
    const [c, s] = [Math.cos(a), Math.sin(a)]
    d += `M${P(cx + c * inner, cy + s * inner)} L${P(cx + c * outer * r, cy + s * outer * r)} `
  }
  return d
}

/** DockStarShape: an eight-point star, long cardinal points (radius r),
 *  `short` diagonals, `inner` notches. */
function starPath(r: number, short: number, inner: number, cx = 50, cy = 50): string {
  let d = ''
  for (let step = 0; step < 16; step++) {
    const a = (step * Math.PI) / 8 - Math.PI / 2
    const rr = step % 2 === 0 ? (step % 4 === 0 ? 1 : short) : inner
    d += `${step === 0 ? 'M' : 'L'}${P(cx + Math.cos(a) * rr * r, cy + Math.sin(a) * rr * r)} `
  }
  return d + 'Z'
}

/** DockContinents: the pale land masses behind the pre-iOS 7 compass, smooth
 *  blobs through a handful of points each (unit square). */
const continents: Array<Array<[number, number]>> = [
  // Upper left.
  [
    [0.04, 0.16],
    [0.16, 0.08],
    [0.3, 0.1],
    [0.4, 0.19],
    [0.34, 0.27],
    [0.24, 0.25],
    [0.18, 0.36],
    [0.1, 0.34],
    [0.03, 0.26],
  ],
  // Upper right.
  [
    [0.68, 0.14],
    [0.82, 0.11],
    [0.95, 0.19],
    [0.97, 0.33],
    [0.87, 0.38],
    [0.79, 0.3],
    [0.7, 0.26],
  ],
  // A strip across the left.
  [
    [-0.02, 0.44],
    [0.12, 0.41],
    [0.27, 0.47],
    [0.23, 0.56],
    [0.09, 0.59],
    [-0.02, 0.55],
  ],
  // South America, tapering to the bottom.
  [
    [0.63, 0.52],
    [0.72, 0.49],
    [0.8, 0.55],
    [0.81, 0.64],
    [0.77, 0.72],
    [0.74, 0.83],
    [0.7, 0.96],
    [0.67, 0.9],
    [0.66, 0.78],
    [0.62, 0.67],
    [0.59, 0.58],
  ],
]

function continentsPath(): string {
  let d = ''
  for (const mass of continents) {
    const n = mass.length
    const at = (p: [number, number]) => P(p[0] * 100, p[1] * 100)
    const mid = (a: [number, number], b: [number, number]) => P(((a[0] + b[0]) / 2) * 100, ((a[1] + b[1]) / 2) * 100)
    d += `M${mid(mass[n - 1], mass[0])} `
    for (let i = 0; i < n; i++) d += `Q${at(mass[i])} ${mid(mass[i], mass[(i + 1) % n])} `
    d += 'Z '
  }
  return d
}

// SwiftUI's .serif design is New York; a system serif stack stands in.
const serifStack = `ui-serif, 'New York', Georgia, 'Times New Roman', serif`.replace(/'/g, '&apos;')

/** One N/E/S/W letter in its translucent disc. */
function cardinal(letter: string, x: number, y: number, rotation: number): string {
  const [cx, cy] = [x * 100, y * 100]
  return (
    circle(cx, cy, 15, hex(0xa1c0ee, 0.55)) +
    `<text x="${f(cx)}" y="${f(cy)}" text-anchor="middle" dominant-baseline="central" font-family="${serifStack}" font-size="11.5" font-weight="700" fill="#fff"${rotation ? ` transform="rotate(${rotation} ${f(cx)} ${f(cy)})"` : ''}>${letter}</text>`
  )
}

/** DockCompassRose: iPhone OS 1 - iOS 6. Sky darkening under the shine, a
 *  faint world map, a tick ring at the edge, and a white compass rose with
 *  N/E/S/W in translucent discs. The needle is roseNeedle, over the shine. */
function compassRose(k: Kit): string {
  // Base colours sit under the system shine, so the top is darker than the
  // sampled surface; the darkest band is just below the shine.
  const sky = linear(k, [
    [hex(0x5f8ce0), 0],
    [hex(0x4a88e6), 0.36],
    [hex(0x2876e3), 0.47],
    [hex(0x4ea0ea), 0.7],
    [hex(0x8bdefc), 1],
  ])
  return (
    rect(50, 50, 100, 100, sky) +
    path(continentsPath(), hex(0xc4eeff, 0.2)) +
    // The tick ring hugs the tile edge.
    stroke(tickRingPath(72, 0.93, 0.93, 1, 49), hex(0x3c8fe6, 0.85), lineWidth(0.012, 0.5)) +
    cardinal('N', 0.5, 0.13, 0) +
    cardinal('S', 0.5, 0.87, 0) +
    cardinal('W', 0.13, 0.5, -90) +
    cardinal('E', 0.87, 0.5, 90) +
    // The rose: long thin cardinal points to r 0.30, short diagonals to
    // r 0.20, a tinted disc and a white ring at r 0.14.
    path(starPath(30, 0.66, 0.13), '#fff') +
    circle(50, 50, 28, hex(0x8dbdf2, 0.55)) +
    ring(50, 50, 30, lineWidth(0.016, 0.5), 'rgba(255,255,255,0.95)')
  )
}

/** DockRoseNeedle: the pre-iOS 7 needle and its chrome pivot cap, burnt
 *  orange to the north-east and silver to the south-west, each half a lit
 *  facet (upper left) on a shaded one. Drawn above the system shine. */
function roseNeedle(k: Kit): string {
  const w = 11.5
  const half = 45.5
  const [l, m, r] = [50 - w / 2, 50, 50 + w / 2]
  const [top, bottom] = [50 - half, 50 + half]
  const needle =
    // Each half is laid down whole in its shade colour and the lit facet
    // goes on top, so no background leaks along the seam.
    path(`M${P(m, top)} L${P(r, 50)} L${P(l, 50)} Z`, linear(k, [hex(0xbc5826), hex(0xa94e21)])) +
    path(`M${P(m, top)} L${P(m, 50)} L${P(l, 50)} Z`, linear(k, [hex(0xe06c31), hex(0xcd5f29)])) +
    path(`M${P(m, bottom)} L${P(l, 50)} L${P(r, 50)} Z`, linear(k, [hex(0xa4a4a4), hex(0xb2b2b2)])) +
    path(`M${P(m, bottom)} L${P(m, 50)} L${P(l, 50)} Z`, hex(0xf2f2f2))
  const cap =
    circle(50, 50, 7.8, radial(k, ['#fff', hex(0xc7cdd4)], [0.4, 0.35], 4.5 / 7.8)) +
    ring(50, 50, 7.8, lineWidth(0.005, 0.4), hex(0x7e8791, 0.7))
  return withFilter(`<g transform="rotate(45 50 50)">${needle}</g>`, shadow(k, hex(0x0a2a66, 0.45), 1, 0.8, 1.4)) + cap
}

/** DockCompass: the flat dial of iOS 7 onward. */
interface CompassOptions {
  /** Disc diameter, share of the tile. */
  disc: number
  face: [string, string]
  ticks?: number
  tickInk: string
  longInner?: number
  shortInner?: number
  tickOuter?: number
  /** Tick width, share of the tile. Ticks run out to the disc's rim
   *  (tickOuter ~1), which is where Apple's stop. */
  tickWidth: number
  roundTicks: boolean
  /** Degrees clockwise from north for the red tip. */
  angle: number
  /** Needle tip radius and full base width, shares of the disc radius. */
  tip: number
  base: number
  red: string
  white: string
  /** Hub diameter, share of the disc radius; 0 for none. */
  hub?: number
  glass?: boolean
}

function compass(k: Kit, o: CompassOptions): string {
  const d = o.disc * 100
  const r = d / 2
  const glass = o.glass ?? false
  let out = circle(50, 50, d, linear(k, o.face))
  if (glass) out += ring(50, 50, d, lineWidth(0.01, 0.5), 'rgba(255,255,255,0.45)')
  out += stroke(
    tickRingPath(o.ticks ?? 72, o.longInner ?? 0.75, o.shortInner ?? 0.83, o.tickOuter ?? 0.985, r),
    o.tickInk,
    lineWidth(o.tickWidth, 0.5),
    o.roundTicks ? 'stroke-linecap="round"' : '',
  )
  // A two-colour needle of two triangles meeting at the centre.
  const nw = r * o.base
  const nh = r * o.tip
  let needle =
    `<g transform="rotate(${f(o.angle)} 50 50)">` +
    path(`M${P(50, 50 - nh)} L${P(50 + nw / 2, 50)} L${P(50 - nw / 2, 50)} Z`, o.red) +
    path(`M${P(50, 50 + nh)} L${P(50 - nw / 2, 50)} L${P(50 + nw / 2, 50)} Z`, o.white) +
    `</g>`
  if (glass) needle = withFilter(needle, shadow(k, 'rgba(0,0,0,0.22)', 1.2, 0, 1))
  out += needle
  const hub = o.hub ?? 0
  if (hub > 0) {
    const hd = r * hub
    out +=
      circle(50, 50, hd, radial(k, [hex(0xfb908d), hex(0xf21c1c)], [0.4, 0.35], (r * hub * 0.6) / hd)) +
      ring(50, 50, hd, lineWidth(0.005, 0.4), hex(0xa9403f, 0.6))
  }
  return glass ? withFilter(out, shadow(k, 'rgba(0,0,0,0.12)', 1.5, 0, 1.2)) : out
}

// ---------------------------------------------------------------- Music

/** DockIPodShape: the iPod classic silhouette, filled even-odd so the screen
 *  and the click wheel ring are holes and the centre button is solid. */
function ipodPath(): string {
  const rr = (b: Box, corner: number) => rrectPath(b.cx, b.cy, b.w, b.h, corner, true)
  const oval = (b: Box) => ellipsePath(b.cx, b.cy, b.w, b.h)
  return [
    rr(box(0.305, 0.15, 0.695, 0.81), 3.5),
    rr(box(0.347, 0.208, 0.653, 0.417), 1.2),
    oval(box(0.342, 0.452, 0.658, 0.768)),
    oval(box(0.454, 0.564, 0.546, 0.656)),
  ].join(' ')
}

const ipod = (fill: string, extra = ''): string => path(ipodPath(), fill, `fill-rule="evenodd" ${extra}`)

/** DockIPod: the striped iPod of iPhone OS 3 and iOS 4, with its shadow. */
function stripedIPod(k: Kit): string {
  return (
    stripes(0.035, 'rgba(255,255,255,0.09)', 1.75) +
    // The drop shadow as an offset silhouette: it falls below the body and
    // just inside the top edges of the screen and wheel cut-outs.
    ipod(hex(0x6a2a00, 0.35), 'transform="translate(0 1.4)"') +
    ipod(tileLinear(k, ['#fff', hex(0xeff2f2)]))
  )
}

/** DockCornerGlow: a soft colour pooling in one bottom corner. */
function cornerGlow(k: Kit, colour: number, corner: [number, number]): string {
  return rect(50, 50, 100, 100, radial(k, [hex(colour, 0.85), hex(colour, 0)], corner, 0.55))
}

/** DockNoteShape.Geometry: a beamed pair of eighth notes. */
interface NoteGeometry {
  leftStem: [number, number]
  rightStem: [number, number]
  /** Beam top-edge y at the left stem's outer edge and the right stem's. */
  beamLeftY: number
  beamRightY: number
  beamThickness: number
  /** Note-head semi-axes and centres; heads lean 20 degrees, right end up. */
  headA: number
  headB: number
  leftHead: [number, number]
  rightHead: [number, number]
}

const notes = {
  /** iOS 5-6: the maroon note, x 0.263-0.712, y 0.175-0.80. */
  ios5: {
    leftStem: [0.407, 0.441],
    rightStem: [0.678, 0.712],
    beamLeftY: 0.255,
    beamRightY: 0.175,
    beamThickness: 0.15,
    headA: 0.087,
    headB: 0.058,
    leftHead: [0.35, 0.745],
    rightHead: [0.625, 0.665],
  },
  /** iOS 7-8.3: x 0.166-0.724, y 0.150-0.824. */
  ios7: {
    leftStem: [0.333, 0.374],
    rightStem: [0.683, 0.724],
    beamLeftY: 0.222,
    beamRightY: 0.15,
    beamThickness: 0.155,
    headA: 0.105,
    headB: 0.075,
    leftHead: [0.27, 0.749],
    rightHead: [0.62, 0.682],
  },
  /** iOS 8.4-13: x 0.197-0.733, y 0.153-0.831. */
  appleMusic: {
    leftStem: [0.354, 0.394],
    rightStem: [0.693, 0.732],
    beamLeftY: 0.225,
    beamRightY: 0.153,
    beamThickness: 0.155,
    headA: 0.1,
    headB: 0.072,
    leftHead: [0.2955, 0.755],
    rightHead: [0.6335, 0.6875],
  },
  /** iOS 14-18: x 0.200-0.728, y 0.156-0.828, thinner stems. */
  ios14: {
    leftStem: [0.356, 0.389],
    rightStem: [0.694, 0.728],
    beamLeftY: 0.228,
    beamRightY: 0.156,
    beamThickness: 0.155,
    headA: 0.097,
    headB: 0.072,
    leftHead: [0.2945, 0.7515],
    rightHead: [0.6335, 0.6875],
  },
  /** iOS 18: the iOS 14 note nudged right, x 0.211-0.739. */
  ios18: {
    leftStem: [0.367, 0.4],
    rightStem: [0.705, 0.739],
    beamLeftY: 0.228,
    beamRightY: 0.156,
    beamThickness: 0.155,
    headA: 0.097,
    headB: 0.072,
    leftHead: [0.3055, 0.7515],
    rightHead: [0.6445, 0.6875],
  },
  /** iOS 26-27: x 0.209-0.743, y 0.153-0.83. */
  ios26: {
    leftStem: [0.365, 0.403],
    rightStem: [0.704, 0.743],
    beamLeftY: 0.226,
    beamRightY: 0.153,
    beamThickness: 0.155,
    headA: 0.1,
    headB: 0.073,
    leftHead: [0.306, 0.752],
    rightHead: [0.644, 0.686],
  },
} satisfies Record<string, NoteGeometry>

/** DockNoteShape: beam, two stems and two leaning heads, all wound
 *  clockwise so the union fills cleanly. */
function notePath(g: NoteGeometry): string {
  const at = (x: number, y: number) => P(x * 100, y * 100)
  const slope = (g.beamRightY - g.beamLeftY) / (g.rightStem[1] - g.leftStem[0])
  const beamTop = (x: number) => g.beamLeftY + slope * (x - g.leftStem[0])
  // Beam: a parallelogram from the left stem's outer edge to the right stem's.
  let d =
    `M${at(g.leftStem[0], g.beamLeftY)} L${at(g.rightStem[1], g.beamRightY)} ` +
    `L${at(g.rightStem[1], g.beamRightY + g.beamThickness)} L${at(g.leftStem[0], g.beamLeftY + g.beamThickness)} Z `
  // Stems: from inside the beam down into each head.
  for (const [stem, head] of [
    [g.leftStem, g.leftHead],
    [g.rightStem, g.rightHead],
  ] as const) {
    const top = beamTop(stem[0]) + g.beamThickness * 0.5
    d += `M${at(stem[0], top)} L${at(stem[1], top)} L${at(stem[1], head[1])} L${at(stem[0], head[1])} Z `
  }
  // Heads: ellipses leaning 20 degrees (right end up), traced clockwise.
  const lean = (-20 * Math.PI) / 180
  const [a, b] = [g.headA * 100, g.headB * 100]
  for (const [hx, hy] of [g.leftHead, g.rightHead]) {
    const ex = a * Math.cos(lean)
    const ey = a * Math.sin(lean)
    const arc = `A${f(a)},${f(b)} -20 0 1`
    d += `M${P(hx * 100 + ex, hy * 100 + ey)} ${arc} ${P(hx * 100 - ex, hy * 100 - ey)} ${arc} ${P(hx * 100 + ex, hy * 100 + ey)} Z `
  }
  return d
}

/** DockNote: the note filled in one style, with a round-joined stroke of
 *  the same style to soften its corners; `opacity` fades it as one layer.
 *  The stroke is kept narrow: a wide one rounds the corners nicely but also
 *  grows the whole glyph by half its width, which reads as a bolder note
 *  than Apple's (measured 11% heavier at 0.018). */
function note(g: NoteGeometry, style: string, opacity = 1, dy = 0): string {
  const markup = `<path d="${notePath(g)}" fill="${style}" stroke="${style}" stroke-width="${f(lineWidth(0.01, 0.4))}" stroke-linejoin="round"/>`
  if (opacity >= 1 && !dy) return markup
  return place(markup, { dy, opacity })
}

// ---------------------------------------------------------------- the apps

export const dock: HomeAppDef[] = [
  // MARK: Phone
  // Generations: OS 1-2 flat green | OS 3-6 striped | 7.0 neon | 7.1-10 | 11-17 | 18 | 26-27.
  {
    id: 'Phone',
    designs: [
      // iPhone OS 1-2: flat medium green, no stripes; a small glossy handset
      // sitting high (bbox x 0.24-0.78, y 0.22-0.72).
      design(2007, 0x00ac22, 0x00c92a, (k) => handset(k, box(0.24, 0.22, 0.78, 0.73), { kind: 'skeuomorphic', heavy: true })),
      // iPhone OS 3 - iOS 6: darker green with 45-degree pinstripes (period
      // ~0.066 of side, ~5% contrast); a slimmer, larger, grey-shaded
      // handset. The ground holds dark green to just below the shine, then
      // brightens to neon over the bottom third.
      design(
        2009,
        0x007c00,
        0x0af203,
        (k) =>
          ground(k, striped) +
          stripes(0.066, 'rgba(255,255,255,0.07)', 3.3) +
          handset(k, box(0.21, 0.21, 0.8, 0.75), { kind: 'skeuomorphic', heavy: false }),
      ),
      // iOS 7.0: the neon green; flat white handset, bbox 0.184-0.822.
      design(2013, 0x87fc70, 0x0bd318, flatPhone),
      // iOS 7.1 - 10: gradient darkened, glyph unchanged.
      design(2014, 0x67ff81, 0x01b41f, flatPhone),
      // iOS 11 - 17: cooler gradient, glyph unchanged.
      design(2017, 0x5df777, 0x0abc28, flatPhone),
      // iOS 18: light icon retuned slightly.
      design(2024, 0x66fe80, 0x00b41e, flatPhone),
      // iOS 26-27: Liquid Glass; softer green, frosted white handset.
      design(2025, 0x54ef6e, 0x25c041, (k) => handset(k, box(0.182, 0.176, 0.818, 0.814), { kind: 'glass', tint: hex(0xace8b6) })),
    ],
  },

  // MARK: Mail
  // Generations: OS 1-3 periwinkle sky | iOS 4-6 Retina sky | 7.0-7.1 dark-on-top blue |
  // 8-10 bolder seams | 11-17 bigger envelope | 18 | 26-27 light-on-top glass envelope.
  {
    id: 'Mail',
    designs: [
      // iPhone OS 1 - 3: a white paper envelope over a periwinkle sky that
      // deepens under the shine and turns cyan at the bottom, with wisps of
      // cloud low left and on the right edge.
      design(2007, 0x6f86e0, 0x45b7f1, (k) =>
        skyMail(
          k,
          [
            [0x6f86e0, 0],
            [0x5a7fe2, 0.36],
            [0x2466d6, 0.47],
            [0x2b86df, 0.64],
            [0x45b7f1, 1],
          ],
          hex(0x7d8ba0),
          false,
        ),
      ),
      // iOS 4 - 6: the Retina redraw; a lighter sky-blue top, softer grey
      // seams and a fuller cloud bank at the lower left.
      design(2010, 0x7fa9ec, 0x8dc8ee, (k) =>
        skyMail(
          k,
          [
            [0x7fa9ec, 0],
            [0x5d99ea, 0.36],
            [0x2a6ec4, 0.47],
            [0x3d84d1, 0.6],
            [0x59a0dd, 0.72],
            [0x8dc8ee, 1],
          ],
          hex(0xaeb8c4),
          true,
        ),
      ),
      // iOS 7.0 - 7.1: the one iOS 7 icon that ran DARK to LIGHT. Envelope
      // bbox x 0.167-0.817, y 0.283-0.700; hairline seams, the flap's V
      // rounded at its apex.
      design(2013, 0x1d62f0, 0x1ad6fd, () => envelope(box(0.167, 0.283, 0.817, 0.7), hex(0x1c9bf6), 0.008, 0, 0.05)),
      // iOS 8 - 10: seams doubled in weight, gradient a shade deeper.
      design(2014, 0x1e53ee, 0x19e3ff, () => envelope(box(0.168, 0.294, 0.832, 0.706), hex(0x1c9bf6), 0.017, 0, 0.055)),
      // iOS 11 - 17: envelope enlarged (x 0.145-0.855), corners softened, a
      // rounder notch at the flap's apex.
      design(2017, 0x1d70f1, 0x1ac8fb, () => envelope(box(0.145, 0.274, 0.855, 0.726), hex(0x1b9cf6), 0.02, 0.012, 0.07)),
      // iOS 18: near-identical light icon.
      design(2024, 0x1d70f2, 0x1ac7fc, () => envelope(box(0.145, 0.272, 0.855, 0.728), hex(0x1b9cf7), 0.02, 0.012, 0.07)),
      // iOS 26-27: gradient flips light-on-top; a glass envelope with an
      // opaque white flap over a translucent blue pocket.
      design(2025, 0x57bef4, 0x1d74fd, (k) => glassEnvelope(k, box(0.127, 0.25, 0.873, 0.749))),
    ],
  },

  // MARK: Safari
  // Generations: OS 1-6 compass rose over a map | 7-10 flat dial | 11-18 softer needle |
  // 26 glass lens | 27 brighter cyan dial with a hub.
  {
    id: 'Safari',
    designs: [
      // iPhone OS 1 - iOS 6: white compass rose, N/E/S/W, an orange and
      // silver needle pointing north-east, all over a blue world map. Apple
      // prerendered this icon with its shine UNDER the needle, so the needle
      // rides above the system shine (`over`) to keep its orange.
      design(2007, 0x5f8ce0, 0x8bdefc, compassRose, roseNeedle),
      // iOS 7 - 10: blue disc (0.865 of the side) on a white tile, 72
      // alternating ticks, a sharp needle whose tips touch the ring.
      flat(2013, 0xffffff, (k) =>
        compass(k, {
          disc: 0.865,
          face: [hex(0x1ad6fd), hex(0x1d62f0)],
          tickInk: '#fff',
          tickWidth: 0.008,
          roundTicks: false,
          angle: 45,
          tip: 0.985,
          base: 0.27,
          red: hex(0xff3b30),
          white: '#fff',
        }),
      ),
      // iOS 11 - 18: darker face, rounded ticks, a shorter, flatter needle.
      flat(2017, 0xffffff, (k) =>
        compass(k, {
          disc: 0.869,
          face: [hex(0x1cd5fc), hex(0x1e62f0)],
          tickInk: '#fff',
          tickWidth: 0.009,
          roundTicks: true,
          angle: 50,
          tip: 0.92,
          base: 0.23,
          red: hex(0xff3b30),
          white: '#fff',
        }),
      ),
      // iOS 26: off-white glass tile, smaller lens (0.80), 48 pale ticks
      // (24 long, 24 short, measured 7.5 degrees apart), the needle back at
      // 45 degrees.
      design(2025, 0xffffff, 0xececec, (k) =>
        compass(k, {
          disc: 0.8,
          face: [hex(0x5abdf9), hex(0x1d74fd)],
          ticks: 48,
          tickInk: hex(0xd6ecfe, 0.85),
          shortInner: 0.8,
          tickWidth: 0.009,
          roundTicks: true,
          angle: 45,
          tip: 0.91,
          base: 0.23,
          red: hex(0xff413b),
          white: hex(0xebf5ff),
          glass: true,
        }),
      ),
      // iOS 27: brighter cyan-blue, 36 finer ticks, a bolder needle on a
      // visible red hub.
      design(2026, 0xf4f5f7, 0xecf0f1, (k) =>
        compass(k, {
          disc: 0.8,
          face: [hex(0x00abf1), hex(0x0b81e3)],
          ticks: 36,
          tickInk: hex(0xd5ffff, 0.9),
          longInner: 0.76,
          shortInner: 0.82,
          tickWidth: 0.008,
          roundTicks: true,
          angle: 45,
          tip: 0.88,
          base: 0.25,
          red: hex(0xfb0a0a),
          white: hex(0xecf4f4),
          hub: 0.18,
          glass: true,
        }),
      ),
    ],
  },

  // MARK: Music
  // Generations: iPod OS 1-2 | iPod OS 3 striped | iPod iOS 4 Retina | Music iOS 5-6 maroon note |
  // 7 pink-to-orange | 8.0-8.3 reversed | 8.4-13 Apple Music white | 14-17 red | 18 | 26-27 glass.
  {
    id: 'Music',
    names: [
      [era(2007), 'iPod'],
      [era(2011), 'Music'],
    ],
    designs: [
      // iPhone OS 1-2: white iPod classic silhouette on plain orange; screen
      // and click wheel are cut-outs showing the orange.
      design(2007, 0xff6a00, 0xffb80c, () => ipod('#fff')),
      // iPhone OS 3: pinstripes added, icon darkened, iPod gets a shadow.
      design(2009, 0xf86000, 0xfdc40f, stripedIPod),
      // iOS 4: the Retina redraw, deeper orange running to yellow.
      design(2010, 0xd06000, 0xf9cc03, stripedIPod),
      // iOS 5-6: a maroon beamed note pressed into mottled orange (red
      // bottom-left, yellow bottom-right), letterpressed: a light bevel
      // below, a dark lip along the top. The note sat above Apple's own
      // shine, so it rides above the system shine too (`over`).
      design(
        2011,
        0xe8862e,
        0xe85a08,
        (k) => cornerGlow(k, 0xe0100a, [0, 1]) + cornerGlow(k, 0xe8b608, [1, 1]),
        (k) =>
          note(notes.ios5, hex(0xffe2b0), 0.45, 1) +
          note(notes.ios5, hex(0x3e0a02), 1, -0.6) +
          note(
            notes.ios5,
            tileLinear(k, [
              [hex(0x5a1408), 0.18],
              [hex(0x7c180a), 0.45],
              [hex(0x791605), 0.8],
            ]),
          ),
      ),
      // iOS 7.0-7.1: pink-red on TOP fading to orange, white note.
      design(2013, 0xff2a68, 0xff5e3a, () => note(notes.ios7, '#fff')),
      // iOS 8.0-8.3: the same gradient reversed, orange on top.
      design(2014, 0xff5e3a, 0xff2a68, () => note(notes.ios7, '#fff')),
      // iOS 8.4-13: Apple Music; a note on white running coral-pink at the
      // beam to magenta and violet down the left stem, with the right stem
      // and head shifting to blue.
      flat(2015, 0xffffff, (k) => {
        const down = tileLinear(k, [
          [hex(0xfb5c6e), 0.16],
          [hex(0xe25a9b), 0.4],
          [hex(0xc15dc3), 0.52],
          [hex(0x8a69f7), 0.66],
          [hex(0x6a74f4), 0.84],
        ])
        const across = frameLinear(
          k,
          [
            [hex(0x42a5f5, 0), 0.45],
            [hex(0x42a5f5), 0.66],
          ],
          0,
          0,
          100,
          0,
        )
        const fadeIn = mask(
          k,
          rect(
            50,
            50,
            100,
            100,
            tileLinear(k, [
              ['rgba(255,255,255,0)', 0.3],
              ['#fff', 0.62],
            ]),
          ),
        )
        return note(notes.appleMusic, down) + `<g mask="${fadeIn}">${note(notes.appleMusic, across)}</g>`
      }),
      // iOS 14-17: the Apple Music red pair returns with a white note.
      design(2020, 0xfb5c74, 0xfa233b, () => note(notes.ios14, '#fff')),
      // iOS 18: light icon retuned, the note nudged right ~0.011.
      design(2024, 0xfc5a74, 0xfa243e, () => note(notes.ios18, '#fff')),
      // iOS 26-27: more saturated red; frosted note fading toward the heads.
      // iOS 27 kept the iOS 26 artwork.
      design(
        2025,
        0xff4e6f,
        0xff002d,
        (k) => note(notes.ios26, hex(0xc0002a), 0.35, 1.2) + note(notes.ios26, tileLinear(k, [hex(0xfff3f5), hex(0xfdd3db), hex(0xf9a9b8)])),
      ),
    ],
  },

  // MARK: Messages
  // Generations: OS 1-2 "Text" SMS bubble | OS 3-6 empty glossy bubble on stripes |
  // 7.0 | 7.1-10 | 11-17 | 18 | 26-27 glass bubble.
  {
    id: 'Messages',
    names: [
      [era(2007), 'Text'],
      [era(2009), 'Messages'],
    ],
    designs: [
      // iPhone OS 1-2: app named Text; a yellower green with a white bubble
      // reading "SMS" in a rounded bold sans.
      design(
        2007,
        0x3cb012,
        0x81d367,
        (k) =>
          path(
            bubblePath({ cx: 0.51, cy: 0.46, rx: 0.33, ry: 0.245, from: 129, to: 107, tipX: 0.27, tipY: 0.79 }),
            tileLinear(k, ['#fff', hex(0xeef1f4)]),
            `filter="${shadow(k, 'rgba(0,0,0,0.3)', 1, 0, 1.2)}"`,
          ) + text('SMS', 51, 46.5, 23.5, { fill: hex(0x2caa00), weight: weight.heavy, family: 'rounded' }),
      ),
      // iPhone OS 3 - iOS 6: renamed Messages; SMS gone, stripes in, and
      // pixel for pixel the same striped green ground as Phone.
      design(
        2009,
        0x007c00,
        0x0af203,
        (k) =>
          ground(k, striped) +
          stripes(0.066, 'rgba(255,255,255,0.07)', 3.3) +
          path(
            bubblePath({ cx: 0.496, cy: 0.45, rx: 0.318, ry: 0.26, from: 130, to: 105, tipX: 0.29, tipY: 0.8 }),
            tileLinear(k, [hex(0xf5f8fb), hex(0xe6edf4), hex(0xeef3f8)]),
            `filter="${shadow(k, hex(0x003d00, 0.4), 1.2, 0, 1.4)}"`,
          ),
      ),
      // iOS 7.0: the flat white bubble (ellipse rx 0.364, ry 0.30) that then
      // stayed pixel-identical through iOS 18.
      design(2013, 0x87fc70, 0x0bd318, flatBubbleArt),
      design(2014, 0x67ff81, 0x01b41f, flatBubbleArt),
      design(2017, 0x5df777, 0x0abc28, flatBubbleArt),
      design(2024, 0x66fe80, 0x00b41e, flatBubbleArt),
      // iOS 26-27: frosted glass bubble, white fading to pale green.
      design(
        2025,
        0x54ef6e,
        0x25c041,
        (k) =>
          path(bubblePath(glassBubble), hex(0x1e8a34, 0.25), 'transform="translate(0 1.4)"') +
          path(bubblePath(glassBubble), tileLinear(k, ['#fff', hex(0xf3fdf5), hex(0xd1f3d7), hex(0xa6e8b2)])),
      ),
    ],
  },
]
