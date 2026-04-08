import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppScreen from "@/src/components/layout/AppScreen";
import AppHeader from "@/src/components/layout/AppHeader";
import { COLORS } from "@/src/constants/colors";
import BottomNav from "@/src/components/layout/BottomNav";

export default function RouletteResultScreen() {
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const title = Array.isArray(params.title) ? params.title[0] : params.title;
  const year = Array.isArray(params.year) ? params.year[0] : params.year;
  const genre = Array.isArray(params.genre) ? params.genre[0] : params.genre;
  const rating = Array.isArray(params.rating) ? params.rating[0] : params.rating;
  const poster = Array.isArray(params.poster) ? params.poster[0] : params.poster;
  const shortDescription = Array.isArray(params.shortDescription)
    ? params.shortDescription[0]
    : params.shortDescription;

  if (!id || !title) {
    return (
      <AppScreen>
        <AppHeader
          title="Sonuç"
          leftIcon="chevron-back"
          onLeftPress={() => router.back()}
        />
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Image source={{ uri: poster as string }} style={styles.poster} />

          <Text style={styles.movieTitle}>{title}</Text>
          <Text style={styles.meta}>
            {genre} • {year} • ⭐ {rating}
          </Text>

          <Text style={styles.description}>{shortDescription}</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/movie/[id]",
                params: { id: String(id) },
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
      </ScrollView>

      <BottomNav activeTab="home" />
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

  scrollContent: {
    paddingBottom: 120,
  },

  content: {
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