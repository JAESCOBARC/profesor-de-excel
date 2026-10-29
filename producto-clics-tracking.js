/* Clics en los CTA de aplicaciones y plantillas → misma hoja de Google Sheets (Apps Script) que los leads.
   Cada clic envía una fila con code COMPRA-<posición>-<nº> (clic en el botón de compra) o FICHA-<producto>-<nº>
   (clic en la tarjeta de un producto del catálogo), page = URL de la página y la atribución de anuncios (gclid, etc.).
   También manda evento, producto y cta como campos aparte por si el Apps Script los recoge. */
(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxaoBbw2PlkY_xuccp8dZBKVOPbK_K1t17ZuWXI9tP58PxXCWDbjWFv06K1UhYc0uK0/exec';
  var VID_KEY = 'tec_vid';
  var ATTR_KEY = 'tec_attr';
  var MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 días
  var PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid'];

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // Las páginas de producto no cargan whatsapp-config.js: capturamos aquí la atribución (mismas claves, último clic gana).
  function captureAttribution() {
    var p = new URLSearchParams(location.search), found = {}, any = false;
    PARAMS.forEach(function (k) { var v = p.get(k); if (v) { found[k] = v; any = true; } });
    if (!any) return;
    found.ts = Date.now();
    found.landing = location.pathname;
    safeSet(ATTR_KEY, JSON.stringify(found));
  }
  function readAttribution() {
    var raw = safeGet(ATTR_KEY);
    if (!raw) return {};
    try {
      var o = JSON.parse(raw);
      return (o && o.ts && Date.now() - o.ts <= MAX_AGE_MS) ? o : {};
    } catch (e) { return {}; }
  }
  function visitorId() {
    var v = safeGet(VID_KEY);
    if (!v) {
      v = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
      safeSet(VID_KEY, v);
    }
    return v;
  }
  function device() { return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'movil' : 'escritorio'; }

  var PRODUCTS = {
    '/kit-plantillas-excel-negocios.html': 'Pack de plantillas Excel para negocios',
    '/plan-negocio/': 'Budget Plan Pro (ES)',
    '/business-plan-software/': 'Budget Plan Pro (EN)',
    '/plano-de-negocios/': 'Budget Plan Pro (PT)'
      };
  var CATALOG = {
    '/kit-plantillas-excel-negocios.html': 'KIT',
    '/plan-negocio/': 'BPP'
  };

  function norm(path) { return path.replace(/index\.html$/, ''); }

  function send(code, evento, producto, cta) {
    try {
      var a = readAttribution(), vid = visitorId();
      fetch(ENDPOINT, {
        method: 'POST', mode: 'no-cors', keepalive: true,
        body: JSON.stringify({
          code: code,
          gclid: a.gclid || '', gbraid: a.gbraid || '', wbraid: a.wbraid || '', fbclid: a.fbclid || '',
          page: location.pathname,
          vid: vid,
          dispositivo: device(),
          landing: a.landing || '',
          intento: 1,
          evento: evento, producto: producto, cta: cta
        })
      }).catch(function () {});
    } catch (e) {}
  }
  function rnd() { return Math.floor(100000 + Math.random() * 900000); }

  // Posición del botón a partir de data-cta o de la clase usada en las plantillas.
  function ctaName(el) {
    var d = el.getAttribute('data-cta');
    if (d) return d;
    var c = el.className || '';
    if (/nav-btn/.test(c)) return 'header';
    if (/btn-buy-white|btn-cta-white/.test(c)) return 'final';
    if (/btn-buy|btn-cta/.test(c)) return 'hero';
    return 'otro';
  }

  captureAttribution();

  document.addEventListener('DOMContentLoaded', function () {
    var path = norm(location.pathname);
    var producto = PRODUCTS[path];

    if (producto) {
      document.querySelectorAll('a[data-buy], a[href*="pay.hotmart.com"]:not(#hotmart-trigger), a.nav-btn, a.btn-cta, a.btn-cta-white, a.btn-buy, a.btn-buy-white').forEach(function (el) {
        if (el.id === 'hotmart-trigger' || el.hasAttribute('data-wa-msg')) return;
        el.addEventListener('click', function () {
          var cta = ctaName(el);
          send('COMPRA-' + cta + '-' + rnd(), 'clic_compra', producto, cta);
        });
      });
    }

    // Descarga de la demo de Budget Plan Pro
    document.querySelectorAll('a[data-demo]').forEach(function (el) {
      el.addEventListener('click', function () {
        send('DEMO-' + rnd(), 'clic_demo', (PRODUCTS[path] || 'Budget Plan Pro') + ' · demo', 'demo-descarga');
      });
    });

    // Catálogo: clics en las fichas de producto (hub de plantillas)
    document.querySelectorAll('a.producto-card').forEach(function (el) {
      var key = CATALOG[norm((el.getAttribute('href') || '').split('#')[0])];
      if (!key) return;
      el.addEventListener('click', function () {
        send('FICHA-' + key + '-' + rnd(), 'clic_ficha', PRODUCTS[norm(el.getAttribute('href'))] || key, 'catalogo');
      });
    });
  });
})();
