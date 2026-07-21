(function () {
  var WHATSAPP_NUMBER = '34641682371';
  window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-wa-msg]').forEach(function (el) {
      var msg = el.getAttribute('data-wa-msg');
      var url = 'https://wa.me/' + WHATSAPP_NUMBER;
      if (msg) url += '?text=' + encodeURIComponent(msg);
      el.setAttribute('href', url);
    });
  });
})();
