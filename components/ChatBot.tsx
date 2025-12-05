import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from '../services/apiService';
import { ChatMessage } from '../types';
import { Bot, MessageSquare, Send } from 'lucide-react';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: input }]
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Convert current messages to history format expected by API
      const history = messages.map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));

      const responseText = await sendChatMessage(history, input);

      const botMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: responseText }]
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: "Sorry, I encountered an error. Please try again." }]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-surface rounded-xl border border-white/5 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-surfaceHighlight p-4 border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-DEFAULT/20 rounded-lg flex items-center justify-center text-primary-DEFAULT">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-semibold text-text-main">NIRD Advisor</h2>
          <p className="text-xs text-text-muted">Always here to help</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-text-muted opacity-50">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <p>Start a conversation with NIRD-Bot</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-appear`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                ? 'bg-primary-DEFAULT text-white rounded-br-none'
                : 'bg-surfaceHighlight text-text-main rounded-bl-none border border-white/5'
                }`}
            >
              <div className="leading-relaxed whitespace-pre-wrap prose prose-invert prose-sm max-w-none prose-p:text-inherit prose-headings:text-inherit prose-strong:text-inherit prose-ul:text-inherit prose-li:text-inherit">
                <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surfaceHighlight p-4 rounded-2xl rounded-bl-none border border-white/5 flex gap-2 items-center">
              <div className="w-2 h-2 bg-primary-DEFAULT rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary-DEFAULT rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary-DEFAULT rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-grow bg-surfaceHighlight text-text-main placeholder-text-muted px-4 py-3 rounded-xl outline-none border border-transparent focus:border-primary-DEFAULT/50 transition-colors"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-primary-DEFAULT hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};