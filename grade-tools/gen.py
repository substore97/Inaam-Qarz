# Usage: python3 gen.py <config.json>   (config: dir, prefix, title, artmod, header, cover, items (list), extraCss, + C keys)
import sys, json, subprocess, os
S = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(sys.argv[1])); d = '/home/user/Inaam-Qarz/' + cfg['dir']
os.makedirs(d + '/src', exist_ok=True)
allitems = cfg['items'] if 'items' in cfg else [i for u in cfg['units'] for i in u.get('items', [])]
items = '// [name, english, art, sentence, chip1, chip2, traceword?]\nconst ITEMS = ' + json.dumps(allitems, ensure_ascii=False) + ';\n'
C = {k: v for k, v in cfg.items() if k not in ('items',)}
open(S + '/g_items.js', 'w').write(items)
open(S + '/g_pages.js', 'w').write('const C = ' + json.dumps(C, ensure_ascii=False) + ';\n' + open(S + '/gen_pages.js').read())
open(S + '/g_css.css', 'w').write(open(S + '/gen_css.css').read() + (open(S + '/theme' + cfg['theme'] + '.css').read() if cfg.get('theme') else '') + cfg.get('extraCss', ''))
spec = dict(art=cfg['artmod'], header=cfg['header'], items=S + '/g_items.js', pages=S + '/g_pages.js', cover=cfg['cover'], title=cfg['title'], css=S + '/g_css.css')
json.dump(spec, open(S + '/g_spec.json', 'w'), ensure_ascii=False)
subprocess.run(['python3', S + '/mkbook.py', d, S + '/g_spec.json'], check=True)
if cfg.get('ltr'):
    bj = open(d + '/src/build.js').read().replace("const AR = n => String(n).replace(/\\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);", "const AR = n => String(n);")
    open(d + '/src/build.js', 'w').write(bj)
subprocess.run(['node', 'src/build.js'], cwd=d, check=True)
subprocess.run(['node', '../arabic-kids-book/src/pdf.js', cfg['prefix'], cfg['title']], cwd=d, check=True, env={**os.environ, 'BOOK_DIR': d})
subprocess.run(['bash', S + '/sheet.sh', d + '/' + cfg['prefix'] + '-APP.pdf', S + '/prev/' + cfg['dir'], '6'], check=True, stdout=subprocess.DEVNULL)
