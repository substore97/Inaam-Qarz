import sys
from PIL import Image
d,pages,out=sys.argv[1],[int(x) for x in sys.argv[2].split(',')],sys.argv[3]
ims=[Image.open(f'/home/user/Inaam-Qarz/{d}/build/pages/page-{n:02d}.png') for n in pages]
w,h=ims[0].size;c=4;r=(len(ims)+c-1)//c;S=Image.new('RGB',(w*c,h*r),'white')
[S.paste(im,((i%c)*w,(i//c)*h)) for i,im in enumerate(ims)];S.thumbnail((2000,1500*r//2+800));S.save(out)
