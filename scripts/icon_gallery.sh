#!/bin/zsh
# Build the app into a private derived-data folder, install it on one
# simulator, and capture the icon gallery (UIC_ICON_PREVIEW) for each app
# named, so one design pass can be checked against the real icons.
#
# usage: icon_gallery.sh <SIM_UDID> <build tag> <out dir> <app name>...
# e.g.   icon_gallery.sh 9542DA3F-... dock /tmp/gallery Phone Mail Safari
#
# Output: <out dir>/<App>.png (full res) and <out dir>/<App>@0.5.png.
# Exit code 2 = build failed (log in <out dir>/build.log).
set -u
SIM="$1"; TAG="$2"; OUT="$3"; shift 3
PROJ="$(cd "$(dirname "$0")/../ios" && pwd)"
mkdir -p "$OUT"
cd "$PROJ"
xcodebuild -project iOSEras.xcodeproj -scheme iOSEras \
  -destination "platform=iOS Simulator,id=$SIM" \
  -derivedDataPath "build/dd_$TAG" build > "$OUT/build.log" 2>&1
if ! grep -q "BUILD SUCCEEDED" "$OUT/build.log"; then
  grep -E "error:" "$OUT/build.log" | head -20
  exit 2
fi
APP=$(find "build/dd_$TAG/Build/Products" -name "iOSEras.app" -maxdepth 2 | head -1)
xcrun simctl bootstatus "$SIM" -b >/dev/null 2>&1
xcrun simctl install "$SIM" "$APP"
for NAME in "$@"; do
  xcrun simctl terminate "$SIM" com.haplo.iOSEras 2>/dev/null
  SIMCTL_CHILD_UIC_OPEN="Home Screen Eras" SIMCTL_CHILD_UIC_ICON_PREVIEW="$NAME" \
    xcrun simctl launch "$SIM" com.haplo.iOSEras >/dev/null
  SAFE=$(echo "$NAME" | tr ' ' '_')
  # A cold launch can take ten seconds or more: keep shooting until the
  # page has drawn (the launch screen is pure white).
  for TRY in $(seq 1 14); do
    python3 -c "import time; time.sleep(2.0)"
    xcrun simctl io "$SIM" screenshot "$OUT/$SAFE.png" >/dev/null 2>&1
    READY=$(python3 - "$OUT/$SAFE.png" <<'PY'
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('L')
print(1 if sum(im.get_flattened_data())/(im.width*im.height) < 248 else 0)
PY
)
    [ "$READY" = "1" ] && break
  done
  # a half-size copy is plenty to look at and much cheaper to read
  python3 - "$OUT/$SAFE.png" <<'PY'
import sys
from PIL import Image
p=sys.argv[1]; im=Image.open(p).convert('RGB')
im.crop((0, 180, im.width, 2400)).resize((im.width//2, (2400-180)//2), Image.LANCZOS).save(p.replace('.png','@0.5.png'))
PY
  echo "captured $OUT/$SAFE@0.5.png"
done
xcrun simctl terminate "$SIM" com.haplo.iOSEras 2>/dev/null
