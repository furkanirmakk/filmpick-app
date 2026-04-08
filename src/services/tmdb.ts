const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;

type TmdbMovie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  vote_count?: number;
  genres?: { id: number; name: string }[];
  genre_ids?: number[];
  runtime?: number;
  backdrop_path?: string | null;
  popularity?: number;
};

type TmdbListResponse = {
  results: TmdbMovie[];
  page: number;
  total_pages: number;
};

type TmdbCastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

type TmdbCreditsResponse = {
  cast: TmdbCastMember[];
};

type TmdbVideo = {
  key: string;
  site: string;
  type: string;
  name: string;
};

type TmdbVideosResponse = {
  results: TmdbVideo[];
};

export type AppMovie = {
  id: string;
  title: string;
  year: string;
  genre: string;
  rating: string;
  poster: string;
  shortDescription: string;
  description?: string;
  runtime?: string;
  backdrop?: string;
  voteCount?: string;
  popularity?: string;
};

export type AppCastMember = {
  id: string;
  name: string;
  character: string;
  profileImage: string | null;
};

export type PaginatedMoviesResponse = {
  movies: AppMovie[];
  page: number;
  totalPages: number;
};

function mapMovie(movie: TmdbMovie): AppMovie {
  return {
    id: String(movie.id),
    title: movie.title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : "Bilinmiyor",
    genre:
      movie.genres && movie.genres.length > 0
        ? movie.genres.map((g) => g.name).join(", ")
        : "Film",
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "0.0",
    poster: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image",
    shortDescription: movie.overview || "Açıklama bulunamadı.",
    description: movie.overview || "Açıklama bulunamadı.",
    runtime: movie.runtime ? `${movie.runtime} dk` : undefined,
    backdrop: movie.backdrop_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`
      : undefined,
    voteCount: movie.vote_count ? String(movie.vote_count) : undefined,
    popularity: movie.popularity ? movie.popularity.toFixed(1) : undefined,
  };
}

async function tmdbFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
}

export async function getPopularMovies(
  page = 1
): Promise<PaginatedMoviesResponse> {
  const data = await tmdbFetch<TmdbListResponse>(
    `/movie/popular?language=tr-TR&page=${page}`
  );

  return {
    movies: data.results.map(mapMovie),
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function getTopRatedMovies(
  page = 1
): Promise<PaginatedMoviesResponse> {
  const data = await tmdbFetch<TmdbListResponse>(
    `/movie/top_rated?language=tr-TR&page=${page}`
  );

  return {
    movies: data.results.map(mapMovie),
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function getNowPlayingMovies(
  page = 1
): Promise<PaginatedMoviesResponse> {
  const data = await tmdbFetch<TmdbListResponse>(
    `/movie/now_playing?language=tr-TR&page=${page}`
  );

  return {
    movies: data.results.map(mapMovie),
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function getPopularMoviesMultiPage(
  totalPages = 3
): Promise<AppMovie[]> {
  const requests: Promise<PaginatedMoviesResponse>[] = [];

  for (let page = 1; page <= totalPages; page++) {
    requests.push(getPopularMovies(page));
  }

  const results = await Promise.all(requests);
  return results.flatMap((pageData) => pageData.movies);
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<PaginatedMoviesResponse> {
  const encodedQuery = encodeURIComponent(query);
  const data = await tmdbFetch<TmdbListResponse>(
    `/search/movie?query=${encodedQuery}&language=tr-TR&page=${page}`
  );

  return {
    movies: data.results.map(mapMovie),
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function getMovieDetails(id: string): Promise<AppMovie | null> {
  const movie = await tmdbFetch<TmdbMovie>(`/movie/${id}?language=tr-TR`);
  return mapMovie(movie);
}

export async function getMovieCredits(id: string): Promise<AppCastMember[]> {
  const data = await tmdbFetch<TmdbCreditsResponse>(
    `/movie/${id}/credits?language=tr-TR`
  );

  return data.cast.slice(0, 8).map((person) => ({
    id: String(person.id),
    name: person.name,
    character: person.character,
    profileImage: person.profile_path
      ? `${TMDB_IMAGE_BASE_URL}${person.profile_path}`
      : null,
  }));
}

export async function getMovieTrailer(id: string): Promise<string | null> {
  const data = await tmdbFetch<TmdbVideosResponse>(
    `/movie/${id}/videos?language=tr-TR`
  );

  const trailer = data.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  if (!trailer) return null;

  return `https://www.youtube.com/watch?v=${trailer.key}`;
}