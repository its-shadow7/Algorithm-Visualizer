import React, { useMemo, useRef, useState, useEffect } from 'react';
import { calculateTreeLayout } from '../utils/treeLayout';
import { useTreeStore } from '../store/useTreeStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function TreeCanvas() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { treeRoot, snapshots, currentIndex, isExecutionMode } = useTreeStore();

  const currentSnapshot = isExecutionMode ? snapshots[currentIndex] : null;

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const layoutNodes = useMemo(() => {
    return calculateTreeLayout(treeRoot, dimensions.width, 80);
  }, [treeRoot, dimensions.width]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#0a0a0a] overflow-hidden">
      {/* SVG Edge Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {layoutNodes.map(node => {
          if (node.parentId === null) return null;
          const parent = layoutNodes.find(n => n.id === node.parentId);
          if (!parent) return null;

          const visitedPath = currentSnapshot?.visitedPath || [];
          const isHighlightedEdge = visitedPath.includes(parent.id) && visitedPath.includes(node.id);

          return (
            <motion.line
              key={`edge-${parent.id}-${node.id}`}
              x1={parent.x}
              y1={parent.y}
              x2={node.x}
              y2={node.y}
              stroke={isHighlightedEdge ? '#34d399' : '#2d3748'}
              strokeWidth={isHighlightedEdge ? 4 : 2}
              className={`transition-colors duration-300 ${isHighlightedEdge ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : ''}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </svg>

      {/* HTML Node Layer */}
      <AnimatePresence>
        {layoutNodes.map(node => {
          const isHighlighted = currentSnapshot?.nodeId === node.id;
          const isVisited = (currentSnapshot?.visitedPath || []).includes(node.id);
          const isFound = isHighlighted && currentSnapshot?.type === 'FOUND';
          const isComparing = isHighlighted && !isFound;

          return (
            <motion.div
              key={`node-${node.id}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isHighlighted ? 1.15 : 1, 
                opacity: 1,
                x: node.x,
                y: node.y,
              }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold shadow-lg transition-all duration-300 z-20 ${
                isFound 
                  ? 'bg-[#0a0a0a] text-emerald-400 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.7)] z-30' 
                  : isComparing
                    ? 'bg-[#0a0a0a] text-amber-400 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] z-30'
                    : isVisited 
                      ? 'bg-slate-900/50 text-emerald-400/50 border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.1)]'
                      : 'bg-[#121212] text-white border-slate-700'
              }`}
              style={{
                left: 0,
                top: 0,
                translateX: '-50%',
                translateY: '-50%',
              }}
            >
              {node.value}
              
              {/* Pulse effect for comparison */}
              {isHighlighted && (
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-accent-green"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Traversal Instruction (If in execution mode) */}
      {isExecutionMode && currentSnapshot && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900/80 backdrop-blur-md border border-accent-green/20 rounded-full shadow-2xl z-30">
          <p className="text-xs font-mono text-accent-green uppercase tracking-[0.2em] animate-pulse text-center">
            {currentSnapshot.description}
          </p>
        </div>
      )}
    </div>
  );
}
