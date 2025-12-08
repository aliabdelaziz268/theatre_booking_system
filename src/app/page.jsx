"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Film, 
  Calendar, 
  Ticket,
  Popcorn,
  Users,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalShowtimes: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin");
      return;
    }

    if (session?.user?.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      router.push("/");
      return;
    }

    if (session?.user?.role === "admin") {
      fetchStats();
    }
  }, [session, isPending]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      
      // Fetch movies count
      const moviesRes = await fetch("/api/movies?limit=1000", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const moviesData = await moviesRes.json();
      
      // Fetch showtimes count
      const showtimesRes = await fetch("/api/showtimes?limit=1000", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const showtimesData = await showtimesRes.json();
      
      // Fetch all bookings
      const bookingsRes = await fetch("/api/bookings/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const bookingsData = await bookingsRes.json();

      // Calculate stats
      const totalRevenue = bookingsData.reduce((sum, booking) => 
        sum + (booking.status === 'confirmed' ? booking.totalAmount : 0), 0
      );

      setStats({
        totalMovies: moviesData.length || 0,
        totalShowtimes: showtimesData.length || 0,
        totalBookings: bookingsData.length || 0,
        totalRevenue: totalRevenue,
        totalUsers: 0, // Would need a users API endpoint
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your theatre booking system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMovies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently showing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Showtimes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShowtimes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active showtimes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From confirmed bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              className="h-24 flex flex-col gap-2"
              variant="outline"
              onClick={() => toast.info("Feature coming soon")}
            >
              <Film className="h-8 w-8" />
              <span>Manage Movies</span>
            </Button>
            
            <Button 
              className="h-24 flex flex-col gap-2"
              variant="outline"
              onClick={() => toast.info("Feature coming soon")}
            >
              <Calendar className="h-8 w-8" />
              <span>Manage Showtimes</span>
            </Button>
            
            <Button 
              className="h-24 flex flex-col gap-2"
              variant="outline"
              onClick={() => toast.info("Feature coming soon")}
            >
              <Popcorn className="h-8 w-8" />
              <span>Manage Food Items</span>
            </Button>
            
            <Button 
              className="h-24 flex flex-col gap-2"
              variant="outline"
              onClick={() => router.push("/my-bookings")}
            >
              <Ticket className="h-8 w-8" />
              <span>View All Bookings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 bg-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">System Information</h3>
              <p className="text-sm text-muted-foreground">
                This is the admin dashboard for managing the theatre booking system. 
                You can view statistics, manage movies, showtimes, food items, and view all bookings.
                The database is already set up with sample data for testing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
