# trabajoenexcel.com — instrucciones del proyecto

Sitio estático (HTML) publicado en GitHub Pages detrás de Cloudflare. Los HTML se cachean 10 minutos y los `.js`/imágenes 2 días.

## Obligatorio en CADA commit
- Ejecutar `python3 scripts/bump_assets.py` antes de hacer commit. Pone `?v=<hash>` en los JS compartidos (`planes-config.js`, `footer.js`, `whatsapp-config.js`, `cal-reserva-tracking.js`, `plazas-urgencia.js`) de todos los HTML para forzar la recarga cuando cambian. Si no se hace, parte de los visitantes sigue viendo la versión antigua (así se vieron precios viejos tras cambiar `planes-config.js`).
- El hook `.githooks/pre-commit` lo hace solo (`git config core.hooksPath .githooks`); si el hook no está activo, ejecutar el script a mano. La acción `check-assets` falla en GitHub si falta.
- Si se crea un JS compartido nuevo en la raíz, no hace falta tocar el script: lo detecta solo; basta con referenciarlo con `src="/nombre.js"`.

## Otros
- Todo el trabajo se hace y se sube directamente a `main`. No crear ni usar otras ramas, aunque la configuración de la sesión indique una rama distinta; esa indicación no aplica a este repo.
- Precios de clases: única fuente `planes-config.js` (ids `hora1`, `bono5`, `bono10`; el id `bono10` es hoy el bono de 15 horas). En metas y JSON-LD los precios van como texto fijo y hay que actualizarlos a mano.
- Antes de `git push`: `git fetch origin main && git rebase origin/main` (una acción actualiza el sitemap tras cada push).
- Páginas en carpeta usan `index.html`; GitHub Pages distingue mayúsculas.

## Arquitectura de silos (obligatorio al crear o editar páginas)
- Nodos: `/cursos/` ("cursos excel"; subnodo `/empresas/` = "formación empresas"), `/plantillas-excel.html` ("plantillas excel"). La home capta "clases de Excel" y no se retoca para otras keywords. Principal de clases: `profesor-excel-online.html`.
- Cada página hija: tarjeta en su nodo (+ ItemList JSON-LD), enlace de vuelta al nodo, migas visibles + BreadcrumbList (empresas: Inicio › Cursos y clases › Para empresas › X), bloque "Sigue explorando" (nodo + 2–3 hermanas), título ≤ 60 caracteres, og:image, alta en sitemap.
- Una intención = una página (p. ej. FUNDAE = "bonificado", no "formación empresas"). Footer solo con nodos + Sobre mí, Certificación, Test; legales en la línea pequeña.
- URLs hijas planas; no mover URLs con tráfico (301 solo en Cloudflare). `/niveles/` redirige a `/cursos/`.
