# Wikipedia On This Day App

A React application that shows historical events for any selected date using the Wikipedia API.

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
The app uses the Wikimedia API endpoint:
```
https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/{month}/{day}
```

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

## Old defualt

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
