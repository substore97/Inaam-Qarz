# Usage: python3 mkbook.py <book_dir> <spec.json>
# spec: art (module filename w/o .js), header, items (file with JS const block), pages (file), cover (css), title, css (file, optional)
import sys, json
d, spec = sys.argv[1], json.load(open(sys.argv[2]))
b = open('/home/user/Inaam-Qarz/manners-book/src/build.js').read()
s = b.index('// [manner, english, art, sentence, ayah/hadith, source]'); e = b.index('const BY =')
b = b[:s] + open(spec['items']).read() + b[e:]
def R(a, c):
    global b
    assert a in b, a[:60]; b = b.replace(a, c, 1)
R("const { art } = require('./manners-art');", "const { art } = require('./%s');" % spec['art'])
R('// Builds "أخلاقي الجميلة" – good manners for Muslim kids, with sources – A4 portrait.', '// ' + spec['header'])
s = b.index('// 1 ---------- Cover'); e = b.index('const css = `')
b = b[:s] + open(spec['pages']).read() + b[e:]
R(".cover{--h:330;background:radial-gradient(circle at 50% 40%,#fffaf5,#ffdfe9 50%,#d9ccff 88%);text-align:center;padding:40px}", ".cover{" + spec['cover'] + ";text-align:center;padding:40px}")
R("<title>أخلاقي الجميلة</title>", "<title>%s</title>" % spec['title'])
if spec.get('css'): R("/* activities */", "/* activities */\n" + open(spec['css']).read())
open(d + '/src/build.js', 'w').write(b)
print('assembled', d)
