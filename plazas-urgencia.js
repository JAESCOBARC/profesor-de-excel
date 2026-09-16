(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var emoji = document.getElementById('urgencyEmoji');
    var text = document.getElementById('urgencyText');
    if (!emoji || !text) return;

    var day = new Date().getDate();
    if (day >= 1 && day <= 15) {
      emoji.textContent = '🟢';
      text.textContent = 'Plazas Disponibles';
    } else {
      emoji.textContent = '🟡';
      text.textContent = 'Últimas Plazas';
    }
  });
})();
