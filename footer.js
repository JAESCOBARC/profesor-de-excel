/* Footer único y compartido por todas las páginas de trabajoenexcel.com.
   Cualquier cambio aquí se aplica de inmediato a todas las páginas que cargan este script. */
(function () {
  var STYLE = '\
<style>\
  .site-footer { background: var(--green-deep, #0a2e1a); padding: 2.5rem 5%; border-top: 1px solid rgba(255,255,255,0.05); }\
  .site-footer .footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; max-width: 1100px; margin: 0 auto; }\
  .site-footer .footer-logo { font-family: "Fraunces", serif; color: white; font-size: 1rem; font-weight: 400; }\
  .site-footer .footer-logo-email { font-size: 0.78rem; font-weight: 400; color: rgba(255,255,255,0.45); margin-top: 4px; }\
  .site-footer .footer-links { display: flex; gap: 2rem; flex-wrap: wrap; }\
  .site-footer .footer-links a { font-size: 0.82rem; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }\
  .site-footer .footer-links a:hover { color: white; }\
  .site-footer .footer-social { display: flex; gap: 1.25rem; align-items: center; }\
  .site-footer .social-link { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }\
  .site-footer .social-link:hover { color: white; }\
  .site-footer .footer-copy { font-size: 0.78rem; color: rgba(255,255,255,0.35); width: 100%; text-align: center; margin-top: 1rem; }\
  .site-footer .footer-copy a { color: rgba(255,255,255,0.55); text-decoration: none; }\
  .site-footer .footer-copy a:hover { text-decoration: underline; }\
  @media (max-width: 768px) {\
    .site-footer .footer-inner { flex-direction: column; align-items: center; text-align: center; gap: 1.5rem; }\
    .site-footer .footer-logo { text-align: center; }\
    .site-footer .footer-links { flex-wrap: wrap; gap: 1rem; justify-content: center; }\
    .site-footer .footer-social { flex-wrap: wrap; gap: 1rem; justify-content: center; }\
  }\
</style>';

  var HTML = '\
<footer class="site-footer">\
  <div class="footer-inner">\
    <div class="footer-logo">\
      Excel con Jhony\
      <div class="footer-logo-email">jhonya2000@gmail.com</div>\
    </div>\
    <div class="footer-links">\
      <a href="/niveles/">Niveles Excel</a>\
      <a href="/jhony-profesor-excel-online.html">Sobre mí</a>\
      <a href="/certificacion-microsoft-excel-especialista.html">Certificación</a>\
      <a href="/test-nivel-excel.html">Test de nivel</a>\
      <a href="/pagos/">Pagos</a>\
    </div>\
    <div class="footer-social">\
      <a href="https://www.linkedin.com/in/jaescobarc/" target="_blank" rel="noopener" class="social-link">\
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>\
        LinkedIn\
      </a>\
      <a href="https://www.superprof.es/clases-excel-particulares-desde-basico-avanzado-profesor-certificado-resultados-garantizados.html" target="_blank" rel="noopener" class="social-link">\
        ⭐ Superprof\
      </a>\
    </div>\
    <div class="footer-copy">\
      © 2026 · Clases de Excel online particulares · España · trabajoenexcel.com · <a href="/aviso-legal.html">Aviso Legal</a> · <a href="/politica-privacidad.html">Privacidad</a>\
    </div>\
  </div>\
</footer>';

  document.write(STYLE + HTML);
})();
