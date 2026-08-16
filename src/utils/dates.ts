// src/utils/dates.ts

// The internationally-recognised Gregorian calendar start date. Dates before
// this are treated as Julian calendar dates, matching standard software
// convention (this is also what PostgreSQL, SQLite, and most JDN converters
// use). Note this is NOT the British switch date (which was 1752-09-14) -
// England, Scotland, Wales and the colonies kept using the Julian calendar
// for another 170 years after most of Catholic Europe switched.
const GREGORIAN_START_YEAR = 1582;
const GREGORIAN_START_MONTH = 10;
const GREGORIAN_START_DAY = 15;

function isGregorian(year: number, month: number, day: number): boolean {
  if (year !== GREGORIAN_START_YEAR) return year > GREGORIAN_START_YEAR;
  if (month !== GREGORIAN_START_MONTH) return month > GREGORIAN_START_MONTH;
  return day >= GREGORIAN_START_DAY;
}

// Julian Day Number, per Meeus "Astronomical Algorithms" ch. 7. Unlike
// Zeller's Congruence (which only implements the Gregorian calendar), this
// selects the Julian or Gregorian leap-year rule based on the date itself,
// so weekdays before the 1582 calendar reform come out correct too.
function toJulianDayNumber(year: number, month: number, day: number): number {
  const gregorian = isGregorian(year, month, day);

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  let b = 0;
  if (gregorian) {
    const a = Math.floor(year / 100);
    b = 2 - a + Math.floor(a / 4);
  }

  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getWeekday(date: Date): string {
  const jdn = toJulianDayNumber(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const index = Math.floor(jdn + 1.5) % 7;
  return WEEKDAYS[index];
}

// The Calendar (New Style) Act 1750 made Great Britain and its colonies drop
// 11 days when switching from Julian to Gregorian: 2 September 1752 was
// followed directly by 14 September 1752. Dates in that gap never appeared
// on a British calendar, even though getWeekday() above will still compute
// a (proleptic Gregorian) weekday for them.
export function isInBritishCalendarGap(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return year === 1752 && month === 9 && day >= 3 && day <= 13;
}