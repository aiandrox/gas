// @ts-nocheck
import { clearSpreadSheet, writeSpreadSheet, getSpreadSheetValues } from "../spreadSheet";
import { setupGlobalMocks, resetGlobalMocks, mockSheet } from "./mocks/globalMocks";

// テスト前にグローバルモックをセットアップ
beforeEach(() => {
  setupGlobalMocks();
});

// テスト後にグローバルモックをリセット
afterEach(() => {
  resetGlobalMocks();
});

describe("spreadSheet.ts", () => {
  describe("clearSpreadSheet", () => {
    it("シートのclearメソッドを呼び出す", () => {
      clearSpreadSheet();

      expect(mockSheet.clear).toHaveBeenCalled();
    });
  });

  describe("writeSpreadSheet", () => {
    it("シートのgetRangeメソッドとsetValuesメソッドを呼び出す", () => {
      // テスト用のデータ
      const data = [
        ["2023/1/1", "1234567890.123456"],
        ["2023/1/2", "2345678901.234567"],
      ];

      writeSpreadSheet(data);

      expect(mockSheet.getRange).toHaveBeenCalledWith(1, 1, data.length, data[0].length);
      expect(mockSheet.setValues).toHaveBeenCalledWith(data);
    });

    it("空の配列の場合はエラーにならない", () => {
      const data: string[][] = [[]];

      expect(() => writeSpreadSheet(data)).not.toThrow();
    });
  });

  describe("getSpreadSheetValues", () => {
    it("シートのgetDataRangeメソッドとgetValuesメソッドを呼び出す", () => {
      const mockData = [
        ["2023/1/1", "1234567890.123456"],
        ["2023/1/2", "2345678901.234567"],
      ];
      mockSheet.getValues.mockReturnValue(mockData);

      const result = getSpreadSheetValues();

      expect(mockSheet.getDataRange).toHaveBeenCalled();
      expect(mockSheet.getValues).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });
});
