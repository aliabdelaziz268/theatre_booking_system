import { db } from '@/db';
import { seats, showtimes } from '@/db/schema';

async function main() {
    // First, delete all existing seats
    await db.delete(seats);
    console.log('🗑️  Deleted all existing seats');

    // Query all showtimes
    const allShowtimes = await db.select().from(showtimes);
    console.log(`📊 Found ${allShowtimes.length} showtimes`);

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;
    const currentTimestamp = new Date().toISOString();

    let totalSeatsCreated = 0;

    // Generate seats for each showtime
    for (const showtime of allShowtimes) {
        const showtimeSeats = [];

        // Generate 80 seats (8 rows × 10 seats)
        for (const row of rows) {
            for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
                showtimeSeats.push({
                    showtimeId: showtime.id,
                    seatNumber: `${row}${seatNum}`,
                    row: row,
                    isBooked: false,
                    bookingId: null,
                    createdAt: currentTimestamp,
                });
            }
        }

        // Insert all seats for this showtime
        await db.insert(seats).values(showtimeSeats);
        totalSeatsCreated += showtimeSeats.length;
        
        console.log(`✅ Created ${showtimeSeats.length} seats for Showtime #${showtime.id}`);
    }

    console.log(`✅ Seats seeder completed successfully - Total seats created: ${totalSeatsCreated}`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
