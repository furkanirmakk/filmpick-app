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

function uniqueMoviesById(movies: AppMovie[]) {
  return movies.filter(
    (movie, index, self) =>
      index === self.findIndex((m) => String(m.id) === String(movie.id))
  );
}

function calculateScore(movie: AppMovie, answers: QuizAnswers) {
  let score = 0;

  const genre = movie.genre.toLowerCase();
  const title = movie.title.toLowerCase();
  const description = (movie.description || movie.shortDescription || "").toLowerCase();
  const year = parseInt(movie.year || "0", 10);
  const rating = parseFloat(movie.rating || "0");

  // Ana tür eşleşmesi
  if (answers.genre === "action" && genre.includes("aksiyon")) score += 5;
  if (answers.genre === "sci-fi" && (genre.includes("bilim kurgu") || genre.includes("science fiction"))) score += 5;
  if (answers.genre === "drama" && genre.includes("dram")) score += 5;
  if (answers.genre === "comedy" && genre.includes("komedi")) score += 5;

  // Mood eşleşmesi
  if (answers.mood === "fun") {
    if (genre.includes("komedi")) score += 3;
    if (genre.includes("macera")) score += 2;
    if (genre.includes("animasyon")) score += 2;
  }

  if (answers.mood === "emotional") {
    if (genre.includes("dram")) score += 3;
    if (genre.includes("romantik")) score += 2;
    if (genre.includes("aile")) score += 1;
  }

  if (answers.mood === "tense") {
    if (genre.includes("gerilim")) score += 3;
    if (genre.includes("gizem")) score += 2;
    if (genre.includes("suç")) score += 1;
    if (genre.includes("korku")) score += 2;
  }

  // Pace eşleşmesi
  if (answers.pace === "fast") {
    if (genre.includes("aksiyon")) score += 3;
    if (genre.includes("gerilim")) score += 2;
    if (genre.includes("macera")) score += 2;
    if (rating >= 7) score += 1;
  }

  if (answers.pace === "slow") {
    if (genre.includes("dram")) score += 2;
    if (genre.includes("romantik")) score += 1;
    if (rating >= 7) score += 1;
  }

  // Company eşleşmesi
  if (answers.company === "alone") {
    if (genre.includes("gerilim")) score += 2;
    if (genre.includes("dram")) score += 1;
    if (genre.includes("bilim kurgu")) score += 1;
  }

  if (answers.company === "friends") {
    if (genre.includes("komedi")) score += 3;
    if (genre.includes("aksiyon")) score += 2;
    if (genre.includes("macera")) score += 2;
  }

  if (answers.company === "partner") {
    if (genre.includes("romantik")) score += 3;
    if (genre.includes("dram")) score += 2;
    if (genre.includes("komedi")) score += 1;
  }

  if (answers.company === "family") {
    if (genre.includes("animasyon")) score += 3;
    if (genre.includes("aile")) score += 3;
    if (genre.includes("macera")) score += 1;
    if (genre.includes("komedi")) score += 1;
  }

  // Kalite bonusları
  if (rating >= 8) score += 2;
  else if (rating >= 7) score += 1;

  // Çok eski filmleri biraz geriye at
  if (year >= 2015) score += 1;
  if (year >= 2020) score += 1;

  // Açıklama bazlı küçük bonuslar
  if (answers.mood === "tense") {
    if (description.includes("gerilim") || description.includes("tehlike")) score += 1;
  }

  if (answers.mood === "fun") {
    if (description.includes("eğlenceli") || description.includes("komik")) score += 1;
  }

  if (answers.mood === "emotional") {
    if (description.includes("duygusal") || description.includes("hayat")) score += 1;
  }

  return score;
}

type GetQuizRecommendationsOptions = {
  excludedIds?: string[];
  targetCount?: number;
};

export async function getQuizRecommendations(
  answers: QuizAnswers,
  options?: GetQuizRecommendationsOptions
): Promise<AppMovie[]> {
  const targetCount = options?.targetCount ?? 3;
  const excludedIds = new Set((options?.excludedIds ?? []).map(String));

  // Kademeli olarak daha fazla film çek
  const pageSteps = [5, 10, 15];

  for (const totalPages of pageSteps) {
    const movies = await getPopularMoviesMultiPage(totalPages);

    const uniqueMovies = uniqueMoviesById(movies);

    const filteredMovies = uniqueMovies.filter(
      (movie) => !excludedIds.has(String(movie.id))
    );

    const scoredMovies = filteredMovies.map((movie) => ({
      movie,
      score: calculateScore(movie, answers),
    }));

    // Önce skora göre sırala
    scoredMovies.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;

      // skor eşitse puanı yüksek olan öne gelsin
      return parseFloat(b.movie.rating) - parseFloat(a.movie.rating);
    });

    // Daha geniş bir havuz al ki sonuçlar hem mantıklı hem çeşitli olsun
    const candidatePool = scoredMovies
      .filter((item) => item.score > 0)
      .slice(0, 30)
      .map((item) => item.movie);

    // Eğer score > 0 aday azsa, yine de en iyi adaylardan doldur
    const fallbackPool =
      candidatePool.length >= targetCount
        ? candidatePool
        : scoredMovies.slice(0, 50).map((item) => item.movie);

    const randomized = shuffleArray(fallbackPool);
    const finalMovies = uniqueMoviesById(randomized).slice(0, targetCount);

    if (finalMovies.length >= targetCount) {
      return finalMovies;
    }
  }

  return [];
}