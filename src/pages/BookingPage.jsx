import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Armchair, ChevronLeft, Calendar, Clock, Plus, Minus, Popcorn, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MOCK_CARDS } from "@/data/mockData";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [foodItems, setFoodItems] = useState([]);
  const [selectedFood, setSelectedFood] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showtimeRes = await fetch(`http://localhost:5000/showtimes/${id}`);
        if (!showtimeRes.ok) throw new Error("Showtime not found");
        const showtimeData = await showtimeRes.json();
        setShowtime(showtimeData);

        const movieRes = await fetch(`http://localhost:5000/movies/${showtimeData.movieId}`);
        if (!movieRes.ok) throw new Error("Movie not found");
        const movieData = await movieRes.json();
        setMovie(movieData);

        const bookingsRes = await fetch(`http://localhost:5000/bookings?showtimeId=${id}`);
        const bookingsData = await bookingsRes.json();
        const occupied = bookingsData.reduce((acc, booking) => {
          return [...acc, ...booking.seats];
        }, []);
        setOccupiedSeats(occupied);

        const foodRes = await fetch("http://localhost:5000/foodItems");
        if (foodRes.ok) {
          const foodData = await foodRes.json();
          setFoodItems(foodData);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load booking details");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const updateFoodQuantity = (itemId, change) => {
    setSelectedFood(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + change);

      if (newQty === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const calculateTotal = () => {
    const ticketTotal = selectedSeats.length * (showtime?.price || 0);
    const foodTotal = Object.entries(selectedFood).reduce((total, [itemId, qty]) => {
      const item = foodItems.find(f => f.id === itemId);
      return total + (item ? item.price * qty : 0);
    }, 0);
    return ticketTotal + foodTotal;
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book tickets");
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    setShowPaymentDialog(true);
  };

  const confirmBooking = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsBooking(true);

    try {
      const bookingData = {
        userId: user.id,
        showtimeId: parseInt(id),
        movieId: movie.id,
        seats: selectedSeats,
        foodItems: Object.entries(selectedFood).map(([itemId, quantity]) => ({
          id: itemId,
          quantity,
          price: foodItems.find(f => f.id === itemId)?.price || 0
        })),
        totalPrice: parseFloat(calculateTotal().toFixed(2)),
        bookingDate: new Date().toISOString(),
        paymentMethodId: selectedPaymentMethod,
        status: "confirmed"
      };

      const response = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const newBooking = await response.json();
        toast.success("Booking successful!");
        navigate(`/booking/success?id=${newBooking.id}`);
      } else {
        throw new Error("Booking failed");
      }

    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to complete booking. Please try again.");
    } finally {
      setIsBooking(false);
      setShowPaymentDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!showtime || !movie) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Seats</CardTitle>
              <CardDescription>Screen is located at the top</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted h-2 mb-12 rounded-full relative">
                <div className="absolute -bottom-6 w-full text-center text-xs text-muted-foreground uppercase tracking-widest">Screen</div>
              </div>

              <div className="flex flex-col gap-4 items-center overflow-x-auto pb-4">
                {ROWS.map(row => (
                  <div key={row} className="flex gap-4 items-center">
                    <div className="w-6 text-center font-medium text-sm text-muted-foreground">{row}</div>
                    <div className="flex gap-2">
                      {COLS.map(col => {
                        const seatId = `${row}${col}`;
                        const isOccupied = occupiedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeat(seatId)}
                            disabled={isOccupied}
                            className={`
                              w-8 h-8 rounded-t-lg transition-colors flex items-center justify-center text-xs
                              ${isOccupied
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : isSelected
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : "bg-secondary hover:bg-secondary/80 text-foreground"
                              }
                            `}
                            title={`Row ${row}, Seat ${col}`}
                          >
                            <Armchair className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-secondary rounded-t-lg" />
                  <span className="text-sm text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded-t-lg" />
                  <span className="text-sm text-muted-foreground">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted rounded-t-lg" />
                  <span className="text-sm text-muted-foreground">Occupied</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Popcorn className="h-5 w-5 text-primary" />
                Snacks & Drinks
              </CardTitle>
              <CardDescription>Add some refreshments to your movie experience</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {foodItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="text-primary font-medium mt-1">${item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateFoodQuantity(item.id, -1)}
                          disabled={!selectedFood[item.id]}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-4 text-center font-medium">
                          {selectedFood[item.id] || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateFoodQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg">{movie.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(showtime.showDate).toLocaleDateString()}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <Clock className="h-4 w-4" />
                  <span>{showtime.showTime}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Screen</span>
                  <span>{showtime.screenNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ticket Price</span>
                  <span>${showtime.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Selected Seats</span>
                  <span className="font-medium">
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                  </span>
                </div>
                {selectedSeats.length > 0 && (
                  <div className="flex justify-between text-sm font-medium pt-1">
                    <span>Tickets Total</span>
                    <span>${(selectedSeats.length * showtime.price).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {Object.keys(selectedFood).length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Extras</div>
                    {Object.entries(selectedFood).map(([itemId, qty]) => {
                      const item = foodItems.find(f => f.id === itemId);
                      if (!item) return null;
                      return (
                        <div key={itemId} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{qty}x {item.name}</span>
                          <span>${(item.price * qty).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <Separator />

              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || isBooking}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Select a payment method to complete your booking for {movie.title}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <div className="space-y-4">
                {MOCK_CARDS.map(card => (
                  <div key={card.id} className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedPaymentMethod(String(card.id))}>
                    <RadioGroupItem value={String(card.id)} id={`dialog-card-${card.id}`} />
                    <Label htmlFor={`dialog-card-${card.id}`} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{card.type} ending in {card.last4}</span>
                        <span className="text-sm text-muted-foreground">Expires {card.expiry}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{card.holder}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="mt-6 space-y-2 bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Tickets ({selectedSeats.length})</span>
                <span>${(selectedSeats.length * showtime.price).toFixed(2)}</span>
              </div>
              {Object.keys(selectedFood).length > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Snacks & Drinks</span>
                  <span>${(calculateTotal() - (selectedSeats.length * showtime.price)).toFixed(2)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total to Pay</span>
                <span className="text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)} disabled={isBooking}>Cancel</Button>
            <Button onClick={confirmBooking} disabled={!selectedPaymentMethod || isBooking}>
              {isBooking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay & Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
