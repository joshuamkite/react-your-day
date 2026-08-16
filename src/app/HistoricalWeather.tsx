'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, Frown, Loader2, Search } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import styles from './HistoricalWeather.module.css';

interface WeatherData {
    temperature: number;
    apparent_temperature: number;
    precipitation: number;
    cloud_cover: number;
    wind_speed: number;
    wind_direction: number;
    wind_gusts: number;
    is_day: number;
    hour: number;
    weathercode: number;
}

interface Location {
    name: string;
    lat: number;
    lon: number;
}

interface HistoricalWeatherProps {
    selectedDate: Date;
}

// Open-Meteo's archive only covers 1940 onward. For anything earlier, their
// API returns an unhelpful "Invalid date" (rather than a range error), so we
// check client-side instead of surfacing that message.
const WEATHER_ARCHIVE_START = new Date(Date.UTC(1940, 0, 1));

const HistoricalWeather: React.FC<HistoricalWeatherProps> = ({ selectedDate }) => {
    const [location, setLocation] = useState<Location>({
        name: 'London',
        lat: 51.5074,
        lon: -0.1278
    });
    const [locations] = useState<Location[]>([
        // Europe
        { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
        { name: 'Paris, France', lat: 48.8566, lon: 2.3522 },
        { name: 'Berlin, Germany', lat: 52.5200, lon: 13.4050 },
        { name: 'Madrid, Spain', lat: 40.4168, lon: -3.7038 },
        { name: 'Rome, Italy', lat: 41.9028, lon: 12.4964 },
        { name: 'Amsterdam, Netherlands', lat: 52.3676, lon: 4.9041 },
        { name: 'Moscow, Russia', lat: 55.7558, lon: 37.6173 },
        { name: 'Istanbul, Turkey', lat: 41.0082, lon: 28.9784 },

        // North America
        { name: 'New York, USA', lat: 40.7128, lon: -74.0060 },
        { name: 'Los Angeles, USA', lat: 34.0522, lon: -118.2437 },
        { name: 'Chicago, USA', lat: 41.8781, lon: -87.6298 },
        { name: 'Toronto, Canada', lat: 43.6532, lon: -79.3832 },
        { name: 'Vancouver, Canada', lat: 49.2827, lon: -123.1207 },
        { name: 'Mexico City, Mexico', lat: 19.4326, lon: -99.1332 },

        // Asia
        { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
        { name: 'Beijing, China', lat: 39.9042, lon: 116.4074 },
        { name: 'Shanghai, China', lat: 31.2304, lon: 121.4737 },
        { name: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
        { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
        { name: 'Seoul, South Korea', lat: 37.5665, lon: 126.9780 },
        { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777 },
        { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708 },

        // Oceania
        { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
        { name: 'Melbourne, Australia', lat: -37.8136, lon: 144.9631 },
        { name: 'Auckland, New Zealand', lat: -36.8509, lon: 174.7645 },

        // South America
        { name: 'São Paulo, Brazil', lat: -23.5505, lon: -46.6333 },
        { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lon: -43.1729 },
        { name: 'Buenos Aires, Argentina', lat: -34.6037, lon: -58.3816 },
        { name: 'Lima, Peru', lat: -12.0464, lon: -77.0428 },

        // Africa
        { name: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357 },
        { name: 'Cape Town, South Africa', lat: -33.9249, lon: 18.4241 },
        { name: 'Lagos, Nigeria', lat: 6.5244, lon: 3.3792 },
        { name: 'Nairobi, Kenya', lat: -1.2921, lon: 36.8219 }
    ].sort((a, b) => a.name.localeCompare(b.name)));
    const [selectedHour, setSelectedHour] = useState<number>(12);
    const timezone = 'auto';
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [unavailable, setUnavailable] = useState<boolean>(false);

    const fetchWeather = useCallback(async () => {
        setLoading(true);
        setError('');
        setUnavailable(false);
        setWeather(null);

        if (selectedDate < WEATHER_ARCHIVE_START) {
            setUnavailable(true);
            setLoading(false);
            return;
        }

        try {
            const formatDate = (date: Date): string => {
                return date.toISOString().split('T')[0];
            };

            const response = await fetch(
                `https://archive-api.open-meteo.com/v1/archive?` +
                `latitude=${location.lat}&longitude=${location.lon}&` +
                `start_date=${formatDate(selectedDate)}&` +
                `end_date=${formatDate(selectedDate)}&` +
                `hourly=temperature_2m,apparent_temperature,precipitation,cloud_cover,` +
                `wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day,weathercode&` +
                `timezone=${timezone}`
            );

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.reason || 'Failed to fetch weather data');
            }

            // Find the index for the selected hour
            const hourIndex = data.hourly.time.findIndex((time: string) =>
                new Date(time).getHours() === selectedHour
            );

            if (hourIndex === -1) throw new Error('Hour not found in weather data');

            setWeather({
                temperature: data.hourly.temperature_2m[hourIndex],
                apparent_temperature: data.hourly.apparent_temperature[hourIndex],
                precipitation: data.hourly.precipitation[hourIndex],
                cloud_cover: data.hourly.cloud_cover[hourIndex],
                wind_speed: data.hourly.wind_speed_10m[hourIndex],
                wind_direction: data.hourly.wind_direction_10m[hourIndex],
                wind_gusts: data.hourly.wind_gusts_10m[hourIndex],
                is_day: data.hourly.is_day[hourIndex],
                hour: selectedHour,
                weathercode: data.hourly.weathercode[hourIndex]
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to load weather data';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [location, selectedDate, selectedHour, timezone]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    const getWindDirection = (degrees: number): string => {
        const directions = [
            "North", "North-Northeast", "Northeast", "East-Northeast",
            "East", "East-Southeast", "Southeast", "South-Southeast",
            "South", "South-Southwest", "Southwest", "West-Southwest",
            "West", "West-Northwest", "Northwest", "North-Northwest"
        ];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    };

    const kmhToMph = (kmh: number): number => {
        return kmh * 0.621371;
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    <Cloud className={styles.titleIcon} />
                    Historical Weather
                </h2>

                <div className={styles.controlsGrid}>
                    <div className={styles.colSpan2}>
                        <label className={styles.fieldLabel}>
                            Location
                        </label>
                        <div className={styles.relative}>
                            <Search className={styles.searchIcon} />
                            <select
                                value={`${location.lat},${location.lon}`}
                                onChange={(e) => {
                                    const [lat, lon] = e.target.value.split(',').map(Number);
                                    const selectedLocation = locations.find(loc => loc.lat === lat && loc.lon === lon);
                                    if (selectedLocation) setLocation(selectedLocation);
                                }}
                                className={`${styles.select} ${styles.locationSelect}`}
                            >
                                {locations.map((loc) => (
                                    <option key={loc.name} value={`${loc.lat},${loc.lon}`}>
                                        {loc.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={styles.fieldLabel}>
                            Hour
                        </label>
                        <select
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(Number(e.target.value))}
                            className={styles.select}
                        >
                            {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i}>
                                    {String(i).padStart(2, '0')}:00
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.body}>
                {loading ? (
                    <div className={styles.loadingWrap}>
                        <Loader2 className={styles.spinner} />
                    </div>
                ) : unavailable ? (
                    <div className={styles.unavailableWrap}>
                        <Frown size={64} className={styles.frownIcon} />
                        <div>Weather data is only available from 1940 onward</div>
                    </div>
                ) : error ? (
                    <div className={styles.errorText}>{error}</div>
                ) : weather ? (
                    <div className={styles.contentStack}>
                        <div className={styles.iconBlock}>
                            <WeatherIcon
                                weathercode={weather.weathercode}
                                isDay={weather.is_day}
                                size={64}
                            />
                            <span className={styles.hourLabel}>
                                {`${String(weather.hour).padStart(2, '0')}:00 - ${weather.is_day ? 'Daytime' : 'Nighttime'}`}
                            </span>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.tile}>
                                <div className={styles.tileLabel}>Temperature</div>
                                <div className={styles.tileValue}>{Math.round(weather.temperature)}°C</div>
                            </div>
                            <div className={styles.tile}>
                                <div className={styles.tileLabel}>Feels Like</div>
                                <div className={styles.tileValue}>{Math.round(weather.apparent_temperature)}°C</div>
                            </div>
                            <div className={styles.tile}>
                                <div className={styles.tileLabel}>Precipitation</div>
                                <div className={styles.tileValue}>{Math.round(weather.precipitation)} mm</div>
                            </div>
                            <div className={styles.tile}>
                                <div className={styles.tileLabel}>Cloud Cover</div>
                                <div className={styles.tileValue}>{Math.round(weather.cloud_cover)}%</div>
                            </div>
                        </div>

                        <div className={styles.windSection}>
                            <h3 className={styles.windTitle}>Wind Conditions</h3>
                            <div className={styles.windGrid}>
                                <div className={styles.tile}>
                                    <div className={styles.tileLabel}>Wind Speed</div>
                                    <div className={styles.windValue}>
                                        {Math.round(weather.wind_speed)} km/h
                                        <div className={styles.tileLabel}>
                                            ({Math.round(kmhToMph(weather.wind_speed))} mph)
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.tile}>
                                    <div className={styles.tileLabel}>Wind Direction</div>
                                    <div className={styles.windValue}>
                                        {getWindDirection(weather.wind_direction)}
                                    </div>
                                </div>
                                <div className={styles.tile}>
                                    <div className={styles.tileLabel}>Wind Gusts</div>
                                    <div className={styles.windValue}>
                                        {Math.round(weather.wind_gusts)} km/h
                                        <div className={styles.tileLabel}>
                                            ({Math.round(kmhToMph(weather.wind_gusts))} mph)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default HistoricalWeather;