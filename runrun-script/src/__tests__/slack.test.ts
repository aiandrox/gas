// @ts-nocheck
import { sendSlack, getReactions, stampName } from "../slack";
import {
  setupGlobalMocks,
  resetGlobalMocks,
  mockUrlFetchApp,
  mockResponse,
  mockScriptProperties,
} from "./mocks/globalMocks";

// テスト前にグローバルモックをセットアップ
beforeEach(() => {
  setupGlobalMocks();
});

// テスト後にグローバルモックをリセット
afterEach(() => {
  resetGlobalMocks();
});

describe("slack.ts", () => {
  describe("sendSlack", () => {
    it("Slack APIにメッセージを送信する", () => {
      // モックの設定
      const mockResponseJson = {
        ok: true,
        ts: "1234567890.123456",
      };
      mockResponse.getContentText.mockReturnValue(JSON.stringify(mockResponseJson));

      // 関数を実行
      const message = "テストメッセージ";
      const result = sendSlack(message);

      // 期待される結果
      expect(mockUrlFetchApp.fetch).toHaveBeenCalled();
      expect(mockResponse.getContentText).toHaveBeenCalled();
      expect(result).toEqual(mockResponseJson);

      // 正しいパラメータでAPIが呼ばれたか確認
      const fetchCall = mockUrlFetchApp.fetch.mock.calls[0];
      expect(fetchCall[0]).toBe("https://slack.com/api/chat.postMessage");

      const options = fetchCall[1];
      expect(options.method).toBe("post");
      expect(options.headers.Authorization).toBe("Bearer test-token");
      expect(options.headers["Content-Type"]).toBe("application/json; charset=utf-8");

      const payload = JSON.parse(options.payload);
      expect(payload.channel).toBe("test-channel");
      expect(payload.text).toBe(message);
    });
  });

  describe("getReactions", () => {
    it("Slack APIからリアクション情報を取得する", () => {
      // モックの設定
      const mockResponseJson = {
        ok: true,
        message: {
          type: "message",
          text: "テストメッセージ",
          user: "U12345678",
          ts: "1234567890.123456",
          team: "T12345678",
          reactions: [
            {
              name: stampName.replace(/:/g, ""),
              users: ["U12345678", "U87654321"],
              count: 2,
            },
          ],
          permalink: "https://example.com/permalink",
        },
        channel: "test-channel",
      };
      mockResponse.getContentText.mockReturnValue(JSON.stringify(mockResponseJson));

      // 関数を実行
      const timestamp = "1234567890.123456";
      const result = getReactions(timestamp);

      // 期待される結果
      expect(mockUrlFetchApp.fetch).toHaveBeenCalled();
      expect(mockResponse.getContentText).toHaveBeenCalled();
      expect(result).toEqual(mockResponseJson);

      // 正しいパラメータでAPIが呼ばれたか確認
      const fetchCall = mockUrlFetchApp.fetch.mock.calls[0];
      expect(fetchCall[0]).toBe(
        `https://slack.com/api/reactions.get?channel=test-channel&timestamp=${timestamp}`
      );

      const options = fetchCall[1];
      expect(options.method).toBe("get");
      expect(options.headers.Authorization).toBe("Bearer test-token");
      expect(options.headers["Content-Type"]).toBe("application/json; charset=utf-8");
    });
  });

  describe("stampName", () => {
    it("スタンプ名が正しく定義されている", () => {
      expect(stampName).toBe(":raised_hands:");
    });
  });
});
