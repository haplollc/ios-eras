#!/bin/zsh
# usage: record_demo.sh <component name> <demo env var> <seconds> <out.mp4>
# Records the scripted walk of one component on the Pro Max simulator.
set -e
SIM=9C89E9D8-E70E-447A-AA38-610D2ADD1808
NAME="$1"; DEMOVAR="$2"; SECS="$3"; OUT="$4"
xcrun simctl terminate $SIM com.haplo.iOSEras 2>/dev/null || true
rm -f "$OUT"
xcrun simctl io $SIM recordVideo --codec h264 --force "$OUT" &
REC=$!
python3 -c "import time; time.sleep(1.5)"
env SIMCTL_CHILD_UIC_OPEN="$NAME" SIMCTL_CHILD_${DEMOVAR}=1 xcrun simctl launch $SIM com.haplo.iOSEras
python3 -c "import time; time.sleep($SECS)"
kill -INT $REC
wait $REC 2>/dev/null || true
ffprobe -v error -show_entries format=duration:stream=width,height,avg_frame_rate -of default=nw=1 "$OUT"
