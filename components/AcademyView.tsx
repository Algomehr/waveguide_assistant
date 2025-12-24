
import React, { useState } from 'react';
import { ACADEMY_TOPICS } from '../constants';
import { AcademyTopic } from '../types';
import { generateLesson } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { ArrowRightIcon, BookOpenIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const AcademyView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<AcademyTopic | null>(null);
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-2xl shadow-black/20">
              <MarkdownRenderer content={lessonContent || ''} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <AcademicCapIcon className="w-8 h-8 text-cyan-500" />
          <h2 className="text-2xl font-bold text-white">آموزشگاه تخصصی نوری</h2>
        </div>
        <p className="text-slate-400">انتخاب کنید تا هوش مصنوعی یک جزوه کامل با فرمول‌های علمی برایتان تدریس کند.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACADEMY_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 p-6 rounded-2xl text-right transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1 flex flex-col items-start"
            >
              <div className="w-full flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded-md uppercase">
                  {topic.category}
                </span>
                <BookOpenIcon className="w-6 h-6 text-slate-500 group-hover:text-cyan-500 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{topic.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 text-right w-full">{topic.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademyView;
