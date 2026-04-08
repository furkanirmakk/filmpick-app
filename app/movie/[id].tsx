import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppScreen from "@/src/components/layout/AppScreen";
import AppHeader from "@/src/components/layout/AppHeader";
import { COLORS } from "@/src/constants/colors";
import { useFavorites } from "@/src/hooks/useFavorites";
import {
  AppCastMember,
  AppMovie,
  getMovieCredits,
  getMovieDetails,
  getMovieTrailer,
} from "@/src/services/tmdb";
import CastCard from "@/src/components/movie/CastCard";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const movieId = String(id || "");
  const {
    isFavorite,
    isInWatchlist,
    isWatched,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
  } = useFavorites(movieId);
  const [movie, setMovie] = useState<AppMovie | null>(null);
  const [cast, setCast] = useState<AppCastMember[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);

        const movieId = String(id || "");
        if (!movieId) {
          setMovie(null);
          return;
        }

        const [movieData, castData, trailerData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getMovieTrailer(movieId),
        ]);

        setMovie(movieData);
        setCast(castData);
        setTrailerUrl(trailerData);
      } catch (error) {
        console.log("Movie detail fetch error:", error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

 



  if (loading) {
    return (
      <AppScreen>
        <AppHeader
          title="Film Detayı"
          leftIcon="chevron-back"
          onLeftPress={() => router.back()}
        />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Film yükleniyor...</Text>
        </View>
      </AppScreen>
    );
  }

  if (!movie) {
    return (
      <AppScreen>
        <AppHeader
          title="Film Detayı"
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
        title="Film Detayı"
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
      />

      <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scrollContent}
>
  {movie.backdrop ? (
    <Image source={{ uri: movie.backdrop }} style={styles.backdrop} />
  ) : null}

  <Image source={{ uri: movie.poster }} style={styles.poster} />

  <View style={styles.titleBlock}>
    <Text style={styles.title}>{movie.title}</Text>

    <Text style={styles.meta}>
      {movie.year} • ⭐ {movie.rating}
    </Text>

    {movie.genre ? (
      <Text style={styles.genreText}>{movie.genre}</Text>
    ) : null}

    <View style={styles.infoRow}>
      {movie.runtime ? (
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>{movie.runtime}</Text>
        </View>
      ) : null}

      {movie.voteCount ? (
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>{movie.voteCount} oy</Text>
        </View>
      ) : null}

      {movie.popularity ? (
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>
            Popülerlik {movie.popularity}
          </Text>
        </View>
      ) : null}
    </View>
  </View>

  <View style={styles.actionCardsRow}>
    <TouchableOpacity
      style={[styles.actionCard, isFavorite && styles.actionCardActive]}
      activeOpacity={0.88}
      onPress={() => toggleFavorite(movieId)}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={18}
        color={isFavorite ? "#FF6B81" : "#A9B7D1"}
      />
      <Text
        style={[
          styles.actionCardText,
          isFavorite && styles.actionCardTextActive,
        ]}
      >
        Favori
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.actionCard, isInWatchlist && styles.actionCardActive]}
      activeOpacity={0.88}
      onPress={() => toggleWatchlist(movieId)}
    >
      <Ionicons
        name={isInWatchlist ? "bookmark" : "bookmark-outline"}
        size={18}
        color={isInWatchlist ? "#F3B42A" : "#A9B7D1"}
      />
      <Text
        style={[
          styles.actionCardText,
          isInWatchlist && styles.actionCardTextActive,
        ]}
      >
        İzlenecek
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.actionCard, isWatched && styles.actionCardActive]}
      activeOpacity={0.88}
      onPress={() => toggleWatched(movieId)}
    >
      <Ionicons
        name={isWatched ? "checkmark-circle" : "checkmark-circle-outline"}
        size={18}
        color={isWatched ? "#4CD964" : "#A9B7D1"}
      />
      <Text
        style={[
          styles.actionCardText,
          isWatched && styles.actionCardTextActive,
        ]}
      >
        İzlenen
      </Text>
    </TouchableOpacity>
  </View>

  <View style={styles.sectionBlock}>
    <Text style={styles.sectionTitle}>Özet</Text>
    <Text style={styles.description}>{movie.description}</Text>
  </View>

  {trailerUrl ? (
    <TouchableOpacity
      style={styles.trailerButton}
      activeOpacity={0.9}
      onPress={() => Linking.openURL(trailerUrl)}
    >
      <Text style={styles.trailerButtonText}>Fragmanı İzle</Text>
    </TouchableOpacity>
  ) : null}

  {cast.length > 0 ? (
    <View style={styles.castSection}>
      <Text style={styles.sectionTitle}>Oyuncular</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.castList}
      >
        {cast.map((item) => (
          <CastCard
            key={item.id}
            name={item.name}
            character={item.character}
            profileImage={item.profileImage}
          />
        ))}
      </ScrollView>
    </View>
  ) : null}
</ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  genreText: {
    color: COLORS.textMuted,
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.textMuted,
    fontSize: 15,
  },

  errorText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },

  backdrop: {
    width: "100%",
    height: 190,
    borderRadius: 24,
    backgroundColor: COLORS.cardBackground,
    marginBottom: 14,
  },

  poster: {
    width: "100%",
    height: 360,
    borderRadius: 24,
    backgroundColor: COLORS.posterBackground,
    marginBottom: 18,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  titleArea: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },

  meta: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },

  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },

  infoBadge: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  infoBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },

  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 26,
  },

  trailerButton: {
    marginTop: 18,
    marginBottom: 24,
    width: "100%",
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  trailerButtonText: {
    color: COLORS.primaryDarkText,
    fontSize: 15,
    fontWeight: "800",
  },

  castSection: {
    marginTop: 4,
  },

  castList: {
    paddingTop: 4,
    paddingBottom: 12,
  },

 
actionCardsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 8,
  marginTop: 12,
  marginBottom: 12,
},

actionCard: {
  flex: 1,
  height: 48,
  borderRadius: 12,
  backgroundColor: "#161F33",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.07)",
  alignItems: "center",
  justifyContent: "center",
},

actionCardActive: {
  backgroundColor: "#1D2840",
  borderColor: "rgba(255,255,255,0.14)",
},

actionCardText: {
  marginTop: 8,
  color: "#D6DCEC",
  fontSize: 12,
  fontWeight: "700",
},

actionCardTextActive: {
  color: "#FFFFFF",
},

});