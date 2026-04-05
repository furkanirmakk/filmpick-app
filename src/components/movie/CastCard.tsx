import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/src/constants/colors";

type CastCardProps = {
  name: string;
  character: string;
  profileImage: string | null;
};

export default function CastCard({
  name,
  character,
  profileImage,
}: CastCardProps) {
  return (
    <View style={styles.card}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>👤</Text>
        </View>
      )}

      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.character} numberOfLines={1}>
        {character}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    marginRight: 12,
  },
  image: {
    width: 110,
    height: 140,
    borderRadius: 18,
    marginBottom: 8,
    backgroundColor: COLORS.cardBackground,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 28,
  },
  name: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  character: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
});