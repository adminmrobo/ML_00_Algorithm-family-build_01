"""assets_src/ 의 원본(PNG/WebP)을 빌드용 assets/*.webp 로 줄이고 압축한다.
규칙: sc_* 너비 760 q62 / doc_* 128x128 q80 / 나머지 높이 180 q80"""
import glob, os, sys
from PIL import Image
SRC, DST = 'assets_src', 'assets'
def conv(f):
    k = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f)
    if k.startswith('sc_'):
        im = im.convert('RGB'); w, h = im.size; im = im.resize((760, round(h * 760 / w)), Image.LANCZOS); q = 62
    else:
        im = im.convert('RGBA'); w, h = im.size
        size = (128, 128) if k.startswith('doc_') else (round(w * 180 / h), 180)
        im = im.resize(size, Image.LANCZOS); q = 80
    out = f'{DST}/{k}.webp'; im.save(out, 'WEBP', quality=q, method=6)
    print(f'{k:14s} {im.size} {os.path.getsize(out)//1024} KB')
for f in sorted(glob.glob(f'{SRC}/*.png') + glob.glob(f'{SRC}/*.webp')): conv(f)
