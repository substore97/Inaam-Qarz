import sys, json, re, unicodedata
bad = {'ک':'Urdu/Persian kaf ک','گ':'gaf گ','ی':'Farsi yeh ی','ھ':'heh doachashmee ھ','ہ':'heh goal ہ','ے':'yeh barree ے','ٹ':'tteh ٹ','ڈ':'ddal ڈ','ڑ':'rreh ڑ','ں':'noon ghunna ں','چ':'tcheh چ','پ':'peh پ','ژ':'jeh ژ','ﷺ':'ﷺ ligature','۰':'Persian digit','۴':'Persian digit 4','۵':'Persian digit 5','۶':'Persian digit 6'}
cfg = json.load(open(sys.argv[1])); errs = []
def walk(x, path=''):
    if isinstance(x, dict):
        for k, v in x.items():
            if k not in ('extraCss', 'cover'): walk(v, path + '.' + k)
    elif isinstance(x, list):
        for i, v in enumerate(x): walk(v, f'{path}[{i}]')
    elif isinstance(x, str):
        t = re.sub(r'<[^>]+>', ' ', x)
        for ch, name in bad.items():
            if ch in t: errs.append(f'{path}: {name} in «{t[:60]}»')
        if re.search(r'[ً-ْ]{3,}', t): errs.append(f'{path}: 3+ stacked harakat «{t[:60]}»')
        for a, b in (('«', '»'), ('﴿', '﴾'), ('(', ')')):
            if t.count(a) != t.count(b): errs.append(f'{path}: unbalanced {a}{b} «{t[:60]}»')
        if re.search(r'(^|[\s«﴿(])(?:(?:[وفبكل][\u064e\u0650]?)?ال[\u0621-\u064a]\u0652|[\u0621-\u064a]\u0652)', t): errs.append(f'{path}: word starts with sukun «{t[:60]}»')
        if re.search(r'([ً-ْ])\1', t): errs.append(f'{path}: doubled haraka «{t[:60]}»')
walk(cfg)
print('\n'.join(errs) if errs else 'LINT OK')
