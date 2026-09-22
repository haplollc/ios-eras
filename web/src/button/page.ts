// STUB, to be replaced by the Button Eras port (ButtonErasView/Stage/
// Swatch/Timeline.swift). The shell calls this for ?page=button.
//
// INTERFACE
//
//   export function mountButtonPage(container: HTMLElement, params: URLSearchParams,
//                                   shared: Shared): PageHandle | Promise<PageHandle>
//
// `container` is an empty, centred column (max 480 px wide; exactly 440 px
// with ?capture=1). Build into it and return a PageHandle (src/ui/timeline.ts):
//   { position, playing, play(), stop(), setPosition(p), onPlayingChange(cb), destroy() }
// The shell's Play button calls play()/stop(); destroy() runs when the user
// switches to the Home screen page.
//
// The easy way is shared.mountTimeline(container, spec), which builds the
// same page the home screen uses and returns the handle:
//   spec = {
//     eras: EraCaption[]            // { year, system, device, note } per row
//     tallestMM: number             // tallest bodyHeight, sets the stage row
//     createStage(scale) => StageHandle   // { el, render(position), setScale(scale), destroy?() }
//     demo?: async ({ glide, hold, last }) => { ... }   // ButtonErasView.runDemo's beats;
//                                   // glide(index, seconds) / hold(seconds) resolve false once cancelled
//     start?: number                // use shared.startPosition(eras) (reads ?year= ?pos= ?demo=1)
//     accessory?: HTMLElement       // e.g. a "Button only" toggle, placed in the stage row
//                                   // (the row is position:relative; place it absolutely)
//   }
// `scale` is CSS px per mm of iPhone (4.3 on the iOS page and with
// ?capture=1; smaller on small windows). It changes on resize: setScale is
// then called and render() follows.
//
// Other shared pieces:
//   shared.env            { mode: 'page' | 'capture' | 'screen', scale, onScale(cb), pace }
//   shared.mountStageOnly(container, stage, position)   for ?screen=1 (stage alone at top-left)
//   shared.startPosition(eras)                           opening position from the URL
//   shared.createRuler(opts) / shared.createCaption()    lower-level ruler and caption
//   shared.clicker().tick()                              the year-change click
//   shared.params                                        the page's URLSearchParams
//
// Building blocks already ported (import directly):
//   src/core/looks.ts   ScreenLook, DeviceLook (+ blendScreen/blendDevice), EraTypeface
//                       (eraFont/fontCSS), ScreenLooks.white/classic/wallpaper,
//                       DeviceLooks.iPhone2007/iPhone3G/homeButtonPhone/allScreen,
//                       segment(position, count), withChange()
//   src/core/device.ts  EraDevice (el, content, update(look) -> frame), EraBackdrop
//                       (el, update(look, w, h)), EraStatusBar (el, update(look, hw, scale, w)),
//                       cutoutGeometry, shadowBlur (SwiftUI shadow radius r == CSS blur 2r)
//   src/core/dom.ts     h(), s(), css()/attr()/text() (write only on change), continuousRectPath()
//                       (SwiftUI .continuous corners), linearGradient()/radialGradient()
//                       (CSS gradients interpolated in Oklab like SwiftUI's; measured)
//   src/home/stage.ts   MATERIAL_FILTER / MATERIAL_WASH: .ultraThinMaterial as
//                       backdrop-filter + wash, fitted to the iOS renders
// A stage is built like src/home/stage.ts's HomeErasStage: EraDevice, then
// EraBackdrop + your views + EraStatusBar appended to device.content.

import type { PageHandle, Shared } from '../ui/shared'

export function mountButtonPage(container: HTMLElement, params: URLSearchParams, _shared: Shared): PageHandle | Promise<PageHandle> {
  const el = document.createElement('div')
  el.className = 'page-placeholder'
  el.textContent = 'The Button timeline is on its way.'
  container.appendChild(el)
  // Keep the year the visitor came with, so switching back returns to it.
  const year = Number(params.get('year'))
  return {
    position: year >= 2007 && year <= 2026 ? year - 2007 : 19,
    playing: false,
    play() {},
    stop() {},
    setPosition() {},
    onPlayingChange() {
      return () => {}
    },
    destroy() {
      el.remove()
    },
  }
}
