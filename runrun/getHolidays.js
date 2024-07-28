function getHolidays(startDate, endDate) {
  let holidays = [];

  // 土日を追加
  for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
    if (day.getDay() === 0 || day.getDay() === 6) { // 0: Sunday, 6: Saturday
      dayName = day.getDay() === 0 ? '日' : '土';
      holidays.push({ date: new Date(day), names: [dayName] });
    }
  }

  // 日本の祝日カレンダーで祝日を追加
  const holidayCalendarId = 'ja.japanese#holiday@group.v.calendar.google.com';
  const calendar = CalendarApp.getCalendarById(holidayCalendarId);
  const events = calendar.getEvents(startDate, endDate);
  for (let i in events) {
    date = events[i].getStartTime();
    title = events[i].getTitle();
    const existingHoliday = holidays.find(holiday => holiday.date.getTime() === date.getTime());
    if (existingHoliday) {
      existingHoliday.names.push(title);
    } else {
      holidays.push({ date: date, names: [title] });
    }
  }

  return holidays.sort((a, b) => a.date - b.date);
}