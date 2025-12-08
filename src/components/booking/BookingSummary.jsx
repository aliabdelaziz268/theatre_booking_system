"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function BookingSummary({
  showtime,
  selectedSeats,
  selectedFood,
  foodItems,
  paymentMethod,
  isBooking,
  onConfirmBooking
}) {
  const calculateTotal = () => {
    const seatsTotal = selectedSeats.length * (showtime?.price || 0);
    const foodTotal = Object.keys(selectedFood).reduce((total, foodId) => {
      const food = foodItems.find(f => f.id === parseInt(foodId));
      return total + (food?.price || 0) * selectedFood[foodId];
    }, 0);
    return seatsTotal + foodTotal;
  };

  const seatsTotal = selectedSeats.length * (showtime?.price || 0);
  const foodTotal = Object.keys(selectedFood).reduce((total, foodId) => {
    const food = foodItems.find(f => f.id === parseInt(foodId));
    return total + (food?.price || 0) * selectedFood[foodId];
  }, 0);
  const totalAmount = calculateTotal();

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Seats */}
        {selectedSeats.length > 0 ? (
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">SELECTED SEATS</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSeats.map(seat => (
                <Badge key={seat.id} variant="secondary" className="text-sm">
                  {seat.row}{seat.seatNumber}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {selectedSeats.length} {selectedSeats.length === 1 ? 'Ticket' : 'Tickets'} × ${showtime?.price}
              </span>
              <span className="font-semibold">
                ${seatsTotal}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No seats selected</p>
          </div>
        )}

        {/* Selected Food */}
        {Object.keys(selectedFood).length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3 text-sm text-muted-foreground">FOOD & BEVERAGES</h4>
              <div className="space-y-2">
                {Object.keys(selectedFood).map(foodId => {
                  const food = foodItems.find(f => f.id === parseInt(foodId));
                  const quantity = selectedFood[foodId];
                  if (!food) return null;
                  return (
                    <div key={foodId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {food.name} × {quantity}
                      </span>
                      <span className="font-semibold">
                        ${(food.price || 0) * quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-sm mt-3 pt-2 border-t">
                <span className="text-muted-foreground">Food Subtotal</span>
                <span className="font-semibold">${foodTotal}</span>
              </div>
            </div>
          </>
        )}

        {/* Payment Method */}
        {paymentMethod && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2 text-sm text-muted-foreground">PAYMENT METHOD</h4>
              <Badge variant="outline" className="capitalize">
                {paymentMethod.replace('_', ' ')}
              </Badge>
            </div>
          </>
        )}

        {/* Total */}
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">${totalAmount}</span>
          </div>
          
          {selectedSeats.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Including all taxes and fees
            </p>
          )}
        </div>

        {/* Booking Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={onConfirmBooking}
          disabled={selectedSeats.length === 0 || !paymentMethod || isBooking}
        >
          {isBooking ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Confirm Booking - ${totalAmount}
            </>
          )}
        </Button>

        {/* Validation Messages */}
        {selectedSeats.length === 0 && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Please select at least one seat to continue</span>
          </div>
        )}
        
        {selectedSeats.length > 0 && !paymentMethod && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Please select a payment method</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
