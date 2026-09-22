# Scripts

Run these from the repo root with the iOS app built from `ios/iOSEras.xcodeproj`
(bundle id `com.haplo.iOSEras`) on an iPhone 17 Pro Max simulator. Set
`SIM` in `record_demo.sh` to your simulator's UDID.

Tools for turning a component's scripted demo walk into a Twitter hero.

- `record_demo.sh <component> <DEMO_ENV_VAR> <seconds> <out.mp4>` records the
  Pro Max simulator while the app launches straight onto a component
  (`UIC_OPEN`) with its scripted walk on (e.g. `UIC_ERAS_DEMO`, `UIC_HOME_DEMO`).
  In demo mode the eras pages confine their layout to a 9:16 band of the
  screen so a frameless video can be cut straight from the capture.
- `render_bare.sh <raw.mp4> <out.mp4> <year_count> [trim]` cuts that 9:16 band,
  scales it to 1080x1920 @60 fps and lays the year ticks on it. No device frame.
  (For the framed look use a device-frame renderer
  with `HERO_BARE=1` and then `add_ticks.py` with the same TRIM.)
- `add_ticks.py <raw.mp4> <hero.mp4> <out.mp4> <year_count> [--trim T] [--speed S] [--band Y0 Y1]`
  reads the ruler indicator out of the raw recording, finds every year
  change, and lays a synthesised ratchet click on the rendered hero at each
  one (simctl recordings are silent).
- `icon_gallery.sh <SIM_UDID> <build tag> <out dir> <app>...` builds into a
  private derived-data folder, installs on one simulator and captures
  `UIC_ICON_PREVIEW=<app>` (one app at every year, with that year's chrome)
  for checking icon designs against the real icons.

Typical run for the eras components:

```
scripts/record_demo.sh "Button Eras" UIC_ERAS_DEMO 27 /tmp/rec.mp4      # add SIMCTL_CHILD_UIC_ERAS_BARE=1 for the button-only page
scripts/render_bare.sh /tmp/rec.mp4 ~/Desktop/button-eras-hero.mp4 20 3.7
```

`UIC_ERAS_YEAR=2013` / `UIC_HOME_YEAR=2013` open a component on one year for stills;
`UIC_ERAS_BARE=1` shows the button alone on a swatch of that year's screen.

## Using your own icon images (Home Screen Eras)

Drop PNGs into `ios/iOSEras/HomeIconImages/` named `<App>_<year>.png`
(spaces as underscores), e.g. `Safari_2013.png`, `App_Store_2017.png`,
`Find_My_2019.png`. On the next build each one replaces the drawn icon for
that app from that year until the next image or redesign. Use the full tile as
it appeared on the phone that year (a square image; the app clips the corners,
and adds no gloss on top of an image). App ids are the `HomeApp("…")` names in
`ios/iOSEras/Components/HomeIcons+*.swift`. Check a set with:

```
scripts/icon_gallery.sh <SIM_UDID> mytag /tmp/gallery Safari "App Store"
```

## Home Screen Eras: spacing notes

Every position on the home screen comes from `HomeMetrics.measured(year)` in
`ios/iOSEras/Components/HomeErasTimeline.swift`: icon size, column centres
and pitch, first-row top and row pitch, label offset, page dots or Search
pill, dock top/gap/inset/corner, dock icon position and whether the dock
carries labels. All are fractions of the screen's width, measured with
PIL on a real home-screen screenshot of each version (Wikipedia's per-version
captures and Apple's user-guide figures), then re-measured against our
captures until every metric sat within 3 pt.

Deliberate departures from the screenshots: a full page of stock apps (plus a
Utilities/Extras folder) where Apple's default had widgets; 2007 uses the
iPhone OS 1.1.3 four-row spacing; 2018 and 2021 use the iPhone XS / 13 Pro
geometry (their screenshots are an XS Max and a 13 mini).

Checking hooks: `UIC_HOME_YEAR=2013` opens a year, `UIC_HOME_POS=14.5` opens
part-way between two years (to inspect a morph).
