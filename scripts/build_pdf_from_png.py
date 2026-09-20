#!/usr/bin/env python3
import argparse
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image
from pypdf import PdfReader

parser = argparse.ArgumentParser()
parser.add_argument('--input-dir', required=True)
parser.add_argument('--glob', default='*.png')
parser.add_argument('--output', required=True)
parser.add_argument('--title', default='Teaching material')
args = parser.parse_args()
images = sorted(Path(args.input_dir).glob(args.glob))
if not images:
    raise SystemExit('No PNG files found')
for path in images:
    with Image.open(path) as image:
        if image.size != (1600, 900):
            raise SystemExit(f'Unexpected image size: {path} = {image.size}')
output = Path(args.output)
output.parent.mkdir(parents=True, exist_ok=True)
pdf = canvas.Canvas(str(output), pagesize=(960, 540), pageCompression=1)
pdf.setTitle(args.title)
for path in images:
    pdf.drawImage(ImageReader(str(path)), 0, 0, width=960, height=540, preserveAspectRatio=False, mask='auto')
    pdf.showPage()
pdf.save()
reader = PdfReader(output)
if len(reader.pages) != len(images):
    raise SystemExit(f'Page mismatch: PDF={len(reader.pages)}, PNG={len(images)}')
for index, page in enumerate(reader.pages, start=1):
    if round(float(page.mediabox.width)) != 960 or round(float(page.mediabox.height)) != 540:
        raise SystemExit(f'Unexpected page size at page {index}')
print({'output': str(output.resolve()), 'pages': len(reader.pages), 'page_size': (960, 540)})
