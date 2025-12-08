import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MovieDetailsPage from '@/pages/MovieDetailsPage';
import BookingPage from '@/pages/BookingPage';
import BookingSuccessPage from '@/pages/BookingSuccessPage';
import MyBookingsPage from '@/pages/MyBookingsPage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailsPage from '@/pages/ProductDetailsPage';
import CartPage from '@/pages/CartPage';
import ContactPage from '@/pages/ContactPage';
import PaymentMethodsPage from '@/pages/PaymentMethodsPage';
import AdminPage from '@/pages/AdminPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/booking/success" element={<BookingSuccessPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
