# Proofreading brief – «گلدستہ» Urdu family digest

You are an independent, strict Urdu editor (and well-read in Islamic sources). The owner demands 100% correct writing.
The files were written by others following `BRIEF.md` (read it first). Read EVERY string of your files and fix
problems **directly in the JSON** (keep the schema, item types and order). Then run `node validate.js content/wNN.json`
until it prints OK. Do not shorten the content noticeably (the magazine must stay 500+ pages).

Check:
1. **Urdu spelling and grammar**: correct letters (ک ی ے ہ ھ ں), spelling of common words, gender/number agreement
   of verbs and adjectives, postpositions (نے/کو/سے/میں), izafat, natural idiomatic Urdu, no repeated words, no
   half-finished sentences, Urdu punctuation ۔ ، ؟ and Urdu digits.
2. **Honorifics in full**: صلی اللہ علیہ وسلم، علیہ السلام، رضی اللہ عنہ/عنہا/عنہم، رحمۃ اللہ علیہ (never ﷺ).
3. **Islamic accuracy**: hadith only authentic and correctly referenced — if a hadith number is doubtful, replace the
   number with the book name (e.g. «صحیح بخاری») or remove the reference; remove anything weak/fabricated or
   presented as hadith without basis. For `hadith` items check that the Arabic text (with harakat) is correct and the
   translation faithful. For `quran`/`dua` items check that the Urdu translation matches the ayah numbers given
   (see the Arabic with: node -e "const q=require('./npm/node_modules/quran-json/dist/quran.json');const s=q[S-1];console.log(s.verses.slice(A-1,B).map(v=>v.text).join(' '))").
   No sectarian or controversial statements; no descriptions of the faces of prophets or Companions.
4. **Facts**: dates, numbers, places, science and health facts must be true; soften or fix anything doubtful;
   health advice must be safe and mainstream (always "consult a doctor" for illness, no medicine doses).
5. **Answers** of riddles/puzzles are correct; recipes have sensible quantities and steps.
6. Family-friendly and respectful throughout.

Reply with a SHORT list: file → number of fixes and the most important ones.
