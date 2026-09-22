// Tiny DOM helpers for views that are built once and then only restyled.

const SVG_NS = 'http://www.w3.org/2000/svg'

/** An HTML element with a class and optional inline styles. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  style: Partial<Record<string, string>> = {},
  parent?: Element,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  if (className) el.className = className
  for (const [k, v] of Object.entries(style)) if (v !== undefined) el.style.setProperty(k, v)
  if (parent) parent.appendChild(el)
  return el
}

/** An SVG element with attributes. */
export function s<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
  parent?: Element,
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag)
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v))
  if (parent) parent.appendChild(el)
  return el
}

/** Writes a style or attribute only when it changed, so per-frame updates
 *  that land on the same value cost nothing. */
const lastStyle = new WeakMap<Element, Map<string, string>>()

export function css(el: HTMLElement | SVGElement, prop: string, value: string): void {
  let map = lastStyle.get(el)
  if (!map) {
    map = new Map()
    lastStyle.set(el, map)
  }
  if (map.get(prop) === value) return
  map.set(prop, value)
  el.style.setProperty(prop, value)
}

export function attr(el: Element, name: string, value: string | number): void {
  let map = lastStyle.get(el)
  if (!map) {
    map = new Map()
    lastStyle.set(el, map)
  }
  const v = String(value)
  const key = '@' + name
  if (map.get(key) === v) return
  map.set(key, v)
  el.setAttribute(name, v)
}

export function text(el: HTMLElement | SVGElement, value: string): void {
  let map = lastStyle.get(el)
  if (!map) {
    map = new Map()
    lastStyle.set(el, map)
  }
  if (map.get('#text') === value) return
  map.set('#text', value)
  el.textContent = value
}

/** A number as a short CSS length. */
export const px = (v: number): string => `${+v.toFixed(3)}px`

/** A short number for attributes and transforms. */
export const n = (v: number): string => String(+v.toFixed(3))

// SwiftUI interpolates gradients perceptually (Oklab, premultiplied); CSS
// can too where `in oklab` is supported. Checked against the iOS renders'
// wallpapers: it halves the error on contrasting ones.
const oklab = typeof CSS !== 'undefined' && CSS.supports?.('background-image', 'linear-gradient(in oklab, red, blue)')

/** A CSS linear gradient, interpolated like SwiftUI's. `direction` is e.g.
 *  '180deg' (top to bottom). */
export function linearGradient(direction: string, ...stops: string[]): string {
  return `linear-gradient(${oklab ? 'in oklab ' : ''}${direction}, ${stops.join(', ')})`
}

/** A CSS radial gradient, interpolated like SwiftUI's. `shape` is e.g.
 *  'circle 40px at 10px 20px'. */
export function radialGradient(shape: string, ...stops: string[]): string {
  return `radial-gradient(${shape}${oklab ? ' in oklab' : ''}, ${stops.join(', ')})`
}

let idCounter = 0
/** A document-unique id. */
export const uid = (prefix: string): string => `${prefix}-${++idCounter}`

// ---------------------------------------------------------------- shapes

const K = {
  a: 1.52866483, b: 1.08849323, c: 0.86840689, d: 0.0249114,
  e: 0.66993427, f: 0.065496, g: 0.37282392, h: 0.16257467,
}

/** A rounded rectangle with circular corners, as an SVG path. */
export function roundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  if (w <= 0 || h <= 0) return ''
  const rr = Math.max(0, Math.min(r, w / 2, h / 2))
  const f = n
  if (rr < 0.01) return `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`
  return (
    `M${f(x + rr)} ${f(y)}H${f(x + w - rr)}A${f(rr)} ${f(rr)} 0 0 1 ${f(x + w)} ${f(y + rr)}` +
    `V${f(y + h - rr)}A${f(rr)} ${f(rr)} 0 0 1 ${f(x + w - rr)} ${f(y + h)}` +
    `H${f(x + rr)}A${f(rr)} ${f(rr)} 0 0 1 ${f(x)} ${f(y + h - rr)}` +
    `V${f(y + rr)}A${f(rr)} ${f(rr)} 0 0 1 ${f(x + rr)} ${f(y)}Z`
  )
}

/** SwiftUI's RoundedRectangle(style: .continuous): the iOS 7 corner, whose
 *  curvature eases in over about 1.53 radii of the edge. Falls back to a
 *  circular corner when the rectangle is too small to fit the easing. */
export function continuousRectPath(x: number, y: number, w: number, h: number, r: number): string {
  if (w <= 0 || h <= 0) return ''
  const limit = Math.min(w, h) / 2
  const rr = Math.max(0, Math.min(r, limit))
  if (rr < 0.01 || rr * K.a > limit) return roundedRectPath(x, y, w, h, rr)
  const f = n
  const X0 = x, X1 = x + w, Y0 = y, Y1 = y + h
  const q = (v: number) => v * rr
  const P = (px: number, py: number) => `${f(px)} ${f(py)}`
  return [
    `M${P(X0 + q(K.a), Y0)}`,
    `L${P(X1 - q(K.a), Y0)}`,
    `C${P(X1 - q(K.b), Y0)} ${P(X1 - q(K.c), Y0 + q(K.d))} ${P(X1 - q(K.e), Y0 + q(K.f))}`,
    `C${P(X1 - q(K.g), Y0 + q(K.h))} ${P(X1 - q(K.h), Y0 + q(K.g))} ${P(X1 - q(K.f), Y0 + q(K.e))}`,
    `C${P(X1 - q(K.d), Y0 + q(K.c))} ${P(X1, Y0 + q(K.b))} ${P(X1, Y0 + q(K.a))}`,
    `L${P(X1, Y1 - q(K.a))}`,
    `C${P(X1, Y1 - q(K.b))} ${P(X1 - q(K.d), Y1 - q(K.c))} ${P(X1 - q(K.f), Y1 - q(K.e))}`,
    `C${P(X1 - q(K.h), Y1 - q(K.g))} ${P(X1 - q(K.g), Y1 - q(K.h))} ${P(X1 - q(K.e), Y1 - q(K.f))}`,
    `C${P(X1 - q(K.c), Y1 - q(K.d))} ${P(X1 - q(K.b), Y1)} ${P(X1 - q(K.a), Y1)}`,
    `L${P(X0 + q(K.a), Y1)}`,
    `C${P(X0 + q(K.b), Y1)} ${P(X0 + q(K.c), Y1 - q(K.d))} ${P(X0 + q(K.e), Y1 - q(K.f))}`,
    `C${P(X0 + q(K.g), Y1 - q(K.h))} ${P(X0 + q(K.h), Y1 - q(K.g))} ${P(X0 + q(K.f), Y1 - q(K.e))}`,
    `C${P(X0 + q(K.d), Y1 - q(K.c))} ${P(X0, Y1 - q(K.b))} ${P(X0, Y1 - q(K.a))}`,
    `L${P(X0, Y0 + q(K.a))}`,
    `C${P(X0, Y0 + q(K.b))} ${P(X0 + q(K.d), Y0 + q(K.c))} ${P(X0 + q(K.f), Y0 + q(K.e))}`,
    `C${P(X0 + q(K.h), Y0 + q(K.g))} ${P(X0 + q(K.g), Y0 + q(K.h))} ${P(X0 + q(K.e), Y0 + q(K.f))}`,
    `C${P(X0 + q(K.c), Y0 + q(K.d))} ${P(X0 + q(K.b), Y0)} ${P(X0 + q(K.a), Y0)}`,
    'Z',
  ].join('')
}
