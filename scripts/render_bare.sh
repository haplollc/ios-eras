#!/bin/zsh
# Frameless hero: cut the 9:16 band straight out of a Pro Max simulator
# recording (1320x2868), scale it to 1080x1920 at 60 fps, then lay the year
# ticks on it. The page must have been recorded in demo mode, which confines
# the layout to that band.
#
# usage: render_bare.sh <raw.mp4> <out.mp4> <year_count> [trim seconds] [speed]
# speed: how much faster than the capture the video plays; use it with a
# walk recorded at UIC_DEMO_PACE=<speed> to get a full frame rate from a
# heavy scene. Trim is in capture seconds.
set -e
RAW="$1"; OUT="$2"; YEARS="$3"; TRIM="${4:-0}"; SPEED="${5:-1}"
HERE="$(cd "$(dirname "$0")" && pwd)"
W=1320; H=2868
BAND_H=$(( W * 16 / 9 ))          # 2346 (must be even)
BAND_Y=$(( (H - BAND_H) / 2 ))    # 261
TMP="${OUT%.mp4}_silent.mp4"
ffmpeg -v error -y -ss "$TRIM" -i "$RAW" \
  -vf "setpts=PTS/${SPEED},fps=60,crop=${W}:${BAND_H}:0:${BAND_Y},scale=1080:1920:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 17 -movflags +faststart -an "$TMP"
# The ruler sits in the bottom of the band: its indicator is the tall dark
# column add_ticks.py looks for (coordinates are in raw-recording pixels).
RULER_TOP=$(( BAND_Y + BAND_H - 18*3 - 78*3 ))
RULER_BOTTOM=$(( BAND_Y + BAND_H - 18*3 - 22*3 ))
# Sample the capture as densely as the output needs: 60 fps of video.
SCAN_FPS=$(python3 -c "print(max(10, round(60 / $SPEED)))")
python3 "$HERE/add_ticks.py" "$RAW" "$TMP" "$OUT" "$YEARS" --trim "$TRIM" --speed "$SPEED" --fps "$SCAN_FPS" --band "$RULER_TOP" "$RULER_BOTTOM" --track 66 1254
rm -f "$TMP"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of default=nw=1 "$OUT"
