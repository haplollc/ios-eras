// A short synthesized click on each year change, like the detent ticks in
// the hero videos. Nothing is created until the first user gesture (browsers
// block audio before one), and a speaker button turns it on and off.

const KEY = 'ios-eras.sound'

class Clicker {
  private ctx: AudioContext | null = null
  private buffer: AudioBuffer | null = null
  private last = 0
  private unlocked = false
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
      if (this.enabled) this.ensure()
      window.removeEventListener('pointerdown', unlock, true)
      window.removeEventListener('keydown', unlock, true)
    }
    window.addEventListener('pointerdown', unlock, true)
    window.addEventListener('keydown', unlock, true)
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
    if (on && this.unlocked) this.ensure()
    for (const cb of this.listeners) cb(on)
  }

  private ensure(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return
    }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    this.ctx = new AC()
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
    this.ensure()
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
