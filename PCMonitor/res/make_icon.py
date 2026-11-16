"""Build the app icon. Usage: python3 res/make_icon.py [photo.jpg]
With a photo: centre-crops it to a square. Without: draws the default pulse icon.
Writes ui/icon.png (window icon, in-app logo) and res/icon.ico (EXE icon)."""
import sys
from PIL import Image, ImageDraw, ImageOps

S = 512
if len(sys.argv) > 1:
    img = ImageOps.exif_transpose(Image.open(sys.argv[1])).convert("RGB")
    img = ImageOps.fit(img, (S, S), Image.LANCZOS, centering=(0.5, 0.4)).convert("RGBA")
else:
    img = Image.new("RGBA", (S, S), "#18203A")
    d = ImageDraw.Draw(img)
    pts = [(80, 276), (170, 276), (215, 150), (285, 380), (335, 232), (365, 276), (410, 276)]
    d.line(pts, fill="#4F8CFF", width=30, joint="curve")
    for x, y in (pts[0], pts[-1]):
        d.ellipse((x - 15, y - 15, x + 15, y + 15), fill="#4F8CFF")
    d.ellipse((398, 248, 454, 304), fill="#34D399")

# round the corners so it looks like an app icon
mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), radius=S // 5, fill=255)
img.putalpha(mask)

img.resize((256, 256), Image.LANCZOS).save("ui/icon.png")
img.save("res/icon.ico", sizes=[(s, s) for s in (16, 24, 32, 48, 64, 128, 256)], bitmap_format="bmp")
print("icon written")
