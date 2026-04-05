import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type OptionItem = {
  id: string;
  label: string;
  value: "short" | "medium" | "long";
};

export default function QuizQuestion4Screen() {
  const { genre, company, mood } = useLocalSearchParams<{
    genre?: string;
    company?: string;
    mood?: string;
  }>();

  const [selectedOption, setSelectedOption] = useState<"short" | "medium" | "long" | null>(null);

  const options: OptionItem[] = useMemo(
    () => [
      { id: "1", label: "Kısa", value: "short" },
      { id: "2", label: "Orta", value: "medium" },
      { id: "3", label: "Uzun", value: "long" },
    ],
    []
  );

  const handleContinue = () => {
    if (!selectedOption) return;

    router.push({
      pathname: "/quiz-matching",
      params: {
        genre,
        company,
        mood,
        duration: selectedOption,
      },
    });
  };

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

          <Text style={styles.headerTitle}>Akıllı Seçim</Text>

          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>4/4</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "100%" }]} />
          </View>

          <Text style={styles.questionTitle}>
            Ne kadar süreli bir{"\n"}film istiyorsun?
          </Text>

          <View style={styles.optionsWrapper}>
            {options.map((option) => {
              const isSelected = selectedOption === option.value;

              return (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.9}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedOption(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            !selectedOption && styles.primaryButtonDisabled,
          ]}
          activeOpacity={0.9}
          onPress={handleContinue}
          disabled={!selectedOption}
        >
          <Text
            style={[
              styles.primaryButtonText,
              !selectedOption && styles.primaryButtonTextDisabled,
            ]}
          >
            Sonucu Gör
          </Text>
        </TouchableOpacity>
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

  stepBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  stepText: {
    color: "#C7D3E8",
    fontSize: 14,
    fontWeight: "700",
  },

  scrollContent: {
    paddingBottom: 20,
  },

  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
    marginBottom: 28,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#F3B42A",
  },

  questionTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    lineHeight: 38,
    fontWeight: "800",
    marginBottom: 28,
  },

  optionsWrapper: {
    gap: 14,
  },

  optionButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: "#16243F",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  optionButtonSelected: {
    backgroundColor: "#F3B42A",
    borderColor: "#F3B42A",
  },

  optionText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  optionTextSelected: {
    color: "#081120",
  },

  primaryButton: {
    marginTop: 16,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F3B42A",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonDisabled: {
    backgroundColor: "#7E6A2A",
  },

  primaryButtonText: {
    color: "#081120",
    fontSize: 18,
    fontWeight: "800",
  },

  primaryButtonTextDisabled: {
    color: "#2A3240",
  },
});