(function () {
  window.PLANES = {
    hora1: { id: 'hora1', horas: 1, precioHora: 25, total: null },
    bono5: { id: 'bono5', horas: 5, precioHora: 20, total: 100, descuento: 20 },
    // El id 'bono10' se mantiene por compatibilidad (test de nivel, Google Sheet); el plan actual es de 15 horas.
    bono10: { id: 'bono10', horas: 15, precioHora: 18, total: 270, descuento: 28 }
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
