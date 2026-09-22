// The home screen as numbers (HomeErasModel.swift). Each iOS version is a
// row describing how the system wrapped an icon (its corner, its gloss, its
// label, its dock) and which apps sat where. Blend two neighbouring rows and
// the whole screen morphs.

import type { Ink } from '../core/ink'
import { blendRecord, lerp } from '../core/ink'
import type { DeviceLook, EraCaption, EraTypeface, FontWeight, ScreenLook } from '../core/looks'
import type { HomeAppDef, IconDesign } from './icons/kit'

// ---------------------------------------------------------------- metrics

/** Where things sit on one version's home screen, measured off a real
 *  screenshot of that version. Every length is a fraction of the screen's
 *  width; "fromBottom" values are measured up from the screen's bottom. */
export interface HomeMetrics {
  iconSize: number
  colCentre0: number
  colPitch: number
  /** Top edge of the first row of icons, from the top of the screen. */
  row0Top: number
  rowPitch: number
  /** From an icon's bottom edge to the middle of its label. */
  labelBelow: number
  indicatorFromBottom: number
  dotSize: number
  dotPitch: number
  pillWidth: number
  pillHeight: number
  pillText: number
  dockTopFromBottom: number
  dockBottomGap: number
  dockSideInset: number
  dockIconFromBottom: number
  dockIconSize: number
  dockColCentre0: number
  dockColPitch: number
  /** 1 when the dock icons carry labels (to iOS 10), 0 after. */
  dockLabels: number
  /** Where the dock labels sit, from the bottom; 0 means just under the icon. */
  dockLabelFromBottom: number
  /** The dock's corner radius; 0 means square. */
  dockCorner: number
  /** How many page dots, and which one is current. Flip at the halfway point. */
  dotCount: number
  activeDot: number
}

export function blendMetrics(a: HomeMetrics, b: HomeMetrics, t: number): HomeMetrics {
  const out = blendRecord(a, b, t)
  out.dotCount = t < 0.5 ? a.dotCount : b.dotCount
  out.activeDot = t < 0.5 ? a.activeDot : b.activeDot
  return out
}

// ---------------------------------------------------------------- chrome

/** How a version dressed every icon. */
export interface HomeChrome {
  columns: number
  rows: number
  /** Icon edge as a share of the screen's width. */
  iconScale: number
  /** Corner radius as a share of the icon's edge. */
  cornerRatio: number
  /** 0 for a circular-arc corner, 1 for the continuous superellipse. */
  squircle: number
  /** The curved white shine iOS laid over the top of every icon. */
  gloss: number
  iconShadow: Ink
  iconShadowRadius: number
  iconShadowY: number
  /** Liquid Glass: a bright rim and inner light on every icon. */
  glassRim: number
  label: Ink
  labelShadow: Ink
  labelSize: number
  /** The metal mesh tray of 2007-2009, 0...1. */
  dockShelf: number
  /** The glass shelf in perspective of iOS 4-6, 0...1. */
  dockGlassShelf: number
  /** The frosted panel from iOS 7 on, 0...1. */
  dockPanel: number
  dockInset: number
  dockRadius: number
  dockTint: Ink
  reflection: number
  pageDots: Ink
  /** The little magnifier left of the dots (iPhone OS 3 to iOS 6), 0...1. */
  spotlightGlyph: number
  /** iOS 16's frosted "Search" pill, 0...1. */
  searchPill: number
  metrics: HomeMetrics
  // Flip at the halfway point.
  typeface: EraTypeface
  labelWeight: FontWeight
}

export function blendChrome(a: HomeChrome, b: HomeChrome, t: number): HomeChrome {
  const out = blendRecord(a, b, t)
  out.metrics = blendMetrics(a.metrics, b.metrics, t)
  return out
}

// ---------------------------------------------------------------- places

/** A place on the home screen: a grid cell, or a position in the dock. */
export interface HomeSlot {
  dock: boolean
  index: number
}

export interface HomeEra extends EraCaption {
  chrome: HomeChrome
  screen: ScreenLook
  hardware: DeviceLook
  /** App ids on the first page, reading order. */
  page: string[]
  /** App ids in the dock, left to right. */
  dock: string[]
  /** What the Utilities (or Extras) folder on the page holds, in order. */
  folder: string[]
}

/** An app with where it sat in every era. */
export interface HomeApp {
  id: string
  names: Array<[number, string]>
  span: number
  designs: IconDesign[]
  /** The slot per timeline index; null where it is not on the first page. */
  slots: Array<HomeSlot | null>
}

/** Lays an era's page items into a four-column grid, reading order, each
 *  taking the first block of free cells that fits it. */
export function cells(era: HomeEra, spans: Map<string, number>): Map<string, number> {
  const columns = 4
  const taken = new Set<number>()
  const result = new Map<string, number>()
  for (const item of era.page) {
    const span = spans.get(item) ?? 1
    let cell = 0
    for (;;) {
      const column = cell % columns
      let fits = column + span <= columns
      for (let dy = 0; fits && dy < span; dy++)
        for (let dx = 0; fits && dx < span; dx++) if (taken.has(cell + dy * columns + dx)) fits = false
      if (fits) break
      cell += 1
    }
    for (let dy = 0; dy < span; dy++) for (let dx = 0; dx < span; dx++) taken.add(cell + dy * columns + dx)
    result.set(item, cell)
  }
  return result
}

/** Every roster app with its slot in every era. Apps with no designs are
 *  skipped (an icon file still being drawn). */
export function placeApps(roster: HomeAppDef[], eras: HomeEra[]): HomeApp[] {
  const spans = new Map(roster.map((a) => [a.id, a.span ?? 1] as [string, number]))
  const layouts = eras.map((era) => cells(era, spans))
  const apps: HomeApp[] = []
  for (const def of roster) {
    if (!def || !def.id || !Array.isArray(def.designs) || def.designs.length === 0) continue
    const designs = [...def.designs].sort((x, y) => x.from - y.from)
    apps.push({
      id: def.id,
      names: def.names && def.names.length ? def.names : [[0, def.id]],
      span: def.span ?? 1,
      designs,
      slots: eras.map((era, i) => {
        const d = era.dock.indexOf(def.id)
        if (d >= 0) return { dock: true, index: d }
        const cell = layouts[i].get(def.id)
        return cell === undefined ? null : { dock: false, index: cell }
      }),
    })
  }
  return apps
}

/** Swaps in any image listed in public/icons/index.json named
 *  "<App>_<year>.png" (spaces as underscores), from that year until the next
 *  image or redesign (HomeApp.withDropInImages). */
export function withDropInImages(app: HomeApp, files: Set<string>, baseURL: string, first = 2007, last = 2026): HomeApp {
  const stem = app.id.replace(/ /g, '_')
  let designs = app.designs
  for (let year = first; year <= last; year++) {
    const file = `${stem}_${year}.png`
    if (!files.has(file)) continue
    const url = `${baseURL}icons/${encodeURIComponent(file)}`
    const index = year - first
    const existing = designs.findIndex((d) => d.from === index)
    if (existing >= 0) {
      designs = designs.map((d, i) => (i === existing ? { ...d, imageURL: url } : d))
    } else {
      let base = designs[0]
      for (const d of designs) if (d.from <= index) base = d
      designs = [...designs, { from: index, top: base.top, bottom: base.bottom, art: base.art, over: base.over, imageURL: url }]
      designs.sort((x, y) => x.from - y.from)
    }
  }
  return designs === app.designs ? app : { ...app, designs }
}

export function appName(app: HomeApp, index: number): string {
  let name = app.names[0]?.[1] ?? app.id
  for (const [from, label] of app.names) if (from <= index) name = label
  return name
}

export function designIndex(app: HomeApp, index: number): number {
  let found = 0
  app.designs.forEach((d, i) => {
    if (d.from <= index) found = i
  })
  return found
}

// ---------------------------------------------------------------- layout

export interface Point {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export const blendPoint = (a: Point, b: Point, t: number): Point => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) })

export const blendRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  width: lerp(a.width, b.width, t),
  height: lerp(a.height, b.height, t),
})

/** Where things go for ONE version, on a screen of W x H (HomeLayout). */
export class HomeLayout {
  constructor(
    readonly m: HomeMetrics,
    readonly W: number,
    readonly H: number,
  ) {}

  get iconEdge(): number {
    return this.W * this.m.iconSize
  }

  get dockIconEdge(): number {
    return this.W * this.m.dockIconSize
  }

  get dockFrame(): Rect {
    const { W, H, m } = this
    const inset = W * m.dockSideInset
    const top = H - W * m.dockTopFromBottom
    const bottom = H - W * m.dockBottomGap
    return { x: inset, y: top, width: W - inset * 2, height: Math.max(0, bottom - top) }
  }

  /** Concentric with the screen's corner; square when edge to edge. */
  get dockCornerRadius(): number {
    return this.W * this.m.dockCorner
  }

  /** The centre of the page dots, or of the Search pill. */
  get dotsY(): number {
    return this.H - this.W * this.m.indicatorFromBottom
  }

  /** A small widget is two icons plus the gutter between them, square. */
  get widgetEdge(): number {
    return this.iconEdge + this.W * this.m.colPitch
  }

  /** The centre of an icon tile (its label hangs below, outside this). */
  centre(slot: HomeSlot, span = 1): Point {
    const { W, H, m } = this
    if (slot.dock) {
      return { x: W * (m.dockColCentre0 + m.dockColPitch * slot.index), y: H - W * m.dockIconFromBottom }
    }
    const column = slot.index % 4
    const row = Math.floor(slot.index / 4)
    const x = W * (m.colCentre0 + m.colPitch * (column + (span - 1) / 2))
    const y = W * (m.row0Top + m.rowPitch * (row + (span - 1) / 2)) + this.iconEdge / 2
    return { x, y }
  }
}
