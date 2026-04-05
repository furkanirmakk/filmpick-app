import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import AppScreen from "@/src/components/layout/AppScreen";
import AppHeader from "@/src/components/layout/AppHeader";
import RouletteWheel from "@/src/components/roulette/RouletteWheel";
import { COLORS } from "@/src/constants/colors";
import { getRandomMovie } from "@/src/utils/rouletteRecommendation";

export default function RouletteScreen() {
  const [spinning, setSpinning] = useState(false);

  const handleSpin = async () => {
  if (spinning) return;

  setSpinning(true);

  setTimeout(async () => {
    try {
      const selectedMovie = await getRandomMovie();

      setSpinning(false);

      router.push({
        pathname: "/roulette/result",
        params: { id: selectedMovie.id },
      });
    } catch (error) {
      console.log("Roulette movie fetch error:", error);
      setSpinning(false);
    }
  }, 1800);
};

  return (
    <AppScreen>
      <AppHeader
        title="Film Ruleti"
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Bugün şansına ne çıkacak?</Text>
        <Text style={styles.subtitle}>
          Ruleti çevir ve rastgele bir film önerisi al.
        </Text>

        <RouletteWheel spinning={spinning} />

        <TouchableOpacity
          style={[styles.spinButton, spinning && styles.disabledButton]}
          activeOpacity={0.9}
          onPress={handleSpin}
          disabled={spinning}
        >
          <Text style={styles.spinButtonText}>
            {spinning ? "Çevriliyor..." : "Ruleti Çevir"}
          </Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 24,
  },

  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 12,
  },

  spinButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    minHeight: 56,
    minWidth: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  disabledButton: {
    opacity: 0.5,
  },

  spinButtonText: {
    color: COLORS.primaryDarkText,
    fontSize: 16,
    fontWeight: "800",
  },
});