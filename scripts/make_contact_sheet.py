#!/usr/bin/env python3
import argparse
import math
from pathlib import Path
from PIL import Image, ImageDraw

parser = argparse.ArgumentParser()
parser.add_argument('--input-dir', required=True)
parser.add_argument('--glob', default='*.png')
parser.add_argument('--output', required=True)
parser.add_argument('--columns', type=int, default=2)
args = parser.parse_args()
files = sorted(Path(args.input_dir).glob(args.glob))
if not files:
    raise SystemExit('No images found')
cell_w, cell_h = 500, 300
rows = math.ceil(len(files) / args.columns)
sheet = Image.new('RGB', (cell_w * args.columns, cell_h * rows), (220, 220, 220))
for index, path in enumerate(files):
    image = Image.open(path).convert('RGB')
    image.thumbnail((480, 270))
    cell = Image.new('RGB', (cell_w, cell_h), 'white')
    cell.paste(image, ((cell_w - image.width) // 2, 10))
    ImageDraw.Draw(cell).text((12, 280), f'{index + 1}: {path.name}', fill='black')
    sheet.paste(cell, ((index % args.columns) * cell_w, (index // args.columns) * cell_h))
output = Path(args.output)
output.parent.mkdir(parents=True, exist_ok=True)
sheet.save(output)
print({'output': str(output.resolve()), 'images': len(files)})
