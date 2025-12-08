import { NextResponse } from 'next/server';
import { db } from '@/db';
import { showtimes, movies } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single showtime by ID with movie details
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const showtime = await db
        .select({
          id: showtimes.id,
          movieId: showtimes.movieId,
          showDate: showtimes.showDate,
          showTime: showtimes.showTime,
          screenNumber: showtimes.screenNumber,
          totalSeats: showtimes.totalSeats,
          availableSeats: showtimes.availableSeats,
          price: showtimes.price,
          createdAt: showtimes.createdAt,
          movie: {
            id: movies.id,
            title: movies.title,
            description: movies.description,
            duration: movies.duration,
            genre: movies.genre,
            rating: movies.rating,
            posterImage: movies.posterImage,
            trailerUrl: movies.trailerUrl,
            releaseDate: movies.releaseDate,
          },
        })
        .from(showtimes)
        .leftJoin(movies, eq(showtimes.movieId, movies.id))
        .where(eq(showtimes.id, parseInt(id)))
        .limit(1);

      if (showtime.length === 0) {
        return NextResponse.json(
          { error: 'Showtime not found', code: 'SHOWTIME_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(showtime[0], { status: 200 });
    }

    // List showtimes with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const movieId = searchParams.get('movie_id');
    const date = searchParams.get('date');
    const screenNumber = searchParams.get('screen_number');

    let query = db.select().from(showtimes);

    // Build filter conditions
    const conditions = [];
    if (movieId) {
      conditions.push(eq(showtimes.movieId, parseInt(movieId)));
    }
    if (date) {
      conditions.push(eq(showtimes.showDate, date));
    }
    if (screenNumber) {
      conditions.push(eq(showtimes.screenNumber, parseInt(screenNumber)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(showtimes.showDate), desc(showtimes.showTime))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { movieId, showDate, showTime, screenNumber, totalSeats, price } = body;

    // Validate required fields
    if (!movieId) {
      return NextResponse.json(
        { error: 'movieId is required', code: 'MISSING_MOVIE_ID' },
        { status: 400 }
      );
    }
    if (!showDate) {
      return NextResponse.json(
        { error: 'showDate is required', code: 'MISSING_SHOW_DATE' },
        { status: 400 }
      );
    }
    if (!showTime) {
      return NextResponse.json(
        { error: 'showTime is required', code: 'MISSING_SHOW_TIME' },
        { status: 400 }
      );
    }
    if (!screenNumber) {
      return NextResponse.json(
        { error: 'screenNumber is required', code: 'MISSING_SCREEN_NUMBER' },
        { status: 400 }
      );
    }
    if (!totalSeats) {
      return NextResponse.json(
        { error: 'totalSeats is required', code: 'MISSING_TOTAL_SEATS' },
        { status: 400 }
      );
    }
    if (!price) {
      return NextResponse.json(
        { error: 'price is required', code: 'MISSING_PRICE' },
        { status: 400 }
      );
    }

    // Validate movieId references existing movie
    const movie = await db
      .select()
      .from(movies)
      .where(eq(movies.id, parseInt(movieId)))
      .limit(1);

    if (movie.length === 0) {
      return NextResponse.json(
        { error: 'Movie not found with provided movieId', code: 'MOVIE_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (isNaN(parseInt(movieId)) || isNaN(parseInt(screenNumber)) || isNaN(parseInt(totalSeats)) || isNaN(parseInt(price))) {
      return NextResponse.json(
        { error: 'movieId, screenNumber, totalSeats, and price must be valid numbers', code: 'INVALID_NUMERIC_FIELDS' },
        { status: 400 }
      );
    }

    // Create new showtime
    const newShowtime = await db
      .insert(showtimes)
      .values({
        movieId: parseInt(movieId),
        showDate: showDate.trim(),
        showTime: showTime.trim(),
        screenNumber: parseInt(screenNumber),
        totalSeats: parseInt(totalSeats),
        availableSeats: parseInt(totalSeats), // Auto-set to totalSeats
        price: parseInt(price),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newShowtime[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if showtime exists
    const existing = await db
      .select()
      .from(showtimes)
      .where(eq(showtimes.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Showtime not found', code: 'SHOWTIME_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Prepare update object with only provided fields
    const updates = {};

    if (body.movieId !== undefined) {
      // Validate movieId references existing movie
      const movie = await db
        .select()
        .from(movies)
        .where(eq(movies.id, parseInt(body.movieId)))
        .limit(1);

      if (movie.length === 0) {
        return NextResponse.json(
          { error: 'Movie not found with provided movieId', code: 'MOVIE_NOT_FOUND' },
          { status: 400 }
        );
      }
      updates.movieId = parseInt(body.movieId);
    }
    if (body.showDate !== undefined) {
      updates.showDate = body.showDate.trim();
    }
    if (body.showTime !== undefined) {
      updates.showTime = body.showTime.trim();
    }
    if (body.screenNumber !== undefined) {
      updates.screenNumber = parseInt(body.screenNumber);
    }
    if (body.totalSeats !== undefined) {
      updates.totalSeats = parseInt(body.totalSeats);
    }
    if (body.availableSeats !== undefined) {
      updates.availableSeats = parseInt(body.availableSeats);
    }
    if (body.price !== undefined) {
      updates.price = parseInt(body.price);
    }

    // Don't allow updating id or createdAt
    delete updates.id;
    delete updates.createdAt;

    // Update showtime
    const updated = await db
      .update(showtimes)
      .set(updates)
      .where(eq(showtimes.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if showtime exists
    const existing = await db
      .select()
      .from(showtimes)
      .where(eq(showtimes.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Showtime not found', code: 'SHOWTIME_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete showtime
    const deleted = await db
      .delete(showtimes)
      .where(eq(showtimes.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Showtime deleted successfully',
        deletedShowtime: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
