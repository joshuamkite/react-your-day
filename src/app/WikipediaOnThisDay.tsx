'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import styles from './WikipediaOnThisDay.module.css';

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
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Calendar className={styles.titleIcon} />
          Historical Events On This Day
        </h2>
      </div>

      <div className={styles.body}>
        {loading ? (
          <div className={styles.loadingWrap}>
            <Loader2 className={styles.spinner} />
          </div>
        ) : error ? (
          <div className={styles.errorText}>{error}</div>
        ) : (
          <div className={styles.centuryList}>
            {Object.entries(groupEventsByYear(events))
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([century, centuryEvents]) => (
                <div key={century} className={styles.centuryBlock}>
                  <h3 className={styles.centuryHeading}>
                    {century}s
                  </h3>
                  <div className={styles.eventsList}>
                    {centuryEvents
                      .sort((a, b) => b.year - a.year)
                      .map((event, index) => (
                        <div key={index} className={styles.eventRow}>
                          <div className={styles.eventYear}>
                            {event.year}
                          </div>
                          <div className={styles.eventBody}>
                            <p className={styles.eventText}>{event.text}</p>
                            {event.pages && event.pages[0] && (
                              <a
                                href={event.pages[0].content_urls.desktop.page}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.readMore}
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