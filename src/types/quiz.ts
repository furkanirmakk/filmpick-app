export type QuizAnswers = {
  mood: string;
  genre: string;
  company: string;
  pace: string;
};

export type QuizOption = {
  label: string;
  value: string;
};

export type QuizQuestion = {
  id: keyof QuizAnswers;
  title: string;
  subtitle: string;
  options: QuizOption[];
};