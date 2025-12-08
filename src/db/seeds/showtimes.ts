import { db } from '@/db';
import { showtimes, movies } from '@/db/schema';

async function main() {
    // First, get all movie IDs from the database
    const allMovies = await db.select({ id: movies.id }).from(movies);
    
    if (allMovies.length === 0) {
        console.error('❌ No movies found in database. Please seed movies first.');
        return;
    }

    console.log(`Found ${allMovies.length} movies in database`);

    // Generate showtimes for 5 consecutive days starting from today
    const startDate = new Date();
    const showDates: string[] = [];
    
    for (let i = 0; i < 5; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        showDates.push(date.toISOString().split('T')[0]);
    }

    // Define show times for different periods
    const morningShows = ['10:00', '11:30'];
    const afternoonShows = ['13:30', '15:00', '16:30'];
    const eveningShows = ['19:00', '19:30', '21:00', '21:30'];
    
    const allShowTimes = [...morningShows, ...afternoonShows, ...eveningShows];

    // Generate showtimes for each movie
    const sampleShowtimes = [];

    for (const movie of allMovies) {
        for (const showDate of showDates) {
            // Each movie gets 3-4 showtimes per day
            const dailyShowCount = Math.random() > 0.5 ? 3 : 4;
            
            // Randomly select show times for this day
            const shuffledTimes = [...allShowTimes].sort(() => Math.random() - 0.5);
            const selectedTimes = shuffledTimes.slice(0, dailyShowCount);

            for (let i = 0; i < selectedTimes.length; i++) {
                const showTime = selectedTimes[i];
                
                // Determine price based on show time (matinee vs evening)
                const hour = parseInt(showTime.split(':')[0]);
                let price: number;
                
                if (hour < 17) {
                    // Matinee pricing (before 5 PM)
                    price = Math.round((8.99 + Math.random() * 2) * 100) / 100;
                } else {
                    // Evening pricing (5 PM and later)
                    price = Math.round((12.99 + Math.random() * 3) * 100) / 100;
                }

                // Assign screen number (rotate through screens 1-5)
                const screenNumber = (i % 5) + 1;

                sampleShowtimes.push({
                    movieId: movie.id,
                    showDate: showDate,
                    showTime: showTime,
                    screenNumber: screenNumber,
                    totalSeats: 80,
                    availableSeats: 80,
                    price: price,
                    createdAt: new Date().toISOString(),
                });
            }
        }
    }

    await db.insert(showtimes).values(sampleShowtimes);
    
    console.log(`✅ Showtimes seeder completed successfully`);
    console.log(`   Created ${sampleShowtimes.length} showtimes for ${allMovies.length} movies across ${showDates.length} days`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});