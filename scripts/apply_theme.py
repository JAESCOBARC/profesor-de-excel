#!/usr/bin/env python3
"""Inyecta el tema visual compartido en todas las páginas HTML.

Fuente única: theme/base.css (común) + theme/pages/<ruta>.css (opcional, por página).
La ruta se deduce del archivo: index.html -> index.css, cursos/index.html -> cursos-index.css,
plan-negocio/index.html -> plan-negocio-index.css, profesor-excel-online.html -> profesor-excel-online.css.

Cada HTML recibe, entre marcadores (idempotente):
  - un <link rel="preload"> de la fuente, justo tras <meta charset>
  - un <style id="theme"> con base.css + el CSS de la página, justo antes de </head>

Uso:
  python3 scripts/apply_theme.py          # reescribe las páginas
  python3 scripts/apply_theme.py --check  # falla si alguna página no está al día
Excluidas: docs/, certificado/, plantillas/, páginas de redirección y las que lleven <!-- theme:skip -->.
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PRELOAD = '<link rel="preload" href="/fonts/plus-jakarta-sans.woff2" as="font" type="font/woff2" crossorigin>'
M_PRE = ('<!--theme-preload-->', '<!--/theme-preload-->')
M_CSS = ('<!--theme-css-->', '<!--/theme-css-->')
EXCLUDE_DIRS = ('docs/', 'certificado/', 'plantillas/', 'theme/', 'scripts/', '.github/')


def minify(css: str) -> str:
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s*\n\s*', '', css)
    css = re.sub(r'\s{2,}', ' ', css)
    return css.strip()


def page_key(rel: str) -> str:
    return rel[:-5].replace('/', '-') if rel.endswith('.html') else rel


def build_css(rel: str) -> str:
    parts = [(ROOT / 'theme' / 'base.css').read_text()]
    extra = ROOT / 'theme' / 'pages' / (page_key(rel) + '.css')
    if extra.exists():
        txt = extra.read_text()
        for inc in re.findall(r'/\*\s*@include\s+([\w-]+)\s*\*/', txt):
            parts.append((ROOT / 'theme' / 'pages' / (inc + '.css')).read_text())
        parts.append(txt)
    return minify('\n'.join(parts))


def strip_blocks(s: str) -> str:
    for a, b in (M_PRE, M_CSS):
        s = re.sub(re.escape(a) + r'.*?' + re.escape(b) + r'\n?', '', s, flags=re.S)
    s = re.sub(r'<style id="theme-c">.*?</style>\n?', '', s, flags=re.S)
    return s


def transform(rel: str, s: str) -> str:
    s = strip_blocks(s)
    head_extra = ROOT / 'theme' / 'pages' / (page_key(rel) + '.head.html')
    extra_html = head_extra.read_text().strip() if head_extra.exists() else ''
    pre = f'{M_PRE[0]}{PRELOAD}{extra_html}{M_PRE[1]}\n'
    css = f'{M_CSS[0]}<style id="theme">{build_css(rel)}</style>{M_CSS[1]}\n'
    m = re.search(r'<meta charset[^>]*>\s*\n?', s, re.I)
    if m:
        s = s[:m.end()] + pre + s[m.end():]
    else:
        s = re.sub(r'<head[^>]*>', lambda x: x.group(0) + '\n' + pre, s, count=1)
    i = s.index('</head>')
    return s[:i] + css + s[i:]


def targets():
    for p in sorted(ROOT.rglob('*.html')):
        rel = p.relative_to(ROOT).as_posix()
        if rel.startswith(EXCLUDE_DIRS) or '/.git/' in rel:
            continue
        s = p.read_text()
        if '</head>' not in s or 'theme:skip' in s:
            continue
        if len(s) < 4000 and ('location.replace' in s or 'http-equiv="refresh"' in s):
            continue
        yield rel, p, s


def main():
    check = '--check' in sys.argv
    stale = []
    for rel, p, s in targets():
        new = transform(rel, s)
        if new != s:
            stale.append(rel)
            if not check:
                p.write_text(new)
    if check:
        if stale:
            print('Tema desactualizado en:', *stale, sep='\n  ')
            print('Ejecuta: python3 scripts/apply_theme.py')
            sys.exit(1)
        print('Tema al día.')
    else:
        print(f'Actualizados: {len(stale)} archivo(s)')


if __name__ == '__main__':
    main()
