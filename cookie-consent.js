(function () {
  // Google Consent Mode v2 — defaults sincrónicos, antes de que cargue cualquier tag
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }

  var stored = null;
  try { stored = localStorage.getItem('cookieConsent'); } catch (e) {}
  var granted = stored === 'all';

  gtag('consent', 'default', {
    analytics_storage:   granted ? 'granted' : 'denied',
    ad_storage:          granted ? 'granted' : 'denied',
    ad_user_data:        granted ? 'granted' : 'denied',
    ad_personalization:  granted ? 'granted' : 'denied',
    wait_for_update: 500
  });

  if (stored) return; // ya eligió, no mostrar banner

  // Banner UI — espera al DOM
  document.addEventListener('DOMContentLoaded', function () {
    var style = document.createElement('style');
    style.textContent = [
      '#ck-banner{',
        'position:fixed;bottom:0;left:0;right:0;z-index:9999;',
        'background:#0a2e1a;color:#fff;',
        'padding:1rem 5%;',
        'display:flex;align-items:center;justify-content:space-between;gap:1.5rem;',
        'font-family:"DM Sans",sans-serif;font-size:0.875rem;line-height:1.5;',
        'box-shadow:0 -2px 24px rgba(0,0,0,0.25);',
        'transform:translateY(100%);transition:transform 0.35s ease;',
      '}',
      '#ck-banner.ck-visible{transform:translateY(0);}',
      '#ck-banner p{margin:0;color:rgba(255,255,255,0.85);flex:1;}',
      '.ck-actions{display:flex;gap:0.75rem;flex-shrink:0;}',
      '#ck-essential{',
        'background:transparent;border:1px solid rgba(255,255,255,0.3);',
        'color:rgba(255,255,255,0.8);padding:8px 18px;border-radius:100px;',
        'font-family:"DM Sans",sans-serif;font-size:0.85rem;cursor:pointer;',
        'transition:border-color 0.2s,color 0.2s;',
      '}',
      '#ck-essential:hover{border-color:rgba(255,255,255,0.6);color:#fff;}',
      '#ck-accept{',
        'background:#c9a84c;border:none;color:#0a2e1a;',
        'padding:8px 20px;border-radius:100px;',
        'font-family:"DM Sans",sans-serif;font-size:0.85rem;font-weight:500;',
        'cursor:pointer;transition:background 0.2s;',
      '}',
      '#ck-accept:hover{background:#d4b968;}',
      '@media(max-width:600px){',
        '#ck-banner{flex-direction:row;align-items:center;padding:0.65rem 4%;gap:0.75rem;}',
        '#ck-banner p{font-size:0.78rem;line-height:1.3;}',
        '.ck-actions{flex-shrink:0;gap:0.5rem;}',
        '#ck-essential{padding:6px 10px;font-size:0.75rem;}',
        '#ck-accept{padding:6px 12px;font-size:0.75rem;}',
      '}'
    ].join('');
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'ck-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML =
      '<p>Usamos cookies propias y de Google Ads para mostrarte publicidad relevante. <a href="/politica-privacidad.html" style="color:inherit;text-decoration:underline;">Más información</a>.</p>' +
      '<div class="ck-actions">' +
        '<button id="ck-essential">Solo esenciales</button>' +
        '<button id="ck-accept">Aceptar todo</button>' +
      '</div>';
    document.body.appendChild(banner);

    setTimeout(function () {
      requestAnimationFrame(function () { banner.classList.add('ck-visible'); });
    }, 3500);

    function applyConsent(choice) {
      try { localStorage.setItem('cookieConsent', choice); } catch (e) {}
      var ok = choice === 'all';
      gtag('consent', 'update', {
        analytics_storage:  ok ? 'granted' : 'denied',
        ad_storage:         ok ? 'granted' : 'denied',
        ad_user_data:       ok ? 'granted' : 'denied',
        ad_personalization: ok ? 'granted' : 'denied'
      });
      banner.style.transform = 'translateY(100%)';
      setTimeout(function () { banner.remove(); }, 350);
    }

    document.getElementById('ck-accept').addEventListener('click', function () {
      applyConsent('all');
    });
    document.getElementById('ck-essential').addEventListener('click', function () {
      applyConsent('essential');
    });
  });
})();
