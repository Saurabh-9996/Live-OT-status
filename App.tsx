
import React, { useState } from 'react';
import { ViewMode } from './types';
import { Header } from './components/Header';
import { StaffUpdateForm } from './components/StaffUpdateForm';
import { LiveStatusDisplay } from './components/LiveStatusDisplay';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('STAFF');

  return (
    <div className={`min-h-screen ${viewMode === 'DISPLAY' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Header viewMode={viewMode} setViewMode={setViewMode} />
      
      <main className="transition-all duration-500">
        {viewMode === 'STAFF' ? (
          <StaffUpdateForm />
        ) : (
          <LiveStatusDisplay />
        )}
      </main>

      {/* Fullscreen Button (Only for Display Mode) */}
      {viewMode === 'DISPLAY' && (
        <button 
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-[60]"
          title="Toggle Fullscreen"
        >
          <i className="fas fa-expand text-2xl"></i>
        </button>
      )}
    </div>
  );
};

export default App;
