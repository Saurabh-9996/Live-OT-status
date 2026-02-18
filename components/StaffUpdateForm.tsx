
import React, { useState, useEffect } from 'react';
import { OTStatus, PatientRecord } from '../types';
import { dbService } from '../services/dbService';

export const StaffUpdateForm: React.FC = () => {
  const [uhid, setUhid] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<OTStatus>(OTStatus.WAITING);
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setRecords(dbService.getRecords());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uhid || !name) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }

    const updated = dbService.updateRecord(uhid, name, status);
    setRecords([...updated]); // Create new array reference to trigger re-render
    setMessage({ text: `Successfully updated ${name}`, type: 'success' });
    
    // Clear form
    setUhid('');
    setName('');
    setStatus(OTStatus.WAITING);
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (record: PatientRecord) => {
    setUhid(record.uhid);
    setName(record.name);
    setStatus(record.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (uhid: string) => {
    // Removed confirm() as per user request for immediate deletion
    const updated = dbService.deleteRecord(uhid);
    setRecords([...updated]); // Create new array reference to trigger re-render
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
          <i className="fas fa-edit text-blue-600"></i> Staff Control Panel
        </h2>
        
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 transition-all ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block">UHID / Patient ID</label>
            <input
              type="text"
              value={uhid}
              onChange={(e) => setUhid(e.target.value.toUpperCase())}
              placeholder="e.g. 1234"
              className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-mono"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block">Patient Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Demo Name"
              className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block">OT Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OTStatus)}
              className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg appearance-none cursor-pointer"
            >
              {Object.values(OTStatus).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus-circle"></i> Update / Add Record
            </button>
          </div>
        </form>
      </div>

      {/* Matching the screenshot provided by user */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-6 bg-white border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-xl">Active OT List</h3>
          <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-black">
            {records.length} Records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-4 text-left">UHID</th>
                <th className="px-8 py-4 text-left">Patient</th>
                <th className="px-8 py-4 text-left">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-slate-400 italic">
                    <i className="fas fa-folder-open mb-3 text-4xl block"></i>
                    No patient records currently active.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={`${r.uhid}-${r.lastUpdated}`} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-mono font-bold text-slate-600">{r.uhid}</td>
                    <td className="px-8 py-5 font-bold text-slate-800 text-lg">{r.name}</td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-3">
                      <button 
                        onClick={() => handleEdit(r)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all"
                        title="Edit Record"
                      >
                        <i className="fas fa-edit text-lg"></i>
                      </button>
                      <button 
                        onClick={() => handleDelete(r.uhid)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        title="Delete Record"
                      >
                        <i className="fas fa-trash text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
