import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MovieItem, movies } from "./data/movies";

export default function FavoritesScreen() {
  const [favoriteMovies, setFavoriteMovies] = useState<MovieItem[]>([]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem("favoriteMovies");
      const favorites: string[] = stored ? JSON.parse(stored) : [];
      const favoriteMoviesList = movies.filter((movie) =>
        favorites.includes(String(movie.id))
      );
      setFavoriteMovies(favoriteMoviesList);
    } catch (error) {
      console.log("Favorites load error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const renderMovieCard = ({ item }: { item: MovieItem }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
        onPress={() =>
          router.push({
            pathname: "/movie/[id]",
            params: { id: item.id },
          })
        }
      >
        <Image source={{ uri: item.poster }} style={styles.poster} />

        <View style={styles.cardContent}>
          <View style={styles.textArea}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.meta}>
              {item.genre} • {item.year}
            </Text>
          </View>

          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#F3B42A" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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

          <Text style={styles.headerTitle}>Favoriler</Text>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
            <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {favoriteMovies.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={34} color="#A9B7D1" />
            <Text style={styles.emptyTitle}>Henüz favori filmin yok</Text>
            <Text style={styles.emptyText}>
              Film detayındaki kalp ikonuna basarak favorilerine ekleyebilirsin.
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoriteMovies}
            keyExtractor={(item) => item.id}
            renderItem={renderMovieCard}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}

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

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
            <Text style={[styles.navText, styles.activeNavText]}>Favori</Text>
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

  listContent: {
    paddingBottom: 90,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  card: {
    width: "48%",
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#182640",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  poster: {
    width: "100%",
    height: 190,
    backgroundColor: "#0B1220",
  },

  cardContent: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    position: "relative",
    minHeight: 96,
  },

  textArea: {
    paddingRight: 54,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },

  meta: {
    color: "#A9B7D1",
    fontSize: 14,
    lineHeight: 22,
  },

  ratingBadge: {
    position: "absolute",
    right: 12,
    top: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(243,180,42,0.16)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
  },

  ratingText: {
    color: "#F3B42A",
    fontSize: 12,
    fontWeight: "800",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 10,
    textAlign: "center",
  },

  emptyText: {
    color: "#A9B7D1",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
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