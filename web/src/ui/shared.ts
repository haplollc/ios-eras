// What the site shell hands to each timeline page (home, button). See the
// top of src/button/page.ts for how a page uses it.

import type { EraCaption } from '../core/looks'
import { Caption } from './caption'
import { Ruler } from './ruler'
import type { RulerOptions } from './ruler'
import { clicker } from './sound'
import type { Env, PageHandle, StageHandle, TimelineSpec } from './timeline'
import { TimelineView, mountStageOnly } from './timeline'

export interface Shared {
  /** Layout mode ('page' | 'capture' | 'screen'), current scale (CSS px per
   *  mm of iPhone), a resize subscription, and the demo pace. */
  env: Env
  /** Builds the standard page: stage row, caption, ruler, keyboard, demo.
   *  Returns the handle the shell's Play button drives. */
  mountTimeline(container: HTMLElement, spec: TimelineSpec): PageHandle
  /** For ?screen=1: the stage alone, rendered once at `position`. */
  mountStageOnly(container: HTMLElement, stage: StageHandle, position: number): PageHandle
  /** The opening position from ?year= / ?pos= / ?demo=1 (0 for a demo,
   *  else the last year), as the SwiftUI views read their env vars. */
  startPosition(eras: EraCaption[]): number
  /** Lower-level pieces, if a page wants its own layout. */
  createRuler(opts: RulerOptions): Ruler
  createCaption(): Caption
  /** The year-change click (call .tick()). */
  clicker: typeof clicker
  params: URLSearchParams
}

export function makeShared(env: Env, params: URLSearchParams): Shared {
  return {
    env,
    params,
    mountTimeline: (container, spec) => new TimelineView(container, spec, env),
    mountStageOnly,
    startPosition(eras) {
      const last = eras.length - 1
      const pos = params.get('pos')
      if (pos !== null && pos.trim() !== '' && Number.isFinite(+pos)) return Math.min(Math.max(+pos, 0), last)
      const year = Number(params.get('year'))
      const index = eras.findIndex((e) => e.year === year)
      if (index >= 0) return index
      return params.get('demo') === '1' ? 0 : last
    },
    createRuler: (opts) => new Ruler(opts),
    createCaption: () => new Caption(),
    clicker,
  }
}

export type { Env, PageHandle, StageHandle, TimelineSpec }
