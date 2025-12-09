# Theatre Booking System

A modern, responsive movie ticket booking application built with React, Vite, and Redux Toolkit.

## Features

-  **Browse Movies**: View currently showing movies with detailed information.
- **Showtime Selection**: Choose from multiple showtimes and screens.
- **Interactive Seat Selection**: Visual seat map with real-time availability.
- **Food & Beverage**: Add snacks and drinks to your order.
- **Secure Payment Flow**: Integrated payment method selection with confirmation dialog.
- **User Authentication**: Login and Registration with secure local storage.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Modern UI**: Built with Shadcn/UI and Tailwind CSS.

## Tech Stack

- **Frontend**: React, Vite
- **Routing**: React Router DOM (v6)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS, Shadcn/UI
- **Icons**: Lucide React
- **Backend Mock**: JSON Server

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── booking/        # Booking-specific components (SeatSelector, etc.)
│   └── ui/             # Shadcn UI primitives
├── data/               # Static mock data (if any)
├── hooks/              # Custom hooks (e.g., useAuth)
├── lib/                # Utility functions
├── pages/              # Main application pages (Home, Booking, Login, etc.)
├── store/              # Redux store and slices
├── App.jsx             # Main router component
└── main.jsx            # Entry point
```

## API Endpoints (JSON Server)

The application uses a local JSON Server . Key endpoints include:

- `/movies`: List of all movies
- `/showtimes`: Movie schedules
- `/seats`: Seat availability
- `/bookings`: User bookings
- `/users`: User accounts
- `/foodItems`: Concession items

