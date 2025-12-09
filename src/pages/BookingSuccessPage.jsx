import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader2, Calendar, MapPin, Ticket, CheckCircle2, Home } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("id");
  const isPaid = searchParams.get("status") === "paid";
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(!!bookingId);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      // Fetch booking with nested relations (showtime -> movie) if supported or manual fetch
      // json-server supports hierarchical expand: bookings/id?_expand=showtime
      // We also need movie. showtime -> movie.
      // fetch booking first
      const response = await fetch(`http://localhost:5000/bookings/${bookingId}?_expand=showtime`);
      if (response.ok) {
        let data = await response.json();

        // Fetch movie details if showtime exists
        if (data.showtime?.movieId) {
          const movieRes = await fetch(`http://localhost:5000/movies/${data.showtime.movieId}`);
          if (movieRes.ok) {
            const movieData = await movieRes.json();
            data.showtime.movie = movieData;
          }
        }

        // Fetch food item details if needed, though they might be embedded in booking.foodItems as plain objects
        // In the BookingPage we saved { id, quantity, price } so names might be missing unless we fetch them
        if (data.foodItems && data.foodItems.length > 0) {
          const foodRes = await fetch('http://localhost:5000/foodItems');
          const allFood = await foodRes.json();
          data.foodItems = data.foodItems.map(item => {
            const fullItem = allFood.find(f => f.id === item.id || f.id === parseInt(item.id));
            return { ...item, foodItem: fullItem };
          });
        }

        setBooking(data);
      }
    } catch (error) {
      console.error("Failed to load booking details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => timeString;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If coming from merchandise payment (no booking ID but paid status)
  if (isPaid && !bookingId) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="text-center pt-10 pb-6">
            <CardContent>
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6 animate-pulse" />
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your purchase. Your merchandise order has been processed successfully.
              </p>
              <Button size="lg" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
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
                {booking.status && (
                  <Badge className="text-base px-3 py-1 uppercase">
                    {booking.status}
                  </Badge>
                )}
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
                      <img
                        src={booking.showtime.movie.posterImage}
                        alt={booking.showtime.movie.title}
                        className="object-cover w-full h-full"
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
                  {/* Handle both array of strings (["A1"]) or array of objects if changed */}
                  {booking.seats && booking.seats.map((seat, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {typeof seat === 'object' ? `${seat.row}${seat.seatNumber}` : seat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Food Items */}
              {booking.foodItems && booking.foodItems.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Food & Beverages</h4>
                    <div className="space-y-2">
                      {booking.foodItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.foodItem?.name || `Item #${item.id}`} × {item.quantity}
                          </span>
                          <span className="font-medium">${((item.price || 0) * item.quantity).toFixed(2)}</span>
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
                      {booking.paymentMethodId ? booking.paymentMethodId.replace('_', ' ') : 'Card'}
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
                    <span className="text-primary">${booking.totalPrice}</span>
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
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/my-bookings")}
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
