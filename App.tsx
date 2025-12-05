import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Theme, AnalysisResult, Conversation } from './types';
import { StorageService } from './services/storageService';
import { AuthService } from './services/authService';
import { AnalysisService } from './services/analysisService';
import { LoginPage } from './pages/LoginPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { Layout } from './components/Layout';

// --- Theme Context ---
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Main Chat Wrapper ---
const ChatRoute: React.FC = () => {
  const { user } = useAuth();
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(undefined);
  const [currentConversation, setCurrentConversation] = useState<AnalysisResult[]>([]);

  // Load conversation from backend
  useEffect(() => {
    const loadConversation = async () => {
      if (currentConversationId) {
        try {
          const conversation = await AnalysisService.getDiscussion(currentConversationId);
          if (conversation) {
            setCurrentConversation(conversation.messages);
          }
        } catch (error) {
          console.error("Failed to load conversation:", error);
          setCurrentConversation([]);
        }
      } else {
        setCurrentConversation([]);
      }
    };
    loadConversation();
  }, [currentConversationId]);

  if (!user) return <Navigate to="/login" replace />;

  const handleNewChat = async () => {
    try {
      // Create new discussion immediately
      const newDiscussionId = await AnalysisService.createDiscussion();
      setCurrentConversationId(newDiscussionId);
      setCurrentConversation([]);
      // Trigger sidebar refresh
      window.dispatchEvent(new Event('history-updated'));
    } catch (error) {
      console.error("Failed to create new conversation:", error);
      // Fallback: just clear locally
      setCurrentConversationId(undefined);
      setCurrentConversation([]);
    }
  };

  return (
    <Layout
      onSelectHistory={(id) => setCurrentConversationId(id)}
      onNewChat={handleNewChat}
      currentResultId={currentConversationId}
    >
      <AnalyzerPage
        currentConversation={currentConversation}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewChat}
        onMessageAdded={(message) => {
          // Update local state optimistically
          setCurrentConversation(prev => [...prev, message]);
        }}
      />
    </Layout>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Restore User
    const savedUser = StorageService.getUser();
    if (savedUser) setUser(savedUser);

    // Restore Theme
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (sysDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.className = initialTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  };

  const login = async (email: string, password: string) => {
    try {
      const user = await AuthService.login(email, password);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw to let caller handle UI feedback
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await AuthService.register(email, password, name);
      // Auto-login after registration
      await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <HashRouter>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/" element={<ChatRoute />} />
            {/* Redirect old routes */}
            <Route path="/history" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}