
import React from 'react';
import { AppView } from '../types.ts';
import { 
  ChatBubbleLeftRightIcon, 
  AcademicCapIcon, 
  MagnifyingGlassIcon, 
  CpuChipIcon,
  BeakerIcon,
  CircleStackIcon,
  WrenchScrewdriverIcon,
  CodeBracketSquareIcon,
  ScaleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.CHAT, label: 'گفتگو و دستیار صوتی', icon: ChatBubbleLeftRightIcon },
    { id: AppView.LAB_SETUP, label: 'تنظیمات ستاپ آزمایشگاه', icon: ScaleIcon },
    { id: AppView.ACADEMY, label: 'آموزشگاه تخصصی', icon: AcademicCapIcon },
    { id: AppView.PYTHON_AI, label: 'مرکز پایتون و هوش مصنوعی', icon: CodeBracketSquareIcon },
    { id: AppView.DISCOVERY, label: 'اکتشاف منابع', icon: MagnifyingGlassIcon },
    { id: AppView.INTERFEROMETRY, label: 'شبیه‌ساز تداخلی', icon: BeakerIcon },
    { id: AppView.FABRICATION, label: 'ساخت و کوپلینگ (SiN)', icon: WrenchScrewdriverIcon },
    { id: AppView.MATERIALS, label: 'بانک متریال', icon: CircleStackIcon },
    { id: AppView.SIMULATION, label: 'شبیه‌سازی و بهینه', icon: CpuChipIcon },
    { id: AppView.GUIDE, label: 'راهنمای کامل سیستم', icon: InformationCircleIcon },
  ];

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="mb-8 lg:mb-12 flex items-center gap-4 px-2">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span className="text-white font-black text-xl lg:text-2xl">W</span>
        </div>
        <div>
          <h1 className="text-lg lg:text-xl font-black tracking-tight text-white leading-tight">WaveOptix AI</h1>
          <p className="text-[9px] lg:text-[10px] text-cyan-400 uppercase tracking-widest font-black opacity-80">R&D Lab Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 lg:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 lg:gap-4 px-4 lg:px-5 py-2.5 lg:py-3.5 rounded-2xl transition-all duration-300 border ${
                isActive 
                  ? 'bg-cyan-600/10 text-cyan-400 border-cyan-500/30 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]' 
                  : 'text-slate-500 border-transparent hover:bg-slate-900 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
              <span className="font-bold text-xs lg:text-sm whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-6 lg:pt-8 mt-4 border-t border-slate-900">
        <div className="bg-slate-900/50 p-4 lg:p-5 rounded-2xl border border-slate-800">
          <p className="text-[10px] lg:text-[11px] text-slate-500 leading-relaxed text-right font-medium">
            تخصصی برای گروه‌های لیتوگرافی تداخلی و رایتینگ گرتینگ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
