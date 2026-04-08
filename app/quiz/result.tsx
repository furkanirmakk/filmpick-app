import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AppScreen from "@/src/components/layout/AppScreen";
import AppHeader from "@/src/components/layout/AppHeader";
import BottomNav from "@/src/components/layout/BottomNav";
import { COLORS } from "@/src/constants/colors";
import { getQuizRecommendations } from "@/src/utils/quizRecommendation";
import { QuizAnswers } from "@/src/types/quiz";
import { AppMovie } from "@/src/services/tmdb";
import { useFavorites } from "@/src/hooks/useFavorites";

export default function QuizResultScreen() {
  const params = useLocalSearchParams();

  const answers: QuizAnswers = {
    mood: String(params.mood || ""),
    genre: String(params.genre || ""),
    company: String(params.company || ""),
    pace: String(params.pace || ""),
  };

  const [recommendedMovies, setRecommendedMovies] = useState<AppMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const { loadAllLists } = useFavorites();

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);

        const latestLists = await loadAllLists();

        const excludedIds = [
          ...latestLists.favorites,
          ...latestLists.watchlist,
          ...latestLists.watched,
        ];

        const results = await getQuizRecommendations(answers, {
          excludedIds,
          targetCount: 3,
        });

        setRecommendedMovies(results);
      } catch (error) {
        console.log("Quiz recommendations error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [answers.mood, answers.genre, answers.company, answers.pace, loadAllLists]);

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

  if (loading) {
    return (
      <AppScreen>
        <AppHeader
          title="Senin İçin Öneriler"
          leftIcon="chevron-back"
          onLeftPress={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.subtitle}>Öneriler hazırlanıyor...</Text>
        </View>
        <BottomNav activeTab="home" />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <AppHeader
        title="Senin İçin Öneriler"
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
      />

      <View style={styles.headerArea}>
        <Text style={styles.title}>Seçimlerine göre öneriler hazır</Text>
        <Text style={styles.subtitle}>
          Sana en uygun olabilecek filmleri seçtik.
        </Text>
      </View>

      {recommendedMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>Yeni öneri bulunamadı</Text>
          <Text style={styles.subtitle}>
            Favori, izlenen ve izlenecek listelerinde olmayan uygun film
            bulunamadı.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.9}
            onPress={() => router.replace("/quiz")}
          >
            <Text style={styles.retryButtonText}>Quiz’i Yeniden Yap</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recommendedMovies}
          keyExtractor={(item) => item.id}
          renderItem={renderMovieItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            <View style={styles.footerArea}>
              <TouchableOpacity
                style={styles.retryButton}
                activeOpacity={0.9}
                onPress={() => router.replace("/quiz")}
              >
                <Text style={styles.retryButtonText}>Quiz’i Yeniden Yap</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <BottomNav activeTab="home" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 90,
  },

  headerArea: {
    marginBottom: 16,
  },

  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
  },

  listContent: {
    paddingBottom: 100,
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

  footerArea: {
    marginTop: 8,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
    gap: 16,
  },

  retryButton: {
    width: "100%",
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
});