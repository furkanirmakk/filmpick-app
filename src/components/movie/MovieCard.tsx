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

      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },

  listCard: {
    marginBottom: 16,
  },

  gridCard: {
    width: "31.5%",
    position: "relative",
  },

  listPoster: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.posterBackground,
  },

  gridPoster: {
    width: "100%",
    height: 170,
    backgroundColor: COLORS.posterBackground,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
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
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(12, 18, 28, 0.88)",
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 4,
  },

  ratingText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
  },
});