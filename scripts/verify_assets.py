"""Check local resources, responsive image sizes and section targets without third-party packages."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote

root = Path(__file__).resolve().parents[1]
class Audit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.targets = []
        self.paths = []
        self.cards = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, a['id']
            self.ids.add(a['id'])
        for key in ('src', 'href', 'poster', 'data-src'):
            value = a.get(key, '')
            if value.startswith('#'):
                self.targets.append(value[1:])
            elif value and not re.match(r'https?:|mailto:|data:', value):
                self.paths.append(value)
        for key in ('srcset', 'data-srcset'):
            self.paths += [x.strip().split()[0] for x in a.get(key, '').split(',') if x.strip()]
        if tag == 'img':
            assert 'width' in a and 'height' in a, a
            assert 'alt' in a, a
            if a.get('loading') == 'lazy':
                self.cards += 1
                assert 'srcset' in a and 'sizes' in a and a.get('decoding') == 'async', a
        if tag == 'a' and a.get('target') == '_blank':
            assert 'noopener' in a.get('rel', ''), a

audit = Audit()
audit.feed((root / 'index.html').read_text(encoding='utf-8'))
assert audit.cards == 12, audit.cards
assert all(t in audit.ids for t in audit.targets), audit.targets
for path in audit.paths:
    assert (root / unquote(path.split('?')[0])).is_file(), path
for path in re.findall(r'url\([\'"]?([^\)\'"]+)', (root/'stylesheet/style.css').read_text()):
    assert (root/'stylesheet'/path).is_file(), path
manifest = json.loads((root/'assets/optimized/manifest.json').read_text())
assert len(manifest) == 17
for asset in manifest:
    assert asset['project'].startswith('https://works.studio/work/')
    assert len(asset['files']) >= 2
    for item in asset['files']:
        path = root/'assets/optimized'/item['file']
        assert path.stat().st_size == item['bytes'], path
        assert item['width'] > 0 and item['height'] > 0
        assert path.read_bytes()[:4] == b'RIFF'
print(f'PASS: {audit.cards} responsive cards, 17 restored image sources, all local resources and section anchors valid.')
