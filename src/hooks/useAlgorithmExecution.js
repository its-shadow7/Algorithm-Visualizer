import { useEffect } from 'react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { useUIStore } from '../store/useUIStore';
import { SPEED_TIERS } from '../constants/speedTiers';
import { audioEngine } from '../utils/audioEngine';

/**
 * Custom hook to drive the execution loop of a specific algorithm instance.
 * @param {string} instanceId - 'main', 'raceA', 'raceB', etc.
 */
export default function useAlgorithmExecution(instanceId) {
  const { instances, nextStep, playbackSpeed } = useAlgorithmStore();
  const { isSoundEnabled } = useUIStore();
  const instance = instances[instanceId];

  useEffect(() => {
    let timeout;
    
    if (instance?.isPlaying && !instance?.isFinished) {
      const { interval, batch } = SPEED_TIERS[playbackSpeed] || SPEED_TIERS["1x"];
      
      const step = () => {
        // Sonification Trigger
        if (isSoundEnabled) {
          try {
            const nextIdx = instance.currentIndex + batch;
            const nextSnap = instance.snapshots[nextIdx] || instance.snapshots[instance.snapshots.length - 1];
            
            if (nextSnap) {
              const activeIdx = nextSnap.pointers?.active?.[0];
              if (activeIdx !== undefined) {
                const item = nextSnap.dataState[activeIdx];
                const val = typeof item === 'object' ? item.value : item;
                const maxVal = Math.max(...nextSnap.dataState.map(d => typeof d === 'object' ? d.value : d));
                audioEngine.playNote(val, maxVal);
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

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [instance?.isPlaying, instanceId, nextStep, playbackSpeed, instance?.isFinished, isSoundEnabled]);
}
