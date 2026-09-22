// Port of HomeIcons+Paper.swift: Calendar, Notes, Reminders, Settings,
// Calculator, Stocks, Compass. Every design keeps the Swift year, background
// stops and glyph geometry; the file-private Swift views are the private
// functions below (PaperCalendarArt -> calendarPage, and so on), each drawn
// in the 100 x 100 box, so a Swift `s * f` is `100 * f` here.
//
// Two SwiftUI facts that shape this file:
// - A Shape filled with a gradient spreads it over the shape's FRAME, not the
//   path's bounds (PaperGearShape's `extent` and PaperSpokes rely on it), so
//   those fills are user-space gradients over the Swift frame (frameFill()).
// - RoundedRectangle(cornerRadius:) and Path(roundedRect:cornerRadius:)
//   default to `.continuous` in the SDK the app builds with, so every rounded
//   rect here is continuous.
// Swift's `max(0.6, s * f)` line widths are in points; they are converted
// with the icon edge the gallery draws that era at (see px()).
// The Calendar and Notes designs of 2007-2012 draw above the system gloss
// (`.zIndex(1)` in Swift), so they are `over` layers here.

import type { Art, Family, HomeAppDef, Kit, Stop } from './kit'
import {
  angular,
  capsule,
  capsulePath,
  circle,
  design,
  ellipse,
  ellipsePath,
  fade,
  flat,
  gradientStops,
  hex,
  linear,
  needleShapePath,
  nothing,
  path,
  radial,
  rect,
  ring,
  rrectPath,
  shadow,
  symbol,
  text,
  weight,
} from './kit'

// ---------------------------------------------------------------- helpers

const f = (v: number) => +v.toFixed(3)

/** The icon edge (pt) the gallery draws each era at: 57/320 of a 375 pt
 *  screen to 2012, 60/320 in 2013, 60 pt after. */
const GLOSSY = (375 * 57) / 320
const IOS7 = (375 * 60) / 320
const FLAT = 60

/** A Swift line width `max(minPt, s * frac)` in the 100 box. */
const px = (minPt: number, frac: number, edge: number) => Math.max((minPt * 100) / edge, frac * 100)

const WHITE = '#fff'
const CLEAR = 'rgba(0,0,0,0)'
const black = (a: number) => `rgba(0,0,0,${a})`
const white = (a: number) => `rgba(255,255,255,${a})`

/** A gradient spread over a given user-space box (a Swift shape's frame)
 *  instead of the painted element's own bounds. */
function frameFill(k: Kit, list: Array<Stop | string>, x1: number, y1: number, x2: number, y2: number): string {
  const id = k.id('ff')
  k.def(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${gradientStops(list)}</linearGradient>`)
  return `url(#${id})`
}

/** Top-to-bottom gradient over the band y0...y1. */
const vFill = (k: Kit, list: Array<Stop | string>, y0: number, y1: number) => frameFill(k, list, 0, y0, 0, y1)

/** One colour, or a top-to-bottom gradient over the element's bounds. */
const paint = (k: Kit, colours: string[]) => (colours.length > 1 ? linear(k, colours) : colours[0])

/** PaperLines: horizontal rules at `ys` from x0 to x1, vertical at `xs`
 *  from y0 to y1, all in unit coordinates. */
function lines(o: { ys?: number[]; x0?: number; x1?: number; xs?: number[]; y0?: number; y1?: number }): string {
  const x0 = (o.x0 ?? 0) * 100
  const x1 = (o.x1 ?? 1) * 100
  const y0 = (o.y0 ?? 0) * 100
  const y1 = (o.y1 ?? 1) * 100
  let d = ''
  for (const y of o.ys ?? []) d += `M${f(x0)},${f(y * 100)} H${f(x1)} `
  for (const x of o.xs ?? []) d += `M${f(x * 100)},${f(y0)} V${f(y1)} `
  return d
}

const stroke = (d: string, colour: string, width: number, extra = '') =>
  `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${f(width)}" ${extra}/>`

/** A rounded rect's strokeBorder: the shape inset by half the line, its
 *  corner shrunk by the same (RoundedRectangle's inset), continuous. */
function rrectBorder(cx: number, cy: number, w: number, h: number, r: number, lw: number, colour: string, extra = ''): string {
  return stroke(rrectPath(cx, cy, w - lw, h - lw, Math.max(0, r - lw / 2), true), colour, lw, extra)
}

/** Continuous rounded rect fill. */
const crect = (cx: number, cy: number, w: number, h: number, r: number, fill: string, extra = '') =>
  path(rrectPath(cx, cy, w, h, r, true), fill, extra)

const turn = (deg: number, cx = 50, cy = 50) => (deg ? `transform="rotate(${f(deg)} ${f(cx)} ${f(cy)})"` : '')

/** A SwiftUI Font as the kit's text() needs it; `size` is a share of s. */
interface Face {
  size: number
  weight: number
  family: Family
}
/** SwiftUI's `.system(weight: .ultraLight)`. Chrome maps CSS 100 on the
 *  variable San Francisco to a stroke 1.6x the iOS one; CSS 1 (the axis
 *  minimum) matches it (measured against the iOS Calendar captures). */
const SF_ULTRALIGHT = 1

const helveticaBold = (size: number): Face => ({ size, weight: weight.bold, family: 'helvetica' })
const helveticaNeue = (size: number, w: number = weight.regular): Face => ({ size, weight: w, family: 'helveticaNeue' })
const system = (size: number, w: number): Face => ({ size, weight: w, family: 'sf' })

/** Chrome centres a line of San Francisco 0.378 em above its baseline
 *  (the kit's line box); SwiftUI sets it about 0.025 em higher (measured on
 *  the iOS captures: 1 pt on the 37 pt Calendar numeral, 0.3 pt on the
 *  weekday; Helvetica and Helvetica Neue agree). */
const SF_RAISE = 0.025

const say = (str: string, cx: number, cy: number, face: Face, fill: string, extra = '') =>
  text(str, cx, cy - (face.family === 'sf' ? SF_RAISE * face.size * 100 : 0), face.size * 100, { fill, weight: face.weight, family: face.family, extra })

const serifFamily = `'New York', ui-serif, Georgia, 'Times New Roman', serif`.replace(/'/g, '&apos;')

/** Text in SwiftUI's `.serif` design, bold, turned `rotate` degrees about its centre. */
function serif(str: string, cx: number, cy: number, size: number, fill: string, rotate = 0): string {
  return `<text x="${f(cx)}" y="${f(cy)}" text-anchor="middle" dominant-baseline="central" font-family="${serifFamily}" font-size="${f(size)}" font-weight="700" fill="${fill}" ${turn(rotate, cx, cy)}>${str}</text>`
}

/** PaperTriangle: an upward triangle in a w x h frame centred at (cx, cy). */
const trianglePath = (cx: number, cy: number, w: number, h: number) =>
  `M${f(cx)},${f(cy - h / 2)} L${f(cx + w / 2)},${f(cy + h / 2)} L${f(cx - w / 2)},${f(cy + h / 2)} Z`

/** PaperPolyline: unit points joined; `closedToFoot` drops to the bottom. */
function polyline(points: Array<[number, number]>, closedToFoot = false): string {
  let d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x * 100)},${f(y * 100)}`).join(' ')
  if (closedToFoot) d += ` L${f(points[points.length - 1][0] * 100)},100 L${f(points[0][0] * 100)},100 Z`
  return d
}

/** PaperTicks: radial ticks round (50, 50) from 12 o'clock clockwise, from
 *  radius r0 to r1 (shares of the side). Every `every`th from `phase` is
 *  skipped, or kept alone when `only`. */
function ticks(count: number, r0: number, r1: number, every = 0, phase = 0, only = false): string {
  let d = ''
  for (let i = 0; i < count; i++) {
    if (every > 0 && (i % every === phase) !== only) continue
    const a = (i / count) * 2 * Math.PI
    const dx = Math.sin(a)
    const dy = -Math.cos(a)
    d += `M${f(50 + dx * r0 * 100)},${f(50 + dy * r0 * 100)} L${f(50 + dx * r1 * 100)},${f(50 + dy * r1 * 100)} `
  }
  return d
}

/** A row of dots along a line: a zero-length dash every `pitch` with round
 *  caps (PaperDotRow / PaperDotLines), one element however many holes. */
function dotted(d: string, colour: string, size: number, pitch: number): string {
  return stroke(d, colour, size, `stroke-linecap="round" stroke-dasharray="0 ${f(pitch)}"`)
}

/** PaperGearShape of outer radius `outer` round (cx, cy). `hole` adds a
 *  circle (fill it even-odd).
 *
 *  Apple's gears - the skeuomorphic Settings wheel and the iOS 26/27 glass
 *  one alike - have BLUNT teeth: a flat or softly rounded crest, a flat
 *  valley and short flanks, never the needle points a raw zigzag gives. So
 *  `cog` and `rounded` shape the radius with a normalised soft square wave
 *  of the tooth angle, `k` setting how square the crest is (small k = a
 *  machined cog, larger k = the rounded fingers of the glass gear). */
type Profile = 'square' | 'cog' | 'rounded'
const TOOTH_K: Record<string, number> = { cog: 0.3, rounded: 0.55 }
function gearPath(cx: number, cy: number, outer: number, teeth: number, depth: number, profile: Profile, hole = 0): string {
  const inner = outer * (1 - depth)
  const perTooth = profile === 'square' ? 4 : 12
  const steps = teeth * perTooth
  const k = TOOTH_K[profile] ?? 0.3
  const norm = Math.sqrt(1 + k * k)
  let d = ''
  for (let step = 0; step < steps; step++) {
    const a = (step / steps) * 2 * Math.PI
    let r: number
    if (profile === 'square') r = step % 4 < 2 ? outer : inner
    else {
      const u = Math.cos(teeth * a)
      r = inner + (outer - inner) * (0.5 + (0.5 * (u * norm)) / Math.sqrt(u * u + k * k))
    }
    d += `${step ? 'L' : 'M'}${f(cx + Math.cos(a) * r)},${f(cy + Math.sin(a) * r)} `
  }
  d += 'Z'
  if (hole > 0) d += ' ' + ellipsePath(cx, cy, outer * hole * 2, outer * hole * 2)
  return d
}

const EVENODD = 'fill-rule="evenodd"'

// ---------------------------------------------------------------- soft gloss

/** PaperSoftGloss: the design's own backdrop and art under the system's
 *  shine at `scale`, all drawn above the system's shine (an `over` layer). */
function softGloss(k: Kit, scale: number, content: string, backdrop?: string[]): string {
  const id = k.id('sg')
  k.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100"><stop offset="0" stop-color="#fff" stop-opacity="0.62"/><stop offset="1" stop-color="#fff" stop-opacity="0.16"/></linearGradient>`,
  )
  const back = backdrop ? rect(50, 50, 100, 100, linear(k, backdrop)) : ''
  return `${back}${content}<path d="M0,0 L100,0 L100,40 Q50,62 0,40 Z" fill="url(#${id})" opacity="${scale}"/>`
}

// ---------------------------------------------------------------- calendar

interface CalendarPage {
  header?: string[]
  headerHeight?: number
  seam?: string
  curl?: boolean
  page: string | null
  weekday: string
  weekdayFont: Face
  weekdayInk: string
  weekdayY: number
  weekdayShadow?: boolean
  numeralFont: Face
  numeralInk: string
  numeralY: number
  glass?: boolean
}

/** PaperCalendarArt: an optional header strip, a weekday, a big numeral. */
function calendarPage(k: Kit, o: CalendarPage): string {
  let out = o.page ? rect(50, 50, 100, 100, o.page) : ''
  if (o.header && o.header.length) {
    const hh = 100 * ((o.headerHeight ?? 0.28) - 0.012)
    out += rect(50, hh / 2, 100, hh, linear(k, o.header))
    out += rect(50, hh + 0.6, 100, 1.2, o.seam ?? CLEAR)
    if (o.curl) out += rect(50, hh + 1.2 + 2.5, 100, 5, linear(k, [black(0.35), CLEAR]))
  }
  const wy = o.weekdayY * 100
  if (o.weekdayShadow) out += say(o.weekday, 50, wy + 0.8, o.weekdayFont, black(0.45))
  out += say(o.weekday, 50, wy, o.weekdayFont, o.weekdayInk)
  const ny = o.numeralY * 100
  if (o.glass) {
    out += say('9', 51.2, ny + 1.6, o.numeralFont, black(0.16))
    out += say('9', 49.3, ny - 0.7, o.numeralFont, WHITE)
  }
  return out + say('9', 50, ny, o.numeralFont, o.numeralInk)
}

const calendar2007: Art = (k) =>
  softGloss(
    k,
    0.4,
    calendarPage(k, {
      header: [hex(0xe8868a), hex(0xdc5256), hex(0xcf1e24), hex(0xc0070c)],
      headerHeight: 0.28,
      seam: hex(0x7a0304),
      curl: false,
      page: WHITE,
      weekday: 'Tuesday',
      weekdayFont: helveticaBold(0.175),
      weekdayInk: WHITE,
      weekdayY: 0.16,
      weekdayShadow: true,
      numeralFont: helveticaBold(0.68),
      numeralInk: hex(0x333333),
      numeralY: 0.665,
    }),
  )

const calendar2010: Art = (k) =>
  softGloss(
    k,
    0.4,
    calendarPage(k, {
      header: [hex(0xd87c7c), hex(0xc44444), hex(0xb62626), hex(0x960f0f)],
      headerHeight: 0.275,
      seam: hex(0x2a0808),
      curl: true,
      page: null,
      weekday: 'Tuesday',
      weekdayFont: helveticaBold(0.18),
      weekdayInk: WHITE,
      weekdayY: 0.155,
      weekdayShadow: true,
      numeralFont: helveticaBold(0.8),
      numeralInk: hex(0x333333),
      numeralY: 0.63,
    }),
    [hex(0xf4f4f3), hex(0xe6e6e6)],
  )

const calendarFlat = (weekday: string, weekdayFont: Face, weekdayInk: string, weekdayY: number, numeralFont: Face, numeralInk: string, numeralY: number, glass = false): Art =>
  (k) => calendarPage(k, { page: glass ? null : WHITE, weekday, weekdayFont, weekdayInk, weekdayY, numeralFont, numeralInk, numeralY, glass })

// ---------------------------------------------------------------- notes

/** PaperTornEdge: flat on top, torn along the bottom, in the band y...y+h. */
function tornEdge(jagged: boolean, y: number, h: number): string {
  const soft = [0.55, 0.85, 0.65, 0.9, 0.6, 0.8, 0.7, 0.9, 0.6, 0.85, 0.55, 0.8, 0.7, 0.9, 0.6]
  const rough = [0.45, 1.0, 0.6, 0.95, 0.4, 0.85, 0.7, 1.0, 0.5, 0.9, 0.35, 0.8, 0.75, 0.95, 0.5]
  const jag = jagged ? rough : soft
  let d = `M0,${f(y)} L100,${f(y)}`
  for (let i = jag.length - 1; i >= 0; i--) d += ` L${f((100 * i) / (jag.length - 1))},${f(y + h * jag[i])}`
  return d + ' Z'
}

/** PaperLegalPad: the 2007-2012 yellow pad under a leather binding. */
function legalPad(
  k: Kit,
  o: { leather: string[]; seam: string; torn: string; paper: string[]; rule: string; margin: string; marginX: number[]; jagged: boolean },
): string {
  const lw = px(0.6, 0.009, GLOSSY)
  return (
    rect(50, 50, 100, 100, linear(k, o.paper)) +
    stroke(lines({ ys: [0.42, 0.525, 0.63, 0.735, 0.84, 0.945] }), o.rule, lw) +
    stroke(lines({ xs: o.marginX, y0: 0.3, y1: 1 }), o.margin, lw) +
    path(tornEdge(o.jagged, 27, 7.5), o.torn) +
    rect(50, 13.5, 100, 27, linear(k, o.leather)) +
    rect(50, 27.6, 100, 1.2, o.seam)
  )
}

/** PaperFlatPad: the iOS 7+ pad; a yellow band, perforations, rules. */
function flatPad(
  k: Kit,
  o: {
    band: string[]
    bandHeight: number
    lip?: string
    bandShadow: string
    dots: string
    dotsY: number
    dotPitch: number
    dotSize: number
    dotPhase?: number
    rules: number[]
    rule: string
    ruleInset?: number
    ruleWidth?: number
    edge: number
  },
): string {
  const inset = o.ruleInset ?? 0
  let out = stroke(lines({ ys: o.rules, x0: inset, x1: 1 - inset }), o.rule, px(0.6, o.ruleWidth ?? 0.008, o.edge), 'stroke-linecap="round"')
  const x0 = 100 * (o.dotPhase ?? o.dotPitch / 2)
  const pitch = 100 * o.dotPitch
  const n = Math.ceil((100 - x0) / pitch)
  out += dotted(`M${f(x0)},${f(o.dotsY * 100)} H${f(x0 + (n - 1) * pitch + pitch / 2)}`, o.dots, o.dotSize * 100, pitch)
  const bh = o.bandHeight * 100
  out += rect(50, bh / 2, 100, bh, linear(k, o.band))
  let y = bh
  if (o.lip) {
    out += rect(50, y + 0.4, 100, 0.8, o.lip)
    y += 0.8
  }
  return out + rect(50, y + 1.5, 100, 3, linear(k, [o.bandShadow, CLEAR]))
}

// ---------------------------------------------------------------- reminders

type MarkerStyle = 'bullseye' | 'glassPin' | 'softRing'

/** PaperReminderMarker at (cx, cy); sizes in the 100 box. */
function marker(k: Kit, colour: string, cx: number, cy: number, outer: number, ringW: number, disc: number, style: MarkerStyle): string {
  switch (style) {
    case 'bullseye':
      return ring(cx, cy, outer, ringW, colour) + circle(cx, cy, disc, colour)
    case 'glassPin':
      return (
        circle(cx, cy, outer, fade(colour, 0.3)) +
        circle(cx, cy, disc, colour, `filter="${shadow(k, fade(colour, 0.5), disc * 0.12, 0, disc * 0.1)}"`) +
        circle(cx - disc * 0.2, cy - disc * 0.22, disc * 0.24, white(0.75))
      )
    case 'softRing':
      return circle(cx, cy, outer, fade(colour, 0.32)) + ring(cx, cy, outer, ringW, colour, `filter="${shadow(k, black(0.22), outer * 0.08, 0, outer * 0.08)}"`)
  }
}

/** PaperReminderRows: markers down the left with a bar beside each, or
 *  rules between them. */
function reminderRows(
  k: Kit,
  o: {
    colours: string[]
    rows: number[]
    markerX: number
    outer: number
    ring: number
    disc: number
    style?: MarkerStyle
    bar?: { x0: number; x1: number; height: number; ink: string }
    rules?: number[]
    ruleX0?: number
    ruleX1?: number
    ruleInk?: string
    ruleWidth?: number
    edge: number
  },
): string {
  let out = ''
  if (o.rules && o.rules.length) {
    out += stroke(lines({ ys: o.rules, x0: o.ruleX0 ?? 0.3, x1: o.ruleX1 ?? 1 }), o.ruleInk ?? CLEAR, px(0.6, o.ruleWidth ?? 0.008, o.edge))
  }
  o.colours.forEach((colour, i) => {
    const y = o.rows[i] * 100
    out += marker(k, colour, o.markerX * 100, y, o.outer * 100, o.ring * 100, o.disc * 100, o.style ?? 'bullseye')
    if (o.bar) {
      const b = o.bar
      out += capsule(((b.x0 + b.x1) / 2) * 100, y, (b.x1 - b.x0) * 100, b.height * 100, b.ink)
    }
  })
  return out
}

/** PaperReminderCard: iOS 5-6, a stitched leather frame round a ticked list. */
const reminderCard: Art = (k) => {
  let out =
    rrectBorder(50, 50, 93, 93, 13, px(0.6, 0.006, GLOSSY), hex(0x8a8a8a, 0.6), `stroke-dasharray="2 1.4"`) +
    crect(50, 50, 85, 85, 3, hex(0xf4f3f3), `filter="${shadow(k, black(0.6), 1.2, 0, 0.6)}"`) +
    stroke(lines({ ys: [0.38, 0.62], x0: 0.075, x1: 0.925 }), hex(0xc8c8c8), px(0.6, 0.01, GLOSSY)) +
    stroke(lines({ xs: [0.395, 0.425], y0: 0.075, y1: 0.925 }), hex(0xe57373), px(0.5, 0.008, GLOSSY))
  for (const [y, end] of [
    [0.23, 0.82],
    [0.5, 0.72],
    [0.77, 0.82],
  ]) {
    // Apple's ticks here are a pen stroke, not a slab: SF's .semibold
    // checkmark is about 1.2 pt thick, Phosphor's bold one about 1 pt, so a
    // thin stroke of its own colour (10 of its 256 units) makes up the rest.
    const ink = hex(0x1a1a1a)
    out += `<g stroke="${ink}" stroke-width="10" stroke-linejoin="round">${symbol('checkmark', ink, 13, 24.5, y * 100)}</g>`
    out += crect(((0.5 + end) / 2) * 100, y * 100, (end - 0.5) * 100, 5, 0.8, hex(0xb1b1b1))
  }
  return out
}

// ---------------------------------------------------------------- settings

type Hub = 'dark' | 'silver' | 'brushed'

interface GearPlateStyle {
  dots: string
  dotPitch: number
  dotSize: number
  stagger: boolean
  silver: string[]
  rim: string
  profile: Profile
  teeth: number
  depth: number
  x: number
  y: number
  radius: number
  window: number
  spokes: number[]
  spokeWidth: number
  hub: Hub
  hubRadius: number
  smalls: Array<[number, number]>
  smallRadius: number
  smallFace: string[]
  frame: string[]
  frameWidth: number
}

const plateOS1: GearPlateStyle = {
  dots: hex(0x1e1e20, 0.8), dotPitch: 0.042, dotSize: 0.022, stagger: false,
  silver: [hex(0xf7f8f9), hex(0xc6c7c9), hex(0x8c8d90)], rim: hex(0x2a2a2c),
  profile: 'cog', teeth: 22, depth: 0.18, x: 0.49, y: 0.64, radius: 0.45, window: 0.66,
  spokes: [-74, 0, -138], spokeWidth: 0.032, hub: 'dark', hubRadius: 0.175,
  smalls: [[0.13, 0.975], [0.84, 0.975]], smallRadius: 0.28, smallFace: [hex(0xb8b9bb), hex(0x88898b)],
  frame: [hex(0xf2f4f8), hex(0xb6b9be), hex(0x8a8b8e)], frameWidth: 0.05,
}

const plateIOS4: GearPlateStyle = {
  dots: hex(0x2e2e30, 0.9), dotPitch: 0.036, dotSize: 0.02, stagger: false,
  silver: [hex(0xfafafa), hex(0xcdcdcf), hex(0x929294)], rim: hex(0x3a3a3c),
  profile: 'cog', teeth: 20, depth: 0.21, x: 0.49, y: 0.65, radius: 0.46, window: 0.65,
  spokes: [-74, 2, -144], spokeWidth: 0.03, hub: 'silver', hubRadius: 0.17,
  smalls: [[0.1, 0.975], [0.87, 0.975]], smallRadius: 0.28, smallFace: [hex(0xc4c4c6), hex(0x8e8e90)],
  frame: [hex(0xf6f6f6), hex(0xc8c8ca), hex(0x9a9a9c)], frameWidth: 0.038,
}

const plateIOS6: GearPlateStyle = {
  dots: hex(0x0e0e0e), dotPitch: 0.05, dotSize: 0.028, stagger: true,
  silver: [hex(0xf4f4f4), hex(0xc0c0c1), hex(0x7e7e80)], rim: hex(0x262627),
  profile: 'rounded', teeth: 22, depth: 0.17, x: 0.49, y: 0.555, radius: 0.42, window: 0.71,
  spokes: [-64, 6, 152, -150], spokeWidth: 0.034, hub: 'brushed', hubRadius: 0.15,
  smalls: [[0.1, 0.975], [0.88, 0.975]], smallRadius: 0.27, smallFace: [hex(0xbdbdbe), hex(0x8a8a8b)],
  frame: [hex(0xe6e6e7), hex(0xc4c4c5), hex(0x8e8e8f)], frameWidth: 0.045,
}

/** PaperGearHub of diameter d at (cx, cy). */
function gearHub(k: Kit, hub: Hub, cx: number, cy: number, d: number, rim: string): string {
  const lw = px(0.5, (d / 100) * 0.03, GLOSSY)
  switch (hub) {
    case 'dark':
      return (
        circle(cx, cy, d, linear(k, [hex(0x9c9c9e), hex(0x5a5a5c), hex(0x3a3a3c)])) +
        ring(cx, cy, d, lw, rim) +
        ellipse(cx, cy, d * 0.32, d * 0.2, hex(0xd8d8da)) +
        ellipse(cx, cy, d * 0.14, d * 0.08, hex(0x5a5a5c))
      )
    case 'silver':
      return (
        circle(cx, cy, d, linear(k, [hex(0xededee), hex(0x9c9c9e), hex(0x6e6e70)])) +
        ring(cx, cy, d, lw, rim) +
        ring(cx, cy, d * 0.56, lw, black(0.25)) +
        circle(cx, cy, d * 0.22, linear(k, [hex(0xf4f4f4), hex(0x8a8a8c)])) +
        circle(cx, cy, d * 0.08, hex(0x3a3a3c))
      )
    case 'brushed':
      return (
        circle(cx, cy, d, angular(k, [hex(0xf2f2f2), hex(0x9e9e9e), hex(0xe8e8e8), hex(0x8c8c8c), hex(0xf2f2f2)], cx, cy, 0, 360, 72)) +
        ring(cx, cy, d, lw, rim) +
        circle(cx, cy, d * 0.26, hex(0xdadada)) +
        circle(cx, cy, d * 0.1, hex(0x4a4a4c))
      )
  }
}

/** PaperSpokes: square-ended bars from (cx, cy) at `angles` (degrees
 *  clockwise from 3 o'clock), `length` long, `width` wide. */
function spokesPath(cx: number, cy: number, angles: number[], length: number, width: number): string {
  const half = width / 2
  let d = ''
  for (const deg of angles) {
    const a = (deg * Math.PI) / 180
    const ux = Math.cos(a)
    const uy = Math.sin(a)
    const nx = -uy * half
    const ny = ux * half
    d +=
      `M${f(cx + nx)},${f(cy + ny)} L${f(cx + ux * length + nx)},${f(cy + uy * length + ny)} ` +
      `L${f(cx + ux * length - nx)},${f(cy + uy * length - ny)} L${f(cx - nx)},${f(cy - ny)} Z `
  }
  return d
}

/** PaperGearPlate: 2007-2012 Settings; a silver wheel whose windows show a
 *  perforated plate, two small gears at the foot, a chrome bevel. */
function gearPlate(st: GearPlateStyle): Art {
  return (k) => {
    // PaperDotLines: rows of holes, inset 5%, staggered into a diamond grid.
    const pitch = st.dotPitch * 100
    const step = st.stagger ? pitch * 0.5 : pitch
    let rows = ''
    for (let y = 5, row = 0; y < 97.5; y += step, row++) {
      const shift = st.stagger && row % 2 === 1 ? pitch * 0.5 : 0
      rows += `M${f(5 + shift)},${f(y)} H97.5 `
    }
    let out = dotted(rows, st.dots, st.dotSize * 100, pitch)

    const cx = st.x * 100
    const cy = st.y * 100
    const outer = st.radius * 100
    const metal = vFill(k, st.silver, cy - outer, cy + outer)
    const rimW = px(0.5, 0.007, GLOSSY)
    const wheel = gearPath(cx, cy, outer, st.teeth, st.depth, st.profile, st.window)
    out += path(wheel, metal, EVENODD) + stroke(wheel, st.rim, rimW)
    out += path(spokesPath(cx, cy, st.spokes, outer * (st.window + 0.06), st.spokeWidth * 100), metal)
    out += gearHub(k, st.hub, cx, cy, st.hubRadius * 200, st.rim)

    const sr = st.smallRadius * 100
    const smallMetal = vFill(k, st.silver, st.smalls[0][1] * 100 - sr, st.smalls[0][1] * 100 + sr)
    const face = linear(k, st.smallFace)
    for (const [x, y] of st.smalls) {
      const g = gearPath(x * 100, y * 100, sr, 12, 0.34, st.profile)
      out += path(g, smallMetal) + stroke(g, st.rim, rimW) + circle(x * 100, y * 100, sr, face)
    }
    const fw = st.frameWidth * 100
    return out + rrectBorder(50, 50, 100, 100, 17.5, fw, vFill(k, st.frame, 0, 100))
  }
}

/** PaperNestedGear: iOS 7-18 Settings. */
function nestedGear(dark: string, inner: string, top: string, bottom: string, scale: number): Art {
  return (k) => {
    const s = 100 * scale
    let out = circle(50, 50, s * 0.87, dark)
    // The outer ring is the tile's own gradient: it reads as cut through.
    out += path(gearPath(50, 50, 40 * scale, 56, 0.1, 'square', 0.76), vFill(k, [top, bottom], 0, 100), EVENODD)
    out += path(gearPath(50, 50, s * 0.26, 48, 0.1, 'square', 0.73), inner, EVENODD)
    const spoke = capsule(50 + s * 0.165, 50, s * 0.33, s * 0.037, inner) + capsule(50 + s * 0.265, 50, s * 0.11, s * 0.056, inner)
    for (let i = 0; i < 3; i++) out += `<g ${turn(i * 120)}>${spoke}</g>`
    return out + circle(50, 50, s * 0.065, inner) + circle(50, 50, s * 0.024, dark)
  }
}

/** PaperGlassGears: iOS 26-27 Settings; a white glass gear over a grey one. */
function glassGears(o: {
  frontAlpha: number
  back: string
  backRadius: number
  backHole: number
  backTeeth: number
  outer: number
  teeth: number
  depth: number
  ringHole: number
  spokeWidth: number
  hubRadius: number
  pupil: number
  hole: string
}): Art {
  return (k) => {
    // The second gear sits up and to the right, so its teeth show through the
    // big gear's hole in that quadrant, the way Apple's does.
    let out = path(gearPath(56, 43, o.backRadius * 100, o.backTeeth, 0.16, 'rounded', o.backHole), o.back, EVENODD)
    // One gradient over each piece's own frame (topLeading -> bottomTrailing).
    const glass = linear(k, [WHITE, hex(0xf1f1f4), hex(0xdcdce0)], [0, 0], [1, 1])
    // Apple's wheel: tooth tips at r 39.9, roots at 34.15, the ring's inner
    // edge at 29.5 and a hub 6.8 across the bright part with a 2.7 dark
    // pupil. Ours ran the whole band a unit and a half further out (41.5 to
    // 36.7) on a hub only 5 across.
    let front = path(gearPath(50, 50, o.outer, o.teeth, o.depth, 'rounded', o.ringHole), glass, EVENODD)
    for (let i = 0; i < 3; i++) front += capsule(67, 50, 34, o.spokeWidth * 100, glass, turn(i * 120))
    front += circle(50, 50, o.hubRadius * 200, glass) + circle(50, 50, o.pupil, o.hole)
    // compositingGroup().opacity().shadow(): the shadow is of the faded
    // group, so it shows through the glass.
    out += `<g filter="${shadow(k, black(0.28), 2, 0, 2)}"><g opacity="${o.frontAlpha}">${front}</g></g>`
    return out
  }
}

// ---------------------------------------------------------------- calculator

type Sign = 'plus' | 'minus' | 'times' | 'equals'

/** PaperSignShape: an arithmetic sign of round-ended bars in a `size`
 *  square at (cx, cy), bars `t` thick. */
function sign(kind: Sign, cx: number, cy: number, size: number, t: number, fill: string, extra = ''): string {
  const bar = (w: number, h: number, dy = 0) => capsulePath(cx, cy + dy, w, h)
  switch (kind) {
    case 'plus':
      return path(`${bar(size, t)} ${bar(t, size)}`, fill, extra)
    case 'minus':
      return path(bar(size, t), fill, extra)
    case 'times':
      return `<g ${extra}>${path(bar(size * 0.9, t), fill, turn(45, cx, cy))}${path(bar(size * 0.9, t), fill, turn(-45, cx, cy))}</g>`
    case 'equals': {
      const step = (size * 0.3 + t) / 2
      return path(`${bar(size, t, -step)} ${bar(size, t, step)}`, fill, extra)
    }
  }
}

const signs: Sign[] = ['plus', 'minus', 'times', 'equals']

/** PaperCalcKeys: 2007-2009, four glossy keys in a silver bevel. */
function calcKeys(round: boolean, key: string[], accent: string[], frame: string[]): Art {
  return (k) => {
    const keyFill = linear(k, key)
    const accentFill = linear(k, accent)
    const lw = px(0.5, 0.006, GLOSSY)
    let out = ''
    const spots: Array<[number, number]> = [
      [30, 30],
      [70, 30],
      [30, 70],
      [70, 70],
    ]
    spots.forEach(([cx, cy], i) => {
      const fill = i === 3 ? accentFill : keyFill
      if (round) out += circle(cx, cy, 34, fill) + ring(cx, cy, 34, lw, black(0.35))
      else out += crect(cx, cy, 34, 34, 8.5, fill) + rrectBorder(cx, cy, 34, 34, 8.5, lw, black(0.35))
      out += ellipse(cx, cy - 8.5, 26, 13, white(0.22))
      out += sign(signs[i], cx, cy + 0.8, 16, 3.5, black(0.45))
      out += sign(signs[i], cx, cy, 16, 3.5, WHITE)
    })
    return out + rrectBorder(50, 50, 100, 100, 17.5, 3.2, vFill(k, frame, 0, 100))
  }
}

/** PaperQuadrants: 2010-2016, four full-bleed quadrants and a cross of
 *  seams; a clear quadrant shows the tile's own gradient. */
function quadrants(o: { fills: string[][]; seam: string; inks: string[]; signSize: number; stroke: number; embossed: boolean; edge: number }): Art {
  return (k) => {
    let out = ''
    o.fills.forEach((colours, i) => {
      if (colours.length === 1 && colours[0] === CLEAR) return
      out += rect(i % 2 ? 75 : 25, i < 2 ? 25 : 75, 50, 50, paint(k, colours))
    })
    out += stroke(lines({ ys: [0.5], xs: [0.5] }), o.seam, px(0.8, 0.014, o.edge))
    const emboss = o.embossed ? `filter="${shadow(k, black(0.55), 0.6, 0, 0.8)}"` : ''
    signs.forEach((kind, i) => {
      out += sign(kind, i % 2 ? 75 : 25, i < 2 ? 26 : 75, o.signSize * 100, o.stroke * 100, o.inks[i], emboss)
    })
    return out
  }
}

interface CalcLayout {
  bodyWidth: number
  bodyHeight: number
  bodyRadius: number
  displayWidth: number
  displayHeight: number
  displayY: number
  columns: number[]
  rows: number[]
  key: number
}

const layoutFlat: CalcLayout = { bodyWidth: 0.52, bodyHeight: 0.76, bodyRadius: 0.08, displayWidth: 0.42, displayHeight: 0.17, displayY: 0.255, columns: [0.34, 0.5, 0.66], rows: [0.46, 0.61, 0.76], key: 0.11 }
const layoutGlass: CalcLayout = { bodyWidth: 0.5, bodyHeight: 0.75, bodyRadius: 0.075, displayWidth: 0.4, displayHeight: 0.175, displayY: 0.26, columns: [0.35, 0.5, 0.65], rows: [0.485, 0.615, 0.745], key: 0.1 }
const layoutGlass27: CalcLayout = { bodyWidth: 0.5, bodyHeight: 0.75, bodyRadius: 0.075, displayWidth: 0.4, displayHeight: 0.175, displayY: 0.26, columns: [0.35, 0.5, 0.65], rows: [0.485, 0.615, 0.745], key: 0.1 }

/** PaperFlatCalculator: iOS 11-27, a whole calculator drawn flat, glassy
 *  (a shadow and a rim) from iOS 26. */
function flatCalculator(o: { shell: string[]; display: string[]; key: string[]; accent: string; layout: CalcLayout; mergedBottom: boolean; rim?: string }): Art {
  return (k) => {
    const l = o.layout
    const bw = l.bodyWidth * 100
    const bh = l.bodyHeight * 100
    const br = l.bodyRadius * 100
    let out = crect(50, 50, bw, bh, br, paint(k, o.shell), o.rim ? `filter="${shadow(k, black(0.3), 2, 0, 2)}"` : '')
    if (o.rim) out += rrectBorder(50, 50, bw, bh, br, px(0.6, 0.012, FLAT), linear(k, [o.rim, fade(o.rim, 0.35)]))
    out += crect(50, l.displayY * 100, l.displayWidth * 100, l.displayHeight * 100, 2.5, paint(k, o.display))
    const keyFill = paint(k, o.key)
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        const merged = o.mergedBottom && row === 2 && column < 2
        if (merged && column === 1) continue
        const w = merged ? l.columns[1] - l.columns[0] + l.key : l.key
        const x = merged ? (l.columns[0] + l.columns[1]) / 2 : l.columns[column]
        out += capsule(x * 100, l.rows[row] * 100, w * 100, l.key * 100, column === 2 ? o.accent : keyFill)
      }
    }
    return out
  }
}

// ---------------------------------------------------------------- stocks

type Points = Array<[number, number]>

const skyOS1: Points = [[0, 0.56], [0.07, 0.55], [0.12, 0.47], [0.2, 0.42], [0.27, 0.48], [0.33, 0.45], [0.4, 0.52], [0.47, 0.53], [0.53, 0.45], [0.6, 0.33], [0.65, 0.39], [0.7, 0.45], [0.76, 0.41], [0.82, 0.52], [0.88, 0.48], [0.95, 0.4], [1.0, 0.38]]
const skyOS3: Points = [[0, 0.62], [0.08, 0.6], [0.13, 0.55], [0.2, 0.5], [0.26, 0.57], [0.3, 0.55], [0.37, 0.4], [0.44, 0.62], [0.5, 0.66], [0.58, 0.52], [0.63, 0.47], [0.7, 0.27], [0.76, 0.44], [0.8, 0.38], [0.86, 0.5], [0.91, 0.52], [1.0, 0.42]]

/** PaperStocksSky: 2007-2012, a white line over graph-paper blue. */
function stocksSky(o: { sky: string[]; line: Points; verticals: number[]; months: boolean; lineWidth: number }): Art {
  return (k) => {
    let out = rect(50, 50, 100, 100, linear(k, o.sky))
    out += stroke(lines({ ys: [0.47, 0.51, 0.55, 0.59, 0.63, 0.67, 0.71, 0.75, 0.79, 0.83, 0.87, 0.91, 0.95, 0.99] }), white(0.3), px(0.5, 0.007, GLOSSY))
    out += stroke(lines({ xs: o.verticals }), white(0.4), px(0.5, 0.009, GLOSSY))
    if (o.months) {
      out += rect(50, 91, 100, 18, hex(0x8ee7ff, 0.85))
      for (const [m, x] of [
        ['Jul', 10],
        ['Aug', 50],
        ['Sep', 90],
      ] as const) {
        out += say(m, x, 91, system(0.11, weight.bold), WHITE)
      }
    }
    const d = polyline(o.line)
    const cap = `stroke-linecap="round" stroke-linejoin="round"`
    return out + stroke(d, black(0.35), o.lineWidth * 100, `${cap} transform="translate(0 1)"`) + stroke(d, WHITE, o.lineWidth * 100, cap)
  }
}

const chartIOS7: Points = [[0, 0.57], [0.1, 0.61], [0.18, 0.59], [0.25, 0.52], [0.3, 0.55], [0.37, 0.41], [0.44, 0.58], [0.5, 0.61], [0.57, 0.5], [0.62, 0.49], [0.69, 0.33], [0.75, 0.45], [0.8, 0.42], [0.87, 0.53], [0.93, 0.4], [1.0, 0.33]]
const chartIOS11: Points = [[0, 0.545], [0.08, 0.568], [0.16, 0.607], [0.2, 0.592], [0.24, 0.564], [0.28, 0.525], [0.32, 0.564], [0.34, 0.555], [0.38, 0.447], [0.4, 0.461], [0.44, 0.578], [0.5, 0.625], [0.54, 0.555], [0.6, 0.512], [0.62, 0.473], [0.656, 0.345], [0.7, 0.408], [0.72, 0.467], [0.78, 0.453], [0.82, 0.549], [0.84, 0.559], [0.88, 0.449], [0.94, 0.385], [1.0, 0.344]]
const chartIOS18: Points = [[0, 0.559], [0.07, 0.59], [0.12, 0.564], [0.18, 0.504], [0.2, 0.502], [0.24, 0.539], [0.26, 0.518], [0.3, 0.445], [0.34, 0.566], [0.39, 0.632], [0.44, 0.57], [0.48, 0.527], [0.52, 0.514], [0.56, 0.434], [0.594, 0.36], [0.62, 0.395], [0.66, 0.459], [0.74, 0.426], [0.76, 0.451], [0.8, 0.545], [0.84, 0.449], [0.88, 0.387], [0.94, 0.34], [1.0, 0.314]]
const chartIOS26: Points = [[0, 0.654], [0.1, 0.648], [0.15, 0.594], [0.2, 0.576], [0.25, 0.59], [0.3, 0.52], [0.35, 0.57], [0.4, 0.656], [0.5, 0.514], [0.55, 0.46], [0.604, 0.35], [0.65, 0.42], [0.7, 0.477], [0.75, 0.436], [0.8, 0.518], [0.85, 0.527], [0.9, 0.406], [1.0, 0.346]]

/** PaperStocksChart: iOS 7-27, a line on dark, the area under it a shade
 *  lighter, a cursor bar and a marker on the peak. */
function stocksChart(o: {
  grid: number[]
  gridInk: string
  gridWidth: number
  points: Points
  fill: number
  lineWidth: number
  lineInk: string
  barX: number
  barWidth: number
  barInk: string
  peakY: number
  marker: number
  markerInk: string
  ring?: boolean
  glass?: boolean
  edge: number
}): Art {
  return (k) => {
    const bx = o.barX * 100
    const py = o.peakY * 100
    const m = o.marker * 100
    let out = path(polyline(o.points, true), frameFill(k, [white(o.fill), white(o.fill * 0.3)], 50, 40, 50, 100))
    out += stroke(lines({ xs: o.grid }), o.gridInk, px(0.5, o.gridWidth, o.edge))
    out += rect(bx, 50, px(0.8, o.barWidth, o.edge), 100, o.barInk)
    const lineShadow = o.glass ? `filter="${shadow(k, black(0.5), 1.2, 0, 1.4)}"` : ''
    out += stroke(polyline(o.points), o.lineInk, o.lineWidth * 100, `stroke-linecap="round" stroke-linejoin="round" ${lineShadow}`)
    if (o.ring) {
      // iOS 26's cursor head: a glass torus. Measured off the 1024 pt
      // artwork: outer 0.239 of the tile, the bright core 0.565 of that,
      // the body a dark teal (#007987) with a darker edge where it meets
      // the core, and the cursor itself running bright across the ring.
      out += circle(bx, py, m, hex(0x007987), `filter="${shadow(k, black(0.5), 1.4, 0, 1.4)}"`)
      out += ring(bx, py, m, m * 0.05, white(0.2))
      out += rect(bx, py, px(0.8, o.barWidth, o.edge), m, fade(o.barInk, 0.9))
      out += ring(bx, py, m * 0.63, m * 0.055, hex(0x003f50))
      out += circle(bx, py, m * 0.565, radial(k, [hex(0x00e2ff), hex(0x00d0ee)], [0.42, 0.36], 0.9))
    } else {
      if (o.glass) out += circle(bx, py, m * 1.6, fade(o.markerInk, 0.32))
      out += circle(bx, py, m, o.markerInk, o.glass ? `filter="${shadow(k, black(0.4), 1, 0, 1)}"` : '')
      if (o.glass) out += circle(bx - m * 0.2, py - m * 0.22, m * 0.28, white(0.8))
    }
    return out
  }
}

// ---------------------------------------------------------------- compass

/** PaperBrassCompass: 2009-2012, a brass-hubbed rose on a cream dial in a
 *  silver bezel, over dark wood. */
function brassCompass(retina: boolean): Art {
  return (k) => {
    const dial = retina ? 0.84 : 0.92
    const D = dial * 100
    const ink = hex(0x6a5a4a, 0.8)
    const hair = px(0.5, 0.006, GLOSSY)
    let out = stroke(lines({ xs: [0.06, 0.13, 0.25, 0.34, 0.5, 0.61, 0.75, 0.86, 0.94] }), black(0.22), px(0.5, 0.014, GLOSSY))
    out += circle(50, 50, D, linear(k, [hex(0xf6f6f6), hex(0x8a8a8a)]), `filter="${shadow(k, black(0.5), 1.5, 0, 1.5)}"`)
    out += circle(50, 50, D - 6, radial(k, [hex(0xfffbf4), hex(0xf1dcc6)], [0.5, 0.5], 40 / (D - 6)))
    out += ring(50, 50, D - 11, hair, ink)
    out += stroke(ticks(72, (dial - 0.2) / 2, (dial - 0.12) / 2), hex(0x3c3c3c), px(0.4, 0.007, GLOSSY))
    out += ring(50, 50, D - 20, hair, ink)
    const split = linear(k, [WHITE, hex(0x2b2b2b)], [0, 0.5], [1, 0.5])
    const small = needleShapePath(50, 50, 6, 40)
    const big = needleShapePath(50, 50, 7.5, 56)
    out += path(small, split, turn(45)) + path(small, split, turn(135)) + path(big, split) + path(big, split, turn(90))
    out += circle(50, 50, 13, radial(k, [hex(0xf4dca0), hex(0x7a5322)], [0.4, 0.35], 7 / 13))
    out += circle(50, 50, 3.5, hex(0x2a1a0a))
    const letter = hex(0x2a1e14)
    out += serif('E', 77, 50, 8.5, letter, 90) + serif('W', 23, 50, 8.5, letter, -90) + serif('S', 50, 76.5, 8.5, letter)
    out += path(trianglePath(50, retina ? 24 : 20, 15, 12), retina ? hex(0xc81417) : hex(0xb8141a))
    return out + serif('N', 50, retina ? 26 : 22, 6.5, WHITE)
  }
}

interface DialLayout {
  tickIn: number
  tickOut: number
  majorWidth: number
  minorWidth: number
  letterX: number
  letterY: number
  crossReach: number
  crossWidth: number
}

const dialIOS7: DialLayout = { tickIn: 0.38, tickOut: 0.43, majorWidth: 0.014, minorWidth: 0.008, letterX: 0.19, letterY: 0.19, crossReach: 0.18, crossWidth: 0.008 }
const dialIOS11: DialLayout = { tickIn: 0.365, tickOut: 0.44, majorWidth: 0.015, minorWidth: 0.01, letterX: 0.19, letterY: 0.19, crossReach: 0.18, crossWidth: 0.011 }
const dialIOS26: DialLayout = { tickIn: 0.34, tickOut: 0.4, majorWidth: 0.016, minorWidth: 0.011, letterX: 0.118, letterY: 0.142, crossReach: 0.25, crossWidth: 0.011 }
const dialIOS27: DialLayout = { tickIn: 0.3, tickOut: 0.36, majorWidth: 0.015, minorWidth: 0.01, letterX: 0.115, letterY: 0.138, crossReach: 0.24, crossWidth: 0.01 }

/** PaperDialCompass: iOS 7-27; 48 ticks (white majors every 30 degrees),
 *  W N S E on the diagonals round a crosshair, the red heading marker. */
function dialCompass(o: {
  dial: DialLayout
  majorInk: string
  minorInk: string
  letters: string
  letterFont: Face
  disc?: string
  cross: string
  marker: string
  glass?: boolean
  bezel?: boolean
  edge: number
}): Art {
  return (k) => {
    const d = o.dial
    let out = ''
    if (o.bezel) {
      out += circle(50, 50, 84, linear(k, [hex(0x262626), hex(0x151515)]), `filter="${shadow(k, black(0.5), 2, 0, 1.5)}"`)
      out += ring(50, 50, 84, px(0.6, 0.009, o.edge), linear(k, [white(0.75), white(0.18), white(0.5)]))
    }
    if (o.disc) out += circle(50, 50, 36, o.disc)
    out += stroke(ticks(48, d.tickIn, d.tickOut, 4, 2, false), o.minorInk, px(0.5, d.minorWidth, o.edge), 'stroke-linecap="round"')
    out += stroke(ticks(48, d.tickIn, d.tickOut, 4, 2, true), o.majorInk, px(0.6, d.majorWidth, o.edge), 'stroke-linecap="round"')
    const cw = px(0.6, d.crossWidth, o.edge)
    out += rect(50, 50, cw, d.crossReach * 200, o.cross) + rect(50, 50, d.crossReach * 200, cw, o.cross)
    const letterShadow = o.glass ? `filter="${shadow(k, black(0.5), 1, 0, 1.2)}"` : ''
    const spots: Array<[string, number, number]> = [
      ['W', -d.letterX, -d.letterY],
      ['N', d.letterX, -d.letterY],
      ['S', -d.letterX, d.letterY],
      ['E', d.letterX, d.letterY],
    ]
    for (const [l, dx, dy] of spots) out += say(l, 50 + dx * 100, 50 + dy * 100, o.letterFont, o.letters, letterShadow)
    // Rotated inside, shadowed outside, so the shadow falls straight down.
    const tri = path(trianglePath(85, 14.8, 8.5, 8), o.marker, turn(225, 85, 14.8))
    out += o.glass ? `<g filter="${shadow(k, black(0.45), 1, 0, 1)}">${tri}</g>` : tri
    return out
  }
}

// ---------------------------------------------------------------- roster

export const paper: HomeAppDef[] = [
  // Calendar: Tuesday the 9th, the day the iPhone was announced.
  {
    id: 'Calendar',
    designs: [
      flat(2007, 0xffffff, nothing, calendar2007),
      design(2010, 0xf4f4f3, 0xe6e6e6, nothing, calendar2010),
      flat(2013, 0xffffff, calendarFlat('Tuesday', helveticaNeue(0.163), hex(0xff3b30), 0.19, helveticaNeue(0.66, weight.ultraLight), '#000', 0.59)),
      flat(2015, 0xffffff, calendarFlat('Tuesday', system(0.163, weight.regular), hex(0xff3b30), 0.19, system(0.66, SF_ULTRALIGHT), '#000', 0.595)),
      flat(2017, 0xffffff, calendarFlat('Tuesday', system(0.18, weight.semibold), hex(0xff3b30), 0.205, system(0.667, weight.light), '#000', 0.605)),
      flat(2020, 0xffffff, calendarFlat('TUE', system(0.2, weight.bold), hex(0xff3a2f), 0.19, system(0.624, weight.regular), hex(0x262626), 0.6)),
      design(2025, 0xfdfdfd, 0xefefef, calendarFlat('Tue', system(0.23, weight.semibold), hex(0xff393c), 0.13, system(0.624, weight.medium), hex(0x1e1e1e), 0.61, true)),
      design(2026, 0xfefefe, 0xf7f7f7, calendarFlat('Tue', system(0.23, weight.semibold), hex(0xeb4b46), 0.132, system(0.62, weight.medium), '#000', 0.612, true)),
    ],
  },

  // Notes
  {
    id: 'Notes',
    designs: [
      design(2007, 0xfbf7a6, 0xf3ec8e, nothing, (k) =>
        softGloss(
          k,
          0.3,
          legalPad(k, {
            leather: [hex(0x6c402f), hex(0x563529), hex(0x4b2e23), hex(0x41251a)],
            seam: hex(0x1e0f0a),
            torn: hex(0xa8985c),
            paper: [hex(0xfbf6a0), hex(0xf5ee8a)],
            rule: hex(0xdcd674),
            margin: hex(0xc0a86c),
            marginX: [0.14, 0.175],
            jagged: false,
          }),
        ),
      ),
      design(2010, 0xfcf8b8, 0xf5f2aa, nothing, (k) =>
        softGloss(
          k,
          0.3,
          legalPad(k, {
            leather: [hex(0x664332), hex(0x553625), hex(0x492d1f), hex(0x40291e)],
            seam: hex(0x1a120c),
            torn: hex(0x9e9c74),
            paper: [hex(0xfcf8b8), hex(0xf5f2aa)],
            rule: hex(0xb4b69a),
            margin: hex(0xc9af7a),
            marginX: [0.15, 0.19],
            jagged: true,
          }),
        ),
      ),
      flat(2013, 0xf8f8f8, (k) =>
        flatPad(k, {
          band: [hex(0xffda47), hex(0xffd018), hex(0xfecb01)],
          bandHeight: 0.3,
          bandShadow: hex(0xaeafb0, 0.55),
          dots: hex(0xa8a8a8),
          dotsY: 0.367,
          dotPitch: 0.033,
          dotSize: 0.014,
          rules: [0.5, 0.685, 0.878],
          rule: hex(0xaeaeae),
          edge: IOS7,
        }),
      ),
      flat(2017, 0xfefffe, (k) =>
        flatPad(k, {
          band: [hex(0xfede5c), hex(0xfed324), hex(0xffcc03)],
          bandHeight: 0.25,
          bandShadow: hex(0x9b9b9b, 0.45),
          dots: hex(0xc7c7cc),
          dotsY: 0.3,
          dotPitch: 0.033,
          dotSize: 0.013,
          rules: [0.5, 0.75],
          rule: hex(0xc7c7cc),
          edge: FLAT,
        }),
      ),
      design(2025, 0xfafafa, 0xececec, (k) =>
        flatPad(k, {
          band: [hex(0xffdc3d), hex(0xfed52d), hex(0xfeda32)],
          bandHeight: 0.25,
          lip: hex(0xffe040),
          bandShadow: hex(0xc1bca4, 0.6),
          dots: hex(0xc1bca4),
          dotsY: 0.285,
          dotPitch: 0.049,
          dotSize: 0.026,
          dotPhase: 0.042,
          rules: [0.5, 0.75],
          rule: hex(0xc1c1c1),
          ruleInset: 0.118,
          ruleWidth: 0.016,
          edge: FLAT,
        }),
      ),
      design(2026, 0xf6f6f6, 0xececec, (k) =>
        flatPad(k, {
          band: [hex(0xffe362), hex(0xf8d652), hex(0xf8d24b)],
          bandHeight: 0.25,
          lip: hex(0xfce070),
          bandShadow: hex(0xb9b9b9, 0.4),
          dots: hex(0xb9b9b9),
          dotsY: 0.285,
          dotPitch: 0.049,
          dotSize: 0.026,
          dotPhase: 0.042,
          rules: [0.5, 0.75],
          rule: hex(0xc1c1c1),
          ruleInset: 0.118,
          ruleWidth: 0.016,
          edge: FLAT,
        }),
      ),
    ],
  },

  // Reminders: arrived in iOS 5.
  {
    id: 'Reminders',
    designs: [
      design(2011, 0x333333, 0x151515, reminderCard),
      flat(2013, 0xf8f8f8, (k) =>
        reminderRows(k, {
          colours: [hex(0xff9500), hex(0x34aadc), hex(0x4cd964), hex(0xcc73e1)],
          rows: [0.21, 0.4, 0.59, 0.78],
          markerX: 0.16,
          outer: 0.135,
          ring: 0.02,
          disc: 0.075,
          rules: [0.117, 0.306, 0.494, 0.683, 0.867],
          ruleX0: 0.3,
          ruleX1: 1.0,
          ruleInk: hex(0xe2e2e2),
          ruleWidth: 0.008,
          edge: IOS7,
        }),
      ),
      flat(2017, 0xffffff, (k) =>
        reminderRows(k, {
          colours: [hex(0xff9500), hex(0x1fa1f7), hex(0x4cd964)],
          rows: [0.248, 0.498, 0.748],
          markerX: 0.164,
          outer: 0.162,
          ring: 0.02,
          disc: 0.093,
          rules: [0.12, 0.373, 0.623, 0.875],
          ruleX0: 0.333,
          ruleX1: 1.0,
          ruleInk: hex(0xd2d2d2),
          ruleWidth: 0.01,
          edge: FLAT,
        }),
      ),
      flat(2019, 0xffffff, (k) =>
        reminderRows(k, {
          colours: [hex(0x007aff), hex(0xff3b30), hex(0xff9500)],
          rows: [0.25, 0.5, 0.75],
          markerX: 0.207,
          outer: 0.17,
          ring: 0.025,
          disc: 0.105,
          bar: { x0: 0.383, x1: 0.861, height: 0.024, ink: hex(0xcbcbcf) },
          edge: FLAT,
        }),
      ),
      design(2025, 0xffffff, 0xececec, (k) =>
        reminderRows(k, {
          colours: [hex(0x2d7cf6), hex(0xff3b30), hex(0xff9f0a)],
          rows: [0.25, 0.5, 0.75],
          markerX: 0.193,
          outer: 0.172,
          ring: 0,
          disc: 0.108,
          style: 'glassPin',
          bar: { x0: 0.37, x1: 0.875, height: 0.021, ink: hex(0xc2c2c2) },
          edge: FLAT,
        }),
      ),
      design(2026, 0xfefefe, 0xebebeb, (k) =>
        reminderRows(k, {
          colours: [hex(0x2d7cf6), hex(0xe9463f), hex(0xf29a2e)],
          rows: [0.25, 0.5, 0.75],
          markerX: 0.198,
          outer: 0.178,
          ring: 0.046,
          disc: 0,
          style: 'softRing',
          bar: { x0: 0.375, x1: 0.875, height: 0.022, ink: hex(0xc1c1c1) },
          edge: FLAT,
        }),
      ),
    ],
  },

  // Settings
  {
    id: 'Settings',
    designs: [
      design(2007, 0x58595b, 0x333436, gearPlate(plateOS1)),
      design(2010, 0x7c7d80, 0x55565a, gearPlate(plateIOS4)),
      design(2012, 0x3a3a3b, 0x202021, gearPlate(plateIOS6)),
      design(2013, 0xdbdcde, 0x898c91, nestedGear(hex(0x545454), hex(0xb5b5b5), hex(0xdbdcde), hex(0x898c91), 1.0)),
      design(2017, 0xe4e5e9, 0x8e8e94, nestedGear(hex(0x2e2e2f), hex(0xb4b4b6), hex(0xe4e5e9), hex(0x8e8e94), 1.0)),
      design(2024, 0xe4e5e9, 0x8e8e94, nestedGear(hex(0x2e2e2f), hex(0xb4b4b6), hex(0xe4e5e9), hex(0x8e8e94), 0.95)),
      // 36 teeth (ours drew 40), and the band measured off the macOS 26 dump
      // and the iOS 26.5 and iOS 27 runtime icons alike: tips at r 39.9,
      // roots at 34.15 — 5.75 deep. Ours sat at 41.5 to 36.7, a unit and a
      // half too far out and three quarters of a unit too shallow.
      design(
        2025,
        0xa2a2a7,
        0x707075,
        glassGears({ frontAlpha: 0.94, back: hex(0xe2e2e6, 0.7), backRadius: 0.25, backHole: 0.76, backTeeth: 26, outer: 39.9, teeth: 36, depth: 0.144, ringHole: 0.739, spokeWidth: 0.055, hubRadius: 0.068, pupil: 5.4, hole: hex(0x77777c) }),
      ),
      // iOS 27 is speculative, so the glass reads sharper: a fainter front
      // plate, a deeper cut to the teeth and thicker spokes. The tooth COUNT
      // and the band's outer radius are not a style choice, though — both
      // Apple runtimes still draw 36 teeth tipped at 39.9, so the 34 teeth
      // on 41.5 this row was left with were simply the old error.
      design(
        2026,
        0x9c9c9f,
        0x78787d,
        glassGears({ frontAlpha: 0.8, back: hex(0xe6e6ea, 0.62), backRadius: 0.23, backHole: 0.7, backTeeth: 22, outer: 39.9, teeth: 36, depth: 0.17, ringHole: 0.71, spokeWidth: 0.07, hubRadius: 0.068, pupil: 5.4, hole: hex(0x78787d) }),
      ),
    ],
  },

  // Calculator
  {
    id: 'Calculator',
    designs: [
      design(2007, 0x202020, 0x121212, calcKeys(true, [hex(0x8a7a70), hex(0x5e4f47)], [hex(0xf9a24a), hex(0xe8741c)], [hex(0xe4e7ec), hex(0xa9adb3)])),
      design(2008, 0x202020, 0x121212, calcKeys(false, [hex(0x8a7a70), hex(0x5e4f47)], [hex(0xf9a24a), hex(0xe8741c)], [hex(0xe4e7ec), hex(0xa9adb3)])),
      design(
        2010,
        0xc0b3ac,
        0x3e332c,
        quadrants({ fills: [[CLEAR], [CLEAR], [CLEAR], [hex(0xec8428), hex(0xa94a10)]], seam: hex(0x2e2521, 0.9), inks: [WHITE, WHITE, WHITE, WHITE], signSize: 0.25, stroke: 0.07, embossed: true, edge: GLOSSY }),
      ),
      flat(
        2013,
        0xff9500,
        quadrants({ fills: [[CLEAR], [CLEAR], [CLEAR], [hex(0xd4d4d2)]], seam: hex(0x100707), inks: [WHITE, WHITE, WHITE, hex(0x333333)], signSize: 0.22, stroke: 0.03, embossed: false, edge: IOS7 }),
      ),
      flat(2017, 0xd4d4d2, flatCalculator({ shell: [hex(0x1c1c1c)], display: [hex(0x505050)], key: [hex(0xe0e0e0)], accent: hex(0xff9f0a), layout: layoutFlat, mergedBottom: true })),
      flat(2024, 0xd4d4d2, flatCalculator({ shell: [hex(0x1c1c1c)], display: [hex(0x505050)], key: [hex(0xe0e0e0)], accent: hex(0xff9f0a), layout: layoutFlat, mergedBottom: false })),
      design(
        2025,
        0xe0e0de,
        0xbdbdbb,
        flatCalculator({
          shell: [hex(0x4a4849), hex(0x363435)],
          display: [hex(0x9a9a9a), hex(0x6e6e6e)],
          key: [hex(0xf2f2f0), hex(0xcfcfcd)],
          accent: hex(0xff9f0a),
          layout: layoutGlass,
          mergedBottom: false,
          rim: hex(0x8a8a8a),
        }),
      ),
      design(
        2026,
        0xd4d4d4,
        0xbcbcbc,
        flatCalculator({
          shell: [hex(0x242223), hex(0x0a0a0a)],
          display: [hex(0x7a7b7b), hex(0x5e5f5f)],
          key: [hex(0xededed), hex(0xcacaca)],
          accent: hex(0xf7922a),
          layout: layoutGlass27,
          mergedBottom: false,
          rim: hex(0x4a4a4a),
        }),
      ),
    ],
  },

  // Stocks
  {
    id: 'Stocks',
    designs: [
      design(2007, 0xb9d7fc, 0x48d8ff, stocksSky({ sky: [hex(0xb9d7fc), hex(0x0174f0), hex(0x1a9cf8), hex(0x48d8ff)], line: skyOS1, verticals: [0.3, 0.71], months: true, lineWidth: 0.034 })),
      design(2009, 0xb9d7fc, 0x48d8ff, stocksSky({ sky: [hex(0xb9d7fc), hex(0x0174f0), hex(0x1a9cf8), hex(0x48d8ff)], line: skyOS3, verticals: [0.36, 0.78], months: false, lineWidth: 0.034 })),
      design(2010, 0xc1d7f8, 0x78e7fd, stocksSky({ sky: [hex(0xc1d7f8), hex(0x0460e2), hex(0x2aa9f5), hex(0x78e7fd)], line: skyOS3, verticals: [0.36, 0.78], months: false, lineWidth: 0.04 })),
      flat(
        2013,
        0x000000,
        stocksChart({
          grid: [0.1, 0.3, 0.5, 0.87], gridInk: hex(0x2a2a2a), gridWidth: 0.008,
          points: chartIOS7, fill: 0.1, lineWidth: 0.025, lineInk: WHITE,
          barX: 0.69, barWidth: 0.015, barInk: hex(0x1e9bf5), peakY: 0.31, marker: 0.08, markerInk: hex(0x1e9bf5), edge: IOS7,
        }),
      ),
      flat(
        2014,
        0x141416,
        stocksChart({
          grid: [0.1, 0.3, 0.5, 0.87], gridInk: hex(0x2e2e30), gridWidth: 0.008,
          points: chartIOS7, fill: 0.09, lineWidth: 0.025, lineInk: WHITE,
          barX: 0.69, barWidth: 0.015, barInk: hex(0x1e9bf5), peakY: 0.31, marker: 0.08, markerInk: hex(0x1e9bf5), edge: FLAT,
        }),
      ),
      flat(
        2017,
        0x1a1a1b,
        stocksChart({
          grid: [0.14, 0.33, 0.5, 0.84], gridInk: hex(0x333334), gridWidth: 0.01,
          points: chartIOS11, fill: 0.1, lineWidth: 0.032, lineInk: WHITE,
          barX: 0.656, barWidth: 0.024, barInk: hex(0x1e9bf5), peakY: 0.34, marker: 0.1, markerInk: hex(0x1e9bf5), edge: FLAT,
        }),
      ),
      design(
        2024,
        0x2e2e2d,
        0x151616,
        stocksChart({
          grid: [0.14, 0.33, 0.5, 0.84], gridInk: hex(0x3a3a3b), gridWidth: 0.01,
          points: chartIOS18, fill: 0.09, lineWidth: 0.032, lineInk: WHITE,
          barX: 0.594, barWidth: 0.024, barInk: hex(0x1e9bf5), peakY: 0.355, marker: 0.1, markerInk: hex(0x1e9bf5), edge: FLAT,
        }),
      ),
      // 2025-2026: every number here measured off the 1024 pt iOS 26 / macOS
      // 26 artwork — background #1e1e1e, grid #343434, the cursor 0.0352
      // wide, its glass head 0.239 across, centred on 0.604, 0.333.
      design(
        2025,
        0x232323,
        0x171717,
        stocksChart({
          grid: [0.18, 0.4, 0.6, 0.82], gridInk: hex(0x343434), gridWidth: 0.01,
          points: chartIOS26, fill: 0.1, lineWidth: 0.03, lineInk: hex(0xf4f4f4),
          barX: 0.604, barWidth: 0.0352, barInk: hex(0x04d6ee), peakY: 0.333, marker: 0.239, markerInk: hex(0x00daf9), ring: true, glass: true, edge: FLAT,
        }),
      ),
      design(
        2026,
        0x1f1f1f,
        0x161616,
        stocksChart({
          grid: [0.18, 0.4, 0.6, 0.82], gridInk: hex(0x3a3a3a), gridWidth: 0.01,
          points: chartIOS26, fill: 0.12, lineWidth: 0.03, lineInk: hex(0xf8f8f8),
          barX: 0.604, barWidth: 0.0352, barInk: hex(0x2ae4ff), peakY: 0.333, marker: 0.239, markerInk: hex(0x2ae4ff), ring: true, glass: true, edge: FLAT,
        }),
      ),
    ],
  },

  // Compass: arrived with the 3GS in iPhone OS 3.
  {
    id: 'Compass',
    designs: [
      design(2009, 0x6a4232, 0x2e180e, brassCompass(false)),
      design(2010, 0x6e5a56, 0x240f06, brassCompass(true)),
      flat(
        2013,
        0x000000,
        dialCompass({
          dial: dialIOS7, majorInk: WHITE, minorInk: white(0.6), letters: WHITE, letterFont: helveticaNeue(0.118, weight.light),
          disc: hex(0x2c2c2c), cross: hex(0xa1a1a1), marker: hex(0xff3b30), edge: IOS7,
        }),
      ),
      flat(
        2014,
        0x141416,
        dialCompass({
          dial: dialIOS7, majorInk: WHITE, minorInk: hex(0x6f6e71), letters: WHITE, letterFont: helveticaNeue(0.125),
          disc: hex(0x222124), cross: hex(0xb4b4b4), marker: hex(0xfe3c30), edge: FLAT,
        }),
      ),
      flat(
        2015,
        0x141416,
        dialCompass({
          dial: dialIOS7, majorInk: WHITE, minorInk: hex(0x6f6e71), letters: WHITE, letterFont: system(0.125, weight.regular),
          disc: hex(0x222124), cross: hex(0xb4b4b4), marker: hex(0xfe3c30), edge: FLAT,
        }),
      ),
      flat(
        2017,
        0x1a1a1b,
        dialCompass({
          dial: dialIOS11, majorInk: WHITE, minorInk: hex(0x656566), letters: WHITE, letterFont: system(0.13, weight.medium),
          disc: hex(0x262627), cross: hex(0x676768), marker: hex(0xff3a2f), edge: FLAT,
        }),
      ),
      design(
        2024,
        0x303030,
        0x151515,
        dialCompass({
          dial: dialIOS11, majorInk: WHITE, minorInk: hex(0x555455), letters: WHITE, letterFont: system(0.13, weight.medium),
          cross: hex(0x787878), marker: hex(0xff392f), edge: FLAT,
        }),
      ),
      design(
        2025,
        0x313131,
        0x141414,
        dialCompass({
          dial: dialIOS26, majorInk: hex(0xf6f6f6), minorInk: hex(0x737373), letters: WHITE, letterFont: system(0.152, weight.medium),
          cross: hex(0x737373), marker: hex(0xff464b), glass: true, edge: FLAT,
        }),
      ),
      design(
        2026,
        0x232323,
        0x0f0f0f,
        dialCompass({
          dial: dialIOS27, majorInk: WHITE, minorInk: hex(0x787878), letters: WHITE, letterFont: system(0.142, weight.medium),
          cross: hex(0x777777), marker: hex(0xea534a), glass: true, bezel: true, edge: FLAT,
        }),
      ),
    ],
  },
]
