import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { SPEED_TIERS } from '../constants/speedTiers';

export default function VisualizerCanvas({ snapshot }) {
  const { playbackSpeed, sharedDataset } = useAlgorithmStore();
  
  // 3. Canvas Safe-Guard: Fallback to base dataset to prevent UI blanking
  const currentSnapshot = snapshot || {
    dataState: sharedDataset,
    pointers: { active: [], range: null, writing: [], sortedIndices: [] }
  };

  const { dataState, pointers } = currentSnapshot;
  const maxValue = Math.max(...dataState.map((d) => (d?.value ? d.value : d))); // Fallback for transition phase
  
  const isHighSpeed = ['25x', '100x', 'MAX'].includes(playbackSpeed);
  const transitionDuration = isHighSpeed ? '0ms' : '200ms';

  return (
    <div className="w-full h-full p-10 flex flex-nowrap items-end justify-between">
      <AnimatePresence mode="popLayout">
        {dataState.map((item, idx) => {
          // If we are halfway through transition, it might still have primitive numbers if not reset
          const value = typeof item === 'object' ? item.value : item;
          const id = typeof item === 'object' ? item.id : `fallback-${value}-${idx}`;

          const isActive = pointers.active?.includes(idx);
          const isWriting = pointers.writing?.includes(idx);
          const isSecondary = pointers.secondary?.includes?.(idx);
          const isPivot = pointers.pivot === idx || pointers.pivot?.includes?.(idx);
          const isSwapping = (isActive || isPivot || isWriting || isSecondary) && (currentSnapshot.description?.includes("SWAP") || currentSnapshot.description?.includes("WRITE") || currentSnapshot.description?.includes("PARTITION") || currentSnapshot.description?.includes("HEAPIFY"));
          
          const inRange = pointers.range ? (idx >= pointers.range[0] && idx <= pointers.range[1]) : true;
          const isComplete = currentSnapshot.description?.includes("COMPLETE");
          const isSortedIdx = pointers.sortedIndices?.includes(idx) || isComplete;
          
          let color = isSortedIdx ? "bg-zinc-500" : "bg-zinc-700";
          
          // Apply Precision Logic palette
          if (isActive) color = "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)] z-10";
          if (isSecondary) color = "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] z-10";
          if (isPivot) color = "bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)] z-20";
          if (isWriting || isSwapping) color = "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.7)] z-20";

          return (
            <motion.div
              layout={!isHighSpeed}
              key={id}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={isHighSpeed ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
              className={`flex-1 mx-[1px] rounded-t-sm ${color} transition-opacity duration-300 ${inRange ? 'opacity-100' : 'opacity-20'}`}
              style={{ 
                height: `${(value / maxValue) * 80}%`,
                transformOrigin: "bottom",
                transitionDuration: transitionDuration
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
