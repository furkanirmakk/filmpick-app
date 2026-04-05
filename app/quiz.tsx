import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function QuizScreen() {
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

          <Text style={styles.headerTitle}>Akıllı Seçim</Text>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
            <Feather name="sparkles" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.iconBox}>
            <Feather name="sparkles" size={26} color="#F3B42A" />
          </View>

          <Text style={styles.cardTitle}>
            Sana birkaç kısa{"\n"}soru soralım.
          </Text>

          <Text style={styles.cardDescription}>
            Cevaplarına göre tam moduna uygun
          </Text>
          <Text style={styles.cardDescription}>
            3 film önerisi çıkaracağız. Ortalama
          </Text>
          <Text style={styles.cardDescription}>
            süre: 20 saniye.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={() => router.push("/quiz-question")}
          >
            <Text style={styles.primaryButtonText}>Başla</Text>
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
    paddingBottom: 16,
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
    marginBottom: 34,
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

  card: {
    marginTop: 36,
    backgroundColor: "#2A2E51",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 48,
    fontWeight: "800",
    marginBottom: 18,
  },

  cardDescription: {
    color: "#E2E8F5",
    fontSize: 18,
    lineHeight: 30,
  },

  primaryButton: {
    marginTop: 30,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F3B42A",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#081120",
    fontSize: 18,
    fontWeight: "800",
  },
});