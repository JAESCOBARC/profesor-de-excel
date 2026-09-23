/**
 * GENERADOR DE CERTIFICADOS — Excel con Jhony
 * =============================================
 * Vive DENTRO de un Google Sheet (Extensiones > Apps Script), no en el repo.
 * Este archivo es la copia de referencia versionada en GitHub.
 *
 * CÓMO INSTALARLO (una sola vez):
 * 1. Crea un Google Sheet nuevo, llámalo "Certificados — Excel con Jhony".
 * 2. En la primera pestaña, pon esta cabecera exacta en la fila 1:
 *    ID | Nombre | Programa | Horas | Fecha | Estado | Enlace PDF
 * 3. En "Programa" usa EXACTAMENTE uno de estos 3 textos (deben coincidir
 *    letra por letra con las claves de TEMARIOS más abajo):
 *    - Preparación Express (Entrevista de trabajo)
 *    - Excel Básico-Intermedio
 *    - Excel Avanzado (Business)
 * 4. Menú Extensiones > Apps Script. Borra el código de ejemplo y pega TODO
 *    este archivo.
 * 5. Ejecuta la función `onOpen` una vez desde el editor (▶) para autorizar
 *    los permisos (Sheets + Drive + acceso externo a internet para el QR).
 * 6. Vuelve al Sheet y recarga la página — aparecerá un menú "Certificados".
 * 7. Rellena una fila (Nombre, Programa, Horas, Fecha) SIN tocar ID/Estado/
 *    Enlace PDF, selecciona esa fila y usa Certificados > Generar
 *    certificado de la fila seleccionada.
 * 8. Para la verificación pública (QR): Implementar > Nueva implementación >
 *    Tipo "Aplicación web" > Ejecutar como "Yo" > Quién tiene acceso
 *    "Cualquier usuario". Copia la URL que te da — esa URL hay que pegarla
 *    en /verificar-certificado/index.html del repo (dímela y la actualizo).
 *
 * Nada de este archivo se ejecuta en el sitio web — es 100% Google Sheets +
 * Apps Script, tal como pediste.
 */

// ============ CONFIG ============
const SHEET_NAME = 'Hoja 1'; // cambia si tu pestaña se llama distinto
const DRIVE_FOLDER_NAME = 'Certificados emitidos — Excel con Jhony';
const COLS = { ID: 1, NOMBRE: 2, PROGRAMA: 3, HORAS: 4, FECHA: 5, ESTADO: 6, PDF: 7 };

// ============ TEMARIOS (fuente única — de los PDFs oficiales) ============
const TEMARIOS = {
  'Preparación Express (Entrevista de trabajo)': [
    { n: '01', titulo: 'Interfaz y navegación', items: ['Cinta de opciones, filas/columnas, hojas, guardar archivos', 'Nombrar rangos (cuadro de nombres)', 'Imprimir archivos'] },
    { n: '02', titulo: 'Atajos de teclado esenciales', items: ['Acciones básicas sobre celdas, filas y columnas', 'Navegación sobre los datos', 'Relleno mágico (Ctrl+E)'] },
    { n: '03', titulo: 'Formatos y tablas', items: ['Formatos de celda: número, porcentajes, decimales, bordes', 'Formatos de tabla (Ctrl+T)', 'Filtros básicos, ordenar mayor/menor', 'Formato condicional', 'Extracción de ficheros CSV (texto en columnas)'] },
    { n: '04', titulo: 'Fórmulas básicas', items: ['Suma, resta, multiplicación, división', 'Promedio, máximo, mínimo, recuento, redondear', 'Mayúsculas / minúsculas, concatenar', 'Referencias absolutas / relativas (F4)'] },
    { n: '05', titulo: 'Fórmulas clave', items: ['SI, Y / O (funciones lógicas), SI.ERROR', 'BUSCARV · BUSCARX', 'SUMAR.SI, CONTAR.SI · TEXTO · Fechas · FILTRAR'] },
    { n: '06', titulo: 'Tablas dinámicas', items: ['Creación de tablas dinámicas', 'Analizar datos con tablas dinámicas', 'Actualizar datos dinámicos'] },
    { n: '07', titulo: 'Gráficos', items: ['Tipos de gráficos y usos', 'Gráficos de 2 ejes', 'Gráficos dinámicos'] },
    { n: '08', titulo: 'Simulacros', items: ['Simulacro de entrevista de trabajo 1', 'Simulacro de entrevista de trabajo 2'] }
  ],
  'Excel Básico-Intermedio': [
    { n: '01', titulo: 'Interfaz y navegación', items: ['Cinta de opciones, filas/columnas, hojas, guardar archivos', 'Nombrar rangos (cuadro de nombres)', 'Imprimir archivos'] },
    { n: '02', titulo: 'Atajos de teclado esenciales', items: ['Acciones básicas sobre celdas, filas y columnas', 'Navegación sobre los datos', 'Relleno mágico (Ctrl+E)'] },
    { n: '03', titulo: 'Formatos y tablas', items: ['Formatos de celda: número, porcentajes, decimales, bordes', 'Filtros básicos, ordenar mayor/menor', 'Validación de datos', 'Extracción de ficheros CSV (texto en columnas)', 'Identificar y eliminar duplicados', 'Filtros de datos avanzados'] },
    { n: '04', titulo: 'Fórmulas básicas', items: ['Suma, resta, multiplicación, división', 'Promedio, máximo, mínimo, recuento, redondear', 'Mayúsculas / minúsculas, concatenar', 'Referencias absolutas / relativas (F4)'] },
    { n: '05', titulo: 'Fórmulas clave', items: ['SI, Y / O (funciones lógicas), SI.ERROR', 'BUSCARV · BUSCARX · BUSCARV avanzado', 'SUMAR.SI, CONTAR.SI · TEXTO · INDIRECTO', 'Fechas · FILTRAR'] },
    { n: '06', titulo: 'Tablas dinámicas avanzadas', items: ['Formatos de tabla (Ctrl+T) · creación de tablas dinámicas', 'Análisis con formatos condicionales y segmentaciones', 'Campos calculados · análisis comparativo', 'Actualización de datos dinámicos'] },
    { n: '07', titulo: 'Gráficos', items: ['Tipos de gráficos y usos · gráficos de 2 ejes', 'Gráficos dinámicos'] },
    { n: '08', titulo: 'Dashboard y seguridad en Excel', items: ['Metodología y construcción de un dashboard', 'Hacer que Excel parezca una app', 'Protección de hojas, rangos y libro'] }
  ],
  'Excel Avanzado (Business)': [
    { n: '01', titulo: 'Interfaz y navegación', items: ['Cinta de opciones, filas/columnas, hojas, guardar archivos', 'Nombrar rangos (cuadro de nombres)', 'Imprimir archivos'] },
    { n: '02', titulo: 'Atajos de teclado esenciales', items: ['Acciones básicas sobre celdas, filas y columnas', 'Navegación sobre los datos', 'Relleno mágico (Ctrl+E)'] },
    { n: '03', titulo: 'Formatos y tablas', items: ['Formatos de celda, validación de datos', 'Extracción de ficheros CSV (texto en columnas)', 'Filtros de datos avanzados'] },
    { n: '04', titulo: 'Fórmulas básicas', items: ['Suma, resta, multiplicación, división, potencia', 'Promedio, máximo, mínimo, k-ésimo, jerarquía', 'Recuento, redondear, concatenar', 'Referencias absolutas / relativas (F4)'] },
    { n: '05', titulo: 'Fórmulas clave', items: ['SI, Y / O, SI.ERROR', 'IZQUIERDA / DERECHA, EXTRAE, ENCONTRAR, SUSTITUIR', 'BUSCARV · BUSCARX · SUMAR.SI · CONTAR.SI', 'TEXTO · Fechas · ÚNICOS · FILTRAR'] },
    { n: '06', titulo: 'Controles y tablas dinámicas avanzadas', items: ['Controles de formulario y ActiveX', 'Creación y análisis con tablas dinámicas (formatos condicionales, segmentaciones)', 'Campos calculados · análisis comparativo'] },
    { n: '07', titulo: 'Gráficos avanzados', items: ['Gráficos de 2 ejes · cascada (Waterfall)', 'Gráfico Real vs. Objetivo', 'Cronogramas (Gantt y Timeline)', 'Gráficos interactivos con control ActiveX · gráficos dinámicos'] },
    { n: '08', titulo: 'Power Query', items: ['Concepto de ETL · importación de datos', 'Limpieza (data clean) · combinar y apilar datos', 'Extraer datos estructurados desde una página web'] },
    { n: '09', titulo: 'Business Analytics', items: ['Análisis de Pareto (80/20)', 'Punto de equilibrio (BreakEven) · CAGR', 'Plantilla de administración de sprints (Agile)'] },
    { n: '10', titulo: 'Dashboard y seguridad', items: ['Metodología y construcción de un dashboard', 'Hacer que Excel parezca una app', 'Protección de hojas, rangos y libro'] },
    { n: '11', titulo: 'IA en Excel', items: ['Integración de ChatGPT y IA en la nube con Excel', 'Framework "Create" para tareas en Excel', 'Automatizaciones con IA'] },
    { n: '12', titulo: 'Power BI', items: ['Construcción de un dashboard en Power BI'] }
  ]
};

// ============ MENÚ ============
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Certificados')
    .addItem('Generar certificado de la fila seleccionada', 'generarCertificadoFilaSeleccionada')
    .addToUi();
}

// ============ GENERAR CERTIFICADO ============
function generarCertificadoFilaSeleccionada() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const row = sheet.getActiveCell().getRow();
  if (row === 1) { ui.alert('Selecciona una fila de datos, no la cabecera.'); return; }

  const nombre = sheet.getRange(row, COLS.NOMBRE).getValue();
  const programa = sheet.getRange(row, COLS.PROGRAMA).getValue();
  const horas = sheet.getRange(row, COLS.HORAS).getValue();
  const fechaRaw = sheet.getRange(row, COLS.FECHA).getValue();

  if (!nombre || !programa || !horas || !fechaRaw) {
    ui.alert('Faltan datos: Nombre, Programa, Horas y Fecha son obligatorios.');
    return;
  }
  if (!TEMARIOS[programa]) {
    ui.alert('El texto de "Programa" no coincide con ninguno de los 3 temarios conocidos:\n\n' + Object.keys(TEMARIOS).join('\n'));
    return;
  }

  let id = sheet.getRange(row, COLS.ID).getValue();
  if (!id) {
    id = 'CERT-' + Utilities.getUuid().replace(/-/g, '').slice(0, 8).toUpperCase();
    sheet.getRange(row, COLS.ID).setValue(id);
  }

  const fecha = Utilities.formatDate(new Date(fechaRaw), 'GMT', 'dd/MM/yyyy');
  const fechaLarga = formatearFechaLarga(new Date(fechaRaw));

  const qrBlob = obtenerQR('https://www.trabajoenexcel.com/verificar-certificado/?id=' + id);
  const html = construirHtmlDiploma({ id, nombre, programa, horas, fechaLarga });

  const pdfBlob = HtmlService.createHtmlOutput(html).getAs('application/pdf').setName(
    'Certificado — ' + nombre + ' — ' + id + '.pdf'
  );

  const folder = obtenerCarpetaDrive();
  const file = folder.createFile(pdfBlob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  sheet.getRange(row, COLS.ESTADO).setValue('Emitido');
  sheet.getRange(row, COLS.PDF).setValue(file.getUrl());

  ui.alert('Certificado generado: ' + id + '\n\nPDF: ' + file.getUrl());
}

function obtenerCarpetaDrive() {
  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

function obtenerQR(data) {
  const url = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=0a2e1a&bgcolor=faf8f3&data=' + encodeURIComponent(data);
  return UrlFetchApp.fetch(url).getBlob();
}

function formatearFechaLarga(date) {
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return date.getDate() + ' de ' + meses[date.getMonth()] + ' de ' + date.getFullYear();
}

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

// ============ VERIFICACIÓN PÚBLICA (Web App — usado por /verificar-certificado/) ============
function doGet(e) {
  const id = e.parameter.id;
  const output = { valido: false };

  if (id) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][COLS.ID - 1] === id && data[i][COLS.ESTADO - 1] === 'Emitido') {
        output.valido = true;
        output.nombre = data[i][COLS.NOMBRE - 1];
        output.programa = data[i][COLS.PROGRAMA - 1];
        output.horas = data[i][COLS.HORAS - 1];
        output.fecha = Utilities.formatDate(new Date(data[i][COLS.FECHA - 1]), 'GMT', 'dd/MM/yyyy');
        break;
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
