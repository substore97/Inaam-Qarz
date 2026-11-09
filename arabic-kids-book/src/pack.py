"""Packs rendered page PNGs into the deliverables:
  Huroofi-Al-Jameela-APP.pdf    1920x1920 px per page (Full HD), optimized JPEG, smallest file for the app
  Huroofi-Al-Jameela-PRINT.pdf  2550x2550 px per page (8.5in @ 300 DPI), full quality for printing
  Huroofi-Al-Jameela-Cover.jpg  front cover, full resolution
JPEG bytes are embedded directly into the PDF (no re-encoding), so the size stays minimal.
"""
import sys, glob, os, io
from PIL import Image

src, root = sys.argv[1], sys.argv[2]
files = sorted(glob.glob(os.path.join(src, 'page-*.png')))
PAGE_PT = 612  # 8.5in


def jpeg(path, px, q):
    im = Image.open(path).convert('RGB')
    if im.width != px:
        im = im.resize((px, px), Image.LANCZOS)
    b = io.BytesIO()
    im.save(b, 'JPEG', quality=q, optimize=True, progressive=True, subsampling=2)
    return b.getvalue()


def write_pdf(out, jpgs, px, title):
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
        objs.append(f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_PT} {PAGE_PT}] '
                    f'/Resources << /XObject << /Im0 {im} 0 R >> >> /Contents {ct} 0 R >>'.encode())
        cs = f'q {PAGE_PT} 0 0 {PAGE_PT} 0 0 cm /Im0 Do Q'.encode()
        objs.append(b'<< /Length %d >>\nstream\n' % len(cs) + cs + b'\nendstream')
        objs.append(f'<< /Type /XObject /Subtype /Image /Width {px} /Height {px} /ColorSpace /DeviceRGB '
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


TITLE = 'حروفي الجميلة'
write_pdf(os.path.join(root, 'Huroofi-Al-Jameela-APP.pdf'), [jpeg(f, 1920, 82) for f in files], 1920, TITLE)
write_pdf(os.path.join(root, 'Huroofi-Al-Jameela-PRINT.pdf'), [jpeg(f, 2550, 92) for f in files], 2550, TITLE)
cover = os.path.join(root, 'Huroofi-Al-Jameela-Cover.jpg')
open(cover, 'wb').write(jpeg(files[0], 2550, 92))
print('Huroofi-Al-Jameela-Cover.jpg', round(os.path.getsize(cover) / 1e6, 2), 'MB')
