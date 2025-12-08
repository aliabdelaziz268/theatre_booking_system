"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  MapPin,
  Loader2,
  Film,
  Ticket,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [bookings, setBookings] = useState([]);
  const [bookingsWithDetails, setBookingsWithDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/my-bookings");
      return;
    }

    if (session?.user) {
      fetchBookings();
    }
  }, [session, isPending]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      
      // Fetch user's bookings
      const response = await fetch(`/api/bookings/all?user_id=${session.user.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch bookings");
      
      const data = await response.json();
      setBookings(data);

      // Fetch details for each booking (showtime + movie)
      const detailsPromises = data.map(async (booking) => {
        try {
          const showtimeRes = await fetch(`/api/showtimes?id=${booking.showtimeId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          
          if (!showtimeRes.ok) return { ...booking, showtime: null, movie: null };
          
          const showtimeData = await showtimeRes.json();
          
          return {
            ...booking,
            showtime: showtimeData,
            movie: showtimeData.movie
          };
        } catch (error) {
          console.error('Error fetching booking details:', error);
          return { ...booking, showtime: null, movie: null };
        }
      });

      const details = await Promise.all(detailsPromises);
      setBookingsWithDetails(details);
      
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/bookings/${bookingToCancel.id}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to cancel booking");
      }

      toast.success("Booking cancelled successfully");
      setCancelDialogOpen(false);
      setBookingToCancel(null);
      
      // Refresh bookings
      await fetchBookings();
    } catch (error) {
      toast.error(error.message || "Failed to cancel booking");
      console.error(error);
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your movie ticket bookings
          </p>
        </div>

        {/* Payment Methods Link */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Ticket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Payment Methods</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your saved payment methods
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/payment-methods")}
              >
                Manage
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {bookingsWithDetails.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
                <Ticket className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                Start booking your favorite movies now!
              </p>
              <Button onClick={() => router.push("/")}>
                Browse Movies
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookingsWithDetails.map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Movie Poster */}
                    {booking.movie?.posterImage && (
                      <div className="relative w-full md:w-48 h-48 md:h-auto bg-muted">
                        <Image
                          src={booking.movie.posterImage}
                          alt={booking.movie.title || "Movie"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Booking Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">
                            {booking.movie?.title || "Movie Title"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Booking ID: #{booking.id}</span>
                            <span>•</span>
                            <span>{booking.movie?.duration} mins</span>
                            {booking.movie?.rating && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {booking.movie.rating}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>

                      {/* Showtime Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="font-medium">
                              {booking.showtime?.showDate ? formatDate(booking.showtime.showDate) : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Time</p>
                            <p className="font-medium">
                              {booking.showtime?.showTime ? formatTime(booking.showtime.showTime) : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Screen</p>
                            <p className="font-medium">
                              Screen {booking.showtime?.screenNumber || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Booking Summary */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Seats: </span>
                            <span className="font-semibold">{booking.totalSeats}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Payment: </span>
                            <span className="font-semibold capitalize">{booking.paymentMethod}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                          <p className="text-2xl font-bold">${booking.totalAmount}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/booking/success?id=${booking.id}`)}
                        >
                          View Details
                        </Button>
                        {booking.status === 'confirmed' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleCancelClick(booking)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {bookingToCancel && (
            <div className="py-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Movie:</span>
                  <span className="font-medium">{bookingToCancel.movie?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID:</span>
                  <span className="font-medium">#{bookingToCancel.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">${bookingToCancel.totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}