
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { chatWithGemini } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { PaperAirplaneIcon, MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'سلام! من دستیار هوشمند شما در حوزه طراحی موج‌بر و گرتینگ هستم. چطور می‌توانم به شما در بهینه‌سازی پارامترهای کوپلینگ یا ستاپ‌های رایتینگ کمک کنم؟\n\nمن اکنون از فرمول‌های ریاضی $\\lambda = 2n_{eff}\\Lambda$ و بلاک‌های کدنویسی نیز پشتیبانی می‌کنم.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithGemini(
        [...messages, userMsg],
        "You are a professional assistant for waveguide and grating design researchers. Answer technical questions in Persian with high precision. Use LaTeX for math ($...$ or $$...$$) and code blocks for programming snippets."
      );
      setMessages(prev => [...prev, { role: 'model', text: response || 'متاسفم، مشکلی در پاسخگویی پیش آمد.' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'خطایی در برقراری ارتباط با مدل هوش مصنوعی رخ داد.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-white">مرجع و چت‌بات هوشمند</h2>
          <p className="text-sm text-slate-400">پشتیبانی از فرمول‌های LaTeX و هایلایت کد</p>
        </div>
        <button 
          onClick={toggleVoice}
          className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${
            isListening 
              ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' 
              : 'bg-cyan-500/10 border-cyan-500 text-cyan-500'
          }`}
        >
          {isListening ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
          <span className="text-sm font-bold">{isListening ? 'در حال شنیدن...' : 'فعالسازی صوتی'}</span>
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-slate-200 rounded-tr-none' 
                : 'bg-cyan-900/30 text-cyan-50 border border-cyan-800/50 rounded-tl-none'
            }`}>
              <MarkdownRenderer content={msg.text} className="text-sm" />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-cyan-900/10 p-4 rounded-2xl rounded-tl-none border border-cyan-800/20">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="سوال خود را اینجا بپرسید..."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all pr-16 text-right"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute left-2 bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <PaperAirplaneIcon className="w-6 h-6 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
