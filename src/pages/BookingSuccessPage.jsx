import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader2, Calendar, MapPin, Ticket } from "lucide-react";
import { toast } from "sonner";

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("id");
  const isPaid = searchParams.get("status") === "paid";

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(!!bookingId);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`http://localhost:5000/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      }
    } catch (error) {
      console.error("Failed to load booking details");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
            <CardDescription>
              Your tickets have been sent to your email.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {booking && (
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Reference</p>
                    <p className="font-mono font-bold text-lg">{booking.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="font-bold text-xl text-primary">${booking.totalPrice}</p>
                  </div>
                </div>

                <Separator className="bg-background/50" />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{booking.seats?.length} Seats:</span>
                    <span>{booking.seats?.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {booking.foodItems && booking.foodItems.length > 0 && (
                  <>
                    <Separator className="bg-background/50" />
                    <div>
                      <p className="text-sm font-medium mb-2">Extras</p>
                      <ul className="text-sm space-y-1">
                        {booking.foodItems.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{item.quantity}x Item {item.id}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild className="flex-1">
                <Link to="/my-bookings">View Booking</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/">Book Another Movie</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
