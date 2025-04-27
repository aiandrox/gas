// @ts-nocheck
import { getDateText, getSlackUserMention, getSlackUsersMention } from "../format";
import { setupGlobalMocks, resetGlobalMocks } from "./mocks/globalMocks";

// テスト前にグローバルモックをセットアップ
beforeEach(() => {
  setupGlobalMocks();
});

// テスト後にグローバルモックをリセット
afterEach(() => {
  resetGlobalMocks();
});

describe("format.ts", () => {
  describe("getDateText", () => {
    it("日付と祝日名を正しく整形する", () => {
      const date = new Date(2023, 0, 1); // 2023年1月1日

      expect(getDateText(date, ["日"])).toBe("2023/1/1 (日)");
      expect(getDateText(date, ["日", "元日"])).toBe("2023/1/1 (日 / 元日)");
    });
  });

  describe("getSlackUserMention", () => {
    it("ユーザーIDを正しくメンション形式に変換する", () => {
      const userId = "U12345678";

      const result = getSlackUserMention(userId);

      expect(result).toBe("<@U12345678>");
    });
  });

  describe("getSlackUsersMention", () => {
    it("複数のユーザーIDを正しくメンション形式に変換する", () => {
      const userIds = ["U12345678", "U87654321"];

      const result = getSlackUsersMention(userIds);

      expect(result).toBe("<@U12345678> <@U87654321>");
    });

    it("空の配列の場合は空文字列を返す", () => {
      const userIds: string[] = [];

      const result = getSlackUsersMention(userIds);

      expect(result).toBe("");
    });
  });
});
