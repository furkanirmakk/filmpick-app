import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppScreen from "@/src/components/layout/AppScreen";
import AppHeader from "@/src/components/layout/AppHeader";
import { COLORS } from "@/src/constants/colors";
import { AppMovie, getMovieDetails } from "@/src/services/tmdb";

export default function RouletteResultScreen() {
  const params = useLocalSearchParams();

 const [movie, setMovie] = useState<AppMovie | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadMovie = async () => {
    try {
      setLoading(true);

      const movieId = String(params.id || "");
      if (!movieId) {
        setMovie(null);
        return;
      }

      const result = await getMovieDetails(movieId);
      setMovie(result);
    } catch (error) {
      console.log("Roulette result fetch error:", error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  loadMovie();
}, [params.id]);

  if (loading) {
  return null;
}
  if (!movie) {
    return (
      <AppScreen>
        <AppHeader title="Sonuç" leftIcon="chevron-back" onLeftPress={() => router.back()} />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>Film bulunamadı.</Text>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <AppHeader
        title="Rulet Sonucu"
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
      />

      <View style={styles.content}>
        <Image source={{ uri: movie.poster }} style={styles.poster} />

        <Text style={styles.movieTitle}>{movie.title}</Text>
        <Text style={styles.meta}>
          {movie.genre} • {movie.year} • ⭐ {movie.rating}
        </Text>

        <Text style={styles.description}>{movie.shortDescription}</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/movie/[id]",
              params: { id: movie.id },
            })
          }
        >
          <Text style={styles.primaryButtonText}>Detayları Gör</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.9}
          onPress={() => router.replace("/roulette")}
        >
          <Text style={styles.secondaryButtonText}>Tekrar Çevir</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 20,
  },

  poster: {
    width: "100%",
    height: 300,
    borderRadius: 24,
    backgroundColor: COLORS.posterBackground,
    marginBottom: 20,
  },

  movieTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  meta: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 14,
    textAlign: "center",
  },

  description: {
    color: COLORS.white,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 6,
  },

  primaryButton: {
    width: "100%",
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  primaryButtonText: {
    color: COLORS.primaryDarkText,
    fontSize: 16,
    fontWeight: "800",
  },

  secondaryButton: {
    width: "100%",
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
});