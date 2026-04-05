import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/src/constants/colors";

type RouletteWheelProps = {
  spinning: boolean;
};

export default function RouletteWheel({ spinning }: RouletteWheelProps) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.outerRing, spinning && styles.spinningGlow]}>
        <View style={styles.innerRing}>
          <Text style={styles.centerEmoji}>🎬</Text>
          <Text style={styles.centerText}>
            {spinning ? "Çevriliyor..." : "Hazır"}
          </Text>
        </View>
      </View>

      <View style={styles.pointer} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 32,
  },

  outerRing: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 10,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  spinningGlow: {
    transform: [{ scale: 1.02 }],
  },

  innerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: COLORS.screenBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  centerEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },

  centerText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
  },

  pointer: {
    marginTop: 14,
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 22,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: COLORS.primary,
    transform: [{ rotate: "180deg" }],
  },
});