'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import WikipediaOnThisDay from './WikipediaOnThisDay';
import HistoricalWeather from './HistoricalWeather';
import { getWeekday } from '@/utils/dates';
import { Home } from 'lucide-react';

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
                    <a href="https://www.joshuakite.co.uk" className="flex items-center justify-center mb-2 text-gray-600 hover:text-gray-900">
                        <Home className="h-5 w-5 mr-1" />
                        Return to Site Home
                    </a>
                    <h1 className="text-3xl font-bold flex items-center justify-center mb-4">
                        <DynamicCalendar className="mr-2 h-8 w-8" />
                        Historical Date Info
                    </h1>

                    <div className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        <p className="mb-3">Explore historical weather data and significant events for any date since 1754.</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Weekday calculated using Zeller&apos;s congruence</li>
                            <li>Historical weather provided by <a href="https://open-meteo.com/" className="text-blue-500 hover:underline">Open Meteo</a></li>
                            <li>Historical events provided by <a href="https://wikimedia.org/" className="text-blue-500 hover:underline">Wikimedia</a></li>
                        </ul>
                        <p className="mt-3">Select a date to begin your journey through time.</p>
                    </div>

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