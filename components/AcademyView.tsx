
import React, { useState, useMemo } from 'react';
import { ACADEMY_TOPICS } from '../constants';
import { AcademyTopic } from '../types';
import { generateLesson } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { 
  ArrowRightIcon, 
  BookOpenIcon, 
  AcademicCapIcon,
  FunnelIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const AcademyView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<AcademyTopic | null>(null);
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(ACADEMY_TOPICS.map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredTopics = useMemo(() => {
    if (activeCategory === 'All') return ACADEMY_TOPICS;
    return ACADEMY_TOPICS.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const handleTopicClick = async (topic: AcademyTopic) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setLessonContent(null);
    try {
      const content = await generateLesson(topic.title);
      setLessonContent(content);
    } catch (err) {
      setLessonContent('متاسفم، در تدریس این مبحث مشکلی پیش آمد.');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedTopic) {
    return (
      <div className="flex flex-col h-full bg-slate-900 overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50 sticky top-0 z-20 backdrop-blur-md">
          <button 
            onClick={() => setSelectedTopic(null)}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
          >
            <ArrowRightIcon className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">{selectedTopic.title}</h2>
            <p className="text-sm text-cyan-400">{selectedTopic.category}</p>
          </div>
        </div>

        <div className="p-8 max-w-4xl mx-auto w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 animate-pulse">در حال تدریس مبحث تخصصی توسط هوش مصنوعی...</p>
            </div>
          ) : (
            <div className="bg-slate-800/40 p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px]"></div>
               <MarkdownRenderer content={lessonContent || ''} />
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
            <AcademicCapIcon className="w-8 h-8 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">آموزشگاه تخصصی فوتونیک</h2>
            <p className="text-slate-400 mt-1">مرجع کامل مبانی نظری، طراحی ادوات و تکنولوژی‌های ساخت گرتینگ و موج‌بر.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 p-7 rounded-[2rem] text-right transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 flex flex-col items-start overflow-hidden"
              >
                <div className="w-full flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full uppercase">
                    {topic.category}
                  </span>
                  <BookOpenIcon className="w-6 h-6 text-slate-500 group-hover:text-cyan-500 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{topic.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-3 text-right w-full mb-4 leading-relaxed">{topic.description}</p>
                
                <div className="mt-auto flex items-center gap-2 text-xs font-bold text-cyan-500/70 group-hover:text-cyan-400 transition-colors">
                  <SparklesIcon className="w-4 h-4" />
                  <span>درخواست تدریس تخصصی</span>
                </div>
              </button>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <div className="text-center py-20 bg-slate-800/20 rounded-[2.5rem] border border-dashed border-slate-700">
              <p className="text-slate-500">مطلبی در این دسته‌بندی یافت نشد.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademyView;
