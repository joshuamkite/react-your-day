import { describe, expect, it } from 'vitest'
import { getWeekday, isInBritishCalendarGap } from './dates'

// Date(y, m, d) is awkward for years < 100 and uses the proleptic Gregorian
// calendar for its fields, which is what getWeekday() reads back.
const d = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day)

describe('getWeekday', () => {
  it.each([
    ['2000-01-01', d(2000, 1, 1), 'Saturday'],
    ['1999-06-15', d(1999, 6, 15), 'Tuesday'],
    ['1969-07-20 (moon landing)', d(1969, 7, 20), 'Sunday'],
    ['2024-02-29 (leap day)', d(2024, 2, 29), 'Thursday'],
    ['1900-02-28 (1900 not a leap year)', d(1900, 2, 28), 'Wednesday'],
    ['1900-03-01', d(1900, 3, 1), 'Thursday'],
    ['1752-09-14 (first British Gregorian day)', d(1752, 9, 14), 'Thursday'],
  ])('%s is a %s', (_label, date, expected) => {
    expect(getWeekday(date)).toBe(expected)
  })

  it('treats 4 Oct 1582 (Julian) and 15 Oct 1582 (Gregorian) as consecutive days', () => {
    expect(getWeekday(d(1582, 10, 4))).toBe('Thursday')
    expect(getWeekday(d(1582, 10, 15))).toBe('Friday')
  })

  it('uses Julian calendar rules before the 1582 reform', () => {
    // Battle of Hastings, 14 Oct 1066 (Julian) was a Saturday.
    expect(getWeekday(d(1066, 10, 14))).toBe('Saturday')
  })
})

describe('isInBritishCalendarGap', () => {
  it('is true for 3-13 September 1752', () => {
    for (let day = 3; day <= 13; day++) {
      expect(isInBritishCalendarGap(d(1752, 9, day))).toBe(true)
    }
  })

  it('is false at the edges of the gap', () => {
    expect(isInBritishCalendarGap(d(1752, 9, 2))).toBe(false)
    expect(isInBritishCalendarGap(d(1752, 9, 14))).toBe(false)
  })

  it('is false for the same days in other years and months', () => {
    expect(isInBritishCalendarGap(d(1751, 9, 5))).toBe(false)
    expect(isInBritishCalendarGap(d(1753, 9, 5))).toBe(false)
    expect(isInBritishCalendarGap(d(1752, 8, 5))).toBe(false)
  })
})
