# Prompt: Landing page profesional con CRO (AIDA + LIFT)

Crea un sitio web completo y listo para producción para el siguiente negocio:

──────────────────────────────────────────
DATOS DEL NEGOCIO
──────────────────────────────────────────
Nombre del profesional: [Nombre Apellido]
Servicio principal: [ej: clases particulares de matemáticas online]
Diferenciador principal (método/enfoque único): [ej: método 80/20 — enseño solo lo que se usa el 80% del tiempo]
Keyword principal (H1): [ej: clases particulares de matemáticas online que se adaptan a tu trabajo real]
Ciudad de residencia: [ej: Madrid, España]
Email: [email@dominio.com]
Teléfono WhatsApp (formato internacional): [+34 6XX XXX XXX]
LinkedIn: [URL completa]
Dominio: [www.tudominio.com]
Años de experiencia: [N]
Número de clientes/alumnos: [N]
% satisfacción: [N%]
Disponibilidad de respuesta: [ej: menos de 2h · Lunes a viernes]

PRECIOS (hasta 3 planes):
- Plan 1: [nombre] · [precio]€ · [descripción breve]
- Plan 2: [nombre] · [precio]€ · [descripción breve] · [% descuento si aplica]
- Plan 3: [nombre] · [precio]€ · [descripción breve] · [% descuento si aplica]

SERVICIOS (hasta 4):
- [Servicio 1]
- [Servicio 2]
- [Servicio 3]
- [Servicio 4]

CERTIFICACIONES / CREDENCIALES (las más relevantes):
- [Certificación 1 · Entidad · Año · ID si tiene]
- [Certificación 2]

TESTIMONIOS (2-3):
- "[Texto]" — [Nombre], [perfil del cliente], [ciudad]
- "[Texto]" — [Nombre], [perfil del cliente], [ciudad]

PREGUNTAS FRECUENTES (3-6):
- P: [Pregunta] / R: [Respuesta]

REDES SOCIALES adicionales: [ej: Superprof URL, Instagram, etc.]

FOTO PROFESIONAL disponible en repo: [nombre-archivo.jpg]

──────────────────────────────────────────
INSTRUCCIONES TÉCNICAS (no cambiar)
──────────────────────────────────────────

ARQUITECTURA:
- Archivo principal: index.html (todo en uno: HTML + CSS + JS inline)
- Página secundaria: sobre-mi-[nombre-apellido].html
- Archivo: sitemap.xml
- Prompt guardado en: PROMPT-LANDING.md
- Todo va en el mismo repositorio. Haz commit y push a main al terminar cada archivo.

──────────────────────────────────────────
ESTRATEGIA CRO: MODELO LIFT
──────────────────────────────────────────

Antes de escribir una sola línea de código, aplica este diagnóstico a cada decisión de copy y estructura:

VALUE PROPOSITION
- El H1 no describe el servicio — describe el RESULTADO que obtiene el cliente
- El diferenciador único del profesional debe aparecer en los primeros 3 elementos visibles (badge, H1 o subtítulo)
- Nunca poner el precio en el hero como gancho principal — posiciona como barato, no como experto

RELEVANCE
- El badge del hero debe reflejar el método o enfoque único, no solo la logística ("Método 80/20 · Online · Toda España" > "Clases en vivo · Online · Toda España")
- El copy del hero debe usar el mismo lenguaje que los anuncios de pago que traerán tráfico

CLARITY
- Máximo 2 CTAs visibles simultáneamente: uno primario (verde sólido) y uno secundario (texto limpio)
- El CTA secundario debe ser considerablemente más discreto que el primario
- En móvil: nunca más de 5 secciones antes del primer CTA de conversión real

ANXIETY (reducirla)
- Bajo el CTA principal: añadir siempre un micro-texto que resuelva las 2 objeciones más comunes: compromiso y tiempo de respuesta
  → Formato: "🟢 [señal de disponibilidad/urgencia] · [tiempo de respuesta] · [días disponibles]"
- Los testimonios con solo iniciales y texto generan ansiedad. Incluir ciudad + perfil del cliente como mínimo
- El CTA nunca debe implicar pago inmediato: usar "Consulta disponibilidad →" en lugar de "Reservar" o "Comprar"

DISTRACTION (eliminarla)
- En móvil: nav-links oculto. El único elemento de nav visible es un enlace de texto limpio al contenido de mayor prueba social (ej: "Testimonios →")
- Sin formularios, sin opciones de navegación que saquen al usuario de la página antes de convertir
- El footer SEO (sección de keywords) va al final y nunca interrumpe el flujo de conversión

URGENCY (crearla de forma honesta)
- Solo usar urgencia real y verificable (plazas limitadas por capacidad real, disponibilidad de agenda)
- La urgencia va pegada al CTA, no en el hero ni en el footer
- Nunca usar countdown timers falsos ni "oferta por tiempo limitado" sin fecha real

──────────────────────────────────────────
ESTRATEGIA CRO: MODELO AIDA
──────────────────────────────────────────

Estructura el contenido de la página en este orden psicológico:

A — ATENCIÓN (hero)
- H1: resultado del cliente, no descripción del servicio
- Badge: diferenciador único del método
- Subtítulo: el diferenciador en detalle, orientado al beneficio inmediato
- Foto del profesional en móvil: circular, redondeada, con borde en color de marca → genera confianza inmediata sin scrollear
- Trust bar con 4 métricas reales (alumnos, satisfacción, experiencia, certificación/award externo)

I — INTERÉS (segundo bloque tras el hero)
- Sección de pain points ("¿Te identificas?") ANTES del método/servicios
- El usuario debe verse reflejado antes de recibir la solución
- Usar lenguaje del cliente, no del profesional

D — DESEO (zona media de la página)
- Al menos 1 testimonio visible ANTES de la sección de precios
- Los testimonios más potentes (resultado + tiempo + perfil específico) van primero
- La sección de metodología/pasos refuerza el deseo mostrando cómo funciona el proceso

A — ACCIÓN (zonas de conversión)
- CTA primario en el hero → WhatsApp directo con texto pre-cargado contextual
- CTA en sección de precios → mismo destino, texto unificado con el hero
- CTA final antes del footer → mismo destino, mismo texto
- Botón flotante WhatsApp en móvil: siempre visible, mismo texto que el CTA hero
- TODOS los CTAs de la página usan el mismo texto para reforzar consistencia

──────────────────────────────────────────
SEO ON-PAGE
──────────────────────────────────────────
- H1 = keyword principal (orientada al resultado, no al servicio)
- El diferenciador va en <p class="hero-desc"> justo debajo del H1
- Meta description ≤ 155 caracteres: keyword + diferenciador + precio + localización
- Tag <title> ≤ 60 caracteres
- Canonical href = https://www.dominio.com/
- Google Fonts con media="print" onload="this.media='all'" + noscript fallback (non-blocking)
- Sin keyword stuffing: integrar keywords en texto natural

──────────────────────────────────────────
SCHEMA.ORG (JSON-LD en <head> de index.html)
──────────────────────────────────────────
1. FAQPage con todas las preguntas frecuentes
2. Person con: name, jobTitle, url, image, email, telephone, address (addressLocality + addressCountry), areaServed (lista de ciudades + país), knowsAbout (lista de skills), sameAs (LinkedIn + otras redes), hasCredential
3. LocalBusiness/Service con: offers (cada plan con price, priceCurrency, name, description, availability), aggregateRating (ratingValue, reviewCount), review (mínimo 2)

SCHEMA.ORG (JSON-LD en <head> de sobre-mi.html):
- ProfilePage con dateModified en formato ISO 8601 completo: "YYYY-MM-DDTHH:MM:SS+HH:MM"
- mainEntity Person con: image, telephone, hasCredential (TODOS con identifier si tienen ID, dateCreated, recognizedBy), alumniOf, knowsAbout, sameAs

──────────────────────────────────────────
DISEÑO
──────────────────────────────────────────
CSS variables obligatorias:
- Paleta: fondo crema #faf8f3, verde oscuro #0a2e1a, verde medio #1a5c36, verde claro #4db87a, verde pálido #d4f0e0
- Fuentes: Fraunces (serif, títulos) + DM Sans (sans-serif, cuerpo) vía Google Fonts
- H1/H2: font-family Fraunces, font-weight 300, con <em> en italic color verde medio
- Border-radius: tarjetas 16px, botones 100px
- Sombras suaves: box-shadow 0 2px 12px rgba(0,0,0,0.04)

──────────────────────────────────────────
NAVEGACIÓN
──────────────────────────────────────────
- Logo (texto) a la izquierda
- Links en <ul class="nav-links"> al centro: Servicios · Precios · Metodología · FAQ · Sobre mí · Certificación
- CTA de texto FUERA del <ul> (a la derecha): enlace limpio sin botón al contenido de mayor prueba social (ej: "Testimonios →")
  → Estilo: mismo que los links del nav, sin background ni borde
  → NO usar botón verde en la nav — el botón flotante ya cubre esa función en móvil
- En móvil: nav-links { display:none } pero el CTA de texto queda siempre visible

──────────────────────────────────────────
CTAs
──────────────────────────────────────────
- TODOS los botones → WhatsApp: https://wa.me/[número]?text=Hola%2C%20me%20gustar%C3%ADa%20consultar%20disponibilidad%20para%20[servicio-codificado]
- Texto unificado en TODOS los CTAs: "Consulta disponibilidad →"
- Sin formularios, sin mailto
- Botón flotante WhatsApp en móvil (fixed, bottom-right, verde #25D366): siempre visible, mismo texto y destino

──────────────────────────────────────────
SECCIONES DE INDEX.HTML (en este orden AIDA)
──────────────────────────────────────────
1. nav (sticky, blur backdrop)
2. hero:
   - badge con diferenciador único + logística ("Método X · Online · Toda España")
   - H1 orientado al resultado del cliente
   - hero-desc: diferenciador en detalle (el "cómo" y el "por qué tú")
   - En móvil: layout 2 columnas — texto izquierda + foto circular del profesional derecha (enlazada a sobre-mi.html)
   - CTA primario: "Consulta disponibilidad →" → WhatsApp
   - CTA secundario: "Sobre mí →" → sobre-mi.html (texto limpio, sin botón)
   - Micro-texto de urgencia/ansiedad bajo CTAs: "🟢 Plazas limitadas · Respondo en [X]h · [días]"
     → En móvil: 2 líneas, centrado
   - Precio ancla solo en móvil: "Desde [X]€/hora · Sin permanencias" (clase hero-price-hint)
   - trust bar: 4 métricas (alumnos, satisfacción, años experiencia, certificación/award)
     → Todos los trust items clicables: estadísticas → sobre-mi.html, award externo → URL externa
3. pain points del cliente (¿Te identificas?) — ANTES de servicios y método
4. servicios (grid de tarjetas)
5. precios (3 pastillas/pills, la del medio destacada con escala 1.04)
   → CTA en cada pill: "Consulta disponibilidad" → WhatsApp
6. temario/contenido (acordeón o grid)
7. metodología (pasos numerados)
8. faq + testimonios (2 columnas: FAQ izquierda, testimonios derecha)
   → Dar id="testimonios" a la columna de testimonios para anclar desde nav
9. sección SEO local "cerca de mí" (3 columnas: ciudades servidas, online sin barreras, texto con keyword localizada)
10. CTA final → WhatsApp, mismo texto que el resto
11. footer: logo+email | links | redes sociales | copyright

──────────────────────────────────────────
SOBRE-MI.HTML
──────────────────────────────────────────
- URL: sobre-mi-[nombre-apellido].html
- Secciones: hero (foto+bio+stats) → por qué soy diferente (3 cards) → proyectos con resultados numéricos → certificaciones (con IDs) → timeline profesional completo → CTA WhatsApp → footer idéntico al index
- En móvil: foto circular (120px, borde de marca) aparece ENCIMA del título usando CSS order
  → .page-hero > div { order: 2 } / .hero-img-wrap { order: 1 }
  → .hero-img-wrap en móvil: border-radius 50%, sin box-shadow, border 3px color de marca
  → .hero-img-badge { display: none } en móvil

──────────────────────────────────────────
MOBILE (breakpoints obligatorios)
──────────────────────────────────────────
- @media (max-width: 900px): grids de 3 cols → 2 cols
- @media (max-width: 768px):
  - Todos los grids → 1 col
  - hero → grid 1 col (hero-visual oculto)
  - hero-desc-row → grid 2 cols (1fr auto): texto + foto circular del profesional
  - trust bar → grid 2×2, todos los items clicables con padding de zona de toque
  - .section { padding-top: 2.5rem; padding-bottom: 2.5rem } (reducir espacio vertical)
  - nav-links oculto, CTA de texto visible
  - footer centrado con flex-direction: column
  - h1: font-size: 2rem
  - h2: clamp(1.4rem, 6vw, 1.9rem)
  - Badges con texto ≤ 45 caracteres
  - Sin <br> manuales en h2 (dejar reflow natural)
  - Botón flotante WhatsApp: position fixed, bottom 20px, right 16px, border-radius 100px

──────────────────────────────────────────
SITEMAP.XML
──────────────────────────────────────────
- index.html: priority 1.0, changefreq monthly
- sobre-mi.html: priority 0.7, changefreq yearly
- lastmod con fecha real del día

──────────────────────────────────────────
VALIDACIONES ANTES DE HACER COMMIT
──────────────────────────────────────────
1. Validar todos los JSON-LD con python3 + json.loads() — confirmar que parsean sin error
2. Verificar que image, telephone, dateModified (formato datetime completo) están en schemas
3. Verificar que nav-cta está FUERA del ul.nav-links y sin estilos de botón
4. Verificar que no hay badges con texto > 45 caracteres
5. Verificar que .section tiene padding reducido en el bloque @media móvil
6. Verificar que TODOS los CTAs usan el mismo texto y el mismo destino WhatsApp
7. Verificar que el micro-texto de urgencia aparece bajo el CTA en hero
8. Verificar que los trust items son clicables (anchor tags, no divs)
9. Verificar que la foto del profesional aparece en móvil como elemento circular en 2 columnas junto al texto
10. Reportar resultados de validación antes del commit final
