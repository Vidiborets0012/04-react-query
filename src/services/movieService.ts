import axios from "axios";
import type { MoviesResponse } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";

// interface MoviesResponse {
//   results: Movie[];
//   page: number;
//   total_pages: number;
// }

export default async function fetchMovies(
  query: string,
  page: number = 1
): Promise<MoviesResponse> {
  const response = await axios.get<MoviesResponse>(BASE_URL, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      Accept: "application/json",
    },
  });

  return response.data;
  //Тепер функція повертає:
  // {
  //   page,
  //   results,
  //   total_pages
  // }
}
