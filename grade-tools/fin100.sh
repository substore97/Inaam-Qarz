# bash fin100.sh N... : finish (README, .gitignore, CLAUDE.md line, commit, push) for built books
cd /tmp/claude-0/-home-user-Inaam-Qarz/ad8d477a-9732-5db0-bbb5-c05a22579178/scratchpad
for n in "$@"; do L=$(sed -n "${n}p" c100/topics.txt); s=${L%%|*}; c=c100/cfg_$s.json
 d=$(python3 -c "import json;c=json.load(open('$c'));print(c['dir'],c['prefix'],c['title'],sep='|')")
 IFS='|' read D P T <<< "$d"; E=$(echo "$L" | cut -d'|' -f3)
 [ -f /home/user/Inaam-Qarz/$D/$P-APP.pdf ] && grep -q "LAYOUT OK" c100/layout_$s.txt && bash finish.sh $D $P "$T" "$E, reading-only, kx combo $n" 40 | tail -1 || echo "SKIP $n $s"; done
