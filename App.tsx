
import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { StaffUpdateForm } from './components/StaffUpdateForm';
import { LiveStatusDisplay } from './components/LiveStatusDisplay';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LOGIN');

  // Simple persistence check for the session
  useEffect(() => {
    const savedRole = sessionStorage.getItem('hospital_role');
    if (savedRole === 'STAFF') setViewMode('STAFF');
    if (savedRole === 'DISPLAY') setViewMode('DISPLAY');
  }, []);

  const handleLogin = (role: 'STAFF' | 'DISPLAY') => {
    sessionStorage.setItem('hospital_role', role);
    setViewMode(role);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('hospital_role');
    setViewMode('LOGIN');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${viewMode === 'DISPLAY' ? 'bg-slate-50' : 'bg-slate-50'}`}>
      <Header viewMode={viewMode} onLogout={handleLogout} />
      
      <main className="transition-all duration-500">
        {viewMode === 'LOGIN' && (
          <LoginPage onLogin={handleLogin} />
        )}
        
        {viewMode === 'STAFF' && (
          <StaffUpdateForm />
        )}
        
        {viewMode === 'DISPLAY' && (
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
          className="fixed bottom-12 right-12 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-[60]"
          title="Toggle Fullscreen"
        >
          <i className="fas fa-expand text-2xl"></i>
        </button>
      )}
    </div>
  );
};

export default App;
