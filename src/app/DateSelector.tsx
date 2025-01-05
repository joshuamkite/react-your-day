'use client';

import React, { useState } from 'react';

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

    // Get days in selected month
    const getDaysInMonth = (month: string, year: string): number => {
        if (!month || !year) return 31;
        const monthIndex = parseInt(month) - 1;
        const yearNum = parseInt(year);
        return new Date(yearNum, monthIndex + 1, 0).getDate();
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
                if (yearNum < 1754) {
                    setYearError('Year must be 1754 or later');
                    onDatePartChange('year', '');
                } else if (yearNum > currentYear) {
                    setYearError(`Year cannot be later than ${currentYear}`);
                    onDatePartChange('year', '');
                }
            }
        }
    };

    const inputClasses = "w-full px-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:ring-blue-400 dark:placeholder-gray-400";

    return (
        <div className="space-y-2">
            <div className="flex gap-2 justify-center">
                <select
                    value={dateInputs.day}
                    onChange={(e) => onDatePartChange('day', e.target.value)}
                    className={`${inputClasses} w-24`}
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
                    className={`${inputClasses} w-40`}
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
                    className={`${inputClasses} w-28`}
                />
            </div>
            {yearError && (
                <div className="text-red-500 dark:text-red-400 text-sm text-center">
                    {yearError}
                </div>
            )}
        </div>
    );
};

export default DateSelector;