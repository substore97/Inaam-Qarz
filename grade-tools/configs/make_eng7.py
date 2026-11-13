import json
H='Tick ✓ the correct box'
def W(t,rows,top): return {"type":"words","title":t,"hint":H,"rows":rows,"top":top}
def story(t,emo,lines,arts): return {"type":"raw","title":t,"html":f'<div class="card story" style="direction:ltr;text-align:left;font-family:Fredoka"><h3>{t} {emo}</h3><p>{"<br>".join(lines)}</p></div>',"arts":arts}
HH=["have","has"]; WW=["was","were"]
U=[]
U.append({"title":"Present Perfect","en":"المُضَارِعُ التَّامُّ","icon":"medal","arts":["v_write","kaaba","plane"],
 "intro":"We use have / has + past participle for experiences and for actions that are finished.","chip1":["🧩","Form"],"chip2":["📝","Example"],
 "items":[["have finished","أَنْهَيْتُ","v_write","I have finished my homework.","have + finished","We have finished our lunch."],
  ["has visited","زَارَ","kaaba","My father has visited Makkah many times.","has + visited","She has visited her grandma."],
  ["have eaten","أَكَلْتُ","dates","I have eaten dates from Madinah.","eat → eaten","He has eaten his breakfast."],
  ["Have you ever …?","هَلْ سَبَقَ لَكَ أَنْ …؟","plane","Have you ever travelled by plane?","Yes, I have.","No, I have never travelled by plane."]],
 "acts":[W("have or has?",[["I ... finished my book.",HH],["She ... cleaned her room.",HH],["They ... visited the museum.",HH],["My brother ... broken his toy.",HH]],["v_write","book"]),
  W("Choose the past participle",[["go → ...",["went","gone"]],["see → ...",["seen","saw"]],["write → ...",["wrote","written"]],["eat → ...",["eaten","ate"]]],["v_eat","eye"])]})
U.append({"title":"If … will","en":"الجُمَلُ الشَّرْطِيَّةُ","icon":"raincloud","arts":["raincloud","v_read","sandwich"],
 "intro":"We use If + present, … will + verb, to talk about real possibilities in the future.","chip1":["❓","If …"],"chip2":["➡️","… will"],
 "items":[["If it rains","إِذَا أَمْطَرَتْ","raincloud","If it rains, we will stay at home.","If it rains,","we will stay at home."],
  ["If you study","إِذَا ذَاكَرْتَ","v_read","If you study hard, you will pass the test.","If you study hard,","you will pass the test."],
  ["If I am hungry","إِذَا جُعْتُ","sandwich","If I am hungry, I will eat a sandwich.","If I am hungry,","I will eat a sandwich."]],
 "acts":[W("Choose the right word",[["If it ... sunny, we will go to the beach.",["is","will be"]],["If you water the plant, it ... grow.",["is","will"]],["If she ... late, she will miss the bus.",["wakes up","will wake up"]],["If we hurry, we ... catch the train.",["will","are"]]],["sun","plant"]),
  W("Choose the best ending",[["If you eat too many sweets, ...",["you will get a toothache.","you will fly."]],["If I find a wallet, ...",["I will keep it.","I will give it to the police."]],["If it is cold, ...",["I will wear a coat.","I will swim in the sea."]],["If you are kind, ...",["you will be sad.","people will love you."]]],["coat","coins"])]})
U.append({"title":"too & enough","en":"أَكْثَرُ مِنَ اللَّازِمِ / بِمَا يَكْفِي","icon":"thermometer","arts":["soup","shoes","s_bike"],
 "intro":"too + adjective means more than we want. adjective + enough means as much as we need.","chip1":["⬆️","too"],"chip2":["✅","enough"],
 "items":[["too hot","حَارٌّ أَكْثَرَ مِنَ اللَّازِمِ","soup","The soup is too hot to eat.","too hot","It is not cool enough."],
  ["too small","صَغِيرٌ أَكْثَرَ مِنَ اللَّازِمِ","shoes","These shoes are too small for me.","too small","They are not big enough."],
  ["old enough","كَبِيرٌ بِمَا يَكْفِي","s_bike","Omar is old enough to ride a bike.","not too young","old enough"]],
 "acts":[W("too or enough?",[["The box is ... heavy to carry.",["too","enough"]],["Is the water warm ... to swim?",["too","enough"]],["I can't reach the shelf. I'm not tall ...",["too","enough"]],["This tea is ... sweet.",["too","enough"]]],["box","cup"]),
  W("Choose the sentence",[["I can put all my books in this bag.",["The bag is big enough.","The bag is too big."]],["I can't drink the milk. It's very hot.",["It's hot enough.","It's too hot."]],["He can't carry the box.",["He isn't strong enough.","He is too strong."]],["We can't play outside. It's very cold.",["It's too cold.","It's cold enough."]]],["milk","snowflake"])]})
WH=["who","which","where"]
U.append({"title":"who, which & where","en":"الأَسْمَاءُ المَوْصُولَةُ","icon":"doctor","arts":["doctor","pencil","library"],
 "intro":"We use who for people, which for things and animals, and where for places.","chip1":["👤","We use it for"],"chip2":["📝","Example"],
 "items":[["who","الَّذِي / الَّتِي (لِلْعَاقِلِ)","doctor","A doctor is a person who helps sick people.","people","A teacher is a person who teaches."],
  ["which","الَّذِي / الَّتِي (لِغَيْرِ العَاقِلِ)","pencil","A pencil is a thing which we use to write.","things and animals","A cow is an animal which gives us milk."],
  ["where","حَيْثُ (لِلْمَكَانِ)","library","A library is a place where we borrow books.","places","A bakery is a place where we buy bread."]],
 "acts":[W("who, which or where?",[["A pilot is a person ... flies planes.",WH],["A fridge is a machine ... keeps food cold.",WH],["A hospital is a place ... doctors work.",WH],["A farmer is a person ... grows food.",WH]],["pilot","fridge"]),
  W("Choose the right ending",[["A bee is an insect which makes ...",["milk","honey"]],["A chef is a person who ...",["cooks food","flies planes"]],["A school is a place where we ...",["learn","sleep"]],["Scissors are a tool which we use to ...",["drink water","cut paper"]]],["bee","chef"])]})
U.append({"title":"Past Continuous","en":"المَاضِي المُسْتَمِرُّ","icon":"v_read","arts":["v_read","football","phone"],
 "intro":"We use was / were + verb-ing for an action that was in progress in the past.","chip1":["🧩","Form"],"chip2":["📝","Example"],
 "items":[["was reading","كُنْتُ أَقْرَأُ","v_read","I was reading a book at eight o'clock last night.","I / he / she + was","He was reading."],
  ["were playing","كَانُوا يَلْعَبُونَ","football","The boys were playing football in the park.","we / you / they + were","They were playing."],
  ["when","عِنْدَمَا","phone","I was eating lunch when the phone rang.","was eating … when …","She was sleeping when I came."]],
 "acts":[W("was or were?",[["My sister ... drawing a picture.",WW],["We ... watching the stars.",WW],["I ... doing my homework.",WW],["The children ... swimming.",WW]],["v_draw","stars"]),
  W("Complete the sentence",[["At seven o'clock, Ali was ... breakfast.",["eat","eating"]],["They were ... to school when it started to rain.",["walking","walked"]],["What were you ... yesterday at five?",["doing","do"]],["She was reading ... the lights went out.",["which","when"]]],["raincloud","lamp"])]})
MM=["much","many"]
U.append({"title":"How Much? How Many?","en":"كَمْ؟ (الكَمِّيَّةُ وَالعَدَدُ)","icon":"apple","arts":["apple","milk","dates"],
 "intro":"We use How many with things we can count, and How much with things we cannot count.","chip1":["🔢","We use it with"],"chip2":["📝","Example"],
 "items":[["How many …?","كَمْ عَدَدُ …؟","apple","How many apples are there? There are five apples.","countable nouns","How many books do you have?"],
  ["How much …?","كَمْ كَمِّيَّةُ …؟","milk","How much milk is in the glass? There is a little milk.","uncountable nouns","How much water do you drink?"],
  ["a lot of","كَثِيرٌ مِنْ","dates","We have a lot of dates and a lot of rice.","countable and uncountable","a lot of friends, a lot of water"]],
 "acts":[W("much or many?",[["How ... eggs do we need?",MM],["How ... sugar is in the tea?",MM],["How ... students are in your class?",MM],["How ... money do you have?",MM]],["egg","coins"]),
  W("Choose the answer",[["How many legs does a spider have?",["It has eight legs.","It has much legs."]],["How much water should we drink?",["Many water.","A lot of water."]],["How many days are there in a week?",["There are seven days.","There is seven day."]],["How much is this book?",["It's ten books.","It's ten riyals."]]],["spider","water"])]})
S1=["Last week, Hamza was walking home when he saw an old man.","The old man was carrying a heavy bag.","Hamza helped him and carried the bag to his house.","The old man smiled and said, “You have given me the best gift: your kindness.”","Since that day, Hamza has helped many people."]
S2=["Sara saw that the tap in the school garden was dripping.","She thought, “If we don't fix it, we will waste a lot of water.”","She told her teacher, and the teacher called the caretaker.","He fixed the tap the same day.","Sara was happy because she helped to save water."]
U.append({"title":"Reading Time","en":"وَقْتُ القِرَاءَةِ","icon":"v_read","arts":["v_read","book"],
 "intro":"Read the stories, then answer the questions.",
 "acts":[story("The Best Gift","🎁",S1,["grandpa","bag","f_happy"]),
  W("Answer",[["What was Hamza doing when he saw the old man?",["He was walking home.","He was playing football."]],["What was the old man carrying?",["a small cat","a heavy bag"]],["What was the best gift?",["Hamza's kindness","money"]],["Has Hamza helped other people since that day?",["No, he hasn't.","Yes, he has."]]],["grandpa","bigheart"]),
  story("Saving Water","💧",S2,["tap","school","happyearth"]),
  W("Answer",[["What did Sara see?",["The tap was dripping.","The door was open."]],["Who did she tell?",["her brother","her teacher"]],["Who fixed the tap?",["the caretaker","Sara"]],["Why was Sara happy?",["She won a prize.","She helped to save water."]]],["tap","waterglass"])]})
c=json.load(open('cfg_eng6.json'))
cfg=json.load(open('cfg_lug7.json'))
for k in ['tocTitle','traceLabel','ovTitle','ltr']: cfg[k]=c[k]
F="Fredoka,Baloo,sans-serif"
css=c['extraCss'].split('.l6h h2,')[0]
css+=(f".l7name h2,.l7steps b,.l7steps small,.l7note b,.l7top small,.q7 p,.q7o span,.u7card h1,.u7card small,.u7chips span,.u7chips b,.u7intro,.a7h h2,.a7h b,.tf7 p,.tf7b span,.hint7{{font-family:{F} !important}}"
 ".l7name em,.u7card em,.toc small{font-family:Baloo !important;direction:rtl;display:inline-block}.story p{font-size:32px !important;line-height:2 !important}.l7name h2{font-size:52px}")
cfg.update({"dir":"english7-book","prefix":"My-English-Book-7","title":"My English Book 7","artmod":"english7-art",
 "header":'Builds "My English Book 7" – seventh-grade English syllabus – A4 portrait.',"cover":"--h:262;background:#7a52e0","h":262,
 "t1":"My English","t2":"Book 7","s1":"#2e1680","s2":"#7a3a00","csub":"Present Perfect • If • too / enough • who / which • Stories","cen":"كِتَابِي لِلُّغَةِ الإِنْجِلِيزِيَّةِ ٧",
 "coverTop":["v_read","plane","raincloud"],"coverBot":["school","doctor","phone","library"],"ownerArt":"v_read","ownerMini":["plane","book","raincloud"],
 "noteP":"هٰذَا الكِتَابُ يُكْمِلُ تَعْلِيمَ الإِنْجِلِيزِيَّةِ: المُضَارِعُ التَّامُّ (have / has)، وَالجُمَلُ الشَّرْطِيَّةُ (If … will)، وَ too وَ enough، وَالأَسْمَاءُ المَوْصُولَةُ (who / which / where)، وَالمَاضِي المُسْتَمِرُّ، وَ How much / How many، مَعَ قِصَّتَيْنِ 🇬🇧",
 "noteLi":["فِي كُلِّ دَرْسٍ وَرَقَةٌ صَفْرَاءُ لِيَكْتُبَ طِفْلُكُمْ جُمْلَةً إِنْجِلِيزِيَّةً مِنْ عِنْدِهِ.","اسْأَلُوهُ: Have you ever …? وَشَجِّعُوهُ عَلَى الإِجَابَةِ.","العَبُوا مَعَهُ: If it rains, … وَيُكْمِلُ الجُمْلَةَ.","الكِتَابُ يُقْرَأُ مِنَ اليَسَارِ إِلَى اليَمِينِ."],
 "noteMini":["raincloud","doctor","apple"],"certP":"لِأَنَّهُ أَتَمَّ «My English Book 7» بِنَجَاحٍ","certArts":["v_read","medal","plane"],
 "blurb":"A complete 3D English book with a brand-new design – part 7, with Arabic meanings for every word.",
 "blurbLi":["Present perfect: have / has and “Have you ever …?”","If … will, and too / enough","who, which, where and the past continuous","How much / How many, and two short stories"],
 "en2":"كِتَابٌ شَامِلٌ بِتَصْمِيمٍ جَدِيدٍ لِتَعْلِيمِ الإِنْجِلِيزِيَّةِ – الجُزْءُ السَّابِعُ","backArts":["kaaba","plane","raincloud","school"],"extraCss":css,"units":U})
print('pages',6+sum(1+len(u.get('items',[]))+len(u['acts']) for u in U))
json.dump(cfg,open('cfg_eng7.json','w'),ensure_ascii=False,indent=1)
