import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Ticket, Calendar, Clock, MapPin, Loader2, Film } from "lucide-react";
import { toast } from "sonner";

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/my-bookings");
      return;
    }

    const fetchData = async () => {
      try {
        const [bookingsRes, moviesRes, showtimesRes] = await Promise.all([
          fetch(`http://localhost:5000/bookings?userId=${user.id}`),
          fetch("http://localhost:5000/movies"),
          fetch("http://localhost:5000/showtimes")
        ]);

        if (!bookingsRes.ok || !moviesRes.ok || !showtimesRes.ok) throw new Error("Failed to fetch data");

        const bookingsData = await bookingsRes.json();
        const moviesData = await moviesRes.json();
        const showtimesData = await showtimesRes.json();

        setBookings(bookingsData.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)));
        setMovies(moviesData);
        setShowtimes(showtimesData);
      } catch (error) {
        console.error("Error loading bookings:", error);
        toast.error("Failed to load your bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getMovie = (movieId) => movies.find(m => m.id === String(movieId)) || movies.find(m => m.id === movieId);
  const getShowtime = (showtimeId) => showtimes.find(s => s.id === String(showtimeId)) || showtimes.find(s => s.id === showtimeId);

  const getShowDateTime = (showDate, showTime) => {
    if (!showDate || !showTime) return new Date();
    return new Date(`${showDate}T${showTime}`);
  };

  const handleCancelClick = (bookingId) => {
    setBookingToCancel(bookingId);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;

    try {
      const response = await fetch(`http://localhost:5000/bookings/${bookingToCancel}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== bookingToCancel));
        toast.success("Booking cancelled successfully");
      } else {
        throw new Error("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setBookingToCancel(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage your upcoming and past movie visits
            </p>
          </div>
          <Button asChild>
            <Link to="/">Book New Movie</Link>
          </Button>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
                <Ticket className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                Start booking your favorite movies now!
              </p>
              <Button asChild>
                <Link to="/">Browse Movies</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const movie = getMovie(booking.movieId);
              const showtime = getShowtime(booking.showtimeId);

              const bookingDateTime = showtime
                ? getShowDateTime(showtime.showDate, showtime.showTime)
                : new Date(booking.bookingDate);

              const isUpcoming = bookingDateTime > new Date();

              return (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-32 md:w-48 aspect-[2/3] sm:aspect-auto bg-muted relative">
                      {movie ? (
                        <img
                          src={movie.posterImage}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Film className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{movie?.title || "Unknown Movie"}</h3>
                            <p className="text-sm text-muted-foreground">Booking Ref: <span className="font-mono">{booking.id}</span></p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={isUpcoming ? "default" : "secondary"}>
                              {isUpcoming ? "Upcoming" : "Past"}
                            </Badge>
                            {isUpcoming && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelClick(booking.id)}
                              >
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{bookingDateTime.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{bookingDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Ticket className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.seats.length} Seats: {booking.seats.join(", ")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-bold text-primary">
                            <span>Total: ${booking.totalPrice}</span>
                          </div>
                        </div>

                        {booking.foodItems && booking.foodItems.length > 0 && (
                          <div className="bg-muted/50 p-3 rounded-md text-sm">
                            <span className="font-semibold mr-2">Extras:</span>
                            <span className="text-muted-foreground">
                              {booking.foodItems.map(f => `${f.quantity}x ${f.id}`).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Dialog open={!!bookingToCancel} onOpenChange={(open) => !open && setBookingToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingToCancel(null)}>Keep Booking</Button>
            <Button variant="destructive" onClick={confirmCancel}>Yes, Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
