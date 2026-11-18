# Brief: IELTS Arabic–English dictionary – topic content

You write the content for topic chapters of a high-quality **IELTS vocabulary dictionary for adult Arabic speakers**
(English ⇄ Arabic). Readers are adults preparing for the IELTS exam. The book is read in an app, so there is
**no writing space**: every practice question shows its answer.

Your topics and their 30 fixed headwords are in `topics.json` (field `words`). Use **exactly** these 30 headwords,
spelled exactly as given (same order is fine; the build sorts them A–Z).

Write one file per topic: `content/tNN.json` (NN = two-digit topic number, e.g. `content/t03.json`).
Check it with `node validate.js content/tNN.json` and fix until it prints `OK`.

## Language rules (very important — the owner wants 100% correct writing)
- **English**: British spelling as used in IELTS (analyse, organisation, colour, centre, programme, labour,
  fertiliser). Natural, correct, academic but clear English. No typos.
- **Arabic**: correct Modern Standard Arabic, natural for an educated Arab reader. Correct hamza (أ إ آ ء ؤ ئ),
  ta marbuta (ة) vs ha (ه), alif maqsura (ى) vs ya (ي). Arabic commas «،» and question mark «؟».
  No tashkeel needed (adult readers) — add a shadda or a harakah only where a word would otherwise be ambiguous.
  Never put Latin letters inside Arabic text and never put Arabic letters inside English text.
- Only English and Arabic. No Urdu, no other languages.
- Content must be neutral and suitable for a respectful Muslim audience (no alcohol, gambling, dating, pork,
  etc. in examples; no political propaganda). Facts and numbers must be realistic and not misleading.

## File schema (`content/tNN.json`)
```json
{
 "n": 3,
 "entries": [
  {
   "w": "algorithm",                       // headword, exactly as in topics.json
   "pos": "n.",                            // one of: n.  v.  adj.  adv.  phr.  phr. v.
   "ipa": "/ˈælɡərɪðəm/",                  // British IPA (as in Cambridge/Oxford learner's dictionaries), in slashes, with ˈ ˌ ː
   "lvl": "C1",                            // CEFR level: B1, B2, C1 or C2 (as in English Vocabulary Profile style)
   "ar": "خوارزمية",                       // concise Arabic equivalent(s), separated by «، », max 40 characters
   "ex": "Social media platforms use an *algorithm* to decide which posts we see.",   // IELTS-style sentence, max 120 chars, exactly ONE *...* around the headword (inflected form allowed)
   "exAr": "تستخدم منصات التواصل الاجتماعي *خوارزمية* لتحديد المنشورات التي نراها.",  // faithful Arabic translation, max 130 chars, exactly ONE *...* around the Arabic equivalent
   "syn": ["procedure", "formula"],        // 0–3 real synonyms/near-synonyms useful for paraphrasing (each max 22 chars)
   "col": ["a complex algorithm", "search algorithm"],   // 2–3 common collocations that contain the headword (each max 30 chars)
   "fam": "algorithmic (adj.)"             // word family, e.g. "analyse (v.) · analysis (n.) · analytical (adj.)"; "" if none; max 70 chars; use « · » between items
  }
  // ... 30 entries
 ],
 "practice": {
  "bank": ["...8 headwords of this topic..."],
  "gap": [ {"s": "Many universities now ____ thousands of students on online courses.", "a": "enrol"} ],
        // exactly 8 sentences, each max 130 chars, exactly one "____" (four underscores);
        // the 8 answers use the 8 bank words, each once, in order-shuffled; inflected form allowed (e.g. "enrolled")
  "para": [ {"a": "The number of visitors went up a lot.", "b": "There was a *dramatic* increase in visitor numbers."} ]
        // exactly 4 pairs: a = plain sentence, b = band-7+ paraphrase that uses one headword of this topic in *...*; each max 120 chars
 },
 "speaking": {
  "p1": [ {"q": "...", "a": "..."} ],          // Part 1: exactly 3 questions, each answer 25–45 words, natural spoken English
  "p2": { "cue": "Describe a ...", "points": ["what ...", "when ...", "who ...", "and explain why ..."],
          "a": "..." },                         // Part 2 cue card: 4 points (the last starts "and explain"); model answer 140–180 words
  "p3": [ {"q": "...", "a": "..."} ],          // Part 3: exactly 2 questions, each answer 50–75 words
  "tipAr": "..."                                // one practical speaking tip in Arabic, max 140 chars
 },
 "writing": {
  "task": "Task 2",
  "type": "Opinion essay",                      // one of: Opinion essay, Discussion essay, Advantages and disadvantages, Problem and solution, Two-part question
  "q": "...",                                   // a realistic IELTS Writing Task 2 question, max 320 chars, ending with the usual instruction line
  "essay": ["intro", "body 1", "body 2", "conclusion"],   // band-8 model essay, exactly 4 paragraphs, 250–290 words in total
  "tipAr": "..."                                // one practical writing tip in Arabic for this essay type, max 160 chars
 }
}
```

Mark topic headwords used in the speaking answers and the essay with *...* (at least 6 in the essay,
at least 5 across the speaking answers) so the reader sees them in use. Use * only for that.

### Topic 20 (Data, Graphs & Trends) only
`writing` is a **Task 1 (Academic) report** instead of Task 2:
```json
"writing": {
 "task": "Task 1",
 "type": "Line graph",                      // or "Bar chart"
 "q": "The graph below shows ... Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
 "chart": { "kind": "line", "unit": "%", "x": ["2000","2005","2010","2015","2020"],
            "series": [ {"name": "Country A", "v": [10, 14, 22, 30, 41]}, {"name": "...", "v": [...]}, {"name": "...", "v": [...]} ] },
        // kind "line" or "bar"; 4–6 x labels; 2–3 series; numbers between 0 and 100 (or a clear unit like "million")
 "essay": ["intro", "overview", "details 1", "details 2"],   // band-8 model report, 4 paragraphs, 160–200 words; every number must match the chart exactly
 "tipAr": "..."
}
```

## Quality checklist before you finish
- Every IPA is correct British pronunciation with the primary stress mark in the right place (multi-word headwords: IPA of the whole phrase).
- Every Arabic meaning is the meaning actually used in IELTS contexts (e.g. "sentence" in the Crime topic = حكم قضائي, not جملة).
- `pos` matches how the word is used in the example.
- Each example clearly shows the meaning, sounds like IELTS (education, society, research …), and the Arabic translation is faithful.
- No two entries share the same example idea. No repeated sentences.
- `node validate.js` prints OK.

When done, reply with only: the file names written and anything you were unsure about.
