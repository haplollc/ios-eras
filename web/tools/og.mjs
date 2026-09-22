// Builds web/public/og.png (1200 x 630) from real renders of the site:
// four eras side by side on white under the title.
import { createServer } from 'vite'
import { chromium } from 'playwright'

const HERE = new URL('..', import.meta.url).pathname
const OUT = process.argv[2] ?? `${HERE}public/og.png`
const YEARS = [2007, 2012, 2019, 2026]
const server = await createServer({ root: HERE, server: { port: 0, host: '127.0.0.1' }, logLevel: 'error' })
await server.listen()
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })

// Each phone is the stage row of a ?capture=1 page, clipped to the phone and
// scaled down; the type is the site's own.
const CLIP_W = 326, CLIP_H = 648, SCALE = 0.63
const cell = Math.round(CLIP_W * SCALE)
const gap = 40
const rowW = YEARS.length * cell + (YEARS.length - 1) * gap
const x0 = Math.round((1200 - rowW) / 2)

const phones = YEARS.map((y, i) => `
  <div class="phone" style="left:${x0 + i * (cell + gap)}px">
    <div class="clip">
      <iframe src="${base}?page=home&year=${y}&capture=1" scrolling="no"></iframe>
    </div>
    <div class="year">${y}</div>
  </div>`).join('')

await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1200px; height: 630px; background: #fff; overflow: hidden;
    font-family: system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #0b0b0c; }
  .title { position: absolute; top: 40px; left: 0; width: 100%; text-align: center;
    font-size: 58px; font-weight: 750; letter-spacing: -0.028em; }
  .sub { position: absolute; top: 116px; left: 0; width: 100%; text-align: center;
    font-size: 25px; font-weight: 450; color: rgba(60,60,67,0.62); letter-spacing: -0.01em; }
  .phone { position: absolute; top: 172px; width: ${cell}px; }
  .clip { width: ${cell}px; height: ${Math.round(CLIP_H * SCALE)}px; overflow: hidden; }
  iframe { width: 440px; height: 956px; border: 0; display: block;
    transform: scale(${SCALE}) translate(${-(440 - CLIP_W) / 2}px, -104px); transform-origin: 0 0; }
  .year { margin-top: 10px; text-align: center; font-size: 20px; font-weight: 600;
    color: rgba(60,60,67,0.5); font-variant-numeric: tabular-nums; }
</style></head><body>
  <div class="title">iOS Eras</div>
  <div class="sub">Twenty years of iPhone home screens, redrawn and morphing</div>
  ${phones}
</body></html>`)
await page.waitForTimeout(2500)
// Drawn at 2x and written at 1200x630: `scale: 'css'` lets the browser
// resample, so the type and the icons stay crisp at card size.
await page.screenshot({ path: OUT, scale: 'css' })
console.log('wrote', OUT)
await browser.close()
await server.close()
