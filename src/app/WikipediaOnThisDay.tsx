'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

interface WikipediaOnThisDayProps {
  selectedDate: Date;
}

const WikipediaOnThisDay: React.FC<WikipediaOnThisDayProps> = ({ selectedDate }) => {
  const [events, setEvents] = useState<WikiEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchEvents = useCallback(async () => {
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
      const message = error instanceof Error ? error.message : 'Failed to load historical events';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const groupEventsByYear = (events: WikiEvent[]) => {
    return events.reduce((acc: { [key: string]: WikiEvent[] }, event) => {
      const century = Math.floor(event.year / 100) * 100;
      const centuryKey = century.toString();
      if (!acc[centuryKey]) {
        acc[centuryKey] = [];
      }
      acc[centuryKey].push(event);
      return acc;
    }, {});
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-gray-100">
          <Calendar className="mr-2 h-6 w-6" />
          Historical Events On This Day
        </h2>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400 text-center p-4">{error}</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupEventsByYear(events))
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([century, centuryEvents]) => (
                <div key={century} className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2 text-gray-900 dark:text-gray-100 dark:border-gray-700">
                    {century}s
                  </h3>
                  <div className="space-y-4">
                    {centuryEvents
                      .sort((a, b) => b.year - a.year)
                      .map((event, index) => (
                        <div key={index} className="flex space-x-4">
                          <div className="font-mono text-sm text-gray-500 dark:text-gray-400 w-16">
                            {event.year}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-gray-300">{event.text}</p>
                            {event.pages && event.pages[0] && (
                              <a
                                href={event.pages[0].content_urls.desktop.page}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-xs mt-1 block"
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
  );
};

export default WikipediaOnThisDay;