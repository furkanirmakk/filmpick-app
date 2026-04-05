import React from "react";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "@/src/constants/colors";

type ProfileMenuItemProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
};

export default function ProfileMenuItem({
  icon,
  label,
  onPress,
}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Feather name={icon} size={20} color={COLORS.white} />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 16,
  },

  menuText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});