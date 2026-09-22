// Screenshot any page state at the iOS capture scale (440 x 956 pt @3x by
// default), starting its own Vite dev server on a free port.
//
//   node tools/shot.mjs <out dir> <name>=<query> [<name>=<query> ...]
//   node tools/shot.mjs /tmp/shots home2013="?page=home&year=2013&capture=1"
//
// Options (env): SHOT_W=440 SHOT_H=956 SHOT_SCALE=3 SHOT_WAIT=600 (ms after load)
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const [outDir, ...pairs] = process.argv.slice(2)
if (!outDir || pairs.length === 0) {
  console.error('usage: node tools/shot.mjs <out dir> <name>=<query> ...')
  process.exit(1)
}
mkdirSync(outDir, { recursive: true })
const server = await createServer({ root: path.join(here, '..'), server: { port: 0, host: '127.0.0.1' }, logLevel: 'error' })
await server.listen()
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: +(process.env.SHOT_W ?? 440), height: +(process.env.SHOT_H ?? 956) },
  deviceScaleFactor: +(process.env.SHOT_SCALE ?? 3),
})
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
for (const pair of pairs) {
  const i = pair.indexOf('=')
  const name = pair.slice(0, i)
  const query = pair.slice(i + 1)
  await page.goto(base + query, { waitUntil: 'networkidle' })
  await page.waitForTimeout(+(process.env.SHOT_WAIT ?? 600))
  const file = path.join(outDir, `${name}.png`)
  await page.screenshot({ path: file })
  console.log('wrote', file)
}
if (errors.length) console.log('PAGE ERRORS:\n' + errors.join('\n'))
await browser.close()
await server.close()
