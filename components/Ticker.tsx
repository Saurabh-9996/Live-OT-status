
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { getSmartHospitalTip } from '../services/geminiService';

export const Ticker: React.FC = () => {
  const [updates, setUpdates] = useState<string[]>([]);
  const [aiTip, setAiTip] = useState<string>('Loading helpful health tips...');

  useEffect(() => {
    const loadUpdates = () => {
      const recent = dbService.getRecentUpdates();
      const strings = recent.map(r => 
        `[${r.uhid}] ${r.name} updated to ${r.status}`
      );
      setUpdates(strings);
    };

    const loadTip = async () => {
      const tip = await getSmartHospitalTip();
      setAiTip(tip);
    };

    loadUpdates();
    loadTip();

    const interval = setInterval(loadUpdates, 5000);
    const tipInterval = setInterval(loadTip, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, []);

  const tickerContent = [...updates, `🌟 SMART TIP: ${aiTip}`, "Stay hydrated and reach out to the help desk if you need assistance."].join(" • ");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-blue-100 py-3 overflow-hidden z-50 shadow-2xl border-t border-blue-800">
      <div className="animate-ticker text-xl font-bold">
        {tickerContent} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {tickerContent}
      </div>
    </div>
  );
};
