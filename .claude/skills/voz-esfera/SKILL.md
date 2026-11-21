---
name: voz-esfera
description: Crea una tarjeta de voz con esfera de partículas reactiva al audio (la "esfera" de la home de trabajoenexcel.com) en cualquier página o proyecto web, con el audio generado con la voz clonada del profesor a partir de un guion que se acuerda con el usuario. Úsala cuando el usuario escriba "/voz-esfera", o pida "una esfera de voz", "audio con mi voz para esta página", "asistente de voz", "tarjeta de voz", "que la página me hable", o quiera cambiar el guion/audio de la esfera existente.
---

# Esfera de voz (tarjeta con audio y esfera animada)

Componente: tarjeta compacta con una esfera de ~520 partículas (canvas 2D, reactiva al volumen real vía Web Audio), texto animado (brillo + pulso + halo del botón, se detiene al reproducir), botón Escuchar/Pausar, barra de progreso, teclado, `prefers-reduced-motion`, eventos `dataLayer` (`voz_play`, `voz_fin`, `voz_cta`).
El audio se genera con voz clonada (Chatterbox multilingüe, licencia MIT) a partir de `assets/ref-jhony.wav` (14 s de la voz del profesor, acento colombiano).

## REGLA 1 — El guion nunca es predeterminado
NUNCA generes audio ni montes la tarjeta sin un guion aprobado por el usuario en esta conversación.
Antes de nada pregunta (en un único mensaje, máximo 4 preguntas):
1. **Página/proyecto** donde irá y su objetivo (¿qué debe hacer el visitante después del audio?).
2. **Guion**: ¿lo escribe el usuario, o quiere que lo redactes tú? Si pide un borrador, entrega UNO, claramente marcado como propuesta, y espera su aprobación o sus cambios. No lo des por bueno por silencio.
3. **Duración** orientativa (≈13 caracteres/segundo; 50 s ≈ 650 caracteres).
4. **Dónde se ve**: móvil y escritorio, o solo móvil.
Aplica siempre las reglas del sitio al redactar o revisar el guion (CLAUDE.md): de las clases solo es gratis la clase de diagnóstico de 15 minutos; nunca "primera clase gratis", "clase de prueba gratis" ni "clase gratuita" a secas; no inventes cifras, reseñas ni garantías; todo dato (precios, años, alumnos) debe estar ya en el sitio.
Escribe también el título de la tarjeta (≤ 8 palabras, con `<em>` en el gancho, ej. `Te lo cuento yo mismo <em>en 50 segundos</em>`); la duración que prometa debe coincidir con la real del audio.

## Flujo (tras aprobar guion y dónde va)
1. **Entorno de voz** (una vez por sesión): `bash .claude/skills/voz-esfera/scripts/setup.sh`. Necesita red a pypi y a `huggingface.co`, `cdn-lfs.huggingface.co`, `cdn-lfs.hf.co`, `cas-bridge.xethub.hf.co`, `us.aws.cdn.hf.co`; si el proxy los bloquea, pide al usuario permitirlos (update_environment) antes de seguir. Descarga ~3 GB de dependencias y ~3 GB de modelo.
2. **Guion a archivo**: guarda el texto aprobado en un .txt en el scratchpad (línea en blanco = pausa larga).
3. **Audio**: `/tmp/voz-venv/bin/python .claude/skills/voz-esfera/scripts/gen_voice.py --text guion.txt --out audio/<nombre>.mp3`
   - Va frase por frase (evita el corte por frases largas) y reintenta si una sale demasiado corta; normaliza volumen; mp3 mono 64 kbps.
   - En CPU tarda varios minutos: lánzalo en segundo plano y espera con Monitor.
   - Lee el resumen: duraciones por frase y líneas `AVISO` (posibles cortes). Si hay avisos, reformula esa frase (más corta) o regenera.
   - Guarda el mp3 en `/audio/` del repo (carpeta ya existente).
4. **MUESTRA ANTES DE PUBLICAR**: no puedes oír el audio. Envía el mp3 al usuario (SendUserFile) y espera su OK sobre parecido con su voz, acento, dicción y ritmo. Si no le gusta: ajusta `--exaggeration` (0.3–0.7), `--cfg`, frases o `--ref`, y repite.
5. **Integrar**: `python3 .claude/skills/voz-esfera/scripts/add_card.py --page <página.html> --audio /audio/<nombre>.mp3 --title '<título con <em>>' --aria '<texto accesible>' --before '<cadena HTML única donde insertarla>' --visible all|mobile --page-id <id>`
   - `--before` debe aparecer una sola vez en la página; mira el HTML y elige el punto (en una home, justo antes de los botones de acción suele funcionar). Idempotente: re-ejecutar sustituye la tarjeta.
   - Para mejorar el hueco en escritorio mira cómo se hizo en la home (tarjeta oculta en escritorio con `--visible mobile`).
6. **Obligatorio en el repo** (CLAUDE.md): `python3 scripts/apply_theme.py && python3 scripts/bump_assets.py && python3 scripts/check_links.py`; grep de "primera clase|clase gratis|clase gratuita|clase de prueba"; si la página es nueva, alta en sitemap y fila en `/enlaces`. Commit a `main` con `git fetch origin main && git rebase origin/main`.
7. **QA con Playwright** (390 px y 1280 px): la tarjeta se ve donde debe (con la caja del vídeo/hero coloreada si hay iframes de YouTube, que en headless salen en blanco), clic reproduce (`audio.paused === false`, el botón pasa a "Pausar"), sin desbordes, sin errores JS. No des por buena una captura sin comprobar medidas (`getBoundingClientRect`).
8. Recuerda al usuario purgar la caché de Cloudflare.

## Cambiar solo el guion de una tarjeta existente
Pregunta el nuevo guion (Regla 1), regenera con el mismo `--out` y cambia el título si la duración cambia; no hace falta re-ejecutar `add_card.py` salvo que cambie el título.

## Notas
- Un solo audio por página (`#vozAudio`); varias tarjetas en la misma página comparten audio.
- El audio lleva una marca de agua inaudible de Resemble AI (audio sintético); no se elimina. Informa al usuario de que el audio es sintético si lo pregunta.
- Es la voz propia del profesor (referencia de su audio). Para clonar la voz de otra persona se necesita su consentimiento.
- Si Chatterbox no es viable (sin red o sin disco), alternativa de peor calidad: Piper (`es_MX-claude-high`, voz latina neutra) o grabación del propio usuario; avisa antes de cambiar.
