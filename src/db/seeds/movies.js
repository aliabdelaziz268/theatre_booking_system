import { db } from '@/db';
import { movies } from '@/db/schema';

async function main() {
    const sampleMovies = [
        {
            title: 'Avengers: Endgame',
            description: 'The epic conclusion to the Infinity Saga that will forever change the Marvel Cinematic Universe.',
            duration: 181,
            genre: 'Action',
            rating: 'PG-13',
            posterImage: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
            releaseDate: '2019-04-26',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'The Dark Knight',
            description: 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.',
            duration: 152,
            genre: 'Action',
            rating: 'PG-13',
            posterImage: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
            releaseDate: '2008-07-18',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'Inception',
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
            duration: 148,
            genre: 'Sci-Fi',
            rating: 'PG-13',
            posterImage: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
            releaseDate: '2010-07-16',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'Parasite',
            description: 'A poor family schemes to become employed by a wealthy family and infiltrate their household by posing as unrelated, highly qualified individuals.',
            duration: 132,
            genre: 'Drama',
            rating: 'R',
            posterImage: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
            releaseDate: '2019-05-30',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'Get Out',
            description: 'A young African-American visits his white girlfriend\'s parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.',
            duration: 104,
            genre: 'Horror',
            rating: 'R',
            posterImage: 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=DzfpyUB60YY',
            releaseDate: '2017-02-24',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'Interstellar',
            description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            duration: 169,
            genre: 'Sci-Fi',
            rating: 'PG-13',
            posterImage: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
            releaseDate: '2014-11-07',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'The Shawshank Redemption',
            description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            duration: 142,
            genre: 'Drama',
            rating: 'R',
            posterImage: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
            releaseDate: '1994-09-23',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'Pulp Fiction',
            description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
            duration: 154,
            genre: 'Drama',
            rating: 'R',
            posterImage: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
            releaseDate: '1994-10-14',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'The Hangover',
            description: 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.',
            duration: 100,
            genre: 'Comedy',
            rating: 'R',
            posterImage: 'https://image.tmdb.org/t/p/w500/qxNsQLHl5XHJzpqukBmOoMRWius.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=tcdUhdOlz9M',
            releaseDate: '2009-06-05',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'A Quiet Place',
            description: 'A family struggles to survive in a world inhabited by blind but noise-sensitive monsters with ultra-sensitive hearing.',
            duration: 90,
            genre: 'Horror',
            rating: 'PG-13',
            posterImage: 'https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=WR7cc5t7tv8',
            releaseDate: '2018-04-06',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(movies).values(sampleMovies);
    
    console.log('✅ Movies seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
