export const clearSpreadSheet=()=> {
  const sheet = getSpreadSheet("schedule");
  sheet?.clear();
}

export const writeSpreadSheet=(array: string[][])=> {
  const sheet = getSpreadSheet("schedule");
  sheet?.getRange(1, 1, array.length, array[0].length).setValues(array);
}

export const getSpreadSheet=(name: string)=> {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName(name);
  if (!sheet) {
    throw new Error(`Sheet ${name} not found.`);
  }
  return sheet;
}
