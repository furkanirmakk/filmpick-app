import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import AppScreen from "@/src/components/layout/AppScreen";
import BottomNav from "@/src/components/layout/BottomNav";
import { COLORS } from "@/src/constants/colors";

export default function HomeScreen() {
  return (
    <AppScreen>
      <Text style={styles.homeLabel}>01 HOME</Text>

      <View style={styles.header}>
        <View style={styles.headerTextArea}>
          <Text style={styles.welcomeText}>Hoş geldin</Text>
          <Text style={styles.titleText}>Bugün ne izlemek{"\n"}istersin?</Text>
        </View>

        <TouchableOpacity style={styles.magicButton} activeOpacity={0.85}>
          <Feather name="star" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.card, styles.rouletteCard]}
        activeOpacity={0.92}
        onPress={() => router.push("/roulette")}
      >
        <View style={styles.cardTop}>
          <Ionicons name="ticket-outline" size={16} color={COLORS.primary} />
          <Text style={[styles.cardLabel, { color: COLORS.primary }]}>
            Film Ruleti
          </Text>
        </View>

        <Text style={styles.cardTitle}>
          Ruleti çevir, rastgele{"\n"}film bul.
        </Text>

        <Text style={styles.cardDesc}>
          Tek tuşla sürpriz bir film önerisi al.
        </Text>
        <Text style={styles.cardDesc}>
          Poster, puan ve kısa özet hemen karşında.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.9}
          onPress={() => router.push("/roulette")}
        >
          <Ionicons name="play" size={18} color={COLORS.primaryDarkText} />
          <Text style={styles.primaryButtonText}>Ruleti Aç</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.smartCard]}
        activeOpacity={0.92}
        onPress={() => router.push("/quiz")}
      >
        <View style={styles.cardTop}>
          <Ionicons name="help-circle-outline" size={16} color="#C8CFFF" />
          <Text style={[styles.cardLabel, { color: "#C8CFFF" }]}>
            Akıllı Seçim
          </Text>
        </View>

        <Text style={styles.cardTitle}>
          3-4 soruda sana{"\n"}uygun filmleri bul.
        </Text>

        <Text style={styles.cardDesc}>
          Moduna, türe ve kiminle izleyeceğine
        </Text>
        <Text style={styles.cardDesc}>
          göre en uygun 3 öneriyi çıkaralım.
        </Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.9}
          onPress={() => router.push("/quiz")}
        >
          <Ionicons
            name="sparkles-outline"
            size={18}
            color={COLORS.primaryDarkText}
          />
          <Text style={styles.secondaryButtonText}>Akıllı Seçimi Aç</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <BottomNav activeTab="home" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  homeLabel: {
    alignSelf: "center",
    color: "#F4F7FF",
    fontSize: 11,
    letterSpacing: 4,
    marginBottom: 18,
    opacity: 0.95,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  headerTextArea: {
    flex: 1,
    paddingRight: 12,
  },

  welcomeText: {
    color: COLORS.textSoft,
    fontSize: 16,
    marginBottom: 6,
  },

  titleText: {
    color: COLORS.white,
    fontSize: 22,
    lineHeight: 32,
    fontWeight: "800",
  },

  magicButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.navBackground,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  card: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },

  rouletteCard: {
    backgroundColor: COLORS.rouletteCard,
    minHeight: 290,
  },

  smartCard: {
    backgroundColor: COLORS.smartCard,
    minHeight: 250,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  cardLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  cardTitle: {
    color: "#0A1732",
    fontSize: 24,
    lineHeight: 38,
    fontWeight: "800",
    marginBottom: 14,
  },

  cardDesc: {
    color: "#D6DCE8",
    fontSize: 15,
    lineHeight: 26,
  },

  primaryButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: COLORS.primaryDarkText,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  secondaryButton: {
    marginTop: 22,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: COLORS.primaryDarkText,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});