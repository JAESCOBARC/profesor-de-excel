#!/usr/bin/env python3
"""Monta la tarjeta de voz con esfera en una página del sitio.

python3 add_card.py --page curso-excel-nivel-intermedio.html --audio /audio/mi-audio.mp3 \
    --title 'Te lo cuento yo mismo <em>en 50 segundos</em>' --before '<p class="hero-live-note">' \
    [--aria 'Escuchar a Jhony, 50 segundos'] [--visible all|mobile] [--page-id intermedio] [--root .]

- Inserta el HTML de la tarjeta justo ANTES de la primera aparición de --before (una cadena exacta
  y única del HTML de la página) y el audio + script antes de </body>.
- Añade el CSS entre marcadores /* voz-card:start */ ... /* voz-card:end */ al CSS de tema de la página
  (theme/pages/<ruta>.css); si ya está, lo actualiza. --visible mobile oculta la tarjeta desde 769 px.
- No toca nada más. Después hay que ejecutar apply_theme, bump_assets y check_links.
- Idempotente: si la tarjeta ya existe en la página, la sustituye.
"""
import argparse, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
AS = os.path.join(HERE, "..", "assets")
rd = lambda n: open(os.path.join(AS, n), encoding="utf-8").read()

def css_path(root, page):
    # misma regla que scripts/apply_theme.py: ruta sin .html y con / -> -  (cursos/index.html -> cursos-index)
    return os.path.join(root, "theme/pages", page[:-5].replace("/", "-") + ".css")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--page", required=True); ap.add_argument("--audio", required=True)
    ap.add_argument("--title", required=True); ap.add_argument("--before", required=True)
    ap.add_argument("--aria", default="Escuchar el audio"); ap.add_argument("--visible", choices=["all", "mobile"], default="all")
    ap.add_argument("--page-id", default=None); ap.add_argument("--root", default=".")
    a = ap.parse_args()
    p = os.path.join(a.root, a.page)
    h = open(p, encoding="utf-8").read()
    pid = a.page_id or re.sub(r"\.html$", "", a.page).replace("/index", "") or "home"
    # limpiar versión anterior
    h = re.sub(r'<div class="vozc"[^>]*>.*?</div>\n</div>\n', "", h, flags=re.S)
    h = re.sub(r'<audio id="vozAudio".*?</script>\n', "", h, flags=re.S)
    if h.count(a.before) != 1:
        sys.exit(f"--before debe aparecer exactamente 1 vez en {a.page} (aparece {h.count(a.before)})")
    card = rd("voz-card.html").replace("{{TITLE}}", a.title).replace("{{ARIA}}", a.aria)
    h = h.replace(a.before, card + a.before)
    js = rd("voz-card-script.html").replace("{{AUDIO}}", a.audio).replace("{{PAGE}}", pid)
    if "</body>" not in h: sys.exit("la página no tiene </body>")
    h = h.replace("</body>", js + "</body>", 1)
    open(p, "w", encoding="utf-8").write(h)
    cp = css_path(a.root, a.page)
    css = open(cp, encoding="utf-8").read() if os.path.exists(cp) else ""
    css = re.sub(r"\n?/\* voz-card:start \*/.*?/\* voz-card:end \*/\n?", "\n", css, flags=re.S)
    block = "/* voz-card:start */\n" + rd("voz-card.css")
    if a.visible == "mobile":
        block += "@media (min-width:769px){.vozc{display:none}}\n"
    block += "/* voz-card:end */\n"
    open(cp, "w", encoding="utf-8").write(css.rstrip("\n") + "\n" + block)
    print(f"OK tarjeta en {a.page} · CSS en {os.path.relpath(cp, a.root)} · audio {a.audio} · visible {a.visible}")

if __name__ == "__main__":
    main()
