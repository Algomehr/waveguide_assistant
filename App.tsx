
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);

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
      default: return <ChatView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200" dir="rtl">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 relative overflow-hidden bg-[#020617]">
        <div className="h-full w-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
