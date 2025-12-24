
import React from 'react';
import { AppView } from '../types';
import { 
  ChatBubbleLeftRightIcon, 
  AcademicCapIcon, 
  MagnifyingGlassIcon, 
  CpuChipIcon,
  BeakerIcon,
  CircleStackIcon,
  WrenchScrewdriverIcon,
  CodeBracketSquareIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.CHAT, label: 'گفتگو و دستیار صوتی', icon: ChatBubbleLeftRightIcon },
    { id: AppView.ACADEMY, label: 'آموزشگاه تخصصی', icon: AcademicCapIcon },
    { id: AppView.PYTHON_AI, label: 'مرکز پایتون و هوش مصنوعی', icon: CodeBracketSquareIcon },
    { id: AppView.DISCOVERY, label: 'اکتشاف منابع', icon: MagnifyingGlassIcon },
    { id: AppView.INTERFEROMETRY, label: 'شبیه‌ساز تداخلی', icon: BeakerIcon },
    { id: AppView.FABRICATION, label: 'ساخت و کوپلینگ (SiN)', icon: WrenchScrewdriverIcon },
    { id: AppView.MATERIALS, label: 'بانک متریال', icon: CircleStackIcon },
    { id: AppView.SIMULATION, label: 'شبیه‌سازی و بهینه', icon: CpuChipIcon },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen border-l border-slate-800 flex flex-col p-4 shadow-xl">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span className="text-white font-bold text-xl">W</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">WaveOptix AI</h1>
          <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Research Group</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-600/20 shadow-inner' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-2xl">
          <p className="text-xs text-slate-500 leading-relaxed text-right">
            تخصصی برای ویفرهای SiN. تحلیل بازدهی و تلرانس‌های ساخت.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
