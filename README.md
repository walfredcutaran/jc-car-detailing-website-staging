# Jucee Car Detailing Website

A full-stack application for scheduling car detailing services. It uses **Next.js 15** and **React 19** with the App Router. Styling is handled by **Tailwind CSS 4**, and data is stored in a PostgreSQL database accessed through **Prisma**.

## Features

- Public pages for browsing services and submitting booking requests
- Admin dashboard to manage incoming bookings
- RESTful API routes built with Next.js route handlers
- Type-safe database access via Prisma Client

## Prerequisites

- Node.js 18 or newer
- PostgreSQL database

Create a `.env` file in the project root and provide a connection string:

```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE"
```

## Installation

Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## Production Build

Create an optimized build and start the server:

```bash
npm run build
npm start
```

## Project Structure

```
app/            # Next.js pages, components, and API routes
prisma/         # Prisma schema and database client
public/         # Static assets
```

## Environment Variables

| Variable       | Description                    |
| -------------- | ------------------------------ |
| `DATABASE_URL` | PostgreSQL connection string   |

## License

This project is provided as-is for learning and demonstration purposes.

