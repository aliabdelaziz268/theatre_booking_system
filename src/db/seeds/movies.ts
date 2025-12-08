import { db } from '@/db';
import { movies } from '@/db/schema';

async function main() {
    const sampleMovies = [
        {
            title: 'Inception',
            description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. Dom Cobb must navigate through layers of dreams to complete his mission.',
            duration: 148,
            genre: 'Sci-Fi',
            rating: 'PG-13',
            releaseDate: '2023-07-16',
            posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'The Shawshank Redemption',
            description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. A timeless tale of hope and friendship behind bars.',
            duration: 142,
            genre: 'Drama',
            rating: 'R',
            releaseDate: '2023-09-23',
            posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Guardians of the Galaxy Vol. 3',
            description: 'Peter Quill and his team embark on a dangerous mission to protect one of their own. The Guardians must band together to defend the universe and each other in this thrilling conclusion.',
            duration: 150,
            genre: 'Action',
            rating: 'PG-13',
            releaseDate: '2024-05-05',
            posterUrl: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'The Conjuring',
            description: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse. Based on true events that will haunt you forever.',
            duration: 112,
            genre: 'Horror',
            rating: 'R',
            releaseDate: '2023-10-31',
            posterUrl: 'https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'La La Land',
            description: 'A jazz pianist and an aspiring actress fall in love while pursuing their dreams in Los Angeles. A modern musical that celebrates the dreamers and the joy of following your passion.',
            duration: 128,
            genre: 'Romance',
            rating: 'PG-13',
            releaseDate: '2024-02-14',
            posterUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Jurassic World Dominion',
            description: 'Four years after Isla Nublar was destroyed, dinosaurs now live and hunt alongside humans all over the world. This fragile balance will reshape the future and determine if humans remain the apex predators.',
            duration: 147,
            genre: 'Adventure',
            rating: 'PG-13',
            releaseDate: '2023-06-10',
            posterUrl: 'https://image.tmdb.org/t/p/w500/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Knives Out',
            description: 'A detective investigates the death of a patriarch of an eccentric, combative family. When a wealthy crime novelist is found dead, the investigation leads to a surprising revelation.',
            duration: 130,
            genre: 'Thriller',
            rating: 'PG-13',
            releaseDate: '2023-11-27',
            posterUrl: 'https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'The Grand Budapest Hotel',
            description: 'The adventures of Gustave H, a legendary concierge at a famous hotel, and Zero Moustafa, the lobby boy who becomes his most trusted friend. A whimsical tale set in a fictional European country.',
            duration: 99,
            genre: 'Comedy',
            rating: 'R',
            releaseDate: '2024-03-07',
            posterUrl: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Spider-Man: Across the Spider-Verse',
            description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. An epic animated adventure that pushes boundaries.',
            duration: 140,
            genre: 'Action',
            rating: 'PG',
            releaseDate: '2024-06-02',
            posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Oppenheimer',
            description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II. A gripping biographical thriller about one of history\'s most pivotal moments.',
            duration: 180,
            genre: 'Drama',
            rating: 'R',
            releaseDate: '2024-07-21',
            posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(movies).values(sampleMovies);
    
    console.log('✅ Movies seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});