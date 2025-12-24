
import React, { useState } from 'react';
import { searchGrounding } from '../services/geminiService';
import { GroundingLink } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { MagnifyingGlassIcon, LinkIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const DiscoveryView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; links: GroundingLink[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);
    try {
      const data = await searchGrounding(query);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-y-auto">
      <header className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <GlobeAltIcon className="w-8 h-8 text-cyan-500" />
          <h2 className="text-2xl font-bold text-white">اکتشاف هوشمند منابع</h2>
        </div>
        <p className="text-slate-400">جستجوی جدیدترین مقالات علمی با خلاصه‌های فنی و مراجع لینک‌دار.</p>
      </header>

      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="relative mb-12">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="مثلاً: جدیدترین روش‌های بهینه‌سازی کوپلینگ در توری‌های براگ..."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-16 py-5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-right shadow-xl"
          />
          <MagnifyingGlassIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl transition-all font-bold disabled:opacity-50"
          >
            {isLoading ? 'در حال جستجو...' : 'جستجو'}
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-cyan-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-10 h-10 text-cyan-500" />
              </div>
            </div>
            <p className="text-slate-400 font-medium">هوش مصنوعی در حال تحلیل دیتابیس‌های آنلاین و ترجمه خلاصه‌هاست...</p>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-cyan-400 mb-6 flex items-center gap-2">
                نتایج تحلیل و خلاصه‌های فنی
              </h3>
              <MarkdownRenderer content={result.text} />
            </div>

            {result.links.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">منابع و مراجع یافت شده</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-all group"
                    >
                      <LinkIcon className="w-5 h-5 text-cyan-500 shrink-0" />
                      <span className="text-sm text-slate-200 truncate group-hover:text-white">{link.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryView;
