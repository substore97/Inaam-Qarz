import json
H='Underline the correct answer'
def W(t,rows,top): return {"type":"words","title":t,"hint":H,"rows":rows,"top":top}
def story(t,emo,lines,arts): return {"type":"raw","title":t,"html":f'<div class="card story" style="direction:ltr;text-align:left;font-family:Fredoka"><h3>{t} {emo}</h3><p>{"<br>".join(lines)}</p></div>',"arts":arts}
IA=["is","are"]; WW=["was","were"]; AP=["active","passive"]; HH=["have to","has to"]
U=[]
U.append({"title":"The Passive Voice","en":"المَبْنِيُّ لِلْمَجْهُولِ","icon":"bread","arts":["bread","dates","house"],
 "intro":"We use the passive (be + past participle) when the action is more important than the person who does it.","chip1":["🧩","Form"],"chip2":["📝","Example"],
 "items":[["is made","يُصْنَعُ","bread","Bread is made from flour.","is + made","Cheese is made from milk."],
  ["are grown","تُزْرَعُ","dates","Dates are grown in Saudi Arabia.","are + grown","Oranges are grown in warm countries."],
  ["was built","بُنِيَ","house","This house was built in 2010.","was + built","The bridge was built last year."],
  ["were written","كُتِبَتْ","book","These stories were written by a famous writer.","were + written","The letters were written in Arabic."]],
 "acts":[W("is, are, was or were?",[["Paper ... made from wood.",IA],["Cars ... made in factories.",IA],["The window ... broken yesterday.",WW],["The books ... sold last week.",WW]],["book","window"]),
  W("Active or passive?",[["The cat drank the milk.",AP],["The milk was drunk by the cat.",AP],["Rice is grown in Asia.",AP],["My father grows vegetables.",AP]],["cat","milk"])]})
U.append({"title":"used to","en":"العَادَاتُ فِي المَاضِي","icon":"teddy","arts":["teddy","house","broccoli"],
 "intro":"We use used to + verb for habits in the past that are not true now.","chip1":["🧩","Form"],"chip2":["📝","Example"],
 "items":[["used to play","كُنْتُ أَلْعَبُ","teddy","When I was little, I used to play with a teddy bear.","used to + play","He used to drink milk every night."],
  ["used to live","كَانُوا يَسْكُنُونَ","house","My grandparents used to live in a small village.","used to + live","We used to live in Jeddah."],
  ["didn't use to","لَمْ يَكُنْ (فِي المَاضِي)","broccoli","I didn't use to like vegetables, but now I do.","didn't use to + verb","Did you use to …?"]],
 "acts":[W("Choose the right word",[["When I was five, I ... to sleep early.",["used","use"]],["My father used to ... football.",["played","play"]],["Did you use to ... milk?",["drink","drank"]],["I didn't ... to like fish.",["used","use"]]],["teddy","football"]),
  W("Then and now",[["Grandpa used to write letters. Now he ...",["sends emails","used to send emails"]],["People used to travel by camel. Now they travel by ...",["camel","car and plane"]],["I used to be short. Now I am ...",["taller","shorter"]],["My brother used to cry a lot. Now he ...",["doesn't cry much","cries more"]]],["camel_","plane"])]})
U.append({"title":"as … as","en":"المُقَارَنَةُ بِالتَّسَاوِي","icon":"elephant","arts":["students","racecar","elephant"],
 "intro":"We use as + adjective + as when two things are the same, and not as … as when they are different.","chip1":["🔍","We say"],"chip2":["💡","It means"],
 "items":[["as tall as","طَوِيلٌ مِثْلَ","students","Ali is as tall as Omar.","as tall as","They are the same height."],
  ["not as fast as","لَيْسَ سَرِيعًا مِثْلَ","racecar","My bike is not as fast as a car.","not as fast as","The car is faster."],
  ["not as heavy as","لَيْسَ ثَقِيلًا مِثْلَ","elephant","A cat is not as heavy as an elephant.","not as heavy as","The elephant is heavier."]],
 "acts":[W("as or than?",[["Sara is as old ... Mona. Both are twelve.",["than","as"]],["A mouse is not as big ... a cat.",["as","than"]],["My bag is as heavy ... yours.",["as","than"]],["Ahmed is taller ... Ali.",["than","as"]]],["mouse","cat"]),
  W("What does it mean?",[["Omar is as tall as Ali.",["They are the same height.","Omar is taller."]],["A bike is not as fast as a plane.",["The bike is faster.","The plane is faster."]],["Tea is as hot as coffee.",["They are equally hot.","Coffee is hotter."]],["My room is not as big as yours.",["Your room is bigger.","My room is bigger."]]],["plane","s_bike"])]})
U.append({"title":"have to / don't have to","en":"يَجِبُ / لَيْسَ ضَرُورِيًّا","icon":"school","arts":["school","doctor","sun"],
 "intro":"have to means it is necessary. don't have to means it is not necessary.","chip1":["🧩","Form"],"chip2":["📝","Example"],
 "items":[["have to","يَجِبُ عَلَيَّ","school","We have to wear a uniform at school.","have to + verb","I have to do my homework."],
  ["has to","يَجِبُ عَلَيْهِ","doctor","A doctor has to work at night sometimes.","he / she + has to","She has to wake up early."],
  ["don't have to","لَيْسَ ضَرُورِيًّا","sun","It is Friday. We don't have to go to school.","don't have to + verb","You don't have to pay. It's free."]],
 "acts":[W("have to or has to?",[["I ... study for the test.",HH],["My mother ... cook dinner.",HH],["They ... wear helmets.",HH],["Ali ... clean his room.",HH]],["helmet","book"]),
  W("Choose the right words",[["The museum is free. You ... pay.",["have to","don't have to"]],["Drivers ... stop at a red light.",["have to","don't have to"]],["It's a holiday. We ... get up early.",["have to","don't have to"]],["You ... wash your hands before eating.",["have to","don't have to"]]],["trafficlight","soap"])]})
U.append({"title":"Question Tags","en":"أَسْئِلَةُ التَّأْكِيدِ القَصِيرَةُ","icon":"sun","arts":["sun","fish","girlc"],
 "intro":"A question tag is a short question at the end of a sentence. After a positive sentence we use a negative tag, and after a negative sentence we use a positive tag.","chip1":["🧩","Form"],"chip2":["📝","Example"],
 "items":[["isn't it?","أَلَيْسَ كَذٰلِكَ؟","sun","It's a sunny day, isn't it?","positive → negative tag","It is …, isn't it?"],
  ["don't you?","أَلَيْسَ كَذٰلِكَ؟","fish","You like fish, don't you?","You like …, don't you?","He likes …, doesn't he?"],
  ["is she?","أَلَيْسَ كَذٰلِكَ؟ (بَعْدَ النَّفْيِ)","girlc","Mona isn't late, is she?","negative → positive tag","They can't swim, can they?"]],
 "acts":[W("Choose the tag",[["It's cold, ...?",["is it","isn't it"]],["You are a student, ...?",["aren't you","are you"]],["He doesn't eat meat, ...?",["doesn't he","does he"]],["They can swim, ...?",["can't they","can they"]]],["snowflake","swim"]),
  W("Choose the tag",[["She likes apples, ...?",["doesn't she","does she"]],["We aren't late, ...?",["aren't we","are we"]],["Ali can draw, ...?",["can't he","can he"]],["You didn't forget, ...?",["didn't you","did you"]]],["apple","v_draw"])]})
U.append({"title":"Phrasal Verbs","en":"الأَفْعَالُ المُرَكَّبَةُ","icon":"lamp","arts":["glasses","lamp","baby"],
 "intro":"A phrasal verb is a verb + a small word (up, off, for …). Together they have a new meaning.","chip1":["🔑","Meaning"],"chip2":["📝","Example"],
 "items":[["look for","يَبْحَثُ عَنْ","glasses","I am looking for my glasses.","look for = search","She looked for her keys."],
  ["turn off","يُطْفِئُ","lamp","Please turn off the lights when you leave.","turn off ≠ turn on","Turn off the TV, please."],
  ["take care of","يَعْتَنِي بِـ","baby","My sister takes care of our baby brother.","take care of = look after","We take care of our plants."]],
 "acts":[W("Choose the phrasal verb",[["Please ... the lights. We are saving energy.",["look for","turn off"]],["I can't find my pen. I'm ... it.",["looking for","turning off"]],["Nurses ... sick people.",["turn off","take care of"]],["We must ... our little sister.",["take care of","turn off"]]],["lamp","glasses"]),
  W("Choose the meaning",[["look for",["search","sleep"]],["turn off",["open a door","stop a machine"]],["take care of",["look after","lose"]],["wake up",["stop sleeping","start sleeping"]]],["baby","clock"])]})
S1=["This mosque was built more than one hundred years ago.","It was made of stone and wood.","People used to pray there every day.","Last year, it was repaired by the people of the town.","Now it is as beautiful as it was in the past."]
S2=["Every morning, Khalid has to wake up at six.","He turns off his alarm and prays Fajr.","Then he takes care of his little brother and gives him breakfast.","Khalid doesn't have to walk to school, because his father drives him.","He is a helpful boy, isn't he?"]
U.append({"title":"Reading Time","en":"وَقْتُ القِرَاءَةِ","icon":"v_read","arts":["v_read","book"],
 "intro":"Read the stories, then answer the questions.",
 "acts":[story("The Old Mosque","🕌",S1,["mosque","rock","f_happy"]),
  W("Answer",[["When was the mosque built?",["last year","more than one hundred years ago"]],["What was it made of?",["stone and wood","glass and metal"]],["Who repaired it?",["the people of the town","the teacher"]],["Is the mosque beautiful now?",["No, it isn't.","Yes, it is."]]],["mosque","mymosque"]),
  story("A Busy Morning","⏰",S2,["clock","prayermat","baby"]),
  W("Answer",[["What time does Khalid have to wake up?",["at nine","at six"]],["What does he do after he turns off his alarm?",["He prays Fajr.","He goes back to sleep."]],["Who does he take care of?",["his grandfather","his little brother"]],["Why doesn't he have to walk to school?",["His father drives him.","The school is closed."]]],["clock","car"])]})
c=json.load(open('cfg_eng7.json'))
cfg=json.load(open('cfg_lug8.json'))
for k in ['tocTitle','traceLabel','ovTitle','ltr']: cfg[k]=c[k]
F="Fredoka,Baloo,sans-serif"
css=c['extraCss'].split('.l7name h2,')[0]
css+=(f".l8title,.l8quote,.l8info b,.l8info small,.l8board b,.l8side span,.q8 p,.q8o,.u8top h1,.u8top small,.u8grid span,.u8intro,.a8h h2,.a8h span,.tf8 p,.hint8{{font-family:{F} !important}}"
 ".l8pol figcaption,.u8top em,.toc small{font-family:Baloo !important;direction:rtl}.story p{font-size:32px !important;line-height:2 !important}.l8side span{writing-mode:vertical-lr;transform:rotate(180deg)}.f8{border-radius:0 22px 22px 22px}")
cfg.update({"dir":"english8-book","prefix":"My-English-Book-8","title":"My English Book 8","artmod":"english8-art",
 "header":'Builds "My English Book 8" – eighth-grade English syllabus – A4 portrait.',"cover":"--h:265;background:#3b2a8a","h":265,
 "t1":"My English","t2":"Book 8","s1":"#1f1060","s2":"#7a3a00","csub":"Passive • used to • as … as • have to • Tags • Stories","cen":"كِتَابِي لِلُّغَةِ الإِنْجِلِيزِيَّةِ ٨",
 "coverTop":["v_read","house","teddy"],"coverBot":["school","lamp","elephant","mosque"],"ownerArt":"v_read","ownerMini":["book","lamp","house"],
 "noteP":"هٰذَا الكِتَابُ يُكْمِلُ تَعْلِيمَ الإِنْجِلِيزِيَّةِ: المَبْنِيُّ لِلْمَجْهُولِ، وَ used to، وَ as … as، وَ have to، وَأَسْئِلَةُ التَّأْكِيدِ القَصِيرَةُ، وَالأَفْعَالُ المُرَكَّبَةُ، مَعَ قِصَّتَيْنِ 🇬🇧",
 "noteLi":["فِي كُلِّ دَرْسٍ سَبُّورَةٌ لِيَكْتُبَ طِفْلُكُمْ جُمْلَةً إِنْجِلِيزِيَّةً مِنْ عِنْدِهِ.","اسْأَلُوهُ: What did you use to do when you were little?","العَبُوا مَعَهُ بِأَسْئِلَةِ التَّأْكِيدِ: It's hot, isn't it?","الكِتَابُ يُقْرَأُ مِنَ اليَسَارِ إِلَى اليَمِينِ."],
 "noteMini":["house","teddy","lamp"],"certP":"لِأَنَّهُ أَتَمَّ «My English Book 8» بِنَجَاحٍ","certArts":["v_read","medal","book"],
 "blurb":"A complete 3D English book with a brand-new design – part 8, with Arabic meanings for every word.",
 "blurbLi":["The passive voice: is made, was built","used to, and as … as","have to / don't have to, and question tags","Phrasal verbs, and two short stories"],
 "en2":"كِتَابٌ شَامِلٌ بِتَصْمِيمٍ جَدِيدٍ لِتَعْلِيمِ الإِنْجِلِيزِيَّةِ – الجُزْءُ الثَّامِنُ","backArts":["kaaba","house","lamp","school"],"extraCss":css,"units":U})
print('pages',6+sum(1+len(u.get('items',[]))+len(u['acts']) for u in U))
json.dump(cfg,open('cfg_eng8.json','w'),ensure_ascii=False,indent=1)
