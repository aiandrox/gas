function sendSchedulesNextMonth() {
  const today = new Date(); // 今日
  const thisMonth = today.getMonth();

  message = `<!channel>
  次回の勉強会の日程調整を行います。
  参加できる日程に、:raised_hands: を付けてください。
  期限は${thisMonth + 1}月19日までです。`
  sendSlack(message);

  const nextBeginningOfMonth = new Date(today.getFullYear(), thisMonth + 1, 1); // 次の月の1日
  const nextEndOfMonth = new Date(today.getFullYear(), thisMonth + 2, 0); // 次の次の月の最終日
  const holidays = getHolidays(nextBeginningOfMonth, nextEndOfMonth);
  
  let spreadSheetData = []
  holiday = holidays[0]
  holidays.forEach((holiday) => {
    const response = sendSlack(`[日程] ${getDateText(holiday.date, holiday.names)}`);
    spreadSheetData.push([holiday.date, response.ts.toString()]);
  });

  clearSpreadSheet();
  writeSpreadSheet(spreadSheetData);
}

function calculateVotes() {
  const scheduleSheet = getSpreadSheet('schedule');
  const shedules = scheduleSheet.getDataRange().getValues();
  let messages = []
  shedules.forEach((shedule) => {
    timestamp = shedule[1];
    const response = getReactions(timestamp);
    messages.push(response.message);
  });

  const formattedMessages = formatted(messages);
  const selected = selectedDate(formattedMessages);
  const message = `<!channel>
  次回の日程は「${selected.text}」に決定しました。
  ※ユーザ数が同列だった場合は、ランダムで決定します。

  参加者は ${getSlackUsersMention(selected.users)}
  幹事は ${getSlackUserMention(selected.representative)} です。
  幹事は場所の確保と連絡お願いします。`
  sendSlack(message);
}

