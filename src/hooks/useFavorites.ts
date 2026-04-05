import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppMovie, getMovieDetails } from "@/src/services/tmdb";

const STORAGE_KEYS = {
  favorites: "favoriteMovies",
  watchlist: "watchlistMovies",
  watched: "watchedMovies",
} as const;

type ListType = keyof typeof STORAGE_KEYS;

type MovieLists = {
  favorites: string[];
  watchlist: string[];
  watched: string[];
};

export function useFavorites(movieId?: string) {
  const [lists, setLists] = useState<MovieLists>({
    favorites: [],
    watchlist: [],
    watched: [],
  });

  const [favoriteMovies, setFavoriteMovies] = useState<AppMovie[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<AppMovie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<AppMovie[]>([]);
  const [loading, setLoading] = useState(false);

  const loadListIds = useCallback(async (listType: ListType) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS[listType]);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.log(`${listType} ids load error:`, error);
      return [];
    }
  }, []);

  const saveListIds = useCallback(async (listType: ListType, ids: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS[listType], JSON.stringify(ids));
    } catch (error) {
      console.log(`${listType} ids save error:`, error);
    }
  }, []);

  const loadAllLists = useCallback(async () => {
    try {
      const [favorites, watchlist, watched] = await Promise.all([
        loadListIds("favorites"),
        loadListIds("watchlist"),
        loadListIds("watched"),
      ]);

      setLists({ favorites, watchlist, watched });

      return { favorites, watchlist, watched };
    } catch (error) {
      console.log("Load all lists error:", error);
      const empty = { favorites: [], watchlist: [], watched: [] };
      setLists(empty);
      return empty;
    }
  }, [loadListIds]);

  const loadMoviesForList = useCallback(
    async (listType: ListType) => {
      const ids = await loadListIds(listType);

      if (ids.length === 0) {
        if (listType === "favorites") setFavoriteMovies([]);
        if (listType === "watchlist") setWatchlistMovies([]);
        if (listType === "watched") setWatchedMovies([]);
        return [];
      }

      const results = await Promise.all(ids.map((id) => getMovieDetails(id)));
      const validMovies = results.filter(
        (movie): movie is AppMovie => movie !== null
      );

      if (listType === "favorites") setFavoriteMovies(validMovies);
      if (listType === "watchlist") setWatchlistMovies(validMovies);
      if (listType === "watched") setWatchedMovies(validMovies);

      return validMovies;
    },
    [loadListIds]
  );

  const loadAllMovies = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadMoviesForList("favorites"),
        loadMoviesForList("watchlist"),
        loadMoviesForList("watched"),
      ]);
    } catch (error) {
      console.log("Load all movies error:", error);
    } finally {
      setLoading(false);
    }
  }, [loadMoviesForList]);

  const toggleListItem = useCallback(
    async (listType: ListType, id: string) => {
      const currentIds = await loadListIds(listType);
      let updatedIds: string[] = [];

      if (currentIds.includes(id)) {
        updatedIds = currentIds.filter((item) => item !== id);
      } else {
        updatedIds = [...currentIds, id];
      }

      await saveListIds(listType, updatedIds);

      const latestLists = await loadAllLists();

      if (listType === "favorites") setLists((prev) => ({ ...prev, favorites: latestLists.favorites }));
      if (listType === "watchlist") setLists((prev) => ({ ...prev, watchlist: latestLists.watchlist }));
      if (listType === "watched") setLists((prev) => ({ ...prev, watched: latestLists.watched }));

      return updatedIds.includes(id);
    },
    [loadAllLists, loadListIds, saveListIds]
  );

  useEffect(() => {
    loadAllLists();
  }, [loadAllLists]);

  const isFavorite = useMemo(
    () => (movieId ? lists.favorites.includes(movieId) : false),
    [lists.favorites, movieId]
  );

  const isInWatchlist = useMemo(
    () => (movieId ? lists.watchlist.includes(movieId) : false),
    [lists.watchlist, movieId]
  );

  const isWatched = useMemo(
    () => (movieId ? lists.watched.includes(movieId) : false),
    [lists.watched, movieId]
  );

  return {
    loading,
    favoriteMovies,
    watchlistMovies,
    watchedMovies,
    favoriteCount: lists.favorites.length,
    watchlistCount: lists.watchlist.length,
    watchedCount: lists.watched.length,
    isFavorite,
    isInWatchlist,
    isWatched,
    loadAllLists,
    loadAllMovies,
    loadMoviesForList,
    toggleFavorite: (id: string) => toggleListItem("favorites", id),
    toggleWatchlist: (id: string) => toggleListItem("watchlist", id),
    toggleWatched: (id: string) => toggleListItem("watched", id),
  };
}