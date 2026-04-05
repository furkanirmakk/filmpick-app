import React from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/src/constants/colors";
import { AppMovie } from "@/src/services/tmdb";

type MovieCardProps = {
  movie: AppMovie;
  variant?: "list" | "grid";
};

export default function MovieCard({
  movie,
  variant = "list",
}: MovieCardProps) {
  const isGrid = variant === "grid";

  return (
    <TouchableOpacity
      style={[styles.card, isGrid ? styles.gridCard : styles.listCard]}
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
        style={isGrid ? styles.gridPoster : styles.listPoster}
      />

      <View style={isGrid ? styles.gridContent : styles.listContent}>
        <View style={styles.textArea}>
          <Text
            style={isGrid ? styles.gridTitle : styles.listTitle}
            numberOfLines={1}
          >
            {movie.title}
          </Text>

          <Text style={styles.meta}>
            {movie.genre} • {movie.year}
          </Text>

          {!isGrid && (
            <Text style={styles.description} numberOfLines={2}>
              {movie.shortDescription}
            </Text>
          )}
        </View>

        <View style={[styles.ratingBadge, isGrid && styles.gridRatingBadge]}>
          <Ionicons name="star" size={12} color={COLORS.primary} />
          <Text style={styles.ratingText}>{movie.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },

  listCard: {
    marginBottom: 16,
  },

  gridCard: {
    width: "48%",
  },

  listPoster: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.posterBackground,
  },

  gridPoster: {
    width: "100%",
    height: 190,
    backgroundColor: COLORS.posterBackground,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  gridContent: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    position: "relative",
    minHeight: 96,
  },

  textArea: {
    flex: 1,
    paddingRight: 10,
  },

  listTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  gridTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
    paddingRight: 54,
  },

  meta: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 22,
  },

  description: {
    color: "#D5DEEE",
    fontSize: 14,
    lineHeight: 22,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.ratingBackground,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
    alignSelf: "flex-start",
  },

  gridRatingBadge: {
    position: "absolute",
    right: 12,
    top: 14,
  },

  ratingText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
});