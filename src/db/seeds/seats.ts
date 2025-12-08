import { db } from '@/db';
import { seats, showtimes } from '@/db/schema';

async function main() {
    // First, get all showtime IDs from the database
    const allShowtimes = await db.select({ id: showtimes.id }).from(showtimes);
    
    if (allShowtimes.length === 0) {
        console.log('⚠️ No showtimes found. Please seed showtimes first.');
        return;
    }

    console.log(`📊 Found ${allShowtimes.length} showtimes. Creating 80 seats for each...`);

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;
    const sampleSeats = [];

    // Create 80 seats for each showtime
    for (const showtime of allShowtimes) {
        for (const row of rows) {
            for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
                sampleSeats.push({
                    showtimeId: showtime.id,
                    seatNumber: seatNum.toString(),
                    row: row,
                    isBooked: 0,
                    bookingId: null,
                    createdAt: new Date().toISOString()
                });
            }
        }
    }

    // Insert all seats in batches for better performance
    const batchSize = 500;
    for (let i = 0; i < sampleSeats.length; i += batchSize) {
        const batch = sampleSeats.slice(i, i + batchSize);
        await db.insert(seats).values(batch);
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sampleSeats.length / batchSize)}`);
    }
    
    console.log(`✅ Seats seeder completed successfully. Created ${sampleSeats.length} seats (${allShowtimes.length} showtimes × 80 seats)`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});