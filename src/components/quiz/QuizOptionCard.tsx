import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "@/src/constants/colors";

type QuizOptionCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function QuizOptionCard({
  label,
  selected,
  onPress,
}: QuizOptionCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(243,180,42,0.10)",
  },
  label: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  selectedLabel: {
    color: COLORS.primary,
  },
});