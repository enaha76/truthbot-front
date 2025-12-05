import React, { useState, useEffect } from 'react';
import { useAuth, useTheme } from '../App';
import {
  LogOut, Menu, X, Plus, MessageSquare,
  Moon, Sun, Trash2, Search, Edit2, Check, XIcon
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { AnalysisService } from '../services/analysisService';
import { Conversation } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onSelectHistory: (id: string) => void;
  onNewChat: () => void;
  currentResultId?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, onSelectHistory, onNewChat, currentResultId }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [animatingTitles, setAnimatingTitles] = useState<Set<string>>(new Set());

  const refreshConversations = async () => {
    try {
      if (user) {
        const discussions = await AnalysisService.getDiscussions();
        
        // Detect title changes and trigger animation
        const newAnimating = new Set<string>();
        discussions.forEach((newConv: any) => {
          const oldConv = conversations.find((c: any) => c.id === newConv.id);
          if (oldConv && oldConv.title !== newConv.title) {
            // Title changed - check if it's from auto-generated timestamp to smart title
            const isTimestampTitle = (title: string) => title.startsWith('Chat ') && title.includes(':');
            if (isTimestampTitle(oldConv.title) && !isTimestampTitle(newConv.title)) {
              // Changed from timestamp to smart title
              newAnimating.add(newConv.id);
            }
          }
        });
        
        if (newAnimating.size > 0) {
          setAnimatingTitles(newAnimating);
          // Remove animation after 2 seconds
          setTimeout(() => {
            setAnimatingTitles(new Set());
          }, 2000);
        }
        
        setConversations(discussions);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  useEffect(() => {
    refreshConversations();
    window.addEventListener('history-updated', refreshConversations);
    return () => window.removeEventListener('history-updated', refreshConversations);
  }, [user]);

  const handleClearConversations = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Clear all conversations? This will delete them from the server.")) {
      // TODO: Add API call to delete all conversations from backend
      // For now, just refresh
      refreshConversations();
      onNewChat();
    }
  };

  const handleStartEdit = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveEdit = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await AnalysisService.updateDiscussionTitle(id, editingTitle);
      setEditingId(null);
      refreshConversations();
    } catch (error) {
      console.error("Failed to update title:", error);
      alert("Failed to update conversation name");
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditingTitle('');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-mist dark:bg-[#151922] border-r border-gray-200 dark:border-white/5 transition-colors duration-300">

      {/* New Chat Action */}
      <div className="p-4">
        <button
          onClick={() => { onNewChat(); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-white hover:border-primary/50 dark:hover:bg-white/10 transition-all shadow-sm hover:shadow group"
        >
          <div className="bg-mint dark:bg-primary/20 text-primary dark:text-secondary p-1 rounded-md">
            <Plus className="w-4 h-4" />
          </div>
          New Conversation
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
        {conversations.length > 0 ? (
          <>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 px-2 uppercase tracking-wider">My Chats</div>
            {conversations.map((conversation) => {
              const firstMessage = conversation.messages[0];
              const title = conversation.title || firstMessage?.inputSummary || "Untitled Conversation";
              const isEditing = editingId === conversation.id;
              const isAnimating = animatingTitles.has(conversation.id);
              
              return (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm rounded-lg transition-all group relative ${currentResultId === conversation.id
                    ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white font-medium shadow-sm ring-1 ring-gray-100 dark:ring-white/5'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                    } ${isAnimating ? 'animate-pulse ring-2 ring-primary dark:ring-secondary' : ''}`}
                >
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${currentResultId === conversation.id ? 'text-primary dark:text-secondary' : 'text-gray-400'}`} />
                  
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-primary dark:border-secondary rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(e as any, conversation.id);
                          if (e.key === 'Escape') handleCancelEdit(e as any);
                        }}
                      />
                      <button
                        onClick={(e) => handleSaveEdit(e, conversation.id)}
                        className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded text-green-600"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span 
                        onClick={() => { onSelectHistory(conversation.id); setMobileMenuOpen(false); }}
                        className="truncate text-left flex-1 opacity-90 cursor-pointer"
                      >
                        {title}
                      </span>
                      <button
                        onClick={(e) => handleStartEdit(e, conversation.id, title)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {/* Message Count Badge */}
                      {conversation.messages && conversation.messages.length > 0 && (
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                          {conversation.messages.length}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div className="text-center py-8 px-4">
            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400 dark:text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Start a new chat to begin</p>
          </div>
        )}
      </div>

      {/* Bottom Profile & Config */}
      <div className="p-4 border-t border-gray-200 dark:border-white/5 space-y-2 bg-white/50 dark:bg-black/20">

        {conversations.length > 0 && (
          <button
            onClick={handleClearConversations}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="pt-3 mt-1 border-t border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-[#1A4546] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">Basic Plan</div>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-mist dark:bg-dark-bg overflow-hidden font-sans">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] flex-col flex-shrink-0 z-20 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-600 dark:text-gray-300">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-semibold text-gray-800 dark:text-white">Truthboot</span>
        <button onClick={onNewChat} className="p-2 -mr-2 text-gray-600 dark:text-gray-300">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-dark-bg">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white focus:outline-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full h-full max-w-full bg-white dark:bg-dark-bg transition-colors duration-200">
        {children}
      </main>
    </div>
  );
};