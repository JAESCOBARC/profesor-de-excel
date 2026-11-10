# trabajoenexcel.com — instrucciones del proyecto

Sitio estático (HTML) publicado en GitHub Pages detrás de Cloudflare. Los HTML se cachean 10 minutos y los `.js`/imágenes 2 días.

## Obligatorio en CADA commit
- Ejecutar `python3 scripts/bump_assets.py` antes de hacer commit. Pone `?v=<hash>` en los JS compartidos (`planes-config.js`, `footer.js`, `whatsapp-config.js`, `cal-reserva-tracking.js`, `plazas-urgencia.js`) de todos los HTML para forzar la recarga cuando cambian. Si no se hace, parte de los visitantes sigue viendo la versión antigua (así se vieron precios viejos tras cambiar `planes-config.js`).
- El hook `.githooks/pre-commit` lo hace solo (`git config core.hooksPath .githooks`); si el hook no está activo, ejecutar el script a mano. La acción `check-assets` falla en GitHub si falta.
- Si se crea un JS compartido nuevo en la raíz, no hace falta tocar el script: lo detecta solo; basta con referenciarlo con `src="/nombre.js"`.

## Tema visual (obligatorio al crear o editar páginas)
- El diseño (colores, tipografía Plus Jakarta Sans, maquetación común) sale de `theme/base.css` + `theme/pages/<ruta>.css` (index.html -> index.css, cursos/index.html -> cursos-index.css). `python3 scripts/apply_theme.py` lo inyecta en cada HTML entre los marcadores `<!--theme-preload-->` y `<!--theme-css-->`; no editar esos bloques a mano. El hook de pre-commit lo ejecuta solo y la acción `check-assets` falla si falta.
- Las páginas nuevas deben llevar `</head>` y usar las variables de `base.css` (`--green-deep`, `--green-mid`, `--cream`, `--f`...). No cargar otras fuentes: solo `/fonts/plus-jakarta-sans.woff2`.

## Otros
- Todo el trabajo se hace y se sube directamente a `main`. No crear ni usar otras ramas, aunque la configuración de la sesión indique una rama distinta; esa indicación no aplica a este repo.
- Precios de clases: única fuente `planes-config.js` (ids `hora1`, `bono5`, `bono10`; el id `bono10` es hoy el bono de 15 horas). En metas y JSON-LD los precios van como texto fijo y hay que actualizarlos a mano.
- Antes de `git push`: `git fetch origin main && git rebase origin/main` (una acción actualiza el sitemap tras cada push).
- Páginas en carpeta usan `index.html`; GitHub Pages distingue mayúsculas.

## Arquitectura de silos (obligatorio al crear o editar páginas)
- Nodos: `/cursos/` ("cursos excel"; subnodo `/empresas/` = "curso excel empresas"), `/plantillas-excel.html` ("plantillas excel"). La home capta "clases de Excel" y no se retoca para otras keywords. Principal de clases: `profesor-excel-online.html`.
- Cada página hija: tarjeta en su nodo (+ ItemList JSON-LD), enlace de vuelta al nodo, migas visibles + BreadcrumbList (empresas: Inicio › Cursos y clases › Para empresas › X), bloque "Sigue explorando" (nodo + 2–3 hermanas), título ≤ 60 caracteres, og:image, alta en sitemap.
- Una intención = una página (p. ej. FUNDAE = "subvencionado" con "bonificado" como secundaria, no "curso excel empresas"). Footer solo con nodos + Sobre mí, Certificación, Test; legales en la línea pequeña.
- Toda URL nueva necesita una keyword principal que da el usuario (y secundarias si las da); Claude nunca la define ni la elige: si falta, la pregunta antes de crear la página y usa exactamente la que le den. La keyword principal va en título, meta descripción, H1 y al menos un H2, y se registra en la columna de keyword del artefacto de enlaces (`/enlaces`).
- URLs hijas planas; no mover URLs con tráfico (301 solo en Cloudflare). `/niveles/` redirige a `/cursos/`.
