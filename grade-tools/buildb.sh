cd /tmp/claude-0/-home-user-Inaam-Qarz/ad8d477a-9732-5db0-bbb5-c05a22579178/scratchpad
for s in "$@"; do python3 make_big.py $s >/dev/null && APP_MB=3.0 python3 gen.py cfg_$s.json 2>&1 | grep -E "MB|Error|rror" | tail -2; done
