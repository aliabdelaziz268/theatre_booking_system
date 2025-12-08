import { NextResponse } from 'next/server';
import { db } from '@/db';
import { seats } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const showtimeId = searchParams.get('showtime_id');

    // Single seat by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: 'Valid ID is required',
            code: 'INVALID_ID' 
          },
          { status: 400 }
        );
      }

      const seat = await db.select()
        .from(seats)
        .where(eq(seats.id, parseInt(id)))
        .limit(1);

      if (seat.length === 0) {
        return NextResponse.json(
          { 
            error: 'Seat not found',
            code: 'SEAT_NOT_FOUND' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json(seat[0], { status: 200 });
    }

    // List seats for a showtime
    if (!showtimeId) {
      return NextResponse.json(
        { 
          error: 'Showtime ID is required',
          code: 'SHOWTIME_ID_REQUIRED' 
        },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(showtimeId))) {
      return NextResponse.json(
        { 
          error: 'Valid showtime ID is required',
          code: 'INVALID_SHOWTIME_ID' 
        },
        { status: 400 }
      );
    }

    const seatsList = await db.select()
      .from(seats)
      .where(eq(seats.showtimeId, parseInt(showtimeId)))
      .orderBy(asc(seats.row), asc(seats.seatNumber));

    return NextResponse.json(seatsList, { status: 200 });

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

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          error: 'ID is required',
          code: 'ID_REQUIRED' 
        },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Extract only allowed fields for update
    const allowedFields = {};
    
    if ('isBooked' in body || 'is_booked' in body) {
      allowedFields.isBooked = body.isBooked ?? body.is_booked;
    }
    
    if ('bookingId' in body || 'booking_id' in body) {
      allowedFields.bookingId = body.bookingId ?? body.booking_id;
    }

    // Check if seat exists
    const existingSeat = await db.select()
      .from(seats)
      .where(eq(seats.id, parseInt(id)))
      .limit(1);

    if (existingSeat.length === 0) {
      return NextResponse.json(
        { 
          error: 'Seat not found',
          code: 'SEAT_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const updated = await db.update(seats)
      .set(allowedFields)
      .where(eq(seats.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to update seat',
          code: 'UPDATE_FAILED' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });

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
