// @ts-nocheck
import { sendSchedulesNextMonth } from "../sendSchedulesNextMonth";
import {
  setupGlobalMocks,
  resetGlobalMocks,
  mockCalendar,
  mockEvent,
  mockSheet,
  mockUrlFetchApp,
  mockResponse,
} from "./mocks/globalMocks";

// テスト前にグローバルモックをセットアップ
beforeEach(() => {
  setupGlobalMocks();
});

// テスト後にグローバルモックをリセット
afterEach(() => {
  resetGlobalMocks();
});

describe("sendSchedulesNextMonth.ts", () => {
  describe("sendSchedulesNextMonth", () => {
    it("次の月の祝日を取得してSlackに送信し、スプレッドシートに記録する", () => {
      // 日付をモック
      const realDate = Date;
      const mockDate = new Date(2023, 0, 15); // 2023年1月15日
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return mockDate;
          }
          return new realDate(...args);
        }
      };

      // カレンダーイベントのモック
      const mockEvents = [
        { getStartTime: () => new Date(2023, 1, 5), getTitle: () => "日曜日" },
        { getStartTime: () => new Date(2023, 1, 11), getTitle: () => "建国記念の日" },
        { getStartTime: () => new Date(2023, 1, 12), getTitle: () => "日曜日" },
        { getStartTime: () => new Date(2023, 1, 19), getTitle: () => "日曜日" },
        { getStartTime: () => new Date(2023, 1, 23), getTitle: () => "天皇誕生日" },
        { getStartTime: () => new Date(2023, 1, 26), getTitle: () => "日曜日" },
      ];

      mockCalendar.getEvents.mockReturnValue(mockEvents);
      mockEvents.forEach((event, index) => {
        const mockEventObj = { ...mockEvent };
        mockEventObj.getStartTime.mockReturnValue(event.getStartTime());
        mockEventObj.getTitle.mockReturnValue(event.getTitle());
        mockEvents[index] = mockEventObj;
      });

      // Slackレスポンスのモック
      mockResponse.getContentText.mockImplementation(() => {
        return JSON.stringify({ ok: true, ts: "1234567890.123456" });
      });

      // 関数を実行
      sendSchedulesNextMonth();

      // 期待される結果
      // 1. 初期メッセージがSlackに送信されたか
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        "https://slack.com/api/chat.postMessage",
        expect.objectContaining({
          payload: expect.stringContaining("<!channel>"),
        })
      );
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        "https://slack.com/api/chat.postMessage",
        expect.objectContaining({
          payload: expect.stringContaining("次回の勉強会の日程調整"),
        })
      );
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        "https://slack.com/api/chat.postMessage",
        expect.objectContaining({
          payload: expect.stringContaining(":raised_hands:"),
        })
      );
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        "https://slack.com/api/chat.postMessage",
        expect.objectContaining({
          payload: expect.stringContaining("期限は1月19日まで"),
        })
      );

      // 2. 各祝日がSlackに送信されたか
      mockEvents.forEach((event) => {
        const date = event.getStartTime();
        const dateText = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
          "https://slack.com/api/chat.postMessage",
          expect.objectContaining({
            payload: expect.stringContaining(dateText),
          })
        );
      });

      // 3. スプレッドシートがクリアされたか
      expect(mockSheet.clear).toHaveBeenCalled();

      // 4. スプレッドシートにデータが書き込まれたか
      expect(mockSheet.getRange).toHaveBeenCalled();
      expect(mockSheet.setValues).toHaveBeenCalled();

      // グローバルDateをリストア
      global.Date = realDate;
    });
  });
});
