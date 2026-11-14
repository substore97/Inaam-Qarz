# Brief: content for a 50-page Arabic READING book for young children (ages 4–8)

You write the CONTENT (text + picture choices) of one or more children's books as a JSON file. A separate program turns it into beautiful 3D-illustrated pages; you only write JSON.

## Hard rules
- Language: Modern Standard Arabic (Fusha) with FULL, CORRECT harakat on every Arabic word (tashkeel on every letter where a child needs it, including case endings and tanween). Short, simple, warm sentences a 5–7 year-old can read. Only English is allowed besides Arabic (the `en` fields, `cen`, `en2`). NO Urdu or other languages.
- The book is READING-ONLY (read in an app). NEVER ask the child to write, draw, colour, circle, tick, match, cut or fill anything. Questions must always come WITH their answers.
- Do NOT mention any school grade/class/age level anywhere.
- Never use the ligature ﷺ. After the Prophet's name always write in full: صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ. Companions: رَضِيَ اللّٰهُ عَنْهُ / عَنْهَا. Prophets: عَلَيْهِ السَّلَامُ.
- Islamic content must be accurate: Quran quotes word-exact (Hafs, with harakat) with «سُورَةُ ...: N»; hadith only if authentic (Bukhari/Muslim or clearly sahih/hasan) with the source. Never picture a prophet, companion or any person in an Islamic story: use only objects, animals and nature pictures there.
- Pictures: use ONLY names from ARTS.txt (same folder). A picture name may have a colour: `balloon:#ff6b8a`. Each page shows 1–3 pictures (`arts` = comma-separated, no spaces, e.g. "cat,milk"). Choose pictures that really show what the text says.
- Make it ATTRACTIVE: fun facts, surprises, little stories with names, gentle humour, warm lessons. Vary sentence openings. Each page must be interesting on its own.

## JSON schema (exactly these keys)
{
 "title": "plain Arabic title without harakat (for the file)",
 "t1": "cover title line 1 with harakat", "t2": "cover title line 2 with harakat",
 "csub": "cover subtitle (Arabic, ≤ 45 chars)", "cen": "English cover title",
 "ownerArt": "art", "ownerMini": [3 arts], "coverTop": [3 arts], "coverBot": [4 arts],
 "noteP": "parents' note paragraph (1–2 sentences)", "noteLi": [3 short tips for parents – reading/talking only],
 "noteMini": [3 arts], "ovTitle": "title of the contents page (2–3 words)",
 "f1L": "label shown before fact 1 (e.g. 🍃 أَيْنَ يَعِيشُ؟ or 💡 الجَوَابُ)", "f2L": "label shown before fact 2",
 "items": [ 40 pages, each: ["page title", "English title", "arts", "main text (1–3 short sentences, ≤ 230 chars incl. harakat)", "fact 1 (≤ 70 chars)", "fact 2 (≤ 70 chars)"] ],
 "acts": [ exactly 4 end-of-book reading pages:
    {"type":"review","title":"...","rows":[[art, word] ×12]},
    {"type":"facts","title":"...","rows":[4–6 lines, each may start with an emoji]},
    {"type":"qa","title":"...","rows":[[question, answer] ×4–5]},
    {"type":"story2","title":"...","lines":[4–7 short lines],"arts":[3 arts]}  (a 4th type may be {"type":"raw","title":"...","html":"<div class=\"refc\" style=\"--h:45\"><p>QURAN OR HADITH</p><span>📖 SOURCE</span></div>","arts":[3 arts]} for Islamic books, instead of story2 or facts) ],
 "certP": "certificate line, e.g. لِأَنَّهُ قَرَأَ كِتَابَ ... كُلَّهُ",
 "certArts": [3 arts], "blurb": "back-cover sentence", "blurbLi": [4 short lines], "backArts": [4 arts],
 "en2": "English back-cover line, e.g. 'Forest Tales – an Arabic reading book for kids'",
 "playShort": "Play Store short description, Arabic WITHOUT harakat, ≤ 80 chars",
 "playFull": "Play Store full description, Arabic WITHOUT harakat, 500–1500 chars, mention 50 pages, 3D pictures, reading-only, end with: تأليف: انعام الرحمن"
}
For story books, a story spans several consecutive pages: use the same page title for its pages, put "١" "٢" ... progress in fact 1 or use the facts for "the lesson"/"a new word". Facts may never be empty strings – always write something useful.

## Process
1. Write the file `content_<slug>.json` (slug given to you) in this folder: /tmp/claude-0/-home-user-Inaam-Qarz/ad8d477a-9732-5db0-bbb5-c05a22579178/scratchpad/big/
2. Validate: `node /tmp/claude-0/-home-user-Inaam-Qarz/ad8d477a-9732-5db0-bbb5-c05a22579178/scratchpad/big/validate.js <file>` and fix until it prints OK.
3. Re-read your Arabic carefully once more for harakat/grammar (number–noun agreement, gender agreement, hamza, taa marbuta) and facts.
4. Reply only with: the file names you wrote and "OK".
