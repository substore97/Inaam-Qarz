# usage: sheet.sh <pdf> <outdir> <cols>
mkdir -p "$2" && rm -f "${2:?}"/p-*.png && pdftoppm -r 30 -png "$1" "$2/p" && python3 -c "
from PIL import Image;import glob
fs=sorted(glob.glob('$2/p-*.png'));ims=[Image.open(f) for f in fs];w,h=ims[0].size
cols=$3;rows=(len(ims)+cols-1)//cols;S=Image.new('RGB',(w*cols,h*rows),'white')
[S.paste(im,((i%cols)*w,(i//cols)*h)) for i,im in enumerate(ims)];S.save('$2/sheet.png')"
