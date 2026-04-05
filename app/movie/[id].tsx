import React, { useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { movies } from "./../data/movies";

export default function MovieDetail() {
  const { id } = useLocalSearchParams();

  const movie = useMemo(() => {
    return movies.find((m) => m.id === id) || movies[0];
  }, [id]);

  const [isFavorite, setIsFavorite] = useState(false);

useEffect(() => {
  const loadFavoriteStatus = async () => {
    try {
      const stored = await AsyncStorage.getItem("favoriteMovies");
      const favorites: string[] = stored ? JSON.parse(stored) : [];
      setIsFavorite(favorites.includes(String(movie.id)));
    } catch (error) {
      console.log("Favorite load error:", error);
    }
  };

  loadFavoriteStatus();
}, [movie.id]);

const toggleFavorite = async () => {
  try {
    const stored = await AsyncStorage.getItem("favoriteMovies");
    const favorites: string[] = stored ? JSON.parse(stored) : [];

    const movieId = String(movie.id);

    let updatedFavorites: string[];

    if (favorites.includes(movieId)) {
      updatedFavorites = favorites.filter((favId) => favId !== movieId);
      setIsFavorite(false);
    } else {
      updatedFavorites = [...favorites, movieId];
      setIsFavorite(true);
    }

    await AsyncStorage.setItem(
      "favoriteMovies",
      JSON.stringify(updatedFavorites)
    );

    console.log("UPDATED FAVORITES:", updatedFavorites);
  } catch (error) {
    console.log("Favorite toggle error:", error);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Film Detayı</Text>

            <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
  <Ionicons
    name={isFavorite ? "heart" : "heart-outline"}
    size={20}
    color={isFavorite ? "#F3B42A" : "#fff"}
  />
</TouchableOpacity>
          </View>

          {/* POSTER */}
          <Image source={{ uri: movie.poster }} style={styles.poster} />

          {/* TITLE */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{movie.title}</Text>

            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#F3B42A" />
              <Text style={styles.ratingText}>{movie.rating}</Text>
            </View>
          </View>

          {/* META */}
          <Text style={styles.meta}>
            {movie.genre} • {movie.year} • {movie.duration} dk
          </Text>

          {/* INFO CARDS */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Yönetmen</Text>
              <Text style={styles.infoValue}>{movie.director}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Dil</Text>
              <Text style={styles.infoValue}>{movie.language}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Sınıf</Text>
              <Text style={styles.infoValue}>{movie.ageRating}</Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.sectionTitle}>Kısa Açıklama</Text>

          <Text style={styles.description}>
            {movie.longDescription}
          </Text>

          {/* BUTTONS */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace("/roulette")}
            >
              <Text style={styles.primaryText}>Başka Film Öner</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.secondaryText}>Ana Sayfa</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#020B18",
  },

  container: {
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  poster: {
    width: "100%",
    height: 240,
    borderRadius: 22,
    marginBottom: 20,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(243,180,42,0.18)",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  ratingText: {
    color: "#F3B42A",
    fontWeight: "700",
    marginLeft: 4,
  },

  meta: {
    color: "#9FB3D1",
    marginTop: 6,
    marginBottom: 22,
    fontSize: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  infoCard: {
    flex: 1,
    backgroundColor: "#16243F",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  infoTitle: {
    color: "#9FB3D1",
    fontSize: 13,
    marginBottom: 6,
  },

  infoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  description: {
    color: "#D5DEEE",
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 28,
    opacity: 0.95,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  primaryButton: {
    flex: 1,
    backgroundColor: "#F3B42A",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginRight: 10,
  },

  primaryText: {
    color: "#081120",
    fontWeight: "700",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#1A2A45",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  secondaryText: {
    color: "#fff",
    fontWeight: "700",
  },
});