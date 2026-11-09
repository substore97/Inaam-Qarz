import sys, glob, os
from PIL import Image

src, root = sys.argv[1], sys.argv[2]
files = sorted(glob.glob(os.path.join(src, 'page-*.png')))

def pack(name, dpi, quality):
    px = int(8.5 * dpi)
    ims = [Image.open(f).convert('RGB').resize((px, px), Image.LANCZOS) for f in files]
    out = os.path.join(root, name)
    ims[0].save(out, save_all=True, append_images=ims[1:], resolution=dpi, quality=quality)
    print(name, len(ims), 'pages', round(os.path.getsize(out) / 1e6, 1), 'MB')

pack('Huroofi-Al-Jameela-PRINT.pdf', 300, 92)
pack('Huroofi-Al-Jameela-MOBILE.pdf', 150, 85)
