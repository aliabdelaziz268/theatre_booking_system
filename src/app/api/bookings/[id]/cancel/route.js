import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, seats } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request, { params }) {
  try {
    const bookingId = parseInt(params.id);
    
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    // Get session from better-auth
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the booking
    const [booking] = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.id, bookingId),
          eq(bookings.userId, session.user.id)
        )
      )
      .limit(1);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if booking is already cancelled
    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    await db
      .update(bookings)
      .set({ 
        status: "cancelled",
        updatedAt: new Date()
      })
      .where(eq(bookings.id, bookingId));

    // Free up the seats by setting isBooked to false
    // First, get all seat IDs from booking_seats table
    const bookingSeats = await db.query.bookingSeats.findMany({
      where: (bookingSeats, { eq }) => eq(bookingSeats.bookingId, bookingId)
    });

    if (bookingSeats.length > 0) {
      const seatIds = bookingSeats.map(bs => bs.seatId);
      
      // Update seats to be available again
      for (const seatId of seatIds) {
        await db
          .update(seats)
          .set({ isBooked: false })
          .where(eq(seats.id, seatId));
      }
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
