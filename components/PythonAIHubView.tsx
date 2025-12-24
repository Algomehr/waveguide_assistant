
import React, { useState, useMemo } from 'react';
import { PYTHON_TOPICS } from '../constants';
import { PythonTopic } from '../types';
import { generatePythonTutorial } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { 
  ArrowRightIcon, 
  CodeBracketIcon, 
  SparklesIcon, 
  CommandLineIcon,
  ChevronDoubleLeftIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const PythonAIHubView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<PythonTopic | null>(null);
  const [tutorialContent, setTutorialContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(PYTHON_TOPICS.map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredTopics = useMemo(() => {
    if (activeCategory === 'All') return PYTHON_TOPICS;
    return PYTHON_TOPICS.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const handleTopicClick = async (topic: PythonTopic) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setTutorialContent(null);
    try {
      const content = await generatePythonTutorial(topic.title);
      setTutorialContent(content);
    } catch (err) {
      setTutorialContent('خطایی در تولید محتوای برنامه‌نویسی رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'text-emerald-400 bg-emerald-400/10';
      case 'Intermediate': return 'text-amber-400 bg-amber-400/10';
      case 'Advanced': return 'text-rose-400 bg-rose-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  if (selectedTopic) {
    return (
      <div className="flex flex-col h-full bg-slate-900 overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedTopic(null)}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
            >
              <ArrowRightIcon className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedTopic.title}</h2>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-tighter">{selectedTopic.category}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getDifficultyColor(selectedTopic.difficulty)}`}>{selectedTopic.difficulty}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <CommandLineIcon className="w-4 h-4" />
            <span>Python Environment: v3.11+</span>
          </div>
        </div>

        <div className="p-8 max-w-5xl mx-auto w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                <SparklesIcon className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white mb-2">در حال تولید داکیومنت هوشمند...</p>
                <p className="text-slate-400 text-sm">هوش مصنوعی در حال کدنویسی و فرمول‌نویسی مبحث انتخابی است.</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px]"></div>
              
              <MarkdownRenderer content={tutorialContent || ''} />
              
              <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center text-slate-500">
                <p className="text-xs italic">پایان درس - مثال‌ها بر اساس استانداردهای فوتونیک تولید شده‌اند.</p>
                <button 
                   onClick={() => setSelectedTopic(null)}
                   className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 text-sm font-bold transition-colors"
                >
                  بازگشت به لیست مباحث
                  <ChevronDoubleLeftIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="p-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-cyan-500/10 rounded-2xl">
            <CodeBracketIcon className="w-8 h-8 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">مرکز پایتون و هوش مصنوعی</h2>
            <p className="text-slate-400 mt-1">توسعه مهارت‌های محاسباتی، یادگیری ماشین و بهینه‌سازی در طراحی فوتونیک.</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <FunnelIcon className="w-5 h-5 text-slate-500 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 border ${
                activeCategory === cat 
                ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {cat === 'All' ? 'همه مباحث' : cat}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className="group relative bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 p-7 rounded-[2rem] text-right transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 flex flex-col items-start overflow-hidden"
              >
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-cyan-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="w-full flex justify-between items-center mb-6">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full uppercase">
                      {topic.category}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <CommandLineIcon className="w-7 h-7 text-slate-600 group-hover:text-cyan-500 transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors relative z-10">{topic.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed text-right w-full mb-6 line-clamp-2 relative z-10">{topic.description}</p>
                
                <div className="mt-auto flex items-center gap-2 text-xs font-bold text-cyan-500/70 group-hover:text-cyan-400 transition-colors">
                  <SparklesIcon className="w-4 h-4" />
                  <span>مشاهده داکیومنت و نمونه کد</span>
                </div>
              </button>
            ))}
          </div>
          
          {filteredTopics.length === 0 && (
            <div className="text-center py-20 bg-slate-800/20 rounded-[2.5rem] border border-dashed border-slate-700">
              <p className="text-slate-500">مطلبی در این دسته‌بندی یافت نشد.</p>
            </div>
          )}

          <div className="mt-16 p-8 bg-slate-800/20 border border-slate-700/30 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white mb-2">نیاز به یک اسکریپت سفارشی دارید؟</h4>
              <p className="text-slate-400 text-sm">شما می‌توانید در بخش چت، از هوش مصنوعی بخواهید کدهای خاص شما را بنویسد یا الگوریتم‌های بهینه‌سازی را برای ستاپ آزمایشگاهی‌تان شخصی‌سازی کند.</p>
            </div>
            <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-cyan-600/20 shrink-0">
              برو به بخش شبیه‌سازی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonAIHubView;
