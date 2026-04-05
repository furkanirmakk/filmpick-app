import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/src/constants/colors";

type ProfileStatCardProps = {
  value: string;
  label: string;
};

export default function ProfileStatCard({
  value,
  label,
}: ProfileStatCardProps) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statBox: {
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 18,
    width: "30%",
    borderRadius: 16,
    alignItems: "center",
  },

  statNumber: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "800",
  },

  statLabel: {
    color: "#C7D3E8",
    marginTop: 4,
  },
});