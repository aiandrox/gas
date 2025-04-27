// Google Apps Script のグローバルオブジェクトをモック

// SpreadsheetApp のモック
export const mockSpreadsheetApp = {
  getActiveSpreadsheet: jest.fn(),
};

// シートのモック
export const mockSheet = {
  clear: jest.fn(),
  getRange: jest.fn(),
  getDataRange: jest.fn(),
  getValues: jest.fn(),
  setValues: jest.fn(),
};

// スプレッドシートのモック
export const mockSpreadsheet = {
  getSheetByName: jest.fn(),
};

// CalendarApp のモック
export const mockCalendarApp = {
  getCalendarById: jest.fn(),
};

// カレンダーのモック
export const mockCalendar = {
  getEvents: jest.fn(),
};

// イベントのモック
export const mockEvent = {
  getStartTime: jest.fn(),
  getTitle: jest.fn(),
};

// UrlFetchApp のモック
export const mockUrlFetchApp = {
  fetch: jest.fn(),
};

// レスポンスのモック
export const mockResponse = {
  getContentText: jest.fn(),
};

// PropertiesService のモック
export const mockPropertiesService = {
  getScriptProperties: jest.fn(),
};

// スクリプトプロパティのモック
export const mockScriptProperties = {
  getProperty: jest.fn(),
};

// グローバルオブジェクトの設定
global.SpreadsheetApp = mockSpreadsheetApp as any;
global.CalendarApp = mockCalendarApp as any;
global.UrlFetchApp = mockUrlFetchApp as any;
global.PropertiesService = mockPropertiesService as any;
global.console = {
  log: jest.fn(),
} as any;

// テスト用のセットアップ関数
export const setupGlobalMocks = () => {
  // SpreadsheetApp のセットアップ
  mockSpreadsheetApp.getActiveSpreadsheet.mockReturnValue(mockSpreadsheet);
  mockSpreadsheet.getSheetByName.mockReturnValue(mockSheet);
  mockSheet.getRange.mockReturnValue(mockSheet);
  mockSheet.getDataRange.mockReturnValue(mockSheet);
  mockSheet.getValues.mockReturnValue([]);

  // CalendarApp のセットアップ
  mockCalendarApp.getCalendarById.mockReturnValue(mockCalendar);
  mockCalendar.getEvents.mockReturnValue([]);

  // UrlFetchApp のセットアップ
  mockUrlFetchApp.fetch.mockReturnValue(mockResponse);
  mockResponse.getContentText.mockReturnValue('{"ok": true}');

  // PropertiesService のセットアップ
  mockPropertiesService.getScriptProperties.mockReturnValue(mockScriptProperties);
  mockScriptProperties.getProperty.mockImplementation((key: string) => {
    if (key === "SLACK_CHANNEL_ID") return "test-channel";
    if (key === "SLACK_BOT_USER_OAUTH_TOKEN") return "test-token";
    return null;
  });
};

// テスト後のクリーンアップ関数
export const resetGlobalMocks = () => {
  jest.clearAllMocks();
};
