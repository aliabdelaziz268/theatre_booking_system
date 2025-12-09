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
- **Backend Mock**: JSON Server (running on port 5000)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aliabdelaziz268/theatre_booking_system.git
   cd theatre_booking_system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   This command starts both the Vite development server and the JSON Server concurrently.
   ```bash
   npm run dev
   # or
   npm run server   # starts json-server only
   ```

4. **Access the app**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

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

The application uses a local JSON Server running at `http://localhost:5000`. Key endpoints include:

- `/movies`: List of all movies
- `/showtimes`: Movie schedules
- `/seats`: Seat availability
- `/bookings`: User bookings
- `/users`: User accounts
- `/foodItems`: Concession items

## License

This project is licensed under the MIT License.
