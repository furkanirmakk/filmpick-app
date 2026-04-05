import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { movies } from "./data/movies";

const getDurationType = (duration: number): "short" | "medium" | "long" => {
  if (duration < 60) return "short";
  if (duration > 120) return "long";
  return "medium";
};

export default function QuizResultScreen() {
  const { genre, company, mood, duration } = useLocalSearchParams<{
    genre?: string;
    company?: string;
    mood?: string;
    duration?: string;
  }>();

  const recommendedMovies = useMemo(() => {
    const genreFiltered = movies.filter((movie) => movie.category === genre);

    const scoredMovies = genreFiltered.map((movie) => {
      let score = 0;

      if (movie.category === genre) score += 4;
      if (movie.watchWith.includes(String(company))) score += 2;
      if (movie.moodTags.includes(String(mood))) score += 2;
      if (getDurationType(movie.duration) === duration) score += 2;

      return {
        ...movie,
        matchScore: score,
      };
    });

    const sortedMovies = scoredMovies.sort(
      (a, b) => b.matchScore - a.matchScore || b.rating - a.rating
    );

    if (sortedMovies.length >= 3) {
      return sortedMovies.slice(0, 3);
    }

    if (sortedMovies.length > 0) {
      const remaining = movies
        .filter((movie) => movie.category !== genre)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3 - sortedMovies.length);

      return [...sortedMovies, ...remaining];
    }

    return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [genre, company, mood, duration]);

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

          <Text style={styles.headerTitle}>Senin İçin Seçtik</Text>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
            <Feather name="share-2" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Cevaplarına göre 3 öneri hazır</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {recommendedMovies.map((movie) => (
            <TouchableOpacity
              key={movie.id}
              style={styles.movieCard}
              activeOpacity={0.92}
              onPress={() =>
                router.push({
                  pathname: "/movie/[id]",
                  params: { id: movie.id },
                })
              }
            >
              <Image
                source={{ uri: movie.poster }}
                style={styles.poster}
                resizeMode="cover"
              />

              <View style={styles.movieInfo}>
                <View style={styles.movieTextArea}>
                  <Text style={styles.movieTitle}>{movie.title}</Text>
                  <Text style={styles.movieMeta}>
                    {movie.genre} • {movie.year}
                  </Text>
                </View>

                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#F3B42A" />
                  <Text style={styles.ratingText}>{movie.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Feather name="search" size={20} color="#D6DCEC" />
            <Text style={styles.navText}>Keşfet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="sparkles-outline" size={20} color="#FFFFFF" />
            <Text style={[styles.navText, styles.activeNavText]}>
              Ana Sayfa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
  style={styles.navItem}
  activeOpacity={0.8}
  onPress={() => router.push("/favorites")}
>
  <Ionicons name="heart-outline" size={20} color="#D6DCEC" />
  <Text style={styles.navText}>Favori</Text>
</TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Ionicons name="person-outline" size={20} color="#D6DCEC" />
            <Text style={styles.navText}>Profil</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 12,
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
    marginBottom: 18,
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

  subtitle: {
    color: "#C7D3E8",
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 18,
  },

  scrollContent: {
    paddingBottom: 12,
  },

  movieCard: {
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#182640",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 16,
  },

  poster: {
    width: "100%",
    height: 180,
    backgroundColor: "#0B1220",
  },

  movieInfo: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  movieTextArea: {
    flex: 1,
    paddingRight: 10,
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
  },

  ratingBadge: {
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

  bottomSpacer: {
    height: 90,
  },

  bottomNav: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 12,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },

  navText: {
    marginTop: 4,
    fontSize: 12,
    color: "#D6DCEC",
    fontWeight: "500",
  },

  activeNavText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});