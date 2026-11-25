"""Builds build/book.html for an Urdu book on the Guldasta tooling (title from content/static.json).
content/w01..w15.json (writers), content/quran_verses.json (exact Uthmani text cache), content/static.json.
src/paginate.js flows everything into pages in the browser; src/pdf.js prints a vector PDF."""
import json, os, re, html, glob, sys
ROOT = os.path.join(os.path.dirname(__file__), '..')
C = lambda *p: os.path.join(ROOT, 'content', *p)
W = {int(re.search(r'w(\d+)', f).group(1)): json.load(open(f, encoding='utf-8')) for f in sorted(glob.glob(C('w[0-9][0-9].json')))}
ST = json.load(open(C('static.json'), encoding='utf-8'))
QC = C('quran_verses.json')
QV = json.load(open(QC, encoding='utf-8')) if os.path.exists(QC) else {}
QSRC = os.environ.get('QURAN_JSON')  # path to quran-json/dist/quran.json, used to refresh the cache
if QSRC:
    Q = json.load(open(QSRC, encoding='utf-8'))
    for w in W.values():
        for it in w['items']:
            if it['type'] in ('quran', 'dua'):
                s = Q[it['s'] - 1]
                QV[f"{it['s']}"] = {'name': s['name'], **QV.get(str(it['s']), {})}
                for a in range(it['a'][0], it['a'][1] + 1):
                    QV[str(it['s'])][str(a)] = s['verses'][a - 1]['text']
    json.dump(QV, open(QC, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

e = lambda s: html.escape(str(s), quote=False)
U = lambda n: str(n).translate(str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹'))
AI = lambda n: str(n).translate(str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩'))
sys.path.insert(0, os.path.dirname(__file__))
from icons import ICON, ORN, PATTERN, FLOURISH, bouquet, CHATART

def head(t, sub=''):
    return f'<div class="it"><h2>{e(t)}</h2>' + (f'<div class="sub">{e(sub)}</div>' if sub else '') + f'{ORN}</div>'
def title_block(t, small=False):
    return {'k': 'h', 'keep': True, 'html': f'<div class="it{" small" if small else ""}"><h2>{e(t)}</h2>{ORN}</div>'}
P = lambda t, cls='': {'k': 'p', 'text': e(t), 'cls': cls}
H = lambda h: {'k': 'h', 'html': h}
END = H('<div class="end">۞</div>')

def qtext(s, a0, a1):
    v = QV[str(s)]
    return ' '.join(f'{v[str(a)]} <span class="n">﴿{AI(a)}﴾</span>' for a in range(a0, a1 + 1))
def qref(s, a0, a1):
    nm = QV[str(s)]['name']
    return f'سورۃ {nm}، ' + (f'آیت: {U(a0)}' if a0 == a1 else f'آیات: {U(a0)} تا {U(a1)}')

def blocks(it):
    t = it['type']
    if t in ('article', 'story'):
        b = [P(it['p'][0], 'ni')] + [P(x) for x in it['p'][1:]]
        if it.get('box'):
            k = min(len(b), max(2, len(b) // 2 + 1))
            pr = it['box']['t'].startswith('مثال')
            b.insert(k, H(f'<div class="box{" prompt" if pr else ""}"><h4>{e(it["box"]["t"])}</h4>{("<span class=\'chat\'>" + e(it["box"]["p"]) + "</span>") if pr else e(it["box"]["p"])}</div>'))
        if t == 'story' and it.get('moral'):
            b.append(H(f'<div class="moral"><b>سبق: </b>{e(it["moral"])}</div>'))
        b.append(END)
        return 'two', head(it['t'], it.get('sub', '')), b
    if t == 'quran':
        q = f'<div class="qb"><div class="q">{qtext(it["s"], *it["a"])}</div><div class="ref">({qref(it["s"], *it["a"])})</div></div>'
        tr = f'<div class="box"><h4>ترجمہ</h4>{e(it["tr"])}</div>'
        return 'one', '', [title_block(it['t']), H(q), H(tr)] + [P(x) for x in it['p']] + [END]
    if t == 'dua':
        q = f'<div class="qb"><div class="q">{qtext(it["s"], *it["a"])}</div><div class="ref">({qref(it["s"], *it["a"])})</div><div class="tr"><b>ترجمہ: </b>{e(it["tr"])}</div></div>'
        return 'one', '', [title_block(it['t'], True), H(q), H(f'<div class="when">{e(it["when"])}</div>'), END]
    if t == 'hadith':
        q = f'<div class="qb"><div class="q">{e(it["ar"])}</div><div class="tr"><b>ترجمہ: </b>{e(it["tr"])}</div><div class="ref">({e(it["ref"])})</div></div>'
        return 'one', '', [title_block(it['t'], True), H(q)] + [P(x) for x in it['p']] + [END]
    if t == 'recipe':
        aj = ''.join(f'<div>{e(x)}</div>' for x in it['ajza'])
        b = [title_block(it['t']), H(f'<div class="meta"><span>{e(it["serves"])}</span><span>{e(it["time"])}</span></div>'),
             H(f'<div class="ajza"><h4>اجزا</h4>{aj}</div>'), H('<div class="stp"><h4 style="font-weight:700;color:var(--a)">ترکیب</h4></div>')]
        b += [H(f'<div class="step"><i>{U(i + 1)}</i><span>{e(x)}</span></div>') for i, x in enumerate(it['steps'])]
        b.append(H(f'<div class="tip"><b>مفید مشورہ: </b>{e(it["tip"])}</div>'))
        return 'one', '', b
    if t == 'list':
        b = [title_block(it['t'])]
        for x in it['items']:
            if it['style'] == 'jokes': b.append(H(f'<div class="li joke">{e(x)}</div>'))
            elif it['style'] == 'proverbs' and ' — ' in x:
                a, m = x.split(' — ', 1); b.append(H(f'<div class="li prov"><b>{e(a)}</b> — {e(m)}</div>'))
            else: b.append(H(f'<div class="li">{e(x)}</div>'))
        return 'one', '', b + [END]
    if t == 'riddles' and 'اکثر' in it['t']:
        b = [title_block(it['t'])]
        for i, x in enumerate(it['items']):
            b.append(H(f'<div class="faq"><div class="fq"><i>{U(i + 1)}</i>{e(x["q"])}</div><div class="fa">{e(x["a"])}</div></div>'))
        return 'one', '', b + [END]
    if t == 'riddles':
        b = [title_block(it['t'])] + [H(f'<div class="rq"><i>{U(i + 1)}۔</i><span>{e(x["q"])}</span></div>') for i, x in enumerate(it['items'])]
        ans = '، '.join(f'{U(i + 1)}۔ {e(x["a"])}' for i, x in enumerate(it['items']))
        return 'one', '', b + [H(f'<div class="ans"><h4>جوابات</h4>{ans}</div>')]
    raise ValueError(t)

# ---- sections (digest order) ----
SEC = ST['sections']
FILL_STYLES = ('jokes', 'facts', 'quotes', 'proverbs')
sections, fillers = [], []
for s in SEC:
    items = []
    for src in s['from']:
        wn, types = src['w'], src.get('types')
        allit = W.get(wn, {'items': []})['items']
        if 'first' in src: allit = [x for x in allit if x['type'] == 'article'][:src['first']]
        if 'skip' in src: allit = [x for x in allit if x['type'] == 'article'][src['skip']:] + [x for x in allit if x['type'] != 'article']
        for it in allit:
            if types and it['type'] not in types: continue
            if src.get('fill') and it['type'] == 'list' and it['style'] in FILL_STYLES:
                continue
            mode, hd, bl = blocks(it)
            items.append({'t': it['t'], 'mode': mode, 'head': hd, 'blocks': bl})
    if items:
        sections.append({'key': s['key'], 'name': s['name'], 'hue': s['hue'], 'icon': ICON[s['icon']], 'intro': e(s['intro']), 'items': items})
names = {'jokes': 'مسکراہٹیں', 'facts': 'کیا آپ جانتے ہیں؟', 'quotes': 'سنہری باتیں', 'proverbs': 'ضرب الامثال'}
fl = [it for it in W.get(14, {'items': []})['items'] if it['type'] == 'list' and it['style'] in FILL_STYLES]
# interleave filler lists by style so neighbouring boxes differ
by = {k: [x for x in fl if x['style'] == k] for k in FILL_STYLES}
while any(by.values()):
    for k in FILL_STYLES:
        if by[k]:
            x = by[k].pop(0)
            for i in range(0, len(x['items']), 4):
                fillers.append({'t': names[k], 'style': k, 'items': [e(v) for v in x['items'][i:i + 4]]})

# ---- static pages ----
def static_page(inner, hue=40, cls=''):
    return f'<section class="pg {cls}" style="--h:{hue}">{inner}</section>'
cred = '<div class="cred">تالیف: انعام الرحمن</div>'
chips = ''.join(f'<span style="background:hsl({s["hue"]},75%,88%);color:hsl({s["hue"]},65%,20%);border-color:hsl({s["hue"]},55%,55%)">{e(s["name"])}</span>' for s in SEC if any(x['key'] == s['key'] for x in sections) or s['key'] == 'fun')
GOLDPAT = PATTERN.replace('stroke="#fff"', 'stroke="#e8c870"')
cover = static_page(f'''{GOLDPAT}<div class="arch"></div>
<div class="kick">{e(ST["kicker"])}</div><h1>{e(ST["title"])}</h1><div class="latin">CLAUDE AI</div><div class="bq">{CHATART}</div>
<div class="sub">{e(ST["coverSub"])}</div><div class="chips">{chips}</div>
<div class="pages"><span id="totalpages"></span> صفحات پر مشتمل مکمل رہنما</div>''', 175, 'cover')
p2 = static_page(f'''<div class="frame"></div><div class="body" style="justify-content:center;align-items:center;text-align:center">
<div style="font:700 60px/2 Nastaliq;color:#000">{e(ST["title"])}</div><div style="font-size:22px;line-height:2;color:#000">{e(ST["kicker"])}</div>
<div style="width:220px;margin:14px auto">{ORN}</div>
<div style="font:700 30px/2.1 Nastaliq;color:#2a2118;margin-top:10px">تالیف: انعام الرحمن</div>
<div style="font-size:19px;line-height:2.2;margin:30px 40px 0;color:#000">{e(ST["p2"])}</div><div style="font-size:15px;line-height:2.1;margin:26px 50px 0;color:#000">{e(ST["note"])}</div></div>
<div class="ft"><div class="pn"><span></span></div></div>{cred}''', 175)
toc_rows = ''.join(f'<div class="row" data-sec="{s["key"]}"><i style="background:hsl({s["hue"]},52%,40%)"></i><span>{e(s["name"])}</span><span></span></div>' for s in sections)
toc = static_page(f'''<div class="frame"></div><div class="hd"><span class="sec">فہرست</span><span class="mag">{e(ST["title"])}</span></div>
<div class="body toc"><div class="it"><h2>فہرستِ مضامین</h2>{ORN}</div>{toc_rows}</div><div class="ft"><div class="pn"><span></span></div></div>{cred}''', 175)
ed = ''.join(f'<p{" class=ni" if i == 0 else ""}>{e(x)}</p>' for i, x in enumerate(ST['editorial']))
edit = static_page(f'''<div class="frame"></div><div class="hd"><span class="sec">اداریہ</span><span class="mag">{e(ST["title"])}</span></div>
<div class="body"><div class="it"><h2>{e(ST["editorialTitle"])}</h2>{ORN}</div><div class="cols one"><div class="col" style="font-size:19.5px">{ed}<div class="end">۞</div></div></div></div>
<div class="ft"><div class="pn"><span></span></div></div>{cred}''', 175)
back = f'''<section class="pg cover" id="back" style="--h:175">{GOLDPAT}<div class="arch" style="height:760px;top:150px"></div>
<h1 style="top:210px;font-size:84px">{e(ST["title"])}</h1><div class="sub" style="top:400px;left:150px;right:150px;font-size:22px">{e(ST["back"])}</div>
<div class="bq" style="top:600px;width:280px;margin-left:-140px">{CHATART}</div></section>'''

css = open(os.path.join(ROOT, 'src', 'style.css'), encoding='utf-8').read()
js = open(os.path.join(ROOT, 'src', 'paginate.js'), encoding='utf-8').read()
FUN = next((x for x in SEC if x['key'] == 'fun'), {'name': '', 'hue': 0, 'icon': 'fun', 'intro': ''})
data = json.dumps({'title': ST['title'], 'sections': sections, 'fillers': fillers, 'pattern': PATTERN, 'fun': {'key': 'fun', 'name': FUN['name'], 'hue': FUN['hue'], 'icon': ICON[FUN['icon']], 'intro': e(FUN['intro'])}}, ensure_ascii=False).replace('</', '<\\/')
os.makedirs(os.path.join(ROOT, 'build'), exist_ok=True)
open(os.path.join(ROOT, 'build', 'book.html'), 'w', encoding='utf-8').write(
    f'<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>{e(ST["title"])}</title><style>{css}</style></head><body>'
    f'{cover}{p2}{toc}{edit}<div id="book" style="display:contents"></div>{back}'
    f'<script>window.DATA={data};</script><script>document.fonts.ready.then(()=>{{{js}}});</script></body></html>')
print('sections', len(sections), 'items', sum(len(s['items']) for s in sections), 'fillers', len(fillers))
