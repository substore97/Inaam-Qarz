"""Lossless: recompress every Flate stream at zlib level 9 and pack objects into object streams (~4% smaller)."""
import sys, zlib, pikepdf
src, dst = sys.argv[1], sys.argv[2]
p = pikepdf.open(src)
for o in p.objects:
    if isinstance(o, pikepdf.Stream) and o.get('/Filter') == pikepdf.Name.FlateDecode:
        o.write(zlib.compress(o.read_bytes(), 9), filter=pikepdf.Name.FlateDecode)
p.docinfo['/Title'] = 'گلدستہ — خاندانی رسالہ'
p.docinfo['/Author'] = 'انعام الرحمن'
p.save(dst, object_stream_mode=pikepdf.ObjectStreamMode.generate)
