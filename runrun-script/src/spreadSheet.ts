const spreadSheetName = "Schedule";

export const clearSpreadSheet = () => {
  const sheet = getSpreadSheet(spreadSheetName);
  sheet?.clear();
};

export const writeSpreadSheet = (array: string[][]) => {
  const sheet = getSpreadSheet(spreadSheetName);
  sheet?.getRange(1, 1, array.length, array[0].length).setValues(array);
};

export const getSpreadSheetValues = () => {
  const sheet = getSpreadSheet(spreadSheetName);
  return sheet.getDataRange().getValues();
};

const getSpreadSheet = (name: string) => {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName(name);
  if (!sheet) {
    throw new Error(`Sheet ${name} not found.`);
  }
  return sheet;
};
