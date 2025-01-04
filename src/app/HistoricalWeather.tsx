'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, Loader2 } from 'lucide-react';

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
        { name: 'London', lat: 51.5074, lon: -0.1278 },
        { name: 'New York', lat: 40.7128, lon: -74.0060 },
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
        { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
        // Add more preset locations
    ]);
    const [selectedHour, setSelectedHour] = useState<number>(12);
    const [timezone, setTimezone] = useState<string>('auto');
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
                `wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day&` +
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
                hour: selectedHour
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
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold flex items-center mb-4">
                    <Cloud className="mr-2 h-6 w-6" />
                    Historical Weather
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <select
                            value={`${location.lat},${location.lon}`}
                            onChange={(e) => {
                                const [lat, lon] = e.target.value.split(',').map(Number);
                                const selectedLocation = locations.find(loc => loc.lat === lat && loc.lon === lon);
                                if (selectedLocation) setLocation(selectedLocation);
                            }}
                            className="w-full p-2 border rounded-md"
                        >
                            {locations.map((loc) => (
                                <option key={loc.name} value={`${loc.lat},${loc.lon}`}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hour
                        </label>
                        <select
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(Number(e.target.value))}
                            className="w-full p-2 border rounded-md"
                        >
                            {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i}>
                                    {String(i).padStart(2, '0')}:00
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timezone
                        </label>
                        <select
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="auto">Auto</option>
                            <option value="GMT">GMT</option>
                            <option value="America/New_York">EST</option>
                            <option value="Europe/London">BST</option>
                            <option value="Asia/Tokyo">JST</option>
                            {/* Add more timezones as needed */}
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center p-4">{error}</div>
                ) : weather ? (
                    <div className="space-y-6">
                        <div className="text-center mb-4">
                            <span className="text-sm text-gray-500">
                                {`${String(weather.hour).padStart(2, '0')}:00 - ${weather.is_day ? 'Daytime' : 'Nighttime'}`}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">Temperature</div>
                                <div className="text-2xl font-bold">{Math.round(weather.temperature)}°C</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">Feels Like</div>
                                <div className="text-2xl font-bold">{Math.round(weather.apparent_temperature)}°C</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">Precipitation</div>
                                <div className="text-2xl font-bold">{Math.round(weather.precipitation)} mm</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">Cloud Cover</div>
                                <div className="text-2xl font-bold">{Math.round(weather.cloud_cover)}%</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700">Wind Conditions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Wind Speed</div>
                                    <div className="text-xl font-bold">
                                        {Math.round(weather.wind_speed)} km/h
                                        <div className="text-sm font-normal text-gray-500">
                                            ({Math.round(kmhToMph(weather.wind_speed))} mph)
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Wind Direction</div>
                                    <div className="text-xl font-bold">
                                        {getWindDirection(weather.wind_direction)}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Wind Gusts</div>
                                    <div className="text-xl font-bold">
                                        {Math.round(weather.wind_gusts)} km/h
                                        <div className="text-sm font-normal text-gray-500">
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