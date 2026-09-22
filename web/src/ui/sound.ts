// A short synthesized click on each year change, like the detent ticks in
// the hero videos. The audio is built in idle time while the page is still
// (an AudioContext costs 80-odd ms of hardware setup, and on the click that
// starts the walk that lands as a dropped frame); it stays suspended and
// silent until the first gesture, as browsers require. A speaker button
// turns the clicks on and off.

const KEY = 'ios-eras.sound'

class Clicker {
  private ctx: AudioContext | null = null
  private buffer: AudioBuffer | null = null
  private last = 0
  private unlocked = false
  private starting = false
  enabled: boolean
  private listeners = new Set<(on: boolean) => void>()

  constructor() {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(KEY)
    } catch {
      /* storage blocked */
    }
    this.enabled = stored !== 'off'
    const unlock = () => {
      this.unlocked = true
      if (this.enabled) this.start()
      window.removeEventListener('pointerdown', unlock, true)
      window.removeEventListener('keydown', unlock, true)
    }
    window.addEventListener('pointerdown', unlock, true)
    window.addEventListener('keydown', unlock, true)
    if (this.enabled) this.buildSoon()
  }

  /** Builds the context while the page is still, long before Play. */
  private buildSoon(): void {
    if (this.ctx || this.starting) return
    this.starting = true
    const build = () => {
      this.starting = false
      this.build()
    }
    const idle = (window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    if (idle) idle(build, { timeout: 600 })
    else setTimeout(build, 120)
  }

  onChange(cb: (on: boolean) => void): () => void {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }

  toggle(): void {
    this.set(!this.enabled)
  }

  set(on: boolean): void {
    this.enabled = on
    try {
      localStorage.setItem(KEY, on ? 'on' : 'off')
    } catch {
      /* storage blocked */
    }
    if (on && this.unlocked) this.start()
    for (const cb of this.listeners) cb(on)
  }

  /** Wakes the audio on a gesture (and builds it, if idle time never came). */
  private start(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return
    }
    if (!this.starting) this.build()
  }

  private build(): void {
    if (this.ctx) return
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    this.ctx = new AC()
    if (this.unlocked && this.ctx.state === 'suspended') void this.ctx.resume()
    // A 14 ms tick: a fast-decaying click of filtered noise over a short
    // high sine, like a watch crown's detent.
    const rate = this.ctx.sampleRate
    const length = Math.floor(rate * 0.014)
    const buffer = this.ctx.createBuffer(1, length, rate)
    const data = buffer.getChannelData(0)
    let seed = 12345
    let lp = 0
    for (let i = 0; i < length; i++) {
      seed = (Math.imul(seed, 1103515245) + 12345) >>> 0
      const noise = (seed / 0xffffffff) * 2 - 1
      lp += (noise - lp) * 0.35
      const t = i / rate
      const env = Math.exp(-t * 520)
      data[i] = (0.55 * lp + 0.45 * Math.sin(2 * Math.PI * 3200 * t)) * env
    }
    this.buffer = buffer
  }

  /** One tick, at most every 30 ms so a fast scrub stays a patter. */
  tick(): void {
    if (!this.enabled || !this.unlocked) return
    this.start()
    const ctx = this.ctx
    if (!ctx || !this.buffer || ctx.state !== 'running') return
    const now = performance.now()
    if (now - this.last < 30) return
    this.last = now
    const src = ctx.createBufferSource()
    src.buffer = this.buffer
    const gain = ctx.createGain()
    gain.gain.value = 0.32
    src.connect(gain).connect(ctx.destination)
    src.start()
  }
}

let shared: Clicker | null = null

export function clicker(): Clicker {
  if (!shared) shared = new Clicker()
  return shared
}

export type { Clicker }
