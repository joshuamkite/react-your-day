'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import WikipediaOnThisDay from './WikipediaOnThisDay';
import HistoricalWeather from './HistoricalWeather';
import { getWeekday } from '@/utils/dates';

// Import DateSelector with SSR disabled
const DateSelector = dynamic(() => import('./DateSelector'), { ssr: false });

// Dynamic import for lucide icon to prevent hydration issues
const DynamicCalendar = dynamic(
    async () => {
        const { Calendar } = await import('lucide-react');
        return Calendar;
    },
    { ssr: false }
);

interface DateInputs {
    year: string;
    month: string;
    day: string;
}

const HistoricalDashboard: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [dateInputs, setDateInputs] = useState<DateInputs>({
        year: '',
        month: '',
        day: ''
    });

    const handleDatePartChange = (part: keyof DateInputs, value: string) => {
        const newInputs = { ...dateInputs, [part]: value };
        setDateInputs(newInputs);

        if (newInputs.year && newInputs.month && newInputs.day) {
            // Create date in UTC
            const newDate = new Date(Date.UTC(
                parseInt(newInputs.year),
                parseInt(newInputs.month) - 1,
                parseInt(newInputs.day),
                12, // Set to noon UTC
                0,
                0,
                0
            ));

            if (!isNaN(newDate.getTime())) {
                setSelectedDate(newDate);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold flex items-center justify-center mb-6">
                        <DynamicCalendar className="mr-2 h-8 w-8" />
                        Historical Time Machine
                    </h1>

                    <div className="max-w-sm mx-auto mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select a Date
                        </label>
                        <DateSelector
                            dateInputs={dateInputs}
                            onDatePartChange={handleDatePartChange}
                        />
                    </div>

                    {selectedDate && (
                        <div className="text-xl font-medium text-gray-600">
                            {selectedDate.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                timeZone: 'UTC'
                            })} - {getWeekday(selectedDate)}
                        </div>
                    )}
                </div>

                {selectedDate ? (
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                        <HistoricalWeather selectedDate={selectedDate} />
                        <WikipediaOnThisDay selectedDate={selectedDate} />
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12">
                        Please select a date to view historical information
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoricalDashboard;