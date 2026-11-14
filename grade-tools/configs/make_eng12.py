import json
H='Circle the correct answer'
def W(t,rows): return {"type":"words","title":t,"hint":H,"rows":rows}
def TF(t,rows): return {"type":"tf","title":t,"rows":rows}
def story(t,emo,lines,arts): return {"type":"raw","title":t,"html":f'<div class="card story" style="direction:ltr;text-align:left;font-family:Fredoka"><h3>{t} {emo}</h3><p>{"<br>".join(lines)}</p></div>',"arts":arts}
FO=["🧩","Form"]; EX=["📝","Another example"]
U=[]
U.append({"title":"Mixed Conditionals","en":"الجُمَلُ الشَّرْطِيَّةُ المُخْتَلِطَةُ","icon":"clock","arts":["clock","umbrella","bigbook"],
 "intro":"Mixed conditionals join a past condition with a present result, or a present condition with a past result.","chip1":FO,"chip2":EX,
 "items":[["past → present","شَرْطٌ مَاضٍ وَنَتِيجَةٌ حَاضِرَةٌ","bigbook","If I had studied harder, I would be a doctor now.","If + past perfect, would + verb","If she had taken the map, she wouldn't be lost now."],
  ["present → past","شَرْطٌ حَاضِرٌ وَنَتِيجَةٌ مَاضِيَةٌ","umbrella","If I weren't afraid of heights, I would have climbed the tower.","If + past simple, would have + p.p.","If he were careful, he wouldn't have broken the vase."],
  ["real meaning","المَعْنَى الحَقِيقِيُّ","clock","If I had slept early, I wouldn't be tired now.","= I didn't sleep early, so I am tired now.","Mixed conditionals talk about things that are not true."]],
 "acts":[W("Choose the correct form",[["If I had eaten breakfast, I ... hungry now.",["wouldn't be","won't be"]],["If she ... the bus, she would be here now.",["hadn't missed","doesn't miss"]],["If he spoke English, he ... the job last year.",["would have got","will get"]],["If we ... the tickets, we would be at the match now.",["had bought","buy"]]]),
  W("What does it mean?",[["If I had saved money, I would have a car now.",["I didn't save money, and I don't have a car.","I saved money, and I have a car."]],["If he weren't shy, he would have spoken at the party.",["He is shy, and he didn't speak.","He isn't shy, and he spoke."]],["If they had left earlier, they would be home now.",["They didn't leave early, so they aren't home.","They left early and are home."]],["If I knew her number, I would have called her.",["I don't know her number, so I didn't call.","I know her number and I called."]]])]})
U.append({"title":"Inversion","en":"تَقْدِيمُ الفِعْلِ المُسَاعِدِ لِلتَّوْكِيدِ","icon":"stars","arts":["stars","rocket","medal"],
 "intro":"After some negative words at the start of a sentence, we put the auxiliary before the subject, like a question. It makes the sentence stronger.","chip1":FO,"chip2":EX,
 "items":[["Never have I …","لَمْ يَحْدُثْ أَبَدًا أَنْ …","stars","Never have I seen such a beautiful sky.","Never + auxiliary + subject","Never had she felt so happy."],
  ["Rarely / Seldom …","نَادِرًا مَا …","rocket","Rarely do we see snow in the desert.","Rarely + do / does + subject + verb","Seldom does he arrive late."],
  ["Not only … but also","لَيْسَ فَقَطْ … بَلْ أَيْضًا","medal","Not only did she win, but she also broke the record.","Not only + auxiliary + subject","Not only is he clever, but he is also kind."]],
 "acts":[W("Choose the correct inversion",[["Never ... such a big fish.",["have I seen","I have seen"]],["Rarely ... to bed late.",["does he go","he goes"]],["Not only ... fast, but she also swims well.",["does she run","she runs"]],["Seldom ... so quiet.",["is the class","the class is"]]]),
  W("Which sentence means the same?",[["I have never tasted such good dates.",["Never have I tasted such good dates.","Never I have tasted such good dates."]],["He rarely complains.",["Rarely does he complain.","Rarely he complains."]],["She sings and she also plays the oud.",["Not only does she sing, but she also plays the oud.","Not only she sings, but also plays the oud."]],["We seldom eat out.",["Seldom do we eat out.","Seldom we do eat out."]]])]})
U.append({"title":"Cleft Sentences","en":"جُمَلُ التَّوْكِيدِ المُقَسَّمَةُ","icon":"bigbook","arts":["bigbook","teacher","phone"],
 "intro":"Cleft sentences help us focus on one part of the sentence: It was … that / who …, or What … is ….","chip1":FO,"chip2":EX,
 "items":[["It was … who …","كَانَ … هُوَ الَّذِي …","teacher","It was my teacher who encouraged me to read.","It is / was + person + who","It was Ali who found the key."],
  ["It was … that …","كَانَ … هُوَ مَا …","phone","It was in Madinah that I met my best friend.","It is / was + thing / place / time + that","It was on Friday that we travelled."],
  ["What … is …","مَا … هُوَ …","bigbook","What I need is a good dictionary.","What + subject + verb + is / was","What she wanted was a quiet room."]],
 "acts":[W("Choose the right word",[["It was Sara ... won the prize.",["who","what"]],["It was at the airport ... I lost my bag.",["that","who"]],["... I love most is reading.",["What","It"]],["It ... my father who taught me to swim.",["was","were"]]]),
  W("Which cleft sentence is correct?",[["Focus on 'Ahmed': Ahmed broke the window.",["It was Ahmed who broke the window.","It was the window who Ahmed broke."]],["Focus on 'a rest': I need a rest.",["What I need is a rest.","What is a rest I need."]],["Focus on 'yesterday': We arrived yesterday.",["It was yesterday that we arrived.","It was we that arrived yesterday."]],["Focus on 'the noise': The noise woke me up.",["It was the noise that woke me up.","What the noise was woke me up."]]])]})
U.append({"title":"Participle Clauses","en":"جُمَلُ اسْمِ الفَاعِلِ وَاسْمِ المَفْعُولِ","icon":"runner","arts":["runner","house","book"],
 "intro":"Participle clauses make sentences shorter. We use -ing for active ideas and the past participle for passive ideas.","chip1":FO,"chip2":EX,
 "items":[["-ing clause","جُمْلَةٌ بِـ -ing","runner","Hearing the bell, the students ran out.","= When they heard the bell, …","Feeling tired, I went to bed early."],
  ["past participle clause","جُمْلَةٌ بِالتَّصْرِيفِ الثَّالِثِ","house","Built in 1900, the house is very old.","= The house, which was built in 1900, …","Written in Arabic, the book is easy for me."],
  ["Having + p.p.","Having + التَّصْرِيفُ الثَّالِثُ","book","Having finished my homework, I went out to play.","= After I had finished my homework, …","Having eaten lunch, we continued our trip."]],
 "acts":[W("Choose the correct participle",[["... the news, she started to cry.",["Hearing","Heard"]],["... in 2010, the bridge is still strong.",["Built","Building"]],["... his keys, he couldn't open the door.",["Having lost","Lost"]],["The boy ... near the window is my brother.",["standing","stood"]]]),
  W("Which sentence means the same?",[["Because I felt cold, I closed the window.",["Feeling cold, I closed the window.","Felt cold, I closed the window."]],["The cake, which was made by Mum, was delicious.",["Made by Mum, the cake was delicious.","Making by Mum, the cake was delicious."]],["After he had read the letter, he smiled.",["Having read the letter, he smiled.","Have read the letter, he smiled."]],["When she opened the box, she found a gift.",["Opening the box, she found a gift.","Opened the box, she found a gift."]]])]})
U.append({"title":"Future Perfect","en":"المُسْتَقْبَلُ التَّامُّ","icon":"clock","arts":["clock","builder","school"],
 "intro":"We use the future perfect for an action that will be finished before a time in the future, and the future perfect continuous for how long an action will have continued.","chip1":FO,"chip2":EX,
 "items":[["will have + p.p.","سَيَكُونُ قَدْ …","builder","By 2030, they will have built a new airport.","will have + past participle","By Friday, I will have finished the book."],
  ["by + time","بِحُلُولِ …","clock","By 8 o'clock, the shop will have closed.","by tomorrow / by next year / by then","By the time you arrive, we will have eaten."],
  ["will have been + -ing","سَيَكُونُ مُسْتَمِرًّا فِي …","school","Next June, I will have been studying English for ten years.","will have been + verb-ing","By noon, we will have been driving for five hours."]],
 "acts":[W("Choose the correct form",[["By next week, I ... my exams.",["will have finished","will finished"]],["By 2040, people ... on the moon.",["will have lived","have lived"]],["By 10 p.m., she ... for six hours.",["will have been working","will have work"]],["By the time we get there, the film ...",["will have started","will start already"]]]),
  W("Complete the sentence",[["By the end of this year, I ...",["will have read twenty books","have read twenty books yesterday"]],["Next month, they ... in this house for a year.",["will have been living","will be lived"]],["By the time you wake up, I ...",["will have left","had left"]],["In two hours, the plane ...",["will have landed","has landed"]]])]})
U.append({"title":"would rather & had better","en":"أُفَضِّلُ / مِنَ الأَفْضَلِ","icon":"f_calm","arts":["f_calm","raincloud","clock"],
 "intro":"We use would rather for preferences, had better for strong advice, and It's time for things that should happen now.","chip1":FO,"chip2":EX,
 "items":[["would rather","أُفَضِّلُ","f_calm","I'd rather walk than take the bus.","would rather + verb (than …)","She'd rather stay at home tonight."],
  ["had better","مِنَ الأَفْضَلِ أَنْ","raincloud","You'd better take an umbrella. It's going to rain.","had better (not) + verb","We'd better not be late."],
  ["It's time …","حَانَ الوَقْتُ","clock","It's time to go to bed.","It's time + to + verb","It's time for lunch."]],
 "acts":[W("Choose the correct form",[["I'd rather ... tea than coffee.",["drink","to drink"]],["You'd better ... your teeth.",["brush","to brush"]],["We'd better ... noise. The baby is sleeping.",["not make","don't make"]],["It's time ... home.",["to go","going"]]]),
  W("Choose the best reply",[["“Shall we eat out?”",["I'd rather eat at home.","I'd better eating at home."]],["“I have a test tomorrow.”",["You'd better study tonight.","You'd rather studying tonight."]],["“It's 11 p.m.!”",["It's time to sleep.","It's time sleeping."]],["“The road is icy.”",["We'd better drive slowly.","We'd better to drive slowly."]]])]})
S1=["It was my grandfather who taught me to love the desert.","Never have I seen a sky as full of stars as the one above his farm.","Having lived there for fifty years, he knows every hill and every tree.","If he hadn't planted those palm trees long ago, the farm wouldn't be so green today."]
S2=["By the end of this year, Huda will have finished school.","Rarely does she miss a lesson, and she would rather read than watch TV.","Encouraged by her teachers, she has decided to study medicine.","“You'd better start preparing now,” her mother told her with a smile."]
U.append({"title":"Reading Time","en":"وَقْتُ القِرَاءَةِ","icon":"v_read","arts":["v_read","book"],
 "intro":"Read the texts, then answer the questions.",
 "acts":[story("My Grandfather's Farm","🌴",S1,["palm","stars","grandpa"]),
  W("Answer",[["Who taught the writer to love the desert?",["his grandfather","his teacher"]],["How long has the grandfather lived on the farm?",["fifty years","five years"]],["Why is the farm green today?",["He planted palm trees long ago.","It rains every day."]],["“Never have I seen …” is an example of …",["inversion","a cleft sentence"]]]),
  story("Huda's Dream","🩺",S2,["girlc","doctor","bigbook"]),
  W("Answer",[["What will Huda have done by the end of the year?",["finished school","started medicine"]],["What would Huda rather do?",["read","watch TV"]],["What has she decided to study?",["medicine","engineering"]],["“Encouraged by her teachers” is a …",["participle clause","mixed conditional"]]]),
  TF("True or False?",["Huda often misses lessons.","The grandfather knows every hill and every tree.","Huda's mother gave her advice.","The farm is not green today.","The writer's teacher taught him to love the desert."])]})
c=json.load(open('cfg_eng10.json'))
cfg=json.load(open('cfg_lug12.json'))
for k in ['tocTitle','traceLabel','ovTitle','ltr']: cfg[k]=c[k]
F="Fredoka,Baloo,sans-serif"
css=c['extraCss'].split('.l10map{')[0].split('.l10h h2,')[0]
css+=(f".m12 h2,.q12,.tb12 b,.tb12 small,.lp12 b,.x12 p,.xo12 em,.hint12,.a12h h2,.a12h small,.u12band h1,.u12band small,.u12intro,.u12tiles span,.p12 small,.p12 span{{font-family:{F} !important}}"
 ".p12 em{font-family:Baloo !important}.u12band em{font-family:Baloo !important}.page.plain .story p{font-size:29px !important;line-height:1.75 !important}.page.plain .story h3{font-size:38px}.x12 p{font-size:26px !important;line-height:1.55 !important}.xo12 em{font-size:22px !important;padding:3px 14px !important}.x12>div{padding:10px 0 !important}.q12{font-size:31px !important}.m12 h2{font-size:48px !important}")
cfg.update({"dir":"english12-book","prefix":"My-English-Book-12","title":"My English Book 12","artmod":"english12-art","layout":"g12","theme":"12","grade":"Grade 12",
 "header":'Builds "My English Book 12" – twelfth-grade English syllabus – A4 portrait.',"cover":"--h:15;background:#7a2a10","h":15,
 "t1":"My English","t2":"Book 12","s1":"#5a1500","s2":"#1f3a8f","csub":"Mixed conditionals • Inversion • Cleft sentences • Future perfect","cen":"كِتَابِي لِلُّغَةِ الإِنْجِلِيزِيَّةِ ١٢",
 "coverTop":["v_read","stars","clock"],"coverBot":["school","teacher","rocket","palm"],"ownerArt":"v_read","ownerMini":["book","clock","stars"],
 "noteP":"هٰذَا الكِتَابُ يُكْمِلُ تَعْلِيمَ الإِنْجِلِيزِيَّةِ: الجُمَلُ الشَّرْطِيَّةُ المُخْتَلِطَةُ، وَتَقْدِيمُ الفِعْلِ المُسَاعِدِ، وَجُمَلُ التَّوْكِيدِ المُقَسَّمَةُ، وَجُمَلُ اسْمِ الفَاعِلِ وَالمَفْعُولِ، وَالمُسْتَقْبَلُ التَّامُّ، وَ would rather وَ had better، مَعَ نَصَّيْنِ 🇬🇧",
 "noteLi":["فِي كُلِّ دَرْسٍ مَكَانٌ لِيَكْتُبَ طِفْلُكُمْ جُمْلَةً إِنْجِلِيزِيَّةً مِنْ عِنْدِهِ.","اسْأَلُوهُ: What will you have done by the end of this year?","اطْلُبُوا مِنْهُ أَنْ يَبْدَأَ جُمْلَةً بِـ: Never have I …","فِي التَّدْرِيبَاتِ يَضَعُ دَائِرَةً حَوْلَ الإِجَابَةِ الصَّحِيحَةِ، وَالكِتَابُ يُقْرَأُ مِنَ اليَسَارِ إِلَى اليَمِينِ."],
 "noteMini":["clock","stars","book"],"certP":"لِأَنَّهُ أَتَمَّ «My English Book 12» بِنَجَاحٍ","certArts":["v_read","medal","book"],
 "blurb":"A complete 3D English book with a brand-new split-page design – part 12, with Arabic meanings for every lesson.",
 "blurbLi":["Mixed conditionals and inversion","Cleft sentences and participle clauses","Future perfect, would rather and had better","Two reading texts and a certificate"],
 "en2":"كِتَابٌ شَامِلٌ بِتَصْمِيمٍ جَدِيدٍ لِتَعْلِيمِ الإِنْجِلِيزِيَّةِ – الجُزْءُ الثَّانِيَ عَشَرَ","backArts":["v_read","stars","clock","school"],"extraCss":css,"units":U})
print('pages',6+sum(1+len(u.get('items',[]))+len(u['acts']) for u in U))
json.dump(cfg,open('cfg_eng12.json','w'),ensure_ascii=False,indent=1)
