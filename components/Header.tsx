
import React from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode }) => {
  return (
    <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-50 px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg text-blue-700">
            <i className="fas fa-hospital-user text-xl"></i>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Live OT Status
          </h1>
        </div>
        
        <nav className="flex gap-2 bg-blue-800 p-1 rounded-full">
          <button 
            onClick={() => setViewMode('STAFF')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              viewMode === 'STAFF' ? 'bg-white text-blue-700 shadow' : 'hover:bg-blue-600'
            }`}
          >
            <i className="fas fa-user-md mr-2"></i>Staff
          </button>
          <button 
            onClick={() => setViewMode('DISPLAY')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              viewMode === 'DISPLAY' ? 'bg-white text-blue-700 shadow' : 'hover:bg-blue-600'
            }`}
          >
            <i className="fas fa-tv mr-2"></i>Display
          </button>
        </nav>
      </div>
    </header>
  );
};
