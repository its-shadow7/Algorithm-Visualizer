import { useEffect } from 'react';
import { useGraphStore } from '../store/useGraphStore';
import { useAlgorithmStore } from '../store/useAlgorithmStore'; // For global playbackSpeed
import { SPEED_TIERS } from '../constants/speedTiers';

/**
 * Custom hook to drive the execution loop for Pathfinding.
 */
export default function useGraphExecution() {
  const { isPlaying, snapshots, currentIndex, nextStep, isFinished } = useGraphStore();
  const { playbackSpeed } = useAlgorithmStore(); // Sharing the same global speed

  useEffect(() => {
    let timeout;
    
    if (isPlaying && !isFinished) {
      const { interval, batch } = SPEED_TIERS[playbackSpeed] || SPEED_TIERS["1x"];
      
      const step = () => {
        nextStep(batch);
        timeout = setTimeout(step, interval);
      };
      
      timeout = setTimeout(step, interval);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPlaying, nextStep, playbackSpeed, snapshots.length, isFinished]);
}
