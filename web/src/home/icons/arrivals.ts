// Port of HomeIcons+Arrivals.swift: Wallet, Health, Books, News, Home,
// Files, Measure, Shortcuts, Translate, Freeform, Journal, Passwords, Games,
// Preview and Siri. Every design keeps the Swift year, background stops and
// glyph geometry (fractions of the tile, x 100 here). See kit.ts for the
// conventions.
//
// Spans (timeline year = first year the design is shown):
// Wallet     2012 Passbook leather · 2013 three passes · 2014 four passes (Apple Pay) ·
//            2015 Wallet on black · 2024 gradient · 2025 glass · 2026 clearer glass
// Health     2014 heart top-right · 2024 heart retouched · 2025 glass heart · 2026 deeper heart
// Books      2014 iBooks · 2017 iOS 11 redraw · 2021 wider gap · 2024 vivid orange · 2025 glass · 2026 darker
// News       2015 newspaper · 2016 paper with N · 2017 thinner lines · 2019 big N · 2024 smaller N ·
//            2025 glass N · 2026 deeper N
// Home       2016 rounded nested house · 2024 squarer · 2025 glass house · 2026 deeper orange
// Files      2017 folder · 2024 wider · 2025 glass folder · 2026 flatter blue
// Measure    2018 ruler band · 2024 gradient · 2025 glass · 2026 darker glass
// Shortcuts  2018 navy diamonds · 2021 pink/cyan · 2025 purple glass · 2026 bluer violet
// Translate  2020 globe + bubbles · 2024 bubbles only · 2025 cyan glass · 2026 lighter
// Freeform   2022 scribble (iOS 18 kept it) · 2025 glass · 2026 teal (26.4 / iOS 27)
// Journal    2023 butterfly · 2025 glass · 2026 brighter
// Passwords  2024 flat keys on white · 2025 glass keys on dark · 2026 brighter keys
// Games      2025 rocket · 2026 coral
// Preview    2025 loupe on blue · 2026 loupe over a picture
// Siri       2026 chrome orb
//
// PORTING NOTES
// - SwiftUI resolves a gradient's unit points against the VIEW's frame, and
//   most shapes here are laid out in a frame the size of the whole tile
//   (house layers, folder back, butterfly wings, keys, the loupe skirt). So
//   gradients are built in user space over that frame (lin/rad below), not
//   over the path's own bounding box as kit.linear() does.
// - `.strokeBorder` insets the shape by half the line; `.stroke` straddles it.
// - Two SF Symbols the kit has no stand-in for (creditcard.fill,
//   cup.and.saucer.fill) use Phosphor (MIT) glyphs, sized like kit.symbol();
//   SF's outline "globe" uses Phosphor's light globe (the kit's is filled),
//   and the kit's airplane is turned 90 degrees to point east like SF's.
// - `.shadow` on an uncomposited stack shadows each leaf (eachLeaf), and
//   shadows merge in sRGB (drop), both measured off the iOS captures.

import type { Art, HomeAppDef, Kit, Stop, SymbolName } from './kit'
import {
  blur,
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
  path,
  rect,
  ring,
  rrect,
  rrectPath,
  symbol,
  text,
  weight,
} from './kit'
import creditCardSource from '@phosphor-icons/core/assets/fill/credit-card-fill.svg?raw'
import coffeeSource from '@phosphor-icons/core/assets/fill/coffee-fill.svg?raw'
import globeOutlineSource from '@phosphor-icons/core/assets/light/globe-light.svg?raw'

// ---------------------------------------------------------------- helpers

const n = (v: number): number => +v.toFixed(3)
const P = (x: number, y: number): string => `${n(x)},${n(y)}`
const white = (a: number): string => hex(0xffffff, a)
const black = (a: number): string => hex(0x000000, a)

/** A LinearGradient whose start and end points are given in the 100 box
 *  (the frame's unit points already resolved), like SwiftUI filling a view
 *  of that frame. Returns a fill/stroke value. */
function lin(k: Kit, list: Array<Stop | string>, x1: number, y1: number, x2: number, y2: number): string {
  const id = k.id('ul')
  k.def(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}">${gradientStops(list)}</linearGradient>`,
  )
  return `url(#${id})`
}

/** Top-to-bottom gradient over a frame running from y0 to y1. */
const down = (k: Kit, list: Array<Stop | string>, y0: number, y1: number): string => lin(k, list, 0, y0, 0, y1)

/** A RadialGradient centred at (cx, cy) with endRadius r (startRadius 0),
 *  in the 100 box: circular in points, whatever the frame's shape. */
function rad(k: Kit, list: Array<Stop | string>, cx: number, cy: number, r: number): string {
  const id = k.id('ur')
  k.def(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}">${gradientStops(list)}</radialGradient>`)
  return `url(#${id})`
}

/** `.shadow(color:radius:x:y:)` as a filter attribute: kit.shadow()'s
 *  Gaussian (standard deviation = radius) and region, but merged in sRGB.
 *  SVG filters default to linearRGB, which lightens a TRANSLUCENT leaf
 *  over its own shadow (the glass Wallet pocket came out 9 levels too
 *  light); SwiftUI composites in sRGB. Opaque leaves look the same. */
function drop(k: Kit, colour: string, radius: number, y: number, x = 0): string {
  const id = k.id('ds')
  k.def(
    `<filter id="${id}" filterUnits="userSpaceOnUse" x="-60" y="-60" width="220" height="220" color-interpolation-filters="sRGB">` +
      `<feDropShadow dx="${n(x)}" dy="${n(y)}" stdDeviation="${n(radius)}" flood-color="${colour}"/></filter>`,
  )
  return `filter="url(#${id})"`
}

/** SwiftUI's `.shadow` on a stack that is not a compositing group shadows
 *  every leaf on its own, in drawing order, so a leaf's shadow falls on the
 *  leaves before it and shows through translucent ones (measured off the
 *  iOS captures: the glass Wallet pocket is 9% darker than a group shadow
 *  gives). `filter` is a drop() attribute; each leaf gets its own copy. */
const eachLeaf = (filter: string, leaves: string[]): string => leaves.map((leaf) => `<g ${filter}>${leaf}</g>`).join('')

/** Stroke attributes (`.stroke(paint, lineWidth:)`). */
const stroke = (paint: string, width: number, extra = ''): string => `stroke="${paint}" stroke-width="${n(width)}" ${extra} `

/** SF's airplane points east; Phosphor's points north. */
const airplaneTurn = 90

/** A Phosphor glyph for an SF Symbol the kit does not carry, sized and
 *  centred like kit.symbol(). */
function extraGlyph(source: string, colour: string, size: number, cx: number, cy: number): string {
  const body = source.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  const s = (size * 1.18) / 256
  return `<g transform="translate(${n(cx)} ${n(cy)}) scale(${+s.toFixed(5)}) translate(-128 -128)" fill="${colour}">${body}</g>`
}

/** CGPath addArc(tangent1End:tangent2End:radius:) round every corner of a
 *  polygon, starting midway along its closing edge (arrivalsRoundedPolygon). */
function roundedPolygon(points: Array<[number, number]>, radius: number): string {
  const count = points.length
  if (count < 3) return ''
  const last = points[count - 1]
  let cur: [number, number] = [(last[0] + points[0][0]) / 2, (last[1] + points[0][1]) / 2]
  let d = `M${P(cur[0], cur[1])} `
  for (let i = 0; i < count; i++) {
    const c = points[i]
    const next = points[(i + 1) % count]
    const ax = cur[0] - c[0]
    const ay = cur[1] - c[1]
    const bx = next[0] - c[0]
    const by = next[1] - c[1]
    const al = Math.hypot(ax, ay)
    const bl = Math.hypot(bx, by)
    if (al < 1e-9 || bl < 1e-9) continue
    const ux = ax / al
    const uy = ay / al
    const vx = bx / bl
    const vy = by / bl
    const angle = Math.acos(Math.min(1, Math.max(-1, ux * vx + uy * vy)))
    const t = radius / Math.tan(angle / 2)
    const t1: [number, number] = [c[0] + ux * t, c[1] + uy * t]
    const t2: [number, number] = [c[0] + vx * t, c[1] + vy * t]
    // Turning clockwise on screen (y down) is SVG's positive sweep.
    const cross = -ux * vy + uy * vx
    d += `L${P(t1[0], t1[1])} A${n(radius)},${n(radius)} 0 0 ${cross > 0 ? 1 : 0} ${P(t2[0], t2[1])} `
    cur = t2
  }
  return d + 'Z'
}

// ================================================================ Wallet

/** ArrivalsTicketShape (eoFill): a rounded card with a round punch centred
 *  on its top edge, drawn w x h centred at (cx, cy). */
function ticketPath(cx: number, cy: number, w: number, h: number): string {
  const notch = w * 0.11
  return `${rrectPath(cx, cy, w, h, w * 0.08, true)} ${ellipsePath(cx, cy - h / 2, notch, notch)}`
}

/** iOS 6 Passbook: three passes fanned in a diagonal leather pocket. */
const passbookLeather: Art = (k) => {
  const cardW = 30
  const cardH = 54
  const lift = -6 // the passes' ZStack offset
  const pass = (colour: number, glyph: SymbolName, size: number, alpha: number, glyphDy: number, turn: number, dx: number, dy: number) => {
    const cx = 50 + dx
    const cy = 50 + dy + lift
    return (
      `<g transform="rotate(${turn} ${n(cx)} ${n(cy)})">` +
      path(ticketPath(cx, cy, cardW, cardH), hex(colour), 'fill-rule="evenodd"') +
      symbol(glyph, white(alpha), size, cx, cy + glyphDy, glyph === 'airplane' ? airplaneTurn : 0) +
      '</g>'
    )
  }
  return (
    pass(0x2e9e42, 'tag.fill', 9, 0.9, -10, -20, -20, 5) +
    pass(0xf5c324, 'airplane', 11, 0.92, -9, -5, -2, -1) +
    pass(0x2a8fd8, 'video.fill', 10, 0.92, -10, 15, 18, -3) +
    // The pocket: leather below a stitched diagonal seam.
    path('M0,62 L100,44 L100,100 L0,100 Z', down(k, [hex(0x2c2c2d), hex(0x1f1f20)], 0, 100), drop(k, black(0.5), 1.5, -0.8)) +
    path('M0,66.5 L100,48.5', 'none', stroke(hex(0x5a5a5c), 1.2, 'stroke-dasharray="2.5 2"'))
  )
}

/** ArrivalsBandShape: a pass band from `top` to the bottom of the tile, with
 *  an optional round punch dipping into its top edge, or a zigzag top. */
function bandPath(top: number, notchX?: number, zigzag = false, notchRadius = 0.07): string {
  const y = top * 100
  let d = `M0,100 L0,${n(y)} `
  if (zigzag) {
    const teeth = 20
    const pitch = 100 / teeth
    const depth = 3
    for (let step = 0; step < teeth; step++) {
      const x0 = pitch * step
      d += `L${P(x0 + pitch / 2, y + depth)} L${P(x0 + pitch, y)} `
    }
  } else if (notchX !== undefined) {
    const r = 100 * notchRadius
    const cx = 100 * notchX
    // Swift's addArc(clockwise: true) runs anticlockwise on screen: the
    // arc dips down through the band.
    d += `L${P(cx - r, y)} A${n(r)},${n(r)} 0 0 0 ${P(cx + r, y)} L${P(100, y)} `
  } else {
    d += `L${P(100, y)} `
  }
  return d + 'L100,100 Z'
}

/** iOS 7 (three passes) and iOS 8 (four, with the red card band) Passbook. */
function passbookBands(applePay: boolean): Art {
  return () => {
    const blueTop = applePay ? 0.28 : 0
    const greenTop = applePay ? 0.52 : 0.38
    const orangeTop = applePay ? 0.76 : 0.68
    const size = 13
    const at = (y: number) => y * 100
    let out = ''
    if (applePay) out += path(bandPath(blueTop, 0.85), hex(0x4ca2d3))
    out += path(bandPath(greenTop, 0.5), hex(0x3dc500))
    out += path(bandPath(orangeTop, undefined, true), hex(0xffa100))
    if (applePay) out += extraGlyph(creditCardSource, '#fff', size, 19, at(0.13))
    out += symbol('airplane', '#fff', size, 19, at((blueTop + greenTop) / 2 - (applePay ? 0.01 : 0.02)), airplaneTurn)
    out += symbol('video.fill', '#fff', size, 19, at((greenTop + orangeTop) / 2))
    out += extraGlyph(coffeeSource, '#fff', size, 19, at((orangeTop + 1) / 2))
    return out
  }
}

/** ArrivalsPocketShape: a panel whose top edge dips in a round U, drawn in
 *  the frame (x0, y0, w, h). */
function pocketPath(x0: number, y0: number, w: number, h: number): string {
  const mid = x0 + w / 2
  const dipW = w * 0.38
  const dipD = h * 0.22
  return (
    `M${P(x0, y0)} L${P(mid - dipW / 2, y0)} ` +
    `C${P(mid - dipW * 0.28, y0)} ${P(mid - dipW * 0.22, y0 + dipD)} ${P(mid, y0 + dipD)} ` +
    `C${P(mid + dipW * 0.22, y0 + dipD)} ${P(mid + dipW * 0.28, y0)} ${P(mid + dipW / 2, y0)} ` +
    `L${P(x0 + w, y0)} L${P(x0 + w, y0 + h)} L${P(x0, y0 + h)} Z`
  )
}

/** The Wallet (iOS 9+): a pale wallet, cards tucked behind a pocket whose
 *  dip shows the red card. `glass` is the Liquid Glass reading with a
 *  translucent pocket and three cards; `clarity` is how clear that is. */
function walletArt(scale: number, glass: boolean, clarity = 0.55): Art {
  return (k) => {
    const w = 76
    const h = 60
    const x0 = 50 - w / 2
    const y0 = 50 - h / 2
    const cardW = w * 0.9
    const outline = rrectPath(50, 50, w, h, 7, true)
    const cards: Array<[number, number]> = glass
      ? [
          [0x22a3ee, 0.09],
          [0xf3c11a, 0.22],
          [0xf96550, 0.35],
        ]
      : [
          [0x3b99c9, 0.09],
          [0xfeb003, 0.19],
          [0x50be3d, 0.29],
          [0xf26d5f, 0.39],
        ]
    const leaves = [path(outline, hex(glass ? 0xe6dcd5 : 0xcfccc2))]
    for (const [colour, top] of cards) leaves.push(rrect(50, y0 + 60 * top + 20, cardW, 40, 3, hex(colour), '', true))
    const pocket = pocketPath(x0, y0 + h * 0.45, w, h * 0.55)
    leaves.push(path(pocket, glass ? fade(hex(0xede3dd), 1 - clarity * 0.5) : hex(0xdad7cd), drop(k, black(glass ? 0.1 : 0.16), 0.6, -0.4)))
    if (glass) leaves.push(path(pocket, 'none', stroke(white(0.7), 0.8)))
    const clipAttr = `clip-path="${clip(k, `<path d="${outline}"/>`)}"`
    let body: string
    if (glass) {
      // Each leaf is clipped, then shadowed on its own (see eachLeaf).
      const rim = path(rrectPath(50, 50, w - 0.8, h - 0.8, 6.6, true), 'none', stroke(white(0.55), 0.8))
      body = eachLeaf(drop(k, black(0.35), 3, 2), [...leaves.map((leaf) => `<g ${clipAttr}>${leaf}</g>`), rim])
    } else {
      body = `<g ${clipAttr}>${leaves.join('')}</g>`
    }
    return scale === 1 ? body : `<g transform="translate(50 50) scale(${scale}) translate(-50 -50)">${body}</g>`
  }
}

// ================================================================ Health

/** ArrivalsHeartShape in the frame (x, y, w, h): two round lobes over a
 *  pointed tip; `cleft` is how far the notch between the lobes dips. */
function heartPath(x: number, y: number, w: number, h: number, cleft: number): string {
  const p = (px: number, py: number) => P(x + w * px, y + h * py)
  return (
    `M${p(0.5, cleft)} ` +
    `C${p(0.43, cleft - 0.31)} ${p(-0.01, -0.06)} ${p(0, 0.33)} ` +
    `C${p(0, 0.6)} ${p(0.31, 0.83)} ${p(0.5, 1)} ` +
    `C${p(0.69, 0.83)} ${p(1, 0.6)} ${p(1, 0.33)} ` +
    `C${p(1.01, -0.06)} ${p(0.57, cleft - 0.31)} ${p(0.5, cleft)} Z`
  )
}

/** The Health heart, up and to the right of centre. `box` is its frame as
 *  tile fractions [x, y, w, h]. */
function heartArt(top: number, bottom: number, box: [number, number, number, number], cleft: number, glass: boolean, shade = 0.3): Art {
  return (k) => {
    const [x, y, w, h] = box.map((v) => v * 100)
    const d = heartPath(x, y, w, h, cleft)
    let out = path(d, down(k, [hex(top), hex(bottom)], y, y + h), glass ? drop(k, hex(bottom, shade), 3, 2.5) : '')
    if (glass) {
      out += path(d, 'none', stroke(down(k, [white(0.8), white(0)], y, y + h / 2), 1.2))
      const ex = x + w / 2 - w * 0.25
      const ey = y + h / 2 - h * 0.27
      out += ellipse(ex, ey, w * 0.2, h * 0.11, white(0.32), `transform="rotate(-35 ${n(ex)} ${n(ey)})"`)
    }
    return out
  }
}

// ================================================================ Books

interface PageSpec {
  outerTop: number
  spineTop: number
  spineBottom: number
  outerBottom: number
  /** Control height of the bottom edge: lower lifts a bigger hump. */
  hump: number
}

/** ArrivalsPageShape: the left page (spine on the right) in (x, y, w, h);
 *  `mirror` draws the right page. */
function pagePath(pg: PageSpec, x: number, y: number, w: number, h: number, mirror: boolean): string {
  const p = (px: number, py: number) => P(x + w * (mirror ? 1 - px : px), y + h * py)
  return (
    `M${p(0, pg.outerTop)} Q${p(0.45, -(pg.outerTop + pg.spineTop) / 2)} ${p(1, pg.spineTop)} ` +
    `L${p(1, pg.spineBottom)} Q${p(0.5, pg.hump)} ${p(0, pg.outerBottom)} Z`
  )
}

/** ArrivalsOpenBook: two white pages, `gap` apart, 0.666 of the tile wide. */
function openBook(gap: number, pg: PageSpec, height = 0.55): Art {
  return () => {
    const bookW = 66.6
    const g = gap * 100
    const pageW = (bookW - g) / 2
    const h = height * 100
    const x0 = 50 - bookW / 2
    const y0 = 50 - h / 2
    return path(pagePath(pg, x0, y0, pageW, h, false), '#fff') + path(pagePath(pg, x0 + pageW + g, y0, pageW, h, true), '#fff')
  }
}

/** ArrivalsGlassPageShape: a rounded outer corner, an arch that dips into a
 *  V at the spine, and a bottom that droops to the spine. */
function glassPagePath(x: number, y: number, w: number, h: number, mirror: boolean): string {
  const p = (px: number, py: number) => P(x + w * (mirror ? 1 - px : px), y + h * py)
  return (
    `M${p(0, 0.09)} Q${p(0, 0.015)} ${p(0.08, 0.015)} Q${p(0.55, -0.03)} ${p(1, 0.13)} ` +
    `L${p(1, 1)} Q${p(0.45, 0.83)} ${p(0, 0.91)} Z`
  )
}

/** ArrivalsGlassBook: two pages over a translucent cover plate. */
function glassBook(page: number, plate: number): Art {
  return (k) => {
    const cover =
      rrect(14 + 72.5 / 2, 28 + 50.5 / 2, 72.5, 50.5, 5, fade(hex(plate), 0.8), '', true) +
      path(rrectPath(14 + 72.5 / 2, 28 + 50.5 / 2, 72.5 - 0.8, 50.5 - 0.8, 4.6, true), 'none', stroke(white(0.5), 0.8))
    const pageStops = [hex(page), hex(page), hex(0xf1dcc9)]
    const left = path(glassPagePath(17.8, 22.2, 32, 55, false), lin(k, pageStops, 17.8, 0, 49.8, 0))
    const right = path(glassPagePath(50.2, 22.2, 32, 55, true), lin(k, pageStops, 82.2, 0, 50.2, 0))
    return cover + eachLeaf(drop(k, hex(0x9a4a10, 0.25), 2, 1.2), [left, right])
  }
}

// ================================================================ News

/** ArrivalsNewsWedge in the square (x0, y0, s): the top-right corner sliver
 *  and the same turned half a turn. */
function newsWedgePath(x0: number, y0: number, s: number): string {
  let d = ''
  for (const flip of [false, true]) {
    const q = (x: number, y: number) => (flip ? P(x0 + s * (1 - x), y0 + s * (1 - y)) : P(x0 + s * x, y0 + s * y))
    d += `M${q(0.55, 0)} L${q(1, 0)} L${q(1, 0.46)} Q${q(0.8, 0.12)} ${q(0.55, 0)} Z `
  }
  return d
}

/** ArrivalsNewsN: the News monogram (a thick diagonal bar and two corner
 *  slivers inside a rounded square), `size` square with its top-left at
 *  (x0, y0), filled top to bottom. */
function newsN(k: Kit, x0: number, y0: number, size: number, top: string, bottom: string, glass: boolean, shade = 0.26): string {
  const s = size
  const cx = x0 + s / 2
  const cy = y0 + s / 2
  const letter = clip(
    k,
    `<rect x="${n(cx - s * 0.18)}" y="${n(cy - s)}" width="${n(s * 0.36)}" height="${n(s * 2)}" transform="rotate(-45 ${n(cx)} ${n(cy)})"/>` +
      `<path d="${newsWedgePath(x0, y0, s)}"/>`,
  )
  const rounded = clip(k, `<path d="${rrectPath(cx, cy, s, s, s * 0.08, true)}"/>`)
  const masked = (fill: string) => `<g clip-path="${rounded}"><g clip-path="${letter}">${rect(cx, cy, s, s, fill)}</g></g>`
  const ink = masked(top === bottom ? top : down(k, [top, bottom], y0, y0 + s))
  if (!glass) return ink
  // A pale glass sheen over the upper half of the letter; letter and sheen
  // are shadowed one by one (see eachLeaf).
  const sheen = masked(down(k, [white(0.3), white(0)], y0, y0 + s / 2))
  return eachLeaf(drop(k, fade(bottom, shade), s * 0.05, s * 0.05), [ink, sheen])
}

function newsLetter(size: number, top: number, bottom: number, glass: boolean, shade?: number): Art {
  return (k) => newsN(k, 50 - (size * 100) / 2, 50 - (size * 100) / 2, size * 100, hex(top), hex(bottom), glass, shade)
}

/** ArrivalsSkyline in the frame (x, y, w, h): a stepped row of towers. */
function skylinePath(x: number, y: number, w: number, h: number): string {
  const steps: Array<[number, number]> = [
    [0.0, 0.55],
    [0.1, 0.7],
    [0.18, 0.5],
    [0.27, 0.8],
    [0.36, 0.62],
    [0.47, 0.88],
    [0.56, 0.58],
    [0.66, 0.72],
    [0.76, 0.52],
    [0.86, 0.66],
    [1.0, 0.66],
  ]
  const maxY = y + h
  let d = `M${P(x, maxY)} `
  for (let i = 0; i < steps.length - 1; i++) {
    const [x0, height] = steps[i]
    const x1 = steps[i + 1][0]
    d += `L${P(x + w * x0, maxY - h * height)} L${P(x + w * x1, maxY - h * height)} `
  }
  return d + `L${P(x + w, maxY)} Z`
}

type PaperStyle = 'photo' | 'thickLines' | 'thinLines'

/** iOS 9-12.1 News: a white newspaper with a curled left edge. */
function newspaper(style: PaperStyle): Art {
  return (k) => {
    const photo = style === 'photo'
    const [px, py, pw, ph] = photo ? [0.22, 0.22, 0.62, 0.56] : style === 'thinLines' ? [0.21, 0.19, 0.64, 0.625] : [0.2, 0.19, 0.635, 0.615]
    const curlX = photo ? 0.145 : 0.135
    // The curled-back page behind.
    const cw = 100 * (px - curlX + 0.02)
    const ch = 100 * (ph - 0.045)
    const cx0 = 100 * curlX
    const cy0 = 100 * (py + 0.035)
    let out = path(
      rrectPath(cx0 + cw / 2, cy0 + ch / 2, cw, ch, [1.2, 0, 0, 3.5], true),
      lin(k, [hex(0xf6f6f7), hex(0xd2d2d6)], cx0, 0, cx0 + cw, 0),
    )
    // The front page.
    out += rrect(100 * (px + pw / 2), 100 * (py + ph / 2), 100 * pw, 100 * ph, 1.2, '#fff', drop(k, black(0.14), 0.8, 0, -0.4), true)
    if (photo) {
      // Masthead rules round a globe, a skyline photo, two lines of copy.
      for (const y of [0.285, 0.335]) {
        out += rect(26 + 9, 100 * y + 0.55, 18, 1.1, hex(0x707070))
        out += rect(60 + 9, 100 * y + 0.55, 18, 1.1, hex(0x707070))
      }
      // SF's "globe" is a line drawing, so Phosphor's light globe, not the
      // kit's filled one.
      out += extraGlyph(globeOutlineSource, hex(0x5a5a5a), 11.5, 45.5 + 6.5, 25 + 6.5)
      out += rect(24 + 28.5, 40 + 12, 57, 24, hex(0xabe1fa))
      out += ellipse(24 + 28.5 - 14, 64 - 3 - 15, 14, 6, white(0.9))
      out += ellipse(24 + 28.5 + 16, 64 - 2.5 - 16, 12, 5, white(0.85))
      out += path(skylinePath(24, 49, 57, 15), hex(0x5b5957))
      for (const y of [0.685, 0.735]) out += rrect(24 + 28.5, 100 * y + 0.9, 57, 1.8, 0.8, hex(0xbdbdbd))
    } else {
      out += newsN(k, 100 * (px + 0.063), 25.8, 25.5, hex(0xef4b62), hex(0xef4b62), false)
      const thick = style === 'thickLines'
      const lh = thick ? 3 : 0.9
      const lx = 100 * (px + 0.063)
      const lw = 100 * (pw - 0.063)
      for (const y of [0.6, 0.671, 0.742]) {
        out += rect(lx + lw / 2, 100 * (y - (thick ? 0.015 : 0.0045)) + lh / 2, lw, lh, hex(thick ? 0xc6c5ca : 0xbdbdc1))
      }
    }
    return out
  }
}

// ================================================================ Home

/** Roof pitch of the Home glyph (rise over run). */
const roofPitch = 0.78

/** ArrivalsPentagon: a house pentagon in tile fractions. */
function pentagonPath(halfWidth: number, apex: number, base: number, corner: number): string {
  const eave = apex + halfWidth * roofPitch
  const p = (x: number, y: number): [number, number] => [x * 100, y * 100]
  return roundedPolygon(
    [p(0.5, apex), p(0.5 + halfWidth, eave), p(0.5 + halfWidth, base), p(0.5 - halfWidth, base), p(0.5 - halfWidth, eave)],
    corner * 100,
  )
}

/** ArrivalsHouseSilhouette: the outer house with overhanging eaves and a
 *  chimney. */
function silhouettePath(apex: number, base: number, chimneyLeft: number, chimneyTop: number, corner: number): string {
  const p = (x: number, y: number): [number, number] => [x * 100, y * 100]
  const roof = (x: number) => apex + Math.abs(x - 0.5) * roofPitch
  const chimneyRight = 0.78
  const eave = roof(0.13)
  const soffit = eave + 0.045
  return roundedPolygon(
    [
      p(0.5, apex),
      p(chimneyLeft, roof(chimneyLeft)),
      p(chimneyLeft, chimneyTop),
      p(chimneyRight, chimneyTop),
      p(chimneyRight, roof(chimneyRight)),
      p(0.87, eave),
      p(0.87, soffit),
      p(0.79, soffit),
      p(0.79, base),
      p(0.21, base),
      p(0.21, soffit),
      p(0.13, soffit),
      p(0.13, eave),
    ],
    corner * 100,
  )
}

type HouseLook = 'rounded' | 'square' | 'glass' | 'deepGlass'

interface HouseLayer {
  halfWidth: number
  apex: number
  base: number
  colours: number[]
}

const houseSpecs: Record<HouseLook, { apex: number; base: number; outer: number[]; layers: HouseLayer[] }> = {
  rounded: {
    apex: 0.122,
    base: 0.806,
    outer: [0xf68d1c, 0xfc9306],
    layers: [
      { halfWidth: 0.244, apex: 0.189, base: 0.756, colours: [0xfead29] },
      { halfWidth: 0.189, apex: 0.256, base: 0.7, colours: [0xffc047] },
      { halfWidth: 0.133, apex: 0.322, base: 0.644, colours: [0xfed365] },
      { halfWidth: 0.078, apex: 0.389, base: 0.589, colours: [0xfee57d] },
    ],
  },
  square: {
    apex: 0.128,
    base: 0.811,
    outer: [0xf78d1e, 0xfd9402],
    layers: [
      { halfWidth: 0.239, apex: 0.2, base: 0.756, colours: [0xfcab29] },
      { halfWidth: 0.183, apex: 0.272, base: 0.7, colours: [0xfebe46] },
      { halfWidth: 0.128, apex: 0.344, base: 0.644, colours: [0xfdd164] },
      { halfWidth: 0.072, apex: 0.411, base: 0.594, colours: [0xfee57d] },
    ],
  },
  glass: {
    apex: 0.148,
    base: 0.808,
    outer: [0xffae06, 0xfe9c00],
    layers: [
      { halfWidth: 0.213, apex: 0.246, base: 0.734, colours: [0xfdb622, 0xfd8c00] },
      { halfWidth: 0.128, apex: 0.344, base: 0.648, colours: [0xfdda62, 0xfeb41e] },
      { halfWidth: 0.078, apex: 0.441, base: 0.578, colours: [0xfffdd6, 0xfef1a4] },
    ],
  },
  deepGlass: {
    apex: 0.15,
    base: 0.81,
    outer: [0xff9100, 0xff7b00],
    layers: [
      { halfWidth: 0.213, apex: 0.246, base: 0.73, colours: [0xffb02f, 0xffa11b] },
      { halfWidth: 0.128, apex: 0.344, base: 0.652, colours: [0xffd571, 0xffc55a] },
      { halfWidth: 0.078, apex: 0.441, base: 0.58, colours: [0xfffbc3, 0xfffed5] },
    ],
  },
}

/** Home: a house outline filled with ever-smaller houses in lighter
 *  oranges. Every layer's gradient runs over the whole tile, as in Swift. */
function houseArt(look: HouseLook): Art {
  return (k) => {
    const glass = look === 'glass' || look === 'deepGlass'
    const corner = look === 'rounded' ? 0.018 : glass ? 0.014 : 0.005
    const s = houseSpecs[look]
    const leaves = [path(silhouettePath(s.apex, s.base, glass ? 0.72 : 0.7, glass ? 0.23 : 0.2, corner), down(k, s.outer.map((c) => hex(c)), 0, 100))]
    s.layers.forEach((layer, index) => {
      const lastLayer = index === s.layers.length - 1
      const d = pentagonPath(layer.halfWidth, layer.apex, layer.base, glass && lastLayer ? 0.02 : corner)
      const fill = layer.colours.length > 1 ? down(k, layer.colours.map((c) => hex(c)), 0, 100) : hex(layer.colours[0])
      leaves.push(path(d, fill))
      // iOS 27 outlines each glass layer in a darker orange.
      if (look === 'deepGlass' && !lastLayer) leaves.push(path(d, 'none', stroke(hex(0xe25a00, 0.55), 0.8)))
      if (glass) leaves.push(path(d, 'none', stroke(down(k, [white(0.75), white(0.1)], 0, 100), 0.7)))
    })
    // iOS 27's shadow lands on every layer below (see eachLeaf).
    return look === 'deepGlass' ? eachLeaf(drop(k, hex(0xc05a00, 0.3), 2.2, 1.8), leaves) : leaves.join('')
  }
}

// ================================================================ Files

/** ArrivalsFolderBack: the back of the folder with its tab (only its top
 *  shows above the front panel). */
function folderBackPath(left: number, tabTop: number, backTop: number, tabWidth: number): string {
  const p = (x: number, y: number) => P(x * 100, y * 100)
  const right = 1 - left
  const r = 0.03
  const tabEnd = left + tabWidth
  return (
    `M${p(left, 0.6)} L${p(left, tabTop + r)} Q${p(left, tabTop)} ${p(left + r, tabTop)} L${p(tabEnd, tabTop)} ` +
    `C${p(tabEnd + 0.025, tabTop)} ${p(tabEnd + 0.025, backTop)} ${p(tabEnd + 0.05, backTop)} ` +
    `L${p(right - r, backTop)} Q${p(right, backTop)} ${p(right, backTop + r)} L${p(right, 0.6)} Z`
  )
}

interface FolderSpec {
  left: number
  tabTop: number
  backTop: number
  slipTop: number
  slipBottom: number
  frontTop: number
  bottom: number
  back: [number, number]
  front: [number, number]
  slip: number
  slipInset: number
  glass: boolean
}

function folderArt(o: FolderSpec): Art {
  return (k) => {
    const W = (1 - 2 * o.left) * 100
    const leaves = [path(folderBackPath(o.left, o.tabTop, o.backTop, o.glass ? 0.235 : 0.2), down(k, o.back.map((c) => hex(c)), 0, 100))]
    const sw = W - 2 * o.slipInset * 100
    const sh = (o.slipBottom - o.slipTop) * 100
    leaves.push(rrect(50, o.slipTop * 100 + sh / 2, sw, sh, 0.6, hex(o.slip), '', true))
    const top = o.frontTop * 100
    const ph = (o.bottom - o.frontTop) * 100
    const front = o.front.map((c) => hex(c, o.glass ? 0.95 : 1))
    leaves.push(path(rrectPath(50, top + ph / 2, W, ph, [2.2, 2.2, 4, 4], true), down(k, front, top, top + ph)))
    if (!o.glass) return leaves.join('')
    leaves.push(
      path(rrectPath(50, top + ph / 2, W - 0.8, ph - 0.8, [1.8, 1.8, 3.6, 3.6], true), 'none', stroke(down(k, [white(0.75), white(0.12)], top, top + ph), 0.8)),
    )
    return eachLeaf(drop(k, hex(0x0a4fb0, 0.26), 2.5, 2), leaves)
  }
}

// ================================================================ Measure

/** ArrivalsTicks: a row of ruler ticks (capsules `width` wide) hanging
 *  from `y`, or rising from it if `up`, as one stroked path. */
function ticks(xs: number[], lengths: number[], y: number, up: boolean, width: number, colour: string): string {
  const w = width * 100
  let d = ''
  xs.forEach((x, i) => {
    const length = lengths[i] * 100
    if (length <= 0) return
    const top = up ? y * 100 - length : y * 100
    d += `M${P(x * 100, top + w / 2)} V${n(top + length - w / 2)} `
  })
  return `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${n(w)}" stroke-linecap="round"/>`
}

/** ArrivalsDots: `count` dots (or squares) evenly from `from` to `to`. */
function dots(count: number, from: number, to: number, y: number, diameter: number, square: boolean, colour: string): string {
  const d = diameter * 100
  const cy = y * 100
  let p = ''
  for (let i = 0; i < count; i++) {
    const x = (from + ((to - from) * i) / (count - 1)) * 100
    p += square ? `M${P(x - d / 2, cy - d / 2)} h${n(d)} v${n(d)} h${n(-d)} Z ` : `${ellipsePath(x, cy, d, d)} `
  }
  return path(p, colour)
}

const range = (count: number): number[] => Array.from({ length: count }, (_, i) => i)

/** Measure, iOS 12-18: thin white ticks, square dashes. */
function flatRuler(band: boolean): Art {
  return () => {
    const topXs = range(13).map((i) => 0.059 + 0.0726 * i)
    const topLen = range(13).map((i) => (i === 0 ? 0.16 : i === 8 ? 0.14 : i % 2 === 0 ? 0.09 : 0.06))
    const bottomXs = range(21).map((i) => 0.039 + 0.0459 * i)
    const bottomLen = range(21).map((i) => (i % 5 !== 0 ? 0.055 : i % 10 === 5 ? 0.165 : 0.105))
    return (
      (band ? rect(50, 50, 100, 64.8, hex(0x202020)) : '') +
      ticks(topXs, topLen, 0.205, false, 0.011, '#fff') +
      ticks(bottomXs, bottomLen, 0.785, true, 0.011, '#fff') +
      dots(19, 0.125, 0.875, 0.5, 0.02, true, hex(0xffd100)) +
      dots(2, 0.0625, 0.9375, 0.5, 0.063, false, hex(0xffcc00))
    )
  }
}

/** Measure, iOS 26+: bold white major ticks, grey minor ones, round beads. */
const glassRuler: Art = (k) => {
  const topXs = range(13).map((i) => 0.125 + 0.0625 * i)
  const topWhite = range(13).map((i) => (i % 2 !== 0 ? 0 : i === 0 || i === 8 ? 0.21 : 0.145))
  const topGrey = range(13).map((i) => (i % 2 === 0 ? 0 : 0.08))
  const bottomXs = range(21).map((i) => 0.105 + 0.0395 * i)
  const bottomWhite = range(21).map((i) => (i % 5 !== 0 ? 0 : i % 10 === 5 ? 0.19 : 0.13))
  const bottomGrey = range(21).map((i) => (i % 5 === 0 ? 0 : 0.07))
  const ends = [0.108, 0.892]
    .map((x) => circle(x * 100, 50, 5.8, rad(k, [hex(0xffe066), hex(0xf2b400)], x * 100 - 2.9 + 0.35 * 5.8, 50 - 2.9 + 0.3 * 5.8, 3.5)))
    .join('')
  const lit =
    ticks(topXs, topWhite, 0.19, false, 0.017, hex(0xf8f8f8)) +
    ticks(bottomXs, bottomWhite, 0.79, true, 0.017, hex(0xf0f0f0)) +
    dots(11, 0.1875, 0.8125, 0.5, 0.026, false, hex(0xf0c100)) +
    ends
  return (
    ticks(topXs, topGrey, 0.19, false, 0.013, hex(0x7b7b7b)) +
    ticks(bottomXs, bottomGrey, 0.79, true, 0.013, hex(0x6b6b6b)) +
    `<g ${drop(k, black(0.45), 1.2, 1)}>${lit}</g>`
  )
}

// ================================================================ Shortcuts

/** ArrivalsDiamonds: two squashed rounded diamonds, the upper overlapping
 *  the lower. `upper` runs left, middle, right; `lower` from the lower-left
 *  edge to the upper-right edge. */
function diamondsArt(upper: string[], lower: string[], upperAlpha: number, glass: boolean, roundness = 0.2): Art {
  return (k) => {
    // Measured off Apple's icons: each diamond is 0.58 of the tile across
    // (0.65 on the glass icon) and about two thirds as tall, and the two
    // barely overlap - the upper one sits left of centre, the lower right.
    const side = glass ? 46 : 41
    const squash = glass ? 0.66 : 0.655
    const lift = glass ? 13 : 16.5
    const shift = glass ? 2.5 : 2
    const h = side / 2
    // Drawn centred on the origin, then turned 45 degrees, squashed and
    // moved: bottom-leading becomes the left vertex.
    // Leaves of one diamond; the alpha is on the paint so a shadow under a
    // translucent leaf shows through it, as in SwiftUI.
    const diamond = (colours: string[], from: [number, number], to: [number, number], dy: number, alpha: number) => {
      const dx = dy > 0 ? shift : -shift
      const place = (leaf: string) => `<g transform="translate(${n(50 + dx)} ${n(50 + dy)}) scale(1 ${squash}) rotate(45)">${leaf}</g>`
      const outline = rrectPath(0, 0, side, side, side * roundness, true)
      const leaves = [place(path(outline, lin(k, colours, from[0], from[1], to[0], to[1]), alpha < 1 ? `fill-opacity="${alpha}"` : ''))]
      if (glass) {
        const rim = rrectPath(0, 0, side - 0.8, side - 0.8, side * roundness - 0.4, true)
        leaves.push(place(path(rim, 'none', stroke(lin(k, [white(0.6), white(0.1)], -h, -h, h, h), 0.8, alpha < 1 ? `stroke-opacity="${alpha}"` : ''))))
      }
      return leaves
    }
    const leaves = [...diamond(lower, [0, h], [0, -h], lift, 1), ...diamond(upper, [-h, h], [h, -h], -lift, upperAlpha)]
    return glass ? eachLeaf(drop(k, black(0.3), 2.5, 2), leaves) : leaves.join('')
  }
}

// ================================================================ Translate

/** ArrivalsSpeechBubble in (x, y, w, h): a rounded body (top 84%) with a
 *  tail off the bottom-right (or bottom-left) corner. Swift starts the tail
 *  1 pt up inside the body and winds it the other way, so, as on iOS, that
 *  1 pt strip is a hole (1 pt of a 60 pt tile). */
function speechBubblePath(x: number, y: number, w: number, h: number, tailRight: boolean): string {
  const bodyH = h * 0.84
  const body = rrectPath(x + w / 2, y + bodyH / 2, w, bodyH, bodyH * 0.22, true)
  const maxX = x + w
  const a = tailRight ? maxX - w * 0.3 : x + w * 0.1
  const b = tailRight ? maxX - w * 0.1 : x + w * 0.3
  const tip = tailRight ? maxX - w * 0.14 : x + w * 0.14
  const lip = y + bodyH - 100 / 60
  return `${body} M${P(a, lip)} L${P(tip, y + h)} L${P(b, lip)} Z`
}

/** ArrivalsGlobe in (x, y, s): a circle, two meridians, three latitudes. */
function globePath(x: number, y: number, s: number): string {
  const cx = x + s / 2
  const cy = y + s / 2
  let d = `${ellipsePath(cx, cy, s, s)} ${ellipsePath(cx, cy, s * 0.5, s)} ${ellipsePath(cx, cy, s * 0.2, s)} `
  d += `M${P(x, cy)} L${P(x + s, cy)} `
  for (const dy of [-0.28, 0.28]) {
    const ly = cy + s * dy
    const half = Math.sqrt(Math.max(0, 0.25 - dy * dy)) * s
    d += `M${P(cx - half, ly)} L${P(cx + half, ly)} `
  }
  return d
}

interface TranslateSpec {
  globe?: number
  light: number
  lightInk: number
  dark: number
  darkInk: number
  /** The iOS 18+ layout, bubbles closer together. */
  spread: boolean
  glass: boolean
}

function translateArt(o: TranslateSpec): Art {
  return (k) => {
    const lightRect = o.spread ? [0.13, 0.22, 0.4, 0.34] : [0.07, 0.17, 0.4, 0.36]
    const darkRect = o.spread ? [0.47, 0.42, 0.4, 0.34] : [0.53, 0.53, 0.4, 0.34]
    const bubble = (r: number[], fill: number, ink: number, glyph: string, tailRight: boolean) => {
      const [x, y, w, h] = r.map((v) => v * 100)
      const d = speechBubblePath(x, y, w, h, tailRight)
      const leaves = [path(d, hex(fill))]
      if (o.glass) leaves.push(path(d, 'none', stroke(white(0.45), 0.8)))
      leaves.push(text(glyph, x + w / 2, y + h * 0.42, h * 0.62, { fill: hex(ink), weight: weight.medium }))
      // Glass: the letter casts its own shadow on the bubble (see eachLeaf).
      return o.glass ? eachLeaf(drop(k, black(0.25), 2, 1.5), leaves) : leaves.join('')
    }
    let out = ''
    if (o.globe !== undefined) out += path(globePath(15.5, 13, 74), 'none', stroke(hex(o.globe), 2.2))
    out += bubble(lightRect, o.light, o.lightInk, 'A', false)
    out += bubble(darkRect, o.dark, o.darkInk, '文', true)
    return out
  }
}

// ================================================================ Freeform

/** ArrivalsScribble: the hand-drawn "m" of the Freeform icon. */
const scribblePath =
  'M19,62 C27,45 34,37.5 40,37.5 C45,37.5 45,58.5 49,58.5 C53,58.5 58,43 64,43 C70,43 70,56.7 74,56.7 C78,56.7 84,44.5 90,44.5'

interface FreeformSpec {
  circle: [string, string]
  square: [string, string]
  squareAlpha: number
  stroke: number
  highlight?: number
  squareRadius: number
  /** A soft light under the stroke, for the dark iOS 27 icon. */
  glow?: number
}

function freeformArt(o: FreeformSpec): Art {
  return (k) => {
    const round = 'stroke-linecap="round" stroke-linejoin="round"'
    let out = circle(10 + 29.25, 31 + 29.25, 58.5, down(k, o.circle, 31, 89.5))
    out += rrect(60, 40, 54, 54, o.squareRadius * 100, lin(k, o.square, 60, 13, 87, 67), o.squareAlpha < 1 ? `fill-opacity="${o.squareAlpha}"` : '', true)
    if (o.glow !== undefined) out += path(scribblePath, 'none', stroke(hex(o.glow, 0.55), 8.8, round))
    // Apple's stroke is 0.055 of the tile, not the 0.064 drawn here before.
    out += path(scribblePath, 'none', `${stroke(hex(o.stroke), 5.5, round)} ${o.highlight !== undefined ? drop(k, black(0.25), 1.5, 1.2) : ''}`)
    if (o.highlight !== undefined) {
      out += `<g transform="translate(0 -1.2)">${path(scribblePath, 'none', stroke(hex(o.highlight, 0.7), 1.1, round))}</g>`
    }
    return out
  }
}

// ================================================================ Journal

/** ArrivalsUpperWing: a tall petal whose top rises outward and whose tail
 *  hooks down to the seam (tile fractions x 100). */
const upperWingPath =
  'M19,20.5 Q19,15.5 23.5,15.5 L39.8,22.8 Q47.2,25.5 47.2,33 L47.2,50 C45,49 34,45 21.7,43 Q19,43 19,40.5 Z'

/** ArrivalsLowerWing: a squared top, a straight outer side and a round
 *  bottom that sweeps up to the seam. */
const lowerWingPath = 'M47.2,53 L29.5,53 Q25.5,53 25.5,57 L25.5,76 Q25.5,84.2 31.5,84.2 C41,84.2 47.2,80 47.2,73.5 Z'

type Pair = [number, number]

/** Journal: four wings, the right pair mirrored across the seam. Upper
 *  wings run outer edge to seam; lower wings top to bottom. */
function butterflyArt(upperLeft: Pair, lowerLeft: Pair, upperRight: Pair, lowerRight: Pair, glass: boolean): Art {
  return (k) => {
    const rim = () => stroke(down(k, [white(0.55), white(0.08)], 0, 100), 0.7)
    const alpha = glass ? 0.94 : 0.97
    // The leaves of one half; `mirror` flips it across the seam.
    const half = (upper: Pair, lower: Pair, mirror: boolean) => {
      const flip = (leaf: string) => (mirror ? `<g transform="translate(100 0) scale(-1 1)">${leaf}</g>` : leaf)
      const leaves = [path(lowerWingPath, lin(k, lower.map((c) => hex(c)), 50, 53, 50, 84))]
      if (glass) leaves.push(path(lowerWingPath, 'none', rim()))
      leaves.push(path(upperWingPath, lin(k, upper.map((c) => hex(c)), 19, 30, 47, 40), `fill-opacity="${alpha}"`))
      if (glass) leaves.push(path(upperWingPath, 'none', `${rim()} stroke-opacity="${alpha}"`))
      return leaves.map(flip)
    }
    const leaves = [...half(upperLeft, lowerLeft, false), ...half(upperRight, lowerRight, true)]
    return glass ? eachLeaf(drop(k, black(0.32), 2, 1.5), leaves) : leaves.join('')
  }
}

// ================================================================ Passwords

type KeyBit =
  | { kind: 'none' }
  // `inset` cuts the tooth valley back into the blade, the way Apple's
  // middle key does; 0 leaves the valley on the blade's own edge.
  | { kind: 'chevrons'; count: number; from: number; pitch: number; depth: number; inset?: number }
  | { kind: 'block' }
  // A single bite out of the blade's right edge, `from` to `to`.
  | { kind: 'notch'; from: number; to: number; depth: number }
type KeyTip = 'round' | 'point' | 'slant' | 'bevel'

interface KeySpec {
  x: number // bow centre
  y: number
  bow: number // bow diameter
  hole: number // hole diameter
  holeLift?: number // hole centre above the bow centre, share of the bow
  blade: number // blade width
  bladeShift?: number
  bottom: number
  bit: KeyBit
  tip: KeyTip
}

/** A circle of four cubics, clockwise or anticlockwise on screen, starting
 *  at the top (ArrivalsKeyShape.circle). */
function keyCircle(cx: number, cy: number, r: number, clockwise: boolean): string {
  const k = 0.5523 * r
  const pts: Array<[number, number]> = clockwise
    ? [
        [cx, cy - r],
        [cx + r, cy],
        [cx, cy + r],
        [cx - r, cy],
      ]
    : [
        [cx, cy - r],
        [cx - r, cy],
        [cx, cy + r],
        [cx + r, cy],
      ]
  const dir = clockwise ? 1 : -1
  return (
    `M${P(pts[0][0], pts[0][1])} ` +
    `C${P(cx + dir * k, cy - r)} ${P(pts[1][0], cy - k)} ${P(pts[1][0], pts[1][1])} ` +
    `C${P(pts[1][0], cy + k)} ${P(cx + dir * k, cy + r)} ${P(pts[2][0], pts[2][1])} ` +
    `C${P(cx - dir * k, cy + r)} ${P(pts[3][0], cy + k)} ${P(pts[3][0], pts[3][1])} ` +
    `C${P(pts[3][0], cy - k)} ${P(cx - dir * k, cy - r)} ${P(pts[0][0], pts[0][1])} Z `
  )
}

/** ArrivalsKeyShape: a round bow with a hole and a blade with its bit, in
 *  tile fractions. Bow and blade wind the same way so they fill as one; the
 *  hole winds the other way so it stays open. */
function keyPath(o: KeySpec): string {
  const s = 100
  const p = (x: number, y: number) => P(s * x, s * y)
  let d = keyCircle(o.x * s, o.y * s, (o.bow / 2) * s, true)
  if (o.hole > 0) d += keyCircle(o.x * s, (o.y - o.bow * (o.holeLift ?? 0.17)) * s, (o.hole / 2) * s, false)
  const shift = o.bladeShift ?? 0
  const x0 = o.x + shift - o.blade / 2
  const x1 = o.x + shift + o.blade / 2
  const top = o.y + o.bow * 0.3
  d += `M${p(x0, top)} L${p(x1, top)} `
  const bit = o.bit
  if (bit.kind === 'chevrons') {
    const vx = x1 - (bit.inset ?? 0)
    for (let i = 0; i < bit.count; i++) {
      const y0 = bit.from + bit.pitch * i
      d += `L${p(vx, y0)} L${p(x1 + bit.depth, y0 + bit.pitch * 0.45)} L${p(x1 + bit.depth, y0 + bit.pitch * 0.55)} L${p(vx, y0 + bit.pitch)} `
    }
  } else if (bit.kind === 'notch') {
    const span = bit.to - bit.from
    d +=
      `L${p(x1, bit.from)} L${p(x1 - bit.depth, bit.from + span * 0.45)} ` +
      `L${p(x1 - bit.depth, bit.from + span * 0.58)} L${p(x1, bit.to)} `
  } else if (bit.kind === 'block') {
    // One plain rectangle. Measured off Apple's glass icon: it runs from
    // 0.081 to 0.251 below the bow's foot and reaches 0.731 of a blade
    // past the blade's right edge — no second step.
    const b = o.y + o.bow / 2
    d +=
      `L${p(x1, b + 0.081)} L${p(x1 + o.blade * 0.731, b + 0.081)} ` +
      `L${p(x1 + o.blade * 0.731, b + 0.251)} L${p(x1, b + 0.251)} `
  }
  const xc = (x0 + x1) / 2
  const bottom = o.bottom
  if (o.tip === 'round') {
    d += `L${p(x1, bottom - o.blade / 2)} Q${p(x1, bottom)} ${p(xc, bottom)} Q${p(x0, bottom)} ${p(x0, bottom - o.blade / 2)} `
  } else if (o.tip === 'point') {
    // Apple's middle key: the taper starts half a blade above the apex.
    d += `L${p(x1, bottom - o.blade * 0.5)} L${p(xc, bottom)} L${p(x0, bottom - o.blade * 0.5)} `
  } else if (o.tip === 'bevel') {
    // A 'slant' the other way up: the right edge runs off at an angle and
    // the bottom-left corner is the rounded one, as Apple's blue key is.
    d += `L${p(x1, bottom - o.blade * 0.44)} L${p(x0 + o.blade * 0.48, bottom)} Q${p(x0, bottom)} ${p(x0, bottom - o.blade * 0.25)} `
  } else {
    d += `L${p(x1, bottom - o.blade * 0.25)} Q${p(x1, bottom)} ${p(x1 - o.blade * 0.3, bottom)} L${p(x0, bottom - o.blade * 0.75)} `
  }
  return d + 'Z'
}

/** iOS 18 Passwords: three flat keys fanned right, each cut out of the one
 *  behind by a white gap. */
const fannedKeys: Art = (k) => {
  // Measured off the iOS 18 icon: a 0.335 bow with a big hole, a slim 0.065
  // blade offset well to its left, and a tight 0.135 fan so only a crescent
  // of the two keys behind shows.
  const bow = 0.335
  const bowY = 0.3
  const key = (x: number, colours: Pair, bit: KeyBit) => {
    const d = keyPath({ x, y: bowY, bow, hole: 0.1, holeLift: 0.26, blade: 0.065, bladeShift: -0.05, bottom: 0.862, bit, tip: 'slant' })
    return (
      path(d, 'none', stroke('#fff', 4, 'stroke-linejoin="round"')) +
      path(d, lin(k, colours.map((c) => hex(c)), 50, 12, 50, 88)) +
      // The hole shows the white tile, not the key behind.
      circle(x * 100, (bowY - bow * 0.26) * 100, 10, '#fff')
    )
  }
  return (
    key(0.365, [0xffd94a, 0xffbe00], { kind: 'none' }) +
    key(0.5, [0x4cd96c, 0x2ec351], { kind: 'none' }) +
    key(0.635, [0x5cc6f8, 0x0079ff], { kind: 'chevrons', count: 2, from: 0.5, pitch: 0.13, depth: 0.06 })
  )
}

/** iOS 26+ Passwords: three glass keys side by side, bows overlapping.
 *
 *  Every number measured off Apple's own artwork — the iOS 26.5 and iOS 27
 *  runtime icons and the macOS 26 dump all agree to a fifth of a unit:
 *  - the three bows are the SAME circle, 34.03 across, on centres 20.52
 *    apart at u 29.48 / 50.00 / 70.52, so the keys span u 12.5-87.5. The
 *    blue bow only looks the widest because it is drawn last and nothing
 *    crops it; we had three 27-unit bows 18.5 apart spanning u 18-81.
 *  - bow centres sit at v 34.3 (we had 28.5) and the blades end at v 82.7.
 *  - the blades are NOT the same width: 7.71 (yellow), 12.52 (green, whose
 *    zigzag cuts 1.05 back into it and stands 2.4 proud), 10.90 (blue).
 *  `fade` is the key's alpha at v 40, v 55 and the foot: the iOS 26 keys
 *  darken hard down the blade (to 0.62), the iOS 27 ones much less. */
function glassKeys(colours: [number, number, number], bow: number, spacing: number, fade: [number, number, number]): Art {
  return (k) => {
    const first = 0.5 - spacing
    const bowY = 0.343
    const key = (index: number, x: number, blade: number, bottom: number, bit: KeyBit, tip: KeyTip) => {
      const colour = colours[index]
      const d = keyPath({ x, y: bowY, bow, hole: bow * 0.238, holeLift: 0.175, blade, bottom, bit, tip })
      const stops: Stop[] = [
        [hex(colour), 0],
        [hex(colour, fade[0]), 0.364],
        [hex(colour, fade[1]), 0.591],
        [hex(colour, fade[2]), 1],
      ]
      return eachLeaf(drop(k, black(0.35), 2, 1.5), [
        path(d, lin(k, stops, 50, 16, 50, 82)),
        // Specular rim round the bow.
        ring(x * 100, bowY * 100, bow * 100, 0.7, down(k, [white(0.6), white(0)], bowY * 100 - bow * 50, bowY * 100 + bow * 50)),
      ])
    }
    return (
      key(0, first, 0.0771, 0.8275, { kind: 'block' }, 'round') +
      key(1, first + spacing, 0.1252, 0.8344, { kind: 'chevrons', count: 3, from: 0.505, pitch: 0.0875, depth: 0.024, inset: 0.0105 }, 'point') +
      key(2, first + spacing * 2, 0.109, 0.829, { kind: 'notch', from: 0.624, to: 0.713, depth: 0.023 }, 'bevel')
    )
  }
}

// ================================================================ Games

/** ArrivalsHullShape in (x, y, w, h): a pointed nose and a rounded tail. */
function hullPath(x: number, y: number, w: number, h: number): string {
  const p = (px: number, py: number) => P(x + w * px, y + h * py)
  return (
    `M${p(0.5, 0)} Q${p(0.96, 0.1)} ${p(1, 0.42)} L${p(1, 0.88)} Q${p(1, 1)} ${p(0.5, 1)} ` +
    `Q${p(0, 1)} ${p(0, 0.88)} L${p(0, 0.42)} Q${p(0.04, 0.1)} ${p(0.5, 0)} Z`
  )
}

/** ArrivalsFinsShape: both swept fins, about the tile centre. */
function finsPath(): string {
  const p = (x: number, y: number) => P(50 + 100 * x, 50 + 100 * y)
  let d = ''
  for (const side of [1, -1]) {
    d += `M${p(side * 0.11, 0)} Q${p(side * 0.33, 0.12)} ${p(side * 0.235, 0.42)} Q${p(side * 0.19, 0.31)} ${p(side * 0.11, 0.31)} Z `
  }
  return d
}

/** ArrivalsExhaustShape: a round head against the tail and three pointed
 *  tongues trailing away, about the tile centre. */
function exhaustPath(): string {
  // Apple draws the puff clear of the tail, so the head sits at 0.47 down the
  // rocket's axis and the whole shape is scaled with its radius.
  const c = 0.47
  const r = 0.085
  const s = r / 0.075
  const p = (x: number, dy: number) => P(50 + 100 * x * s, 50 + 100 * (c + dy * s))
  const k = 0.5523 * 0.075
  return (
    `M${p(-0.075, 0)} C${p(-0.075, -k)} ${p(-k, -0.075)} ${p(0, -0.075)} C${p(k, -0.075)} ${p(0.075, -k)} ${p(0.075, 0)} ` +
    `Q${p(0.076, 0.05)} ${p(0.06, 0.08)} Q${p(0.04, 0.048)} ${p(0.027, 0.038)} Q${p(0.028, 0.085)} ${p(0, 0.12)} ` +
    `Q${p(-0.028, 0.085)} ${p(-0.027, 0.038)} Q${p(-0.04, 0.048)} ${p(-0.06, 0.08)} Q${p(-0.076, 0.05)} ${p(-0.075, 0)} Z`
  )
}

/** Games: a glass rocket climbing to the upper right. */
function rocketArt(hull: string, porthole: string): Art {
  return (k) => {
    // Apple's hull is slimmer than a third of the tile and its porthole is
    // nearly two thirds of the hull across.
    const hw = 23.5
    const hh = 70
    const hx = 50 - hw / 2
    const hy = 50 - hh / 2
    const hullD = hullPath(hx, hy, hw, hh)
    const noseClip = clip(k, rect(50, hy + (hh * 0.34) / 2, hw, hh * 0.34, '#000'))
    // Every part is shadowed on its own before the turn (see eachLeaf), so
    // the fins' and hull's shadows show through the translucent hull.
    const body = eachLeaf(drop(k, black(0.22), 2, 1.2), [
      path(finsPath(), fade(hull, 0.88)),
      path(hullD, hull),
      // Nose cone light and the porthole.
      path(hullD, white(0.35), `clip-path="${noseClip}"`),
      circle(50, 37, 14, porthole),
      ring(50, 37, 14, 1.2, white(0.9)),
      // Exhaust: a solid glass puff under the tail.
      path(exhaustPath(), fade(hull, 0.7)),
    ])
    return `<g transform="translate(6.7 -8.7) rotate(45 50 50)">${body}</g>`
  }
}

// ================================================================ Preview

/** ArrivalsSkirtShape: the loupe's glass skirt, from under the eyepiece out
 *  to a round foot. */
const skirtPath = 'M29,47 L17,78 Q50,96 83,78 L71,47 Z'

/** iOS 26 Preview: a charcoal loupe on a clear glass skirt, over blue. The
 *  drum is 0.46 of the tile across and the skirt flares wider than it, as on
 *  the iOS render. */
const loupe: Art = (k) =>
  path(skirtPath, down(k, [white(0.18), white(0.38)], 0, 100)) +
  ellipse(50, 77.5, 44, 12, white(0.2)) +
  path(skirtPath, 'none', stroke(white(0.7), 0.9)) +
  // The eyepiece: a dark drum with a lens in its top.
  ellipse(50, 47, 46, 11.5, hex(0x1c1c1e)) +
  rect(50, 22.5 + 12.25, 46, 24.5, lin(k, [hex(0x1e1e20), hex(0x46464a), hex(0x2a2a2c), hex(0x151517)], 27, 0, 73, 0)) +
  text('PREVIEW 10×', 50, 38 + (3.6 * 1.178) / 2, 3.6, { fill: white(0.28), weight: weight.semibold }) +
  ellipse(50, 22.5, 46, 13.5, down(k, [hex(0x5a5a5e), hex(0x28282a)], 15.5, 29.5)) +
  ellipse(50, 22.5, 32, 9, rad(k, [hex(0x8fe3f6), hex(0x2f92c0), hex(0x0e3a55)], 34 + 0.45 * 32, 18 + 0.4 * 9, 15))

/** iOS 27 Preview: a soft pastel picture with a glass loupe over its
 *  lower-right corner. */
const pictureLoupe: Art = (k) => {
  const picture =
    rrect(
      49,
      50,
      70,
      70,
      10,
      down(
        k,
        [
          [hex(0x59b8f9), 0],
          [hex(0x8daaf8), 0.42],
          [hex(0xe0b8f9), 0.66],
          [hex(0xf3c4fa), 0.82],
          [hex(0xffc85e), 1],
        ],
        15,
        85,
      ),
      '',
      true,
    ) +
    // A white wisp across the middle.
    ellipse(44, 52, 46, 16, rad(k, [white(0.7), white(0)], 44, 52, 20), 'transform="rotate(-20 44 52)"')
  // The loupe: a clear disc with a black lens ring, each part shadowed on
  // its own (see eachLeaf).
  const c = 66
  const lens = eachLeaf(drop(k, black(0.2), 2.5, 2), [
    circle(c, c, 52, white(0.28)),
    ring(c, c, 52, 1.2, lin(k, [white(0.95), white(0.35)], 40, 40, 92, 92)),
    circle(c, c, 21, rad(k, [hex(0xe9b6f2), hex(0x9fa6f4)], c, c, 10)),
    ring(c, c, 36, 7.5, down(k, [hex(0x3a3a3c), hex(0x121213)], c - 18, c + 18)),
    ring(c, c, 21.5, 0.8, white(0.75)),
  ])
  return picture + lens
}

// ================================================================ Siri

/** iOS 27's Siri: a chrome sphere in a 0.80 frame, charcoal above a
 *  prism-split horizon and polished silver below it.
 *
 *  Measured off the 1024 pt Siri artwork (com.apple.campo), sphere-local:
 *  - the horizon's white core runs (0.25, 0.453) (0.40, 0.476) (0.50, 0.514)
 *    (0.60, 0.552) (0.75, 0.579) (0.80, 0.570) — it falls left to right the
 *    whole way, it does not crest and it does not lift at the right rim;
 *  - the split is ACROSS the band, not along it: warm (#F9B897) ~3 units
 *    above the core, cyan (#CFF8F9) 1-2 below, blue (#95BEF9) ~4 below;
 *  - the dark cap is LIGHTEST near the middle (#5D5C5F at (0.41, 0.36))
 *    and darkest at the rim (#21242A), not the other way round;
 *  - the silver is a pool, brightest at (0.50, 0.87) at #EDEFF1, falling to
 *    #9FA1A3 out at the left and right rims — not a horizontal band. */
const siriOrb: Art = (k) => {
  const s = 80
  const x0 = 10
  const y0 = 10
  const p = (x: number, y: number) => P(x0 + s * x, y0 + s * y)
  const u = (x: number) => x0 + s * x
  const v = (y: number) => y0 + s * y
  const horizon =
    `M${p(-0.02, 0.42)} C${p(0.14, 0.446)} ${p(0.2, 0.452)} ${p(0.3, 0.456)}` +
    ` C${p(0.42, 0.482)} ${p(0.5, 0.514)} ${p(0.62, 0.558)}` +
    ` C${p(0.72, 0.578)} ${p(0.84, 0.572)} ${p(1.02, 0.578)}`
  const across = (list: Array<Stop | string>) => lin(k, list, x0, 0, x0 + s, 0)
  /** The band, nudged off the core line and softened: a prism fringe. */
  const fringe = (dy: number, colour: string, width: number, alpha: number, soft = 1.1) =>
    `<g filter="${blur(k, soft)}">` +
    path(
      horizon,
      'none',
      stroke(across([[fade(colour, 0), 0.02], [fade(colour, alpha), 0.24], [fade(colour, alpha), 0.9], [fade(colour, 0), 1]]), width, `stroke-linecap="round" transform="translate(0 ${n(dy)})"`),
    ) +
    `</g>`
  const body =
    // The cap: light through the middle, falling to near-black at the rim.
    circle(50, 50, s, rad(k, [hex(0x585a5f), hex(0x3d4045), hex(0x262a30), hex(0x1d2027)], u(0.45), v(0.42), s * 0.62)) +
    // The chrome below the horizon, and the caustic pool it gathers into.
    path(
      `${horizon} L${p(1.02, 1.1)} L${p(-0.02, 1.1)} Z`,
      down(k, [[hex(0x5b5f64), 0.44], [hex(0x7e8288), 0.62], [hex(0x999ca0), 0.8], [hex(0xa9acaf), 1]], y0, y0 + s),
    ) +
    `<g clip-path="${clip(k, path(`${horizon} L${p(1.02, 1.1)} L${p(-0.02, 1.1)} Z`, '#000'))}">` +
    circle(u(0.5), v(0.875), s * 0.82, rad(k, [white(0.74), white(0.36), white(0)], u(0.5), v(0.875), s * 0.41)) +
    `</g>` +
    // The horizon, split across its thickness: warm above, cool below.
    fringe(-s * 0.026, hex(0xf9a985), s * 0.05, 0.95, 1.6) +
    fringe(s * 0.046, hex(0x8fbaf9), s * 0.055, 0.8, 1.9) +
    fringe(s * 0.02, hex(0xbdf4f9), s * 0.038, 0.95, 1.3) +
    fringe(-s * 0.004, hex(0xfff6e4), s * 0.03, 0.8, 1) +
    fringe(0, '#fdfdfd', s * 0.022, 1, 0.55) +
    // The flare where the band runs off the right rim.
    circle(u(0.93), v(0.66), s * 0.38, rad(k, [white(0.85), white(0.3), white(0)], u(0.96), v(0.66), s * 0.19)) +
    ring(50, 50, s, s * 0.015, lin(k, [white(0.5), white(0), black(0.2)], x0, y0, x0 + s, y0 + s))
  return `<g clip-path="${clip(k, circle(50, 50, s, '#000'))}">${body}</g>`
}

// ================================================================ the apps

export const arrivals: HomeAppDef[] = [
  {
    id: 'Wallet',
    names: [
      [era(2012), 'Passbook'],
      [era(2015), 'Wallet'],
    ],
    designs: [
      design(2012, 0x2f2f30, 0x232324, passbookLeather), // sampled
      flat(2013, 0x56b7ef, passbookBands(false)), // sampled
      flat(2014, 0xfb4d43, passbookBands(true)), // sampled
      flat(2015, 0x1e1e1f, walletArt(1, false)), // sampled
      design(2024, 0x303030, 0x151515, walletArt(0.98, false)), // documented
      design(2025, 0x313131, 0x141414, walletArt(0.98, true)), // sampled
      design(2026, 0x1f1e1f, 0x0e0e0e, walletArt(0.98, true, 0.72)), // sampled
    ],
  },
  {
    id: 'Health',
    designs: [
      flat(2014, 0xffffff, heartArt(0xff5894, 0xff2b1f, [0.386, 0.157, 0.456, 0.416], 0.19, false)), // sampled
      flat(2024, 0xffffff, heartArt(0xff5895, 0xff2d29, [0.388, 0.155, 0.454, 0.418], 0.23, false)), // sampled
      design(2025, 0xffffff, 0xececec, heartArt(0xff3298, 0xfe0a1c, [0.388, 0.157, 0.454, 0.421], 0.22, true)), // sampled
      design(2026, 0xfffefe, 0xe8e9e7, heartArt(0xeb3e7f, 0xea3337, [0.388, 0.157, 0.454, 0.421], 0.22, true, 0.42)), // sampled
    ],
  },
  {
    id: 'Books',
    names: [
      [era(2014), 'iBooks'],
      [era(2018), 'Books'],
    ],
    designs: [
      design(2014, 0xffa601, 0xf9681d, openBook(0.016, { outerTop: 0.12, spineTop: 0.1, spineBottom: 1.0, outerBottom: 0.88, hump: 0.62 })), // sampled
      design(2017, 0xfd9e05, 0xfa7219, openBook(0.018, { outerTop: 0.1, spineTop: 0.1, spineBottom: 1.0, outerBottom: 0.9, hump: 0.7 })), // sampled
      design(2021, 0xfea502, 0xf86a1d, openBook(0.045, { outerTop: 0.09, spineTop: 0.09, spineBottom: 0.985, outerBottom: 1.0, hump: 0.85 }, 0.525)), // sampled
      design(2024, 0xffa100, 0xfe5e00, openBook(0.045, { outerTop: 0.09, spineTop: 0.09, spineBottom: 0.985, outerBottom: 1.0, hump: 0.85 }, 0.525)), // sampled
      design(2025, 0xff9606, 0xf8671f, glassBook(0xfbefe6, 0xf6b070)), // sampled
      design(2026, 0xff8a0b, 0xfe7200, glassBook(0xfdf5ec, 0xf7b36a)), // sampled (iOS 27 beta 5 home screen)
    ],
  },
  {
    id: 'News',
    designs: [
      design(2015, 0xff505f, 0xff2e54, newspaper('photo')), // sampled
      design(2016, 0xef4961, 0xef3a5d, newspaper('thickLines')), // sampled
      design(2017, 0xef4961, 0xef3a5d, newspaper('thinLines')), // sampled
      flat(2019, 0xffffff, newsLetter(0.579, 0xfd5163, 0xfd3b5c, false)), // sampled (iOS 13)
      flat(2024, 0xffffff, newsLetter(0.579, 0xfd5163, 0xfd3c5c, false)), // sampled
      design(2025, 0xffffff, 0xececec, newsLetter(0.585, 0xfe5668, 0xfe4666, true)), // sampled
      design(2026, 0xfefefe, 0xf5f4f5, newsLetter(0.585, 0xfb5368, 0xf94051, true, 0.36)), // sampled
    ],
  },
  {
    id: 'Home',
    designs: [
      flat(2016, 0xfffefe, houseArt('rounded')), // sampled
      flat(2024, 0xffffff, houseArt('square')), // sampled
      design(2025, 0xffffff, 0xececec, houseArt('glass')), // sampled
      design(2026, 0xffffff, 0xf4f5f4, houseArt('deepGlass')), // sampled
    ],
  },
  {
    id: 'Files',
    designs: [
      flat(
        2017,
        0xffffff,
        folderArt({
          left: 0.128,
          tabTop: 0.211,
          backTop: 0.261,
          slipTop: 0.306,
          slipBottom: 0.326,
          frontTop: 0.333,
          bottom: 0.789,
          back: [0x19b5f9, 0x1aabf8],
          front: [0x18c0fa, 0x1c7bf2],
          slip: 0xffffff,
          slipInset: 0.012,
          glass: false,
        }),
      ), // sampled
      flat(
        2024,
        0xffffff,
        folderArt({
          left: 0.122,
          tabTop: 0.211,
          backTop: 0.261,
          slipTop: 0.306,
          slipBottom: 0.321,
          frontTop: 0.333,
          bottom: 0.789,
          back: [0x1ab2f9, 0x1aa9f7],
          front: [0x18c1fa, 0x1c7bf3],
          slip: 0xffffff,
          slipInset: 0.012,
          glass: false,
        }),
      ), // sampled
      design(
        2025,
        0xffffff,
        0xececec,
        folderArt({
          left: 0.125,
          tabTop: 0.195,
          backTop: 0.25,
          slipTop: 0.281,
          slipBottom: 0.33,
          frontTop: 0.312,
          bottom: 0.797,
          back: [0x07bbfc, 0x00b3fd],
          front: [0x32c6ff, 0x0179f2],
          slip: 0xf3f5f6,
          slipInset: 0.035,
          glass: true,
        }),
      ), // sampled
      design(
        2026,
        0xfefefe,
        0xf6f5f5,
        folderArt({
          left: 0.125,
          tabTop: 0.195,
          backTop: 0.25,
          slipTop: 0.281,
          slipBottom: 0.33,
          frontTop: 0.312,
          bottom: 0.793,
          back: [0x54c0fe, 0x44a5fd],
          front: [0x4caefe, 0x337cf1],
          slip: 0xe4e4e6,
          slipInset: 0.035,
          glass: true,
        }),
      ), // sampled
    ],
  },
  {
    id: 'Measure',
    designs: [
      flat(2018, 0x19191b, flatRuler(true)), // sampled
      design(2024, 0x303030, 0x151515, flatRuler(false)), // sampled
      design(2025, 0x313131, 0x141414, glassRuler), // sampled
      design(2026, 0x1f1f1f, 0x0f0f0f, glassRuler), // iOS 27 dark-tile trend; no render seen
    ],
  },
  {
    id: 'Shortcuts',
    designs: [
      flat(
        2018,
        0x1e265a,
        diamondsArt(
          [hex(0xf0625a), hex(0xee6080), hex(0xe35faa), hex(0x8c3f9a, 0.8)],
          [hex(0x4dc2a1), hex(0x2f9fd0), hex(0x1f7df1)],
          0.88,
          false,
        ),
      ), // sampled (SVG)
      flat(
        2021,
        0x1c1e5a,
        diamondsArt([hex(0xf45e78), hex(0xf25e90), hex(0xe95db4), hex(0x9e4b8e)], [hex(0x33acb0), hex(0x2a96c8), hex(0x157fe8)], 0.96, false),
      ), // sampled
      design(
        2025,
        0x4a2990,
        0x291b61,
        diamondsArt([hex(0xe66c9c), hex(0xc8537a), hex(0x9b3d78)], [hex(0x483ea1), hex(0x785bb9), hex(0xd48ad2)], 0.9, true),
      ), // sampled
      design(
        2026,
        0x421d8f,
        0x29157a,
        diamondsArt([hex(0xf07fb0), hex(0xc9537d), hex(0x9d3e7f)], [hex(0x4a3eab), hex(0x7a5cbf), hex(0xe28bd4)], 0.88, true, 0.27),
      ), // sampled
    ],
  },
  {
    id: 'Translate',
    designs: [
      flat(2020, 0x1a1a1b, translateArt({ globe: 0x4dafc3, light: 0xffffff, lightInk: 0x1a1a1b, dark: 0x30aec7, darkInk: 0xffffff, spread: false, glass: false })), // sampled
      design(2024, 0x303030, 0x151515, translateArt({ light: 0xffffff, lightInk: 0x1a1a1b, dark: 0x53bbe1, darkInk: 0xffffff, spread: true, glass: false })), // sampled
      design(2025, 0x53d8e1, 0x73abdc, translateArt({ light: 0xfafeff, lightInk: 0x27343a, dark: 0x1c2d34, darkInk: 0xffffff, spread: true, glass: true })), // sampled
      design(2026, 0x81e4ef, 0x76ceee, translateArt({ light: 0xf7fdfe, lightInk: 0x27343a, dark: 0x193035, darkInk: 0xffffff, spread: true, glass: true })), // sampled
    ],
  },
  {
    id: 'Freeform',
    designs: [
      flat(
        2022,
        0xffffff,
        freeformArt({ circle: [hex(0xff9a37), hex(0xfe6361)], square: [hex(0x00dcfd), hex(0x3cbbe5)], squareAlpha: 0.85, stroke: 0x023a5e, squareRadius: 0.07 }),
      ), // sampled
      design(
        2025,
        0xffffff,
        0xececec,
        freeformArt({
          circle: [hex(0xf17445), hex(0xf47d71)],
          square: [hex(0x0cfaff), hex(0x0dbfe8)],
          squareAlpha: 0.88,
          stroke: 0x012b32,
          highlight: 0x2ed6e0,
          squareRadius: 0.12,
        }),
      ), // sampled
      design(
        2026,
        0x265d7b,
        0x153a48,
        freeformArt({
          circle: [hex(0x55b5c8, 0.72), hex(0x2f8397, 0.72)],
          square: [hex(0x62d2e6, 0.62), hex(0x357e92, 0.62)],
          squareAlpha: 1,
          stroke: 0xdffeff,
          squareRadius: 0.12,
          glow: 0x7ff3ff,
        }),
      ), // sampled (iOS 27 render)
    ],
  },
  {
    id: 'Journal',
    designs: [
      flat(2023, 0x212438, butterflyArt([0x7570ad, 0xb47197], [0x7385e4, 0x889bf5], [0xff9794, 0xffd2be], [0xc9505a, 0xff645e], false)), // sampled
      design(2025, 0x303453, 0x202439, butterflyArt([0x8567fe, 0xa75edd], [0x3b5bd8, 0x4468c4], [0xfda79e, 0xfeccb9], [0xd8435f, 0xb03448], true)), // sampled
      design(2026, 0x353854, 0x232538, butterflyArt([0x7051e2, 0x974cb8], [0x3d48f2, 0x5a82f7], [0xf09c87, 0xf2ae96], [0xea4a6c, 0xea554c], true)), // sampled
    ],
  },
  {
    id: 'Passwords',
    designs: [
      flat(2024, 0xffffff, fannedKeys), // sampled
      // Measured off the iOS 26.5 runtime icon, which is what an iPhone
      // actually draws: the tile is #313131 to #141414, the same dark glass
      // gradient Wallet and Measure use that year, and the keys are muted
      // (#F7CE46, #58B95C, #2E80E0) and darken to 0.62 down the blade. The
      // last pass keyed these to the macOS 26 dump instead and came out
      // near-black with a vivid green.
      design(2025, 0x313131, 0x141414, glassKeys([0xf7ce46, 0x58b95c, 0x2e80e0], 0.3403, 0.2052, [0.93, 0.86, 0.62])), // measured
      // iOS 27 ships the same key geometry; its own artwork is brighter and
      // barely darkens (measured #FFDE45, #18CB45, #2B8AF6, foot 0.77). The
      // tile stays on this row's deliberate deeper black, as Measure's does.
      design(2026, 0x1f1f1f, 0x0f0f0f, glassKeys([0xffde45, 0x18cb45, 0x2b8af6], 0.3403, 0.2052, [0.93, 0.79, 0.77])), // measured
    ],
  },
  {
    id: 'Games',
    designs: [
      design(2025, 0xff6645, 0xfe162e, rocketArt(hex(0xffffff, 0.86), hex(0xf4323e))), // sampled
      design(2026, 0xec5847, 0xe93d39, rocketArt(hex(0xfce6e3, 0.94), hex(0xe0453a))), // sampled
    ],
  },
  {
    id: 'Preview',
    designs: [
      design(2025, 0xafcffe, 0x3f7fff, loupe), // sampled (macOS 26 render)
      design(2026, 0xfffeff, 0xe8e8e7, pictureLoupe), // sampled (dock screenshot)
    ],
  },
  {
    id: 'Siri',
    designs: [
      design(2026, 0xffffff, 0xf3f3f4, siriOrb), // sampled (dock screenshot)
    ],
  },
]
