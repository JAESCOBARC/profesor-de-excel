(function () {
  var WHATSAPP_NUMBER = '34641682371';
  window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
  var GCLID_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxaoBbw2PlkY_xuccp8dZBKVOPbK_K1t17ZuWXI9tP58PxXCWDbjWFv06K1UhYc0uK0/exec';

  function getRefCode() {
    var params = new URLSearchParams(window.location.search);
    var gclid = params.get('gclid');

    if (gclid) {
      var code = 'EXC-' + Math.floor(100000 + Math.random() * 900000);
      sessionStorage.setItem('gclid_ref', JSON.stringify({ code: code, gclid: gclid, sent: false }));
      return code;
    }

    var stored = sessionStorage.getItem('gclid_ref');
    if (stored) {
      try { return JSON.parse(stored).code; } catch (e) { return null; }
    }
    return null;
  }

  function sendGclidOnce() {
    var stored = sessionStorage.getItem('gclid_ref');
    if (!stored) return;
    var data;
    try { data = JSON.parse(stored); } catch (e) { return; }
    if (data.sent) return;

    fetch(GCLID_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ code: data.code, gclid: data.gclid, page: window.location.pathname })
    }).catch(function () {});

    data.sent = true;
    sessionStorage.setItem('gclid_ref', JSON.stringify(data));
  }

  document.addEventListener('DOMContentLoaded', function () {
    var refCode = getRefCode();
    sendGclidOnce();

    document.querySelectorAll('[data-wa-msg]').forEach(function (el) {
      var msg = el.getAttribute('data-wa-msg');
      if (refCode) msg += ' (ID solicitud: ' + refCode + ')';
      var url = 'https://wa.me/' + WHATSAPP_NUMBER;
      if (msg) url += '?text=' + encodeURIComponent(msg);
      el.setAttribute('href', url);
    });
  });
})();
