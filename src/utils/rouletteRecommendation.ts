import { getPopularMoviesMultiPage, AppMovie } from "@/src/services/tmdb";

export async function getRandomMovie(): Promise<AppMovie> {
  const movies = await getPopularMoviesMultiPage(3);

  if (!movies.length) {
    throw new Error("No movies found for roulette.");
  }

  const randomIndex = Math.floor(Math.random() * movies.length);
  return movies[randomIndex];
}