"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2, Download, Home, Ticket } from "lucide-react";
import { toast } from "sonner";

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch booking");
      
      const data = await response.json();
      setBooking(data);
    } catch (error) {
      toast.error("Failed to load booking details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              Your tickets have been booked successfully
            </p>
          </div>

          {/* Booking Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Booking Details</CardTitle>
                <Badge className="text-base px-3 py-1">
                  {booking.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Booking ID: #{booking.id}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Movie Info */}
              {booking.showtime?.movie && (
                <div className="flex gap-4">
                  {booking.showtime.movie.posterImage && (
                    <div className="relative w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={booking.showtime.movie.posterImage}
                        alt={booking.showtime.movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {booking.showtime.movie.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge>{booking.showtime.movie.rating}</Badge>
                      <Badge variant="secondary">{booking.showtime.movie.genre}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>📅 {formatDate(booking.showtime.showDate)}</p>
                      <p>🕐 {formatTime(booking.showtime.showTime)}</p>
                      <p>🎬 Screen {booking.showtime.screenNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Seats */}
              <div>
                <h4 className="font-semibold mb-2">Selected Seats</h4>
                <div className="flex flex-wrap gap-2">
                  {booking.seats && booking.seats.map((seat) => (
                    <Badge key={seat.id} variant="secondary" className="text-sm">
                      {seat.row}{seat.seatNumber}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Total Seats: {booking.totalSeats}
                </p>
              </div>

              {/* Food Items */}
              {booking.foodItems && booking.foodItems.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Food & Beverages</h4>
                    <div className="space-y-2">
                      {booking.foodItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.foodItem?.name || `Item #${item.foodItemId}`} × {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Payment Details */}
              <div>
                <h4 className="font-semibold mb-3">Payment Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize">
                      {booking.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking Date</span>
                    <span className="font-medium">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">${booking.totalAmount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push("/")}
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
            <Button 
              size="lg"
              onClick={() => router.push("/my-bookings")}
            >
              <Ticket className="mr-2 h-5 w-5" />
              View All Bookings
            </Button>
          </div>

          {/* Additional Info */}
          <Card className="mt-6 bg-muted/50">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground text-center">
                💡 Please arrive at the theatre at least 15 minutes before showtime. 
                Show your booking ID at the counter to collect your tickets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}