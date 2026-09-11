# Estado del sitio — trabajoenexcel.com

> Última actualización: 2026-09-11
> Repo: `JAESCOBARC/profesor-de-excel` · GitHub Pages · sin build step (HTML estático, deploy directo desde `main`)
>
> Este fichero es un resumen vivo para retomar el contexto rápido al empezar una
> conversación nueva sobre esta web. Actualízalo cada vez que se cierre un bloque
> de trabajo relevante — no hace falta registrar cada commit, solo lo que cambia
> el estado real del sitio (nuevas páginas, cambios de negocio/estrategia,
> hallazgos de SEO/tracking, bugs corregidos).

## 1. Qué es este sitio

Landing pages + herramientas de captación de leads para clases particulares de
Excel online (Jhony Escobar, Granada, Microsoft Excel Expert certificado). El
canal de conversión principal es WhatsApp; también hay un test de nivel de
Excel como imán de leads. Todo el tracking va a GTM (`GTM-MNRMBXCM`) + un
sistema propio de atribución (gclid/fbclid/gbraid/wbraid) que persiste 60 días
en localStorage y envía cada lead a un Google Apps Script.

## 2. Páginas del sitio (estado actual)

| Página | Rol | Notas |
|---|---|---|
| `index.html` | Home | Precios, hero, funnel general |
| `profesor-excel-online.html` | Landing principal "profesor particular" | Página de mayor foco reciente: CTAs, FAQ, urgencia |
| `jhony-profesor-excel-online.html` | Bio / autoridad (E-E-A-T) | Sus CTAs principales redirigen a `profesor-excel-online.html`, no a WhatsApp directo |
| `test-nivel-excel.html` | Imán de leads — test interactivo de nivel de Excel | Motor de fórmulas HyperFormula, mensajes de resultado diferenciados por nivel |
| `prueba-excel-entrevista-trabajo.html` | SEO long-tail, funnel hacia el test | Reenfocada de venta directa a "haz el test" |
| `certificacion-microsoft-excel-especialista.html` | Landing certificación MOS | Enlaza y es enlazada por `profesor-excel-online.html` (bidireccional) |
| `automatizacion-excel-empresas.html` | Landing B2B automatización | Recibe el CTA "Trabajos y asesorías" de home y de la landing principal |
| `formacion-excel-empresas-fundae.html` | Landing formación empresas (FUNDAE) | |
| `programa-balanced-scorecard.html` | Landing programa BSC | |
| `plantillas/balanced-scorecard-excel.html` | Plantilla descargable BSC | ⚠️ el enlace `/plantillas/` (sin archivo) que aparece en 2 páginas da 404 — pendiente de decidir si se arregla |
| `aprobar-examen-excel.html` | Contenido SEO | ⚠️ **huérfana**: 0 enlaces internos entrantes, ninguna otra página la menciona |
| `sobre-mi-jhony-escobar.html` | Redirect 302 → `jhony-profesor-excel-online.html` | Solo por compatibilidad de URLs antiguas |
| `aviso-legal.html` / `politica-privacidad.html` | Legales | Excluidas del grafo de enlaces internos (ruido de footer) |

## 3. Hallazgos y decisiones de enlazado interno (SEO)

- La skill **`/enlaces`** (en `.claude/skills/enlaces/`) genera un dashboard
  interactivo (D3.js, publicado como Artifact) con el mapa completo de
  enlaces internos: páginas huérfanas, enlaces rotos, quién enlaza a quién.
  Ejecutarla de nuevo cada vez que se sospeche un problema de enlazado o tras
  cambios grandes de estructura.
- **Corregido (9 sept. 2026):** la home no enlazaba a `profesor-excel-online.html`
  pese a que esa página ya recibía enlaces de 9 páginas internas. Se arregló
  enlazando el texto "profesor de Excel cerca de ti online" del home.
- **Corregido:** la relación entre `profesor-excel-online.html` y
  `jhony-profesor-excel-online.html` ahora es **unidireccional** — solo sale
  enlace desde `jhony-profesor-excel-online.html` hacia `profesor-excel-online.html`
  (antes había enlaces en ambos sentidos, por decisión explícita del usuario).
- **Pendiente / sin decidir aún:**
  - `aprobar-examen-excel.html` sigue sin ningún enlace interno entrante.
  - El enlace roto a `/plantillas/` (referenciado desde 2 páginas) sigue sin corregir.
- El grafo del dashboard dibuja los pares de páginas que se enlazan
  mutuamente como **curvas separadas** (no líneas rectas superpuestas) para
  que ambos sentidos se vean — esto se corrigió porque antes generaba
  confusión (parecía unidireccional cuando era mutuo).

## 4. Test de nivel de Excel (`test-nivel-excel.html`)

- Motor de fórmulas real vía HyperFormula (CDN), con traducción de sintaxis
  español→inglés (nombres de función, `;`→`,`, VERDADERO/FALSO, minúsculas).
- Validación de fórmulas al final del test, no en cada pregunta (silenciosa,
  sin botón "Comprobar").
- Grid estilo hoja de Excel real (headers de fila/columna), sin pistas de
  nombres de función (es un test).
- Baremo de nivel (endurecido varias veces por feedback real de uso):
  - **Avanzado**: básico e intermedio perfectos + máx. 1 fallo en avanzado.
  - **Intermedio**: básico perfecto + máx. 1 fallo en avanzado.
  - **Básico**: el resto.
- Mensajes de resultado **diferenciados por nivel**, con gancho emocional
  validado contra sentimiento real de un hilo de r/excel (no inventado):
  - Avanzado → empuja a dar el salto a Power Query/Power Pivot/Macros/Power BI.
  - Intermedio → detectar huecos concretos antes de que "te pillen desprevenido".
  - Básico → normaliza no saber lo esencial, pero conecta con requisito
    silencioso en ofertas de trabajo.
  - El mensaje de resultado está resaltado visualmente (caja con borde) para
    que no pase desapercibido.
- CTAs con `utm_source` consistente y estático (no reconstruido por JS) para
  que el tracking de eventos funcione de forma fiable.
- Se añadió `window.delayedNav()` (retraso de 300ms antes de navegar) en los
  CTAs que salen de esta página, para evitar que la navegación corte el pixel
  de conversión de Google Ads antes de que se registre (era la causa de un
  tag "Fallida" en GTM).
- Imagen de compartir (OG) propia con temática de test/quiz — antes
  compartía la imagen genérica de "Clases de Excel Online" con el resto del
  sitio.

## 5. Tracking y atribución

- GTM (`GTM-MNRMBXCM`) instalado en **todas** las páginas del sitio,
  incluido el stub de redirección y la plantilla BSC.
- `whatsapp-config.js` es la única fuente del número de WhatsApp
  (`34641682371`) y del click handler — todos los botones de WhatsApp del
  sitio pasan por aquí. Genera un ID de contacto (`EXC-XXXXXX`) por lead y lo
  añade al mensaje, además de mandar los datos (gclid/fbclid/gbraid/wbraid,
  dispositivo, página, intento) a un Google Apps Script.
- `cookie-consent.js` implementa Google Consent Mode v2 con banner propio
  (esenciales / aceptar todo). Por decisión explícita del propietario, los
  identificadores publicitarios (gclid, fbclid, etc.) se capturan siempre,
  independientemente del consentimiento de analytics.
- **Sin resolver:** el usuario reportó 0 mensajes de WhatsApp Business en 2
  semanas pese a tener visitas. Se auditó el código a fondo (número
  consistente en todo el sitio, handler sin conflictos, sin overlays
  bloqueando el CTA, sin popup-blockers por el uso de `window.open` síncrono)
  y no se encontró ningún bug. El propio usuario confirmó que el botón le
  funciona a él. Sospechas no descartadas, pendientes de que el usuario
  investigue por su lado: calidad del tráfico de Ads, cambios recientes de
  campaña/audiencia, restricción silenciosa de WhatsApp Business a nuevos
  contactos, o bloqueadores de anuncios en el navegador de los visitantes.

## 6. E-E-A-T / cumplimiento

- Aviso Legal y Política de Privacidad añadidos (hallazgo de auditoría).
- `reviewCount` falso corregido con datos reales de Superprof.
- Google Business Profile añadido al `sameAs` del schema.

## 7. Herramientas internas creadas

- **Skill `/enlaces`** (`.claude/skills/enlaces/`): genera el dashboard de
  enlaces internos descrito en la sección 3. Incluye script Python
  determinista (`scripts/extract_links.py`) que no depende de que el modelo
  "cuente a mano" — solo lee el HTML real del repo.
- **`scripts/update_sitemap_lastmod.py`** + GitHub Action (`update-sitemap.yml`):
  actualiza automáticamente el `lastmod` del sitemap según la fecha real del
  último commit que tocó cada página. Genera commits `chore: actualiza
  lastmod del sitemap [skip ci]` — normal verlos en el historial, no son
  ruido a investigar.
- **`ping-sitemap.yml`**: cron diario que envía el sitemap a Bing/IndexNow.

## 8. Convenciones del repo (para no romper nada)

- **No mover los `.html` de la raíz** — GitHub Pages los sirve como URLs
  públicas directas (`profesor-excel-online.html` → `/profesor-excel-online.html`).
  Moverlos rompería SEO, sitemap, anuncios y backlinks ya indexados.
- El archivo `a64d1f7d8b1bf3c9feaaa4505087c349.txt` en la raíz es un archivo
  de verificación de dominio (Google/Bing Search Console) — no tocar ni mover.
- Los JS (`whatsapp-config.js`, `cookie-consent.js`, `planes-config.js`) y las
  imágenes sueltas están todos en la raíz también, referenciados con rutas
  absolutas (`/logo-pe.png`, etc.) desde cada página. Se evaluó organizarlos
  en subcarpetas (`/media`, `/js`) pero se decidió no hacerlo por ahora — el
  riesgo (actualizar la ruta en las ~15 páginas) no compensaba el beneficio
  (solo orden interno, no afecta al funcionamiento).
- Flujo de git: como el Action de sitemap comitea directo a `main`, es normal
  que `git push` falle por no-fast-forward — solución estándar:
  `git fetch origin main && git rebase origin/main && git push origin main`.

## 9. Ideas/pendientes mencionados pero no ejecutados

- Enlazar `aprobar-examen-excel.html` desde alguna página (sigue huérfana).
- Arreglar o quitar el enlace roto a `/plantillas/`.
- Reorganizar assets (imágenes/JS) en subcarpetas — solo si el usuario lo
  pide explícitamente, y con script de reemplazo + verificación por grep, no
  a mano.
- Investigar la causa de los 0 mensajes de WhatsApp (fuera del alcance del
  código, ver sección 5).
