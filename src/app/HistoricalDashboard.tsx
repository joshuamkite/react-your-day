'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import WikipediaOnThisDay from './WikipediaOnThisDay';
import HistoricalWeather from './HistoricalWeather';
import { getWeekday, isInBritishCalendarGap } from '@/utils/dates';
import { Home } from 'lucide-react';
import styles from './HistoricalDashboard.module.css';

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
            // Build with a placeholder (leap) year first, then set the real
            // year via setUTCFullYear - Date.UTC() itself remaps two-digit
            // years (0-99) to 1900+year, which would corrupt any year < 100.
            const newDate = new Date(Date.UTC(
                2000,
                parseInt(newInputs.month) - 1,
                parseInt(newInputs.day),
                12, 0, 0, 0
            ));
            newDate.setUTCFullYear(parseInt(newInputs.year));

            if (!isNaN(newDate.getTime())) {
                setSelectedDate(newDate);
            }
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <a href="https://www.joshuakite.co.uk" className={styles.homeLink}>
                        <Home className={styles.homeIcon} />
                        Return to Site Home
                    </a>
                    <h1 className={styles.title}>
                        <DynamicCalendar className={styles.titleIcon} />
                        Historical Date Info
                    </h1>

                    <div className={styles.description}>
                        <p>Explore historical weather data and significant events for any date.</p>
                        <ul className={styles.list}>
                            <li>Weekday calculated using the Julian calendar before 15 Oct 1582 and the Gregorian calendar from then on</li>
                            <li>Historical weather provided by <a href="https://open-meteo.com/" className={styles.link}>Open Meteo</a> (available from 1940 onward)</li>
                            <li>Historical events provided by <a href="https://wikimedia.org/" className={styles.link}>Wikimedia</a></li>
                        </ul>
                    </div>

                    <div className={styles.dateSelectorWrapper}>
                        <label className={styles.label}>
                        </label>
                        <DateSelector
                            dateInputs={dateInputs}
                            onDatePartChange={handleDatePartChange}
                        />
                    </div>

                    {selectedDate && (
                        <div className={styles.weekday}>
                            {selectedDate.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                timeZone: 'UTC'
                            })} - {getWeekday(selectedDate)}
                        </div>
                    )}

                    {selectedDate && isInBritishCalendarGap(selectedDate) && (
                        <div className={styles.calendarNote}>
                            This date never appeared on a British calendar &mdash; 11 days were dropped when Great Britain switched from the Julian to the Gregorian calendar in 1752 (2 September was followed directly by 14 September).
                        </div>
                    )}
                </div>

                {selectedDate ? (
                    <div className={styles.resultsGrid}>
                        <HistoricalWeather selectedDate={selectedDate} />
                        <WikipediaOnThisDay selectedDate={selectedDate} />
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        Select a date to begin your journey through time.
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoricalDashboard;