import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";

type AppHeaderProps = {
  title: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightPress?: () => void;
};

export default function AppHeader({
  title,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
}: AppHeaderProps) {
  return (
    <View style={styles.topRow}>
      {leftIcon ? (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onLeftPress}
          activeOpacity={0.85}
        >
          <Ionicons name={leftIcon} size={22} color={COLORS.white} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={styles.headerTitle}>{title}</Text>

      {rightIcon ? (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRightPress}
          activeOpacity={0.85}
        >
          <Feather name={rightIcon} size={20} color={COLORS.white} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    minHeight: 48,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.navBackground,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "800",
  },
  placeholder: {
    width: 42,
    height: 42,
  },
});