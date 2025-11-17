import toast, { Toaster } from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect, useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

export default function App() {
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isError, setIsError] = useState(false);

  const [query, setQuery] = useState("");
  //додати локальний стан для page
  const [page, setPage] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // const handleSelectMovie = (movie: Movie | null) => {
  //   setSelectedMovie(movie);
  // };

  //оновити useQuery, щоб враховував page
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
  });

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);

    // try {
    //   setMovies([]);
    //   setIsError(false);
    //   setIsLoading(true);
    //   const fetchedMovies = await fetchMovies(searchQuery);
    //   setMovies(fetchedMovies);
    //   if (fetchedMovies.length === 0) {
    //     toast.error("No movies found for your request.");
    //   }
    // } catch {
    //   setIsError(true);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && data.results.length > 0 && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {data && !isLoading && !isError && (
        <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => {
            setSelectedMovie(null);
          }}
        />
      )}

      <Toaster position="top-center" />
    </>
  );
}
