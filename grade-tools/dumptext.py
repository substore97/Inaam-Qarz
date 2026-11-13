import sys, json, re
cfg = json.load(open(sys.argv[1])); out = []
def walk(x, path=''):
    if isinstance(x, dict):
        for k, v in x.items():
            if k in ('extraCss', 'cover', 'dir', 'prefix', 'artmod', 'header', 'theme', 'h', 's1', 's2', 'type', 'icon', 'arts', 'coverTop', 'coverBot', 'ownerArt', 'ownerMini', 'noteMini', 'certArts', 'backArts', 'top'): continue
            walk(v, path + '.' + k)
    elif isinstance(x, list):
        for i, v in enumerate(x): walk(v, f'{path}[{i}]')
    elif isinstance(x, str):
        t = re.sub(r'<br>', ' / ', x); t = re.sub(r'<span data-a="[^"]*"></span>', '', t); t = re.sub(r'<[^>]+>', ' ', t); t = re.sub(r'\s+', ' ', t).strip()
        if t and not re.fullmatch(r'[a-z_]+(:[^ ]*)?', t): out.append(f'{path}: {t}')
walk(cfg)
open(sys.argv[2], 'w').write('\n'.join(out)); print(len(out), 'lines')
