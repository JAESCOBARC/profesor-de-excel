(function () {
  window.PLANES = {
    hora1: { id: 'hora1', label: '1 hora', horas: 1, precioHora: 20, total: null, desc: 'Sesión suelta, sin compromiso' },
    bono5: { id: 'bono5', label: 'Bono 5 horas', horas: 5, precioHora: 18, total: 90, descuento: 10, desc: 'Ideal para aprender a tu ritmo' },
    bono10: { id: 'bono10', label: 'Bono 10 horas o más', horas: 10, precioHora: 16.5, total: 165, descuento: 17, desc: 'Para formaciones completas o equipos' }
  };

  function fmtPrecio(n) {
    return String(n).replace('.', ',');
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
        case 'label': value = plan.label; break;
        case 'descuento': value = plan.descuento || ''; break;
        case 'desc': value = plan.desc || ''; break;
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
