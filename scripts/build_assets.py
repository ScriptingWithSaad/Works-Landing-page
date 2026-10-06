"""Fingerprint CSS and JavaScript so GitHub Pages visitors receive the matching release."""
import hashlib
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
html_path = root / 'index.html'
html = html_path.read_text(encoding='utf-8')
for source, pattern, extension, folder in [
    ('stylesheet/style.css', r'stylesheet/(?:style\.css|style\.[a-f0-9]+\.css)', 'css', 'stylesheet'),
    ('javascript/script.js', r'javascript/(?:script\.js|app\.[a-f0-9]+\.js)', 'js', 'javascript'),
]:
    data = (root / source).read_bytes()
    name = ('style' if extension == 'css' else 'app') + '.' + hashlib.sha256(data).hexdigest()[:12] + '.' + extension
    (root / folder / name).write_bytes(data)
    html = re.sub(pattern, folder + '/' + name, html)
    print(folder + '/' + name)
html_path.write_text(html, encoding='utf-8', newline='\n')
