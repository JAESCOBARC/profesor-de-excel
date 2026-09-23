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
