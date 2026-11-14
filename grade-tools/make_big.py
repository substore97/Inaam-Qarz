# python3 make_big.py slug [slug...] : big/content_<slug>.json -> cfg_<slug>.json (+ art module)
import json, sys, os
M={'animals40':('animals-encyclopedia-book','Mawsuat-Al-Hayawanat','k18'),'sea40':('sea-world-book','Alam-Al-Bihar','k19'),'space40':('space-secrets-book','Asrar-Al-Fadaa','k20'),'nature40':('nature-wonders-book','Ajaib-At-Tabia','k21'),
 'forest40':('forest-tales-book','Hikayat-Al-Ghaba','k22'),'bedtime40':('bedtime-book','Hikayat-Qabl-An-Nawm','k23'),'robo40':('robo-book','Mughamarat-Robo','k24'),'farm40':('happy-farm-book','Al-Mazraa-As-Saida','k25'),
 'anbiya40':('anbiya-stories-book','Qisas-Al-Anbiya','k26'),'akhlaq40':('akhlaq-book','Akhlaq-Al-Muslim','k27'),'asmaa40':('asmaa-book','Asmaa-Allah-Al-Husna','k28'),'sara40':('sara-diary-book','Yawmiyyat-Sara','k29'),
 'riddles40':('riddles-book','Alghaz-Man-Ana','k30'),'didyouknow40':('didyouknow-book','Hal-Taalam','k31'),'science40':('experiments-book','Tajarib-Ilmiyya','k32'),'qamus40':('picture-dictionary-book','Qamusi-Al-Musawwar','k33'),
 'fruits40':('fruits-encyclopedia-book','Mawsuat-Al-Fawakih','k34'),'transport40':('transport-book','Wasail-An-Naql','k35'),'weather40':('weather-book','At-Taqs-wal-Fusul','k36'),'jobs40':('when-i-grow-book','Indama-Akbar','k37')}
base=json.load(open('cfg_safety.json'))
for slug in sys.argv[1:]:
  d,p,lay=M[slug]; c0=json.load(open(f'big/content_{slug}.json'))
  c=dict(base); c.pop('grade',None)
  for k in ['title','t1','t2','csub','cen','ownerArt','ownerMini','coverTop','coverBot','noteP','noteLi','noteMini','ovTitle','f1L','f2L','items','acts','certP','certArts','blurb','blurbLi','backArts','en2']: c[k]=c0[k]
  c.update({"dir":d,"prefix":p,"layout":lay,"theme":lay,"artmod":d.replace('-book','')+'-art',"h":200,"s1":"#2b2350","s2":"#c0302a","chip1":["",""],"chip2":["",""],"extraCss":"","cover":"--h:200;background:#fff",
    "noteLast":"اقْرَؤُوا الكِتَابَ مَعَهُ صَفْحَةً صَفْحَةً، ثُمَّ امْنَحُوهُ الشَّهَادَةَ!","header":f'Builds "{c0["title"]}" – 50-page Arabic reading book for kids – A4 portrait.'})
  n=len(c['items'])+len(c['acts'])+6; assert n==50,(slug,n)
  json.dump(c,open(f'cfg_{slug}.json','w'),ensure_ascii=False,indent=1)
  os.makedirs(f'/home/user/Inaam-Qarz/{d}/src',exist_ok=True)
  open(f'/home/user/Inaam-Qarz/{d}/src/{d.replace("-book","")}-art.js','w').write("// Art for a 50-page reading book: shared 3D art chain.\nmodule.exports = require('../../science12-book/src/science12-art');\n")
  open(f'/home/user/Inaam-Qarz/{d}/{p}-PlayStore.txt','w').write(f"اسم الكتاب (عربي): {c0['t1']} {c0['t2']}\nBook name (English): {c0['cen']} – Arabic reading book for kids\n\nالوصف القصير:\n{c0['playShort']}\n\nالوصف الكامل:\n{c0['playFull']}\n")
  print(slug,d,n)
