import { useEffect } from 'react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { SPEED_TIERS } from '../constants/speedTiers';

/**
 * Custom hook to drive the execution loop of a specific algorithm instance.
 * @param {string} instanceId - 'main', 'raceA', 'raceB', etc.
 */
export default function useAlgorithmExecution(instanceId) {
  const { instances, nextStep, playbackSpeed } = useAlgorithmStore();
  const instance = instances[instanceId];

  useEffect(() => {
    let timeout;
    
    if (instance?.isPlaying && !instance?.isFinished) {
      const { interval, batch } = SPEED_TIERS[playbackSpeed] || SPEED_TIERS["1x"];
      
      const step = () => {
        nextStep(instanceId, batch);
        timeout = setTimeout(step, interval);
      };
      
      timeout = setTimeout(step, interval);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [instance?.isPlaying, instanceId, nextStep, playbackSpeed, instance?.snapshots?.length, instance?.isFinished]);
}
