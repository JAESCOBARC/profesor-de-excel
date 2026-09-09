---
name: enlaces
description: Genera y publica un dashboard interactivo (artefacto HTML con grafo D3.js) que mapea todos los enlaces internos de trabajoenexcel.com — qué página enlaza a cuál, páginas huérfanas, enlaces rotos, redirecciones — para diagnosticar problemas de SEO/enlazado interno como páginas que no reciben autoridad desde la home. Usa esta skill SIEMPRE que el usuario escriba "/enlaces", o pida "mapa de enlaces internos", "araña de enlaces", "grafo de enlaces", "por qué no ranquea X página", "revisa el enlazado interno", "actualiza el mapa de enlaces", o cualquier variante de auditar/visualizar cómo se conectan las páginas del sitio entre sí. También aplica después de crear una página nueva o cambiar CTAs/enlaces, para confirmar que el enlazado interno quedó bien. Acepta opcionalmente el nombre de una página concreta (ej. "/enlaces profesor-excel-online.html") para resaltarla como foco del análisis.
---

# Araña de enlaces internos de trabajoenexcel.com

Esta skill reconstruye el flujo que se usó para diagnosticar por qué
`profesor-excel-online.html` no estaba recibiendo enlaces desde la home:
extraer todos los enlaces internos reales del HTML del sitio, y convertirlos
en un dashboard visual (grafo interactivo + tabla + hallazgos) publicado como
Artifact.

No es solo un ejercicio visual — el objetivo es que el hallazgo principal
(una página de alta autoridad que no enlaza a otra que debería, una página
huérfana, un enlace roto) salte a la vista de inmediato.

## Paso 1 — Extraer los datos (determinista, no lo hagas a mano)

Ejecuta el script bundleado, que ya hace todo el trabajo de parsing/URL-resolving
que se hizo manualmente la primera vez (regex de `href="..."`, resolución de
relativos/absolutos con `urljoin` contra `https://www.trabajoenexcel.com/`,
exclusión de externos/`mailto:`/`tel:`/`javascript:`/`#`/assets, detección
automática de páginas de redirección vía `<meta http-equiv="refresh">` o
`window.location.replace`, y detección de enlaces rotos — hrefs que apuntan a
una ruta sin archivo real):

```bash
python3 .claude/skills/enlaces/scripts/extract_links.py --root . --out /tmp/enlaces.json
```

Lee el JSON resultante. Contiene, por página: `incoming`/`outgoing` (conteos),
`incoming_ids`/`outgoing_ids` (listas), `exists` (si el archivo realmente
existe) e `is_redirect`. También trae `edges` (pares únicos con peso SEO —
ya excluye `aviso-legal.html`/`politica-privacidad.html` como ruido de
footer), `edges_all` (todos, sin excluir legales — úsalo solo para las
cifras totales si el usuario las pide), `broken_targets` (rutas enlazadas
que no existen) y `redirect_pages`.

No inventes ni redondees estas cifras — son las que verá el usuario y las
usará para decidir qué enlaces cambiar en el sitio real.

## Paso 2 — Decide el foco del análisis

Si el usuario pasó una página como argumento (o si en la conversación ya se
mencionó una página con problemas de ranking/visitas), esa es la página
objetivo: revisa en el JSON si recibe enlaces desde `index.html` y desde las
páginas de mayor autoridad (más `incoming`), y arma el hallazgo principal
alrededor de eso — igual que se hizo con `profesor-excel-online.html`, donde
el hallazgo fue "la home no la enlaza pese a que la página ya recibe 9
enlaces internos de otras partes".

Si no hay página objetivo explícita, elige el hallazgo más accionable que
encuentres en los datos, en este orden de prioridad:
1. Página huérfana (`incoming == 0` y `exists == true`) — nadie la enlaza.
2. Enlace roto (`broken_targets`) — se está enlazando a algo que no existe.
3. Página de alta autoridad que no enlaza a una página de bajo `incoming` que
   claramente debería (usa criterio: mira los nombres/temas de las páginas).
4. Si nada de eso aparece, el hallazgo puede ser positivo ("el enlazado
   interno está sano, sin huérfanas ni rotos") — no fuerces un problema que
   no existe.

## Paso 3 — Diseña y construye el artefacto

Antes de escribir el HTML, **carga la skill `artifact-design`** — el
dashboard debe seguir su disciplina (tokens de color en ambos temas,
"write, look once, publish", etc.), no solo copiar el layout de la última
vez sin pensarlo.

Usa la paleta de marca real del sitio (son los tokens ya verificados en
otras páginas de trabajoenexcel.com — no los inventes de nuevo):

```
--green-deep:  #0a2e1a
--green-mid:   #1a5c36
--green-light: #4db87a
--green-pale:  #d4f0e0
--green-mist:  #f0faf4
--cream:       #faf8f3
--gold:        #c9a84c
--amber:       #f5a623
```

más un tono de alerta (rojo/terracota) para huérfanas/rotos y su versión de
fondo tenue, y los neutros de texto (`--slate`, `--muted`, `--border`).
Define ambos temas (claro y oscuro con `prefers-color-scheme` + overrides
`[data-theme]`) como indica `artifact-design`.

Tipografía: Fraunces (display/headings) + DM Sans (texto) + JetBrains Mono
(rutas de archivo, cifras tabulares), vía `<link>` de Google Fonts.

### Estructura del dashboard

1. **Masthead**: eyebrow + h1 + una frase de lede que nombre la página
   objetivo si la hay.
2. **4 stat tiles**: páginas rastreadas, enlaces internos con peso SEO,
   páginas huérfanas, y una cuarta métrica relevante al hallazgo (por
   ejemplo "enlaces desde la Home a X" si hay página objetivo, o "enlaces
   rotos" si el hallazgo es sobre un 404).
3. **Callout de hallazgo**: una caja destacada (roja si el problema sigue
   sin resolver, verde si ya está resuelto o si el enlazado está sano)
   explicando el hallazgo del Paso 2 en 2-3 frases, citando páginas y cifras
   reales del JSON.
4. **Grafo D3.js v7 force-directed**, con:
   - Nodos arrastrables (`d3.drag`), radio proporcional a `incoming`.
   - Color por categoría de página (deduce categorías razonables de los
     nombres de archivo: home, landing de servicio, imán de leads/test,
     recurso, huérfana/rota, redirección — no hace falta que sean exactas,
     pero deben ser consistentes con la leyenda).
   - Tooltip al pasar el ratón con nombre, ruta e incoming/outgoing.
   - **Al hacer clic en un nodo**: resalta sus líneas entrantes en un color
     y salientes en otro (por ejemplo ámbar entrante / verde saliente),
     atenúa (opacity baja) todo lo demás, y permite deseleccionar haciendo
     clic de nuevo en el nodo, en el fondo del grafo, o en un botón "Quitar
     selección". Esto es importante — sin esta interacción el grafo es
     bonito pero no ayuda a razonar sobre una página en concreto.
   - Si hay una página objetivo, márcala visualmente (ej. un aro alrededor
     del nodo) para que se distinga del resto sin necesidad de leer la
     leyenda.
5. **Tabla completa** de páginas ordenada por `incoming` descendente, con
   columnas: página (nombre + ruta en mono), categoría, entrantes,
   salientes, estado (huérfana / 404 no existe / redirección / solo 1
   entrante / bien enlazada / lo que corresponda según los datos reales).
6. **Footer** con la fecha de generación y una nota aclarando qué se excluyó
   del grafo visual (enlaces a páginas legales) y por qué.

### Evita el error que ya cometimos una vez

En la primera versión de este dashboard se dibujó una línea discontinua roja
"sintética" señalando un enlace que *no existía*, sin dejarlo claro en la
leyenda — el usuario la confundió con un enlace real. Si vas a señalar la
*ausencia* de un enlace (en vez de un enlace real), déjalo inconfundible:
una etiqueta de texto sobre la propia línea (ej. "✕ enlace inexistente"), no
solo un estilo de línea distinto en la leyenda. Mejor aún: si el hallazgo ya
fue corregido en el sitio (el enlace ya existe), no dibujes ninguna línea
sintética — usa el edge real de los datos y un callout en verde.

## Paso 4 — Publica

Usa el `Artifact` tool para publicarlo. Si ya existe un artefacto de esta
araña de enlaces publicado antes en la conversación (revisa el historial),
actualízalo pasando su `url` en vez de crear uno nuevo — así el usuario
conserva el mismo link cada vez que pide regenerar el mapa. Si es la primera
vez, publícalo sin `url` y elige un favicon con la araña temática (🕸️) y una
`description` de una frase mencionando el hallazgo principal.

## Notas

- Esta skill vive en el repo del proyecto (`.claude/skills/enlaces/`), no es
  global — solo aplica a trabajoenexcel.com.
- El script no modifica ningún archivo del sitio ni asume nada sobre su
  contenido más allá de los `href` que encuentra — es solo lectura.
- Si el usuario pide después *arreglar* alguno de los hallazgos (enlazar una
  huérfana, corregir un 404, enlazar la home a una página), eso es trabajo
  de edición normal del sitio, no de esta skill — confirma con el usuario
  antes de tocar archivos del sitio, tal como se hizo la vez anterior.
