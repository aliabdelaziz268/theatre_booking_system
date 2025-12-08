import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Mock data - بيانات وهمية للأفلام
// Mock data removed in favor of API fetching

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    let filtered = movies;

    if (selectedGenre !== "all") {
      filtered = filtered.filter((movie) => movie.genre === selectedGenre);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(query) ||
        movie.description.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query)
      );
    }

    setFilteredMovies(filtered);
  }, [selectedGenre, movies, searchQuery]);

  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:5000/movies");
      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();
      setMovies(data);
      setFilteredMovies(data);

      const uniqueGenres = Array.from(new Set(data.map((movie) => movie.genre)));
      setGenres(uniqueGenres);
    } catch (error) {
      toast.error("Failed to load movies");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Book Your Movie Experience
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Choose your movie, select your seats, and enjoy the show.
              Book tickets online and skip the queue!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="#movies">Browse Movies</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <section className="py-16" id="movies">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Now Showing"}
              </h2>
              {searchQuery && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">Clear Search</Link>
                </Button>
              )}
            </div>

            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedGenre === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre("all")}
              >
                All Movies
              </Button>
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Movies Grid */}
          {!isLoading && filteredMovies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {searchQuery
                  ? `No movies found matching "${searchQuery}". Try a different search term.`
                  : "No movies found in this category."}
              </p>
            </div>
          )}

          {!isLoading && filteredMovies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <Card key={movie.id} className="group overflow-hidden hover:shadow-lg transition-all">
                  <Link to={`/movies/${movie.id}`}>
                    <div className="relative h-96 overflow-hidden">
                      <img
                        src={movie.posterImage || "/placeholder-movie.jpg"}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/90 backdrop-blur">{movie.rating}</Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-secondary/90 backdrop-blur">
                          {movie.genre}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                  <CardContent className="p-4 space-y-2">
                    <Link to={`/movies/${movie.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                        {movie.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {movie.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(movie.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" asChild>
                      <Link to={`/movies/${movie.id}`}>Book Tickets</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="font-semibold text-lg">Easy Booking</h3>
              <p className="text-muted-foreground">Select your seats and book in seconds</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🍿</span>
              </div>
              <h3 className="font-semibold text-lg">Food & Beverages</h3>
              <p className="text-muted-foreground">Pre-order snacks and drinks</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="font-semibold text-lg">Secure Payment</h3>
              <p className="text-muted-foreground">Safe and secure transactions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}