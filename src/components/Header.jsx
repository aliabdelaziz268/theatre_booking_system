import { Link, useNavigate, useLocation } from "react-router-dom";
import { Film, Search, Menu, X, User, LogOut, Ticket, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useSelector } from 'react-redux';
import { selectCartItemsCount } from '@/store/slices/cartSlice';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, logout } = useAuth();
  const cartItemsCount = useSelector(selectCartItemsCount);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Film className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">CineBook</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Movies
            </Link>
            <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
              Products
            </Link>
            {user && (
              <Link to="/my-bookings" className="text-sm font-medium transition-colors hover:text-primary">
                My Bookings
              </Link>
            )}
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                Admin
              </Link>
            )}
          </nav>

          {/* Auth & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Shopping Cart Button - Desktop */}
            <Button variant="ghost" size="icon" className="relative hidden md:flex" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search movies..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Shopping Cart - Mobile */}
            <Button variant="outline" size="sm" className="w-full mb-3 justify-start relative" asChild>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Shopping Cart
                {cartItemsCount > 0 && (
                  <span className="ml-auto h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </Button>

            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link
                to="/products"
                className="text-sm font-medium transition-colors hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              {user && (
                <Link
                  to="/my-bookings"
                  className="text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}
              <Link
                to="/contact"
                className="text-sm font-medium transition-colors hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>

            {/* Auth Buttons - Mobile */}
            <div className="mt-4 pt-4 border-t space-y-2">
              {user ? (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    Signed in as <strong>{user.name}</strong>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}