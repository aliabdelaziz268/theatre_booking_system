import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Film, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

// Mock data for movies
const MOCK_MOVIES = [
  {
    id: "1",
    title: "The Dark Knight",
    genre: "Action",
    duration: 152,
    rating: "PG-13",
    releaseDate: "2008-07-18",
    posterImage: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
  },
  {
    id: "2",
    title: "Inception",
    genre: "Sci-Fi",
    duration: 148,
    rating: "PG-13",
    releaseDate: "2010-07-16",
    posterImage: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0"
  },
  {
    id: "3",
    title: "The Shawshank Redemption",
    genre: "Drama",
    duration: 142,
    rating: "R",
    releaseDate: "1994-09-23",
    posterImage: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    trailerUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco"
  },
  {
    id: "4",
    title: "Interstellar",
    genre: "Sci-Fi",
    duration: 169,
    rating: "PG-13",
    releaseDate: "2014-11-07",
    posterImage: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E"
  },
  {
    id: "5",
    title: "Joker",
    genre: "Thriller",
    duration: 122,
    rating: "R",
    releaseDate: "2019-10-04",
    posterImage: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    description: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.",
    trailerUrl: "https://www.youtube.com/watch?v=zAGVQLHvwOY"
  },
  {
    id: "6",
    title: "Avengers: Endgame",
    genre: "Action",
    duration: 181,
    rating: "PG-13",
    releaseDate: "2019-04-26",
    posterImage: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions.",
    trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c"
  }
];

// Mock data for showtimes
const MOCK_SHOWTIMES = [
  // Movie 1 - The Dark Knight
  { id: "1", movie_id: "1", showDate: "2024-12-15", showTime: "14:00", screenNumber: 1, availableSeats: 50, price: 12 },
  { id: "2", movie_id: "1", showDate: "2024-12-15", showTime: "17:30", screenNumber: 1, availableSeats: 35, price: 15 },
  { id: "3", movie_id: "1", showDate: "2024-12-15", showTime: "21:00", screenNumber: 2, availableSeats: 20, price: 15 },
  { id: "4", movie_id: "1", showDate: "2024-12-16", showTime: "13:00", screenNumber: 1, availableSeats: 60, price: 12 },
  { id: "5", movie_id: "1", showDate: "2024-12-16", showTime: "19:00", screenNumber: 2, availableSeats: 45, price: 15 },

  // Movie 2 - Inception
  { id: "6", movie_id: "2", showDate: "2024-12-15", showTime: "15:00", screenNumber: 3, availableSeats: 40, price: 12 },
  { id: "7", movie_id: "2", showDate: "2024-12-15", showTime: "18:30", screenNumber: 3, availableSeats: 25, price: 15 },
  { id: "8", movie_id: "2", showDate: "2024-12-16", showTime: "14:30", screenNumber: 3, availableSeats: 55, price: 12 },

  // Movie 3 - The Shawshank Redemption
  { id: "9", movie_id: "3", showDate: "2024-12-15", showTime: "16:00", screenNumber: 4, availableSeats: 30, price: 10 },
  { id: "10", movie_id: "3", showDate: "2024-12-16", showTime: "15:00", screenNumber: 4, availableSeats: 40, price: 10 },

  // Movie 4 - Interstellar
  { id: "11", movie_id: "4", showDate: "2024-12-15", showTime: "13:30", screenNumber: 5, availableSeats: 45, price: 14 },
  { id: "12", movie_id: "4", showDate: "2024-12-15", showTime: "20:00", screenNumber: 5, availableSeats: 15, price: 16 },
  { id: "13", movie_id: "4", showDate: "2024-12-16", showTime: "17:00", screenNumber: 5, availableSeats: 50, price: 14 },

  // Movie 5 - Joker
  { id: "14", movie_id: "5", showDate: "2024-12-15", showTime: "19:30", screenNumber: 6, availableSeats: 10, price: 13 },
  { id: "15", movie_id: "5", showDate: "2024-12-16", showTime: "21:30", screenNumber: 6, availableSeats: 35, price: 15 },

  // Movie 6 - Avengers: Endgame
  { id: "16", movie_id: "6", showDate: "2024-12-15", showTime: "12:00", screenNumber: 7, availableSeats: 70, price: 16 },
  { id: "17", movie_id: "6", showDate: "2024-12-15", showTime: "16:30", screenNumber: 7, availableSeats: 30, price: 18 },
  { id: "18", movie_id: "6", showDate: "2024-12-15", showTime: "22:00", screenNumber: 7, availableSeats: 5, price: 18 },
  { id: "19", movie_id: "6", showDate: "2024-12-16", showTime: "11:00", screenNumber: 7, availableSeats: 80, price: 14 },
  { id: "20", movie_id: "6", showDate: "2024-12-16", showTime: "18:00", screenNumber: 7, availableSeats: 25, price: 18 }
];

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
    fetchShowtimes();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/movies/${id}`);

      if (!response.ok) {
        throw new Error("Movie not found");
      }

      const foundMovie = await response.json();
      setMovie(foundMovie);
    } catch (error) {
      toast.error("Failed to load movie details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchShowtimes = async () => {
    try {
      // Filter showtimes for this movie
      const response = await fetch(`http://localhost:5000/showtimes?movieId=${id}`);
      if (!response.ok) throw new Error("Failed to load showtimes");

      const movieShowtimes = await response.json();
      setShowtimes(movieShowtimes);
    } catch (error) {
      toast.error("Failed to load showtimes");
      console.error(error);
    }
  };

  const handleBooking = (showtime) => {
    if (!user) {
      navigate(`/login?redirect=/movies/${id}`);
      return;
    }
    navigate(`/booking/${showtime.id}`);
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
      const date = showtime.showDate || showtime.show_date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(showtime);
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
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  const groupedShowtimes = groupShowtimesByDate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <img
          src={movie.posterImage || "/placeholder-movie.jpg"}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </section>

      {/* Movie Details */}
      <section className="container mx-auto px-4 -mt-32 relative z-20 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="relative h-96 md:h-[500px]">
                <img
                  src={movie.posterImage || "/placeholder-movie.jpg"}
                  alt={movie.title}
                  className="w-full h-full object-cover"
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
                          variant="outline"
                          className="flex flex-col h-auto py-3"
                          onClick={() => handleBooking(showtime)}
                          disabled={(showtime.availableSeats || showtime.available_seats) === 0}
                        >
                          <span className="font-semibold">
                            {showtime.showTime || showtime.show_time}
                          </span>
                          <span className="text-xs mt-1">
                            Screen {showtime.screenNumber || showtime.screen_number}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {showtime.availableSeats || showtime.available_seats} seats
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