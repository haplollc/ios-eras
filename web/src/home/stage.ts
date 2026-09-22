// Draws the home screen at one moment on the timeline (HomeErasStage.swift).
// Every icon is placed by blending where it sat in the version before with
// where it sits in the version after, so a new row of apps pushes the old
// ones along instead of the grid cutting from one layout to the next.
//
// Everything is built once. render(position) only writes the transforms,
// sizes, opacities and backgrounds that changed since the last frame.

import type { Ink } from '../core/ink'
import { blendInk, css as cssInk, lerp } from '../core/ink'
import { blendDevice, blendScreen, fontCSS, segment } from '../core/looks'
import { EraBackdrop, EraDevice, EraStatusBar, shadowBlur } from '../core/device'
import { attr, css, h, linearGradient, n, px, s, text, uid } from '../core/dom'
import { artURL, artURLAt, symbol } from './icons/kit'
import type { IconDesign } from './icons/kit'
import type { HomeApp, HomeChrome, HomeEra, Point, Rect } from './model'
import { HomeLayout, appName, blendChrome, blendPoint, blendRect, designIndex } from './model'

const c = cssInk

/** SwiftUI's .ultraThinMaterial, light: a heavy blur, slightly desaturated,
 *  under a 36% wash of near-white. Fitted to the iOS renders' docks over
 *  three different wallpapers (rms error 1.5 / 255). */
export const MATERIAL_FILTER = 'blur(20px) saturate(0.85)'
export const MATERIAL_WASH = 'rgba(245,245,245,0.36)'

function material(el: HTMLElement): void {
  el.style.setProperty('backdrop-filter', MATERIAL_FILTER)
  el.style.setProperty('-webkit-backdrop-filter', MATERIAL_FILTER)
}

// ---------------------------------------------------------------- shared art

let glossURL: string | null = null
/** The shine: the top of the icon, cut off by a shallow downward arc,
 *  filled white 62% to 16% over the whole tile's height. */
function glossImage(): string {
  if (glossURL) return glossURL
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" preserveAspectRatio="none">` +
    `<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="0.62"/><stop offset="1" stop-color="#fff" stop-opacity="0.16"/>` +
    `</linearGradient></defs><path d="M0 0H100V40Q50 62 0 40Z" fill="url(#g)"/></svg>`
  glossURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  return glossURL
}

/** The magnifier glyph as an inline SVG filling its box. */
function magnifier(parent: HTMLElement): SVGSVGElement {
  const el = s('svg', { viewBox: '0 0 100 100', 'aria-hidden': 'true' }, parent)
  el.style.cssText = 'display:block;overflow:visible;flex:none'
  el.innerHTML = symbol('magnifyingglass', 'currentColor', 100, 50, 50)
  return el
}

const artSource = (d: IconDesign): string => d.imageURL ?? artURL(d.art)

/** The scale the SwiftUI app draws at, CSS px (there, points) per mm of
 *  iPhone. Its art clamps hairlines in points, so a view at another scale
 *  divides by this to ask for the art at the size iOS would be drawing. */
const IOS_SCALE = 4.3

/** The apps whose SwiftUI art clamps its hairlines — `max(0.5, edge * f)`
 *  on a rule, a rim, a tick, a crosshair — so that however small the icon
 *  is drawn those lines stay half a point wide. Their miniatures in a
 *  folder ask for art rendered with the same floor; see "hairlines" in
 *  kit.ts. Every other app's thin lines are plain fractions of the edge,
 *  and Measure's ruler ticks, the Watch's band and a Voice Memos waveform
 *  really do fade to nothing on the phone at 8 pt, so those miniatures use
 *  the ordinary full-size drawing.
 *
 *  The list is read off HomeIcons+*.swift, struct by struct: an app is in
 *  it when the art it uses in the folder years clamps. Put an app here
 *  only after checking its Swift, and after looking at the miniature: the
 *  floor cannot tell a clamped line from an unclamped one of the same
 *  width, so it is the app that says whether to apply it. */
const HAIRLINE_CLAMPED = new Set([
  'Calculator', // PaperCalcKeys, PaperFlatCalculator
  'Clock', // MediaClockArt
  'Compass', // PaperBrassCompass, PaperDialCompass
  'Notes', // PaperLegalPad, PaperFlatPad
  'Reminders', // PaperReminderRows, PaperReminderCard
  'Settings', // PaperGearHub, PaperGearPlate
  'Stocks', // PaperStocksSky, PaperStocksChart
])

// ---------------------------------------------------------------- one icon

export interface HomeIconState {
  lower: number
  upper: number
  t: number
  chrome: HomeChrome
  /** The tile's edge in CSS px. */
  edge: number
  /** The screen's width in CSS px (labels are sized from it). */
  width: number
  docked: boolean
  /** For the folder: the apps inside it, drawn as mini icons. */
  contents?: HomeApp[] | null
  yearIndex?: number
  /** CSS px per mm of iPhone, for the folder's hairline floor. Left out,
   *  the view is taken to be drawn at the iOS scale. */
  scale?: number
}

/** Images keyed by URL, each created once and afterwards only shown,
 *  hidden, scaled and faded. Swapping an <img>'s src to a large data URL
 *  is synchronous work; doing it for every icon at every year boundary of
 *  a scrub dropped frames on phones. */
class ImageSet {
  private imgs = new Map<string, HTMLImageElement>()
  private shown = new Set<HTMLImageElement>()
  private next = new Set<HTMLImageElement>()

  constructor(private readonly box: HTMLElement) {}

  /** Starts a frame: everything not shown again by show() is hidden at end(). */
  begin(): void {
    this.next.clear()
  }

  /** The image for a URL, created hidden if new. */
  ensure(url: string): HTMLImageElement {
    let img = this.imgs.get(url)
    if (!img) {
      img = document.createElement('img')
      img.className = 'hi-art'
      img.alt = ''
      img.decoding = 'async'
      img.draggable = false
      css(img, 'display', 'none')
      img.src = url
      this.box.appendChild(img)
      this.imgs.set(url, img)
      // Decode now rather than on the frame that first shows it: the first
      // pull of a scrub reveals two dozen icons at once.
      img.decode?.().catch(() => {
        /* replaced before it decoded */
      })
    }
    return img
  }

  show(url: string, scale: number, opacity: number, z: number): void {
    const img = this.ensure(url)
    css(img, 'display', 'block')
    css(img, 'transform', scale === 1 ? 'none' : `scale(${n(scale)})`)
    css(img, 'opacity', n(opacity))
    css(img, 'z-index', String(z))
    this.next.add(img)
  }

  end(): void {
    for (const img of this.shown) if (!this.next.has(img)) css(img, 'display', 'none')
    const t = this.shown
    this.shown = this.next
    this.next = t
  }
}

/** One app's icon (HomeIcon): the tile, its artwork cross-fading between
 *  redesigns, the pre-2013 gloss, the Liquid Glass rim, the label.
 *  Positioned by its owner; `el` is edge x edge with the label hanging below.
 *  Usable on its own (the icon gallery). */
export class HomeIconView {
  readonly el: HTMLDivElement
  private tile: HTMLDivElement
  private arts: ImageSet
  private artsBox: HTMLDivElement
  private gloss: HTMLImageElement
  private overs: ImageSet
  private oversBox: HTMLDivElement
  private rim: HTMLDivElement
  private label: HTMLDivElement
  private folder?: HomeFolderTile

  constructor(readonly app: HomeApp) {
    this.el = h('div', 'hi')
    this.tile = h('div', 'hi-tile', {}, this.el)
    this.artsBox = h('div', 'hi-layer', {}, this.tile)
    this.arts = new ImageSet(this.artsBox)
    this.gloss = h('img', 'hi-gloss', {}, this.tile)
    this.gloss.alt = ''
    this.gloss.src = glossImage()
    this.oversBox = h('div', 'hi-layer', {}, this.tile)
    this.overs = new ImageSet(this.oversBox)
    this.rim = h('div', 'hi-rim', {}, this.tile)
    this.label = h('div', 'hi-label', {}, this.el)
  }

  /** Builds every design's images ahead of time, so the first scrub past a
   *  redesign does not pay for it. */
  prewarm(): void {
    for (const d of this.app.designs) {
      this.arts.ensure(artSource(d))
      if (d.over && !d.imageURL) this.overs.ensure(artURL(d.over))
    }
  }

  update(st: HomeIconState): void {
    const { app } = this
    const { chrome, edge, width, docked, t } = st
    const m = chrome.metrics
    const contents = st.contents ?? null

    css(this.el, 'width', px(edge))
    css(this.el, 'height', px(edge))

    const indexA = designIndex(app, st.lower)
    const indexB = designIndex(app, st.upper)
    const dA = app.designs[indexA]
    const dB = app.designs[indexB]
    const mix = indexA === indexB ? 0 : t
    const isWidget = app.span > 1
    // A small widget keeps its own, shallower corner (22 pt on 155 pt).
    const cornerRatio = isWidget ? 0.145 : chrome.cornerRatio

    const tile = this.tile
    css(tile, 'border-radius', px(edge * cornerRatio))
    css(tile, 'background', linearGradient('180deg', c(blendInk(dA.top, dB.top, mix)), c(blendInk(dA.bottom, dB.bottom, mix))))
    const sh = chrome.iconShadow
    css(tile, 'box-shadow', sh.a > 0.001 ? `0 ${px(chrome.iconShadowY)} ${px(shadowBlur(chrome.iconShadowRadius))} ${c(sh)}` : 'none')

    this.arts.begin()
    this.overs.begin()
    if (contents) {
      if (!this.folder) this.folder = new HomeFolderTile(tile, this.gloss)
      this.folder.update(contents, st.yearIndex ?? st.lower, chrome, edge, st.scale ?? IOS_SCALE)
    } else {
      if (this.folder) this.folder.hide()
      // The old artwork sinks back as the new one comes forward.
      this.arts.show(artSource(dA), dA.imageURL ? 1 : 1 - 0.12 * mix, 1 - mix, 1)
      if (mix > 0) this.arts.show(artSource(dB), dB.imageURL ? 1 : 0.88 + 0.12 * mix, mix, 2)
      // Art that belongs above the gloss.
      if (dA.over && !dA.imageURL) this.overs.show(artURL(dA.over), 1 - 0.12 * mix, 1 - mix, 1)
      if (mix > 0 && dB.over && !dB.imageURL) this.overs.show(artURL(dB.over), 0.88 + 0.12 * mix, mix, 2)
    }
    this.arts.end()
    this.overs.end()

    const imaged = (mix < 0.5 ? dA : dB).imageURL !== undefined
    if (chrome.gloss > 0.01 && !isWidget && !imaged && !contents) {
      css(this.gloss, 'display', 'block')
      css(this.gloss, 'opacity', n(chrome.gloss))
    } else {
      css(this.gloss, 'display', 'none')
    }

    if (chrome.glassRim > 0.01) {
      css(this.rim, 'display', 'block')
      css(this.rim, 'padding', px(Math.max(0.8, edge * 0.022)))
      css(this.rim, 'opacity', n(chrome.glassRim))
    } else {
      css(this.rim, 'display', 'none')
    }

    // The label hangs below the tile at the measured distance; the metal
    // tray's labels sat in a strip at the foot of the dock.
    const labelOffset = docked && m.dockLabelFromBottom > 0.001
      ? width * (m.dockIconFromBottom - m.dockLabelFromBottom)
      : edge / 2 + width * m.labelBelow
    const label = this.label
    text(label, appName(app, t < 0.5 ? st.lower : st.upper))
    css(label, 'font', fontCSS(chrome.typeface, chrome.labelWeight, chrome.labelSize * width))
    css(label, 'color', c(chrome.label))
    css(label, 'text-shadow', `0 0.8px ${shadowBlur(1.3)}px ${c(chrome.labelShadow)}`)
    css(label, 'transform', `translate(-50%, -50%) translateY(${px(labelOffset)})`)
    const labelOpacity = docked ? m.dockLabels : 1
    css(label, 'opacity', n(labelOpacity))
    css(label, 'visibility', labelOpacity < 0.005 ? 'hidden' : 'visible')
  }
}

// ---------------------------------------------------------------- folder

/** Apple's default folder: a translucent tile holding up to nine tiny
 *  icons. Dark linen-glass in the glossy years, frosted from iOS 7. */
class HomeFolderTile {
  private root: HTMLDivElement
  private frost: HTMLDivElement
  private edgeEl: HTMLDivElement
  private minis: Array<{ el: HTMLDivElement; arts: ImageSet }> = []

  constructor(tile: HTMLDivElement, before: Element) {
    this.root = h('div', 'hf')
    tile.insertBefore(this.root, before)
    this.frost = h('div', 'hf-frost', {}, this.root)
    material(this.frost)
    this.edgeEl = h('div', 'hf-edge', {}, this.root)
    for (let i = 0; i < 9; i++) {
      const el = h('div', 'hf-mini', {}, this.root)
      this.minis.push({ el, arts: new ImageSet(el) })
    }
  }

  hide(): void {
    css(this.root, 'display', 'none')
  }

  update(contents: HomeApp[], yearIndex: number, chrome: HomeChrome, edge: number, scale: number): void {
    css(this.root, 'display', 'block')
    const skeuo = chrome.gloss > 0.5
    const mini = edge * (skeuo ? 0.21 : 0.2)
    // What this miniature measures on the iPhone itself, in points: the
    // size the Swift art's `max(0.5, edge * f)` clamps were written for.
    const miniPt = mini * (IOS_SCALE / (scale > 0 ? scale : IOS_SCALE))
    const gap = edge * (skeuo ? 0.07 : 0.055)
    if (skeuo) {
      css(this.frost, 'display', 'none')
      css(this.root, 'background', 'rgb(61,61,61)')
      css(this.edgeEl, 'display', 'block')
      // Padding, not a border: Chrome snaps border widths to whole CSS
      // pixels, which made the folder's bevel a third too thin.
      css(this.edgeEl, 'padding', px(Math.max(0.8, edge * 0.07)))
    } else {
      css(this.root, 'background', 'transparent')
      css(this.frost, 'display', 'block')
      css(this.edgeEl, 'display', 'none')
    }
    const block = mini * 3 + gap * 2
    const x0 = (edge - block) / 2
    const y0 = (edge - block) / 2
    this.minis.forEach((m, index) => {
      const app = contents[index]
      m.arts.begin()
      if (!app) {
        css(m.el, 'display', 'none')
        m.arts.end()
        return
      }
      const d = app.designs[designIndex(app, yearIndex)]
      const row = Math.floor(index / 3)
      const col = index % 3
      css(m.el, 'display', 'block')
      css(m.el, 'left', px(x0 + col * (mini + gap)))
      css(m.el, 'top', px(y0 + row * (mini + gap)))
      css(m.el, 'width', px(mini))
      css(m.el, 'height', px(mini))
      css(m.el, 'border-radius', px(mini * chrome.cornerRatio))
      css(m.el, 'background', linearGradient('180deg', c(d.top), c(d.bottom)))
      const small = HAIRLINE_CLAMPED.has(app.id) ? miniPt : 0
      m.arts.show(d.imageURL ?? artURLAt(d.art, small), 1, 1, 1)
      if (d.over && !d.imageURL) m.arts.show(artURLAt(d.over, small), 1, 1, 2)
      m.arts.end()
    })
  }
}

// ---------------------------------------------------------------- dock

class HomeDock {
  readonly el: HTMLDivElement
  private shelf: HTMLDivElement
  private tray: HTMLDivElement
  private strip: HTMLDivElement
  private glass: HTMLDivElement
  private face: HTMLDivElement
  private lip: HTMLDivElement
  private panel: HTMLDivElement

  constructor(parent: HTMLElement) {
    this.el = h('div', 'hd', {}, parent)
    // 2007: a perforated metal tray that lightens toward the foot, over a
    // flat grey strip the labels sit in.
    this.shelf = h('div', 'hd-shelf', {}, this.el)
    this.tray = h('div', 'hd-tray', {}, this.shelf)
    this.tray.style.background =
      'repeating-linear-gradient(180deg, transparent 0 1.5px, rgba(0,0,0,0.16) 1.5px 2.1px, transparent 2.1px 2.4px), ' +
      linearGradient('180deg', 'rgb(77,77,77)', 'rgb(161,161,161)')
    this.strip = h('div', 'hd-strip', {}, this.shelf)
    // iOS 4-6: a pale glass shelf in perspective.
    this.glass = h('div', 'hd-glass', {}, this.el)
    const svg = s('svg', { viewBox: '0 0 100 100', preserveAspectRatio: 'none' }, this.glass)
    svg.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible'
    const gid = uid('shelfmask')
    const lid = uid('shelfgrad')
    const trapezoid = 'M3 0H97L100 100H0Z'
    svg.innerHTML =
      `<defs><linearGradient id="${lid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
      `<mask id="${gid}" maskUnits="userSpaceOnUse" x="-5" y="-5" width="110" height="110"><rect x="-5" y="-5" width="110" height="110" fill="url(#${lid})"/></mask></defs>` +
      `<path d="${trapezoid}" fill="rgba(255,255,255,0.32)"/>` +
      `<path d="${trapezoid}" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="0.7" vector-effect="non-scaling-stroke" mask="url(#${gid})"/>`
    this.face = h('div', 'hd-face', {}, this.glass)
    this.lip = h('div', 'hd-lip', {}, this.glass)
    // iOS 7 on: a frosted panel.
    this.panel = h('div', 'hd-panel', {}, this.el)
    material(this.panel)
  }

  update(chrome: HomeChrome, frame: Rect, cornerRadius: number): void {
    const el = this.el
    css(el, 'left', px(frame.x))
    css(el, 'top', px(frame.y))
    css(el, 'width', px(frame.width))
    css(el, 'height', px(frame.height))

    if (chrome.dockShelf > 0.01) {
      const strip = Math.min(frame.height * 0.2, frame.width * 0.047)
      css(this.shelf, 'display', 'flex')
      css(this.shelf, 'opacity', n(chrome.dockShelf))
      css(this.strip, 'height', px(strip))
    } else {
      css(this.shelf, 'display', 'none')
    }

    if (chrome.dockGlassShelf > 0.01) {
      css(this.glass, 'display', 'block')
      css(this.glass, 'opacity', n(chrome.dockGlassShelf))
      const face = frame.width * 0.063
      const lip = frame.width * 0.012
      css(this.face, 'height', px(face))
      css(this.face, 'bottom', px(lip))
      css(this.lip, 'height', px(lip))
    } else {
      css(this.glass, 'display', 'none')
    }

    if (chrome.dockPanel > 0.01) {
      css(this.panel, 'display', 'block')
      css(this.panel, 'opacity', n(chrome.dockPanel))
      css(this.panel, 'border-radius', px(cornerRadius))
      css(this.panel, 'background', `linear-gradient(${c(chrome.dockTint)}, ${c(chrome.dockTint)}), ${MATERIAL_WASH}`)
    } else {
      css(this.panel, 'display', 'none')
    }
  }
}

// ---------------------------------------------------------------- dots

/** Dots, with the Spotlight magnifier beside them in the early years, that
 *  swell into iOS 16's frosted Search pill. */
class HomePageIndicator {
  readonly el: HTMLDivElement
  // The dots row is one SVG: tiny rounded boxes get pixel-snapped out of
  // round, circles do not.
  private row: SVGSVGElement
  private mag: SVGGElement
  private magRing: SVGCircleElement
  private magHandle: SVGLineElement
  private dots: SVGCircleElement[] = []
  private pill: HTMLDivElement
  private pillGlyph: SVGSVGElement
  private pillText: HTMLSpanElement

  constructor(parent: HTMLElement) {
    this.el = h('div', 'hp', {}, parent)
    this.el.setAttribute('aria-hidden', 'true')
    this.row = s('svg', { class: 'hp-row' }, this.el)
    // The Spotlight magnifier, heavy: a thick ring and a stubby handle.
    this.mag = s('g', { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round' }, this.row)
    this.magRing = s('circle', {}, this.mag)
    this.magHandle = s('line', {}, this.mag)
    for (let i = 0; i < 6; i++) this.dots.push(s('circle', {}, this.row))
    this.pill = h('div', 'hp-pill', {}, this.el)
    material(this.pill)
    this.pillGlyph = magnifier(this.pill)
    this.pillText = h('span', 'hp-text', {}, this.pill)
    this.pillText.textContent = 'Search'
  }

  update(chrome: HomeChrome, width: number, y: number): void {
    css(this.el, 'top', px(y))
    css(this.el, 'width', px(width))
    const inkC = chrome.pageDots
    const m = chrome.metrics
    const dot = width * m.dotSize
    const gap = Math.max(0, width * (m.dotPitch - m.dotSize))
    const count = Math.round(m.dotCount)
    const current = Math.round(m.activeDot)

    if (chrome.searchPill < 0.999) {
      // HStack(spacing: gap): [magnifier (frame width: dot)] dot dot ...,
      // the whole row centred.
      const hasMag = chrome.spotlightGlyph > 0.01
      const items = count + (hasMag ? 1 : 0)
      const g = dot * 1.1
      const rowW = Math.max(0, items * dot + (items - 1) * gap)
      const rowH = Math.max(dot, hasMag ? g : 0)
      const row = this.row as unknown as HTMLElement
      css(row, 'display', 'block')
      css(row, 'opacity', n(1 - chrome.searchPill))
      css(row, 'width', px(Math.max(rowW, 0.01)))
      css(row, 'height', px(Math.max(rowH, 0.01)))
      css(row, 'left', px(width / 2 - rowW / 2))
      css(row, 'top', px(-rowH / 2))
      let x = 0
      if (hasMag) {
        const cx = dot / 2
        const cy = rowH / 2
        attr(this.mag, 'display', 'inline')
        attr(this.mag, 'stroke', c(inkC, 0.4 * chrome.spotlightGlyph))
        attr(this.magRing, 'cx', n(cx - g * 0.09))
        attr(this.magRing, 'cy', n(cy - g * 0.09))
        attr(this.magRing, 'r', n(g * 0.31))
        attr(this.magRing, 'stroke-width', n(g * 0.18))
        attr(this.magHandle, 'x1', n(cx + g * 0.16))
        attr(this.magHandle, 'y1', n(cy + g * 0.16))
        attr(this.magHandle, 'x2', n(cx + g * 0.4))
        attr(this.magHandle, 'y2', n(cy + g * 0.4))
        attr(this.magHandle, 'stroke-width', n(g * 0.2))
        x += dot + gap
      } else {
        attr(this.mag, 'display', 'none')
      }
      this.dots.forEach((d, i) => {
        if (i >= count) {
          attr(d, 'display', 'none')
          return
        }
        attr(d, 'display', 'inline')
        attr(d, 'cx', n(x + dot / 2))
        attr(d, 'cy', n(rowH / 2))
        attr(d, 'r', n(dot / 2))
        attr(d, 'fill', i === current ? c(inkC) : c(inkC, 0.35))
        x += dot + gap
      })
    } else {
      css(this.row as unknown as HTMLElement, 'display', 'none')
    }

    if (chrome.searchPill > 0.001) {
      const pt = width * m.pillText
      css(this.pill, 'display', 'flex')
      css(this.pill, 'width', px(Math.max(1, width * m.pillWidth)))
      css(this.pill, 'height', px(Math.max(1, width * m.pillHeight)))
      css(this.pill, 'gap', px(pt * 0.28))
      css(this.pill, 'color', c(inkC))
      css(this.pill, 'background', `linear-gradient(${c(inkC, 0.18)}, ${c(inkC, 0.18)}), ${MATERIAL_WASH}`)
      css(this.pill, 'transform', `translate(-50%, -50%) scale(${n(0.6 + 0.4 * chrome.searchPill)})`)
      css(this.pill, 'opacity', n(chrome.searchPill))
      css(this.pillGlyph as unknown as HTMLElement, 'width', px(pt * 0.68))
      css(this.pillGlyph as unknown as HTMLElement, 'height', px(pt * 0.68))
      css(this.pillText, 'font', `600 ${px(pt)} system-ui, -apple-system, BlinkMacSystemFont, sans-serif`)
    } else {
      css(this.pill, 'display', 'none')
    }
  }
}

// ---------------------------------------------------------------- stage

export interface HomeStageOptions {
  /** CSS px per millimetre of iPhone. */
  scale?: number
  /** Only the screen: no body, no bezel. */
  screenOnly?: boolean
}

/** The folder app whose tile is drawn from its contents. */
export const FOLDER_ID = 'Utilities'

/** The whole home screen on its iPhone at one position on the timeline. */
export class HomeErasStage {
  readonly el: HTMLDivElement
  readonly device: EraDevice
  private backdrop: EraBackdrop
  private layer: HTMLDivElement
  private dock: HomeDock
  private icons: Array<{ app: HomeApp; view: HomeIconView; shown: boolean }>
  private indicator: HomePageIndicator
  private status: EraStatusBar
  private byID: Map<string, HomeApp>
  position = 0

  constructor(
    readonly eras: HomeEra[],
    readonly apps: HomeApp[],
    opts: HomeStageOptions = {},
    readonly folderID = FOLDER_ID,
  ) {
    this.device = new EraDevice({ scale: opts.scale, screenOnly: opts.screenOnly })
    this.el = this.device.el
    this.el.classList.add('home-stage')
    const content = this.device.content
    this.backdrop = new EraBackdrop()
    content.appendChild(this.backdrop.el)
    this.layer = h('div', 'home-layer', {}, content)
    this.dock = new HomeDock(this.layer)
    this.icons = apps.map((app) => {
      const view = new HomeIconView(app)
      view.el.style.display = 'none'
      this.layer.appendChild(view.el)
      return { app, view, shown: false }
    })
    this.indicator = new HomePageIndicator(this.layer)
    this.status = new EraStatusBar()
    content.appendChild(this.status.el)
    this.byID = new Map(apps.map((a) => [a.id, a]))
  }

  /** The tallest iPhone on the timeline, in mm: it sets the stage's row. */
  static tallest(eras: HomeEra[]): number {
    return Math.max(...eras.map((e) => e.hardware.bodyHeight))
  }

  /** Pre-builds every icon's artwork in idle time, one app per slice. */
  prewarm(): void {
    const queue = this.icons.map((i) => i.view)
    const idle: (cb: () => void) => void = 'requestIdleCallback' in window
      ? (cb) => (window as Window & { requestIdleCallback: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback(cb, { timeout: 400 })
      : (cb) => setTimeout(cb, 16)
    const step = () => {
      const view = queue.shift()
      if (!view) return
      view.prewarm()
      idle(step)
    }
    idle(step)
  }

  setScale(scale: number): void {
    this.device.scale = scale
    this.render(this.position)
  }

  render(position: number): void {
    this.position = position
    const { eras } = this
    const { lower, upper, t } = segment(position, eras.length)
    const eA = eras[lower]
    const eB = eras[upper]
    const hardware = blendDevice(eA.hardware, eB.hardware, t)
    const screen = blendScreen(eA.screen, eB.screen, t)
    const chrome = blendChrome(eA.chrome, eB.chrome, t)

    const frame = this.device.update(hardware)
    const W = frame.screenWidth
    const H = frame.screenHeight
    this.backdrop.update(screen, W, H)

    const layoutA = new HomeLayout(eA.chrome.metrics, W, H)
    const layoutB = new HomeLayout(eB.chrome.metrics, W, H)
    const edge = W * chrome.metrics.iconSize
    const dockEdge = W * chrome.metrics.dockIconSize

    this.dock.update(chrome, blendRect(layoutA.dockFrame, layoutB.dockFrame, t), lerp(layoutA.dockCornerRadius, layoutB.dockCornerRadius, t))

    const near = t < 0.5 ? lower : upper
    for (const entry of this.icons) {
      const { app, view } = entry
      const slotA = app.slots[lower]
      const slotB = app.slots[upper]
      if (!slotA && !slotB) {
        if (entry.shown) {
          view.el.style.display = 'none'
          entry.shown = false
        }
        continue
      }
      if (!entry.shown) {
        view.el.style.display = 'block'
        entry.shown = true
      }
      const sA = (slotA ?? slotB)!
      const sB = (slotB ?? slotA)!
      const pointA: Point = layoutA.centre(sA, app.span)
      const pointB: Point = layoutB.centre(sB, app.span)
      // An arrival grows out of its new slot; a departure shrinks into its old one.
      const presence = !slotA ? t : !slotB ? 1 - t : 1
      const anchor = !slotA ? pointB : !slotB ? pointA : blendPoint(pointA, pointB, t)
      // Judged at the nearer year, so a dock icon does not grow a label the
      // year before it moves to the grid.
      const current = t < 0.5 ? sA : sB
      const docked = current.dock
      const contents = app.id === this.folderID
        ? eras[near].folder.map((id) => this.byID.get(id)).filter((a): a is HomeApp => !!a)
        : null
      const e = app.span > 1 ? layoutB.widgetEdge : docked ? dockEdge : edge
      view.update({ lower, upper, t, chrome, edge: e, width: W, docked, contents, yearIndex: near, scale: this.device.scale })
      const k = 0.35 + 0.65 * presence
      css(view.el, 'transform', `translate(${px(anchor.x - e / 2)}, ${px(anchor.y - e / 2)})${k === 1 ? '' : ` scale(${n(k)})`}`)
      css(view.el, 'opacity', n(presence))
    }

    this.indicator.update(chrome, W, lerp(layoutA.dotsY, layoutB.dotsY, t))
    this.status.update(screen, hardware, this.device.scale, W)
  }
}

export type { Ink }
