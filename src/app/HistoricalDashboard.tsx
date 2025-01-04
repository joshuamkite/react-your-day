'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import WikipediaOnThisDay from './WikipediaOnThisDay';
import HistoricalWeather from './HistoricalWeather';
import { getWeekday } from '@/utils/dates';

const HistoricalDashboard: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        if (!isNaN(date.getTime())) {
            setSelectedDate(date);
        }
    };

    const formatDateForInput = (date: Date | null): string => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold flex items-center justify-center mb-6">
                        <Calendar className="mr-2 h-8 w-8" />
                        Historical Time Machine
                    </h1>

                    <div className="max-w-sm mx-auto mb-6">
                        <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Select a Date
                        </label>
                        <input
                            id="date-select"
                            type="date"
                            value={formatDateForInput(selectedDate)}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {selectedDate && (
                        <>
                            <div className="text-xl font-medium text-gray-600">
                                {selectedDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {getWeekday(selectedDate)}
                            </div>
                        </>
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