
import React, { useState } from 'react';
import { getSimulationHelp } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { CpuChipIcon, CommandLineIcon, BeakerIcon } from '@heroicons/react/24/outline';

const SimulationView: React.FC = () => {
  const [task, setTask] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!task.trim() || isLoading) return;
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await getSimulationHelp(task);
      setResponse(result);
    } catch (err) {
      setResponse('خطایی در تولید راهنمای شبیه‌سازی رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  const templates = [
    "الگوریتم PSO برای بهینه‌سازی پهنای توری براگ",
    "اسکریپت پایتون برای شبیه‌سازی کوپلینگ فیبر به موج‌بر نوری",
    "محاسبه ضریب شکست موثر مود TE0 در موج‌بر ریج",
    "مقایسه روش‌های FDTD و EME برای طراحی گرتینگ کوپلر"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-y-auto">
      <header className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <CpuChipIcon className="w-8 h-8 text-cyan-500" />
          <h2 className="text-2xl font-bold text-white">کمک‌یار شبیه‌سازی و بهینه‌سازی</h2>
        </div>
        <p className="text-slate-400">تولید کد، انتخاب الگوریتم و استراتژی‌های بهینه‌سازی با نمایش حرفه‌ای کدها.</p>
      </header>

      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CommandLineIcon className="w-5 h-5 text-cyan-500" />
            صورت مسئله یا سناریوی شبیه‌سازی خود را شرح دهید:
          </h3>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full h-40 bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-right mb-4 resize-none"
            placeholder="مثال: من می‌خواهم یک اسکریپت پایتون برای بهینه‌سازی بازدهی کوپلینگ بنویسم..."
          ></textarea>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {templates.map((t, i) => (
              <button 
                key={i} 
                onClick={() => setTask(t)}
                className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50"
          >
            {isLoading ? 'در حال تحلیل و تولید راه‌حل...' : 'دریافت راهنمای فنی و کد'}
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <BeakerIcon className="w-12 h-12 text-cyan-500 animate-pulse" />
            <p className="text-slate-400">هوش مصنوعی در حال حل معادلات و طراحی الگوریتم است...</p>
          </div>
        )}

        {response && (
          <div className="bg-slate-800/20 p-8 rounded-3xl border border-cyan-500/10 animate-in fade-in duration-700">
            <MarkdownRenderer content={response} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationView;
