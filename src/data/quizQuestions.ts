import { QuizQuestion } from "@/src/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "mood",
    title: "Bugün nasıl bir moddasın?",
    subtitle: "Ruh haline göre doğru öneriyi bulalım.",
    options: [
      { label: "Eğlenmek istiyorum", value: "fun" },
      { label: "Duygusal bir şey olsun", value: "emotional" },
      { label: "Gerilim istiyorum", value: "tense" },
      { label: "Fark etmez", value: "any" },
    ],
  },
  {
    id: "genre",
    title: "En çok hangi tür ilgini çekiyor?",
    subtitle: "İstersen net seç, istersen genel bırak.",
    options: [
      { label: "Aksiyon", value: "action" },
      { label: "Bilim Kurgu", value: "sci-fi" },
      { label: "Dram", value: "drama" },
      { label: "Komedi", value: "comedy" },
    ],
  },
  {
    id: "company",
    title: "Kiminle izleyeceksin?",
    subtitle: "Önerileri izleme ortamına göre şekillendirelim.",
    options: [
      { label: "Tek başıma", value: "alone" },
      { label: "Arkadaşlarla", value: "friends" },
      { label: "Partnerimle", value: "partner" },
      { label: "Ailemle", value: "family" },
    ],
  },
  {
    id: "pace",
    title: "Nasıl bir tempo istersin?",
    subtitle: "Yavaş akan mı, hızlı akan mı?",
    options: [
      { label: "Hızlı ve sürükleyici", value: "fast" },
      { label: "Dengeli", value: "balanced" },
      { label: "Sakin ve derin", value: "slow" },
      { label: "Fark etmez", value: "any" },
    ],
  },
];