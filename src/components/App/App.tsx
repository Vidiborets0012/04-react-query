import toast, { Toaster } from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSelectMovie = (movie: Movie | null) => {
    setSelectedMovie(movie);
  };

  const handleSearch = async (searchQuery: string) => {
    try {
      setMovies([]);
      setIsError(false);
      setIsLoading(true);
      const fetchedMovies = await fetchMovies(searchQuery);
      setMovies(fetchedMovies);

      if (fetchedMovies.length === 0) {
        toast.error("No movies found for your request.");
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => {
            handleSelectMovie(null);
          }}
        />
      )}

      <Toaster position="top-center" />
    </>
  );
}
