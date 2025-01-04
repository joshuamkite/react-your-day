'use client';

import React from 'react';
import { Sun, Moon, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';

interface WeatherIconProps {
    weathercode: number;
    isDay: number;
    size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ weathercode, isDay, size = 48 }) => {
    // Helper function to get icon based on weather code
    const getIcon = () => {
        switch (weathercode) {
            case 0: // Clear sky
                return isDay ?
                    <Sun size={size} className="text-yellow-500" /> :
                    <Moon size={size} className="text-gray-300" />;

            case 1: // Mainly clear
            case 2: // Partly cloudy
                return (
                    <div className="relative">
                        {isDay ?
                            <Sun size={size} className="text-yellow-500" /> :
                            <Moon size={size} className="text-gray-300" />}
                        <Cloud size={size * 0.8} className="text-gray-400 absolute -right-2 -bottom-2" />
                    </div>
                );

            case 3: // Overcast
                return <Cloud size={size} className="text-gray-500" />;

            case 45: // Foggy
            case 48: // Depositing rime fog
                return <CloudFog size={size} className="text-gray-400" />;

            case 51: // Light drizzle
            case 53: // Moderate drizzle
            case 55: // Dense drizzle
                return <CloudDrizzle size={size} className="text-blue-400" />;

            case 61: // Slight rain
            case 63: // Moderate rain
            case 65: // Heavy rain
                return <CloudRain size={size} className="text-blue-500" />;

            case 71: // Slight snow fall
            case 73: // Moderate snow fall
            case 75: // Heavy snow fall
                return <CloudSnow size={size} className="text-blue-200" />;

            case 95: // Thunderstorm
            case 96: // Thunderstorm with slight hail
            case 99: // Thunderstorm with heavy hail
                return <CloudLightning size={size} className="text-yellow-400" />;

            default:
                return <Cloud size={size} className="text-gray-400" />;
        }
    };

    return (
        <div className="inline-block">
            {getIcon()}
        </div>
    );
};

export default WeatherIcon;