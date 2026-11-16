# python3 make_100.py N [N...]  (1-based book numbers) : c100/content_<slug>.json -> cfg + art module + PlayStore
import json, sys, os
T=[l.strip().split('|') for l in open('c100/topics.txt') if l.strip()]
CB=json.load(open('c100/combos.json'))
FD='file:///home/user/Inaam-Qarz/arabic-kids-book/fonts/'
COVER={1:"border-radius:50%",2:"border-radius:60px",3:"border-radius:300px 300px 30px 30px",4:"border-radius:58% 42% 60% 40%/45% 55% 45% 55%",5:"clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)",6:"border-radius:8px;transform:rotate(-3deg);box-shadow:0 20px 40px rgba(0,0,0,.25)",7:"border-radius:300px",8:"border-radius:40px;border:26px solid #3a3f4f",9:"clip-path:polygon(50% 0,100% 12%,100% 58%,50% 100%,0 58%,0 12%)",10:"clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)",11:"clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)",12:"border-radius:50%;border:16px dotted rgba(255,255,255,.9)"}
base=json.load(open('cfg_safety.json')); base.pop('grade',None)
def slugdir(s): return f'{s}-kids-book'
for n in map(int,sys.argv[1:]):
  slug,ar,en=T[n-1]; X=dict(CB[n-1]); h=X['hue']; c0=json.load(open(f'c100/content_{slug}.json'))
  d=slugdir(slug); p=''.join(w.capitalize() for w in slug.replace('_','-').split('-'))+'-Kids'
  fb,ft=X['fbn'],X['ftn']
  css=f"@font-face{{font-family:'{fb}';src:url('{FD}{fb}.ttf')}}@font-face{{font-family:'{ft}';src:url('{FD}{ft}.ttf')}}"
  css+=f".page{{--fb:'{fb}';--ft:'{ft}'}}.page,.page p,.page li,.page span,.page b,.page small,.page em,.page div{{font-family:'{fb}',sans-serif}}"
  css+=f".page h1,.page h2,.page h3,.t3d,.ttl,.k17word{{font-family:'{ft}',sans-serif !important}}"
  css+=f".page .story p,.page .st p,.page .fc li,.page .qa p,.page .refc p{{line-height:1.9 !important}}"
  # cover: bg colour + shape behind the title
  shape=COVER[X['pic']]; w=560 if X['pic'] in (1,12,10,11) else 620
  css+=f".cover{{background:hsl({h},65%,{30 if X['bg']==10 else 55}%) !important}}.cover::before{{content:'';position:absolute;left:50%;top:180px;width:{w}px;height:{560 if X['pic']!=7 else 420}px;margin-left:-{w//2}px;background:hsl({h},80%,92%);{shape}}}.cover h1{{margin-top:{300 if X['pic']!=7 else 260}px !important}}"
  css+=f".back{{background:hsl({h},65%,55%) !important}}"
  L=max(len(c0['t1']),len(c0['t2']))
  fs=104 if L<=12 else 88 if L<=18 else 74 if L<=26 else 62
  css+=f".cover h1{{font-size:{fs}px !important;line-height:1.75 !important}}.cover h1 .t3d{{line-height:1.6 !important}}"

  c=dict(base)
  for k in ['title','t1','t2','csub','cen','ownerArt','ownerMini','coverTop','coverBot','noteP','noteLi','noteMini','ovTitle','f1L','f2L','items','acts','certP','certArts','blurb','blurbLi','backArts','en2']: c[k]=c0[k]
  c.update({"dir":d,"prefix":p,"layout":"kx","theme":"kx","X":X,"artmod":slug+'-art',"h":h,"s1":f"hsl({h},60%,25%)","s2":f"hsl({(h+180)%360},60%,30%)","chip1":["",""],"chip2":["",""],"extraCss":css,"cover":f"--h:{h};background:#fff",
    "noteLast":"اقْرَؤُوا الكِتَابَ مَعَهُ صَفْحَةً صَفْحَةً، ثُمَّ امْنَحُوهُ الشَّهَادَةَ!","header":f'Builds "{c0["title"]}" – 40-page Arabic reading book for kids – A4 portrait.'})
  nP=len(c['items'])+len(c['acts'])+6; assert nP==40,(slug,nP)
  json.dump(c,open(f'c100/cfg_{slug}.json','w'),ensure_ascii=False,indent=1)
  os.makedirs(f'/home/user/Inaam-Qarz/{d}/src',exist_ok=True)
  open(f'/home/user/Inaam-Qarz/{d}/src/{slug}-art.js','w').write("// Art: shared 3D art chain.\nmodule.exports = require('../../arabic-kids-book/src/extra100-art');\n")
  open(f'/home/user/Inaam-Qarz/{d}/{p}-PlayStore.txt','w').write(f"اسم الكتاب (عربي): {c0['t1']} {c0['t2']}\nBook name (English): {c0['cen']} – Arabic reading book for kids\n\nالوصف القصير:\n{c0['playShort']}\n\nالوصف الكامل:\n{c0['playFull']}\n")
  print(n,slug,d,p)
