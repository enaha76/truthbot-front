import React, { useRef, useEffect } from 'react';
import { ContentForm } from '../components/ContentForm';
import { ResultCard } from '../components/ResultCard';
import { ContentType, AnalysisResult } from '../types';
import { AnalysisService } from '../services/analysisService';
import { User, Sparkles, Zap, MessageSquare, Search, Check } from 'lucide-react';
import { useAuth } from '../App';

interface AnalyzerPageProps {
  currentConversation: AnalysisResult[];
  currentConversationId?: string;
  onNewConversation: () => void;
  onMessageAdded: (message: AnalysisResult) => void;
}

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({
  currentConversation,
  currentConversationId,
  onNewConversation,
  onMessageAdded
}) => {
  const [loading, setLoading] = React.useState(false);
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new message appears
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation, loading]);

  const handleAnalyze = async (type: ContentType, content: string, context?: string) => {
    setLoading(true);
    try {
      // Create and add user message first
      const userMessage: AnalysisResult = {
        id: crypto.randomUUID(),
        inputSummary: content.substring(0, 100),
        originalContent: content,
        summary: '',
        verdict: 'user' as any,
        score: 0,
        type,
        date: new Date().toISOString(),
        confidence: 0,
      };

      onMessageAdded(userMessage);

      // Then perform analysis
      // Ensure we have a discussion ID
      let discussionId = currentConversationId;
      let isNewDiscussion = false;
      
      if (!discussionId) {
        // Create new discussion if none exists (fallback for lazy creation)
        discussionId = await AnalysisService.createDiscussion();
        isNewDiscussion = true;
        window.dispatchEvent(new Event('history-updated'));
      }

      // Check if this is the first message (conversation has no analyses yet)
      const isFirstMessage = currentConversation.filter(m => m.verdict !== 'user').length === 0;

      const analysis = await AnalysisService.analyzeContent(type, content, discussionId);
      analysis.originalContent = content;

      onMessageAdded(analysis);

      // Auto-generate title if this is the first message in the discussion
      if (isFirstMessage || isNewDiscussion) {
        try {
          await AnalysisService.generateDiscussionTitle(discussionId);
        } catch (error) {
          console.error("Failed to generate title:", error);
        }
      }

      // Trigger conversation list refresh
      window.dispatchEvent(new Event('history-updated'));
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const LogoIcon = () => (
    <div className="relative inline-flex items-center justify-center">
      <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse-slow rounded-full"></div>
      <div className="relative w-20 h-20 bg-white dark:bg-dark-card rounded-2xl flex items-center justify-center shadow-xl border border-gray-100 dark:border-white/10">
        <Search className="w-10 h-10 text-primary dark:text-secondary" />
        <Check className="w-5 h-5 text-primary absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} strokeWidth={3} />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full relative">

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 bg-white dark:bg-dark-bg">
        {currentConversation.length === 0 && !loading ? (
          // Welcome / Empty State
          <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="max-w-3xl w-full flex flex-col items-center">

              <div className="mb-8">
                <LogoIcon />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#285E61] dark:from-secondary dark:to-primary">
                  Truthboot
                </span>
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-lg leading-relaxed">
                Uncover the truth with advanced AI. Verify news, social posts, and images in seconds.
              </p>

              {/* Feature/Example Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => handleAnalyze(ContentType.TEXT, "Is the Earth flat?")}
                  className="flex items-start gap-4 p-5 text-left bg-mist dark:bg-dark-card/50 hover:bg-white dark:hover:bg-dark-card border border-transparent hover:border-primary/30 dark:hover:border-primary/30 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <div className="p-2.5 bg-mint dark:bg-primary/20 rounded-lg text-primary dark:text-secondary group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Common Myths</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">"Is the Earth flat?"</p>
                  </div>
                </button>

                <button
                  onClick={() => handleAnalyze(ContentType.TWEET, "Breaking: Aliens landed in NYC today!")}
                  className="flex items-start gap-4 p-5 text-left bg-mist dark:bg-dark-card/50 hover:bg-white dark:hover:bg-dark-card border border-transparent hover:border-primary/30 dark:hover:border-primary/30 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <div className="p-2.5 bg-secondary/30 dark:bg-secondary/10 rounded-lg text-[#1A4546] dark:text-secondary group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Social Media</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Analyze viral tweets or posts</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Conversation View
          <div className="flex flex-col pb-40 w-full max-w-4xl mx-auto">

            {/* Messages */}
            {currentConversation.map((message, idx) => (
              <div key={message.id} className="w-full animate-slideUp">
                {/* Show user message if verdict is 'user' */}
                {message.verdict === 'user' ? (
                  <div className="p-6 md:p-8 flex gap-6 group">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0 shadow-sm">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="relative flex-1">
                      <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">You</div>
                      {message.type === 'image' && message.originalContent ? (
                        <div className="mt-2">
                          <img
                            src={`data:image/jpeg;base64,${message.originalContent}`}
                            alt="Uploaded image"
                            className="max-w-md rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
                          />
                        </div>
                      ) : (
                        <div className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                          {message.originalContent || message.inputSummary}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* AI Response */
                  <div className="w-full">
                    <div className="p-6 md:p-8 flex gap-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#1A4546] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary/20">
                        {loading && idx === currentConversation.length - 1 ? (
                          <Sparkles className="w-6 h-6 animate-pulse" />
                        ) : (
                          <Search className="w-6 h-6" />
                        )}
                      </div>
                      <div className="relative flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                          Truthboot
                        </div>

                        <ResultCard result={message} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading State */}
            {loading && (
              <div className="w-full">
                <div className="p-6 md:p-8 flex gap-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#1A4546] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary/20">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="relative flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Truthboot</div>
                    <div className="space-y-3 mt-2 max-w-lg">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/80 to-transparent dark:from-dark-bg dark:via-dark-bg/80 pt-20 pb-8 px-4 pointer-events-none">
        <div className="pointer-events-auto">
          <ContentForm onAnalyze={handleAnalyze} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};