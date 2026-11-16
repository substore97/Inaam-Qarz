import random, json, itertools
random.seed(7)
FB=['BalooBhaijaan2','Cairo','Alexandria','Amiri','ElMessiri','IBMPlexSansArabic','Kufam','Mada','Marhey','NotoKufiArabic','NotoNaskhArabic','PlaypenSansArabic','ReadexPro','ScheherazadeNew','Tajawal','Vazirmatn']
FT=['BalooBhaijaan2','Marhey','Kufam','ElMessiri','Alexandria','PlaypenSansArabic','NotoKufiArabic','ReadexPro','Mada','Vazirmatn','Cairo','Tajawal']
D=dict(bg=10,pic=12,ttl=10,txt=10,fac=8,pno=6,ord=6,fb=len(FB),ft=len(FT),hm=3)
def rnd():
  while True:
    c={k:random.randint(1,n) for k,n in D.items()}
    if c['bg']==10 and c['txt']==1: continue
    if c['ord'] in (5,6) and c['pic'] in (7,): continue
    return c
def dist(a,b): return sum(a[k]!=b[k] for k in D)
best=None
for trial in range(60):
  S=[]
  for i in range(100):
    cand=[rnd() for _ in range(60)]
    c=max(cand,key=lambda c:min([dist(c,s) for s in S] or [99]))
    S.append(c)
  m=min(dist(a,b) for a,b in itertools.combinations(S,2))
  if not best or m>best[0]: best=(m,S)
m,S=best
for i,c in enumerate(S): c['hue']=round(i*360/100*37)%360; c['fbn']=FB[c['fb']-1]; c['ftn']=FT[c['ft']-1]
print('min pairwise differing dims:',m)
from collections import Counter
print({k:Counter(c[k] for c in S).most_common(2) for k in ['bg','pic','ttl','fb']})
json.dump(S,open('c100/combos.json','w'),indent=0)
