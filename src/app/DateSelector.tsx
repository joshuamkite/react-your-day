'use client';

import React, { useState } from 'react';
import styles from './DateSelector.module.css';

interface DateInputs {
    year: string;
    month: string;
    day: string;
}

interface DateSelectorProps {
    dateInputs: DateInputs;
    onDatePartChange: (part: keyof DateInputs, value: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ dateInputs, onDatePartChange }) => {
    const [yearError, setYearError] = useState<string>('');
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Days per month (index 0 = January). Native Date can't be used here:
    // its constructor silently remaps two-digit years (0-99) to 1900+year,
    // which would give the wrong day count for any year below 100.
    const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const isLeapYear = (year: number): boolean =>
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    // Get days in selected month
    const getDaysInMonth = (month: string, year: string): number => {
        if (!month || !year) return 31;
        const monthIndex = parseInt(month) - 1;
        const yearNum = parseInt(year);
        if (monthIndex === 1 && isLeapYear(yearNum)) return 29;
        return DAYS_IN_MONTH[monthIndex];
    };

    const daysInMonth = getDaysInMonth(dateInputs.month, dateInputs.year);

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setYearError('');

        // Allow empty value for clearing the field
        if (value === '') {
            onDatePartChange('year', '');
            return;
        }

        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            return;
        }

        // Allow typing but limit to 4 digits
        if (value.length <= 4) {
            onDatePartChange('year', value);

            // Only validate complete years
            if (value.length === 4) {
                const yearNum = parseInt(value);
                const currentYear = new Date().getFullYear();

                // If it's an invalid year, show error message
                if (yearNum < 1) {
                    setYearError('Year must be 1 or later');
                    onDatePartChange('year', '');
                } else if (yearNum > currentYear) {
                    setYearError(`Year cannot be later than ${currentYear}`);
                    onDatePartChange('year', '');
                }
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <select
                    value={dateInputs.day}
                    onChange={(e) => onDatePartChange('day', e.target.value)}
                    className={`${styles.input} ${styles.day}`}
                >
                    <option value="">Day</option>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>
                            {day.toString().padStart(2, '0')}
                        </option>
                    ))}
                </select>

                <select
                    value={dateInputs.month}
                    onChange={(e) => onDatePartChange('month', e.target.value)}
                    className={`${styles.input} ${styles.month}`}
                >
                    <option value="">Month</option>
                    {months.map((month, index) => (
                        <option key={month} value={index + 1}>
                            {month}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={4}
                    placeholder="Year"
                    value={dateInputs.year}
                    onChange={handleYearChange}
                    className={`${styles.input} ${styles.year}`}
                />
            </div>
            {yearError && (
                <div className={styles.error}>
                    {yearError}
                </div>
            )}
        </div>
    );
};

export default DateSelector;