# bash build100.sh N... : build + layout check
cd /tmp/claude-0/-home-user-Inaam-Qarz/ad8d477a-9732-5db0-bbb5-c05a22579178/scratchpad
for n in "$@"; do L=$(python3 make_100.py $n) || { echo "MAKE FAIL $n"; continue; }; s=$(echo $L | cut -d' ' -f2); d=$(echo $L | cut -d' ' -f3)
  APP_MB=2.5 python3 gen.py c100/cfg_$s.json 2>&1 | grep -E "MB|rror" | tail -1; node check_layout.js $d > c100/layout_$s.txt; echo "$n $s $(head -1 c100/layout_$s.txt) ($(wc -l < c100/layout_$s.txt) lines)"; done
