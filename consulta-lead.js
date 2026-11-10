/* "Envíame tu archivo": formulario de consulta asíncrona de la home. Guarda el contacto en la misma hoja de Google que el test de nivel
   (type 'test'): en la columna del nivel va 'Consulta de archivo' y el mensaje y el enlace al archivo, en el resumen. */
(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxaoBbw2PlkY_xuccp8dZBKVOPbK_K1t17ZuWXI9tP58PxXCWDbjWFv06K1UhYc0uK0/exec';
  var ATTR_KEY = 'tec_attr';
  var MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 días
  var PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid'];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function readAttribution() {
    var raw = safeGet(ATTR_KEY);
    if (!raw) return {};
    try { var o = JSON.parse(raw); return (o && o.ts && Date.now() - o.ts <= MAX_AGE_MS) ? o : {}; } catch (e) { return {}; }
  }
  function setError(field, show) { if (field) field.classList.toggle('has-error', !!show); }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-archivo-form]').forEach(function (form) {
      ['nombre', 'email', 'mensaje'].forEach(function (n) {
        var el = form.elements[n];
        if (!el) return;
        el.addEventListener('input', function () { setError(form.querySelector('[data-f="' + n + '"]'), false); });
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nombre = form.elements.nombre.value.trim();
        var email = form.elements.email.value.trim();
        var mensaje = form.elements.mensaje.value.trim();
        var enlace = form.elements.enlace ? form.elements.enlace.value.trim() : '';
        var okN = !!nombre, okE = EMAIL_RE.test(email), okM = !!mensaje;
        setError(form.querySelector('[data-f="nombre"]'), !okN);
        setError(form.querySelector('[data-f="email"]'), !okE);
        setError(form.querySelector('[data-f="mensaje"]'), !okM);
        if (!okN || !okE || !okM) {
          (!okN ? form.elements.nombre : (!okE ? form.elements.email : form.elements.mensaje)).focus();
          return;
        }
        var a = readAttribution(), q = new URLSearchParams(location.search);
        var resumen = mensaje + (enlace ? ' | Archivo: ' + enlace : '');
        try {
          fetch(ENDPOINT, {
            method: 'POST', mode: 'no-cors', keepalive: true,
            body: JSON.stringify({
              type: 'test', nombre: nombre, email: email, pais: '',
              nivel: 'Consulta de archivo', plan: 'Archivo', fallos: '', resumen: resumen,
              gclid: q.get('gclid') || a.gclid || '', gbraid: q.get('gbraid') || a.gbraid || '',
              wbraid: q.get('wbraid') || a.wbraid || '', fbclid: q.get('fbclid') || a.fbclid || '',
              page: location.pathname
            })
          }).catch(function () {});
        } catch (err) {}
        var ok = form.querySelector('[data-ok]');
        if (ok) ok.hidden = false;
        form.classList.add('is-done');
        if (window.dataLayer) window.dataLayer.push({ event: 'consulta_archivo_enviada' });
      });
    });
  });
})();
