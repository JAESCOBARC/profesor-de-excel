/* Descarga de la demo de Budget Plan Pro con registro: pide nombre, email y país y los guarda en la misma hoja de Google
   que los contactos del test de nivel (type 'test'): en la columna del nivel va el nombre del producto. Después inicia la descarga. */
(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxaoBbw2PlkY_xuccp8dZBKVOPbK_K1t17ZuWXI9tP58PxXCWDbjWFv06K1UhYc0uK0/exec';
  var ATTR_KEY = 'tec_attr';
  var MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 días
  var PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid'];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // Atribución de anuncios: misma clave que el resto del sitio (la captura también aquí por si la landing es la primera página).
  function captureAttribution() {
    var p = new URLSearchParams(location.search), found = {}, any = false;
    PARAMS.forEach(function (k) { var v = p.get(k); if (v) { found[k] = v; any = true; } });
    if (!any) return;
    found.ts = Date.now(); found.landing = location.pathname;
    safeSet(ATTR_KEY, JSON.stringify(found));
  }
  function readAttribution() {
    var raw = safeGet(ATTR_KEY);
    if (!raw) return {};
    try { var o = JSON.parse(raw); return (o && o.ts && Date.now() - o.ts <= MAX_AGE_MS) ? o : {}; } catch (e) { return {}; }
  }

  function setError(field, show) { if (field) field.classList.toggle('has-error', !!show); }

  captureAttribution();

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
      // El aviso de error desaparece en cuanto el campo se corrige
      ['nombre', 'email', 'pais'].forEach(function (n) {
        var el = form.elements[n];
        if (!el) return;
        el.addEventListener('input', function () { setError(form.querySelector('[data-f="' + n + '"]'), false); });
        el.addEventListener('change', function () { setError(form.querySelector('[data-f="' + n + '"]'), false); });
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nombre = form.elements.nombre.value.trim();
        var email = form.elements.email.value.trim();
        var pais = form.elements.pais.value;
        var okNombre = !!nombre, okEmail = EMAIL_RE.test(email), okPais = !!pais;
        setError(form.querySelector('[data-f="nombre"]'), !okNombre);
        setError(form.querySelector('[data-f="email"]'), !okEmail);
        setError(form.querySelector('[data-f="pais"]'), !okPais);
        if (!okNombre || !okEmail || !okPais) {
          (!okNombre ? form.elements.nombre : (!okEmail ? form.elements.email : form.elements.pais)).focus();
          return;
        }

        var a = readAttribution(), q = new URLSearchParams(location.search);
        var url = form.getAttribute('data-url');
        try {
          fetch(ENDPOINT, {
            method: 'POST', mode: 'no-cors', keepalive: true,
            body: JSON.stringify({
              type: 'test',
              nombre: nombre, email: email, pais: pais,
              nivel: form.getAttribute('data-product') || 'Budget Plan Pro',
              plan: form.getAttribute('data-plan') || 'Demo',
              fallos: '', resumen: '',
              gclid: q.get('gclid') || a.gclid || '', gbraid: q.get('gbraid') || a.gbraid || '',
              wbraid: q.get('wbraid') || a.wbraid || '', fbclid: q.get('fbclid') || a.fbclid || '',
              page: location.pathname
            })
          }).catch(function () {});
        } catch (err) {}

        // Gracias + inicio de la descarga
        var ok = form.querySelector('[data-ok]');
        if (ok) { ok.hidden = false; var link = ok.querySelector('a'); if (link) link.href = url; }
        form.classList.add('is-done');
        var dl = document.createElement('a');
        dl.href = url; dl.rel = 'noopener'; dl.style.display = 'none';
        document.body.appendChild(dl); dl.click(); document.body.removeChild(dl);
      });
    });
  });
})();
