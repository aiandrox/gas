function clearSpreadSheet() {
  const sheet = getSpreadSheet('schedule');
  sheet.clear();
}

function writeSpreadSheet(array) {
  const sheet = getSpreadSheet('schedule');
  sheet.getRange(1, 1, array.length, array[0].length).setValues(array);
}

function getSpreadSheet(name) {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadSheet.getSheetByName(name);
}