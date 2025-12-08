import { db } from '@/db';
import { showtimes } from '@/db/schema';

async function main() {
    await db.delete(showtimes);

    const today = new Date();
    const dates = [
        today.toISOString().split('T')[0],
        new Date(today.getTime() + 86400000).toISOString().split('T')[0],
        new Date(today.getTime() + 172800000).toISOString().split('T')[0],
        new Date(today.getTime() + 259200000).toISOString().split('T')[0],
        new Date(today.getTime() + 345600000).toISOString().split('T')[0]
    ];

    const morningTimes = ['10:00', '11:30'];
    const afternoonTimes = ['14:00', '15:30'];
    const eveningTimes = ['18:00', '19:30', '21:00'];

    const sampleShowtimes = [
        // Movie 1 - 4 showtimes
        {
            movieId: 1,
            showDate: dates[0],
            showTime: '11:30',
            screenNumber: 1,
            totalSeats: 80,
            availableSeats: 80,
            price: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 1,
            showDate: dates[0],
            showTime: '19:30',
            screenNumber: 2,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 1,
            showDate: dates[1],
            showTime: '14:00',
            screenNumber: 3,
            totalSeats: 80,
            availableSeats: 80,
            price: 1500,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 1,
            showDate: dates[2],
            showTime: '21:00',
            screenNumber: 1,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },

        // Movie 2 - 3 showtimes
        {
            movieId: 2,
            showDate: dates[0],
            showTime: '10:00',
            screenNumber: 4,
            totalSeats: 80,
            availableSeats: 80,
            price: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 2,
            showDate: dates[1],
            showTime: '18:00',
            screenNumber: 5,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 2,
            showDate: dates[3],
            showTime: '15:30',
            screenNumber: 2,
            totalSeats: 80,
            availableSeats: 80,
            price: 1500,
            createdAt: new Date().toISOString(),
        },

        // Movie 3 - 4 showtimes
        {
            movieId: 3,
            showDate: dates[0],
            showTime: '14:00',
            screenNumber: 3,
            totalSeats: 80,
            availableSeats: 80,
            price: 1500,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 3,
            showDate: dates[1],
            showTime: '11:30',
            screenNumber: 1,
            totalSeats: 80,
            availableSeats: 80,
            price: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 3,
            showDate: dates[2],
            showTime: '19:30',
            screenNumber: 4,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 3,
            showDate: dates[4],
            showTime: '21:00',
            screenNumber: 5,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },

        // Movie 4 - 3 showtimes
        {
            movieId: 4,
            showDate: dates[0],
            showTime: '18:00',
            screenNumber: 2,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 4,
            showDate: dates[2],
            showTime: '10:00',
            screenNumber: 3,
            totalSeats: 80,
            availableSeats: 80,
            price: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 4,
            showDate: dates[3],
            showTime: '15:30',
            screenNumber: 1,
            totalSeats: 80,
            availableSeats: 80,
            price: 1500,
            createdAt: new Date().toISOString(),
        },

        // Movie 5 - 4 showtimes
        {
            movieId: 5,
            showDate: dates[0],
            showTime: '15:30',
            screenNumber: 5,
            totalSeats: 80,
            availableSeats: 80,
            price: 1500,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 5,
            showDate: dates[1],
            showTime: '21:00',
            screenNumber: 2,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 5,
            showDate: dates[2],
            showTime: '11:30',
            screenNumber: 4,
            totalSeats: 80,
            availableSeats: 80,
            price: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 5,
            showDate: dates[4],
            showTime: '19:30',
            screenNumber: 3,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },

        // Movie 6 - 3 showtimes
        {
            movieId: 6,
            showDate: dates[1],
            showTime: '10:00',
            screenNumber: 1,
            totalSeats: 80,
            availableSeats: 80,
            price: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 6,
            showDate: dates[2],
            showTime: '14:00',
            screenNumber: 5,
            totalSeats: 80,
            availableSeats: 80,
            price: 1500,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 6,
            showDate: dates[3],
            showTime: '18:00',
            screenNumber: 2,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },

        // Movie 7 - 4 showtimes
        {
            movieId: 7,
            showDate: dates[0],
            showTime: '21:00',
            screenNumber: 4,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 7,
            showDate: dates[1],
            showTime: '14:00',
            screenNumber: 3,
            totalSeats: 80,
            availableSeats: 80,
            price: 1500,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 7,
            showDate: dates[3],
            showTime: '11:30',
            screenNumber: 5,
            totalSeats: 80,
            availableSeats: 80,
            price: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 7,
            showDate: dates[4],
            showTime: '18:00',
            screenNumber: 1,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },

        // Movie 8 - 3 showtimes
        {
            movieId: 8,
            showDate: dates[0],
            showTime: '10:00',
            screenNumber: 2,
            totalSeats: 80,
            availableSeats: 80,
            price: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 8,
            showDate: dates[2],
            showTime: '15:30',
            screenNumber: 3,
            totalSeats: 80,
            availableSeats: 80,
            price: 1500,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 8,
            showDate: dates[4],
            showTime: '21:00',
            screenNumber: 4,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },

        // Movie 9 - 4 showtimes
        {
            movieId: 9,
            showDate: dates[1],
            showTime: '19:30',
            screenNumber: 5,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 9,
            showDate: dates[2],
            showTime: '10:00',
            screenNumber: 1,
            totalSeats: 80,
            availableSeats: 80,
            price: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 9,
            showDate: dates[3],
            showTime: '14:00',
            screenNumber: 2,
            totalSeats: 80,
            availableSeats: 80,
            price: 1500,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 9,
            showDate: dates[4],
            showTime: '18:00',
            screenNumber: 3,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        },

        // Movie 10 - 3 showtimes
        {
            movieId: 10,
            showDate: dates[0],
            showTime: '11:30',
            screenNumber: 4,
            totalSeats: 80,
            availableSeats: 80,
            price: 1200,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 10,
            showDate: dates[1],
            showTime: '15:30',
            screenNumber: 5,
            totalSeats: 80,
            availableSeats: 80,
            price: 1500,
            createdAt: new Date().toISOString(),
        },
        {
            movieId: 10,
            showDate: dates[3],
            showTime: '21:00',
            screenNumber: 1,
            totalSeats: 80,
            availableSeats: 80,
            price: 1800,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(showtimes).values(sampleShowtimes);
    
    console.log('✅ Showtimes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
