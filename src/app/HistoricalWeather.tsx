'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, Loader2, Search } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

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

    const fetchWeather = useCallback(async () => {
        setLoading(true);
        setError('');

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

            if (!response.ok) throw new Error('Failed to fetch weather data');

            const data = await response.json();

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
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold flex items-center mb-4 text-gray-900 dark:text-gray-100">
                    <Cloud className="mr-2 h-6 w-6" />
                    Historical Weather
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Location
                        </label>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <select
                                value={`${location.lat},${location.lon}`}
                                onChange={(e) => {
                                    const [lat, lon] = e.target.value.split(',').map(Number);
                                    const selectedLocation = locations.find(loc => loc.lat === lat && loc.lon === lon);
                                    if (selectedLocation) setLocation(selectedLocation);
                                }}
                                className="w-full pl-9 p-2 border rounded-md appearance-none bg-white dark:bg-gray-700 dark:text-gray-300"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hour
                        </label>
                        <select
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(Number(e.target.value))}
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-300"
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

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 dark:text-red-400 text-center p-4">{error}</div>
                ) : weather ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <WeatherIcon
                                weathercode={weather.weathercode}
                                isDay={weather.is_day}
                                size={64}
                            />
                            <span className="text-sm text-gray-500 dark:text-gray-400 block mt-2">
                                {`${String(weather.hour).padStart(2, '0')}:00 - ${weather.is_day ? 'Daytime' : 'Nighttime'}`}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Temperature</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(weather.temperature)}°C</div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Feels Like</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(weather.apparent_temperature)}°C</div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Precipitation</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(weather.precipitation)} mm</div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Cloud Cover</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(weather.cloud_cover)}%</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Wind Conditions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        {Math.round(weather.wind_speed)} km/h
                                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                            ({Math.round(kmhToMph(weather.wind_speed))} mph)
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Wind Direction</div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        {getWindDirection(weather.wind_direction)}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Wind Gusts</div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        {Math.round(weather.wind_gusts)} km/h
                                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
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