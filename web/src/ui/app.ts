// The site shell: header (title, subtitle, Home screen / Button switch,
// Play, sound), the timeline column, and the footer. Also the chrome-less
// layouts for screenshots (?capture=1, ?screen=1).

import { clamp } from '../core/ink'
import { h, px } from '../core/dom'
import { makeShared } from './shared'
import type { Shared } from './shared'
import type { Env, LayoutMode, PageHandle } from './timeline'
import { mountHomePage } from './homePage'
import { clicker } from './sound'

type PageName = 'home' | 'button'

/** The tallest iPhone either timeline shows, in mm (iPhone 17/18 Pro). */
const TALLEST_MM = 150
/** Points per mm on the iOS page. */
const IOS_SCALE = 4.3

const icons = {
  play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.9v10.2c0 .6.7 1 1.2.6l7.6-5.1a.7.7 0 0 0 0-1.2L5.7 2.3c-.5-.4-1.2 0-1.2.6z" fill="currentColor"/></svg>',
  stop: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="3.5" width="9" height="9" rx="1.6" fill="currentColor"/></svg>',
  soundOn:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 7.6h2.6L9.4 4.5c.5-.4 1.1 0 1.1.6v9.8c0 .6-.6 1-1.1.6l-3.8-3.1H3a.9.9 0 0 1-.9-.9V8.5c0-.5.4-.9.9-.9z" fill="currentColor"/><path d="M13.2 7.1a4 4 0 0 1 0 5.8M15.4 5a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  soundOff:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 7.6h2.6L9.4 4.5c.5-.4 1.1 0 1.1.6v9.8c0 .6-.6 1-1.1.6l-3.8-3.1H3a.9.9 0 0 1-.9-.9V8.5c0-.5.4-.9.9-.9z" fill="currentColor"/><path d="M13.4 7.8l4.2 4.4M17.6 7.8l-4.2 4.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
}

export function mountApp(root: HTMLElement, params: URLSearchParams): void {
  const mode: LayoutMode = params.get('screen') === '1' ? 'screen' : params.get('capture') === '1' ? 'capture' : 'page'
  let pageName: PageName = params.get('page') === 'button' ? 'button' : 'home'
  document.documentElement.classList.add(`mode-${mode}`)
  root.className = `app mode-${mode}`

  // ---------------------------------------------------------------- scale

  const scaleListeners = new Set<(scale: number) => void>()
  const env: Env = {
    mode,
    scale: IOS_SCALE,
    onScale(cb) {
      scaleListeners.add(cb)
      return () => scaleListeners.delete(cb)
    },
    pace: Number(params.get('pace')) > 0 ? Number(params.get('pace')) : 1,
  }

  // ---------------------------------------------------------------- shell

  let header: HTMLElement | null = null
  let playButton: HTMLButtonElement | null = null
  let tabs: HTMLButtonElement[] = []
  let thumb: HTMLElement | null = null
  /** Moves the white pill onto the selected tab. The two tabs are NOT the
   *  same width once the control is squeezed (a `1fr` column never goes
   *  below its label's min-content), so a 50%-wide thumb slid by 100% lands
   *  under the gap between the labels and clips "Home screen". The pill is
   *  measured from the tab itself instead. */
  let placeThumb = (_animate = true): void => {}
  if (mode === 'page') {
    header = h('header', 'site-header', {}, root)
    const inner = h('div', 'site-header-inner', {}, header)
    const brand = h('div', 'brand', {}, inner)
    h('h1', 'title', {}, brand).textContent = 'iOS Eras'
    const sub = h('p', 'subtitle', {}, brand)
    sub.append('Twenty years of iPhone, redrawn.')
    h('span', 'subtitle-more', {}, sub).textContent = ' Drag the ruler from 2007 to 2026.'
    const controls = h('div', 'controls', {}, inner)
    const seg = h('div', 'segmented', {}, controls)
    seg.setAttribute('role', 'tablist')
    seg.setAttribute('aria-label', 'Timeline')
    thumb = h('span', 'segmented-thumb', {}, seg)
    for (const [name, label] of [['home', 'Home screen'], ['button', 'Button']] as Array<[PageName, string]>) {
      const b = h('button', 'segmented-item', {}, seg)
      b.type = 'button'
      b.textContent = label
      b.dataset.page = name
      b.setAttribute('role', 'tab')
      b.addEventListener('click', () => switchTo(name))
      tabs.push(b)
    }
    const pill = thumb
    placeThumb = (animate = true) => {
      const tab = tabs.find((b) => b.dataset.page === pageName)
      if (!tab || !tab.offsetWidth) return
      // Rects, not offsetLeft/offsetWidth: those are whole numbers, and the
      // tabs land on fractions, which left the pill up to a pixel short.
      const box = tab.getBoundingClientRect()
      const base = seg.getBoundingClientRect()
      if (!animate) pill.style.transition = 'none'
      pill.style.width = px(box.width)
      pill.style.transform = `translateX(${box.left - base.left - 2}px)`
      if (!animate) {
        void pill.offsetWidth
        pill.style.transition = ''
      }
    }
    placeThumb(false)
    new ResizeObserver(() => placeThumb(false)).observe(seg)
    document.fonts?.ready.then(() => placeThumb(false))
    playButton = h('button', 'play', {}, controls)
    playButton.type = 'button'
    playButton.addEventListener('click', () => {
      if (!current) return
      if (current.playing) current.stop()
      else current.play()
    })
    const sound = h('button', 'sound', {}, controls)
    sound.type = 'button'
    const renderSound = (on: boolean) => {
      sound.innerHTML = on ? icons.soundOn : icons.soundOff
      sound.setAttribute('aria-pressed', String(on))
      sound.setAttribute('aria-label', on ? 'Year clicks on' : 'Year clicks off')
      sound.title = on ? 'Year clicks: on' : 'Year clicks: off'
    }
    renderSound(clicker().enabled)
    clicker().onChange(renderSound)
    sound.addEventListener('click', () => clicker().toggle())
  }

  const main = h('main', 'page-host', {}, root)
  const column = h('div', 'column', {}, main)

  let footer: HTMLElement | null = null
  if (mode === 'page') {
    footer = h('footer', 'site-footer', {}, root)
    const line = h('p', 'credit', {}, footer)
    line.innerHTML =
      'Made by <a href="https://x.com/jc_builds" target="_blank" rel="noopener">@jc_builds</a> · ' +
      '<a href="https://github.com/haplollc/ios-eras" target="_blank" rel="noopener">Source on GitHub</a>'
    h('p', 'legal', {}, footer).textContent =
      'Not affiliated with Apple. Icons are hand-drawn recreations for design-history commentary. Apple, iPhone and iOS are trademarks of Apple Inc.'
  }

  // The stage scales to the window: the whole column (iPhone, caption,
  // ruler) fits one screen on a phone or a laptop.
  // The footer shares the first screen when that still leaves a good-sized
  // iPhone; otherwise it starts just below the fold rather than peeking.
  const computeScale = (): number => {
    if (mode !== 'page') return IOS_SCALE
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight
    const headerH = header ? header.offsetHeight : 0
    const footerH = footer ? footer.offsetHeight : 0
    // caption (22 + 62, and a third line of note under 480 px: see the
    // .caption-note rule) + ruler (78 + 18) + breathing room
    const below = 22 + 62 + (vw < 480 ? 17.3 : 0) + 96 + (vw < 640 ? 10 : 16)
    const byWidth = (Math.min(vw, 560) - 40) / 72
    let byHeight = (vh - headerH - below - footerH) / TALLEST_MM
    const footerFits = Math.min(byHeight, byWidth) >= 3.0
    if (!footerFits) byHeight = (vh - headerH - below) / TALLEST_MM
    root.classList.toggle('footer-below', !footerFits)
    root.style.setProperty('--header-h', `${headerH}px`)
    // The floor only binds on viewports under ~500 px tall. It used to be
    // 2.4, which pushed the ruler -- the only control on the page -- clean
    // off the bottom of an iPhone SE (320x568) and clipped its year labels
    // in a short desktop window (1024x500).
    return clamp(Math.min(byHeight, byWidth), 1.4, 4.8)
  }
  env.scale = computeScale()

  let frame = 0
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const next = computeScale()
      if (Math.abs(next - env.scale) < 0.001) return
      env.scale = next
      for (const cb of scaleListeners) cb(next)
    })
  })

  // ---------------------------------------------------------------- pages

  let current: PageHandle | null = null
  let unPlaying: (() => void) | null = null
  let mounting = 0
  const pageParams = new URLSearchParams(params)

  const updateChrome = () => {
    tabs.forEach((b) => {
      const on = b.dataset.page === pageName
      b.setAttribute('aria-selected', String(on))
      b.classList.toggle('on', on)
    })
    if (thumb) thumb.dataset.page = pageName
    placeThumb()
    if (playButton) {
      const playing = !!current?.playing
      playButton.innerHTML = `${playing ? icons.stop : icons.play}<span>${playing ? 'Stop' : 'Play'}</span>`
      playButton.setAttribute('aria-label', playing ? 'Stop the walk through the years' : 'Play a walk through the years')
      playButton.classList.toggle('playing', playing)
    }
  }

  const mount = async (name: PageName, p: URLSearchParams) => {
    const token = ++mounting
    unPlaying?.()
    unPlaying = null
    current?.destroy()
    current = null
    column.replaceChildren()
    document.title = name === 'button'
      ? 'The button · iOS Eras'
      : 'iOS Eras · Twenty years of iPhone, redrawn'
    const shared: Shared = makeShared(env, p)
    let handle: PageHandle
    if (name === 'button') {
      const { mountButtonPage } = await import('../button/page')
      handle = await mountButtonPage(column, p, shared)
    } else {
      handle = await mountHomePage(column, shared)
    }
    if (token !== mounting) {
      handle.destroy()
      return
    }
    current = handle
    unPlaying = handle.onPlayingChange(updateChrome)
    updateChrome()
    if (p.get('demo') === '1' && mode !== 'screen') handle.play()
    root.classList.add('ready')
  }

  const switchTo = (name: PageName) => {
    if (name === pageName) return
    // Keep the year when switching timelines.
    const year = current ? 2007 + Math.round(current.position) : null
    pageName = name
    const next = new URLSearchParams()
    next.set('page', name)
    if (year !== null) next.set('year', String(year))
    const url = new URL(location.href)
    url.search = next.toString()
    history.replaceState(null, '', url)
    updateChrome()
    void mount(name, next)
  }

  updateChrome()
  void mount(pageName, pageParams)
}
