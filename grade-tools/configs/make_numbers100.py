import json
exec(open('make_read.py').read().split('NL=')[0])
DG='٠١٢٣٤٥٦٧٨٩'; ar=lambda x:''.join(DG[int(c)] for c in str(x))
U=['','وَاحِدٌ','اثْنَانِ','ثَلَاثَةٌ','أَرْبَعَةٌ','خَمْسَةٌ','سِتَّةٌ','سَبْعَةٌ','ثَمَانِيَةٌ','تِسْعَةٌ']
TENS={2:'عِشْرُونَ',3:'ثَلَاثُونَ',4:'أَرْبَعُونَ',5:'خَمْسُونَ',6:'سِتُّونَ',7:'سَبْعُونَ',8:'ثَمَانُونَ',9:'تِسْعُونَ'}
TEEN={11:'أَحَدَ عَشَرَ',12:'اثْنَا عَشَرَ',13:'ثَلَاثَةَ عَشَرَ',14:'أَرْبَعَةَ عَشَرَ',15:'خَمْسَةَ عَشَرَ',16:'سِتَّةَ عَشَرَ',17:'سَبْعَةَ عَشَرَ',18:'ثَمَانِيَةَ عَشَرَ',19:'تِسْعَةَ عَشَرَ'}
def word(n):
  if n<10: return U[n]
  if n==10: return 'عَشَرَةٌ'
  if n<20: return TEEN[n]
  if n==100: return 'مِئَةٌ'
  t,u=divmod(n,10)
  return TENS[t] if u==0 else f'{U[u]} وَ{TENS[t]}'
ARTS=['apple','banana','strawberry','orange','fish','star' if False else 'sunstar','balloon:#ff6b8a','bee','ballfront' if False else 'beachball','duck']
items=[[ar(n),word(n),ARTS[n-1] if n<=10 else 'sunstar',n,str(n)] for n in range(1,21)]
acts=[]
for t in range(2,10):
  lo=t*10+1; hi=t*10+10
  acts.append({"type":"tens","title":f"مِنْ {ar(lo)} إِلَى {ar(hi)}","rows":[[ar(n),word(n)] for n in range(lo,hi+1)]})
acts.append({"type":"tens","title":"أَعُدُّ بِالعَشَرَاتِ","rows":[[ar(n),word(n)] for n in range(10,101,10)]})
acts.append(FC("أَعْرِفُ أَعْدَادِي",["🔢 نَكْتُبُ الأَعْدَادَ بِعَشَرَةِ أَرْقَامٍ: ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩","🔟 كُلُّ عَشَرَةِ آحَادٍ تَصِيرُ عَشَرَةً وَاحِدَةً.","✨ أَوَّلُ عَدَدٍ مِنْ رَقْمَيْنِ هُوَ: ١٠","💯 المِئَةُ عَشْرُ عَشَرَاتٍ."]))
base=json.load(open('cfg_safety.json'))
c=dict(base); c.pop('grade',None)
c.update(dict(dir="ginti-book",prefix="Arqam-1-100",title="أعدادي من ١ إلى ١٠٠",artmod="ginti-art",layout="k17",theme="k17",h=200,t1="أَعْدَادِي",t2="مِنْ ١ إِلَى ١٠٠",s1="#1f4a8a",s2="#c0302a",
 csub="أَقْرَأُ الأَعْدَادَ وَأَعُدُّ بِأَلْوَانٍ جَمِيلَةٍ",cen="Numbers 1 to 100",coverTop=["apple","sunstar","bee"],coverBot=["beachball","duck","balloon:#ff6b8a","fish"],ownerArt="abacus" if False else "blocks",ownerMini=["apple","bee","sunstar"],
 noteP="يَقْرَأُ طِفْلُكُمْ فِي هٰذَا الكِتَابِ الأَعْدَادَ مِنْ وَاحِدٍ إِلَى مِئَةٍ: لِكُلِّ عَدَدٍ مِنْ ١ إِلَى ٢٠ صَفْحَةٌ بِلَوْنٍ مُخْتَلِفٍ فِيهَا العَدَدُ وَاسْمُهُ وَصُوَرٌ أَوْ دَوَائِرُ لِلْعَدِّ، ثُمَّ الأَعْدَادُ حَتَّى المِئَةِ عَشَرَةً عَشَرَةً 🔢",
 noteLi=["عُدُّوا الصُّوَرَ مَعَ طِفْلِكُمْ بِأَصَابِعِهِ.","اقْرَؤُوا اسْمَ العَدَدِ بِصَوْتٍ وَاضِحٍ.","عُدُّوا مَعَهُ الأَشْيَاءَ فِي البَيْتِ."],noteMini=["apple","sunstar","bee"],ovTitle="أَعْدَادِي مِنْ ١ إِلَى ٢٠",chip1=["",""],chip2=["",""],extraCss="",
 noteLast="اقْرَؤُوا الكِتَابَ مَعَهُ صَفْحَةً صَفْحَةً، ثُمَّ امْنَحُوهُ الشَّهَادَةَ!",items=items,acts=acts,
 certP="لِأَنَّهُ قَرَأَ الأَعْدَادَ مِنْ وَاحِدٍ إِلَى مِئَةٍ",certArts=["apple","medal","sunstar"],
 blurb="كِتَابٌ مُلَوَّنٌ لِلْقِرَاءَةِ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَادِ يُعَلِّمُ الطِّفْلَ الأَعْدَادَ مِنْ وَاحِدٍ إِلَى مِئَةٍ.",
 blurbLi=["مِنْ ١ إِلَى ٢٠: لِكُلِّ عَدَدٍ صَفْحَةٌ بِلَوْنٍ مُخْتَلِفٍ","صُوَرٌ وَدَوَائِرُ لِلْعَدِّ","مِنْ ٢١ إِلَى ١٠٠ بِأَسْمَائِهَا","العَدُّ بِالعَشَرَاتِ، وَشَهَادَةٌ"],
 en2="Numbers 1 to 100 – a colourful reading book for kids",backArts=["apple","bee","sunstar","duck"],cover="--h:200;background:#fff",
 header='Builds "أعدادي من ١ إلى ١٠٠" – colourful numbers 1–100 reading book – A4 portrait.'))
print(len(items)+len(acts)+6)
json.dump(c,open('cfg_ginti.json','w'),ensure_ascii=False,indent=1)
open('text_ginti.txt','w').write('\n'.join([f"{i[0]} = {i[1]}" for i in items]+[a['title']+': '+' ; '.join(' '.join(r) if isinstance(r,list) else r for r in a['rows']) for a in acts]+[c['noteP'],c['certP'],c['blurb']]+c['blurbLi']+c['noteLi']))
