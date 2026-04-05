import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import AppScreen from "@/src/components/layout/AppScreen";
import BottomNav from "@/src/components/layout/BottomNav";
import AppHeader from "@/src/components/layout/AppHeader";
import ProfileStatCard from "@/src/components/profile/ProfileStatCard";
import ProfileMenuItem from "@/src/components/profile/ProfileMenuItem";
import { COLORS } from "@/src/constants/colors";
import { useFavorites } from "@/src/hooks/useFavorites";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const {
    favoriteCount,
    watchlistCount,
    watchedCount,
    loadAllLists,
  } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      loadAllLists();
    }, [loadAllLists])
  );

  return (
  <AppScreen>
    <AppHeader
      title="Profil"
      leftIcon="chevron-back"
      onLeftPress={() => router.back()}
    />

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: "https://i.pravatar.cc/300",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>Furkan Irmak</Text>
        <Text style={styles.subtitle}>Film keşfetmeyi seviyor 🎬</Text>
      </View>

      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statCard}
          activeOpacity={0.9}
          onPress={() => router.push("/library/favorites")}
        >
          <Ionicons name="heart" size={20} color="#FF4C4C" />
          <Text style={styles.statNumber}>{favoriteCount}</Text>
          <Text style={styles.statLabel}>Favori</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          activeOpacity={0.9}
          onPress={() => router.push("/library/watchlist")}
        >
          <Ionicons name="bookmark" size={20} color="#FFD166" />
          <Text style={styles.statNumber}>{watchlistCount}</Text>
          <Text style={styles.statLabel}>İzlenecek</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          activeOpacity={0.9}
          onPress={() => router.push("/library/watched")}
        >
          <Ionicons name="checkmark-circle" size={20} color="#4CD964" />
          <Text style={styles.statNumber}>{watchedCount}</Text>
          <Text style={styles.statLabel}>İzlenen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        <ProfileMenuItem
          icon="settings"
          label="Ayarlar"
          onPress={() => {}}
        />

        <ProfileMenuItem
          icon="share-2"
          label="Uygulamayı Paylaş"
          onPress={() => {}}
        />

        <ProfileMenuItem
          icon="info"
          label="Uygulama Hakkında"
          onPress={() => {}}
        />

        <ProfileMenuItem
          icon="mail"
          label="Bize Ulaş"
          onPress={() => {}}
        />
      </View>
    </ScrollView>

    <BottomNav activeTab="profile" />
  </AppScreen>
);
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },

  profileCard: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },

  name: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    color: COLORS.textMuted,
    marginTop: 4,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  menu: {
    gap: 16,
  },

  statsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#1E2230",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#2E3348",
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 6,
  },

  statLabel: {
    fontSize: 13,
    color: "#A0A4B8",
    marginTop: 2,
  },
});