# finish.sh <dir> <prefix> <arabic title> <english topic> <pages>   (TXT must already exist)
set -e
cd /home/user/Inaam-Qarz/$1
python3 - "$2-PlayStore.txt" <<'PY'
import sys
t=open(sys.argv[1]).read()
s=t.split('الوصف القصير:\n')[1].split('\n')[0]; f=t.split('الوصف الكامل:\n')[1].strip()
print('short',len(s),'full',len(f)); assert len(s)<=80 and len(f)<=4000
PY
printf 'build/\n' > .gitignore
printf '# %s\n\nArabic kids picture book (%s) in 3D style, %s A4 pages.\n\nBuild: `node src/build.js && BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js %s "%s"`\n\nOutputs: `%s-APP.pdf` (Full HD, ≈4 MB) and `-PlayStore.txt` (set `PRINT=1` to also make the print PDF and cover).\n' "$3" "$4" "$5" "$2" "$3" "$2" > README.md
cd ..
grep -q "^- \`$1/\`" CLAUDE.md || python3 - "$1" "$3" "$4" "$5" <<'PY'
import sys
d,t,e,p=sys.argv[1:]
c=open('CLAUDE.md').read(); m='\n\nGrade-book generator'
c=c.replace(m, f'\n- `{d}/`: {t} ({e}), {p} pages'+m,1); open('CLAUDE.md','w').write(c)
PY
git add "$1" CLAUDE.md
git commit -qm "Add $1: $3 ($4), $5 pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014DvBbag7pTFed2adPFa1CM"
git push -q -u origin ccr-26b91810-bz51xw && git log --oneline -1
