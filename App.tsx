
import React, { useState } from 'react';
import { AppView } from './types';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import AcademyView from './components/AcademyView';
import DiscoveryView from './components/DiscoveryView';
import SimulationView from './components/SimulationView';
import InterferometryView from './components/InterferometryView';
import MaterialsView from './components/MaterialsView';
import FabricationView from './components/FabricationView';
import PythonAIHubView from './components/PythonAIHubView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);

  const renderView = () => {
    switch (currentView) {
      case AppView.CHAT:
        return <ChatView />;
      case AppView.ACADEMY:
        return <AcademyView />;
      case AppView.DISCOVERY:
        return <DiscoveryView />;
      case AppView.SIMULATION:
        return <SimulationView />;
      case AppView.INTERFEROMETRY:
        return <InterferometryView />;
      case AppView.MATERIALS:
        return <MaterialsView />;
      case AppView.FABRICATION:
        return <FabricationView />;
      case AppView.PYTHON_AI:
        return <PythonAIHubView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200" dir="rtl">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 relative overflow-hidden">
        <div className="h-full w-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
