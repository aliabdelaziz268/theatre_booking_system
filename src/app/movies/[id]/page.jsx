"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Film, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
    fetchShowtimes();
  }, [params.id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`/api/movies?id=${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch movie");
      
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      toast.error("Failed to load movie details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const response = await fetch(`/api/showtimes?movie_id=${params.id}&limit=50`);
      if (!response.ok) throw new Error("Failed to fetch showtimes");
      
      const data = await response.json();
      setShowtimes(data);
    } catch (error) {
      toast.error("Failed to load showtimes");
      console.error(error);
    }
  };

  const handleBooking = (showtime) => {
    if (!session) {
      router.push(`/login?redirect=/movies/${params.id}`);
      return;
    }
    router.push(`/booking/${showtime.id}`);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const groupShowtimesByDate = () => {
    const grouped = {};
    showtimes.forEach((showtime) => {
      if (!grouped[showtime.showDate]) {
        grouped[showtime.showDate] = [];
      }
      grouped[showtime.showDate].push(showtime);
    });
    return grouped;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    );
  }

  const groupedShowtimes = groupShowtimesByDate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <Image
          src={movie.posterImage || "/placeholder-movie.jpg"}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Movie Details */}
      <section className="container mx-auto px-4 -mt-32 relative z-20 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="relative h-96 md:h-[500px]">
                <Image
                  src={movie.posterImage || "/placeholder-movie.jpg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className="text-base">{movie.rating}</Badge>
                <Badge variant="secondary" className="text-base">{movie.genre}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{formatDuration(movie.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  <span>{movie.genre}</span>
                </div>
              </div>

              {movie.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              )}
            </div>

            {/* Trailer Button */}
            {movie.trailerUrl && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open(movie.trailerUrl, '_blank')}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Trailer
              </Button>
            )}
          </div>
        </div>

        {/* Showtimes Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Select Showtime</h2>
          
          {showtimes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No showtimes available for this movie at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedShowtimes).sort().map((date) => (
                <Card key={date}>
                  <CardHeader>
                    <CardTitle className="text-xl">{formatDate(date)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {groupedShowtimes[date].map((showtime) => (
                        <Button
                          key={showtime.id}
                          variant={selectedShowtime?.id === showtime.id ? "default" : "outline"}
                          className="flex flex-col h-auto py-3"
                          onClick={() => handleBooking(showtime)}
                          disabled={showtime.availableSeats === 0}
                        >
                          <span className="font-semibold">{showtime.showTime}</span>
                          <span className="text-xs mt-1">
                            Screen {showtime.screenNumber}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {showtime.availableSeats} seats
                          </span>
                          <span className="text-xs font-medium mt-1">
                            ${showtime.price}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
