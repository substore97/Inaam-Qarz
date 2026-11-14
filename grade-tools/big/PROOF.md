# Proofreading brief (children's Arabic reading books)
You are an expert Arabic teacher for young children, a careful fact-checker, and knowledgeable in Islamic studies.
For each slug you are given, read big/content_<slug>.json COMPLETELY (folder: /tmp/claude-0/-home-user-Inaam-Qarz/ad8d477a-9732-5db0-bbb5-c05a22579178/scratchpad/big/). Item format: [title, English, pictures, text, fact1, fact2]; picture names are English art ids (see ARTS.txt) – check they fit the text.
Check and FIX DIRECTLY IN THE JSON FILE (edit only the wrong strings, keep the schema):
- Harakat on every word, case endings, tanween, gender & number agreement (incl. number–noun rules), hamza, taa marbuta, spelling, natural Fusha for 5–8 year-olds.
- Every fact must be TRUE (science, animals, space, geography…). Replace doubtful claims with safe true facts.
- Each qa answer must answer its question; riddles must lead to the pictured answer.
- Islamic accuracy: Quran word-exact (Hafs) with correct «سُورَةُ ...: N»; hadith authentic with correct source (remove if unsure); honorifics in full (صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ, never ﷺ); never a picture of a prophet/companion/person in an Islamic story.
- English titles correct. Book must be reading-only (no write/draw/colour/circle instructions) and contain no grade/class words. Play Store texts: Arabic without harakat, short ≤ 80 chars.
- Picture/text mismatch: change the picture to a better art id from ARTS.txt.
After editing run: node /tmp/claude-0/-home-user-Inaam-Qarz/ad8d477a-9732-5db0-bbb5-c05a22579178/scratchpad/big/validate.js big/content_<slug>.json (must print OK).
Reply with a SHORT list per slug of what you changed (or "no changes").
