import json
H='Write the number of the correct answer in the box'
def W(t,rows,top): return {"type":"words","title":t,"hint":H,"rows":rows,"top":top}
def story(t,emo,lines,arts): return {"type":"raw","title":t,"html":f'<div class="card story" style="direction:ltr;text-align:left;font-family:Fredoka"><h3>{t} {emo}</h3><p>{"<br>".join(lines)}</p></div>',"arts":arts}
U=[]
U.append({"title":"Reported Speech","en":"الكَلَامُ المَنْقُولُ","icon":"teacher","arts":["teacher","phone","g_friend"],
 "intro":"We use reported speech to tell someone what another person said. The tense usually moves one step back.","chip1":["💬","Direct"],"chip2":["📝","Reported"],
 "items":[["said (that)","قَالَ (إِنَّ)","teacher","The teacher said that the test was easy.","“The test is easy.”","He said that the test was easy."],
  ["told me","أَخْبَرَنِي","phone","My friend told me that he was tired.","“I am tired.”","He told me that he was tired."],
  ["asked","سَأَلَ","g_friend","Mona asked me where I lived.","“Where do you live?”","She asked me where I lived."]],
 "acts":[W("Choose the reported sentence",[["“I am hungry,” Ali said.",["Ali said that he was hungry.","Ali said that I am hungry."]],["“We like football,” they said.",["They said that we like football.","They said that they liked football."]],["“I can swim,” Sara said.",["Sara said that she could swim.","Sara said that she can swam."]],["“It is raining,” he said.",["He said that it is rain.","He said that it was raining."]]],["teacher","raincloud"]),
  W("said or told?",[["She ... me that she was busy.",["said","told"]],["He ... that he was late.",["said","told"]],["They ... us a funny story.",["said","told"]],["My mother ... that dinner was ready.",["said","told"]]],["phone","g_friend"])]})
U.append({"title":"Second Conditional","en":"الشَّرْطُ غَيْرُ المُحْتَمَلِ","icon":"plane","arts":["coins","plane","sparrow"],
 "intro":"We use If + past, … would + verb for imaginary or unlikely situations.","chip1":["❓","If …"],"chip2":["➡️","… would"],
 "items":[["If I had …","لَوْ كَانَ عِنْدِي …","coins","If I had a lot of money, I would build a school.","If I had money,","I would build a school."],
  ["If I were …","لَوْ كُنْتُ …","doctor","If I were a doctor, I would help sick children.","If I were a doctor,","I would help sick children."],
  ["If I could …","لَوِ اسْتَطَعْتُ …","sparrow","If I could fly, I would visit every country.","If I could fly,","I would visit every country."]],
 "acts":[W("Choose the right word",[["If I ... a bird, I would fly.",["were","am"]],["If she had time, she ... read more.",["will","would"]],["If we ... a car, we would drive to Makkah.",["have","had"]],["What ... you do if you won a prize?",["would","will"]]],["sparrow","medal"]),
  W("Choose the best ending",[["If I found a lost cat, ...",["I would take care of it.","I will ate it."]],["If I were the teacher, ...",["I would give less homework.","I am the teacher."]],["If it snowed in Riyadh, ...",["we would build a snowman.","we will be swimming."]],["If I could speak Chinese, ...",["I would travel to China.","I can travel to China."]]],["cat","snowflake"])]})
U.append({"title":"Relative Clauses","en":"جُمَلُ الصِّلَةِ","icon":"house","arts":["house","girlc","bigbook"],
 "intro":"We use whose for possession, when for time, and that for people or things.","chip1":["🔑","We use it for"],"chip2":["📝","Example"],
 "items":[["whose","الَّذِي … (لِلْمِلْكِيَّةِ)","girlc","This is the girl whose mother is a doctor.","possession","He is the boy whose bike is red."],
  ["when","عِنْدَمَا / الَّذِي (لِلزَّمَنِ)","sun","Friday is the day when we pray Jumu'ah.","time","Summer is the season when it is very hot."],
  ["that","الَّذِي / الَّتِي","bigbook","This is the book that I like most.","people or things","She is the teacher that helped me."]],
 "acts":[W("whose, when or that?",[["That is the man ... son is my friend.",["whose","when","that"]],["Ramadan is the month ... Muslims fast.",["whose","when"]],["This is the pen ... I bought yesterday.",["whose","when","that"]],["I know a boy ... father is a pilot.",["whose","when","that"]]],["pilot","moonball"]),
  W("Join the sentences",[["I met a girl. Her brother is in my class.",["I met a girl whose brother is in my class.","I met a girl when brother is in my class."]],["I remember the day. I started school.",["I remember the day whose I started school.","I remember the day when I started school."]],["This is the cake. My mother made it.",["This is the cake that my mother made.","This is the cake whose my mother made."]],["He is the farmer. His cows give milk.",["He is the farmer that cows give milk.","He is the farmer whose cows give milk."]]],["cake","cow"])]})
U.append({"title":"Present Perfect Continuous","en":"المُضَارِعُ التَّامُّ المُسْتَمِرُّ","icon":"clock","arts":["clock","v_read","raincloud"],
 "intro":"We use have / has been + verb-ing for an action that started in the past and is still continuing.","chip1":["🧩","Form"],"chip2":["⏱️","for / since"],
 "items":[["have been reading","أَقْرَأُ مُنْذُ …","v_read","I have been reading this book for two hours.","have been + reading","for two hours"],
  ["has been raining","تُمْطِرُ مُنْذُ …","raincloud","It has been raining since the morning.","has been + raining","since the morning"],
  ["How long …?","مُنْذُ مَتَى …؟","clock","How long have you been learning English?","How long have you been …?","for six years"]],
 "acts":[W("for or since?",[["I have been studying ... 8 o'clock.",["for","since"]],["She has been waiting ... an hour.",["for","since"]],["We have been living here ... 2020.",["for","since"]],["They have been playing ... two hours.",["for","since"]]],["clock","football"]),
  W("have been or has been?",[["My brother ... sleeping all day.",["have been","has been"]],["We ... cleaning the house.",["have been","has been"]],["It ... snowing since Monday.",["have been","has been"]],["I ... learning to swim.",["have been","has been"]]],["v_sleep","swim"])]})
U.append({"title":"Modals of Deduction","en":"أَفْعَالُ الاسْتِنْتَاجِ","icon":"glasses","arts":["glasses","f_sleepy","phone"],
 "intro":"We use must, might and can't to guess what is true from what we can see.","chip1":["🔍","Meaning"],"chip2":["📝","Example"],
 "items":[["must","لَا بُدَّ أَنَّ (مُتَأَكِّدٌ)","f_sleepy","He has been working all day. He must be tired.","I am almost sure it is true.","She must be at home. Her car is here."],
  ["might","رُبَّمَا","phone","I'm not sure where Ali is. He might be at the library.","It is possible.","It might rain later."],
  ["can't","لَا يُمْكِنُ أَنْ","glasses","That can't be Omar. He is in Jeddah today.","I am almost sure it is not true.","It can't be cold. It's summer."]],
 "acts":[W("must, might or can't?",[["She is smiling. She ... be happy.",["must","might","can't"]],["He just ate a big lunch. He ... be hungry.",["must","might","can't"]],["I'm not sure. The keys ... be in the car.",["must","might","can't"]],["They have played for hours. They ... be tired.",["must","might","can't"]]],["f_happy","f_sleepy"]),
  W("Choose the best sentence",[["The lights are off and nobody answers.",["They must be out.","They must be at home."]],["The baby is crying.",["He can't be hungry. He's crying.","He might be hungry."]],["Sara got full marks.",["She must have studied well.","She can't be clever."]],["This bag is very light.",["It can't be full of books.","It must be full of books."]]],["bag","medal"])]})
U.append({"title":"Gerunds & Infinitives","en":"المَصْدَرُ بِـ ing وَ to","icon":"swim","arts":["swim","v_read","plane"],
 "intro":"Some verbs are followed by verb-ing (enjoy, finish), and some by to + verb (want, decide).","chip1":["🧩","Pattern"],"chip2":["📝","Example"],
 "items":[["enjoy + -ing","يَسْتَمْتِعُ بِـ","swim","I enjoy swimming in the sea.","enjoy + swimming","She enjoys reading."],
  ["want + to","يُرِيدُ أَنْ","plane","I want to visit Madinah.","want + to visit","He wants to be a pilot."],
  ["finish + -ing","يُنْهِي","v_read","Have you finished reading the story?","finish + reading","They finished eating."],
  ["decide + to","يُقَرِّرُ أَنْ","bigbook","I decided to learn a new language.","decide + to learn","She decided to help her neighbour."]],
 "acts":[W("Choose the right form",[["I enjoy ... football.",["playing","to play"]],["She wants ... a doctor.",["being","to be"]],["We finished ... our homework.",["doing","to do"]],["He decided ... Arabic.",["learning","to learn"]]],["football","doctor"]),
  W("Choose the right form",[["Do you like ... stories?",["reading","read"]],["They hope ... the match.",["winning","to win"]],["Stop ... ! The baby is sleeping.",["shouting","to shout"]],["I need ... more water.",["drinking","to drink"]]],["bigbook","water"])]})
S1=["Yasir has been volunteering at the hospital since last summer.","Last week, a little boy asked him why he worked there without money.","Yasir told him that helping people made him happy.","He said that if he were rich, he would build a hospital for poor children.","Yasir must be one of the kindest boys in his town."]
S2=["Huda wants to be a scientist. She enjoys doing experiments.","Yesterday her teacher said that the science fair was next month.","Huda has been working on a project about saving water.","She might win a prize, but she says that learning is the real prize."]
U.append({"title":"Reading Time","en":"وَقْتُ القِرَاءَةِ","icon":"v_read","arts":["v_read","book"],
 "intro":"Read the stories, then answer the questions.",
 "acts":[story("The Young Volunteer","🏥",S1,["hospital","kidc","bigheart"]),
  W("Answer",[["Where has Yasir been volunteering?",["at the hospital","at the bank"]],["Since when has he been volunteering?",["since last winter","since last summer"]],["What would he do if he were rich?",["build a hospital for poor children","buy a big car"]],["Why does he help people?",["It makes him happy.","He gets a lot of money."]]],["hospital","bigheart"]),
  story("The Science Fair","🔬",S2,["flask","girlc","tap"]),
  W("Answer",[["What does Huda want to be?",["a scientist","a pilot"]],["What did her teacher say?",["The science fair was next month.","The school was closed."]],["What is her project about?",["space","saving water"]],["What does Huda say is the real prize?",["money","learning"]]],["flask","medal"])]})
c=json.load(open('cfg_eng8.json'))
cfg=json.load(open('cfg_lug9.json'))
for k in ['tocTitle','traceLabel','ovTitle','ltr']: cfg[k]=c[k]
F="Fredoka,Baloo,sans-serif"
css=c['extraCss'].split('.l8title,')[0]
css+=(f".l9t h2,.l9pts p,.l9pts small,.l9bub b,.l9mark,.q9 p,.q9 li,.u9t,.u9ring small,.u9toc span,.u9intro,.a9h h2,.a9h small,.tf9 p,.hint9{{font-family:{F} !important}}"
 ".l9t em,.u9en,.toc small{font-family:Baloo !important;direction:rtl;display:block}.story p{font-size:31px !important;line-height:1.95 !important}.l9t h2{font-size:56px}")
cfg.update({"dir":"english9-book","prefix":"My-English-Book-9","title":"My English Book 9","artmod":"english9-art",
 "header":'Builds "My English Book 9" – ninth-grade English syllabus – A4 portrait.',"cover":"--h:255;background:#ffffff","h":255,
 "t1":"My English","t2":"Book 9","s1":"#1f1060","s2":"#7a3a00","csub":"Reported speech • If I were • whose • must / might • Stories","cen":"كِتَابِي لِلُّغَةِ الإِنْجِلِيزِيَّةِ ٩",
 "coverTop":["v_read","plane","teacher"],"coverBot":["school","clock","glasses","swim"],"ownerArt":"v_read","ownerMini":["book","plane","clock"],
 "noteP":"هٰذَا الكِتَابُ يُكْمِلُ تَعْلِيمَ الإِنْجِلِيزِيَّةِ: الكَلَامُ المَنْقُولُ، وَالشَّرْطُ غَيْرُ المُحْتَمَلِ (If I were)، وَجُمَلُ الصِّلَةِ، وَالمُضَارِعُ التَّامُّ المُسْتَمِرُّ، وَأَفْعَالُ الاسْتِنْتَاجِ، وَالمَصْدَرُ بِـ ing وَ to، مَعَ قِصَّتَيْنِ 🇬🇧",
 "noteLi":["فِي كُلِّ دَرْسٍ مَسَاحَةٌ لِيَكْتُبَ طِفْلُكُمْ جُمْلَةً إِنْجِلِيزِيَّةً مِنْ عِنْدِهِ.","اسْأَلُوهُ: What would you do if you were …?","اطْلُبُوا مِنْهُ أَنْ يَنْقُلَ كَلَامَكُمْ: He said that …","الكِتَابُ يُقْرَأُ مِنَ اليَسَارِ إِلَى اليَمِينِ."],
 "noteMini":["clock","glasses","plane"],"certP":"لِأَنَّهُ أَتَمَّ «My English Book 9» بِنَجَاحٍ","certArts":["v_read","medal","book"],
 "blurb":"A complete 3D English book with a brand-new design – part 9, with Arabic meanings for every word.",
 "blurbLi":["Reported speech and the second conditional","Relative clauses: whose, when, that","Present perfect continuous and must / might / can't","Gerunds & infinitives, and two short stories"],
 "en2":"كِتَابٌ شَامِلٌ بِتَصْمِيمٍ جَدِيدٍ لِتَعْلِيمِ الإِنْجِلِيزِيَّةِ – الجُزْءُ التَّاسِعُ","backArts":["kaaba","plane","clock","school"],"extraCss":css,"units":U})
print('pages',6+sum(1+len(u.get('items',[]))+len(u['acts']) for u in U))
json.dump(cfg,open('cfg_eng9.json','w'),ensure_ascii=False,indent=1)
