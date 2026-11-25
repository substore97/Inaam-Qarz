# Brief: Urdu book «کلاڈ اے آئی — مکمل رہنما» (a guide to Claude AI)

You write one part of an Urdu book that explains Claude, the AI assistant made by the company Anthropic, to ordinary
Urdu readers (students, teachers, shopkeepers, parents, office workers) who have never used AI. The book is read in an
app. The owner wants **100% correct writing and correct facts**.

Write ONE JSON file `content/wNN.json`; check it with `node validate.js content/wNN.json` until it prints OK; then
proofread it yourself once, strictly.

## Language
- Simple, warm, clear standard Urdu (like a good Urdu newspaper/digest), short sentences, easy examples from
  Pakistani daily life. Correct Urdu letters (ک ی ے ہ ھ ں), Urdu punctuation ۔ ، ؟ and Urdu digits ۰۱۲۳۴۵۶۷۸۹.
- **No Latin letters at all** (the validator rejects them). Write names in Urdu script:
  کلاڈ (Claude), اینتھروپک (Anthropic), اے آئی (AI), چیٹ (chat), پرامپٹ (prompt), ایپ، ویب سائٹ، کلاڈ ڈاٹ اے آئی
  (claude.ai), کلاڈ کوڈ (Claude Code), اے پی آئی (API), پروجیکٹس (Projects), آرٹیفیکٹس (Artifacts),
  ہائیکو، سونیٹ، اوپس (Haiku, Sonnet, Opus). Explain each technical word once in plain Urdu.
- Example prompts (what the reader types to Claude) are written in Urdu.

## Facts — only safe, well-established facts
- Claude is made by Anthropic, an AI safety and research company founded in 2021 by former OpenAI researchers
  including Dario Amodei and Daniela Amodei, based in San Francisco (USA).
- Anthropic trains Claude to be helpful, honest and harmless; it developed an approach called «آئینی اے آئی»
  (Constitutional AI) in which the model learns from a written set of principles.
- Claude comes in model families: Haiku (fast and light), Sonnet (balanced), Opus (most capable). New versions are
  released from time to time — do NOT give version numbers, release dates, prices, usage limits or plan details;
  say that plans, features and limits can change and the reader should check the official website.
- Ways to use it: the website claude.ai, mobile apps (Android, iPhone), desktop app, Claude Code (for programmers),
  and the API (for developers/companies). Features you may mention in general terms: uploading files/PDFs/images and
  asking about them, long documents, Projects (keeping related chats and files together), Artifacts (documents,
  code or small apps shown in a side panel), web search in some plans/regions. Say "some features may be available
  only in some plans or countries".
- Claude can make mistakes («غلط معلومات بھی دے سکتا ہے»), can be out of date, is not a doctor/lawyer/mufti
  — always verify important information. Never share passwords, bank/card numbers or very private data.
- Do not invent statistics, user numbers, quotes or awards. Do not compare negatively with other companies.

## JSON schema
```json
{ "w": 1, "items": [ ITEM, ... ] }
```
- `{"type":"article","t":"عنوان","sub":"ذیلی عنوان یا خالی","p":["پیراگراف ۱","..."],"box":{"t":"...","p":"..."}}`
  p = 3–6 paragraphs of 40–130 words each. `box` (optional, max 60 words) = a key point, a tip, or an
  **example prompt** (then box.t = «مثال: کلاڈ سے یوں پوچھیں» and box.p = the Urdu prompt text).
- `{"type":"list","t":"عنوان","style":"tips","items":["...","..."]}` (8–15 items, each max 60 words)
- `{"type":"riddles","t":"عنوان","items":[{"q":"سوال","a":"جواب"}]}` — used for **FAQ / quizzes** (q max 50 words, a max 30 words)

When done reply only: file name, word count, anything unsure.
