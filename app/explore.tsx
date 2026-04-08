import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AppScreen from "@/src/components/layout/AppScreen";
import BottomNav from "@/src/components/layout/BottomNav";
import EmptyState from "@/src/components/ui/EmptyState";
import AppHeader from "@/src/components/layout/AppHeader";
import { COLORS } from "@/src/constants/colors";
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  searchMovies,
  AppMovie,
} from "@/src/services/tmdb";
import CategoryChip from "@/src/components/ui/CategoryChip";

export default function ExploreScreen() {
  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState<AppMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState<
    "popular" | "topRated" | "nowPlaying"
  >("popular");

  const loadFirstPage = async (
    query = "",
    category: "popular" | "topRated" | "nowPlaying" = activeCategory
  ) => {
    try {
      setLoading(true);

      if (query.trim()) {
        const data = await searchMovies(query, 1);
        setMovies(data.movies);
        setPage(1);
        setHasMore(data.page < data.totalPages);
        return;
      }

      let data;

      if (category === "popular") {
        data = await getPopularMovies(1);
      } else if (category === "topRated") {
        data = await getTopRatedMovies(1);
      } else {
        data = await getNowPlayingMovies(1);
      }

      setMovies(data.movies);
      setPage(1);
      setHasMore(data.page < data.totalPages);
    } catch (error) {
      console.log("Load first page error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFirstPage("", activeCategory);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadFirstPage(searchText, activeCategory);
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchText, activeCategory]);

  const handleLoadMore = async () => {
    if (loading || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      if (searchText.trim()) {
        const data = await searchMovies(searchText, nextPage);

        setMovies((prev) => {
          const merged = [...prev, ...data.movies];
          const uniqueMovies = merged.filter(
            (movie, index, self) =>
              index === self.findIndex((m) => m.id === movie.id)
          );
          return uniqueMovies;
        });

        setPage(data.page);
        setHasMore(data.page < data.totalPages);
      } else {
        let data;

        if (activeCategory === "popular") {
          data = await getPopularMovies(nextPage);
        } else if (activeCategory === "topRated") {
          data = await getTopRatedMovies(nextPage);
        } else {
          data = await getNowPlayingMovies(nextPage);
        }

        setMovies((prev) => {
          const merged = [...prev, ...data.movies];
          const uniqueMovies = merged.filter(
            (movie, index, self) =>
              index === self.findIndex((m) => m.id === movie.id)
          );
          return uniqueMovies;
        });

        setPage(data.page);
        setHasMore(data.page < data.totalPages);
      }
    } catch (error) {
      console.log("Load more movies error:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleOpenMovie = (movieId: string) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movieId },
    });
  };

  const renderMovieItem = ({ item }: { item: AppMovie }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.movieRow}
        onPress={() => handleOpenMovie(item.id)}
      >
        <Image source={{ uri: item.poster }} style={styles.moviePoster} />

        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <Text style={styles.movieMeta} numberOfLines={1}>
            {item.year} • {item.genre}
          </Text>

          <Text style={styles.movieRating}>⭐ {item.rating}</Text>

          <Text style={styles.movieDescription} numberOfLines={2}>
            {item.shortDescription}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.textMuted}
        />
      </TouchableOpacity>
    );
  };

  return (
    <AppScreen>
      <AppHeader title="Keşfet" />

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Film ara..."
          placeholderTextColor="#7F92B2"
          style={styles.searchInput}
        />

        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoryRow}>
        <CategoryChip
          label="Popüler"
          active={activeCategory === "popular"}
          onPress={() => setActiveCategory("popular")}
        />

        <CategoryChip
          label="En Yüksek Puanlı"
          active={activeCategory === "topRated"}
          onPress={() => setActiveCategory("topRated")}
        />

        <CategoryChip
          label="Yeni Çıkanlar"
          active={activeCategory === "nowPlaying"}
          onPress={() => setActiveCategory("nowPlaying")}
        />
      </View>

      <Text style={styles.resultText}>
        {loading
          ? "Filmler yükleniyor..."
          : searchText.trim()
          ? `"${searchText}" için ${movies.length} sonuç`
          : `${movies.length} film listeleniyor`}
      </Text>

      {!loading && movies.length === 0 ? (
        <EmptyState
          icon="film-outline"
          title="Film bulunamadı"
          description="Başka bir isimle tekrar aramayı dene."
        />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          renderItem={renderMovieItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <Text style={styles.footerLoaderText}>
                  Daha fazla film yükleniyor...
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <BottomNav activeTab="explore" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
  },

  resultText: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 14,
  },

  listContent: {
    paddingBottom: 100,
  },

  categoryRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  movieRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    padding: 12,
  },

  moviePoster: {
    width: 62,
    height: 92,
    borderRadius: 12,
    backgroundColor: COLORS.posterBackground,
    marginRight: 12,
  },

  movieInfo: {
    flex: 1,
    justifyContent: "center",
  },

  movieTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },

  movieMeta: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: 6,
  },

  movieRating: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },

  movieDescription: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },

  separator: {
    height: 10,
  },

  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },

  footerLoaderText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});