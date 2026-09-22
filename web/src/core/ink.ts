// Colour and blending. Everything that can change between two iOS versions
// is a number, so two neighbouring years can be blended and the screen
// morphs while the ruler is mid-drag instead of cutting.

/** A colour as components, 0...1. */
export interface Ink {
  r: number
  g: number
  b: number
  a: number
}

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v))

/** An Ink from 0xRRGGBB and an alpha. */
export function ink(hex: number, a = 1): Ink {
  return { r: ((hex >> 16) & 0xff) / 255, g: ((hex >> 8) & 0xff) / 255, b: (hex & 0xff) / 255, a }
}

export const clear: Ink = { r: 1, g: 1, b: 1, a: 0 }

/** Blends premultiplied, so fading to `clear` does not drift toward the
 *  clear colour's hue on the way. */
export function blendInk(x: Ink, y: Ink, t: number): Ink {
  const a = x.a + (y.a - x.a) * t
  if (a <= 0.0001) return { r: y.r, g: y.g, b: y.b, a: 0 }
  const mix = (p: number, q: number) => (p * x.a + (q * y.a - p * x.a) * t) / a
  return { r: mix(x.r, y.r), g: mix(x.g, y.g), b: mix(x.b, y.b), a }
}

/** CSS colour for an Ink. */
export function css(i: Ink, alphaScale = 1): string {
  const c = (v: number) => Math.round(clamp(v, 0, 1) * 255)
  return `rgba(${c(i.r)},${c(i.g)},${c(i.b)},${+(clamp(i.a * alphaScale, 0, 1)).toFixed(4)})`
}

/** CSS colour straight from 0xRRGGBB. */
export const hex = (value: number, alpha = 1): string => css(ink(value, alpha))

/** Blend any record whose fields are numbers or Inks; other fields flip at
 *  the halfway point (like Swift's non-blendable fields). */
export function blendRecord<T extends object>(a: T, b: T, t: number): T {
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(a) as Array<keyof T & string>) {
    const va = a[key] as unknown
    const vb = b[key] as unknown
    if (typeof va === 'number' && typeof vb === 'number') out[key] = lerp(va, vb, t)
    else if (isInk(va) && isInk(vb)) out[key] = blendInk(va, vb, t)
    else out[key] = t < 0.5 ? va : vb
  }
  return out as T
}

function isInk(v: unknown): v is Ink {
  return typeof v === 'object' && v !== null && 'r' in v && 'g' in v && 'b' in v && 'a' in v
}
