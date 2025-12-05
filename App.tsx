import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import { ChatBot } from './components/ChatBot';
import { Quiz } from './components/Quiz';
import { Documentation } from './components/Documentation';
import { Login } from './components/Login';
import { getProfile } from './services/apiService';
import { TreePine, Gamepad2, Bot, BookOpen, LogOut, Code, Menu } from 'lucide-react';

const App: React.FC = () => {
  // ... (state remains same)
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; full_name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await getProfile(token);
          setUser(profile);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Session expired", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (token: string, username: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser({ username });
    getProfile(token).then(setUser).catch(console.error);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView(AppView.HOME);
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentView) {
      case AppView.CHAT:
        return <ChatBot />;
      case AppView.QUIZ:
        return <Quiz />;
      case AppView.DOCS:
        return <Documentation />;
      case AppView.HOME:
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-fade-in">
            <div className="space-y-6 max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold text-text-main tracking-tight">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-DEFAULT to-blue-400">{user?.full_name || user?.username || 'Rebel'}</span>.
              </h1>
              <p className="text-xl text-text-muted max-w-2xl mx-auto font-light">
                The resistance awaits. What is your mission today?
              </p>
            </div>

            <div className="w-full max-w-2xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-DEFAULT to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-surfaceHighlight rounded-lg p-2 border border-white/10">
                <input
                  type="text"
                  placeholder={`Ask NIRD-Bot about Linux, ${user?.username}...`}
                  className="w-full bg-transparent text-text-main placeholder-text-muted px-4 py-3 outline-none text-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setCurrentView(AppView.CHAT);
                  }}
                />
                <button
                  onClick={() => setCurrentView(AppView.CHAT)}
                  className="bg-primary-DEFAULT hover:bg-primary-hover text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Start
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
              <div
                onClick={() => setCurrentView(AppView.QUIZ)}
                className="bg-surface border border-white/5 p-6 rounded-xl hover:border-primary-DEFAULT/50 transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-main font-semibold text-lg">NIRD Quiz</span>
                  <Gamepad2 className="text-text-muted group-hover:text-primary-DEFAULT transition-colors" size={24} />
                </div>
                <p className="text-text-muted text-sm">Test your knowledge on Green IT and Digital Freedom.</p>
              </div>

              <div
                onClick={() => setCurrentView(AppView.CHAT)}
                className="bg-surface border border-white/5 p-6 rounded-xl hover:border-primary-DEFAULT/50 transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-main font-semibold text-lg">AI Advisor</span>
                  <Bot className="text-text-muted group-hover:text-primary-DEFAULT transition-colors" size={24} />
                </div>
                <p className="text-text-muted text-sm">Chat with NIRD-Bot about Open Source and privacy.</p>
              </div>

              <div
                onClick={() => setCurrentView(AppView.DOCS)}
                className="bg-surface border border-white/5 p-6 rounded-xl hover:border-primary-DEFAULT/50 transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-main font-semibold text-lg">Documentation</span>
                  <BookOpen className="text-text-muted group-hover:text-primary-DEFAULT transition-colors" size={24} />
                </div>
                <p className="text-text-muted text-sm">Learn about the NIRD initiative and how this works.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text-muted">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-text-main selection:bg-primary-DEFAULT selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer gap-2" onClick={() => setCurrentView(AppView.HOME)}>
              <div className="w-8 h-8 bg-primary-DEFAULT rounded-lg flex items-center justify-center text-white">
                <TreePine size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">Open<span className="text-primary-DEFAULT">NIRD</span></span>
            </div>

            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-text-muted">
                <button onClick={() => setCurrentView(AppView.CHAT)} className="hover:text-text-main transition-colors">Chat</button>
                <button onClick={() => setCurrentView(AppView.QUIZ)} className="hover:text-text-main transition-colors">Quiz</button>
                <button onClick={() => setCurrentView(AppView.DOCS)} className="hover:text-text-main transition-colors">Docs</button>
              </div>
            )}

            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <button onClick={handleLogout} className="text-text-muted hover:text-red-400 transition-colors flex items-center gap-1 text-sm">
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-text-main transition-colors">
                <Code size={20} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div key={currentView} className="animate-fade-in h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};


export default App;