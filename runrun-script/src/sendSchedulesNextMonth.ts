import { getDateText } from "./format";
import { sendSlack, stampName } from "./slack";
import { clearSpreadSheet, writeSpreadSheet } from "./spreadSheet";
import { getHolidays } from "./getHolidays";

export const sendSchedulesNextMonth = () => {
  const today = new Date(); // 今日
  const thisMonth = today.getMonth();

  const message = `<!channel>
  次回の勉強会の日程調整を行います。
  参加できる日程に、${stampName} を付けてください。
  期限は${thisMonth + 1}月19日までです。`;

  sendSlack(message);

  const nextBeginningOfMonth = new Date(today.getFullYear(), thisMonth + 1, 1); // 次の月の1日
  const nextEndOfMonth = new Date(today.getFullYear(), thisMonth + 2, 0); // 次の月の最終日
  const holidays = getHolidays(nextBeginningOfMonth, nextEndOfMonth);

  let spreadSheetData: string[][] = [];
  holidays.forEach((holiday) => {
    const response = sendSlack(`[日程] ${getDateText(holiday.date, holiday.names)}`);
    spreadSheetData.push([holiday.date, response.ts.toString()]);
  });

  clearSpreadSheet();
  writeSpreadSheet(spreadSheetData);
};
