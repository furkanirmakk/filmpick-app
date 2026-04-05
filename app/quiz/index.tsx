import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AppScreen from "@/src/components/layout/AppScreen";
import AppHeader from "@/src/components/layout/AppHeader";
import QuizProgress from "@/src/components/quiz/QuizProgress";
import QuizOptionCard from "@/src/components/quiz/QuizOptionCard";
import { COLORS } from "@/src/constants/colors";
import { quizQuestions } from "@/src/data/quizQuestions";
import { QuizAnswers } from "@/src/types/quiz";

const initialAnswers: QuizAnswers = {
  mood: "",
  genre: "",
  company: "",
  pace: "",
};

export default function QuizScreen() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);

  const currentQuestion = quizQuestions[step];
  const selectedValue = answers[currentQuestion.id];

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (!selectedValue) return;

    const isLastStep = step === quizQuestions.length - 1;

    if (isLastStep) {
      router.push({
        pathname: "/quiz/result",
        params: {
          mood: answers.mood,
          genre: answers.genre,
          company: answers.company,
          pace: answers.pace,
          [currentQuestion.id]: selectedValue,
        },
      });
      return;
    }

    setStep((prev) => prev + 1);
  };

  return (
    <AppScreen>
      <AppHeader
        title="Akıllı Seçim"
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
      />

      <QuizProgress currentStep={step} totalSteps={quizQuestions.length} />

      <View style={styles.content}>
        <Text style={styles.title}>{currentQuestion.title}</Text>
        <Text style={styles.subtitle}>{currentQuestion.subtitle}</Text>

        <View style={styles.options}>
          {currentQuestion.options.map((option) => (
            <QuizOptionCard
              key={option.value}
              label={option.label}
              selected={selectedValue === option.value}
              onPress={() => handleSelect(option.value)}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedValue && styles.disabledNextButton,
        ]}
        activeOpacity={0.9}
        onPress={handleNext}
        disabled={!selectedValue}
      >
        <Text style={styles.nextButtonText}>
          {step === quizQuestions.length - 1 ? "Sonuçları Gör" : "Devam Et"}
        </Text>
      </TouchableOpacity>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 38,
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  options: {
    marginTop: 8,
  },
  nextButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledNextButton: {
    opacity: 0.45,
  },
  nextButtonText: {
    color: COLORS.primaryDarkText,
    fontSize: 16,
    fontWeight: "800",
  },
});