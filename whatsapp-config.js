(function () {
  var WHATSAPP_NUMBER = '34641682371';
  window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
  var GCLID_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxaoBbw2PlkY_xuccp8dZBKVOPbK_K1t17ZuWXI9tP58PxXCWDbjWFv06K1UhYc0uK0/exec';

  function getLeadData() {
    var stored = sessionStorage.getItem('lead_ref');
    var data = null;
    if (stored) {
      try { data = JSON.parse(stored); } catch (e) { data = null; }
    }

    var params = new URLSearchParams(window.location.search);
    var gclid = params.get('gclid');
    var fbclid = params.get('fbclid');

    if (!data) {
      data = {
        code: 'EXC-' + Math.floor(100000 + Math.random() * 900000),
        gclid: gclid || '',
        fbclid: fbclid || '',
        sent: false
      };
    } else {
      var changed = false;
      if (gclid && !data.gclid) { data.gclid = gclid; changed = true; }
      if (fbclid && !data.fbclid) { data.fbclid = fbclid; changed = true; }
      if (changed) data.sent = false;
    }

    sessionStorage.setItem('lead_ref', JSON.stringify(data));
    return data;
  }

  function sendLeadOnce(data) {
    if (data.sent) return;

    fetch(GCLID_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ code: data.code, gclid: data.gclid, fbclid: data.fbclid, page: window.location.pathname })
    }).catch(function () {});

    data.sent = true;
    sessionStorage.setItem('lead_ref', JSON.stringify(data));
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lead = getLeadData();
    sendLeadOnce(lead);

    document.querySelectorAll('[data-wa-msg]').forEach(function (el) {
      var msg = el.getAttribute('data-wa-msg');
      msg += ' (ID contacto: ' + lead.code + ')';
      var url = 'https://wa.me/' + WHATSAPP_NUMBER;
      if (msg) url += '?text=' + encodeURIComponent(msg);
      el.setAttribute('href', url);
    });
  });
})();
