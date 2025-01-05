# Historical Day

A React application that shows historical weather data, weekday and significant events for any date since 1754. Built with Next.js and designed for static site integration.

## Features
- Historical weather data for locations worldwide
- Wikipedia "On This Day" events
- Day of week calculation using Zeller's congruence
- Events grouped by century
- Links to full Wikipedia articles
- Responsive design
- TypeScript support

## Setup Steps

1. Create Next.js project:
```bash
npx create-next-app@latest .
```
Select the following options:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- src/ directory: Yes
- App Router: Yes
- Import alias: Yes (@/ for src/)

2. Install required dependencies:
```bash
npm install lucide-react
```

3. Create the following file structure:
```
src/
  app/
    page.tsx
    layout.tsx
    DateSelector.tsx
    HistoricalDashboard.tsx
    HistoricalWeather.tsx
    WeatherIcon.tsx
    WikipediaOnThisDay.tsx
    utils/
      dates.ts
```

## Development

Review `next.config.ts` to build for local development

1. Run the development server:
```bash
npm run dev
```
The app will be available at http://localhost:3000

## Building for Static Site Integration

1. Update `next.config.ts`:
```typescript
const nextConfig = {
  output: 'export',
  basePath: '/historical-day',
  images: {
    unoptimized: true,
  },
  assetPrefix: '/historical-day',
};
```

2. Build the static output:
```bash
npm run build
```

The static files will be generated in the `out` directory, ready for integration with a static site generator.

## APIs Used
The app integrates with two external APIs:

1. Wikimedia API for historical events:
```
https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/{month}/{day}
```

2. Open Meteo Archive API for historical weather:
```
https://archive-api.open-meteo.com/v1/archive
```

## Technologies Used
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Lucide React Icons

## Key Components
- **HistoricalDashboard**: Main application container
- **DateSelector**: Custom date input with validation
- **HistoricalWeather**: Weather data visualization
- **WikipediaOnThisDay**: Historical events display
- **WeatherIcon**: Dynamic weather condition icons

## Features in Detail
- Date selection from 1754 to present
- Historical weather data including:
  - Temperature
  - Precipitation
  - Cloud cover
  - Wind conditions
- Wikipedia events organized by century
- Responsive design for all screen sizes
- Static site integration ready
