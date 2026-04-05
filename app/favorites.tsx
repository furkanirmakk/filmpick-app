import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import AppScreen from "@/src/components/layout/AppScreen";
import BottomNav from "@/src/components/layout/BottomNav";
import EmptyState from "@/src/components/ui/EmptyState";
import AppHeader from "@/src/components/layout/AppHeader";
import MovieCard from "@/src/components/movie/MovieCard";
import { useFavorites } from "@/src/hooks/useFavorites";

export default function FavoritesScreen() {
  const { favoriteMovies, loadMoviesForList } = useFavorites();

  useFocusEffect(
  useCallback(() => {
    loadMoviesForList("favorites");
  }, [loadMoviesForList])
);

  return (
    <AppScreen>
      <AppHeader
        title="Favoriler"
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
      />

      {favoriteMovies.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Henüz favori filmin yok"
          description="Film detayındaki kalp ikonuna basarak favorilerine ekleyebilirsin."
        />
      ) : (
        <FlatList
          data={favoriteMovies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MovieCard movie={item} variant="grid" />}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      <BottomNav activeTab="favorites" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 90,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});