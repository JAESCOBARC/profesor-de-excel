(function () {
  var WHATSAPP_NUMBER = '34641682371';
  window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
  var GCLID_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxaoBbw2PlkY_xuccp8dZBKVOPbK_K1t17ZuWXI9tP58PxXCWDbjWFv06K1UhYc0uK0/exec';
  var TRACK_PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid'];

  function getLeadData() {
    var stored = sessionStorage.getItem('lead_ref');
    var data = null;
    if (stored) {
      try { data = JSON.parse(stored); } catch (e) { data = null; }
    }

    var params = new URLSearchParams(window.location.search);

    if (!data) {
      data = { code: 'EXC-' + Math.floor(100000 + Math.random() * 900000), sent: false };
      TRACK_PARAMS.forEach(function (key) { data[key] = params.get(key) || ''; });
    } else {
      var changed = false;
      TRACK_PARAMS.forEach(function (key) {
        var value = params.get(key);
        if (value && !data[key]) { data[key] = value; changed = true; }
      });
      if (changed) data.sent = false;
    }

    sessionStorage.setItem('lead_ref', JSON.stringify(data));
    return data;
  }

  function sendLeadOnce(data) {
    if (data.sent) return;

    var payload = { code: data.code, page: window.location.pathname };
    TRACK_PARAMS.forEach(function (key) { payload[key] = data[key] || ''; });

    fetch(GCLID_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(payload)
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
