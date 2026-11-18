# Proofreading brief – IELTS Arabic–English dictionary

You are an independent, strict proofreader (expert in British English, IELTS, English phonetics and Modern Standard
Arabic). The owner demands 100% correct writing. Files were written by another writer following `BRIEF.md` (read it).

For each file you are given, read EVERY string and fix problems **directly in the file** (keep the JSON schema; keep the
30 headwords unchanged). Then run `node validate.js content/tNN.json` until it prints OK.

Check, entry by entry:
1. **IPA** – correct British (RP, Cambridge/Oxford learner's dictionary style) pronunciation, correct primary stress ˈ
   (and secondary ˌ where useful), ː for long vowels, no American r-colouring, slashes. Phrases: whole phrase.
2. **pos** matches the example. **lvl** plausible (B1/B2/C1/C2).
3. **ar** – the correct Arabic meaning *in this topic's sense*, correct spelling (hamza, ة/ه, ى/ي), natural MSA.
4. **ex** – grammatical, natural, IELTS-like; the *…* marks the headword (or its inflection). Facts true / not misleading.
5. **exAr** – faithful, fluent Arabic translation; correct grammar and agreement (gender, number, i'rab endings where
   written); *…* marks the Arabic equivalent; Arabic punctuation.
6. **syn** – real synonyms/near-synonyms that can replace the word in some context (remove bad ones);
   **col** – genuine, common collocations; **fam** – real word-family members with correct pos.
7. **practice** – each gap has exactly one correct answer from the bank (no other bank word fits equally well!),
   the answer form fits the grammar, every bank word used once; paraphrase b really means the same as a.
8. **speaking / writing** – natural, band-8 English; correct grammar and punctuation; the essay answers the
   question and its type; Task 1 (topic 20) numbers in the report match the chart exactly; Arabic tips correct.
9. Suitability: neutral and respectful for a Muslim audience; nothing offensive; no Urdu or other languages.

When done, reply with a SHORT list: file → number of fixes and the most important ones (one line each).
