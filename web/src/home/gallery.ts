// ?gallery=<AppId>: one app at every year, 2007-2026, each drawn with that
// year's chrome on a swatch of that year's wallpaper. A checking tool, laid
// out like HomeIconGallery.swift (and its iOS captures): a title, then a
// four-column grid of 96 x 108 pt cells, the icon at the size it has on a
// 375 pt wide screen with its label under it, and the year under each cell.
// A year the app did not sit on the first page (before it shipped, after it
// left, or while it lived in a folder) still draws it — the design nearest
// that year, clamped to the first — faded to GHOST, label and all, with the
// year in tertiary ink: HomeIconGallery.swift's `app.slots[index] == nil`.

import { roster } from './icons/index'
import type { IconDesign } from './icons/kit'
import { artURL, gradientStops, mixInk, rrectPath } from './icons/kit'
import { placeApps } from './model'
import type { HomeApp } from './model'
import { homeTimeline } from './timeline'
import { css, hex, ink } from '../core/ink'
import type { Ink } from '../core/ink'

// ---------------------------------------------------------------- chrome

/** How one year dressed an icon: a small copy of the HomeChrome rows in
 *  HomeErasTimeline.swift that the gallery needs, plus that year's
 *  wallpaper (ScreenLook) for the swatch. */
interface YearChrome {
  year: number
  /** Icon edge as a share of a 375 pt screen. */
  iconScale: number
  /** Corner radius as a share of the edge, and its style. */
  cornerRatio: number
  continuous: boolean
  /** The pre-2013 shine, 0...1. */
  gloss: number
  /** The 2025+ Liquid Glass rim, 0...1. */
  glassRim: number
  shadow?: { colour: string; radius: number; y: number }
  label: { family: string; weight: number; size: number; below: number; shadow: number }
  wall: { top: number; bottom: number; a?: number; b?: number; strength?: number }
}

const helvetica = `Helvetica, 'Helvetica Neue', Arial, sans-serif`
const helveticaNeue = `'Helvetica Neue', Helvetica, Arial, sans-serif`
const sanFrancisco = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif`

/** HomeMetrics.labelSize(year): label font size as a share of screen width. */
function labelSize(year: number): number {
  if (year <= 2012) return 0.0328
  if (year === 2013) return 0.0375
  if (year <= 2021) return 0.032
  if (year <= 2024) return 0.0306
  return 0.03
}

/** HomeMetrics.measured(year).labelBelow: icon bottom to label middle. */
function labelBelow(year: number): number {
  if (year <= 2009) return 0.0313
  if (year <= 2011) return 0.0301
  if (year === 2012) return 0.03
  if (year === 2013) return 0.0339
  if (year <= 2019) return 0.0312
  if (year <= 2021) return 0.0324
  if (year <= 2024) return 0.0306
  return 0.0289
}

/** The wallpaper each year (ScreenLook in HomeErasTimeline.swift): a
 *  top-to-bottom gradient and two soft blooms. */
const walls: Record<number, YearChrome['wall']> = {
  2007: { top: 0x000000, bottom: 0x000000 },
  2008: { top: 0x000000, bottom: 0x000000 },
  2009: { top: 0x000000, bottom: 0x000000 },
  2010: { top: 0x6f8a94, bottom: 0x8c989b, a: 0xc3ccce, b: 0x4f5f66, strength: 0.7 },
  2011: { top: 0x6f8a94, bottom: 0x8c989b, a: 0xc3ccce, b: 0x4f5f66, strength: 0.7 },
  2012: { top: 0x232b32, bottom: 0x111c26, a: 0x2e5c8a, b: 0x0c2140 },
  2013: { top: 0x0b1a3a, bottom: 0x1a3468, a: 0x2c4c8a, b: 0x061024 },
  2014: { top: 0x1f1d29, bottom: 0x8c8496, a: 0x4e4456, b: 0xe4e1ea, strength: 0.85 },
  2015: { top: 0x97bcc8, bottom: 0x4c5c6f, a: 0xb1d7de, b: 0x3e4c68 },
  2016: { top: 0x1b635b, bottom: 0x659075, a: 0xa8c4ad, b: 0x074d44 },
  2017: { top: 0x1c1240, bottom: 0x0a1e4a, a: 0xe8579e, b: 0x2b6bd8 },
  2018: { top: 0x2e3a56, bottom: 0x517889, a: 0xc76474, b: 0x2c3048 },
  2019: { top: 0xdc6224, bottom: 0xb085a7, a: 0xf1953e, b: 0xa62b3d },
  2020: { top: 0xdea857, bottom: 0x93589b, a: 0xd2825c, b: 0x5e5394 },
  2021: { top: 0xcdbe9f, bottom: 0xab9594, a: 0x474e58, b: 0xd7cbb5 },
  2022: { top: 0x1b3a6b, bottom: 0x0e5a6e, a: 0x3fb5c9, b: 0xf2d35b },
  2023: { top: 0x6d0212, bottom: 0x27b2ea, a: 0xfb6a3a, b: 0xcc72e3 },
  2024: { top: 0xc9a6c4, bottom: 0x8fa9d6, a: 0xe08cb0, b: 0x5f8bd0 },
  2025: { top: 0x0b1e4a, bottom: 0x3a0f5c, a: 0x2f8cff, b: 0xff5fa2 },
  2026: { top: 0x3a0a1c, bottom: 0x14060d, a: 0x7a1f3d, b: 0x4a1230 },
}

/** HomeChrome per year: .glossy to 2012, .flat (Helvetica Neue) 2013-2014,
 *  San Francisco from 2015, .glass from 2025. */
function chromeFor(year: number): YearChrome {
  const glossy = year <= 2012
  const glass = year >= 2025
  return {
    year,
    iconScale: glossy ? 57 / 320 : year === 2013 ? 60 / 320 : 60 / 375,
    cornerRatio: glossy ? 0.175 : glass ? 0.27 : 0.2237,
    continuous: !glossy,
    gloss: glossy ? 1 : 0,
    glassRim: glass ? 1 : 0,
    shadow: glossy
      ? { colour: 'rgba(0,0,0,0.4)', radius: 0.6, y: 0.8 }
      : glass
        ? { colour: 'rgba(0,0,0,0.22)', radius: 2.5, y: 1.5 }
        : undefined,
    label: {
      family: glossy ? helvetica : year <= 2014 ? helveticaNeue : sanFrancisco,
      weight: glossy ? 700 : 400,
      size: labelSize(year),
      below: labelBelow(year),
      shadow: glossy ? 0.7 : glass ? 0.35 : 0.55,
    },
    wall: walls[year],
  }
}

const years = Array.from({ length: 20 }, (_, i) => 2007 + i)

// ---------------------------------------------------------------- one cell

const CELL_W = 96
const CELL_H = 108
const SCREEN = 375
let tileCount = 0

/** A top-to-bottom CSS gradient blended like SwiftUI's (Oklab, see
 *  kit.mixInk), as sRGB sub-stops. */
function cssVertical(top: Ink, bottom: Ink, steps = 8): string {
  const list = Array.from({ length: steps + 1 }, (_, j) => `${css(mixInk(top, bottom, j / steps))} ${((j / steps) * 100).toFixed(2)}%`)
  return `linear-gradient(to bottom, ${list.join(', ')})`
}

/** The swatch: EraBackdrop's gradient, with its two blooms (radial
 *  gradients sized off the longer side) under one opacity. A bloom fades
 *  one colour to clear, which CSS already blends premultiplied, as SwiftUI. */
function swatch(w: YearChrome['wall']): string {
  const base = `background:${cssVertical(ink(w.top), ink(w.bottom))}`
  if (w.a === undefined || w.b === undefined) return `<div class="gal-wall" style="${base}"></div>`
  const side = Math.max(CELL_W, CELL_H)
  const bloom = (c: number, r: number, x: number, y: number) =>
    `radial-gradient(circle ${side * r}px at ${CELL_W * x}px ${CELL_H * y}px, ${hex(c)}, ${hex(c, 0)})`
  // The later bloom is drawn on top; CSS lists the top layer first.
  const blooms = `${bloom(w.b, 0.56, 0.88, 0.72)}, ${bloom(w.a, 0.62, 0.18, 0.3)}`
  return `<div class="gal-wall" style="${base}"><div class="gal-wall" style="background:${blooms};opacity:${w.strength ?? 1}"></div></div>`
}

/** HomeGloss: the top of the tile cut off by a shallow downward arc. */
const glossPath = 'M0,0 L100,0 L100,40 Q50,62 0,40 Z'

/** The tile as an inline SVG in the 100 box: background, art, gloss, the
 *  `over` layer, the glass rim, all clipped to the tile shape, with the
 *  tile shadow outside the clip. */
function tile(design: IconDesign, c: YearChrome, edge: number, isWidget: boolean): string {
  tileCount += 1
  const id = `gt${tileCount}`
  const ratio = isWidget ? 0.145 : c.cornerRatio
  const continuous = isWidget ? true : c.continuous
  const shape = rrectPath(50, 50, 100, 100, 100 * ratio, continuous)
  const defs: string[] = [
    `<clipPath id="${id}-clip"><path d="${shape}"/></clipPath>`,
    `<linearGradient id="${id}-bg" x1="0" y1="0" x2="0" y2="1">${gradientStops([css(design.top), css(design.bottom)])}</linearGradient>`,
  ]
  let body = `<rect width="100" height="100" fill="url(#${id}-bg)"/>`
  const imaged = design.imageURL !== undefined
  if (imaged) {
    body += `<image href="${design.imageURL}" width="100" height="100" preserveAspectRatio="xMidYMid slice"/>`
  } else {
    body += `<image href="${artURL(design.art)}" width="100" height="100"/>`
  }
  if (c.gloss > 0.01 && !isWidget && !imaged) {
    defs.push(
      `<linearGradient id="${id}-gl" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100"><stop offset="0" stop-color="#fff" stop-opacity="0.62"/><stop offset="1" stop-color="#fff" stop-opacity="0.16"/></linearGradient>`,
    )
    body += `<path d="${glossPath}" fill="url(#${id}-gl)"${c.gloss < 1 ? ` opacity="${c.gloss}"` : ''}/>`
  }
  if (design.over && !imaged) body += `<image href="${artURL(design.over)}" width="100" height="100"/>`
  if (c.glassRim > 0.01) {
    // strokeBorder: the shape inset by half the line, its radius taken
    // from the inset rect (HomeIconShape.inset), stroked with the line.
    const lw = Math.max((0.8 * 100) / edge, 2.2)
    const inner = 100 - lw
    defs.push(
      `<linearGradient id="${id}-rim" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100"><stop offset="0" stop-color="#fff" stop-opacity="0.85"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.08"/><stop offset="1" stop-color="#fff" stop-opacity="0.45"/></linearGradient>`,
    )
    body += `<path d="${rrectPath(50, 50, inner, inner, inner * ratio, continuous)}" fill="none" stroke="url(#${id}-rim)" stroke-width="${lw}"${c.glassRim < 1 ? ` opacity="${c.glassRim}"` : ''}/>`
  }
  let group = `<g clip-path="url(#${id}-clip)">${body}</g>`
  if (c.shadow) {
    // In the 100 box: pt * 100 / edge. SwiftUI's shadow radius is the
    // Gaussian's standard deviation (measured; see kit.shadow()).
    const u = 100 / edge
    defs.push(
      `<filter id="${id}-sh" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="${c.shadow.y * u}" stdDeviation="${c.shadow.radius * u}" flood-color="${c.shadow.colour}"/></filter>`,
    )
    group = `<g filter="url(#${id}-sh)">${group}</g>`
  }
  return `<svg class="gal-tile" viewBox="0 0 100 100" width="${edge}" height="${edge}" style="left:${CELL_W / 2 - edge / 2}px;top:${CELL_H / 2 - edge / 2}px"><defs>${defs.join('')}</defs>${group}</svg>`
}

function nameAt(app: HomeApp, index: number): string {
  const names = app.names
  let name = names[0]?.[1] ?? app.id
  for (const [from, n] of names) if (from <= index) name = n
  return name
}

/** HomeApp.designIndex(at:): the last redesign that has landed by this year,
 *  falling back to the first — so a year before the app shipped shows the
 *  design it arrived with (faded), never nothing. */
function designAt(app: HomeApp, index: number): IconDesign {
  let found = app.designs[0]
  for (const d of app.designs) if (d.from <= index) found = d
  return found
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function cell(app: HomeApp, year: number): string {
  const c = chromeFor(year)
  const index = year - 2007
  const design = designAt(app, index)
  // Off the first page that year: the icon is there, only faded.
  const ghost = app.slots[index] == null
  const edge = SCREEN * c.iconScale
  const labelY = CELL_H / 2 + edge / 2 + SCREEN * c.label.below
  const font = `${c.label.weight} ${SCREEN * c.label.size}px ${c.label.family}`
  // Tile and label sit under one opacity, as SwiftUI fades the whole
  // HomeIcon; the wallpaper behind it stays at full strength.
  const icon =
    tile(design, c, edge, app.span > 1) +
    `<div class="gal-label" style="top:${labelY}px;font:${font};text-shadow:0 0.8px 2.6px rgba(0,0,0,${c.label.shadow})">${esc(nameAt(app, index))}</div>`
  const inner = swatch(c.wall) + `<div class="gal-icon"${ghost ? ' style="opacity:0.35"' : ''}>${icon}</div>`
  const clip = rrectPath(CELL_W / 2, CELL_H / 2, CELL_W, CELL_H, 10, true)
  return `<div class="gal-cell${ghost ? ' gal-ghost' : ''}" data-year="${year}"><div class="gal-swatch" style="clip-path:path('${clip}')">${inner}</div><div class="gal-year">${year}</div></div>`
}

// ---------------------------------------------------------------- page

const style = `
html, body { margin: 0; background: #f5f5f5; }
.gal { box-sizing: border-box; max-width: 440px; margin: 0 auto; padding: 70px 12px 40px;
  font-family: ${sanFrancisco}; color: #000; -webkit-font-smoothing: antialiased; }
.gal h1 { margin: 0 0 12px; font-size: 22px; line-height: 26.333px; font-weight: 600; text-align: center; }
.gal-grid { display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 10px; row-gap: 12px; justify-items: center; }
.gal-cell { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.gal-swatch { position: relative; width: ${CELL_W}px; height: ${CELL_H}px; overflow: hidden; }
.gal-wall { position: absolute; inset: 0; }
.gal-icon { position: absolute; inset: 0; }
.gal-tile { position: absolute; overflow: visible; }
.gal-label { position: absolute; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; color: #fff; line-height: normal; }
.gal-year { font-size: 11px; line-height: 13.333px; font-variant-numeric: tabular-nums; color: rgba(60,60,67,0.6); }
/* A ghost year's number drops from .secondary to .tertiary. */
.gal-ghost .gal-year { color: rgba(60,60,67,0.3); }
.gal-missing { text-align: center; color: rgba(60,60,67,0.6); font-size: 15px; line-height: 1.5; }
.gal-missing a { color: #007aff; text-decoration: none; margin: 0 6px; display: inline-block; }
`

export function mountGallery(root: HTMLElement, appID: string): void {
  const tag = document.createElement('style')
  tag.textContent = style
  document.head.appendChild(tag)
  document.title = `${appID} · iOS Eras gallery`

  // Placed on every era, so each cell knows whether the app sat on that
  // year's first page (full strength) or not (ghost).
  const app = placeApps(roster, homeTimeline).find((a) => a.id === appID)
  if (!app) {
    const links = roster.map((a) => `<a href="?gallery=${encodeURIComponent(a.id)}">${esc(a.id)}</a>`).join(' ')
    root.innerHTML = `<div class="gal"><h1>${esc(appID)}</h1><p class="gal-missing">No app with that id.${links ? `<br>${links}` : ''}</p></div>`
    return
  }
  root.innerHTML = `<div class="gal"><h1>${esc(app.id)}</h1><div class="gal-grid">${years.map((y) => cell(app, y)).join('')}</div></div>`
}
