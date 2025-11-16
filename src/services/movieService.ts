import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";

interface MoviesResponse {
  results: Movie[];
}

export default async function fetchMovies(query: string): Promise<Movie[]> {
  const response = await axios.get<MoviesResponse>(BASE_URL, {
    params: {
      query: query,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      Accept: "application/json",
    },
  });

  return response.data.results;
}
