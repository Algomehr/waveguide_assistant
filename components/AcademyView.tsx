
import React, { useState, useMemo } from 'react';
import { ACADEMY_TOPICS } from '../constants';
import { AcademyTopic } from '../types';
import { generateSyllabus, generateLesson } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { 
  ArrowRightIcon, 
  BookOpenIcon, 
  AcademicCapIcon,
  FunnelIcon,
  SparklesIcon,
  ListBulletIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

const AcademyView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<AcademyTopic | null>(null);
  const [syllabus, setSyllabus] = useState<string[] | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);
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
    setSyllabus(null);
    setSelectedSubTopic(null);
    setLessonContent(null);
    try {
      const list = await generateSyllabus(topic.title);
      setSyllabus(list);
    } catch (err) {
      setSyllabus(["مقدمه و تعاریف پایه", "تحلیل فنی", "شبیه‌سازی", "جمع‌بندی"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubTopicClick = async (sub: string) => {
    if (!selectedTopic) return;
    setSelectedSubTopic(sub);
    setIsLoading(true);
    setLessonContent(null);
    try {
      const content = await generateLesson(selectedTopic.title, sub);
      setLessonContent(content);
    } catch (err) {
      setLessonContent('متاسفم، در تدریس این مبحث مشکلی پیش آمد.');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedTopic) {
    return (
      <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
        <div className="p-4 lg:p-6 border-b border-slate-900 flex items-center gap-4 bg-slate-900/60 sticky top-0 z-30 backdrop-blur-xl">
          <button 
            onClick={() => {
              if (selectedSubTopic) {
                setSelectedSubTopic(null);
                setLessonContent(null);
              } else {
                setSelectedTopic(null);
                setSyllabus(null);
              }
            }}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <div>
            <h2 className="text-base lg:text-xl font-black text-white">{selectedTopic.title}</h2>
            <p className="text-[10px] lg:text-sm text-cyan-400">
              {selectedSubTopic ? `مبحث: ${selectedSubTopic}` : 'انتخاب زیربخش برای تدریس عمیق'}
            </p>
          </div>
        </div>

        <div className="p-4 lg:p-10 max-w-5xl mx-auto w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
              <div className="w-12 h-12 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-sm lg:text-base font-bold text-white mb-2">
                  {selectedSubTopic ? `در حال تدریس تخصصی: ${selectedSubTopic}` : 'در حال تدوین نقشه راه آموزشی...'}
                </p>
                <p className="text-[10px] lg:text-xs text-slate-500 animate-pulse uppercase tracking-widest">Processing Ph.D Level Photonics AI</p>
              </div>
            </div>
          ) : !selectedSubTopic ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
              <div className="bg-cyan-500/5 border border-cyan-500/10 p-8 rounded-[2.5rem] flex gap-6 items-center">
                <div className="p-4 bg-cyan-500/10 rounded-2xl shrink-0">
                  <ListBulletIcon className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white mb-1">نقشه راه یادگیری عمیق</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">این مبحث به بخش‌های زیر تقسیم شده است. لطفاً برای دریافت آموزش دقیق و تخصصی، یکی از بخش‌ها را انتخاب کنید:</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {syllabus?.map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubTopicClick(sub)}
                    className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-3xl transition-all group text-right"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 transition-colors">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white">{sub}</span>
                    </div>
                    <ChevronLeftIcon className="w-5 h-5 text-slate-600 group-hover:text-cyan-500 transition-all group-hover:-translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 p-6 lg:p-12 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden animate-in fade-in duration-700">
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[120px]"></div>
               <MarkdownRenderer content={lessonContent || ''} className="text-sm lg:text-base" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <header className="p-6 lg:p-10 border-b border-slate-900 bg-slate-900/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
          <div className="p-2 lg:p-3 bg-cyan-500/10 rounded-xl lg:rounded-2xl">
            <AcademicCapIcon className="w-6 h-6 lg:w-8 lg:h-8 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-xl lg:text-3xl font-black text-white">آموزشگاه تخصصی فوتونیک</h2>
            <p className="text-xs lg:text-sm text-slate-400 mt-1">مرجع کامل مبانی نظری، طراحی و تکنولوژی‌های ساخت.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <FunnelIcon className="w-4 h-4 text-slate-500 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-[10px] lg:text-xs font-black transition-all shrink-0 border ${
                activeCategory === cat 
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg' 
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? 'همه مباحث' : cat}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className="group relative bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 p-8 rounded-[2.5rem] text-right transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/5 hover:-translate-y-1 flex flex-col items-start overflow-hidden"
              >
                <div className="w-full flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full uppercase">
                    {topic.category}
                  </span>
                  <BookOpenIcon className="w-6 h-6 text-slate-600 group-hover:text-cyan-500 transition-colors" />
                </div>
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors leading-tight">{topic.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 text-right w-full mb-6 leading-relaxed">{topic.description}</p>
                <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-cyan-500/70 group-hover:text-cyan-400 transition-colors">
                  <SparklesIcon className="w-4 h-4" />
                  <span>بررسی سرفصل‌های تخصصی</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyView;
