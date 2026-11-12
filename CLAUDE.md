# Notes for Claude

## Book delivery preferences (from the owner, Inaam ur Rahman)
Every time a book is made or updated, send ALL of these to the user:
1. **App PDF**: as few MB as possible but Full HD (1920 px tall pages), with no visible quality loss. This is what goes in their app.
   App PDF target ≈ 3–4 MB: `pack.py` encodes it with mozjpeg (install once per container: `mkdir -p /tmp/mzj && cd /tmp/mzj && npm i mozjpeg@8.0.0`), lowering quality from q72 until ≤ 4 MB, never below q60. Busy page textures (ruled lines, dots) inflate size, so keep page backgrounds plain.
2. **Full PDF**: full-quality print version (300 DPI).
3. **Front cover as a separate JPG**.
4. **Play Console text file** `<Prefix>-PlayStore.txt` in the book folder: book name in Arabic and English, an Arabic short description (max 80 chars) and an Arabic full description (max 4000 chars). Check the lengths before sending.

**GitHub stores SOURCE CODE ONLY.** Built PDFs and cover JPGs are git-ignored (root `.gitignore`) and are only sent to the owner, who keeps them in Google Drive. Never commit them. (All book PDFs/JPGs were permanently purged from the git history at the owner's request; repo is source-only, ~5 MB.)

**Page size: always A4 (portrait).**

**Book text is ONLY Arabic and English. Never put Urdu (or any other language) inside a book.** (Chat replies stay in Roman Urdu.)

**Writing must be very clear: big text, generous line-height so harakat never touch other letters; titles use the Baloo font (Lalezar crowds harakat). Never write "class" on a book.** Grade/syllabus books show a small "Grade N" badge at the top of the front cover (owner request).

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

Shared tooling lives in `arabic-kids-book/src/` (3D art library `art.js`, `pdf.js`, `pack.py`).
For a new book: `BOOK_DIR=<dir> node arabic-kids-book/src/pdf.js <FilePrefix> "<Arabic title>"`.
