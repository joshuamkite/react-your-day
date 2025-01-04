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
    return (
        <div className="flex gap-2 justify-center">
            <select
                value={dateInputs.month}
                onChange={(e) => onDatePartChange('month', e.target.value)}
                className="w-24 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                        {month.toString().padStart(2, '0')}
                    </option>
                ))}
            </select>

            <select
                value={dateInputs.day}
                onChange={(e) => onDatePartChange('day', e.target.value)}
                className="w-24 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>
                        {day.toString().padStart(2, '0')}
                    </option>
                ))}
            </select>

            <input
                type="number"
                min="1700"
                max={new Date().getFullYear()}
                placeholder="Year"
                value={dateInputs.year}
                onChange={(e) => onDatePartChange('year', e.target.value)}
                className="w-28 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
};

export default DateSelector;