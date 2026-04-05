import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { movies, MovieItem } from "./data/movies";

export default function ExploreScreen() {
  const [searchText, setSearchText] = useState("");

  const filteredMovies = useMemo(() => {
    const normalizedQuery = searchText.trim().toLowerCase();

    if (!normalizedQuery) {
      return movies;
    }

    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(normalizedQuery)
    );
  }, [searchText]);

  const renderMovieItem = ({ item }: { item: MovieItem }) => {
    return (
      <TouchableOpacity
        style={styles.movieCard}
        activeOpacity={0.92}
        onPress={() =>
          router.push({
            pathname: "/movie/[id]",
            params: { id: item.id },
          })
        }
      >
        <Image source={{ uri: item.poster }} style={styles.poster} />

        <View style={styles.movieInfo}>
          <View style={styles.textArea}>
            <Text style={styles.movieTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.movieMeta}>
              {item.genre} • {item.year}
            </Text>
            <Text style={styles.movieDescription} numberOfLines={2}>
              {item.shortDescription}
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
          <Text style={styles.headerTitle}>Keşfet</Text>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.85}
            onPress={() => setSearchText("")}
          >
            <Feather name="x" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#A9B7D1" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Film ara..."
            placeholderTextColor="#7F92B2"
            style={styles.searchInput}
          />
        </View>

        <Text style={styles.resultText}>
          {searchText.trim()
            ? `"${searchText}" için ${filteredMovies.length} sonuç`
            : `${filteredMovies.length} film listeleniyor`}
        </Text>

        {filteredMovies.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="film-outline" size={34} color="#A9B7D1" />
            <Text style={styles.emptyTitle}>Film bulunamadı</Text>
            <Text style={styles.emptyText}>
              Başka bir isimle tekrar aramayı dene.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredMovies}
            keyExtractor={(item) => item.id}
            renderItem={renderMovieItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Feather name="search" size={20} color="#FFFFFF" />
            <Text style={[styles.navText, styles.activeNavText]}>Keşfet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="sparkles-outline" size={20} color="#D6DCEC" />
            <Text style={styles.navText}>Ana Sayfa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => router.push("/favorites")}
          >
            <Ionicons name="heart-outline" size={20} color="#D6DCEC" />
            <Text style={styles.navText}>Favori</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => router.push("/profile" as any)}
          >
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
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
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

  searchBox: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#16243F",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },

  resultText: {
    color: "#A9B7D1",
    fontSize: 14,
    marginBottom: 14,
  },

  listContent: {
    paddingBottom: 90,
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
    justifyContent: "space-between",
  },

  textArea: {
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
    fontSize: 14,
    marginBottom: 8,
  },

  movieDescription: {
    color: "#D5DEEE",
    fontSize: 14,
    lineHeight: 22,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(243,180,42,0.16)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
    alignSelf: "flex-start",
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
    paddingBottom: 80,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 10,
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