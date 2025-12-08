"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, MapPin, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
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

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, isPending } = useSession();
  
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

  useEffect(() => {
    if (!isPending && !session) {
      router.push(`/login?redirect=/booking/${params.id}`);
      return;
    }
    
    if (session) {
      fetchShowtimeDetails();
      fetchSeats();
      fetchFoodItems();
    }

    // Clear booking when component unmounts
    return () => {
      // dispatch(clearCurrentBooking());
    };
  }, [params.id, session, isPending]);

  const fetchShowtimeDetails = async () => {
    try {
      const response = await fetch(`/api/showtimes?id=${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch showtime");
      
      const data = await response.json();
      setShowtime(data);
    } catch (error) {
      toast.error("Failed to load showtime details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSeats = async () => {
    try {
      const response = await fetch(`/api/seats?showtime_id=${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch seats");
      
      const data = await response.json();
      setSeats(data);
    } catch (error) {
      toast.error("Failed to load seats");
      console.error(error);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("/api/food-items?available=true&limit=50");
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

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsBooking(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const bookingData = {
        showtimeId: parseInt(params.id),
        totalSeats: selectedSeats.length,
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod,
        seatIds: selectedSeats.map(s => s.id),
        foodItems: Object.keys(selectedFood).map(foodId => ({
          foodItemId: parseInt(foodId),
          quantity: selectedFood[foodId]
        }))
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create booking");
      }

      const booking = await response.json();
      toast.success("Booking confirmed successfully!");
      dispatch(clearCurrentBooking());
      router.push(`/booking/success?id=${booking.id}`);
    } catch (error) {
      toast.error(error.message || "Failed to complete booking");
      console.error(error);
    } finally {
      setIsBooking(false);
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
        <Button onClick={() => router.push("/")}>Back to Home</Button>
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
          onClick={() => router.back()}
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
                      <Image
                        src={showtime.movie.posterImage}
                        alt={showtime.movie?.title || "Movie"}
                        fill
                        className="object-cover"
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

            {/* Payment Method */}
            <PaymentMethodSelector 
              selectedMethod={paymentMethod}
              onMethodSelect={handlePaymentMethodSelect}
            />
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
              onConfirmBooking={handleBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}