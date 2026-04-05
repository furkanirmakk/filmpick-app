import React, { useCallback, useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import AppScreen from "@/src/components/layout/AppScreen";
import AppHeader from "@/src/components/layout/AppHeader";
import EmptyState from "@/src/components/ui/EmptyState";
import MovieCard from "@/src/components/movie/MovieCard";
import { useFavorites } from "@/src/hooks/useFavorites";

export default function LibraryListScreen() {
  const params = useLocalSearchParams();
  const type = String(params.type || "favorites");

  const {
    favoriteMovies,
    watchlistMovies,
    watchedMovies,
    loadAllMovies,
  } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      loadAllMovies();
    }, [loadAllMovies])
  );

  const config = useMemo(() => {
    if (type === "watchlist") {
      return {
        title: "İzlenecekler",
        emptyTitle: "Henüz izlenecek filmin yok",
        emptyDescription:
          "Film detay sayfasından izlenecekler listene film ekleyebilirsin.",
        data: watchlistMovies,
        icon: "bookmark-outline" as const,
      };
    }

    if (type === "watched") {
      return {
        title: "İzlenenler",
        emptyTitle: "Henüz izlenen filmin yok",
        emptyDescription:
          "Film detay sayfasından izlenenler listene film ekleyebilirsin.",
        data: watchedMovies,
        icon: "checkmark-circle-outline" as const,
      };
    }

    return {
      title: "Favoriler",
      emptyTitle: "Henüz favori filmin yok",
      emptyDescription:
        "Film detay sayfasından favoriler listene film ekleyebilirsin.",
      data: favoriteMovies,
      icon: "heart-outline" as const,
    };
  }, [type, favoriteMovies, watchlistMovies, watchedMovies]);

  return (
    <AppScreen>
      <AppHeader
        title={config.title}
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
      />

      {config.data.length === 0 ? (
        <EmptyState
          icon={config.icon}
          title={config.emptyTitle}
          description={config.emptyDescription}
        />
      ) : (
        <FlatList
          data={config.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MovieCard movie={item} variant="grid" />}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});