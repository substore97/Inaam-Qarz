# Notes for Claude

## Book delivery preferences (from the owner, Inaam ur Rahman)
Every time a book is made or updated, send ALL of these to the user:
1. **App PDF**: as few MB as possible but Full HD (1920 px tall pages), with no visible quality loss. This is what goes in their app.
2. **Full PDF**: full-quality print version (300 DPI).
3. **Front cover as a separate JPG**.
4. **Play Console text file** `<Prefix>-PlayStore.txt` in the book folder: book name in Arabic and English, an Arabic short description (max 80 chars) and an Arabic full description (max 4000 chars). Check the lengths before sending.

**Page size: always A4 (portrait).**

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

Shared tooling lives in `arabic-kids-book/src/` (3D art library `art.js`, `pdf.js`, `pack.py`).
For a new book: `BOOK_DIR=<dir> node arabic-kids-book/src/pdf.js <FilePrefix> "<Arabic title>"`.
