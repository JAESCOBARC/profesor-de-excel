// ============ HTML DEL DIPLOMA (mismo diseño que certificado/plantilla-diploma.html) ============
function construirHtmlDiploma(datos) {
  const qrBlob = obtenerQR('https://www.trabajoenexcel.com/verificar-certificado/?id=' + datos.id);
  const qrB64 = Utilities.base64Encode(qrBlob.getBytes());
  const modulos = TEMARIOS[datos.programa];
  const mitad = Math.ceil(modulos.length / 2);
  const col1 = modulos.slice(0, mitad);
  const col2 = modulos.slice(mitad);

  function renderModulo(m) {
    return '<div class="modulo"><div class="num-titulo"><span class="n">' + m.n + '</span> ' + m.titulo + '</div>' +
      '<ul>' + m.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>';
  }

  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;700&display=swap">' +
    '<style>' +
    '@page{size:A4 landscape;margin:0}*{box-sizing:border-box;margin:0;padding:0}' +
    ':root{--green-deep:#0a2e1a;--green-mid:#1a5c36;--green-light:#4db87a;--green-pale:#d4f0e0;--cream:#faf8f3;--gold:#c9a84c;--muted:#6b6b6b}' +
    'body{font-family:"DM Sans",sans-serif;background:#e8e5db}' +
    '.page{width:297mm;height:210mm;margin:0 auto;position:relative;background:var(--cream);page-break-after:always}' +
    '.page:last-child{page-break-after:auto}' +
    '.diploma{padding:14mm;height:100%}' +
    '.frame{position:absolute;inset:8mm;border:1.5px solid var(--gold);border-radius:4px}' +
    '.frame::before{content:"";position:absolute;inset:5px;border:1px solid rgba(201,168,76,0.4);border-radius:2px}' +
    '.content{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;padding:16mm 24mm 10mm}' +
    '.mark{width:15mm;height:15mm;border-radius:6px;background:var(--green-deep);color:#fff;display:flex;align-items:center;justify-content:center;font-family:"Fraunces",serif;font-weight:700;font-size:15pt;margin-bottom:6mm}' +
    '.eyebrow{font-size:8.5pt;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:4mm}' +
    'h1{font-family:"Fraunces",serif;font-weight:300;font-size:25pt;color:var(--green-deep);margin-bottom:8mm}' +
    '.otorga{font-size:10pt;color:var(--muted);margin-bottom:3mm}' +
    '.nombre{font-family:"Fraunces",serif;font-style:italic;font-size:27pt;color:var(--green-deep);border-bottom:1px solid var(--green-pale);padding:0 6mm 3mm;margin-bottom:8mm;min-width:140mm}' +
    '.cuerpo{font-size:10.5pt;color:#2a2a2a;line-height:1.7;max-width:190mm;margin-bottom:6mm}' +
    '.cuerpo strong{color:var(--green-deep)}.programa{font-family:"Fraunces",serif;font-size:13pt;color:var(--green-mid)}' +
    '.anexo-hint{font-size:8.5pt;color:var(--muted);font-style:italic;margin-bottom:auto}' +
    '.footer-row{width:100%;display:flex;align-items:flex-end;justify-content:space-between;margin-top:8mm;padding-top:6mm}' +
    '.firma{text-align:left}.firma .linea{width:55mm;border-top:1px solid #999;margin-bottom:2mm}' +
    '.firma .nombre-f{font-family:"Fraunces",serif;font-size:11pt;color:var(--green-deep)}.firma .cargo{font-size:7.5pt;color:var(--muted)}' +
    '.fecha-id{text-align:center}.fecha-id .fecha{font-size:9pt;color:#2a2a2a;margin-bottom:1mm}' +
    '.fecha-id .id{font-size:7.5pt;color:var(--muted);letter-spacing:0.5px}' +
    '.qr-block{text-align:right;display:flex;flex-direction:column;align-items:center;gap:1.5mm}' +
    '.qr-block img{width:20mm;height:20mm}.qr-block span{font-size:6.8pt;color:var(--muted);max-width:24mm}' +
    '.anexo{padding:12mm 18mm;height:100%;display:flex;flex-direction:column}' +
    '.anexo-header{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid var(--green-deep);padding-bottom:4mm;margin-bottom:6mm}' +
    '.anexo-header .titulo{font-family:"Fraunces",serif;font-size:15pt;color:var(--green-deep)}' +
    '.anexo-header .titulo span{color:var(--gold);font-weight:700;font-size:8pt;letter-spacing:2px;text-transform:uppercase;display:block;margin-bottom:1mm}' +
    '.anexo-header .meta{text-align:right;font-size:8pt;color:var(--muted)}' +
    '.anexo-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 14mm;flex:1}' +
    '.modulo{break-inside:avoid;margin-bottom:4.5mm}' +
    '.modulo .num-titulo{display:flex;align-items:baseline;gap:2mm;font-family:"Fraunces",serif;font-size:10pt;color:var(--green-mid);margin-bottom:1.5mm;font-weight:600}' +
    '.modulo .num-titulo .n{color:var(--gold);font-size:8pt}' +
    '.modulo ul{list-style:none;padding-left:4mm}' +
    '.modulo li{font-size:8.3pt;color:#333;line-height:1.55;position:relative;padding-left:3.5mm}' +
    '.modulo li::before{content:"·";position:absolute;left:0;color:var(--green-light);font-weight:700}' +
    '.anexo-footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--green-pale);padding-top:3mm;margin-top:3mm;font-size:7.5pt;color:var(--muted)}' +
    '</style></head><body>' +
    '<div class="page"><div class="diploma"><div class="frame"></div><div class="content">' +
    '<div class="mark">PE</div><div class="eyebrow">Certificado de Formación</div><h1>Excel con Jhony</h1>' +
    '<div class="otorga">Se otorga el presente certificado a</div>' +
    '<div class="nombre">' + datos.nombre + '</div>' +
    '<div class="cuerpo">por haber completado satisfactoriamente el programa <span class="programa">' + datos.programa + '</span>, ' +
    'con una intensidad horaria de <strong>' + datos.horas + ' horas</strong> de formación online personalizada 1:1, ' +
    'impartidas por Jhony Alberto Escobar Castro, Microsoft Excel Expert certificado.</div>' +
    '<div class="anexo-hint">El temario completo cursado se detalla en el anexo de la página siguiente.</div>' +
    '<div class="footer-row"><div class="firma"><div class="linea"></div>' +
    '<div class="nombre-f">Jhony Alberto Escobar Castro</div><div class="cargo">Microsoft Excel Expert · trabajoenexcel.com</div></div>' +
    '<div class="fecha-id"><div class="fecha">Granada, España — ' + datos.fechaLarga + '</div><div class="id">ID de certificado: ' + datos.id + '</div></div>' +
    '<div class="qr-block"><img src="data:image/png;base64,' + qrB64 + '" alt="QR de verificación">' +
    '<span>Verificar en trabajoenexcel.com/verificar-certificado</span></div>' +
    '</div></div></div></div>' +
    '<div class="page"><div class="anexo"><div class="anexo-header">' +
    '<div class="titulo"><span>Anexo — Excel con Jhony</span>Temario completo cursado</div>' +
    '<div class="meta">' + datos.nombre + ' · ' + datos.programa + '<br>ID de certificado: ' + datos.id + '</div>' +
    '</div><div class="anexo-grid"><div>' + col1.map(renderModulo).join('') + '</div><div>' + col2.map(renderModulo).join('') + '</div></div>' +
    '<div class="anexo-footer"><span>trabajoenexcel.com</span><span>Documento generado automáticamente — válido sin firma manuscrita en esta página</span></div>' +
    '</div></div>' +
    '</body></html>';
}

