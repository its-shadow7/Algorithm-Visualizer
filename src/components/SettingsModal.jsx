import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { audioEngine } from '../utils/audioEngine';

export default function SettingsModal() {
  const { isSettingsOpen, setSettingsOpen, isSoundEnabled, toggleSound } = useUIStore();
  
  // Theme logic state based on current DOM to stay in sync
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  
  // Keep local state in sync if it changes externally
  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    window.addEventListener('storage', checkTheme); // for cross-tab syncing, optional but safe
    return () => window.removeEventListener('storage', checkTheme);
  }, []);

  const handleToggleSound = () => {
    if (!isSoundEnabled) {
      audioEngine.init();
    }
    toggleSound();
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const newThemeDark = !root.classList.contains('dark');
    
    if (newThemeDark) {
      root.classList.add('dark');
      localStorage.setItem('algo_theme_preference', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('algo_theme_preference', 'light');
    }
    
    setIsDark(newThemeDark);
  };

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSettingsOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-sm bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="h-1 w-full bg-slate-500" />
        
        <button 
          onClick={() => setSettingsOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 font-mono tracking-wide">SYSTEM SETTINGS</h2>
          
          <div className="space-y-4">
            {/* Theme Row */}
            <div className="flex items-center justify-between p-4 bg-black/40 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                {isDark ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-400" />}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">Theme Mode</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">{isDark ? 'Dark Mode Active' : 'Light Mode Active'}</span>
                </div>
              </div>
              
              <button 
                onClick={toggleTheme}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-md transition-colors border border-slate-600"
              >
                Toggle
              </button>
            </div>

            {/* Sound Row */}
            <div className="flex items-center justify-between p-4 bg-black/40 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                {isSoundEnabled ? <Volume2 size={18} className="text-accent-green" /> : <VolumeX size={18} className="text-rose-400" />}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">Audio Feedback</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">{isSoundEnabled ? 'Sound Active' : 'Sound Muted'}</span>
                </div>
              </div>
              
              <button 
                onClick={handleToggleSound}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest rounded-md transition-colors border ${
                  isSoundEnabled 
                  ? 'bg-accent-green/20 border-accent-green text-accent-green hover:bg-accent-green/30' 
                  : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                }`}
              >
                {isSoundEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
