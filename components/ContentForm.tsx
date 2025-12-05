import React, { useState, useRef, useEffect } from 'react';
import { ContentType } from '../types';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface ContentFormProps {
  onAnalyze: (type: ContentType, content: string, context?: string) => void;
  isLoading: boolean;
}

export const ContentForm: React.FC<ContentFormProps> = ({ onAnalyze, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [inputText]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isLoading || (!inputText.trim() && !selectedImage)) return;

    if (selectedImage) {
      const base64Data = selectedImage.split(',')[1];
      onAnalyze(ContentType.IMAGE, base64Data, inputText || "Analyze this image");
    } else {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const computedMode = inputText.match(urlRegex) ? ContentType.ARTICLE : ContentType.TEXT;
      onAnalyze(computedMode, inputText);
    }
    
    setInputText('');
    setSelectedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("File size too large. Max 8MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      
      {/* Image Preview */}
      {selectedImage && (
        <div className="mb-4 animate-slideUp">
           <div className="relative inline-block group">
             <img 
              src={selectedImage} 
              alt="Upload preview" 
              className="h-24 w-auto rounded-xl border border-gray-200 dark:border-white/10 shadow-lg" 
             />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
               <button 
                 onClick={() => setSelectedImage(null)}
                 className="bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
               >
                 <X className="w-4 h-4" />
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Main Command Bar */}
      <div className={`
        relative flex items-end gap-2 w-full p-2
        bg-white/80 dark:bg-[#2e303e]/80 backdrop-blur-xl
        border border-gray-200 dark:border-white/10
        rounded-2xl shadow-2xl shadow-primary/5 dark:shadow-none
        transition-all duration-300
        ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:border-primary/50 dark:hover:border-white/20 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'}
      `}>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-3 mb-0.5 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-secondary bg-transparent hover:bg-mint dark:hover:bg-white/5 rounded-xl transition-colors"
          title="Upload Image"
          disabled={isLoading}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a claim, news link, or upload an image..."
          rows={1}
          disabled={isLoading}
          className="flex-1 max-h-[150px] py-3.5 bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed"
        />

        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || (!inputText.trim() && !selectedImage)}
          className={`
            mb-1 p-2.5 rounded-xl transition-all duration-300 shadow-sm
            ${isLoading || (!inputText.trim() && !selectedImage)
              ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-[#235b5c] shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105 active:scale-95'}
          `}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="text-center mt-3">
         <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest opacity-60">
            Truthboot AI
         </p>
      </div>
    </div>
  );
};