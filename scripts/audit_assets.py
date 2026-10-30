"""Read-only source asset audit. Uses Pillow and Mutagen from the audit environment."""
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image, ImageDraw
from mutagen import File

root = Path(__file__).resolve().parents[1]
output = root / 'docs'
output.mkdir(exist_ok=True)
images, audio, models, vectors = [], [], [], []
source = '\n'.join(p.read_text(encoding='utf-8') for p in (root / 'src').rglob('*') if p.suffix in {'.js', '.jsx', '.css'})
for directory in ['public', 'src/assets', 'Meme_Images', 'Meme_sounds']:
    for path in sorted((root / directory).rglob('*')):
        if not path.is_file():
            continue
        base = {'path': path.relative_to(root).as_posix(), 'bytes': path.stat().st_size,
                'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}
        extension = path.suffix.lower()
        if extension in {'.png', '.jpg', '.jpeg', '.webp', '.gif'}:
            with Image.open(path) as image:
                images.append({**base, 'width': image.width, 'height': image.height,
                               'aspectRatio': image.width / image.height, 'format': image.format,
                               'hasAlpha': 'A' in image.mode,
                               'referencedByName': path.name in source})
        elif extension == '.svg':
            tree = ET.fromstring(path.read_text(encoding='utf-8'))
            viewbox = tree.get('viewBox', '').split()
            dimensions = []
            for index, key in enumerate(['width', 'height']):
                value = re.match(r'^[\d.]+', tree.get(key, ''))
                dimensions.append(float(value[0]) if value else float(viewbox[index+2]) if len(viewbox) == 4 else None)
            vectors.append({**base, 'format': 'SVG', 'width': dimensions[0], 'height': dimensions[1],
                            'containsText': any(element.tag.endswith('text') for element in tree.iter())})
        elif extension in {'.mp3', '.wav', '.ogg', '.m4a'}:
            data = File(path)
            audio.append({**base, 'format': extension[1:], 'durationSeconds': round(data.info.length, 3),
                          'sampleRate': data.info.sample_rate, 'channels': data.info.channels,
                          'bitrate': getattr(data.info, 'bitrate', None)})
        elif extension in {'.glb', '.gltf', '.obj', '.fbx'}:
            models.append(base)

(output / 'asset-inventory.json').write_text(json.dumps({'images': images, 'vectors': vectors, 'audio': audio, 'models': models}, indent=2), encoding='utf-8')
unique = {item['sha256']: item for item in reversed(images)}
sheet = Image.new('RGB', (1000, ((len(unique)+3)//4)*225), '#101727')
draw = ImageDraw.Draw(sheet)
for index, item in enumerate(unique.values()):
    x, y = (index % 4)*250, (index//4)*225
    with Image.open(root / item['path']) as image:
        thumb = image.convert('RGB')
        thumb.thumbnail((230, 165))
        sheet.paste(thumb, (x+(250-thumb.width)//2, y+5))
    label = f"{index}: {Path(item['path']).name[:31]}\n{item['width']} x {item['height']}"
    draw.text((x+8, y+175), label, fill='#d4e8eb')
sheet.save(output / 'asset-contact-sheet.jpg')
print(json.dumps({'uniqueImages': len(unique), 'allImages': len(images), 'audioFiles': len(audio), 'models': models,
                  'images': [{k:v for k,v in item.items() if k not in {'sha256','referencedByName'}} for item in unique.values()],
                  'audio': audio}, indent=2))
