import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import GridCanvas from '../components/GridCanvas';
import { useGraphStore } from '../store/useGraphStore';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { Network, Play, RotateCcw, Zap, Terminal, Code2, Info, Grid3X3, RefreshCcw, Trash2, Eraser, Cloud, Loader2 } from 'lucide-react';
import useGraphExecution from '../hooks/useGraphExecution';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../hooks/useWorkspace';
import Editor from '@monaco-editor/react';
import SpeedController from '../components/SpeedController';

export default function Pathfinding() {
  const { algo } = useParams();
  const editorRef = useRef(null);
  const decoRef = useRef([]);
  
  const { 
    recalculatePath, 
    isExecutionMode, 
    startExecution, 
    resetExecution,
    setAlgorithm,
    currentAlgorithmId,
    snapshots,
    currentIndex,
    isPlaying,
    togglePlay,
    nextStep,
    prevStep,
    activeAlgorithm,
    generateMaze,
    drawingMode,
    setDrawingMode,
    resetBoard
  } = useGraphStore();

  const { playbackSpeed } = useAlgorithmStore();
  const { user, setAuthModalOpen } = useAuth();
  const { saveWorkspace, isSaving } = useWorkspace();

  // Drive the visualization ticker
  useGraphExecution();

  const loadedAlgoRef = useRef(null);

  const handleSaveMaze = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const mazeName = prompt('Enter a name for your maze:', 'My Custom Maze');
    if (!mazeName) return;

    try {
      const state = useGraphStore.getState();
      const payload = {
        grid: state.grid,
        startNode: state.startNode,
        targetNode: state.targetNode
      };

      await saveWorkspace(user.id, mazeName, 'pathfinding', payload);
      alert('Maze saved successfully to the cloud!');
    } catch (err) {
      console.error(err);
      alert('Failed to save maze. Please try again.');
    }
  };

  // Sync Algorithm ID from URL
  useEffect(() => {
    if (algo && algo !== loadedAlgoRef.current) {
      loadedAlgoRef.current = algo;
      setAlgorithm(algo);
    }
  }, [algo, setAlgorithm]);

  useEffect(() => {
    // Run initially to show the path on load (Sandbox Mode)
    if (!isExecutionMode && loadedAlgoRef.current === algo) {
      recalculatePath();
    }
  }, [recalculatePath, isExecutionMode, algo]);

  // 'Ghost Execution' Cleanup: KILL generators when user leaves the page
  useEffect(() => {
    return () => {
      resetExecution();
    };
  }, [resetExecution]);

  // Code Synchronization
  useEffect(() => {
    if (editorRef.current && isExecutionMode && snapshots.length > 0) {
      const currentStep = snapshots[currentIndex];
      if (currentStep && typeof currentStep.activeCodeLine === 'number') {
        const line = currentStep.activeCodeLine;
        
        if (line > 0) {
          editorRef.current.revealLineInCenter(line);
          
          decoRef.current = editorRef.current.deltaDecorations(decoRef.current, [
            {
              range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1000 },
              options: {
                isWholeLine: true,
                className: 'bg-accent-green/20 border-l-2 border-accent-green',
                marginClassName: 'bg-accent-green/20'
              }
            }
          ]);
        }
      }
    } else if (editorRef.current && !isExecutionMode) {
      // Clear decorations when exiting execution mode
      decoRef.current = editorRef.current.deltaDecorations(decoRef.current, []);
    }
  }, [currentIndex, snapshots, isExecutionMode]);

  const currentSnapshot = isExecutionMode ? snapshots[currentIndex] : null;

  let algoTitle = 'Pathfinding Engine';
  if (currentAlgorithmId === 'bfs') algoTitle = 'BFS Engine';
  if (currentAlgorithmId === 'a-star') algoTitle = 'A* Weighted Search';
  if (currentAlgorithmId === 'dijkstra') algoTitle = 'Dijkstra\'s Algorithm';

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#050505]">
      {/* Pathfinding Toolbar Overhaul */}
      <div className="flex items-center justify-between w-full px-4 py-2 bg-slate-900/50 border-b border-slate-800 overflow-hidden whitespace-nowrap shrink-0 z-20 shadow-xl flex-nowrap">
        
        {/* LEFT GROUP: Algorithm Identity */}
        <div className="flex items-center min-w-[150px]">
          <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/20">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-accent-green uppercase tracking-[0.2em]">{algoTitle}</span>
          </div>
        </div>

        {/* CENTER GROUP: Local Canvas States */}
        <div className="flex items-center gap-4">
          <SpeedController />
          <div className="h-6 w-[px] bg-white/10" />
          {!isExecutionMode && (
            <div className="flex bg-white/5 p-1 rounded-sm border border-white/5">
              <button 
                onClick={() => setDrawingMode('WALL')}
                className={`px-3 py-1 text-[9px] font-mono uppercase tracking-widest transition-all ${drawingMode === 'WALL' ? 'bg-accent-green text-black font-bold' : 'text-text-muted hover:text-white'}`}
              >
                Walls
              </button>
              <button 
                onClick={() => setDrawingMode('WEIGHT')}
                className={`px-3 py-1 text-[9px] font-mono uppercase tracking-widest transition-all ${drawingMode === 'WEIGHT' ? 'bg-purple-600 text-white font-bold' : 'text-text-muted hover:text-white'}`}
              >
                Weights
              </button>
            </div>
          )}
        </div>

        {/* RIGHT GROUP: Actions & Legend */}
        <div className="flex items-center gap-3">
          {/* 1. Primary Action */}
          {!isExecutionMode ? (
            <button 
              onClick={startExecution}
              className="flex items-center gap-2 px-4 py-1.5 rounded-sm bg-accent-green text-black font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-accent-green-hover transition-all shadow-[0_0_15px_rgba(74,222,128,0.2)]"
            >
              <Zap size={12} fill="currentColor" /> Initialize Visualization
            </button>
          ) : (
            <button 
              onClick={resetExecution}
              className="flex items-center gap-2 px-4 py-1.5 rounded-sm border border-rose-500/50 text-rose-500 hover:bg-rose-500/10 text-[10px] font-mono uppercase transition-colors"
            >
              <RotateCcw size={12} /> Exit Visualization
            </button>
          )}

          {/* 2. Secondary Actions */}
          {!isExecutionMode && (
            <>
              <button 
                onClick={user ? handleSaveMaze : () => setAuthModalOpen(true)}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-white/5 text-blue-400 hover:text-white hover:bg-blue-600/20 text-[10px] font-mono uppercase transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Cloud size={12} />}
                {user ? (isSaving ? 'Saving...' : 'Save to Cloud') : 'Sign in to Save'}
              </button>
              <button 
                onClick={generateMaze}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/50 text-[10px] font-mono uppercase transition-all"
              >
                <Grid3X3 size={12} /> Generate Maze
              </button>
            </>
          )}
          
          <button 
            onClick={resetBoard}
            disabled={isExecutionMode || isSaving}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-[10px] font-mono uppercase transition-all disabled:opacity-10"
          >
            <Trash2 size={12} /> Reset Board
          </button>

          {/* 3. Divider & Legend */}
          <div className="border-l border-slate-700 h-6 mx-2" />
          
          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.5)]"></div>
              <span>Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
              <span>Wall</span>
            </div>
            {['dijkstra', 'a-star'].includes(currentAlgorithmId) && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-purple-900 border border-purple-500/30 rounded-full"></div>
                <span>Weight</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Grid Canvas */}
        <div className={`transition-all duration-500 ease-in-out ${isExecutionMode ? 'flex-[0.6]' : 'flex-[1]'} border-r border-[#262626] relative bg-[#0a0a0a]`}>
          <GridCanvas executionSnapshot={currentSnapshot} />
          
          {!isExecutionMode && (
            <div className="absolute bottom-6 left-6 px-4 py-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm flex items-center gap-3">
               <Info size={14} className="text-accent-green" />
               <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                 <span className="text-accent-green">Sandbox Mode:</span> Drag nodes or draw walls to see <span className="text-white">Real-Time {algoTitle}</span>.
               </p>
            </div>
          )}
        </div>

        {/* RIGHT: Code Pane */}
        {isExecutionMode && (
          <div className="flex-[0.4] flex flex-col bg-bg-nav animate-in slide-in-from-right duration-500">
            <div className="flex-[0.6] border-b border-[#262626] flex flex-col">
              <div className="h-10 border-b border-[#262626] px-4 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Code2 size={14} className="text-accent-green" />
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest font-bold">{algoTitle} Source</span>
                </div>
                <span className="text-[10px] font-mono text-accent-green opacity-50">algorithm.js</span>
              </div>
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={activeAlgorithm?.code || "// Code not available"}
                  onMount={(editor) => {
                    editorRef.current = editor;
                    editor.updateOptions({
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      fontFamily: 'JetBrains Mono',
                      lineNumbers: 'on',
                      renderLineHighlight: 'all',
                      scrollBeyondLastLine: false,
                      backgroundColor: '#121212'
                    });
                  }}
                />
              </div>
            </div>

            <div className="flex-[0.4] flex flex-col bg-[#0d0d0d] p-8 overflow-y-auto no-scrollbar">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Terminal size={14} className="text-text-muted" />
                   <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] font-bold">Logic Walkthrough</h3>
                </div>
                <div className="px-2 py-0.5 rounded-full text-[8px] font-mono uppercase bg-accent-green/10 text-accent-green border border-accent-green/20">
                  Step {currentIndex + 1}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">
                  {currentSnapshot?.description || "INITIALIZING..."}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                  {currentSnapshot?.activeNode 
                    ? (currentAlgorithmId === 'a-star' 
                        ? `Evaluating node at [${currentSnapshot.activeNode.row}, ${currentSnapshot.activeNode.col}]. A* prioritizes this node due to its minimal f-score (g=${currentSnapshot.activeNode.g} + h=${currentSnapshot.activeNode.h}) and tie-breaking lower h-score.`
                        : `Currently examining node at [${currentSnapshot.activeNode.row}, ${currentSnapshot.activeNode.col}]. It has been popped from the queue to evaluate neighbors in a FIFO order.`)
                    : "Preparing the search frontier. The system is initializing node states and calculating heuristic distances."
                  }
                </p>
              </div>

              <div className="mt-8 flex gap-10 border-t border-white/5 pt-6">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1">Frontier</span>
                  <span className="text-2xl font-bold font-mono text-indigo-400">{currentSnapshot?.frontier?.length || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1">Visited</span>
                  <span className="text-2xl font-bold font-mono text-cyan-400">{currentSnapshot?.visited?.length || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1">Path Length</span>
                  <span className="text-2xl font-bold font-mono text-accent-green">{currentSnapshot?.path?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
