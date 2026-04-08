import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import AppScreen from "@/src/components/layout/AppScreen";
import AppHeader from "@/src/components/layout/AppHeader";
import RouletteWheel from "@/src/components/roulette/RouletteWheel";
import { getPopularMoviesMultiPage, AppMovie } from "@/src/services/tmdb";
import BottomNav from "@/src/components/layout/BottomNav";
import { COLORS } from "@/src/constants/colors";
import { useFavorites } from "@/src/hooks/useFavorites";

const SLOT_COUNT = 36;

export default function RouletteScreen() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<AppMovie | null>(null);
  const [spinKey, setSpinKey] = useState(0);

  const {
    favoriteIds,
    watchlistIds,
    watchedIds,
    loadAllLists,
  } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      loadAllLists();
    }, [loadAllLists])
  );

  const handleSpin = async () => {
    if (isSpinning) return;

    try {
      const movies = await getPopularMoviesMultiPage(3);

      if (!movies.length) return;

      const excludedIds = new Set([
        ...favoriteIds,
        ...watchlistIds,
        ...watchedIds,
      ]);

      const availableMovies = movies.filter(
        (movie) => !excludedIds.has(String(movie.id))
      );

      if (!availableMovies.length) {
        console.log("Önerilecek yeni film kalmadı.");
        return;
      }

      const movie =
        availableMovies[Math.floor(Math.random() * availableMovies.length)];

      const slotIndex = Number(movie.id) % SLOT_COUNT;

      setSelectedMovie(movie);
      setTargetIndex(slotIndex);
      setIsSpinning(true);
      setSpinKey((prev) => prev + 1);
    } catch (error) {
      console.log("Roulette spin error:", error);
      setIsSpinning(false);
    }
  };

  const handleSpinEnd = () => {
    if (!selectedMovie) {
      setIsSpinning(false);
      return;
    }

    setIsSpinning(false);

    setTimeout(() => {
      router.push({
        pathname: "/roulette/result",
        params: {
          id: selectedMovie.id,
          title: selectedMovie.title,
          year: selectedMovie.year,
          genre: selectedMovie.genre,
          rating: selectedMovie.rating,
          poster: selectedMovie.poster,
          shortDescription: selectedMovie.shortDescription,
        },
      });
    }, 500);
  };

  return (
    <AppScreen>
      <AppHeader
        title="Film Ruleti"
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Bugün şansına ne çıkacak?</Text>
        <Text style={styles.subtitle}>
          Ruleti çevir, topun durduğu sayı filmini belirlesin.
        </Text>

        <RouletteWheel
          spinKey={spinKey}
          targetIndex={targetIndex}
          isSpinning={isSpinning}
          onSpinEnd={handleSpinEnd}
        />

        <TouchableOpacity
          style={[styles.spinButton, isSpinning && styles.disabledButton]}
          activeOpacity={0.9}
          onPress={handleSpin}
          disabled={isSpinning}
        >
          <Text style={styles.spinButtonText}>
            {isSpinning ? "Rulet Dönüyor..." : "Ruleti Çevir"}
          </Text>
        </TouchableOpacity>
      </View>

      <BottomNav activeTab="home" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 24,
  },

  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: COLORS.white,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  spinButton: {
    marginTop: 8,
    backgroundColor: "#D4AF37",
    borderRadius: 18,
    minHeight: 58,
    minWidth: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  spinButtonText: {
    color: "#180f03",
    fontSize: 16,
    fontWeight: "900",
  },
});