import { AppMovie, getPopularMoviesMultiPage } from "@/src/services/tmdb";

export async function getRandomMovie(): Promise<AppMovie> {
  const movies = await getPopularMoviesMultiPage(3);

  if (!movies.length) {
    throw new Error("No movies found for roulette.");
  }

  const randomIndex = Math.floor(Math.random() * movies.length);
  const selectedMovie = movies[randomIndex];

  if (!selectedMovie?.id) {
    throw new Error("Selected movie id is missing.");
  }

  return selectedMovie;
}