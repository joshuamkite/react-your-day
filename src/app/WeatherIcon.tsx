'use client';

import React from 'react';
import { Sun, Moon, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import styles from './WeatherIcon.module.css';

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
                    <Sun size={size} className={styles.sun} /> :
                    <Moon size={size} className={styles.moon} />;

            case 1: // Mainly clear
            case 2: // Partly cloudy
                return (
                    <div className={styles.relative}>
                        {isDay ?
                            <Sun size={size} className={styles.sun} /> :
                            <Moon size={size} className={styles.moon} />}
                        <Cloud size={size * 0.8} className={`${styles.cloudLight} ${styles.overlayCloud}`} />
                    </div>
                );

            case 3: // Overcast
                return <Cloud size={size} className={styles.cloud} />;

            case 45: // Foggy
            case 48: // Depositing rime fog
                return <CloudFog size={size} className={styles.cloudLight} />;

            case 51: // Light drizzle
            case 53: // Moderate drizzle
            case 55: // Dense drizzle
                return <CloudDrizzle size={size} className={styles.drizzle} />;

            case 61: // Slight rain
            case 63: // Moderate rain
            case 65: // Heavy rain
                return <CloudRain size={size} className={styles.rain} />;

            case 71: // Slight snow fall
            case 73: // Moderate snow fall
            case 75: // Heavy snow fall
                return <CloudSnow size={size} className={styles.snow} />;

            case 95: // Thunderstorm
            case 96: // Thunderstorm with slight hail
            case 99: // Thunderstorm with heavy hail
                return <CloudLightning size={size} className={styles.lightning} />;

            default:
                return <Cloud size={size} className={styles.cloudLight} />;
        }
    };

    return (
        <div className={styles.wrapper}>
            {getIcon()}
        </div>
    );
};

export default WeatherIcon;
