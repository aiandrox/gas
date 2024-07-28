// 日本の祝日カレンダーで祝日を追加
const holidayCalendarId = "ja.japanese#holiday@group.v.calendar.google.com";

type Holiday = {
  date: GoogleAppsScript.Base.Date;
  names: string[];
};

export function getHolidays(startDate: Date, endDate: Date) {
  let holidays: Holiday[] = [];

  // 土日を追加
  for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
    if (day.getDay() === 0 || day.getDay() === 6) {
      // 0: Sunday, 6: Saturday
      const dayName = day.getDay() === 0 ? "日" : "土";
      holidays.push({ date: new Date(day), names: [dayName] });
    }
  }

  const events = getHolidaysFromGoogleCalendar(startDate, endDate);
  for (let i in events) {
    const date = events[i].getStartTime();
    const title = events[i].getTitle();
    const existingHoliday = holidays.find((holiday) => holiday.date.getTime() === date.getTime());
    if (existingHoliday) {
      existingHoliday.names.push(title);
    } else {
      holidays.push({ date: date, names: [title] });
    }
  }

  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

const getHolidaysFromGoogleCalendar = (startDate: Date, endDate: Date) => {
  const calendar = CalendarApp.getCalendarById(holidayCalendarId);
  const events = calendar.getEvents(startDate, endDate);
  return events;
};
