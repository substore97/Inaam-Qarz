import json
H='Read the question, then shade the letter of the correct answer on the answer sheet'
def W(t,rows): return {"type":"words","title":t,"hint":H,"rows":rows}
def story(t,emo,lines,arts): return {"type":"raw","title":t,"html":f'<div class="card story" style="direction:ltr;text-align:left;font-family:Fredoka"><h3>{t} {emo}</h3><p>{"<br>".join(lines)}</p></div>',"arts":arts}
U=[]
U.append({"title":"Past Perfect","en":"المَاضِي التَّامُّ","icon":"train","arts":["train","clock","bus"],
 "intro":"We use had + past participle for an action that happened before another action in the past.","chip1":["🧩","Form"],"chip2":["📝","Example"],
 "items":[["had left","كَانَ قَدْ غَادَرَ","train","When we arrived at the station, the train had already left.","had + left","The film had started when I sat down."],
  ["had finished","كَانَ قَدْ أَنْهَى","v_write","I had finished my homework before my friend called.","had + finished","She had eaten before she went out."],
  ["before / after","قَبْلَ / بَعْدَ","clock","After he had prayed, he read the Quran.","after + past perfect","Before I went to bed, I had brushed my teeth."]],
 "acts":[W("Choose the right form",[["When I got home, my family ... dinner.",["had eaten","has eaten"]],["She was sad because she ... her keys.",["had lost","has lose"]],["We ... the museum before, so we knew the way.",["had visited","visit"]],["By the time the teacher came, we ... the test.",["had finished","finish"]]]),
  W("Which happened first?",[["When I arrived, the bus had left.",["The bus left.","I arrived."]],["He had studied hard, so he passed.",["He studied.","He passed."]],["After she had cooked, she cleaned the kitchen.",["She cooked.","She cleaned."]],["I had never seen snow before I visited Abha.",["I visited Abha.","I had never seen snow."]]])]})
U.append({"title":"Third Conditional","en":"الشَّرْطُ فِي المَاضِي","icon":"raincloud","arts":["raincloud","alarm" if False else "clock","medal"],
 "intro":"We use If + had + past participle, … would have + past participle to talk about imaginary past situations.","chip1":["❓","If …"],"chip2":["➡️","… would have"],
 "items":[["If I had known","لَوْ كُنْتُ عَلِمْتُ","phone","If I had known you were ill, I would have visited you.","If I had known,","I would have visited you."],
  ["If she had studied","لَوْ كَانَتْ ذَاكَرَتْ","medal","If she had studied, she would have passed the exam.","If she had studied,","she would have passed."],
  ["If it hadn't rained","لَوْ لَمْ تُمْطِرْ","raincloud","If it hadn't rained, we would have played outside.","If it hadn't rained,","we would have played outside."]],
 "acts":[W("Choose the right form",[["If I had woken up early, I ... the bus.",["would have caught","will catch"]],["If he ... harder, he would have won.",["had trained","trains"]],["We would have helped you if you ... us.",["had asked","ask"]],["If they had left earlier, they ... late.",["would not have been","are not"]]]),
  W("What really happened?",[["If I had seen him, I would have said hello.",["I didn't see him.","I saw him."]],["If it had been sunny, we would have gone to the beach.",["It was sunny.","It wasn't sunny."]],["If she had remembered, she would have called.",["She forgot.","She remembered."]],["If we had had time, we would have visited you.",["We had time.","We didn't have time."]]])]})
U.append({"title":"I wish …","en":"التَّمَنِّي","icon":"stars","arts":["stars","s_bike","sun"],
 "intro":"We use wish + past simple for wishes about the present, and wish + past perfect for regrets about the past.","chip1":["🧩","Form"],"chip2":["💭","Meaning"],
 "items":[["I wish I had …","لَيْتَ عِنْدِي …","s_bike","I wish I had a bike.","wish + past simple","I don't have a bike now."],
  ["I wish I were …","لَيْتَنِي كُنْتُ …","sun","I wish I were at the beach now.","wish + were","I am not at the beach."],
  ["I wish I had …ed","لَيْتَنِي كُنْتُ …","clock","I wish I had studied harder last year.","wish + past perfect","I didn't study hard. I regret it."]],
 "acts":[W("Choose the right form",[["I wish I ... taller.",["were","am"]],["She wishes she ... a cat.",["had","has"]],["I wish I ... to the party yesterday.",["had gone","go"]],["He wishes he ... speak French.",["could","can"]]]),
  W("What does it mean?",[["I wish I knew the answer.",["I don't know the answer.","I know the answer."]],["I wish I hadn't eaten so much.",["I ate a lot.","I ate a little."]],["She wishes she lived near the sea.",["She lives near the sea.","She doesn't live near the sea."]],["I wish I had listened to my mother.",["I listened to her.","I didn't listen to her."]]])]})
U.append({"title":"Linking Words","en":"أَدَوَاتُ الرَّبْطِ","icon":"chain","arts":["chain","raincloud","book"],
 "intro":"Linking words join ideas. We use although for contrast, because for reasons, and so for results.","chip1":["🔗","Use"],"chip2":["📝","Example"],
 "items":[["although","عَلَى الرَّغْمِ مِنْ أَنَّ","raincloud","Although it was raining, we went to the mosque.","contrast","Although he was tired, he finished his work."],
  ["however","وَمَعَ ذٰلِكَ","book","The book was long. However, it was very interesting.","contrast (new sentence)","However, …"],
  ["so / because","لِذٰلِكَ / لِأَنَّ","f_sleepy","I was tired, so I went to bed early.","so → result","because → reason"]],
 "acts":[W("Choose the linking word",[["... it was cold, he didn't wear a coat.",["Although","Because"]],["She studied hard, ... she got full marks.",["so","although"]],["I stayed at home ... I was ill.",["because","so"]],["The test was hard. ..., everyone passed.",["However","Because"]]]),
  W("Choose the best ending",[["Although the food was cheap, ...",["it was delicious.","it was cheap."]],["He missed the bus because ...",["he woke up late.","he was on time."]],["It was very hot, so ...",["we stayed inside.","we wore coats."]],["The phone is old. However, ...",["it still works well.","it is old."]]])]})
U.append({"title":"Future Continuous","en":"المُسْتَقْبَلُ المُسْتَمِرُّ","icon":"plane","arts":["plane","clock","v_read"],
 "intro":"We use will be + verb-ing for an action that will be in progress at a time in the future.","chip1":["🧩","Form"],"chip2":["⏱️","Time"],
 "items":[["will be flying","سَأَكُونُ مُسَافِرًا بِالطَّائِرَةِ","plane","This time tomorrow, I will be flying to Jeddah.","will be + flying","this time tomorrow"],
  ["will be studying","سَأَكُونُ أُذَاكِرُ","v_read","At 8 p.m. tonight, I will be studying for the test.","will be + studying","at 8 p.m. tonight"],
  ["Will you be …?","هَلْ سَتَكُونُ …؟","clock","Will you be using your laptop this evening?","Will you be + -ing?","Yes, I will. / No, I won't."]],
 "acts":[W("Choose the right form",[["At ten tomorrow, we ... a test.",["will be taking","took"]],["Don't call at seven. I ... dinner.",["will be having","had"]],["This time next week, they ... in Makkah.",["will be staying","stayed"]],["... you be working on Friday?",["Will","Did"]]]),
  W("Choose the correct sentence",[["(tomorrow at 9 / sleep)",["Tomorrow at 9, I will be sleeping.","Tomorrow at 9, I was sleeping."]],["(next Monday / travel)",["Next Monday, she travelled.","Next Monday, she will be travelling."]],["(tonight / watch the match)",["Tonight, we will be watching the match.","Tonight, we watched the match."]],["(in an hour / cook)",["In an hour, my mother cooked.","In an hour, my mother will be cooking."]]])]})
U.append({"title":"Word Formation","en":"تَكْوِينُ الكَلِمَاتِ","icon":"puzzle","arts":["puzzle","bigheart","f_happy"],
 "intro":"We add prefixes and suffixes to make new words: un- means not, -ful means full of, and -less means without.","chip1":["🔤","Rule"],"chip2":["📝","Example"],
 "items":[["un- (not)","عَدَمٌ (لَا)","f_sad","The test was unfair. (= not fair)","un + happy = unhappy","un + kind = unkind"],
  ["-ful (full of)","مَمْلُوءٌ بِـ","bigheart","My grandmother is very helpful.","help + ful = helpful","care + ful = careful"],
  ["-less (without)","بِلَا / بِدُونِ","puzzle","This old pen is useless.","use + less = useless","home + less = homeless"],
  ["im- / dis- (not)","عَدَمٌ (غَيْرُ)","bigbook","It is impossible to read in the dark.","im + possible = impossible","dis + agree = disagree"]],
 "acts":[W("Choose the right word",[["Be ... when you cross the road.",["careful","careless"]],["He didn't eat all day. He was very ...",["hungry","hungerless"]],["I can't open this door. It's ...",["possible","impossible"]],["The room was dark and ... .",["colourful","colourless"]]]),
  W("Choose the meaning",[["unhappy",["not happy","very happy"]],["hopeful",["without hope","full of hope"]],["endless",["without an end","with a big end"]],["unsafe",["not safe","very safe"]]])]})
S1=["Last year, Faisal joined the school volunteer club.","Before he joined, he had never helped in a hospital.","Although the work was hard, he enjoyed it.","He says, “I wish I had joined earlier.”","Next summer, he will be helping at the children's hospital again."]
S2=["Noura wanted to bake a cake for her mother's birthday.","When she started, she realised she had forgotten to buy eggs.","If she had checked the kitchen, she would have bought them.","However, her neighbour kindly gave her some eggs, so the cake was ready on time."]
U.append({"title":"Reading Time","en":"وَقْتُ القِرَاءَةِ","icon":"v_read","arts":["v_read","book"],
 "intro":"Read the stories, then answer the questions.",
 "acts":[story("The Volunteer Club","🤝",S1,["hospital","kidc","bigheart"]),
  W("Answer",[["What did Faisal join?",["the volunteer club","the football club"]],["Had he helped in a hospital before?",["Yes, many times.","No, never."]],["What does Faisal wish?",["that he had joined earlier","that he hadn't joined"]],["What will he be doing next summer?",["travelling","helping at the children's hospital"]]]),
  story("The Birthday Cake","🎂",S2,["cake","egg","girlc"]),
  W("Answer",[["Why did Noura bake a cake?",["for her mother's birthday","for a school party"]],["What had she forgotten?",["sugar","eggs"]],["What would she have done if she had checked the kitchen?",["bought eggs","made tea"]],["Who helped her?",["her neighbour","her brother"]]])]})
c=json.load(open('cfg_eng9.json'))
cfg=json.load(open('cfg_lug10.json'))
for k in ['tocTitle','traceLabel','ovTitle','ltr']: cfg[k]=c[k]
F="Fredoka,Baloo,sans-serif"
css=c['extraCss'].split('.l9t h2,')[0]
css+=(f".l10h h2,.l10c p,.l10c small,.l10card b,.q10 p,.q10o em,.u10top h1,.u10stamp small,.u10road span,.u10intro,.a10h h2,.a10h span,.ans10>b,.hint10{{font-family:{F} !important}}"
 ".l10map{grid-template-columns:1fr 270px 1fr !important}.l10pic{width:270px !important;height:270px !important}.l10pic svg{width:220px !important;height:220px !important}.l10a p,.l10b p{font-size:24px !important;line-height:1.6 !important}.q10{gap:10px !important;margin-top:12px !important}.q10>div{padding:8px 16px !important}.q10 p{font-size:25px !important;line-height:1.55 !important}.q10o em{font-size:23px !important}.q10 + .ans10{margin-top:16px !important;padding:8px 20px 10px !important}.q10 + .ans10 .ans10g{grid-template-columns:1fr 1fr !important;gap:8px 20px !important}.q10 + .ans10 i{width:42px !important;height:42px !important}.cen{margin-top:30px !important}.l10h em,.u10top em,.toc small{font-family:Baloo !important;direction:rtl;display:block}.story p{font-size:31px !important;line-height:1.95 !important}")
cfg.update({"dir":"english10-book","prefix":"My-English-Book-10","title":"My English Book 10","artmod":"english10-art",
 "header":'Builds "My English Book 10" – tenth-grade English syllabus – A4 portrait.',"cover":"--h:250;background:#ffffff","h":250,
 "t1":"My English","t2":"Book 10","s1":"#1f1060","s2":"#7a3a00","csub":"Past perfect • If I had … • I wish • Linking words • Stories","cen":"كِتَابِي لِلُّغَةِ الإِنْجِلِيزِيَّةِ ١٠",
 "coverTop":["v_read","plane","stars"],"coverBot":["school","train","puzzle","chain"],"ownerArt":"v_read","ownerMini":["book","plane","stars"],
 "noteP":"هٰذَا الكِتَابُ يُكْمِلُ تَعْلِيمَ الإِنْجِلِيزِيَّةِ: المَاضِي التَّامُّ، وَالشَّرْطُ فِي المَاضِي، وَالتَّمَنِّي بِـ wish، وَأَدَوَاتُ الرَّبْطِ، وَالمُسْتَقْبَلُ المُسْتَمِرُّ، وَتَكْوِينُ الكَلِمَاتِ، مَعَ قِصَّتَيْنِ 🇬🇧",
 "noteLi":["فِي كُلِّ دَرْسٍ بِطَاقَةٌ لِيَكْتُبَ طِفْلُكُمْ جُمْلَةً إِنْجِلِيزِيَّةً مِنْ عِنْدِهِ.","اسْأَلُوهُ: What will you be doing this time tomorrow?","اطْلُبُوا مِنْهُ ثَلَاثَ أُمْنِيَاتٍ: I wish …","فِي المَهَمَّاتِ يُظَلِّلُ حَرْفَ الإِجَابَةِ فِي وَرَقَةِ الإِجَابَةِ، وَالكِتَابُ يُقْرَأُ مِنَ اليَسَارِ إِلَى اليَمِينِ."],
 "noteMini":["clock","stars","plane"],"certP":"لِأَنَّهُ أَتَمَّ «My English Book 10» بِنَجَاحٍ","certArts":["v_read","medal","book"],
 "blurb":"A complete 3D English book with a brand-new design – part 10, with Arabic meanings for every word.",
 "blurbLi":["The past perfect and the third conditional","I wish … and linking words","The future continuous","Word formation (un-, -ful, -less), and two stories"],
 "en2":"كِتَابٌ شَامِلٌ بِتَصْمِيمٍ جَدِيدٍ لِتَعْلِيمِ الإِنْجِلِيزِيَّةِ – الجُزْءُ العَاشِرُ","backArts":["kaaba","plane","stars","school"],"extraCss":css,"units":U})
print('pages',6+sum(1+len(u.get('items',[]))+len(u['acts']) for u in U))
json.dump(cfg,open('cfg_eng10.json','w'),ensure_ascii=False,indent=1)
