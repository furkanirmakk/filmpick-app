import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { movies } from "./data/movies";

export default function RouletteResultScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();

  const normalizedCategory = String(category || "").trim().toLowerCase();

const categoryMovies = useMemo(() => {
  const filtered = movies.filter(
    (movie) => movie.category.trim().toLowerCase() === normalizedCategory
  );

  return filtered.length > 0 ? filtered : [movies[0]];
}, [normalizedCategory]);

const [movieIndex, setMovieIndex] = useState(0);

const recommendedMovie = categoryMovies[movieIndex] ?? categoryMovies[0];

const handleAnotherSuggestion = () => {
  if (categoryMovies.length <= 1) return;

  let nextIndex = movieIndex;

  while (nextIndex === movieIndex) {
    nextIndex = Math.floor(Math.random() * categoryMovies.length);
  }

  setMovieIndex(nextIndex);
};

  const handleShare = async () => {
    try {
      await Share.share({
        message: `FilmPick bana ${category} kategorisinde "${recommendedMovie.title}" filmini önerdi. IMDb: ${recommendedMovie.rating}`,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const getDurationType = (duration: number): "short" | "medium" | "long" => {
  if (duration < 60) return "short";
  if (duration > 120) return "long";
  return "medium";
};
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Sonuç</Text>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.85}
            onPress={handleShare}
          >
            <Feather name="share-2" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Rulet <Text style={styles.infoHighlight}>{category || "Unknown"}</Text>{" "}
            kategorisinde durdu. Sana uygun öneri hazır.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.92}
          style={styles.movieCard}
          onPress={() =>
            router.push({
              pathname: "/movie/[id]",
              params: { id: recommendedMovie.id },
            })
          }
        >
          <Image
            source={{ uri: recommendedMovie.poster }}
            style={styles.poster}
            resizeMode="cover"
          />

          <View style={styles.movieContent}>
            <View style={styles.movieTextArea}>
              <Text style={styles.movieTitle}>{recommendedMovie.title}</Text>
              <Text style={styles.movieMeta}>
                {recommendedMovie.genre} • {recommendedMovie.year}
              </Text>

              <Text style={styles.movieDescription} numberOfLines={3}>
                {recommendedMovie.shortDescription}
              </Text>
            </View>

            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#F3B42A" />
              <Text style={styles.ratingText}>{recommendedMovie.rating}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/movie/[id]",
              params: { id: recommendedMovie.id },
            })
          }
        >
          <Text style={styles.primaryButtonText}>Postere Dokun / Detaya Git</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.9}
          onPress={handleAnotherSuggestion}
        >
          <Text style={styles.secondaryButtonText}>Başka Öneri Göster</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostButton}
          activeOpacity={0.9}
          onPress={() => router.replace("/roulette")}
        >
          <Text style={styles.ghostButtonText}>Tekrar Çevir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020B18",
  },

  screen: {
    flex: 1,
    backgroundColor: "#041225",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    borderRadius: 28,
    marginHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(130,160,255,0.12)",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    minHeight: 48,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  infoBox: {
    backgroundColor: "rgba(243,180,42,0.08)",
    borderWidth: 1,
    borderColor: "rgba(243,180,42,0.35)",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 18,
  },

  infoText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 25,
    fontWeight: "500",
  },

  infoHighlight: {
    color: "#F3B42A",
    fontWeight: "800",
  },

  movieCard: {
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#182640",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 20,
  },

  poster: {
    width: "100%",
    height: 220,
    backgroundColor: "#0B1220",
  },

  movieContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  movieTextArea: {
    paddingRight: 4,
  },

  movieTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  movieMeta: {
    color: "#A9B7D1",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },

  movieDescription: {
    color: "#D5DEEE",
    fontSize: 14,
    lineHeight: 22,
    paddingRight: 90,
  },

  ratingBadge: {
    position: "absolute",
    right: 16,
    top: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(243,180,42,0.16)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },

  ratingText: {
    color: "#F3B42A",
    fontSize: 14,
    fontWeight: "800",
  },

  primaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F3B42A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  primaryButtonText: {
    color: "#081120",
    fontSize: 17,
    fontWeight: "800",
  },

  secondaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  ghostButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  ghostButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});