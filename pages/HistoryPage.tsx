import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { AnalysisResult, Conversation } from '../types';
import { Search, Trash2, Calendar, FileText, MessageSquare } from 'lucide-react';
import { ResultCard } from '../components/ResultCard';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedConvId, setExpandedConvId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'static' | 'chats'>('static');

  useEffect(() => {
    setHistory(StorageService.getHistory());
    setConversations(StorageService.getConversations());
  }, []);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all static analyses?")) {
      StorageService.clearHistory();
      setHistory([]);
    }
  };

  const clearConversations = () => {
    if (confirm("Are you sure you want to clear all conversations?")) {
      StorageService.clearConversations();
      setConversations([]);
    }
  };

  const filteredHistory = history.filter(item => 
    item.inputSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConversations = conversations.filter(conv =>
    conv.messages.some(msg =>
      msg.inputSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.summary.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getVerdictColor = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'true': return 'text-green-600 bg-green-50 border-green-200';
      case 'false': return 'text-red-600 bg-red-50 border-red-200';
      case 'misleading': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'welcome': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('static')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'static'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Static Examples ({filteredHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'chats'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Conversations ({filteredConversations.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No analysis history found.</p>
          <p className="text-gray-400 text-sm">Start analyzing content to see it here.</p>
        </div>
      ) : (
        <>
          {activeTab === 'static' && (
            <div className="space-y-4">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No results found</div>
              ) : (
                filteredHistory.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                    <div 
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      <div className="flex gap-4 items-center mb-2 sm:mb-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${item.score > 70 ? 'bg-green-100 text-green-700' : item.score > 40 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                          {item.score}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1 text-sm sm:text-base">{item.inputSummary}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getVerdictColor(item.verdict)}`}>
                              {item.verdict}
                            </span>
                            <div className="flex items-center text-xs text-gray-400 gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-indigo-600 font-medium">
                        {expandedId === item.id ? 'Close Details' : 'View Details'}
                      </div>
                    </div>
                    {expandedId === item.id && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <ResultCard result={item} />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'chats' && (
            <div className="space-y-4">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No conversations yet.</p>
                  <p className="text-gray-400 text-sm">Start a new chat to see it here.</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div key={conv.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                    <div 
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedConvId(expandedConvId === conv.id ? null : conv.id)}
                    >
                      <div className="flex gap-4 items-center mb-2 sm:mb-0">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm bg-blue-100 text-blue-700">
                          {conv.messages.length}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1 text-sm sm:text-base">
                            {conv.messages[0]?.inputSummary || "Untitled Conversation"}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-blue-50 border-blue-200 text-blue-600">
                              {conv.messages.length} messages
                            </span>
                            <div className="flex items-center text-xs text-gray-400 gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(conv.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-indigo-600 font-medium">
                        {expandedConvId === conv.id ? 'Collapse' : 'View'}
                      </div>
                    </div>
                    {expandedConvId === conv.id && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                        {conv.messages.map((msg, idx) => (
                          <div key={msg.id} className="space-y-2">
                            <div className="text-xs font-semibold text-gray-500 uppercase">Message {idx + 1}</div>
                            <div className="p-3 bg-white rounded border border-gray-200">
                              <ResultCard result={msg} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};