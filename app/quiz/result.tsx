import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppScreen from "@/src/components/layout/AppScreen";
import AppHeader from "@/src/components/layout/AppHeader";
import BottomNav from "@/src/components/layout/BottomNav";
import MovieCard from "@/src/components/movie/MovieCard";
import { COLORS } from "@/src/constants/colors";
import { getQuizRecommendations } from "@/src/utils/quizRecommendation";
import { QuizAnswers } from "@/src/types/quiz";
import { AppMovie } from "@/src/services/tmdb";

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

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const results = await getQuizRecommendations(answers);
        setRecommendedMovies(results);
      } catch (error) {
        console.log("Quiz recommendations error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [answers.mood, answers.genre, answers.company, answers.pace]);

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
          Sana en uygun olabilecek 3 film seçtik.
        </Text>
      </View>

      <FlatList
        data={recommendedMovies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieCard movie={item} variant="list" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
  },

  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },

  listContent: {
    paddingBottom: 100,
  },

  footerArea: {
    marginTop: 8,
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
  },

  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
});