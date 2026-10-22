#!/usr/bin/env python3
"""Versiona los JS compartidos con un hash de su contenido (?v=<hash>) en todos los HTML.

Cloudflare guarda los .js durante 2 días; si el archivo cambia pero la URL no, parte de los
visitantes siguen viendo la versión antigua (por ejemplo, precios viejos). Con el hash en la URL,
cada cambio del archivo obliga a descargarlo de nuevo.

Uso:
  python3 scripts/bump_assets.py          # reescribe los ?v= que estén desactualizados
  python3 scripts/bump_assets.py --check  # no modifica nada; sale con error si falta actualizar
"""
import hashlib, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP = ('docs/', 'certificado/', '.claude/', '.git/', 'scripts/')
assets = sorted(p.name for p in ROOT.glob('*.js'))
version = {n: hashlib.sha256((ROOT / n).read_bytes()).hexdigest()[:8] for n in assets}
check = '--check' in sys.argv
pending = []
for html in sorted(ROOT.rglob('*.html')):
    rel = html.relative_to(ROOT).as_posix()
    if rel.startswith(SKIP):
        continue
    s = html.read_text(encoding='utf-8')
    out = s
    for name, v in version.items():
        out = re.sub(r'(src=")(/' + re.escape(name) + r')(\?v=[^"]*)?(")', lambda m: f'{m.group(1)}{m.group(2)}?v={v}{m.group(4)}', out)
    if out != s:
        pending.append(rel)
        if not check:
            html.write_text(out, encoding='utf-8')
if check and pending:
    print('Versiones de assets desactualizadas en:', *pending, sep='\n  ')
    print('Ejecuta: python3 scripts/bump_assets.py')
    sys.exit(1)
print(('Pendientes: ' if check else 'Actualizados: ') + str(len(pending)) + ' archivo(s)')
