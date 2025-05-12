// @ts-nocheck
import { calculateVotes } from "../calculateVotes";
import {
  setupGlobalMocks,
  resetGlobalMocks,
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

describe("calculateVotes.ts", () => {
  describe("calculateVotes", () => {
    it("最も投票数の多い日程を選択してSlackに送信する", () => {
      // スプレッドシートの値をモック
      const mockSpreadSheetValues = [
        ["2023/2/5 (日)", "1234567890.123456"],
        ["2023/2/11 (建国記念の日)", "2345678901.234567"],
        ["2023/2/23 (天皇誕生日)", "3456789012.345678"],
      ];
      mockSheet.getDataRange.mockReturnValue(mockSheet);
      mockSheet.getValues.mockReturnValue(mockSpreadSheetValues);

      // リアクションのモック
      mockUrlFetchApp.fetch.mockImplementation((url, options) => {
        if (url.includes("reactions.get")) {
          const timestamp = url.split("timestamp=")[1];
          let responseData = { ok: true, message: { reactions: [] } };

          if (timestamp === "1234567890.123456") {
            responseData = {
              ok: true,
              message: {
                text: "2023/2/5 (日)",
                reactions: [
                  {
                    name: ":raised_hands:",
                    users: ["U12345678", "U87654321"],
                    count: 2,
                  },
                ],
              },
            };
          } else if (timestamp === "2345678901.234567") {
            responseData = {
              ok: true,
              message: {
                text: "2023/2/11 (建国記念の日)",
                reactions: [
                  {
                    name: ":raised_hands:",
                    users: ["U12345678", "U87654321", "U11111111"],
                    count: 3,
                  },
                ],
              },
            };
          } else if (timestamp === "3456789012.345678") {
            responseData = {
              ok: true,
              message: {
                text: "2023/2/23 (天皇誕生日)",
                reactions: [
                  {
                    name: ":raised_hands:",
                    users: ["U12345678"],
                    count: 1,
                  },
                ],
              },
            };
          }

          mockResponse.getContentText.mockReturnValue(JSON.stringify(responseData));
          return mockResponse;
        }
        return mockResponse;
      });

      // 関数を実行
      calculateVotes();

      // 期待される結果
      // 1. スプレッドシートから値を取得したか
      expect(mockSheet.getDataRange).toHaveBeenCalled();
      expect(mockSheet.getValues).toHaveBeenCalled();

      // 2. 各タイムスタンプに対してリアクションを取得したか
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        expect.stringContaining("1234567890.123456"),
        expect.any(Object)
      );
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        expect.stringContaining("2345678901.234567"),
        expect.any(Object)
      );
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        expect.stringContaining("3456789012.345678"),
        expect.any(Object)
      );

      // 3. 最も投票数の多い日程が選択されたか（2023/2/11、3票）
      // 4. Slackにメッセージが送信されたか
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        "https://slack.com/api/chat.postMessage",
        expect.objectContaining({
          payload: expect.stringContaining("2023/2/11 (建国記念の日)"),
        })
      );
    });

    it("投票がない場合は決定できなかった旨のメッセージを送信する", () => {
      // スプレッドシートの値をモック
      const mockSpreadSheetValues = [
        ["2023/2/5 (日)", "1234567890.123456"],
        ["2023/2/11 (建国記念の日)", "2345678901.234567"],
      ];
      mockSheet.getDataRange.mockReturnValue(mockSheet);
      mockSheet.getValues.mockReturnValue(mockSpreadSheetValues);

      // リアクションのモック（投票なし）
      mockUrlFetchApp.fetch.mockImplementation((url, options) => {
        if (url.includes("reactions.get")) {
          const timestamp = url.split("timestamp=")[1];
          let responseData = { ok: true, message: { reactions: [] } };

          if (timestamp === "1234567890.123456" || timestamp === "2345678901.234567") {
            responseData = {
              ok: true,
              message: {
                text:
                  timestamp === "1234567890.123456" ? "2023/2/5 (日)" : "2023/2/11 (建国記念の日)",
                reactions: [],
              },
            };
          }

          mockResponse.getContentText.mockReturnValue(JSON.stringify(responseData));
          return mockResponse;
        }
        return mockResponse;
      });

      // 関数を実行
      calculateVotes();

      // 期待される結果
      // 1. 決定できなかった旨のメッセージが送信されたか
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        "https://slack.com/api/chat.postMessage",
        expect.objectContaining({
          payload: expect.stringContaining("次回の日程は決まりませんでした"),
        })
      );
    });

    it("最大投票数が同じ日程が複数ある場合はランダムに選択する", () => {
      // Math.randomをモック
      const mockMathRandom = jest.spyOn(Math, "random").mockReturnValue(0);

      // スプレッドシートの値をモック
      const mockSpreadSheetValues = [
        ["2023/2/5 (日)", "1234567890.123456"],
        ["2023/2/11 (建国記念の日)", "2345678901.234567"],
      ];
      mockSheet.getDataRange.mockReturnValue(mockSheet);
      mockSheet.getValues.mockReturnValue(mockSpreadSheetValues);

      // リアクションのモック（同数の投票）
      mockUrlFetchApp.fetch.mockImplementation((url, options) => {
        if (url.includes("reactions.get")) {
          const timestamp = url.split("timestamp=")[1];
          let responseData = { ok: true, message: { reactions: [] } };

          if (timestamp === "1234567890.123456") {
            responseData = {
              ok: true,
              message: {
                text: "2023/2/5 (日)",
                reactions: [
                  {
                    name: ":raised_hands:",
                    users: ["U12345678", "U87654321"],
                    count: 2,
                  },
                ],
              },
            };
          } else if (timestamp === "2345678901.234567") {
            responseData = {
              ok: true,
              message: {
                text: "2023/2/11 (建国記念の日)",
                reactions: [
                  {
                    name: ":raised_hands:",
                    users: ["U11111111", "U22222222"],
                    count: 2,
                  },
                ],
              },
            };
          }

          mockResponse.getContentText.mockReturnValue(JSON.stringify(responseData));
          return mockResponse;
        }
        return mockResponse;
      });

      // 関数を実行
      calculateVotes();

      // 期待される結果
      // 1. 最初の日程が選択されたか（Math.randomが0を返すため）
      // 2. ランダム選択の旨が含まれているか
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        "https://slack.com/api/chat.postMessage",
        expect.objectContaining({
          payload: expect.stringContaining("2023/2/5 (日)"),
        })
      );
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        "https://slack.com/api/chat.postMessage",
        expect.objectContaining({
          payload: expect.stringContaining("ユーザ数が同列だった場合は、ランダムで決定します"),
        })
      );

      // モックをリストア
      mockMathRandom.mockRestore();
    });
  });
});
