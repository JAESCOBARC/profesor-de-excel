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

