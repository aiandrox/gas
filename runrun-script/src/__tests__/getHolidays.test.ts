// @ts-nocheck
import { getHolidays } from "../getHolidays";
import { setupGlobalMocks, mockCalendar, mockEvent } from "./mocks/globalMocks";

// テスト前にグローバルモックをセットアップ
beforeEach(() => {
  setupGlobalMocks();
});

// テスト後にグローバルモックをリセット
afterEach(() => {
  resetGlobalMocks();
});

describe("getHolidays.ts", () => {
  describe("getHolidays", () => {
    it("土日を祝日として取得する", () => {
      // テスト用の日付範囲
      const startDate = new Date(2023, 0, 1); // 2023年1月1日（日曜日）
      const endDate = new Date(2023, 0, 7); // 2023年1月7日（土曜日）

      const holidays = getHolidays(startDate, endDate);

      expect(holidays).toEqual([
        { date: new Date(2023, 0, 1), names: ["日"] },
        { date: new Date(2023, 0, 7), names: ["土"] },
      ]);
    });

    it("祝日カレンダーからの祝日を取得する", () => {
      // テスト用の日付範囲
      const startDate = new Date(2023, 0, 2);
      const endDate = new Date(2023, 0, 2);

      // 祝日のモックを設定
      const mockEvents = [
        {
          getStartTime: jest.fn().mockReturnValue(new Date(2023, 0, 2)), // 1月2日
          getTitle: jest.fn().mockReturnValue("元日（振替休日）"),
        },
      ];
      mockCalendar.getEvents.mockReturnValue(mockEvents);

      const holidays = getHolidays(startDate, endDate);

      expect(holidays).toEqual([
        {
          date: new Date(2023, 0, 2),
          names: ["元日（振替休日）"],
        },
      ]);
    });

    it("同じ日に複数の祝日名がある場合は名前を結合する", () => {
      // テスト用の日付範囲
      const startDate = new Date(2023, 0, 1); // 2023年1月1日（日曜日）
      const endDate = new Date(2023, 0, 1);

      // 祝日のモックを設定
      const mockEvents = [
        {
          getStartTime: jest.fn().mockReturnValue(new Date(2023, 0, 1)),
          getTitle: jest.fn().mockReturnValue("元日"),
        },
      ];
      mockCalendar.getEvents.mockReturnValue(mockEvents);

      const holidays = getHolidays(startDate, endDate);

      expect(holidays).toEqual([
        {
          date: new Date(2023, 0, 1),
          names: ["日", "元日"],
        },
      ]);
    });
  });
});
