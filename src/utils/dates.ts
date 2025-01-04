// src/utils/dates.ts

export function getWeekday(date: Date): string {
  const q = date.getDate(); // day of month
  let m = date.getMonth() + 1; // month (1-12)
  let y = date.getFullYear();

  // Adjust month and year for January and February
  if (m < 3) {
    m += 12;
    y -= 1;
  }

  // Formula uses Zeller's Congruence
  let h = q + Math.floor((13 * (m + 1)) / 5) + y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
  h = h % 7;

  const weekdays = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

  return weekdays[h];
}