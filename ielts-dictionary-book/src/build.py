"""Builds build/book.html for «قاموسي للآيلتس – My IELTS Dictionary».
Content: content/topics.json, content/tNN.json (20 topics), content/extra.json.
Then src/pdf.js prints it to a small vector PDF (sharp text at any zoom)."""
import json, os, re, html, sys
sys.path.insert(0, os.path.dirname(__file__))
from icons import icon

ROOT = os.path.join(os.path.dirname(__file__), '..')
C = lambda *p: os.path.join(ROOT, 'content', *p)
T = json.load(open(C('topics.json'), encoding='utf-8'))
X = json.load(open(C('extra.json'), encoding='utf-8'))
D = {t['n']: json.load(open(C(f"t{t['n']:02d}.json"), encoding='utf-8')) for t in T}
HUES = [212, 145, 262, 352, 28, 42, 228, 192, 322, 172, 200, 14, 292, 275, 160, 48, 95, 4, 120, 245]
TITLE_EN, TITLE_AR = 'My IELTS Dictionary', 'قاموسي للآيلتس'
PER = 6  # entries per dictionary page

e = lambda s: html.escape(str(s), quote=False)
def hl(s):  # *word* -> <b>word</b>
    return re.sub(r'\*([^*]+)\*', r'<b>\1</b>', e(s))
def key(w):
    w = w.lower()
    return w[4:] if w.startswith('the ') else w
def arkey(s):
    s = s.split('،')[0].strip()
    s = re.sub('[ً-ْـ]', '', s)
    if s.startswith('ال') and len(s) > 3: s = s[2:]
    return s.translate(str.maketrans('أإآٱةى', 'اااايه' if False else 'ااااهي'))
def ar1(s): return re.sub(r'\s*\([^)]*\)', '', s.split('،')[0]).strip()

pages = []  # list of (kind, html-builder)
page_no = {}

def sec(inner, h=212, cls=''):
    return f'<section class="pg {cls}" style="--h:{h}">{inner}{'' if 'cover' in cls else '<div class="cred" dir="rtl">تأليف: انعام الرحمن</div>'}</section>'
def footer(n):
    return f'<div class="ft"><span>{TITLE_EN}</span><span class="pn">{n}</span><span class="ar">{TITLE_AR}</span></div>'
def header(t, mid):
    return (f'<div class="rh"><span class="tn">{t["n"]:02d}</span><span class="tt">{e(t["en"])}</span>'
            f'<span class="gw">{mid}</span><span class="ta">{e(t["ar"])}</span></div>')
def hdr_plain(en, ar):
    return f'<div class="rh"><span class="tt">{e(en)}</span><span class="gw"></span><span class="ta">{e(ar)}</span></div>'

# ---------- plan the page numbers first ----------
plan = ['cover', 'owner', 'toc', 'howto', 'guide1', 'guide2']
for t in T:
    plan += [('open', t['n'])] + [('dict', t['n'], i) for i in range(5)] + [('prac', t['n']), ('speak', t['n']), ('write', t['n'])]
plan += ['task1', 'essays', 'essays2', 'linking', 'speakp', 'mist1', 'mist2', 'tips']
ALL = []
for t in T:
    for en_ in D[t['n']]['entries']:
        ALL.append(dict(en_, t=t['n']))
EN_ROWS_PER_PAGE, AR_ROWS_PER_PAGE = 62, 58
def ix_pages(items, kf, per):
    out, cur, used, last = [], [], 0, None
    for it in items:
        L = kf(it)[0].upper()
        cost = 1 + (1.9 if L != last else 0)
        if used + cost > per:
            out.append(cur); cur, used = [], 0; last = None
            cost = 2.9
        if L != last: cur.append(('L', L)); last = L
        cur.append(('r', it)); used += cost
    if cur: out.append(cur)
    return out
EN_IX = ix_pages(sorted(ALL, key=lambda x: key(x['w'])), lambda x: key(x['w']), EN_ROWS_PER_PAGE)
AR_IX = ix_pages(sorted(ALL, key=lambda x: arkey(x['ar'])), lambda x: arkey(x['ar']), AR_ROWS_PER_PAGE)
plan += [('ixe', i) for i in range(len(EN_IX))] + [('ixa', i) for i in range(len(AR_IX))] + ['back']
for i, p in enumerate(plan, 1): page_no[p if isinstance(p, str) else p] = i
num = lambda p: page_no[p]

# page of each word
SORTED = {}
for t in T:
    es = sorted(D[t['n']]['entries'], key=lambda x: key(x['w']))
    SORTED[t['n']] = es
    for i, en_ in enumerate(es):
        en_['_p'] = num(('dict', t['n'], i // PER))
WP = {(x['w']): x['_p'] for n in SORTED for x in SORTED[n]}

out = []
# ---------- cover ----------
tiles = ''.join(f'<div style="background:hsl({HUES[i]},55%,42%)">{icon(i + 1)}</div>' for i in range(20))
stripes = ''.join(f'<i style="background:hsl({h},55%,45%)"></i>' for h in HUES)
out.append(sec(f'''<div class="stripes">{stripes}</div><div class="frame"></div>
<div class="emb"><span>A</span><em>⇄</em><span class="ar">ع</span></div>
<div class="kick">ENGLISH ⇄ ARABIC · ARABIC ⇄ ENGLISH</div>
<h1>{TITLE_EN}</h1><h2 dir="rtl">{TITLE_AR}</h2>
<div class="sub">600 essential words in 20 IELTS topics · practice · model answers</div>
<div class="suba" dir="rtl">٦٠٠ كلمة أساسية في ٢٠ موضوعًا مع تمارين وإجابات نموذجية</div>
<div class="tiles">{tiles}</div>
<div class="feat"><span>British IPA</span><span>CEFR levels</span><span>Speaking</span><span>Writing</span><span>A–Z indexes</span></div>
<div class="stripes2">{stripes}</div>''', 30, 'cover'))

# ---------- owner page (page 2) ----------
out.append(sec(f'''<div class="body" style="justify-content:center;align-items:center;text-align:center;font-size:17px">
<div style="width:150px;height:150px;border-radius:50%;background:var(--t);display:flex;align-items:center;justify-content:center;margin-bottom:26px">{icon('book')}</div>
<h2 class="ar" style="font-size:44px;line-height:1.6;color:var(--navy)">هذا الكتاب ملك</h2>
<p class="ar" style="font-size:28px;font-weight:700;color:var(--a);line-height:1.8;margin-bottom:34px">تأليف: انعام الرحمن</p>
<h3 class="serif" style="font-size:34px;color:var(--navy)">{TITLE_EN}</h3>
<p class="ar" style="font-size:30px;font-weight:700;color:#8a4b12;line-height:1.7">{TITLE_AR}</p>
<p style="margin:26px 60px 0;line-height:1.6;color:var(--mute)">A topic-by-topic English ⇄ Arabic vocabulary dictionary with practice, speaking and writing models for IELTS Academic and General Training.</p>
<p class="ar" style="margin:10px 60px 0;line-height:1.9;font-size:19px;color:var(--mute)">قاموس مفردات إنجليزي ⇄ عربي مرتب حسب الموضوعات، مع تمارين ونماذج للمحادثة والكتابة لاختبار الآيلتس الأكاديمي والعام.</p>
<p style="margin:44px 70px 0;line-height:1.55;font-size:12.5px;color:#8a90a0">IELTS is a registered trademark of the British Council, IDP: IELTS Australia and Cambridge University Press &amp; Assessment. This book is an independent study aid and is not affiliated with or endorsed by them.</p>
</div>{footer(2)}''', 212))

# ---------- contents ----------
rows = ''.join(f'<div class="row"><span class="n" style="background:hsl({HUES[t["n"]-1]},55%,40%)">{t["n"]:02d}</span><span class="e">{e(t["en"])}</span><span class="ar">{e(t["ar"])}</span><span class="p">{num(("open", t["n"]))}</span></div>' for t in T)
back = [('How to use this dictionary', 'طريقة استخدام القاموس', 'howto'), ('The IELTS test', 'اختبار الآيلتس', 'guide1'),
        ('Writing Task 1 language', 'لغة المهمة الأولى في الكتابة', 'task1'), ('Writing Task 2: essay types', 'أنواع مقالات المهمة الثانية', 'essays'),
        ('Linking words', 'أدوات الربط', 'linking'), ('Speaking phrases', 'عبارات المحادثة', 'speakp'),
        ('Common mistakes', 'أخطاء شائعة', 'mist1'), ('Study & exam tips', 'نصائح للدراسة والاختبار', 'tips'),
        ('Index: English → Arabic', 'فهرس: إنجليزي ← عربي', ('ixe', 0)), ('Index: Arabic → English', 'فهرس: عربي ← إنجليزي', ('ixa', 0))]
rows2 = ''.join(f'<div class="row"><span class="n" style="background:#1f2d4a">•</span><span class="e">{a}</span><span class="ar">{b}</span><span class="p">{num(k)}</span></div>' for a, b, k in back)
out.append(sec(f'''<div class="body toc fit" style="font-size:15px"><div class="h1x"><h2>Contents</h2><span class="ar">المحتويات</span></div>
<div>{rows}</div><div style="height:14px"></div><div>{rows2}</div></div>{footer(num("toc"))}''', 212))

# ---------- how to use ----------
H = X['howto']
sample = SORTED[3][0] if SORTED.get(3) else ALL[0]
def entry(x):
    syn = ' · '.join(e(s) for s in x['syn'])
    col = ' · '.join(e(s) for s in x['col'])
    meta = (f'<span><i>SYN</i>{syn}</span>' if syn else '') + f'<span><i>COLLOCATIONS</i>{col}</span>' + (f'<span><i>FAMILY</i>{e(x["fam"])}</span>' if x['fam'] else '')
    return (f'<div class="en"><div class="r1"><span class="hw">{e(x["w"])}</span><span class="pos">{e(x["pos"])}</span><span class="ipa">{e(x["ipa"])}</span>'
            f'<span class="lvl">{x["lvl"]}</span><span class="mar">{e(x["ar"])}</span></div>'
            f'<p class="ex">{hl(x["ex"])}</p><p class="exar" dir="rtl">{hl(x["exAr"])}</p><div class="meta">{meta}</div></div>')
steps = ''.join(f'<div class="card"><h4><span>{i + 1}. {e(a)}</span></h4><p class="ar" dir="rtl">{e(b)}</p></div>' for i, (a, b) in enumerate(zip(H['stepsEn'], H['stepsAr'])))
keys = ''.join(f'<div class="pair"><span><b>{e(a)}</b> {e(b)}</span><span class="ar">{e(c)}</span></div>' for (a, b), c in zip(H['keyEn'], H['keyAr']))
out.append(sec(f'''<div class="body fit" style="font-size:15px"><div class="h1x"><h2>How to use this dictionary</h2><span class="ar">طريقة الاستخدام</span></div>
<div class="card" style="border:2px solid var(--a2)"><div class="sub">SAMPLE ENTRY · مثال</div>{entry(sample)}</div>
{steps}
<div class="two"><div class="card"><h4>Abbreviations <span class="ar">الاختصارات</span></h4>{keys}</div>
<div class="card"><h4>Levels <span class="ar">المستويات</span></h4><p>{e(H["lvlEn"])}</p><p class="ar" dir="rtl" style="margin-top:.3em">{e(H["lvlAr"])}</p></div></div>
</div>{footer(num("howto"))}''', 200))

# ---------- IELTS guide (2 pages) ----------
G = X['guide']
SK = []
for s in G['skills']:
    sk = ''
    tips = ''.join(f'<li>{e(a)}<br><span class="ar" dir="rtl" style="display:block;text-align:right;font-size:1.06em;line-height:1.7">{e(b)}</span></li>' for a, b in zip(s['tipsEn'], s['tipsAr']))
    sk += f'''<div class="card"><h4><span>{e(s["en"])}</span><span class="ar">{e(s["ar"])}</span></h4><div class="sub">{e(s["time"])} · {e(s["format"])}</div>
<p>{e(s["infoEn"])}</p><p class="ar" dir="rtl">{e(s["infoAr"])}</p><ul style="margin-top:.25em">{tips}</ul></div>'''
    SK.append(sk)
out.append(sec(f'''<div class="body fit" style="font-size:15.5px"><div class="h1x"><h2>The IELTS test</h2><span class="ar">اختبار الآيلتس</span></div>
<p style="line-height:1.5">{e(G["introEn"])}</p><p class="ar" dir="rtl" style="line-height:1.8;font-size:1.08em;margin-bottom:.5em">{e(G["introAr"])}</p>
<div class="two" style="grid-template-columns:1fr 1fr;align-items:start">{SK[0]}{SK[1]}</div></div>{footer(num("guide1"))}''', 200))
bands = ''.join(f'<tr><td class="b" style="background:hsl({200 - int(b["b"]) * 0 + (9 - int(b["b"])) * 18},50%,{30 + (9 - int(b["b"])) * 3}%)">{b["b"]}</td><td>{e(b["en"])}</td><td class="ar" dir="rtl">{e(b["ar"])}</td></tr>' for b in G['bands'])
tipsX = ''.join(f'<div class="pair"><span>{e(t_["en"])}</span></div><p class="ar" dir="rtl" style="text-align:right;font-size:1.06em;line-height:1.75;border-bottom:1px dashed #e3e6ec;padding-bottom:.15em">{e(t_["ar"])}</p>' for t_ in X['tips'][:0])
out.append(sec(f'''<div class="body fit" style="font-size:15px"><div class="h1x"><h2>Writing, Speaking &amp; band scores</h2><span class="ar">الكتابة والمحادثة والدرجات</span></div><div class="two" style="align-items:start">{SK[2]}{SK[3]}</div>
<div class="card"><table class="bands">{bands}</table></div>
<div class="card"><h4>How the overall band is calculated <span class="ar">حساب الدرجة الكلية</span></h4><p>{e(G["scoreEn"])}</p><p class="ar" dir="rtl" style="margin-top:.3em">{e(G["scoreAr"])}</p></div>
</div>{footer(num("guide2"))}''', 200))

# ---------- topics ----------
def chart_svg(c):
    W_, H_, L, R, Tp, B = 700, 300, 54, 160, 16, 40
    xs = c['x']; ser = c['series']; mx = max(max(s['v']) for s in ser)
    top = 10 ** len(str(int(mx))) / 10
    step = top if mx / top > 4 else top / 2
    ymax = (int(mx / step) + 1) * step
    cols = ['#1f5fa8', '#d9822b', '#2e8b57']
    g = []
    n = len(xs); pw = W_ - L - R; ph = H_ - Tp - B
    Y = lambda v: Tp + ph - v / ymax * ph
    k = 0
    while k * step <= ymax + 1e-9:
        v = k * step; y = Y(v)
        g.append(f'<line x1="{L}" y1="{y:.1f}" x2="{W_ - R}" y2="{y:.1f}" stroke="#dde1e8"/><text x="{L - 8}" y="{y + 4:.1f}" text-anchor="end" font-size="12" fill="#5b6578">{int(v) if v == int(v) else v}</text>')
        k += 1
    if c['kind'] == 'line':
        Xp = lambda i: L + pw * (i / (n - 1))
        for si, s in enumerate(ser):
            pts = ' '.join(f'{Xp(i):.1f},{Y(v):.1f}' for i, v in enumerate(s['v']))
            g.append(f'<polyline points="{pts}" fill="none" stroke="{cols[si]}" stroke-width="3"/>')
            g += [f'<circle cx="{Xp(i):.1f}" cy="{Y(v):.1f}" r="4" fill="#fff" stroke="{cols[si]}" stroke-width="2.5"/>' for i, v in enumerate(s['v'])]
        g += [f'<text x="{Xp(i):.1f}" y="{H_ - B + 20}" text-anchor="middle" font-size="12.5" fill="#1c2638">{e(x)}</text>' for i, x in enumerate(xs)]
    else:
        gw = pw / n; bw = gw * .75 / len(ser)
        for i, x in enumerate(xs):
            for si, s in enumerate(ser):
                x0 = L + gw * i + gw * .125 + bw * si
                g.append(f'<rect x="{x0:.1f}" y="{Y(s["v"][i]):.1f}" width="{bw - 2:.1f}" height="{Tp + ph - Y(s["v"][i]):.1f}" fill="{cols[si]}" rx="2"/>')
            g.append(f'<text x="{L + gw * i + gw / 2:.1f}" y="{H_ - B + 20}" text-anchor="middle" font-size="12.5" fill="#1c2638">{e(x)}</text>')
    g.append(f'<line x1="{L}" y1="{Tp + ph}" x2="{W_ - R}" y2="{Tp + ph}" stroke="#1c2638" stroke-width="1.5"/>')
    g.append(f'<text x="{L - 40}" y="{Tp - 2}" font-size="12" fill="#5b6578">{e(c.get("unit", ""))}</text>')
    for si, s in enumerate(ser):
        y = Tp + 20 + si * 26
        g.append(f'<rect x="{W_ - R + 16}" y="{y - 10}" width="16" height="12" rx="2" fill="{cols[si]}"/><text x="{W_ - R + 38}" y="{y}" font-size="13" fill="#1c2638">{e(s["name"])}</text>')
    return f'<svg class="chart" viewBox="0 0 {W_} {H_}" font-family="Noto Sans">{"".join(g)}</svg>'

for t in T:
    n, h = t['n'], HUES[t['n'] - 1]
    d = D[n]; es = SORTED[n]
    # opener
    wl = ''.join(f'<div class="w"><b>{e(x["w"])}</b><span class="ar">{e(ar1(x["ar"]))}</span><span class="p">{x["_p"]}</span></div>' for x in es)
    out.append(sec(f'''<div class="op"><div class="panel"></div><div class="num">{n:02d}</div><div class="lab">Topic {n} of 20</div>
<h1>{e(t["en"])}</h1><h2 dir="rtl">{e(t["ar"])}</h2><div class="icw">{icon(n)}</div>
<div class="wl"><h3><span>30 words in this topic</span><span class="ar">كلمات هذا الموضوع</span></h3><div class="cols">{wl}</div></div></div>{footer(num(("open", n)))}''', h))
    for i in range(5):
        chunk = es[i * PER:(i + 1) * PER]
        mid = f'{e(chunk[0]["w"])}<i>—</i>{e(chunk[-1]["w"])}'
        out.append(sec(header(t, mid) + f'<div class="body ents fit">{"".join(entry(x) for x in chunk)}</div>' + footer(num(("dict", n, i))), h))
    # practice
    P = d['practice']
    bank = ''.join(f'<span>{e(b)}</span>' for b in P['bank'])
    gaps = ''.join(f'<li>{e(g["s"]).replace("____", "<span class=blank></span>")}</li>' for g in P['gap'])
    para = ''.join(f'<div class="pa">{e(p["a"])}</div><div class="pb">{hl(p["b"])}</div>' for p in P['para'])
    keyp = ''.join(f'<span><i>{k + 1}</i>{e(g["a"])}</span> ' for k, g in enumerate(P['gap']))
    out.append(sec(header(t, 'Practice') + f'''<div class="body fit" style="font-size:16.5px">
<div class="st"><span class="k">A</span><h3>Complete each sentence with a word from the box</h3><span class="ar">أكمل الجمل</span></div>
<div class="bank">{bank}</div><ol class="gap">{gaps}</ol>
<div class="st" style="margin-top:.8em"><span class="k">B</span><h3>Paraphrase like a Band 7+ candidate</h3><span class="ar">إعادة الصياغة</span></div>
<div class="para"><div class="lb">Simple</div><div class="lb">Band 7+</div>{para}</div>
<div class="key"><h4>Answers · الإجابات</h4><p>{keyp}</p></div></div>''' + footer(num(("prac", n))), h))
    # speaking
    S = d['speaking']
    p1 = ''.join(f'<div class="qa"><div class="q">{e(q["q"])}</div><div class="a">{hl(q["a"])}</div></div>' for q in S['p1'])
    p3 = ''.join(f'<div class="qa"><div class="q">{e(q["q"])}</div><div class="a">{hl(q["a"])}</div></div>' for q in S['p3'])
    pts = ''.join(f'<li>{e(x)}</li>' for x in S['p2']['points'])
    out.append(sec(header(t, 'Speaking') + f'''<div class="body fit" style="font-size:15.6px">
<div class="st"><span class="k">1</span><h3>Part 1 · Introduction and interview</h3><span class="ar">الجزء الأول</span></div>{p1}
<div class="st"><span class="k">2</span><h3>Part 2 · Long turn (cue card)</h3><span class="ar">الجزء الثاني</span></div>
<div class="cue"><div class="c1">{e(S["p2"]["cue"])}</div><div class="ys">You should say:</div><ul>{pts}</ul></div>
<span class="tag">Model answer</span><p class="model">{hl(S["p2"]["a"])}</p>
<div class="st"><span class="k">3</span><h3>Part 3 · Discussion</h3><span class="ar">الجزء الثالث</span></div>{p3}
<div class="tip"><span class="tl">نصيحة</span><p class="ar" dir="rtl">{e(S["tipAr"])}</p></div></div>''' + footer(num(("speak", n))), h))
    # writing
    W = d['writing']
    labels = ['Introduction', 'Body paragraph 1', 'Body paragraph 2', 'Conclusion'] if W['task'] == 'Task 2' else ['Introduction', 'Overview', 'Details 1', 'Details 2']
    words = sum(len(re.sub(r'\*', '', p).split()) for p in W['essay'])
    ess = ''.join(f'<p><span class="pl">{labels[k]}</span>{hl(p)}</p>' for k, p in enumerate(W['essay']))
    chart = chart_svg(W['chart']) if W.get('chart') else ''
    lim = 'Write at least 250 words.' if W['task'] == 'Task 2' else 'Write at least 150 words.'
    out.append(sec(header(t, 'Writing') + f'''<div class="body fit" style="font-size:16.2px">
<div class="st"><span class="k">W</span><h3>Writing {W["task"]} · {e(W["type"])}</h3><span class="ar">الكتابة</span></div>
<div class="taskq"><div class="tq"><span>Question</span><span>{lim}</span></div><p>{e(W["q"])}</p></div>{chart}
<div class="essay">{ess}</div><div class="wc">Model answer · {words} words</div>
<div class="tip"><span class="tl">نصيحة</span><p class="ar" dir="rtl">{e(W["tipAr"])}</p></div></div>''' + footer(num(("write", n))), h))

# ---------- language pages ----------
def groups_page(title_en, title_ar, groups, pk, fs=15, extra=''):
    cards = ''
    for g in groups:
        items = ''.join(f'<div class="pair"><span>{e(it["en"])}</span><span class="ar">{e(it["ar"])}</span></div>' for it in g['items'])
        cards += f'<div class="card"><h4><span>{e(g["en"])}</span><span class="ar">{e(g["ar"])}</span></h4>{items}</div>'
    return sec(f'''<div class="body fit" style="font-size:{fs}px"><div class="h1x"><h2>{title_en}</h2><span class="ar">{title_ar}</span></div>
<div class="two" style="align-items:start">{cards}</div>{extra}</div>{footer(num(pk))}''', 245)
ex1 = ''.join(f'<p style="line-height:1.55;margin-bottom:.25em">▸ {e(s)}</p>' for s in X['task1Model'])
out.append(groups_page('Writing Task 1 language', 'لغة وصف الرسوم البيانية', X['task1'], 'task1', 14.6, f'<div class="card"><h4>In a report <span class="ar">مثال</span></h4>{ex1}</div>'))
for pk, part in (('essays', X['essayTypes'][:3]), ('essays2', X['essayTypes'][3:])):
    cards = ''
    for s_ in part:
        li = ''.join(f'<li>{e(a)}<span class="ar" dir="rtl" style="display:block;text-align:right;font-size:1.06em;line-height:1.7">{e(b)}</span></li>' for a, b in zip(s_['plan'], s_['planAr']))
        cards += f'<div class="card"><h4><span>{e(s_["en"])}</span><span class="ar">{e(s_["ar"])}</span></h4><p style="font-style:italic;color:var(--mute);margin:.1em 0 .2em">“{e(s_["sampleQ"])}”</p><ul>{li}</ul></div>'
    out.append(sec(f'''<div class="body fit" style="font-size:16px"><div class="h1x"><h2>Writing Task 2: essay types</h2><span class="ar">أنواع المقالات</span></div>{cards}</div>{footer(num(pk))}''', 245))
out.append(groups_page('Linking words', 'أدوات الربط', X['linking'], 'linking', 14.6))
out.append(groups_page('Speaking phrases', 'عبارات المحادثة', X['speakPhrases'], 'speakp', 14.6))
M = X['mistakes']; half = (len(M) + 1) // 2
for k, part in enumerate([M[:half], M[half:]]):
    rows = ''.join(f'<div class="mis"><span class="w">{e(m["wrong"])}</span><span class="r">{e(m["right"])}</span><p class="y ar" dir="rtl">{e(m["whyAr"])}</p></div>' for m in part)
    out.append(sec(f'''<div class="body fit" style="font-size:15.4px"><div class="h1x"><h2>Common mistakes {k + 1}/2</h2><span class="ar">أخطاء شائعة</span></div>{rows}</div>{footer(num("mist" + str(k + 1)))}''', 352))
tips = ''.join(f'<div class="card"><h4><span>{i + 1}. {e(t_["en"])}</span></h4><p class="ar" dir="rtl">{e(t_["ar"])}</p></div>' for i, t_ in enumerate(X['tips']))
out.append(sec(f'''<div class="body fit" style="font-size:15.5px"><div class="h1x"><h2>Study &amp; exam tips</h2><span class="ar">نصائح</span></div>{tips}</div>{footer(num("tips"))}''', 145))

# ---------- indexes ----------
for i, pg in enumerate(EN_IX):
    body = ''.join(f'<div class="L">{e(v)}</div>' if k == 'L' else f'<div class="r"><b>{e(v["w"])}</b><span class="ar">{e(ar1(v["ar"]))}</span><span class="p">{v["_p"] if "_p" in v else WP[v["w"]]}</span></div>' for k, v in pg)
    out.append(sec(hdr_plain('Index · English → Arabic', 'فهرس إنجليزي ← عربي') + f'<div class="body"><div class="ix">{body}</div></div>' + footer(num(("ixe", i))), 228))
for i, pg in enumerate(AR_IX):
    body = ''.join(f'<div class="L ar">{e(v)}</div>' if k == 'L' else f'<div class="r"><span class="ar">{e(ar1(v["ar"]))}</span><b>{e(v["w"])}</b><span class="p">{WP[v["w"]]}</span></div>' for k, v in pg)
    out.append(sec(hdr_plain('Index · Arabic → English', 'فهرس عربي ← إنجليزي') + f'<div class="body"><div class="ix ixa">{body}</div></div>' + footer(num(("ixa", i))), 228))

# ---------- back cover ----------
out.append(sec(f'''<div class="stripes">{stripes}</div><div class="frame"></div>
<div style="position:absolute;left:90px;right:90px;top:170px;text-align:center">
<div class="ar" style="font-size:48px;font-weight:700;line-height:1.6;color:#8a4b12">{TITLE_AR}</div><div class="serif" style="font-size:36px;font-weight:700;color:#1f2d4a;margin-bottom:30px">{TITLE_EN}</div>
<p class="ar" dir="rtl" style="font-size:22px;line-height:1.9;color:#1f2d4a">٦٠٠ كلمة أساسية لاختبار الآيلتس في ٢٠ موضوعًا، لكل كلمة نطقها البريطاني ومعناها بالعربية ومثال مترجم ومرادفات وتراكيب شائعة. مع تمارين بالإجابات، ونماذج للمحادثة بأجزائها الثلاثة، ومقالات نموذجية، وفهرسين: إنجليزي–عربي وعربي–إنجليزي.</p>
<p style="font-size:17px;line-height:1.6;color:#47536b;margin-top:22px">600 essential IELTS words in 20 topics — British pronunciation, Arabic meaning, translated examples, synonyms and collocations — with practice and answers, Speaking Parts 1–3 models, model essays and two A–Z indexes.</p>
</div>
<div class="tiles" style="top:760px">{tiles}</div>
<div class="stripes2">{stripes}</div>''', 30, 'cover'))

assert len(out) == len(plan), (len(out), len(plan))
os.makedirs(os.path.join(ROOT, 'build'), exist_ok=True)
css = open(os.path.join(ROOT, 'src', 'style.css'), encoding='utf-8').read()
fonts = open(os.path.join(ROOT, 'fonts', 'fonts.css'), encoding='utf-8').read()
open(os.path.join(ROOT, 'build', 'book.html'), 'w', encoding='utf-8').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{TITLE_EN}</title><style>{fonts}\n{css}</style></head><body>{"".join(out)}</body></html>')
print('pages:', len(out))
