"""Packs rendered page PNGs into the deliverables:
  Huroofi-Al-Jameela-APP.pdf    A4, 1358x1920 px per page (Full HD), optimized JPEG, smallest file for the app
  Huroofi-Al-Jameela-PRINT.pdf  A4, 2480x3508 px per page (300 DPI), full quality for printing
  Huroofi-Al-Jameela-Cover.jpg  front cover, full resolution
JPEG bytes are embedded directly into the PDF (no re-encoding), so the size stays minimal.
"""
import sys, glob, os, io
from PIL import Image

src, root = sys.argv[1], sys.argv[2]
PREFIX = sys.argv[3] if len(sys.argv) > 3 else 'Huroofi-Al-Jameela'
TITLE_ARG = sys.argv[4] if len(sys.argv) > 4 else 'حروفي الجميلة'
files = sorted(glob.glob(os.path.join(src, 'page-*.png')))
PAGE_W, PAGE_H = 595.28, 841.89  # A4 in points


def jpeg(path, size, q):
    im = Image.open(path).convert('RGB')
    if im.size != size:
        im = im.resize(size, Image.LANCZOS)
    b = io.BytesIO()
    im.save(b, 'JPEG', quality=q, optimize=True, progressive=True, subsampling=2)
    return b.getvalue()


def write_pdf(out, jpgs, size, title):
    w, h = size
    objs = []  # list of bytes, object i+1
    n = len(jpgs)
    # 1 catalog, 2 pages, 3 info, then per page: page, content, image
    kids = ' '.join(f'{4 + i * 3} 0 R' for i in range(n))
    objs.append(b'<< /Type /Catalog /Pages 2 0 R >>')
    objs.append(f'<< /Type /Pages /Count {n} /Kids [{kids}] >>'.encode())
    t = title.encode('utf-16-be').hex().upper()
    objs.append(f'<< /Title <FEFF{t}> /Author <FEFF{"انعام الرحمن".encode("utf-16-be").hex().upper()}> >>'.encode())
    for i, data in enumerate(jpgs):
        pg, ct, im = 4 + i * 3, 5 + i * 3, 6 + i * 3
        objs.append(f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_W} {PAGE_H}] '
                    f'/Resources << /XObject << /Im0 {im} 0 R >> >> /Contents {ct} 0 R >>'.encode())
        cs = f'q {PAGE_W} 0 0 {PAGE_H} 0 0 cm /Im0 Do Q'.encode()
        objs.append(b'<< /Length %d >>\nstream\n' % len(cs) + cs + b'\nendstream')
        objs.append(f'<< /Type /XObject /Subtype /Image /Width {w} /Height {h} /ColorSpace /DeviceRGB '
                    f'/BitsPerComponent 8 /Filter /DCTDecode /Length {len(data)} >>\nstream\n'.encode() + data + b'\nendstream')
    out_b = bytearray(b'%PDF-1.4\n%\xe2\xe3\xcf\xd3\n')
    offs = []
    for i, o in enumerate(objs):
        offs.append(len(out_b))
        out_b += f'{i + 1} 0 obj\n'.encode() + o + b'\nendobj\n'
    x = len(out_b)
    out_b += f'xref\n0 {len(objs) + 1}\n0000000000 65535 f \n'.encode()
    out_b += b''.join(f'{o:010d} 00000 n \n'.encode() for o in offs)
    out_b += f'trailer\n<< /Size {len(objs) + 1} /Root 1 0 R /Info 3 0 R >>\nstartxref\n{x}\n%%EOF\n'.encode()
    open(out, 'wb').write(out_b)
    print(os.path.basename(out), n, 'pages', round(len(out_b) / 1e6, 2), 'MB')


TITLE = TITLE_ARG
APP = (1358, 1920)     # A4 at Full HD height
PRINT = (2480, 3508)   # A4 at 300 DPI
# APP PDF: mozjpeg (if installed) gives ~40% smaller files at the same visual quality.
# Quality is lowered step by step until the whole book is <= APP_MB (default 4 MB), never below q60.
import subprocess, shutil
CJPEG = os.environ.get('MOZJPEG', '/tmp/mzj/node_modules/mozjpeg/vendor/cjpeg')
APP_MB = float(os.environ.get('APP_MB', '4.0'))
def moz(path, size, q):
    im = Image.open(path).convert('RGB')
    if im.size != size:
        im = im.resize(size, Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'PPM')
    return subprocess.run([CJPEG, '-quality', str(q), '-sample', '2x2', '-optimize', '-progressive'],
                          input=b.getvalue(), capture_output=True, check=True).stdout
if os.path.exists(CJPEG):
    for q in (72, 68, 65, 62, 60):
        jp = [moz(f, APP, q) for f in files]
        if sum(map(len, jp)) <= APP_MB * 1e6 or q == 60:
            break
    print('APP quality: mozjpeg q%d' % q)
else:
    jp = [jpeg(f, APP, 82) for f in files]
write_pdf(os.path.join(root, PREFIX + '-APP.pdf'), jp, APP, TITLE)
if os.environ.get('PRINT'):
  write_pdf(os.path.join(root, PREFIX + '-PRINT.pdf'), [jpeg(f, PRINT, 92) for f in files], PRINT, TITLE)
  cover = os.path.join(root, PREFIX + '-Cover.jpg')
  open(cover, 'wb').write(jpeg(files[0], PRINT, 92))
  print(PREFIX + '-Cover.jpg', round(os.path.getsize(cover) / 1e6, 2), 'MB')
