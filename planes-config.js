(function () {
  window.PLANES = {
    hora1: { id: 'hora1', horas: 1, precioHora: 20, total: null },
    bono5: { id: 'bono5', horas: 5, precioHora: 18, total: 90, descuento: 10 },
    bono10: { id: 'bono10', horas: 10, precioHora: 16.5, total: 165, descuento: 17 }
  };

  function fmtPrecio(n) {
    var str = Number.isInteger(n) ? String(n) : n.toFixed(2);
    return str.replace('.', ',');
  }

  function render() {
    document.querySelectorAll('[data-plan]').forEach(function (el) {
      var plan = window.PLANES[el.getAttribute('data-plan')];
      if (!plan) return;
      var field = el.getAttribute('data-plan-field');
      var value;
      switch (field) {
        case 'precioHora': value = fmtPrecio(plan.precioHora) + '€'; break;
        case 'precioHoraNum': value = fmtPrecio(plan.precioHora); break;
        case 'total': value = plan.total ? fmtPrecio(plan.total) + '€' : ''; break;
        case 'totalNum': value = plan.total ? fmtPrecio(plan.total) : ''; break;
        case 'horas': value = plan.horas; break;
        case 'descuento': value = plan.descuento || ''; break;
        default: value = '';
      }
      el.textContent = value;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
