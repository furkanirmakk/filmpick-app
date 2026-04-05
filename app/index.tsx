import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Text style={styles.homeLabel}>01 HOME</Text>

        <View style={styles.header}>
          <View style={styles.headerTextArea}>
            <Text style={styles.welcomeText}>Hoş geldin</Text>
            <Text style={styles.titleText}>Bugün ne izlemek{"\n"}istersin?</Text>
          </View>

          <TouchableOpacity style={styles.magicButton} activeOpacity={0.85}>
            <Feather name="star" size={20} color="#F4B52A" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.card, styles.rouletteCard]}
          activeOpacity={0.92}
          onPress={() => router.push("/roulette")}
        >
          <View style={styles.cardTop}>
            <Ionicons name="ticket-outline" size={16} color="#F4B52A" />
            <Text style={[styles.cardLabel, { color: "#F4B52A" }]}>
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
            <Ionicons name="play" size={18} color="#081120" />
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
            <Ionicons name="sparkles-outline" size={18} color="#081120" />
            <Text style={styles.secondaryButtonText}>Akıllı Seçimi Aç</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Feather name="search" size={20} color="#D6DCEC" />
            <Text style={styles.navText}>Keşfet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Ionicons name="sparkles-outline" size={20} color="#FFFFFF" />
            <Text style={[styles.navText, styles.activeNavText]}>Ana Sayfa</Text>
          </TouchableOpacity>

          <TouchableOpacity
  style={styles.navItem}
  activeOpacity={0.8}
  onPress={() => router.push("/favorites")}
>
  <Ionicons name="heart-outline" size={20} color="#D6DCEC" />
  <Text style={styles.navText}>Favori</Text>
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
    paddingTop: 10,
    paddingBottom: 12,
    borderRadius: 28,
    margin: 8,
    borderWidth: 1,
    borderColor: "rgba(130, 160, 255, 0.12)",
  },

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
    color: "#B8C3DA",
    fontSize: 16,
    marginBottom: 6,
  },

  titleText: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 32,
    fontWeight: "800",
  },

  magicButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
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
    backgroundColor: "#323842",
    minHeight: 290,
  },

  smartCard: {
    backgroundColor: "#2C3053",
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
    backgroundColor: "#F4B52A",
    borderRadius: 18,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#081120",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  secondaryButton: {
    marginTop: 22,
    backgroundColor: "#F4B52A",
    borderRadius: 18,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#081120",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  bottomNav: {
    marginTop: "auto",
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