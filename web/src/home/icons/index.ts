// Every app on the home screen, in the same order as the SwiftUI roster.
import type { HomeAppDef } from './kit'
import { dock } from './dock'
import { media } from './media'
import { paper } from './paper'
import { stores } from './stores'
import { arrivals } from './arrivals'
import { extra } from './extra'

export const roster: HomeAppDef[] = [...dock, ...media, ...paper, ...stores, ...arrivals, ...extra]

/** The page's default folder; its tile is drawn from its contents. */
export const folderID = 'Utilities'
