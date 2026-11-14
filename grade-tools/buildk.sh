cd /tmp/claude-0/-home-user-Inaam-Qarz/ad8d477a-9732-5db0-bbb5-c05a22579178/scratchpad
for d in "$@"; do APP_MB=1.5 python3 gen.py cfg_$d.json 2>&1 | grep -E "MB|Error|error" | tail -2; done
