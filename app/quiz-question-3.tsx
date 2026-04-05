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
  value: string;
};

export default function QuizQuestion3Screen() {
  const { genre, company } = useLocalSearchParams();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options: OptionItem[] = useMemo(
    () => [
      { id: "1", label: "Eğlenceli", value: "fun" },
      { id: "2", label: "Heyecanlı", value: "exciting" },
      { id: "3", label: "Duygusal", value: "emotional" },
      { id: "4", label: "Düşündüren", value: "mindful" },
    ],
    []
  );

  const handleContinue = () => {
    if (!selectedOption) return;

    router.push({
      pathname: "/quiz-question-4",
      params: {
        genre,
        company,
        mood: selectedOption,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Akıllı Seçim</Text>

          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>3/4</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.questionTitle}>
            Bugün nasıl bir şey{"\n"}izlemek istiyorsun?
          </Text>

          <View style={styles.optionsWrapper}>
            {options.map((option) => {
              const isSelected = selectedOption === option.value;

              return (
                <TouchableOpacity
                  key={option.id}
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
          onPress={handleContinue}
          disabled={!selectedOption}
        >
          <Text style={styles.primaryButtonText}>Devam Et</Text>
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
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
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
    backgroundColor: "rgba(255,255,255,0.08)",
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
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  optionButtonSelected: {
    backgroundColor: "#F3B42A",
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
});