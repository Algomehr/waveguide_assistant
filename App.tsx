
import React, { useState } from 'react';
import { AppView } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import ChatView from './components/ChatView.tsx';
import AcademyView from './components/AcademyView.tsx';
import DiscoveryView from './components/DiscoveryView.tsx';
import SimulationView from './components/SimulationView.tsx';
import InterferometryView from './components/InterferometryView.tsx';
import MaterialsView from './components/MaterialsView.tsx';
import FabricationView from './components/FabricationView.tsx';
import PythonAIHubView from './components/PythonAIHubView.tsx';
import LabSetupView from './components/LabSetupView.tsx';
import GuideView from './components/GuideView.tsx';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case AppView.CHAT: return <ChatView />;
      case AppView.ACADEMY: return <AcademyView />;
      case AppView.DISCOVERY: return <DiscoveryView />;
      case AppView.SIMULATION: return <SimulationView />;
      case AppView.INTERFEROMETRY: return <InterferometryView />;
      case AppView.MATERIALS: return <MaterialsView />;
      case AppView.FABRICATION: return <FabricationView />;
      case AppView.PYTHON_AI: return <PythonAIHubView />;
      case AppView.LAB_SETUP: return <LabSetupView />;
      case AppView.GUIDE: return <GuideView />;
      default: return <ChatView />;
    }
  };

  const handleSetView = (view: AppView) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on selection (mobile)
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Persistent on Desktop, Toggleable on Mobile */}
      <div className={`
        fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        w-72 bg-slate-950 border-l border-slate-900
      `}>
        <Sidebar currentView={currentView} setView={handleSetView} />
        {/* Mobile Close Button */}
        <button 
          className="lg:hidden absolute top-6 left-6 p-2 text-slate-400 hover:text-white"
          onClick={() => setIsSidebarOpen(false)}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-900 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">W</span>
            </div>
            <h1 className="text-sm font-black text-white">WaveOptix AI</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 relative overflow-hidden bg-[#020617]">
          <div className="h-full w-full">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
