'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';

interface WikiEvent {
  text: string;
  year: number;
  pages?: Array<{
    content_urls: {
      desktop: {
        page: string;
      };
    };
  }>;
}

interface EventsByYear {
  [key: string]: WikiEvent[];
}

const WikipediaOnThisDay: React.FC = () => {
  const [events, setEvents] = useState<WikiEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchEvents = React.useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();

      const response = await fetch(
        `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`
      );

      if (!response.ok) throw new Error('Failed to fetch events');

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load historical events. Please try again later.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchEvents();
  }, [selectedDate, fetchEvents]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setSelectedDate(date);
    }
  };

  const groupEventsByYear = (events: WikiEvent[]): EventsByYear => {
    return events.reduce((acc: EventsByYear, event) => {
      const century = Math.floor(event.year / 100) * 100;
      const centuryKey = century.toString();
      if (!acc[centuryKey]) {
        acc[centuryKey] = [];
      }
      acc[centuryKey].push(event);
      return acc;
    }, {});
  };

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <main className="p-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold flex items-center">
              <Calendar className="mr-2 h-6 w-6" />
              On This Day in History
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={formatDateForInput(selectedDate)}
              onChange={handleDateChange}
              className="px-3 py-2 border rounded-md w-48"
            />
            <span className="text-sm text-gray-500">
              {selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupEventsByYear(events))
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([century, centuryEvents]) => (
                  <div key={century} className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      {century}s
                    </h3>
                    <div className="space-y-4">
                      {centuryEvents
                        .sort((a, b) => b.year - a.year)
                        .map((event, index) => (
                          <div key={index} className="flex space-x-4">
                            <div className="font-mono text-sm text-gray-500 w-16">
                              {event.year}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{event.text}</p>
                              {event.pages && event.pages[0] && (
                                <a
                                  href={event.pages[0].content_urls.desktop.page}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline text-xs mt-1 block"
                                >
                                  Read more
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default WikipediaOnThisDay;