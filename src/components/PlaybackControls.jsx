import React, { useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { audioEngine } from '../utils/audioEngine';

export default function PlaybackControls({ instanceId = 'main' }) {
  const { 
    instances, 
    nextStep, 
    prevStep, 
    togglePlay, 
    resetInstance 
  } = useAlgorithmStore();

  const instance = instances[instanceId];

  if (!instance) return null;

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-bg-card/80 backdrop-blur-md border border-white/5 px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => resetInstance(instanceId)}
          className="text-text-secondary hover:text-text-primary transition-colors"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
        <button 
          onClick={() => prevStep(instanceId)}
          disabled={instance.currentIndex === 0}
          className="text-text-secondary hover:text-white disabled:opacity-20 transition-colors"
        >
          <SkipBack size={20} fill="currentColor" />
        </button>
      </div>

      <button 
        onClick={() => {
          audioEngine.init();
          togglePlay(instanceId);
        }}
        className="w-12 h-12 bg-accent-green hover:bg-accent-green-hover text-black rounded-full flex items-center justify-center transition-all shadow-[0_0_20px_rgba(74,222,128,0.3)]"
      >
        {instance.isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
      </button>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => nextStep(instanceId)}
          disabled={instance.currentIndex === instance.snapshots.length - 1}
          className="text-text-secondary hover:text-white disabled:opacity-20 transition-colors"
        >
          <SkipForward size={20} fill="currentColor" />
        </button>
        <div className="text-[10px] font-mono text-accent-green min-w-[70px] text-center">
          STEP {instance.currentIndex + 1} / {instance.snapshots.length}
        </div>
      </div>
    </div>
  );
}
