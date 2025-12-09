"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SeatSelector({ seats, selectedSeats, onSeatClick }) {
  const groupSeatsByRow = () => {
    const grouped = {};
    seats.forEach(seat => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = [];
      }
      grouped[seat.row].push(seat);
    });
    return grouped;
  };

  const groupedSeats = groupSeatsByRow();
  const sortedRows = Object.keys(groupedSeats).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
        <div className="flex items-center gap-4 text-sm mt-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-primary rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            <span>Booked</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Screen */}
        <div className="mb-8">
          <div className="h-2 bg-gradient-to-b from-primary/50 to-transparent rounded-t-full mb-2"></div>
          <p className="text-center text-sm text-muted-foreground font-medium">SCREEN</p>
        </div>

        {/* Seats Grid */}
        <div className="space-y-4 overflow-x-auto pb-4 ">
          {sortedRows.map(row => (
            <div key={row} className="flex items-center gap-2">
              <div className="w-10 text-center font-bold text-sm text-muted-foreground">{row}</div>
              <div className="flex gap-2 flex-wrap mt-2 ">
                {groupedSeats[row]
                  .sort((a, b) => {
                    const numA = parseInt(a.seatNumber.replace(/\D/g, '')) || 0;
                    const numB = parseInt(b.seatNumber.replace(/\D/g, '')) || 0;
                    return numA - numB;
                  })
                  .map(seat => {
                    const isSelected = selectedSeats.find(s => s.id === seat.id);
                    return (
                      <button
                        key={seat.id}
                        onClick={() => onSeatClick(seat)}
                        disabled={seat.isBooked}
                        className={`
                          w-10 h-10 rounded text-xs font-semibold transition-all transform hover:scale-110
                          ${seat.isBooked
                            ? 'bg-yellow-500 cursor-not-allowed opacity-80 text-yellow-900'
                            : isSelected
                              ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                              : 'border-2 border-primary hover:bg-primary/20 hover:border-primary/80'
                          }
                        `}
                        title={seat.isBooked ? 'Already Booked' : `${seat.row}${seat.seatNumber}`}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend for mobile */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Click on available seats to select. Yellow seats are already booked.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
