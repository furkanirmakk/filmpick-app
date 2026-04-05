import { getPopularMoviesMultiPage, AppMovie } from "@/src/services/tmdb";
import { QuizAnswers } from "@/src/types/quiz";

function shuffleArray<T>(array: T[]) {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}

function calculateScore(movie: AppMovie, answers: QuizAnswers) {
  let score = 0;
  const genre = movie.genre.toLowerCase();

  if (answers.genre === "action" && genre.includes("aksiyon")) score += 3;
  if (answers.genre === "sci-fi" && genre.includes("bilim kurgu")) score += 3;
  if (answers.genre === "drama" && genre.includes("dram")) score += 3;
  if (answers.genre === "comedy" && genre.includes("komedi")) score += 3;

  if (answers.mood === "fun" && genre.includes("komedi")) score += 2;
  if (answers.mood === "emotional" && genre.includes("dram")) score += 2;
  if (answers.mood === "tense" && genre.includes("gerilim")) score += 2;

  if (answers.pace === "fast") {
    const rating = parseFloat(movie.rating);
    if (rating > 7) score += 1;
  }

  return score;
}

export async function getQuizRecommendations(
  answers: QuizAnswers
): Promise<AppMovie[]> {

  const movies = await getPopularMoviesMultiPage(5);

  const scoredMovies = movies.map((movie) => ({
    movie,
    score: calculateScore(movie, answers),
  }));

  scoredMovies.sort((a, b) => b.score - a.score);

  const topMovies = scoredMovies.slice(0, 15).map((item) => item.movie);

  const randomized = shuffleArray(topMovies);

  return randomized.slice(0, 3);
}