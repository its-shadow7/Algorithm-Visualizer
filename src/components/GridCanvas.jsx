import React, { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGraphStore } from '../store/useGraphStore';
import { useAlgorithmStore } from '../store/useAlgorithmStore';

// Memoized node to prevent catastrophic re-rendering of 1000+ DOM nodes
const Node = React.memo(({ 
  row, 
  col, 
  type, 
  isVisited, 
  isPath, 
  onMouseDown, 
  onMouseEnter,
  isActiveNode,
  isFrontierNode,
  transitionDuration
}) => {
  let color = 'bg-transparent border-white/5'; 
  let cursor = 'cursor-pointer hover:bg-white/10';
  
  if (type === 'WALL') {
    color = 'bg-slate-800 border-slate-700';
    cursor = 'cursor-pointer';
  } else if (type === 'WEIGHT') {
    color = 'bg-purple-900/40 border-purple-500/30';
    cursor = 'cursor-pointer';
  } else if (type === 'CARVING') {
    color = 'bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.8)] z-30 scale-110';
    cursor = 'cursor-default';
  } else if (type === 'START') {
    color = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20';
    cursor = 'cursor-grab active:cursor-grabbing';
  } else if (type === 'TARGET') {
    color = 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] z-20';
    cursor = 'cursor-grab active:cursor-grabbing';
  } else if (isActiveNode) {
    color = 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)] z-30 scale-110';
  } else if (isPath) {
    color = 'bg-accent-green shadow-[0_0_10px_rgba(74,222,128,0.4)] z-10 scale-105';
  } else if (isFrontierNode) {
    color = 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10';
  } else if (isVisited) {
    color = 'bg-cyan-500/80';
  }

  return (
    <div 
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      className={`w-full h-full border select-none transition-all ${color} ${cursor}`}
      style={{ 
        transitionDuration: transitionDuration,
        transitionProperty: 'background-color, transform, box-shadow'
      }}
      onDragStart={(e) => e.preventDefault()}
    />
  );
});

export default React.memo(function GridCanvas({ executionSnapshot }) {
  console.log("GRID_RENDER_TRIGGERED");
  
  const grid = useGraphStore(useShallow(state => state.grid));
  const onMouseDownNode = useGraphStore(state => state.onMouseDownNode);
  const onMouseMoveNode = useGraphStore(state => state.onMouseMoveNode);
  const onMouseUp = useGraphStore(state => state.onMouseUp);
  const isMouseDown = useGraphStore(state => state.isMouseDown);
  const draggedNodeType = useGraphStore(state => state.draggedNodeType);
  const drawingMode = useGraphStore(state => state.drawingMode);
  
  const { playbackSpeed } = useAlgorithmStore();

  // Listen for global mouse up to stop dragging gracefully even if cursor leaves grid
  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, [onMouseUp]);

  // Use grid from snapshot if available (for maze generation), otherwise local store grid
  const displayGrid = executionSnapshot?.grid || grid;
  const ROWS = displayGrid.length;
  const COLS = displayGrid[0].length;
  
  // High-Speed CSS Thrashing Avoidance
  const isHighSpeed = ['100x', 'MAX'].includes(playbackSpeed);
  const transitionDuration = isHighSpeed ? '0ms' : '150ms';

  // State Lookup Helper (O(1) lookups during render)
  const snapshotLookups = useMemo(() => {
    if (!executionSnapshot) return null;
    return {
      active: executionSnapshot.activeNode ? `${executionSnapshot.activeNode.row}-${executionSnapshot.activeNode.col}` : null,
      frontier: new Set(executionSnapshot.frontier?.map(n => `${n.row}-${n.col}`)),
      visited: new Set(executionSnapshot.visited?.map(n => `${n.row}-${n.col}`)),
      path: new Set(executionSnapshot.path?.map(n => `${n.row}-${n.col}`))
    };
  }, [executionSnapshot]);

  const legendItems = [
    { label: 'Start', color: 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' },
    { label: 'Target', color: 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' },
    { label: 'Wall', color: 'bg-slate-700' },
    { label: 'Weight', color: 'bg-purple-900 border border-purple-500/30' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0a0a0a] relative overflow-hidden">
      <div className="relative rounded-sm border border-white/10 shadow-2xl overflow-hidden flex flex-col max-w-[1200px] w-full" onMouseLeave={onMouseUp}>
        <div 
          className="grid gap-0 bg-black z-0 relative w-full border-b border-white/5"
          style={{ 
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            aspectRatio: `${COLS} / ${ROWS}`
          }}
        >
        {displayGrid.map((row, r) => 
          row.map((node, c) => {
            const nodeKey = `${r}-${c}`;
            
            // Check if we overlap with execution states (Pathfinding)
            let isVisited = node.isVisited;
            let isPath = node.isPath;
            let isActive = false;
            let isFrontier = false;

            if (snapshotLookups) {
              isActive = snapshotLookups.active === nodeKey;
              isFrontier = snapshotLookups.frontier.has(nodeKey);
              isVisited = snapshotLookups.visited.has(nodeKey);
              isPath = snapshotLookups.path.has(nodeKey);
            }

            return (
              <Node 
                key={nodeKey}
                row={r}
                col={c}
                type={node.type}
                isVisited={isVisited}
                isPath={isPath}
                isActiveNode={isActive}
                isFrontierNode={isFrontier}
                onMouseDown={onMouseDownNode}
                onMouseEnter={onMouseMoveNode}
                transitionDuration={transitionDuration}
              />
            );
          })
        )}
        </div>

        {/* HUD Status Bar */}
        <div className="flex items-center justify-between px-6 h-10 bg-[#0d0d0d]/80 backdrop-blur-md z-10 w-full">
          {/* Left: Engine Status */}
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${!executionSnapshot ? 'bg-accent-green animate-pulse' : 'bg-cyan-400'}`} />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">
              {!executionSnapshot ? 'Sandbox Engine: Active' : 'Execution Mode'}
            </span>
          </div>

          {/* Right: Mapped Legend */}
          <div className="flex items-center gap-6">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
