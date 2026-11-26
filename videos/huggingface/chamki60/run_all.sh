#!/bin/bash
cd "$(dirname "$0")"
while IFS=$'\t' read -r id t p; do
  [ -s clips/$id.mp4 ] && { echo "SKIP $id"; continue; }
  if timeout 600 python3 ../run_wan.py frames/$id.png "$p" clips/$id.mp4 5 0 > clips/$id.log 2>&1; then echo "CLIP $id done"; else echo "CLIP $id FAILED: $(tail -1 clips/$id.log)"; fi
done < clips.tsv
echo "ALL FINISHED"
