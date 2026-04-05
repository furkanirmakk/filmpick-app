import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "@/src/constants/colors";

type CategoryChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export default function CategoryChip({
  label,
  active,
  onPress,
}: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.activeChip]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.activeChipText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  chipText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },

  activeChipText: {
    color: COLORS.primaryDarkText,
    fontWeight: "800",
  },
});