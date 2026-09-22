// The Home Screen Eras page (HomeErasView.swift): the stage, caption, ruler
// and the scripted walk.

import { homeTimeline } from '../home/timeline'
import { placeApps, withDropInImages } from '../home/model'
import type { HomeApp } from '../home/model'
import { HomeErasStage } from '../home/stage'
import { folderID, roster } from '../home/icons/index'
import type { HomeAppDef } from '../home/icons/kit'
import { circle, place, radial, rect, shadow, text } from '../home/icons/kit'
import type { Kit } from '../home/icons/kit'
import { ink } from '../core/ink'
import type { PageHandle, Shared } from './shared'
import type { DemoContext, StageHandle } from './timeline'

/** Files listed in public/icons/index.json (the drop-in image hook). */
let dropIns: Promise<Set<string>> | null = null

export function loadDropIns(): Promise<Set<string>> {
  if (!dropIns) {
    dropIns = fetch(`${import.meta.env.BASE_URL}icons/index.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : []))
      .then((list: unknown) => new Set(Array.isArray(list) ? list.filter((x): x is string => typeof x === 'string') : []))
      .catch(() => new Set<string>())
  }
  return dropIns
}

/** Every roster app, placed on every era, with any drop-in images.
 *  `placeholders` (debug, ?placeholders=1) stands a plain tile in for any
 *  app the roster does not draw yet, for checking layout. */
export async function homeApps(placeholders = false, heavy = false): Promise<HomeApp[]> {
  const files = await loadDropIns()
  let list: HomeAppDef[] = roster
  if (placeholders) {
    const known = new Set(roster.map((a) => a.id))
    const ids = new Set<string>()
    for (const era of homeTimeline) for (const id of [...era.page, ...era.dock, ...era.folder]) ids.add(id)
    const hues = [0x4cd964, 0x007aff, 0xff9500, 0xff3b30, 0x5856d6, 0x8e8e93, 0x34aadc, 0xffcc00]
    let i = 0
    const extra: HomeAppDef[] = []
    for (const id of ids) {
      if (known.has(id)) continue
      const colour = hues[i++ % hues.length]
      const letter = id[0]
      const art = heavy ? heavyArt(letter) : () => text(letter, 50, 52, 46, { weight: 600 })
      // Heavy placeholders get a redesign every few years, so scrubs cross-fade.
      const designs = heavy
        ? [0, 3, 6, 10, 15].map((from, k) => ({ from, top: ink(hues[(i + k) % hues.length]), bottom: ink(colour), art: heavyArt(letter + k) }))
        : [{ from: 0, top: ink(colour), bottom: ink(colour), art }]
      extra.push({ id, designs })
    }
    list = [...roster, ...extra]
  }
  const placed = placeApps(list, homeTimeline)
  return files.size ? placed.map((a) => withDropInImages(a, files, import.meta.env.BASE_URL)) : placed
}

/** Debug: an art layer about as costly as the busiest real icons (a
 *  gradient, a blurred shadow, sixty ticks), for timing scrubs. */
function heavyArt(label: string) {
  return (k: Kit) => {
    const ticks = Array.from({ length: 60 }, (_, i) => place(rect(50, 14, 1.2, i % 5 ? 4 : 8, '#222'), { rotate: i * 6 })).join('')
    return (
      circle(50, 50, 84, radial(k, ['#ffffff', '#d8d8de']), `filter="${shadow(k, 'rgba(0,0,0,0.5)', 3, 0, 1.5)}"`) +
      ticks +
      text(label, 50, 58, 22, { fill: '#111', weight: 700 }) +
      place(rect(50, 36, 3, 30, '#e33'), { rotate: 40 })
    )
  }
}

/** HomeErasView.runDemo, beat for beat. */
async function homeDemo({ glide, hold, last }: DemoContext): Promise<void> {
  if (!(await hold(1.4))) return
  // A beat on each of the early years: apps arriving one release at a time.
  for (let index = 1; index <= Math.min(6, last); index++) {
    if (!(await glide(index, 0.5)) || !(await hold(0.85))) return
  }
  // One long pull to today, the whole redesign in one go...
  if (!(await glide(last, 7.0)) || !(await hold(1.4))) return
  // ...a quick rewind to the start...
  if (!(await glide(0, 2.4)) || !(await hold(0.8))) return
  // ...and a steady glide back to settle on today.
  if (!(await glide(last, 4.6))) return
  await hold(1.3)
}

export async function mountHomePage(container: HTMLElement, shared: Shared): Promise<PageHandle> {
  const ph = shared.params.get('placeholders')
  const apps = await homeApps(ph === '1' || ph === 'heavy', ph === 'heavy')
  const eras = homeTimeline
  const makeStage = (scale: number, screenOnly = false): StageHandle => {
    const stage = new HomeErasStage(eras, apps, { scale, screenOnly }, folderID)
    if (!screenOnly) stage.prewarm()
    return {
      el: stage.el,
      render: (p) => stage.render(p),
      setScale: (s) => stage.setScale(s),
    }
  }
  const start = shared.startPosition(eras)
  if (shared.env.mode === 'screen') {
    return shared.mountStageOnly(container, makeStage(shared.env.scale, true), start)
  }
  return shared.mountTimeline(container, {
    eras,
    tallestMM: HomeErasStage.tallest(eras),
    createStage: (scale) => makeStage(scale),
    demo: homeDemo,
    start,
  })
}
