(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxaoBbw2PlkY_xuccp8dZBKVOPbK_K1t17ZuWXI9tP58PxXCWDbjWFv06K1UhYc0uK0/exec';
  var VID_KEY = 'tec_vid';
  var ATTR_KEY = 'tec_attr';
  var ATTEMPTS_KEY = 'tec_attempts';
  var DAY_MS = 24 * 60 * 60 * 1000;
  var MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 días

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function visitorId() {
    var v = safeGet(VID_KEY);
    if (!v) {
      v = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
      safeSet(VID_KEY, v);
    }
    return v;
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

  function device() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'movil' : 'escritorio';
  }

  function nextAttempt(vid) {
    if (!vid) return 1;
    var raw = safeGet(ATTEMPTS_KEY);
    var list = [];
    if (raw) { try { list = JSON.parse(raw); } catch (e) { list = []; } }
    var now = Date.now();
    list = list.filter(function (a) { return (now - a.ts) < DAY_MS; });
    var count = list.filter(function (a) { return a.vid === vid; }).length;
    list.push({ vid: vid, ts: now });
    safeSet(ATTEMPTS_KEY, JSON.stringify(list));
    return count + 1;
  }

  function sendReservaLead() {
    try {
      var vid = visitorId();
      var a = readAttribution() || {};
      var code = 'RESERVA' + vid.replace(/-/g, '').slice(0, 8).toUpperCase();
      fetch(ENDPOINT, {
        method: 'POST', mode: 'no-cors',
        body: JSON.stringify({
          code: code,
          gclid: a.gclid || '', gbraid: a.gbraid || '', wbraid: a.wbraid || '', fbclid: a.fbclid || '',
          page: location.pathname,
          vid: vid,
          dispositivo: device(),
          landing: a.landing || '',
          intento: nextAttempt(vid)
        })
      }).catch(function () {});
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-track-reserva]').forEach(function (el) {
      el.addEventListener('click', function () { sendReservaLead(); });
    });
  });
})();
