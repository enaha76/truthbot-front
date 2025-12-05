export enum ContentType {
  TEXT = 'text',
  TWEET = 'tweet',
  ARTICLE = 'article',
  IMAGE = 'image',
}

export interface AnalysisResult {
  id: string;
  date: string; // ISO string
  type: ContentType;
  inputSummary: string;
  verdict: 'True' | 'False' | 'Misleading' | 'Unverified' | 'Satire' | 'Opinion' | 'true' | 'false' | 'misleading' | 'welcome' | 'user';
  score: number; // 0 to 100 trust score
  summary: string;
  reasoning?: string[];
  sources?: { title: string; url: string }[];
  similarClaims?: string[];
  originalContent?: string; // Store the original text/image for chat display
  confidence?: number;
}

export interface Conversation {
  id: string;
  messages: AnalysisResult[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type Theme = 'light' | 'dark';