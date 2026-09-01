#!/usr/bin/env bash
# Gera prévias curtas (até 45 s, com fade) a partir das faixas completas.
# Uso: bash scripts/make-album-previews.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/server/private/digital/musicas-neuroconectivas"
OUT="$ROOT/assets/audio/album"
MAX=45
FADE_START=40
FADE_DUR=5

if ! command -v ffmpeg >/dev/null; then
  echo "Instale o ffmpeg para gerar as prévias." >&2
  exit 1
fi

mkdir -p "$OUT"
tracks=(
  "1:01-fluxo-da-vida-fluir-dentro-de-mim.mp3"
  "2:02-eu-me-perdoo.mp3"
  "3:03-expresse-sua-arte.mp3"
  "4:04-a-alma-canta.mp3"
  "5:05-beleza-da-alma-voltou-a-cantar.mp3"
  "6:06-a-musica-e-a-chave.mp3"
  "7:07-e-preciso-uniao.mp3"
  "8:08-declic.mp3"
)

for item in "${tracks[@]}"; do
  n="${item%%:*}"
  file="${item##*:}"
  src="$SRC/$file"
  if [[ ! -f "$src" ]]; then
    echo "Falta $src" >&2
    exit 1
  fi
  dur="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")"
  clip="$MAX"
  start="$FADE_START"
  fade="$FADE_DUR"
  if awk "BEGIN {exit !($dur < $MAX)}"; then
    clip="$dur"
    start="$(awk "BEGIN {s=$dur-2; if (s<1) s=1; print s}")"
    fade="2"
  fi
  ffmpeg -y -i "$src" -map 0:a -t "$clip" -af "afade=t=out:st=${start}:d=${fade}" \
    -c:a libmp3lame -b:a 128k -map_metadata -1 "$OUT/preview-${n}.mp3"
  echo "prévia $n: $OUT/preview-${n}.mp3"
done
