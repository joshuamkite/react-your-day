'use client';

import React from 'react';

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

        // Allow empty value for clearing the field
        if (value === '') {
            onDatePartChange('year', '');
            return;
        }

        // Only allow numbers
        if (!/^\d+$/.test(value)) {
            return;
        }

        const yearNum = parseInt(value);
        const currentYear = new Date().getFullYear();

        // Allow typing but restrict final value
        if (value.length <= 4) {
            onDatePartChange('year', value);
        }

        // If it's a complete year (4 digits) and out of range, reset to empty
        if (value.length === 4 && (yearNum < 1754 || yearNum > currentYear)) {
            onDatePartChange('year', '');
        }
    };

    return (
        <div className="flex gap-2 justify-center">
            <select
                value={dateInputs.day}
                onChange={(e) => onDatePartChange('day', e.target.value)}
                className="w-24 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-40 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-28 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
};

export default DateSelector;