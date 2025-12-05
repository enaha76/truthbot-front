export enum AppView {
  HOME = 'HOME',
  CHAT = 'CHAT',
  QUIZ = 'QUIZ',
  DOCS = 'DOCS'
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
