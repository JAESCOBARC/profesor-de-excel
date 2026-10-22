# trabajoenexcel.com — instrucciones del proyecto

Sitio estático (HTML) publicado en GitHub Pages detrás de Cloudflare. Los HTML se cachean 10 minutos y los `.js`/imágenes 2 días.

## Obligatorio en CADA commit
- Ejecutar `python3 scripts/bump_assets.py` antes de hacer commit. Pone `?v=<hash>` en los JS compartidos (`planes-config.js`, `footer.js`, `whatsapp-config.js`, `cal-reserva-tracking.js`, `plazas-urgencia.js`) de todos los HTML para forzar la recarga cuando cambian. Si no se hace, parte de los visitantes sigue viendo la versión antigua (así se vieron precios viejos tras cambiar `planes-config.js`).
- El hook `.githooks/pre-commit` lo hace solo (`git config core.hooksPath .githooks`); si el hook no está activo, ejecutar el script a mano. La acción `check-assets` falla en GitHub si falta.
- Si se crea un JS compartido nuevo en la raíz, no hace falta tocar el script: lo detecta solo; basta con referenciarlo con `src="/nombre.js"`.

## Otros
- Precios de clases: única fuente `planes-config.js` (ids `hora1`, `bono5`, `bono10`; el id `bono10` es hoy el bono de 15 horas). En metas y JSON-LD los precios van como texto fijo y hay que actualizarlos a mano.
- Antes de `git push`: `git fetch origin main && git rebase origin/main` (una acción actualiza el sitemap tras cada push).
- Páginas en carpeta usan `index.html`; GitHub Pages distingue mayúsculas.
