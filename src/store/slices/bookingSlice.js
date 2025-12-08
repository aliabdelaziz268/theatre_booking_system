import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentBooking: {
    showtimeId: null,
    movieDetails: null,
    selectedSeats: [],
    selectedFood: {},
    paymentMethod: null,
    totalAmount: 0,
  },
  bookingHistory: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setShowtimeId: (state, action) => {
      state.currentBooking.showtimeId = action.payload;
    },
    
    setMovieDetails: (state, action) => {
      state.currentBooking.movieDetails = action.payload;
    },
    
    toggleSeatSelection: (state, action) => {
      const seat = action.payload;
      const index = state.currentBooking.selectedSeats.findIndex(s => s.id === seat.id);
      
      if (index >= 0) {
        state.currentBooking.selectedSeats.splice(index, 1);
      } else {
        state.currentBooking.selectedSeats.push(seat);
      }
    },
    
    setSelectedSeats: (state, action) => {
      state.currentBooking.selectedSeats = action.payload;
    },
    
    updateFoodQuantity: (state, action) => {
      const { foodId, quantity } = action.payload;
      
      if (quantity <= 0) {
        delete state.currentBooking.selectedFood[foodId];
      } else {
        state.currentBooking.selectedFood[foodId] = quantity;
      }
    },
    
    setSelectedFood: (state, action) => {
      state.currentBooking.selectedFood = action.payload;
    },
    
    setPaymentMethod: (state, action) => {
      state.currentBooking.paymentMethod = action.payload;
    },
    
    setTotalAmount: (state, action) => {
      state.currentBooking.totalAmount = action.payload;
    },
    
    addToBookingHistory: (state, action) => {
      state.bookingHistory.unshift(action.payload);
    },
    
    clearCurrentBooking: (state) => {
      state.currentBooking = {
        showtimeId: null,
        movieDetails: null,
        selectedSeats: [],
        selectedFood: {},
        paymentMethod: null,
        totalAmount: 0,
      };
    },
  },
});

export const {
  setShowtimeId,
  setMovieDetails,
  toggleSeatSelection,
  setSelectedSeats,
  updateFoodQuantity,
  setSelectedFood,
  setPaymentMethod,
  setTotalAmount,
  addToBookingHistory,
  clearCurrentBooking,
} = bookingSlice.actions;

// Selectors
export const selectCurrentBooking = (state) => state.booking.currentBooking;
export const selectSelectedSeats = (state) => state.booking.currentBooking.selectedSeats;
export const selectSelectedFood = (state) => state.booking.currentBooking.selectedFood;
export const selectPaymentMethod = (state) => state.booking.currentBooking.paymentMethod;
export const selectTotalAmount = (state) => state.booking.currentBooking.totalAmount;
export const selectBookingHistory = (state) => state.booking.bookingHistory;

export default bookingSlice.reducer;
