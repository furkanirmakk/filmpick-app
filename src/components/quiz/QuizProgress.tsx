import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/src/constants/colors";

type QuizProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export default function QuizProgress({
  currentStep,
  totalSteps,
}: QuizProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.stepText}>
        Soru {currentStep + 1} / {totalSteps}
      </Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  stepText: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 10,
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.cardBackground,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
});