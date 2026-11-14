# Notes for Claude

## Book delivery preferences (from the owner, Inaam ur Rahman)
Every time a book is made or updated, send the owner ONLY the **App PDF** (owner request, Nov 2026): as few MB as possible (≈3–4 MB) but Full HD (1920 px tall pages), with no visible quality loss. Do NOT make or send the print PDF or the cover JPG any more (build makes only the App PDF by default; `PRINT=1` env would add them).
   `pack.py` encodes the App PDF with mozjpeg (install once per container: `mkdir -p /tmp/mzj && cd /tmp/mzj && npm i mozjpeg@8.0.0`), lowering quality from q72 until ≤ 4 MB, never below q60. Busy page textures (ruled lines, dots) inflate size, so keep page backgrounds plain.
When a whole grade set is made, send all its App PDFs together in one message at the end.
Still write `<Prefix>-PlayStore.txt` in each book folder (Arabic + English name, Arabic short ≤80 chars, full ≤4000 chars; check lengths) and keep it in the repo.
**Every new grade must get a genuinely NEW page interface (layout, not just colours), different from EVERY earlier grade** — the owner finds repeated layouts boring (Nov 2026: "aage jitne b grades banaye sab ke interfaces har ek se alag alag hon"). Grade 6 = layout `g6` (white page, coloured header band, picture+side boxes, quiz cards with أ ب ج). Grade 7 = layout `g7` (pastel page, white cards, hexagon numbers, hero picture with name pill, steps timeline, yellow sticky note, ribbon exercise titles, tick-box options, full-colour unit pages). Grade 8 = layout `g8` (cream paper, coloured side spine with vertical unit name, tilted polaroid picture + big quote, top-bordered info cards, chalkboard writing area, folder-tab activities with underline-the-answer options in ( a | b ), ( ) marks for true/false, diamond page numbers, dark cover with ring). Grade 9 = layout `g9` (white page inside a rounded coloured frame, colour hero block with bookmark lesson number + big round picture, big-number points 1-2-3, speech-bubble writing area, two-column exercise cards where the child writes the answer number in a box, dotted-line true/false, ring unit pages with dotted contents, tab page numbers, striped cover). Grade 10 = layout `g10` (pale blue-grey page, pill lesson header, mind-map lesson: sentence card on top + two side cards joined by dashed lines to a dashed round picture, index-card writing area with red first line, exercises with A/B/C options plus an exam-style answer sheet with bubbles to shade, roadmap unit pages with a tilted stamp, quarter-circle corner page numbers, colour-block cover). Grade 11 = layout `g11` (magazine: cream page, running header with double rule and page number at the top, kicker label + big headline + English deck, captioned framed picture, lead paragraph + fact boxes with thick side border, spiral-bound notebook writing area, exercises where the child colours the correct dashed-outline answer card (👍/👎 for true/false), ticket-shaped unit pages with perforated stub, banded magazine cover). Grade 12 = layout `g12` (split page: wide coloured side panel with big lesson number, round picture overlapping into the white page and the Arabic/English meaning; big example box, round-icon info rows, letter-paper "my own example" lines; exercises with a numbered square badge header where the child CIRCLES the correct option (also True/False); unit pages with a picture strip, full-width colour band with big number, and a 3-column tile grid of lessons/tasks; outlined square page numbers; split cover with a colour panel and stripe).
**Grade-1 topic books (Nov 2026, 10 books, 24 pages, APP_MB=1.5 → ~1.6–1.8 MB): each has its OWN layout `k1`–`k10` (themes `themek1..k10` = `kbase.css` + `kN.css` in `grade-tools/`), all different from each other and from g6–g12:** k1 Ramadan (navy night sky, gold arch window, hanging name tag, scroll sentence, navy fact pills), k2 Mosque (green top/bottom bands, dome-shaped picture card, red prayer-rug sentence, two pillar boxes, minaret act headers), k3 Prophets (open storybook spread: picture page + name/story page, "أعرف/أتعلم" cards, bookmark-ribbon act headers), k4 Animal gifts (red barn with the animal → arrow → orange circle with its gift, wooden fence sentence, barn-roof act headers), k5 Singular/plural ("واحد" card ↓ "كثير" card with three pictures, stacked-card act headers), k6 First sentences (comic panel + speech bubble, one card per word, comic-burst act headers), k7 Shopping (shop awning, shelf, tilted price tag, coins to count, shopping-bag act headers), k8 Communication (smartphone screen with chat bubbles, notification act headers), k9 Ordinals (10-wagon train with the current wagon lit, big number + word, train act headers), k10 Desert (sun corner, dunes, wooden signpost name, signpost act headers). Covers differ too. Any new Grade-1 topic book needs yet another new layout.
**READING-ONLY RULE (owner, Nov 2026): the books are for reading (in an app), so from now on NO writing anywhere** — no «أَكْتُبُ الكَلِمَةَ» tracing, no write/draw/colour/circle/match-with-a-line activities, no name line on the owner page, no name/date/signature lines on the certificate. End-of-book pages are reading pages instead: picture-word review grid (`review`), facts list (`facts`), short story/dialogue (`story2`), questions WITH their answers shown (`qa`), Quran/hadith card (`raw` refc). Base CSS `rbase.css` hides `.trace/.nameline/.sig`. First reading books: layouts k11 Stories (big rounded scene + storybook text, page-curl corner), k12 Question words (purple question card, dashed fold line, answer card with picture, tip strip), k13 Inside my body (wooden clipboard with metal clip, ticked fact list), k14 Companions (rolled parchment scroll with wooden rods, gold medallion; no pictures of people), k15 Travel (airmail postcard with stamp & postmark, yellow ticket sentence, luggage-tag facts). k16 Alphabet `hijaiyya-book` (every letter page a different pastel colour, huge letter in a white toy block with coloured 3D edge, name pill, harakat row + letter-forms row, two picture-word cards; rainbow-striped cover; overview = letter grid). k17 Numbers 1–100 `ginti-book` (1–20: each page its own pastel colour, big numeral in a shaded colour ball inside a dashed ring with the Western numeral in a small white badge, word pill, pictures to count for 1–10 and ten-frame dots for 11–20; 21–100: `tens` act pages, 10 numbers each in two columns of numeral-ball + name; colour-dot cover).
**20 × 50-page reading books (Nov 2026, no grade): content JSON written by agents per `grade-tools/big/BRIEF.md` (validated by `big/validate.js`, proofread per `big/PROOF.md`), built with `make_big.py` + `buildb.sh` (APP_MB=3 → 3.4–5.2 MB at the q60 floor). Item = [title, en, arts, text, f1, f2] with labels f1L/f2L; 40 item pages + 4 reading end pages. Each its own layout:** k18 animals encyclopedia (trading card with coloured frame & number), k19 sea (brass porthole + waves), k20 space (dark sky with orbits + mission-log card), k21 nature (round explorer badge with mountains + red ribbon), k22 forest tales (leaf canopy, wooden picture frame, signboard), k23 bedtime (night sky, moon, cloud-shaped text), k24 Robo (computer window + code panel + chips), k25 farm (patchwork quilt with stitched patch), k26 prophets' stories (illuminated manuscript, arch, gold corner stars, no people), k27 manners (big heart + evidence strip + medal), k28 Allah's names (8-point star medallion), k29 Sara's diary (taped diary page, date tab, ribbon), k30 riddles (envelope: yellow riddle flap → answer), k31 did-you-know (glowing light bulb + tilted stickers), k32 experiments (lab flask + 3 numbered steps), k33 picture dictionary (alphabet thumb-index tabs), k34 fruits (wooden crate + label), k35 transport (green road sign + road), k36 weather (weather-app glass card), k37 jobs (ID badge on lanyard).
Quality process for every book: lint script, an independent proofreader agent (Arabic/English/Quran/hadith/math answers), and a visual page check.

**GitHub stores SOURCE CODE ONLY.** Built PDFs and cover JPGs are git-ignored (root `.gitignore`) and are only sent to the owner, who keeps them in Google Drive. Never commit them. (All book PDFs/JPGs were permanently purged from the git history at the owner's request; repo is source-only, ~5 MB.)

**Page size: always A4 (portrait).**

**Book text is ONLY Arabic and English. Never put Urdu (or any other language) inside a book.** (Chat replies stay in Roman Urdu.)

**Writing must be very clear: big text, generous line-height so harakat never touch other letters; titles use the Baloo font (Lalezar crowds harakat). Never write "class" on a book.** Grade/syllabus books show a small "Grade N" badge at the top of the front cover (owner request). **But if the owner does NOT name a grade in the request, write NO grade anywhere (no badge, no "Grade" in texts or PlayStore) — owner, Nov 2026: "jab me grade na likhon tu koi b grade na likho".**

**Grade / syllabus books: when the owner asks for any grade, make one complete book per subject of the Arab-country syllabus for that grade, ALWAYS including English. Grade 1 set: لغتي، رياضياتي، علومي، دراساتي الإسلامية، English.** The English book is left-to-right, English text with Arabic translations only.

**Tracing words are solid light grey (`fill:#dcd5e8`), never dashed outlines.**

**White text always gets a dark outline/border** so it is clearly readable (see `ring()` / `t3d()` in `home-book/src/build.js`).

Author credit "تأليف: انعام الرحمن" goes on page 2 only, always directly below the heading "هذا الكتاب ملك", not on the front or back cover. Page 2 has no "عمري ... سنوات" (age) line.
The fonts cannot render the ligature ﷺ — always write صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ in full.

User communicates in Roman Urdu; reply in Roman Urdu.

## Books so far
- `arabic-kids-book/`: حروفي الجميلة (Arabic alphabet), 36 pages
- `animals-book/`: حيواناتي الجميلة (animals), 32 pages
- `numbers-book/`: أرقامي الجميلة (numbers 1–20), 32 pages
- `colors-shapes-book/`: ألواني وأشكالي (colors & shapes), 32 pages
- `fruits-veg-book/`: فواكهي وخضراواتي (fruits & vegetables), 32 pages
- `vehicles-book/`: مركباتي الجميلة (vehicles), 32 pages
- `opposites-book/`: أضدادي الجميلة (opposites), 28 pages
- `seasons-book/`: فصولي الجميلة (weather, seasons & days), 28 pages
- `home-book/`: بيتي الجميل (things at home), 32 pages
- `space-book/`: فضائي الجميل (space & planets), 32 pages
- `sea-book/`: بحري الجميل (sea creatures), 28 pages
- `toys-book/`: ألعابي الجميلة (toys & play manners), 28 pages
- `birds-book/`: طيوري وحشراتي (birds & insects), 28 pages
- `clothes-book/`: ملابسي الجميلة (clothes), 28 pages
- `food-book/`: طعامي الجميل (food & eating manners), 28 pages
- `duas-book/`: أدعيتي الجميلة (16 daily duas with sources), 28 pages
- `school-book/`: أدواتي المدرسية (school supplies), 28 pages
- `body-book/`: جسمي الجميل (body parts & five senses), 24 pages
- `jobs-book/`: مهني الجميلة (professions), 24 pages
- `sounds-book/`: أصوات الحيوانات (animal sounds), 24 pages
- `garden-book/`: حديقتي الجميلة (plants & garden), 24 pages
- `feelings-book/`: مشاعري الجميلة (feelings & emotions), 24 pages
- `islam-book/`: ديني الجميل (pillars of Islam & Iman, prayers, wudu), 20 pages
- `day-book/`: يومي الجميل (daily routine & telling time), 24 pages
- `manners-book/`: أخلاقي الجميلة (good manners with sources), 24 pages
- `math-book/`: أجمع وأطرح (addition & subtraction), 28 pages
- `babies-book/`: صغار الحيوانات (baby animal names), 24 pages
- `harakat-book/`: حركاتي الجميلة (vowel marks & reading), 20 pages
- `months-book/`: شهوري الهجرية (Hijri months), 24 pages
- `city-book/`: مدينتي الجميلة (places in the city), 24 pages
- `family-book/`: أسرتي الجميلة (family members), 24 pages
- `hygiene-book/`: نظافتي الجميلة (personal hygiene), 24 pages
- `sports-book/`: رياضتي الجميلة (sports), 24 pages
- `where-book/`: أين القطة؟ (position words), 24 pages
- `homes-book/`: بيوت الحيوانات (animal homes), 24 pages
- `shamsi-book/`: الحروف الشمسية والقمرية (sun & moon letters), 24 pages
- `safety-book/`: سلامتي أولا (safety rules), 24 pages
- `earth-book/`: أحافظ على بيئتي (caring for the environment), 24 pages
- `verbs-book/`: أفعالي الجميلة (action verbs), 24 pages
- `compare-book/`: أقارن وأقيس (comparing & measuring), 24 pages
- `lughati-book/`: لغتي الجميلة (Arabic language, first-grade syllabus), 48 pages
- `math1-book/`: رياضياتي الجميلة (math, first-grade syllabus), 48 pages
- `science1-book/`: علومي الجميلة (science, first-grade syllabus), 48 pages
- `islamic1-book/`: دراساتي الإسلامية (Islamic studies, first-grade syllabus), 48 pages
- `english1-book/`: My English Book (English, first-grade syllabus), 48 pages
- `lughati2-book/`: لغتي الجميلة ٢ (Arabic language, second-grade syllabus), 48 pages
- `math2-book/`: رياضياتي الجميلة ٢ (math, second-grade syllabus), 48 pages
- `science2-book/`: علومي الجميلة ٢ (science, second-grade syllabus), 48 pages
- `islamic2-book/`: دراساتي الإسلامية ٢ (Islamic studies, second-grade syllabus), 48 pages
- `english2-book/`: My English Book 2 (English, second-grade syllabus), 48 pages
- `lughati3-book/`: لغتي الجميلة ٣ (Arabic language, third-grade syllabus), 48 pages
- `math3-book/`: رياضياتي الجميلة ٣ (math, third-grade syllabus), 48 pages
- `science3-book/`: علومي الجميلة ٣ (science, third-grade syllabus), 48 pages
- `islamic3-book/`: دراساتي الإسلامية ٣ (Islamic studies, third-grade syllabus), 48 pages
- `english3-book/`: My English Book 3 (English, third-grade syllabus), 48 pages
- `lughati4-book/`: لغتي الجميلة ٤ (Arabic language, fourth-grade syllabus), 48 pages
- `math4-book/`: رياضياتي الجميلة ٤ (math, fourth-grade syllabus), 48 pages
- `science4-book/`: علومي الجميلة ٤ (science, fourth-grade syllabus), 48 pages
- `islamic4-book/`: دراساتي الإسلامية ٤ (Islamic studies, fourth-grade syllabus), 48 pages
- `english4-book/`: My English Book 4 (English, fourth-grade syllabus), 48 pages
- `lughati5-book/`: لغتي الجميلة ٥ (Arabic language, fifth-grade syllabus), 48 pages
- `math5-book/`: رياضياتي الجميلة ٥ (math, fifth-grade syllabus), 48 pages
- `science5-book/`: علومي الجميلة ٥ (science, fifth-grade syllabus), 48 pages
- `islamic5-book/`: دراساتي الإسلامية ٥ (Islamic studies, fifth-grade syllabus), 48 pages
- `english5-book/`: My English Book 5 (English, fifth-grade syllabus), 48 pages
- `lughati6-book/`: لغتي الجميلة ٦ (Arabic language, sixth-grade syllabus), 48 pages
- `math6-book/`: رياضياتي الجميلة ٦ (math, sixth-grade syllabus), 48 pages
- `science6-book/`: علومي الجميلة ٦ (science, sixth-grade syllabus), 48 pages
- `islamic6-book/`: دراساتي الإسلامية ٦ (Islamic studies, sixth-grade syllabus), 48 pages
- `english6-book/`: My English Book 6 (English, sixth-grade syllabus), 48 pages
- `lughati7-book/`: لغتي الجميلة ٧ (Arabic language, seventh-grade syllabus), 48 pages
- `math7-book/`: رياضياتي الجميلة ٧ (math, seventh-grade syllabus), 48 pages
- `science7-book/`: علومي الجميلة ٧ (science, seventh-grade syllabus), 48 pages
- `islamic7-book/`: دراساتي الإسلامية ٧ (Islamic studies, seventh-grade syllabus), 48 pages
- `english7-book/`: My English Book 7 (English, seventh-grade syllabus), 48 pages
- `lughati8-book/`: لغتي الجميلة ٨ (Arabic language, eighth-grade syllabus), 48 pages
- `math8-book/`: رياضياتي الجميلة ٨ (math, eighth-grade syllabus), 48 pages
- `science8-book/`: علومي الجميلة ٨ (science, eighth-grade syllabus), 48 pages
- `islamic8-book/`: دراساتي الإسلامية ٨ (Islamic studies, eighth-grade syllabus), 48 pages
- `english8-book/`: My English Book 8 (English, eighth-grade syllabus), 48 pages
- `lughati9-book/`: لغتي الجميلة ٩ (Arabic language, ninth-grade syllabus), 48 pages
- `math9-book/`: رياضياتي الجميلة ٩ (math, ninth-grade syllabus), 48 pages
- `science9-book/`: علومي الجميلة ٩ (science, ninth-grade syllabus), 48 pages
- `islamic9-book/`: دراساتي الإسلامية ٩ (Islamic studies, ninth-grade syllabus), 48 pages
- `english9-book/`: My English Book 9 (English, ninth-grade syllabus), 48 pages
- `lughati10-book/`: لغتي الجميلة ١٠ (Arabic language, tenth-grade syllabus), 48 pages
- `math10-book/`: رياضياتي الجميلة ١٠ (math, tenth-grade syllabus), 48 pages
- `science10-book/`: علومي الجميلة ١٠ (science, tenth-grade syllabus), 48 pages
- `islamic10-book/`: دراساتي الإسلامية ١٠ (Islamic studies, tenth-grade syllabus), 48 pages
- `english10-book/`: My English Book 10 (English, tenth-grade syllabus), 48 pages
- `lughati11-book/`: لغتي الجميلة ١١ (Arabic language, eleventh-grade syllabus), 48 pages
- `math11-book/`: رياضياتي الجميلة ١١ (math, eleventh-grade syllabus), 48 pages
- `science11-book/`: علومي الجميلة ١١ (science, eleventh-grade syllabus), 48 pages
- `islamic11-book/`: دراساتي الإسلامية ١١ (Islamic studies, eleventh-grade syllabus), 48 pages
- `english11-book/`: My English Book 11 (English, eleventh-grade syllabus), 48 pages
- `lughati12-book/`: لغتي الجميلة ١٢ (Arabic language, twelfth-grade syllabus), 48 pages
- `science12-book/`: علومي الجميلة ١٢ (science, twelfth-grade syllabus), 48 pages
- `math12-book/`: رياضياتي الجميلة ١٢ (math, twelfth-grade syllabus), 48 pages
- `islamic12-book/`: دراساتي الإسلامية ١٢ (Islamic studies, twelfth-grade syllabus), 48 pages
- `english12-book/`: My English Book 12 (English, twelfth-grade syllabus), 48 pages
- `ramadan-book/`: رمضان والعيد (Ramadan & Eid, grade 1, layout k1), 24 pages
- `masjid-book/`: مسجدي الجميل (the mosque & its manners, grade 1, layout k2), 24 pages
- `prophets-book/`: أنبياء الله (12 prophets of Allah, grade 1, layout k3), 24 pages
- `animalgifts-book/`: هدايا الحيوانات (what animals give us, grade 1, layout k4), 24 pages
- `plural-book/`: واحد وكثير (singular & plural, grade 1, layout k5), 24 pages
- `sentences-book/`: جملتي الأولى (first short sentences, grade 1, layout k6), 24 pages
- `shopping-book/`: أتسوق وأعد النقود (shopping & counting money, grade 1, layout k7), 24 pages
- `connect-book/`: أتواصل مع الناس (communication & its manners, grade 1, layout k8), 24 pages
- `ordinals-book/`: الأول والثاني (ordinal numbers first–tenth, grade 1, layout k9), 24 pages
- `desert-book/`: صحرائي الجميلة (the desert, grade 1, layout k10), 24 pages
- `stories-book/`: حكاياتي القصيرة (7 short stories, grade 1 reading-only, layout k11), 24 pages
- `questions-book/`: أسأل وأجيب (question words with answers, grade 1 reading-only, layout k12), 24 pages
- `inside-book/`: جسمي من الداخل (organs of the body, grade 1 reading-only, layout k13), 24 pages
- `sahaba-book/`: أصحاب النبي (12 Companions, grade 1 reading-only, layout k14), 24 pages
- `travel-book/`: رحلتي الجميلة (travel & its manners, grade 1 reading-only, layout k15), 24 pages
- `hijaiyya-book/`: الحروف الهجائية (colourful Arabic alphabet, reading-only, layout k16), 36 pages
- `ginti-book/`: أعدادي من ١ إلى ١٠٠ (colourful numbers 1–100, reading-only, layout k17), 36 pages
- `animals-encyclopedia-book/`: موسوعتي للحيوانات (My Animal Encyclopedia, reading-only, layout k18), 50 pages
- `sea-world-book/`: عالم البحار (The World of the Seas, reading-only, layout k19), 50 pages
- `space-secrets-book/`: أسرار الفضاء (Secrets of Space, reading-only, layout k20), 50 pages
- `nature-wonders-book/`: عجائب الطبيعة (Wonders of Nature, reading-only, layout k21), 50 pages
- `forest-tales-book/`: حكايات الغابة (Forest Tales, reading-only, layout k22), 50 pages
- `bedtime-book/`: حكايات قبل النوم (Bedtime Stories, reading-only, layout k23), 50 pages
- `robo-book/`: مغامرات روبو (Robo's Adventures, reading-only, layout k24), 50 pages
- `happy-farm-book/`: المزرعة السعيدة (The Happy Farm, reading-only, layout k25), 50 pages
- `anbiya-stories-book/`: قصص الأنبياء (Stories of the Prophets, reading-only, layout k26), 50 pages
- `akhlaq-book/`: أخلاق المسلم الصغير (Good Manners of a Little Muslim, reading-only, layout k27), 50 pages
- `asmaa-book/`: من أسماء الله الحسنى (Allah's Beautiful Names, reading-only, layout k28), 50 pages
- `sara-diary-book/`: يوميات سارة (Sara's Diary, reading-only, layout k29), 50 pages
- `riddles-book/`: ألغاز من أنا (Riddles: Who Am I?, reading-only, layout k30), 50 pages
- `didyouknow-book/`: هل تعلم (Did You Know?, reading-only, layout k31), 50 pages
- `experiments-book/`: تجارب علمية مدهشة (Amazing Science Experiments, reading-only, layout k32), 50 pages
- `picture-dictionary-book/`: قاموسي المصور (My Picture Dictionary, reading-only, layout k33), 50 pages
- `fruits-encyclopedia-book/`: موسوعة الفواكه والخضار (My Fruit & Vegetable Encyclopedia, reading-only, layout k34), 50 pages
- `transport-book/`: وسائل النقل (Ways to Travel, reading-only, layout k35), 50 pages

Grade-book generator (configs, page templates, themes, lint, proofread dump) is saved in `grade-tools/` — copy it to the scratchpad to use.
Shared tooling lives in `arabic-kids-book/src/` (3D art library `art.js`, `pdf.js`, `pack.py`).
For a new book: `BOOK_DIR=<dir> node arabic-kids-book/src/pdf.js <FilePrefix> "<Arabic title>"`.
