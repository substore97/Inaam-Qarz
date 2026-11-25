# Brief: «گلدستہ» – a 500-page Urdu family digest (رسالہ)

You write one part of a large Urdu family magazine (digest) for adults and the whole family in Pakistan/India and
the Urdu-speaking diaspora. It is read in an app (no writing space). The owner wants **100% correct writing**.

Write your part as ONE JSON file `content/wNN.json` (your NN is given in your task), check it with
`node validate.js content/wNN.json` until it prints `OK`, then proofread it yourself once, strictly.

## Urdu language rules (very important)
- Standard, polished, flowing Urdu as in good Urdu digests — simple enough for the whole family, never stiff.
- Correct Urdu spelling and Urdu letters: ک (not ك), ی/ے (not ي/ى), ہ for h and ھ only for aspirates (بھائی، پھول، کھانا),
  ۃ only in words like صلوٰۃ/زکوٰۃ if needed, ں for noon ghunna. Correct izafat (علمِ دین is fine), correct gender and
  verb agreement (کتاب پڑھی، اخبار پڑھا), correct postpositions (نے/کو/سے).
- Punctuation: Urdu full stop «۔», comma «،», question mark «؟». Numbers in Urdu digits ۰۱۲۳۴۵۶۷۸۹ (e.g. ۱۹۴۷ء).
- No English words written in Latin letters. Common loanwords in Urdu script are fine (ڈاکٹر، اسکول، موبائل).
- Honorifics always written in full: «صلی اللہ علیہ وسلم» after the Prophet's name (never ﷺ), «علیہ السلام» for
  prophets, «رضی اللہ عنہ / عنہا / عنہم» for Companions, «رحمۃ اللہ علیہ» for scholars.
- Only Urdu (plus Arabic for Quran/hadith/duas where the schema says `ar`). No Hindi script, no Roman Urdu.

## Content rules
- Family-friendly, respectful, mainstream Sunni-neutral Islamic tone (no sectarian or political controversy).
- **No pictures or descriptions of the faces of prophets or Companions.**
- Facts, dates and numbers must be true. If unsure of an exact figure, write it in a way that stays true ("تقریباً").
- Hadith: only well-known authentic (صحیح/حسن) hadith with an exact reference (کتاب + باب or number), e.g.
  «صحیح بخاری، حدیث: ۱» — never weak or fabricated ones. Do not invent sayings and do not attribute quotes to famous
  people unless certain; prefer unattributed wisdom.
- Quran: never type Quranic Arabic yourself. Give surah number and ayah range; the build inserts the exact Uthmani
  text. Your Urdu translation must be faithful (like well-known Urdu translations, in your own words).
- Every piece must be original writing (no copying of published stories or articles).

## JSON schema
```json
{ "w": 6, "items": [ ITEM, ITEM, ... ] }
```
ITEM is one of (all Urdu strings; `p` = list of paragraphs, each 40–140 words):
- `{"type":"article", "t":"عنوان", "sub":"ذیلی عنوان (optional, may be \"\")", "p":["...","..."], "box":{"t":"...","p":"..."} }`
  `box` is optional: a highlighted note / summary / lesson (max 60 words).
- `{"type":"story", "t":"عنوان", "p":["...", ...], "moral":"سبق (max 30 words)"}`
- `{"type":"quran", "t":"عنوان", "s":2, "a":[255,255], "tr":"اردو ترجمہ", "p":["تشریح ...", ...]}`  (a = [first, last] ayah, max 5 ayat)
- `{"type":"dua", "t":"عنوان", "s":2, "a":[201,201], "tr":"ترجمہ", "when":"کب پڑھیں / پس منظر (max 40 words)"}`
- `{"type":"hadith", "t":"عنوان", "ar":"Arabic hadith text WITH full harakat (short, max 40 words)", "tr":"ترجمہ", "ref":"صحیح بخاری، حدیث: ...", "p":["تشریح ..."]}`
- `{"type":"recipe", "t":"نام", "serves":"۴ افراد", "time":"۴۵ منٹ", "ajza":["آدھا کلو ...", ...], "steps":["...", ...], "tip":"..."}`
- `{"type":"list", "t":"عنوان", "style":"jokes|quotes|proverbs|facts|tips", "items":["...", ...]}`  (each item max 60 words; proverbs: "ضرب المثل — مطلب")
- `{"type":"riddles", "t":"عنوان", "items":[{"q":"پہیلی/سوال","a":"جواب"}, ...]}`

## Quality checklist
- Your word target is given in your task — reach it (the validator prints the count). Aim slightly above.
- Every title is unique and attractive. No repeated ideas between items.
- Stories: real plot, dialogue, characters with names, a satisfying ending; 700–1100 words each unless told otherwise.
- Re-read everything as a strict Urdu editor before you finish (spelling, gender agreement, punctuation, facts).

When done, reply only with: file name, word count, and anything you were unsure about.
