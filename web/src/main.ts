// Entry point. Query parameters (for people and for screenshot tests):
//   ?page=home|button     which timeline to show (default home)
//   &year=2013            open on a year;  &pos=14.5 open between years
//   &demo=1               run the scripted walk (as in the hero videos)
//   &pace=3               run the walk three times slower (UIC_DEMO_PACE)
//   &capture=1            chrome-less iOS page layout, 440 pt wide, for screenshots
//   &screen=1             ONLY the phone's screen, 4.3 px per mm, at the top-left
//   ?gallery=Settings     one app at every year (icon checking)
import './style.css'

const params = new URLSearchParams(location.search)
const root = document.getElementById('app')!

async function boot() {
  if (params.has('gallery')) {
    const { mountGallery } = await import('./home/gallery')
    mountGallery(root, params.get('gallery')!)
    return
  }
  const { mountApp } = await import('./ui/app')
  mountApp(root, params)
}

declare global {
  interface Window {
    /** Both are defined by the stale-cache guard inline in index.html. */
    __erasRecover?: (err: unknown) => boolean
    __erasBooted?: () => void
  }
}

boot().then(
  () => window.__erasBooted?.(),
  (err) => {
    // A chunk deleted by a deploy: the guard reloads once from a fresh URL.
    // Anything else is a real failure and must stay visible.
    if (!window.__erasRecover?.(err)) throw err
  },
)
