// The caption under the iPhone: "iOS 7 · iPhone 5s" and a line on what
// changed. Cross-fades when the year changes, like SwiftUI's
// .contentTransition(.opacity) under .snappy(duration: 0.3).

import type { EraCaption } from '../core/looks'
import { h } from '../core/dom'

const FADE_MS = 300

/** A box whose text cross-fades when it changes. */
class Crossfade {
  readonly el: HTMLDivElement
  private current: HTMLDivElement | null = null
  private key = ''

  constructor(className: string, parent: HTMLElement) {
    this.el = h('div', `xfade ${className}`, {}, parent)
  }

  set(key: string, build: (layer: HTMLDivElement) => void, animate: boolean): void {
    if (key === this.key) return
    this.key = key
    const layer = h('div', 'xfade-layer')
    build(layer)
    const old = this.current
    this.el.appendChild(layer)
    this.current = layer
    if (!old) return
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      old.remove()
      return
    }
    old.classList.add('leaving')
    layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_MS, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
    const out = old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE_MS, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
    out.onfinish = () => old.remove()
    // A fast scrub can stack layers; keep only the newest two.
    const layers = this.el.querySelectorAll('.xfade-layer')
    for (let i = 0; i < layers.length - 2; i++) layers[i].remove()
  }
}

export class Caption {
  readonly el: HTMLDivElement
  private title: Crossfade
  private note: Crossfade

  constructor() {
    this.el = h('div', 'caption')
    this.el.setAttribute('aria-live', 'polite')
    this.title = new Crossfade('caption-title', this.el)
    this.note = new Crossfade('caption-note', this.el)
  }

  set(era: EraCaption, animate = true): void {
    this.title.set(`${era.system}|${era.device}`, (layer) => {
      h('span', 'caption-system', {}, layer).textContent = era.system
      h('span', 'caption-dot', {}, layer).textContent = '·'
      h('span', 'caption-device', {}, layer).textContent = era.device
    }, animate)
    this.note.set(era.note, (layer) => {
      layer.textContent = era.note
    }, animate)
  }
}
