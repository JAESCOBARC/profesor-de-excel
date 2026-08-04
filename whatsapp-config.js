(function () {
  var WHATSAPP_NUMBER = '34641682371';
  window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxaoBbw2PlkY_xuccp8dZBKVOPbK_K1t17ZuWXI9tP58PxXCWDbjWFv06K1UhYc0uK0/exec';

  var ATTR_KEY = 'tec_attr';
  var VID_KEY = 'tec_vid';
  var ATTEMPTS_KEY = 'tec_attempts';
  var MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 días
  var DAY_MS = 24 * 60 * 60 * 1000;
  var PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid'];

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // Solo persistimos identificadores publicitarios si el usuario aceptó
  // cookies de publicidad en el banner de consentimiento (Consent Mode v2).
  function hasAdConsent() {
    return safeGet('cookieConsent') === 'all';
  }

  function readAttribution() {
    var raw = safeGet(ATTR_KEY);
    if (!raw) return null;
    try {
      var o = JSON.parse(raw);
      if (!o || !o.ts || Date.now() - o.ts > MAX_AGE_MS) return null;
      return o;
    } catch (e) { return null; }
  }

  function captureAttribution() {
    if (!hasAdConsent()) return;
    var p = new URLSearchParams(location.search);
    var found = {}, any = false;
    PARAMS.forEach(function (k) {
      var v = p.get(k);
      if (v) { found[k] = v; any = true; }
    });
    if (!any) return;
    found.ts = Date.now();
    found.landing = location.pathname;
    safeSet(ATTR_KEY, JSON.stringify(found)); // último clic gana
  }

  function visitorId() {
    if (!hasAdConsent()) return '';
    var v = safeGet(VID_KEY);
    if (!v) {
      v = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
      safeSet(VID_KEY, v);
    }
    return v;
  }

  function nextAttempt(vid) {
    if (!vid) return 1;
    var raw = safeGet(ATTEMPTS_KEY);
    var list = [];
    if (raw) { try { list = JSON.parse(raw); } catch (e) { list = []; } }
    var now = Date.now();
    // Nos quedamos solo con intentos de las últimas 24h (de cualquier vid, para no acumular basura).
    list = list.filter(function (a) { return (now - a.ts) < DAY_MS; });
    var count = list.filter(function (a) { return a.vid === vid; }).length;
    list.push({ vid: vid, ts: now });
    safeSet(ATTEMPTS_KEY, JSON.stringify(list));
    return count + 1;
  }

  function device() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'movil' : 'escritorio';
  }

  function buildLead() {
    var a = readAttribution() || {};
    var vid = visitorId();
    return {
      code: 'EXC-' + Math.floor(100000 + Math.random() * 900000),
      gclid: a.gclid || '',
      gbraid: a.gbraid || '',
      wbraid: a.wbraid || '',
      fbclid: a.fbclid || '',
      landing: a.landing || '',
      pagina: location.pathname,
      vid: vid,
      dispositivo: device(),
      intento: nextAttempt(vid)
    };
  }

  function sendLead(lead) {
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          code: lead.code,
          gclid: lead.gclid,
          gbraid: lead.gbraid,
          wbraid: lead.wbraid,
          fbclid: lead.fbclid,
          page: lead.pagina,
          vid: lead.vid,
          dispositivo: lead.dispositivo,
          landing: lead.landing,
          intento: lead.intento
        })
      }).catch(function () {});
    } catch (e) {}
  }

  captureAttribution();

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-wa-msg]').forEach(function (el) {
      var baseMsg = el.getAttribute('data-wa-msg');
      el.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER); // respaldo si algo falla antes del clic

      el.addEventListener('click', function (evt) {
        evt.preventDefault();

        var code;
        try {
          var lead = buildLead();
          sendLead(lead);
          code = lead.code;
        } catch (e) {
          code = 'EXC-' + Math.floor(100000 + Math.random() * 900000);
        }

        var msg = baseMsg + ' (ID contacto: ' + code + ')';
        var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
        window.open(url, '_blank', 'noopener');
      });
    });
  });
})();
