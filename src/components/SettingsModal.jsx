import React from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { audioEngine } from '../utils/audioEngine';

export default function SettingsModal() {
  const { isSettingsOpen, setSettingsOpen, isSoundEnabled, toggleSound } = useUIStore();
  
  const handleToggleSound = () => {
    if (!isSoundEnabled) {
      audioEngine.init();
    }
    toggleSound();
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
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 25 }
        }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm bg-bg-card/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="h-1.5 w-full bg-accent-green" />
        
        <button 
          onClick={() => setSettingsOpen(false)}
          className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-text-primary mb-6 font-mono tracking-wide">SYSTEM SETTINGS</h2>
          
          <div className="space-y-4">
            {/* Audio State Info */}
            <div className="flex flex-col mb-2">
              <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Execution Feedback</span>
            </div>

            {/* Sound Row */}
            <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                {isSoundEnabled ? <Volume2 size={18} className="text-accent-green" /> : <VolumeX size={18} className="text-rose-400" />}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">Audio Feedback</span>
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">{isSoundEnabled ? 'Sound Active' : 'Sound Muted'}</span>
                </div>
              </div>
              
              <button 
                onClick={handleToggleSound}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest rounded-md transition-colors border ${
                  isSoundEnabled 
                  ? 'bg-accent-green/20 border-accent-green text-accent-green hover:bg-accent-green/30' 
                  : 'bg-slate-800 border-white/10 text-text-secondary hover:text-text-primary'
                }`}
              >
                {isSoundEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="mt-8 pt-6 border-t border-white/5 opacity-50">
             <div className="text-[8px] font-mono text-text-muted uppercase tracking-widest">ALGO_CORE // SYSTEM_VERSION_2.1.0</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
