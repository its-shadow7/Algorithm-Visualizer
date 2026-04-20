import { useEffect } from 'react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { useUIStore } from '../store/useUIStore';
import { SPEED_TIERS } from '../constants/speedTiers';
import { audioEngine } from '../utils/audioEngine';

/**
 * Custom hook to drive the execution loop of a specific algorithm instance.
 * @param {string} instanceId - 'main', 'raceA', 'raceB', etc.
 */
export default function useAlgorithmExecution(instanceId, initCallback = null) {
  const { instances, nextStep, playbackSpeed } = useAlgorithmStore();
  const { isSoundEnabled } = useUIStore();
  const instance = instances[instanceId];

  useEffect(() => {
    let timeout;
    
    // 1. Bulletproof Initialization: Spin up generator if playing from zero-state
    if (instance?.isPlaying && instance?.snapshots?.length <= 1) {
      if (initCallback) initCallback();
      return; // React will re-trigger this hook once snapshots are populated
    }

    // 2. Strict Execution Bounds: prevent loops if data has been purged
    if (instance?.isPlaying && !instance?.isFinished && instance?.snapshots?.length > 1) {
      const { interval, batch } = SPEED_TIERS[playbackSpeed] || SPEED_TIERS["1x"];
      
      const step = () => {
        // Sonification Trigger
        if (isSoundEnabled) {
          try {
            const nextIdx = instance.currentIndex + batch;
            const nextSnap = instance.snapshots[nextIdx] || instance.snapshots[instance.snapshots.length - 1];
            
            if (nextSnap) {
              // 1. Aggressive Pointer Harvesting (Greedy Lookup)
              const p = nextSnap.pointers || {};
              const activeIdx = 
                p.active?.[0] ?? 
                p.writing?.[0] ?? 
                p.scanner?.[0] ?? 
                p.pivot?.[0] ?? 
                p.left?.[0] ?? 
                p.right?.[0] ?? 
                Object.values(p).flat().find(n => typeof n === 'number');

              if (activeIdx !== undefined && nextSnap.dataState[activeIdx] !== undefined) {
                // Diagnostic Heartbeat
                console.log("🛠️ Driver Pointer:", activeIdx);

                const item = nextSnap.dataState[activeIdx];
                const val = item?.value ?? item;
                const maxVal = Math.max(...nextSnap.dataState.map(d => typeof d === 'object' ? d.value : d)) || 100;
                
                if (typeof val === 'number') {
                  audioEngine.playNote(val, maxVal);
                }
              }
            }
          } catch (e) {
            console.warn("Audio trigger failed", e);
          }
        }

        nextStep(instanceId, batch);
        timeout = setTimeout(step, interval);
      };
      
      timeout = setTimeout(step, interval);
    }

    // 2. Strict Loop Termination: Sever timeouts on unmount or state overwrite
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [instance?.isPlaying, instanceId, nextStep, playbackSpeed, instance?.isFinished, instance?.snapshots?.length, isSoundEnabled, initCallback, instance?.currentIndex]);
}
