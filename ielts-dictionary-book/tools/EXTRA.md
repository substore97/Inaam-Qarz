# Brief: IELTS dictionary – guide & language pages (`content/extra.json`)

This is for a high-quality IELTS vocabulary dictionary for **adult Arabic speakers** (English ⇄ Arabic), read in an app
(no writing space). Same language rules as `BRIEF.md`: perfect British English, perfect Modern Standard Arabic (correct
hamza, ة/ه, ى/ي, Arabic punctuation ، ؟), no tashkeel needed, no Latin letters inside Arabic strings, no Arabic letters
inside English strings, only English and Arabic. All facts about the test must be accurate for the current IELTS test
(Academic and General Training; paper and computer). Do not claim things that might change (no prices, no dates).

Write `content/extra.json` with exactly this shape (string lengths are maximums):

```json
{
 "guide": {
  "introAr": "...",          // 2–3 sentences in Arabic: what IELTS is and who it is for (max 300)
  "introEn": "...",          // same in English (max 300)
  "skills": [                // exactly 4, in this order: Listening, Reading, Writing, Speaking
   {"en": "Listening", "ar": "الاستماع", "time": "about 30 minutes", "format": "4 parts · 40 questions",
    "infoEn": "...", "infoAr": "...",          // 1–2 sentences each (max 220)
    "tipsEn": ["...", "...", "..."], "tipsAr": ["...", "...", "..."]}   // exactly 3 tips, each max 110; tipsAr[i] = translation of tipsEn[i]
  ],
  "bands": [ {"b": "9", "en": "Expert user", "ar": "..."} ],   // exactly 10 rows: 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 with the official short names; ar max 30
  "scoreEn": "...", "scoreAr": "..."          // how the overall band is calculated (average of 4, rounded to nearest half band) (max 260)
 },
 "howto": {                  // how to use this dictionary (the reader sees: topic chapters with 30 entries, practice page, speaking page, writing page, A–Z indexes)
  "stepsEn": ["...", "...", "...", "...", "..."], "stepsAr": ["...", "...", "...", "...", "..."],   // exactly 5 study steps, each max 150; ar = translation
  "keyEn": [["n.", "noun"], ["v.", "verb"], ["adj.", "adjective"], ["adv.", "adverb"], ["phr.", "phrase"], ["phr. v.", "phrasal verb"]],
  "keyAr": ["اسم", "فعل", "صفة", "ظرف", "عبارة", "فعل مركب"],
  "lvlEn": "...", "lvlAr": "..."              // explain CEFR levels B1, B2, C1, C2 and their rough IELTS band (B1 ≈ 4–5, B2 ≈ 5.5–6.5, C1 ≈ 7–8, C2 ≈ 8.5–9) (max 260)
 },
 "task1": [                  // Writing Task 1 language: exactly 6 groups, each with exactly 6 items
   {"en": "Describing an increase", "ar": "...", "items": [ {"en": "rise sharply", "ar": "..."} ]}
   // groups: Describing an increase · Describing a decrease · Stability and peaks · Speed and size of change (adverbs/adjectives) · Comparing and contrasting · Approximation and proportion
   // item en max 40, ar max 40
 ],
 "task1Model": ["...", "..."],   // 2 example sentences (max 160) using these phrases, describing a made-up graph
 "essayTypes": [             // exactly 5: Opinion essay, Discussion essay, Advantages and disadvantages, Problem and solution, Two-part question
   {"en": "Opinion essay", "ar": "...", "sampleQ": "...",                 // a typical question wording (max 160)
    "plan": ["Introduction: ...", "Body 1: ...", "Body 2: ...", "Conclusion: ..."],      // each max 110
    "planAr": ["...", "...", "...", "..."]}                                 // translations, each max 110
 ],
 "linking": [                // exactly 8 groups, each exactly 5 items
   {"en": "Adding ideas", "ar": "...", "items": [ {"en": "Furthermore,", "ar": "..."} ]}
   // groups: Adding ideas · Contrast · Cause and effect · Giving examples · Giving your opinion · Sequencing · Emphasis · Concluding
 ],
 "speakPhrases": [           // exactly 6 groups, each exactly 5 items (spoken, natural, not over-formal)
   {"en": "Buying time to think", "ar": "...", "items": [ {"en": "That's an interesting question.", "ar": "..."} ]}
   // groups: Buying time to think · Giving opinions · Agreeing and disagreeing · Giving examples · Talking about the past and changes · Speculating about the future
 ],
 "mistakes": [               // exactly 24 common mistakes that ARABIC speakers make in IELTS English
   {"wrong": "I am agree with this opinion.", "right": "I agree with this opinion.", "whyAr": "..."}   // wrong/right max 70; whyAr max 110: short clear reason in Arabic
   // cover: verb 'to be' misuse, articles a/an/the, prepositions, uncountable nouns (information, advice, research), subject–verb agreement,
   // word order, spelling (p/b, vowels), double subjects ("My brother he…"), present perfect vs past simple, make/do, say/tell, the
   // people/peoples, too/very, since/for, comma splices, missing plural -s, "discuss about", "more better", "according to me"
 ],
 "tips": [                   // exactly 10 short exam-day / study tips
   {"en": "...", "ar": "..."}  // each max 120
 ]
}
```

Check: `node -e "JSON.parse(require('fs').readFileSync('content/extra.json','utf8'))"` must not error, counts must match
exactly, and no string exceeds its maximum. Reply with only the file name and anything you were unsure about.
