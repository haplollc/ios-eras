#!/usr/bin/env python3
"""Lay a click on every year change of a ruler recording.

simctl recordings are silent, so the ticks are recovered from the picture:
the ruler's indicator is the only tall, near-black column in the tick band,
so its x gives the continuous position, and a click lands each time the
nearest year changes.

usage: add_ticks.py <raw_recording.mp4> <hero.mp4> <out.mp4> <year_count>
       [--band Y0 Y1] [--track X0 X1] [--speed S] [--trim T]
Geometry is in raw-recording pixels (1320x2868).
"""
import argparse, math, struct, subprocess, sys, wave, os, tempfile, random

ap = argparse.ArgumentParser()
ap.add_argument("raw"); ap.add_argument("hero"); ap.add_argument("out")
ap.add_argument("years", type=int)
ap.add_argument("--band", nargs=2, type=int, default=[2490, 2650])
ap.add_argument("--track", nargs=2, type=int, default=[66, 1254])
ap.add_argument("--speed", type=float, default=1.0)
ap.add_argument("--trim", type=float, default=0.0)
ap.add_argument("--fps", type=int, default=60)
a = ap.parse_args()

y0, y1 = a.band
h = y1 - y0
W = 1320
# One grey strip per frame, flattened to constant frame rate first: a still
# screen emits no frames at all in a simctl recording.
cmd = ["ffmpeg", "-v", "error", "-i", a.raw, "-vf",
       f"fps={a.fps},crop={W}:{h}:0:{y0},format=gray", "-f", "rawvideo", "-"]
raw = subprocess.run(cmd, capture_output=True, check=True).stdout
frame = W * h
count = len(raw) // frame
x0, x1 = a.track
ticks, last, positions = [], None, []
for f in range(count):
    buf = raw[f * frame:(f + 1) * frame]
    best, best_x = 0, None
    for x in range(max(x0 - 6, 0), min(x1 + 6, W)):
        dark = sum(1 for y in range(0, h, 2) if buf[y * W + x] < 60)
        if dark > best:
            best, best_x = dark, x
    if best_x is None or best < h * 0.18:
        positions.append(None)
        continue
    pos = (best_x - x0) / (x1 - x0) * (a.years - 1)
    positions.append(pos)
    index = min(max(round(pos), 0), a.years - 1)
    if last is not None and index != last:
        ticks.append((f / a.fps, index))
    last = index

print(f"{count} frames, {len(ticks)} ticks")
for t, i in ticks:
    print(f"  {t:6.2f}s -> year index {i}")

# Map raw-recording time to hero time (TRIM off the front, then SPEED).
def hero_time(t):
    return (t - a.trim) / a.speed

dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "csv=p=0", a.hero], capture_output=True, text=True).stdout.strip())
rate = 48000
samples = [0.0] * int(dur * rate + rate // 2)
rng = random.Random(7)
for t, index in ticks:
    ht = hero_time(t)
    if ht < 0 or ht > dur:
        continue
    start = int(ht * rate)
    # A detent: a few ms of filtered noise for the contact, under a short
    # pitched body that climbs a little with the years.
    freq = 1500 + 40 * index
    prev = 0.0
    for n in range(int(0.030 * rate)):
        tt = n / rate
        noise = rng.uniform(-1, 1)
        prev = prev * 0.55 + noise * 0.45
        click = prev * math.exp(-tt / 0.0016) * 0.55
        body = math.sin(2 * math.pi * freq * tt) * math.exp(-tt / 0.006) * 0.35
        if start + n < len(samples):
            samples[start + n] += click + body

tmp = tempfile.mkdtemp()
wav = os.path.join(tmp, "ticks.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
    w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, s)) * 32000)) for s in samples))

subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.hero, "-i", wav, "-map", "0:v", "-map", "1:a",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", a.out], check=True)
print("wrote", a.out)
