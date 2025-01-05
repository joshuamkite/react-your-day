# Wikipedia On This Day App

A React application that shows historical events for any selected date using the Wikipedia API. This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
- Import alias: No

2. Install required dependency:
```bash
npm install lucide-react
```

3. Create the following file structure:
```
src/
  app/
    page.tsx    # Main component
    layout.tsx  # Default layout
```

**Update  `next.config.ts` for local development**

1. Run the development server:
```bash
npm run dev
```
The app will be available at http://localhost:3000

## Features
- Select any date to view historical events
- Events grouped by century
- Links to full Wikipedia articles
- Responsive design
- TypeScript support

## API Reference
The app uses the Wikimedia and Open Meteo API endpoints:
```
https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/{month}/{day}
```
https://open-meteo.com/

## Technologies Used
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Lucide React Icons

## to build

```bash
npm run build
```
