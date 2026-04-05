import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

export default function QuizMatchingScreen() {
  const params = useLocalSearchParams<{
    genre?: string;
    company?: string;
    mood?: string;
    duration?: string;
  }>();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    const loopAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loopAnimation.start();

    timeoutRef.current = setTimeout(() => {
      router.replace({
        pathname: "/quiz-result",
        params: {
          genre: params.genre ?? "",
          company: params.company ?? "",
          mood: params.mood ?? "",
          duration: params.duration ?? "",
        },
      });
    }, 2200);

    return () => {
      loopAnimation.stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [params.genre, params.company, params.mood, params.duration, rotateAnim]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Eşleştiriliyor</Text>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
            <Feather name="sparkles" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerArea}>
          <View style={styles.progressWrapper}>
            <Svg width="280" height="280" viewBox="0 0 280 280" style={styles.trackSvg}>
              <Circle
                cx="140"
                cy="140"
                r="102"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="18"
                fill="none"
              />
            </Svg>

            <Animated.View
              style={[
                styles.animatedRing,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              <Svg width="280" height="280" viewBox="0 0 280 280">
                <Circle
                  cx="140"
                  cy="140"
                  r="102"
                  stroke="#F3B42A"
                  strokeWidth="18"
                  fill="none"
                  strokeDasharray="165 476"
                  strokeLinecap="round"
                  transform="rotate(-110 140 140)"
                />
              </Svg>
            </Animated.View>

            <View style={styles.innerCircle}>
              <Feather name="sparkles" size={28} color="#F3B42A" />
              <Text style={styles.innerText}>Analiz ediliyor</Text>
            </View>
          </View>

          <Text style={styles.mainTitle}>
            Sana en uygun filmleri{"\n"}buluyoruz
          </Text>

          <Text style={styles.subText}>
            Tür, ruh hali ve izleme ortamına göre{"\n"}öneriler hazırlanıyor.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020B18",
  },

  screen: {
    flex: 1,
    backgroundColor: "#041225",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    borderRadius: 28,
    marginHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(130,160,255,0.12)",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    minHeight: 48,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  centerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },

  progressWrapper: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 34,
    position: "relative",
  },

  trackSvg: {
    position: "absolute",
  },

  animatedRing: {
    position: "absolute",
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },

  innerCircle: {
    position: "absolute",
    width: 158,
    height: 158,
    borderRadius: 79,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  innerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  mainTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 38,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 14,
  },

  subText: {
    color: "#BFD0EA",
    fontSize: 16,
    lineHeight: 28,
    textAlign: "center",
  },
});