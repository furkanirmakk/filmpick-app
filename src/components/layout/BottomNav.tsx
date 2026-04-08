import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";

type BottomNavProps = {
  activeTab: "home" | "explore" | "favorites" | "profile";
};

export default function BottomNav({ activeTab }: BottomNavProps) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.8}
        onPress={() => router.replace("/explore")}
      >
        <Feather
          name="search"
          size={20}
          color={activeTab === "explore" ? COLORS.white : COLORS.textSecondary}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "explore" && styles.activeNavText,
          ]}
        >
          Keşfet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.8}
        onPress={() => router.replace("/")}
      >
        <Ionicons
          name="sparkles-outline"
          size={20}
          color={activeTab === "home" ? COLORS.white : COLORS.textSecondary}
        />
        <Text
          style={[styles.navText, activeTab === "home" && styles.activeNavText]}
        >
          Ana Sayfa
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.8}
        onPress={() => router.replace("/favorites")}
      >
        <Ionicons
          name="heart-outline"
          size={20}
          color={activeTab === "favorites" ? COLORS.white : COLORS.textSecondary}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "favorites" && styles.activeNavText,
          ]}
        >
          Favori
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.8}
        onPress={() => router.replace("/profile")}
      >
        <Ionicons
          name="person-outline"
          size={20}
          color={activeTab === "profile" ? COLORS.white : COLORS.textSecondary}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "profile" && styles.activeNavText,
          ]}
        >
          Profil
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 12,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.appBackground,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  activeNavText: {
    color: COLORS.white,
    fontWeight: "700",
  },
});