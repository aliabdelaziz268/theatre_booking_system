import { NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse pagination parameters
    const limit = Math.min(
      parseInt(searchParams.get('limit') ?? '10'),
      100
    );
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Parse filter parameters
    const status = searchParams.get('status');
    const userId = searchParams.get('user_id');

    // Build query with filters
    let query = db.select().from(bookings);

    // Apply filters
    const filters = [];
    if (status) {
      filters.push(eq(bookings.status, status));
    }
    if (userId) {
      filters.push(eq(bookings.userId, userId));
    }

    if (filters.length > 0) {
      query = query.where(and(...filters));
    }

    // Apply ordering and pagination
    const results = await query
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
