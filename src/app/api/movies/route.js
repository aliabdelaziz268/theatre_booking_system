import { NextResponse } from 'next/server';
import { db } from '@/db';
import { movies } from '@/db/schema';
import { eq, like, and, desc } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single movie by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: 'Valid ID is required',
            code: 'INVALID_ID' 
          },
          { status: 400 }
        );
      }

      const movie = await db.select()
        .from(movies)
        .where(eq(movies.id, parseInt(id)))
        .limit(1);

      if (movie.length === 0) {
        return NextResponse.json(
          { 
            error: 'Movie not found',
            code: 'MOVIE_NOT_FOUND' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json(movie[0], { status: 200 });
    }

    // List movies with pagination, filtering, and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const genre = searchParams.get('genre');
    const rating = searchParams.get('rating');

    let query = db.select().from(movies);

    // Build filter conditions
    const conditions = [];

    if (search) {
      conditions.push(like(movies.title, `%${search}%`));
    }

    if (genre) {
      conditions.push(eq(movies.genre, genre));
    }

    if (rating) {
      conditions.push(eq(movies.rating, rating));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(movies.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'duration', 'genre', 'rating', 'releaseDate'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Validate duration is a positive number
    if (isNaN(parseInt(body.duration)) || parseInt(body.duration) <= 0) {
      return NextResponse.json(
        { 
          error: 'Duration must be a positive number',
          code: 'INVALID_DURATION' 
        },
        { status: 400 }
      );
    }

    // Sanitize string inputs
    const sanitizedData = {
      title: body.title.trim(),
      description: body.description ? body.description.trim() : null,
      duration: parseInt(body.duration),
      genre: body.genre.trim(),
      rating: body.rating.trim(),
      posterImage: body.posterImage ? body.posterImage.trim() : null,
      trailerUrl: body.trailerUrl ? body.trailerUrl.trim() : null,
      releaseDate: body.releaseDate.trim(),
      createdAt: new Date().toISOString()
    };

    const newMovie = await db.insert(movies)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newMovie[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error.message 
      },
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
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    // Check if movie exists
    const existingMovie = await db.select()
      .from(movies)
      .where(eq(movies.id, parseInt(id)))
      .limit(1);

    if (existingMovie.length === 0) {
      return NextResponse.json(
        { 
          error: 'Movie not found',
          code: 'MOVIE_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Prepare update data (exclude id and createdAt)
    const updateData = {};

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description ? body.description.trim() : null;
    if (body.duration !== undefined) {
      const duration = parseInt(body.duration);
      if (isNaN(duration) || duration <= 0) {
        return NextResponse.json(
          { 
            error: 'Duration must be a positive number',
            code: 'INVALID_DURATION' 
          },
          { status: 400 }
        );
      }
      updateData.duration = duration;
    }
    if (body.genre !== undefined) updateData.genre = body.genre.trim();
    if (body.rating !== undefined) updateData.rating = body.rating.trim();
    if (body.posterImage !== undefined) updateData.posterImage = body.posterImage ? body.posterImage.trim() : null;
    if (body.trailerUrl !== undefined) updateData.trailerUrl = body.trailerUrl ? body.trailerUrl.trim() : null;
    if (body.releaseDate !== undefined) updateData.releaseDate = body.releaseDate.trim();

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { 
          error: 'No valid fields to update',
          code: 'NO_FIELDS_TO_UPDATE' 
        },
        { status: 400 }
      );
    }

    const updatedMovie = await db.update(movies)
      .set(updateData)
      .where(eq(movies.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedMovie[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error.message 
      },
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
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    // Check if movie exists
    const existingMovie = await db.select()
      .from(movies)
      .where(eq(movies.id, parseInt(id)))
      .limit(1);

    if (existingMovie.length === 0) {
      return NextResponse.json(
        { 
          error: 'Movie not found',
          code: 'MOVIE_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const deletedMovie = await db.delete(movies)
      .where(eq(movies.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { 
        message: 'Movie deleted successfully',
        movie: deletedMovie[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error.message 
      },
      { status: 500 }
    );
  }
}
