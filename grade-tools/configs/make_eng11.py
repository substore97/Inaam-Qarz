import json
H='Colour the card with the correct answer'
def W(t,rows): return {"type":"words","title":t,"hint":H,"rows":rows}
def story(t,emo,lines,arts): return {"type":"raw","title":t,"html":f'<div class="card story" style="direction:ltr;text-align:left;font-family:Fredoka"><h3>{t} {emo}</h3><p>{"<br>".join(lines)}</p></div>',"arts":arts}
U=[]
U.append({"title":"Advanced Passive","en":"المَبْنِيُّ لِلْمَجْهُولِ (مُتَقَدِّمٌ)","icon":"house","arts":["house","bridge" if False else "builder","book"],
 "intro":"We can use the passive with different tenses and with modal verbs.","chip1":["🧩","Form"],"chip2":["📝","Example"],
 "items":[["has been built","بُنِيَ (حَدِيثًا)","builder","A new hospital has been built in our city.","has / have been + p.p.","The rooms have been cleaned."],
  ["is being painted","يُطْلَى الآنَ","house","Our school is being painted this week.","is / are being + p.p.","The cars are being washed."],
  ["must be done","يَجِبُ أَنْ يُنْجَزَ","book","Homework must be done before Sunday.","modal + be + p.p.","The rules should be followed."]],
 "acts":[W("Choose the correct passive",[["The letters ... sent yesterday.",["were","have"]],["A new road ... built at the moment.",["is being","has being"]],["The project must ... finished today.",["be","been"]],["The museum ... visited by many tourists since 2010.",["has been","is being"]]]),
  W("Active to passive",[["They have cleaned the room.",["The room has been cleaned.","The room has cleaned."]],["Someone is repairing my bike.",["My bike is being repaired.","My bike is repairing."]],["You should wash your hands.",["Your hands should washed.","Your hands should be washed."]],["The teacher will check the tests.",["The tests will be checked.","The tests will checked."]]])]})
U.append({"title":"Reported Questions & Commands","en":"نَقْلُ الأَسْئِلَةِ وَالأَوَامِرِ","icon":"teacher","arts":["teacher","phone","g_friend"],
 "intro":"In reported questions we use normal word order, and we use if for yes/no questions. For commands we use tell + to.","chip1":["💬","Direct"],"chip2":["📝","Reported"],
 "items":[["asked where …","سَأَلَ أَيْنَ …","g_friend","She asked me where I lived.","“Where do you live?”","She asked me where I lived."],
  ["asked if …","سَأَلَ هَلْ …","phone","He asked me if I liked football.","“Do you like football?”","He asked me if I liked football."],
  ["told … to …","طَلَبَ مِنْ … أَنْ …","teacher","The teacher told us to open our books.","“Open your books.”","He told us not to run."]],
 "acts":[W("Choose the reported form",[["“Where is the station?” he asked.",["He asked where the station was.","He asked where was the station."]],["“Are you tired?” she asked.",["She asked if I was tired.","She asked was I tired."]],["“Close the door,” Mum said.",["Mum told me close the door.","Mum told me to close the door."]],["“Don't be late,” the teacher said.",["The teacher told us not to be late.","The teacher told us don't be late."]]]),
  W("Choose the right word",[["He asked me ... I could swim.",["if","that"]],["She asked what time it ...",["was","is it"]],["They told us ... quiet.",["to be","be"]],["I asked him ... he was going.",["where","that"]]])]})
U.append({"title":"Modal Perfects","en":"الأَفْعَالُ النَّاقِصَةُ فِي المَاضِي","icon":"f_sad","arts":["f_sad","clock","raincloud"],
 "intro":"We use modal + have + past participle to talk about the past: should have (regret), must have (sure), might have (possible), can't have (impossible).","chip1":["🧩","Form"],"chip2":["💭","Meaning"],
 "items":[["should have","كَانَ يَنْبَغِي أَنْ …","f_sad","I failed the test. I should have studied harder.","should have + p.p.","a past regret"],
  ["must have","لَا بُدَّ أَنَّهُ …","raincloud","The ground is wet. It must have rained.","must have + p.p.","I am almost sure."],
  ["can't have","لَا يُمْكِنُ أَنْ يَكُونَ …","clock","He can't have finished already. He only started five minutes ago.","can't have + p.p.","I am sure it is not true."],
  ["might have","رُبَّمَا …","phone","I can't find my pen. I might have left it at school.","might have + p.p.","It is possible."]],
 "acts":[W("Choose the modal perfect",[["You're late. You ... left earlier.",["should have","must have"]],["Her eyes are red. She ... been crying.",["must have","should have"]],["He ... eaten all the cake. It was huge!",["can't have","must have"]],["I'm not sure where my keys are. I ... left them at school.",["might have","should have"]]]),
  W("What does it mean?",[["I should have called you.",["I didn't call, and I'm sorry.","I called you."]],["She must have forgotten.",["I'm almost sure she forgot.","She didn't forget."]],["They might have gone home.",["It's possible they went home.","They certainly went home."]],["He can't have seen us.",["He surely saw us.","I'm sure he didn't see us."]]])]})
U.append({"title":"Causative: have something done","en":"جَعْلُ غَيْرِكَ يَعْمَلُ لَكَ","icon":"car","arts":["car","shirt","phone"],
 "intro":"We use have + object + past participle when someone else does a job for us.","chip1":["🧩","Form"],"chip2":["📝","Example"],
 "items":[["have my car washed","أَغْسِلُ سَيَّارَتِي (عِنْدَ غَيْرِي)","car","I have my car washed every Friday.","have + car + washed","Someone washes it for me."],
  ["had my hair cut","قَصَصْتُ شَعْرِي (عِنْدَ الحَلَّاقِ)","shirt","Yesterday I had my hair cut.","had + hair + cut","The barber cut it."],
  ["get it repaired","أُصْلِحُهُ (عِنْدَ غَيْرِي)","phone","My phone is broken. I'm going to get it repaired.","get + it + repaired","get = have (informal)"]],
 "acts":[W("Choose the right form",[["I had my photo ... for my passport.",["taken","take"]],["She is having her house ...",["painted","paint"]],["We need to get the window ...",["repaired","repairing"]],["He ... his watch fixed last week.",["had","has had to"]]]),
  W("Who did the job?",[["I had my bike repaired.",["Someone else repaired it.","I repaired it myself."]],["I repaired my bike.",["Someone else repaired it.","I repaired it myself."]],["She's having her dress made.",["A tailor is making it.","She is making it herself."]],["We got our room painted.",["We painted it ourselves.","Someone painted it for us."]]])]})
U.append({"title":"The more …, the more …","en":"كُلَّمَا … زَادَ …","icon":"runner","arts":["runner","books3","medal"],
 "intro":"We use the + comparative …, the + comparative … to show that two things change together.","chip1":["🧩","Form"],"chip2":["📝","Example"],
 "items":[["The more you read …","كُلَّمَا قَرَأْتَ أَكْثَرَ …","books3","The more you read, the more you learn.","the more …, the more …","The more you practise, the better you get."],
  ["The harder …","كُلَّمَا اجْتَهَدْتَ …","medal","The harder you study, the higher your marks.","the + -er …, the + -er …","The earlier you sleep, the better you feel."],
  ["The faster …","كُلَّمَا أَسْرَعْتَ …","runner","The faster you run, the more tired you get.","the faster, the more tired","The bigger the box, the heavier it is."]],
 "acts":[W("Choose the right words",[["The more you exercise, ... you become.",["the stronger","stronger"]],["The ... you leave, the sooner you arrive.",["earlier","more early"]],["The more he ate, the ... he felt.",["sicker","more sick than"]],["... the weather, the happier the children.",["The better","Better"]]]),
  W("Choose the best ending",[["The more you smile, ...",["the happier you feel.","you feel happy."]],["The longer you wait, ...",["the harder it gets.","it is hard."]],["The colder it gets, ...",["the more clothes we wear.","we wear clothes."]],["The more you save, ...",["the more money you have.","you have money."]]])]})
U.append({"title":"Collocations","en":"المُتَلَازِمَاتُ اللَّفْظِيَّةُ","icon":"puzzle","arts":["puzzle","v_write","bed"],
 "intro":"Some words naturally go together. We say make a mistake, but do homework.","chip1":["🔗","Collocation"],"chip2":["📝","Example"],
 "items":[["make","يَصْنَعُ / يَرْتَكِبُ","v_write","Everyone makes mistakes sometimes.","make a mistake, make a decision","make a cake, make friends"],
  ["do","يَفْعَلُ / يُؤَدِّي","puzzle","I do my homework every evening.","do homework, do the shopping","do your best, do exercise"],
  ["take","يَأْخُذُ","bed","After lunch, my grandfather takes a nap.","take a nap, take a photo","take a break, take a bus"]],
 "acts":[W("make, do or take?",[["Please ... a photo of us.",["take","make","do"]],["I always ... my best in tests.",["do","make","take"]],["Don't worry. Everyone ... mistakes.",["makes","does","takes"]],["Let's ... a short break.",["take","do","make"]]]),
  W("Choose the right word",[["We need to ... a decision now.",["make","do"]],["She ... the shopping every Thursday.",["does","makes"]],["It's late. Let's ... a taxi.",["take","do"]],["He ... friends easily.",["makes","does"]]])]})
S1=["Our old school library has been changed into a modern learning centre.","Last month, new computers were installed and the walls were painted.","The more students visit it, the more books they borrow.","The librarian told us to keep the place clean, and asked us what kind of books we wanted."]
S2=["Omar's phone stopped working, so he had it repaired at a small shop.","When he got it back, the screen looked new.","“You should have protected it with a case,” the shop owner said.","Omar thanked him and bought a strong case the same day."]
U.append({"title":"Reading Time","en":"وَقْتُ القِرَاءَةِ","icon":"v_read","arts":["v_read","book"],
 "intro":"Read the texts, then answer the questions.",
 "acts":[story("The New Learning Centre","📚",S1,["library","laptop","students"]),
  W("Answer",[["What has the library been changed into?",["a modern learning centre","a sports hall"]],["What was installed last month?",["new computers","new doors"]],["What happens when more students visit?",["They borrow more books.","They borrow fewer books."]],["What did the librarian tell the students?",["to keep the place clean","to leave quickly"]]]),
  story("The Broken Phone","📱",S2,["phone","market","f_happy"]),
  W("Answer",[["What did Omar do with his phone?",["He repaired it himself.","He had it repaired at a shop."]],["How did the screen look?",["new","broken"]],["What should Omar have done?",["protected it with a case","bought a new phone"]],["What did Omar buy?",["a strong case","a new phone"]]])]})
c=json.load(open('cfg_eng10.json'))
cfg=json.load(open('cfg_lug11.json'))
for k in ['tocTitle','traceLabel','ovTitle','ltr']: cfg[k]=c[k]
F="Fredoka,Baloo,sans-serif"
css=c['extraCss'].split('.l10map{')[0].split('.l10h h2,')[0]
css+=(f".t11,.d11,.k11,.run11 span,.run11 b,.lead11,.fx11 b,.fx11 small,.nb11 b,.f11 figcaption,.q11 p,.tg11 em,.hint11,.body11 h1,.body11 p,.stub11 small,.ls11 b,.ls11 span{{font-family:{F} !important}}"
 ".body11 em,.toc small,.d11 em{font-family:Baloo !important}.story p{font-size:31px !important;line-height:1.95 !important}.lead11{font-size:30px}.t11{font-size:58px}.q11 p{font-size:26px !important;line-height:1.55}.tg11 em{font-size:22px !important;padding:3px 16px !important}.q11>div{padding:10px 0 !important}.tg11{gap:8px !important}")
cfg.update({"dir":"english11-book","prefix":"My-English-Book-11","title":"My English Book 11","artmod":"english11-art",
 "header":'Builds "My English Book 11" – eleventh-grade English syllabus – A4 portrait.',"cover":"--h:255;background:#2c1f6b","h":255,
 "t1":"My English","t2":"Book 11","s1":"#1f1060","s2":"#7a3a00","csub":"Passive • Reported questions • Modal perfects • Collocations","cen":"كِتَابِي لِلُّغَةِ الإِنْجِلِيزِيَّةِ ١١",
 "coverTop":["v_read","phone","house"],"coverBot":["school","teacher","puzzle","car"],"ownerArt":"v_read","ownerMini":["book","phone","puzzle"],
 "noteP":"هٰذَا الكِتَابُ يُكْمِلُ تَعْلِيمَ الإِنْجِلِيزِيَّةِ: المَبْنِيُّ لِلْمَجْهُولِ المُتَقَدِّمُ، وَنَقْلُ الأَسْئِلَةِ وَالأَوَامِرِ، وَالأَفْعَالُ النَّاقِصَةُ فِي المَاضِي، وَ have something done، وَ the more … the more، وَالمُتَلَازِمَاتُ اللَّفْظِيَّةُ، مَعَ نَصَّيْنِ 🇬🇧",
 "noteLi":["فِي كُلِّ دَرْسٍ دَفْتَرٌ لِيَكْتُبَ طِفْلُكُمْ جُمْلَةً إِنْجِلِيزِيَّةً مِنْ عِنْدِهِ.","اسْأَلُوهُ: What should you have done differently today?","اطْلُبُوا مِنْهُ أَنْ يَنْقُلَ سُؤَالًا سَأَلْتُمُوهُ: You asked me if …","فِي التَّدْرِيبَاتِ يُلَوِّنُ بِطَاقَةَ الإِجَابَةِ الصَّحِيحَةِ، وَالكِتَابُ يُقْرَأُ مِنَ اليَسَارِ إِلَى اليَمِينِ."],
 "noteMini":["phone","puzzle","house"],"certP":"لِأَنَّهُ أَتَمَّ «My English Book 11» بِنَجَاحٍ","certArts":["v_read","medal","book"],
 "blurb":"A complete 3D English book with a brand-new magazine-style design – part 11, with Arabic meanings for every word.",
 "blurbLi":["Advanced passive and reported questions & commands","Modal perfects: should have, must have, can't have","have something done, and the more …, the more …","Collocations with make, do and take, and two texts"],
 "en2":"كِتَابٌ شَامِلٌ بِتَصْمِيمٍ جَدِيدٍ لِتَعْلِيمِ الإِنْجِلِيزِيَّةِ – الجُزْءُ الحَادِيَ عَشَرَ","backArts":["kaaba","phone","house","school"],"extraCss":css,"units":U})
print('pages',6+sum(1+len(u.get('items',[]))+len(u['acts']) for u in U))
json.dump(cfg,open('cfg_eng11.json','w'),ensure_ascii=False,indent=1)
