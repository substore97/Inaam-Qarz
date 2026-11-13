import json
H='Circle the correct answer ⭕'
def W(t,rows,top): return {"type":"words","title":t,"hint":H,"rows":rows,"top":top}
def TF(rows,top): return {"type":"tf","title":"True or false?","hint":"Tick ✓ for true and ✗ for false","rows":rows,"top":top}
def story(t,emo,lines,arts): return {"type":"raw","title":t,"html":f'<div class="card story" style="direction:ltr;text-align:left;font-family:Fredoka"><h3>{t} {emo}</h3><p>{"<br>".join(lines)}</p></div>',"arts":arts}
U=[]
U.append({"title":"Irregular Past Verbs","en":"الأَفْعَالُ الشَّاذَّةُ فِي المَاضِي","icon":"bus","arts":["bus","v_eat","v_write"],
 "intro":"Some verbs do not take -ed in the past. We learn them by heart.","chip1":["⏪","Present → Past"],"chip2":["📝","Example"],
 "items":[["went","ذَهَبَ","bus","Yesterday, I went to the park with my family.","go → went","She went to school by bus."],
  ["ate","أَكَلَ","v_eat","We ate dates and rice for lunch.","eat → ate","He ate an apple."],
  ["saw","رَأَى","sunflower","I saw a big yellow flower in the garden.","see → saw","They saw a camel."],
  ["wrote","كَتَبَ","v_write","Ali wrote a letter to his grandpa.","write → wrote","She wrote a story."]],
 "acts":[W("Choose the past",[["Last week, we ... to Makkah.",["goed","went"]],["I ... a sandwich yesterday.",["ate","eat"]],["She ... a rainbow after the rain.",["saw","seed"]],["He ... his name on the board.",["writed","wrote"]]],["bus","v_eat","v_write"]),
  W("Did you …?",[["Did you go to school yesterday? Yes, I ...",["did","didn't"]],["Did she eat breakfast? No, she ...",["did","didn't"]],["... you see the moon last night?",["Did","Do"]],["He didn't ... a story.",["wrote","write"]]],["school","moon"])]})
U.append({"title":"Stay Healthy","en":"أُحَافِظُ عَلَى صِحَّتِي","icon":"broccoli","arts":["broccoli","bed","water"],
 "intro":"We use should and shouldn't to give advice.","chip1":["✅","Advice"],"chip2":["❌","Don't"],
 "items":[["sleep early","أَنَامُ مُبَكِّرًا","bed","You should sleep early every night.","You should sleep early.","You shouldn't stay up late."],
  ["eat vegetables","آكُلُ الخَضْرَاوَاتِ","broccoli","You should eat vegetables every day.","You should eat vegetables.","You shouldn't eat too many sweets."],
  ["drink water","أَشْرَبُ المَاءَ","water","You should drink a lot of water.","You should drink water.","You shouldn't drink too much soda."]],
 "acts":[W("should or shouldn't?",[["You ... brush your teeth twice a day.",["should","shouldn't"]],["You ... eat too many sweets.",["should","shouldn't"]],["You ... wash your hands before meals.",["should","shouldn't"]],["You ... watch TV all day.",["should","shouldn't"]]],["toothbrush","cookies"]),
  TF(["We should sleep early.","Vegetables are bad for us.","We should exercise every day.","We shouldn't drink water.","Fruit is good for our health."],["broccoli","runner","apple"])]})
U.append({"title":"How Do They Move?","en":"الأَحْوَالُ: كَيْفَ يَتَحَرَّكُونَ؟","icon":"snail","arts":["snail","racecar","s_road"],
 "intro":"Adverbs tell us how we do something. Many adverbs end in -ly.","chip1":["🔤","Adjective → Adverb"],"chip2":["📝","Example"],
 "items":[["slowly","بِبُطْءٍ","snail","The snail moves slowly.","slow → slowly","My grandpa walks slowly."],
  ["quickly","بِسُرْعَةٍ","racecar","The race car moves very quickly.","quick → quickly","He finished his work quickly."],
  ["carefully","بِحَذَرٍ","s_road","We cross the road carefully.","careful → carefully","She carries the cup carefully."]],
 "acts":[W("Choose the adverb",[["quiet → ...",["quietly","quietful"]],["safe → ...",["safely","safe"]],["loud → ...",["louder","loudly"]],["happy → ...",["happily","happyly"]]],["snail","racecar"]),
  W("Complete the sentence",[["The turtle walks ...",["slowly","quickly"]],["We should read ... in the library.",["loudly","quietly"]],["Cross the street ...",["carefully","carelessly"]],["The cheetah runs very ...",["slowly","quickly"]]],["library","s_road"])]})
U.append({"title":"Whose Is It?","en":"لِمَنْ هٰذَا؟","icon":"bag","arts":["bag","kidc","girlc"],
 "intro":"We use mine, yours, his and hers to show who owns something.","chip1":["🔑","Pronoun"],"chip2":["📝","Example"],
 "items":[["mine","مِلْكِي","bag","This is my bag. It's mine.","my → mine","The red pencil is mine."],
  ["his","مِلْكُهُ","kidc","This is Omar's book. It's his.","his → his","The blue ball is his."],
  ["hers","مِلْكُهَا","girlc","This is Sara's pen. It's hers.","her → hers","The green bag is hers."]],
 "acts":[W("Choose the right word",[["This is your cup. It's ...",["yours","mine"]],["This is Ali's car. It's ...",["hers","his"]],["This is Mona's book. It's ...",["his","hers"]],["This is my pencil. It's ...",["mine","yours"]]],["kidc","girlc"]),
  W("Whose is it?",[["Whose bag is this? It's ... (Sara)",["hers","his"]],["Whose ball is this? It's ... (I)",["mine","yours"]],["Whose shoes are these? They're ... (Ahmed)",["his","hers"]],["Is this pen ...? Yes, it's mine.",["you","yours"]]],["bag","book"])]})
U.append({"title":"My Hobbies","en":"هِوَايَاتِي","icon":"swim","arts":["swim","v_draw","v_read"],
 "intro":"After like and love, we add -ing to the verb.","chip1":["❤️","I like"],"chip2":["👦","He / She likes"],
 "items":[["swimming","السِّبَاحَةُ","swim","I like swimming in the sea.","I like swimming.","He likes swimming."],
  ["drawing","الرَّسْمُ","v_draw","My sister loves drawing flowers.","I love drawing.","She loves drawing."],
  ["reading","القِرَاءَةُ","v_read","Omar likes reading stories.","I like reading.","He likes reading."]],
 "acts":[W("like or likes?",[["I ... playing football.",["like","likes"]],["She ... reading books.",["like","likes"]],["We ... drawing.",["like","likes"]],["My brother ... swimming.",["like","likes"]]],["football","swim"]),
  W("Add -ing",[["read → ...",["reading","readding"]],["swim → ...",["swiming","swimming"]],["write → ...",["writing","writeing"]],["run → ...",["runing","running"]]],["v_read","runner"])]})
U.append({"title":"In, On or At?","en":"حُرُوفُ الجَرِّ لِلزَّمَنِ","icon":"clockt:7:00","arts":["clockt:7:00","mosque","sun"],
 "intro":"We use at, on and in with times, days, months and seasons.","chip1":["🕐","We use it with"],"chip2":["📝","Example"],
 "items":[["at","فِي (السَّاعَةِ)","clockt:7:00","I go to school at seven o'clock.","times","at 7 o'clock"],
  ["on","فِي (يَوْمِ)","mosque","We go to the mosque early on Friday.","days","on Friday"],
  ["in","فِي (شَهْرِ / فَصْلِ)","sun","It is very hot in summer.","months and seasons","in July / in summer"]],
 "acts":[W("at, on or in?",[["... Monday",["at","on","in"]],["... 3 o'clock",["at","on","in"]],["... winter",["at","on","in"]],["... March",["at","on","in"]]],["clockt:3:00","snowflake"]),
  W("Complete the sentence",[["We pray Fajr ... dawn.",["at","in"]],["My birthday is ... May.",["on","in"]],["We have no school ... Friday.",["on","at"]],["It is cold ... winter.",["at","in"]]],["mosque","snowflake"])]})
U.append({"title":"Reading Time","en":"وَقْتُ القِرَاءَةِ","icon":"v_read","arts":["v_read","book"],
 "intro":"Read the stories, then answer the questions.",
 "acts":[story("A Visit to Grandpa","👴",["Last Friday, Sara and her brother Ali visited their grandpa.","They went by car.","Grandpa told them a story about the old days.","They ate dates and drank milk.","Before they left, Grandpa gave them a big hug."],["car","grandpa","dates"]),
  W("Answer",[["When did they visit Grandpa?",["last Friday","last Monday"]],["How did they go?",["by car","by bus"]],["What did they eat?",["cake","dates"]],["What did Grandpa give them?",["a big hug","a ball"]]],["grandpa","milk"]),
  story("The Lost Wallet","👛",["Yusuf found a wallet in the park.","There was a lot of money in it.","He didn't keep it. He took it to the police station.","The owner was very happy and thanked him.","Yusuf felt proud because he was honest."],["park","coins","policestation"]),
  W("Answer",[["Where did Yusuf find the wallet?",["at school","in the park"]],["What did he do with it?",["He took it to the police.","He kept it."]],["How did the owner feel?",["very happy","angry"]],["Yusuf was ...",["lazy","honest"]]],["f_proud","coins"])]})
c=json.load(open('cfg_eng5.json'))
F="Fredoka,Baloo,sans-serif"
css=c['extraCss'].replace('.cover h1{font-size:70px !important;line-height:1.45 !important;margin-top:255px !important}','')
css+=(f".l6h h2,.l6sent,.l6box b,.l6box small,.l6tag,.l6write b,.q6 p,.q6o span,.u6t h1,.u6t small,.u6list span,.u6list b,.u6intro,.a6h h2,.a6h span,.tf6 td,.tf6 th,.hint6{{font-family:{F} !important}}"
 ".l6h em,.u6t em{font-family:Baloo !important;direction:rtl;display:inline-block}.story p{font-size:33px !important;line-height:2 !important}")
cfg=json.load(open('cfg_math6.json'))
for k in ['tocTitle','traceLabel','ovTitle','noteLi','noteP']: cfg[k]=c[k]
cfg.update({"dir":"english6-book","prefix":"My-English-Book-6","title":"My English Book 6","artmod":"english6-art","ltr":True,
 "header":'Builds "My English Book 6" – sixth-grade English syllabus – A4 portrait.',"cover":"--h:255;background:#ffffff","h":255,
 "t1":"My English","t2":"Book 6","s1":"#4b2fb0","s2":"#c46a00","csub":"Past • Advice • Adverbs • Whose? • Hobbies • Time • Stories","cen":"كِتَابِي لِلُّغَةِ الإِنْجِلِيزِيَّةِ ٦",
 "coverTop":["v_read","plane","swim"],"coverBot":["school","clockt:7:00","snail","v_draw"],"ownerArt":"v_read","ownerMini":["bag","swim","book"],
 "noteP":"هٰذَا الكِتَابُ يُكْمِلُ تَعْلِيمَ الإِنْجِلِيزِيَّةِ: الأَفْعَالُ الشَّاذَّةُ فِي المَاضِي، وَالنَّصِيحَةُ بِـ should، وَالأَحْوَالُ (slowly)، وَضَمَائِرُ المِلْكِيَّةِ (mine)، وَالهِوَايَاتُ، وَحُرُوفُ الجَرِّ لِلزَّمَنِ، مَعَ قِصَّتَيْنِ 🇬🇧",
 "noteLi":["فِي كُلِّ دَرْسٍ مَسَاحَةٌ لِيَكْتُبَ طِفْلُكُمْ جُمْلَةً إِنْجِلِيزِيَّةً مِنْ عِنْدِهِ.","اسْأَلُوهُ عَنْ يَوْمِهِ بِالإِنْجِلِيزِيَّةِ: What did you do yesterday?","اطْلُبُوا مِنْهُ نَصِيحَةً صِحِّيَّةً: You should …","الكِتَابُ يُقْرَأُ مِنَ اليَسَارِ إِلَى اليَمِينِ."],
 "noteMini":["bus","snail","bag"],"certP":"لِأَنَّهُ أَتَمَّ «My English Book 6» بِنَجَاحٍ","certArts":["v_read","medal","swim"],
 "blurb":"A complete 3D English book with a brand-new design – part 6, with Arabic meanings for every word.",
 "blurbLi":["Irregular past verbs and “Did you …?”","Giving advice with should and adverbs (-ly)","mine, yours, his, hers and hobbies with -ing","in, on, at for time, and two short stories"],
 "en2":"كِتَابٌ شَامِلٌ بِتَصْمِيمٍ جَدِيدٍ لِتَعْلِيمِ الإِنْجِلِيزِيَّةِ – الجُزْءُ السَّادِسُ","backArts":["kaaba","snail","swim","school"],"extraCss":css,"units":U})
print('pages',6+sum(1+len(u.get('items',[]))+len(u['acts']) for u in U))
json.dump(cfg,open('cfg_eng6.json','w'),ensure_ascii=False,indent=1)
