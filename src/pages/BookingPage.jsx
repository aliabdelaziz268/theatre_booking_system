import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, MapPin, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import SeatSelector from "@/components/booking/SeatSelector";
import FoodSelector from "@/components/booking/FoodSelector";
import PaymentMethodSelector from "@/components/booking/PaymentMethodSelector";
import BookingSummary from "@/components/booking/BookingSummary";
import {
  toggleSeatSelection,
  updateFoodQuantity,
  setPaymentMethod,
  clearCurrentBooking,
  selectSelectedSeats,
  selectSelectedFood,
  selectPaymentMethod,
} from "@/store/slices/bookingSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading: isPending } = useAuth();

  // Redux state
  const selectedSeats = useSelector(selectSelectedSeats);
  const selectedFood = useSelector(selectSelectedFood);
  const paymentMethod = useSelector(selectPaymentMethod);

  // Local state
  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      navigate(`/login?redirect=/booking/${id}`);
      return;
    }

    if (user) {
      fetchShowtimeDetails();
      fetchSeats();
      fetchFoodItems();
    }

    // Clear booking when component unmounts
    return () => {
      // dispatch(clearCurrentBooking());
    };
  }, [id, user, isPending]);

  const fetchShowtimeDetails = async () => {
    try {
      // Using json-server directly. Note: json-server returns an array when filtering, or object if getting by id directly via path
      // Filter by id query param returns generic array, getting /showtimes/id returns object
      const response = await fetch(`http://localhost:5000/showtimes/${id}`);
      if (!response.ok) throw new Error("Failed to fetch showtime");

      const data = await response.json();
      // Ensure we get the movie details. json-server doesn't always expand relations by default unless ?_expand=movie is used
      // Let's refetch movie if needed or check if it's included.
      // Based on db.json, showtimes have movieId. We might need to fetch movie separately or use expand.
      // Trying expand first:
      const expandResponse = await fetch(`http://localhost:5000/showtimes/${id}?_expand=movie`);
      if (expandResponse.ok) {
        const expandedData = await expandResponse.json();
        // If json-server supports it, we get movie object inside.
        // If not, we might need manual fetch.
        if (expandedData.movie) {
          setShowtime(expandedData);
          return;
        }
      }

      // Fallback: Fetch movie manually
      if (data.movieId) {
        const movieRes = await fetch(`http://localhost:5000/movies/${data.movieId}`);
        const movieData = await movieRes.json();
        setShowtime({ ...data, movie: movieData });
      } else {
        setShowtime(data);
      }

    } catch (error) {
      toast.error("Failed to load showtime details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSeats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/seats?showtimeId=${id}`);
      if (!response.ok) throw new Error("Failed to fetch seats");

      let data = await response.json();

      // If no seats exist in DB for this showtime, generate default layout
      if (data.length === 0) {
        data = generateDefaultSeats();
      }

      setSeats(data);
    } catch (error) {
      toast.error("Using default seat layout");
      setSeats(generateDefaultSeats());
    }
  };

  const generateDefaultSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 8;
    const generatedSeats = [];

    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        generatedSeats.push({
          id: `${id}-${row}${i}`, // Virtual ID
          showtimeId: parseInt(id),
          seatNumber: `${row}${i}`,
          row: row,
          column: i,
          seatType: rowIndex > 5 ? 'premium' : 'regular',
          price: rowIndex > 5 ? 14.99 : 12.99,
          isBooked: Math.random() < 0.2 // Randomly book some seats for realism
        });
      }
    });
    return generatedSeats;
  };

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/foodItems?available=true&_limit=50");
      if (!response.ok) throw new Error("Failed to fetch food items");

      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      console.error("Failed to load food items:", error);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) {
      toast.error("This seat is already booked");
      return;
    }
    dispatch(toggleSeatSelection(seat));
  };

  const handleFoodQuantityChange = (foodItem, delta) => {
    const currentQty = selectedFood[foodItem.id] || 0;
    const newQty = Math.max(0, currentQty + delta);
    dispatch(updateFoodQuantity({ foodId: foodItem.id, quantity: newQty }));
  };

  const handlePaymentMethodSelect = (method) => {
    dispatch(setPaymentMethod(method));
  };

  const calculateTotal = () => {
    const seatsTotal = selectedSeats.length * (showtime?.price || 0);
    const foodTotal = Object.keys(selectedFood).reduce((total, foodId) => {
      const food = foodItems.find(f => f.id === parseInt(foodId));
      return total + (food?.price || 0) * selectedFood[foodId];
    }, 0);
    return seatsTotal + foodTotal;
  };

  const handleInitialConfirm = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    setIsPaymentDialogOpen(true);
  };

  const handleFinalBooking = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsBooking(true);
    try {
      const token = localStorage.getItem("bearer_token"); // Still used for logic if needed, but not for json-server auth usually unless using custom middleware
      const bookingData = {
        userId: user.id || "guest", // Ensure userId is present
        showtimeId: parseInt(id),
        // movieId... will be inferred or we can add it if needed for stats
        movieId: showtime.movieId,
        seats: selectedSeats.map(s => s.seatNumber), // Or just IDs? db.json showed ["A1", "A2"]
        seatIds: selectedSeats.map(s => s.id), // Keeping track of IDs might be useful
        foodItems: Object.keys(selectedFood).map(foodId => ({
          id: foodId, // db.json used "id" inside foodItems array but schema might vary. Let's send what matches db.json 'bookings' example.
          // Example in db.json: { id: "2", quantity: 1, price: 4.99 }
          quantity: selectedFood[foodId],
          price: foodItems.find(f => f.id === parseInt(foodId))?.price || 0
        })),
        totalPrice: calculateTotal(),
        bookingDate: new Date().toISOString(),
        paymentMethodId: paymentMethod,
        status: "confirmed"
      };

      const response = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}` // json-server doesn't check this by default but good to keep
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const booking = await response.json();
      toast.success("Booking confirmed successfully!");
      dispatch(clearCurrentBooking());
      setIsPaymentDialogOpen(false);
      navigate(`/booking/success?id=${booking.id}`);
    } catch (error) {
      toast.error(error.message || "Failed to complete booking");
      console.error(error);
    } finally {
      setIsBooking(false);
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

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Showtime not found</h1>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {showtime.movie?.posterImage && (
                    <div className="relative w-28 h-40 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={showtime.movie.posterImage}
                        alt={showtime.movie?.title || "Movie"}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="space-y-3 flex-1">
                    <h2 className="text-2xl font-bold">{showtime.movie?.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="text-sm">{showtime.movie?.rating}</Badge>
                      <Badge variant="secondary" className="text-sm">{showtime.movie?.genre}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(showtime.showDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{showtime.showTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Screen {showtime.screenNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seat Selection */}
            <SeatSelector
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />

            {/* Food Selection */}
            <FoodSelector
              foodItems={foodItems}
              selectedFood={selectedFood}
              onFoodQuantityChange={handleFoodQuantityChange}
            />

            {/* REMOVED PaymentMethodSelector from here */}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              showtime={showtime}
              selectedSeats={selectedSeats}
              selectedFood={selectedFood}
              foodItems={foodItems}
              paymentMethod={paymentMethod}
              isBooking={isBooking}
              onConfirmBooking={handleInitialConfirm}
            />
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Select your preferred payment method to complete the booking.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodSelect={handlePaymentMethodSelect}
            />
            <div className="mt-4 flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleFinalBooking} disabled={!paymentMethod || isBooking}>
              {isBooking ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                </>
              ) : (
                "Pay & Book"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
